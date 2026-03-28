package com.shanbuye.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报警记录表
 */
@Data
@TableName("alarm_record")
public class AlarmRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报警ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 报警编号
     */
    private String alarmCode;

    /**
     * 产线ID
     */
    private Long lineId;

    /**
     * 工位ID
     */
    private Long stationId;

    /**
     * 报警类型（1-通信故障 2-设备故障 3-检测异常 4-系统异常）
     */
    private Integer alarmType;

    /**
     * 报警级别（1-提示 2-警告 3-严重 4-紧急）
     */
    private Integer alarmLevel;

    /**
     * 报警标题
     */
    private String alarmTitle;

    /**
     * 报警内容
     */
    private String alarmContent;

    /**
     * 报警时间
     */
    private LocalDateTime alarmTime;

    /**
     * 处理状态（0-未处理 1-已确认 2-处理中 3-已解决）
     */
    private Integer processStatus;

    /**
     * 处理人ID
     */
    private Long handlerId;

    /**
     * 处理人姓名
     */
    private String handlerName;

    /**
     * 处理时间
     */
    private LocalDateTime handleTime;

    /**
     * 处理意见
     */
    private String handleRemark;

    /**
     * 是否已消音
     */
    private Boolean isMuted;

    /**
     * 消音时间
     */
    private LocalDateTime muteTime;

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
