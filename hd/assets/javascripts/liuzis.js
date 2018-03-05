(function (win,$) {
	function Liuzi(id,opts,successful){
		var obj = {
			nameId  	: "#hd_name",
			phoneId 	: "#hd_phone",
			yanzmId 	: "#hd_yanzm",
			yanzmBtn	: "#hd_yanzmBtn",
			hdBtn   	: "#hd_btn",
			nameError : "#name_error",
			phoneError: "#phone_error",
			yanError 	: "#yan_error",
			publicError : "#user_error",
			huodongUrl  : '',
			yanBtnColor : '#a6a6a6',
			tgsb        : 'pc',
			layoutType  : '0',
			alertId     : '#hd_alert',
			alertArr    : [],
			cityName    : '',
			hd_name     : '',
			yanzmText   :'获取验证码',
			loupan_id   : '',
			loupan_name : '',
			huidiao     : false,
			refcode:''
		}
		for(var i in opts){
			obj[i] = opts[i]
		}
		this.nameId 		= $(obj.nameId);//用户名称
		this.phoneId		= $(obj.phoneId);//用户手机号
		this.yanzmId 		= $(obj.yanzmId);//
		this.yanzmBtn		= $(obj.yanzmBtn);
		this.hdBtn			=	$(obj.hdBtn);
		this.nameError 	= $(obj.nameError);
		this.yanError 	=	$(obj.yanError);
		this.phoneError =	$(obj.phoneError);
		this.alertId    = $(obj.alertId);
		this.publicError  = $(obj.publicError);
		this.yanBtnColor  = obj.yanBtnColor;
		this.clue_type_id = obj.clue_type_id;
		this.layoutType		= obj.layoutType;
		this.refcode      = obj.refcode;
		this.reg      	= /^1[34578]\d{9}$/;
		this.huodongUrl = obj.huodongUrl;
		this.asyncBtn  	= true;
	  this.yanAsync 	= true;
	  this.time       = null;
	  this.yanzmText  = obj.yanzmText;
	  this.tgsb 			= obj.tgsb;
	  this.alertArr   = obj.hd_alertArr;
		this.cityName   = obj.cityName;
		this.hd_name    = obj.hd_name;
		this.loupan_id  = obj.loupan_id;
		this.loupan_name= obj.loupan_name;
		this.huidiao    = obj.huidiao;
		this.successful = successful;
	  //去除所有空格
	  this.removeAllSpace = function (str) {
	   return str.replace(/\s+/g, "");
	  }
		this.init();
	}
	Liuzi.prototype.init = function(){
		this.cookieFn();//存储cookie
		this.nameFn(this.nameId,this.nameError);//称呼表单事件
		this.phoneFn(this.phoneId,this.phoneError,this.yanzmBtn);//手机表单事件
		this.yanzmFn(this.yanzmId,this.phoneId,this.yanError,this.phoneError);//验证码表单事件
		this.getPasswordFn(this.phoneId,this.phoneError,this.yanzmBtn);//获取验证码
		this.keyhuiFn(this.hdBtn);//称呼表单事件
	
	}
	//称呼事件
	Liuzi.prototype.nameFn = function(nameId,nameError){
		var that =this;
		nameId.on('keyup',function(event){
		  if($(this).val() != ''){
				if(that.layoutType=='3'){
					that.publicError.html('');
				} else{
					nameError.slideUp(500);
				}
		  }
		});
		nameId.on('keydown',function(event){
		  if(!event){event = window.event;}
		  if((event.keyCode || event.which) == 13 ){
		    that.activityFn ();
		    return false;
		  } else if((event.keyCode || event.which) == 9){
		    if($(this).val() == ''){
					if(that.layoutType=='3' || that.layoutType=='4'){
						that.publicError.html(that.alertArr.nameErrorText);
					} else{
						nameError.slideDown(500);
					}
		    }
		  }
		});
		//手机失去焦点
		if(this.tgsb=='m'){
			nameId.on('blur',function(){
		    if($(this).val()!=''){
					if(that.layoutType=='3' || that.layoutType=='4'){
						that.publicError.html('');
					} else{
	        	nameError.slideUp(500);
					}
		    }else{
					if(that.layoutType=='3' || that.layoutType=='4'){
						that.publicError.html(that.alertArr.nameErrorText);
					} else{
						nameError.slideDown(500);
					}
		    }
			})
		}
	}
	//手机号事件
	Liuzi.prototype.phoneFn = function(phoneId,phoneError,yanzmBtn){
		var that =this;
		phoneId.on('keyup',function(event){
		  if(!that.asyncBtn) {
		    that.asyncBtn = true;
		    return false;
		  } 
		  if(!Number($(this).val()) && $(this).val()!=''){
		    if(that.layoutType=='3' || that.layoutType=='4'){
					that.publicError.html(that.alertArr.phoneErrorText);
				} else{
					phoneError.slideDown(500);
				}
		    return false;
		  } else {
				if(that.layoutType=='3' || that.layoutType=='4'){
					
				} else{
		    	phoneError.slideUp(500);
				}
		  }
		  if($(this).val().length==11 && that.reg.test($(this).val()) ){
		    yanzmBtn.css('background',that.yanBtnColor).attr("disabled", false);
		  } else{
		    yanzmBtn.css('background','#a6a6a6').attr("disabled", true);
		  }
		});
		phoneId.on('keydown',function(event){
		  if(!event){event = window.event;}
		  if((event.keyCode || event.which) == 13 ){
		    that.activityFn ();
		    that.asyncBtn = false;
		    return false;
		  } else if((event.keyCode || event.which) == 9){
		    if( !that.reg.test($(this).val())){
					if(that.layoutType=='3' || that.layoutType=='4' ){
						that.publicError.html(that.alertArr.phoneErrorText);
					} else{
		      	phoneError.slideDown(500);
					}
		    }
		  }
		});
	}
	//输入验证码事件
	Liuzi.prototype.yanzmFn = function(yanzmId,phoneId,yanError,phoneError){
		var that  = this;
		yanzmId.on('focus',function(event){
		  if( !that.reg.test(phoneId.val())){
				if(that.layoutType=='3' || that.layoutType=='4' ){
					that.publicError.html(that.alertArr.phoneErrorText);
				} else{
		    	phoneError.slideDown(500);
				}
		  }
		});
		yanzmId.on('keyup',function(event){
		  if(!that.yanAsync) {
		    that.yanAsync = true;
		    return false;
		  } 
		  if($(this).val()!=''){
				if(that.layoutType=='3' || that.layoutType=='4' ){
					that.publicError.html('');
				} else{
		    	yanError.slideUp(500);
				}
		  } 
		});
		yanzmId.on('keydown',function(event){
		  if(!event){event = window.event;}
		  if((event.keyCode || event.which) == 13 ){
		    that.activityFn ();
		    that.yanAsync = false;
		    return false;
		  } else if((event.keyCode || event.which) == 9){
		    if($(this).val() == ''){
					if(that.layoutType=='3' || that.layoutType=='4' ){
						that.publicError.html(that.alertArr.yanErrorText);
					} else{
		     	 yanError.slideDown(500);
					}
		    }
		  }
		});
	}
	//获取验证码事件
	Liuzi.prototype.getPasswordFn = function(phoneId,phoneError,yanzmBtn){
		var that=this;
		yanzmBtn.on('click',function(){
	    var userPhone = phoneId.val();
	    if(userPhone=='' || !that.reg.test(userPhone)){
	      phoneError.slideDown(500);
	    }
	    else{
	      $(this).css('background','#c6c6c6');
	      phoneError.slideUp(500);
	      phoneId.attr('disabled',true);
	      that.sendCode(phoneId, yanzmBtn, 60);
	      that.yanError.slideUp(500);
	    }
	  })
	}
	//全局回车事件
	Liuzi.prototype.keyhuiFn = function(hdBtn){
		var that = this;
		if(this.tgsb=='pc'){
			document.onkeydown = function(event){
		    if(!event){
		     event = window.event;//火狐浏览器
		    }
		    if((event.keyCode || event.which) == 13 ){
		      that.activityFn ()
		      return false;
		    }
		  }
		}
	  //领取红包
	  hdBtn.on("click", (e)=> {
	     that.activityFn ();
	     return false;     
	  });
	}
	//领取红包
	Liuzi.prototype.activityFn = function(){
    var userName  = this.nameId.val(),
        userPhone = this.phoneId.val(),
        yan       = this.yanzmId.val(),
				that      = this;
				if(that.layoutType==0 || that.layoutType=='1' || that.layoutType==5 ){
					if(this.removeAllSpace(userName)=='' ){
						this.nameError.slideDown(500);
					}
					if(userPhone =='' || !that.reg.test(userPhone)){
						this.phoneError.slideDown(500);
					}
					if(that.removeAllSpace(yan) == ''){
						this.yanError.slideDown(500);
					}
					if(that.removeAllSpace(userName)=='' || that.removeAllSpace(yan )=='' ||  !that.reg.test(userPhone)  ){
						return false;
					}					
				} else if(that.layoutType==3 || that.layoutType==4){
					if(this.removeAllSpace(userName)=='' ){
						this.publicError.html(that.alertArr.nameErrorText)
						return false;
					}
					if(userPhone =='' || !that.reg.test(userPhone)){
						this.publicError.html(that.alertArr.phoneErrorText)
						return false;
					}
					if(that.removeAllSpace(yan) == ''){
						this.publicError.html(that.alertArr.yanErrorText)
						return false;
					}
				}
				if($("#select_city").length>0){
					that.cityName = $("#select_city").find('p').attr('data-id');
				} else if(getCookie('city_name') != null && getCookie('city_name') != undefined){
					that.cityName = getCookie('city_name');
				}
			    $.ajax({
			      type: "POST",
			      url: that.huodongUrl,
			      data: { 
			        nick_name: userName,
			        phone    : userPhone,
							code     : yan,
							city_name: that.cityName,
							hd_name  : that.hd_name,
			        zjfrom   : that.zjfrom,
			        tgjh   	 : that.tgjh,
			        tgdy   	 : that.tgdy,
			        gjc   	 : that.gjc,
			        gjcppms  : that.gjcppms,
			        gjcpm    : that.gjcpm,
			        tgcy   	 : that.tgcy,
			        ggsc   	 : that.ggsc,
			        ggw   	 : that.ggw,
			        pd   	   : that.pd,
			        xq   		 : that.xq,
			        xb   		 : that.xb,
			        nld   	 : that.nld,
							tgsb  	 : that.tgsb,
							loupan_id: that.loupan_id,
							loupan_name: that.loupan_name,
							clue_type_id  : that.clue_type_id,
							refcode : that.refcode,
							visitor_id : getCookie('niandu_customer_id')
			      },
			      // dataType: "json",
			      async:false,
			      success: (data)=> {
		         	if(data.message=='succeed'){
								setCookie('niandu_customer_id',data.data.customer_id);
								setCookie('niandu_phone',data.data.phone);
			      	 	that.statusSucceed();
			        } else if(data.message=='fail'){
			        	that.statusFail(); 
			        } else if(data.message=='participated'){
								setCookie('niandu_customer_id',data.data.customer_id);
								setCookie('niandu_phone',data.data.phone);
			        	that.statusRepeat();
			        } else if(data.message=="precondition_required"){
								that.expire(data);
							}
			      },
			      error : (data)=>{
			        console.log(data)
			      }
					})
					var nameZhuge = '';
					if(that.clue_type_id==6){
						nameZhuge='提交领取红包';
					} else if(that.clue_type_id==4){
						nameZhuge='提交预约专车';
					}
					zhuge.track(nameZhuge, {
						'所属页面' : that.hd_name,
						'品牌馆/楼盘/活动ID' : that.loupan_id,
						'品牌馆/楼盘/活动名称' : that.loupan_name,
						'留资手机号' : userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
					});
	}
	//重复回调
	Liuzi.prototype.statusRepeat = function(){
		let that = this;
		if(this.tgsb=='pc'){
			if(this.layoutType=='0'){
				$("#footer1").fadeIn();
	      $("#success_cont").html(`${that.alertArr.repeatStr}`);
        setTimeout(function(){
       		that.yanError.hide();
        },3000)
			} else if(this.layoutType=='1'){
				that.alertId.html(that.alertArr.repeatStr);
        that.alertId.show();
        setTimeout(function(){
       		that.alertId.hide();
        },3000);
			} else if(this.layoutType=='3' || this.layoutType=='4'){
				this.publicError.html(that.alertArr.repeatStr);
				return false;
			}
			setTimeout(()=>{
        that.nameId.val("");
        that.phoneId.val("").attr('disabled',false);
        that.yanzmId.val("");
        $("#footer1").fadeOut();
        clearInterval(that.time);
        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
      },3000);
		} else if(this.tgsb=='m'){
			if(this.layoutType=='0'){
				$('#liuzi').hide();
				$("#statusId").show();
	      $("#success_cont").html(that.alertArr.repeatStr);
	      setTimeout(()=>{
	        that.nameId.val("");
	        that.phoneId.val("").attr('disabled',false);
	        that.yanzmId.val("");
	        $('#liuzi').show();
	        $("#statusId").fadeOut();
	        clearInterval(that.time);
	        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
	      },3000);
			} else if(this.layoutType=='3' || this.layoutType=='4'){
				this.publicError.html(that.alertArr.repeatStr);
				return false;
			}
		}
	}
	//失败回调
	Liuzi.prototype.statusFail = function(){
		let that = this;
		if(this.tgsb=='pc'){
			if(this.layoutType=='0'){
				that.yanError.slideDown(500); 
			} else if(this.layoutType=='1'){
				that.yanError.slideDown(500);
			} else if(this.layoutType=='3' || this.layoutType=='4'){
				this.publicError.html(that.alertArr.yanErrorText);
				return false;
			}
		} else if(this.tgsb=='m'){
			if(this.layoutType=='0' || this.layoutType==5){
				that.yanError.slideDown(500);
			} else if(this.layoutType=='3' || this.layoutType=='4' ){
				this.publicError.html(that.alertArr.yanErrorText);
				return false;
			}
		}
	}
	// 成功回调
	Liuzi.prototype.statusSucceed = function(){
		let that = this;
		if(this.tgsb=='pc'){
			if(this.layoutType=='0'){
				$("#footer1").fadeIn();
				$("#success_cont").html(that.alertArr.succeedStr);
			} else if(this.layoutType=='1'){
				that.alertId.html(that.alertArr.succeedStr);
        that.alertId.show();
        setTimeout(function(){
       		that.alertId.hide();
        },3000)
			}else if(this.layoutType=='3'){
				$("#footer1").find('img').attr('src',that.alertArr.succeedStr);
				$("#footer").hide();
				$("#footer1").show();
				setTimeout(function(){
					$("#footer").show();
					$("#footer1").hide();
					that.publicError.html('');
				},3000);
			}else if(this.layoutType=='4'){
				if(that.huidiao){
					that.successful({
						async : true,
						phone : that.phoneId.val()
					});
				} else{
					that.hdBtn.html(that.alertArr.succeedStr);
					setTimeout(function(){
						that.hdBtn.html('预约免费专车');
					},3000);
				}
			}
			setTimeout(()=>{
        that.nameId.val("");
        that.phoneId.val("").attr('disabled',false);
        that.yanzmId.val("");
        $("#footer1").fadeOut();
        clearInterval(that.time);
        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
      },3000);
		} else if(this.tgsb=='m'){
			if(this.layoutType=='0'){
				$('#liuzi').hide();
				$("#statusId").show();
	      $("#success_cont").html(that.alertArr.succeedStr);
	      setTimeout(()=>{
	        that.nameId.val("");
	        that.phoneId.val("").attr('disabled',false);
	        that.yanzmId.val("");
	        $('#liuzi').show();
	        $("#statusId").hide();
	        clearInterval(that.time);
	        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
	      },3000);
			} else if(this.layoutType=='3'){
				$("#footer1").find('img').attr('src',that.alertArr.succeedStr);
				$("#footer").hide();
				$("#footer1").show();
				setTimeout(function(){
					that.nameId.val("");
					that.phoneId.val("").attr('disabled',false);
					that.yanzmId.val("");
					clearInterval(that.time);
					that.publicError.html('');
					that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
					$("#footer").show();
					$("#footer1").hide();
				},3000);
			}else if(this.layoutType=='4'){
				that.hdBtn.html(that.alertArr.succeedStr);
				setTimeout(function(){
					that.hdBtn.html('预约免费专车');
					that.nameId.val("");
					that.phoneId.val("").attr('disabled',false);
					that.yanzmId.val("");
					clearInterval(that.time);
					that.publicError.html('');
					that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
					$("#footer").show();
					$("#footer1").hide();
				},3000);
			}else if(this.layoutType=='5'){
        setCookie('zj_tow11_phone',that.phoneId.val());
        setTimeout(()=>{
          $('#box_alert').fadeOut();
					$("body").off("touchmove");
        },2000)
      }
		}
	}
	//活动到期
	Liuzi.prototype.expire = function(data){
		let that = this;
		if(this.tgsb=='pc'){
			if(this.layoutType=='0'){
				$("#footer1").fadeIn();
				$("#success_cont").html(that.alertArr.expireStr);
			}
			setTimeout(()=>{
        that.nameId.val("");
        that.phoneId.val("").attr('disabled',false);
        that.yanzmId.val("");
        $("#footer1").fadeOut();
        clearInterval(that.time);
        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
      },3000);
		} else if(this.tgsb=='m'){
			if(this.layoutType=='0'){
				$('#liuzi').hide();
				$("#statusId").show();
	      $("#success_cont").html(that.alertArr.expireStr);
	      setTimeout(()=>{
	        that.nameId.val("");
	        that.phoneId.val("").attr('disabled',false);
	        that.yanzmId.val("");
	        $('#liuzi').show();
	        $("#statusId").hide();
	        clearInterval(that.time);
	        that.yanzmBtn.val(that.yanzmText).css('background','#a6a6a6');
	      },3000);
			}
		}
	}
	//监测代码
	Liuzi.prototype.jianceDaima = function(){
		if(this.tgsb=='pc'){
			var _hmt = _hmt || [];
		  (function() {
		    var hm = document.createElement("script");
		    hm.src = "https://hm.baidu.com/hm.js?d3e30511a214ab27c29703983af591cb";
		    var s = document.getElementsByTagName("script")[0]; 
		    s.parentNode.insertBefore(hm, s);
		  })();
		} else if(this.tgsb=='m'){
			var _hmt = _hmt || [];
			(function() {
			    var hm = document.createElement("script");
			    hm.src = "https://hm.baidu.com/hm.js?03cf2b129bc3e77b681764ab590e4c39";
			    var s = document.getElementsByTagName("script")[0];
			    s.parentNode.insertBefore(hm, s);
			})();
		}
	}
	//存储cookie
	Liuzi.prototype.cookieFn = function(){
		this.zjfrom    = getQueryString('zjfrom')!=null?getQueryString('zjfrom'):getCookie('zjfrom'),
    this.tgjh      = getQueryString('tgjh')!=null?getQueryString('tgjh'):getCookie('tgjh'),
    this.tgdy      = getQueryString('tgdy')!=null?getQueryString('tgdy'):getCookie('tgdy'),
    this.gjc       = getQueryString('gjc')!=null?getQueryString('gjc'):getCookie('gjc'),
    this.gjcpm     = getQueryString('gjcpm')!=null?getQueryString('gjcpm'):getCookie('gjcpm'),
    this.gjcppms   = getQueryString('gjcppms')!=null?getQueryString('gjcppms'):getCookie('gjcppms'),
    this.tgcy      = getQueryString('tgcy')!=null?getQueryString('tgcy'):getCookie('tgcy'),
    this.ggsc      = getQueryString('ggsc')!=null?getQueryString('ggsc'):getCookie('ggsc'),
    this.ggw       = getQueryString('ggw')!=null?getQueryString('ggw'):getCookie('ggw'),
   	this.pd        = getQueryString('pd')!=null?getQueryString('pd'):getCookie('pd'),
    this.xq        = getQueryString('xq')!=null?getQueryString('xq'):getCookie('xq'),
    this.xb        = getQueryString('xb')!=null?getQueryString('xb'):getCookie('xb'),
    this.nld       = getQueryString('nld')!=null?getQueryString('nld'):getCookie('nld'),
		this.tgsb      = this.tgsb;
    //监测代码
    this.jianceDaima();
	  //取得地址栏  指定参数
	  function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
    	try {
    		return decodeURI(r[2]); 
    	} catch(e){
    		try {
    			return $URL.decode(r[2]); 
    		}catch(e) {
	    		return null;
	    	} 
    	}   	
	  }
	    /*cookie 存储zjfrom 的值*/
	  function setCookie(name,value,days){
	    var Days = 1000 ;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ encodeURI (value) + ";expires=" + exp.toGMTString()+";domain = zeju.com"+";path=/";
	  }
	  //获取cookie
	  function getCookie(name) {
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)){
				return decodeURI(arr[2]); 
	    } else {
	      return null;
	    }
		}

		//加零
		function jia_ling (num) {
			return num<10 ? '0' +num : num;
		}

		if(this.tgsb=='m'){
			
			if(this.zjfrom !=null && this.zjfrom !=''){
				this.zjfrom = jia_ling(this.zjfrom)
			} else{
				this.zjfrom = '00';
			}
		}
		else{
			if(this.zjfrom !=null && this.zjfrom !=''){
				this.zjfrom = jia_ling(this.zjfrom)
			} else{
				this.zjfrom = '16';
			}
		}
	  if(getQueryString('zjfrom')!=null){setCookie("zjfrom",getQueryString('zjfrom'));}
	  if(getQueryString('tgjh')!=null){setCookie("tgjh",getQueryString('tgjh'));}
	  if(getQueryString('tgdy')!=null){setCookie("tgdy",getQueryString('tgdy'));}
	  if(getQueryString('gjc')!=null){setCookie("gjc",getQueryString('gjc'));}
	  if(getQueryString('gjcpm')!=null){setCookie("gjcpm",getQueryString('gjcpm'));}
	  if(getQueryString('gjcppms')!=null){setCookie("gjcppms",getQueryString('gjcppms'));}
	  if(getQueryString('tgcy')!=null){setCookie("tgcy",getQueryString('tgcy'));}
	  if(getQueryString('ggsc')!=null){setCookie("ggsc",getQueryString('ggsc'));}
	  if(getQueryString('ggw')!=null){setCookie("ggw",getQueryString('ggw'));}
	  if(getQueryString('pd')!=null){setCookie("pd",getQueryString('pd'));}
	  if(getQueryString('xq')!=null){setCookie("xq",getQueryString('xq'));}
	  if(getQueryString('xb')!=null){setCookie("xb",getQueryString('xb'));}
		if(getQueryString('nld')!=null){setCookie("nld",getQueryString('nld'));}  
	
	}
	//发送验证码
	Liuzi.prototype.sendCode = function(phoneId, yanzmBtn,timeout){
		var that=this;
		phoneId.Hunxiao()  ;
    yanzmBtn.attr("disabled", true);
    $.ajax({
      type:'POST',
      url:'http://webapi.zeju.com/vcode/send',
      data:{
        phone: phoneId.val(),
        authenticity_token: $("input[name='authenticity_token']").val(),
        token: sJWT
      },
      cache:false,
      dataType:'json',
      success:function(data){
        if (data.status==0) { 
          that.time=setInterval(function(){
            --timeout;
            if(timeout==59){yanzmBtn.css('background','#a6a6a6');}
           	that.daojishi(phoneId,yanzmBtn,timeout,that.time); 
          },1000)
        }else{
          yanzmBtn.removeAttr("disabled");
          phoneId.attr('disabled',false);
          yanzmBtn.css('background',that.yanBtnColor);
        }
      }
    });
	  
	}
	//倒计时
	Liuzi.prototype.daojishi = function(phoneId,yanzmBtn,timeout,time){
		yanzmBtn.val(timeout + "秒");
	  if(timeout<1){
	    yanzmBtn.val(this.yanzmText).attr("disabled", false);
	    phoneId.attr('disabled',false);
	    yanzmBtn.css('background',that.yanBtnColor);
	    clearInterval(this.time);
	  }
	}
  $.fn.extend({
		Liuzi : function(opts,fn) {
			return new Liuzi(this,opts,fn)
		}
	})
})(window,jQuery);