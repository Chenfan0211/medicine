# 智合医药即时零售 ERP 中台

## 项目说明

本仓库包含智合医药即时零售 ERP 中台的需求分析、UI 设计规范与**全量可交互原型**。

## 文档

| 文档 | 说明 |
|------|------|
| [docs/codegen-spec-v1.md](docs/codegen-spec-v1.md) | 全量前后端技术规格书（代码生成版） |
| [docs/ui-design-spec.md](docs/ui-design-spec.md) | UI 设计规范 + 47 页清单（Figma/即时设计） |

## UI 原型预览（全量 47 页）

### 网页在线访问

> **注意：** `gitee.com/.../medicine/pages` 会 404（该 URL 不存在）。  
> Gitee Pages 个人版可能已停服，详见 **[docs/DEPLOY-WEB.md](docs/DEPLOY-WEB.md)**

**推荐做法：** 将 `pages` 分支或 `design-prototype/` 目录上传到 **Cloudflare Pages** / **GitHub Pages** / **阿里云 OSS**。

**本地预览（最快）：** 双击 `design-prototype/login.html`

### 本地预览

```
design-prototype/login.html
```

登录成功后自动进入首页 Dashboard。未登录访问 `index.html` 将跳转至登录页。

```
design-prototype/index.html   ← 需先登录
design-prototype/login.html   ← 入口
```

### 模块覆盖

| 模块 | 页面数 |
|------|--------|
| 首页 Dashboard | 1 |
| 系统管理 | 8 |
| 商品管理 | 4 |
| 库存管理 | 6 |
| 订单管理 | 2 |
| 门店管理 | 2 |
| 渠道管理 | 5 |
| 会员管理 | 4 |
| 采购管理 | 3 |
| 财务管理 | 3 |
| 处方管理 | 3 |
| 配送管理 | 2 |
| 报表中心 | 4 |
| **合计** | **47** |

### 原型架构

```
design-prototype/
├── index.html          # 主入口
├── menu-config.js      # 侧边栏菜单
├── pages-config.js     # 全量页面数据
├── renderer.js         # 页面渲染器
├── styles.css          # 设计 Token
└── app.js              # 路由切换
```

## 技术约束

- 后端：Java 17 + Spring Boot 3.2 + 微服务 + Nacos
- 前端：Vue 3 + TypeScript + Element Plus
- 渠道：美团 / 饿了么 / 京东到家
- 部署：阿里云（非 SaaS）

## 下一步

1. 在 Figma/即时设计中按 `docs/ui-design-spec.md` 复刻组件库
2. 按 `docs/codegen-spec-v1.md` 第 7 节从 Step 1 微服务脚手架开始生成代码
