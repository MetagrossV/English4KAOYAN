// utils/adaptiveEngine.js
// 自适应语法训练引擎 - 基于BKT(Bayesian Knowledge Tracing) + IRT简化模型

const grammarTopics = require('../data/grammar_topics.js');

// BKT默认参数
const BKT_PARAMS = {
  L0: 0.30,      // 初始掌握概率
  T: 0.30,       // 学习概率（从未掌握到掌握的转移）
  G: 0.15,       // 猜测概率（没掌握但蒙对）
  S: 0.10,       // 失误概率（掌握了但做错）
  MASTERY_THRESHOLD: 0.85,  // 掌握阈值
  WEAK_THRESHOLD: 0.15      // 薄弱阈值
};

// 能力等级定义
const ABILITY_LEVELS = [
  { name: '入门', min: 0, max: 0.25, color: '#f5222d' },
  { name: '基础', min: 0.25, max: 0.50, color: '#faad14' },
  { name: '进阶', min: 0.50, max: 0.75, color: '#2c8cf0' },
  { name: '精通', min: 0.75, max: 1.0, color: '#52c41a' }
];

class AdaptiveEngine {
  constructor() {
    this.topics = grammarTopics.topics || [];
    this.topicGraph = grammarTopics.topic_graph || {};
    this.reset();
  }

  reset() {
    // 每个知识点的掌握状态
    this.mastery = {};
    this.topics.forEach(t => {
      this.mastery[t.id] = {
        probability: BKT_PARAMS.L0,  // 当前掌握概率
        answered: 0,                   // 答题次数
        correct: 0,                    // 答对次数
        streak: 0,                     // 连续正确/错误计数
        history: []                    // 答题历史
      };
    });
    this.sessionCount = 0;  // 当前会话答题数
    this.sessionLog = [];   // 会话日志
  }

  // BKT状态更新
  updateMastery(topicId, isCorrect, difficulty = 2, questionId = null) {
    const state = this.mastery[topicId];
    const { L0, T, G, S } = BKT_PARAMS;
    
    let p = state.probability;
    
    if (isCorrect) {
      // P(掌握|答对) = [P(掌握)*(1-S)] / [P(掌握)*(1-S) + (1-P(掌握))*G]
      const numerator = p * (1 - S);
      const denominator = numerator + (1 - p) * G;
      p = numerator / denominator;
    } else {
      // P(掌握|答错) = [P(掌握)*S] / [P(掌握)*S + (1-P(掌握))*(1-G)]
      const numerator = p * S;
      const denominator = numerator + (1 - p) * (1 - G);
      p = numerator / denominator;
    }
    
    // 学习概率：从未掌握状态转移
    p = p + (1 - p) * T;
    
    // 根据难度调整学习幅度（难题答对学习更多，简单题答错惩罚更多）
    if (isCorrect && difficulty >= 3) {
      p = Math.min(0.99, p + 0.05);
    } else if (!isCorrect && difficulty <= 2) {
      p = Math.max(0.01, p - 0.05);
    }
    
    state.probability = p;
    state.answered++;
    if (isCorrect) state.correct++;
    state.streak = isCorrect ? (state.streak > 0 ? state.streak + 1 : 1) : (state.streak < 0 ? state.streak - 1 : -1);
    state.history.push({ questionId, correct: isCorrect, difficulty, time: Date.now() });
    
    this.sessionCount++;
    this.sessionLog.push({ topicId, isCorrect, difficulty, newProbability: p });
  }

  // 获取知识点状态
  getTopicStatus(topicId) {
    const state = this.mastery[topicId];
    const { MASTERY_THRESHOLD, WEAK_THRESHOLD } = BKT_PARAMS;
    
    if (state.probability >= MASTERY_THRESHOLD) return 'mastered';
    if (state.probability <= WEAK_THRESHOLD) return 'weak';
    if (state.answered >= 5 && state.probability > 0.5) return 'learning';
    return 'unknown';
  }

  // 选择下一个题目（核心算法）
  selectNextQuestion(allQuestions) {
    // 1. 筛选可用题目（排除已掌握的知识点，除非探索模式）
    const availableTopics = [];
    const exploring = Math.random() < 0.15; // 15%探索概率
    
    for (const topic of this.topics) {
      const status = this.getTopicStatus(topic.id);
      const prerequisite = topic.prerequisite;
      
      // 前置条件检查：如果前置未掌握，不选该知识点
      if (prerequisite && this.getTopicStatus(prerequisite) !== 'mastered') {
        continue;
      }
      
      // 探索模式：偶尔选择已掌握知识点的更难题目
      if (exploring && status === 'mastered') {
        availableTopics.push({ topicId: topic.id, priority: 0.3, status });
        continue;
      }
      
      // 正常模式：优先选择掌握度接近0.5的知识点（信息最大）
      if (status !== 'mastered') {
        const p = this.mastery[topic.id].probability;
        // 信息函数：距离0.5越近，信息量越大
        const info = 1 - Math.abs(p - 0.5) * 2;
        // 考虑答题次数（新知识点优先）
        const freshness = Math.max(0, 1 - this.mastery[topic.id].answered / 10);
        const priority = info * 0.7 + freshness * 0.3;
        availableTopics.push({ topicId: topic.id, priority, status });
      }
    }
    
    if (availableTopics.length === 0) {
      // 全部掌握，随机选择一个高阶题目
      const advanced = allQuestions.filter(q => q.difficulty >= 3);
      return advanced[Math.floor(Math.random() * advanced.length)];
    }
    
    // 按优先级排序
    availableTopics.sort((a, b) => b.priority - a.priority);
    
    // 选择前3个中的随机一个（引入随机性，避免单调）
    const candidates = availableTopics.slice(0, Math.min(3, availableTopics.length));
    const selectedTopic = candidates[Math.floor(Math.random() * candidates.length)];
    const topicId = selectedTopic.topicId;
    const p = this.mastery[topicId].probability;
    
    // 2. 在该知识点中选择合适难度的题目
    // 目标难度：根据掌握度映射到1-4
    // p=0.2 -> 难度1, p=0.5 -> 难度2, p=0.7 -> 难度3, p=0.9 -> 难度4
    const targetDifficulty = Math.min(4, Math.max(1, Math.round(p * 4)));
    
    const topicQuestions = allQuestions.filter(q => q.topic_id === topicId);
    if (topicQuestions.length === 0) return null;
    
    // 优先选择目标难度，其次相邻难度
    let candidates_q = topicQuestions.filter(q => q.difficulty === targetDifficulty);
    if (candidates_q.length === 0) {
      candidates_q = topicQuestions.filter(q => Math.abs(q.difficulty - targetDifficulty) <= 1);
    }
    if (candidates_q.length === 0) {
      candidates_q = topicQuestions;
    }
    
    // 排除已做过的题目（如果有记录）
    const answeredIds = this.mastery[topicId].history.map(h => h.questionId);
    const freshQuestions = candidates_q.filter(q => !answeredIds.includes(q.id));
    if (freshQuestions.length > 0) {
      candidates_q = freshQuestions;
    }
    
    return candidates_q[Math.floor(Math.random() * candidates_q.length)];
  }

  // 评估整体能力
  getOverallAbility() {
    const values = Object.values(this.mastery);
    if (values.length === 0) return { score: 0, level: ABILITY_LEVELS[0] };
    
    const avg = values.reduce((sum, s) => sum + s.probability, 0) / values.length;
    const level = ABILITY_LEVELS.find(l => avg >= l.min && avg < l.max) || ABILITY_LEVELS[ABILITY_LEVELS.length - 1];
    
    return { score: Math.round(avg * 100), level: level.name, color: level.color };
  }

  // 获取能力雷达图数据
  getRadarData() {
    const categories = {};
    for (const topic of this.topics) {
      if (!categories[topic.category]) categories[topic.category] = [];
      categories[topic.category].push(this.mastery[topic.id].probability);
    }
    
    return Object.entries(categories).map(([name, values]) => ({
      name,
      value: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100)
    }));
  }

  // 获取推荐学习路径
  getRecommendPath() {
    const weakTopics = [];
    const learningTopics = [];
    
    for (const topic of this.topics) {
      const status = this.getTopicStatus(topic.id);
      if (status === 'weak') {
        weakTopics.push({ id: topic.id, name: topic.name, probability: this.mastery[topic.id].probability });
      } else if (status === 'unknown' || status === 'learning') {
        learningTopics.push({ id: topic.id, name: topic.name, probability: this.mastery[topic.id].probability });
      }
    }
    
    // 排序：薄弱优先，然后按掌握度从低到高
    weakTopics.sort((a, b) => a.probability - b.probability);
    learningTopics.sort((a, b) => a.probability - b.probability);
    
    return {
      weak: weakTopics.slice(0, 5),
      recommended: learningTopics.slice(0, 5),
      mastered: this.topics.filter(t => this.getTopicStatus(t.id) === 'mastered').length
    };
  }

  // 获取诊断报告
  getDiagnosis() {
    const ability = this.getOverallAbility();
    const radar = this.getRadarData();
    const path = this.getRecommendPath();
    
    const diagnosis = {
      overall: ability,
      radar,
      weakPoints: path.weak,
      recommended: path.recommended,
      masteredCount: path.mastered,
      totalCount: this.topics.length,
      sessionCount: this.sessionCount,
      // 生成个性化建议
      suggestions: []
    };
    
    if (ability.score < 30) {
      diagnosis.suggestions.push('你的语法基础较薄弱，建议从一般时态和主谓一致开始系统学习。');
      diagnosis.suggestions.push('每天练习10-15题，重点理解基本规则而非死记硬背。');
    } else if (ability.score < 50) {
      diagnosis.suggestions.push('语法基础已建立，但进阶知识点掌握不足。');
      diagnosis.suggestions.push('重点攻克从句和非谓语动词，这是考研的核心考点。');
    } else if (ability.score < 70) {
      diagnosis.suggestions.push('语法掌握良好，需要巩固高阶知识点。');
      diagnosis.suggestions.push('加强虚拟语气、倒装句和强调句的练习，注意长难句分析。');
    } else {
      diagnosis.suggestions.push('语法水平优秀！建议通过长难句综合训练保持手感。');
      diagnosis.suggestions.push('可以尝试做考研真题中的语法相关题目，查漏补缺。');
    }
    
    if (path.weak.length > 0) {
      const weakNames = path.weak.map(t => t.name).join('、');
      diagnosis.suggestions.push(`优先补强：${weakNames}`);
    }
    
    return diagnosis;
  }

  // 判断是否应该终止当前会话
  shouldEndSession() {
    if (this.sessionCount >= 30) return true; // 最多30题
    
    // 如果连续5题都答对且掌握度>0.8，提前结束
    const last5 = this.sessionLog.slice(-5);
    if (last5.length >= 5 && last5.every(l => l.isCorrect)) {
      const avgProb = last5.reduce((s, l) => s + l.newProbability, 0) / last5.length;
      if (avgProb > 0.8) return true;
    }
    
    return false;
  }

  // 从存储恢复状态
  loadFromStorage(storageKey = 'grammar_mastery') {
    try {
      const data = wx.getStorageSync(storageKey);
      if (data) {
        this.mastery = data.mastery || this.mastery;
        this.sessionCount = data.sessionCount || 0;
      }
    } catch (e) {
      console.error('Failed to load mastery state:', e);
    }
  }

  // 保存到存储
  saveToStorage(storageKey = 'grammar_mastery') {
    try {
      wx.setStorageSync(storageKey, {
        mastery: this.mastery,
        sessionCount: this.sessionCount,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error('Failed to save mastery state:', e);
    }
  }
}

module.exports = {
  AdaptiveEngine,
  BKT_PARAMS,
  ABILITY_LEVELS
};