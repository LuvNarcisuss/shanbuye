package com.shanbuye.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shanbuye.api.service.DetectionRecordService;
import com.shanbuye.common.result.Result;
import com.shanbuye.model.entity.DetectionRecord;
import com.shanbuye.model.query.DetectionRecordQuery;
import com.shanbuye.model.vo.StatisticsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 检测记录Controller
 */
@Tag(name = "检测记录管理", description = "检测记录相关接口")
@RestController
@RequestMapping("/api/detection-record")
@RequiredArgsConstructor
public class DetectionRecordController {

    private final DetectionRecordService detectionRecordService;

    /**
     * 分页查询检测记录
     */
    @Operation(summary = "分页查询检测记录")
    @GetMapping("/page")
    public Result<IPage<DetectionRecord>> pageList(DetectionRecordQuery query) {
        IPage<DetectionRecord> page = detectionRecordService.pageList(query);
        return Result.success(page);
    }

    /**
     * 获取统计数据
     */
    @Operation(summary = "获取统计数据")
    @GetMapping("/statistics")
    public Result<StatisticsVO> getStatistics(
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) Long lineId) {
        StatisticsVO statistics = detectionRecordService.getStatistics(startTime, endTime, lineId);
        return Result.success(statistics);
    }

    /**
     * 导出检测记录
     */
    @Operation(summary = "导出检测记录")
    @PostMapping("/export")
    public Result<String> exportRecords(@RequestBody DetectionRecordQuery query) {
        String filePath = detectionRecordService.exportRecords(query);
        return Result.success(filePath);
    }
}
