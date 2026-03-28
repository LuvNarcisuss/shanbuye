# 山不野智能视觉检测平台

## 项目简介

山不野智能视觉检测平台是一个面向多通道包装生产线的智能视觉检测管理系统，通过YOLO深度学习模型、双传感器集群与"排队法"异步匹配算法，实现高速生产环境下的高精度缺陷检测，并提供可视化、可配置、可追溯的数字化管理平台。

## 技术栈

### 后端
- **Java 17**
- **Spring Boot 3.1.5**
- **MyBatis Plus 3.5.4**
- **MySQL 8.0**
- **Redis**
- **Netty SocketIO** (WebSocket)
- **JWT** (认证)
- **EasyExcel** (Excel导入导出)
- **iText** (PDF生成)

### 前端
- **Vue 3**
- **Vite 5**
- **Element Plus**
- **Pinia** (状态管理)
- **Vue Router** (路由)
- **Axios** (HTTP请求)
- **ECharts** (数据可视化)
- **Socket.IO Client** (WebSocket客户端)

### AI前端（React版本）
- **React 18**
- **TypeScript**
- **Vite**
- 位于 `backend/shanbuye-web/src/main/resources/static/ai/`

## 项目结构

```
shanbuye/
├── backend/                    # 后端项目
│   ├── shanbuye-common/       # 通用模块
│   ├── shanbuye-model/        # 模型模块
│   ├── shanbuye-api/          # API接口模块
│   ├── shanbuye-service/      # 服务模块
│   └── shanbuye-web/          # Web模块（启动类）
│       └── src/main/resources/static/ai/  # AI前端（React）
├── frontend/                   # 前端项目（Vue3）
│   ├── src/
│   │   ├── api/               # API接口
│   │   ├── assets/            # 静态资源
│   │   │   ├── images/        # 图片资源
│   │   │   ├── videos/        # 视频资源
│   │   │   └── icons/         # 图标资源
│   │   ├── components/        # 公共组件
│   │   ├── composables/       # 组合式函数
│   │   ├── layouts/           # 布局组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # 状态管理
│   │   ├── utils/             # 工具函数
│   │   └── views/             # 页面组件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── docs/                       # 文档
    └── init.sql               # 数据库初始化脚本
```

## 核心功能

### 1. 生产线实时监控大屏
- 实时展示各产线运行状态、产量、不合格率
- 设备在线情况监控
- 工位最新检测图像与识别结果查看
- **流水线视频监控**：支持多流水线视频切换播放
- WebSocket实时推送状态和报警信息
- 报警中心（铃铛图标）查看未处理报警
- 全屏展示、手动刷新等功能

### 2. 规则与分拣策略配置
- 规则表格/卡片展示
- 规则快速编辑、复制、生效校验
- 规则启用/停用、发布/下发配置
- 版本历史查看和回滚功能
- Excel/JSON导入导出
- 按产线、工位、缺陷类型筛选

### 3. 模型管理
- 模型上传、完整性校验、元信息解析
- 一键切换模型、灰度发布
- 模型A/B对比
- 模型删除/归档
- 样例图片测试验证

### 4. 数据统计与报表
- 多维度质量分析图表
- 时间范围、维度筛选
- 钻取详情查看缺陷样本
- Excel/PDF报表导出
- 报表模板保存

### 5. 系统管理
- 用户管理（新增/编辑/禁用/重置密码）
- 角色权限管理（RBAC）
- 系统参数配置
- 操作日志查询

## 快速开始

### 环境要求
- JDK 17+
- Node.js 16+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.8+

### 后端启动

1. 创建数据库并执行初始化脚本：
```bash
mysql -u root -p < docs/init.sql
```

2. 修改数据库配置 `backend/shanbuye-web/src/main/resources/application.yml`

3. 启动后端服务：
```bash
cd backend/shanbuye-web
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 前端启动（Vue3版本）

1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

### 前端启动（React版本）

1. 进入AI前端目录：
```bash
cd backend/shanbuye-web/src/main/resources/static/ai
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 默认账号
- 用户名：`admin`
- 密码：`123456`

## 数据库设计

### 主要数据表
- `sys_user` - 用户表
- `sys_role` - 角色表
- `sys_permission` - 权限表
- `production_line` - 生产线表
- `station` - 工位表
- `detection_rule` - 检测规则表
- `detection_model` - 检测模型表
- `detection_record` - 检测记录表
- `alarm_record` - 报警记录表
- `operation_log` - 操作日志表
- `system_config` - 系统配置表

详细的表结构请参考 `docs/init.sql`

## API文档

后端集成Swagger/OpenAPI，启动后访问：
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API文档: `http://localhost:8080/v3/api-docs`

## 开发规范

### 后端开发规范
- 遵循RESTful API设计规范
- 统一使用 `Result<T>` 封装响应结果
- 使用 `@Valid` 进行参数校验
- 使用 `GlobalExceptionHandler` 处理全局异常
- Service层使用事务注解 `@Transactional`

### 前端开发规范
- 使用 Composition API
- 使用 `<script setup>` 语法
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 使用 ESLint 进行代码检查

## 项目特色

1. **实时性**：基于WebSocket的实时数据推送，确保监控数据及时更新
2. **可追溯性**：完整的操作日志、版本历史、变更记录
3. **可配置性**：规则引擎、参数动态配置，灵活适应不同产线需求
4. **可视化**：大屏看板、统计图表，直观展示生产数据
5. **权限控制**：基于RBAC的细粒度权限管理
6. **高性能**：异步匹配算法、缓存机制、分页查询优化
7. **双前端架构**：Vue3 + React 双版本前端，适应不同场景需求

## 更新日志

### 2024-02-07
- ✨ 新增流水线视频监控功能，支持多流水线切换
- ✨ 整合 shanbuyeai 前端到 shanbuye-web 项目
- ✨ 创建前端静态资源目录（images/videos/icons）
- 🔧 修复多个 Vue 组件编译错误
- 🔧 完善系统管理模块（用户、角色、配置、日志）

## 许可证

Copyright © 2024 山不野智能视觉检测平台

## 联系方式

如有问题或建议，请联系项目团队。
