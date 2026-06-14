// utils/dataLoader.js
// 按需加载策略：首页只加载轻量元数据，做题页按需加载单篇试卷

// 1. 轻量元数据（首页用）
const papersMeta = require('../data/papers_meta');

// 2. 全部试卷数据（按需加载，缓存）
let allPapersCache = null;

function loadAllPapers() {
  if (!allPapersCache) {
    allPapersCache = require('../data/all_papers');
  }
  return allPapersCache;
}

function getPaperData(paperId) {
  const all = loadAllPapers();
  return all[paperId] || null;
}

function loadPapers() {
  // 返回元数据，补充进度信息
  const progress = getUserProgress();
  return papersMeta.map(m => {
    const doneCount = Object.keys(progress).filter(k => k.startsWith(m.paper_id + '_')).length;
    return {
      ...m,
      doneCount,
      totalCount: m.text_count,
      progressPercent: Math.round((doneCount / m.text_count) * 100)
    };
  });
}

function getPaperById(paperId) {
  return getPaperData(paperId);
}

function getProgressKey(paperId, textNo) {
  return paperId + '_text' + textNo;
}

function getUserProgress() {
  return wx.getStorageSync('user_progress') || {};
}

function saveUserProgress(paperId, textNo, answers, marks, translations, elapsedSeconds) {
  const progress = getUserProgress();
  const key = getProgressKey(paperId, textNo);
  progress[key] = {
    paperId,
    textNo,
    answers,
    marks,
    translations,
    elapsedSeconds: elapsedSeconds || 0,
    timestamp: Date.now()
  };
  wx.setStorageSync('user_progress', progress);
}

function getUserProgressForText(paperId, textNo) {
  const progress = getUserProgress();
  const key = getProgressKey(paperId, textNo);
  return progress[key] || null;
}

function saveWrongQuestion(paperId, textNo, question, userAnswer, userMarks, userTranslations, elapsedSeconds) {
  const wrongs = wx.getStorageSync('wrong_questions') || [];
  const exists = wrongs.find(w => w.paperId === paperId && w.textNo === textNo && w.question.q_no === question.q_no);
  if (exists) return;
  wrongs.push({
    paperId,
    textNo,
    question,
    userAnswer,
    userMarks,
    userTranslations,
    elapsedSeconds: elapsedSeconds || 0,
    timestamp: Date.now()
  });
  wx.setStorageSync('wrong_questions', wrongs);
}

function getWrongQuestions() {
  return wx.getStorageSync('wrong_questions') || [];
}

module.exports = {
  loadPapers,
  getPaperById,
  getUserProgress,
  saveUserProgress,
  getUserProgressForText,
  saveWrongQuestion,
  getWrongQuestions,
  getProgressKey
};
