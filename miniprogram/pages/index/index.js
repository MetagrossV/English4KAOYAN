const dataLoader = require('../../utils/dataLoader.js');

Page({
  data: {
    papers: [],
    filteredPapers: [],
    filter: 'all', // all, english1, english2
    years: [],
    selectedYear: 'all',
    stats: {
      total: 0,
      done: 0,
      wrong: 0
    }
  },

  onLoad() {
    this.loadData();
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  loadData() {
    const papers = dataLoader.loadPapers();
    const years = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
    
    this.setData({
      papers: papers,
      years: ['all', ...years],
      filteredPapers: papers
    });
  },

  loadStats() {
    const progress = dataLoader.getUserProgress();
    const wrongs = dataLoader.getWrongQuestions();
    const keys = Object.keys(progress);
    this.setData({
      'stats.total': keys.length,
      'stats.wrong': wrongs.length
    });
  },

  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filter: type });
    this.applyFilter(type, this.data.selectedYear);
  },

  onYearChange(e) {
    const year = this.data.years[e.detail.value];
    this.setData({ selectedYear: year });
    this.applyFilter(this.data.filter, year);
  },

  applyFilter(filter, selectedYear) {
    const papers = this.data.papers;
    const filtered = papers.filter(p => {
      if (filter === 'english1' && p.exam_type !== '考研英语一') return false;
      if (filter === 'english2' && p.exam_type !== '考研英语二') return false;
      if (selectedYear !== 'all' && p.year !== parseInt(selectedYear)) return false;
      return true;
    });
    this.setData({ filteredPapers: filtered });
  },

  onPaperTap(e) {
    const paperId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/reading/reading?paperId=' + paperId + '&textNo=1'
    });
  },

  onGoReview() {
    wx.navigateTo({
      url: '/pages/review/review'
    });
  },

  onGoWriting() {
    wx.navigateTo({
      url: '/pages/writing/writing'
    });
  }
});
