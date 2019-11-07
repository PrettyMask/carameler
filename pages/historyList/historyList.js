const app = getApp();

Page({
    data: {
        delBtnWidth: 80, //删除按钮宽度单位（rpx）
        listData: {},
        empty: true
    },
    onLoad: function (options) {
        console.log('加载加载加载');
        const that = this;
        wx.getStorage({
            key: 'historyList',
            success: function(res) {
                // 异步接口在success回调才能拿到返回值
                var listData = res.data.listData;
                that.setListData(listData);
            },
            fail: function() {
                console.log('读取 historyList 发生错误');
                // that.setListData();
            }

        })

    },

    spread: function (e) {
        const year = e.target.dataset.year;
        const listData = this.data.listData;
        const yearData = listData[year];
        const spreadFlag = yearData.isSpread;
        yearData.isSpread = !spreadFlag;
        this.setData({listData})
    },
    clearAll: function() {
        wx.clearStorage({
            success: () => {
                this.setData({
                    listData: {},
                    empty: true
                })
            }
        })
    },
    addNewItem: function () {
        console.log('点击添加')
        wx.navigateTo({
            url: '../addItem/addItem',
            events: {},
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit()
            }
        })
    },
    delItem: function(e) {
        console.log('点击删除');
        const yearIndex = e.target.dataset.yearindex;
        const monthIndex = e.target.dataset.monthindex;
        const dayIndex = e.target.dataset.dayindex;
        const moneyIndex = e.target.dataset.moneyindex;
        const moneyId = e.target.dataset.moneyid;
        var listData = this.data.listData;
        let yearData = listData[yearIndex].data;
        let monthData = yearData[monthIndex].data;
        let dayData = monthData[dayIndex];
        let moneyItem = dayData[moneyIndex];
        dayData = dayData.filter(o => o.id !== moneyId);
        monthData[dayIndex] = dayData;
        yearData[monthIndex].count -= moneyItem.value;
        this.setData({
            listData: listData // 更新页面中的数据
        });
        wx.setStorage({         // 更新 store 中的数据
            key: 'historyList',
            data: {
                listData
            },
            success: function(res) {
                console.log('删除成功');
            }
        })
    },
    setListData: function(listData) {
        var listDataMock = {
            '2019': {
                data: {
                    10: {
                        data: {
                            1: [{id:'1278978323',label: '吃饭', value: 200}],
                            2: [{id:'3892474987',label: '吃饭', value: 200}],
                        },
                        isSpread: true,
                        count: 1000
                    },
                    11: {
                        data: {
                            1: [{id:'1278978323',label: '吃饭', value: 200}],
                            2: [{id:'3892474987',label: '吃饭', value: 200}],
                        },
                        count: 2000,
                        isSpread: true
                    },
                },
                isSpread: true
            },
        };
        this.setData({
            listData: listData,
            empty: false
        })
    },
    touchS: function (e) {
        if (e.touches.length === 1) {
            this.setData({
                //设置触摸起始点水平方向位置
                startX: e.touches[0].clientX
            });
        }
    },
    touchM: function (e) {
        if (e.touches.length === 1) {
            //手指移动时水平方向位置
            var moveX = e.touches[0].clientX;
            //手指起始点位置与移动期间的差值
            var disX = this.data.startX - moveX;
            var delBtnWidth = this.data.delBtnWidth;
            var txtStyle = "";
            if (disX === 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px";
            } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            this.updateList(e, txtStyle);
        }
    },

    touchE: function (e) {
        if (e.changedTouches.length === 1) {
            //手指移动结束后水平位置
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = this.data.startX - endX;
            var delBtnWidth = this.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            //获取手指触摸的是哪一项
            this.updateList(e, txtStyle);
        }
    },
    updateList: function(e, txtStyle) {
        // 获取手指触摸的是哪一项
        const yearIndex = e.target.dataset.yearindex;
        const monthIndex = e.target.dataset.monthindex;
        const dayIndex = e.target.dataset.dayindex;
        const moneyIndex = e.target.dataset.moneyindex;
        var listData = this.data.listData;
        let yearData = listData[yearIndex].data;
        let monthData = yearData[monthIndex].data;
        let dayData = monthData[dayIndex];
        dayData[moneyIndex].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
            listData: listData
        });
    },
    //获取元素自适应后的实际宽度
    getEleWidth: function (w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
            // console.log(scale);
            real = Math.floor(res / scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error
        }
    },
    initEleWidth: function () {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },
});
