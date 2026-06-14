// app.js
App({
  onLaunch() {
    // 初始化本地存储
    const keys = wx.getStorageInfoSync().keys;
    if (!keys.includes('user_progress')) {
      wx.setStorageSync('user_progress', {});
    }
    if (!keys.includes('user_marks')) {
      wx.setStorageSync('user_marks', {});
    }
    if (!keys.includes('user_translations')) {
      wx.setStorageSync('user_translations', {});
    }
    if (!keys.includes('wrong_questions')) {
      wx.setStorageSync('wrong_questions', []);
    }
  },
  
  globalData: {
    readingData: null,
    currentPaper: null,
    currentText: null,
  }
});
