package com.shanbuye.service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shanbuye.model.entity.AlarmRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 报警记录Mapper
 */
@Mapper
public interface AlarmRecordMapper extends BaseMapper<AlarmRecord> {
}
