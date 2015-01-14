(function(){var n=this,t=n._,r=Array.prototype,e=Object.prototype,u=Function.prototype,i=r.push,a=r.slice,o=r.concat,l=e.toString,c=e.hasOwnProperty,f=Array.isArray,s=Object.keys,p=u.bind,h=function(n){return n instanceof h?n:this instanceof h?void(this._wrapped=n):new h(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=h),exports._=h):n._=h,h.VERSION="1.7.0";var g=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}};h.iteratee=function(n,t,r){return null==n?h.identity:h.isFunction(n)?g(n,t,r):h.isObject(n)?h.matches(n):h.property(n)},h.each=h.forEach=function(n,t,r){if(null==n)return n;t=g(t,r);var e,u=n.length;if(u===+u)for(e=0;u>e;e++)t(n[e],e,n);else{var i=h.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},h.map=h.collect=function(n,t,r){if(null==n)return[];t=h.iteratee(t,r);for(var e,u=n.length!==+n.length&&h.keys(n),i=(u||n).length,a=Array(i),o=0;i>o;o++)e=u?u[o]:o,a[o]=t(n[e],e,n);return a};var v="Reduce of empty array with no initial value";h.reduce=h.foldl=h.inject=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length,o=0;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[o++]:o++]}for(;a>o;o++)u=i?i[o]:o,r=t(r,n[u],u,n);return r},h.reduceRight=h.foldr=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[--a]:--a]}for(;a--;)u=i?i[a]:a,r=t(r,n[u],u,n);return r},h.find=h.detect=function(n,t,r){var e;return t=h.iteratee(t,r),h.some(n,function(n,r,u){return t(n,r,u)?(e=n,!0):void 0}),e},h.filter=h.select=function(n,t,r){var e=[];return null==n?e:(t=h.iteratee(t,r),h.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e)},h.reject=function(n,t,r){return h.filter(n,h.negate(h.iteratee(t)),r)},h.every=h.all=function(n,t,r){if(null==n)return!0;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,!t(n[u],u,n))return!1;return!0},h.some=h.any=function(n,t,r){if(null==n)return!1;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,t(n[u],u,n))return!0;return!1},h.contains=h.include=function(n,t){return null==n?!1:(n.length!==+n.length&&(n=h.values(n)),h.indexOf(n,t)>=0)},h.invoke=function(n,t){var r=a.call(arguments,2),e=h.isFunction(t);return h.map(n,function(n){return(e?t:n[t]).apply(n,r)})},h.pluck=function(n,t){return h.map(n,h.property(t))},h.where=function(n,t){return h.filter(n,h.matches(t))},h.findWhere=function(n,t){return h.find(n,h.matches(t))},h.max=function(n,t,r){var e,u,i=-1/0,a=-1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],e>i&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(u>a||u===-1/0&&i===-1/0)&&(i=n,a=u)});return i},h.min=function(n,t,r){var e,u,i=1/0,a=1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],i>e&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(a>u||1/0===u&&1/0===i)&&(i=n,a=u)});return i},h.shuffle=function(n){for(var t,r=n&&n.length===+n.length?n:h.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=h.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},h.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=h.values(n)),n[h.random(n.length-1)]):h.shuffle(n).slice(0,Math.max(0,t))},h.sortBy=function(n,t,r){return t=h.iteratee(t,r),h.pluck(h.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var m=function(n){return function(t,r,e){var u={};return r=h.iteratee(r,e),h.each(t,function(e,i){var a=r(e,i,t);n(u,e,a)}),u}};h.groupBy=m(function(n,t,r){h.has(n,r)?n[r].push(t):n[r]=[t]}),h.indexBy=m(function(n,t,r){n[r]=t}),h.countBy=m(function(n,t,r){h.has(n,r)?n[r]++:n[r]=1}),h.sortedIndex=function(n,t,r,e){r=h.iteratee(r,e,1);for(var u=r(t),i=0,a=n.length;a>i;){var o=i+a>>>1;r(n[o])<u?i=o+1:a=o}return i},h.toArray=function(n){return n?h.isArray(n)?a.call(n):n.length===+n.length?h.map(n,h.identity):h.values(n):[]},h.size=function(n){return null==n?0:n.length===+n.length?n.length:h.keys(n).length},h.partition=function(n,t,r){t=h.iteratee(t,r);var e=[],u=[];return h.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},h.first=h.head=h.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:a.call(n,0,t)},h.initial=function(n,t,r){return a.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},h.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},h.rest=h.tail=h.drop=function(n,t,r){return a.call(n,null==t||r?1:t)},h.compact=function(n){return h.filter(n,h.identity)};var y=function(n,t,r,e){if(t&&h.every(n,h.isArray))return o.apply(e,n);for(var u=0,a=n.length;a>u;u++){var l=n[u];h.isArray(l)||h.isArguments(l)?t?i.apply(e,l):y(l,t,r,e):r||e.push(l)}return e};h.flatten=function(n,t){return y(n,t,!1,[])},h.without=function(n){return h.difference(n,a.call(arguments,1))},h.uniq=h.unique=function(n,t,r,e){if(null==n)return[];h.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=h.iteratee(r,e));for(var u=[],i=[],a=0,o=n.length;o>a;a++){var l=n[a];if(t)a&&i===l||u.push(l),i=l;else if(r){var c=r(l,a,n);h.indexOf(i,c)<0&&(i.push(c),u.push(l))}else h.indexOf(u,l)<0&&u.push(l)}return u},h.union=function(){return h.uniq(y(arguments,!0,!0,[]))},h.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!h.contains(t,i)){for(var a=1;r>a&&h.contains(arguments[a],i);a++);a===r&&t.push(i)}}return t},h.difference=function(n){var t=y(a.call(arguments,1),!0,!0,[]);return h.filter(n,function(n){return!h.contains(t,n)})},h.zip=function(n){if(null==n)return[];for(var t=h.max(arguments,"length").length,r=Array(t),e=0;t>e;e++)r[e]=h.pluck(arguments,e);return r},h.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},h.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=h.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}for(;u>e;e++)if(n[e]===t)return e;return-1},h.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=n.length;for("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1));--e>=0;)if(n[e]===t)return e;return-1},h.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var d=function(){};h.bind=function(n,t){var r,e;if(p&&n.bind===p)return p.apply(n,a.call(arguments,1));if(!h.isFunction(n))throw new TypeError("Bind must be called on a function");return r=a.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(a.call(arguments)));d.prototype=n.prototype;var u=new d;d.prototype=null;var i=n.apply(u,r.concat(a.call(arguments)));return h.isObject(i)?i:u}},h.partial=function(n){var t=a.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===h&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},h.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=h.bind(n[r],n);return n},h.memoize=function(n,t){var r=function(e){var u=r.cache,i=t?t.apply(this,arguments):e;return h.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},h.delay=function(n,t){var r=a.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},h.defer=function(n){return h.delay.apply(h,[n,1].concat(a.call(arguments,1)))},h.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var l=function(){o=r.leading===!1?0:h.now(),a=null,i=n.apply(e,u),a||(e=u=null)};return function(){var c=h.now();o||r.leading!==!1||(o=c);var f=t-(c-o);return e=this,u=arguments,0>=f||f>t?(clearTimeout(a),a=null,o=c,i=n.apply(e,u),a||(e=u=null)):a||r.trailing===!1||(a=setTimeout(l,f)),i}},h.debounce=function(n,t,r){var e,u,i,a,o,l=function(){var c=h.now()-a;t>c&&c>0?e=setTimeout(l,t-c):(e=null,r||(o=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,a=h.now();var c=r&&!e;return e||(e=setTimeout(l,t)),c&&(o=n.apply(i,u),i=u=null),o}},h.wrap=function(n,t){return h.partial(t,n)},h.negate=function(n){return function(){return!n.apply(this,arguments)}},h.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},h.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},h.before=function(n,t){var r;return function(){return--n>0?r=t.apply(this,arguments):t=null,r}},h.once=h.partial(h.before,2),h.keys=function(n){if(!h.isObject(n))return[];if(s)return s(n);var t=[];for(var r in n)h.has(n,r)&&t.push(r);return t},h.values=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},h.pairs=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},h.invert=function(n){for(var t={},r=h.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},h.functions=h.methods=function(n){var t=[];for(var r in n)h.isFunction(n[r])&&t.push(r);return t.sort()},h.extend=function(n){if(!h.isObject(n))return n;for(var t,r,e=1,u=arguments.length;u>e;e++){t=arguments[e];for(r in t)c.call(t,r)&&(n[r]=t[r])}return n},h.pick=function(n,t,r){var e,u={};if(null==n)return u;if(h.isFunction(t)){t=g(t,r);for(e in n){var i=n[e];t(i,e,n)&&(u[e]=i)}}else{var l=o.apply([],a.call(arguments,1));n=new Object(n);for(var c=0,f=l.length;f>c;c++)e=l[c],e in n&&(u[e]=n[e])}return u},h.omit=function(n,t,r){if(h.isFunction(t))t=h.negate(t);else{var e=h.map(o.apply([],a.call(arguments,1)),String);t=function(n,t){return!h.contains(e,t)}}return h.pick(n,t,r)},h.defaults=function(n){if(!h.isObject(n))return n;for(var t=1,r=arguments.length;r>t;t++){var e=arguments[t];for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n},h.clone=function(n){return h.isObject(n)?h.isArray(n)?n.slice():h.extend({},n):n},h.tap=function(n,t){return t(n),n};var b=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof h&&(n=n._wrapped),t instanceof h&&(t=t._wrapped);var u=l.call(n);if(u!==l.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]===n)return e[i]===t;var a=n.constructor,o=t.constructor;if(a!==o&&"constructor"in n&&"constructor"in t&&!(h.isFunction(a)&&a instanceof a&&h.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c,f;if("[object Array]"===u){if(c=n.length,f=c===t.length)for(;c--&&(f=b(n[c],t[c],r,e)););}else{var s,p=h.keys(n);if(c=p.length,f=h.keys(t).length===c)for(;c--&&(s=p[c],f=h.has(t,s)&&b(n[s],t[s],r,e)););}return r.pop(),e.pop(),f};h.isEqual=function(n,t){return b(n,t,[],[])},h.isEmpty=function(n){if(null==n)return!0;if(h.isArray(n)||h.isString(n)||h.isArguments(n))return 0===n.length;for(var t in n)if(h.has(n,t))return!1;return!0},h.isElement=function(n){return!(!n||1!==n.nodeType)},h.isArray=f||function(n){return"[object Array]"===l.call(n)},h.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},h.each(["Arguments","Function","String","Number","Date","RegExp"],function(n){h["is"+n]=function(t){return l.call(t)==="[object "+n+"]"}}),h.isArguments(arguments)||(h.isArguments=function(n){return h.has(n,"callee")}),"function"!=typeof/./&&(h.isFunction=function(n){return"function"==typeof n||!1}),h.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},h.isNaN=function(n){return h.isNumber(n)&&n!==+n},h.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===l.call(n)},h.isNull=function(n){return null===n},h.isUndefined=function(n){return n===void 0},h.has=function(n,t){return null!=n&&c.call(n,t)},h.noConflict=function(){return n._=t,this},h.identity=function(n){return n},h.constant=function(n){return function(){return n}},h.noop=function(){},h.property=function(n){return function(t){return t[n]}},h.matches=function(n){var t=h.pairs(n),r=t.length;return function(n){if(null==n)return!r;n=new Object(n);for(var e=0;r>e;e++){var u=t[e],i=u[0];if(u[1]!==n[i]||!(i in n))return!1}return!0}},h.times=function(n,t,r){var e=Array(Math.max(0,n));t=g(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},h.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},h.now=Date.now||function(){return(new Date).getTime()};var _={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},w=h.invert(_),j=function(n){var t=function(t){return n[t]},r="(?:"+h.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};h.escape=j(_),h.unescape=j(w),h.result=function(n,t){if(null==n)return void 0;var r=n[t];return h.isFunction(r)?n[t]():r};var x=0;h.uniqueId=function(n){var t=++x+"";return n?n+t:t},h.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var A=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},O=/\\|'|\r|\n|\u2028|\u2029/g,F=function(n){return"\\"+k[n]};h.template=function(n,t,r){!t&&r&&(t=r),t=h.defaults({},t,h.templateSettings);var e=RegExp([(t.escape||A).source,(t.interpolate||A).source,(t.evaluate||A).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(O,F),u=o+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(i+="';\n"+a+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=new Function(t.variable||"obj","_",i)}catch(o){throw o.source=i,o}var l=function(n){return a.call(this,n,h)},c=t.variable||"obj";return l.source="function("+c+"){\n"+i+"}",l},h.chain=function(n){var t=h(n);return t._chain=!0,t};var E=function(n){return this._chain?h(n).chain():n};h.mixin=function(n){h.each(h.functions(n),function(t){var r=h[t]=n[t];h.prototype[t]=function(){var n=[this._wrapped];return i.apply(n,arguments),E.call(this,r.apply(h,n))}})},h.mixin(h),h.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];h.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],E.call(this,r)}}),h.each(["concat","join","slice"],function(n){var t=r[n];h.prototype[n]=function(){return E.call(this,t.apply(this._wrapped,arguments))}}),h.prototype.value=function(){return this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return h})}).call(this);

var onMyTurn, onMyTurn1, onMyTurn2, onMyTurn3, that;

that = this;

onMyTurn1 = (function() {
  var backDir, game, i, ii, init, isDeadEnd, isDest, isGnome, isStartAtLeftTop, j, lastDir, log, map, mapH, mapPower, mapW, myLooked, myVisited, myWay, onMyTurn, prune, pruneJingWeiTianHai, rememberMap, simplifyMap, simplifyMapC, travelVision, travelVisions, _i, _j, _mapGet, _ref, _ref1;
  log = function() {
    return null;
  };
  game = {};
  mapH = 75;
  mapW = 100;
  map = [];
  myVisited = [];
  myLooked = [];
  mapPower = [];
  myWay = [];
  for (i = _i = 0, _ref = mapH - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    map[i] = [];
    myVisited[i] = [];
    myLooked[i] = [];
    mapPower[i] = [];
    for (j = _j = 0, _ref1 = mapW - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      myVisited[i][j] = 0;
      mapPower[i][j] = (i + j) * 100;
    }
  }
  mapPower[mapH - 1][mapW - 1] += 999999;
  mapPower[0][mapW - 1] += 10000;
  mapPower[mapH - 1][0] += 10000;
  lastDir = 2;
  isStartAtLeftTop = true;
  ii = 0;
  rememberMap = function() {
    return travelVisions(function(i, j) {
      if (map[i][j] === void 0) {
        return map[i][j] = game.map.data.get(i, j);
      }
    });
  };
  travelVision = function(gnome, callback) {
    var bottom, left, len, right, top, vision, _k, _results;
    vision = gnome.vision;
    top = Math.max(gnome.i - vision, 0);
    bottom = Math.min(gnome.i + vision, mapH - 1);
    _results = [];
    for (i = _k = top; top <= bottom ? _k <= bottom : _k >= bottom; i = top <= bottom ? ++_k : --_k) {
      len = vision - Math.abs(i - gnome.i);
      left = Math.max(gnome.j - len, 0);
      right = Math.min(gnome.j + len, mapW - 1);
      _results.push((function() {
        var _l, _results1;
        _results1 = [];
        for (j = _l = left; left <= right ? _l <= right : _l >= right; j = left <= right ? ++_l : --_l) {
          _results1.push(callback(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  travelVisions = function(callback) {
    var gnome, _k, _len, _ref2, _results;
    _ref2 = game.gnomes;
    _results = [];
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      _results.push(travelVision(gnome, callback));
    }
    return _results;
  };
  isDeadEnd = function(v) {
    return v === 1 || v === 2 || v === 4 || v === 8;
  };
  isGnome = function(i, j) {
    return _.any(game.gnomes, function(gnome) {
      return gnome.i === i && gnome.j === j;
    });
  };
  isDest = function(i, j) {
    return i === mapH - 1 && j === mapW - 1;
  };
  simplifyMap = function() {
    return travelVisions(function(i, j) {
      var d, _results;
      _results = [];
      while (isDeadEnd(map[i][j])) {
        if (isGnome(i, j) || isDest(i, j)) {
          break;
        }
        _i = i;
        _j = j;
        switch (map[i][j]) {
          case 1:
            i--;
            d = 4;
            break;
          case 2:
            j++;
            d = 8;
            break;
          case 4:
            i++;
            d = 1;
            break;
          case 8:
            j--;
            d = 2;
        }
        if (map[i][j] !== void 0) {
          map[_i][_j] = 0;
          if ((map[i][j] & d) > 0) {
            _results.push(map[i][j] -= d);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };
  simplifyMapC = function(m) {
    var _k, _ref2, _results;
    _results = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      _results.push((function() {
        var _l, _ref3, _results1;
        _results1 = [];
        for (j = _l = 0, _ref3 = mapW - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          _results1.push((function(i, j) {
            var d, __i, __j, _results2;
            _results2 = [];
            while (isDeadEnd(m[i][j])) {
              __i = i;
              __j = j;
              switch (m[i][j]) {
                case 1:
                  i--;
                  d = 4;
                  break;
                case 2:
                  j++;
                  d = 8;
                  break;
                case 4:
                  i++;
                  d = 1;
                  break;
                case 8:
                  j--;
                  d = 2;
              }
              if (m[i][j] !== void 0) {
                m[__i][__j] = 0;
                if ((map[i][j] & d) > 0) {
                  _results2.push(m[i][j] -= d);
                } else {
                  _results2.push(void 0);
                }
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  _mapGet = function(i, j) {
    var x, y;
    if (!isStartAtLeftTop) {
      x = mapH - i - 1;
      y = mapW - j - 1;
      return backDir[this[y][x]];
    } else {
      x = i;
      y = j;
      return this[y][x];
    }
  };
  backDir = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 1,
    5: 5,
    6: 9,
    7: 13,
    8: 2,
    9: 6,
    10: 10,
    11: 14,
    12: 3,
    13: 7,
    14: 11,
    15: 15
  };
  init = _.once(function() {
    isStartAtLeftTop = game.gnomes[0].x === 0 && game.gnomes[0].y === 0;
    mapH = game.height;
    return mapW = game.width;
  });
  onMyTurn = function(g) {
    var action, d, gi, gj, gnome, nd, ngi, ngj, powers, v, _k, _l, _len, _len1, _ref2, _ref3;
    game = g;
    ii++;
    init();
    game.map.data.get = _mapGet;
    game.map.visited.get = _mapGet;
    _ref2 = game.gnomes;
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      if (!isStartAtLeftTop) {
        gnome.i = mapH - gnome.y - 1;
        gnome.j = mapW - gnome.x - 1;
      } else {
        gnome.i = gnome.y;
        gnome.j = gnome.x;
      }
    }
    rememberMap();
    simplifyMap();
    prune(map);
    myWay.push((function() {
      var _l, _len1, _ref3, _results;
      _ref3 = game.gnomes;
      _results = [];
      for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
        gnome = _ref3[_l];
        _results.push({
          i: gnome.i,
          j: gnome.j
        });
      }
      return _results;
    })());
    action = [];
    gi = game.gnomes[0].i;
    gj = game.gnomes[0].j;
    v = map[gi][gj];
    myVisited[gi][gj]++;
    powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
    powers[2] += 110;
    powers[4] += 100;
    powers[backDir[lastDir]] -= 10000;
    _ref3 = _.filter([1, 2, 4, 8], function(x) {
      return (v & x) > 0;
    });
    for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
      d = _ref3[_l];
      switch (d) {
        case 1:
          ngi = gi - 1;
          ngj = gj;
          break;
        case 2:
          ngi = gi;
          ngj = gj + 1;
          break;
        case 4:
          ngi = gi + 1;
          ngj = gj;
          break;
        case 8:
          ngi = gi;
          ngj = gj - 1;
      }
      powers[d] -= myVisited[ngi][ngj] * 100;
      if (game.map.visited.get(ngi, ngj)) {
        powers[d] += 10000;
      }
    }
    nd = _.chain(powers).pairs().sortBy(function(x) {
      return -x[1];
    }).map(function(x) {
      return x[0];
    }).find(function(x) {
      return (v & x) > 0;
    }).value();
    action[0] = nd;
    action[1] = nd;
    action[2] = action[0];
    lastDir = action[0];
    if (!isStartAtLeftTop) {
      action = _.map(action, function(v) {
        return backDir[v];
      });
    }
    return action;
  };
  pruneJingWeiTianHai = function(map, T_T) {
    var bfsVisited, d, downAlwaysWall, gi, gj, gnome, ngi, ngj, rightAlwaysWall, t, travels, _k, _l, _len, _m, _n, _o, _p, _q, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
    gnome = game.gnomes[T_T];
    gi = gnome.i;
    gj = gnome.j;
    rightAlwaysWall = true;
    for (j = _k = _ref2 = gj + 1, _ref3 = mapW - 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; j = _ref2 <= _ref3 ? ++_k : --_k) {
      if (map[gi][j] !== 0) {
        rightAlwaysWall = false;
        break;
      }
    }
    if (rightAlwaysWall) {
      for (j = _l = gj, _ref4 = mapW - 1; gj <= _ref4 ? _l <= _ref4 : _l >= _ref4; j = gj <= _ref4 ? ++_l : --_l) {
        myVisited[gi][j]++;
      }
      bfsVisited = [];
      for (i = _m = 0, _ref5 = mapH - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: 0,
          j: mapW - 1,
          cameFrom: 0
        }
      ];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _ref6 = [1, 2, 4, 8];
        for (_n = 0, _len = _ref6.length; _n < _len; _n++) {
          d = _ref6[_n];
          switch (d) {
            case 1:
              ngi = t.i - 1;
              ngj = t.j;
              break;
            case 2:
              ngi = t.i;
              ngj = t.j + 1;
              break;
            case 4:
              ngi = t.i + 1;
              ngj = t.j;
              break;
            case 8:
              ngi = t.i;
              ngj = t.j - 1;
          }
          if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
            continue;
          }
          if (myVisited[ngi][ngj]) {
            if ((map[ngi][ngj] & backDir[d]) > 0) {
              map[ngi][ngj] -= backDir[d];
            }
          } else {
            bfsVisited[ngi][ngj] = true;
            travels.push({
              i: ngi,
              j: ngj,
              cameFrom: backDir[d]
            });
          }
        }
      }
    }
    downAlwaysWall = true;
    for (i = _o = _ref7 = gi + 1, _ref8 = mapH - 1; _ref7 <= _ref8 ? _o <= _ref8 : _o >= _ref8; i = _ref7 <= _ref8 ? ++_o : --_o) {
      if (map[i][gj] !== 0) {
        downAlwaysWall = false;
        break;
      }
    }
    if (downAlwaysWall) {
      for (i = _p = gi, _ref9 = mapH - 1; gi <= _ref9 ? _p <= _ref9 : _p >= _ref9; i = gi <= _ref9 ? ++_p : --_p) {
        myVisited[i][gj]++;
      }
      bfsVisited = [];
      for (i = _q = 0, _ref10 = mapH - 1; 0 <= _ref10 ? _q <= _ref10 : _q >= _ref10; i = 0 <= _ref10 ? ++_q : --_q) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: mapH - 1,
          j: 0,
          cameFrom: 0
        }
      ];
      _results = [];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _results.push((function() {
          var _len1, _r, _ref11, _results1;
          _ref11 = [1, 2, 4, 8];
          _results1 = [];
          for (_r = 0, _len1 = _ref11.length; _r < _len1; _r++) {
            d = _ref11[_r];
            switch (d) {
              case 1:
                ngi = t.i - 1;
                ngj = t.j;
                break;
              case 2:
                ngi = t.i;
                ngj = t.j + 1;
                break;
              case 4:
                ngi = t.i + 1;
                ngj = t.j;
                break;
              case 8:
                ngi = t.i;
                ngj = t.j - 1;
            }
            if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
              continue;
            }
            if (myVisited[ngi][ngj]) {
              if ((map[ngi][ngj] & backDir[d]) > 0) {
                _results1.push(map[ngi][ngj] -= backDir[d]);
              } else {
                _results1.push(void 0);
              }
            } else {
              bfsVisited[ngi][ngj] = true;
              _results1.push(travels.push({
                i: ngi,
                j: ngj,
                cameFrom: backDir[d]
              }));
            }
          }
          return _results1;
        })());
      }
      return _results;
    }
  };
  prune = function(map) {
    var cutVisited, gnome, pruneTravel, _k, _l, _len, _ref2, _ref3, _results;
    cutVisited = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      cutVisited[i] = [];
    }
    pruneTravel = function(i, j, cameFrom) {
      var d, dirs, ngi, ngj, powers, _l, _len;
      cutVisited[i][j] = 1;
      if (cameFrom === 0) {
        powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
        powers[2] += 100;
        powers[4] += 100;
        powers[backDir[lastDir]] -= 10000;
        dirs = _.chain(powers).pairs().sortBy(function(x) {
          return -x[1];
        }).map(function(x) {
          return x[0] - 0;
        }).value();
      } else {
        dirs = [2, 4, 1, 8];
      }
      for (_l = 0, _len = dirs.length; _l < _len; _l++) {
        d = dirs[_l];
        if ((map[i][j] & d) > 0 && cameFrom !== d) {
          switch (d) {
            case 1:
              ngi = i - 1;
              ngj = j;
              break;
            case 2:
              ngi = i;
              ngj = j + 1;
              break;
            case 4:
              ngi = i + 1;
              ngj = j;
              break;
            case 8:
              ngi = i;
              ngj = j - 1;
          }
          if (map[i][j] === void 0) {
            continue;
          }
          if (cutVisited[ngi][ngj] != null) {
            if (map[i][j] === cameFrom + d) {
              map[i][j] -= d;
              map[ngi][ngj] -= backDir[d];
            }
            break;
          }
          pruneTravel(ngi, ngj, backDir[d]);
        }
      }
      return cutVisited[i][j] = void 0;
    };
    _ref3 = game.gnomes;
    _results = [];
    for (_l = 0, _len = _ref3.length; _l < _len; _l++) {
      gnome = _ref3[_l];
      _results.push(pruneTravel(gnome.i, gnome.j, 0));
    }
    return _results;
  };
  return onMyTurn;
})();

onMyTurn2 = (function() {
  var backDir, game, i, ii, init, isDeadEnd, isDest, isGnome, isStartAtLeftTop, j, lastDir, log, map, mapH, mapPower, mapW, myLooked, myVisited, myWay, onMyTurn, prune, pruneJingWeiTianHai, rememberMap, simplifyMap, simplifyMapC, travelVision, travelVisions, _i, _j, _mapGet, _ref, _ref1;
  log = function() {
    return null;
  };
  game = {};
  mapH = 75;
  mapW = 100;
  map = [];
  myVisited = [];
  myLooked = [];
  mapPower = [];
  myWay = [];
  for (i = _i = 0, _ref = mapH - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    map[i] = [];
    myVisited[i] = [];
    myLooked[i] = [];
    mapPower[i] = [];
    for (j = _j = 0, _ref1 = mapW - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      myVisited[i][j] = 0;
      mapPower[i][j] = (i + j) * 100;
    }
  }
  mapPower[mapH - 1][mapW - 1] += 999999;
  mapPower[0][mapW - 1] += 10000;
  mapPower[mapH - 1][0] += 10000;
  lastDir = 2;
  isStartAtLeftTop = true;
  ii = 0;
  rememberMap = function() {
    return travelVisions(function(i, j) {
      if (map[i][j] === void 0) {
        return map[i][j] = game.map.data.get(i, j);
      }
    });
  };
  travelVision = function(gnome, callback) {
    var bottom, left, len, right, top, vision, _k, _results;
    vision = gnome.vision;
    top = Math.max(gnome.i - vision, 0);
    bottom = Math.min(gnome.i + vision, mapH - 1);
    _results = [];
    for (i = _k = top; top <= bottom ? _k <= bottom : _k >= bottom; i = top <= bottom ? ++_k : --_k) {
      len = vision - Math.abs(i - gnome.i);
      left = Math.max(gnome.j - len, 0);
      right = Math.min(gnome.j + len, mapW - 1);
      _results.push((function() {
        var _l, _results1;
        _results1 = [];
        for (j = _l = left; left <= right ? _l <= right : _l >= right; j = left <= right ? ++_l : --_l) {
          _results1.push(callback(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  travelVisions = function(callback) {
    var gnome, _k, _len, _ref2, _results;
    _ref2 = game.gnomes;
    _results = [];
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      _results.push(travelVision(gnome, callback));
    }
    return _results;
  };
  isDeadEnd = function(v) {
    return v === 1 || v === 2 || v === 4 || v === 8;
  };
  isGnome = function(i, j) {
    return _.any(game.gnomes, function(gnome) {
      return gnome.i === i && gnome.j === j;
    });
  };
  isDest = function(i, j) {
    return i === mapH - 1 && j === mapW - 1;
  };
  simplifyMap = function() {
    return travelVisions(function(i, j) {
      var d, _results;
      _results = [];
      while (isDeadEnd(map[i][j])) {
        if (isGnome(i, j) || isDest(i, j)) {
          break;
        }
        _i = i;
        _j = j;
        switch (map[i][j]) {
          case 1:
            i--;
            d = 4;
            break;
          case 2:
            j++;
            d = 8;
            break;
          case 4:
            i++;
            d = 1;
            break;
          case 8:
            j--;
            d = 2;
        }
        if (map[i][j] !== void 0) {
          map[_i][_j] = 0;
          if ((map[i][j] & d) > 0) {
            _results.push(map[i][j] -= d);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };
  simplifyMapC = function(m) {
    var _k, _ref2, _results;
    _results = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      _results.push((function() {
        var _l, _ref3, _results1;
        _results1 = [];
        for (j = _l = 0, _ref3 = mapW - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          _results1.push((function(i, j) {
            var d, __i, __j, _results2;
            _results2 = [];
            while (isDeadEnd(m[i][j])) {
              __i = i;
              __j = j;
              switch (m[i][j]) {
                case 1:
                  i--;
                  d = 4;
                  break;
                case 2:
                  j++;
                  d = 8;
                  break;
                case 4:
                  i++;
                  d = 1;
                  break;
                case 8:
                  j--;
                  d = 2;
              }
              if (m[i][j] !== void 0) {
                m[__i][__j] = 0;
                if ((map[i][j] & d) > 0) {
                  _results2.push(m[i][j] -= d);
                } else {
                  _results2.push(void 0);
                }
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  _mapGet = function(i, j) {
    var x, y;
    if (!isStartAtLeftTop) {
      x = mapH - i - 1;
      y = mapW - j - 1;
      return backDir[this[y][x]];
    } else {
      x = i;
      y = j;
      return this[y][x];
    }
  };
  backDir = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 1,
    5: 5,
    6: 9,
    7: 13,
    8: 2,
    9: 6,
    10: 10,
    11: 14,
    12: 3,
    13: 7,
    14: 11,
    15: 15
  };
  init = _.once(function() {
    isStartAtLeftTop = game.gnomes[0].x === 0 && game.gnomes[0].y === 0;
    mapH = game.height;
    return mapW = game.width;
  });
  onMyTurn = function(g) {
    var action, d, gi, gj, gnome, nd, ngi, ngj, powers, v, _k, _l, _len, _len1, _ref2, _ref3;
    game = g;
    ii++;
    init();
    game.map.data.get = _mapGet;
    game.map.visited.get = _mapGet;
    _ref2 = game.gnomes;
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      if (!isStartAtLeftTop) {
        gnome.i = mapH - gnome.y - 1;
        gnome.j = mapW - gnome.x - 1;
      } else {
        gnome.i = gnome.y;
        gnome.j = gnome.x;
      }
    }
    rememberMap();
    simplifyMap();
    prune(map);
    myWay.push((function() {
      var _l, _len1, _ref3, _results;
      _ref3 = game.gnomes;
      _results = [];
      for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
        gnome = _ref3[_l];
        _results.push({
          i: gnome.i,
          j: gnome.j
        });
      }
      return _results;
    })());
    action = [];
    gi = game.gnomes[1].i;
    gj = game.gnomes[1].j;
    v = map[gi][gj];
    myVisited[gi][gj]++;
    powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
    powers[2] += 100;
    powers[4] += 110;
    powers[backDir[lastDir]] -= 10000;
    _ref3 = _.filter([1, 2, 4, 8], function(x) {
      return (v & x) > 0;
    });
    for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
      d = _ref3[_l];
      switch (d) {
        case 1:
          ngi = gi - 1;
          ngj = gj;
          break;
        case 2:
          ngi = gi;
          ngj = gj + 1;
          break;
        case 4:
          ngi = gi + 1;
          ngj = gj;
          break;
        case 8:
          ngi = gi;
          ngj = gj - 1;
      }
      powers[d] -= myVisited[ngi][ngj] * 100;
      if (game.map.visited.get(ngi, ngj)) {
        powers[d] += 10000;
      }
    }
    nd = _.chain(powers).pairs().sortBy(function(x) {
      return -x[1];
    }).map(function(x) {
      return x[0];
    }).find(function(x) {
      return (v & x) > 0;
    }).value();
    action[0] = nd;
    action[1] = nd;
    action[2] = action[0];
    lastDir = action[0];
    if (!isStartAtLeftTop) {
      action = _.map(action, function(v) {
        return backDir[v];
      });
    }
    return action;
  };
  pruneJingWeiTianHai = function(map, T_T) {
    var bfsVisited, d, downAlwaysWall, gi, gj, gnome, ngi, ngj, rightAlwaysWall, t, travels, _k, _l, _len, _m, _n, _o, _p, _q, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
    gnome = game.gnomes[T_T];
    gi = gnome.i;
    gj = gnome.j;
    rightAlwaysWall = true;
    for (j = _k = _ref2 = gj + 1, _ref3 = mapW - 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; j = _ref2 <= _ref3 ? ++_k : --_k) {
      if (map[gi][j] !== 0) {
        rightAlwaysWall = false;
        break;
      }
    }
    if (rightAlwaysWall) {
      for (j = _l = gj, _ref4 = mapW - 1; gj <= _ref4 ? _l <= _ref4 : _l >= _ref4; j = gj <= _ref4 ? ++_l : --_l) {
        myVisited[gi][j]++;
      }
      bfsVisited = [];
      for (i = _m = 0, _ref5 = mapH - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: 0,
          j: mapW - 1,
          cameFrom: 0
        }
      ];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _ref6 = [1, 2, 4, 8];
        for (_n = 0, _len = _ref6.length; _n < _len; _n++) {
          d = _ref6[_n];
          switch (d) {
            case 1:
              ngi = t.i - 1;
              ngj = t.j;
              break;
            case 2:
              ngi = t.i;
              ngj = t.j + 1;
              break;
            case 4:
              ngi = t.i + 1;
              ngj = t.j;
              break;
            case 8:
              ngi = t.i;
              ngj = t.j - 1;
          }
          if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
            continue;
          }
          if (myVisited[ngi][ngj]) {
            if ((map[ngi][ngj] & backDir[d]) > 0) {
              map[ngi][ngj] -= backDir[d];
            }
          } else {
            bfsVisited[ngi][ngj] = true;
            travels.push({
              i: ngi,
              j: ngj,
              cameFrom: backDir[d]
            });
          }
        }
      }
    }
    downAlwaysWall = true;
    for (i = _o = _ref7 = gi + 1, _ref8 = mapH - 1; _ref7 <= _ref8 ? _o <= _ref8 : _o >= _ref8; i = _ref7 <= _ref8 ? ++_o : --_o) {
      if (map[i][gj] !== 0) {
        downAlwaysWall = false;
        break;
      }
    }
    if (downAlwaysWall) {
      for (i = _p = gi, _ref9 = mapH - 1; gi <= _ref9 ? _p <= _ref9 : _p >= _ref9; i = gi <= _ref9 ? ++_p : --_p) {
        myVisited[i][gj]++;
      }
      bfsVisited = [];
      for (i = _q = 0, _ref10 = mapH - 1; 0 <= _ref10 ? _q <= _ref10 : _q >= _ref10; i = 0 <= _ref10 ? ++_q : --_q) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: mapH - 1,
          j: 0,
          cameFrom: 0
        }
      ];
      _results = [];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _results.push((function() {
          var _len1, _r, _ref11, _results1;
          _ref11 = [1, 2, 4, 8];
          _results1 = [];
          for (_r = 0, _len1 = _ref11.length; _r < _len1; _r++) {
            d = _ref11[_r];
            switch (d) {
              case 1:
                ngi = t.i - 1;
                ngj = t.j;
                break;
              case 2:
                ngi = t.i;
                ngj = t.j + 1;
                break;
              case 4:
                ngi = t.i + 1;
                ngj = t.j;
                break;
              case 8:
                ngi = t.i;
                ngj = t.j - 1;
            }
            if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
              continue;
            }
            if (myVisited[ngi][ngj]) {
              if ((map[ngi][ngj] & backDir[d]) > 0) {
                _results1.push(map[ngi][ngj] -= backDir[d]);
              } else {
                _results1.push(void 0);
              }
            } else {
              bfsVisited[ngi][ngj] = true;
              _results1.push(travels.push({
                i: ngi,
                j: ngj,
                cameFrom: backDir[d]
              }));
            }
          }
          return _results1;
        })());
      }
      return _results;
    }
  };
  prune = function(map) {
    var cutVisited, gnome, pruneTravel, _k, _l, _len, _ref2, _ref3, _results;
    cutVisited = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      cutVisited[i] = [];
    }
    pruneTravel = function(i, j, cameFrom) {
      var d, dirs, ngi, ngj, powers, _l, _len;
      cutVisited[i][j] = 1;
      if (cameFrom === 0) {
        powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
        powers[2] += 100;
        powers[4] += 100;
        powers[backDir[lastDir]] -= 10000;
        dirs = _.chain(powers).pairs().sortBy(function(x) {
          return -x[1];
        }).map(function(x) {
          return x[0] - 0;
        }).value();
      } else {
        dirs = [2, 4, 1, 8];
      }
      for (_l = 0, _len = dirs.length; _l < _len; _l++) {
        d = dirs[_l];
        if ((map[i][j] & d) > 0 && cameFrom !== d) {
          switch (d) {
            case 1:
              ngi = i - 1;
              ngj = j;
              break;
            case 2:
              ngi = i;
              ngj = j + 1;
              break;
            case 4:
              ngi = i + 1;
              ngj = j;
              break;
            case 8:
              ngi = i;
              ngj = j - 1;
          }
          if (map[i][j] === void 0) {
            continue;
          }
          if (cutVisited[ngi][ngj] != null) {
            if (map[i][j] === cameFrom + d) {
              map[i][j] -= d;
              map[ngi][ngj] -= backDir[d];
            }
            break;
          }
          pruneTravel(ngi, ngj, backDir[d]);
        }
      }
      return cutVisited[i][j] = void 0;
    };
    _ref3 = game.gnomes;
    _results = [];
    for (_l = 0, _len = _ref3.length; _l < _len; _l++) {
      gnome = _ref3[_l];
      _results.push(pruneTravel(gnome.i, gnome.j, 0));
    }
    return _results;
  };
  return onMyTurn;
})();

onMyTurn3 = (function() {
  var backDir, game, i, ii, init, isDeadEnd, isDest, isGnome, isStartAtLeftTop, j, lastDir, log, map, mapH, mapPower, mapW, myLooked, myVisited, myWay, onMyTurn, prune, pruneJingWeiTianHai, rememberMap, simplifyMap, simplifyMapC, travelVision, travelVisions, _i, _j, _mapGet, _ref, _ref1;
  log = function() {
    return null;
  };
  game = {};
  mapH = 75;
  mapW = 100;
  map = [];
  myVisited = [];
  myLooked = [];
  mapPower = [];
  myWay = [];
  for (i = _i = 0, _ref = mapH - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    map[i] = [];
    myVisited[i] = [];
    myLooked[i] = [];
    mapPower[i] = [];
    for (j = _j = 0, _ref1 = mapW - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      myVisited[i][j] = 0;
      mapPower[i][j] = (i + j) * 100;
    }
  }
  mapPower[mapH - 1][mapW - 1] += 999999;
  mapPower[0][mapW - 1] += 10000;
  mapPower[mapH - 1][0] += 10000;
  lastDir = 2;
  isStartAtLeftTop = true;
  ii = 0;
  rememberMap = function() {
    return travelVisions(function(i, j) {
      if (map[i][j] === void 0) {
        return map[i][j] = game.map.data.get(i, j);
      }
    });
  };
  travelVision = function(gnome, callback) {
    var bottom, left, len, right, top, vision, _k, _results;
    vision = gnome.vision;
    top = Math.max(gnome.i - vision, 0);
    bottom = Math.min(gnome.i + vision, mapH - 1);
    _results = [];
    for (i = _k = top; top <= bottom ? _k <= bottom : _k >= bottom; i = top <= bottom ? ++_k : --_k) {
      len = vision - Math.abs(i - gnome.i);
      left = Math.max(gnome.j - len, 0);
      right = Math.min(gnome.j + len, mapW - 1);
      _results.push((function() {
        var _l, _results1;
        _results1 = [];
        for (j = _l = left; left <= right ? _l <= right : _l >= right; j = left <= right ? ++_l : --_l) {
          _results1.push(callback(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  travelVisions = function(callback) {
    var gnome, _k, _len, _ref2, _results;
    _ref2 = game.gnomes;
    _results = [];
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      _results.push(travelVision(gnome, callback));
    }
    return _results;
  };
  isDeadEnd = function(v) {
    return v === 1 || v === 2 || v === 4 || v === 8;
  };
  isGnome = function(i, j) {
    return _.any(game.gnomes, function(gnome) {
      return gnome.i === i && gnome.j === j;
    });
  };
  isDest = function(i, j) {
    return i === mapH - 1 && j === mapW - 1;
  };
  simplifyMap = function() {
    return travelVisions(function(i, j) {
      var d, _results;
      _results = [];
      while (isDeadEnd(map[i][j])) {
        if (isGnome(i, j) || isDest(i, j)) {
          break;
        }
        _i = i;
        _j = j;
        switch (map[i][j]) {
          case 1:
            i--;
            d = 4;
            break;
          case 2:
            j++;
            d = 8;
            break;
          case 4:
            i++;
            d = 1;
            break;
          case 8:
            j--;
            d = 2;
        }
        if (map[i][j] !== void 0) {
          map[_i][_j] = 0;
          if ((map[i][j] & d) > 0) {
            _results.push(map[i][j] -= d);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };
  simplifyMapC = function(m) {
    var _k, _ref2, _results;
    _results = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      _results.push((function() {
        var _l, _ref3, _results1;
        _results1 = [];
        for (j = _l = 0, _ref3 = mapW - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          _results1.push((function(i, j) {
            var d, __i, __j, _results2;
            _results2 = [];
            while (isDeadEnd(m[i][j])) {
              __i = i;
              __j = j;
              switch (m[i][j]) {
                case 1:
                  i--;
                  d = 4;
                  break;
                case 2:
                  j++;
                  d = 8;
                  break;
                case 4:
                  i++;
                  d = 1;
                  break;
                case 8:
                  j--;
                  d = 2;
              }
              if (m[i][j] !== void 0) {
                m[__i][__j] = 0;
                if ((map[i][j] & d) > 0) {
                  _results2.push(m[i][j] -= d);
                } else {
                  _results2.push(void 0);
                }
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })(i, j));
        }
        return _results1;
      })());
    }
    return _results;
  };
  _mapGet = function(i, j) {
    var x, y;
    if (!isStartAtLeftTop) {
      x = mapH - i - 1;
      y = mapW - j - 1;
      return backDir[this[y][x]];
    } else {
      x = i;
      y = j;
      return this[y][x];
    }
  };
  backDir = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 1,
    5: 5,
    6: 9,
    7: 13,
    8: 2,
    9: 6,
    10: 10,
    11: 14,
    12: 3,
    13: 7,
    14: 11,
    15: 15
  };
  init = _.once(function() {
    isStartAtLeftTop = game.gnomes[0].x === 0 && game.gnomes[0].y === 0;
    mapH = game.height;
    return mapW = game.width;
  });
  onMyTurn = function(g) {
    var action, d, gi, gj, gnome, nd, ngi, ngj, powers, v, _k, _l, _len, _len1, _ref2, _ref3;
    game = g;
    ii++;
    init();
    game.map.data.get = _mapGet;
    game.map.visited.get = _mapGet;
    _ref2 = game.gnomes;
    for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
      gnome = _ref2[_k];
      if (!isStartAtLeftTop) {
        gnome.i = mapH - gnome.y - 1;
        gnome.j = mapW - gnome.x - 1;
      } else {
        gnome.i = gnome.y;
        gnome.j = gnome.x;
      }
    }
    rememberMap();
    simplifyMap();
    myWay.push((function() {
      var _l, _len1, _ref3, _results;
      _ref3 = game.gnomes;
      _results = [];
      for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
        gnome = _ref3[_l];
        _results.push({
          i: gnome.i,
          j: gnome.j
        });
      }
      return _results;
    })());
    action = [];
    gi = game.gnomes[2].i;
    gj = game.gnomes[2].j;
    v = map[gi][gj];
    myVisited[gi][gj]++;
    powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
    powers[2] += 100;
    powers[4] += 100;
    powers[backDir[lastDir]] -= 10000;
    _ref3 = _.filter([1, 2, 4, 8], function(x) {
      return (v & x) > 0;
    });
    for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
      d = _ref3[_l];
      switch (d) {
        case 1:
          ngi = gi - 1;
          ngj = gj;
          break;
        case 2:
          ngi = gi;
          ngj = gj + 1;
          break;
        case 4:
          ngi = gi + 1;
          ngj = gj;
          break;
        case 8:
          ngi = gi;
          ngj = gj - 1;
      }
      powers[d] -= myVisited[ngi][ngj] * 100;
      if (game.map.visited.get(ngi, ngj)) {
        powers[d] += 10000;
      }
    }
    nd = _.chain(powers).pairs().sortBy(function(x) {
      return -x[1];
    }).map(function(x) {
      return x[0];
    }).find(function(x) {
      return (v & x) > 0;
    }).value();
    action[0] = nd;
    action[1] = nd;
    action[2] = action[0];
    lastDir = action[0];
    if (!isStartAtLeftTop) {
      action = _.map(action, function(v) {
        return backDir[v];
      });
    }
    return action;
  };
  pruneJingWeiTianHai = function(map, T_T) {
    var bfsVisited, d, downAlwaysWall, gi, gj, gnome, ngi, ngj, rightAlwaysWall, t, travels, _k, _l, _len, _m, _n, _o, _p, _q, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
    gnome = game.gnomes[T_T];
    gi = gnome.i;
    gj = gnome.j;
    rightAlwaysWall = true;
    for (j = _k = _ref2 = gj + 1, _ref3 = mapW - 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; j = _ref2 <= _ref3 ? ++_k : --_k) {
      if (map[gi][j] !== 0) {
        rightAlwaysWall = false;
        break;
      }
    }
    if (rightAlwaysWall) {
      for (j = _l = gj, _ref4 = mapW - 1; gj <= _ref4 ? _l <= _ref4 : _l >= _ref4; j = gj <= _ref4 ? ++_l : --_l) {
        myVisited[gi][j]++;
      }
      bfsVisited = [];
      for (i = _m = 0, _ref5 = mapH - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: 0,
          j: mapW - 1,
          cameFrom: 0
        }
      ];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _ref6 = [1, 2, 4, 8];
        for (_n = 0, _len = _ref6.length; _n < _len; _n++) {
          d = _ref6[_n];
          switch (d) {
            case 1:
              ngi = t.i - 1;
              ngj = t.j;
              break;
            case 2:
              ngi = t.i;
              ngj = t.j + 1;
              break;
            case 4:
              ngi = t.i + 1;
              ngj = t.j;
              break;
            case 8:
              ngi = t.i;
              ngj = t.j - 1;
          }
          if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
            continue;
          }
          if (myVisited[ngi][ngj]) {
            if ((map[ngi][ngj] & backDir[d]) > 0) {
              map[ngi][ngj] -= backDir[d];
            }
          } else {
            bfsVisited[ngi][ngj] = true;
            travels.push({
              i: ngi,
              j: ngj,
              cameFrom: backDir[d]
            });
          }
        }
      }
    }
    downAlwaysWall = true;
    for (i = _o = _ref7 = gi + 1, _ref8 = mapH - 1; _ref7 <= _ref8 ? _o <= _ref8 : _o >= _ref8; i = _ref7 <= _ref8 ? ++_o : --_o) {
      if (map[i][gj] !== 0) {
        downAlwaysWall = false;
        break;
      }
    }
    if (downAlwaysWall) {
      for (i = _p = gi, _ref9 = mapH - 1; gi <= _ref9 ? _p <= _ref9 : _p >= _ref9; i = gi <= _ref9 ? ++_p : --_p) {
        myVisited[i][gj]++;
      }
      bfsVisited = [];
      for (i = _q = 0, _ref10 = mapH - 1; 0 <= _ref10 ? _q <= _ref10 : _q >= _ref10; i = 0 <= _ref10 ? ++_q : --_q) {
        bfsVisited[i] = [];
      }
      travels = [
        {
          i: mapH - 1,
          j: 0,
          cameFrom: 0
        }
      ];
      _results = [];
      while (travels.length > 0) {
        t = travels.shift();
        map[t.i][t.j] = 0;
        _results.push((function() {
          var _len1, _r, _ref11, _results1;
          _ref11 = [1, 2, 4, 8];
          _results1 = [];
          for (_r = 0, _len1 = _ref11.length; _r < _len1; _r++) {
            d = _ref11[_r];
            switch (d) {
              case 1:
                ngi = t.i - 1;
                ngj = t.j;
                break;
              case 2:
                ngi = t.i;
                ngj = t.j + 1;
                break;
              case 4:
                ngi = t.i + 1;
                ngj = t.j;
                break;
              case 8:
                ngi = t.i;
                ngj = t.j - 1;
            }
            if (ngi < 0 || ngi >= mapH || ngj < 0 || ngj >= mapW || bfsVisited[ngi][ngj]) {
              continue;
            }
            if (myVisited[ngi][ngj]) {
              if ((map[ngi][ngj] & backDir[d]) > 0) {
                _results1.push(map[ngi][ngj] -= backDir[d]);
              } else {
                _results1.push(void 0);
              }
            } else {
              bfsVisited[ngi][ngj] = true;
              _results1.push(travels.push({
                i: ngi,
                j: ngj,
                cameFrom: backDir[d]
              }));
            }
          }
          return _results1;
        })());
      }
      return _results;
    }
  };
  prune = function(map) {
    var cutVisited, gnome, pruneTravel, _k, _l, _len, _ref2, _ref3, _results;
    cutVisited = [];
    for (i = _k = 0, _ref2 = mapH - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      cutVisited[i] = [];
    }
    pruneTravel = function(i, j, cameFrom) {
      var d, dirs, ngi, ngj, powers, _l, _len;
      cutVisited[i][j] = 1;
      if (cameFrom === 0) {
        powers = _.object([1, 2, 4, 8], [0, 0, 0, 0]);
        powers[2] += 100;
        powers[4] += 100;
        powers[backDir[lastDir]] -= 10000;
        dirs = _.chain(powers).pairs().sortBy(function(x) {
          return -x[1];
        }).map(function(x) {
          return x[0] - 0;
        }).value();
      } else {
        dirs = [2, 4, 1, 8];
      }
      for (_l = 0, _len = dirs.length; _l < _len; _l++) {
        d = dirs[_l];
        if ((map[i][j] & d) > 0 && cameFrom !== d) {
          switch (d) {
            case 1:
              ngi = i - 1;
              ngj = j;
              break;
            case 2:
              ngi = i;
              ngj = j + 1;
              break;
            case 4:
              ngi = i + 1;
              ngj = j;
              break;
            case 8:
              ngi = i;
              ngj = j - 1;
          }
          if (map[i][j] === void 0) {
            continue;
          }
          if (cutVisited[ngi][ngj] != null) {
            if (map[i][j] === cameFrom + d) {
              map[i][j] -= d;
              map[ngi][ngj] -= backDir[d];
            }
            break;
          }
          pruneTravel(ngi, ngj, backDir[d]);
        }
      }
      return cutVisited[i][j] = void 0;
    };
    _ref3 = game.gnomes;
    _results = [];
    for (_l = 0, _len = _ref3.length; _l < _len; _l++) {
      gnome = _ref3[_l];
      _results.push(pruneTravel(gnome.i, gnome.j, 0));
    }
    return _results;
  };
  return onMyTurn;
})();

onMyTurn = function(game) {
  var dirs1, dirs2, dirs3;
  dirs1 = onMyTurn1(game);
  try {
    dirs2 = onMyTurn2(game);
  } catch (_error) {
    dirs2 = [0, 0, 0];
  }
  dirs3 = onMyTurn3(game);
  return [dirs1[0], dirs2[1], dirs3[2]];
};
