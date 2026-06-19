module.exports = {
  "stages": [
    {
      "id": "stage1",
      "name": "基础语法",
      "description": "掌握时态、语态和基本句型",
      "points": [
        {
          "id": "tense_present",
          "name": "一般现在时 & 现在进行时",
          "rules": [
            "一般现在时：表示经常性、习惯性的动作或客观事实。结构：主语 + do/does + 动词原形",
            "现在进行时：表示此时此刻正在进行的动作。结构：主语 + am/is/are + doing"
          ],
          "examples": [
            "He usually gets up at 7 o'clock. (一般现在时)",
            "She is reading a book now. (现在进行时)",
            "The earth moves around the sun. (客观事实)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "Choose the correct form: She _____ to the gym every morning.",
              "options": {
                "A": "go",
                "B": "goes",
                "C": "is going",
                "D": "went"
              },
              "answer": "B",
              "explanation": "'every morning' 表示习惯性动作，用一般现在时。主语是第三人称单数，所以用 goes。"
            },
            {
              "type": "choice",
              "question": "Choose the correct form: Listen! The baby _____ in the next room.",
              "options": {
                "A": "cries",
                "B": "is crying",
                "C": "cried",
                "D": "has cried"
              },
              "answer": "B",
              "explanation": "'Listen!' 是现在进行时的标志词，表示动作正在发生。"
            },
            {
              "type": "reorder",
              "question": "Reorder the words to form a correct sentence in present continuous tense:",
              "words": [
                "is",
                "He",
                "a",
                "writing",
                "letter",
                "now"
              ],
              "answer": "He is writing a letter now."
            }
          ]
        },
        {
          "id": "tense_past",
          "name": "一般过去时 & 过去进行时",
          "rules": [
            "一般过去时：表示过去某个时间发生的动作。结构：主语 + did + 动词原形（或动词过去式）",
            "过去进行时：表示过去某一时刻正在进行的动作。结构：主语 + was/were + doing"
          ],
          "examples": [
            "I visited Beijing last summer. (一般过去时)",
            "When I called, she was having dinner. (过去进行时)",
            "While I was reading, he was watching TV. (两个动作同时进行)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "When I _____ home yesterday, it _____ heavily.",
              "options": {
                "A": "got... rained",
                "B": "was getting... was raining",
                "C": "got... was raining",
                "D": "get... is raining"
              },
              "answer": "C",
              "explanation": "'got home' 是短暂动作，用一般过去时；'was raining' 表示当时正在进行的背景动作，用过去进行时。"
            }
          ]
        },
        {
          "id": "tense_perfect",
          "name": "现在完成时 & 过去完成时",
          "rules": [
            "现在完成时：表示过去发生的动作对现在的影响。结构：have/has + done",
            "过去完成时：表示过去的过去。结构：had + done"
          ],
          "examples": [
            "I have finished my homework. (现在完成时)",
            "By the time we arrived, the film had already started. (过去完成时)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "By the end of last month, I _____ this book three times.",
              "options": {
                "A": "read",
                "B": "had read",
                "C": "have read",
                "D": "was reading"
              },
              "answer": "B",
              "explanation": "'By the end of last month' 是过去完成时的标志，表示在过去某个时间点之前已经完成的动作。"
            }
          ]
        },
        {
          "id": "passive_voice",
          "name": "被动语态",
          "rules": [
            "被动语态结构：be + done",
            "被动语态的时态由 be 动词体现",
            "不及物动词没有被动语态"
          ],
          "examples": [
            "The window was broken by the boy. (一般过去时被动)",
            "A new bridge is being built. (现在进行时被动)",
            "The book has been translated into many languages. (现在完成时被动)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "The letter _____ in French.",
              "options": {
                "A": "writes",
                "B": "is writing",
                "C": "is written",
                "D": "wrote"
              },
              "answer": "C",
              "explanation": "信被用法语写，需要用被动语态 is written。"
            }
          ]
        }
      ]
    },
    {
      "id": "stage2",
      "name": "进阶语法",
      "description": "掌握从句、非谓语和虚拟语气",
      "points": [
        {
          "id": "relative_clause",
          "name": "定语从句",
          "rules": [
            "定语从句由关系代词（who, which, that, whose, whom）或关系副词（where, when, why）引导",
            "who/whom 指人，which 指物，that 既可指人也可指物",
            "先行词在从句中作状语时用关系副词"
          ],
          "examples": [
            "The man who is standing there is my teacher.",
            "This is the house where I lived ten years ago.",
            "The reason why he left is unclear."
          ],
          "questions": [
            {
              "type": "choice",
              "question": "The book _____ I bought yesterday is very interesting.",
              "options": {
                "A": "who",
                "B": "which",
                "C": "where",
                "D": "when"
              },
              "answer": "B",
              "explanation": "先行词 'book' 是物，关系代词在从句中作宾语，用 which 或 that。"
            }
          ]
        },
        {
          "id": "noun_clause",
          "name": "名词性从句（主语/宾语/表语/同位语）",
          "rules": [
            "that 引导名词性从句时只起连接作用，不充当成分",
            "what 在从句中充当主语、宾语或表语",
            "whether/if 引导宾语从句表示'是否'"
          ],
          "examples": [
            "What he said surprised everyone. (主语从句)",
            "I don't know whether he will come. (宾语从句)",
            "The problem is that we don't have enough time. (表语从句)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "_____ he said at the meeting was very important.",
              "options": {
                "A": "That",
                "B": "What",
                "C": "Which",
                "D": "Where"
              },
              "answer": "B",
              "explanation": "从句中缺少宾语（said 的宾语），用 what 引导主语从句，what 在从句中充当宾语。"
            }
          ]
        },
        {
          "id": "adverbial_clause",
          "name": "状语从句",
          "rules": [
            "时间状语从句：when, while, as, before, after, since, until",
            "条件状语从句：if, unless, as long as",
            "原因状语从句：because, since, as",
            "让步状语从句：although, though, even if, no matter",
            "结果状语从句：so...that, such...that"
          ],
          "examples": [
            "If it rains tomorrow, we will stay at home.",
            "Although he is young, he knows a lot.",
            "She was so tired that she fell asleep immediately."
          ],
          "questions": [
            {
              "type": "choice",
              "question": "_____ you work hard, you will make progress.",
              "options": {
                "A": "If",
                "B": "Although",
                "C": "Because",
                "D": "Until"
              },
              "answer": "A",
              "explanation": "'努力工作就会进步'是条件关系，用 if 引导条件状语从句。"
            }
          ]
        },
        {
          "id": "nonfinite",
          "name": "非谓语动词（不定式/动名词/分词）",
          "rules": [
            "不定式（to do）表目的或将来",
            "动名词（doing）作主语或宾语",
            "现在分词（doing）表主动或进行",
            "过去分词（done）表被动或完成"
          ],
          "examples": [
            "To learn English well, you need to practice every day. (不定式表目的)",
            "Swimming is good for health. (动名词作主语)",
            "The man sitting there is my uncle. (现在分词作定语)",
            "Given more time, I could do better. (过去分词作条件状语)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "_____ in the sun is not good for your skin.",
              "options": {
                "A": "To stay",
                "B": "Stay",
                "C": "Staying",
                "D": "Stayed"
              },
              "answer": "C",
              "explanation": "空格处需要主语，动名词可以作主语，用 Staying。"
            }
          ]
        },
        {
          "id": "subjunctive",
          "name": "虚拟语气",
          "rules": [
            "与现在事实相反：If + 主语 + did, 主语 + would/should/could/might + do",
            "与过去事实相反：If + 主语 + had done, 主语 + would/should/could/might + have done",
            "wish 后的宾语从句用虚拟语气",
            "It is time that... 从句中用过去式"
          ],
          "examples": [
            "If I were you, I would accept the offer.",
            "I wish I had studied harder at school.",
            "It is high time that we took action."
          ],
          "questions": [
            {
              "type": "choice",
              "question": "If I _____ you, I _____ not do that.",
              "options": {
                "A": "were... would",
                "B": "am... will",
                "C": "was... would",
                "D": "were... will"
              },
              "answer": "A",
              "explanation": "与现在事实相反的虚拟语气，if 从句中用 were（所有人称），主句用 would + 动词原形。"
            }
          ]
        }
      ]
    },
    {
      "id": "stage3",
      "name": "高级语法",
      "description": "掌握倒装、强调和独立主格",
      "points": [
        {
          "id": "inversion",
          "name": "倒装句",
          "rules": [
            "完全倒装：Here/There/Now/Then + 谓语 + 主语",
            "部分倒装：否定词/only/so...that 置于句首时，助动词提前",
            "虚拟语气中的倒装：Had/Were/Should + 主语 + ..."
          ],
          "examples": [
            "Here comes the bus.",
            "Only in this way can we solve the problem.",
            "Had I known the truth, I would have told you."
          ],
          "questions": [
            {
              "type": "choice",
              "question": "Only by working hard _____ succeed.",
              "options": {
                "A": "you can",
                "B": "can you",
                "C": "you will",
                "D": "will you"
              },
              "answer": "B",
              "explanation": "Only + 状语置于句首时，句子需要部分倒装，将情态动词 can 提前。"
            }
          ]
        },
        {
          "id": "emphasis",
          "name": "强调句",
          "rules": [
            "强调句结构：It is/was + 被强调部分 + that/who + 其他",
            "可以强调主语、宾语、状语",
            "被强调部分指人时可用 who，其他情况用 that"
          ],
          "examples": [
            "It was Tom who broke the window. (强调主语)",
            "It was yesterday that I met him. (强调时间状语)",
            "It is in Beijing that I was born. (强调地点状语)"
          ],
          "questions": [
            {
              "type": "choice",
              "question": "It was in the park _____ we first met.",
              "options": {
                "A": "where",
                "B": "that",
                "C": "which",
                "D": "when"
              },
              "answer": "B",
              "explanation": "这是强调句结构 It was...that...，强调地点状语 in the park。"
            }
          ]
        },
        {
          "id": "absolute",
          "name": "独立主格",
          "rules": [
            "独立主格结构：名词/代词 + 分词/形容词/副词/介词短语",
            "独立主格在句中作状语，表示时间、原因、条件、伴随等",
            "独立主格有自己的逻辑主语，与主句主语不同"
          ],
          "examples": [
            "Weather permitting, we will go for a picnic.",
            "The work done, we went home.",
            "He sat in the chair, his eyes closed."
          ],
          "questions": [
            {
              "type": "choice",
              "question": "_____, we decided to go out for a walk.",
              "options": {
                "A": "It is fine",
                "B": "Being fine",
                "C": "It was fine",
                "D": "The weather being fine"
              },
              "answer": "D",
              "explanation": "独立主格结构需要有自己独立的逻辑主语 'The weather'，后接 being fine。"
            }
          ]
        }
      ]
    }
  ],
  "user_progress": {
    "completed_points": [],
    "current_point": "tense_present",
    "total_score": 0
  }
};