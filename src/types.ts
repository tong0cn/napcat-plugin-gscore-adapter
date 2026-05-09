/**
 * 类型定义文件
 * 定义插件内部使用的接口和类型
 *
 * 注意：OneBot 相关类型（OB11Message, OB11PostSendMsg 等）
 * 以及插件框架类型（NapCatPluginContext, PluginModule 等）
 * 均来自 napcat-types 包，无需在此重复定义。
 */

// ==================== 插件配置 ====================

/**
 * 插件主配置接口
 */
export interface PluginConfig {
    /** 全局开关：是否启用转发功能 */
    gscoreEnable: boolean;
    /** 是否上报/转发机器人自身发送的消息 */
    forwardSelfMessage?: boolean;
    /** 早柚命令前缀，默认为 #早柚，用于群内快捷命令（如 #早柚群启用） */
    commandPrefix: string;
    /** 主人QQ，设置后仅该用户可用群内命令 */
    masterQQ?: string;
    /** GScore 连接地址 */
    gscoreUrl: string;
    /** GScore 连接 Token */
    gscoreToken: string;
    /** 重连间隔（毫秒） */
    reconnectInterval: number;
    /** 最大重连次数 */
    maxReconnectAttempts: number;
    /** 按群的单独配置 */
    groupConfigs: Record<string, GroupConfig>;
    /** 用户黑名单（QQ号列表），拉黑后不转发该用户消息到 GScore */
    blacklist: string[];
    /** 自定义图片外显 */
    customImageSummary?: string;
    /** 主人正常转发开关，开启后禁用群聊后主人仍可正常转发消息 */
    masterForwardWhenDisabled?: boolean;
    /** 无权限时静默（不回复权限提示） */
    silentNoPermission?: boolean;
    /** 彩蛋配置：是否启用自定义合并转发信息 */
    customForwardInfo?: boolean;
    /** 彩蛋配置：自定义合并转发 QQ 号（不填则使用机器人自身） */
    customForwardQQ?: string;
    /** 彩蛋配置：自定义合并转发昵称（不填则使用机器人自身） */
    customForwardName?: string;
    /** 扩展兼容：是否开启私聊 file 消息转发（通过 get_private_file_url 获取链接） */
    privateFileForwardEnabled?: boolean;
    /** 扩展兼容：私聊 JSON 文件转 base64 的大小限制（KB） */
    privateJsonBase64MaxKb?: number;

    // ==================== 在线推送配置 ====================

    /** 全局开关：是否启用在线状态推送 */
    onlinePushEnable?: boolean;
    /** 推送收件人邮箱，多个用英文逗号分隔 */
    onlinePushEmail?: string;
    /** 推送冷却时间（小时），上次成功发送后多久才可再次发送，默认1 */
    onlinePushCooldownHours?: number;
    /** 连续发送失败上限，达到后停止发送，默认5 */
    onlinePushMaxFailCount?: number;

    // ==================== 邮件配置 ====================

    /** 邮件服务提供商: 'smtp' | 'qq' */
    emailProvider?: 'smtp' | 'qq';
    /** SMTP 服务器地址 */
    smtpHost?: string;
    /** SMTP 服务器端口，默认465 */
    smtpPort?: number;
    /** SMTP 登录用户名 */
    smtpUser?: string;
    /** SMTP 登录密码（QQ邮箱为授权码） */
    smtpPassword?: string;
    /** 发件人邮箱，默认等于 smtpUser */
    smtpSender?: string;
    /** 发件人显示名 */
    smtpSenderName?: string;
    /** 是否使用 SSL，默认 true */
    smtpUseSsl?: boolean;
    /** 是否使用 STARTTLS，默认 false */
    smtpStarttls?: boolean;
}

/**
 * 群配置
 */
export interface GroupConfig {
    /** 是否启用此群的功能 */
    enabled?: boolean;
}
