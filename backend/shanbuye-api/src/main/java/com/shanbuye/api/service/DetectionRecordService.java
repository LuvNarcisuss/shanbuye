package com.shanbuye.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.entity.DetectionRecord;
import com.shanbuye.model.query.DetectionRecordQuery;
import com.shanbuye.model.vo.StatisticsVO;

/**
 * 检测记录Service接口
 */
public interface DetectionRecordService extends IService<DetectionRecord> {

    /**
     * 分页查询检测记录
     *
     * @param query 查询条件
     * @return 分页结果
     */
    IPage<DetectionRecord> pageList(DetectionRecordQuery query);

    /**
     * 保存检测记录
     *
     * @param record 检测记录
     */
    void saveRecord(DetectionRecord record);

    /**
     * 获取统计数据
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param lineId 产线ID
     * @return 统计数据
     */
    StatisticsVO getStatistics(String startTime, String endTime, Long lineId);

    /**
     * 导出检测记录
     *
     * @param query 查询条件
     * @return 文件路径
     */
    String exportRecords(DetectionRecordQuery query);
}
