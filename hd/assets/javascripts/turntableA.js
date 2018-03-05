(function(win){
  function Turntable (id,opts,fn){
    var obj = {
      oPointer   : "#img1",
      oTurntable : "#img2",
      temp       : 0 ,
      cat        : 0 ,
      time       : 4
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.oPointer   = $(obj.oPointer);
    this.oTurntable = $(obj.oTurntable);
    this.temp       = obj.temp*1;//已转次数
    this.cat        = obj.cat;//度数
    this.fn         = fn;
    this.jiang      = '111';
    this.time       = obj.time;//几份
    this.init() ;
  }
  Turntable.prototype = {
    //初始化
    init : function(){
      this.clickBtn(this.oTurntable );//点击抽奖
    },
    //判断选中的奖
    getJiang : function(n){
      var zhi = ( Math.floor ( Math.random ( ) * n + 1 ) );
      if(zhi<4){
        // console.log('555')
        this.jiang  = '555';
        return '555';
      } else if(zhi<51){
        // console.log('222')
        this.jiang  = '222';
         return '222';
      } else if(zhi<=100){
        // console.log('111')
        this.jiang  = '111';
        return '111';
      }
    },
    //增加转动区域范围
    ZengQuyv : function(rdm,num1,num2,num3){
      var str = this.getJiang(100),
          obj = {
            '111' : num1,
            '222' : num2,
            '555' : num3
          }
      return (rdm*1)+(obj[str]*1);
    },
    //点击抽奖
    clickBtn : function(oTurntable){
      var rdm = 0,that=this,num=0;
      var zhi = ( Math.floor ( Math.random ( ) * 6 + 0 ) );
     
      if(zhi ==0 ||zhi ==2 ||zhi ==4 ){
        num = zhi*60;
      } else{num =0}

      rdm = num + that.temp + 3600;

        // 随机计算出旋转的角度
        // rdm = Math.floor(Math.random() * (3600 - 3600 + 1) + 3660)+that.temp;
        // rdm = Math.floor(Math.random()*6 + 1)*60+3600+that.temp;
          // rdm = 3660+that.temp;
          var moNum = rdm%360,
              zhong = '';
              // console.log('dsfa');
              // console.log(rdm,zhi)
              // return false;
          if(moNum == 0 || moNum == that.cat*2 || moNum == that.cat*4 ){
            rdm = rdm +60
          } 
          // 旋转
          // oTurntable.css({
          //     transition: "all 4s",
          //     transform: "rotate(" + rdm + "deg)"
          // });
          var s = '-webkit-transform: rotate('+rdm+'deg);transform: rotate('+rdm+'deg);-webkit-transition-duration: '+that.time+'s;transition-duration:'+that.time+'s;-webkit-transition-timing-function: ease;transition-timing-function: ease;';
          oTurntable.attr('style',s);
          //轮盘已旋转度数
          oTurntable.attr('data-num',rdm);
          var that = this;
          setTimeout(function(){
            that.fn (that.jiang)
          },(that.time*1000+1000));
    }
  }
  $.fn.extend({
    Turntable : (opts,fn) => {
      return new Turntable(this,opts,fn)
    }
  })
  // $.fn.extend()
})(window)