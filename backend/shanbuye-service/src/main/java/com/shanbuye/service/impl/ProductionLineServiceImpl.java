package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.ProductionLineService;
import com.shanbuye.model.entity.ProductionLine;
import com.shanbuye.model.query.ProductionLineQuery;
import com.shanbuye.model.vo.ProductionLineMonitorVO;
import com.shanbuye.service.mapper.ProductionLineMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 产线Service实现类
 */
@Service
public class ProductionLineServiceImpl extends ServiceImpl<ProductionLineMapper, ProductionLine> implements ProductionLineService {

    @Override
    public IPage<ProductionLine> pageList(ProductionLineQuery query) {
        Page<ProductionLine> page = new Page<>(query.getCurrent(), query.getSize());
        return baseMapper.selectPage(page, null);
    }

    @Override
    public ProductionLineMonitorVO getMonitorData(Long lineId) {
        return new ProductionLineMonitorVO();
    }

    @Override
    public List<ProductionLineMonitorVO> getAllMonitorData() {
        return new ArrayList<>();
    }

    @Override
    public void updateStatus(Long lineId, Integer status) {
        ProductionLine line = getById(lineId);
        if (line != null) {
            line.setStatus(status);
            updateById(line);
        }
    }
}
