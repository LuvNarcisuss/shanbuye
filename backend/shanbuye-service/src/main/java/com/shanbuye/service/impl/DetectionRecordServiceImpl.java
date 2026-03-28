package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.DetectionRecordService;
import com.shanbuye.model.entity.DetectionRecord;
import com.shanbuye.model.query.DetectionRecordQuery;
import com.shanbuye.model.vo.StatisticsVO;
import com.shanbuye.service.mapper.DetectionRecordMapper;
import org.springframework.stereotype.Service;

/**
 * 检测记录Service实现类
 */
@Service
public class DetectionRecordServiceImpl extends ServiceImpl<DetectionRecordMapper, DetectionRecord> implements DetectionRecordService {

    @Override
    public IPage<DetectionRecord> pageList(DetectionRecordQuery query) {
        Page<DetectionRecord> page = new Page<>(query.getCurrent(), query.getSize());
        return baseMapper.selectPage(page, null);
    }

    @Override
    public void saveRecord(DetectionRecord record) {
        save(record);
    }

    @Override
    public StatisticsVO getStatistics(String startTime, String endTime, Long lineId) {
        return new StatisticsVO();
    }

    @Override
    public String exportRecords(DetectionRecordQuery query) {
        return "";
    }
}
