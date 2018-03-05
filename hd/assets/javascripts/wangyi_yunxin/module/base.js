'use strict'
var YX = function (accid) {
    if(accid==null){
        return
    }
    //console.log(accid)
    this.accid = accid
    this.initModule()
    this.cache = new Cache()
    this.mysdk = new SDKBridge(this, this.cache)
    //console.log(this.cache)
  //  this.myNetcall = new NetcallBridge(this)
    this.firstLoadSysMsg = true
    this.totalUnread = 0
}
YX.fn = YX.prototype

YX.fn.initModule = function () {
    this.initBase()
    this.message()

    this.personCard() //我的信息
    this.session()
}
YX.fn.initBase = function () {
	// 初始化节点事件
	this.$mask = $('#mask')
	//左上角信息
	//this.$userPic = $('#userPic')
	this.$userName = $('#userName')
    //右边面板内容节点
    this.$rightPanel = $('#rightPanel')
    this.$chatTitle = $('#chatTitle')
    this.$chatContent = $('#chatContent')
    this.$nickName = $('#nickName')
    //切换的面板
    this.$panelItems = $('#left-panel .item')

	//登出
	this.logoutEvt()
    //多端登陆
    this.multiportEvt()
}

/**
 * 同步完成后 UI显示  本demo这里显示最近会话列表 跟消息中心 新系统通知技术计数
 * @see session.js 
 */
YX.fn.initUI = function () {
    this.buildSessions()
}
/**
 * 初始化个人信息回调 显示左上角信息
 */
YX.fn.showMe = function () {
	var user = this.cache.getUserById(userUID)
	this.$userName.text(user.nick)
	//this.$userPic.attr('src', getAvatar(user.avatar))
	setCookie('nickName',user.nick)
	setCookie('avatar',user.avatar)
}
/*********************************************
 * SDK初始化结束后，拉取需要用到的用户信息，群组信息
 *********************************************/
YX.fn.initInfo = function (obj, team) {
	this.lockPerson = true
    this.lockTeam = true
    var array = Object.keys(obj),
        teamArray=[]
    for (var i = team.length - 1; i >= 0; i--) {
        if(!this.cache.hasTeam(team[i])){
            teamArray.push(team[i])
        }
    }
    if(teamArray.length>0){
        this.mysdk.getLocalTeams(teamArray,this.cbInitLocalTeamInfo.bind(this))           
    }else{
        this.lockTeam = false
    }
   // console.log(this)
    this.mysdk.getUsers(array,this.cbInitInfo.bind(this)) 
}
YX.fn.cbInitInfo = function (error, data) {       
    if(!error){
        this.cache.setPersonlist(data)
        this.lockPerson = false
        if(this.lockTeam === false){
            this.initUI()   
        }
    }else{
        alert("获取用户信息失败")
    }   
}

/*********************************
 * 点击左边面板，打开聊天框
 *********************************/
YX.fn.openChatBox = function (account, scene) {
    var info
    this.mysdk.setCurrSession(scene,account)
    this.crtSession = scene+"-"+account
    this.crtSessionType = scene
    this.crtSessionAccount = account
    //隐藏其他窗口
    $('#teamInfoContainer') && $('#teamInfoContainer').addClass('hide')
    this.$devices && this.$devices.addClass('hide')
    this.$cloudMsgContainer && this.$cloudMsgContainer.addClass('hide')
    //退群的特殊UI
    this.$rightPanel.find(".u-chat-notice").addClass("hide")
    this.$rightPanel.find(".chat-mask").addClass("hide")
    this.$rightPanel.removeClass('hide') 
    this.$messageText.val('')

    // 让netcall.js感知到打开聊天框的操作，做一些UI层的控制
    this.myNetcall && this.myNetcall.whenOpenChatBox(scene, account);

    //根据帐号跟消息类型获取消息数据
    if(scene=="p2p"){
        info = this.cache.getUserById(account);
        if (window.CONFIG.openSubscription) {
            var multiPortStatus = this.cache.getMultiPortStatus(account)
            if (multiPortStatus) {
              this.$nickName.text(this.getNick(account) /*+ ' [' + multiPortStatus + ']'*/)
            } else {
              this.$nickName.text(this.getNick(account) /*+ ' [离线]'*/)
            }
        } else {
            this.$nickName.text(this.getNick(account))
        }
        this.$chatTitle.find('img').attr('src', getAvatar(info.avatar))       
    }
    // 根据或取聊天记录
    this.getHistoryMsgs(scene,account) 
}
//获取好友备注名或者昵称
YX.fn.getNick = function (account) {
    // 使用util中的工具方法
    return getNick(account, this.cache)
}
/**
 * 列表想内容提供方法（用于ui组件）
 * @param  {Object} data 数据
 * @param  {String} type 类型
 * @return {Object} info 需要呈现的数据
 */
YX.fn.infoProvider = function(data,type){
    var info = {}
    switch(type){
        case "session":   
            var msg = data.lastMsg
            if(!msg){
                return;
            }
            var scene = msg.scene
            info.scene = scene
            info.account = msg.target
            info.target = msg.scene+"-"+msg.target
            info.time =  transTime2(msg.time)
            info.crtSession = this.crtSession
            info.unread = data.unread>99?"99+":data.unread
            info.text = buildSessionMsg(msg)
            if(scene==="p2p"){
                //点对点
                if(msg.target === userUID){
                    info.nick = "我的手机"
                    info.avatar = "assets/myPhone.png"
                }else{
                    var userInfo = this.cache.getUserById(msg.target)
                    info.nick = this.getNick(msg.target)
                    info.avatar = getAvatar(userInfo.avatar)     
                }

            }else{
                //群组
                var teamInfo = this.cache.getTeamById(msg.target)
                if(teamInfo){
                    info.nick = teamInfo.name
                    if(teamInfo.avatar){
                        info.avatar = teamInfo.avatar+"?imageView&thumbnail=40x40&quality=85"
                    }else{
                        info.avatar = "assets/"+teamInfo.type+".png"
                    }
                }else{
                    info.nick = msg.target
                    info.avatar = "assets/normal.png"
                }   
            }
        break
        case "friend":
            info.target = "p2p-"+data.account
            info.account = data.account
            info.nick = this.getNick(info.account)          
            info.avatar = getAvatar(data.avatar)    
            info.crtSession = this.crtSession  
        break
        case "team":
            info.type = data.type
            info.nick = data.name
            info.target = "team-"+data.teamId
            info.teamId = data.teamId
            if(data.avatar){
                info.avatar = data.avatar+"?imageView&thumbnail=40x40&quality=85"
            }else{
                info.avatar = info.type==="normal"?"assets/normal.png":"assets/advanced.png"
            }
            info.crtSession = this.crtSession  
        break
    }
    return info
}
/**********************************
 * 登出
 **********************************/
YX.fn.logoutEvt = function () {
	this.$logout = $('#logout')
//	this.$logoutDialog = $('#logoutDialog')
  	this.$logout.on('click', this.doLogout.bind(this))
   // this.$logoutDialog.delegate('.j-close', 'click', this.hideLogoutDialog.bind(this))
   // this.$logoutDialog.delegate('.j-ok', 'click', this.doLogout.bind(this))
}
YX.fn.doLogout = function () {
    /*delCookie('uid');
    delCookie('sdktoken');*/
   $('.wrapper').css({
    'display':'none'
  })
  // history.go(0) 
  // this.$logoutDialog.addClass('hide')
}

/*YX.fn.showLogoutDialog = function () {
    this.$logoutDialog.removeClass('hide')
    this.$mask.removeClass('hide')
}*/

/*YX.fn.hideLogoutDialog = function () {
	this.$logoutDialog.addClass('hide')
	this.$mask.addClass('hide')
}*/

/**********************************************
 * 多端登录管理      
 ********************************************/
 YX.fn.multiportEvt = function () {
    this.$devices = $("#devices")
    // 踢人 0：移动端 1：pc端
    $("#devices .mobile").on('click', function () {
        this.mysdk.kick(0)
    }.bind(this))
    $("#devices .pc").on('click', function () {
        this.mysdk.kick(1)
    }.bind(this))
    $("#backBtn2").on('click',this.hideDevices.bind(this))
    $(".m-devices").on('click',this.showDevices.bind(this))
 }
 //SDK回调
 YX.fn.loginPorts = function(devices){
    var pc,mobile
    for (var i = devices.length - 1; i >= 0; i--) {
        if(/iOS|Android|WindowsPhone/i.test(devices[i].type)){
            mobile=devices[i]
        }else if(/PC/i.test(devices[i].type)){
            pc = devices[i]
        }
    }
    if((pc&&pc.online)||(mobile&&mobile.online)){
        if((pc&&pc.online)&&(mobile&&mobile.online)){
            $(".m-devices").html("正在使用云信手机版，电脑版")
            $("#devices .pc").removeClass("hide")
            $("#devices .mobile").removeClass("hide")
            this.mysdk.mobileDeviceId = mobile.deviceId
            this.mysdk.pcDeviceId = pc.deviceId
        }else if(pc&&pc.online){
            $(".m-devices").html("正在使用云信电脑版")
            $("#devices .pc").removeClass("hide")
            $("#devices .mobile").addClass("hide")
            this.mysdk.mobileDeviceId = false
            this.mysdk.pcDeviceId = pc.deviceId
        }else{
            $(".m-devices").html("正在使用云信手机版")
            $("#devices .mobile").removeClass("hide")
            $("#devices .pc").addClass("hide")
            this.mysdk.mobileDeviceId = mobile.deviceId
            this.mysdk.pcDeviceId = false
        }
        $(".m-devices").removeClass("hide")
        $("#left-panel .item").height(463)
    }else{
        $(".m-devices").addClass("hide")
        $("#devices").addClass("hide")
        $("#devices .pc").addClass("hide")
        $("#devices .mobile").addClass("hide")
        this.mysdk.mobileDeviceId = false
        this.mysdk.pcDeviceId = false
        $("#left-panel .item").height(504)
    }
}

/**
 * 多端登录面板UI
 */
YX.fn.showDevices = function(){
    this.$devices.removeClass("hide")    
}
YX.fn.hideDevices = function(){
    this.$devices.addClass("hide")
}
YX.fn.playAudio = function(){
    if(!!window.Audio){
        var node = $(this),
            btn = $(this).children(".j-play")
        node.addClass("play")
        setTimeout(function(){node.removeClass("play");},parseInt(btn.attr("data-dur")))
        new window.Audio(btn.attr("data-src")+"?audioTrans&type=mp3").play()
    }
}
