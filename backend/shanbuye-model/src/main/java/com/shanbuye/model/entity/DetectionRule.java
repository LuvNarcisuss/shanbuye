package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 检测规则表
 */
@Data
@TableName("detection_rule")
public class DetectionRule implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 规则ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 规则编号
     */
    private String ruleCode;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 产线ID
     */
    private Long lineId;

    /**
     * 工位ID
     */
    private Long stationId;

    /**
     * 产品类型ID
     */
    private Long productTypeId;

    /**
     * 缺陷类型（1-异物 2-漏装 3-封口不良 4-其他）
     */
    private Integer defectType;

    /**
     * 检测方法（1-YOLO检测 2-传统图像处理 3-混合检测）
     */
    private Integer detectionMethod;

    /**
     * 置信度阈值
     */
    private BigDecimal confidenceThreshold;

    /**
     * 判定条件（JSON格式）
     */
    private String conditionJson;

    /**
     * 分拣策略（1-自动剔除 2-人工复检 3-警告继续）
     */
    private Integer sortingStrategy;

    /**
     * 模型ID
     */
    private Long modelId;

    /**
     * 优先级
     */
    private Integer priority;

    /**
     * 状态（0-停用 1-启用 2-已发布）
     */
    private Integer status;

    /**
     * 版本号
     */
    private Integer version;

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
