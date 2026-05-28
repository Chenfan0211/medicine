# 网页部署说明（UI 原型在线访问）

## 为什么 `gitee.com/.../medicine/pages` 会 404？

**这个 URL 本身不存在。** Gitee 没有 `/pages` 这种设置页地址，所以浏览器会直接显示 404。

Gitee Pages 的正确入口是：

1. 打开仓库首页：https://gitee.com/chen-whisper/medicine  
2. 点击顶部 **「服务」** 菜单  
3. 选择 **「Gitee Pages」**（若列表里没有这项，见下文）

---

## 重要：Gitee Pages 个人版可能已停服

自 **2024 年中** 起，Gitee Pages **个人免费仓库** 普遍无法使用（官方未广泛公告，社区与客服反馈为已下线，仅企业版等场景保留）。

若你在「服务」里 **找不到 Gitee Pages**，说明该账号无法再用 Gitee 托管静态网站，需要换平台。

---

## 推荐替代方案（可网页访问 HTML）

### 方案 A：Cloudflare Pages（免费，推荐）

1. 注册 https://dash.cloudflare.com  
2. **Workers & Pages** → **Create** → **Pages** → **Upload assets**  
3. 上传本地文件夹：`design-prototype`（或解压 `pages` 分支内容）  
4. 部署完成后获得地址，例如：  
   `https://zhihe-medicine-erp.pages.dev/login.html`

### 方案 B：GitHub Pages（免费）

1. 在 GitHub 新建仓库，上传 `pages` 分支内容到 `gh-pages` 分支  
2. 仓库 **Settings → Pages** → Source 选 `gh-pages`  
3. 访问：`https://你的用户名.github.io/仓库名/login.html`

### 方案 C：阿里云 OSS 静态网站（国内访问快，与你技术方案一致）

1. 创建 OSS Bucket，开启 **静态网站托管**  
2. 上传 `design-prototype` 目录下所有文件  
3. 默认首页设为 `login.html`  
4. 绑定域名或使用 OSS 提供的访问域名  

### 方案 D：本地预览（无需部署）

```bash
cd design-prototype
# 双击 login.html，或：
npx serve .
# 浏览器打开 http://localhost:3000/login.html
```

---

## 仓库内已准备好的分支

| 分支 | 用途 |
|------|------|
| `master` | 完整项目（文档 + 原型在 `design-prototype/`） |
| `pages` | 仅 UI 静态文件（根目录即 login.html、index.html 等），适合上传到其他托管平台 |

克隆 `pages` 分支内容：

```bash
git clone -b pages https://gitee.com/chen-whisper/medicine.git medicine-ui
cd medicine-ui
# 将此目录上传到 Cloudflare / OSS 等
```

---

## 下一步

请告知你方便使用的平台（Cloudflare / GitHub / 阿里云 OSS），我可继续帮你写具体部署步骤或自动化脚本。
