package com.shanbuye.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shanbuye.api.service.DetectionModelService;
import com.shanbuye.common.result.Result;
import com.shanbuye.model.entity.DetectionModel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 检测模型Controller
 */
@Tag(name = "检测模型管理", description = "检测模型相关接口")
@RestController
@RequestMapping("/api/detection-model")
@RequiredArgsConstructor
public class DetectionModelController {

    private final DetectionModelService detectionModelService;

    /**
     * 分页查询模型列表
     */
    @Operation(summary = "分页查询模型列表")
    @GetMapping("/page")
    public Result<IPage<DetectionModel>> pageList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer modelType,
            @RequestParam(required = false) Integer status) {
        IPage<DetectionModel> page = detectionModelService.pageList(current, size, modelType, status);
        return Result.success(page);
    }

    /**
     * 上传模型
     */
    @Operation(summary = "上传模型")
    @PostMapping
    public Result<Long> uploadModel(@RequestBody DetectionModel model) {
        Long modelId = detectionModelService.uploadModel(model);
        return Result.success(modelId);
    }

    /**
     * 解析模型元信息
     */
    @Operation(summary = "解析模型元信息")
    @PostMapping("/parse/{modelId}")
    public Result<Void> parseModelMeta(@PathVariable Long modelId) {
        detectionModelService.parseModelMeta(modelId);
        return Result.success();
    }

    /**
     * 设为当前使用模型
     */
    @Operation(summary = "设为当前使用模型")
    @PostMapping("/current/{modelId}")
    public Result<Void> setCurrentModel(@PathVariable Long modelId) {
        detectionModelService.setCurrentModel(modelId);
        return Result.success();
    }

    /**
     * 灰度发布
     */
    @Operation(summary = "灰度发布")
    @PostMapping("/gray-publish/{modelId}")
    public Result<Void> grayPublish(
            @PathVariable Long modelId,
            @RequestBody(required = false) List<Long> lineIds,
            @RequestBody(required = false) List<Long> stationIds) {
        detectionModelService.grayPublish(modelId, lineIds, stationIds);
        return Result.success();
    }

    /**
     * 回滚模型
     */
    @Operation(summary = "回滚模型")
    @PostMapping("/rollback/{modelId}")
    public Result<Void> rollbackModel(@PathVariable Long modelId) {
        detectionModelService.rollbackModel(modelId);
        return Result.success();
    }

    /**
     * 删除模型
     */
    @Operation(summary = "删除模型")
    @DeleteMapping("/{modelId}")
    public Result<Void> deleteModel(@PathVariable Long modelId) {
        detectionModelService.deleteModel(modelId);
        return Result.success();
    }

    /**
     * 模型对比
     */
    @Operation(summary = "模型对比")
    @GetMapping("/compare")
    public Result<String> compareModel(@RequestParam Long modelIdA, @RequestParam Long modelIdB) {
        String result = detectionModelService.compareModel(modelIdA, modelIdB);
        return Result.success(result);
    }
}
