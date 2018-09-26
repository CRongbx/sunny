Page({
  onTapPower: function (event) {
    wx.navigateTo({
      url: 'power/power',
    })
  },

  onTapHelp: function (event) {
    wx.navigateTo({
      url: 'help/help',
    })
  },

  onTapSet: function (event) {
    wx.navigateTo({
      url: 'set/set',
    })
  }

})