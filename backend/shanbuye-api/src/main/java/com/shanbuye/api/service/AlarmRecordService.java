package com.shanbuye.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.entity.AlarmRecord;
import com.shanbuye.model.query.AlarmQuery;

/**
 * 报警记录Service接口
 */
public interface AlarmRecordService extends IService<AlarmRecord> {

    /**
     * 分页查询报警列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    IPage<AlarmRecord> pageList(AlarmQuery query);

    /**
     * 创建报警
     *
     * @param alarm 报警信息
     */
    void createAlarm(AlarmRecord alarm);

    /**
     * 确认报警
     *
     * @param alarmId 报警ID
     * @param handlerId 处理人ID
     * @param remark 处理意见
     */
    void confirmAlarm(Long alarmId, Long handlerId, String remark);

    /**
     * 处理报警
     *
     * @param alarmId 报警ID
     * @param handlerId 处理人ID
     * @param status 处理状态
     * @param remark 处理意见
     */
    void handleAlarm(Long alarmId, Long handlerId, Integer status, String remark);

    /**
     * 消音报警
     *
     * @param alarmId 报警ID
     */
    void muteAlarm(Long alarmId);

    /**
     * 关闭报警
     *
     * @param alarmId 报警ID
     * @param handlerId 处理人ID
     */
    void closeAlarm(Long alarmId, Long handlerId);

    /**
     * 获取未处理报警数量
     *
     * @return 数量
     */
    Long getUnhandledCount();
}
