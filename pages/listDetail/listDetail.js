const app = getApp();

Page({
    data: {
        yearData: {},
        year: ''
    },
    addNewItem: function () {
        console.log('提交')
    },
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel();
        const that = this;
        eventChannel.on('year-detail', function(data) {
            console.log(data);
            that.setData({yearData: data.yearData, year: data.year})
        })
    }
});
