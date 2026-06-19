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
      recommendTemplates: result.recommendTemplates,
      result: result
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
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
    const hasParagraphs = paragraphs.length >= 2;
    const hasGreeting = /dear|to whom|dear sir|dear madam/i.test(text);
    const hasClosing = /sincerely|yours|best regards|faithfully/i.test(text);
    const hasConnectives = /first|second|moreover|furthermore|however|therefore|in conclusion|in addition|on the one hand|on the other hand/i.test(text);
    
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
    const complexPatterns = /which|that|when|where|because|although|while|if|unless|since|as|so that|in order that|who|whom|whose/i;
    const complexCount = (text.match(complexPatterns) || []).length;
    let grammarScore = Math.min(100, 50 + complexCount * 15);
    
    // 语法错误检测（基础）
    const grammarErrors = [];
    
    // 1. 三单错误检测（简单规则）
    const thirdPersonPatterns = /\b(he|she|it)\s+(go|do|have|make|take|get|know|think|see|come|want|use|work|feel|try|leave|call|need|seem|help|show|play|move|live|believe|bring|happen|stand|lose|pay|meet|include|continue|set|learn|change|lead|understand|watch|follow|stop|create|speak|read|allow|add|spend|grow|open|walk|offer|remember|love|consider|appear|buy|wait|serve|die|send|expect|build|stay|fall|cut|reach|kill|remain|suggest|raise|pass|sell|require|report|decide|pull|return|explain|carry|develop|hope|drive|break|receive|agree|support|remove|return|describe|lie|discover|contain|establish|prepare|avoid|wonder|tend|share|claim|enjoy|examine|reveal|prove|notice|jump|own|throw|shut|point|increase|fit|claim|turn|push|fill|check|beat|destroy|join|reduce|settle|exist|argue|manage|seek|choose|aim|deal|attempt|shout|place|produce|eat|cross|introduce|draw|forget|vote|ignore|confirm|appreciate|fight|recognize|apply|refuse|predict|gather|mention|judge|relate|fix|compare|depend|suffer|declare|accomplish|acknowledge|encounter|illustrate|observe|pursue|replace|embrace|concentrate|survive|engage|behave|evaluate|investigate|negotiate|advocate|illuminate|interact|collaborate|communicate|calculate|motivate|participate|appreciate|anticipate|contribute|deliver|determine|distinguish|educate|eliminate|encourage|explore|facilitate|generate|identify|implement|improve|indicate|influence|inform|initiate|integrate|interpret|invest|maintain|measure|modify|monitor|obtain|organize|overcome|perform|persuade|predict|prepare|preserve|promote|protect|publish|purchase|realize|receive|recommend|recover|reduce|reflect|refuse|regard|regulate|rely|respond|restore|reveal|review|revise|select|separate|specify|stimulate|strengthen|structure|submit|succeed|suffer|summarize|supervise|supply|support|survive|sustain|symbolize|synthesize|tolerate|transform|transmit|transport|undergo|undertake|unify|utilize|validate|vary|verify|visualize|volunteer|wander|wonder|worry|worship|wound|wrap|wreck|yell|yield|zip|zoom)\b/i;
    if (thirdPersonPatterns.test(text)) {
      grammarErrors.push({
        type: '主谓一致',
        detail: '检测到第三人称单数主语后可能缺少动词-s形式，请检查。'
      });
    }
    
    // 2. 时态一致性检测
    const pastTenseWords = (text.match(/\b(went|did|had|was|were|saw|got|made|took|came|knew|thought|said|found|gave|told|felt|became|left|put|meant|kept|let|began|seemed|helped|showed|heard|moved|lived|believed|brought|happened|stood|lost|paid|met|included|continued|set|learned|changed|led|understood|watched|followed|stopped|created|spoke|read|allowed|added|spent|grew|opened|walked|offered|remembered|loved|considered|appeared|bought|waited|served|died|sent|expected|built|stayed|fell|cut|reached|killed|remained|suggested|raised|passed|sold|required|reported|decided|pulled|returned|explained|carried|developed|hoped|drove|broke|received|agreed|supported|removed|returned|described|lied|discovered|contained|established|prepared|avoided|wondered|tended|shared|claimed|enjoyed|examined|revealed|proved|noticed|jumped|owned|threw|shut|pointed|increased|fit|claimed|turned|pushed|filled|checked|beat|destroyed|joined|reduced|settled|existed|argued|managed|sought|chose|aimed|dealt|attempted|shouted|placed|produced|ate|crossed|introduced|drew|forgot|voted|ignored|confirmed|appreciated|fought|recognized|applied|refused|predicted|gathered|mentioned|judged|related|fixed|compared|depended|suffered|declared|accomplished|acknowledged|encountered|illustrated|observed|pursued|replaced|embraced|concentrated|survived|engaged|behaved|evaluated|investigated|negotiated|advocated|illuminated|interacted|collaborated|communicated|calculated|motivated|participated|appreciated|anticipated|contributed|delivered|determined|distinguished|educated|eliminated|encouraged|explored|facilitated|generated|identified|implemented|improved|indicated|influenced|informed|initiated|integrated|interpreted|invested|maintained|measured|modified|monitored|obtained|organized|overcame|performed|persuaded|predicted|prepared|preserved|promoted|protected|published|purchased|realized|received|recommended|recovered|reduced|reflected|refused|regarded|regulated|relied|responded|restored|revealed|reviewed|revised|selected|separated|specified|stimulated|strengthened|structured|submitted|succeeded|suffered|summarized|supervised|supplied|supported|survived|sustained|symbolized|synthesized|tolerated|transformed|transmitted|transported|underwent|undertook|unified|utilized|validated|varied|verified|visualized|volunteered|wandered|wondered|worried|worshipped|wounded|wrapped|wrecked|yelled|yielded|zipped|zoomed)\b/gi) || []).length;
    const presentTenseWords = (text.match(/\b(go|do|have|make|take|get|know|think|see|come|want|use|work|feel|try|leave|call|need|seem|help|show|play|move|live|believe|bring|happen|stand|lose|pay|meet|include|continue|set|learn|change|lead|understand|watch|follow|stop|create|speak|read|allow|add|spend|grow|open|walk|offer|remember|love|consider|appear|buy|wait|serve|die|send|expect|build|stay|fall|cut|reach|kill|remain|suggest|raise|pass|sell|require|report|decide|pull|return|explain|carry|develop|hope|drive|break|receive|agree|support|remove|return|describe|lie|discover|contain|establish|prepare|avoid|wonder|tend|share|claim|enjoy|examine|reveal|prove|notice|jump|own|throw|shut|point|increase|fit|claim|turn|push|fill|check|beat|destroy|join|reduce|settle|exist|argue|manage|seek|choose|aim|deal|attempt|shout|place|produce|eat|cross|introduce|draw|forget|vote|ignore|confirm|appreciate|fight|recognize|apply|refuse|predict|gather|mention|judge|relate|fix|compare|depend|suffer|declare|accomplish|acknowledge|encounter|illustrate|observe|pursue|replace|embrace|concentrate|survive|engage|behave|evaluate|investigate|negotiate|advocate|illuminate|interact|collaborate|communicate|calculate|motivate|participate|appreciate|anticipate|contribute|deliver|determine|distinguish|educate|eliminate|encourage|explore|facilitate|generate|identify|implement|improve|indicate|influence|inform|initiate|integrate|interpret|invest|maintain|measure|modify|monitor|obtain|organize|overcome|perform|persuade|predict|prepare|preserve|promote|protect|publish|purchase|realize|receive|recommend|recover|reduce|reflect|refuse|regard|regulate|rely|respond|restore|reveal|review|revise|select|separate|specify|stimulate|strengthen|structure|submit|succeed|suffer|summarize|supervise|supply|support|survive|sustain|symbolize|synthesize|tolerate|transform|transmit|transport|undergo|undertake|unify|utilize|validate|vary|verify|visualize|volunteer|wander|wonder|worry|worship|wound|wrap|wreck|yell|yield|zip|zoom)\b/gi) || []).length;
    if (pastTenseWords > 0 && presentTenseWords > 3) {
      grammarErrors.push({
        type: '时态一致',
        detail: '文中同时出现较多过去时和现在时，请注意保持时态一致。'
      });
    }
    
    // 3. 从句使用检测
    let clauseTypes = [];
    if (/which|that|who|whom|whose/.test(text)) clauseTypes.push('定语从句');
    if (/what|whether|that/.test(text)) clauseTypes.push('名词性从句');
    if (/because|since|as|if|although|while|when|where|so.*that/.test(text)) clauseTypes.push('状语从句');
    
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
    
    // 添加语法错误反馈
    grammarErrors.forEach(err => {
      feedbacks.push(`语法问题[${err.type}]：${err.detail}`);
    });
    
    if (feedbacks.length === 0) feedbacks.push('作文整体不错，继续保持！');
    
    // 推荐模板句（根据薄弱点推荐）
    const recs = [];
    if (!hasConnectives) {
      recs.push(...writingData.common_templates.filter(t => t.category === '观点' || t.category === '对比' || t.category === '因果'));
    }
    if (complexCount < 2) {
      recs.push(...writingData.common_templates.filter(t => t.category === '定语从句' || t.category === '状语从句'));
    }
    if (diversityRatio < 0.3) {
      recs.push(...writingData.common_templates.filter(t => t.category === '开头' || t.category === '结尾'));
    }
    if (grammarErrors.some(e => e.type === '主谓一致')) {
      recs.push(...writingData.common_templates.filter(t => t.category === '观点'));
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
      recommendTemplates,
      grammarErrors,
      clauseTypes
    };
  },

  onCopyAIParse() {
    const essay = this.data.userEssay.trim();
    const current = this.data.currentEssay;
    const result = this.data.result; // 获取评估结果
    
    let prompt = '【考研英语作文深度批改】\n\n';
    prompt += '题目：' + current.title + '\n';
    prompt += '要求：' + current.prompt + '\n';
    prompt += '字数要求：' + current.word_count + '词\n\n';
    prompt += '=== 学生作文 ===\n';
    prompt += essay + '\n\n';
    prompt += '=== 系统预检结果 ===\n';
    if (result && result.grammarErrors) {
      result.grammarErrors.forEach(err => {
        prompt += '- [' + err.type + '] ' + err.detail + '\n';
      });
    }
    if (result && result.clauseTypes) {
      prompt += '- 检测到的从句类型：' + result.clauseTypes.join('、') + '\n';
    }
    prompt += '\n=== 请完成以下专业批改 ===\n';
    prompt += '1. 【综合评分】给出总分（满分100）及四个维度评分：字数达标、结构完整、词汇多样、语法复杂度。\n';
    prompt += '2. 【语法诊断】详细分析作文中的语法错误，包括：\n';
    prompt += '   a. 时态错误（一般现在时/过去时/完成时混淆）\n';
    prompt += '   b. 主谓一致错误（第三人称单数）\n';
    prompt += '   c. 从句错误（定语从句关系词、状语从句连词、名词性从句引导词）\n';
    prompt += '   d. 非谓语动词错误（不定式/动名词/分词）\n';
    prompt += '   e. 虚拟语气错误\n';
    prompt += '   f. 冠词和介词错误\n';
    prompt += '3. 【词汇评估】指出用词不当、词汇重复、中式英语等问题，提供替换建议。\n';
    prompt += '4. 【结构分析】评价段落结构、逻辑连贯性、连接词使用。\n';
    prompt += '5. 【改进建议】针对上述问题给出具体修改建议。\n';
    prompt += '6. 【范文改写】提供修改后的高分范文。\n';
    prompt += '7. 【语法训练推荐】根据错误类型，推荐需要加强的语法知识点（如：定语从句、虚拟语气、时态一致等）。\n';
    prompt += '\n请以结构化的Markdown格式输出，便于阅读。';

    wx.setClipboardData({
      data: prompt,
      success: () => wx.showToast({ title: 'AI深度批改Prompt已复制', icon: 'success' })
    });
  }
});
