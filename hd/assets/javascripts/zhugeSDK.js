(function() {
  window.zhuge = window.zhuge || [];
  window.zhuge.methods = "_init identify track getDid getSid getKey setSuperProperty setUserProperties setPlatform".split(" ");
  window.zhuge.factory = function(b) {
    return function() {
      var a = Array.prototype.slice.call(arguments);
      a.unshift(b);
      window.zhuge.push(a);
      return window.zhuge;
    }
  };
  for (var i = 0; i < window.zhuge.methods.length; i++) {
    var key = window.zhuge.methods[i];
    window.zhuge[key] = window.zhuge.factory(key);
  }
  window.zhuge.load = function(b, x) {
    if (!document.getElementById("zhuge-js")) {
      var a = document.createElement("script");
      var verDate = new Date();
      var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

      a.type = "text/javascript";
      a.id = "zhuge-js";
      a.async = !0;
      a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge.min.js?v=": 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
      a.onerror = function() {
        window.zhuge.identify = window.zhuge.track = function(ename, props, callback) {
          if (callback && Object.prototype.toString.call(callback) === '[object Function]') callback();
        };
      };
      var c = document.getElementsByTagName("script")[0];
      c.parentNode.insertBefore(a, c);
      window.zhuge._init(b, x)
    }
  };
  if(IsPC()==true){
    window.zhuge.load('11a0866628014137ab069400f3d0ae30', { 
      autoTrack: false,            
      singlePage: false ,
      debug : true   
    });
  }else {
    window.zhuge.load('e978e913447f40e3879c4d2ce81eda38', { 
      autoTrack: false,            
      singlePage: false ,
      debug : true   
    });
  }
})();
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
              "SymbianOS", "Windows Phone",
              "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  return flag;
}