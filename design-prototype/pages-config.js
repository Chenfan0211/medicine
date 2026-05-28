/**
 * 全量页面配置 — 搜索区 / 工具栏 / 表格 / 示例数据
 */
const PAGES = {
  dashboard: {
    type: 'dashboard',
    breadcrumb: '首页',
  },

  /* ========== 系统管理 ========== */
  'sys-user': {
    type: 'list',
    breadcrumb: '系统管理 / 用户管理',
    search: [
      { label: '用户名', placeholder: '请输入用户名', width: 160 },
      { label: '手机号', placeholder: '请输入手机号', width: 160 },
      { label: '状态', type: 'select', options: ['全部', '正常', '停用'] },
      { label: '部门', type: 'select', options: ['全部', '总部', '运营部', '门店部'] },
    ],
    toolbar: ['+ 新增用户', '导出'],
    columns: ['用户名', '昵称', '部门', '手机号', '状态', '创建时间', '操作'],
    rows: [
      ['admin', '管理员', '总部', '138****0001', tag('正常', 'on'), '2026-01-01 09:00', actions(['编辑', '重置密码', '删除'])],
      ['zhangsan', '张三', '运营部', '138****1234', tag('正常', 'on'), '2026-02-15 10:20', actions(['编辑', '重置密码', '删除'])],
      ['lisi', '李四', '门店部', '139****5678', tag('停用', 'off'), '2026-03-20 14:30', actions(['编辑', '重置密码', '删除'])],
    ],
    total: 28,
  },
  'sys-role': {
    type: 'list',
    breadcrumb: '系统管理 / 角色管理',
    search: [{ label: '角色名称', placeholder: '请输入角色名称', width: 180 }, { label: '状态', type: 'select', options: ['全部', '正常', '停用'] }],
    toolbar: ['+ 新增角色'],
    columns: ['角色名称', '角色编码', '排序', '状态', '创建时间', '操作'],
    rows: [
      ['超级管理员', 'admin', '1', tag('正常', 'on'), '2026-01-01', actions(['编辑', '权限', '删除'])],
      ['运营人员', 'operator', '2', tag('正常', 'on'), '2026-01-05', actions(['编辑', '权限', '删除'])],
      ['门店店长', 'store_manager', '3', tag('正常', 'on'), '2026-01-10', actions(['编辑', '权限', '删除'])],
      ['药师', 'pharmacist', '4', tag('正常', 'on'), '2026-02-01', actions(['编辑', '权限', '删除'])],
    ],
    total: 8,
  },
  'sys-menu': {
    type: 'tree-list',
    breadcrumb: '系统管理 / 菜单管理',
    toolbar: ['+ 新增菜单', '展开全部', '折叠全部'],
    treeColumns: ['菜单名称', '图标', '排序', '权限标识', '类型', '状态', '操作'],
    treeRows: [
      ['首页', '📊', '1', 'dashboard', '目录', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
      ['├ 商品管理', '📦', '2', 'product', '目录', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
      ['│ └ SKU 管理', '', '1', 'product:sku:list', '菜单', tag('正常', 'on'), actions(['编辑', '删除'])],
      ['├ 订单管理', '🛒', '3', 'order', '目录', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
    ],
  },
  'sys-dept': {
    type: 'tree-list',
    breadcrumb: '系统管理 / 部门管理',
    toolbar: ['+ 新增部门'],
    treeColumns: ['部门名称', '排序', '负责人', '联系电话', '状态', '操作'],
    treeRows: [
      ['智合医药集团', '1', '王总', '010-88888888', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
      ['├ 运营中心', '1', '张经理', '010-88888801', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
      ['├ 门店管理部', '2', '李经理', '010-88888802', tag('正常', 'on'), actions(['编辑', '新增', '删除'])],
      ['│ └ 朝阳店', '1', '赵店长', '010-66661001', tag('正常', 'on'), actions(['编辑', '删除'])],
    ],
  },
  'sys-dict': {
    type: 'list',
    breadcrumb: '系统管理 / 字典管理',
    search: [{ label: '字典名称', width: 160 }, { label: '字典类型', width: 160 }, { label: '状态', type: 'select', options: ['全部', '正常', '停用'] }],
    toolbar: ['+ 新增字典'],
    columns: ['字典名称', '字典类型', '状态', '备注', '创建时间', '操作'],
    rows: [
      ['订单状态', 'ord_status', tag('正常', 'on'), '订单状态枚举', '2026-01-01', actions(['编辑', '字典数据', '删除'])],
      ['渠道类型', 'channel_type', tag('正常', 'on'), '美团/饿了么/京东', '2026-01-01', actions(['编辑', '字典数据', '删除'])],
      ['处方审核状态', 'rx_status', tag('正常', 'on'), '处方审核', '2026-01-05', actions(['编辑', '字典数据', '删除'])],
    ],
    total: 15,
  },
  'sys-config': {
    type: 'form-cards',
    breadcrumb: '系统管理 / 参数设置',
    cards: [
      { title: '基础参数', fields: [{ label: '系统名称', value: '智合医药 ERP 中台' }, { label: '默认分页大小', value: '20' }, { label: '会话超时(分钟)', value: '120' }] },
      { title: '业务参数', fields: [{ label: '库存预警阈值', value: '10' }, { label: '近效期预警天数', value: '90' }, { label: '订单自动取消(分钟)', value: '30' }] },
      { title: 'OSS 配置', fields: [{ label: 'Bucket', value: 'zhihe-erp-prod' }, { label: 'Endpoint', value: 'oss-cn-beijing.aliyuncs.com' }, { label: 'CDN 域名', value: 'cdn.zhihe.com' }] },
    ],
  },
  'sys-oper-log': {
    type: 'list',
    breadcrumb: '系统管理 / 操作日志',
    search: [{ label: '操作人员', width: 140 }, { label: '模块', type: 'select', options: ['全部', '商品', '订单', '库存'] }, { label: '操作时间', width: 240, placeholder: '开始 — 结束' }],
    toolbar: ['导出', '清空'],
    columns: ['日志编号', '模块', '操作类型', '操作人员', 'IP 地址', '操作时间', '操作'],
    rows: [
      ['10001', '商品管理', '新增 SKU', 'admin', '192.168.1.100', '2026-05-28 10:30:15', actions(['详情'])],
      ['10002', '订单管理', '订单拣货', 'zhangsan', '192.168.1.101', '2026-05-28 10:25:08', actions(['详情'])],
      ['10003', '库存管理', '库存调拨', 'lisi', '192.168.1.102', '2026-05-28 09:50:22', actions(['详情'])],
    ],
    total: 1256,
  },
  'sys-login-log': {
    type: 'list',
    breadcrumb: '系统管理 / 登录日志',
    search: [{ label: '用户名', width: 140 }, { label: '登录状态', type: 'select', options: ['全部', '成功', '失败'] }, { label: '登录时间', width: 240 }],
    toolbar: ['导出'],
    columns: ['用户名', '登录 IP', '登录地点', '浏览器', '状态', '登录时间', '操作'],
    rows: [
      ['admin', '192.168.1.100', '北京', 'Chrome 120', tag('成功', 'on'), '2026-05-28 08:30:00', actions(['详情'])],
      ['zhangsan', '192.168.1.101', '北京', 'Edge 120', tag('成功', 'on'), '2026-05-28 09:00:15', actions(['详情'])],
      ['unknown', '10.0.0.55', '未知', '—', tag('失败', 'off'), '2026-05-28 07:15:33', actions(['详情'])],
    ],
    total: 890,
  },

  /* ========== 商品管理 ========== */
  'prd-category': {
    type: 'tree-list',
    breadcrumb: '商品管理 / 分类管理',
    toolbar: ['+ 新增分类'],
    treeColumns: ['分类名称', '分类编码', '排序', '状态', '操作'],
    treeRows: [
      ['中西成药', 'CAT001', '1', tag('启用', 'on'), actions(['编辑', '新增', '删除'])],
      ['├ 感冒用药', 'CAT001-01', '1', tag('启用', 'on'), actions(['编辑', '删除'])],
      ['├ 消化系统', 'CAT001-02', '2', tag('启用', 'on'), actions(['编辑', '删除'])],
      ['医疗器械', 'CAT002', '2', tag('启用', 'on'), actions(['编辑', '新增', '删除'])],
    ],
  },
  'prd-brand': {
    type: 'list',
    breadcrumb: '商品管理 / 品牌管理',
    search: [{ label: '品牌名称', width: 160 }, { label: '状态', type: 'select', options: ['全部', '启用', '停用'] }],
    toolbar: ['+ 新增品牌'],
    columns: ['品牌 Logo', '品牌名称', '品牌编码', '排序', '状态', '操作'],
    rows: [
      [thumb('🏭'), '拜耳', 'BRD001', '1', tag('启用', 'on'), actions(['编辑', '删除'])],
      [thumb('🏭'), '辉瑞', 'BRD002', '2', tag('启用', 'on'), actions(['编辑', '删除'])],
      [thumb('🏭'), '华润三九', 'BRD003', '3', tag('启用', 'on'), actions(['编辑', '删除'])],
    ],
    total: 45,
  },
  'prd-spu': {
    type: 'list',
    breadcrumb: '商品管理 / SPU 管理',
    search: [{ label: 'SPU 名称', width: 180 }, { label: '分类', type: 'select', options: ['全部', '感冒用药', '消化系统'] }, { label: '状态', type: 'select', options: ['全部', '上架', '下架'] }],
    toolbar: ['+ 新增 SPU', '导出'],
    columns: ['SPU 编码', 'SPU 名称', '分类', '品牌', 'SKU 数', '状态', '操作'],
    rows: [
      ['SPU1001', '阿莫西林胶囊', '感冒用药', '石药集团', '3', tag('上架', 'on'), actions(['编辑', 'SKU', '下架'])],
      ['SPU1002', '布洛芬缓释胶囊', '感冒用药', '中美史克', '2', tag('上架', 'on'), actions(['编辑', 'SKU', '下架'])],
      ['SPU1003', '二甲双胍片', '心脑血管', '京丰制药', '1', tag('下架', 'off'), actions(['编辑', 'SKU', '上架'])],
    ],
    total: 856,
  },
  'prd-sku': {
    type: 'list',
    breadcrumb: '商品管理 / SKU 管理',
    search: [{ label: 'SKU 编码/名称', width: 200 }, { label: '分类', type: 'select', options: ['全部', '感冒用药', '消化系统'] }, { label: '处方药', type: 'select', options: ['全部', '是', '否'] }, { label: '状态', type: 'select', options: ['全部', '上架', '下架'] }],
    toolbar: ['+ 新增 SKU', '批量导入', '批量上架', '导出'],
    columns: ['图片', 'SKU 编码', '商品名称', '规格', '批准文号', '生产厂家', '零售价', '处方药', '状态', '操作'],
    rows: [
      [thumb('💊'), 'SKU10086001', '阿莫西林胶囊', '0.25g×24粒', '国药准字H13020983', '石药集团欧意药业', '¥12.80', tag('Rx', 'rx'), tag('上架', 'on'), actions(['编辑', '价格', '下架'])],
      [thumb('💊'), 'SKU10086002', '布洛芬缓释胶囊', '0.3g×20粒', '国药准字H10900089', '中美天津史克制药', '¥18.50', tag('OTC', 'otc'), tag('上架', 'on'), actions(['编辑', '价格', '下架'])],
      [thumb('💊'), 'SKU10086004', '二甲双胍片', '0.5g×30片', '国药准字H11021425', '北京京丰制药', '¥15.60', tag('Rx', 'rx'), tag('下架', 'off'), actions(['编辑', '价格', '上架'])],
    ],
    total: 3562,
  },

  /* ========== 库存管理 ========== */
  'inv-stock': {
    type: 'list',
    breadcrumb: '库存管理 / 库存查询',
    search: [{ label: 'SKU/商品名', width: 180 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '库存状态', type: 'select', options: ['全部', '正常', '预警', '缺货'] }],
    toolbar: ['导出'],
    columns: ['门店', 'SKU 编码', '商品名称', '规格', '批号', '有效期', '可用库存', '锁定', '状态', '操作'],
    rows: [
      ['朝阳店', 'SKU10086001', '阿莫西林胶囊', '0.25g×24粒', '20260315', '2028-03-15', '156', '3', tag('正常', 'on'), actions(['流水', '锁定明细'])],
      ['朝阳店', 'SKU10086002', '布洛芬缓释胶囊', '0.3g×20粒', '20260201', '2027-02-01', '8', '0', tag('预警', 'pending'), actions(['流水', '锁定明细'])],
      ['海淀店', 'SKU10086005', '胰岛素注射液', '3ml:300单位', '20260101', '2026-12-01', '0', '2', tag('缺货', 'off'), actions(['流水', '锁定明细'])],
    ],
    total: 8920,
  },
  'inv-log': {
    type: 'list',
    breadcrumb: '库存管理 / 库存流水',
    search: [{ label: 'SKU 编码', width: 140 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '变动类型', type: 'select', options: ['全部', '入库', '出库', '锁定', '释放', '盘点'] }, { label: '时间', width: 240 }],
    toolbar: ['导出'],
    columns: ['流水号', '门店', 'SKU', '变动类型', '变动数量', '变动后库存', '关联单号', '操作人', '时间'],
    rows: [
      ['LOG202605280001', '朝阳店', 'SKU10086001', tag('出库', 'picking'), '-2', '154', 'ORD202605280001', 'zhangsan', '2026-05-28 10:35'],
      ['LOG202605280002', '朝阳店', 'SKU10086001', tag('锁定', 'pending'), '-3', '156', 'ORD202605280003', 'system', '2026-05-28 10:32'],
      ['LOG202605280003', '海淀店', 'SKU10086002', tag('入库', 'on'), '+100', '108', 'IN20260527001', 'lisi', '2026-05-27 16:00'],
    ],
    total: 45680,
  },
  'inv-check': {
    type: 'list',
    breadcrumb: '库存管理 / 盘点管理',
    search: [{ label: '盘点单号', width: 160 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '状态', type: 'select', options: ['全部', '盘点中', '已完成', '已取消'] }],
    toolbar: ['+ 新建盘点'],
    columns: ['盘点单号', '门店', '盘点类型', 'SKU 数', '差异数', '状态', '盘点人', '创建时间', '操作'],
    rows: [
      ['CHK20260528001', '朝阳店', '全盘', '856', '3', tag('盘点中', 'pending'), '赵店长', '2026-05-28 08:00', actions(['详情', '录入', '完成'])],
      ['CHK20260525001', '海淀店', '抽盘', '120', '0', tag('已完成', 'on'), '钱店长', '2026-05-25 14:00', actions(['详情', '导出'])],
    ],
    total: 128,
  },
  'inv-transfer': {
    type: 'list',
    breadcrumb: '库存管理 / 调拨管理',
    search: [{ label: '调拨单号', width: 160 }, { label: '状态', type: 'select', options: ['全部', '待出库', '在途', '已完成', '已取消'] }],
    toolbar: ['+ 新建调拨'],
    columns: ['调拨单号', '调出门店', '调入门店', 'SKU 数', '总数量', '状态', '创建人', '创建时间', '操作'],
    rows: [
      ['TRF20260528001', '朝阳店', '海淀店', '5', '120', tag('在途', 'delivering'), 'zhangsan', '2026-05-28 09:00', actions(['详情', '确认入库'])],
      ['TRF20260526001', '西城店', '朝阳店', '3', '50', tag('已完成', 'on'), 'lisi', '2026-05-26 11:00', actions(['详情'])],
    ],
    total: 256,
  },
  'inv-inbound': {
    type: 'list',
    breadcrumb: '库存管理 / 入库管理',
    search: [{ label: '入库单号', width: 160 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店'] }, { label: '入库类型', type: 'select', options: ['全部', '采购入库', '调拨入库', '退货入库'] }, { label: '状态', type: 'select', options: ['全部', '待入库', '已入库'] }],
    toolbar: ['+ 新建入库'],
    columns: ['入库单号', '门店', '入库类型', '关联单号', 'SKU 数', '总数量', '状态', '入库时间', '操作'],
    rows: [
      ['IN20260528001', '朝阳店', '采购入库', 'PO20260525001', '10', '500', tag('待入库', 'pending'), '—', actions(['详情', '确认入库'])],
      ['IN20260527001', '海淀店', '调拨入库', 'TRF20260526001', '3', '50', tag('已入库', 'on'), '2026-05-27 10:00', actions(['详情'])],
    ],
    total: 1890,
  },
  'inv-expiry': {
    type: 'list',
    breadcrumb: '库存管理 / 效期预警',
    search: [{ label: 'SKU/商品名', width: 180 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '预警级别', type: 'select', options: ['全部', '≤30天', '≤90天', '已过期'] }],
    toolbar: ['导出', '批量下架'],
    columns: ['门店', 'SKU 编码', '商品名称', '批号', '有效期', '剩余天数', '库存', '预警级别', '操作'],
    rows: [
      ['朝阳店', 'SKU10086010', '维生素C片', '20250101', '2026-06-15', '18天', '45', tag('≤30天', 'off'), actions(['详情', '促销', '下架'])],
      ['海淀店', 'SKU10086011', '感冒灵颗粒', '20250201', '2026-08-20', '84天', '32', tag('≤90天', 'pending'), actions(['详情', '促销'])],
      ['西城店', 'SKU10086012', '板蓝根颗粒', '20240101', '2026-04-01', tag('已过期', 'off'), '5', tag('已过期', 'off'), actions(['详情', '报损'])],
    ],
    total: 23,
  },

  /* ========== 订单管理 ========== */
  'ord-list': {
    type: 'list',
    breadcrumb: '订单管理 / 订单列表',
    search: [{ label: '订单号', width: 180 }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东', '自营'] }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '状态', type: 'select', options: ['全部', '待支付', '待拣货', '配送中', '已完成'] }, { label: '下单时间', width: 240 }],
    toolbar: ['导出'],
    columns: ['订单号', '渠道', '门店', '金额', '状态', '收货人', '下单时间', '操作'],
    rows: [
      [link('ORD202605280001'), tag('美团', 'meituan'), '朝阳店', '¥128.50', tag('待拣货', 'picking'), '张** 138****5678', '2026-05-28 10:32', actions(['详情', '拣货', '取消'])],
      [link('ORD202605280002'), tag('饿了么', 'eleme'), '海淀店', '¥86.00', tag('配送中', 'delivering'), '李** 139****1234', '2026-05-28 10:15', actions(['详情', '跟踪'])],
      [link('ORD202605280003'), tag('京东', 'jd'), '西城店', '¥256.80', tag('待支付', 'pending'), '王** 137****9876', '2026-05-28 09:58', actions(['详情', '取消'])],
    ],
    total: 1286,
  },
  'ord-after-sale': {
    type: 'list',
    breadcrumb: '订单管理 / 售后管理',
    search: [{ label: '售后单号', width: 160 }, { label: '原订单号', width: 160 }, { label: '类型', type: 'select', options: ['全部', '仅退款', '退货退款'] }, { label: '状态', type: 'select', options: ['全部', '待审核', '已同意', '已拒绝', '已完成'] }],
    toolbar: ['导出'],
    columns: ['售后单号', '原订单号', '渠道', '类型', '退款金额', '状态', '申请时间', '操作'],
    rows: [
      ['AS20260528001', 'ORD202605270088', tag('美团', 'meituan'), '仅退款', '¥28.00', tag('待审核', 'pending'), '2026-05-28 09:00', actions(['详情', '同意', '拒绝'])],
      ['AS20260527001', 'ORD202605260050', tag('饿了么', 'eleme'), '退货退款', '¥86.00', tag('已完成', 'on'), '2026-05-27 15:30', actions(['详情'])],
    ],
    total: 89,
  },

  /* ========== 门店管理 ========== */
  'sto-list': {
    type: 'list',
    breadcrumb: '门店管理 / 门店列表',
    search: [{ label: '门店名称', width: 160 }, { label: '城市', type: 'select', options: ['全部', '北京', '上海', '广州'] }, { label: '状态', type: 'select', options: ['全部', '营业中', '休息中', '已关闭'] }],
    toolbar: ['+ 新增门店', '导出'],
    columns: ['门店编码', '门店名称', '城市', '地址', '店长', '联系电话', '处方药', '状态', '操作'],
    rows: [
      ['STO001', '朝阳店', '北京', '朝阳区建国路88号', '赵店长', '010-66661001', tag('支持', 'on'), tag('营业中', 'on'), actions(['编辑', '配送范围', '关闭'])],
      ['STO002', '海淀店', '北京', '海淀区中关村大街1号', '钱店长', '010-66661002', tag('支持', 'on'), tag('营业中', 'on'), actions(['编辑', '配送范围', '关闭'])],
      ['STO003', '西城店', '北京', '西城区西单北大街120号', '孙店长', '010-66661003', tag('不支持', 'off'), tag('休息中', 'pending'), actions(['编辑', '配送范围', '关闭'])],
    ],
    total: 12,
  },
  'sto-delivery': {
    type: 'map',
    breadcrumb: '门店管理 / 配送范围',
    search: [{ label: '选择门店', type: 'select', options: ['朝阳店', '海淀店', '西城店'] }],
    mapTitle: '配送范围绘制（高德地图）',
    mapHint: '在地图上绘制多边形配送范围，支持拖拽编辑顶点',
  },

  /* ========== 渠道管理 ========== */
  'chn-config': {
    type: 'form-cards',
    breadcrumb: '渠道管理 / 渠道配置',
    cards: [
      { title: '美团闪购', channel: 'meituan', fields: [{ label: 'App Key', value: 'mt_****_key' }, { label: 'App Secret', value: '******' }, { label: '回调 URL', value: 'https://erp.zhihe.com/api/v1/channel/meituan/callback' }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
      { title: '饿了么零售', channel: 'eleme', fields: [{ label: 'App Key', value: 'ele_****_key' }, { label: 'App Secret', value: '******' }, { label: '回调 URL', value: 'https://erp.zhihe.com/api/v1/channel/eleme/callback' }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
      { title: '京东到家', channel: 'jd', fields: [{ label: 'App Key', value: 'jd_****_key' }, { label: 'App Secret', value: '******' }, { label: '回调 URL', value: 'https://erp.zhihe.com/api/v1/channel/jd/callback' }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
    ],
  },
  'chn-store-map': {
    type: 'list',
    breadcrumb: '渠道管理 / 门店映射',
    search: [{ label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '映射状态', type: 'select', options: ['全部', '已映射', '未映射'] }],
    toolbar: ['批量映射', '同步门店'],
    columns: ['中台门店', '渠道', '平台门店 ID', '平台门店名称', '映射状态', '最后同步', '操作'],
    rows: [
      ['朝阳店', tag('美团', 'meituan'), 'MT_POI_10001', '智合医药(朝阳店)', tag('已映射', 'on'), '2026-05-28 08:00', actions(['编辑', '解绑', '同步'])],
      ['朝阳店', tag('饿了么', 'eleme'), 'ELM_20001', '智合医药朝阳店', tag('已映射', 'on'), '2026-05-28 08:00', actions(['编辑', '解绑', '同步'])],
      ['海淀店', tag('京东', 'jd'), '—', '—', tag('未映射', 'off'), '—', actions(['映射', '同步'])],
    ],
    total: 36,
  },
  'chn-product-map': {
    type: 'list',
    breadcrumb: '渠道管理 / 商品映射',
    search: [{ label: 'SKU 编码/名称', width: 180 }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '映射状态', type: 'select', options: ['全部', '已映射', '未映射', '同步失败'] }],
    toolbar: ['批量映射', '同步商品'],
    columns: ['SKU 编码', '商品名称', '渠道', '平台商品 ID', '映射状态', '最后同步', '操作'],
    rows: [
      ['SKU10086001', '阿莫西林胶囊', tag('美团', 'meituan'), 'MT_ITEM_88001', tag('已映射', 'on'), '2026-05-28 07:00', actions(['编辑', '同步'])],
      ['SKU10086002', '布洛芬缓释胶囊', tag('饿了么', 'eleme'), 'ELM_ITEM_99001', tag('同步失败', 'off'), '2026-05-28 06:30', actions(['编辑', '重试', '日志'])],
      ['SKU10086003', '连花清瘟胶囊', tag('京东', 'jd'), '—', tag('未映射', 'pending'), '—', actions(['映射', '同步'])],
    ],
    total: 10680,
  },
  'chn-sync': {
    type: 'list',
    breadcrumb: '渠道管理 / 同步任务',
    search: [{ label: '任务类型', type: 'select', options: ['全部', '商品同步', '库存同步', '门店同步'] }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '状态', type: 'select', options: ['全部', '待执行', '执行中', '成功', '失败'] }],
    toolbar: ['+ 创建任务', '立即同步全部库存'],
    columns: ['任务编号', '任务类型', '渠道', '范围', '状态', '成功/失败', '创建时间', '操作'],
    rows: [
      ['SYNC20260528001', '库存同步', tag('美团', 'meituan'), '全部门店', tag('执行中', 'delivering'), '856/856', '2026-05-28 08:00', actions(['详情', '停止'])],
      ['SYNC20260528002', '商品同步', tag('饿了么', 'eleme'), '朝阳店', tag('失败', 'off'), '120/123', '2026-05-28 07:30', actions(['详情', '重试'])],
    ],
    total: 520,
  },
  'chn-sync-log': {
    type: 'list',
    breadcrumb: '渠道管理 / 同步日志',
    search: [{ label: '任务编号', width: 160 }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '结果', type: 'select', options: ['全部', '成功', '失败'] }],
    toolbar: ['导出'],
    columns: ['日志 ID', '任务编号', '渠道', '同步类型', '对象', '结果', '错误信息', '时间'],
    rows: [
      ['LOG001', 'SYNC20260528002', tag('饿了么', 'eleme'), '商品', 'SKU10086002', tag('失败', 'off'), '类目不匹配', '2026-05-28 07:31'],
      ['LOG002', 'SYNC20260528001', tag('美团', 'meituan'), '库存', 'SKU10086001', tag('成功', 'on'), '—', '2026-05-28 08:01'],
    ],
    total: 12580,
  },

  /* ========== 会员管理 ========== */
  'mem-list': {
    type: 'list',
    breadcrumb: '会员管理 / 会员列表',
    search: [{ label: '手机号', width: 160 }, { label: '会员等级', type: 'select', options: ['全部', '普通', '银卡', '金卡', '钻石'] }, { label: '注册时间', width: 240 }],
    toolbar: ['导出'],
    columns: ['会员 ID', '昵称', '手机号', '等级', '积分', '累计消费', '注册渠道', '注册时间', '操作'],
    rows: [
      ['M100001', '健康达人', '138****5678', tag('金卡', 'on'), '2,580', '¥12,680', tag('美团', 'meituan'), '2025-06-15', actions(['详情', '积分', '优惠券'])],
      ['M100002', '养生一族', '139****1234', tag('银卡', 'otc'), '860', '¥3,200', tag('自营', 'self'), '2025-08-20', actions(['详情', '积分', '优惠券'])],
    ],
    total: 15680,
  },
  'mem-level': {
    type: 'list',
    breadcrumb: '会员管理 / 等级管理',
    toolbar: ['+ 新增等级'],
    columns: ['等级名称', '等级编码', '升级条件(消费额)', '折扣', '积分倍率', '排序', '状态', '操作'],
    rows: [
      ['普通会员', 'normal', '¥0', '无', '1x', '1', tag('启用', 'on'), actions(['编辑', '删除'])],
      ['银卡会员', 'silver', '¥1,000', '98折', '1.2x', '2', tag('启用', 'on'), actions(['编辑', '删除'])],
      ['金卡会员', 'gold', '¥5,000', '95折', '1.5x', '3', tag('启用', 'on'), actions(['编辑', '删除'])],
      ['钻石会员', 'diamond', '¥20,000', '92折', '2x', '4', tag('启用', 'on'), actions(['编辑', '删除'])],
    ],
    total: 4,
  },
  'mem-point': {
    type: 'list',
    breadcrumb: '会员管理 / 积分管理',
    search: [{ label: '会员手机号', width: 160 }, { label: '变动类型', type: 'select', options: ['全部', '消费获得', '签到', '兑换消耗', '过期'] }],
    toolbar: ['导出', '积分规则设置'],
    columns: ['流水号', '会员', '变动类型', '变动积分', '剩余积分', '关联订单', '时间'],
    rows: [
      ['PT20260528001', '138****5678', tag('消费获得', 'on'), '+128', '2,580', 'ORD202605280001', '2026-05-28 10:35'],
      ['PT20260527001', '139****1234', tag('兑换消耗', 'off'), '-500', '860', '—', '2026-05-27 18:00'],
    ],
    total: 89560,
  },
  'mem-coupon': {
    type: 'list',
    breadcrumb: '会员管理 / 优惠券管理',
    search: [{ label: '优惠券名称', width: 160 }, { label: '类型', type: 'select', options: ['全部', '满减', '折扣', '无门槛'] }, { label: '状态', type: 'select', options: ['全部', '进行中', '已结束', '未开始'] }],
    toolbar: ['+ 新建优惠券', '发放记录'],
    columns: ['优惠券名称', '类型', '面额/折扣', '使用门槛', '已领/总量', '有效期', '状态', '操作'],
    rows: [
      ['新人满50减10', '满减', '¥10', '满¥50', '1280/5000', '2026-06-30', tag('进行中', 'on'), actions(['编辑', '发放', '停用'])],
      ['会员9折券', '折扣', '9折', '满¥100', '560/1000', '2026-05-31', tag('进行中', 'on'), actions(['编辑', '发放', '停用'])],
    ],
    total: 28,
  },

  /* ========== 采购管理 ========== */
  'pur-supplier': {
    type: 'list',
    breadcrumb: '采购管理 / 供应商管理',
    search: [{ label: '供应商名称', width: 180 }, { label: '状态', type: 'select', options: ['全部', '合作中', '已停用'] }],
    toolbar: ['+ 新增供应商', '导出'],
    columns: ['供应商编码', '供应商名称', '联系人', '联系电话', '资质有效期', '合作 SKU 数', '状态', '操作'],
    rows: [
      ['SUP001', '华润医药商业', '王经理', '010-88880001', '2027-12-31', '856', tag('合作中', 'on'), actions(['编辑', '资质', '停用'])],
      ['SUP002', '国药控股', '李经理', '010-88880002', '2026-08-15', tag('即将到期', 'pending'), '620', tag('合作中', 'on'), actions(['编辑', '资质', '停用'])],
    ],
    total: 15,
  },
  'pur-order': {
    type: 'list',
    breadcrumb: '采购管理 / 采购单',
    search: [{ label: '采购单号', width: 160 }, { label: '供应商', type: 'select', options: ['全部', '华润医药', '国药控股'] }, { label: '状态', type: 'select', options: ['全部', '待审核', '已审核', '部分入库', '已完成', '已取消'] }],
    toolbar: ['+ 新建采购单', '导出'],
    columns: ['采购单号', '供应商', 'SKU 数', '采购金额', '状态', '采购员', '创建时间', '操作'],
    rows: [
      ['PO20260525001', '华润医药商业', '10', '¥28,600', tag('部分入库', 'pending'), 'zhangsan', '2026-05-25 10:00', actions(['详情', '审核', '入库'])],
      ['PO20260520001', '国药控股', '5', '¥12,300', tag('已完成', 'on'), 'lisi', '2026-05-20 14:00', actions(['详情'])],
    ],
    total: 386,
  },
  'pur-return': {
    type: 'list',
    breadcrumb: '采购管理 / 采购退货',
    search: [{ label: '退货单号', width: 160 }, { label: '状态', type: 'select', options: ['全部', '待审核', '已出库', '已完成'] }],
    toolbar: ['+ 新建退货'],
    columns: ['退货单号', '原采购单', '供应商', 'SKU 数', '退货金额', '状态', '创建时间', '操作'],
    rows: [
      ['PR20260528001', 'PO20260510001', '华润医药商业', '2', '¥1,280', tag('待审核', 'pending'), '2026-05-28 09:00', actions(['详情', '审核', '出库'])],
    ],
    total: 45,
  },

  /* ========== 财务管理 ========== */
  'fin-bill': {
    type: 'list',
    breadcrumb: '财务管理 / 平台账单',
    search: [{ label: '账单周期', width: 240 }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '状态', type: 'select', options: ['全部', '待确认', '已确认', '有差异'] }],
    toolbar: ['导入账单', '导出'],
    columns: ['账单编号', '渠道', '账单周期', '订单数', '平台金额', '中台金额', '差异', '状态', '操作'],
    rows: [
      ['BILL202605001', tag('美团', 'meituan'), '2026-05-01 ~ 2026-05-07', '1,256', '¥86,420', '¥86,380', '¥40', tag('有差异', 'pending'), actions(['详情', '对账'])],
      ['BILL202605002', tag('饿了么', 'eleme'), '2026-05-01 ~ 2026-05-07', '980', '¥62,100', '¥62,100', '¥0', tag('已确认', 'on'), actions(['详情'])],
    ],
    total: 52,
  },
  'fin-reconcile': {
    type: 'list',
    breadcrumb: '财务管理 / 订单对账',
    search: [{ label: '订单号', width: 160 }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东'] }, { label: '对账结果', type: 'select', options: ['全部', '一致', '金额差异', '缺失'] }],
    toolbar: ['开始对账', '导出差异'],
    columns: ['订单号', '渠道', '中台金额', '平台金额', '差异', '对账结果', '对账时间', '操作'],
    rows: [
      ['ORD202605200088', tag('美团', 'meituan'), '¥128.50', '¥128.00', '¥0.50', tag('金额差异', 'pending'), '2026-05-28 08:00', actions(['详情', '处理'])],
      ['ORD202605200089', tag('饿了么', 'eleme'), '¥86.00', '¥86.00', '¥0', tag('一致', 'on'), '2026-05-28 08:00', actions(['详情'])],
    ],
    total: 3280,
  },
  'fin-settlement': {
    type: 'list',
    breadcrumb: '财务管理 / 门店结算',
    search: [{ label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '结算周期', width: 240 }],
    toolbar: ['生成结算', '导出'],
    columns: ['结算编号', '门店', '结算周期', '订单数', '销售额', '平台佣金', '配送费', '应结金额', '状态', '操作'],
    rows: [
      ['SET202605001', '朝阳店', '2026-05-01 ~ 2026-05-07', '520', '¥38,600', '¥3,860', '¥2,600', '¥32,140', tag('待确认', 'pending'), actions(['详情', '确认'])],
      ['SET202605002', '海淀店', '2026-05-01 ~ 2026-05-07', '380', '¥28,200', '¥2,820', '¥1,900', '¥23,480', tag('已结算', 'on'), actions(['详情'])],
    ],
    total: 84,
  },

  /* ========== 处方管理 ========== */
  'rx-pending': {
    type: 'list',
    breadcrumb: '处方管理 / 待审核处方',
    search: [{ label: '订单号', width: 160 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }],
    toolbar: [],
    columns: ['处方编号', '关联订单', '门店', '患者', '药品数', '处方图片', '提交时间', '等待时长', '操作'],
    rows: [
      ['RX20260528001', link('ORD202605280001'), '朝阳店', '张**', '2', thumb('📄'), '2026-05-28 10:32', '15分钟', actions(['审核', '查看'])],
      ['RX20260528002', link('ORD202605280005'), '海淀店', '李**', '1', thumb('📄'), '2026-05-28 10:20', '27分钟', actions(['审核', '查看'])],
    ],
    total: 5,
  },
  'rx-list': {
    type: 'list',
    breadcrumb: '处方管理 / 处方记录',
    search: [{ label: '处方编号', width: 160 }, { label: '审核状态', type: 'select', options: ['全部', '已通过', '已驳回'] }, { label: '审核时间', width: 240 }],
    toolbar: ['导出'],
    columns: ['处方编号', '关联订单', '门店', '患者', '审核药师', '审核结果', '审核时间', '操作'],
    rows: [
      ['RX20260527001', 'ORD202605270050', '朝阳店', '王**', '药师刘', tag('已通过', 'on'), '2026-05-27 16:05', actions(['详情', '查看处方'])],
      ['RX20260527002', 'ORD202605270055', '海淀店', '赵**', '药师陈', tag('已驳回', 'off'), '2026-05-27 17:20', actions(['详情', '查看处方'])],
    ],
    total: 1280,
  },
  'rx-log': {
    type: 'list',
    breadcrumb: '处方管理 / 审核日志',
    search: [{ label: '处方编号', width: 160 }, { label: '审核药师', width: 140 }],
    toolbar: ['导出'],
    columns: ['日志 ID', '处方编号', '审核药师', '审核结果', '驳回原因', '审核时间', '操作'],
    rows: [
      ['RXLOG001', 'RX20260527002', '药师陈', tag('已驳回', 'off'), '用药剂量与处方不符', '2026-05-27 17:20', actions(['详情'])],
      ['RXLOG002', 'RX20260527001', '药师刘', tag('已通过', 'on'), '—', '2026-05-27 16:05', actions(['详情'])],
    ],
    total: 2560,
  },

  /* ========== 配送管理 ========== */
  'del-list': {
    type: 'list',
    breadcrumb: '配送管理 / 配送单列表',
    search: [{ label: '配送单号', width: 160 }, { label: '关联订单', width: 160 }, { label: '配送方式', type: 'select', options: ['全部', '自配送', '达达', '蜂鸟'] }, { label: '状态', type: 'select', options: ['全部', '待接单', '配送中', '已送达', '异常'] }],
    toolbar: ['导出'],
    columns: ['配送单号', '关联订单', '门店', '配送方式', '骑手', '状态', '预计送达', '操作'],
    rows: [
      ['DEL20260528001', link('ORD202605280002'), '海淀店', '达达', '骑手张', tag('配送中', 'delivering'), '11:00', actions(['详情', '跟踪', '催单'])],
      ['DEL20260528002', link('ORD202605280001'), '朝阳店', '自配送', '店员李', tag('待接单', 'pending'), '10:50', actions(['详情', '指派'])],
    ],
    total: 986,
  },
  'del-track': {
    type: 'map',
    breadcrumb: '配送管理 / 配送跟踪',
    search: [{ label: '配送单号', width: 180, placeholder: 'DEL20260528001' }],
    mapTitle: '实时配送轨迹（高德地图）',
    mapHint: '显示骑手位置、门店位置、收货地址及配送路线',
    trackInfo: { order: 'ORD202605280002', rider: '骑手张', phone: '138****9999', status: '配送中', eta: '11:00' },
  },

  /* ========== 报表中心 ========== */
  'rpt-sales': {
    type: 'report',
    breadcrumb: '报表中心 / 销售报表',
    search: [{ label: '时间范围', width: 240 }, { label: '门店', type: 'select', options: ['全部门店', '朝阳店', '海淀店'] }, { label: '渠道', type: 'select', options: ['全部', '美团', '饿了么', '京东', '自营'] }],
    toolbar: ['导出 Excel'],
    chartTitle: '销售趋势',
    columns: ['日期', '门店', '渠道', '订单数', '销售额', '客单价', '退款额'],
    rows: [
      ['2026-05-28', '朝阳店', '美团', '186', '¥12,680', '¥68.17', '¥280'],
      ['2026-05-28', '朝阳店', '饿了么', '142', '¥9,860', '¥69.44', '¥120'],
      ['2026-05-28', '海淀店', '京东', '98', '¥8,200', '¥83.67', '¥0'],
    ],
  },
  'rpt-stock': {
    type: 'report',
    breadcrumb: '报表中心 / 库存报表',
    search: [{ label: '门店', type: 'select', options: ['全部门店', '朝阳店'] }, { label: '分类', type: 'select', options: ['全部分类', '中西成药', '医疗器械'] }],
    toolbar: ['导出 Excel'],
    chartTitle: '库存周转分析',
    columns: ['门店', 'SKU 数', '库存总量', '库存金额', '周转天数', '预警 SKU', '近效期 SKU'],
    rows: [
      ['朝阳店', '856', '45,680', '¥1,286,000', '28天', '12', '5'],
      ['海淀店', '720', '38,200', '¥986,000', '32天', '8', '3'],
    ],
  },
  'rpt-purchase': {
    type: 'report',
    breadcrumb: '报表中心 / 采购报表',
    search: [{ label: '时间范围', width: 240 }, { label: '供应商', type: 'select', options: ['全部', '华润医药', '国药控股'] }],
    toolbar: ['导出 Excel'],
    chartTitle: '采购金额趋势',
    columns: ['月份', '供应商', '采购单数', '采购金额', '入库金额', '退货金额'],
    rows: [
      ['2026-05', '华润医药商业', '12', '¥286,000', '¥268,000', '¥5,200'],
      ['2026-05', '国药控股', '8', '¥156,000', '¥150,000', '¥2,800'],
    ],
  },
  'rpt-analysis': {
    type: 'report',
    breadcrumb: '报表中心 / 经营分析',
    search: [{ label: '时间范围', width: 240 }],
    toolbar: ['导出 PDF'],
    chartTitle: '经营指标概览',
    statCards: [
      { label: '总销售额', value: '¥586,420', trend: '↑ 12%' },
      { label: '总订单数', value: '8,620', trend: '↑ 8%' },
      { label: '毛利率', value: '32.5%', trend: '↑ 1.2%' },
      { label: '复购率', value: '28.6%', trend: '↑ 3.1%' },
    ],
    columns: ['指标', '本期', '上期', '环比', '同比'],
    rows: [
      ['销售额', '¥586,420', '¥523,100', '+12.1%', '+25.3%'],
      ['订单数', '8,620', '7,980', '+8.0%', '+18.6%'],
      ['客单价', '¥68.03', '¥65.55', '+3.8%', '+5.6%'],
      ['新会员', '1,280', '1,050', '+21.9%', '+32.0%'],
    ],
  },
};

/* ========== 辅助函数（构建表格 HTML 片段） ========== */
function tag(text, type) {
  return { __html: true, value: `<span class="tag tag-${type}">${text}</span>` };
}
function actions(items) {
  return {
    __html: true,
    value: `<div class="action-btns">${items.map((a, i) => `<a href="javascript:void(0)"${i === items.length - 1 && ['删除', '取消', '停用', '驳回', '解绑', '报损'].includes(a) ? ' class="danger"' : ''}>${a}</a>`).join('')}</div>`,
  };
}
function link(text) {
  return { __html: true, value: `<span class="text-link" role="button" tabindex="0">${text}</span>` };
}
function thumb(emoji) {
  return { __html: true, value: `<div class="product-thumb">${emoji}</div>` };
}

function cellValue(cell) {
  if (cell && cell.__html) return cell.value;
  return cell ?? '—';
}
