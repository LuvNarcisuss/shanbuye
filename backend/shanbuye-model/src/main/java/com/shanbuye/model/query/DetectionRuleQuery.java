package com.shanbuye.model.query;

import com.shanbuye.common.util.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 检测规则查询类
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DetectionRuleQuery extends PageQuery {

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
     * 缺陷类型
     */
    private Integer defectType;

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
