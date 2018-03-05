var appUI = {
    /**
     * 当前会话聊天面板UI
     */
    buildChatContentUI: function (id, cache) {
      //  var loupan_ids=readCookie("browse_items")==null?'':readCookie("browse_items"),that=this;
            var msgHtml = "",
            msgs = cache.getMsgs(id);
            /*function get_url(){
                var src = window.location.href;
                    var name,value; 
                var str=location.href; //取得整个地址栏
                var arr=str.split("/"); //各个参数放到数组里
                var value=arr[2]
                return value
              }*/
              //var loca_href=get_url();
            /*$.ajax({
                type: "GET",
                url:'http://imapi.zeju.com/loupans/neteaseim?ids='+loupan_ids,
                dataType:'json',
                async: false,
                success : function(data){
                    if(data.message=='succeed'){
                        var data = data.data,str='',show='block';

                        $.each(data,function(ind,item){
                            var average_price = item.price_category=='均价'?item.average_price+'&nbsp;元/㎡':item.average_price+'&nbsp;元/套';
                            str += '<a href="http://'+loca_href+'/loupan/'+item.item_spell+'/'+item.item_id+'.html" style="font-size:14px;display:block;color:blue;margin:4px 0;" target="_blank" class="item item-me read">【'+item.city_name+'&nbsp;-&nbsp;'+item.district_name+'】&nbsp;&nbsp;&nbsp;'+item.item_name+'&nbsp;&nbsp;&nbsp;'+item.price_category+'&nbsp;'+average_price+'</a>'
                        })
                        show = str!=''?show:'none';
                        msgHtml += '<div class="item item-me read">'+
                                    '<span class="radius5px" style="font-size:16px;display:block;margin:4px 0;">您好，择居网房产顾问<b style="color:#666;margin:0 4px;">'+$("#nickName").text()+'</b>竭诚为您服务</span>'+
                                    '<span class="radius5px" style="font-size:16px;display:'+show+';margin:4px 0;">您最近浏览楼盘有：</span>'+str+
                                '</div>';
                        for (var i = 0, l = msgs.length; i < l; ++i) {
                            var message = msgs[i],
                                user = cache.getUserById(message.from);
                            if (message.attach && message.attach.netcallType !== undefined && (message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) {
                                // 隐藏掉netcall相关的系统消息
                                continue;
                            }
                            //消息时间显示
                            if (i == 0) {
                                msgHtml += that.makeTimeTag(transTime(message.time));
                            } else {
                                if (message.time - msgs[i - 1].time > 5 * 60 * 1000) {
                                    msgHtml += that.makeTimeTag(transTime(message.time));
                                }
                            }
                            msgHtml += that.makeChatContent(message, user);
                        }
                    }
                    
                }
            })*/
            /*msgHtml += '<div class="item item-me read">'+
                            '<span class="radius5px" style="font-size:16px;display:block;margin:4px 0;">您好，择居网房产顾问<b style="color:#666;margin:0 4px;">'+$("#nickName").text()+'</b>竭诚为您服务</span>'+
                        '</div>';*/
            for (var i = 0, l = msgs.length; i < l; ++i) {
                var message = msgs[i],
                    user = cache.getUserById(message.from);
                if (message.attach && message.attach.netcallType !== undefined && (message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) {
                    // 隐藏掉netcall相关的系统消息
                    continue;
                }
                //消息时间显示
                if (i == 0) {
                    msgHtml += this.makeTimeTag(transTime(message.time));
                } else {
                    if (message.time - msgs[i - 1].time > 5 * 60 * 1000) {
                        msgHtml += this.makeTimeTag(transTime(message.time));
                    }
                }
                msgHtml += this.makeChatContent(message, user);
            }
            return msgHtml;           
    },

    /**
     * 更新当前会话聊天面板UI
     */
    updateChatContentUI: function (msg, cache) {
        var lastItem = $("#chatContent .item").last(),
            msgHtml = "",
            user = cache.getUserById(msg.from);
        var message = msg;

        if (message.attach && message.attach.netcallType !== undefined && (message.attach.type !== 'netcallBill' && message.attach.type !== "netcallMiss")) return ''; // 隐藏掉netcall相关的系统消息
        if (lastItem.length == 0) {
            msgHtml += this.makeTimeTag(transTime(msg.time));
        } else {
            if (msg.time - parseInt(lastItem.attr('data-time')) > 5 * 60 * 1000) {
                msgHtml += this.makeTimeTag(transTime(msg.time));
            }
        }
        msgHtml += this.makeChatContent(msg, user);
        return msgHtml;
    },

    /**
     * 通用消息内容UI
     */
    makeChatContent: function (message, user) {
        var msgHtml;
        //通知类消息

        /*if (message.attach && message.attach.type && (message.attach.netcallType === undefined || (message.attach.type !== "netcallBill" && message.attach.type !== "netcallMiss"))) {
            if (message.attach.netcallType !== undefined) return ''; // 隐藏掉netcall相关的系统通知消息
        //    var notificationText = transNotification(message);
         //   msgHtml = '<p class="u-notice tc item" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer + '"><span class="radius5px">' + notificationText + '</span></p>';


        } else {*/
            //聊天消息
            var type = message.type,
                from = message.from,
                avatar = user.avatar,
                showNick = message.scene === 'team' && from !== userUID,
                msgHtml;

            if (type === "tip") {
                msgHtml = ['<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '">',
                '<p class="u-notice tc item ' + (from == userUID && message.idServer ? "j-msgTip" : "") + '" data-time="' + message.time + '" data-id="' + message.idClient + '" data-idServer="' + message.idServer + '"><span class="radius5px">' + getMessage(message) + '</span></p>',
                    '</div>'].join('');
            } else {
                msgHtml = ['<div data-time="' + message.time + '" data-id="' + message.idClient + '" id="' + message.idClient + '" data-idServer="' + message.idServer + '" class="item item-' + buildSender(message) + '">',
                '<img class="img j-img" src="' + getAvatar(avatar) + '" data-account="' + from + '"/>',
                showNick ? '<p class="nick">' + getNick(from) + '</p>' : '',
                    '<div class="msg msg-text j-msg">',
                    '<div class="box">',
                    '<div class="cnt">',
                getMessage(message),
                    '</div>',
                    '</div>',
                    '</div>',
                message.status === "fail" ? '<span class="error j-resend" data-session="' + message.sessionId + '" data-id="' + message.idClient + '"><i class="icon icon-error"></i>发送失败,点击重发</span>' : '',
                    '<span class="readMsg"><i></i>已读</span>',
                    '</div>'].join('');
            }

      //  }
        return msgHtml;

    },
    //聊天消息中的时间显示
    makeTimeTag: function (time) {
        return '<p class="u-msgTime">- - - - -&nbsp;' + time + '&nbsp;- -- - -</p>';
    }

}