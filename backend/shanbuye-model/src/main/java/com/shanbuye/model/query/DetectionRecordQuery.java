package com.shanbuye.model.query;

import com.shanbuye.common.util.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 检测记录查询类
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DetectionRecordQuery extends PageQuery {

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
     * 检测结果
     */
    private Integer detectionResult;

    /**
     * 缺陷类型
     */
    private Integer defectType;

    /**
     * 班次
     */
    private String shift;

    /**
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;
}
