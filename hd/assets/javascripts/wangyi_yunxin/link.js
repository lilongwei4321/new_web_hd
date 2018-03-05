/**
 * SDK连接 功能相关
 */

var SDKBridge = function (ctr, data) {
  var sdktoken = readCookie('sdktoken'),
    userUID = readCookie('uid'),
    that = this;
  /*if (!sdktoken) {
    window.location.href = './index.html';
    return;
  }*/
  //缓存需要获取的用户信息账号
  this.person = {};
  //缓存需要获取的群组账号
  this.team = [];
  this.person[userUID] = true;
  this.controller = ctr;
  this.cache = data;
  //this.nim.onsessions();
  window.nim = ctr.nim = this.nim = new SDK.NIM({
    //控制台日志，上线时应该关掉
    //debug: true || { api: 'info', style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)' },
    appKey: CONFIG.appkey,
    account: userUID,
    token: sdktoken,
    // syncSessionUnread: true,
    //连接
    onconnect: onConnect.bind(this),
   // ondisconnect: onDisconnect.bind(this),
    onerror: onError.bind(this),
    onwillreconnect: onWillReconnect.bind(this),
    // 多端登录变化
    onloginportschange: onLoginPortsChange.bind(this),
    // 群
    onteams: onTeams.bind(this),
    syncTeamMembers: false,//全成员先不同步了
    // onupdateteammember: onUpdateTeamMember.bind(this),
    // onteammembers: onTeamMembers.bind(this),
    //消息
    onmsg: onMsg.bind(this),
    onroamingmsgs: saveMsgs.bind(this),
    onofflinemsgs: saveMsgs.bind(this),
    //会话
    // 同步会话未读数
    syncSessionUnread: true,
    onsessions: onSessions.bind(this),
    onupdatesession: onUpdatesession.bind(this),
    //同步完成
    // onsyncteammembersdone: onSyncTeamMembersDone.bind(this),
    onsyncdone: onSyncDone.bind(this)

    //个人信息
  //  onmyinfo: onMyInfo.bind(this),
    //onupdatemyinfo: onMyInfo.bind(this)
  });
  function onConnect() {
    $('errorNetwork').addClass('hide');
    this.teamMemberDone = false;
    this.sysMsgDone = false;
    console && console.log('连接成功');
  };

  function onKicked(obj) {
    this.iskicked = true;

  };

  function onWillReconnect(obj) {
    // 此时说明 `SDK` 已经断开连接，请开发者在界面上提示用户连接已断开，而且正在重新建立连接
    $('errorNetwork').removeClass('hide');
  };

  function onError(error) {
    console.log('错误信息' + error);
  };
  /*function onDisconnect(error) {
    // 此时说明 `SDK` 处于断开状态，开发者此时应该根据错误码提示相应的错误信息，并且跳转到登录页面
    var that = this;
    console.log('连接断开');
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          alert(error.message);
          delCookie('uid');
          delCookie('sdktoken');
          window.location.href = './index.html';
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          var map = {
            PC: "电脑版",
            Web: "网页版",
            Android: "手机版",
            iOS: "手机版",
            WindowsPhone: "手机版"
          };
          var str = error.from;
          alert("你的帐号于" + dateFormat(+new Date(), "HH:mm") + "被" + (map[str] || "其他端") + "踢出下线，请确定帐号信息安全!");
          delCookie('uid');
          delCookie('sdktoken');
          window.location.href = './index.html';
          break;
        default:
          break;
      }
    }
  };*/
  function onLoginPortsChange(loginPorts) {
    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
    this.controller.loginPorts(loginPorts);
  };
  function onTeams(teams) {
    var teamlist = this.cache.getTeamlist();
    teamlist = this.nim.mergeTeams(teamlist, teams);
    teamlist = this.nim.cutTeams(teamlist, teams.invalid);
    this.cache.setTeamList(teamlist);
  };
  function onFriends(friends) {
    var friendlist = this.cache.getFriends();
    friendlist = this.nim.mergeFriends(friendlist, friends);
    friendlist = this.nim.cutFriends(friendlist, friends.invalid);
    this.cache.setFriends(friendlist);
    // 订阅好友账号
    var subscribeAccounts = []
    for (var i = 0; i < friendlist.length; i++) {
      this.person[friendlist[i].account] = true;
      subscribeAccounts.push(friendlist[i].account)
    }
    // 订阅好友事件
    //that.subscribeMultiPortEvent(subscribeAccounts)
  };
  function onSessions(sessions) {
    var old = this.cache.getSessions();
    this.cache.setSessions(this.nim.mergeSessions(old, sessions));
    for(var i = 0;i<sessions.length;i++){
      if (sessions[i].scene==="p2p") {
        var tmpUser = sessions[i].to
        // 如果会话列表不是好友，需要订阅关系
        if (!this.cache.isFriend(tmpUser)) {
          //that.subscribeMultiPortEvent([tmpUser])
        }
        this.person[tmpUser] = true;
      } else if (sessions[i].scene==="team") {
        this.team.push(sessions[i].to);
        var arr = null
        if (sessions[i].lastMsg) {
          arr = getAllAccount(sessions[i].lastMsg);
        }
        if(!arr){
          continue;
        }
        for(var j = arr.length -1; j >= 0; j--){
          this.person[arr[j]] = true;
        }
      }
    }
  };
//添加用户好友
  function onUpdatesession(session) {
    var id = session.id || "";
    var old = this.cache.getSessions();
    this.cache.setSessions(this.nim.mergeSessions(old, session));
    this.controller.buildSessions(id);
  };

  function saveMsgs(msgs) {
    msgs = msgs.msgs;
    this.cache.addMsgs(msgs);
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].scene === "p2p") {
        this.person[msgs[i].from !== userUID ? msgs[i].from : msgs[i].to] = true;
      }
    }
  };

  function onSyncDone() {
   // console.log('消息同步完成');
    var ctr = this.controller;
    ctr.initInfo(this.person, this.team);
  };
  function onMsg(msg) {
    //涉及UI太多放到main.js里去处理了
   // console.log('收到------------tip');
    this.controller.doMsg(msg);
  };

  function onOfflineSysmsgs(sysMsgs) {
    var data = this.cache.getSysMsgs();
    var array = [];
    for (var i = sysMsgs.length - 1; i >= 0; i--) {
      if (sysMsgs[i].category === "team") {
        array.push(sysMsgs[i]);
      }
    };
    array = this.nim.mergeSysMsgs(data, array).sort(function (a, b) {
      return b.time - a.time;
    });
    this.cache.setSysMsgs(array);
    this.cache.addSysMsgCount(array.length);
  }
  function onSysMsg(newMsg, msg) {
    var type = msg.type,
      ctr = this.controller,
      cache = this.cache;
    data = cache.getSysMsgs();
    if (msg.type === "deleteMsg") {
      ctr.backoutMsg(msg.deletedIdClient, msg)
      return
    }
    data = this.nim.mergeSysMsgs(data, msg).sort(function (a, b) {
      return b.time - a.time;
    });
    this.cache.setSysMsgs(data);
    if (msg.category !== "team") {
      switch (type) {
        case 'deleteFriend':
          cache.removeFriend(msg.from);
          ctr.buildFriends();
          break;
        case 'addFriend':
          if (!this.cache.getUserById(msg.from)) {
            this.getUser(msg.from, function (err, data) {
              if (!err) {
                cache.addFriend(data);
                cache.updatePersonlist(data);
                ctr.buildFriends();
              }
            })
          } else {
            // 订阅好友登录事件
           // that.subscribeMultiPortEvent([msg.friend])
            cache.addFriend(msg.friend);
            ctr.buildFriends();
          }
          break;
        default:
          console.log("系统消息---->" + msg);
          break;
      }
    } else {
      if (newMsg) {
        this.cache.addSysMsgCount(1);
        ctr.showSysMsgCount();
      }
      ctr.buildSysNotice();
    }
  };

  function onCustomSysMsg(msg) {
    console.log('收到------------自定义通知', msg);
    //多端同步 正在输入自定义消息类型需要过滤
    var content = JSON.parse(msg.content);
    var id = content.id;
    if (id == 1) {
      return;
    }

    /** 群视频通知 */
    if (id == 3) {

      /** 针对讨论组这里有个问题：
       * 1. 创建讨论组、拉人进讨论组 不会通知被邀请人，被邀请人不知道状态，无法更新
       * 2. 发起群视频，是自定义通知先到达，tip消息后到达
       * 3. 为了解决这个时差内无法获取讨论组信息，这个设置一个延时
       */
      setTimeout(function () {
        this.controller.myNetcall.onMeetingCalling(msg);
      }.bind(this), 1000);

      return;
    }

    var ctr = this.controller;
    this.cache.addCustomSysMsgs([msg]);
    this.cache.addSysMsgCount(1);
    ctr.showSysMsgCount();
    ctr.buildCustomSysNotice();
  };

  function onOfflineCustomSysMsgs(msgs) {
    console.log('离线推送消息')
    console.log(msgs);
    /** 对离线消息的群视频自定义通知做处理 */
    var arr = [], msgArr = [];
    msgs.forEach(function (item) {
      var tmp = item.content ? JSON.parse(item.content) : {};
      if (tmp.id === 3) {
        arr.push(item);
      } else {
        msgArr.push(item);
      }
    })
    if (arr.length > 0) {
      this.controller.myNetcall.offlineMeetingCall(arr);
    }
    if (msgArr.length > 0) {
      this.cache.addCustomSysMsgs(msgArr);
      this.cache.addSysMsgCount(msgArr.length);
    }

  };
  //静音
 

  function onMyInfo(data) {
    this.cache.updatePersonlist(data);
    this.controller.showMe();
  };

}

/**
 * 设置当前会话，当前会话未读数会被置为0，同时开发者会收到 onupdatesession回调
 * @param {String} scene 
 * @param {String} to    
 */
SDKBridge.prototype.setCurrSession = function (scene, to) {
  this.nim.setCurrSession(scene + "-" + to);
}

/**
* 发送普通文本消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param text：发送的消息文本
* @param isLocal：是否是本地消息
* @param callback：回调
*/
SDKBridge.prototype.sendTextMessage = function (scene, to, text, isLocal, callback) {
  isLocal = !!isLocal;
 // console.log(scene, to, text, isLocal, callback)
  this.nim.sendText({
    scene: scene || 'p2p',
    to: to,
    text: text,
    isLocal: isLocal,
    done: callback
  });
};

/**
* 发送自定义消息
* @param scene：场景，分为：P2P点对点对话，team群对话
* @param to：消息的接收方
* @param content：消息内容对象
* @param callback：回调
*/
/*SDKBridge.prototype.sendCustomMessage = function (scene, to, content, callback) {
  this.nim.sendCustomMsg({
    scene: scene || 'p2p',
    to: to,
    content: JSON.stringify(content),
    done: callback
  });
};*/

/**
* 发送文件消息
* @param scene：场景，分为：P2P点对点对话，team群对话,callback回调
* @param to：消息的接收方
* @param text：发送的消息文本
* @param callback：回调
*/
/*SDKBridge.prototype.sendFileMessage = function (scene, to, fileInput, callback) {
  var that = this,
    value = fileInput.value,
    ext = value.substring(value.lastIndexOf('.') + 1, value.length),
    type = /png|jpg|bmp|jpeg|gif/i.test(ext) ? 'image' : 'file';
  this.nim.sendFile({
    scene: scene,
    to: to,
    type: type,
    fileInput: fileInput,
    uploadprogress: function (data) {
      console && console.log(data.percentageText);
    },
    uploaderror: function () {
      console && console.log('上传失败');
    },
    uploaddone: function (error, file) {
      console.log(error);
      console.log(file);
      console.log('上传' + (!error ? '成功' : '失败'));
    },
    beforesend: function (msgId) {
      console && console.log('正在发送消息, id=' + msgId);
    },
    done: callback
  });
}*/
/**
 * 获取云记录消息
 * @param  {Object} param 数据对象
 * @return {void}       
 */
SDKBridge.prototype.getHistoryMsgs = function (param) {
  this.nim.getHistoryMsgs(param);
}
/**
 * 获取本地历史记录消息  
 */
SDKBridge.prototype.getLocalMsgs = function (sessionId, end, done) {
  if (end) {
    this.nim.getLocalMsgs({
      sessionId: sessionId,
      end: end,
      limit: 200,
      done: done
    });
  } else {
    this.nim.getLocalMsgs({
      sessionId: sessionId,
      limit: 200,
      done: done
    });
  }

}
SDKBridge.prototype.getLocalTeams = function (teamIds, done) {
  this.nim.getLocalTeams({
    teamIds: teamIds,
    done: done
  });
}
/**
 * 获取本地系统消息记录
 * @param  {Funciton} done 回调
 * @return {void}       
 */
SDKBridge.prototype.getLocalSysMsgs = function (done) {
  this.nim.getLocalSysMsgs({
    done: done
  });
}

/**
 * 获取删除本地系统消息记录
 * @param  {Funciton} done 回调
 * @return {void}       
 */
SDKBridge.prototype.deleteAllLocalSysMsgs = function (done) {
  this.nim.deleteAllLocalSysMsgs({
    done: done
  });
}


/**
 * 获取用户信息（如果用户信息让SDK托管）上层限制每次拉取150条
 */
SDKBridge.prototype.getUsers = function (accounts, callback) {
  var arr1 = accounts.slice(0, 150)
  var arr2 = accounts.slice(150)
  var datas = []
  var that = this
  var getInfo = function () {
    that.nim.getUsers({
      accounts: arr1,
      done: function (err, data) {
        if (err) {
          callback(err)
        } else {
          datas = datas.concat(data)
          if (arr2.length > 0) {
            arr1 = arr2.slice(0, 150)
            arr2 = arr2.slice(150)
            getInfo()
          } else {
            callback(err, datas)
          }
        }
      }
    })
  }
  getInfo()
};
SDKBridge.prototype.getUser = function (account, callback) {
  this.nim.getUser({
    account: account,
    done: callback
  });
};

SDKBridge.prototype.updateMyInfo = function (nick, gender, birth, tel, email, sign, callback) {
  this.nim.updateMyInfo({
    nick: nick,
    gender: gender,
    birth: birth,
    tel: tel,
    email: email,
    sign: sign,
    done: callback
  });
}
SDKBridge.prototype.updateMyAvatar = function (avatar, callback) {
  this.nim.updateMyInfo({
    avatar: avatar,
    done: callback
  });
}
SDKBridge.prototype.updateFriend = function (account, alias, callback) {
  this.nim.updateFriend({
    account: account,
    alias: alias,
    done: callback
  });
}
// SDKBridge.prototype.thumbnailImage = function (options) {
//  return this.nim.thumbnailImage({
//    url:options.url,
//    mode:options.mode,
//    width:options.width,
//    height:options.height
//  })
// }

// SDKBridge.prototype.cropImage = function(option){
//  return this.nim.cropImage(option);
// }

/*SDKBridge.prototype.previewImage = function (option) {
  this.nim.previewFile({
    type: 'image',
    fileInput: option.fileInput,
    uploadprogress: function (obj) {
      console.log('文件总大小: ' + obj.total + 'bytes');
      console.log('已经上传的大小: ' + obj.loaded + 'bytes');
      console.log('上传进度: ' + obj.percentage);
      console.log('上传进度文本: ' + obj.percentageText);
    },
    done: option.callback
  });
}*/
/**
 * 已读回执
 */
SDKBridge.prototype.sendMsgReceipt = function (msg, done) {
  this.nim.sendMsgReceipt({
    msg: msg,
    done: done
  });
}
/**
 * 消息重发
 */
SDKBridge.prototype.resendMsg = function (msg, done) {
  this.nim.resendMsg({
    msg: msg,
    done: done
  });
}