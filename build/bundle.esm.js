const e=e=>{console.warn(e)},t=(e,t)=>{console.error(e),console.error(t)},n=(e,t)=>e.flags===t.flags&&e.type===t.type,l=(e,t)=>{if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!(n in t)||e[n]!==t[n])return!1;return!0},i=e=>{const t=e.length;if(0===t)return[];if(1===t)return[0];const n=new Array(t).fill(1),l=[];let i=-1;for(let l=t-1;l>=0;l--){const o=e[l];for(let r=l+1;r<t;r++){o<e[r]&&(n[l]=Math.max(n[l],1+n[r]),(-1===i||n[i]<n[l])&&(i=l))}}if(-1===i)return[];for(;i<t;){const e=n[i];for(l.push(i++);n[i]!==e-1&&i<t;)i++}return l},o=e=>Array.isArray(e),r=e=>"object"==typeof e&&null!==e,s=e=>null==e,c=e=>null!=e,a=[];let f=null,u=!1;function d(e,t={lazy:!1,active:!0}){const n=h(e,t);return n.lazy||n(),n}function h(e,t){const n=function t(...l){t.active&&!u&&(a.includes(n)||(a.push(t),f=n,e(...l),a.pop(),f=null))};return n.lazy=t.lazy||!1,n.active=t.active||!0,n.raw=e,n.deps=[],n.scheduler=t.scheduler||null,n}const p=(e,t)=>{const n=g.get(e);if(!n)return;const l=n.get(t);l&&l.forEach((e=>{e!==f&&(e.scheduler?e.scheduler(e):e())}))},g=new WeakMap,_=(e,t)=>{if(!f)return;let n=g.get(e);n||g.set(e,n=new Map);let l=n.get(t);l||n.set(t,l=new Set),l.has(f)||(l.add(f),f.deps.push(l))},y=e=>{e.active=!1},m=()=>{u=!0},v=()=>{u=!1},k=new WeakMap,C=new WeakMap,w={get(e,t,n){if("_mark"===t)return!0;if("_raw"===t)return e;const l=Reflect.get(e,t,n);return _(e,t),r(l)&&!l._isVNode?E(l):l},set(e,t,n,l){const i=e[t],o=Reflect.set(e,t,n,l);return n!==i&&p(e,t),o},has(e,t){const n=Reflect.has(e,t);return _(e,t),n},deleteProperty(e,t){const n=Reflect.deleteProperty(e,t);return p(e,t),n}},E=e=>{if("object"!=typeof e)return e;if(e._raw)return e;let t;return(t=k.get(e))||(t=new Proxy(e,w),C.set(t,e)),t},S=e=>C.get(e)||e,F=e=>(e._raw=!0,e),b=e=>e&&!!e._isRef;class x{constructor(e){this._isRef=!0,s(e)?this._value=null:this._value=r(e)?E(e):e}get value(){return _(this,"value"),this._value}set value(e){e!==this._value&&(this._value=e,p(this,"value"))}}function M(e){return s(e)?new x:b(e)?e:new x(e)}var N,A;!function(e){e[e.Element=1]="Element",e[e.FC=2]="FC",e[e.Text=4]="Text",e[e.Fragment=8]="Fragment",e[e.Portal=16]="Portal",e[e.Svg=32]="Svg"}(N||(N={})),function(e){e[e.Multiple=1]="Multiple",e[e.Single=2]="Single",e[e.NoChildren=8]="NoChildren"}(A||(A={}));const T=Symbol("Fragment"),P=Symbol("Portal");class R{constructor(e,t,n,l){this.data={},this._isVNode=!0,this.el=null,this._instance=null,this.type=e,"function"==typeof e?(this.flags=N.FC,this._instance={_props:Object.assign({children:[]},t),_render:null,_mounted:!1,_vnode:null,_update:null,_onMount:[],_onUnmount:[]}):this.flags="string"==typeof e?"svg"===e?N.Svg:N.Element:e===T?N.Fragment:e===P?N.Portal:N.Text,c(l)?this.key=l:c(t.key)?(this.key=t.key,delete t.key):this.key=null,this.data=t;Array.isArray(n)?(this.children=n.map((e=>r(e)?e:B(null,null,e+""))),this.childFlags=A.Multiple):r(n)?(this.children=n,this.childFlags=A.Single):c(n)?this.flags&N.Text?(this.childFlags=A.NoChildren,this.children=n.toString()):(this.childFlags=A.Single,this.children=B(null,null,n.toString())):(this.childFlags=A.NoChildren,this.children=null)}}function j(e,t){return n=>("function"==typeof e&&(e=D(e,n)),()=>D(P,{children:e},t))}function B(e,t,...n){let l=null;return 0===n.length?l=null:1===n.length?(l=n[0],"object"!=typeof l&&(l+="")):l=n,new R(e,t||{},l)}const D=(e,t,n)=>{let{children:l}=t;if(o(l)){let e=!1,t=[];for(const n of l)if(o(n)){e=!0,t=n;break}if(e){const e={};for(const n of t)if(c(n.key)){if(n.key in e){console.error("[key property] can not be the same \nduplicated key: \n"+n.key);break}e[n.key]=!0}else console.error("child in an array must have a key \n");l=l.flat()}}return new R(e,t,l,n)},z=D,W=[];let L=!1;const O=e=>{W.includes(e)||W.push(e),L||(L=!0,Promise.resolve().then(U))},U=()=>{W.forEach((e=>e())),W.length=0,L=!1},V=/\[A-Z]|^(?:value|checked|selected|muted)$/;let Z=null;const $={getElement:e=>document.querySelector(e),createElement:e=>document.createElement(e),createTextNode:e=>document.createTextNode(e),createComment:e=>document.createComment(e),createSvgElement:e=>document.createElementNS("http://www.w3.org/2000/svg",e),appendChild:(e,t)=>e.appendChild(t),insertBefore:(e,t,n)=>e.insertBefore(t,n),removeChild:(e,t)=>e.removeChild(t),setAttribute(e,t,n){/\[A-Z]|^(?:value|checked|selected|muted)$/.test(t)?e[t]=n:"key"!==t&&"children"!==t&&e.setAttribute(t,n)},setText:(e,t)=>e.textContent=t,patchData(e,t,n,l,i){if(n!==l&&!(i&&i&N.Element&&"children"===t))switch(t){case"style":if(n)for(const t in n)e.style[t]=n[t];if(l)for(const t in l)n&&n[t]===l[t]||(e.style[t]="");break;case"class":e.className=n;break;default:if(t.startsWith("on")){const i=t.split("on")[1].toLowerCase();n&&e.addEventListener(i,n),l&&e.removeEventListener(i,l)}else V.test(t)?e[t]=n:e.setAttribute(t,n)}}};function q(e){function t(n,l,i,o){if(s(n))return;const{flags:r}=n;r&N.FC?function(e,n,l,i){const{type:o}=e;e._instance._update=()=>{var o;if(e._instance._mounted){const t=e._instance._vnode,i=e._instance._render(),r=null===(o=null==t?void 0:t.el)||void 0===o?void 0:o.nextSibling;a(i,t,n,l,r),e._instance._vnode=i}else{const o=e._instance._vnode=e._instance._render();t(o,n,l,i),e.el=o.el,e._instance._mounted=!0;for(const t of e._instance._onMount)t()}},Z=e._instance,e._instance._render=o(e._instance._props),Z=null,d((()=>{e._instance._update()}),{scheduler:O})}(n,l,i,o):r&(N.Element|N.Svg)?function(n,l,i,o){const{data:r,childFlags:s,children:c,type:a}=n,f=n.el=i?e.createSvgElement(a):e.createElement(a);r.ref&&(r.ref.value=f);for(const t in r)e.patchData(f,t,r[t],null,N.Element);o?e.insertBefore(l,f,o):e.appendChild(l,f);!function(e,n,l,i,o){if(e&A.NoChildren)return;if(e&A.Single)t(n,i,o);else if(e&A.Multiple){const e=l.el;for(const l of n)t(l,e,o)}}(s,c,n,f,i)}(n,l,i,o):r&N.Text?function(t,n,l){const i=e.createTextNode(t.children);t.el=i,l?e.insertBefore(n,i,l):e.appendChild(n,i)}(n,l,o):r&N.Portal?function(n){const l=n.el="string"==typeof n.key?e.getElement(n.key):n.key;t(n.children,l,!1)}(n):function(n,l,i,o){const{children:r}=n;Array.isArray(r)?r.forEach((e=>t(e,l,i,o))):r&&t(r,l,i,o);const s=e.createComment("__FRAGMENT_END__");n.el=s,o?e.insertBefore(l,s,o):e.appendChild(l,s)}(n,l,i,o)}function o(t,n){const{flags:l,children:i,el:s}=t;if(l&N.Element||l&N.Text)e.removeChild(n,t.el);else if(l&N.FC)r(t,n);else if(l&N.Fragment)Array.isArray(i)?i.forEach((e=>o(e,n))):i&&o(i,n),e.removeChild(n,s);else if(l&N.Portal){const e=t.el;o(t.children,e)}}function r(t,n){const{childFlags:l,children:i}=t,o=t.el;if(l&A.Multiple)for(const e of i)e.flags&N.FC&&r(e,o);let s=t._instance._onUnmount;if(s.length)for(const e of s)e();t._instance=null,e.removeChild(n,o)}function a(i,r,s,c,u){if(i&&r)if(n(i,r)){const t=i.flags;t&N.FC?function(e,t){if(e.el=t.el,e._instance=t._instance,function(e,t){const n=e._instance._props,i=t._instance._props;return delete n.children,delete i.children,l(n,i)}(e,t))return;const n=e._instance._props,i=t._instance._props;for(const t in n)n[t]!==i[t]&&(e._instance._props[t]=n[t]);e._instance._update()}(i,r):t&N.Text?function(t,n){const l=t.el=n.el;t.children!==n.children&&e.setText(l,t.children)}(i,r):t&N.Element?function(t,n,l){const i=t.el=n.el;for(const l in t.data)e.patchData(i,l,t.data[l],n.data[l],N.Element);for(const l in n.data)t.data[l]||e.patchData(i,l,null,n.data[l],N.Element);f(t,n,l)}(i,r,c):t&N.Portal?function(e,t){const n=e.el=t.el;a(e.children,t.children,n,!1)}(i,r):function(e,t,n,l){const i=e.el=t.el;f(e,t,l,n,i)}(i,r,s,c)}else!function(e,n,l,i){var r;const s=null===(r=n.el)||void 0===r?void 0:r.nextSibling;o(n,l),t(e,l,i,s)}(i,r,s,c);else i?t(i,s,c,u):r&&o(r,s)}function f(n,l,r,s,f){const{childFlags:u,children:d}=n,{childFlags:h,children:p}=l,g=s||l.el;if(u&A.NoChildren){if(h&A.Single)o(p,g);else if(h&A.Multiple)for(const e of p)o(e,g)}else if(u&A.Single){if(h&A.NoChildren)t(d,g,r,f);else if(h&A.Single)a(d,p,g,r,f);else if(h&A.Multiple){for(const e of p)o(e,g);t(d,g,r,f)}}else if(u&A.Multiple)if(h&A.NoChildren)for(const e of d)t(e,g,r,f);else if(h&A.Single){o(p,g);for(const e of d)t(e,g,r,f)}else h&A.Multiple&&function(n,l,r,s,f){let u=0,d=n.length-1,h=n[u],p=l.length-1,g=l[u];e:{for(;u<=d&&u<=p&&h.key===g.key;){if(a(h,g,r,s),u++,u>d||u>p)break e;h=n[u],g=l[u]}for(h=n[d],g=l[p];u<=d&&u<=p&&h.key===g.key;){if(a(h,g,r,s),d--,p--,u>d||u>p)break e;h=n[d],g=l[p]}}if(u>d&&u<=p)for(let e=u;e<=p;e++)o(l[e],r);else if(u>p){const e=p+1>=l.length?void 0:l[p+1].el;for(let l=u;l<=d;l++)t(n[l],r,s,e)}else{let _=!1,y=0,m=0;const v=d-u+1,k=new Array(v).fill(-1),C={},w={};for(let e=0;e<v;e++)C[n[u+e].key]=e;for(let e=u;e<=p;e++)if(g=l[e],w[g.key]=!0,m<v){const t=C[g.key];c(t)?(h=n[t+u],a(h,g,r,s),m++,k[t]=e,t<y?_=!0:y=t):o(g,r)}else o(g,r);if(_){const l=i(k);let o=l.length-1;for(let i=d;i>=u;i--){if(h=n[i],-1===k[i]){t(h,r,s,i+1<n.length?n[i+1].el:void 0)}if(i===l[o])o--;else{const t=i+1<n.length?n[i+1].el:void 0;e.insertBefore(r,h.el,t)}}}else for(let e=d;e>=u;e--)if(h=n[e],!w[h.key]){t(h,r,s,(e+1>=n.length?void 0:n[e+1].el)||f)}}}(d,p,g,r,f)}return function(e,t){const n=!!(e.flags&N.Svg);a(e,t.vnode,t,n)}}const G=()=>!!Z||(_warn("hook must be called inside a function component"),!1),H=e=>{G()&&Z._onMount.push(e)},I=e=>{G()&&Z._onUnmount.push(e)},J=e=>{G()&&Z._props.ref&&(Z._props.ref.value=e)},K=(e,t)=>{t||(t=$);const n=q(t);return{mount(l){l?"string"!=typeof l||(l=t.getElement(l))?n(e,l):console.warn("无效的id或者class"):console.warn("请指定一个挂在节点的id或者class或者dom节点")}}};export{A as ChildrenFlags,T as Fragment,P as Portal,x as Ref,R as VNode,N as VNodeFlags,Z as _currentMountingFC,t as _err,e as _warn,f as activeEffect,$ as baseNodeOps,G as checkHookAvailable,K as createApp,h as createEffect,j as createPortal,q as createRenderer,d as effect,a as effectStack,J as expose,B as h,o as isArray,c as isDef,r as isObject,b as isRef,n as isSameVNode,s as isUndef,D as jsx,z as jsxs,i as lis,F as markRaw,H as onMounted,I as onUnmounted,m as pauseTracking,E as reactive,M as ref,v as resetTracking,l as shallowEqual,y as stop,S as toRaw,_ as track,p as trigger};
