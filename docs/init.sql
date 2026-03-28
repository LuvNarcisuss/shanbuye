-- =============================================
-- 山不野智能视觉检测平台数据库初始化脚本
-- =============================================
-- 创建数据库
CREATE DATABASE IF NOT EXISTS `shanbuye` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `shanbuye`;

-- =============================================
-- 用户权限相关表
-- =============================================

-- 用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `role_id` bigint DEFAULT NULL COMMENT '角色ID',
  `status` tinyint DEFAULT '1' COMMENT '状态（0-禁用 1-启用）',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) NOT NULL COMMENT '角色编码',
  `description` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint DEFAULT '1' COMMENT '状态（0-禁用 1-启用）',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 权限表
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` bigint DEFAULT '0' COMMENT '父权限ID',
  `permission_name` varchar(50) NOT NULL COMMENT '权限名称',
  `permission_code` varchar(100) DEFAULT NULL COMMENT '权限编码',
  `permission_type` tinyint NOT NULL COMMENT '权限类型（1-菜单 2-按钮 3-接口）',
  `path` varchar(200) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(100) DEFAULT NULL COMMENT '图标',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '1' COMMENT '状态（0-禁用 1-启用）',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_permission_type` (`permission_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 角色权限关联表
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `permission_id` bigint NOT NULL COMMENT '权限ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- =============================================
-- 生产管理相关表
-- =============================================

-- 生产线表
DROP TABLE IF EXISTS `production_line`;
CREATE TABLE `production_line` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '产线ID',
  `line_code` varchar(50) NOT NULL COMMENT '产线编号',
  `line_name` varchar(100) NOT NULL COMMENT '产线名称',
  `line_type` tinyint DEFAULT '1' COMMENT '产线类型（1-包装线 2-灌装线 3-其他）',
  `workshop` varchar(100) DEFAULT NULL COMMENT '所属车间',
  `manager_id` bigint DEFAULT NULL COMMENT '负责人ID',
  `status` tinyint DEFAULT '0' COMMENT '状态（0-停机 1-运行 2-故障 3-维护中）',
  `speed` int DEFAULT '0' COMMENT '运行速度（件/分钟）',
  `design_capacity` int DEFAULT '0' COMMENT '设计产能（件/天）',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_line_code` (`line_code`),
  KEY `idx_status` (`status`),
  KEY `idx_workshop` (`workshop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='生产线表';

-- 工位表
DROP TABLE IF EXISTS `station`;
CREATE TABLE `station` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '工位ID',
  `line_id` bigint NOT NULL COMMENT '产线ID',
  `station_code` varchar(50) NOT NULL COMMENT '工位编号',
  `station_name` varchar(100) NOT NULL COMMENT '工位名称',
  `station_type` tinyint DEFAULT '1' COMMENT '工位类型（1-相机工位 2-传感器工位 3-剔除工位 4-其他）',
  `detection_face` tinyint DEFAULT NULL COMMENT '检测面（1-正面 2-背面 3-侧面 4-顶面 5-底面）',
  `camera_ip` varchar(50) DEFAULT NULL COMMENT '相机IP',
  `camera_port` int DEFAULT NULL COMMENT '相机端口',
  `sensor_ip` varchar(50) DEFAULT NULL COMMENT '传感器IP',
  `sensor_port` int DEFAULT NULL COMMENT '传感器端口',
  `sensor_type` tinyint DEFAULT NULL COMMENT '传感器类型（1-光电传感器 2-光纤传感器 3-接近传感器）',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '0' COMMENT '状态（0-离线 1-在线 2-故障）',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_station_code` (`station_code`),
  KEY `idx_line_id` (`line_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工位表';

-- =============================================
-- 检测规则相关表
-- =============================================

-- 检测规则表
DROP TABLE IF EXISTS `detection_rule`;
CREATE TABLE `detection_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `rule_code` varchar(50) NOT NULL COMMENT '规则编号',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `line_id` bigint NOT NULL COMMENT '产线ID',
  `station_id` bigint NOT NULL COMMENT '工位ID',
  `product_type_id` bigint DEFAULT NULL COMMENT '产品类型ID',
  `defect_type` tinyint NOT NULL COMMENT '缺陷类型（1-异物 2-漏装 3-封口不良 4-其他）',
  `detection_method` tinyint DEFAULT '1' COMMENT '检测方法（1-YOLO检测 2-传统图像处理 3-混合检测）',
  `confidence_threshold` decimal(5,4) DEFAULT '0.8000' COMMENT '置信度阈值',
  `condition_json` text COMMENT '判定条件（JSON格式）',
  `sorting_strategy` tinyint DEFAULT '1' COMMENT '分拣策略（1-自动剔除 2-人工复检 3-警告继续）',
  `model_id` bigint DEFAULT NULL COMMENT '模型ID',
  `priority` int DEFAULT '0' COMMENT '优先级',
  `status` tinyint DEFAULT '0' COMMENT '状态（0-停用 1-启用 2-已发布）',
  `version` int DEFAULT '1' COMMENT '版本号',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule_code` (`rule_code`),
  KEY `idx_line_id` (`line_id`),
  KEY `idx_station_id` (`station_id`),
  KEY `idx_defect_type` (`defect_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='检测规则表';

-- 规则版本历史表
DROP TABLE IF EXISTS `detection_rule_history`;
CREATE TABLE `detection_rule_history` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  `rule_id` bigint NOT NULL COMMENT '规则ID',
  `version` int NOT NULL COMMENT '版本号',
  `rule_data` text NOT NULL COMMENT '规则数据（JSON格式）',
  `change_reason` varchar(500) DEFAULT NULL COMMENT '变更原因',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_rule_id` (`rule_id`),
  KEY `idx_version` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='规则版本历史表';

-- =============================================
-- 检测模型相关表
-- =============================================

-- 检测模型表
DROP TABLE IF EXISTS `detection_model`;
CREATE TABLE `detection_model` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '模型ID',
  `model_name` varchar(100) NOT NULL COMMENT '模型名称',
  `model_version` varchar(50) NOT NULL COMMENT '模型版本',
  `model_type` tinyint DEFAULT '1' COMMENT '模型类型（1-YOLO 2-ResNet 3-其他）',
  `model_format` varchar(20) NOT NULL COMMENT '模型格式（onnx/pt/engine/trt/pb）',
  `file_path` varchar(500) NOT NULL COMMENT '模型文件路径',
  `file_size` bigint DEFAULT NULL COMMENT '文件大小（字节）',
  `file_hash` varchar(64) DEFAULT NULL COMMENT '文件哈希值',
  `input_size` varchar(50) DEFAULT NULL COMMENT '输入尺寸',
  `class_count` int DEFAULT NULL COMMENT '类别数量',
  `class_names` text COMMENT '类别名称（JSON格式）',
  `train_set_info` text COMMENT '训练集信息',
  `map_value` decimal(10,6) DEFAULT NULL COMMENT 'mAP指标',
  `fps` decimal(10,2) DEFAULT NULL COMMENT '推理速度（FPS）',
  `applicable_lines` varchar(500) DEFAULT NULL COMMENT '适用产线ID列表（逗号分隔）',
  `applicable_stations` varchar(500) DEFAULT NULL COMMENT '适用工位ID列表（逗号分隔）',
  `status` tinyint DEFAULT '0' COMMENT '状态（0-未启用 1-生产中 2-灰度测试中 3-已归档）',
  `is_current` tinyint DEFAULT '0' COMMENT '是否当前使用（0-否 1-是）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  KEY `idx_model_type` (`model_type`),
  KEY `idx_status` (`status`),
  KEY `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='检测模型表';

-- =============================================
-- 检测记录相关表
-- =============================================

-- 检测记录表
DROP TABLE IF EXISTS `detection_record`;
CREATE TABLE `detection_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `product_code` varchar(100) DEFAULT NULL COMMENT '产品编号',
  `line_id` bigint NOT NULL COMMENT '产线ID',
  `station_id` bigint NOT NULL COMMENT '工位ID',
  `product_type_id` bigint DEFAULT NULL COMMENT '产品类型ID',
  `detection_result` tinyint NOT NULL COMMENT '检测结果（0-OK 1-NG）',
  `defect_type` tinyint DEFAULT NULL COMMENT '缺陷类型（1-异物 2-漏装 3-封口不良 4-其他）',
  `defect_description` varchar(500) DEFAULT NULL COMMENT '缺陷描述',
  `confidence` decimal(5,4) DEFAULT NULL COMMENT '置信度',
  `bounding_box` text COMMENT '检测框坐标（JSON格式）',
  `image_path` varchar(500) DEFAULT NULL COMMENT '检测图像路径',
  `detection_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '检测时间',
  `sorting_result` tinyint DEFAULT '0' COMMENT '分拣结果（0-未分拣 1-自动剔除 2-人工复检）',
  `sorting_time` datetime DEFAULT NULL COMMENT '分拣时间',
  `rule_id` bigint DEFAULT NULL COMMENT '规则ID',
  `model_id` bigint DEFAULT NULL COMMENT '模型ID',
  `shift` varchar(50) DEFAULT NULL COMMENT '班次',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  KEY `idx_product_code` (`product_code`),
  KEY `idx_line_id` (`line_id`),
  KEY `idx_station_id` (`station_id`),
  KEY `idx_detection_result` (`detection_result`),
  KEY `idx_detection_time` (`detection_time`),
  KEY `idx_shift` (`shift`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='检测记录表';

-- =============================================
-- 报警相关表
-- =============================================

-- 报警记录表
DROP TABLE IF EXISTS `alarm_record`;
CREATE TABLE `alarm_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '报警ID',
  `alarm_code` varchar(50) NOT NULL COMMENT '报警编号',
  `line_id` bigint DEFAULT NULL COMMENT '产线ID',
  `station_id` bigint DEFAULT NULL COMMENT '工位ID',
  `alarm_type` tinyint NOT NULL COMMENT '报警类型（1-通信故障 2-设备故障 3-检测异常 4-系统异常）',
  `alarm_level` tinyint NOT NULL COMMENT '报警级别（1-提示 2-警告 3-严重 4-紧急）',
  `alarm_title` varchar(200) NOT NULL COMMENT '报警标题',
  `alarm_content` text COMMENT '报警内容',
  `alarm_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '报警时间',
  `process_status` tinyint DEFAULT '0' COMMENT '处理状态（0-未处理 1-已确认 2-处理中 3-已解决）',
  `handler_id` bigint DEFAULT NULL COMMENT '处理人ID',
  `handler_name` varchar(50) DEFAULT NULL COMMENT '处理人姓名',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  `handle_remark` varchar(500) DEFAULT NULL COMMENT '处理意见',
  `is_muted` tinyint DEFAULT '0' COMMENT '是否已消音（0-否 1-是）',
  `mute_time` datetime DEFAULT NULL COMMENT '消音时间',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_alarm_code` (`alarm_code`),
  KEY `idx_line_id` (`line_id`),
  KEY `idx_station_id` (`station_id`),
  KEY `idx_alarm_type` (`alarm_type`),
  KEY `idx_alarm_level` (`alarm_level`),
  KEY `idx_process_status` (`process_status`),
  KEY `idx_alarm_time` (`alarm_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报警记录表';

-- =============================================
-- 系统管理相关表
-- =============================================

-- 操作日志表
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint DEFAULT NULL COMMENT '操作人ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '操作人姓名',
  `module` varchar(50) DEFAULT NULL COMMENT '操作模块',
  `operation_type` tinyint DEFAULT NULL COMMENT '操作类型（1-查询 2-新增 3-修改 4-删除 5-发布 6-回滚 7-导入 8-导出）',
  `description` varchar(200) DEFAULT NULL COMMENT '操作描述',
  `request_method` varchar(10) DEFAULT NULL COMMENT '请求方法',
  `request_url` varchar(500) DEFAULT NULL COMMENT '请求URL',
  `request_params` text COMMENT '请求参数',
  `response_result` text COMMENT '返回结果',
  `status` tinyint DEFAULT '1' COMMENT '操作状态（0-失败 1-成功）',
  `error_msg` text COMMENT '错误信息',
  `execute_time` bigint DEFAULT NULL COMMENT '执行时间（毫秒）',
  `ip` varchar(50) DEFAULT NULL COMMENT '操作IP',
  `operation_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_operation_time` (`operation_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 系统配置表
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_name` varchar(100) NOT NULL COMMENT '配置名称',
  `config_value` text COMMENT '配置值',
  `config_type` tinyint DEFAULT '1' COMMENT '配置类型（1-字符串 2-数字 3-布尔 4-JSON）',
  `config_group` varchar(50) DEFAULT NULL COMMENT '配置分组（system/production/notification/other）',
  `is_system` tinyint DEFAULT '0' COMMENT '是否系统配置（0-否 1-是）',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `create_by` bigint DEFAULT NULL COMMENT '创建人ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人ID',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '逻辑删除（0-未删除 1-已删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_config_group` (`config_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =============================================
-- 初始化数据
-- =============================================

-- 插入默认角色
INSERT INTO `sys_role` (`role_name`, `role_code`, `description`, `status`) VALUES
('超级管理员', 'ADMIN', '系统超级管理员，拥有所有权限', 1),
('质检主管', 'QUALITY_MANAGER', '质检部门主管，负责质量管理', 1),
('产线操作员', 'LINE_OPERATOR', '产线操作人员，负责日常操作', 1),
('访客', 'GUEST', '访客用户，只读权限', 1);

-- 插入默认用户（密码：123456）
INSERT INTO `sys_user` (`username`, `password`, `real_name`, `phone`, `email`, `role_id`, `status`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', '13800138000', 'admin@shanbuye.com', 1, 1),
('manager', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '质检主管', '13800138001', 'manager@shanbuye.com', 2, 1),
('operator', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '操作员', '13800138002', 'operator@shanbuye.com', 3, 1),
('guest', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '访客', '13800138003', 'guest@shanbuye.com', 4, 1);

-- 插入权限菜单
INSERT INTO `sys_permission` (`parent_id`, `permission_name`, `permission_code`, `permission_type`, `path`, `component`, `icon`, `sort_order`, `status`) VALUES
(0, '首页', 'dashboard', 1, '/dashboard', 'views/dashboard/index', 'dashboard', 1, 1),
(0, '生产线监控', 'monitor', 1, '/monitor', 'views/monitor/index', 'monitor', 2, 1),
(0, '规则配置', 'rule', 1, '/rule', 'views/rule/index', 'rule', 3, 1),
(0, '模型管理', 'model', 1, '/model', 'views/model/index', 'model', 4, 1),
(0, '数据统计', 'statistics', 1, '/statistics', 'views/statistics/index', 'statistics', 5, 1),
(0, '报警中心', 'alarm', 1, '/alarm', 'views/alarm/index', 'alarm', 6, 1),
(0, '系统管理', 'system', 1, '/system', 'Layout', 'system', 7, 1);

-- 插入系统管理子菜单
INSERT INTO `sys_permission` (`parent_id`, `permission_name`, `permission_code`, `permission_type`, `path`, `component`, `icon`, `sort_order`, `status`) VALUES
(7, '用户管理', 'user', 1, '/system/user', 'views/system/user', 'user', 1, 1),
(7, '角色管理', 'role', 1, '/system/role', 'views/system/role', 'role', 2, 1),
(7, '权限管理', 'permission', 1, '/system/permission', 'views/system/permission', 'permission', 3, 1),
(7, '系统配置', 'config', 1, '/system/config', 'views/system/config', 'config', 4, 1),
(7, '操作日志', 'log', 1, '/system/log', 'views/system/log', 'log', 5, 1);

-- 插入系统配置
INSERT INTO `system_config` (`config_key`, `config_name`, `config_value`, `config_type`, `config_group`, `is_system`, `description`) VALUES
('websocket.enabled', 'WebSocket启用', 'true', 3, 'system', 1, '是否启用WebSocket实时推送'),
('websocket.port', 'WebSocket端口', '9092', 2, 'system', 1, 'WebSocket服务端口'),
('alarm.enabled', '报警启用', 'true', 3, 'notification', 1, '是否启用报警功能'),
('alarm.sound.enabled', '报警声音', 'true', 3, 'notification', 0, '是否启用报警声音'),
('image.retention.days', '图片保留天数', '30', 2, 'production', 0, '检测图片保留天数'),
('log.retention.days', '日志保留天数', '90', 2, 'system', 0, '操作日志保留天数');

-- 插入示例产线
INSERT INTO `production_line` (`line_code`, `line_name`, `line_type`, `workshop`, `manager_id`, `status`, `speed`, `design_capacity`, `description`) VALUES
('LINE001', '包装产线A', 1, '一车间', 2, 1, 120, 150000, '高速包装生产线'),
('LINE002', '包装产线B', 1, '一车间', 2, 1, 100, 120000, '标准包装生产线'),
('LINE003', '灌装产线A', 2, '二车间', 2, 1, 80, 100000, '液体灌装生产线');

-- 插入示例工位
INSERT INTO `station` (`line_id`, `station_code`, `station_name`, `station_type`, `detection_face`, `camera_ip`, `camera_port`, `sensor_ip`, `sensor_port`, `sensor_type`, `sort_order`, `status`, `description`) VALUES
(1, 'ST001', '正面相机工位', 1, 1, '192.168.1.101', 8080, '192.168.1.201', 502, 1, 1, 1, '产品正面检测工位'),
(1, 'ST002', '背面相机工位', 1, 2, '192.168.1.102', 8080, '192.168.1.202', 502, 1, 2, 1, '产品背面检测工位'),
(1, 'ST003', '剔除工位', 3, NULL, NULL, NULL, '192.168.1.203', 502, 1, 3, 1, '不合格产品剔除工位'),
(2, 'ST004', '正面相机工位', 1, 1, '192.168.1.103', 8080, '192.168.1.204', 502, 1, 1, 1, '产品正面检测工位'),
(2, 'ST005', '侧面相机工位', 1, 3, '192.168.1.104', 8080, '192.168.1.205', 502, 1, 2, 1, '产品侧面检测工位'),
(2, 'ST006', '剔除工位', 3, NULL, NULL, NULL, '192.168.1.206', 502, 1, 3, 1, '不合格产品剔除工位');

-- 插入示例检测规则
INSERT INTO `detection_rule` (`rule_code`, `rule_name`, `line_id`, `station_id`, `defect_type`, `detection_method`, `confidence_threshold`, `sorting_strategy`, `priority`, `status`, `version`, `remark`) VALUES
('RULE001', '异物检测规则', 1, 1, 1, 1, 0.8000, 1, 1, 2, 1, '检测产品表面异物'),
('RULE002', '漏装检测规则', 1, 1, 2, 1, 0.9000, 1, 2, 2, 1, '检测产品是否漏装'),
('RULE003', '封口不良检测规则', 1, 2, 3, 1, 0.8500, 1, 1, 2, 1, '检测产品封口是否完好'),
('RULE004', '异物检测规则B', 2, 4, 1, 1, 0.8000, 1, 1, 2, 1, '检测产品表面异物');

-- 插入示例检测模型
INSERT INTO `detection_model` (`model_name`, `model_version`, `model_type`, `model_format`, `file_path`, `file_size`, `input_size`, `class_count`, `class_names`, `map_value`, `fps`, `status`, `is_current`, `remark`) VALUES
('YOLO异物检测模型', 'v1.0.0', 1, 'onnx', '/models/yolo_defect_v1.onnx', 25600000, '640x640', 4, '["异物","漏装","封口不良","其他"]', 0.9523, 125.5, 1, 1, '基于YOLOv8训练的异物检测模型'),
('YOLO异物检测模型', 'v1.1.0', 1, 'onnx', '/models/yolo_defect_v1.1.onnx', 25800000, '640x640', 4, '["异物","漏装","封口不良","其他"]', 0.9658, 130.2, 0, 0, '基于YOLOv8训练的异物检测模型优化版');

COMMIT;
