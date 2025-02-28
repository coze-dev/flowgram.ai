import type React from 'react';

import { nanoid } from 'nanoid';
import { inject, injectable, postConstruct } from 'inversify';
import {
  domUtils,
  type IPoint,
  PromiseDeferred,
  Emitter,
  DisposableCollection,
  Rectangle,
  delay,
  Disposable,
} from '@flowgram.ai/utils';
import type { PositionSchema } from '@flowgram.ai/utils';
import {
  FlowNodeTransformData,
  FlowOperationBaseService,
  type FlowNodeEntity,
} from '@flowgram.ai/document';
import { FlowNodeBaseType } from '@flowgram.ai/document';
import {
  CommandService,
  PlaygroundConfigEntity,
  PlaygroundDrag,
  type PlaygroundDragEvent,
  TransformData,
} from '@flowgram.ai/core';

import { WorkflowLinesManager } from '../workflow-lines-manager';
import { WorkflowDocumentOptions } from '../workflow-document-option';
import { WorkflowDocument } from '../workflow-document';
import { WorkflowCommands } from '../workflow-commands';
import { type WorkflowNodeJSON, type WorkflowNodeMeta } from '../typings';
import { WorkflowNodePortsData } from '../entity-datas';
import {
  type WorkflowLineEntity,
  type WorkflowLinePortInfo,
  type WorkflowNodeEntity,
  type WorkflowPortEntity,
} from '../entities';
import { WorkflowSelectService } from './workflow-select-service';
import { WorkflowHoverService } from './workflow-hover-service';

const DRAG_TIMEOUT = 100;
const DRAG_MIN_DELTA = 5;
function checkDragSuccess(
  time: number,
  e: PlaygroundDragEvent,
  originLine?: WorkflowLineEntity
): boolean {
  if (
    !originLine ||
    time > DRAG_TIMEOUT ||
    Math.abs(e.endPos.x - e.startPos.x) >= DRAG_MIN_DELTA ||
    Math.abs(e.endPos.y - e.startPos.y) >= DRAG_MIN_DELTA
  ) {
    return true;
  }
  return false;
}

interface LineEventProps {
  type: 'onDrag' | 'onDragEnd';
  onDragNodeId?: string;
  event?: MouseEvent;
}

interface INodesDragEvent {
  type: string;
  nodes: FlowNodeEntity[];
  startPositions: IPoint[];
  altKey: boolean;
}

export interface NodesDragEndEvent extends INodesDragEvent {
  type: 'onDragEnd';
}

export type NodesDragEvent = NodesDragEndEvent;

export type onDragLineEndParams = {
  fromPort: WorkflowPortEntity;
  toPort?: WorkflowPortEntity;
  mousePos: PositionSchema;
  line?: WorkflowLineEntity;
  originLine?: WorkflowLineEntity;
  event: PlaygroundDragEvent;
};

export type OnDragLineEnd = (params: onDragLineEndParams) => Promise<void>;

@injectable()
export class WorkflowDragService {
  @inject(PlaygroundConfigEntity)
  protected playgroundConfig: PlaygroundConfigEntity;

  @inject(WorkflowHoverService) protected hoverService: WorkflowHoverService;

  @inject(WorkflowDocument) protected document: WorkflowDocument;

  @inject(WorkflowLinesManager) protected linesManager: WorkflowLinesManager;

  @inject(CommandService) protected commandService: CommandService;

  @inject(WorkflowSelectService) protected selectService: WorkflowSelectService;

  @inject(FlowOperationBaseService)
  protected operationService: FlowOperationBaseService;

  @inject(WorkflowDocumentOptions)
  readonly options: WorkflowDocumentOptions;

  private _onDragLineEventEmitter = new Emitter<LineEventProps>();

  readonly onDragLineEventChange = this._onDragLineEventEmitter.event;

  isDragging = false;

  private _nodesDragEmitter = new Emitter<NodesDragEvent>();

  readonly onNodesDrag = this._nodesDragEmitter.event;

  protected _toDispose = new DisposableCollection();

  private _droppableTransforms: FlowNodeTransformData[] = [];

  private _dropNode?: FlowNodeEntity;

  private posAdjusters: Set<
    (params: { selectedNodes: WorkflowNodeEntity[]; position: IPoint }) => IPoint
  > = new Set();

  private _onDragLineEndCallbacks: Map<string, OnDragLineEnd> = new Map();

  @postConstruct()
  init() {
    this._toDispose.pushAll([this._onDragLineEventEmitter, this._nodesDragEmitter]);
    if (this.options.onDragLineEnd) {
      this._toDispose.push(this.onDragLineEnd(this.options.onDragLineEnd));
    }
  }

  dispose() {
    this._toDispose.dispose();
  }

  /**
   * 拖拽选中节点
   * @param event
   */
  startDragSelectedNodes(event: MouseEvent | React.MouseEvent): Promise<boolean> {
    let { selectedNodes } = this.selectService;
    if (
      selectedNodes.length === 0 ||
      this.playgroundConfig.readonly ||
      this.playgroundConfig.disabled
    ) {
      return Promise.resolve(false);
    }
    const sameParent = this.childrenOfContainer(selectedNodes);
    if (sameParent && sameParent.flowNodeType !== FlowNodeBaseType.ROOT) {
      selectedNodes = [sameParent];
    }
    const { altKey } = event;
    // 节点整体开始位置
    let startPosition = this.getNodesPosition(selectedNodes);
    // 单个节点开始位置
    let startPositions = selectedNodes.map((node) => {
      const transform = node.getData(TransformData);
      return { x: transform.position.x, y: transform.position.y };
    });
    let dragSuccess = false;
    const startTime = Date.now();
    const dragger = new PlaygroundDrag({
      onDragStart: () => {
        this.isDragging = true;
      },
      onDrag: (e) => {
        if (!dragSuccess && checkDragSuccess(Date.now() - startTime, e)) {
          dragSuccess = true;
          if (altKey) {
            // 按住 alt 为复制
            const tryCopyNodes = selectedNodes;
            if (tryCopyNodes.length > 0) {
              this.selectService.clear();
              this.commandService
                .executeCommand(WorkflowCommands.PASTE_NODES, tryCopyNodes, true)
                .then((newNodes) => {
                  if (newNodes && Array.isArray(newNodes) && newNodes.length > 0) {
                    selectedNodes = newNodes as WorkflowNodeEntity[];
                    startPosition = this.getNodesPosition(tryCopyNodes);
                    startPositions = tryCopyNodes
                      .filter((n) => !n.getNodeMeta<WorkflowNodeMeta>().copyDisable)
                      .map((node) => {
                        const transform = node.getData(TransformData);
                        return {
                          x: transform.position.x,
                          y: transform.position.y,
                        };
                      });
                  }
                });
            }
          }
        }

        // 计算拖拽偏移量
        const offset: IPoint = this.getDragPosOffset({
          event: e,
          selectedNodes,
          startPosition,
        });

        selectedNodes.forEach((node, index) => {
          const transform = node.getData(TransformData);
          const nodeStartPosition = startPositions[index];
          const newPosition = {
            x: nodeStartPosition.x + offset.x,
            y: nodeStartPosition.y + offset.y,
          };
          if (node.collapsedChildren?.length > 0) {
            // 嵌套情况下需将子节点 transform 设为 dirty
            node.collapsedChildren.forEach((childNode) => {
              const childNodeTransformData =
                childNode.getData<FlowNodeTransformData>(FlowNodeTransformData);
              childNodeTransformData.fireChange();
            });
          }
          transform.update({
            position: newPosition,
          });
        });
      },
      onDragEnd: () => {
        this.isDragging = false;
        this._nodesDragEmitter.fire({
          type: 'onDragEnd',
          nodes: selectedNodes,
          startPositions,
          altKey,
        });
      },
    });
    return dragger
      .start(event.clientX, event.clientY, this.playgroundConfig)
      .then(() => dragSuccess);
  }

  /**
   * 通过拖入卡片添加
   * @param type
   * @param event
   * @param data 节点数据
   */
  async dropCard(
    type: string,
    event: { clientX: number; clientY: number },
    data?: Partial<WorkflowNodeJSON>,
    parent?: WorkflowNodeEntity
  ): Promise<WorkflowNodeEntity | undefined> {
    const mousePos = this.playgroundConfig.getPosFromMouseEvent(event);
    if (!this.playgroundConfig.getViewport().contains(mousePos.x, mousePos.y)) {
      // 鼠标范围不在画布之内
      return;
    }
    const position = this.adjustSubNodePosition(type, parent, mousePos);

    const node: WorkflowNodeEntity = await this.document.createWorkflowNodeByType(
      type,
      position,
      data,
      parent?.id
    );
    return node;
  }

  /**
   * 拖拽卡片到画布
   * 返回创建结果
   * @param type
   * @param event
   */
  async startDragCard(
    type: string,
    event: React.MouseEvent,
    data: Partial<WorkflowNodeJSON>,
    cloneNode?: (e: PlaygroundDragEvent) => HTMLDivElement // 创建拖拽的dom
  ): Promise<WorkflowNodeEntity | undefined> {
    let domNode: HTMLDivElement;
    let startPos: IPoint = { x: 0, y: 0 };
    const deferred = new PromiseDeferred<WorkflowNodeEntity | undefined>();
    const dragger = new PlaygroundDrag({
      onDragStart: (e) => {
        const targetNode = event.currentTarget as HTMLDivElement;
        domNode = cloneNode ? cloneNode(e) : (targetNode.cloneNode(true) as HTMLDivElement);
        const bounds = targetNode.getBoundingClientRect();
        startPos = { x: bounds.left, y: bounds.top };
        domUtils.setStyle(domNode, {
          zIndex: 1000,
          position: 'absolute',
          left: startPos.x,
          top: startPos.y,
          boxShadow: '0 6px 8px 0 rgba(28, 31, 35, .2)',
        });
        document.body.appendChild(domNode);
        this.updateDroppableTransforms();
      },
      onDrag: (e) => {
        const deltaX = e.endPos.x - e.startPos.x;
        const deltaY = e.endPos.y - e.startPos.y;
        const left = startPos.x + deltaX;
        const right = startPos.y + deltaY;
        domNode.style.left = `${left}px`;
        domNode.style.top = `${right}px`;
        // 节点类型拖拽碰撞检测
        const { x, y } = this.playgroundConfig.getPosFromMouseEvent(e);
        const draggingRect = new Rectangle(x, y, 170, 90);
        const collisionTransform = this._droppableTransforms.find((transform) => {
          const { bounds, entity } = transform;
          const padding = this.document.layout.getPadding(entity);
          const transformRect = new Rectangle(
            bounds.x + padding.left + padding.right,
            bounds.y,
            bounds.width,
            bounds.height
          );
          // 检测两个正方形是否相互碰撞
          return Rectangle.intersects(draggingRect, transformRect);
        });
        this.updateDropNode(collisionTransform?.entity);
      },
      onDragEnd: async (e) => {
        const dropNode = this._dropNode;
        const dragNode = await this.dropCard(type, e, data, dropNode);
        this.clearDrop();
        if (dragNode) {
          domNode.remove();
          deferred.resolve(dragNode);
        } else {
          domNode.style.transition = 'all ease .2s';
          domNode.style.left = `${startPos.x}px`;
          domNode.style.top = `${startPos.y}px`;
          const TIMEOUT = 200;
          await delay(TIMEOUT);
          domNode.remove();
          deferred.resolve();
        }
      },
    });
    await dragger.start(event.clientX, event.clientY);
    return deferred.promise;
  }

  /**
   * 如果存在容器节点，且传入鼠标坐标，需要用容器的坐标减去传入的鼠标坐标
   */
  public adjustSubNodePosition(
    subNodeType?: string,
    containerNode?: WorkflowNodeEntity,
    mousePos?: IPoint,
    resetEmptyPos: boolean = true
  ): IPoint {
    if (!mousePos) {
      return { x: 0, y: 0 };
    }
    if (!subNodeType || !containerNode || containerNode.flowNodeType === FlowNodeBaseType.ROOT) {
      return mousePos;
    }
    const isParentEmpty = !containerNode.children || containerNode.children.length === 0;
    const parentPadding = this.document.layout.getPadding(containerNode);
    const parentTransform = containerNode.getData<TransformData>(TransformData);
    if (isParentEmpty && resetEmptyPos) {
      // 确保空容器节点不偏移
      return {
        x: 0,
        y: parentPadding.top,
      };
    } else {
      return {
        x: mousePos.x - parentTransform.position.x,
        y: mousePos.y - parentTransform.position.y,
      };
    }
  }

  /**
   * 注册位置调整
   */
  public registerPosAdjuster(
    adjuster: (params: { selectedNodes: WorkflowNodeEntity[]; position: IPoint }) => IPoint
  ) {
    this.posAdjusters.add(adjuster);
    return {
      dispose: () => this.posAdjusters.delete(adjuster),
    };
  }

  /**
   * 获取拖拽偏移
   */
  private getDragPosOffset(params: {
    event: PlaygroundDragEvent;
    selectedNodes: WorkflowNodeEntity[];
    startPosition: IPoint;
  }) {
    const { event, selectedNodes, startPosition } = params;
    const { finalScale } = this.playgroundConfig;
    const mouseOffset: IPoint = {
      x: (event.endPos.x - event.startPos.x) / finalScale,
      y: (event.endPos.y - event.startPos.y) / finalScale,
    };
    const wholePosition: IPoint = {
      x: startPosition.x + mouseOffset.x,
      y: startPosition.y + mouseOffset.y,
    };
    const adjustedOffsets: IPoint[] = Array.from(this.posAdjusters.values()).map((adjuster) =>
      adjuster({
        selectedNodes,
        position: wholePosition,
      })
    );
    const offset: IPoint = adjustedOffsets.reduce(
      (offset, adjustOffset) => ({
        x: offset.x + adjustOffset.x,
        y: offset.y + adjustOffset.y,
      }),
      mouseOffset
    );
    return offset;
  }

  private updateDroppableTransforms() {
    this._droppableTransforms = this.document
      .getRenderDatas(FlowNodeTransformData, false)
      .filter((transform) => {
        const { entity } = transform;
        if (entity.originParent) {
          return this.nodeSelectable(entity) && this.nodeSelectable(entity.originParent);
        }
        return this.nodeSelectable(entity);
      })
      .filter((transform) => {
        const { entity } = transform;
        return entity.flowNodeType === FlowNodeBaseType.SUB_CANVAS;
      });
  }

  /**
   * 获取节点整体位置
   */
  private getNodesPosition(nodes: WorkflowNodeEntity[]): IPoint {
    const selectedBounds = Rectangle.enlarge(
      nodes.map((n) => n.getData(FlowNodeTransformData)!.bounds)
    );
    const position: IPoint = {
      x: selectedBounds.x,
      y: selectedBounds.y,
    };
    return position;
  }

  private nodeSelectable(node: FlowNodeEntity) {
    const selectable = node.getNodeMeta().selectable;
    if (typeof selectable === 'function') {
      return selectable(node);
    } else {
      return selectable;
    }
  }

  private updateDropNode(node?: FlowNodeEntity) {
    if (this._dropNode) {
      if (this._dropNode.id === node?.id) {
        return;
      }
      this.selectService.clear();
    }
    if (node) {
      this.selectService.selectNode(node);
    }
    this._dropNode = node;
  }

  private clearDrop() {
    if (this._dropNode) {
      this.selectService.clear();
    }
    this._dropNode = undefined;
    this._droppableTransforms = [];
  }

  private setLineColor(line: WorkflowLineEntity, color: string) {
    line.highlightColor = color;
    this.hoverService.clearHovered();
  }

  private handleDragOnNode(
    toNode: WorkflowNodeEntity,
    fromPort: WorkflowPortEntity,
    line: WorkflowLineEntity,
    toPort?: WorkflowPortEntity,
    originLine?: WorkflowLineEntity
  ): {
    hasError: boolean;
  } {
    if (
      toPort &&
      (originLine?.toPort === toPort ||
        (toPort.portType === 'input' && this.linesManager.canAddLine(fromPort, toPort, true)))
    ) {
      // 同一条线条则不用在判断 canAddLine
      this.hoverService.updateHoveredKey(toPort.id);
      line.setToPort(toPort);
      this._onDragLineEventEmitter.fire({
        type: 'onDrag',
        onDragNodeId: toNode.id,
      });
      return {
        hasError: false,
      };
    } else if (toNode.flowNodeType === FlowNodeBaseType.SUB_CANVAS) {
      // 在子画布内进行连线的情况，需忽略
      return {
        hasError: false,
      };
    } else {
      this.setLineColor(line, this.linesManager.lineColor.error);
      return {
        hasError: true,
      };
    }
  }

  private childrenOfContainer(nodes: WorkflowNodeEntity[]): WorkflowNodeEntity | undefined {
    if (nodes.length === 0) {
      return;
    }
    const sourceContainer = nodes[0]?.parent;
    if (!sourceContainer || sourceContainer.collapsedChildren.length !== nodes.length) {
      return;
    }
    const valid = nodes.every((node) => node?.parent === sourceContainer);
    if (!valid) {
      return;
    }
    return sourceContainer;
  }

  /**
   * 绘制线条
   * @param opts
   * @param event
   */
  async startDrawingLine(
    fromPort: WorkflowPortEntity,
    event: { clientX: number; clientY: number },
    originLine?: WorkflowLineEntity
  ): Promise<{
    dragSuccess?: boolean; // 是否拖拽成功，不成功则为选择节点
    newLine?: WorkflowLineEntity; // 新的线条
  }> {
    const isFromInActivePort = !originLine && fromPort.isErrorPort() && fromPort.disabled;
    if (
      originLine?.disabled ||
      isFromInActivePort ||
      this.playgroundConfig.readonly ||
      this.playgroundConfig.disabled
    ) {
      return { dragSuccess: false, newLine: undefined };
    }

    const config = this.playgroundConfig;
    const deferred = new PromiseDeferred<{
      dragSuccess?: boolean;
      newLine?: WorkflowLineEntity; // 新的线条
    }>();
    const preCursor = config.cursor;
    let line: WorkflowLineEntity | undefined,
      toPort: WorkflowPortEntity | undefined,
      toNode: WorkflowNodeEntity | undefined,
      lineErrorReset = false;
    const startTime = Date.now();
    let dragSuccess = false;
    const dragger = new PlaygroundDrag({
      onDrag: (e) => {
        if (!line && checkDragSuccess(Date.now() - startTime, e, originLine)) {
          // 隐藏原来的线条
          if (originLine) {
            originLine.highlightColor = this.linesManager.lineColor.hidden;
          }
          dragSuccess = true;
          // 创建临时的线条
          line = this.linesManager.createLine({
            from: fromPort.node.id,
            fromPort: fromPort.portID,
            drawingTo: config.getPosFromMouseEvent(event),
          });
          if (!line) {
            return;
          }
          config.updateCursor('grab');
          line.highlightColor = this.linesManager.lineColor.drawing;
          this.hoverService.updateHoveredKey('');
        }
        if (!line) {
          return;
        }

        lineErrorReset = false;

        const dragPos = config.getPosFromMouseEvent(e);

        // 默认 toNode 获取
        toNode = this.linesManager.getNodeFromMousePos(dragPos);
        // 默认 toPort 获取
        toPort = this.linesManager.getPortFromMousePos(dragPos);

        if (!toPort) {
          line.setToPort(undefined);
        } else if (!this.linesManager.canAddLine(fromPort, toPort, true)) {
          line.highlightColor = this.linesManager.lineColor.error;
          lineErrorReset = true;
          line.setToPort(undefined);
        } else {
          line.setToPort(toPort);
        }

        this._onDragLineEventEmitter.fire({
          type: 'onDrag',
        });

        this.setLineColor(line, this.linesManager.lineColor.drawing);
        if (toNode && toNode.flowNodeType !== FlowNodeBaseType.SUB_CANVAS) {
          // 如果鼠标 hover 在 node 中的时候，默认连线到这个 node 的初始位置
          const portsData = toNode.getData(WorkflowNodePortsData)!;
          toPort = portsData.inputPorts[0];
          const { hasError } = this.handleDragOnNode(toNode, fromPort, line, toPort, originLine);
          lineErrorReset = hasError;
        }

        if (line.toPort) {
          line.drawingTo = { x: line.toPort.point.x, y: line.toPort.point.y };
        } else {
          line.drawingTo = { x: dragPos.x, y: dragPos.y };
        }

        // 触发原 toPort 的校验
        originLine?.validate();
        line.validate();
      },
      // eslint-disable-next-line complexity
      onDragEnd: async (e) => {
        const dragPos = config.getPosFromMouseEvent(e);
        const onDragLineEndCallbacks = Array.from(this._onDragLineEndCallbacks.values());
        config.updateCursor(preCursor);
        await Promise.all(
          onDragLineEndCallbacks.map((callback) =>
            callback({
              fromPort,
              toPort,
              mousePos: dragPos,
              line,
              originLine,
              event: e,
            })
          )
        );
        line?.dispose();
        this._onDragLineEventEmitter.fire({
          type: 'onDragEnd',
        });
        // 清除选中状态
        if (originLine) {
          originLine.highlightColor = '';
        }
        const end = () => {
          originLine?.validate();
          deferred.resolve({ dragSuccess });
        };
        if (dragSuccess) {
          // Step 1: check same line
          if (originLine && originLine.toPort === toPort) {
            // 线条没变化则直接返回，不做处理
            return end();
          }
          // 非 input 节点不能连接
          if (toPort && toPort.portType !== 'input') {
            return end();
          }
          const newLineInfo: Required<WorkflowLinePortInfo> | undefined = toPort
            ? {
                from: fromPort.node.id,
                fromPort: fromPort.portID,
                to: toPort.node.id,
                toPort: toPort.portID,
              }
            : undefined;
          // Step2: 检测 reset
          const isReset = originLine && toPort;
          if (
            isReset &&
            !this.linesManager.canReset(
              originLine.fromPort,
              originLine.toPort as WorkflowPortEntity,
              toPort as WorkflowPortEntity
            )
          ) {
            return end();
          }
          // Step 3: delete line
          if (
            originLine &&
            (!this.linesManager.canRemove(originLine, newLineInfo, false) || lineErrorReset)
          ) {
            // 线条无法删除则返回，不再触发 canAddLine
            return end();
          } else {
            originLine?.dispose();
          }
          //  Step 4:  add line
          if (!toPort || !this.linesManager.canAddLine(fromPort, toPort, false)) {
            // 无法添加成功
            return end();
          }
          const newLine = this.linesManager.createLine(newLineInfo as WorkflowLinePortInfo);
          if (!newLine) {
            end();
          }
          deferred.resolve({
            dragSuccess,
            newLine,
          });
        } else {
          end();
        }
      },
    });
    await dragger.start(event.clientX, event.clientY, config);
    return deferred.promise;
  }

  /**
   * 重新连接线条
   * @param line
   * @param e
   */
  async resetLine(line: WorkflowLineEntity, e: MouseEvent): Promise<void> {
    const { fromPort } = line;
    const { dragSuccess } = await this.startDrawingLine(fromPort, e, line);
    if (!dragSuccess) {
      // 没有拖拽成功则表示为选中节点
      this.selectService.select(line);
    }
  }

  /** 线条拖拽结束 */
  public onDragLineEnd(callback: OnDragLineEnd): Disposable {
    const id = nanoid();
    this._onDragLineEndCallbacks.set(id, callback);
    return {
      dispose: () => {
        this._onDragLineEndCallbacks.delete(id);
      },
    };
  }
}
