package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 检测模型表
 */
@Data
@TableName("detection_model")
public class DetectionModel implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 模型ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 模型名称
     */
    private String modelName;

    /**
     * 模型版本
     */
    private String modelVersion;

    /**
     * 模型类型（1-YOLO 2-ResNet 3-其他）
     */
    private Integer modelType;

    /**
     * 模型格式（onnx/pt/engine/trt/pb）
     */
    private String modelFormat;

    /**
     * 模型文件路径
     */
    private String filePath;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * 文件哈希值
     */
    private String fileHash;

    /**
     * 输入尺寸
     */
    private String inputSize;

    /**
     * 类别数量
     */
    private Integer classCount;

    /**
     * 类别名称（JSON格式）
     */
    private String classNames;

    /**
     * 训练集信息
     */
    private String trainSetInfo;

    /**
     * mAP指标
     */
    private BigDecimal mapValue;

    /**
     * 推理速度（FPS）
     */
    private BigDecimal fps;

    /**
     * 适用产线ID列表（逗号分隔）
     */
    private String applicableLines;

    /**
     * 适用工位ID列表（逗号分隔）
     */
    private String applicableStations;

    /**
     * 状态（0-未启用 1-生产中 2-灰度测试中 3-已归档）
     */
    private Integer status;

    /**
     * 是否当前使用
     */
    private Boolean isCurrent;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建人ID
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createBy;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新人ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateBy;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除（0-未删除 1-已删除）
     */
    @TableLogic
    private Integer deleted;
}
