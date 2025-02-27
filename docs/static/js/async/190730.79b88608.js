"use strict";(self.webpackChunk_flowgram_ai_docs=self.webpackChunk_flowgram_ai_docs||[]).push([["190730"],{286123:function(e,n,r){r.r(n),r.d(n,{default:function(){return a}});var o=r(110239),d=r(444827);function s(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",ul:"ul",li:"li",pre:"pre",code:"code"},(0,d.ah)(),e.components);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.h1,{id:"usenoderender",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#usenoderender",children:"#"}),"useNodeRender"]}),"\n",(0,o.jsxs)(n.p,{children:["提供节点渲染相关的方法, 返回结果的 form 等价于 ",(0,o.jsx)(n.a,{href:"/api/utils/get-node-form.html",children:"getNodeForm"})]}),"\n",(0,o.jsxs)(n.h2,{id:"固定布局",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#固定布局",children:"#"}),"固定布局"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Return: ",(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/fixed-layout-editor/interfaces/NodeRenderReturnType.html",rel:"noopener noreferrer",target:"_blank",children:"NodeRenderReturnType"})]}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",meta:"pure",children:"\nimport { FlowNodeEntity, useNodeRender } from '@flowgram.ai/fixed-layout-editor';\n\nexport const BaseNode = ({ node }: { node: FlowNodeEntity }) => {\n  /**\n   * 提供节点渲染相关的方法\n   */\n  const nodeRender = useNodeRender();\n  /**\n   * 只有在节点引擎开启时候才能使用表单\n   */\n  const form = nodeRender.form;\n\n  return (\n    <div\n      className=\"demo-fixed-node\"\n      /*\n       * onMouseEnter 加到固定布局节点主要是为了监听 分支线条的 hover 高亮\n       **/\n      onMouseEnter={nodeRender.onMouseEnter}\n      onMouseLeave={nodeRender.onMouseLeave}\n      onMouseDown={e => {\n        // trigger drag node\n        nodeRender.startDrag(e);\n        e.stopPropagation();\n      }}\n      style={{\n        /**\n         * 用于精确控制分支节点的样式\n         * isBlockIcon: 整个 condition 分支的 头部节点\n         * isBlockOrderIcon: 分支的第一个节点\n         */\n        ...(nodeRender.isBlockOrderIcon || nodeRender.isBlockIcon ? { width: 260 } : {}),\n      }}\n    >\n      {form?.render()}\n    </div>\n  );\n};\n\n"})}),"\n",(0,o.jsxs)(n.h2,{id:"自由布局",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#自由布局",children:"#"}),"自由布局"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Return: ",(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/free-layout-core/interfaces/NodeRenderReturnType.html",rel:"noopener noreferrer",target:"_blank",children:"NodeRenderReturnType"})]}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",meta:"pure",children:"import { WorkflowNodeRenderer, useNodeRender } from '@flowgram.ai/free-layout-editor';\nexport const BaseNode = () => {\n  const { form, node } = useNodeRender()\n  return (\n    <WorkflowNodeRenderer className=\"demo-free-node\" node={node}>\n      {form?.render()}\n    </WorkflowNodeRenderer>\n  )\n}\n\n"})})]})}function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,d.ah)(),e.components);return n?(0,o.jsx)(n,Object.assign({},e,{children:(0,o.jsx)(s,e)})):s(e)}let a=t;t.__RSPRESS_PAGE_META={},t.__RSPRESS_PAGE_META["zh%2Fapi%2Fhooks%2Fuse-node-render.mdx"]={toc:[{id:"固定布局",text:"固定布局",depth:2},{id:"自由布局",text:"自由布局",depth:2}],title:"useNodeRender",frontmatter:{}}}}]);