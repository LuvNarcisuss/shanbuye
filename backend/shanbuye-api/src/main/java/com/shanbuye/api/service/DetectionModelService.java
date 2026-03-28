package com.shanbuye.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.entity.DetectionModel;

import java.util.List;

/**
 * 检测模型Service接口
 */
public interface DetectionModelService extends IService<DetectionModel> {

    /**
     * 分页查询模型列表
     *
     * @param current 当前页
     * @param size 每页条数
     * @param modelType 模型类型
     * @param status 状态
     * @return 分页结果
     */
    IPage<DetectionModel> pageList(Integer current, Integer size, Integer modelType, Integer status);

    /**
     * 上传模型
     *
     * @param model 模型信息
     * @return 模型ID
     */
    Long uploadModel(DetectionModel model);

    /**
     * 解析模型元信息
     *
     * @param modelId 模型ID
     */
    void parseModelMeta(Long modelId);

    /**
     * 设为当前使用模型
     *
     * @param modelId 模型ID
     */
    void setCurrentModel(Long modelId);

    /**
     * 灰度发布
     *
     * @param modelId 模型ID
     * @param lineIds 产线ID列表
     * @param stationIds 工位ID列表
     */
    void grayPublish(Long modelId, List<Long> lineIds, List<Long> stationIds);

    /**
     * 回滚模型
     *
     * @param modelId 模型ID
     */
    void rollbackModel(Long modelId);

    /**
     * 删除模型
     *
     * @param modelId 模型ID
     */
    void deleteModel(Long modelId);

    /**
     * 模型对比
     *
     * @param modelIdA 模型A ID
     * @param modelIdB 模型B ID
     * @return 对比结果
     */
    String compareModel(Long modelIdA, Long modelIdB);
}
