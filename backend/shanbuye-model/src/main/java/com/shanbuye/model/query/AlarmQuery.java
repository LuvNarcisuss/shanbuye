package com.shanbuye.model.query;

import com.shanbuye.common.util.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 报警查询类
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AlarmQuery extends PageQuery {

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
     * 报警类型
     */
    private Integer alarmType;

    /**
     * 报警级别
     */
    private Integer alarmLevel;

    /**
     * 处理状态
     */
    private Integer processStatus;

    /**
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;
}
