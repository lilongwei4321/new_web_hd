'use strict'
YX.fn.personCard = function () {
	// 初始化节点事件
	this.myInfoEvt()
    this.personInfoEvt()
}
/*****************************
 * 个人信息相关
 ******************************/
YX.fn.myInfoEvt = function () {
	//个人信息
    this.$myInfo = $('#myInfo')
}

/*****************************
 * 用户信息
 ******************************/
YX.fn.personInfoEvt = function () {
    //用户信息
    this.$personCard = $('#personCard')
}