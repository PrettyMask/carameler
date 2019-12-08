const app = getApp();

Page({
    data: {
        today: '',
        date: '',
        changed: false,
        label: '',
        value: '',
        listData: {},
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            date: e.detail.value,
            changed: true
        })
    },
    labelInput: function (e) {
        this.setData({
            label: e.detail.value
        })
    },
    moneyInput: function (e) {
        this.setData({
            value: Number(e.detail.value)
        })
    },
    submit: function () {
        console.log('提交');
        const {label, value} = this.data;
        let message = '';
        if (!label) {
            message = '请填写项目名称';
        } else if (!value) {
            message = '请填写金额';
        }

        if (message) {
            return wx.showToast({
                title: message,
                icon: 'none',
                duration: 1500
            });
        }
        const dateArr = (this.data.date).split('-');
        const year = Number(dateArr[0]);
        const month = Number(dateArr[1]);
        const day = Number(dateArr[2]);
        const newData = {
            label,
            value,
            id: new Date().getTime()
        };
        let listData = this.data.listData;
        let targetValue = listData[year]; // 对应的年
        if (targetValue) { // 对应的年存在
            let targetYearData = targetValue.data;
            let targetMonth = targetYearData[month]; // 取到对应的月份
            let targetMonthData = null;
            if (targetMonth) { // 月份存在，在原来的数据上压栈
                targetMonthData = targetMonth.data;
                let targetDayData = targetMonthData[day] || []; // 取到对应的天
                targetDayData.push(newData); // 天数默认是数组，直接压栈
                targetMonthData = Object.assign(targetMonthData, { // 将每一天的数据和当月其他天的数据合在一起
                    [day]: targetDayData
                });
                targetYearData[month].count += value;
                targetYearData[month].data = targetMonthData;
            } else { // 月份不存在，添加新的月份
                targetMonthData = {
                    data: {
                        [day]: [newData]
                    },
                    count: value,
                    isSpread: true
                };
                targetYearData[month] = targetMonthData;
            }

        } else { // 新建年
            targetValue = {
                data: {
                    [month]: {
                        data: {
                            [day]: [newData]
                        },
                        count: value,
                        isSpread: true
                    }
                },
                isSpread: true
            }
        }

        listData[year] = targetValue;

        wx.setStorage({
            key: 'historyList',
            data: {
                listData
            },
            success: function(res) {
                wx.reLaunch({
                    url: '../historyList/historyList'
                });
            }
        })
    },

    initDate: function() {
        const now = new Date().toLocaleDateString();
        const dateArr = now.split('/');
        const year = dateArr[0];
        const month = dateArr[1];
        const day = dateArr[2];
        this.setData({
            today: `${year}-${month}-${day}`,
            date: `${year}-${month}-${day}`
        })
    },

    onLoad: function () {
        this.initDate();
        const that = this;
        wx.getStorage({
            key: 'historyList',
            success: function(res) {
                // 异步接口在success回调才能拿到返回值
                var listData = res.data.listData;
                that.setData({listData});
            },
            fail: function() {
                console.log('读取 historyList 发生错误');
                that.setData({listData: {}});
            }
        })
    }
});
