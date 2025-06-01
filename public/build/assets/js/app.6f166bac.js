var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,s=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,i=(t,r,s)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[r]=s,n=(e,t)=>{for(var r in t||(t={}))o.call(t,r)&&i(e,r,t[r]);if(s)for(var r of s(t))a.call(t,r)&&i(e,r,t[r]);return e},l=(e,s)=>t(e,r(s));import{r as d,a as c,W as p}from"./vendor.463d2c8a.js";const _=function(){const e="undefined"!=typeof document&&document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),m={},u=function(e,t,r){if(!t||0===t.length)return e();const s=document.getElementsByTagName("link");return Promise.all(t.map((e=>{if((e=function(e){return"/build/"+e}(e))in m)return;m[e]=!0;const t=e.endsWith(".css"),o=t?'[rel="stylesheet"]':"";if(!!r)for(let r=s.length-1;r>=0;r--){const o=s[r];if(o.href===e&&(!t||"stylesheet"===o.rel))return}else if(document.querySelector(`link[href="${e}"]${o}`))return;const a=document.createElement("link");return a.rel=t?"stylesheet":_,t||(a.as="script",a.crossOrigin=""),a.href=e,document.head.appendChild(a),t?new Promise(((t,r)=>{a.addEventListener("load",t),a.addEventListener("error",(()=>r(new Error(`Unable to preload CSS for ${e}`))))})):void 0}))).then((()=>e())).catch((e=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}))};var f={exports:{}},g={},h=d,P=Symbol.for("react.element"),E=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,y=h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,j={key:!0,ref:!0,__self:!0,__source:!0};function b(e,t,r){var s,o={},a=null,i=null;for(s in void 0!==r&&(a=""+r),void 0!==t.key&&(a=""+t.key),void 0!==t.ref&&(i=t.ref),t)x.call(t,s)&&!j.hasOwnProperty(s)&&(o[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps)void 0===o[s]&&(o[s]=t[s]);return{$$typeof:P,type:e,key:a,ref:i,props:o,_owner:y.current}}g.Fragment=E,g.jsx=b,g.jsxs=b,f.exports=g;var v=f.exports;var w,O=c;function A(e,t){return r=this,s=null,o=function*(){const r=t[e];if(void 0===r)throw new Error(`Page not found: ${e}`);return"function"==typeof r?r():r},new Promise(((e,t)=>{var a=e=>{try{n(o.next(e))}catch(K){t(K)}},i=e=>{try{n(o.throw(e))}catch(K){t(K)}},n=t=>t.done?e(t.value):Promise.resolve(t.value).then(a,i);n((o=o.apply(r,s)).next())}));var r,s,o}w=O.createRoot,O.hydrateRoot;let I,D,R,T={data:""},L=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,V=/\/\*[^]*?\*\/|  +/g,C=/\n+/g,k=(e,t)=>{let r="",s="",o="";for(let a in e){let i=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+i+";":s+="f"==a[1]?k(i,a):a+"{"+k(i,"k"==a[1]?"":t)+"}":"object"==typeof i?s+=k(i,t?t.replace(/([^,])+/g,(e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):a):null!=i&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=k.p?k.p(a,i):a+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+s},S={},F=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+F(e[r]);return t}return e};function $(e){let t=this||{},r=e.call?e(t.p):e;return((e,t,r,s,o)=>{let a=F(e),i=S[a]||(S[a]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(a));if(!S[i]){let t=a!==e?e:(e=>{let t,r,s=[{}];for(;t=L.exec(e.replace(V,""));)t[4]?s.shift():t[3]?(r=t[3].replace(C," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(C," ").trim();return s[0]})(e);S[i]=k(o?{["@keyframes "+i]:t}:t,r?"":"."+i)}let n=r&&S.g?S.g:null;return r&&(S.g=S[i]),l=S[i],d=t,c=s,(p=n)?d.data=d.data.replace(p,l):-1===d.data.indexOf(l)&&(d.data=c?l+d.data:d.data+l),i;var l,d,c,p})(r.unshift?r.raw?((e,t,r)=>e.reduce(((e,s,o)=>{let a=t[o];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":k(e,""):!1===e?"":e}return e+s+(null==a?"":a)}),""))(r,[].slice.call(arguments,1),t.p):r.reduce(((e,r)=>Object.assign(e,r&&r.call?r(t.p):r)),{}):r,(s=t.target,"object"==typeof window?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||T),t.g,t.o,t.k);var s}$.bind({g:1});let N=$.bind({k:1});function U(e,t){let r=this||{};return function(){let s=arguments;function o(a,i){let n=Object.assign({},a),l=n.className||o.className;r.p=Object.assign({theme:D&&D()},n),r.o=/ *go\d+/.test(l),n.className=$.apply(r,s)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),R&&d[0]&&R(n),I(d,n)}return t?t(o):o}}var H=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,z=(()=>{let e=0;return()=>(++e).toString()})(),W=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),M=(e,t)=>{switch(t.type){case 0:return l(n({},e),{toasts:[t.toast,...e.toasts].slice(0,20)});case 1:return l(n({},e),{toasts:e.toasts.map((e=>e.id===t.toast.id?n(n({},e),t.toast):e))});case 2:let{toast:r}=t;return M(e,{type:e.toasts.find((e=>e.id===r.id))?1:0,toast:r});case 3:let{toastId:s}=t;return l(n({},e),{toasts:e.toasts.map((e=>e.id===s||void 0===s?l(n({},e),{dismissed:!0,visible:!1}):e))});case 4:return void 0===t.toastId?l(n({},e),{toasts:[]}):l(n({},e),{toasts:e.toasts.filter((e=>e.id!==t.toastId))});case 5:return l(n({},e),{pausedAt:t.time});case 6:let o=t.time-(e.pausedAt||0);return l(n({},e),{pausedAt:void 0,toasts:e.toasts.map((e=>l(n({},e),{pauseDuration:e.pauseDuration+o})))})}},q=[],B={toasts:[],pausedAt:void 0},Y=e=>{B=M(B,e),q.forEach((e=>{e(B)}))},Z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},G=e=>(t,r)=>{let s=((e,t="blank",r)=>l(n({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0},r),{id:(null==r?void 0:r.id)||z()}))(t,e,r);return Y({type:2,toast:s}),s.id},J=(e,t)=>G("blank")(e,t);J.error=G("error"),J.success=G("success"),J.loading=G("loading"),J.custom=G("custom"),J.dismiss=e=>{Y({type:3,toastId:e})},J.remove=e=>Y({type:4,toastId:e}),J.promise=(e,t,r)=>{let s=J.loading(t.loading,n(n({},r),null==r?void 0:r.loading));return"function"==typeof e&&(e=e()),e.then((e=>{let o=t.success?H(t.success,e):void 0;return o?J.success(o,n(n({id:s},r),null==r?void 0:r.success)):J.dismiss(s),e})).catch((e=>{let o=t.error?H(t.error,e):void 0;o?J.error(o,n(n({id:s},r),null==r?void 0:r.error)):J.dismiss(s)})),e};var K,Q,X,ee,te=(e,t)=>{Y({type:1,toast:{id:e,height:t}})},re=()=>{Y({type:5,time:Date.now()})},se=new Map,oe=e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=d.useState(B),s=d.useRef(B);d.useEffect((()=>(s.current!==B&&r(B),q.push(r),()=>{let e=q.indexOf(r);e>-1&&q.splice(e,1)})),[]);let o=t.toasts.map((t=>{var r,s,o;return l(n(n(n({},e),e[t.type]),t),{removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||Z[t.type],style:n(n(n({},e.style),null==(o=e[t.type])?void 0:o.style),t.style)})}));return l(n({},t),{toasts:o})})(e);d.useEffect((()=>{if(r)return;let e=Date.now(),s=t.map((t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(!(r<0))return setTimeout((()=>J.dismiss(t.id)),r);t.visible&&J.dismiss(t.id)}));return()=>{s.forEach((e=>e&&clearTimeout(e)))}}),[t,r]);let s=d.useCallback((()=>{r&&Y({type:6,time:Date.now()})}),[r]),o=d.useCallback(((e,r)=>{let{reverseOrder:s=!1,gutter:o=8,defaultPosition:a}=r||{},i=t.filter((t=>(t.position||a)===(e.position||a)&&t.height)),n=i.findIndex((t=>t.id===e.id)),l=i.filter(((e,t)=>t<n&&e.visible)).length;return i.filter((e=>e.visible)).slice(...s?[l+1]:[0,l]).reduce(((e,t)=>e+(t.height||0)+o),0)}),[t]);return d.useEffect((()=>{t.forEach((e=>{if(e.dismissed)((e,t=1e3)=>{if(se.has(e))return;let r=setTimeout((()=>{se.delete(e),Y({type:4,toastId:e})}),t);se.set(e,r)})(e.id,e.removeDelay);else{let t=se.get(e.id);t&&(clearTimeout(t),se.delete(e.id))}}))}),[t]),{toasts:t,handlers:{updateHeight:te,startPause:re,endPause:s,calculateOffset:o}}},ae=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ie=N`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ne=N`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,le=U("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ae} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ie} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ne} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,de=N`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ce=U("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${de} 1s linear infinite;
`,pe=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,_e=N`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,me=U("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${_e} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ue=U("div")`
  position: absolute;
`,fe=U("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ge=N`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,he=U("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ge} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Pe=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?d.createElement(he,null,t):t:"blank"===r?null:d.createElement(fe,null,d.createElement(ce,n({},s)),"loading"!==r&&d.createElement(ue,null,"error"===r?d.createElement(le,n({},s)):d.createElement(me,n({},s))))},Ee=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,xe=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,ye=U("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,je=U("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,be=d.memo((({toast:e,position:t,style:r,children:s})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,o]=W()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[Ee(r),xe(r)];return{animation:t?`${N(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${N(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},a=d.createElement(Pe,{toast:e}),i=d.createElement(je,n({},e.ariaProps),H(e.message,e));return d.createElement(ye,{className:e.className,style:n(n(n({},o),r),e.style)},"function"==typeof s?s({icon:a,message:i}):d.createElement(d.Fragment,null,a,i))}));K=d.createElement,k.p=Q,I=K,D=X,R=ee;var ve=({id:e,className:t,style:r,onHeightUpdate:s,children:o})=>{let a=d.useCallback((t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;s(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}}),[e,s]);return d.createElement("div",{ref:a,className:t,style:r},o)},we=$`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Oe=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:o,containerStyle:a,containerClassName:i})=>{let{toasts:l,handlers:c}=oe(r);return d.createElement("div",{id:"_rht_toaster",style:n({position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none"},a),className:i,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map((r=>{let a=r.position||t,i=((e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return n(n({left:0,right:0,display:"flex",position:"absolute",transition:W()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`},s),o)})(a,c.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}));return d.createElement(ve,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?we:"",style:i},"custom"===r.type?H(r.message,r):o?o(r):d.createElement(be,{toast:r,position:a}))})))},Ae=J;const Ie=()=>{const e=window.location.pathname;(e.includes("/products")||"/"===e)&&(u((()=>Promise.resolve({})),["assets/css/category-circles.4741a67b.css"]),u((()=>Promise.resolve({})),["assets/css/mobile-products.34427146.css"]),u((()=>Promise.resolve({})),["assets/css/enhanced-filters.321d3150.css"])),setTimeout((()=>{u((()=>Promise.resolve({})),["assets/css/transitions.41360763.css"]),u((()=>Promise.resolve({})),["assets/css/animations.ca9397c9.css"]),u((()=>Promise.resolve({})),["assets/css/product-page.fd04cdd5.css"]),u((()=>Promise.resolve({})),["assets/css/rtl.670f2edc.css"])}),100)};"undefined"!=typeof window&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",Ie):Ie());const De=()=>v.jsx("div",{className:"fixed inset-0 flex items-center justify-center z-50",children:v.jsxs("div",{className:"bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3",children:[v.jsxs("svg",{className:"animate-spin h-5 w-5 text-pink-600",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[v.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),v.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),v.jsx("span",{className:"text-gray-800 dark:text-white",children:"Loading..."})]})}),Re=(e,t)=>{const r=[];t||r.push("products.index"),e&&!t&&(r.push("cart.index"),r.push("checkout")),r.length>0&&"undefined"!=typeof window&&"requestIdleCallback"in window&&window.requestIdleCallback((()=>{r.forEach((e=>{try{const t=route(e),r=document.createElement("link");r.rel="prefetch",r.href=t,r.as="document",document.head.appendChild(r)}catch(K){}}))}))};p({title:e=>`${e} - CinematicBeauty`,resolve:e=>A(`./Pages/${e}.jsx`,Object.assign({"./Pages/Admin/Categories/Form.jsx":()=>u((()=>import("./Form.0e125120.js")),["assets/js/Form.0e125120.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/filepond-plugin-file-validate-size.esm.bbf43fa4.js","assets/css/filepond-plugin-file-validate-size.46d58c9d.css"]),"./Pages/Admin/Categories/Index.jsx":()=>u((()=>import("./Index.1fb7ffc4.js")),["assets/js/Index.1fb7ffc4.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Categories/Show.jsx":()=>u((()=>import("./Show.7da12d8c.js")),["assets/js/Show.7da12d8c.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/CategoryForm.jsx":()=>u((()=>import("./CategoryForm.1d0329c1.js")),["assets/js/CategoryForm.1d0329c1.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Charts/SalesChart.jsx":()=>u((()=>import("./SalesChart.2065c8e4.js")),["assets/js/SalesChart.2065c8e4.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Charts/StatusCharts.jsx":()=>u((()=>import("./StatusCharts.029d9d01.js")),["assets/js/StatusCharts.029d9d01.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Dashboard.jsx":()=>u((()=>import("./Dashboard.a41a0766.js")),["assets/js/Dashboard.a41a0766.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/OrderDetails.jsx":()=>u((()=>import("./OrderDetails.a4898ccf.js")),["assets/js/OrderDetails.a4898ccf.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Orders/Index.jsx":()=>u((()=>import("./Index.c8d6984d.js")),["assets/js/Index.c8d6984d.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Orders/Show.jsx":()=>u((()=>import("./Show.f153053e.js")),["assets/js/Show.f153053e.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/ProductForm.jsx":()=>u((()=>import("./ProductForm.9df3b33f.js")),["assets/js/ProductForm.9df3b33f.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Products/Form.jsx":()=>u((()=>import("./Form.9b72650b.js")),["assets/js/Form.9b72650b.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/filepond-plugin-file-validate-size.esm.bbf43fa4.js","assets/css/filepond-plugin-file-validate-size.46d58c9d.css"]),"./Pages/Admin/Products/Index.jsx":()=>u((()=>import("./Index.d8669752.js")),["assets/js/Index.d8669752.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Products/Show.jsx":()=>u((()=>import("./Show.1f43cf31.js")),["assets/js/Show.1f43cf31.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Reports/Index.jsx":()=>u((()=>import("./Index.b6e00886.js")),["assets/js/Index.b6e00886.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/Sales.jsx":()=>u((()=>import("./Sales.092c6978.js")),["assets/js/Sales.092c6978.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/TopCustomers.jsx":()=>u((()=>import("./TopCustomers.8c6c43f9.js")),["assets/js/TopCustomers.8c6c43f9.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/TopProducts.jsx":()=>u((()=>import("./TopProducts.9e4a3305.js")),["assets/js/TopProducts.9e4a3305.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/UserForm.jsx":()=>u((()=>import("./UserForm.0ffebd06.js")),["assets/js/UserForm.0ffebd06.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Users/Form.jsx":()=>u((()=>import("./Form.385de632.js")),["assets/js/Form.385de632.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Users/Index.jsx":()=>u((()=>import("./Index.f7619e40.js")),["assets/js/Index.f7619e40.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.21ab7c95.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Auth/ConfirmPassword.jsx":()=>u((()=>import("./ConfirmPassword.077f2ee8.js")),["assets/js/ConfirmPassword.077f2ee8.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Auth/ForgotPassword.jsx":()=>u((()=>import("./ForgotPassword.132ea2a5.js")),["assets/js/ForgotPassword.132ea2a5.js","assets/js/InputError.c5949837.js","assets/js/vendor.463d2c8a.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Auth/Login.jsx":()=>u((()=>import("./Login.8f64f35a.js")),["assets/js/Login.8f64f35a.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Auth/Register.jsx":()=>u((()=>import("./Register.7d258f4e.js")),["assets/js/Register.7d258f4e.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Auth/ResetPassword.jsx":()=>u((()=>import("./ResetPassword.c82e5491.js")),["assets/js/ResetPassword.c82e5491.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Auth/VerifyEmail.jsx":()=>u((()=>import("./VerifyEmail.ce5d5eba.js")),["assets/js/VerifyEmail.ce5d5eba.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/vendor.463d2c8a.js","assets/js/motion.6f439a0f.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/AuthCard.33ba014f.js"]),"./Pages/Cart/Index.jsx":()=>u((()=>import("./Index.d5474cb6.js")),["assets/js/Index.d5474cb6.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/csrf.fd3390d8.js"]),"./Pages/Checkout.jsx":()=>u((()=>import("./Checkout.744e4700.js")),["assets/js/Checkout.744e4700.js","assets/js/vendor.463d2c8a.js","assets/js/stripe.fe3769f5.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Dashboard.jsx":()=>u((()=>import("./Dashboard.816c8ce6.js")),["assets/js/Dashboard.816c8ce6.js","assets/js/vendor.463d2c8a.js","assets/js/motion.6f439a0f.js"]),"./Pages/Favorites/Index.jsx":()=>u((()=>import("./Index.b0f181dc.js")),["assets/js/Index.b0f181dc.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/AboutUs.jsx":()=>u((()=>import("./AboutUs.afb5c170.js")),["assets/js/AboutUs.afb5c170.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/ContactUs.jsx":()=>u((()=>import("./ContactUs.c911f4d9.js")),["assets/js/ContactUs.c911f4d9.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Faqs.jsx":()=>u((()=>import("./Faqs.2c4cb59a.js")),["assets/js/Faqs.2c4cb59a.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/PrivacyPolicy.jsx":()=>u((()=>import("./PrivacyPolicy.200172e1.js")),["assets/js/PrivacyPolicy.200172e1.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Returns.jsx":()=>u((()=>import("./Returns.592eb3bb.js")),["assets/js/Returns.592eb3bb.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Shipping.jsx":()=>u((()=>import("./Shipping.a9f8790f.js")),["assets/js/Shipping.a9f8790f.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/TermsOfService.jsx":()=>u((()=>import("./TermsOfService.df32e555.js")),["assets/js/TermsOfService.df32e555.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/HomePage/index.jsx":()=>u((()=>import("./index.042774ac.js")),["assets/js/index.042774ac.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/csrf.fd3390d8.js","assets/css/index.a5f04fcd.css","assets/css/category-circles.4741a67b.css"]),"./Pages/OrderSuccess.jsx":()=>u((()=>import("./OrderSuccess.35f0f90d.js")),["assets/js/OrderSuccess.35f0f90d.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js"]),"./Pages/Orders/Index.jsx":()=>u((()=>import("./Index.fccea335.js")),["assets/js/Index.fccea335.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/utils.403bf355.js"]),"./Pages/Orders/Show.jsx":()=>u((()=>import("./Show.8f72bdfe.js")),["assets/js/Show.8f72bdfe.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/DangerButton.aecc9127.js","assets/js/transition.bd662076.js","assets/js/TextInput.ce816db6.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/utils.403bf355.js","assets/css/Show.962716e6.css"]),"./Pages/Products/Index.jsx":()=>u((()=>import("./Index.9dbec260.js")),["assets/js/Index.9dbec260.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/csrf.fd3390d8.js","assets/css/Index.d9eb6334.css","assets/css/category-circles.4741a67b.css"]),"./Pages/Products/Show.jsx":()=>u((()=>import("./Show.d43ae9a4.js")),["assets/js/Show.d43ae9a4.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js","assets/js/motion.6f439a0f.js","assets/js/csrf.fd3390d8.js","assets/css/product-page.fd04cdd5.css","assets/css/category-circles.4741a67b.css"]),"./Pages/Profile/Edit.jsx":()=>u((()=>import("./Edit.3cf66e43.js")),["assets/js/Edit.3cf66e43.js","assets/js/DeleteUserForm.996acbeb.js","assets/js/vendor.463d2c8a.js","assets/js/DangerButton.aecc9127.js","assets/js/transition.bd662076.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/TextInput.ce816db6.js","assets/js/motion.6f439a0f.js","assets/js/UpdatePasswordForm.f7649fe4.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/UpdateProfileInformationForm.5d518b84.js","assets/js/CinematicLayout.ba6fef72.js","assets/js/DarkModeToggle.db737b2d.js"]),"./Pages/Profile/Partials/DeleteUserForm.jsx":()=>u((()=>import("./DeleteUserForm.996acbeb.js")),["assets/js/DeleteUserForm.996acbeb.js","assets/js/vendor.463d2c8a.js","assets/js/DangerButton.aecc9127.js","assets/js/transition.bd662076.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/TextInput.ce816db6.js","assets/js/motion.6f439a0f.js"]),"./Pages/Profile/Partials/UpdatePasswordForm.jsx":()=>u((()=>import("./UpdatePasswordForm.f7649fe4.js")),["assets/js/UpdatePasswordForm.f7649fe4.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.c5949837.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/transition.bd662076.js"]),"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx":()=>u((()=>import("./UpdateProfileInformationForm.5d518b84.js")),["assets/js/UpdateProfileInformationForm.5d518b84.js","assets/js/InputError.c5949837.js","assets/js/vendor.463d2c8a.js","assets/js/InputLabel.87381326.js","assets/js/PrimaryButton.7f4bf56d.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.ce816db6.js","assets/js/transition.bd662076.js"]),"./Pages/Welcome.jsx":()=>u((()=>import("./Welcome.15d1a319.js")),["assets/js/Welcome.15d1a319.js","assets/js/vendor.463d2c8a.js"])})),setup:({el:e,App:t,props:r})=>{const s=w(e);function o(){var e,s;const o=d.useMemo((()=>{var e,t;return null==(t=null==(e=r.initialPage)?void 0:e.props)?void 0:t.localeData}),[null==(s=null==(e=r.initialPage)?void 0:e.props)?void 0:s.localeData]);return d.useEffect((()=>{o&&(window._shared=window._shared||{},window._shared.localeData=o),"serviceWorker"in navigator?window.addEventListener("load",(()=>{navigator.serviceWorker.register("/serviceWorker.js").then((e=>{})).catch((e=>{}))})):navigator}),[r.initialPage]),v.jsxs(d.Suspense,{fallback:v.jsx(De,{}),children:[v.jsx(t,n({},r)),v.jsx(Oe,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#333",color:"#fff"},success:{style:{background:"#10B981"}},error:{style:{background:"#EF4444"}}}})]})}r.initialPage&&r.initialPage.props&&r.initialPage.props.localeData&&(window._shared=window._shared||{},window._shared.localeData=r.initialPage.props.localeData),s.render(v.jsx(o,{}));const a=r.initialPage.props.auth?r.initialPage.props.auth.user:null,i=!!a,l=i&&a.is_admin;Re(i,l)},progress:{color:"#E11D48",showSpinner:!0,delay:250},cache:e=>!(e.component.startsWith("Admin/")||e.component.includes("Cart")||e.component.includes("Checkout"))&&{maxAge:3e5}});export{Oe as O,Ae as V,u as _,J as c,v as j};
