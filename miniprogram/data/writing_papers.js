module.exports = {
  // 小作文（应用文）题目
  small_essays: [
    {
      id: 'small_2024_1',
      year: 2024,
      exam_type: '考研英语一',
      type: 'small',
      title: '建议信：向图书馆提建议',
      prompt: 'Suppose you are a student at a university. Write a letter to the university librarian suggesting ways to improve the library services. You should write about 100 words. Do not use your own name. Use "Li Ming" instead.',
      tips: ['开头表明身份和写信目的', '中间提出2-3条具体建议', '结尾表达期望和感谢'],
      templates: [
        { category: '开头', sentence: 'I am writing to express my concern about / offer some suggestions on...' },
        { category: '开头', sentence: 'I am Li Ming, a student who frequently uses the library.' },
        { category: '建议', sentence: 'First and foremost, it would be greatly appreciated if...' },
        { category: '建议', sentence: 'Additionally, I would like to suggest that...' },
        { category: '建议', sentence: 'Last but not least, it might be beneficial to...' },
        { category: '结尾', sentence: 'I would be grateful if you could take my suggestions into consideration.' },
        { category: '结尾', sentence: 'Thank you for your time and attention to this matter.' },
      ]
    },
    {
      id: 'small_2024_2',
      year: 2024,
      exam_type: '考研英语二',
      type: 'small',
      title: '邀请信：邀请教授参加研讨会',
      prompt: 'Suppose you are organizing a seminar on environmental protection at your university. Write an email to Professor Smith, inviting him to give a lecture. You should write about 100 words. Do not use your own name. Use "Li Ming" instead.',
      tips: ['开头表明邀请目的', '介绍活动背景和细节', '结尾表达期待'],
      templates: [
        { category: '开头', sentence: 'I am writing on behalf of... to cordially invite you to...' },
        { category: '背景', sentence: 'The seminar, scheduled for [date], will focus on...' },
        { category: '邀请', sentence: 'We would be honored if you could deliver a lecture on...' },
        { category: '结尾', sentence: 'We sincerely hope that you will accept our invitation.' },
      ]
    },
    {
      id: 'small_2023_1',
      year: 2023,
      exam_type: '考研英语一',
      type: 'small',
      title: '通知：招募志愿者',
      prompt: 'Suppose you are a member of the Student Union. Write a notice to recruit volunteers for an upcoming international conference. You should write about 100 words. Do not use your own name. Use "the Student Union" instead.',
      tips: ['标题写 Notice', '说明活动背景和目的', '列出志愿者要求', '提供报名方式'],
      templates: [
        { category: '标题', sentence: 'Notice / Volunteers Wanted' },
        { category: '开头', sentence: 'To ensure the success of..., we are recruiting volunteers to...' },
        { category: '要求', sentence: 'Applicants should have a good command of English and strong communication skills.' },
        { category: '结尾', sentence: 'Those interested please send your application to... before...' },
      ]
    },
    {
      id: 'small_2023_2',
      year: 2023,
      exam_type: '考研英语二',
      type: 'small',
      title: '建议信：关于健康饮食',
      prompt: 'Suppose you have a friend who is struggling with unhealthy eating habits. Write an email to give him/her some advice. You should write about 100 words. Do not use your own name. Use "Li Ming" instead.',
      tips: ['开头表达关心', '给出2-3条具体建议', '结尾鼓励'],
      templates: [
        { category: '开头', sentence: 'I am sorry to hear that you have been struggling with...' },
        { category: '建议', sentence: 'From my perspective, the following suggestions might be helpful.' },
        { category: '建议', sentence: 'To begin with, it is advisable to...' },
        { category: '结尾', sentence: 'I hope you will find these suggestions practical and useful.' },
      ]
    },
  ],
  
  // 大作文题目
  big_essays: [
    {
      id: 'big_2024_1',
      year: 2024,
      exam_type: '考研英语一',
      type: 'big',
      title: '图画作文：坚持与努力',
      prompt: 'Write an essay of 160-200 words based on the picture below. In your essay, you should\n1) describe the picture briefly,\n2) interpret the implied meaning, and\n3) give your comments.\n\n[图片描述：一个人在跑步机上努力奔跑，汗水直流，但跑步机显示他已经跑了很长距离]',
      tips: ['第一段描述图画（约50词）', '第二段阐释寓意（约80词）', '第三段给出评论/建议（约50词）'],
      templates: [
        { category: '描述图画', sentence: 'As is vividly depicted in the picture, ...' },
        { category: '描述图画', sentence: 'The picture presents a thought-provoking scene in which...' },
        { category: '阐释寓意', sentence: 'The implied meaning of the picture can be interpreted as follows.' },
        { category: '阐释寓意', sentence: 'What the picture conveys is far-reaching and thought-provoking.' },
        { category: '观点', sentence: 'From my perspective, the picture serves as a reminder that...' },
        { category: '建议', sentence: 'Only in this way can we achieve our goals and realize our dreams.' },
        { category: '结尾', sentence: 'In conclusion, it is essential for us to cultivate the spirit of...' },
      ]
    },
    {
      id: 'big_2024_2',
      year: 2024,
      exam_type: '考研英语二',
      type: 'big',
      title: '图表作文：居民健康素养水平',
      prompt: 'Write an essay based on the chart below. In your essay, you should\n1) describe the chart briefly,\n2) make comments, and\n3) give your suggestions.\n\n[图表描述：2018-2023年我国居民健康素养水平持续提升，从17%提升至29%]',
      tips: ['第一段描述图表数据变化（约50词）', '第二段分析原因（约80词）', '第三段给出建议（约50词）'],
      templates: [
        { category: '描述图表', sentence: 'The chart clearly shows the changes in... from... to...' },
        { category: '描述图表', sentence: 'According to the data, there was a significant increase in...' },
        { category: '分析原因', sentence: 'Several factors can account for this phenomenon.' },
        { category: '分析原因', sentence: 'To begin with, the government has implemented a series of policies to...' },
        { category: '分析原因', sentence: 'Moreover, people\'s awareness of... has been greatly enhanced.' },
        { category: '建议', sentence: 'To sustain this positive trend, more efforts should be made to...' },
      ]
    },
    {
      id: 'big_2023_1',
      year: 2023,
      exam_type: '考研英语一',
      type: 'big',
      title: '图画作文：传统文化',
      prompt: 'Write an essay of 160-200 words based on the picture below. In your essay, you should\n1) describe the picture briefly,\n2) interpret the implied meaning, and\n3) give your comments.\n\n[图片描述：一位老人在教孩子们写书法，孩子们认真学习]',
      tips: ['第一段描述图画', '第二段阐释传统文化传承的重要性', '第三段给出建议'],
      templates: [
        { category: '描述图画', sentence: 'In the picture, we can see an elderly man teaching children calligraphy.' },
        { category: '阐释寓意', sentence: 'The picture reflects the importance of passing down traditional culture to the younger generation.' },
        { category: '观点', sentence: 'Traditional culture is the spiritual foundation of our nation.' },
        { category: '结尾', sentence: 'Therefore, we should make every effort to preserve and promote our cultural heritage.' },
      ]
    },
    {
      id: 'big_2023_2',
      year: 2023,
      exam_type: '考研英语二',
      type: 'big',
      title: '图表作文：网购用户规模',
      prompt: 'Write an essay based on the chart below. In your essay, you should\n1) describe the chart briefly,\n2) make comments, and\n3) give your suggestions.\n\n[图表描述：2018-2023年我国网购用户规模持续增长，从6亿增长至8.5亿]',
      tips: ['第一段描述图表', '第二段分析原因（科技普及、便利性）', '第三段给出建议'],
      templates: [
        { category: '描述图表', sentence: 'The bar chart illustrates the dramatic growth of...' },
        { category: '分析原因', sentence: 'The primary reason for this trend is the widespread use of smartphones and mobile payment.' },
        { category: '建议', sentence: 'While enjoying the convenience, we should also be aware of the potential risks of online shopping.' },
      ]
    },
  ],
  
  // 通用模板句库
  common_templates: [
    { category: '开头', sentence: 'With the rapid development of society, ... has become increasingly important.' },
    { category: '开头', sentence: 'In recent years, there has been a growing concern over...' },
    { category: '观点', sentence: 'As far as I am concerned, ... plays a crucial role in...' },
    { category: '观点', sentence: 'From my perspective, it is imperative that...' },
    { category: '论证', sentence: 'A case in point is that...' },
    { category: '论证', sentence: 'There is no denying that...' },
    { category: '对比', sentence: 'On the one hand, ... On the other hand, ...' },
    { category: '对比', sentence: 'While some people argue that..., others hold the opposite view.' },
    { category: '建议', sentence: 'It is high time that we took effective measures to...' },
    { category: '建议', sentence: 'The government / individuals / society should make every effort to...' },
    { category: '结尾', sentence: 'Taking all these factors into consideration, we can safely conclude that...' },
    { category: '结尾', sentence: 'Only in this way can we build a better and more harmonious society.' },
  ]
};
