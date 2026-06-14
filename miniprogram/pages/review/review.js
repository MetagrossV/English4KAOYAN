const dataLoader = require('../../utils/dataLoader.js');

Page({
  data: {
    wrongs: [],
    showDetail: false,
    currentDetail: null,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const wrongs = dataLoader.getWrongQuestions();
    // 补充试卷信息
    const wrongsWithPaper = wrongs.map(w => {
      const paper = dataLoader.getPaperById(w.paperId);
      return {
        ...w,
        paperYear: paper ? paper.year : w.paperId,
        examType: paper ? paper.exam_type : '',
      };
    }).reverse(); // 最新的在前面

    this.setData({ wrongs: wrongsWithPaper });
  },

  onClearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定清空所有错题记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('wrong_questions', []);
          this.setData({ wrongs: [] });
        }
      }
    });
  },

  onWrongTap(e) {
    const idx = e.currentTarget.dataset.index;
    const wrong = this.data.wrongs[idx];
    
    this.setData({
      showDetail: true,
      currentDetail: wrong
    });
  },

  onCloseDetail() {
    this.setData({ showDetail: false, currentDetail: null });
  },

  onGoRetry(e) {
    const wrong = e.currentTarget.dataset.wrong;
    this.setData({ showDetail: false });
    wx.navigateTo({
      url: '/pages/reading/reading?paperId=' + wrong.paperId + '&textNo=' + wrong.textNo
    });
  },

  onGoAIParse(e) {
    const wrong = e.currentTarget.dataset.wrong;
    const paper = dataLoader.getPaperById(wrong.paperId);
    const text = paper.reading.find(t => t.text_no === wrong.textNo);
    const sentences = text.sentences;
    const q = wrong.question;

    let prompt = '【考研英语阅读错题分析】\n\n';
    prompt += '试卷：' + paper.year + '年 ' + paper.exam_type + ' Text ' + wrong.textNo + ' · Q' + q.q_no + '\n';
    prompt += '做题用时：' + (wrong.elapsedSeconds || '未知') + '秒\n\n';

    prompt += '=== 文章原文（精选相关句）===\n';
    sentences.forEach((s, i) => {
      if (wrong.userMarks[i] && wrong.userMarks[i].length > 0) {
        prompt += '句' + (i + 1) + ' [用户标记了 ' + wrong.userMarks[i].join(', ') + ']\n';
        prompt += s + '\n';
        if (wrong.userTranslations[i]) {
          prompt += '用户翻译：' + wrong.userTranslations[i] + '\n';
        }
        prompt += '\n';
      }
    });

    prompt += '=== 题目 ===\n';
    prompt += q.question + '\n';
    ['A', 'B', 'C', 'D'].forEach(opt => {
      const isUser = wrong.userAnswer === opt;
      const marker = isUser ? ' ★用户选择' : '';
      const isCorrect = q.answer === opt;
      const correctMarker = isCorrect ? ' [标准答案]' : '';
      prompt += '[' + opt + '] ' + (q.options[opt] || '') + marker + correctMarker + '\n';
    });

    prompt += '\n=== 请分析 ===\n';
    prompt += '1. 用户答案是否正确？\n';
    prompt += '2. 如果错了，分析错误原因：是翻译理解错误、定位错误（标记的关键句不对）、还是逻辑推理偏差？\n';
    prompt += '3. 用户标记的关键句是否找对？\n';
    prompt += '4. 给出正确的解题思路和答案依据。\n';
    prompt += '5. 对用户的翻译给出反馈（如有）。\n';

    wx.setClipboardData({
      data: prompt,
      success: () => {
        wx.showToast({ title: 'AI解析Prompt已复制', icon: 'success' });
      }
    });
  },

  preventClose() {
    // 阻止详情面板内部点击冒泡到遮罩
  }
});
