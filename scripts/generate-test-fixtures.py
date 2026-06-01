from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "test-fixtures"
OUT.mkdir(parents=True, exist_ok=True)

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\msyh.ttc"),
    Path(r"C:\Windows\Fonts\simhei.ttf"),
    Path(r"C:\Windows\Fonts\arial.ttf"),
]
FONT_FILE = next((p for p in FONT_CANDIDATES if p.exists()), None)
if FONT_FILE is None:
    raise SystemExit("No usable font found")


def font(size: int):
    return ImageFont.truetype(str(FONT_FILE), size=size)


def draw_doc(filename: str, title: str, subtitle: str, rows: list[str], footer: str):
    w, h = 1200, 1600
    img = Image.new("RGB", (w, h), "white")
    d = ImageDraw.Draw(img)
    green = (7, 150, 111)
    dark = (25, 64, 56)
    muted = (78, 116, 106)
    soft = (237, 247, 242)
    line = (190, 220, 210)

    d.rectangle([0, 0, w, 190], fill=soft)
    d.rectangle([48, 48, w - 48, h - 48], outline=line, width=3)
    d.text((82, 70), title, fill=green, font=font(44))
    d.text((86, 136), subtitle, fill=muted, font=font(24))

    y = 250
    for row in rows:
        if row.startswith("#"):
            txt = row[1:]
            d.rounded_rectangle([78, y - 10, w - 78, y + 54], radius=14, fill=soft)
            d.text((100, y), txt, fill=dark, font=font(30))
            y += 86
        else:
            d.text((105, y), row, fill=dark, font=font(28))
            d.line((98, y + 54, w - 98, y + 54), fill=line, width=2)
            y += 78

    d.rounded_rectangle([78, h - 210, w - 78, h - 100], radius=14, fill=soft)
    d.text((100, h - 182), footer, fill=muted, font=font(24))
    img.save(OUT / filename)


FIXTURES = [
    (
        "01-appointment-sms.png",
        "北京和安医院 预约短信截图",
        "测试用途仿真材料，非真实患者信息",
        [
            "#预约信息",
            "姓名：王秀兰    年龄：68岁",
            "预约科室：内科门诊",
            "预约时间：2026年6月3日 09:30",
            "医院地址：门诊楼 1F 大厅",
            "#系统提示",
            "请先到 1F 挂号窗口完成取号",
            "需携带：身份证、医保卡、预约短信",
            "取号后按挂号单提示前往分诊台",
        ],
        "识别重点：科室、时间、材料、下一步去 1F 挂号窗口",
    ),
    (
        "02-registration-slip.png",
        "北京和安医院 挂号单",
        "门诊挂号凭条",
        [
            "#患者与科室",
            "姓名：王秀兰    性别：女    年龄：68岁",
            "科室：内科    医生：李明医生",
            "就诊位置：3F 西侧候诊区",
            "#分诊信息",
            "请先到 3F 西侧分诊台报到",
            "排队号：A128",
            "携带材料：挂号单、医保卡、病历本",
        ],
        "识别重点：分诊台、3F 西侧、排队号 A128",
    ),
    (
        "03-doctor-order-blood-test.png",
        "北京和安医院 医生医嘱单",
        "检查与缴费提示",
        [
            "#医嘱项目",
            "检查项目：血常规、肝肾功能、空腹血糖",
            "医生说明：本次抽血无需空腹",
            "检查目的：了解近期身体指标变化",
            "#下一步",
            "请先到自助缴费机 B 完成缴费",
            "缴费后前往 2F 化验室窗口抽血",
            "检查结果约 1 小时后可取",
        ],
        "识别重点：先缴费，再去 2F 化验室，结果约 1 小时",
    ),
    (
        "04-lab-result.png",
        "北京和安医院 化验结果单",
        "血液检查报告",
        [
            "#检查结果",
            "血常规：已完成",
            "肝肾功能：已完成",
            "空腹血糖：略高，建议结合医生复诊判断",
            "#复诊提示",
            "请携带本报告返回 318 诊室",
            "交给李明医生查看结果",
            "如头晕、胸闷明显加重，请及时告知医生",
        ],
        "识别重点：结果已出，回 318 诊室复诊",
    ),
    (
        "05-prescription-pickup.png",
        "北京和安医院 处方取药单",
        "药房取药与用药说明",
        [
            "#取药信息",
            "药房：2F 药房 5 号窗口",
            "取药号：A128",
            "请核对姓名、药品名称和数量",
            "#药品说明",
            "降压药：每天早上 1 次，每次 1 片",
            "胃药：每天 2 次，早晚饭后服用",
            "不要自行加量或停药",
            "如服药后明显不舒服，请联系医院",
        ],
        "识别重点：2F 药房 5 号窗口、药名、服药时间",
    ),
]


for item in FIXTURES:
    draw_doc(*item)


(OUT / "README.txt").write_text(
    "\n".join(
        [
            "图片测试文件:",
            "01-appointment-sms.png",
            "02-registration-slip.png",
            "03-doctor-order-blood-test.png",
            "04-lab-result.png",
            "05-prescription-pickup.png",
            "",
            "语音/文字测试稿:",
            "A. 挂号后医生/工作人员录音:",
            "把身份证、医保卡和预约码交给窗口，挂号后拿好新的挂号单，然后去分诊台。",
            "",
            "B. 诊室第一次录音:",
            "这次先去缴费，再去 2F 化验室抽血；抽血不用空腹；结果大约 1 小时出来；如果结果异常，当天回 318 诊室复诊。",
            "",
            "C. 诊室复诊录音:",
            "回家后注意休息，饮食清淡，避免熬夜；如果胸闷、头晕明显加重，需要及时回医院。",
            "",
            "D. 药房录音:",
            "拿到药后先核对姓名、药名和数量；降压药每天早上 1 次，每次 1 片；胃药每天 2 次，早晚饭后服用；不要自行加量或停药；如果吃药后明显不舒服，请联系医院。",
            "",
            "E. 额外补问:",
            "这些药能不能一起吃？吃药后不舒服怎么办？药要吃几天？漏服一次怎么办？什么时候需要复诊？",
        ]
    ),
    encoding="utf-8",
)

print(f"generated {len(FIXTURES)} files in {OUT}")
