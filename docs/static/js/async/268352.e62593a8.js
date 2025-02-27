"use strict";(self.webpackChunk_flowgram_ai_docs=self.webpackChunk_flowgram_ai_docs||[]).push([["268352"],{608290:function(e,n,r){r.r(n),r.d(n,{default:function(){return a}});var o=r(110239),s=r(444827);function t(e){let n=Object.assign({h1:"h1",a:"a",p:"p",pre:"pre",code:"code",h2:"h2",h3:"h3",ul:"ul",li:"li"},(0,s.ah)(),e.components);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(n.h1,{id:"playground",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#playground",children:"#"}),"Playground"]}),"\n",(0,o.jsx)(n.p,{children:"Canvas instance"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/core/classes/Playground.html",rel:"noopener noreferrer",target:"_blank",children:"> API Detail"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"const ctx = useClientContext()\n\nconsole.log(ctx.playground)\n\n"})}),"\n",(0,o.jsxs)(n.h2,{id:"config",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#config",children:"#"}),"config"]}),"\n",(0,o.jsx)(n.p,{children:"Canvas configuration, provides zoom, scroll, etc."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/core/classes/PlaygroundConfigEntity.html",rel:"noopener noreferrer",target:"_blank",children:"> API Detail"})}),"\n",(0,o.jsxs)(n.h3,{id:"properties",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#properties",children:"#"}),"Properties"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["zoom ",(0,o.jsx)(n.code,{children:"number"})," Current zoom ratio"]}),"\n",(0,o.jsxs)(n.li,{children:["scrollData ",(0,o.jsx)(n.code,{children:"{ scrollX: number, scrollY: number }"})," Current scroll position"]}),"\n",(0,o.jsxs)(n.li,{children:["readonlyOrDisabled ",(0,o.jsx)(n.code,{children:"boolean"})," Whether the canvas is readonly or disabled"]}),"\n",(0,o.jsx)(n.li,{children:"readonly"}),"\n",(0,o.jsx)(n.li,{children:"disabled"}),"\n"]}),"\n",(0,o.jsxs)(n.h3,{id:"fitview",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#fitview",children:"#"}),"fitView"]}),"\n",(0,o.jsx)(n.p,{children:"Node fit canvas window, need to pass in the node's bounds"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"/**\n * Fit size\n * @param bounds {Rectangle} Target size\n * @param easing {number} Whether to start animation, default is true\n * @param padding {number} Boundary padding\n */\nctx.playground.config.fitView(ctx.document.root.bounds, true, 10)\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"scrolltoview",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#scrolltoview",children:"#"}),"scrollToView"]}),"\n",(0,o.jsxs)(n.p,{children:["Specify the node position and scroll to the canvas visible area, if the position is already in the visible area, it will not scroll unless ",(0,o.jsx)(n.code,{children:"scrollToCenter"})," is forced to scroll"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"\n/**\n * Detailed parameter description\n * @param opts {PlaygroundConfigRevealOpts}\n**/\ninterface PlaygroundConfigRevealOpts {\n  entities?: Entity[]\n  position?: PositionSchema // Scroll to the specified position and center\n  bounds?: Rectangle // Scroll bounds\n  scrollDelta?: PositionSchema\n  zoom?: number // Need to scale the ratio\n  easing?: boolean // Whether to start animation, default is true\n  easingDuration?: number // Default 500 ms\n  scrollToCenter?: boolean // Whether to force scroll to center\n}\n\nctx.playground.config.scrollToView({\n  bounds: ctx.document.getNode('start').bounds,\n})\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"zoomin",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#zoomin",children:"#"}),"zoomin"]}),"\n",(0,o.jsx)(n.p,{children:"Zoom In"}),"\n",(0,o.jsxs)(n.h3,{id:"zoomout",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#zoomout",children:"#"}),"zoomout"]}),"\n",(0,o.jsx)(n.p,{children:"Zoom Out"}),"\n",(0,o.jsxs)(n.h3,{id:"getposefrommouseevent",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getposefrommouseevent",children:"#"}),"getPoseFromMouseEvent"]}),"\n",(0,o.jsx)(n.p,{children:"Convert browser mouse position to canvas coordinate system"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"\nconst pos: { x: number, y: number } = ctx.playground.config.getPoseFromMouseEvent(domMouseEvent)\n\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"scroll",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#scroll",children:"#"}),"scroll"]}),"\n",(0,o.jsx)(n.p,{children:"Scroll canvas, need to pass in the scroll position, and whether to smooth scroll, scroll time"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"ctx.playground.config.scroll({ scrollX: 100, scrollY: 100 }, true, 300)\n"})}),"\n",(0,o.jsxs)(n.h3,{id:"getviewport",children:[(0,o.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getviewport",children:"#"}),"getViewport"]}),"\n",(0,o.jsx)(n.p,{children:"Get the current canvas viewport size"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",meta:"pure",children:"const viewport = ctx.playground.config.getViewport()\n"})})]})}function i(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,o.jsx)(n,Object.assign({},e,{children:(0,o.jsx)(t,e)})):t(e)}let a=i;i.__RSPRESS_PAGE_META={},i.__RSPRESS_PAGE_META["en%2Fapi%2Fcore%2Fplayground.mdx"]={toc:[{id:"config",text:"config",depth:2},{id:"properties",text:"Properties",depth:3},{id:"fitview",text:"fitView",depth:3},{id:"scrolltoview",text:"scrollToView",depth:3},{id:"zoomin",text:"zoomin",depth:3},{id:"zoomout",text:"zoomout",depth:3},{id:"getposefrommouseevent",text:"getPoseFromMouseEvent",depth:3},{id:"scroll",text:"scroll",depth:3},{id:"getviewport",text:"getViewport",depth:3}],title:"Playground",frontmatter:{}}}}]);