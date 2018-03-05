(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NIMUIKit"] = factory();
	else
		root["NIMUIKit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * NIM_UI      云信web UI库
	 * ------------------------------------------------------------
	 */

	'use strict';

	var uiKit = {};

	/**
	 * list
	 */

	uiKit.SessionList = __webpack_require__(1);
	uiKit.FriendList = __webpack_require__(3);
	uiKit.TeamList = __webpack_require__(4);


	module.exports = uiKit;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * SesstionList      会话面板UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);

	/**
	 * 会话列表控件
	 * @param {Object} options 控件初始化参数
	 * @property {String||Node}  parent 父节点
	 * @property {String} clazz 样式名称
	 * @property {Function} onclickitem 点击列表回调
	 * @property {Function} onclickavatar 点击列表头像回调
	 * @property {Object} data 消息数据 data.sessions 消息数据 
	 * @property {Function} infoprovider 由上层来提供显示内容
	 */
	var SessionList = function(options){
		var parent = options.parent,
			data = options.data,
			cbClickList = options.onclickitem||function(account,type){console.log('account:'+account+'---type:'+type);},
			cbClickPortrait = options.onclickavatar||function(account,type){console.log('account:'+account+'---type:'+type);};
		this._body = document.createElement('ul');
		this._body.className = options.clazz||"m-panel" +" j-session";	
	  this.provider = options.infoprovider;

		util.addEvent(this._body,'click',function(e){
			var self = this,
				evt = e||window.event,
				account,
				scene,
	      target = evt.srcElement||evt.target;

	        while(self!==target){
	        	if(target.tagName.toLowerCase() === "li"){
	        	 	account = target.getAttribute("data-account");
	                scene = target.getAttribute("data-scene");
	                cbClickList(account,scene);
	                return;
	            }
	            target = target.parentNode;
	        }    
		});
		//默认打开  显示的顾问对话
		function diyi (){
		  cbClickList(guwen_data,'p2p')  
	  }
	  diyi()	

		this.update(data);
		if(!!parent){
			this.inject(parent);
		}
	};
	/** --------------------------public------------------------------ */

	/**
	 * 插入控件
	 * @param  {Node｜String} node 插入控件的节点
	 * @return {Void}      
	 */
	SessionList.prototype.inject = function(node){
	    var injectNode = util.getNode(node);
		injectNode.innerHTML = "";
		injectNode.appendChild(this._body);
	};

	/**
	 * 更新视图
	 * @param  {Object} data 
	 * @return {Void}   
	 */
	SessionList.prototype.update = function(data){
		var html = '',
	        i,
	        str,
	        info,
			sessions = data.sessions;
		if (sessions.length === 0) {
			html += '<p class="empty">暂无最近联系人哦</p>';
		}else{
			for (i = 0;i<sessions.length;i++) {
				info = this.provider(sessions[i],"session");
	            if(!info){
	                continue;
	            }
	            var account = info.account
	            var personSubscribes = data.personSubscribes
	            var multiPortStatus = ''
	            // 开启了订阅配置
	            /*if (info.scene === 'p2p' && window.CONFIG && window.CONFIG.openSubscription) {
	                multiPortStatus = '离fgdf线'
	                if (personSubscribes[account] && personSubscribes[account][1]) {
	                    multiPortStatus = (personSubscribes[account][1].multiPortStatus) || '离线'
	                }
	            }*/
	            if (multiPortStatus !== '') {
	                var infoText = '[' + multiPortStatus + '] ' + info.text
	            } else {
	                infoText = info.text
	            } 
	            //会话列表 渲染顾问
	            if(info.scene=='team' || info.nick == '默认好友' || info.nick=="我的手机"){
	            //	alert('fds')
	            	i++;
	            	str=[''].join("");
	            } else {
	            	str = ['<li class="panel_item '+(info.crtSession===info.target?'active':'')+'" data-scene="' + info.scene + '" data-account="' + info.account + '">',
	                            '<div class="panel_avatar"><img class="panel_image" src="'+info.avatar+'"/></div>',
	                            '<div class="panel_text">',
	                                '<p class="panel_multi-row">',
	                                    '<span class="panel_nick">' +info.nick + '</span>',
	                                    '<b class="panel_time">' + info.time + '</b>',
	                                '</p>',
	                                '<p class="panel_multi-row">',
	                                    '<span class="panel_lastMsg">' + infoText + '</span>',
	                                    info.unread ? '<b class="panel_count">' + info.unread + '</b>':'',
	                                '</p>',
	                            '</div>',
	                        '</li>'].join("");
	            }
	            
				html += str;
			}    
		}
		this._body.innerHTML = html;
	};

	/**
	 * 控件销毁
	 * @return {void} 
	 */
	SessionList.prototype.destory = function(){
		//预留
	};


	module.exports = SessionList;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * ------------------------------------------------------------
	 * util     工具库
	 * ------------------------------------------------------------
	 */

	'use strict';
	// var CONST  = require("./const.js");

	var util = {
		getNode: function(ipt,node){
			if(this.isString(ipt)){
				node = node||document;
				return node.querySelector(ipt);	
			}else if(this.isElement(ipt)){
				return ipt;
			}else{
				console.error("输入参数必须为node||String");
			}
		},
		getNodes: function(string){
			return document.querySelectorAll(string);
		},
		isString: function(data){
	        return typeof(data)==='string';
	    },
	    isElement:function(obj){
	    	return !!(obj && obj.nodeType === 1);
	    },
	    isArray:Array.isArray|| function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
	  	},

		addEvent: function(node,type,callback){
			if(window.addEventListener){
				node.addEventListener(type,callback,false);
			}else{
				node.attachEvent("on"+type,callback);
			}
		},

		hasClass: function(elem, cls){
		    cls = cls || '';
		    if(cls.replace(/\s/g, '').length === 0){
		    	return false;
		    }
		    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
		},

		addClass: function(elem, cls){
			if(!elem){
				return;
			}
		    if(!this.hasClass(elem, cls)){
		        elem.className += ' ' + cls;
		    }
		},
		removeClass: function(elem, cls){
			if(!elem){
				return;
			}
		    if(this.hasClass(elem, cls)){
		        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
		        while(newClass.indexOf(' ' + cls + ' ') >= 0){
		            newClass = newClass.replace(' ' + cls + ' ', ' ');
		        }
		        elem.className = newClass.replace(/^\s+|\s+$/g, '');
		    }
		},
		safeHtml: (function(){
		    var reg = /<br\/?>$/,
		        map = {
		            r:/<|>|\&|\r|\n|\s|\'|\"/g,
		            '<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;',
		            '"':'&quot;',"'":'&#39;','\n':'<br/>','\r':''
		        };
		    return function(content){
		        content = _$encode(map,content);
		        return content.replace(reg,'<br/><br/>');
		    };
		})()
	};
	/*var _$encode = function(_map,_content){
	    _content = ''+_content;
	    if (!_map||!_content){
	        return _content||'';
	    }
	    return _content.replace(_map.r,function($1){
	        var _result = _map[!_map.i?$1.toLowerCase():$1];
	        return _result!=null?_result:$1;
	    });
	};*/

	module.exports = util;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * FriendList      好友列表UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);

	var ACCOUNT;



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * ------------------------------------------------------------
	 * TeamList      群组列表UI
	 * ------------------------------------------------------------
	 */

	'use strict';
	var util = __webpack_require__(2);



/***/ }
/******/ ])
});
;