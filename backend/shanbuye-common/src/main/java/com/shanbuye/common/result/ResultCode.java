package com.shanbuye.common.result;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 响应状态码枚举
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    /**
     * 成功
     */
    SUCCESS(200, "操作成功"),

    /**
     * 失败
     */
    ERROR(500, "操作失败"),

    /**
     * 参数错误
     */
    PARAM_ERROR(400, "参数错误"),

    /**
     * 未授权
     */
    UNAUTHORIZED(401, "未授权，请先登录"),

    /**
     * 禁止访问
     */
    FORBIDDEN(403, "禁止访问"),

    /**
     * 资源不存在
     */
    NOT_FOUND(404, "资源不存在"),

    /**
     * 请求方法不支持
     */
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),

    /**
     * 请求超时
     */
    REQUEST_TIMEOUT(408, "请求超时"),

    /**
     * 系统繁忙
     */
    SYSTEM_BUSY(429, "系统繁忙，请稍后再试"),

    /**
     * 服务器内部错误
     */
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),

    /**
     * 服务不可用
     */
    SERVICE_UNAVAILABLE(503, "服务不可用"),

    // ========== 业务相关 ==========

    /**
     * 用户名或密码错误
     */
    USERNAME_OR_PASSWORD_ERROR(1001, "用户名或密码错误"),

    /**
     * 用户已被禁用
     */
    USER_DISABLED(1002, "用户已被禁用"),

    /**
     * Token已过期
     */
    TOKEN_EXPIRED(1003, "Token已过期，请重新登录"),

    /**
     * Token无效
     */
    TOKEN_INVALID(1004, "Token无效"),

    /**
     * 无权限访问
     */
    NO_PERMISSION(1005, "无权限访问该资源"),

    /**
     * 用户已存在
     */
    USER_ALREADY_EXISTS(1006, "用户已存在"),

    /**
     * 用户不存在
     */
    USER_NOT_EXISTS(1007, "用户不存在"),

    /**
     * 角色不存在
     */
    ROLE_NOT_EXISTS(1008, "角色不存在"),

    /**
     * 产线不存在
     */
    PRODUCTION_LINE_NOT_EXISTS(2001, "产线不存在"),

    /**
     * 工位不存在
     */
    STATION_NOT_EXISTS(2002, "工位不存在"),

    /**
     * 规则不存在
     */
    RULE_NOT_EXISTS(2003, "规则不存在"),

    /**
     * 规则已存在
     */
    RULE_ALREADY_EXISTS(2004, "规则已存在"),

    /**
     * 规则校验失败
     */
    RULE_VALIDATION_FAILED(2005, "规则校验失败"),

    /**
     * 模型不存在
     */
    MODEL_NOT_EXISTS(2006, "模型不存在"),

    /**
     * 模型文件不存在
     */
    MODEL_FILE_NOT_EXISTS(2007, "模型文件不存在"),

    /**
     * 模型正在使用中
     */
    MODEL_IN_USE(2008, "模型正在使用中，无法删除"),

    /**
     * 报警不存在
     */
    ALARM_NOT_EXISTS(2009, "报警不存在"),

    /**
     * 报警已处理
     */
    ALARM_ALREADY_PROCESSED(2010, "报警已处理"),

    /**
     * 文件上传失败
     */
    FILE_UPLOAD_FAILED(3001, "文件上传失败"),

    /**
     * 文件格式不支持
     */
    FILE_FORMAT_NOT_SUPPORTED(3002, "文件格式不支持"),

    /**
     * 文件大小超限
     */
    FILE_SIZE_EXCEEDED(3003, "文件大小超限"),

    /**
     * 数据导出失败
     */
    DATA_EXPORT_FAILED(3004, "数据导出失败"),

    /**
     * 数据导入失败
     */
    DATA_IMPORT_FAILED(3005, "数据导入失败"),

    /**
     * WebSocket连接失败
     */
    WEBSOCKET_CONNECTION_FAILED(4001, "WebSocket连接失败"),

    /**
     * 检测服务连接失败
     */
    DETECTION_SERVICE_CONNECTION_FAILED(4002, "检测服务连接失败");

    /**
     * 响应码
     */
    private final Integer code;

    /**
     * 响应消息
     */
    private final String message;
}
