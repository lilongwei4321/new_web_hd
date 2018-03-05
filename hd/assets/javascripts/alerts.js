;(function(win,$){
let extend  = function (_defult,opts) {
			for(let m in opts){
				_defult[m]=opts[m]
			}
			return _defult;
		}
	 var PhoneAlert = function(opts,successCallback){
	 	this.title=opts.title;
	 	this.cont=opts.cont;
	 	this.btns=opts.btns;
	 	this.yes=opts.yes;
		this.no=opts.no;
		this.formAsync = opts.formAsync;
		this.successCallback=successCallback;
	 	//初始化
	 	this.init();
	 } 
	 PhoneAlert.prototype={
	 	init : function(){
		 //添加弹框
		 if(this.formAsync){
			this.fromBoxHtml();
		 } else{
			this.boxHtml();
		 }
		 //关闭弹框
		 this.guanHtnl(this.SaveDialog());
	 	},
	 	//添加提醒弹框
	 	boxHtml : function(){
	 		//创建元素标签
	 		let str  = '',
					 that =  this;
					 //添加内容
					 if(that.cont!=''){
						// console.log(that.cont)

						str += '<div class="box_flex">'+this.cont+'</div>';
					 } else{
						str+=`<div class="ind_back" id="ind_back">
									<div class="indA_box" id="indA_box">
										<div class="indA_title" >${that.title}</div>
									<div class="indA_cont">${that.cont}</div>`;
									if(that.btns){
										str+=`<div class="indA_footer">`;
										for(let i=0;i<that.btns.length;i++){
											if(that.btns.length>1){
												str+=`<button class="minBtn" data-ind="${i}">${that.btns[i]}</button>`;
											}
											else{
												str+=`<button class="maxBtn">${that.btns[i]}</button>`;
											}	
										}
										str+=`</div>`;
									}
								str+=`</div></div>`;
					 }
		 			
		 			//追加到页面中
		 			$('#box_alert').html(str);
		 			//点击按钮
		 			var minbtns = $('.minBtn').length>1?$('.minBtn'):$('.maxBtn');
		 			if(minbtns!=null){
						// $('#indA_box').on(cli)
		 				// that.clickBtn(minbtns,$('#indA_box'))
		 			}
		 			//拖动效果
		 			// let SaveDialo=this.SaveDialog()	;
		 			// 		that.moveAlert($('#indA_box'),SaveDialo);	
		 },
		 //from弹框
		fromBoxHtml : function(){
			var str='';
			if(this.cont==''){
				str+= `<div class="box_alert" id="box_alert">
					<div class="box_flex">
						<div class="box_main" id="box_main">
							<header class="boxM_title"><span>${this.title}</span><b class="guan" id="alert_guan"></b></header>
							<div class="boxM_text">
								<p>
									<span>称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;呼</span>
									<input type="text" placeholder="怎么称呼您" id="hd_name" maxlength="16">
								</p>
								<p>
									<span>手&nbsp;机&nbsp;号</span>
									<input type="text" placeholder="请输入您的手机号" id="hd_phone" maxlength="11">
								</p>
								<p>
									<span>验&nbsp;证&nbsp;码</span>
									<input type="text" placeholder="请输入验证码" class="pop-input1" id="hd_yanzm" maxlength="4">
									<input type="button" class="cod_btn"  value="获取验证码" id="hd_yanzmBtn" disabled="disabled">
								</p>
								<p id="user_error" class="user_error"></p>
								<p>
									<span class="box_alertBtn" id="hd_btn">${this.btns[0]}</span>
								</p>
							</div>
						</div>
					</div>
				</div>`;
				$('body').append(str);
			} else{
				str+=`<div class="box_flex">${this.cont}</div>`;
				$('#box_alert').html(str);
			}
			
			

			if($('#select_city').length>0){
				//选择城市
				this.xuanCity();
			}
		},
		//选择城市
		xuanCity : function(){
			var id=$("#select_city").find('p').attr('data-id'),
					obj = {
						bj : '北京',
						cc : '长春',
						cs : '长沙',
						tj : '天津',
						suzhou : '苏州'
					};
			$("#select_city").find('p').text(obj[id]);
			$("#select_city").find('li').each(function(i,t){
				if($(t).attr('data-id')==id){
					$(t).addClass('on');
				}
			})
			//切换样式
			$('#select_city').on('click','p',function(){
				$(this).toggleClass('on');
				$('#select_city').find('ul').toggleClass('on');
			});

			$("#select_city").on('click','li',function(){
				var cityId = ($(this).attr('data-id'));
						$("#select_city").find('p').text(obj[cityId]).attr('data-id',cityId);
						$(this).parents('ul').removeClass('on');
						$(this).addClass('on').siblings().removeClass('on');
						$('#select_city').find('p').removeClass('on');
			});
		},
		 //关闭弹框
		guanHtnl : function (SaveDialog) {
			$('#alert_guan').on('click',function(e){
				var ev=e || window.event;
				if(ev.target.id!='alert_guan') return false;
				$('#hd_name').val('');
				$('#hd_phone').val('');
				$('#hd_yanzm').val('');
				$('#user_error').html('');
				$('#box_alert').hide();
				$('html').removeClass('height_over');
				$('body').removeClass('height_over');
				return false;
			})
		},
	 	clickBtn : function(btns,oldobox ){
	 		var that=this;
			//	if(btns.length>1){
					$('#seascape_wrap').on('click','.minBtn',function() {
						alert('aaa')
						let ind = $(this).attr('data-ind');
						if(ind==0){
							that.yes();
						}
						else if(ind==1){
							//取消弹框
							that.no();				
						}
					});
				// }
				// else if(btns.length==1){
				// 	btns[0].onclick=function(){
				// 		that.yes();
				// 	}
				// }
				// else{
				// 	setTimeout(function(){
 				// 		$("#indA_box").html(`<img src="loading.gif" />`).removeClass().addClass('indA_box1');
				// 		that.successCallback("true");
				// 	},3000)
				// }
	 	},
	 	//拖动效果
	 	moveAlert : function(box,SaveDialo){
			box.on(SaveDialo.touchstart,function(e){
				var e=e||window.event,thouch = e;
				if(e.touches){thouch = e.touches[0]}		
				let X=thouch.pageX-this.offsetLeft,
						Y=thouch.pageY-this.offsetTop,		
					dong =function(e){
						var e=e||window.event,thouch = e;
						if(e.touches){thouch = e.touches[0]}					
						let movel=thouch.pageX-X,
	          		movet=thouch.pageY-Y,         
	          		winw =$(document).width()-box.width(),
	         			winh =$(document).height()-box.height();
	              if(movel<0)movel=0;
	              if(movet<0)movet=0;
	              if(movel>=winw)movel=winw;
	              if(movet>=winh)movet=winh;
	            	box.css({
	            		left : movel+"px",
	            		top  : movet+"px"
	            	});
				};
				//滑动事件
				$('body').on(SaveDialo.touchmove,dong);
				//离开 移除事件
				$('body').on(SaveDialo.touchend,function(){
					$('body').off(SaveDialo.touchmove,dong);
				})
			})
	 	},
	 	//判断当前浏览器
	 	browserRedirect: function () {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
		      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		          return "phone"
		      } else {
		          return "pc"
		      }
     },
    // 执行事件
    SaveDialog : function(){
    	var obj={}
    	if(this.browserRedirect()=='pc'){
    		obj = {
    			touchmove :'mousemove',
    			touchend :'mouseup',
    			touchstart :'mousedown'
    		}
    	}
    	else{
    		obj = {
    			touchmove :'touchmove',
    			touchend :'touchend',
    			touchstart :'touchstart'
    		}
    	}
    	return obj
    } 	
	 }

let Alerts   =   function(opts){		
			return new PhoneAlert(extend({
				title:"1363234445",
				cont:'',
				btns:["yes","no"]
			},opts))
		},
		cancelAlert = function(opts){
			return new PhoneAlert(extend({
				title:"1363234445",
				cont:'',
				btns:["yes","no"]
			},opts))
		},
		succeedBox  = function(opts,fn){
			return new PhoneAlert(extend({
				title:"1363234445",
				cont:''
			},opts),fn)
		},
		fromAlerts = function(opts,fn){
			return new PhoneAlert(extend({
				title:"1363234445",
				cont:'',
				btns:["yes","no"]
			},opts),fn)
		},
		cancelBox =   function(){
			$('#box_alert').remove();	
	 	}
	 	$.fn.extend({
			Alerts      : Alerts,
			cancelAlert : cancelAlert,
			cancelBox   : cancelBox,
			succeedBox  : succeedBox,
			fromAlerts  : fromAlerts
		});
})(window,jQuery)