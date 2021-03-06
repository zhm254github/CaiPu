import regeneratorRuntime from '../../lib/regenerator-runtime/runtime.js';
wx.cloud.init();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodName: '',
    typeIndex: 0,
    typeArray: ['家常菜谱', '中华菜系', '烘焙', '各地小吃', '外国菜谱'],
    materialArray: [{
      materialNumber: 1,
      materialName: '',
      materialDosage: ''
    }],
    stepArray: [{
      step: 1,
      explainWord: '',
      explainImage: ''
    }],
  },
  bindTypeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  addMaterial: function() {
    this.data.materialArray.push({
      materialNumber: this.data.materialArray.length + 1,
      materialName: '',
      materialDosage: ''
    })
    this.setData({
      materialArray: this.data.materialArray
    })
  },
  deleteMaterial: function() {
    if (this.data.materialArray.length != 1) {
      this.data.materialArray.pop();
    }
    this.setData({
      materialArray: this.data.materialArray
    })
  },
  addStep: function() {
    this.data.stepArray.push({
      step: this.data.stepArray.length + 1,
      explainWord: '',
      explainImage: ''
    })
    this.setData({
      stepArray: this.data.stepArray
    })
  },
  deleteStep: function() {
    if (this.data.stepArray.length != 1) {
      this.data.stepArray.pop();
    }
    this.setData({
      stepArray: this.data.stepArray
    })
  },
  getFoodName: function(e) {
    this.setData({
      foodName: e.detail.value
    })
  },
  getMaterialName: function(e) {
    this.data.materialArray[e.target.dataset.index].materialName = e.detail.value;
    this.setData({
      materialArray: this.data.materialArray
    });
  },
  getMaterialDosage: function(e) {
    this.data.materialArray[e.target.dataset.index].materialDosage = e.detail.value;
    this.setData({
      materialArray: this.data.materialArray
    });
  },
  getExplainWord: function(e) {
    this.data.stepArray[e.target.dataset.index].explainWord = e.detail.value;
    this.setData({
      stepArray: this.data.stepArray
    });
  },
  chooseImage: function(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.data.stepArray[e.currentTarget.dataset.index].explainImage = res.tempFilePaths[0];
        this.setData({
          stepArray: this.data.stepArray,
        });
      }
    })
  },
  previewImage: function(event) {
    wx.previewImage({
      urls: [this.data.stepArray[event.target.dataset.index].explainImage]
    })
  },
  async handlePublish() {
    if (this.data.foodName.trim() === '') {
      wx.showModal({
        title: '提示',
        content: '菜名不能为空',
        showCancel: false
      })
      return;
    }
    for (var i = 0; i < this.data.materialArray.length; i++) {
      if (this.data.materialArray[i].materialName.trim() === '' || this.data.materialArray[i].materialDosage.trim() === '') {
        wx.showModal({
          title: '提示',
          content: '用料的名称和用料的用量不能为空',
          showCancel: false
        })
        return;
      }
    }
    for (var i = 0; i < this.data.stepArray.length; i++) {
      if (this.data.stepArray[i].explainWord.trim() === '' || this.data.stepArray[i].explainImage === '') {
        wx.showModal({
          title: '提示',
          content: '具体做法里的文字和图片不能为空',
          showCancel: false
        })
        return;
      }
    }
    wx.showLoading({
      title: '发布中...',
    })
    for (var i = 0; i < this.data.stepArray.length; i++) {
      await wx.cloud.uploadFile({
        cloudPath: 'cloud' + this.data.stepArray[i].explainImage.slice(11),
        filePath: this.data.stepArray[i].explainImage,
      }).then(res => {
        this.data.stepArray[i].explainImage = res.fileID;
      }).catch(error => {
        console.log(error);
      })
    }
    await db.collection('caiPu').add({
      data: {
        foodName: this.data.foodName,
        foodtype: this.data.typeArray[this.data.typeIndex],
        materialArray: this.data.materialArray,
        stepArray: this.data.stepArray
      },
      success: (res) => {
        this.setData({
          foodName: '',
          typeIndex: 0,
          materialArray: [{
            materialNumber: 1,
            materialName: '',
            materialDosage: ''
          }],
          stepArray: [{
            step: 1,
            explainWord: '',
            explainImage: ''
          }],
        })
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 3000
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})