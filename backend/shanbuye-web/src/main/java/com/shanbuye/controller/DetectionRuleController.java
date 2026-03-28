package com.shanbuye.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.shanbuye.api.service.DetectionRuleService;
import com.shanbuye.common.result.Result;
import com.shanbuye.model.entity.DetectionRule;
import com.shanbuye.model.query.DetectionRuleQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 检测规则Controller
 */
@Tag(name = "检测规则管理", description = "检测规则相关接口")
@RestController
@RequestMapping("/api/detection-rule")
@RequiredArgsConstructor
public class DetectionRuleController {

    private final DetectionRuleService detectionRuleService;

    /**
     * 分页查询规则列表
     */
    @Operation(summary = "分页查询规则列表")
    @GetMapping("/page")
    public Result<IPage<DetectionRule>> pageList(DetectionRuleQuery query) {
        IPage<DetectionRule> page = detectionRuleService.pageList(query);
        return Result.success(page);
    }

    /**
     * 新增规则
     */
    @Operation(summary = "新增规则")
    @PostMapping
    public Result<Void> addRule(@RequestBody DetectionRule rule) {
        detectionRuleService.addRule(rule);
        return Result.success();
    }

    /**
     * 编辑规则
     */
    @Operation(summary = "编辑规则")
    @PutMapping
    public Result<Void> updateRule(@RequestBody DetectionRule rule) {
        detectionRuleService.updateRule(rule);
        return Result.success();
    }

    /**
     * 删除规则
     */
    @Operation(summary = "删除规则")
    @DeleteMapping("/{ruleId}")
    public Result<Void> deleteRule(@PathVariable Long ruleId) {
        detectionRuleService.deleteRule(ruleId);
        return Result.success();
    }

    /**
     * 复制规则
     */
    @Operation(summary = "复制规则")
    @PostMapping("/copy/{ruleId}")
    public Result<Long> copyRule(@PathVariable Long ruleId) {
        Long newRuleId = detectionRuleService.copyRule(ruleId);
        return Result.success(newRuleId);
    }

    /**
     * 启用/停用规则
     */
    @Operation(summary = "启用/停用规则")
    @PutMapping("/status/{ruleId}")
    public Result<Void> updateStatus(@PathVariable Long ruleId, @RequestParam Integer status) {
        detectionRuleService.updateStatus(ruleId, status);
        return Result.success();
    }

    /**
     * 发布规则
     */
    @Operation(summary = "发布规则")
    @PostMapping("/publish/{ruleId}")
    public Result<Void> publishRule(@PathVariable Long ruleId) {
        detectionRuleService.publishRule(ruleId);
        return Result.success();
    }

    /**
     * 规则校验
     */
    @Operation(summary = "规则校验")
    @PostMapping("/validate")
    public Result<Boolean> validateRule(@RequestBody DetectionRule rule) {
        boolean valid = detectionRuleService.validateRule(rule);
        return Result.success(valid);
    }

    /**
     * 规则回滚
     */
    @Operation(summary = "规则回滚")
    @PostMapping("/rollback/{ruleId}")
    public Result<Void> rollbackRule(@PathVariable Long ruleId, @RequestParam Integer targetVersion) {
        detectionRuleService.rollbackRule(ruleId, targetVersion);
        return Result.success();
    }
}
