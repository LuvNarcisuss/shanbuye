package com.shanbuye;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 山不野智能视觉检测平台启动类
 */
@SpringBootApplication(scanBasePackages = "com.shanbuye")
@MapperScan("com.shanbuye.service.mapper")
public class ShanbuyeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShanbuyeApplication.class, args);
        System.out.println("========================================");
        System.out.println("山不野智能视觉检测平台启动成功！");
        System.out.println("========================================");
    }
}
