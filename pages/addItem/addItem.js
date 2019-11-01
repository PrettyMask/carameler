const app = getApp();

Page({
    data: {
        date: new Date().toLocaleString(),
        label: '',
        value: ''
    },
    submit: function () {
        console.log('提交')
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
});
