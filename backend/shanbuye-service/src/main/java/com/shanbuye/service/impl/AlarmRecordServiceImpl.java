package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.AlarmRecordService;
import com.shanbuye.model.entity.AlarmRecord;
import com.shanbuye.model.query.AlarmQuery;
import com.shanbuye.service.mapper.AlarmRecordMapper;
import org.springframework.stereotype.Service;

/**
 * 报警记录Service实现类
 */
@Service
public class AlarmRecordServiceImpl extends ServiceImpl<AlarmRecordMapper, AlarmRecord> implements AlarmRecordService {

    @Override
    public IPage<AlarmRecord> pageList(AlarmQuery query) {
        Page<AlarmRecord> page = new Page<>(query.getCurrent(), query.getSize());
        return baseMapper.selectPage(page, null);
    }

    @Override
    public void createAlarm(AlarmRecord alarm) {
        save(alarm);
    }

    @Override
    public void confirmAlarm(Long alarmId, Long handlerId, String remark) {
        AlarmRecord alarm = getById(alarmId);
        if (alarm != null) {
            alarm.setHandlerId(handlerId);
            alarm.setHandleRemark(remark);
            alarm.setProcessStatus(1);
            updateById(alarm);
        }
    }

    @Override
    public void handleAlarm(Long alarmId, Long handlerId, Integer status, String remark) {
        AlarmRecord alarm = getById(alarmId);
        if (alarm != null) {
            alarm.setHandlerId(handlerId);
            alarm.setProcessStatus(status);
            alarm.setHandleRemark(remark);
            updateById(alarm);
        }
    }

    @Override
    public void muteAlarm(Long alarmId) {
        AlarmRecord alarm = getById(alarmId);
        if (alarm != null) {
            alarm.setIsMuted(Boolean.TRUE);
            updateById(alarm);
        }
    }

    @Override
    public void closeAlarm(Long alarmId, Long handlerId) {
        AlarmRecord alarm = getById(alarmId);
        if (alarm != null) {
            alarm.setHandlerId(handlerId);
            alarm.setProcessStatus(3);
            updateById(alarm);
        }
    }

    @Override
    public Long getUnhandledCount() {
        return baseMapper.selectCount(null);
    }
}
