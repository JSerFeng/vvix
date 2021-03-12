const e=e=>null==e,t=e=>null!=e,n=[];let l=null,i=!1;function o(e,t={lazy:!1,active:!0}){const n=r(e,t);return n.lazy||n(),n}function r(e,t){const o=function t(...r){t.active&&!i&&(n.includes(o)||(n.push(t),l=o,e(...r),n.pop(),l=null))};return o.lazy=t.lazy||!1,o.active=t.active||!0,o.raw=e,o.deps=[],o.scheduler=t.scheduler||null,o}const s=(e,t)=>{const n=c.get(e);if(!n)return;const i=n.get(t);i&&i.forEach((e=>{e!==l&&(e.scheduler?e.scheduler(e):e())}))},c=new WeakMap,a=(e,t)=>{if(!l)return;let n=c.get(e);n||c.set(e,n=new Map);let i=n.get(t);i||n.set(t,i=new Set),i.has(l)||(i.add(l),l.deps.push(i))},u=e=>{e.active=!1},f=()=>{i=!0},d=()=>{i=!1},h=new WeakMap,p=new WeakMap,_={get(e,t,n){if("_mark"===t)return!0;if("_raw"===t)return e;const l=Reflect.get(e,t,n);return a(e,t),"object"==typeof l?g(l):l},set(e,t,n,l){const i=e[t],o=Reflect.set(e,t,n,l);return n!==i&&s(e,t),o},has(e,t){const n=Reflect.has(e,t);return a(e,t),n},deleteProperty(e,t){const n=Reflect.deleteProperty(e,t);return s(e,t),n}},g=e=>{if("object"!=typeof e)return e;if(e._raw)return e;let t;return(t=h.get(e))||(t=new Proxy(e,_),p.set(t,e)),t},v=e=>p.get(e)||e,m=e=>(e._raw=!0,e);class y{constructor(t){this._isRef=!0,e(t)?this._value=null:this._value=(e=>"object"==typeof e&&null!==e)(t)?g(t):t}get value(){return a(this,"value"),this._value}set value(e){e!==this._value&&(this._value=e,s(this,"value"))}}function C(t){return e(t)?new y:(e=>e&&!!e._isRef)(t)?t:new y(t)}var k,w;!function(e){e[e.Element=1]="Element",e[e.FC=2]="FC",e[e.Text=4]="Text",e[e.Fragment=8]="Fragment"}(k||(k={})),function(e){e[e.Multiple=1]="Multiple",e[e.Single=2]="Single",e[e.NoChildren=8]="NoChildren"}(w||(w={}));const E=Symbol("Fragment");class F{constructor(e,n,l){this.data={},this._isVNode=!0,this.el=null,this._instance=null,this.type=e,"function"==typeof e?(this.flags=k.FC,this._instance={_props:{children:[],...n},_render:null,_mounted:!1,_vnode:null,_update:null,_onMount:[],_onUnmount:[]}):this.flags="string"==typeof e?k.Element:e===E?k.Fragment:k.Text,this.data=n,this.key=t(n.key)?n.key:null;Array.isArray(l)?(this.children=l.map((e=>"string"==typeof e?b(null,null,e):e)),this.childFlags=w.Multiple):"object"==typeof l&&null!==l?(this.children=l,this.childFlags=w.Single):"string"==typeof l?this.flags&k.Text?(this.childFlags=w.NoChildren,this.children=l):(this.childFlags=w.Single,this.children=b(null,null,l)):(this.childFlags=w.NoChildren,this.children=null)}}function b(e,t,...n){let l=null;return 0===n.length?l=null:1===n.length?(l=n[0],"object"!=typeof l&&(l+="")):l=n,new F(e,t||{},l)}const A=(e,t,n)=>{let{children:l}=t;return void 0===l?l=[]:Array.isArray(l)||(l=[l]),b(e,{key:n,...t},...l)},M=A,x=[];let N=!1;const S=e=>{x.includes(e)||x.push(e),N||(N=!0,Promise.resolve().then(T))},T=()=>{x.forEach((e=>e())),x.length=0,N=!1},j=/\[A-Z]|^(?:value|checked|selected|muted)$/;let R=null;const B={getElement:e=>document.querySelector(e),createElement:e=>document.createElement(e),createTextNode:e=>document.createTextNode(e),appendChild:(e,t)=>e.appendChild(t),insertBefore:(e,t,n)=>e.insertBefore(t,n),removeChild:(e,t)=>e.removeChild(t),setAttribute(e,t,n){/\[A-Z]|^(?:value|checked|selected|muted)$/.test(t)?e[t]=n:"key"!==t&&"children"!==t&&e.setAttribute(t,n)},setText:(e,t)=>e.textContent=t,patchData(e,t,n,l,i){if(n!==l&&!(i&&i&k.Element&&"children"===t))switch(t){case"style":if(n)for(const t in n)e.style[t]=n[t];if(l)for(const t in l)n&&n[t]===l[t]||(e.style[t]="");break;case"class":e.className=n;break;default:if(t.startsWith("on")){const i=t.split("on")[1].toLowerCase();n&&e.addEventListener(i,n),l&&e.removeEventListener(i,l)}else j.test(t)?e[t]=n:e.setAttribute(t,n)}}};function z(n){function l(t,i,r){if(e(t))return;const{flags:c}=t;c&k.FC?function(e,t,n){const{type:i}=e;e._instance._update=()=>{if(e._instance._mounted){const n=e._instance._vnode,l=e._instance._render();s(l,n,t),e._instance._vnode=l}else{const i=e._instance._vnode=e._instance._render();l(i,t,n),e.el=i.el,e._instance._mounted=!0;for(const t of e._instance._onMount)t()}},R=e._instance,e._instance._render=i(e._instance._props),R=null,o((()=>{e._instance._update()}),{scheduler:S})}(t,i,r):c&k.Element?function(e,t,i){const{data:o,childFlags:r,children:s}=e,c=e.el=n.createElement(e.type);o.ref&&(o.ref.value=c);for(const e in o)n.patchData(c,e,o[e],null,k.Element);i?n.insertBefore(t,c,i):n.appendChild(t,c);!function(e,t,n,i){if(e&w.NoChildren)return;e&w.Single?l(t,i):e&w.Multiple&&function(e,t){for(const n of t)l(n,e.el)}(n,t)}(r,s,e,c)}(t,i,r):c&k.Text?function(e,t,l){const i=n.createTextNode(e.children);e.el=i,l?n.insertBefore(t,i,l):n.appendChild(t,i)}(t,i,r):function(e,t,n){const{children:i}=e;Array.isArray(i)?(i.forEach((e=>l(e,t,n))),e.el=i[0].el):i&&(l(i,t,n),e.el=i.el)}(t,i,r)}function i(e,t){const{flags:l,children:o}=e;l&k.Element||l&k.Text?n.removeChild(t,e.el):l&k.FC?r(e,t):l&k.Fragment&&(Array.isArray(o)?o.forEach((e=>i(e,t))):o&&i(o,t))}function r(e,t){const{childFlags:n,children:l}=e,i=e.el;if(n&w.Multiple)for(const e of l)e.flags&k.FC&&r(e,i);let o=e._instance._onUnmount;if(o.length)for(const e of o)e();t.removeChild(i)}function s(e,t,i){if(e&&t)if(r=t,(o=e).flags===r.flags&&o.type===r.type){const l=e.flags;l&k.FC?function(e,t){if(e.el=t.el,e._instance=t._instance,function(e,t){const n=e._instance._props,l=t._instance._props;return delete n.children,delete l.children,((e,t)=>{if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!(n in t)||e[n]!==t[n])return!1;return!0})(n,l)}(e,t))return;const n=e._instance._props,l=t._instance._props;for(const t in n)n[t]!==l[t]&&(e._instance._props[t]=n[t]);e._instance._update()}(e,t):l&k.Text?function(e,t){const l=e.el=t.el;e.children!==t.children&&n.setText(l,e.children)}(e,t):l&k.Element?function(e,t){const l=e.el=t.el;for(const i in e.data)n.patchData(l,i,e.data[i],t.data[i],k.Element);for(const i in t.data)e.data[i]||n.patchData(l,i,null,t.data[i],k.Element);c(e,t)}(e,t):function(e,t){c(e,t)}(e,t)}else!function(e,t,n){n.removeChild(t.el),l(e,n)}(e,t,i);else e?l(e,i):t&&n.removeChild(i,t.el);var o,r}function c(e,o){const{childFlags:r,children:c}=e,{childFlags:a,children:u,el:f}=o;if(r&w.NoChildren){if(a&w.Single)i(u,f);else if(a&w.Multiple)for(const e of u)i(e,f)}else if(r&w.Single){if(a&w.NoChildren)l(c,f);else if(a&w.Single)s(c,u,f);else if(a&w.Multiple){for(const e of u)i(e,f);l(c,f)}}else if(r&w.Multiple)if(a&w.NoChildren)for(const e of c)l(e,f);else if(a&w.Single){i(u,f);for(const e of c)l(e,f)}else a&w.Multiple&&function(e,o,r){let c=0,a=e.length-1,u=e[c],f=o.length-1,d=o[c];e:{for(;c<=a&&c<=f&&u.key===d.key;){if(s(u,d,r),c++,c>a||c>f)break e;u=e[c],d=o[c]}for(u=e[a],d=o[f];c<=a&&c<=f&&u.key===d.key;){if(s(u,d,r),a--,f--,c>a||c>f)break e;u=e[a],d=o[f]}}if(c>a&&c<=f)for(let e=c;e<=f;e++)i(o[e],r);else if(c>f){const t=f+1>=o.length?void 0:o[f+1].el;for(let n=c;n<=a;n++)l(e[n],r,t)}else{let h=!1,p=0,_=0;const g=a-c+1,v=new Array(g).fill(-1),m={};for(let t=0;t<g;t++)m[e[c+t].key]=t;for(let n=c;n<=f;n++)if(d=o[n],_<g){const l=m[d.key];t(l)?(u=e[l+c],s(u,d,r),_++,v[l]=n,l<p?h=!0:p=l):i(d,r)}else i(d,r);if(h){const t=(e=>{const t=e.length;if(0===t)return[];if(1===t)return[0];const n=new Array(t).fill(1),l=[];let i=-1;for(let l=t-1;l>=0;l--){const o=e[l];for(let r=l+1;r<t;r++)o<e[r]&&(n[l]=Math.max(n[l],1+n[r]),(-1===i||n[i]<n[l])&&(i=l))}if(-1===i)return[];for(;i<t;){const e=n[i];for(l.push(i++);n[i]!==e-1&&i<t;)i++}return l})(v);let i=t.length-1;for(let o=a;o>=c;o--){if(u=e[o],-1===v[o]){l(u,r,o+1<e.length?e[o+1].el:void 0)}if(o===t[i])i--;else{const t=o+1<e.length?e[o+1].el:void 0;n.insertBefore(r,u.el,t)}}}}}(c,u,f)}return function(e,t){const n=t.vnode;n?e?(s(e,n,t),t.vnode=e):(t.removeChild(n.el),t.vnode=null):(l(e,t),t.vnode=e)}}const D=e=>{W()&&R._onMount.push(e)},O=e=>{W()&&R._onUnmount.push(e)},P=e=>{W()&&R._props.ref&&(R._props.ref.value=e)},W=()=>{return!!R||(e="hook must be called inside a function component",console.warn(e),!1);var e},I=z(B),L=(e,t)=>{t||(t=B);const n=z(t);return{mount(l){l?"string"!=typeof l||(l=t.getElement(l))?n(e,l):console.warn("无效的id或者class"):console.warn("请指定一个挂在节点的id或者class或者dom节点")}}},U=({title:e,content:t})=>()=>M("div",{children:[A("h1",{children:e},void 0),A("p",{children:t},void 0)]},void 0);L(A((()=>{const e=C([{id:0,title:"Johnson",content:"I love React"},{id:1,title:"Author",content:"And I love Vue more"},{id:2,title:"Jack",content:"But I hate webpack"}]),t=()=>{e.value.reverse()};return()=>M(E,{children:[A("ul",Object.assign({onClick:t},{children:e.value.map((e=>A(U,Object.assign({},e),e.id)))}),void 0),A("button",{children:"click me"},void 0)]},void 0)}),{},void 0)).mount("#app");export{w as ChildrenFlags,E as Fragment,y as Ref,F as VNode,k as VNodeFlags,l as activeEffect,B as baseNodeOps,W as checkHookAvailable,L as createApp,r as createEffect,z as createRenderer,o as effect,n as effectStack,P as expose,b as h,A as jsx,M as jsxs,m as markRaw,D as onMounted,O as onUnmounted,f as pauseTracking,S as queueJob,g as reactive,C as ref,I as render,d as resetTracking,u as stop,v as toRaw,a as track,s as trigger};
