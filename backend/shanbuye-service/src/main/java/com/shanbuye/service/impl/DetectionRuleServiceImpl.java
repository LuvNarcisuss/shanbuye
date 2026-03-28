package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.DetectionRuleService;
import com.shanbuye.model.entity.DetectionRule;
import com.shanbuye.model.query.DetectionRuleQuery;
import com.shanbuye.service.mapper.DetectionRuleMapper;
import org.springframework.stereotype.Service;

/**
 * 检测规则Service实现类
 */
@Service
public class DetectionRuleServiceImpl extends ServiceImpl<DetectionRuleMapper, DetectionRule> implements DetectionRuleService {

    @Override
    public IPage<DetectionRule> pageList(DetectionRuleQuery query) {
        Page<DetectionRule> page = new Page<>(query.getCurrent(), query.getSize());
        return baseMapper.selectPage(page, null);
    }

    @Override
    public void addRule(DetectionRule rule) {
        save(rule);
    }

    @Override
    public void updateRule(DetectionRule rule) {
        updateById(rule);
    }

    @Override
    public void deleteRule(Long ruleId) {
        removeById(ruleId);
    }

    @Override
    public Long copyRule(Long ruleId) {
        DetectionRule rule = getById(ruleId);
        if (rule != null) {
            DetectionRule newRule = new DetectionRule();
            newRule.setRuleName(rule.getRuleName() + "_copy");
            newRule.setConditionJson(rule.getConditionJson());
            newRule.setStatus(rule.getStatus());
            newRule.setLineId(rule.getLineId());
            newRule.setStationId(rule.getStationId());
            save(newRule);
            return newRule.getId();
        }
        return null;
    }

    @Override
    public void updateStatus(Long ruleId, Integer status) {
        DetectionRule rule = getById(ruleId);
        if (rule != null) {
            rule.setStatus(status);
            updateById(rule);
        }
    }

    @Override
    public void publishRule(Long ruleId) {

    }

    @Override
    public boolean validateRule(DetectionRule rule) {
        return true;
    }

    @Override
    public void rollbackRule(Long ruleId, Integer targetVersion) {

    }
}
