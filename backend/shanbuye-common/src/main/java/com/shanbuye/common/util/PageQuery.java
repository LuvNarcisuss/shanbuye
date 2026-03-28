package com.shanbuye.common.util;

import com.shanbuye.common.constant.CommonConstant;
import lombok.Data;

import java.io.Serializable;

/**
 * 分页查询基类
 */
@Data
public class PageQuery implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页
     */
    private Integer current = CommonConstant.DEFAULT_CURRENT;

    /**
     * 每页条数
     */
    private Integer size = CommonConstant.DEFAULT_SIZE;

    /**
     * 排序字段
     */
    private String sortField;

    /**
     * 排序方式（asc/desc）
     */
    private String sortOrder = "desc";

    /**
     * 获取当前页
     */
    public Integer getCurrent() {
        return current == null || current < 1 ? CommonConstant.DEFAULT_CURRENT : current;
    }

    /**
     * 获取每页条数
     */
    public Integer getSize() {
        return size == null || size < 1 ? CommonConstant.DEFAULT_SIZE : size;
    }
}
