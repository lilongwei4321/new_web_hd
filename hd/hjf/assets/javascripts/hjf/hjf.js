(function () {
    //留资入口
    var zjfrom = getQueryString('zjfrom') != null ? getQueryString('zjfrom') : getCookie('zjfrom');
    var tgjh = getQueryString('tgjh') != null ? getQueryString('tgjh') : getCookie('tgjh');
    var tgdy = getQueryString('tgdy') != null ? getQueryString('tgdy') : getCookie('tgdy');
    var gjc = getQueryString('gjc') != null ? getQueryString('gjc') : getCookie('gjc');
    var gjcpm = getQueryString('gjcpm') != null ? getQueryString('gjcpm') : getCookie('gjcpm');
    var gjcppms = getQueryString('gjcppms') != null ? getQueryString('gjcppms') : getCookie('gjcppms');
    var tgcy = getQueryString('tgcy') != null ? getQueryString('tgcy') : getCookie('tgcy');
    var ggsc = getQueryString('ggsc') != null ? getQueryString('ggsc') : getCookie('ggsc');
    var ggw = getQueryString('ggw') != null ? getQueryString('ggw') : getCookie('ggw');
    var pd = getQueryString('pd') != null ? getQueryString('pd') : getCookie('pd');
    var xq = getQueryString('xq') != null ? getQueryString('xq') : getCookie('xq');
    var xb = getQueryString('xb') != null ? getQueryString('xb') : getCookie('xb');
    var nld = getQueryString('nld') != null ? getQueryString('nld') : getCookie('nld');
    var tgsb='';

    /*判断当前 设备*/
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "MeeGo", "Touch", "RIM Tablet OS"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    /* 根据设备  显示不同样式 */

    if (!IsPC()) {
        /*console.log($('#loupan_back').attr('src'))*/
        $('#loupan_apply').attr('src', 'assets/images/seascape/m_apply.png');
        $('#loupan_back').attr('src', 'assets/images/seascape/m_border.png');
        $('#loupan_bottom').attr('src', 'assets/images/seascape/m_bottom.png');
        /*更改根类名*/
        $("#seascape_wrap").addClass('seascape_wrap1');
        $(".phone_btn").css('display', 'block');
        tgsb="m";
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?03cf2b129bc3e77b681764ab590e4c39";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    } else {
        $('#loupan_apply').attr('src', 'assets/images/seascape/pc_apply.png');
        $('#loupan_back').attr('src', 'assets/images/seascape/pc_border.png');
        $('#loupan_bottom').attr('src', 'assets/images/seascape/pc_bottom.png');
        $(".phone_btn").css('display', 'none');
        tgsb="pc";
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?d3e30511a214ab27c29703983af591cb";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }
    var str = '';
    var data = [
        {
            'name': '东戴河专线',
            'arr': [
                {
                    'img': '/263804351010818/item/385864218808319/8828ad49-ff52-4e1e-9131-8e21f36be4d2.jpg',
                    'title': '海天翼',
                    'num': '7800/m2',
                    'tel': '10408',
                    'value': '我要报名',
                    'loupan_id': 'haitianyi/385864218808319'
				},
                {
                    'img': '/263804351010818/item/388015253532671/35c5f0a3-ac67-468c-a2d9-59285fe3f813.jpg',
                    'title': '利源幸福浬',
                    'num': '7000/m2',
                    'tel': '10725',
                    'value': '我要报名',
                    'loupan_id': 'liyuanxingfuli/388015253532671'
				},
                {
                    'img': '/263804351010818/item/382551435290622/696c2493-bf95-4c93-8798-f3e1edcd32cc.jpg',
                    'title': '海韵馨园',
                    'num': '5500/m2',
                    'tel': '10362',
                    'value': '我要报名',
                    'loupan_id': 'haiyunxinyuan/382551435290622'
				},
                {
                    'img': '/263804351010818/item/392592977932287/a9f5958e-6401-47fe-b512-b9e7da84b749.jpg',
                    'title': '金丝新天地',
                    'num': '4800/m2',
                    'tel': '10867',
                    'value': '我要报名',
                    'loupan_id': 'jinsixintiandi/392592977932287'
				}
			]
		},
        {
            'name': '秦皇岛专线',
            'arr': [
                {
                    'img': '/263804351010818/item/388056697223166/8e31b415-78ef-463c-bc5b-a0f9a1ce6715.jpg',
                    'title': '骊郡华府',
                    'num': '4300/m2',
                    'tel': '10734',
                    'value': '我要报名',
                    'loupan_id': 'lijunhuafu/388056697223166'
				},
                {
                    'img': '/263804351010818/item/385259538692094/4f1ed0fc-3101-4a23-9770-a34cd95d9d3e.jpg',
                    'title': '国兴公园里',
                    'num': '7800/m2',
                    'tel': '10403',
                    'value': '我要报名',
                    'loupan_id': 'guoxinggongyuanli/385259538692094'
				},
                {
                    'img': '/263804351010818/item/390852643819519/b60c1e8d-19be-4f6e-91f7-665130919333.jpg',
                    'title': '临海听涛',
                    'num': '8000/m2',
                    'tel': '10781',
                    'value': '我要报名',
                    'loupan_id': 'linhaitingtao/390852643819519'
				},
                {
                    'img': '/263804351010818/item/385153687613439/42df3f48-b3c8-4338-bfd5-220212f4d919.jpg',
                    'title': '盛华苑',
                    'num': '5470/m2',
                    'tel': '10393',
                    'value': '我要报名',
                    'loupan_id': 'shenghuayuan/385153687613439'
				}
			]
		}
	]

    $.each(data, function (ind, item) {
        str += '<div class="tuwen">' +
            '<h4 class="container_title"><span>' + item.name + '</span> </h4>' +
            '<div class="mainBox_contRow">';
        $.each(item.arr, function (i, m) {
            if (i % 2 == 0) {
                str += '<dl class="divWei left">';
            } else {
                str += '<dl class="divWei right">';
            }
            str += '<dt>' +
                '<a href="' + m.loupan_id + '" style="background-image:url(http://imgs.zeju.cn' + m.img + ')" class="loupan_xqbtn"></a>' +
                '</dt>' +
                '<dd>' +
                '<h2>' + m.title + '</h2>' +
                '<p><span class="price">' + m.num + '</span><span class="phone_btn"><a href="tel:4000808303,' + m.tel + '' + zjfrom + '"></a></span></p>' +
                '<div><a href="http://m.zeju.com/yueche.html"><input class="baoBtn baoming_btn" type="button" value="' + m.value + '"></a></div>' +
                '</dd></dl>';

        })
        str += '</div>';

        if (ind == 0) {
            str += '<h4 class="container_genduo"><a href="javascript:;" ><span id="kangenduo_btn" >查看更多</span></a></h4>';
        } else {
            str += '<h4 class="container_genduo"><a href="javascript:;" ><span id="kangenduo_btn1" >查看更多</span></a></h4>';
        }
        str += '</div>';
    })
    $('.mainBox_cont').html(str);

    /*关闭弹框 */
    $("#alert_guan").on('click', function () {
        $("#box_alert").css('display', 'none');
        $('body').css({
            'height': 'auto',
            'overflow': 'inherit'
        })
    })

    /*点击报名  弹出弹框*/
    $(".baoming_btn").on('click', function (event) {
            if (IsPC()) {
                event.preventDefault();
                $("#box_alert").css('display', 'block');
                $('body').css({
                    'height': '100%',
                    'overflow': 'hidden'
                })
            }
        })
        /*楼盘跳转详情*/
    $(".loupan_xqbtn").on('click', function (event) {
            event.preventDefault();
            if (IsPC()) {
                location.href = "http://bj.zeju.com/loupan/" + $(this).attr('href') + '.html'
            } else {
                var loupanID = $(this).attr('href').split('/')[1];
                location.href = "http://m.zeju.com/bj/loupan/" + loupanID + '.html'
            }
        })
        /*更多跳转页面*/
    $(".tuwen").on('click', '#kangenduo_btn', function () {
        if (IsPC()) {
            location.href = "http://bj.zeju.com/loupan/dongdaihe/"
        } else {
            location.href = "http://m.zeju.com/bj/loupan/dongdaihe"
        }
    })

    $(".tuwen").on('click', '#kangenduo_btn1', function () {
        if (IsPC()) {
            location.href = "http://bj.zeju.com/loupan/qinhuangdao/"
        } else {
            location.href = "http://m.zeju.com/bj/loupan/qinhuangdao"
        }
    })

    /*给手机发送验证码*/
    var disabled = false;
    var timeout = 60;
    //获取验证码倒计时
    $("#cod_btn").click(function () {
        sendCode("#alert_tel", "#cod_btn", disabled, timeout);
    });

    /*输入内容，为空时，改变placeholder的类名*/
    function focusInput(btn, text) {
        btn.attr('placeholder', text);
        btn.removeClass('input-placeholder-color');
    }

    $("#alert_yan").on('focus', function () {
        focusInput($(this), '请输入验证码')
    })
    $("#alert_title").on('focus', function () {
        focusInput($(this), '怎么称呼您')
    })
    $("#alert_tel").on('focus', function () {
        focusInput($(this), '请输入您的手机号')
    })


    /*提交报名数据*/
    $("#box_alertBtn").on('click', function () {
        /*判断验证码是否为空*/
        if (Number($("#alert_yan").val()) == '') {
            $("#alert_yan").attr('placeholder', '验证码不可以为空');
            $("#alert_yan").addClass('input-placeholder-color');
            return false;
        }
        /*判断用户名称*/
        if ($("#alert_title").val() == '') {
            $("#alert_title").attr('placeholder', '请填入您的称呼');
            $("#alert_title").addClass('input-placeholder-color');
            return false;
        }

        if (phone_pan($("#alert_tel"))) {
            $.ajax({
                type: 'POST',
                url: 'http://bj.zeju.com/yueche.json',
                data: {
                    "nick_name": $("#alert_title").val(),
                    "phone": Number($("#alert_tel").val()),
                    "code": Number($("#alert_yan").val()),
                    "zjfrom": zjfrom,
                    "tgjh": tgjh,
                    "tgdy": tgdy,
                    "gjc": gjc,
                    "gjcppms": gjcppms,
                    "gjcpm": gjcpm,
                    "tgcy": tgcy,
                    "ggsc": ggsc,
                    "ggw": ggw,
                    "pd": pd,
                    "xq": xq,
                    "xb": xb,
                    "nld": nld,
                    "tgsb":tgsb,
                    "clue_type_id" :'4'
                },
                success: function (data) {
                    if (data.result) {
                        $("#box_alertBtn").text(data.message);
                        setTimeout(function () {
                            $("#box_alert").css('display', 'none');
                            /*用户名称*/
                            $("#alert_title").val('')
                                /*手机号*/
                            $("#alert_tel").val('')
                                /*验证码*/
                            $("#alert_yan").val('')
                                /*预约专车*/
                            $("#box_alertBtn").text('预约免费专车')
                                /*发送验证码*/
                            $('#cod_btn').val('获取验证码')
                            $('body').css({
                                'height': 'auto',
                                'overflow': 'inherit'
                            })
                        }, 3000)
                    }
                }
            });
        }
    })

    //存储留资
    if(getQueryString('zjfrom')!=null){setCookie('zjfrom',zjfrom)}
    if(getQueryString('tgjh')!=null){setCookie('tgjh',tgjh)}
    if(getQueryString('tgdy')!=null){setCookie('tgdy',tgdy)}
    if(getQueryString('gjc')!=null){setCookie('gjc',gjc)}
    if(getQueryString('gjcpm')!=null){setCookie('gjcpm',gjcpm)}
    if(getQueryString('gjcppms')!=null){setCookie('gjcppms',gjcppms)}
    if(getQueryString('tgcy')!=null){setCookie('tgcy',tgcy)}
    if(getQueryString('ggsc')!=null){setCookie('ggsc',ggsc)}
    if(getQueryString('ggw')!=null){setCookie('ggw',ggw)}
    if(getQueryString('pd')!=null){setCookie('pd',pd)}
    if(getQueryString('xq')!=null){setCookie('xq',xq)}
    if(getQueryString('xb')!=null){setCookie('xb',xb)}
    if(getQueryString('nld')!=null){setCookie('nld',nld)}
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
})()