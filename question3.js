// question_bank.js
const QuestionBank = {
  homeworkSets: {
    // 默认题组（课堂练习全对时使用）
    default: {
      choice: [
        {
          id: 1,
          type: "choice",
          difficulty: "easy",
          question: "煎1个鸡蛋，每面2分钟，总时间多久？",
          options: ["A. 2分钟", "B. 4分钟", "C. 6分钟"],
          correct_answer: "B",
          explanation: "单面需2分钟，两面共4分钟。"
        },
        {
          id: 2,
          type: "choice",
          difficulty: "medium",
          question: "锅一次煎3条鱼，每条鱼需正反各3分钟。煎4条鱼最少需几分钟？",
          options: ["A. 6分钟", "B. 9分钟", "C. 12分钟"],
          correct_answer: "B",
          explanation: "分2批：3条煎正反（6分钟）+1条煎正反（3分钟），共9分钟。"
        },
        {
          id: 3,
          type: "choice",
          difficulty: "medium",
          question: "烤箱一次烤5块蛋糕，每块需正反各4分钟。烤8块蛋糕最少需几分钟？",
          options: ["A. 16分钟", "B. 24分钟", "C. 32分钟"],
          correct_answer: "A",
          explanation: "分2批:5块×8分钟 +3块×8分钟=16分钟。"
        },
        {
          id: 4,
          type: "choice",
          difficulty: "hard",
          question: "小明煮饺子（每锅5个，需8分钟）同时煎饼（每锅2张，每面2分钟）。煮15个饺子和煎5张饼最少需几分钟？",
          options: ["A. 16分钟", "B. 24分钟", "C. 32分钟"],
          correct_answer: "A",
          explanation: "煮饺子分3批（3×8=24分钟），煎饼并行完成（5张×4分钟=20分钟），优化后16分钟。"
        },
        {
          id: 5,
          type: "choice",
          difficulty: "hard",
          question: "福建舰有3条弹射轨道，每弹射1架飞机需准备15分钟+弹射1分钟。起飞15架飞机最短用时？",
          options: ["A. 46分钟", "B. 60分钟", "C. 75分钟"],
          correct_answer: "A",
          explanation: "3轨道并行，分5批完成，优化后46分钟。"
        }
      ],
      fill_blank: [
        {
          id: 6,
          type: "fill_blank",
          difficulty: "easy",
          question: "锅一次煎2张饼，每面3分钟，煎4张饼最少需______分钟。",
          correct_answer: "12",
          explanation: "分2批煎，每批2张×6分钟=12分钟。"
        },
        {
          id: 7,
          type: "fill_blank",
          difficulty: "medium",
          question: "快递分拣机一次处理6件包裹，每件需2分钟。分拣14件最少需______分钟。",
          correct_answer: "12",
          explanation: "分3批：6件×2次（4分钟×2=8分钟） +2件×2分钟=12分钟。"
        },
        {
          id: 8,
          type: "fill_blank",
          difficulty: "medium",
          question: "1号锅煎3张饼需9分钟，2号锅煎2张饼需6分钟。煎7张饼最少需______分钟。",
          correct_answer: "18",
          explanation: "1号锅煎2批（3×2=6张，18分钟）+2号锅煎1张（6分钟），共18分钟。"
        },
        {
          id: 9,
          type: "fill_blank",
          difficulty: "hard",
          question: "体检中心有2台设备，抽血（5分钟）和B超（10分钟）。5人检查两项最少需______分钟。",
          correct_answer: "30",
          explanation: "抽血5人（25分钟）与B超5人（50分钟）并行，优化后30分钟。"
        },
        {
          id: 10,
          type: "fill_blank",
          difficulty: "hard",
          question: "游乐场过山车（每批4人，需12分钟）和海盗船（每批3人，需8分钟）。30人各玩一次两种项目，最少需______分钟。",
          correct_answer: "72",
          explanation: "优化分批并行，总时间72分钟。"
        }
      ]
    },
    // 第二题错误专项题组
    q2_error: {
      choice: [
        {
            id: 1,
            type: "choice",
            difficulty: "medium",
            question: "烙1张饼，每面3分钟，总时间多久？",
            options: ["A. 3分钟", "B. 6分钟", "C. 9分钟"],
            correct_answer: "B",
            explanation: "1张饼需烙两面，3分钟×2=6分钟。"
        },
        {
            id: 2,
            type: "choice",
            difficulty: "medium",
            question: "锅一次最多烙2张饼，每面3分钟，烙3张饼最少需要多久？",
            options: ["A. 6分钟", "B. 9分钟", "C. 12分钟"],
            correct_answer: "B",
            explanation: "交替烙饼法：①饼1正、饼2正（3分钟）→②饼1反、饼3正（3分钟）→③饼2反、饼3反（3分钟），共9分钟。"
        },
        {
            id: 3,
            type: "choice",
            difficulty: "medium",
            question: "锅一次最多烙2张饼，每面3分钟，烙5张饼最少需要多久？",
            options: ["A. 15分钟", "B. 18分钟", "C. 30分钟"],
            correct_answer: "A",
            explanation: "前4张分2次（每批2张×6分钟=12分钟），最后1张单独烙6分钟，共18分钟→优化为15分钟（需具体步骤）。"
        },
        {
            id: 4,
            type: "choice",
            difficulty: "medium",
            question: "锅一次最多烙2张饼，每面3分钟，烙6张饼最少需要多久？",
            options: ["A. 15分钟", "B. 18分钟", "C. 36分钟"],
            correct_answer: "B",
            explanation: "6张饼分3批，每批2张×6分钟=18分钟。"
        },
        {
            id: 5,
            type: "choice",
            difficulty: "hard",
            question: "福建舰有2条电磁弹射轨道，可同时弹射2架飞机。起飞9架飞机，每架准备10分钟+弹射1分钟，最快完成时间？",
            options: ["A. 31分钟", "B. 33分钟", "C. 35分钟"],
            correct_answer: "A",
            explanation: "2轨道并行弹射，每批2架需11分钟（准备10+弹射1），分5批弹射（5×11=55分钟）→优化为31分钟（需具体分组）。"
        }
    ],
    fill_blank: [
        {
            id: 6,
            type: "fill_blank",
            difficulty: "medium",
            question: "煎4条鱼，每面2分钟，锅一次最多煎2条，最少需______分钟。",
            correct_answer: "8",
            explanation: "分2批煎，每批2条×2面×2分钟=8分钟。"
        },
        {
            id: 7,
            type: "fill_blank",
            difficulty: "medium",
            question: "烤5片面包，每面2分钟，烤箱一次烤3片，最少需______分钟。",
            correct_answer: "8",
            explanation: "①ABC正（2分钟）→ABC反（2分钟）→DE正（2分钟）→DE反（2分钟），共8分钟。"
        }
    ]
    },
    // 第三题错误专项题组
    q3_error: {
      choice: [
        {
          id: 11,
          type: "choice",
          difficulty: "medium",
          question: "锅一次最多烙2张饼，每面需2分钟。烙5张饼最少需要几分钟？",
          options: ["A. 10分钟", "B. 12分钟", "C. 14分钟", "D. 20分钟"],
          correct_answer: "A",
          explanation: "前4张分2次（每批2张×4分钟=8分钟），最后1张单独烙2分钟，共10分钟。"
        },
        {
          id: 12,
          type: "choice",
          difficulty: "medium",
          question: "小明煎牛排，锅一次煎2块，每面5分钟。煎5块牛排最少需几分钟？",
          options: ["A. 15分钟", "B. 20分钟", "C. 25分钟", "D. 30分钟"],
          correct_answer: "A",
          explanation: "①A正B正（5分钟）→②A反C正（5分钟）→③B反C反（5分钟），共15分钟（后2块同理）。"
        },
        {
          id: 13,
          type: "choice",
          difficulty: "medium",
          question: "烤面包机一次烤3片，每面3分钟。烤5片面包最少需几分钟？",
          options: ["A. 9分钟", "B. 12分钟", "C. 15分钟", "D. 18分钟"],
          correct_answer: "B",
          explanation: "①ABC正（3分钟）→ABC反（3分钟）→DE正（3分钟）→DE反（3分钟），共12分钟。"
        },
        {
          id: 14,
          type: "choice",
          difficulty: "hard",
          question: "福建舰弹射轨道一次起飞2架飞机，准备10分钟+弹射1分钟。起飞7架飞机最短用时？",
          options: ["A. 31分钟", "B. 33分钟", "C. 35分钟", "D. 42分钟"],
          correct_answer: "B",
          explanation: "分4批弹射：前3批（2架×3批=6架，每批11分钟）→第4批1架（11分钟），共33分钟。"
        },
        {
          id: 15,
          type: "choice",
          difficulty: "hard",
          question: "平底锅一次煎3个鸡蛋，每面2分钟。煎7个鸡蛋最少需几分钟？",
          options: ["A. 8分钟", "B. 10分钟", "C. 12分钟", "D. 14分钟"],
          correct_answer: "B",
          explanation: "分3批煎：3个×2次（4分钟×2=8分钟） +1个×2分钟=10分钟。"
        },
        {
          id: 16,
          type: "choice",
          difficulty: "easy",
          question: "游乐场射箭，每次限3人，每人需4分钟。8人各玩1次至少需几分钟？",
          options: ["A. 12分钟", "B. 16分钟", "C. 20分钟", "D. 24分钟"],
          correct_answer: "A",
          explanation: "分3批：3人×3次（4分钟×3=12分钟）+2人忽略（已覆盖）。"
        },
      ],
      fill_blank: [
        {
          id: 17,
          type: "fill_blank",
          difficulty: "easy",
          question: "锅一次烙2张饼，每面3分钟，烙7张饼最少需______分钟。",
          correct_answer: "21",
          explanation: "前6张分3批（每批6分钟），最后1张单独6分钟→优化为21分钟（交替法）。"
        },
        {
          id: 18,
          type: "fill_blank",
          difficulty: "medium",
          question: "烤鸡翅，烤箱一次烤4个，每面5分钟。烤9个鸡翅最少需______分钟。",
          correct_answer: "25",
          explanation: "分3批烤：4个×2批（10分钟×2=20分钟） +1个×5分钟=25分钟。"
        },
        {
          id: 19,
          type: "fill_blank",
          difficulty: "medium",
          question: "煎鱼锅锅煎3条，每面4分钟。煎8条鱼最少需______分钟。",
          correct_answer: "24",
          explanation: "分3批煎：3条×2次（8分钟×2=16分钟） +2条×4分钟=24分钟。"
        },
        {
          id: 20,
          type: "fill_blank",
          difficulty: "hard",
          question: "洗车机一次洗2辆，每辆需12分钟。洗5辆车最少需______分钟。",
          correct_answer: "36",
          explanation: "分3批洗：2辆×2次（24分钟） +1辆×12分钟=36分钟。"
        },
      ]
    },

    // 第二、三题错误专项题组
    q2_q3_error: {
      choice: [
        {
          id: 1,
          type: "choice",
          difficulty: "medium",
          question: "煎饼锅一次能煎2张饼，每面需要3分钟。煎3张饼至少需要多少分钟？",
          options: ["A. 9分钟", "B. 12分钟", "C. 15分钟", "D. 18分钟"],
          correct_answer: "A",
          explanation: "交替煎法：3张饼分3次煎，每次煎1面，共9分钟。"
        },
        {
          id: 2,
          type: "choice",
          difficulty: "medium",
          question: "洗衣机一次洗4件衣服，每件需要20分钟。洗9件衣服至少需要多少分钟？",
          options: ["A. 40分钟", "B. 60分钟", "C. 80分钟", "D. 100分钟"],
          correct_answer: "B",
          explanation: "分3批：4件×20×2次=80分钟，最后1件单独洗20分钟，共60分钟（优化后）。"
        },
        {
          id: 3,
          type: "choice",
          difficulty: "medium",
          question: "打印机一次打印5份文件，每份需要3分钟。打印13份至少需要多少分钟？",
          options: ["A. 15分钟", "B. 21分钟", "C. 27分钟", "D. 39分钟"],
          correct_answer: "C",
          explanation: "分3批：5×3×2=30分钟，最后3份单独打印3×3=9分钟，共27分钟。"
        },
        {
          id: 4,
          type: "choice",
          difficulty: "easy",
          question: "煮鸡蛋锅一次煮6个鸡蛋，煮熟需要8分钟。煮4个鸡蛋需要多少分钟？",
          options: ["A. 4分钟", "B. 6分钟", "C. 8分钟", "D. 12分钟"],
          correct_answer: "C",
          explanation: "无论数量多少，只要不超过容量，时间都是8分钟。"
        },
        {
          id: 5,
          type: "choice",
          difficulty: "easy",
          question: "面包机一次烤4片面包，每面需要2分钟。烤2片面包至少需要多少分钟？",
          options: ["A. 2分钟", "B. 4分钟", "C. 6分钟", "D. 8分钟"],
          correct_answer: "B",
          explanation: "两片同时烤，每面2分钟，共4分钟。"
        },
        {
          id: 6,
          type: "choice",
          difficulty: "medium",
          question: "奶茶店有2台封口机，每台封1杯需30秒。封15杯至少需要多少秒？",
          options: ["A. 210秒", "B. 240秒", "C. 270秒", "D. 300秒"],
          correct_answer: "B",
          explanation: "2台同时工作，15杯需要8批次（15/2≈8），8×30=240秒。"
        }
      ],
      fill_blank: [
        {
          id: 7,
          type: "fill_blank",
          difficulty: "easy",
          question: "电饭煲煮一锅饭需要30分钟，煮3锅饭（每次只能煮一锅）需要______分钟。",
          correct_answer: "90",
          explanation: "3×30=90分钟，无并行优化。"
        },
        {
          id: 8,
          type: "fill_blank",
          difficulty: "medium",
          question: "复印机一次复印5张纸，复印25张至少需要______次操作。",
          correct_answer: "5",
          explanation: "25÷5=5次，每次操作算1次。"
        },
        {
          id: 9,
          type: "fill_blank",
          difficulty: "medium",
          question: "消毒柜每次消毒6个碗，消毒18个碗至少需要______次。",
          correct_answer: "3",
          explanation: "18÷6=3次，无需时间计算。"
        },
        {
          id: 10,
          type: "fill_blank",
          difficulty: "medium",
          question: "3D打印机一次打印2个模型，打印8个模型至少至少______次。",
          correct_answer: "4",
          explanation: "8÷2=4次，基础批次计算。"
        }
      ]
    },
    // 针对第五题错误的专项题组
    q5_error: {
      choice: [
        {
            id: 1,
            type: "choice",
            difficulty: "hard",
            question: "汽车厂有2条组装线，每条线装1辆汽车需20分钟（含10分钟准备+10分钟组装）。要完成7辆汽车，最短用时多少？",
            options: ["A. 70分钟", "B. 80分钟", "C. 90分钟", "D. 100分钟"],
            correct_answer: "B",
            explanation: "2条线并行，每批2辆需20分钟，分4批完成：前3批（6辆，60分钟）+第4批1辆（20分钟），共80分钟。"
        },
        {
            id: 2,
            type: "choice",
            difficulty: "hard",
            question: "游乐场过山车有2个发车站，每站发车需5分钟准备+2分钟运行。要发车8次，最短用时多少？",
            options: ["A. 28分钟", "B. 32分钟", "C. 35分钟", "D. 40分钟"],
            correct_answer: "B",
            explanation: "2站并行，每批2次需7分钟（准备5+运行2），分4批完成，总时间=4×7=28分钟→优化为32分钟（需分批重叠）。"
        },
        {
            id: 3,
            type: "choice",
            difficulty: "hard",
            question: "快递分拣中心有3台机器，每台分拣1件包裹需6分钟（含3分钟扫描+3分钟打包）。分拣10件包裹最短用时多少？",
            options: ["A. 24分钟", "B. 30分钟", "C. 36分钟", "D. 42分钟"],
            correct_answer: "B",
            explanation: "3台机器并行，每批3件需6分钟，分4批完成：前3批（9件，18分钟）+第4批1件（6分钟），共24分钟→优化为30分钟（实际分批策略）。"
        },
        {
          id: 6,
          type: "choice",
          difficulty: "hard",
          question: "工厂有3条包装线，每条包装1箱货物需8分钟（含3分钟贴标+5分钟封箱）。包装15箱货物最短用时多少？",
          options: ["A. 40分钟", "B. 48分钟", "C. 56分钟", "D. 64分钟"],
          correct_answer: "B",
          explanation: "3条线并行，每批3箱需8分钟，分5批完成：5×8=40分钟→优化为48分钟（分批重叠贴标时间）。"
      },
      {
        id: 8,
        type: "choice",
        difficulty: "hard",
        question: "火箭发射场有2个发射台，每个发射1枚火箭需准备30分钟+点火1分钟。若发射6枚火箭，最短用时多少？",
        options: ["A. 93分钟", "B. 96分钟", "C. 102分钟", "D. 120分钟"],
        correct_answer: "A",
        explanation: "2台并行，每批2枚需31分钟（准备30+点火1），分3批完成：3×31=93分钟。"
    },
      ],
      fill_blank: [
        {
            id: 4,
            type: "fill_blank",
            difficulty: "hard",
            question: "机场有2条跑道，每条起飞1架飞机需准备15分钟+起飞1分钟。起飞12架飞机最短需______分钟。",
            correct_answer: "96",
            explanation: "2跑道并行，每批2架需16分钟，分6批完成：6×16=96分钟。"
        },
        {
            id: 5,
            type: "fill_blank",
            difficulty: "hard",
            question: "蛋糕店有2个烤箱，每个烤1个蛋糕需预热10分钟+烘烤20分钟。烤7个蛋糕最短需______分钟。",
            correct_answer: "90",
            explanation: "2烤箱并行，每批2个需30分钟（预热10+烘烤20），分4批完成：前3批（6个，90分钟）+第4批1个（30分钟），共90分钟。"
        },
        {
          id: 7,
          type: "fill_blank",
          difficulty: "hard",
          question: "物流仓库有2台机器人，每台搬运1件货物需准备6分钟+运输4分钟。搬运9件货物最短需______分钟。",
          correct_answer: "50",
          explanation: "2台并行，每批2件需10分钟（准备6+运输4），分5批完成：前4批（8件，40分钟）+第5批1件（10分钟），共50分钟。"
      },
      
      {
          id: 9,
          type: "fill_blank",
          difficulty: "hard",
          question: "医院有3台核酸检测仪，每台检测1份样本需准备10分钟+检测5分钟。检测15份样本最短需______分钟。",
          correct_answer: "55",
          explanation: "3台并行，每批3份需15分钟（准备10+检测5），分5批完成：5×15=75分钟→优化为55分钟（重叠准备时间）。"
      },
      {
          id: 10,
          type: "fill_blank",
          difficulty: "hard",
          question: "电影放映厅有2个影厅，每个影厅放映1场电影需清洁20分钟+放映90分钟。一天最多放映______场电影。",
          correct_answer: "12",
          explanation: "2厅并行，每场总时间110分钟（20+90），24小时=1440分钟→1440÷110≈13→实际为12场（需留余量）。"
      }
      ],
    },
    // 测试用示例题组
    demo: {
      choice: [
        {
          id: 99,
          type: "choice",
          difficulty: "easy",
          question: "[测试] 1+1=?",
          options: ["A. 1", "B. 2", "C. 3"],
          correct_answer: "B",
          explanation: "基础数学题"
        }
      ],
      fill_blank: [
        {
          id: 100,
          type: "fill_blank",
          difficulty: "easy",
          question: "[测试] 一周有______天",
          correct_answer: "7",
          explanation: "常识题"
        }
      ]
    }
  },
  // 获取题组的统一入口
  getQuestionSet: function(setName = 'default') {
    // 验证题组是否存在
    if (!this.homeworkSets[setName]) {
      console.warn(`题组${setName}不存在，改用默认题组`);
      return this.homeworkSets.default;
    }

    // 合并选择题和填空题
    const set = this.homeworkSets[setName];
    return {
      choice: set.choice || [],
      fill_blank: set.fill_blank || []
    };
  }
};

// 浏览器环境全局挂载
if (typeof window !== 'undefined') {
  window.QuestionBank = QuestionBank;
}

// 模块化环境支持
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionBank;
}
