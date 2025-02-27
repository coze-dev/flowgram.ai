"use strict";(self.webpackChunk_flowgram_ai_docs=self.webpackChunk_flowgram_ai_docs||[]).push([["404726"],{550838:function(e,n,a){a.r(n),a.d(n,{default:function(){return i}});var r=a(110239),t=a(444827);function o(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code"},(0,t.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"getnodeform",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getnodeform",children:"#"}),"getNodeForm"]}),"\n",(0,r.jsx)(n.p,{children:"获取节点的表单能力，需要开启 节点引擎才能使用"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://flowgram.ai/auto-docs/editor/functions/getNodeForm.html",rel:"noopener noreferrer",target:"_blank",children:"> API Detail"})}),"\n",(0,r.jsxs)(n.h2,{id:"usage",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",meta:"pure",children:"\nfunction BaseNode({ node }) {\n  const form = getNodeForm(node);\n  console.log(form.getValueIn('title'))\n  return <div>{form?.render()}</div>\n}\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"return-inteface",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#return-inteface",children:"#"}),"Return Inteface"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"pure",children:"\nexport interface NodeFormProps<TValues> {\n  /**\n   * The initialValues of the form.\n   */\n  initialValues: TValues;\n  /**\n   * Form values. Returns a deep copy of the data in the store.\n   */\n  values: TValues;\n  /**\n   * Form state\n   */\n  state: FormState;\n  /**\n   * Get value in certain path\n   * @param name path\n   */\n  getValueIn<TValue = FieldValue>(name: FieldName): TValue;\n\n  /**\n   * Set value in certain path.\n   * It will trigger the re-rendering of the Field Component if a Field is related to this path\n   * @param name path\n   */\n  setValueIn<TValue>(name: FieldName, value: TValue): void;\n  /**\n   * Render form\n   */\n  render: () => React.ReactNode;\n  /**\n   * Form value change event\n   */\n  onFormValuesChange: Event<OnFormValuesChangePayload>;\n  /**\n   * Trigger form validate\n   */\n  validate: () => Promise<boolean>;\n  /**\n   * Form validate event\n   */\n  onValidate: Event<FormState>;\n  /**\n   * Form field value change event\n   */\n  onFormValueChangeIn<TValue = FieldValue, TFormValue = FieldValue>(\n    name: FieldName,\n    callback: (payload: onFormValueChangeInPayload<TValue, TFormValue>) => void\n  ): void;\n}\n"})})]})}function l(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,t.ah)(),e.components);return n?(0,r.jsx)(n,Object.assign({},e,{children:(0,r.jsx)(o,e)})):o(e)}let i=l;l.__RSPRESS_PAGE_META={},l.__RSPRESS_PAGE_META["zh%2Fapi%2Futils%2Fget-node-form.mdx"]={toc:[{id:"usage",text:"Usage",depth:2},{id:"return-inteface",text:"Return Inteface",depth:2}],title:"getNodeForm",frontmatter:{}}}}]);