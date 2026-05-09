/**
 * 邮件发送模块
 * 支持 QQ 邮箱（授权码）和自定义 SMTP
 * 使用异步队列 + 速率限制（每秒1封）
 */

import nodemailer from 'nodemailer';
import { pluginState } from '../../core/state';
import { buildOnlinePushHtml } from './template';

// ==================== 队列机制 ====================

interface MailTask {
  to: string;
  subject: string;
  html: string;
  future: {
    resolve: (result: [boolean, string]) => void;
    reject: (err: unknown) => void;
  };
}

const _mailQueue: MailTask[] = [];
let _isConsumerRunning = false;

/**
 * 邮件消费者：每秒处理1封（速率限制）
 */
async function _mailConsumer(): Promise<void> {
  _isConsumerRunning = true;
  while (true) {
    const task = _mailQueue.shift();
    if (!task) {
      _isConsumerRunning = false;
      return;
    }
    try {
      const result = await _doSend(task.to, task.subject, task.html);
      task.future.resolve(result);
    } catch (err) {
      task.future.reject(err);
    }
    // 速率限制：每秒1封
    await new Promise<void>((r) => setTimeout(r, 1000));
  }
}

function _enqueue(to: string, subject: string, html: string): Promise<[boolean, string]> {
  return new Promise((resolve, reject) => {
    _mailQueue.push({ to, subject, html, future: { resolve, reject } });
    if (!_isConsumerRunning) {
      _mailConsumer();
    }
  });
}

// ==================== 邮件构建 ====================

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  sender: string;
  senderName: string;
  useSsl: boolean;
  starttls: boolean;
}

function _resolveSmtpConfig(): SmtpConfig | null {
  const cfg = pluginState.config;
  const provider = cfg.emailProvider || 'qq';

  if (provider === 'qq') {
    const user = cfg.smtpUser || '';
    const authCode = cfg.smtpPassword || '';
    if (!user || !authCode) return null;
    return {
      host: 'smtp.qq.com',
      port: cfg.smtpPort || 465,
      user,
      password: authCode,
      sender: cfg.smtpSender || user,
      senderName: cfg.smtpSenderName || '',
      useSsl: cfg.smtpUseSsl !== false,
      starttls: cfg.smtpStarttls === true,
    };
  }

  // 自定义 SMTP
  const host = cfg.smtpHost || '';
  const user = cfg.smtpUser || '';
  const password = cfg.smtpPassword || '';
  if (!host || !user || !password) return null;
  return {
    host,
    port: cfg.smtpPort || 465,
    user,
    password,
    sender: cfg.smtpSender || user,
    senderName: cfg.smtpSenderName || '',
    useSsl: cfg.smtpUseSsl !== false,
    starttls: cfg.smtpStarttls === true,
  };
}

async function _doSend(to: string, subject: string, html: string): Promise<[boolean, string]> {
  const config = _resolveSmtpConfig();
  if (!config) {
    return [false, '邮件配置不完整'];
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.useSsl,
      requireTLS: config.starttls,
      auth: {
        user: config.user,
        pass: config.password,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const from = config.senderName
      ? `"${config.senderName}" <${config.sender}>`
      : config.sender;

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: subject, // 纯文本备用
    });

    transporter.close();
    return [true, 'ok'];
  } catch (err: any) {
    const msg = err?.message || String(err);
    return [false, msg];
  }
}

// ==================== 对外接口 ====================

/**
 * 发送在线状态推送邮件
 * @param toEmail 收件人邮箱
 * @returns [success, message]
 */
export async function sendOnlinePushEmail(toEmail: string): Promise<[boolean, string]> {
  const now = new Date();
  const timeText = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const [subject, html] = buildOnlinePushHtml(timeText);
  return _enqueue(toEmail, subject, html);
}
