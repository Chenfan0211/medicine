# 智合医药即时零售 ERP 中台

## 全量前后端技术规格书（代码生成版 v1.0）

> **文档版本：** v1.0  
> **更新日期：** 2026-05-28  
> **用途：** 作为 AI / 人工生成前后端代码的输入规格

### 约束确认

| 项 | 确认值 |
|----|--------|
| 功能范围 | 不区分一期/二期，**全部模块实现** |
| 后端语言 | **Java 17** |
| 前端框架 | **Vue 3 + TypeScript + Element Plus** |
| 架构 | **微服务 + Nacos** |
| 渠道对接 | **美团 + 饿了么 + 京东到家** |
| 租户模式 | **非 SaaS**（单租户，无 tenant_id） |
| 部署环境 | **阿里云** |
| UI 设计 | 无现成稿，自行设计（见 `ui-design-spec.md` 与 `design-prototype/`） |

---

## 1. 项目定位

面向医药连锁企业的**即时零售业务中台**，统一管理：

- 线下门店 + O2O 即时配送
- 三大外卖/即时零售平台订单与商品
- 商品、库存、采购、订单、配送、会员、财务全链路
- GSP 合规（批号、效期、追溯、处方审核）

**架构原则：** 厚中台、薄应用；微服务按领域拆分；渠道差异通过适配层隔离。

---

## 2. 总体架构

```
                    ┌─────────────────────────────────────┐
                    │         阿里云 SLB / CDN            │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   erp-gateway (Spring Cloud Gateway)  │
                    │   鉴权 / 限流 / 路由 / 跨域 / 日志       │
                    └──────────────────┬──────────────────┘
                                       │
     ┌─────────────┬─────────────┬─────┴─────┬─────────────┬─────────────┐
     ▼             ▼             ▼           ▼             ▼             ▼
 erp-system   erp-product   erp-inventory erp-order  erp-store   erp-channel
 erp-member   erp-purchase  erp-finance   erp-prescription erp-delivery erp-report
     │             │             │           │             │             │
     └─────────────┴─────────────┴─────┬─────┴─────────────┴─────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
    Nacos (注册+配置)              Redis 7.x                    RocketMQ
          │                            │                            │
          ▼                            ▼                            ▼
    MySQL 8.0 (RDS)              阿里云 OSS                    Elasticsearch 8.x
          │
          ▼
    XXL-JOB (定时任务)
```

### 2.1 阿里云资源清单

| 资源 | 产品 | 用途 |
|------|------|------|
| 计算 | ECS 或 ACK (K8s) | 微服务部署 |
| 数据库 | RDS MySQL 8.0 | 业务数据（可按服务分库） |
| 缓存 | Redis 云版 | 会话、库存预扣、分布式锁 |
| 注册配置 | Nacos（自建 ECS 或 MSE） | 服务发现、动态配置 |
| 消息 | RocketMQ | 异步事件、库存落库 |
| 对象存储 | OSS | 商品图、处方图、导出文件 |
| 负载均衡 | SLB | 网关入口 |
| 日志 | SLS | 集中日志 |
| 监控 | ARMS / Prometheus | 链路、指标 |
| CDN | 阿里云 CDN | 管理后台静态资源 |
| 短信 | 短信服务 | 验证码、通知 |

---

## 3. 后端技术栈（Java 微服务）

### 3.1 核心技术选型

| 类别 | 技术 | 版本 |
|------|------|------|
| JDK | OpenJDK | 17 LTS |
| 基础框架 | Spring Boot | 3.2.x |
| 微服务 | Spring Cloud | 2023.0.x |
| 阿里组件 | Spring Cloud Alibaba | 2023.0.x |
| 注册/配置 | Nacos | 2.3.x |
| 网关 | Spring Cloud Gateway | 4.x |
| 限流熔断 | Sentinel | 1.8.x |
| ORM | MyBatis-Plus | 3.5.x |
| 数据库 | MySQL | 8.0 |
| 缓存/锁 | Redis + Redisson | 7.x |
| MQ | RocketMQ | - |
| 鉴权 | Spring Security + JWT | - |
| API 文档 | Knife4j (OpenAPI 3) | 4.x |
| 任务调度 | XXL-JOB | 2.4.x |
| 搜索 | Elasticsearch | 8.x |
| 对象存储 | 阿里云 OSS SDK | - |
| Excel | EasyExcel | 3.x |
| 分布式事务 | Seata | 可选 |

### 3.2 微服务清单

| 服务名 | 端口 | 职责 |
|--------|------|------|
| erp-gateway | 8080 | 统一入口、JWT 校验、路由 |
| erp-system | 8081 | 用户、角色、菜单、部门、字典、日志、文件 |
| erp-product | 8082 | SPU/SKU、分类、品牌、GSP 属性、价格 |
| erp-inventory | 8083 | 库存、锁定、流水、盘点、调拨、效期预警 |
| erp-order | 8084 | O2O 订单、状态机、售后 |
| erp-store | 8085 | 门店档案、配送范围、营业配置 |
| erp-channel | 8086 | 美团/饿了么/京东对接、同步、回调 |
| erp-member | 8087 | 会员、等级、积分、优惠券 |
| erp-purchase | 8088 | 供应商、采购单、入库、退货 |
| erp-finance | 8089 | 对账、结算、平台账单 |
| erp-prescription | 8090 | 处方上传、药师审核 |
| erp-delivery | 8091 | 配送单、轨迹 |
| erp-report | 8092 | 报表、数据统计 |
| erp-job | 8093 | XXL-JOB 执行器 |

### 3.3 工程结构

```
zhihe-erp/
├── pom.xml
├── erp-common/
├── erp-gateway/
├── erp-system/
│   ├── erp-system-api/
│   └── erp-system-biz/
├── erp-product/
├── ... (其他服务同上)
└── docs/
    ├── sql/
    └── nacos/
```

每个微服务内部：

```
erp-{service}/
├── erp-{service}-api/     # Feign、DTO、枚举
└── erp-{service}-biz/     # Controller、Service、Mapper
```

### 3.4 统一 API 规范

- **前缀：** `/api/v1/{service}/{resource}`
- **网关对外：** `https://erp.zhihe.com/api/v1/...`

**响应体：**

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1716883200000
}
```

**错误码分段：**

| 区间 | 模块 |
|------|------|
| 10000-10999 | 系统/网关/鉴权 |
| 20000-20999 | 商品 |
| 30000-30999 | 库存 |
| 40000-40999 | 订单 |
| 50000-50999 | 门店 |
| 60000-60999 | 渠道 |
| 70000-70999 | 会员 |
| 80000-80999 | 采购 |
| 90000-90999 | 财务 |
| 100000-100999 | 处方 |
| 110000-110999 | 配送 |

### 3.5 服务间通信

| 场景 | 方式 |
|------|------|
| 同步查询 | OpenFeign + LoadBalancer |
| 异步事件 | RocketMQ Topic |
| 分布式锁 | Redisson |
| 跨服务事务 | 本地消息表 + 最终一致 |

**核心 MQ Topic：**

| Topic | 生产者 | 消费者 |
|-------|--------|--------|
| order.created | erp-order | erp-inventory, erp-channel |
| order.status.changed | erp-order | erp-channel, erp-delivery |
| stock.changed | erp-inventory | erp-channel |
| product.changed | erp-product | erp-channel |
| prescription.reviewed | erp-prescription | erp-order |

---

## 4. 全量功能模块

### 4.1 系统管理（erp-system）

- 用户、角色、菜单、部门、字典、参数、操作/登录日志、文件上传、站内信
- 数据权限：全部 / 本部门 / 本部门及下级 / 仅本人 / 自定义门店

**核心表：** sys_user, sys_role, sys_menu, sys_user_role, sys_role_menu, sys_dept, sys_dict_type, sys_dict_data, sys_config, sys_oper_log, sys_login_log, sys_file

### 4.2 商品中心（erp-product）

- 分类、品牌、SPU/SKU、GSP 字段、门店价/渠道价、导入导出

**核心表：** prd_category, prd_brand, prd_spu, prd_sku, prd_sku_image, prd_sku_price, prd_price_log

**SKU 关键字段：** sku_code, sku_name, approval_no, manufacturer, is_prescription, is_cold_chain, retail_price, cost_price, status

### 4.3 库存中心（erp-inventory）

- 门店库存、锁定、流水、盘点、调拨、入库、效期/低库存预警
- 防超卖：Redis 预扣 → lock 表 → MQ 异步落库

**核心表：** inv_stock, inv_stock_log, inv_stock_lock, inv_check, inv_transfer, inv_inbound

### 4.4 订单中心（erp-order）

**状态机：**

```
待支付 → 待处方审核* → 待拣货 → 待配送 → 配送中 → 已完成
  │         │              └──→ 售后中
  └──→ 已取消  └──→ 审核驳回
  * 处方药必经
```

**核心表：** ord_order, ord_order_item, ord_order_log, ord_after_sale

**渠道枚举：** MEITUAN, ELEME, JD, SELF

### 4.5 门店中心（erp-store）

**核心表：** sto_store, sto_delivery_area, sto_store_config

### 4.6 渠道对接（erp-channel）

- 适配层（策略模式）：美团 / 饿了么 / 京东
- 门店映射、商品映射、商品/库存同步、订单回调、状态回传

**核心表：** chn_config, chn_store_mapping, chn_product_mapping, chn_sync_log, chn_callback_log

### 4.7 会员中心（erp-member）

**核心表：** mem_member, mem_level, mem_point_log, mem_coupon, mem_coupon_record

### 4.8 采购中心（erp-purchase）

**核心表：** pur_supplier, pur_order, pur_return

### 4.9 财务中心（erp-finance）

**核心表：** fin_platform_bill, fin_reconcile, fin_reconcile_diff, fin_store_settlement

### 4.10 处方中心（erp-prescription）

**核心表：** rx_prescription, rx_prescription_item, rx_review_log

### 4.11 配送中心（erp-delivery）

**核心表：** del_delivery, del_delivery_track

### 4.12 报表中心（erp-report）

- Dashboard、销售/库存/采购/经营分析报表、Excel 导出

---

## 5. 前端技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) + TypeScript |
| 构建 | Vite 5 |
| UI | Element Plus 2 |
| 状态 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| 图表 | ECharts |
| 地图 | 高德地图 JS API |

### 5.1 前端工程结构

```
erp-admin-web/
├── src/api/          # 按微服务分目录
├── src/components/   # TablePro, FormDrawer, DictSelect, MapDraw...
├── src/layouts/      # BasicLayout
├── src/router/
├── src/stores/
├── src/views/
└── src/utils/
```

### 5.2 全量菜单树

见 `ui-design-spec.md` 第 4 节。

---

## 6. 安全与合规

| 项 | 实现 |
|----|------|
| HTTPS | 阿里云 SSL |
| 鉴权 | JWT（Access 2h + Refresh 7d） |
| 权限 | RBAC + 按钮级 + 数据权限 |
| 渠道回调 | 平台签名校验 |
| 审计 | 库存流水、订单日志、处方审核不可物理删除 |
| 密码 | BCrypt |

---

## 7. 代码生成顺序

```
Step 1  父工程 + erp-common + erp-gateway + Nacos
Step 2  erp-system + 前端脚手架 + 登录 + 系统管理
Step 3  erp-product + 商品管理前端
Step 4  erp-store + 门店管理前端
Step 5  erp-inventory + 库存管理前端
Step 6  erp-order + 订单管理前端
Step 7  erp-prescription + 处方审核前端
Step 8  erp-member + erp-purchase + erp-delivery
Step 9  erp-channel（三大平台适配器）
Step 10 erp-finance + erp-report + Dashboard
```

---

## 8. AI 代码生成 Prompt 模板

```markdown
项目：智合医药即时零售 ERP 中台
约束：Java 17 + Spring Boot 3.2 + 微服务 + Nacos + Vue3 + Element Plus
非 SaaS，部署阿里云，对接美团/饿了么/京东

当前任务：Step N - {模块名}

请生成完整可运行代码，含 SQL、Nacos 配置、前端页面。
包名：com.zhihe.erp.{module}
```

---

## 9. 相关文档

| 文档 | 路径 |
|------|------|
| UI 设计规范（Figma/即时设计） | `docs/ui-design-spec.md` |
| 可交互 HTML 原型 | `design-prototype/index.html` |
