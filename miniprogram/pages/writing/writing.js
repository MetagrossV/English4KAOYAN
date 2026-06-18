const writingData = require('../../data/writing_papers.js');

Page({
  data: {
    activeTab: 'small',
    essays: [],
    templateCategories: [],
    isWriting: false,
    currentEssay: null,
    userEssay: '',
    wordCount: 0,
    showTemplates: false,
    showResult: false,
    score: 0,
    scoreColor: '#999',
    scoreDesc: '',
    dimensions: [],
    feedbacks: [],
    recommendTemplates: []
  },

  onLoad() {
    this.loadEssays();
    this.loadTemplates();
  },

  loadEssays() {
    const allEssays = [...writingData.small_essays, ...writingData.big_essays];
    this.setData({ essays: allEssays });
  },

  loadTemplates() {
    const cats = {};
    writingData.common_templates.forEach(t => {
      if (!cats[t.category]) cats[t.category] = [];
      cats[t.category].push(t.sentence);
    });
    const categories = Object.keys(cats).map(k => ({
      category: k,
      sentences: cats[k]
    }));
    this.setData({ templateCategories: categories });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'small' || tab === 'big') {
      const essays = tab === 'small' ? writingData.small_essays : writingData.big_essays;
      this.setData({ essays });
    }
  },

  onSelectEssay(e) {
    const id = e.currentTarget.dataset.id;
    const allEssays = [...writingData.small_essays, ...writingData.big_essays];
    const essay = allEssays.find(e => e.id === id);
    if (!essay) return;
    
    this.setData({
      isWriting: true,
      currentEssay: essay,
      userEssay: '',
      wordCount: 0,
      showResult: false
    });
  },

  onBack() {
    this.setData({ isWriting: false, currentEssay: null });
  },

  onInput(e) {
    const text = e.detail.value;
    const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    this.setData({ userEssay: text, wordCount: count });
  },

  onShowTemplates() {
    this.setData({ showTemplates: true });
  },

  onCloseTemplates() {
    this.setData({ showTemplates: false });
  },

  onCloseResult() {
    this.setData({ showResult: false });
  },

  preventClose() {
    // 阻止冒泡
  },

  onCopyTemplate(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    });
  },

  onSubmit() {
    const essay = this.data.userEssay.trim();
    if (!essay) {
      wx.showToast({ title: '请先输入作文', icon: 'none' });
      return;
    }

    const result = this.evaluateEssay(essay);
    this.setData({
      showResult: true,
      score: result.score,
      scoreColor: result.scoreColor,
      scoreDesc: result.scoreDesc,
      dimensions: result.dimensions,
      feedbacks: result.feedbacks,
      recommendTemplates: result.recommendTemplates
    });
  },

  evaluateEssay(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const isSmall = this.data.currentEssay.type === 'small';
    const targetWords = isSmall ? 100 : 180;
    
    // 字数评分
    let wordScore = 0;
    if (wordCount >= targetWords * 0.9) wordScore = 100;
    else if (wordCount >= targetWords * 0.7) wordScore = 80;
    else if (wordCount >= targetWords * 0.5) wordScore = 60;
    else wordScore = 40;
    
    // 结构检查
    let structureScore = 0;
    const hasParagraphs = text.split('\n').filter(p => p.trim().length > 0).length >= 2;
    const hasGreeting = /dear|to whom|dear sir|dear madam/i.test(text);
    const hasClosing = /sincerely|yours|best regards|faithfully/i.test(text);
    const hasConnectives = /first|second|moreover|furthermore|however|therefore|in conclusion|in addition/i.test(text);
    
    if (isSmall) {
      structureScore = (hasGreeting && hasClosing) ? 90 : 60;
      if (hasConnectives) structureScore += 10;
    } else {
      structureScore = hasParagraphs ? 80 : 50;
      if (hasConnectives) structureScore += 20;
    }
    structureScore = Math.min(100, structureScore);
    
    // 词汇多样性
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const diversityRatio = uniqueWords / Math.max(1, wordCount);
    let vocabScore = Math.min(100, Math.round(diversityRatio * 300));
    if (vocabScore < 40) vocabScore = 40;
    
    // 语法复杂度（检查从句标志词）
    const complexPatterns = /which|that|when|where|because|although|while|if|unless|since|as|so that|in order that/i;
    const complexCount = (text.match(complexPatterns) || []).length;
    let grammarScore = Math.min(100, 50 + complexCount * 15);
    
    // 综合评分
    const totalScore = Math.round(wordScore * 0.25 + structureScore * 0.3 + vocabScore * 0.25 + grammarScore * 0.2);
    
    let scoreColor = '#999';
    let scoreDesc = '';
    if (totalScore >= 90) { scoreColor = '#52c41a'; scoreDesc = '优秀！作文水平很高'; }
    else if (totalScore >= 75) { scoreColor = '#2c8cf0'; scoreDesc = '良好，继续加油'; }
    else if (totalScore >= 60) { scoreColor = '#faad14'; scoreDesc = '及格，还有提升空间'; }
    else { scoreColor = '#f5222d'; scoreDesc = '需要加强练习'; }
    
    // 反馈建议
    const feedbacks = [];
    if (wordCount < targetWords * 0.8) {
      feedbacks.push(`字数不足：当前${wordCount}词，目标${targetWords}词。建议增加内容细节。`);
    }
    if (isSmall && !hasGreeting) feedbacks.push('小作文缺少开头称呼，建议添加 Dear Sir/Madam 或具体称呼。');
    if (isSmall && !hasClosing) feedbacks.push('小作文缺少结尾敬语，建议添加 Yours sincerely, Li Ming 等。');
    if (!hasConnectives) feedbacks.push('缺少连接词，建议使用 First, Moreover, However, In conclusion 等增加逻辑连贯性。');
    if (diversityRatio < 0.3) feedbacks.push('词汇多样性偏低，建议避免重复使用相同词汇，尝试同义词替换。');
    if (complexCount < 2) feedbacks.push('句式较简单，建议尝试使用定语从句、状语从句等复合句提升语法复杂度。');
    if (feedbacks.length === 0) feedbacks.push('作文整体不错，继续保持！');
    
    // 推荐模板句
    const recs = [];
    if (!hasConnectives) {
      recs.push(...writingData.common_templates.filter(t => t.category === '观点' || t.category === '对比'));
    }
    if (complexCount < 2) {
      recs.push(...writingData.common_templates.filter(t => t.category === '论证'));
    }
    if (diversityRatio < 0.3) {
      recs.push(...writingData.common_templates.filter(t => t.category === '开头' || t.category === '结尾'));
    }
    // 去重
    const seen = new Set();
    const recommendTemplates = recs.filter(t => {
      if (seen.has(t.sentence)) return false;
      seen.add(t.sentence);
      return true;
    }).slice(0, 5);
    
    return {
      score: totalScore,
      scoreColor,
      scoreDesc,
      dimensions: [
        { name: '字数达标', value: wordScore, color: '#2c8cf0' },
        { name: '结构完整', value: structureScore, color: '#52c41a' },
        { name: '词汇多样', value: vocabScore, color: '#faad14' },
        { name: '语法复杂', value: grammarScore, color: '#eb2f96' }
      ],
      feedbacks,
      recommendTemplates
    };
  },

  onCopyAIParse() {
    const essay = this.data.userEssay.trim();
    const current = this.data.currentEssay;
    let prompt = '【考研英语作文批改】\n\n';
    prompt += '题目：' + current.title + '\n';
    prompt += '要求：' + current.prompt + '\n\n';
    prompt += '=== 学生作文 ===\n';
    prompt += essay + '\n\n';
    prompt += '=== 请完成以下批改 ===\n';
    prompt += '1. 给出综合评分（满分100）及各维度评分。\n';
    prompt += '2. 指出作文中的语法错误和用词不当之处。\n';
    prompt += '3. 给出改进建议。\n';
    prompt += '4. 提供修改后的范文。\n';
    prompt += '5. 推荐适合该题目的模板句和高分表达。\n';

    wx.setClipboardData({
      data: prompt,
      success: () => wx.showToast({ title: 'AI解析Prompt已复制', icon: 'success' })
    });
  }
});
