"use strict";(self.webpackChunk_flowgram_ai_docs=self.webpackChunk_flowgram_ai_docs||[]).push([["221113"],{647605:function(e,n,r){r.r(n),r.d(n,{default:function(){return a}});var o=r(110239),s=r(444827);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",pre:"pre",code:"code",h2:"h2",h3:"h3",ul:"ul",li:"li"},(0,s.ah)(),e.components);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.h1,{id:"playground",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#playground",children:"#"}),"Playground"]}),"\n",(0,o.jsx)(n.p,{children:"画布实例"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/core/classes/Playground.html",rel:"noopener noreferrer",target:"_blank",children:"> API Detail"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"const ctx = useClientContext()\n\nconsole.log(ctx.playground)\n\n"})}),"\n",(0,o.jsxs)(n.h2,{id:"config",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#config",children:"#"}),"config"]}),"\n",(0,o.jsx)(n.p,{children:"画布配置, 提供 zoom、scroll 等状态"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/core/classes/PlaygroundConfigEntity.html",rel:"noopener noreferrer",target:"_blank",children:"> API Detail"})}),"\n",(0,o.jsxs)(n.h3,{id:"properties",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#properties",children:"#"}),"Properties"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["zoom ",(0,o.jsx)(n.code,{children:"number"})," 当前缩放比例"]}),"\n",(0,o.jsxs)(n.li,{children:["scrollData ",(0,o.jsx)(n.code,{children:"{ scrollX: number, scrollY: number }"})," 当前滚动位置"]}),"\n",(0,o.jsx)(n.li,{children:"readonlyOrDisabled 画布是否为 readonly 或 disabled 状态"}),"\n",(0,o.jsx)(n.li,{children:"readonly"}),"\n",(0,o.jsx)(n.li,{children:"disabled"}),"\n"]}),"\n",(0,o.jsxs)(n.h3,{id:"fitview",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#fitview",children:"#"}),"fitView"]}),"\n",(0,o.jsx)(n.p,{children:"节点适应画布窗口, 需要传入节点的 bounds"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"/**\n * 适应大小\n * @param bounds {Rectangle} 目标大小\n * @param easing {number} 是否开启动画，默认开启\n * @param padding {number} 边界空白\n */\nctx.playground.config.fitView(ctx.document.root.bounds, true, 10)\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"scrolltoview",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#scrolltoview",children:"#"}),"scrollToView"]}),"\n",(0,o.jsxs)(n.p,{children:["指定节点位置并滚动到画布可见区域, 如果位置已经在可见区域则不会滚动，除非加上 ",(0,o.jsx)(n.code,{children:"scrollToCenter"})," 强制滚动"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"\n/**\n * 详细参数说明\n * @param opts {PlaygroundConfigRevealOpts}\n**/\ninterface PlaygroundConfigRevealOpts {\n  entities?: Entity[]\n  position?: PositionSchema // 滚动到指定位置，并居中\n  bounds?: Rectangle // 滚动的 bounds\n  scrollDelta?: PositionSchema\n  zoom?: number // 需要缩放的比例\n  easing?: boolean // 是否开启缓动，默认开启\n  easingDuration?: number // 默认 500 ms\n  scrollToCenter?: boolean // 是否强制滚动到中心\n}\n\nctx.playground.config.scrollToView({\n  bounds: ctx.document.getNode('start').bounds,\n})\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"zoomin",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#zoomin",children:"#"}),"zoomin"]}),"\n",(0,o.jsx)(n.p,{children:"放大画布"}),"\n",(0,o.jsxs)(n.h3,{id:"zoomout",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#zoomout",children:"#"}),"zoomout"]}),"\n",(0,o.jsx)(n.p,{children:"缩小画布"}),"\n",(0,o.jsxs)(n.h3,{id:"getposefrommouseevent",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getposefrommouseevent",children:"#"}),"getPoseFromMouseEvent"]}),"\n",(0,o.jsx)(n.p,{children:"将浏览器鼠标位置转成画布坐标系"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"\nconst pos: { x: number, y: number } = ctx.playground.config.getPoseFromMouseEvent(domMouseEvent)\n\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"scroll",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#scroll",children:"#"}),"scroll"]}),"\n",(0,o.jsx)(n.p,{children:"滚动画布, 需要传入滚动位置, 以及是否平滑滚动, 滚动时间"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"ctx.playground.config.scroll({ scrollX: 100, scrollY: 100 }, true, 300)\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"getviewport",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getviewport",children:"#"}),"getViewport"]}),"\n",(0,o.jsx)(n.p,{children:"获取当前画布的视窗大小"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"const viewport = ctx.playground.config.getViewport()\n"})})]})}function l(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,o.jsx)(n,Object.assign({},e,{children:(0,o.jsx)(i,e)})):i(e)}let a=l;l.__RSPRESS_PAGE_META={},l.__RSPRESS_PAGE_META["zh%2Fapi%2Fcore%2Fplayground.mdx"]={toc:[{id:"config",text:"config",depth:2},{id:"properties",text:"Properties",depth:3},{id:"fitview",text:"fitView",depth:3},{id:"scrolltoview",text:"scrollToView",depth:3},{id:"zoomin",text:"zoomin",depth:3},{id:"zoomout",text:"zoomout",depth:3},{id:"getposefrommouseevent",text:"getPoseFromMouseEvent",depth:3},{id:"scroll",text:"scroll",depth:3},{id:"getviewport",text:"getViewport",depth:3}],title:"Playground",frontmatter:{}}}}]);