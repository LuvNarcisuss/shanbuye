package com.shanbuye.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shanbuye.api.service.ProductionLineService;
import com.shanbuye.common.result.Result;
import com.shanbuye.model.entity.ProductionLine;
import com.shanbuye.model.query.ProductionLineQuery;
import com.shanbuye.model.vo.ProductionLineMonitorVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 生产线Controller
 */
@Tag(name = "生产线管理", description = "生产线相关接口")
@RestController
@RequestMapping("/api/production-line")
@RequiredArgsConstructor
public class ProductionLineController {

    private final ProductionLineService productionLineService;

    /**
     * 分页查询产线列表
     */
    @Operation(summary = "分页查询产线列表")
    @GetMapping("/page")
    public Result<IPage<ProductionLine>> pageList(ProductionLineQuery query) {
        IPage<ProductionLine> page = productionLineService.pageList(query);
        return Result.success(page);
    }

    /**
     * 获取产线监控数据
     */
    @Operation(summary = "获取产线监控数据")
    @GetMapping("/monitor/{lineId}")
    public Result<ProductionLineMonitorVO> getMonitorData(@PathVariable Long lineId) {
        ProductionLineMonitorVO monitorData = productionLineService.getMonitorData(lineId);
        return Result.success(monitorData);
    }

    /**
     * 获取所有产线监控数据
     */
    @Operation(summary = "获取所有产线监控数据")
    @GetMapping("/monitor/all")
    public Result<List<ProductionLineMonitorVO>> getAllMonitorData() {
        List<ProductionLineMonitorVO> monitorDataList = productionLineService.getAllMonitorData();
        return Result.success(monitorDataList);
    }

    /**
     * 更新产线状态
     */
    @Operation(summary = "更新产线状态")
    @PutMapping("/status/{lineId}")
    public Result<Void> updateStatus(@PathVariable Long lineId, @RequestParam Integer status) {
        productionLineService.updateStatus(lineId, status);
        return Result.success();
    }
}
