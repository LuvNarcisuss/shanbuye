package com.shanbuye.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 生产线监控VO
 */
@Data
public class ProductionLineMonitorVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 产线ID
     */
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
     * 产线类型
     */
    private Integer lineType;

    /**
     * 所属车间
     */
    private String workshop;

    /**
     * 状态（0-停机 1-运行 2-故障 3-维护中）
     */
    private Integer status;

    /**
     * 运行速度（件/分钟）
     */
    private Integer speed;

    /**
     * 今日产量
     */
    private Integer todayOutput;

    /**
     * 今日合格数
     */
    private Integer todayQualifiedCount;

    /**
     * 今日不合格数
     */
    private Integer todayUnqualifiedCount;

    /**
     * 不合格率
     */
    private BigDecimal unqualifiedRate;

    /**
     * 在线设备数
     */
    private Integer onlineDeviceCount;

    /**
     * 总设备数
     */
    private Integer totalDeviceCount;

    /**
     * 未处理报警数
     */
    private Integer unhandledAlarmCount;

    /**
     * 最后更新时间
     */
    private String lastUpdateTime;

    /**
     * 工位列表
     */
    private List<StationMonitorVO> stations;
}
