package com.shanbuye.model.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 报警VO
 */
@Data
public class AlarmVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报警ID
     */
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
     * 产线名称
     */
    private String lineName;

    /**
     * 工位ID
     */
    private Long stationId;

    /**
     * 工位名称
     */
    private String stationName;

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
    private String alarmTime;

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
    private String handleTime;

    /**
     * 处理意见
     */
    private String handleRemark;

    /**
     * 是否已消音
     */
    private Boolean isMuted;
}
