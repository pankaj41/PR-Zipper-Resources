(()=>{var e={162:function(e,t,o){var n,r;void 0===(r="function"==typeof(n=function(){"use strict";function t(e,t,o){var n=new XMLHttpRequest;n.open("GET",e),n.responseType="blob",n.onload=function(){s(n.response,t,o)},n.onerror=function(){console.error("could not download file")},n.send()}function n(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function r(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(o){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var a="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof o.g&&o.g.global===o.g?o.g:void 0,i=a.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),s=a.saveAs||("object"!=typeof window||window!==a?function(){}:"download"in HTMLAnchorElement.prototype&&!i?function(e,o,i){var s=a.URL||a.webkitURL,c=document.createElement("a");o=o||e.name||"download",c.download=o,c.rel="noopener","string"==typeof e?(c.href=e,c.origin===location.origin?r(c):n(c.href)?t(e,o,i):r(c,c.target="_blank")):(c.href=s.createObjectURL(e),setTimeout((function(){s.revokeObjectURL(c.href)}),4e4),setTimeout((function(){r(c)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,o,a){if(o=o||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(function(e,t){return void 0===t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}(e,a),o);else if(n(e))t(e,o,a);else{var i=document.createElement("a");i.href=e,i.target="_blank",setTimeout((function(){r(i)}))}}:function(e,o,n,r){if((r=r||open("","_blank"))&&(r.document.title=r.document.body.innerText="downloading..."),"string"==typeof e)return t(e,o,n);var s="application/octet-stream"===e.type,c=/constructor/i.test(a.HTMLElement)||a.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent);if((l||s&&c||i)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=l?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=e:location=e,r=null},u.readAsDataURL(e)}else{var f=a.URL||a.webkitURL,d=f.createObjectURL(e);r?r.location=d:location.href=d,r=null,setTimeout((function(){f.revokeObjectURL(d)}),4e4)}});a.saveAs=s.saveAs=s,e.exports=s})?n.apply(t,[]):n)||(e.exports=r)}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,o),a.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=o(162);let t,n=!1,r="";chrome.storage.local.get("data",(function(e){var t=e.data;t&&(r=t)}));const a=new MutationObserver((function(e,o){const a=window.location.href.includes("pull");a&&setTimeout((function(){if(a){const a=document.querySelectorAll("nav.tabnav-tabs.d-flex.overflow-auto");t=a[0];var e=document.createElement("a");e.href="",e.textContent="Download all changed files",e.id="Download all files",e.style.color="grey",e.style.margin="10px 10px 0px 10px",e.addEventListener("mouseover",(function(){e.style.color="green",e.style.textDecoration="none"})),e.addEventListener("mouseout",(function(){e.style.color="grey",e.style.textDecoration="none"})),t&&(document.getElementById("Download all files")||(o.disconnect(),t.appendChild(e)),document.getElementById("Download all files").addEventListener("click",(async()=>{if(!n)if(n=!0,setTimeout((()=>{n=!1}),1e3),""!==r&&r){const e=r,t=window.location.href.split("/"),o=t[3],n=t[4],a=t[6];fetch(`https://api.github.com/repos/${o}/${n}/pulls/${a}/files`,{headers:{Authorization:`Bearer ${e}`}}).then((e=>e.json())).then((e=>{const t=[];var o;e.forEach((e=>{t.push(e)})),o={action:"downloadFile",files:t,repoName:n,prName:a},chrome.runtime.sendMessage(o)})).catch((e=>{console.log("chck",e)}))}else alert("Please first enter token, by clicking on this extension's icon.")})),o.observe(document,i))}}),500)})),i={childList:!0,subtree:!0};a.observe(document,i),chrome.runtime.onMessage.addListener((function(t){const o=t.message;if("Hello from background.js!"===o){const o=function(e){const t=e.split(";base64,"),o=t[0].split(":")[1],n=atob(t[1]),r=[];for(let e=0;e<n.length;e+=512){const t=n.slice(e,e+512),o=new Array(t.length);for(let e=0;e<t.length;e++)o[e]=t.charCodeAt(e);const a=new Uint8Array(o);r.push(a)}return new Blob(r,{type:o})}(t.info);(0,e.saveAs)(o,`${t.repo}-${t.pullNumber}.zip`)}"Message from popup.js"===o&&(chrome.storage.local.set({data:t.info}),r=t.info),"Message from popup.js, please remove PAT"===o&&(chrome.storage.local.remove("data",(function(){})),r="")}))})()})();