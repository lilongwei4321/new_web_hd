(function() {
    // 配置
    var envir = 'online';
    var configMap = {
        test: {
            appkey: 'fe416640c8e8a72734219e1847ad2547',
            url:'https://apptest.netease.im'
        },
        
        pre:{
    		appkey: '45c6af3c98409b18a84451215d0bdd6e',
    		url:'http://preapp.netease.im:8184'
        },
        online: {
           appkey: 'aa85e0e6fa66e72d2592a40b406b3815',
           url:'https://webapi.zeju.com'
        },
       /* online: {
           appkey: '0b576b42992b34fc9d8d3fc9fe054469',
           url:'https://imapi.zeju.com'
        },*/
        ceName : {
            appkey :'5fef706137b1f262d0a319cdd93fc501',
            url    : 'https://imapi.zeju.com'
        }
    };
    window.CONFIG = configMap[envir];
    
    // 是否开启订阅服务
    window.CONFIG.openSubscription = true
}())