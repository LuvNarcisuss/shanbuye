package com.shanbuye.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 统计数据VO
 */
@Data
public class StatisticsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 总产量
     */
    private Integer totalOutput;

    /**
     * 合格数
     */
    private Integer qualifiedCount;

    /**
     * 不合格数
     */
    private Integer unqualifiedCount;

    /**
     * 合格率
     */
    private BigDecimal qualifiedRate;

    /**
     * 不合格率
     */
    private BigDecimal unqualifiedRate;

    /**
     * 在线产线数
     */
    private Integer onlineLineCount;

    /**
     * 总产线数
     */
    private Integer totalLineCount;

    /**
     * 未处理报警数
     */
    private Integer unhandledAlarmCount;

    /**
     * 产线产量分布
     */
    private List<LineOutputVO> lineOutputList;

    /**
     * 缺陷类型分布
     */
    private List<DefectDistributionVO> defectDistribution;

    /**
     * 不合格率趋势
     */
    private List<TrendVO> unqualifiedRateTrend;

    /**
     * 产量趋势
     */
    private List<TrendVO> outputTrend;

    /**
     * 产线产量VO
     */
    @Data
    public static class LineOutputVO implements Serializable {
        private Long lineId;
        private String lineName;
        private Integer output;
        private Integer qualifiedCount;
        private Integer unqualifiedCount;
        private BigDecimal unqualifiedRate;
    }

    /**
     * 缺陷分布VO
     */
    @Data
    public static class DefectDistributionVO implements Serializable {
        private Integer defectType;
        private String defectTypeName;
        private Integer count;
        private BigDecimal rate;
    }

    /**
     * 趋势VO
     */
    @Data
    public static class TrendVO implements Serializable {
        private String time;
        private Integer value;
    }
}
