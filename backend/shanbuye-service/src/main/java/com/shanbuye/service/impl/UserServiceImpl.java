package com.shanbuye.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shanbuye.api.service.UserService;
import com.shanbuye.model.dto.LoginDTO;
import com.shanbuye.model.dto.LoginVO;
import com.shanbuye.model.entity.User;
import com.shanbuye.service.mapper.UserMapper;
import org.springframework.stereotype.Service;

/**
 * 用户Service实现类
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        LoginVO vo = new LoginVO();
        vo.setToken("test-token");
        vo.setUsername(loginDTO.getUsername());
        return vo;
    }

    @Override
    public void logout(String token) {

    }

    @Override
    public User getUserByUsername(String username) {
        return baseMapper.selectOne(null);
    }

    @Override
    public void resetPassword(Long userId, String newPassword) {
        User user = getById(userId);
        if (user != null) {
            user.setPassword(newPassword);
            updateById(user);
        }
    }
}
