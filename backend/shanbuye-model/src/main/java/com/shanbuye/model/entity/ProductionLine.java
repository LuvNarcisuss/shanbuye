package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 生产线表
 */
@Data
@TableName("production_line")
public class ProductionLine implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 产线ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 产线编号
     */
    private String lineCode;

    /**
     * 产线名称
     */
    private String lineName;

    /**
     * 产线类型（1-包装线 2-灌装线 3-其他）
     */
    private Integer lineType;

    /**
     * 所属车间
     */
    private String workshop;

    /**
     * 负责人ID
     */
    private Long managerId;

    /**
     * 状态（0-停机 1-运行 2-故障 3-维护中）
     */
    private Integer status;

    /**
     * 运行速度（件/分钟）
     */
    private Integer speed;

    /**
     * 设计产能（件/天）
     */
    private Integer designCapacity;

    /**
     * 描述
     */
    private String description;

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
