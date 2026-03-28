package com.shanbuye.model.query;

import com.shanbuye.common.util.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 产线查询类
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ProductionLineQuery extends PageQuery {

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
     * 状态
     */
    private Integer status;

    /**
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;
}
