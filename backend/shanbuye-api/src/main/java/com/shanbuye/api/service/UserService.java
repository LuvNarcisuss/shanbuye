package com.shanbuye.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.shanbuye.model.dto.LoginDTO;
import com.shanbuye.model.dto.LoginVO;
import com.shanbuye.model.entity.User;

/**
 * 用户Service接口
 */
public interface UserService extends IService<User> {

    /**
     * 用户登录
     *
     * @param loginDTO 登录请求
     * @return 登录响应
     */
    LoginVO login(LoginDTO loginDTO);

    /**
     * 用户退出
     *
     * @param token Token
     */
    void logout(String token);

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    User getUserByUsername(String username);

    /**
     * 重置密码
     *
     * @param userId 用户ID
     * @param newPassword 新密码
     */
    void resetPassword(Long userId, String newPassword);
}
