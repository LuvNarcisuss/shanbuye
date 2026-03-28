package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 工位表
 */
@Data
@TableName("station")
public class Station implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 工位ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 产线ID
     */
    private Long lineId;

    /**
     * 工位编号
     */
    private String stationCode;

    /**
     * 工位名称
     */
    private String stationName;

    /**
     * 工位类型（1-相机工位 2-传感器工位 3-剔除工位 4-其他）
     */
    private Integer stationType;

    /**
     * 检测面（1-正面 2-背面 3-侧面 4-顶面 5-底面）
     */
    private Integer detectionFace;

    /**
     * 相机IP
     */
    private String cameraIp;

    /**
     * 相机端口
     */
    private Integer cameraPort;

    /**
     * 传感器IP
     */
    private String sensorIp;

    /**
     * 传感器端口
     */
    private Integer sensorPort;

    /**
     * 传感器类型（1-光电传感器 2-光纤传感器 3-接近传感器）
     */
    private Integer sensorType;

    /**
     * 排序
     */
    private Integer sortOrder;

    /**
     * 状态（0-离线 1-在线 2-故障）
     */
    private Integer status;

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
