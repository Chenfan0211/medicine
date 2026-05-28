/**
 * 全量侧边栏菜单配置
 */
const MENU_CONFIG = [
  { id: 'dashboard', icon: '📊', label: '首页', page: 'dashboard' },
  {
    group: '系统管理',
    icon: '⚙️',
    children: [
      { id: 'sys-user', label: '用户管理', page: 'sys-user' },
      { id: 'sys-role', label: '角色管理', page: 'sys-role' },
      { id: 'sys-menu', label: '菜单管理', page: 'sys-menu' },
      { id: 'sys-dept', label: '部门管理', page: 'sys-dept' },
      { id: 'sys-dict', label: '字典管理', page: 'sys-dict' },
      { id: 'sys-config', label: '参数设置', page: 'sys-config' },
      { id: 'sys-oper-log', label: '操作日志', page: 'sys-oper-log' },
      { id: 'sys-login-log', label: '登录日志', page: 'sys-login-log' },
    ],
  },
  {
    group: '商品管理',
    icon: '📦',
    children: [
      { id: 'prd-category', label: '分类管理', page: 'prd-category' },
      { id: 'prd-brand', label: '品牌管理', page: 'prd-brand' },
      { id: 'prd-spu', label: 'SPU 管理', page: 'prd-spu' },
      { id: 'prd-sku', label: 'SKU 管理', page: 'prd-sku' },
    ],
  },
  {
    group: '库存管理',
    icon: '📋',
    children: [
      { id: 'inv-stock', label: '库存查询', page: 'inv-stock' },
      { id: 'inv-log', label: '库存流水', page: 'inv-log' },
      { id: 'inv-check', label: '盘点管理', page: 'inv-check' },
      { id: 'inv-transfer', label: '调拨管理', page: 'inv-transfer' },
      { id: 'inv-inbound', label: '入库管理', page: 'inv-inbound' },
      { id: 'inv-expiry', label: '效期预警', page: 'inv-expiry' },
    ],
  },
  {
    group: '订单管理',
    icon: '🛒',
    children: [
      { id: 'ord-list', label: '订单列表', page: 'ord-list' },
      { id: 'ord-after-sale', label: '售后管理', page: 'ord-after-sale' },
    ],
  },
  {
    group: '门店管理',
    icon: '🏪',
    children: [
      { id: 'sto-list', label: '门店列表', page: 'sto-list' },
      { id: 'sto-delivery', label: '配送范围', page: 'sto-delivery' },
    ],
  },
  {
    group: '渠道管理',
    icon: '🔗',
    children: [
      { id: 'chn-config', label: '渠道配置', page: 'chn-config' },
      { id: 'chn-store-map', label: '门店映射', page: 'chn-store-map' },
      { id: 'chn-product-map', label: '商品映射', page: 'chn-product-map' },
      { id: 'chn-sync', label: '同步任务', page: 'chn-sync' },
      { id: 'chn-sync-log', label: '同步日志', page: 'chn-sync-log' },
    ],
  },
  {
    group: '会员管理',
    icon: '👥',
    children: [
      { id: 'mem-list', label: '会员列表', page: 'mem-list' },
      { id: 'mem-level', label: '等级管理', page: 'mem-level' },
      { id: 'mem-point', label: '积分管理', page: 'mem-point' },
      { id: 'mem-coupon', label: '优惠券管理', page: 'mem-coupon' },
    ],
  },
  {
    group: '采购管理',
    icon: '🛍️',
    children: [
      { id: 'pur-supplier', label: '供应商管理', page: 'pur-supplier' },
      { id: 'pur-order', label: '采购单', page: 'pur-order' },
      { id: 'pur-return', label: '采购退货', page: 'pur-return' },
    ],
  },
  {
    group: '财务管理',
    icon: '💰',
    children: [
      { id: 'fin-bill', label: '平台账单', page: 'fin-bill' },
      { id: 'fin-reconcile', label: '订单对账', page: 'fin-reconcile' },
      { id: 'fin-settlement', label: '门店结算', page: 'fin-settlement' },
    ],
  },
  {
    group: '处方管理',
    icon: '💊',
    children: [
      { id: 'rx-pending', label: '待审核处方', page: 'rx-pending' },
      { id: 'rx-list', label: '处方记录', page: 'rx-list' },
      { id: 'rx-log', label: '审核日志', page: 'rx-log' },
    ],
  },
  {
    group: '配送管理',
    icon: '🚚',
    children: [
      { id: 'del-list', label: '配送单列表', page: 'del-list' },
      { id: 'del-track', label: '配送跟踪', page: 'del-track' },
    ],
  },
  {
    group: '报表中心',
    icon: '📈',
    children: [
      { id: 'rpt-sales', label: '销售报表', page: 'rpt-sales' },
      { id: 'rpt-stock', label: '库存报表', page: 'rpt-stock' },
      { id: 'rpt-purchase', label: '采购报表', page: 'rpt-purchase' },
      { id: 'rpt-analysis', label: '经营分析', page: 'rpt-analysis' },
    ],
  },
];
