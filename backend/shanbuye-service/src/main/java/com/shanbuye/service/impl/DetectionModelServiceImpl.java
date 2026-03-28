package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.DetectionModelService;
import com.shanbuye.model.entity.DetectionModel;
import com.shanbuye.service.mapper.DetectionModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 检测模型Service实现类
 */
@Service
public class DetectionModelServiceImpl extends ServiceImpl<DetectionModelMapper, DetectionModel> implements DetectionModelService {

    @Override
    public IPage<DetectionModel> pageList(Integer current, Integer size, Integer modelType, Integer status) {
        Page<DetectionModel> page = new Page<>(current, size);
        return baseMapper.selectPage(page, null);
    }

    @Override
    public Long uploadModel(DetectionModel model) {
        save(model);
        return model.getId();
    }

    @Override
    public void parseModelMeta(Long modelId) {

    }

    @Override
    public void setCurrentModel(Long modelId) {

    }

    @Override
    public void grayPublish(Long modelId, List<Long> lineIds, List<Long> stationIds) {

    }

    @Override
    public void rollbackModel(Long modelId) {

    }

    @Override
    public void deleteModel(Long modelId) {
        removeById(modelId);
    }

    @Override
    public String compareModel(Long modelIdA, Long modelIdB) {
        return "";
    }
}
