const app = getApp();

Page({
    data: {
        listData: {}
    },
    spread: function (e) {
        const year = e.target.dataset.year;
        const listData = this.data.listData;
        const yearData = listData[year];
        const spreadFlag = yearData.isSpread;
        yearData.isSpread = !spreadFlag;
        this.setData({listData})
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
            '2018': {
                data: {
                    10: [
                        {day: '30' ,label: '吃饭', value: '100'},
                        {day: '31' ,label: '喝水', value: '100'}
                    ],
                    11: [
                        {day: '1' ,label: '电脑', value: '4500'},
                        {day: '2' ,label: '电脑', value: '4500'}
                    ]
                },
                isSpread: true
            },
            '2019': {
                data: {
                    10: [
                        {day: '30' ,label: '吃饭', value: '100'},
                        {day: '31' ,label: '喝水', value: '100'}
                    ],
                    11: [
                        {day: '1' ,label: '电脑', value: '4500'},
                        {day: '2' ,label: '电脑', value: '4500'}
                    ]
                },
                isSpread: false
            }
        };
        this.setData({
            listData: listDataMock
        })
    },
    onLoad: function (options) {
        console.log(options);
        const that = this;
        wx.getStorage({
            key: 'historyList',
            success: function(res) {
                // 异步接口在success回调才能拿到返回值
                var listData = res.data;
                that.setListData(listData);
            },
            fail: function() {
                console.log('读取 historyList 发生错误');
                that.setListData();
            }

        })

    }
});
