package com.shanbuye.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shanbuye.api.service.AlarmRecordService;
import com.shanbuye.common.result.Result;
import com.shanbuye.model.entity.AlarmRecord;
import com.shanbuye.model.query.AlarmQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 报警记录Controller
 */
@Tag(name = "报警管理", description = "报警相关接口")
@RestController
@RequestMapping("/api/alarm")
@RequiredArgsConstructor
public class AlarmRecordController {

    private final AlarmRecordService alarmRecordService;

    /**
     * 分页查询报警列表
     */
    @Operation(summary = "分页查询报警列表")
    @GetMapping("/page")
    public Result<IPage<AlarmRecord>> pageList(AlarmQuery query) {
        IPage<AlarmRecord> page = alarmRecordService.pageList(query);
        return Result.success(page);
    }

    /**
     * 确认报警
     */
    @Operation(summary = "确认报警")
    @PostMapping("/confirm/{alarmId}")
    public Result<Void> confirmAlarm(
            @PathVariable Long alarmId,
            @RequestParam Long handlerId,
            @RequestParam(required = false) String remark) {
        alarmRecordService.confirmAlarm(alarmId, handlerId, remark);
        return Result.success();
    }

    /**
     * 处理报警
     */
    @Operation(summary = "处理报警")
    @PostMapping("/handle/{alarmId}")
    public Result<Void> handleAlarm(
            @PathVariable Long alarmId,
            @RequestParam Long handlerId,
            @RequestParam Integer status,
            @RequestParam(required = false) String remark) {
        alarmRecordService.handleAlarm(alarmId, handlerId, status, remark);
        return Result.success();
    }

    /**
     * 消音报警
     */
    @Operation(summary = "消音报警")
    @PostMapping("/mute/{alarmId}")
    public Result<Void> muteAlarm(@PathVariable Long alarmId) {
        alarmRecordService.muteAlarm(alarmId);
        return Result.success();
    }

    /**
     * 关闭报警
     */
    @Operation(summary = "关闭报警")
    @PostMapping("/close/{alarmId}")
    public Result<Void> closeAlarm(@PathVariable Long alarmId, @RequestParam Long handlerId) {
        alarmRecordService.closeAlarm(alarmId, handlerId);
        return Result.success();
    }

    /**
     * 获取未处理报警数量
     */
    @Operation(summary = "获取未处理报警数量")
    @GetMapping("/unhandled-count")
    public Result<Long> getUnhandledCount() {
        Long count = alarmRecordService.getUnhandledCount();
        return Result.success(count);
    }
}
