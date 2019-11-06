const app = getApp();

Page({
    data: {
        listData: {},
        empty: true
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

    }
});
