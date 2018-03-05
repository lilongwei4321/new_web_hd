(function (doc, win) {
  //orientationchange : 判断手机是水平方向还是垂直方向，感应方向

  //doc ==》 document对象
  //doc.documentElement ==> 得到文档的根元素-->  <html>
  //之所以要得到文档的根元素，是为了计算网页所打开时屏幕的真实宽度
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if(clientWidth>600){
        docEl.style.fontSize = '10px';
      } else{
        docEl.style.fontSize = 10/375*clientWidth + 'px';
      } 
      // docEl.style.fontSize = 10/400*clientWidth + 'px';
      //设置根元素font-size
    };
    
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);