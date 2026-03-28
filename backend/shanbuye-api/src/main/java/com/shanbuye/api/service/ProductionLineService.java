package com.shanbuye.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.entity.ProductionLine;
import com.shanbuye.model.query.ProductionLineQuery;
import com.shanbuye.model.vo.ProductionLineMonitorVO;

import java.util.List;

/**
 * 产线Service接口
 */
public interface ProductionLineService extends IService<ProductionLine> {

    /**
     * 分页查询产线列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    IPage<ProductionLine> pageList(ProductionLineQuery query);

    /**
     * 获取产线监控数据
     *
     * @param lineId 产线ID
     * @return 监控数据
     */
    ProductionLineMonitorVO getMonitorData(Long lineId);

    /**
     * 获取所有产线监控数据
     *
     * @return 监控数据列表
     */
    List<ProductionLineMonitorVO> getAllMonitorData();

    /**
     * 更新产线状态
     *
     * @param lineId 产线ID
     * @param status 状态
     */
    void updateStatus(Long lineId, Integer status);
}
