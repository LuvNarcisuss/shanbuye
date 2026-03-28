package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 检测记录表
 */
@Data
@TableName("detection_record")
public class DetectionRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 记录ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 产品编号
     */
    private String productCode;

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
     * 检测结果（0-OK 1-NG）
     */
    private Integer detectionResult;

    /**
     * 缺陷类型（1-异物 2-漏装 3-封口不良 4-其他）
     */
    private Integer defectType;

    /**
     * 缺陷描述
     */
    private String defectDescription;

    /**
     * 置信度
     */
    private BigDecimal confidence;

    /**
     * 检测框坐标（JSON格式）
     */
    private String boundingBox;

    /**
     * 检测图像路径
     */
    private String imagePath;

    /**
     * 检测时间
     */
    private LocalDateTime detectionTime;

    /**
     * 分拣结果（0-未分拣 1-自动剔除 2-人工复检）
     */
    private Integer sortingResult;

    /**
     * 分拣时间
     */
    private LocalDateTime sortingTime;

    /**
     * 规则ID
     */
    private Long ruleId;

    /**
     * 模型ID
     */
    private Long modelId;

    /**
     * 班次
     */
    private String shift;

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
     * 逻辑删除（0-未删除 1-已删除）
     */
    @TableLogic
    private Integer deleted;
}
