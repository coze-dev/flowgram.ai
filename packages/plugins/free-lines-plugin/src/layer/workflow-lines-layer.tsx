import ReactDOM from 'react-dom';
import React, { ReactNode, useLayoutEffect, useState } from 'react';

import { inject, injectable } from 'inversify';
import { domUtils } from '@flowgram.ai/utils';
import { StackingContextManager } from '@flowgram.ai/free-stack-plugin';
import {
  nanoid,
  WorkflowDocument,
  WorkflowHoverService,
  WorkflowLineEntity,
  WorkflowLineRenderData,
  WorkflowNodeEntity,
  WorkflowPortEntity,
  WorkflowSelectService,
} from '@flowgram.ai/free-layout-core';
import { Layer, observeEntities, observeEntityDatas, TransformData } from '@flowgram.ai/core';

import { LineRenderProps, LinesLayerOptions } from '../type';
import { WorkflowLineRender } from '../components';

@injectable()
export class WorkflowLinesLayer extends Layer<LinesLayerOptions> {
  static type = 'WorkflowLinesLayer';

  @inject(WorkflowHoverService) hoverService: WorkflowHoverService;

  @inject(WorkflowSelectService) selectService: WorkflowSelectService;

  @inject(StackingContextManager) stackContext: StackingContextManager;

  @observeEntities(WorkflowLineEntity) readonly lines: WorkflowLineEntity[];

  @observeEntities(WorkflowPortEntity) readonly ports: WorkflowPortEntity[];

  @observeEntityDatas(WorkflowNodeEntity, TransformData)
  readonly trans: TransformData[];

  @inject(WorkflowDocument) protected workflowDocument: WorkflowDocument;

  private layerID = nanoid();

  private mountedLines: Map<
    string,
    {
      line: WorkflowLineEntity;
      portal: ReactNode;
      version: string;
    }
  > = new Map();

  private _version = 0;

  /**
   * 节点线条
   */
  public node = domUtils.createDivWithClass('gedit-playground-layer gedit-flow-lines-layer');

  public onZoom(scale: number): void {
    this.node.style.transform = `scale(${scale})`;
  }

  public onReady() {
    this.pipelineNode.appendChild(this.node);
    this.toDispose.pushAll([
      this.selectService.onSelectionChanged(() => this.render()),
      this.hoverService.onHoveredChange(() => this.render()),
      this.workflowDocument.linesManager.onForceUpdate(() => {
        this.mountedLines.clear();
        this.bumpVersion();
        this.render();
      }),
    ]);
  }

  public dispose() {
    this.mountedLines.clear();
  }

  public render(): JSX.Element {
    const [, forceUpdate] = useState({});

    useLayoutEffect(() => {
      const updateLines = (): void => {
        let needsUpdate = false;

        // 批量处理所有线条的更新
        this.lines.forEach((line) => {
          const renderData = line.getData(WorkflowLineRenderData);
          const oldVersion = renderData.renderVersion;
          renderData.update();
          // 如果有任何一条线发生变化，标记需要更新
          if (renderData.renderVersion !== oldVersion) {
            needsUpdate = true;
          }
        });

        // 只在确实需要更新时触发重渲染
        if (needsUpdate) {
          forceUpdate({});
        }
      };

      const rafId = requestAnimationFrame(updateLines);
      return () => cancelAnimationFrame(rafId);
    }, [this.lines]); // 依赖项包含 lines

    const lines = this.lines.map((line) => this.renderLine(line));
    return <>{lines}</>;
  }

  // 用来绕过 memo
  private bumpVersion() {
    this._version = this._version + 1;
    if (this._version === Number.MAX_SAFE_INTEGER) {
      this._version = 0;
    }
  }

  private lineProps(line: WorkflowLineEntity): LineRenderProps {
    const renderData = line.getData(WorkflowLineRenderData);
    const { renderVersion } = renderData;
    const { lineType } = this.workflowDocument.linesManager;
    const selected = this.selectService.isSelected(line.id);
    const { version: lineVersion, color } = line;

    const version = `${this._version}:${lineVersion}:${renderVersion}:${color}:${selected}`;
    return {
      key: line.id,
      color: line.color,
      selected,
      line,
      lineType,
      version,
      strokePrefix: this.layerID,
    };
  }

  private lineComponent(props: LineRenderProps): ReactNode {
    const RenderInsideLine = this.options.renderInsideLine ?? (() => <></>);
    return (
      <WorkflowLineRender {...props}>
        <RenderInsideLine {...props} />
      </WorkflowLineRender>
    );
  }

  private renderLine(line: WorkflowLineEntity): ReactNode {
    const lineProps = this.lineProps(line);
    const cache = this.mountedLines.get(line.id);
    const isCached = cache !== undefined;
    const { portal: cachedPortal, version: cachedVersion } = cache ?? {};
    if (isCached && cachedVersion === lineProps.version) {
      // 如果已有缓存且版本相同，则直接返回缓存的 portal
      return cachedPortal;
    }
    if (!isCached) {
      // 如果缓存不存在，则将 line 挂载到 renderElement 上
      this.renderElement.appendChild(line.node);
      line.onDispose(() => {
        this.mountedLines.delete(line.id);
        line.node.remove();
      });
    }
    // 刷新缓存
    const portal = ReactDOM.createPortal(this.lineComponent(lineProps), line.node);
    this.mountedLines.set(line.id, { line, portal, version: lineProps.version });
    return portal;
  }

  private get renderElement(): HTMLElement {
    return this.stackContext.node;
  }
}
