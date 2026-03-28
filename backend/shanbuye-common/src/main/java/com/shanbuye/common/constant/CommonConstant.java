package com.shanbuye.common.constant;

/**
 * 通用常量
 */
public class CommonConstant {

    /**
     * UTF-8编码
     */
    public static final String UTF8 = "UTF-8";

    /**
     * 成功标记
     */
    public static final Integer SUCCESS = 200;

    /**
     * 失败标记
     */
    public static final Integer ERROR = 500;

    /**
     * 默认当前页
     */
    public static final Integer DEFAULT_CURRENT = 1;

    /**
     * 默认每页条数
     */
    public static final Integer DEFAULT_SIZE = 10;

    /**
     * 超级管理员ID
     */
    public static final Long SUPER_ADMIN_ID = 1L;

    /**
     * 默认密码
     */
    public static final String DEFAULT_PASSWORD = "123456";

    /**
     * JWT Token前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * JWT Token Header
     */
    public static final String TOKEN_HEADER = "Authorization";

    /**
     * Redis缓存前缀
     */
    public static final String REDIS_PREFIX = "shanbuye:";

    /**
     * 用户Token缓存前缀
     */
    public static final String USER_TOKEN_PREFIX = REDIS_PREFIX + "user:token:";

    /**
     * 用户权限缓存前缀
     */
    public static final String USER_PERMISSION_PREFIX = REDIS_PREFIX + "user:permission:";

    /**
     * 产线配置缓存前缀
     */
    public static final String LINE_CONFIG_PREFIX = REDIS_PREFIX + "line:config:";

    /**
     * 规则配置缓存前缀
     */
    public static final String RULE_CONFIG_PREFIX = REDIS_PREFIX + "rule:config:";

    /**
     * WebSocket消息类型
     */
    public static final String WS_MSG_TYPE_STATUS = "status";
    public static final String WS_MSG_TYPE_ALARM = "alarm";
    public static final String WS_MSG_TYPE_DETECTION = "detection";
    public static final String WS_MSG_TYPE_STATISTICS = "statistics";

    /**
     * 文件上传路径
     */
    public static final String UPLOAD_PATH = "/upload/";
    public static final String MODEL_UPLOAD_PATH = "/upload/models/";
    public static final String IMAGE_UPLOAD_PATH = "/upload/images/";
    public static final String REPORT_EXPORT_PATH = "/export/reports/";

    /**
     * 支持的图片格式
     */
    public static final String[] IMAGE_FORMATS = {"jpg", "jpeg", "png", "bmp", "gif"};

    /**
     * 支持的模型格式
     */
    public static final String[] MODEL_FORMATS = {"onnx", "pt", "pth", "engine", "trt", "pb"};

    /**
     * 支持的Excel格式
     */
    public static final String[] EXCEL_FORMATS = {"xls", "xlsx"};
}
