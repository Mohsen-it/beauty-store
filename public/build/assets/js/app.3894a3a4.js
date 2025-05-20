var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,s=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,i=(t,r,s)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[r]=s,n=(e,t)=>{for(var r in t||(t={}))o.call(t,r)&&i(e,r,t[r]);if(s)for(var r of s(t))a.call(t,r)&&i(e,r,t[r]);return e},l=(e,s)=>t(e,r(s));import{r as d,a as c,W as p}from"./vendor.463d2c8a.js";const _={},m=function(e,t,r){if(!t||0===t.length)return e();const s=document.getElementsByTagName("link");return Promise.all(t.map((e=>{if((e=function(e){return"/build/"+e}(e))in _)return;_[e]=!0;const t=e.endsWith(".css"),o=t?'[rel="stylesheet"]':"";if(!!r)for(let r=s.length-1;r>=0;r--){const o=s[r];if(o.href===e&&(!t||"stylesheet"===o.rel))return}else if(document.querySelector(`link[href="${e}"]${o}`))return;const a=document.createElement("link");return a.rel=t?"stylesheet":"modulepreload",t||(a.as="script",a.crossOrigin=""),a.href=e,document.head.appendChild(a),t?new Promise(((t,r)=>{a.addEventListener("load",t),a.addEventListener("error",(()=>r(new Error(`Unable to preload CSS for ${e}`))))})):void 0}))).then((()=>e())).catch((e=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}))};var u={exports:{}},f={},g=d,h=Symbol.for("react.element"),P=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,E=g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function j(e,t,r){var s,o={},a=null,i=null;for(s in void 0!==r&&(a=""+r),void 0!==t.key&&(a=""+t.key),void 0!==t.ref&&(i=t.ref),t)x.call(t,s)&&!y.hasOwnProperty(s)&&(o[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps)void 0===o[s]&&(o[s]=t[s]);return{$$typeof:h,type:e,key:a,ref:i,props:o,_owner:E.current}}f.Fragment=P,f.jsx=j,f.jsxs=j,u.exports=f;var b=u.exports;var w,v=c;function O(e,t){return r=this,s=null,o=function*(){const r=t[e];if(void 0===r)throw new Error(`Page not found: ${e}`);return"function"==typeof r?r():r},new Promise(((e,t)=>{var a=e=>{try{n(o.next(e))}catch(K){t(K)}},i=e=>{try{n(o.throw(e))}catch(K){t(K)}},n=t=>t.done?e(t.value):Promise.resolve(t.value).then(a,i);n((o=o.apply(r,s)).next())}));var r,s,o}w=v.createRoot,v.hydrateRoot;let A,I,D,R={data:""},T=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,L=/\/\*[^]*?\*\/|  +/g,V=/\n+/g,C=(e,t)=>{let r="",s="",o="";for(let a in e){let i=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+i+";":s+="f"==a[1]?C(i,a):a+"{"+C(i,"k"==a[1]?"":t)+"}":"object"==typeof i?s+=C(i,t?t.replace(/([^,])+/g,(e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):a):null!=i&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=C.p?C.p(a,i):a+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+s},k={},S=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+S(e[r]);return t}return e};function F(e){let t=this||{},r=e.call?e(t.p):e;return((e,t,r,s,o)=>{let a=S(e),i=k[a]||(k[a]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(a));if(!k[i]){let t=a!==e?e:(e=>{let t,r,s=[{}];for(;t=T.exec(e.replace(L,""));)t[4]?s.shift():t[3]?(r=t[3].replace(V," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(V," ").trim();return s[0]})(e);k[i]=C(o?{["@keyframes "+i]:t}:t,r?"":"."+i)}let n=r&&k.g?k.g:null;return r&&(k.g=k[i]),l=k[i],d=t,c=s,(p=n)?d.data=d.data.replace(p,l):-1===d.data.indexOf(l)&&(d.data=c?l+d.data:d.data+l),i;var l,d,c,p})(r.unshift?r.raw?((e,t,r)=>e.reduce(((e,s,o)=>{let a=t[o];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":C(e,""):!1===e?"":e}return e+s+(null==a?"":a)}),""))(r,[].slice.call(arguments,1),t.p):r.reduce(((e,r)=>Object.assign(e,r&&r.call?r(t.p):r)),{}):r,(s=t.target,"object"==typeof window?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||R),t.g,t.o,t.k);var s}F.bind({g:1});let $=F.bind({k:1});function N(e,t){let r=this||{};return function(){let s=arguments;function o(a,i){let n=Object.assign({},a),l=n.className||o.className;r.p=Object.assign({theme:I&&I()},n),r.o=/ *go\d+/.test(l),n.className=F.apply(r,s)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),D&&d[0]&&D(n),A(d,n)}return t?t(o):o}}var U=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,H=(()=>{let e=0;return()=>(++e).toString()})(),z=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),W=(e,t)=>{switch(t.type){case 0:return l(n({},e),{toasts:[t.toast,...e.toasts].slice(0,20)});case 1:return l(n({},e),{toasts:e.toasts.map((e=>e.id===t.toast.id?n(n({},e),t.toast):e))});case 2:let{toast:r}=t;return W(e,{type:e.toasts.find((e=>e.id===r.id))?1:0,toast:r});case 3:let{toastId:s}=t;return l(n({},e),{toasts:e.toasts.map((e=>e.id===s||void 0===s?l(n({},e),{dismissed:!0,visible:!1}):e))});case 4:return void 0===t.toastId?l(n({},e),{toasts:[]}):l(n({},e),{toasts:e.toasts.filter((e=>e.id!==t.toastId))});case 5:return l(n({},e),{pausedAt:t.time});case 6:let o=t.time-(e.pausedAt||0);return l(n({},e),{pausedAt:void 0,toasts:e.toasts.map((e=>l(n({},e),{pauseDuration:e.pauseDuration+o})))})}},q=[],M={toasts:[],pausedAt:void 0},B=e=>{M=W(M,e),q.forEach((e=>{e(M)}))},Y={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},G=e=>(t,r)=>{let s=((e,t="blank",r)=>l(n({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0},r),{id:(null==r?void 0:r.id)||H()}))(t,e,r);return B({type:2,toast:s}),s.id},J=(e,t)=>G("blank")(e,t);J.error=G("error"),J.success=G("success"),J.loading=G("loading"),J.custom=G("custom"),J.dismiss=e=>{B({type:3,toastId:e})},J.remove=e=>B({type:4,toastId:e}),J.promise=(e,t,r)=>{let s=J.loading(t.loading,n(n({},r),null==r?void 0:r.loading));return"function"==typeof e&&(e=e()),e.then((e=>{let o=t.success?U(t.success,e):void 0;return o?J.success(o,n(n({id:s},r),null==r?void 0:r.success)):J.dismiss(s),e})).catch((e=>{let o=t.error?U(t.error,e):void 0;o?J.error(o,n(n({id:s},r),null==r?void 0:r.error)):J.dismiss(s)})),e};var K,Q,X,Z,ee=(e,t)=>{B({type:1,toast:{id:e,height:t}})},te=()=>{B({type:5,time:Date.now()})},re=new Map,se=e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=d.useState(M),s=d.useRef(M);d.useEffect((()=>(s.current!==M&&r(M),q.push(r),()=>{let e=q.indexOf(r);e>-1&&q.splice(e,1)})),[]);let o=t.toasts.map((t=>{var r,s,o;return l(n(n(n({},e),e[t.type]),t),{removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||Y[t.type],style:n(n(n({},e.style),null==(o=e[t.type])?void 0:o.style),t.style)})}));return l(n({},t),{toasts:o})})(e);d.useEffect((()=>{if(r)return;let e=Date.now(),s=t.map((t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(!(r<0))return setTimeout((()=>J.dismiss(t.id)),r);t.visible&&J.dismiss(t.id)}));return()=>{s.forEach((e=>e&&clearTimeout(e)))}}),[t,r]);let s=d.useCallback((()=>{r&&B({type:6,time:Date.now()})}),[r]),o=d.useCallback(((e,r)=>{let{reverseOrder:s=!1,gutter:o=8,defaultPosition:a}=r||{},i=t.filter((t=>(t.position||a)===(e.position||a)&&t.height)),n=i.findIndex((t=>t.id===e.id)),l=i.filter(((e,t)=>t<n&&e.visible)).length;return i.filter((e=>e.visible)).slice(...s?[l+1]:[0,l]).reduce(((e,t)=>e+(t.height||0)+o),0)}),[t]);return d.useEffect((()=>{t.forEach((e=>{if(e.dismissed)((e,t=1e3)=>{if(re.has(e))return;let r=setTimeout((()=>{re.delete(e),B({type:4,toastId:e})}),t);re.set(e,r)})(e.id,e.removeDelay);else{let t=re.get(e.id);t&&(clearTimeout(t),re.delete(e.id))}}))}),[t]),{toasts:t,handlers:{updateHeight:ee,startPause:te,endPause:s,calculateOffset:o}}},oe=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ae=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ie=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ne=N("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ae} 0.15s ease-out forwards;
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
    animation: ${ie} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,le=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,de=N("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${le} 1s linear infinite;
`,ce=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,pe=$`
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
}`,_e=N("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ce} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${pe} 0.2s ease-out forwards;
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
`,me=N("div")`
  position: absolute;
`,ue=N("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,fe=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ge=N("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${fe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,he=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?d.createElement(ge,null,t):t:"blank"===r?null:d.createElement(ue,null,d.createElement(de,n({},s)),"loading"!==r&&d.createElement(me,null,"error"===r?d.createElement(ne,n({},s)):d.createElement(_e,n({},s))))},Pe=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,xe=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,Ee=N("div")`
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
`,ye=N("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,je=d.memo((({toast:e,position:t,style:r,children:s})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,o]=z()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[Pe(r),xe(r)];return{animation:t?`${$(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},a=d.createElement(he,{toast:e}),i=d.createElement(ye,n({},e.ariaProps),U(e.message,e));return d.createElement(Ee,{className:e.className,style:n(n(n({},o),r),e.style)},"function"==typeof s?s({icon:a,message:i}):d.createElement(d.Fragment,null,a,i))}));K=d.createElement,C.p=Q,A=K,I=X,D=Z;var be=({id:e,className:t,style:r,onHeightUpdate:s,children:o})=>{let a=d.useCallback((t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;s(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}}),[e,s]);return d.createElement("div",{ref:a,className:t,style:r},o)},we=F`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ve=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:o,containerStyle:a,containerClassName:i})=>{let{toasts:l,handlers:c}=se(r);return d.createElement("div",{id:"_rht_toaster",style:n({position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none"},a),className:i,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map((r=>{let a=r.position||t,i=((e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return n(n({left:0,right:0,display:"flex",position:"absolute",transition:z()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`},s),o)})(a,c.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}));return d.createElement(be,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?we:"",style:i},"custom"===r.type?U(r.message,r):o?o(r):d.createElement(je,{toast:r,position:a}))})))},Oe=J;const Ae=()=>{m((()=>Promise.resolve({})),["assets/css/responsive.91e54b87.css"]),m((()=>Promise.resolve({})),["assets/css/transitions.41360763.css"]),m((()=>Promise.resolve({})),["assets/css/rtl.670f2edc.css"]),m((()=>Promise.resolve({})),["assets/css/animations.5ff1177f.css"])};"undefined"!=typeof window&&window.addEventListener("load",(()=>{"requestIdleCallback"in window?window.requestIdleCallback(Ae):setTimeout(Ae,1e3)}));const Ie=()=>b.jsx("div",{className:"fixed inset-0 flex items-center justify-center z-50",children:b.jsxs("div",{className:"bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3",children:[b.jsxs("svg",{className:"animate-spin h-5 w-5 text-pink-600",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[b.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),b.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),b.jsx("span",{className:"text-gray-800 dark:text-white",children:"Loading..."})]})}),De=(e,t)=>{const r=[];t||r.push("products.index"),e&&!t&&(r.push("cart.index"),r.push("checkout")),r.length>0&&"undefined"!=typeof window&&"requestIdleCallback"in window&&window.requestIdleCallback((()=>{r.forEach((e=>{try{const t=route(e),r=document.createElement("link");r.rel="prefetch",r.href=t,r.as="document",document.head.appendChild(r)}catch(K){}}))}))};p({title:e=>`${e} - CinematicBeauty`,resolve:e=>O(`./Pages/${e}.jsx`,Object.assign({"./Pages/Admin/Categories/Form.jsx":()=>m((()=>import("./Form.a6fcba5c.js")),["assets/js/Form.a6fcba5c.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/filepond-plugin-file-validate-size.esm.bbf43fa4.js","assets/css/filepond-plugin-file-validate-size.46d58c9d.css"]),"./Pages/Admin/Categories/Index.jsx":()=>m((()=>import("./Index.0cf0c2af.js")),["assets/js/Index.0cf0c2af.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Categories/Show.jsx":()=>m((()=>import("./Show.d242c60b.js")),["assets/js/Show.d242c60b.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/CategoryForm.jsx":()=>m((()=>import("./CategoryForm.95f5781b.js")),["assets/js/CategoryForm.95f5781b.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Charts/SalesChart.jsx":()=>m((()=>import("./SalesChart.a36ce8cc.js")),["assets/js/SalesChart.a36ce8cc.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Charts/StatusCharts.jsx":()=>m((()=>import("./StatusCharts.c35ca201.js")),["assets/js/StatusCharts.c35ca201.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Dashboard.jsx":()=>m((()=>import("./Dashboard.b9f8358f.js")),["assets/js/Dashboard.b9f8358f.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/OrderDetails.jsx":()=>m((()=>import("./OrderDetails.c4497b98.js")),["assets/js/OrderDetails.c4497b98.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Orders/Index.jsx":()=>m((()=>import("./Index.4c99e070.js")),["assets/js/Index.4c99e070.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Orders/Show.jsx":()=>m((()=>import("./Show.fb18d7b2.js")),["assets/js/Show.fb18d7b2.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/ProductForm.jsx":()=>m((()=>import("./ProductForm.63bf9f43.js")),["assets/js/ProductForm.63bf9f43.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Products/Form.jsx":()=>m((()=>import("./Form.904bfd5f.js")),["assets/js/Form.904bfd5f.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/filepond-plugin-file-validate-size.esm.bbf43fa4.js","assets/css/filepond-plugin-file-validate-size.46d58c9d.css"]),"./Pages/Admin/Products/Index.jsx":()=>m((()=>import("./Index.5972033a.js")),["assets/js/Index.5972033a.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Products/Show.jsx":()=>m((()=>import("./Show.d3daa7f4.js")),["assets/js/Show.d3daa7f4.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Reports/Index.jsx":()=>m((()=>import("./Index.3ae7c0dc.js")),["assets/js/Index.3ae7c0dc.js","assets/js/vendor.463d2c8a.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/Sales.jsx":()=>m((()=>import("./Sales.dc8786f4.js")),["assets/js/Sales.dc8786f4.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/TopCustomers.jsx":()=>m((()=>import("./TopCustomers.8eaa0cd5.js")),["assets/js/TopCustomers.8eaa0cd5.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/Reports/TopProducts.jsx":()=>m((()=>import("./TopProducts.6f983cb3.js")),["assets/js/TopProducts.6f983cb3.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/chart.e59e89b8.js"]),"./Pages/Admin/UserForm.jsx":()=>m((()=>import("./UserForm.a7d190ca.js")),["assets/js/UserForm.a7d190ca.js","assets/js/vendor.463d2c8a.js"]),"./Pages/Admin/Users/Form.jsx":()=>m((()=>import("./Form.c79c317a.js")),["assets/js/Form.c79c317a.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Admin/Users/Index.jsx":()=>m((()=>import("./Index.ff540dc9.js")),["assets/js/Index.ff540dc9.js","assets/js/vendor.463d2c8a.js","assets/js/AdminLayout.d719d8eb.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Auth/ConfirmPassword.jsx":()=>m((()=>import("./ConfirmPassword.4f31fbde.js")),["assets/js/ConfirmPassword.4f31fbde.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Auth/ForgotPassword.jsx":()=>m((()=>import("./ForgotPassword.e40fb4bb.js")),["assets/js/ForgotPassword.e40fb4bb.js","assets/js/InputError.d571aa9c.js","assets/js/vendor.463d2c8a.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Auth/Login.jsx":()=>m((()=>import("./Login.d2d6b5b0.js")),["assets/js/Login.d2d6b5b0.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Auth/Register.jsx":()=>m((()=>import("./Register.be042e42.js")),["assets/js/Register.be042e42.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Auth/ResetPassword.jsx":()=>m((()=>import("./ResetPassword.023e16ed.js")),["assets/js/ResetPassword.023e16ed.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Auth/VerifyEmail.jsx":()=>m((()=>import("./VerifyEmail.f5bc4b2f.js")),["assets/js/VerifyEmail.f5bc4b2f.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/vendor.463d2c8a.js","assets/js/motion.6f439a0f.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/AuthCard.d81da66e.js"]),"./Pages/Cart/Index.jsx":()=>m((()=>import("./Index.d38033f4.js")),["assets/js/Index.d38033f4.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Checkout.jsx":()=>m((()=>import("./Checkout.6d0492ca.js")),["assets/js/Checkout.6d0492ca.js","assets/js/vendor.463d2c8a.js","assets/js/stripe.fe3769f5.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Dashboard.jsx":()=>m((()=>import("./Dashboard.f5de5768.js")),["assets/js/Dashboard.f5de5768.js","assets/js/vendor.463d2c8a.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/motion.6f439a0f.js"]),"./Pages/Favorites/Index.jsx":()=>m((()=>import("./Index.da6768b4.js")),["assets/js/Index.da6768b4.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/AboutUs.jsx":()=>m((()=>import("./AboutUs.8c51d19f.js")),["assets/js/AboutUs.8c51d19f.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/ContactUs.jsx":()=>m((()=>import("./ContactUs.7c366618.js")),["assets/js/ContactUs.7c366618.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Faqs.jsx":()=>m((()=>import("./Faqs.c0659fda.js")),["assets/js/Faqs.c0659fda.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/PrivacyPolicy.jsx":()=>m((()=>import("./PrivacyPolicy.904c1ad0.js")),["assets/js/PrivacyPolicy.904c1ad0.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Returns.jsx":()=>m((()=>import("./Returns.c4dc1c88.js")),["assets/js/Returns.c4dc1c88.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/Shipping.jsx":()=>m((()=>import("./Shipping.257606c9.js")),["assets/js/Shipping.257606c9.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Help/TermsOfService.jsx":()=>m((()=>import("./TermsOfService.544df55e.js")),["assets/js/TermsOfService.544df55e.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/HomePage/index.jsx":()=>m((()=>import("./index.d827e39b.js")),["assets/js/index.d827e39b.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/OrderSuccess.jsx":()=>m((()=>import("./OrderSuccess.3db289a2.js")),["assets/js/OrderSuccess.3db289a2.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Orders/Index.jsx":()=>m((()=>import("./Index.efdf1e64.js")),["assets/js/Index.efdf1e64.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/utils.403bf355.js"]),"./Pages/Orders/Show.jsx":()=>m((()=>import("./Show.e8bf2477.js")),["assets/js/Show.e8bf2477.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js","assets/js/DangerButton.dfa253f6.js","assets/js/transition.bd662076.js","assets/js/TextInput.9b1ac93c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/utils.403bf355.js","assets/css/Show.962716e6.css"]),"./Pages/Products/Index.jsx":()=>m((()=>import("./Index.a86049f6.js")),["assets/js/Index.a86049f6.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Products/Show.jsx":()=>m((()=>import("./Show.8f759079.js")),["assets/js/Show.8f759079.js","assets/js/vendor.463d2c8a.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js","assets/js/motion.6f439a0f.js"]),"./Pages/Profile/Edit.jsx":()=>m((()=>import("./Edit.490f2022.js")),["assets/js/Edit.490f2022.js","assets/js/DeleteUserForm.442a0abf.js","assets/js/vendor.463d2c8a.js","assets/js/DangerButton.dfa253f6.js","assets/js/transition.bd662076.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/TextInput.9b1ac93c.js","assets/js/motion.6f439a0f.js","assets/js/UpdatePasswordForm.a58fe197.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/UpdateProfileInformationForm.4abeb534.js","assets/js/CinematicLayout.b5c7e729.js","assets/js/ResponsiveNavLink.c80c41cd.js","assets/js/DarkModeToggle.75e87d05.js"]),"./Pages/Profile/Partials/DeleteUserForm.jsx":()=>m((()=>import("./DeleteUserForm.442a0abf.js")),["assets/js/DeleteUserForm.442a0abf.js","assets/js/vendor.463d2c8a.js","assets/js/DangerButton.dfa253f6.js","assets/js/transition.bd662076.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/TextInput.9b1ac93c.js","assets/js/motion.6f439a0f.js"]),"./Pages/Profile/Partials/UpdatePasswordForm.jsx":()=>m((()=>import("./UpdatePasswordForm.a58fe197.js")),["assets/js/UpdatePasswordForm.a58fe197.js","assets/js/vendor.463d2c8a.js","assets/js/InputError.d571aa9c.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/transition.bd662076.js"]),"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx":()=>m((()=>import("./UpdateProfileInformationForm.4abeb534.js")),["assets/js/UpdateProfileInformationForm.4abeb534.js","assets/js/InputError.d571aa9c.js","assets/js/vendor.463d2c8a.js","assets/js/InputLabel.ecfa4987.js","assets/js/PrimaryButton.5ccb1e55.js","assets/js/motion.6f439a0f.js","assets/js/TextInput.9b1ac93c.js","assets/js/transition.bd662076.js"]),"./Pages/Welcome.jsx":()=>m((()=>import("./Welcome.983f0869.js")),["assets/js/Welcome.983f0869.js","assets/js/vendor.463d2c8a.js"])})),setup:({el:e,App:t,props:r})=>{const s=w(e);function o(){return d.useEffect((()=>{r.initialPage&&r.initialPage.props&&r.initialPage.props.localeData&&(window._shared=window._shared||{},window._shared.localeData=r.initialPage.props.localeData),"serviceWorker"in navigator?window.addEventListener("load",(()=>{navigator.serviceWorker.register("/serviceWorker.js").then((e=>{})).catch((e=>{}))})):navigator}),[r.initialPage]),b.jsxs(d.Suspense,{fallback:b.jsx(Ie,{}),children:[b.jsx(t,n({},r)),b.jsx(ve,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#333",color:"#fff"},success:{style:{background:"#10B981"}},error:{style:{background:"#EF4444"}}}})]})}r.initialPage&&r.initialPage.props&&r.initialPage.props.localeData&&(window._shared=window._shared||{},window._shared.localeData=r.initialPage.props.localeData),s.render(b.jsx(o,{}));const a=r.initialPage.props.auth?r.initialPage.props.auth.user:null,i=!!a,l=i&&a.is_admin;De(i,l)},progress:{color:"#E11D48",showSpinner:!0,delay:250},cache:e=>!(e.component.startsWith("Admin/")||e.component.includes("Cart")||e.component.includes("Checkout"))&&{maxAge:3e5}});export{ve as O,Oe as V,m as _,J as c,b as j};
