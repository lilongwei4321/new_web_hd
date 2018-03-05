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
    var tgsb = '';
    var bodyH = $(window).height(),
        reg = /^1[34578]\d{9}$/,
        qing_name = 0;

    $('.ztc_wrap').height(bodyH);
    $("#user_yanzmBtn").attr('disabled', true);
    $('.ztc_box').css({
        'display': 'block'
    })

    //请红包  变动
    function qiang_name() {
        $.ajax({
            type: "GET",
            url: "http://webapi.zeju.com/liuzi/hd_count",
            data: {
                name: 'lqhb1288'
            },
            dataType: "json",
            success: function (data) {
                var count = Number(data.data.count);
                qing_name = count + 148;

                if (Number(qing_name) >= 800) {
                    var num = 1000 - Number(qing_name);
                    var str = '<span>还剩<b id="qing_name">' + num + '</b>份</span>' +
                        '<span>限额送<b>1000</b>份</span>';
                } else {
                    var str = '<span>已抢<b id="qing_name">' + qing_name + '</b>份</span>' +
                        '<span>限额送<b>1000</b>份</span>';
                }

                $("#ztc_title").html(str)
            },
            error: function (data) {
                console.log(data, 'cuo')
            }
        })
    }
    qiang_name()
        /*var time=setInterval(function(){
        	console.log(qing_name)
        	$('#qing_name').html(qing_name++)
        	if(qing_name>=500){
        		clearInterval(time)
        	}
        },10)*/
        //&('#ztc_title')

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
        $('.ztc_back').attr('src', 'assets/images/ztc/ztc_back_m.png');
        $('.ztc_cont_pic').attr('src', 'assets/images/ztc/ztc_gong_m.png');
        /*更改根类名*/
        $(".ztc_wrap").removeClass('ztc_wrap_pc').addClass('ztc_wrap_m');
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?03cf2b129bc3e77b681764ab590e4c39";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
        tgsb = 'm';
    } else {
        $('.ztc_back').attr('src', 'assets/images/ztc/ztc_back.png');
        $('.ztc_cont_pic').attr('src', 'assets/images/ztc/ztc_gong_pc.png');
        $(".ztc_wrap").removeClass('ztc_wrap_m').addClass('ztc_wrap_pc');
        $(".flex").removeClass('flex');

        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?d3e30511a214ab27c29703983af591cb";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
        tgsb = 'pc';
    }


    // 点击  抢红包
    function ztc_btn() {
        var userName = $("#user_name").val(),
            userPhone = $("#user_phone").val(),
            userYanzm = $("#user_yanzm").val();

        if (userName == '' || userName.length > 16) {
            $("#user_error").text("请输入正确称呼！");
            return false;
        }
        if (userPhone == '' || !reg.test(userPhone)) {
            $("#user_error").text("请输入正确的手机号！");
            return false;
        }
        if (userYanzm == '') {
            $("#user_error").text("请输入正确的验证码！");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "http://webapi.zeju.com/liuzi/lqhb1288",
            data: {
                nick_name: userName,
                phone: userPhone,
                code: "" + userYanzm + "",
                zjfrom: zjfrom,
                tgjh: tgjh,
                tgdy: tgdy,
                gjc: gjc,
                gjcppms: gjcppms,
                gjcpm: gjcpm,
                tgcy: tgcy,
                ggsc: ggsc,
                ggw: ggw,
                pd: pd,
                xq: xq,
                xb: xb,
                nld: nld,
                tgsb: tgsb,
                clue_type_id :"6"
            },
            dataType: "json",
            success: function (data) {
                if (data.message == "fail") {
                    $("#user_error").text("请输入正确的验证码！");
                } else if (data.message == "succeed") {
                    $(".ztc_cont_pic").css({
                        "display": "block"
                    });
                    $(".ztc_cont_rig .ztc_cont_title").css({
                        "display": "none"
                    });
                    $(".ztc_cont_rig .ztc_cont_box").css({
                        "display": "none"
                    });
                    $("#user_error").text("您已成功领取红包");

                    qiang_name()
                        // setCookie("qing_name",qing_name,200);
                    setTimeout(function () {
                        window.history.go(-1);
                    }, 3000)
                } else if (data.message == "participated") {
                    $("#user_error").text("此手机号已领取红包，请不要重复提交");
                }
            },
            error: function (data) {
                console.log(data)
            }
        })
    }



    /*手机号输入   变类名*/
    $("#user_phone").on("keyup", function () {
        if ($(this).val() != '') {
            $("#user_yanzmBtn").attr("disabled", false);
            $("#user_yanzmBtn").addClass("yanzm_btncolor");
        } else {
            $("#user_yanzmBtn").attr("disabled", true);
            $("#user_yanzmBtn").removeClass("yanzm_btncolor");
        }

    })

    /*获取验证码*/
    $("#user_yanzmBtn").on('click', function () {
        var userPhone = $("#user_phone").val();
        if (userPhone == '' || !reg.test(userPhone)) {
            $("#user_error").text("请输入正确的手机号！");
        } else {
            $("#user_error").text("");
            $("#user_phone").attr('disabled', true);
            sendCode("#user_phone", "#user_yanzmBtn", false, 60);
        }
    })

    $("#user_phone").on('keyup', function (e) {
        if ((event.keyCode || event.which) == 13) {
            ztc_btn()
            return false;
        }

        if ($(this).val() == '') {
            $("#user_error").text("");
        } else if ($(this).val().length > 11 || !Number($(this).val())) {
            $("#user_error").text("请输入正确的手机号！");
        } else {
            $("#user_error").text("");
        }
    })

    document.onkeydown = function (event) {
        if (!event) {
            event = window.event; //火狐浏览器
        }
        if ((event.keyCode || event.which) == 13) {
            ztc_btn()
        }
    }

    $("#ztc_cont_btn").on("click", function (e) {
        ztc_btn()
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
})(jQuery)