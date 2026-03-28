package com.shanbuye.service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shanbuye.model.entity.Permission;
import org.apache.ibatis.annotations.Mapper;

/**
 * 权限Mapper
 */
@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {
}
