package com.shanbuye.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 工位监控VO
 */
@Data
public class StationMonitorVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 工位ID
     */
    private Long id;

    /**
     * 工位编号
     */
    private String stationCode;

    /**
     * 工位名称
     */
    private String stationName;

    /**
     * 工位类型（1-相机工位 2-传感器工位 3-剔除工位）
     */
    private Integer stationType;

    /**
     * 检测面
     */
    private Integer detectionFace;

    /**
     * 状态（0-离线 1-在线 2-故障）
     */
    private Integer status;

    /**
     * 今日检测数
     */
    private Integer todayDetectionCount;

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
     * 最新检测结果
     */
    private String latestDetectionResult;

    /**
     * 最新检测图像
     */
    private String latestImage;

    /**
     * 最新检测时间
     */
    private String latestDetectionTime;

    /**
     * 最近检测记录
     */
    private List<DetectionRecordVO> recentRecords;
}
