package com.shanbuye.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.entity.DetectionRule;
import com.shanbuye.model.query.DetectionRuleQuery;

/**
 * 检测规则Service接口
 */
public interface DetectionRuleService extends IService<DetectionRule> {

    /**
     * 分页查询规则列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    IPage<DetectionRule> pageList(DetectionRuleQuery query);

    /**
     * 新增规则
     *
     * @param rule 规则信息
     */
    void addRule(DetectionRule rule);

    /**
     * 编辑规则
     *
     * @param rule 规则信息
     */
    void updateRule(DetectionRule rule);

    /**
     * 删除规则
     *
     * @param ruleId 规则ID
     */
    void deleteRule(Long ruleId);

    /**
     * 复制规则
     *
     * @param ruleId 规则ID
     * @return 新规则ID
     */
    Long copyRule(Long ruleId);

    /**
     * 启用/停用规则
     *
     * @param ruleId 规则ID
     * @param status 状态
     */
    void updateStatus(Long ruleId, Integer status);

    /**
     * 发布规则
     *
     * @param ruleId 规则ID
     */
    void publishRule(Long ruleId);

    /**
     * 规则校验
     *
     * @param rule 规则信息
     * @return 校验结果
     */
    boolean validateRule(DetectionRule rule);

    /**
     * 规则回滚
     *
     * @param ruleId 规则ID
     * @param targetVersion 目标版本号
     */
    void rollbackRule(Long ruleId, Integer targetVersion);
}
