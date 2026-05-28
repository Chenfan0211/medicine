/**
 * 业务数据层 — 内存存储 + localStorage 持久化 + 真实业务规则
 */
const DataStore = (() => {
  const STORAGE_KEY = 'zhihe-erp-prototype-data';
  const PAGE_SIZE = 20;

  let state = null;
  let drawerCtx = null;

  const channelTag = { 美团: 'meituan', 饿了么: 'eleme', 京东: 'jd', 自营: 'self' };
  const orderStatusTag = {
    待支付: 'pending', 待处方审核: 'rx', 待拣货: 'picking', 待配送: 'pending',
    配送中: 'delivering', 已完成: 'done', 已取消: 'cancel', 售后中: 'off',
  };

  function uid(prefix) {
    return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  }

  function nowStr() {
    return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  }

  function maskPhone(p) {
    if (!p || p.includes('*')) return p;
    return p.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  function seed() {
    return {
      users: [
        { id: 'U1', username: 'admin', nickname: '管理员', dept: '总部', phone: '13800000001', status: '正常', createdAt: '2026-01-01 09:00' },
        { id: 'U2', username: 'zhangsan', nickname: '张三', dept: '运营部', phone: '13812341234', status: '正常', createdAt: '2026-02-15 10:20' },
        { id: 'U3', username: 'lisi', nickname: '李四', dept: '门店部', phone: '13956785678', status: '停用', createdAt: '2026-03-20 14:30' },
      ],
      roles: [
        { id: 'R1', name: '超级管理员', code: 'admin', sort: 1, status: '正常', createdAt: '2026-01-01' },
        { id: 'R2', name: '运营人员', code: 'operator', sort: 2, status: '正常', createdAt: '2026-01-05' },
        { id: 'R3', name: '门店店长', code: 'store_manager', sort: 3, status: '正常', createdAt: '2026-01-10' },
        { id: 'R4', name: '药师', code: 'pharmacist', sort: 4, status: '正常', createdAt: '2026-02-01' },
      ],
      skus: [
        { id: 'SKU10086001', name: '阿莫西林胶囊', spec: '0.25g×24粒', approvalNo: '国药准字H13020983', manufacturer: '石药集团欧意药业', price: 12.8, isRx: true, status: '上架', category: '感冒用药', emoji: '💊' },
        { id: 'SKU10086002', name: '布洛芬缓释胶囊', spec: '0.3g×20粒', approvalNo: '国药准字H10900089', manufacturer: '中美天津史克制药', price: 18.5, isRx: false, status: '上架', category: '感冒用药', emoji: '💊' },
        { id: 'SKU10086003', name: '连花清瘟胶囊', spec: '0.35g×24粒', approvalNo: '国药准字Z20040063', manufacturer: '石家庄以岭药业', price: 28, isRx: false, status: '上架', category: '感冒用药', emoji: '💊' },
        { id: 'SKU10086004', name: '二甲双胍片', spec: '0.5g×30片', approvalNo: '国药准字H11021425', manufacturer: '北京京丰制药', price: 15.6, isRx: true, status: '下架', category: '心脑血管', emoji: '💊' },
        { id: 'SKU10086005', name: '胰岛素注射液', spec: '3ml:300单位', approvalNo: '国药准字S20100003', manufacturer: '诺和诺德制药', price: 68, isRx: true, status: '上架', category: '心脑血管', emoji: '🧊' },
      ],
      stores: [
        { id: 'STO001', name: '朝阳店', city: '北京', address: '朝阳区建国路88号', manager: '赵店长', phone: '010-66661001', rxSupport: true, status: '营业中' },
        { id: 'STO002', name: '海淀店', city: '北京', address: '海淀区中关村大街1号', manager: '钱店长', phone: '010-66661002', rxSupport: true, status: '营业中' },
        { id: 'STO003', name: '西城店', city: '北京', address: '西城区西单北大街120号', manager: '孙店长', phone: '010-66661003', rxSupport: false, status: '休息中' },
      ],
      stocks: [
        { id: 'STK1', storeId: 'STO001', storeName: '朝阳店', skuId: 'SKU10086001', skuName: '阿莫西林胶囊', spec: '0.25g×24粒', batchNo: '20260315', expiry: '2028-03-15', qty: 156, lockQty: 3, warnThreshold: 10 },
        { id: 'STK2', storeId: 'STO001', storeName: '朝阳店', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', spec: '0.3g×20粒', batchNo: '20260201', expiry: '2027-02-01', qty: 8, lockQty: 0, warnThreshold: 10 },
        { id: 'STK3', storeId: 'STO002', storeName: '海淀店', skuId: 'SKU10086005', skuName: '胰岛素注射液', spec: '3ml:300单位', batchNo: '20260101', expiry: '2026-12-01', qty: 0, lockQty: 2, warnThreshold: 5 },
      ],
      stockLogs: [
        { id: 'LOG1', storeName: '朝阳店', skuId: 'SKU10086001', type: '出库', change: -2, afterQty: 154, refNo: 'ORD202605280001', operator: 'zhangsan', time: '2026-05-28 10:35' },
        { id: 'LOG2', storeName: '朝阳店', skuId: 'SKU10086001', type: '锁定', change: -3, afterQty: 156, refNo: 'ORD202605280003', operator: 'system', time: '2026-05-28 10:32' },
      ],
      orders: [
        { id: 'ORD202605280001', channel: '美团', storeId: 'STO001', storeName: '朝阳店', amount: 128.5, status: '待处方审核', receiver: '张伟', phone: '13812345678', createdAt: '2026-05-28 10:32:15', needRx: true, rxId: 'RX202605280001', items: [{ skuId: 'SKU10086001', qty: 2, name: '阿莫西林胶囊' }] },
        { id: 'ORD202605280002', channel: '饿了么', storeId: 'STO002', storeName: '海淀店', amount: 86, status: '配送中', receiver: '李娜', phone: '13912341234', createdAt: '2026-05-28 10:15:42', needRx: false, items: [{ skuId: 'SKU10086002', qty: 1, name: '布洛芬缓释胶囊' }] },
        { id: 'ORD202605280003', channel: '京东', storeId: 'STO003', storeName: '西城店', amount: 256.8, status: '待支付', receiver: '王强', phone: '13798769876', createdAt: '2026-05-28 09:58:03', needRx: false, items: [{ skuId: 'SKU10086003', qty: 3, name: '连花清瘟胶囊' }] },
        { id: 'ORD202605270088', channel: '自营', storeId: 'STO001', storeName: '朝阳店', amount: 45, status: '已完成', receiver: '赵敏', phone: '13643214321', createdAt: '2026-05-27 18:22:11', needRx: false, items: [{ skuId: 'SKU10086002', qty: 1, name: '布洛芬缓释胶囊' }] },
      ],
      prescriptions: [
        { id: 'RX202605280001', orderId: 'ORD202605280001', storeName: '朝阳店', patient: '张**', drugCount: 2, status: '待审核', submitTime: '2026-05-28 10:32', waitMin: 15 },
        { id: 'RX202605280002', orderId: 'ORD202605280005', storeName: '海淀店', patient: '李**', drugCount: 1, status: '待审核', submitTime: '2026-05-28 10:20', waitMin: 27 },
      ],
      rxLogs: [],
      afterSales: [
        { id: 'AS20260528001', orderId: 'ORD202605270088', channel: '美团', type: '仅退款', amount: 28, status: '待审核', createdAt: '2026-05-28 09:00' },
      ],
      members: [
        { id: 'M100001', nickname: '健康达人', phone: '13812345678', level: '金卡', points: 2580, totalSpend: 12680, channel: '美团', createdAt: '2025-06-15' },
        { id: 'M100002', nickname: '养生一族', phone: '13912341234', level: '银卡', points: 860, totalSpend: 3200, channel: '自营', createdAt: '2025-08-20' },
      ],
      suppliers: [
        { id: 'SUP001', name: '华润医药商业', contact: '王经理', phone: '010-88880001', certExpiry: '2027-12-31', skuCount: 856, status: '合作中' },
        { id: 'SUP002', name: '国药控股', contact: '李经理', phone: '010-88880002', certExpiry: '2026-08-15', skuCount: 620, status: '合作中' },
      ],
      purchaseOrders: [
        { id: 'PO20260525001', supplier: '华润医药商业', skuCount: 10, amount: 28600, status: '部分入库', buyer: 'zhangsan', createdAt: '2026-05-25 10:00' },
        { id: 'PO20260520001', supplier: '国药控股', skuCount: 5, amount: 12300, status: '已完成', buyer: 'lisi', createdAt: '2026-05-20 14:00' },
      ],
      deliveries: [
        { id: 'DEL20260528001', orderId: 'ORD202605280002', storeName: '海淀店', mode: '达达', rider: '骑手张', status: '配送中', eta: '11:00' },
        { id: 'DEL20260528002', orderId: 'ORD202605280001', storeName: '朝阳店', mode: '自配送', rider: '店员李', status: '待接单', eta: '10:50' },
      ],
      channelSyncLogs: [
        { id: 'CSL1', taskId: 'SYNC20260528002', channel: '饿了么', type: '商品', target: 'SKU10086002', success: false, error: '类目不匹配', time: '2026-05-28 07:31' },
      ],
      channelSyncTasks: [
        { id: 'SYNC20260528001', type: '库存同步', channel: '美团', scope: '全部门店', status: '执行中', progress: '856/856', createdAt: '2026-05-28 08:00' },
      ],
      operLogs: [
        { id: '10001', module: '商品管理', action: '新增 SKU', user: 'admin', ip: '192.168.1.100', time: '2026-05-28 10:30:15' },
      ],
      brands: [
        { id: 'BRD001', name: '拜耳', sort: 1, status: '启用' },
        { id: 'BRD002', name: '辉瑞', sort: 2, status: '启用' },
      ],
      spus: [
        { id: 'SPU1001', name: '阿莫西林胶囊', category: '感冒用药', brand: '石药集团', skuCount: 3, status: '上架' },
      ],
      dicts: [
        { id: 'D1', name: '订单状态', type: 'ord_status', status: '正常', remark: '订单状态枚举', createdAt: '2026-01-01' },
        { id: 'D2', name: '渠道类型', type: 'channel_type', status: '正常', remark: '美团/饿了么/京东', createdAt: '2026-01-01' },
        { id: 'D3', name: '处方审核状态', type: 'rx_status', status: '正常', remark: '处方审核', createdAt: '2026-01-05' },
        { id: 'D4', name: '权限标识', type: 'sys_perm', status: '正常', remark: '菜单权限标识', createdAt: '2026-01-01' },
      ],
      dictItems: [
        { id: 'DI001', dictType: 'sys_perm', label: '首页', value: 'dashboard', sort: 1, status: '正常' },
        { id: 'DI002', dictType: 'sys_perm', label: '商品管理', value: 'product', sort: 2, status: '正常' },
        { id: 'DI003', dictType: 'sys_perm', label: 'SKU 列表', value: 'product:sku:list', sort: 3, status: '正常' },
        { id: 'DI004', dictType: 'sys_perm', label: '订单管理', value: 'order', sort: 4, status: '正常' },
        { id: 'DI005', dictType: 'sys_perm', label: '库存查询', value: 'inventory:stock:list', sort: 5, status: '正常' },
        { id: 'DI006', dictType: 'sys_perm', label: '处方审核', value: 'rx:pending', sort: 6, status: '正常' },
        { id: 'DI007', dictType: 'sys_perm', label: '门店管理', value: 'store', sort: 7, status: '正常' },
        { id: 'DI008', dictType: 'sys_perm', label: '渠道管理', value: 'channel', sort: 8, status: '正常' },
        { id: 'DI009', dictType: 'sys_perm', label: '系统管理', value: 'system', sort: 9, status: '正常' },
        { id: 'DI010', dictType: 'sys_perm', label: '用户管理', value: 'system:user:list', sort: 10, status: '正常' },
        { id: 'DI011', dictType: 'sys_perm', label: '菜单管理', value: 'system:menu:list', sort: 11, status: '正常' },
        { id: 'DI012', dictType: 'sys_perm', label: '角色管理', value: 'system:role:list', sort: 12, status: '正常' },
        { id: 'DI101', dictType: 'ord_status', label: '待支付', value: 'pending', sort: 1, status: '正常' },
        { id: 'DI102', dictType: 'ord_status', label: '待拣货', value: 'picking', sort: 2, status: '正常' },
        { id: 'DI103', dictType: 'ord_status', label: '已完成', value: 'done', sort: 3, status: '正常' },
        { id: 'DI201', dictType: 'channel_type', label: '美团', value: 'meituan', sort: 1, status: '正常' },
        { id: 'DI202', dictType: 'channel_type', label: '饿了么', value: 'eleme', sort: 2, status: '正常' },
        { id: 'DI203', dictType: 'channel_type', label: '京东', value: 'jd', sort: 3, status: '正常' },
      ],
      coupons: [
        { id: 'CP1', name: '新人满50减10', type: '满减', value: '¥10', threshold: '满¥50', claimed: 1280, total: 5000, expiry: '2026-06-30', status: '进行中' },
        { id: 'CP2', name: '会员9折券', type: '折扣', value: '9折', threshold: '满¥100', claimed: 560, total: 1000, expiry: '2026-05-31', status: '进行中' },
      ],
      loginLogs: [
        { id: 'LL1', username: 'admin', ip: '192.168.1.100', location: '北京', browser: 'Chrome 120', status: '成功', time: '2026-05-28 08:30:00' },
        { id: 'LL2', username: 'zhangsan', ip: '192.168.1.101', location: '北京', browser: 'Edge 120', status: '成功', time: '2026-05-28 09:00:15' },
        { id: 'LL3', username: 'unknown', ip: '10.0.0.55', location: '未知', browser: '—', status: '失败', time: '2026-05-28 07:15:33' },
      ],
      menus: [
        { id: 'MENU1', name: '首页', icon: '📊', sort: 1, perm: 'dashboard', menuType: '目录', status: '正常', depth: 0 },
        { id: 'MENU2', name: '商品管理', icon: '📦', sort: 2, perm: 'product', menuType: '目录', status: '正常', depth: 0 },
        { id: 'MENU3', name: 'SKU 管理', icon: '', sort: 1, perm: 'product:sku:list', menuType: '菜单', status: '正常', depth: 2 },
        { id: 'MENU4', name: '订单管理', icon: '🛒', sort: 3, perm: 'order', menuType: '目录', status: '正常', depth: 0 },
      ],
      depts: [
        { id: 'DPT1', name: '智合医药集团', sort: 1, manager: '王总', phone: '010-88888888', status: '正常', depth: 0 },
        { id: 'DPT2', name: '运营中心', sort: 1, manager: '张经理', phone: '010-88888801', status: '正常', depth: 1 },
        { id: 'DPT3', name: '门店管理部', sort: 2, manager: '李经理', phone: '010-88888802', status: '正常', depth: 1 },
        { id: 'DPT4', name: '朝阳店', sort: 1, manager: '赵店长', phone: '010-66661001', status: '正常', depth: 2 },
      ],
      categories: [
        { id: 'CAT1', name: '中西成药', code: 'CAT001', sort: 1, status: '启用', depth: 0 },
        { id: 'CAT2', name: '感冒用药', code: 'CAT001-01', sort: 1, status: '启用', depth: 1 },
        { id: 'CAT3', name: '消化系统', code: 'CAT001-02', sort: 2, status: '启用', depth: 1 },
        { id: 'CAT4', name: '医疗器械', code: 'CAT002', sort: 2, status: '启用', depth: 0 },
      ],
      inventoryChecks: [
        { id: 'CHK20260528001', storeName: '朝阳店', checkType: '全盘', skuCount: 856, diffCount: 3, status: '盘点中', checker: '赵店长', createdAt: '2026-05-28 08:00' },
        { id: 'CHK20260525001', storeName: '海淀店', checkType: '抽盘', skuCount: 120, diffCount: 0, status: '已完成', checker: '钱店长', createdAt: '2026-05-25 14:00' },
      ],
      transfers: [
        { id: 'TRF20260528001', fromStore: '朝阳店', toStore: '海淀店', skuCount: 5, totalQty: 120, status: '在途', creator: 'zhangsan', createdAt: '2026-05-28 09:00' },
        { id: 'TRF20260526001', fromStore: '西城店', toStore: '朝阳店', skuCount: 3, totalQty: 50, status: '已完成', creator: 'lisi', createdAt: '2026-05-26 11:00' },
      ],
      inbounds: [
        { id: 'IN20260528001', storeName: '朝阳店', inboundType: '采购入库', refNo: 'PO20260525001', skuCount: 10, totalQty: 500, status: '待入库', inboundTime: '—' },
        { id: 'IN20260527001', storeName: '海淀店', inboundType: '调拨入库', refNo: 'TRF20260526001', skuCount: 3, totalQty: 50, status: '已入库', inboundTime: '2026-05-27 10:00' },
      ],
      channelStoreMaps: [
        { id: 'CSM1', storeName: '朝阳店', channel: '美团', platformId: 'MT_POI_10001', platformName: '智合医药(朝阳店)', mapped: true, lastSync: '2026-05-28 08:00' },
        { id: 'CSM2', storeName: '朝阳店', channel: '饿了么', platformId: 'ELM_20001', platformName: '智合医药朝阳店', mapped: true, lastSync: '2026-05-28 08:00' },
        { id: 'CSM3', storeName: '海淀店', channel: '京东', platformId: '', platformName: '—', mapped: false, lastSync: '—' },
      ],
      channelProductMaps: [
        { id: 'CPM1', skuId: 'SKU10086001', skuName: '阿莫西林胶囊', channel: '美团', platformId: 'MT_ITEM_88001', mapped: true, syncFailed: false, lastSync: '2026-05-28 07:00' },
        { id: 'CPM2', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', channel: '饿了么', platformId: 'ELM_ITEM_99001', mapped: true, syncFailed: true, lastSync: '2026-05-28 06:30' },
        { id: 'CPM3', skuId: 'SKU10086003', skuName: '连花清瘟胶囊', channel: '京东', platformId: '', mapped: false, syncFailed: false, lastSync: '—' },
      ],
      memberLevels: [
        { id: 'LV1', name: '普通会员', code: 'normal', threshold: 0, discount: '无', pointRate: '1x', sort: 1, status: '启用' },
        { id: 'LV2', name: '银卡会员', code: 'silver', threshold: 1000, discount: '98折', pointRate: '1.2x', sort: 2, status: '启用' },
        { id: 'LV3', name: '金卡会员', code: 'gold', threshold: 5000, discount: '95折', pointRate: '1.5x', sort: 3, status: '启用' },
        { id: 'LV4', name: '钻石会员', code: 'diamond', threshold: 20000, discount: '92折', pointRate: '2x', sort: 4, status: '启用' },
      ],
      pointLogs: [
        { id: 'PT20260528001', memberPhone: '13812345678', type: '消费获得', change: 128, balance: 2580, orderId: 'ORD202605280001', time: '2026-05-28 10:35' },
        { id: 'PT20260527001', memberPhone: '13912341234', type: '兑换消耗', change: -500, balance: 860, orderId: '—', time: '2026-05-27 18:00' },
      ],
      purchaseReturns: [
        { id: 'PR20260528001', poId: 'PO20260510001', supplier: '华润医药商业', skuCount: 2, amount: 1280, status: '待审核', createdAt: '2026-05-28 09:00' },
      ],
      bills: [
        { id: 'BILL202605001', channel: '美团', period: '2026-05-01 ~ 2026-05-07', orderCount: 1256, platformAmount: 86420, erpAmount: 86380, diff: 40, status: '有差异' },
        { id: 'BILL202605002', channel: '饿了么', period: '2026-05-01 ~ 2026-05-07', orderCount: 980, platformAmount: 62100, erpAmount: 62100, diff: 0, status: '已确认' },
      ],
      reconciles: [
        { id: 'REC1', orderId: 'ORD202605200088', channel: '美团', erpAmount: 128.5, platformAmount: 128, diff: 0.5, result: '金额差异', time: '2026-05-28 08:00' },
        { id: 'REC2', orderId: 'ORD202605200089', channel: '饿了么', erpAmount: 86, platformAmount: 86, diff: 0, result: '一致', time: '2026-05-28 08:00' },
      ],
      settlements: [
        { id: 'SET202605001', storeName: '朝阳店', period: '2026-05-01 ~ 2026-05-07', orderCount: 520, sales: 38600, commission: 3860, deliveryFee: 2600, settleAmount: 32140, status: '待确认' },
        { id: 'SET202605002', storeName: '海淀店', period: '2026-05-01 ~ 2026-05-07', orderCount: 380, sales: 28200, commission: 2820, deliveryFee: 1900, settleAmount: 23480, status: '已结算' },
      ],
      deliveryRanges: { STO001: true, STO002: false, STO003: false },
      sysConfig: {
        systemName: '智合医药 ERP 中台', pageSize: '20', sessionTimeout: '120',
        stockWarn: '10', expiryWarnDays: '90', orderCancelMin: '30',
        ossBucket: 'zhihe-erp-prod', ossEndpoint: 'oss-cn-beijing.aliyuncs.com', ossCdn: 'cdn.zhihe.com',
      },
      channelConfig: {
        meituan: { enabled: true, appKey: 'mt_****_key', lastSync: '2026-05-28 08:00' },
        eleme: { enabled: true, appKey: 'ele_****_key', lastSync: '2026-05-28 07:30' },
        jd: { enabled: true, appKey: 'jd_****_key', lastSync: '2026-05-28 08:00' },
      },
      pageFilters: {},
      pageNum: {},
    };
  }

  function mergeSeed(saved, fresh) {
    Object.keys(fresh).forEach((k) => {
      if (saved[k] === undefined || saved[k] === null) saved[k] = fresh[k];
    });
    if (!saved.pageFilters) saved.pageFilters = {};
    if (!saved.pageNum) saved.pageNum = {};
    if (!saved.deliveryRanges) saved.deliveryRanges = fresh.deliveryRanges;
    return saved;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return mergeSeed(JSON.parse(raw), seed());
    } catch (_) {}
    return seed();
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateNotifyPanel();
  }

  function addOperLog(module, action) {
    state.operLogs.unshift({
      id: uid('LOG'), module, action,
      user: localStorage.getItem('zhihe-erp-user') || 'admin',
      ip: '192.168.1.100', time: nowStr(),
    });
    if (state.operLogs.length > 200) state.operLogs.pop();
  }

  function getFilters(pageId) {
    if (!state.pageFilters[pageId]) state.pageFilters[pageId] = {};
    return state.pageFilters[pageId];
  }

  function getPageNum(pageId) {
    return state.pageNum[pageId] || 1;
  }

  function setPageNum(pageId, n) {
    state.pageNum[pageId] = n;
    persist();
  }

  /* ========== 业务操作 ========== */
  function pickOrder(orderId) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, msg: '订单不存在' };
    if (o.status === '待处方审核') return { ok: false, msg: '处方药订单需先完成处方审核' };
    if (o.needRx) {
      const rx = state.prescriptions.find((r) => r.id === o.rxId);
      if (rx && rx.status === '待审核') return { ok: false, msg: '处方药订单需先完成处方审核' };
    }
    if (o.status !== '待拣货') return { ok: false, msg: `当前状态「${o.status}」不可拣货` };
    o.status = '待配送';
    o.items.forEach((item) => {
      const st = state.stocks.find((s) => s.skuId === item.skuId && s.storeName === o.storeName);
      if (st) {
        st.qty = Math.max(0, st.qty - item.qty);
        st.lockQty = Math.max(0, st.lockQty - item.qty);
        state.stockLogs.unshift({
          id: uid('LOG'), storeName: o.storeName, skuId: item.skuId, type: '出库',
          change: -item.qty, afterQty: st.qty, refNo: o.id, operator: localStorage.getItem('zhihe-erp-user') || 'admin', time: nowStr(),
        });
      }
    });
    const del = state.deliveries.find((d) => d.orderId === orderId);
    if (del) del.status = '待接单';
    addOperLog('订单管理', `订单拣货 ${orderId}`);
    persist();
    return { ok: true, msg: '拣货完成，订单进入待配送' };
  }

  function cancelOrder(orderId) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, msg: '订单不存在' };
    if (['已完成', '已取消'].includes(o.status)) return { ok: false, msg: '订单已结束' };
    o.status = '已取消';
    o.items.forEach((item) => {
      const st = state.stocks.find((s) => s.skuId === item.skuId && s.storeName === o.storeName);
      if (st) st.lockQty = Math.max(0, st.lockQty - item.qty);
    });
    addOperLog('订单管理', `取消订单 ${orderId}`);
    persist();
    return { ok: true, msg: '订单已取消，库存锁定已释放' };
  }

  function shipOrder(orderId) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o || o.status !== '待配送') return { ok: false, msg: '订单状态不正确' };
    o.status = '配送中';
    const del = state.deliveries.find((d) => d.orderId === orderId);
    if (del) del.status = '配送中';
    addOperLog('订单管理', `订单发货 ${orderId}`);
    persist();
    return { ok: true, msg: '已发货，配送中' };
  }

  function approveRx(rxId, result, comment) {
    const rx = state.prescriptions.find((r) => r.id === rxId);
    if (!rx) return { ok: false, msg: '处方不存在' };
    const order = state.orders.find((o) => o.id === rx.orderId);
    if (result === '通过') {
      rx.status = '已通过';
      if (order && order.status === '待处方审核') order.status = '待拣货';
      state.rxLogs.unshift({ id: uid('RXL'), rxId, reviewer: localStorage.getItem('zhihe-erp-user') || '药师', result: '已通过', reason: comment || '—', time: nowStr() });
      addOperLog('处方管理', `审核通过 ${rxId}`);
      persist();
      return { ok: true, msg: '处方审核通过，订单可继续拣货' };
    }
    rx.status = '已驳回';
    if (order) order.status = '已取消';
    state.rxLogs.unshift({ id: uid('RXL'), rxId, reviewer: localStorage.getItem('zhihe-erp-user') || '药师', result: '已驳回', reason: comment || '—', time: nowStr() });
    addOperLog('处方管理', `驳回处方 ${rxId}`);
    persist();
    return { ok: true, msg: '处方已驳回，关联订单已取消' };
  }

  function toggleSkuStatus(skuId, toOn) {
    const s = state.skus.find((x) => x.id === skuId);
    if (!s) return { ok: false, msg: 'SKU 不存在' };
    s.status = toOn ? '上架' : '下架';
    addOperLog('商品管理', `${toOn ? '上架' : '下架'} SKU ${skuId}`);
    persist();
    return { ok: true, msg: `SKU 已${s.status}` };
  }

  function updateSkuPrice(skuId, price) {
    const s = state.skus.find((x) => x.id === skuId);
    if (!s) return { ok: false, msg: 'SKU 不存在' };
    s.price = parseFloat(price) || s.price;
    addOperLog('商品管理', `调价 SKU ${skuId} → ¥${s.price}`);
    persist();
    return { ok: true, msg: '价格已更新' };
  }

  function approveAfterSale(id, approve) {
    const a = state.afterSales.find((x) => x.id === id);
    if (!a) return { ok: false, msg: '售后单不存在' };
    a.status = approve ? '已完成' : '已拒绝';
    addOperLog('订单管理', `售后${approve ? '同意' : '拒绝'} ${id}`);
    persist();
    return { ok: true, msg: approve ? '已同意退款' : '已拒绝售后' };
  }

  function retryChannelSync(logId) {
    const log = state.channelSyncLogs.find((l) => l.id === logId);
    if (log) { log.success = true; log.error = '—'; }
    addOperLog('渠道管理', `重试同步 ${logId}`);
    persist();
    return { ok: true, msg: '同步重试成功' };
  }

  function runChannelSync(channel) {
    state.channelSyncTasks.unshift({
      id: uid('SYNC'), type: '库存同步', channel, scope: '全部门店', status: '执行中', progress: '0/856', createdAt: nowStr(),
    });
    const cfgKey = { 美团: 'meituan', 饿了么: 'eleme', 京东: 'jd' }[channel] || channel;
    if (state.channelConfig[cfgKey]) state.channelConfig[cfgKey].lastSync = nowStr();
    addOperLog('渠道管理', `${channel} 库存同步`);
    persist();
    return { ok: true, msg: `${channel} 同步任务已启动` };
  }

  function completeOrder(orderId) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o || o.status !== '配送中') return { ok: false, msg: '订单状态不正确' };
    o.status = '已完成';
    const del = state.deliveries.find((d) => d.orderId === orderId);
    if (del) del.status = '已完成';
    addOperLog('订单管理', `订单完成 ${orderId}`);
    persist();
    return { ok: true, msg: '订单已完成' };
  }

  function restockStock(stockId, qty) {
    const st = state.stocks.find((x) => x.id === stockId);
    if (!st) return { ok: false, msg: '库存记录不存在' };
    const n = parseInt(qty, 10) || 0;
    if (n <= 0) return { ok: false, msg: '补货数量须大于 0' };
    st.qty += n;
    state.stockLogs.unshift({
      id: uid('LOG'), storeName: st.storeName, skuId: st.skuId, type: '入库',
      change: n, afterQty: st.qty, refNo: 'RESTOCK', operator: localStorage.getItem('zhihe-erp-user') || 'admin', time: nowStr(),
    });
    addOperLog('库存管理', `补货 ${st.skuName} +${n}`);
    persist();
    return { ok: true, msg: `已补货 ${n} 件，当前库存 ${st.qty}` };
  }

  function toggleStoreStatus(storeId) {
    const st = state.stores.find((x) => x.id === storeId);
    if (!st) return { ok: false, msg: '门店不存在' };
    st.status = st.status === '营业中' ? '休息中' : '营业中';
    addOperLog('门店管理', `门店 ${st.name} → ${st.status}`);
    persist();
    return { ok: true, msg: `门店已切换为「${st.status}」` };
  }

  function completeDelivery(delId) {
    const d = state.deliveries.find((x) => x.id === delId);
    if (!d) return { ok: false, msg: '配送单不存在' };
    d.status = '已完成';
    const o = state.orders.find((x) => x.id === d.orderId);
    if (o && o.status === '配送中') o.status = '已完成';
    addOperLog('配送管理', `配送完成 ${delId}`);
    persist();
    return { ok: true, msg: '配送已完成' };
  }

  function assignDelivery(delId, rider) {
    const d = state.deliveries.find((x) => x.id === delId);
    if (!d) return { ok: false, msg: '配送单不存在' };
    d.rider = rider || '骑手待分配';
    d.status = '配送中';
    addOperLog('配送管理', `指派骑手 ${delId}`);
    persist();
    return { ok: true, msg: '骑手已指派' };
  }

  function createAfterSale(orderId) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o) return { ok: false, msg: '订单不存在' };
    const a = {
      id: uid('AS'), orderId, channel: o.channel, type: '仅退款',
      amount: Math.min(o.amount, 50), status: '待审核', createdAt: nowStr(),
    };
    state.afterSales.unshift(a);
    o.status = '售后中';
    addOperLog('订单管理', `发起售后 ${a.id}`);
    persist();
    return { ok: true, msg: '售后单已创建，待审核' };
  }

  function resetUserPassword(userId) {
    const u = state.users.find((x) => x.id === userId);
    if (!u) return { ok: false, msg: '用户不存在' };
    addOperLog('系统管理', `重置密码 ${u.username}`);
    persist();
    return { ok: true, msg: `已重置「${u.nickname}」密码为默认密码` };
  }

  function updateSysConfig(patch) {
    Object.assign(state.sysConfig, patch);
    addOperLog('系统管理', '更新系统参数');
    persist();
    return { ok: true, msg: '系统参数已保存' };
  }

  function testChannelConnection(channelKey) {
    const names = { meituan: '美团', eleme: '饿了么', jd: '京东' };
    addOperLog('渠道管理', `测试连接 ${names[channelKey] || channelKey}`);
    persist();
    return { ok: true, msg: `${names[channelKey] || channelKey} 连接正常` };
  }

  function addSku(item) {
    const sku = {
      id: item.id || uid('SKU'),
      name: item.name || '新商品',
      spec: item.spec || '—',
      approvalNo: item.approvalNo || '—',
      manufacturer: item.manufacturer || '—',
      price: parseFloat(item.price) || 0,
      isRx: item.isRx === '是' || item.isRx === true,
      status: item.status || '上架',
      category: item.category || '感冒用药',
      emoji: '💊',
    };
    state.skus.unshift(sku);
    addOperLog('商品管理', `新增 SKU ${sku.id}`);
    persist();
    return { ok: true, msg: 'SKU 已新增', data: sku };
  }

  function addUser(item) {
    const u = {
      id: uid('U'),
      username: item.username || item.name || 'newuser',
      nickname: item.nickname || item.name || '新用户',
      dept: item.dept || '运营部',
      phone: item.phone || '13800000000',
      status: item.status || '正常',
      createdAt: nowStr(),
    };
    state.users.unshift(u);
    addOperLog('系统管理', `新增用户 ${u.username}`);
    persist();
    return { ok: true, msg: '用户已新增' };
  }

  function completeInventoryCheck(id) {
    const c = state.inventoryChecks.find((x) => x.id === id);
    if (!c) return { ok: false, msg: '盘点单不存在' };
    c.status = '已完成';
    c.diffCount = 0;
    addOperLog('库存管理', `完成盘点 ${id}`);
    persist();
    return { ok: true, msg: '盘点已完成' };
  }

  function confirmTransferInbound(id) {
    const t = state.transfers.find((x) => x.id === id);
    if (!t || t.status !== '在途') return { ok: false, msg: '调拨单状态不正确' };
    t.status = '已完成';
    state.inbounds.unshift({
      id: uid('IN'), storeName: t.toStore, inboundType: '调拨入库', refNo: t.id,
      skuCount: t.skuCount, totalQty: t.totalQty, status: '已入库', inboundTime: nowStr(),
    });
    addOperLog('库存管理', `调拨入库 ${id}`);
    persist();
    return { ok: true, msg: '调拨已确认入库' };
  }

  function confirmInbound(id) {
    const ib = state.inbounds.find((x) => x.id === id);
    if (!ib || ib.status !== '待入库') return { ok: false, msg: '入库单状态不正确' };
    ib.status = '已入库';
    ib.inboundTime = nowStr();
    const st = state.stocks.find((s) => s.storeName === ib.storeName);
    if (st) {
      st.qty += Math.min(ib.totalQty, 50);
      state.stockLogs.unshift({
        id: uid('LOG'), storeName: ib.storeName, skuId: st.skuId, type: '入库',
        change: Math.min(ib.totalQty, 50), afterQty: st.qty, refNo: ib.id,
        operator: localStorage.getItem('zhihe-erp-user') || 'admin', time: nowStr(),
      });
    }
    const po = state.purchaseOrders.find((p) => p.id === ib.refNo);
    if (po && po.status === '部分入库') po.status = '已完成';
    addOperLog('库存管理', `确认入库 ${id}`);
    persist();
    return { ok: true, msg: '入库完成，库存已更新' };
  }

  function approvePurchaseOrder(id) {
    const po = state.purchaseOrders.find((x) => x.id === id);
    if (!po) return { ok: false, msg: '采购单不存在' };
    if (po.status === '待审核') po.status = '已审核';
    else if (po.status === '已审核') po.status = '部分入库';
    addOperLog('采购管理', `审核采购单 ${id}`);
    persist();
    return { ok: true, msg: `采购单状态 → ${po.status}` };
  }

  function approvePurchaseReturn(id, approve) {
    const pr = state.purchaseReturns.find((x) => x.id === id);
    if (!pr) return { ok: false, msg: '退货单不存在' };
    pr.status = approve ? '已完成' : '已拒绝';
    addOperLog('采购管理', `采购退货${approve ? '通过' : '拒绝'} ${id}`);
    persist();
    return { ok: true, msg: approve ? '退货已批准' : '退货已拒绝' };
  }

  function confirmBill(id) {
    const b = state.bills.find((x) => x.id === id);
    if (!b) return { ok: false, msg: '账单不存在' };
    b.status = '已确认';
    b.diff = 0;
    addOperLog('财务管理', `确认账单 ${id}`);
    persist();
    return { ok: true, msg: '账单已确认' };
  }

  function handleReconcile(id) {
    const r = state.reconciles.find((x) => x.id === id);
    if (!r) return { ok: false, msg: '对账记录不存在' };
    r.result = '一致';
    r.diff = 0;
    addOperLog('财务管理', `处理对账差异 ${id}`);
    persist();
    return { ok: true, msg: '对账差异已处理' };
  }

  function confirmSettlement(id) {
    const s = state.settlements.find((x) => x.id === id);
    if (!s) return { ok: false, msg: '结算单不存在' };
    s.status = '已结算';
    addOperLog('财务管理', `确认结算 ${id}`);
    persist();
    return { ok: true, msg: '门店结算已确认' };
  }

  function mapChannelStore(id, platformId) {
    const m = state.channelStoreMaps.find((x) => x.id === id);
    if (!m) return { ok: false, msg: '映射记录不存在' };
    m.mapped = true;
    m.platformId = platformId || `PLAT_${Date.now()}`;
    m.platformName = `${m.storeName}(平台)`;
    m.lastSync = nowStr();
    addOperLog('渠道管理', `门店映射 ${m.storeName}`);
    persist();
    return { ok: true, msg: '门店映射成功' };
  }

  function unmapChannelStore(id) {
    const m = state.channelStoreMaps.find((x) => x.id === id);
    if (!m) return { ok: false, msg: '映射记录不存在' };
    m.mapped = false;
    m.platformId = '';
    m.platformName = '—';
    addOperLog('渠道管理', `解绑门店映射 ${id}`);
    persist();
    return { ok: true, msg: '已解绑映射' };
  }

  function mapChannelProduct(id, platformId) {
    const m = state.channelProductMaps.find((x) => x.id === id);
    if (!m) return { ok: false, msg: '映射记录不存在' };
    m.mapped = true;
    m.syncFailed = false;
    m.platformId = platformId || `ITEM_${Date.now()}`;
    m.lastSync = nowStr();
    addOperLog('渠道管理', `商品映射 ${m.skuId}`);
    persist();
    return { ok: true, msg: '商品映射成功' };
  }

  function retryProductMap(id) {
    const m = state.channelProductMaps.find((x) => x.id === id);
    if (!m) return { ok: false, msg: '映射记录不存在' };
    m.syncFailed = false;
    m.lastSync = nowStr();
    addOperLog('渠道管理', `重试商品同步 ${m.skuId}`);
    persist();
    return { ok: true, msg: '商品同步成功' };
  }

  function saveDeliveryRange(storeId) {
    if (!state.deliveryRanges) state.deliveryRanges = {};
    state.deliveryRanges[storeId] = true;
    addOperLog('门店管理', `保存配送范围 ${storeId}`);
    persist();
    return { ok: true, msg: '配送范围已保存' };
  }

  function getSalesReportRows() {
    const map = {};
    state.orders.filter((o) => o.status !== '已取消').forEach((o) => {
      const date = o.createdAt.slice(0, 10);
      const key = `${date}|${o.storeName}|${o.channel}`;
      if (!map[key]) map[key] = { id: key, date, storeName: o.storeName, channel: o.channel, count: 0, sales: 0, refund: 0 };
      map[key].count += 1;
      map[key].sales += o.amount;
      if (o.status === '售后中') map[key].refund += Math.min(o.amount, 50);
    });
    return Object.values(map);
  }

  function getStockReportRows() {
    const map = {};
    state.stocks.forEach((st) => {
      if (!map[st.storeName]) {
        map[st.storeName] = { id: st.storeName, storeName: st.storeName, skuCount: 0, totalQty: 0, amount: 0, warn: 0, expiry: 0 };
      }
      const r = map[st.storeName];
      r.skuCount += 1;
      r.totalQty += st.qty;
      r.amount += st.qty * 28;
      if (st.qty <= st.warnThreshold) r.warn += 1;
      const days = Math.ceil((new Date(st.expiry) - new Date()) / 86400000);
      if (days <= 90) r.expiry += 1;
    });
    return Object.values(map);
  }

  function getPurchaseReportRows() {
    const map = {};
    state.purchaseOrders.forEach((po) => {
      const month = po.createdAt.slice(0, 7);
      const key = `${month}|${po.supplier}`;
      if (!map[key]) map[key] = { id: key, month, supplier: po.supplier, poCount: 0, amount: 0, inbound: 0, ret: 0 };
      map[key].poCount += 1;
      map[key].amount += po.amount;
      if (po.status === '已完成' || po.status === '部分入库') map[key].inbound += po.amount * 0.9;
    });
    state.purchaseReturns.forEach((pr) => {
      const month = pr.createdAt.slice(0, 7);
      const key = `${month}|${pr.supplier}`;
      if (map[key]) map[key].ret += pr.amount;
    });
    return Object.values(map);
  }

  function getAnalysisReportRows() {
    const stats = getDashboardStats();
    const orderTotal = state.orders.filter((o) => o.status !== '已取消').length;
    const sales = stats.sales;
    return [
      { id: 'A1', metric: '销售额', current: `¥${Math.round(sales).toLocaleString()}`, prev: '¥523,100', mom: '+12.1%', yoy: '+25.3%' },
      { id: 'A2', metric: '订单数', current: String(orderTotal), prev: '7,980', mom: '+8.0%', yoy: '+18.6%' },
      { id: 'A3', metric: '客单价', current: orderTotal ? `¥${(sales / orderTotal).toFixed(2)}` : '¥0', prev: '¥65.55', mom: '+3.8%', yoy: '+5.6%' },
      { id: 'A4', metric: '新会员', current: String(state.members.length), prev: '1,050', mom: '+21.9%', yoy: '+32.0%' },
    ];
  }

  function getActiveDeliveryTrack() {
    const d = state.deliveries.find((x) => x.status === '配送中') || state.deliveries[0];
    if (!d) return null;
    const o = state.orders.find((x) => x.id === d.orderId);
    return { delivery: d, order: o };
  }

  function getDictOptions(dictType) {
    return (state.dictItems || [])
      .filter((d) => d.dictType === dictType && d.status !== '停用')
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((d) => ({ label: `${d.label}（${d.value}）`, value: d.value }));
  }

  function getDictLabel(dictType, value) {
    if (!value) return '—';
    const item = (state.dictItems || []).find((d) => d.dictType === dictType && d.value === value);
    return item ? `${item.label}（${item.value}）` : String(value);
  }

  function getDictItems(dictType) {
    return (state.dictItems || [])
      .filter((d) => d.dictType === dictType)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }

  function genericRemove(collection, id) {
    const arr = state[collection];
    const i = arr.findIndex((x) => x.id === id);
    if (i < 0) return { ok: false, msg: '记录不存在' };
    arr.splice(i, 1);
    persist();
    return { ok: true, msg: '删除成功' };
  }

  function genericUpsert(collection, item, isNew) {
    if (isNew) {
      item.id = item.id || uid(collection.slice(0, 3).toUpperCase());
      item.createdAt = item.createdAt || nowStr();
      state[collection].unshift(item);
    } else {
      const i = state[collection].findIndex((x) => x.id === item.id);
      if (i >= 0) state[collection][i] = { ...state[collection][i], ...item };
    }
    persist();
    return { ok: true, msg: isNew ? '新增成功' : '保存成功' };
  }

  function getDashboardStats() {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = state.orders.filter((o) => o.createdAt.startsWith(today) && o.status !== '已取消');
    const sales = todayOrders.reduce((s, o) => s + o.amount, 0);
    const pendingPick = state.orders.filter((o) => o.status === '待拣货').length;
    const stockWarn = state.stocks.filter((s) => s.qty <= s.warnThreshold).length;
    return {
      orderCount: todayOrders.length || state.orders.length,
      sales: sales || state.orders.reduce((s, o) => s + o.amount, 0),
      pendingPick,
      stockWarn,
    };
  }

  function getTodos() {
    const todos = [];
    state.prescriptions.filter((r) => r.status === '待审核').forEach((r) => {
      todos.push({ type: '处方审核', typeTag: 'rx', text: `订单 ${r.orderId} 待药师审核`, store: r.storeName, time: r.submitTime, action: '去处理', target: 'rx-pending', refId: r.id });
    });
    state.orders.filter((o) => o.status === '待拣货').slice(0, 2).forEach((o) => {
      todos.push({ type: '待拣货', typeTag: 'pending', text: `${o.channel}订单 ${o.id}`, store: o.storeName, time: o.createdAt.slice(0, 16), action: '去拣货', target: 'ord-list', refId: o.id });
    });
    state.stocks.filter((s) => s.qty <= s.warnThreshold).slice(0, 1).forEach((s) => {
      todos.push({ type: '库存预警', typeTag: 'off', text: `${s.skuName} 库存 ≤ ${s.qty}`, store: s.storeName, time: nowStr().slice(0, 16), action: '查看', target: 'inv-expiry', refId: s.id });
    });
    state.channelSyncLogs.filter((l) => !l.success).slice(0, 1).forEach((l) => {
      todos.push({ type: '渠道同步', typeTag: 'picking', text: `${l.channel}商品同步失败`, store: '—', time: l.time, action: '重试', target: 'chn-sync-log', refId: l.id });
    });
    return todos;
  }

  function updateNotifyPanel() {
    const panel = document.getElementById('proto-notify-panel');
    if (!panel) return;
    const stats = getDashboardStats();
    const ul = panel.querySelector('.proto-notify-list');
    if (!ul) return;
    ul.innerHTML = `
      <li data-goto="ord-list"><span class="tag tag-pending">待办</span> ${stats.pendingPick} 单待拣货</li>
      <li data-goto="rx-pending"><span class="tag tag-rx">处方</span> ${state.prescriptions.filter(r=>r.status==='待审核').length} 单待审核</li>
      <li data-goto="inv-expiry"><span class="tag tag-off">库存</span> ${stats.stockWarn} 个 SKU 预警</li>
      <li data-goto="chn-sync-log"><span class="tag tag-picking">渠道</span> ${state.channelSyncLogs.filter(l=>!l.success).length} 条同步失败</li>`;
  }

  function init() {
    state = load();
    updateNotifyPanel();
  }

  function resetDemo() {
    state = seed();
    persist();
  }

  function setDrawerCtx(ctx) { drawerCtx = ctx; }
  function getDrawerCtx() { return drawerCtx; }

  return {
    init, persist, resetDemo, getState: () => state, seed,
    getFilters, getPageNum, setPageNum, PAGE_SIZE,
    addOperLog, getDashboardStats, getTodos, updateNotifyPanel,
    pickOrder, cancelOrder, shipOrder, completeOrder, approveRx, toggleSkuStatus, updateSkuPrice,
    approveAfterSale, retryChannelSync, runChannelSync, restockStock, toggleStoreStatus,
    completeDelivery, assignDelivery, createAfterSale, resetUserPassword, updateSysConfig,
    testChannelConnection, addSku, addUser,
    completeInventoryCheck, confirmTransferInbound, confirmInbound, approvePurchaseOrder,
    approvePurchaseReturn, confirmBill, handleReconcile, confirmSettlement,
    mapChannelStore, unmapChannelStore, mapChannelProduct, retryProductMap, saveDeliveryRange,
    getSalesReportRows, getStockReportRows, getPurchaseReportRows, getAnalysisReportRows, getActiveDeliveryTrack,
    getDictOptions, getDictLabel, getDictItems,
    genericRemove, genericUpsert, setDrawerCtx, getDrawerCtx,
    channelTag, orderStatusTag, maskPhone, nowStr, uid,
  };
})();
