const app = getApp();

Page({
    data: {
        today: new Date().toLocaleDateString(),
        date: new Date().toLocaleDateString(),
        changed: false,
        label: '',
        value: ''
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
            value: e.detail.value
        })
    },
    submit: function () {
        console.log('提交');
        const dateArr = (this.data.date).split('-');
        const year = dateArr[0];
        const month = dateArr[1];
        const day = dateArr[2];
        const newData = {
            label: this.data.label,
            money: this.data.value,
            day: `${month}/${day}`
        };
        console.log(newData);
    },
});
