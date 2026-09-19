// 购物好官 · app.js
// 说明：当前使用 wx 本地存储（wx.setStorageSync）做档案持久化，开箱即用、无需后端。
// 若要跨设备同步，可在微信公众平台开通 CloudBase 后，取消下方注释并填入环境 ID，
// 把 pages/index/index.js 里的 saveProfile / loadProfile 改为云端读写即可（见 开发说明.md）。
App({
  globalData: {
    cloudEnv: '' // 例如 'gougou-1gabcde2'
  },
  onLaunch() {
    // 若已开通 CloudBase，取消注释并填入环境 ID：
    // if (wx.cloud) {
    //   wx.cloud.init({ env: this.globalData.cloudEnv, traceUser: true });
    // }
  }
});
