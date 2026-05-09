/**
 * 邮件 HTML 模板模块
 * 构建在线状态推送邮件的 HTML 正文和主题
 */

/**
 * 构建在线状态推送邮件
 * @returns [subject, html]
 */
export function buildOnlinePushHtml(time: string): [string, string] {
  const subject = '🦊 GScore 服务已上线';

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:'Segoe UI','Microsoft YaHei',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:24px auto;background:linear-gradient(135deg,#16213e 0%,#0f3460 100%);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
  <tr>
    <td style="padding:32px 28px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🦊</div>
      <h1 style="margin:0 0 8px;color:#e94560;font-size:22px;font-weight:700;">GScore 服务已上线</h1>
      <p style="margin:0 0 20px;color:#a8a8b8;font-size:14px;">早柚核心适配器检测到服务恢复在线</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border-radius:12px;">
        <tr>
          <td style="padding:16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#a8a8b8;font-size:13px;padding:4px 0;">状态</td>
                <td style="color:#4ecca3;font-size:13px;text-align:right;padding:4px 0;font-weight:600;">✅ 在线</td>
              </tr>
              <tr>
                <td style="color:#a8a8b8;font-size:13px;padding:4px 0;">检测时间</td>
                <td style="color:#e8e8e8;font-size:13px;text-align:right;padding:4px 0;">${time}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;color:#666;font-size:11px;">此邮件由 GScore 适配器自动发送</p>
    </td>
  </tr>
</table>
</body>
</html>`;

  return [subject, html];
}
