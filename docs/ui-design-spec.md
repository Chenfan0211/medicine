# 智合医药 ERP 中台 · UI 设计规范

> 适用于 **Figma** / **即时设计** 复刻  
> 画布尺寸：**1440 × 900**（桌面管理后台标准）  
> 配套可交互原型：`design-prototype/index.html`

---

## 1. 设计原则

- **风格：** B2B 医药中台，简洁专业，信息密度适中
- **主色：** 医药绿 `#059669`（品牌）+ 功能蓝 `#1677FF`（链接/主按钮）
- **布局：** 左侧固定菜单 220px + 顶栏 56px + 内容区自适应
- **圆角：** 卡片/按钮 6px，输入框 4px
- **阴影：** 卡片 `0 1px 4px rgba(0,0,0,0.08)`

---

## 2. 设计 Token（Design Tokens）

### 2.1 色彩

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-primary` | `#059669` | 主色、选中菜单、品牌 |
| `--color-primary-light` | `#ECFDF5` | 主色浅底、选中行 |
| `--color-link` | `#1677FF` | 链接、次主按钮 |
| `--color-success` | `#52C41A` | 成功状态 |
| `--color-warning` | `#FAAD14` | 警告、待处理 |
| `--color-danger` | `#FF4D4F` | 错误、删除 |
| `--color-text-primary` | `#1F2937` | 主文字 |
| `--color-text-secondary` | `#6B7280` | 次要文字 |
| `--color-text-placeholder` | `#9CA3AF` | 占位符 |
| `--color-border` | `#E5E7EB` | 边框、分割线 |
| `--color-bg-page` | `#F3F4F6` | 页面背景 |
| `--color-bg-card` | `#FFFFFF` | 卡片背景 |
| `--color-sidebar-bg` | `#001529` | 侧边栏背景 |
| `--color-sidebar-text` | `rgba(255,255,255,0.65)` | 菜单文字 |
| `--color-sidebar-active` | `#059669` | 菜单选中 |

### 2.2 字体

| Token | 值 |
|-------|-----|
| 字体族 | `-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif` |
| 页面标题 | 20px / 600 |
| 卡片标题 | 16px / 600 |
| 正文 | 14px / 400 |
| 辅助文字 | 12px / 400 |
| 表格表头 | 14px / 500 |

### 2.3 间距

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-xs` | 4px | 紧凑间距 |
| `--space-sm` | 8px | 组件内间距 |
| `--space-md` | 16px | 卡片内边距 |
| `--space-lg` | 24px | 区块间距 |
| `--space-xl` | 32px | 大区块 |

### 2.4 尺寸

| 组件 | 尺寸 |
|------|------|
| 侧边栏宽度 | 220px |
| 顶栏高度 | 56px |
| 输入框高度 | 32px |
| 主按钮高度 | 32px |
| 表格行高 | 48px |
| 面包屑区高度 | 40px |

---

## 3. 主框架布局（Frame: Layout-Main）

```
┌──────────┬────────────────────────────────────────────────────┐
│          │  Header 56px                                       │
│ Sidebar  │  [折叠] 面包屑          通知 用户头像 管理员 ▼       │
│ 220px    ├────────────────────────────────────────────────────┤
│          │                                                    │
│ Logo     │  Content Area (padding 24px, bg #F3F4F6)           │
│ 智合医药  │                                                    │
│          │  ┌──────────────────────────────────────────────┐   │
│ 菜单树    │  │  页面内容（白卡片）                            │   │
│          │  └──────────────────────────────────────────────┘   │
│          │                                                    │
└──────────┴────────────────────────────────────────────────────┘
```

### 3.1 侧边栏 Sidebar

- 背景 `#001529`，展开宽 **220px**，收起宽 **64px**
- 顶栏 **« / ☰** 按钮：整体展开/收起侧边栏（状态记忆 localStorage）
- 一级分组（系统管理、商品管理…）：点击分组标题 **展开/收起** 子菜单（▾ 箭头旋转）
- 一级分组默认**全部收起**；进入子页面时自动展开对应分组
- 登录页 `login.html` → 成功后进入首页 Dashboard
- Logo 区：高 56px；收起时仅显示 Logo 图标

**菜单结构（设计稿中展示部分即可）：**

```
首页
系统管理 ▼
商品管理 ▼
  └ SKU 管理        ← SKU 列表页高亮
库存管理
订单管理 ▼
  └ 订单列表        ← 订单列表页高亮
门店管理
渠道管理
会员管理
采购管理
财务管理
处方管理
配送管理
报表中心
```

### 3.2 顶栏 Header

- 背景白色，高 56px，底边框 1px `#E5E7EB`
- 左：折叠按钮 + 面包屑（14px，`#6B7280`，末级 `#1F2937`）
- 右：铃铛图标 + 头像 32px 圆形 + 「管理员」+ 下拉箭头

### 3.3 内容区

- 背景 `#F3F4F6`，padding 24px
- 页面卡片：白底，圆角 6px，padding 16~24px

---

## 4. 页面一：Dashboard（Frame: Page-Dashboard）

**面包屑：** 首页

### 4.1 统计卡片区（4 列，等高 100px）

| 卡片 | 指标 | 数值示例 | 图标色 |
|------|------|---------|--------|
| 今日订单 | 较昨日 | 1,286 ↑12% | 蓝 |
| 今日销售额 | 较昨日 | ¥86,420 ↑8% | 绿 |
| 待拣货 | 需处理 | 47 | 橙 |
| 库存预警 | SKU 数 | 23 | 红 |

卡片结构：左图标 48px 圆角方块 + 右标题 12px 灰 + 数值 24px 粗 + 副指标 12px

### 4.2 图表区（2 列）

- **左（60%宽）：** 「近 7 日销售趋势」折线图，高 320px
- **右（40%宽）：** 「渠道订单占比」环形图（美团/饿了么/京东/自营）

### 4.3 待办列表（全宽）

表格列：类型 | 内容 | 门店 | 时间 | 操作  
示例行：处方审核 | 订单 #202605280001 待审核 | 朝阳店 | 10:32 | 去处理

---

## 5. 页面二：订单列表（Frame: Page-OrderList）

**面包屑：** 订单管理 / 订单列表

### 5.1 搜索区（白卡片，padding 16px）

| 字段 | 类型 | 宽度 |
|------|------|------|
| 订单号 | Input | 180px |
| 渠道 | Select | 120px（全部/美团/饿了么/京东/自营） |
| 门店 | Select | 160px |
| 状态 | Select | 120px |
| 下单时间 | DateRange | 240px |
| 查询 / 重置 | Button | primary + default |

### 5.2 工具栏

- 左：导出按钮
- 右：已选 0 项

### 5.3 表格

| 列 | 宽度 | 说明 |
|----|------|------|
| 复选框 | 48px | |
| 订单号 | 160px | 链接色可点击 |
| 渠道 | 100px | Tag：美团黄/饿了么蓝/京东红 |
| 门店 | 120px | |
| 金额 | 100px | ¥ 右对齐 |
| 状态 | 100px | Tag 彩色 |
| 收货人 | 100px | 手机号脱敏 |
| 下单时间 | 160px | |
| 操作 | 160px | 详情 / 拣货 / 取消 |

**状态 Tag 色：**

| 状态 | 背景 | 文字 |
|------|------|------|
| 待支付 | #FEF3C7 | #D97706 |
| 待拣货 | #DBEAFE | #2563EB |
| 配送中 | #E0E7FF | #4F46E5 |
| 已完成 | #D1FAE5 | #059669 |
| 已取消 | #F3F4F6 | #6B7280 |

### 5.4 分页

右对齐：共 1286 条，每页 20 条，页码 1 2 3 ...

---

## 6. 页面三：SKU 列表（Frame: Page-SkuList）

**面包屑：** 商品管理 / SKU 管理

### 6.1 搜索区

| 字段 | 类型 |
|------|------|
| SKU 编码/名称 | Input 200px |
| 分类 | TreeSelect 160px |
| 品牌 | Select 120px |
| 处方药 | Select（全部/是/否） |
| 状态 | Select（全部/上架/下架） |
| 查询 / 重置 | Button |

### 6.2 工具栏

- 左：+ 新增 SKU | 批量导入 | 批量上架 | 导出
- 右：已选 0 项

### 6.3 表格

| 列 | 宽度 | 说明 |
|----|------|------|
| 复选框 | 48px | |
| 图片 | 64px | 48×48 商品图 |
| SKU 编码 | 120px | |
| 商品名称 | 200px | 超长省略 |
| 规格 | 100px | |
| 批准文号 | 140px | GSP |
| 生产厂家 | 160px | |
| 零售价 | 90px | |
| 处方药 | 80px | Tag Rx/OTC |
| 状态 | 80px | 上架/下架 |
| 操作 | 140px | 编辑 / 价格 / 下架 |

### 6.4 新增/编辑（Drawer 抽屉，宽 560px）

分区：

1. **基本信息：** 名称、编码、分类、品牌、规格、单位
2. **GSP 信息：** 批准文号、生产厂家、剂型、处方药开关、冷链开关
3. **价格：** 零售价、成本价
4. **图片：** 上传区 104×104

底部：取消 | 保存

---

## 7. 即时设计 / Figma 操作步骤

### 7.1 创建项目

1. 新建文件「智合医药 ERP 中台」
2. 创建 Page：`00-Tokens` / `01-Components` / `02-Layouts` / `03-Pages`
3. 画布 1440×900

### 7.2 建立组件库（Page: 01-Components）

| 组件名 | 变体 |
|--------|------|
| Button/Primary | default, hover, disabled |
| Button/Default | default, hover |
| Input | default, focus, error |
| Select | default, open |
| Tag/Status | success, warning, danger, info, default |
| Table/Header | - |
| Table/Row | default, hover, selected |
| Sidebar/MenuItem | default, active, submenu |
| StatCard | 4 色图标变体 |

### 7.3 搭建主框架（Page: 02-Layouts）

1. 复制 Sidebar + Header 为 Component `Layout/Main`
2. 内容区留 Slot（Auto Layout 纵向，gap 24px）

### 7.4 搭建全量页面（Page: 03-Pages）

按 `pages-config.js` 中 47 个页面 ID 逐页搭建，优先完成：

1. Layout 主框架 Component
2. Dashboard（仪表盘）
3. 各模块典型列表页（订单、SKU、库存、处方）
4. 特殊页：渠道配置（卡片）、配送范围（地图）、报表（图表+表）

### 7.5 交付物 Checklist

- [ ] Design Tokens 色板页
- [ ] 组件库（Button/Input/Tag/Table/Tree/Map）
- [ ] Layout 主框架 Component
- [ ] 全量 47 页面（见第 10 节清单）
- [ ] 标注：间距、字号、色值

---

## 8. 与 Vue 开发对齐

| 设计组件 | Element Plus 组件 |
|----------|-------------------|
| Input | el-input |
| Select | el-select |
| Button | el-button |
| Table | el-table |
| Tag | el-tag |
| 分页 | el-pagination |
| 抽屉 | el-drawer |
| 日期范围 | el-date-picker type="daterange" |
| 图表 | ECharts via vue-echarts |

主题覆盖（Element Plus CSS 变量）：

```css
:root {
  --el-color-primary: #059669;
  --el-color-primary-light-3: #34d399;
  --el-color-primary-dark-2: #047857;
}
```

---

## 9. 原型预览

在浏览器打开：

```
design-prototype/index.html
```

支持页面切换：**全量 47 个页面**，点击左侧完整菜单即可浏览。

### 原型文件结构

| 文件 | 说明 |
|------|------|
| `index.html` | 主入口 |
| `menu-config.js` | 全量侧边栏菜单 |
| `pages-config.js` | 全量页面配置 |
| `renderer.js` | 页面渲染器 |
| `styles.css` | 设计 Token 样式 |

---

## 10. 全量页面清单（47 页）

| 模块 | 页面 | 页面类型 | 原型 ID |
|------|------|---------|---------|
| 首页 | Dashboard | 仪表盘 | `dashboard` |
| 系统管理 | 用户/角色/字典/操作日志/登录日志 | 列表 | `sys-user` 等 |
| | 菜单/部门/分类 | 树形列表 | `sys-menu` 等 |
| | 参数设置 | 表单卡片 | `sys-config` |
| 商品管理 | 品牌/SPU/SKU | 列表 | `prd-brand` 等 |
| 库存管理 | 库存查询/流水/盘点/调拨/入库/效期预警 | 列表 | `inv-stock` 等 |
| 订单管理 | 订单列表/售后管理 | 列表 | `ord-list` 等 |
| 门店管理 | 门店列表/配送范围 | 列表/地图 | `sto-list` / `sto-delivery` |
| 渠道管理 | 渠道配置/映射/同步 | 卡片/列表 | `chn-config` 等 |
| 会员管理 | 会员/等级/积分/优惠券 | 列表 | `mem-list` 等 |
| 采购管理 | 供应商/采购单/退货 | 列表 | `pur-supplier` 等 |
| 财务管理 | 账单/对账/结算 | 列表 | `fin-bill` 等 |
| 处方管理 | 待审核/记录/日志 | 列表 | `rx-pending` 等 |
| 配送管理 | 配送单/跟踪 | 列表/地图 | `del-list` / `del-track` |
| 报表中心 | 销售/库存/采购/经营分析 | 报表 | `rpt-sales` 等 |

---

## 12. 登录页（Frame: Page-Login）

**文件：** `design-prototype/login.html`

**布局：** 左右分栏（移动端上下堆叠）

| 区域 | 内容 |
|------|------|
| 左侧品牌区 | Logo、系统名称、 Slogan、特性列表 |
| 右侧登录卡 | 用户名、密码、验证码、记住我、登录按钮 |

**登录后：** 跳转 `index.html`，默认展示 **首页 Dashboard**，所有子菜单收起。

**退出：** 点击顶栏用户名区域返回登录页。

