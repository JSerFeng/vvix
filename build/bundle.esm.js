const e=e=>{console.warn(e)},t=(e,t)=>{console.error(e),console.error(t)},n=(e,t)=>e.flags===t.flags&&e.type===t.type,l=(e,t)=>{if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!(n in t)||e[n]!==t[n])return!1;return!0},i=e=>{const t=e.length;if(0===t)return[];if(1===t)return[0];const n=new Array(t).fill(1),l=[];let i=-1;for(let l=t-1;l>=0;l--){const o=e[l];for(let r=l+1;r<t;r++){o<e[r]&&(n[l]=Math.max(n[l],1+n[r]),(-1===i||n[i]<n[l])&&(i=l))}}if(-1===i)return[];for(;i<t;){const e=n[i];for(l.push(i++);n[i]!==e-1&&i<t;)i++}return l},o=e=>Array.isArray(e),r=e=>"object"==typeof e&&null!==e,s=e=>null==e,c=e=>null!=e,a=[];let u=null,f=!1;function d(e,t={lazy:!1,active:!0}){const n=h(e,t);return n.lazy||n(),n}function h(e,t){const n=function t(...l){t.active&&!f&&(a.includes(n)||(a.push(t),u=n,e(...l),a.pop(),u=null))};return n.lazy=t.lazy||!1,n.active=t.active||!0,n.raw=e,n.deps=[],n.scheduler=t.scheduler||null,n}const p=(e,t)=>{const n=g.get(e);if(!n)return;const l=n.get(t);l&&l.forEach((e=>{e!==u&&(e.scheduler?e.scheduler(e):e())}))},g=new WeakMap,_=(e,t)=>{if(!u)return;let n=g.get(e);n||g.set(e,n=new Map);let l=n.get(t);l||n.set(t,l=new Set),l.has(u)||(l.add(u),u.deps.push(l))},m=e=>{e.active=!1},v=()=>{f=!0},y=()=>{f=!1},k=new WeakMap,C=new WeakMap,w={get(e,t,n){if("_mark"===t)return!0;if("_raw"===t)return e;const l=Reflect.get(e,t,n);return _(e,t),r(l)&&!l._isVNode?E(l):l},set(e,t,n,l){const i=e[t],o=Reflect.set(e,t,n,l);return n!==i&&p(e,t),o},has(e,t){const n=Reflect.has(e,t);return _(e,t),n},deleteProperty(e,t){const n=Reflect.deleteProperty(e,t);return p(e,t),n}},E=e=>{if("object"!=typeof e)return e;if(e._raw)return e;let t;return(t=k.get(e))||(t=new Proxy(e,w),C.set(t,e)),t},S=e=>C.get(e)||e,b=e=>(e._raw=!0,e),F=e=>e&&!!e._isRef;class T{constructor(e){this._isRef=!0,s(e)?this._value=null:this._value=r(e)?E(e):e}get value(){return _(this,"value"),this._value}set value(e){e!==this._value&&(this._value=e,p(this,"value"))}}function x(e){return s(e)?new T:F(e)?e:new T(e)}var M,N;!function(e){e[e.Element=1]="Element",e[e.FC=2]="FC",e[e.Text=4]="Text",e[e.Fragment=8]="Fragment",e[e.Portal=16]="Portal",e[e.Svg=32]="Svg"}(M||(M={})),function(e){e[e.Multiple=1]="Multiple",e[e.Single=2]="Single",e[e.NoChildren=8]="NoChildren"}(N||(N={}));const A=Symbol("Fragment"),P=Symbol("Portal");class B{constructor(e,t,n,l){this.data={},this._isVNode=!0,this.el=null,this._instance=null,this.type=e,"function"==typeof e?(this.flags=M.FC,this._instance={_props:{children:[],...t},_render:null,_mounted:!1,_vnode:null,_update:null,_onMount:[],_onUnmount:[]}):this.flags="string"==typeof e?"svg"===e?M.Svg:M.Element:e===A?M.Fragment:e===P?M.Portal:M.Text,c(l)?this.key=l:c(t.key)?(this.key=t.key,delete t.key):this.key=null,this.data=t;Array.isArray(n)?(this.children=n.map((e=>r(e)?e:j(null,null,e+""))),this.childFlags=N.Multiple):r(n)?(this.children=n,this.childFlags=N.Single):c(n)?this.flags&M.Text?(this.childFlags=N.NoChildren,this.children=n.toString()):(this.childFlags=N.Single,this.children=j(null,null,n.toString())):(this.childFlags=N.NoChildren,this.children=null)}}function R(e,t){return n=>("function"==typeof e&&(e=D(e,n)),()=>D(P,{children:e},t))}function j(e,t,...n){let l=null;return 0===n.length?l=null:1===n.length?(l=n[0],"object"!=typeof l&&(l+="")):l=n,new B(e,t||{},l)}const D=(e,t,n)=>{let{children:l}=t;if(o(l)){let e=!1,t=[];for(const n of l)if(o(n)){e=!0,t=n;break}if(e){const e={};for(const n of t)if(c(n.key)){if(n.key in e){console.error("[key property] can not be the same \nduplicated key: \n"+n.key);break}e[n.key]=!0}else console.error("child in an array must have a key \n");l=l.flat()}}return new B(e,t,l,n)},W=D,z=[];let V=!1;const L=e=>{z.includes(e)||z.push(e),V||(V=!0,Promise.resolve().then(O))},O=()=>{z.forEach((e=>e())),z.length=0,V=!1},U=/\[A-Z]|^(?:value|checked|selected|muted)$/;let I=null;const Z={getElement:e=>document.querySelector(e),createElement:e=>document.createElement(e),createTextNode:e=>document.createTextNode(e),createComment:e=>document.createComment(e),createSvgElement:e=>document.createElementNS("http://www.w3.org/2000/svg",e),appendChild:(e,t)=>e.appendChild(t),insertBefore:(e,t,n)=>e.insertBefore(t,n),removeChild:(e,t)=>e.removeChild(t),setAttribute(e,t,n){/\[A-Z]|^(?:value|checked|selected|muted)$/.test(t)?e[t]=n:"key"!==t&&"children"!==t&&e.setAttribute(t,n)},setText:(e,t)=>e.textContent=t,patchData(e,t,n,l,i){if(n!==l&&!(i&&i&M.Element&&"children"===t))switch(t){case"style":if(n)for(const t in n)e.style[t]=n[t];if(l)for(const t in l)n&&n[t]===l[t]||(e.style[t]="");break;case"class":e.className=n;break;default:if(t.startsWith("on")){const i=t.split("on")[1].toLowerCase();n&&e.addEventListener(i,n),l&&e.removeEventListener(i,l)}else U.test(t)?e[t]=n:e.setAttribute(t,n)}}};function $(e){function t(n,l,i,o){if(s(n))return;const{flags:r}=n;r&M.FC?function(e,n,l,i){const{type:o}=e;e._instance._update=()=>{if(e._instance._mounted){const t=e._instance._vnode,i=e._instance._render();a(i,t,n,l,t?.el?.nextSibling),e._instance._vnode=i}else{const o=e._instance._vnode=e._instance._render();t(o,n,l,i),e.el=o.el,e._instance._mounted=!0;for(const t of e._instance._onMount)t()}},I=e._instance,e._instance._render=o(e._instance._props),I=null,d((()=>{e._instance._update()}),{scheduler:L})}(n,l,i,o):r&(M.Element|M.Svg)?function(n,l,i,o){const{data:r,childFlags:s,children:c,type:a}=n,u=n.el=i?e.createSvgElement(a):e.createElement(a);r.ref&&(r.ref.value=u);for(const t in r)e.patchData(u,t,r[t],null,M.Element);o?e.insertBefore(l,u,o):e.appendChild(l,u);!function(e,n,l,i,o){if(e&N.NoChildren)return;if(e&N.Single)t(n,i,o);else if(e&N.Multiple){const e=l.el;for(const l of n)t(l,e,o)}}(s,c,n,u,i)}(n,l,i,o):r&M.Text?function(t,n,l){const i=e.createTextNode(t.children);t.el=i,l?e.insertBefore(n,i,l):e.appendChild(n,i)}(n,l,o):r&M.Portal?function(n){const l=n.el="string"==typeof n.key?e.getElement(n.key):n.key;t(n.children,l,!1)}(n):function(n,l,i,o){const{children:r}=n;Array.isArray(r)?r.forEach((e=>t(e,l,i,o))):r&&t(r,l,i,o);const s=e.createComment("__FRAGMENT_END__");n.el=s,o?e.insertBefore(l,s,o):e.appendChild(l,s)}(n,l,i,o)}function o(t,n){const{flags:l,children:i,el:s}=t;if(l&M.Element||l&M.Text)e.removeChild(n,t.el);else if(l&M.FC)r(t,n);else if(l&M.Fragment)Array.isArray(i)?i.forEach((e=>o(e,n))):i&&o(i,n),e.removeChild(n,s);else if(l&M.Portal){const e=t.el;o(t.children,e)}}function r(t,n){const{childFlags:l,children:i}=t,o=t.el;if(l&N.Multiple)for(const e of i)e.flags&M.FC&&r(e,o);let s=t._instance._onUnmount;if(s.length)for(const e of s)e();t._instance=null,e.removeChild(n,o)}function a(i,r,s,c,f){if(i&&r)if(n(i,r)){const t=i.flags;t&M.FC?function(e,t){if(e.el=t.el,e._instance=t._instance,function(e,t){const n=e._instance._props,i=t._instance._props;return delete n.children,delete i.children,l(n,i)}(e,t))return;const n=e._instance._props,i=t._instance._props;for(const t in n)n[t]!==i[t]&&(e._instance._props[t]=n[t]);e._instance._update()}(i,r):t&M.Text?function(t,n){const l=t.el=n.el;t.children!==n.children&&e.setText(l,t.children)}(i,r):t&M.Element?function(t,n,l){const i=t.el=n.el;for(const l in t.data)e.patchData(i,l,t.data[l],n.data[l],M.Element);for(const l in n.data)t.data[l]||e.patchData(i,l,null,n.data[l],M.Element);u(t,n,l)}(i,r,c):t&M.Portal?function(e,t){const n=e.el=t.el;a(e.children,t.children,n,!1)}(i,r):function(e,t,n,l){const i=e.el=t.el;u(e,t,l,n,i)}(i,r,s,c)}else!function(e,n,l,i){const r=n.el?.nextSibling;o(n,l),t(e,l,i,r)}(i,r,s,c);else i?t(i,s,c,f):r&&o(r,s)}function u(n,l,r,s,u){const{childFlags:f,children:d}=n,{childFlags:h,children:p}=l,g=s||l.el;if(f&N.NoChildren){if(h&N.Single)o(p,g);else if(h&N.Multiple)for(const e of p)o(e,g)}else if(f&N.Single){if(h&N.NoChildren)t(d,g,r,u);else if(h&N.Single)a(d,p,g,r,u);else if(h&N.Multiple){for(const e of p)o(e,g);t(d,g,r,u)}}else if(f&N.Multiple)if(h&N.NoChildren)for(const e of d)t(e,g,r,u);else if(h&N.Single){o(p,g);for(const e of d)t(e,g,r,u)}else h&N.Multiple&&function(n,l,r,s,u){let f=0,d=n.length-1,h=n[f],p=l.length-1,g=l[f];e:{for(;f<=d&&f<=p&&h.key===g.key;){if(a(h,g,r,s),f++,f>d||f>p)break e;h=n[f],g=l[f]}for(h=n[d],g=l[p];f<=d&&f<=p&&h.key===g.key;){if(a(h,g,r,s),d--,p--,f>d||f>p)break e;h=n[d],g=l[p]}}if(f>d&&f<=p)for(let e=f;e<=p;e++)o(l[e],r);else if(f>p){const e=p+1>=l.length?void 0:l[p+1].el;for(let l=f;l<=d;l++)t(n[l],r,s,e)}else{let _=!1,m=0,v=0;const y=d-f+1,k=new Array(y).fill(-1),C={},w={};for(let e=0;e<y;e++)C[n[f+e].key]=e;for(let e=f;e<=p;e++)if(g=l[e],w[g.key]=!0,v<y){const t=C[g.key];c(t)?(h=n[t+f],a(h,g,r,s),v++,k[t]=e,t<m?_=!0:m=t):o(g,r)}else o(g,r);if(_){const l=i(k);let o=l.length-1;for(let i=d;i>=f;i--){if(h=n[i],-1===k[i]){t(h,r,s,i+1<n.length?n[i+1].el:void 0)}if(i===l[o])o--;else{const t=i+1<n.length?n[i+1].el:void 0;e.insertBefore(r,h.el,t)}}}else for(let e=d;e>=f;e--)if(h=n[e],!w[h.key]){t(h,r,s,(e+1>=n.length?void 0:n[e+1].el)||u)}}}(d,p,g,r,u)}return function(e,t){const n=!!(e.flags&M.Svg);a(e,t.vnode,t,n)}}const q=()=>!!I||(_warn("hook must be called inside a function component"),!1),G=e=>{q()&&I._onMount.push(e)},Y=e=>{q()&&I._onUnmount.push(e)},H=e=>{q()&&I._props.ref&&(I._props.ref.value=e)},J=(e,t)=>{t||(t=Z);const n=$(t);return{mount(l){l?"string"!=typeof l||(l=t.getElement(l))?n(e,l):console.warn("无效的id或者class"):console.warn("请指定一个挂在节点的id或者class或者dom节点")}}},K=[{id:0,title:"Better Call Saul",content:"The best TV Series EVER! Though it's a little bit  slow tempo at first. You mustn't miss it."},{id:1,title:"Breaking Bad",content:"The second best series, it's the best until I meet 《Better Call Saul》"},{id:2,title:"The Walking Dead",content:"It's interesting at first, however..."}];const Q=({title:e,content:t})=>()=>W("div",{children:[D("h1",{children:e},void 0),D("p",{children:t},void 0)]},void 0),X=({msg:e})=>()=>W("h1",{children:["fail: ",e]},void 0),ee=()=>{const[e,t,n]=function(){const e=x(3),t=x();let n=null;const l=()=>{n&&clearTimeout(n),e.value=1,n=setTimeout((()=>{e.value=0,t.value=K}),1e3)};return l(),[e,t,l]}();return()=>W(A,{children:[D("button",Object.assign({onClick:n},{children:"retry"}),void 0),1===e.value?"loading...":2===e.value?D(X,{msg:"oops, something wrong !"},void 0):t.value?.map((e=>D(Q,{title:e.title,content:e.content},e.id)))]},void 0)},te=()=>()=>D("h1",{children:"child"},void 0);J(D((()=>()=>W("div",{children:[D(ee,{},void 0),D(te,{},void 0)]},void 0)),{},void 0)).mount("#app");export{N as ChildrenFlags,A as Fragment,P as Portal,T as Ref,B as VNode,M as VNodeFlags,I as _currentMountingFC,t as _err,e as _warn,u as activeEffect,Z as baseNodeOps,q as checkHookAvailable,J as createApp,h as createEffect,R as createPortal,$ as createRenderer,d as effect,a as effectStack,H as expose,j as h,o as isArray,c as isDef,r as isObject,F as isRef,n as isSameVNode,s as isUndef,D as jsx,W as jsxs,i as lis,b as markRaw,G as onMounted,Y as onUnmounted,v as pauseTracking,E as reactive,x as ref,y as resetTracking,l as shallowEqual,m as stop,S as toRaw,_ as track,p as trigger};
