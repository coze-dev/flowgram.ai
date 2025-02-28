import { Skeleton } from '@douyinfe/semi-ui';

export const NodePlaceholder = () => (
  <div className="node-placeholder" data-testid="workflow.detail.node-panel.placeholder">
    <Skeleton
      className="node-placeholder-skeleton"
      loading={true}
      active={true}
      placeholder={
        <div className="">
          <div className="node-placeholder-hd">
            <Skeleton.Avatar shape="square" className="node-placeholder-avatar" />
            <Skeleton.Title style={{ width: 141 }} />
          </div>
          <div className="node-placeholder-content">
            <div className="node-placeholder-footer">
              <Skeleton.Title style={{ width: 85 }} />
              <Skeleton.Title style={{ width: 241 }} />
            </div>
            <Skeleton.Title style={{ width: 220 }} />
          </div>
        </div>
      }
    />
  </div>
);
