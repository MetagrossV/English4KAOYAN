module.exports = {
  "topics": [
    {
      "id": "topic_001",
      "name": "一般时态",
      "category": "基础",
      "difficulty_range": [
        1,
        2
      ],
      "prerequisite": null,
      "description": "一般现在时、一般过去时、一般将来时的用法与区别"
    },
    {
      "id": "topic_002",
      "name": "进行时态",
      "category": "基础",
      "difficulty_range": [
        1,
        2
      ],
      "prerequisite": "topic_001",
      "description": "现在进行时、过去进行时、将来进行时的用法"
    },
    {
      "id": "topic_003",
      "name": "完成时态",
      "category": "基础",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": "topic_002",
      "description": "现在完成时、过去完成时、将来完成时及时间标志词"
    },
    {
      "id": "topic_004",
      "name": "完成进行时",
      "category": "基础",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": "topic_003",
      "description": "现在完成进行时、过去完成进行时的用法与区别"
    },
    {
      "id": "topic_005",
      "name": "被动语态",
      "category": "基础",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": "topic_001",
      "description": "各时态的被动语态构成、被动语态的使用场景与限制"
    },
    {
      "id": "topic_006",
      "name": "主谓一致",
      "category": "基础",
      "difficulty_range": [
        1,
        3
      ],
      "prerequisite": null,
      "description": "语法一致、就近原则、就前原则、集体名词等"
    },
    {
      "id": "topic_007",
      "name": "情态动词",
      "category": "基础",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": null,
      "description": "can/could/may/might/must/should/shall/will的用法及推测含义"
    },
    {
      "id": "topic_008",
      "name": "定语从句-基础",
      "category": "进阶",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": "topic_001",
      "description": "关系代词who/which/that/whose的选择，限制性定语从句"
    },
    {
      "id": "topic_009",
      "name": "定语从句-高级",
      "category": "进阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_008",
      "description": "非限制性定语从句、as/which引导、介词+关系代词、分隔式定语从句"
    },
    {
      "id": "topic_010",
      "name": "名词性从句",
      "category": "进阶",
      "difficulty_range": [
        2,
        4
      ],
      "prerequisite": "topic_008",
      "description": "主语从句、宾语从句、表语从句、同位语从句的引导词与用法"
    },
    {
      "id": "topic_011",
      "name": "状语从句-时间/条件",
      "category": "进阶",
      "difficulty_range": [
        2,
        3
      ],
      "prerequisite": "topic_001",
      "description": "when/while/as/before/after/if/unless/as long as引导的从句"
    },
    {
      "id": "topic_012",
      "name": "状语从句-让步/原因/结果",
      "category": "进阶",
      "difficulty_range": [
        2,
        4
      ],
      "prerequisite": "topic_011",
      "description": "although/though/because/since/as/so...that/such...that等"
    },
    {
      "id": "topic_013",
      "name": "非谓语动词-不定式",
      "category": "进阶",
      "difficulty_range": [
        2,
        4
      ],
      "prerequisite": "topic_001",
      "description": "不定式作主语/宾语/定语/状语/补语，省略to的情况"
    },
    {
      "id": "topic_014",
      "name": "非谓语动词-动名词",
      "category": "进阶",
      "difficulty_range": [
        2,
        4
      ],
      "prerequisite": "topic_013",
      "description": "动名词作主语/宾语/表语，动名词与不定式作宾语的区别"
    },
    {
      "id": "topic_015",
      "name": "非谓语动词-分词",
      "category": "进阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_014",
      "description": "现在分词/过去分词作定语/状语/补语，独立主格结构"
    },
    {
      "id": "topic_016",
      "name": "虚拟语气",
      "category": "高阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_003",
      "description": "if虚拟条件句、wish/should/would rather的虚拟、含蓄虚拟、倒装虚拟"
    },
    {
      "id": "topic_017",
      "name": "倒装句",
      "category": "高阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_016",
      "description": "完全倒装、部分倒装、虚拟倒装、so/neither/only引起的倒装"
    },
    {
      "id": "topic_018",
      "name": "强调句",
      "category": "高阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_017",
      "description": "It is/was...that/who...结构，强调句与定语从句的区别"
    },
    {
      "id": "topic_019",
      "name": "省略与替代",
      "category": "高阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": "topic_012",
      "description": "状语从句省略、不定式省略、so/not/one/do的替代用法"
    },
    {
      "id": "topic_020",
      "name": "长难句综合",
      "category": "高阶",
      "difficulty_range": [
        3,
        4
      ],
      "prerequisite": null,
      "description": "考研真题风格长难句，综合运用多个语法点进行分析"
    }
  ],
  "topic_graph": {
    "topic_001": {
      "name": "一般时态",
      "prerequisite": null,
      "children": [
        "topic_002",
        "topic_005",
        "topic_008",
        "topic_011",
        "topic_013"
      ]
    },
    "topic_002": {
      "name": "进行时态",
      "prerequisite": "topic_001",
      "children": [
        "topic_003"
      ]
    },
    "topic_003": {
      "name": "完成时态",
      "prerequisite": "topic_002",
      "children": [
        "topic_004",
        "topic_016"
      ]
    },
    "topic_004": {
      "name": "完成进行时",
      "prerequisite": "topic_003",
      "children": []
    },
    "topic_005": {
      "name": "被动语态",
      "prerequisite": "topic_001",
      "children": []
    },
    "topic_006": {
      "name": "主谓一致",
      "prerequisite": null,
      "children": []
    },
    "topic_007": {
      "name": "情态动词",
      "prerequisite": null,
      "children": []
    },
    "topic_008": {
      "name": "定语从句-基础",
      "prerequisite": "topic_001",
      "children": [
        "topic_009",
        "topic_010"
      ]
    },
    "topic_009": {
      "name": "定语从句-高级",
      "prerequisite": "topic_008",
      "children": []
    },
    "topic_010": {
      "name": "名词性从句",
      "prerequisite": "topic_008",
      "children": []
    },
    "topic_011": {
      "name": "状语从句-时间/条件",
      "prerequisite": "topic_001",
      "children": [
        "topic_012"
      ]
    },
    "topic_012": {
      "name": "状语从句-让步/原因/结果",
      "prerequisite": "topic_011",
      "children": [
        "topic_019"
      ]
    },
    "topic_013": {
      "name": "非谓语动词-不定式",
      "prerequisite": "topic_001",
      "children": [
        "topic_014"
      ]
    },
    "topic_014": {
      "name": "非谓语动词-动名词",
      "prerequisite": "topic_013",
      "children": [
        "topic_015"
      ]
    },
    "topic_015": {
      "name": "非谓语动词-分词",
      "prerequisite": "topic_014",
      "children": []
    },
    "topic_016": {
      "name": "虚拟语气",
      "prerequisite": "topic_003",
      "children": [
        "topic_017"
      ]
    },
    "topic_017": {
      "name": "倒装句",
      "prerequisite": "topic_016",
      "children": [
        "topic_018"
      ]
    },
    "topic_018": {
      "name": "强调句",
      "prerequisite": "topic_017",
      "children": []
    },
    "topic_019": {
      "name": "省略与替代",
      "prerequisite": "topic_012",
      "children": []
    },
    "topic_020": {
      "name": "长难句综合",
      "prerequisite": null,
      "children": []
    }
  },
  "version": "1.0"
};