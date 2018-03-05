var Login = {
	//这里做了个伪登录方式（实际上是把accid，token带到下个页面连SDK在做鉴权）
	//一般应用服务器的应用会有自己的登录接口
	requestLogin: function(account, pwd) {
		setCookie('uid',account.toLocaleLowerCase());
		//自己的appkey就不用加密了
		setCookie('sdktoken',pwd);
		//setCookie('sdktoken',MD5(pwd));
		
		//window.location.href = './main.html';
	},

	/**
	* 获取浏览器的名称和版本号信息
	*/
	getBrowser: function() {
		var browser = {
			msie: false,
			firefox: false,
			opera: false,
			safari: false,
			chrome: false,
			netscape: false,
			appname: 'unknown',
			version: 0
		}, ua = window.navigator.userAgent.toLowerCase();
		if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
			browser[RegExp.$1] = true;
			browser.appname = RegExp.$1;
			browser.version = RegExp.$2;
		} else if (/version\D+(\d[\d.]*).*safari/.test(ua)){ // safari
			browser.safari = true;
			browser.appname = 'safari';
			browser.version = RegExp.$2;
		}
		return browser.appname + ' ' + browser.version;
	}
};
//Login.requestLogin('15531734345','1993sbxqq');