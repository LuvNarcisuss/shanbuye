package com.shanbuye.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 检测记录VO
 */
@Data
public class DetectionRecordVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 记录ID
     */
    private Long id;

    /**
     * 产品编号
     */
    private String productCode;

    /**
     * 检测结果（0-OK 1-NG）
     */
    private Integer detectionResult;

    /**
     * 缺陷类型
     */
    private Integer defectType;

    /**
     * 缺陷描述
     */
    private String defectDescription;

    /**
     * 置信度
     */
    private BigDecimal confidence;

    /**
     * 检测框坐标
     */
    private String boundingBox;

    /**
     * 检测图像路径
     */
    private String imagePath;

    /**
     * 检测时间
     */
    private String detectionTime;

    /**
     * 分拣结果
     */
    private Integer sortingResult;
}
