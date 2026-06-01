$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\test-fixtures"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-DocumentImage {
  param(
    [string]$FileName,
    [string]$Title,
    [string]$Subtitle,
    [string[]]$Rows,
    [string]$Footer
  )

  $width = 1200
  $height = 1600
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $white = [System.Drawing.Brushes]::White
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 64, 56))
  $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(78, 116, 106))
  $green = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(7, 150, 111))
  $soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(237, 247, 242))
  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 220, 210), 3)

  $graphics.FillRectangle($white, 0, 0, $width, $height)
  $graphics.FillRectangle($soft, 0, 0, $width, 190)
  $graphics.DrawRectangle($linePen, 48, 48, $width - 96, $height - 96)

  $fontTitle = New-Object System.Drawing.Font("Microsoft YaHei", 44, [System.Drawing.FontStyle]::Bold)
  $fontSubtitle = New-Object System.Drawing.Font("Microsoft YaHei", 24, [System.Drawing.FontStyle]::Bold)
  $fontBody = New-Object System.Drawing.Font("Microsoft YaHei", 28, [System.Drawing.FontStyle]::Regular)
  $fontBodyBold = New-Object System.Drawing.Font("Microsoft YaHei", 30, [System.Drawing.FontStyle]::Bold)
  $fontFooter = New-Object System.Drawing.Font("Microsoft YaHei", 24, [System.Drawing.FontStyle]::Regular)

  $graphics.DrawString($Title, $fontTitle, $green, 82, 70)
  $graphics.DrawString($Subtitle, $fontSubtitle, $muted, 86, 136)

  $y = 250
  foreach ($row in $Rows) {
    if ($row.StartsWith("#")) {
      $text = $row.Substring(1)
      $graphics.FillRectangle($soft, 78, $y - 10, $width - 156, 64)
      $graphics.DrawString($text, $fontBodyBold, $ink, 100, $y)
      $y += 86
    } else {
      $graphics.DrawString($row, $fontBody, $ink, 105, $y)
      $graphics.DrawLine($linePen, 98, $y + 54, $width - 98, $y + 54)
      $y += 78
    }
  }

  $graphics.FillRectangle($soft, 78, $height - 210, $width - 156, 110)
  $graphics.DrawString($Footer, $fontFooter, $muted, 100, $height - 182)

  $path = Join-Path $outDir $FileName
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $graphics.Dispose()
  $bitmap.Dispose()
}

New-DocumentImage `
  -FileName "01-appointment-sms.png" `
  -Title "北京和安医院 预约短信截图" `
  -Subtitle "测试用途仿真材料，非真实患者信息" `
  -Rows @(
    "#预约信息",
    "姓名：王秀兰    年龄：68岁",
    "预约科室：内科门诊",
    "预约时间：2026年6月3日 09:30",
    "医院地址：门诊楼 1F 大厅",
    "#系统提示",
    "请先到 1F 挂号窗口完成取号",
    "需携带：身份证、医保卡、预约短信",
    "取号后按挂号单提示前往分诊台"
  ) `
  -Footer "识别重点：科室、时间、材料、下一步去 1F 挂号窗口"

New-DocumentImage `
  -FileName "02-registration-slip.png" `
  -Title "北京和安医院 挂号单" `
  -Subtitle "门诊挂号凭条" `
  -Rows @(
    "#患者与科室",
    "姓名：王秀兰    性别：女    年龄：68岁",
    "科室：内科    医生：李明医生",
    "就诊位置：3F 西侧候诊区",
    "#分诊信息",
    "请先到 3F 西侧分诊台报到",
    "排队号：A128",
    "携带材料：挂号单、医保卡、病历本"
  ) `
  -Footer "识别重点：分诊台、3F 西侧、排队号 A128"

New-DocumentImage `
  -FileName "03-doctor-order-blood-test.png" `
  -Title "北京和安医院 医生医嘱单" `
  -Subtitle "检查与缴费提示" `
  -Rows @(
    "#医嘱项目",
    "检查项目：血常规、肝肾功能、空腹血糖",
    "医生说明：本次抽血无需空腹",
    "检查目的：了解近期身体指标变化",
    "#下一步",
    "请先到自助缴费机 B 完成缴费",
    "缴费后前往 2F 化验室窗口抽血",
    "检查结果约 1 小时后可取"
  ) `
  -Footer "识别重点：先缴费，再去 2F 化验室，结果约 1 小时"

New-DocumentImage `
  -FileName "04-lab-result.png" `
  -Title "北京和安医院 化验结果单" `
  -Subtitle "血液检查报告" `
  -Rows @(
    "#检查结果",
    "血常规：已完成",
    "肝肾功能：已完成",
    "空腹血糖：略高，建议结合医生复诊判断",
    "#复诊提示",
    "请携带本报告返回 318 诊室",
    "交给李明医生查看结果",
    "如头晕、胸闷明显加重，请及时告知医生"
  ) `
  -Footer "识别重点：结果已出，回 318 诊室复诊"

New-DocumentImage `
  -FileName "05-prescription-pickup.png" `
  -Title "北京和安医院 处方取药单" `
  -Subtitle "药房取药与用药说明" `
  -Rows @(
    "#取药信息",
    "药房：2F 药房 5 号窗口",
    "取药号：A128",
    "请核对姓名、药品名称和数量",
    "#药品说明",
    "降压药：每天早上 1 次，每次 1 片",
    "胃药：每天 2 次，早晚饭后服用",
    "不要自行加量或停药",
    "如服药后明显不舒服，请联系医院"
  ) `
  -Footer "识别重点：2F 药房 5 号窗口、药名、服药时间"

Write-Host "Generated test fixture images in $outDir"
