/**
 * 实体表单 schema — 中文字段名、下拉选项、隐藏 ID
 */
const FormSchemas = (() => {
  const HIDDEN_KEYS = new Set([
    'id', 'storeId', 'skuId', 'orderId', 'rxId', 'poId', 'refNo', 'taskId',
    'parentId', 'depth', 'emoji', 'items', 'needRx', 'platformId', 'mapped', 'syncFailed',
  ]);

  const ENTITY_TITLES = {
    users: '用户', roles: '角色', skus: 'SKU', stores: '门店', orders: '订单',
    prescriptions: '处方', afterSales: '售后单', stocks: '库存', deliveries: '配送单',
    menus: '菜单', depts: '部门', categories: '分类', brands: '品牌', spus: 'SPU',
    dicts: '字典', coupons: '优惠券', suppliers: '供应商', members: '会员',
    purchaseOrders: '采购单', purchaseReturns: '采购退货', inventoryChecks: '盘点单',
    transfers: '调拨单', inbounds: '入库单', bills: '平台账单', reconciles: '对账记录',
    settlements: '结算单', channelStoreMaps: '门店映射', channelProductMaps: '商品映射',
    memberLevels: '会员等级', loginLogs: '登录日志', operLogs: '操作日志',
    channelSyncLogs: '同步日志', channelSyncTasks: '同步任务', stockLogs: '库存流水',
    pointLogs: '积分流水', rxLogs: '审核日志',
  };

  const FIELD_LABELS = {
    username: '用户名', nickname: '昵称', dept: '部门', phone: '手机号', status: '状态',
    createdAt: '创建时间', name: '名称', code: '编码', sort: '排序', spec: '规格',
    approvalNo: '批准文号', manufacturer: '生产厂家', price: '零售价', isRx: '处方药',
    category: '分类', brand: '品牌', city: '城市', address: '地址', manager: '负责人',
    rxSupport: '处方药支持', channel: '渠道', storeName: '门店', amount: '金额',
    receiver: '收货人', type: '类型', supplier: '供应商', skuCount: 'SKU 数量',
    buyer: '采购员', checkType: '盘点类型', diffCount: '差异数', checker: '盘点人',
    fromStore: '调出门店', toStore: '调入门店', totalQty: '总数量', creator: '创建人',
    inboundType: '入库类型', inboundTime: '入库时间', patient: '患者', drugCount: '药品数',
    submitTime: '提交时间', waitMin: '等待时长', orderId: '关联订单', platformName: '平台门店名称',
    platformId: '平台编号', lastSync: '最后同步', skuName: '商品名称', skuId: 'SKU 编码',
    level: '会员等级', points: '积分', totalSpend: '累计消费', value: '面额/折扣',
    threshold: '使用门槛', claimed: '已领取', total: '总量', expiry: '有效期',
    contact: '联系人', certExpiry: '资质有效期', poId: '原采购单', discount: '折扣',
    pointRate: '积分倍率', period: '账单周期', orderCount: '订单数',
    platformAmount: '平台金额', erpAmount: '中台金额', diff: '差异', erpAmount2: '中台金额',
    platformAmount2: '平台金额', result: '对账结果', time: '时间', sales: '销售额',
    commission: '平台佣金', deliveryFee: '配送费', settleAmount: '应结金额',
    mode: '配送方式', rider: '骑手', eta: '预计送达', icon: '图标', perm: '权限标识',
    menuType: '菜单类型', ip: '登录 IP', location: '登录地点', browser: '浏览器',
    module: '模块', action: '操作类型', user: '操作人员', taskId: '任务编号',
    scope: '范围', progress: '进度', success: '结果', error: '错误信息', target: '对象',
    reviewer: '审核药师', reason: '原因', memberPhone: '会员手机号', change: '变动积分',
    balance: '剩余积分', remark: '备注', menuType2: '类型', refNo: '关联单号',
    batchNo: '批号', expiryDate: '有效期', qty: '可用库存', lockQty: '锁定数量',
    warnThreshold: '预警阈值', operator: '操作人', afterQty: '变动后库存',
  };

  const SCHEMAS = {
    users: [
      { key: 'username', label: '用户名', required: true },
      { key: 'nickname', label: '昵称', required: true },
      { key: 'dept', label: '部门', type: 'select', options: ['总部', '运营部', '门店部'] },
      { key: 'phone', label: '手机号', type: 'tel' },
      { key: 'status', label: '状态', type: 'select', options: ['正常', '停用'] },
      { key: 'createdAt', label: '创建时间', readonly: true },
    ],
    roles: [
      { key: 'name', label: '角色名称', required: true },
      { key: 'code', label: '角色编码', required: true, placeholder: '如 operator' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['正常', '停用'] },
    ],
    skus: [
      { key: 'name', label: '商品名称', required: true },
      { key: 'spec', label: '规格' },
      { key: 'approvalNo', label: '批准文号' },
      { key: 'manufacturer', label: '生产厂家' },
      { key: 'price', label: '零售价', type: 'number', required: true },
      { key: 'category', label: '分类', type: 'select', options: ['感冒用药', '消化系统', '心脑血管', '医疗器械'] },
      { key: 'isRx', label: '处方药', type: 'select', options: ['否', '是'] },
      { key: 'status', label: '状态', type: 'select', options: ['上架', '下架'] },
    ],
    stores: [
      { key: 'name', label: '门店名称', required: true },
      { key: 'city', label: '城市', type: 'select', options: ['北京', '上海', '广州', '深圳'] },
      { key: 'address', label: '地址' },
      { key: 'manager', label: '店长' },
      { key: 'phone', label: '联系电话', type: 'tel' },
      { key: 'rxSupport', label: '处方药支持', type: 'select', options: ['不支持', '支持'] },
      { key: 'status', label: '状态', type: 'select', options: ['营业中', '休息中', '已关闭'] },
    ],
    orders: [
      { key: 'channel', label: '渠道', type: 'select', options: ['美团', '饿了么', '京东', '自营'], readonly: true },
      { key: 'storeName', label: '门店', readonly: true },
      { key: 'amount', label: '订单金额', type: 'number', readonly: true },
      { key: 'status', label: '订单状态', type: 'select', options: ['待支付', '待处方审核', '待拣货', '待配送', '配送中', '已完成', '已取消', '售后中'] },
      { key: 'receiver', label: '收货人' },
      { key: 'phone', label: '联系电话', type: 'tel' },
      { key: 'createdAt', label: '下单时间', readonly: true },
    ],
    prescriptions: [
      { key: 'orderId', label: '关联订单', readonly: true },
      { key: 'storeName', label: '门店', readonly: true },
      { key: 'patient', label: '患者姓名' },
      { key: 'drugCount', label: '药品数量', type: 'number' },
      { key: 'status', label: '审核状态', type: 'select', options: ['待审核', '已通过', '已驳回'] },
      { key: 'submitTime', label: '提交时间', readonly: true },
    ],
    menus: [
      { key: 'name', label: '菜单名称', required: true },
      { key: 'icon', label: '图标' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'perm', label: '权限标识', type: 'select', required: true, options: () => DataStore.getDictOptions('sys_perm') },
      { key: 'menuType', label: '菜单类型', type: 'select', options: ['目录', '菜单', '按钮'] },
      { key: 'status', label: '状态', type: 'select', options: ['正常', '停用'] },
    ],
    depts: [
      { key: 'name', label: '部门名称', required: true },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'manager', label: '负责人' },
      { key: 'phone', label: '联系电话', type: 'tel' },
      { key: 'status', label: '状态', type: 'select', options: ['正常', '停用'] },
    ],
    categories: [
      { key: 'name', label: '分类名称', required: true },
      { key: 'code', label: '分类编码' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
    ],
    brands: [
      { key: 'name', label: '品牌名称', required: true },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
    ],
    spus: [
      { key: 'name', label: 'SPU 名称', required: true },
      { key: 'category', label: '分类', type: 'select', options: ['感冒用药', '消化系统', '心脑血管'] },
      { key: 'brand', label: '品牌' },
      { key: 'skuCount', label: 'SKU 数量', type: 'number', readonly: true },
      { key: 'status', label: '状态', type: 'select', options: ['上架', '下架'] },
    ],
    dicts: [
      { key: 'name', label: '字典名称', required: true },
      { key: 'type', label: '字典类型' },
      { key: 'status', label: '状态', type: 'select', options: ['正常', '停用'] },
      { key: 'remark', label: '备注', type: 'textarea' },
    ],
    coupons: [
      { key: 'name', label: '优惠券名称', required: true },
      { key: 'type', label: '类型', type: 'select', options: ['满减', '折扣', '无门槛'] },
      { key: 'value', label: '面额/折扣' },
      { key: 'threshold', label: '使用门槛' },
      { key: 'total', label: '发放总量', type: 'number' },
      { key: 'expiry', label: '有效期' },
      { key: 'status', label: '状态', type: 'select', options: ['进行中', '已结束', '未开始'] },
    ],
    suppliers: [
      { key: 'name', label: '供应商名称', required: true },
      { key: 'contact', label: '联系人' },
      { key: 'phone', label: '联系电话', type: 'tel' },
      { key: 'certExpiry', label: '资质有效期' },
      { key: 'status', label: '状态', type: 'select', options: ['合作中', '已停用'] },
    ],
    members: [
      { key: 'nickname', label: '昵称' },
      { key: 'phone', label: '手机号', type: 'tel' },
      { key: 'level', label: '会员等级', type: 'select', options: ['普通', '银卡', '金卡', '钻石'] },
      { key: 'points', label: '积分', type: 'number' },
      { key: 'channel', label: '注册渠道', type: 'select', options: ['美团', '饿了么', '京东', '自营'] },
    ],
    memberLevels: [
      { key: 'name', label: '等级名称', required: true },
      { key: 'code', label: '等级编码' },
      { key: 'threshold', label: '升级条件(消费额)', type: 'number' },
      { key: 'discount', label: '折扣' },
      { key: 'pointRate', label: '积分倍率' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
    ],
    inventoryChecks: [
      { key: 'storeName', label: '门店', type: 'select', options: () => DataStore.getState().stores.map((s) => s.name) },
      { key: 'checkType', label: '盘点类型', type: 'select', options: ['全盘', '抽盘', '动态盘'] },
      { key: 'skuCount', label: 'SKU 数量', type: 'number' },
      { key: 'diffCount', label: '差异数量', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['盘点中', '已完成', '已取消'] },
      { key: 'checker', label: '盘点人' },
    ],
    transfers: [
      { key: 'fromStore', label: '调出门店', type: 'select', options: () => DataStore.getState().stores.map((s) => s.name) },
      { key: 'toStore', label: '调入门店', type: 'select', options: () => DataStore.getState().stores.map((s) => s.name) },
      { key: 'skuCount', label: 'SKU 数量', type: 'number' },
      { key: 'totalQty', label: '总数量', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待出库', '在途', '已完成', '已取消'] },
    ],
    inbounds: [
      { key: 'storeName', label: '门店', type: 'select', options: () => DataStore.getState().stores.map((s) => s.name) },
      { key: 'inboundType', label: '入库类型', type: 'select', options: ['采购入库', '调拨入库', '退货入库'] },
      { key: 'skuCount', label: 'SKU 数量', type: 'number' },
      { key: 'totalQty', label: '总数量', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待入库', '已入库'] },
    ],
    purchaseOrders: [
      { key: 'supplier', label: '供应商', type: 'select', options: () => DataStore.getState().suppliers.map((s) => s.name) },
      { key: 'skuCount', label: 'SKU 数量', type: 'number' },
      { key: 'amount', label: '采购金额', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待审核', '已审核', '部分入库', '已完成', '已取消'] },
      { key: 'buyer', label: '采购员' },
    ],
    purchaseReturns: [
      { key: 'supplier', label: '供应商', type: 'select', options: () => DataStore.getState().suppliers.map((s) => s.name) },
      { key: 'skuCount', label: 'SKU 数量', type: 'number' },
      { key: 'amount', label: '退货金额', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待审核', '已出库', '已完成', '已拒绝'] },
    ],
    channelStoreMaps: [
      { key: 'storeName', label: '中台门店', readonly: true },
      { key: 'channel', label: '渠道', type: 'select', options: ['美团', '饿了么', '京东'] },
      { key: 'platformId', label: '平台门店编号' },
      { key: 'platformName', label: '平台门店名称' },
      { key: 'lastSync', label: '最后同步', readonly: true },
    ],
    channelProductMaps: [
      { key: 'skuName', label: '商品名称', readonly: true },
      { key: 'channel', label: '渠道', type: 'select', options: ['美团', '饿了么', '京东'] },
      { key: 'platformId', label: '平台商品编号' },
      { key: 'lastSync', label: '最后同步', readonly: true },
    ],
    deliveries: [
      { key: 'storeName', label: '门店', readonly: true },
      { key: 'mode', label: '配送方式', type: 'select', options: ['自配送', '达达', '蜂鸟', '美团配送'] },
      { key: 'rider', label: '骑手/配送员' },
      { key: 'status', label: '状态', type: 'select', options: ['待接单', '配送中', '已完成', '异常'] },
      { key: 'eta', label: '预计送达' },
    ],
    afterSales: [
      { key: 'orderId', label: '原订单号', readonly: true },
      { key: 'channel', label: '渠道', readonly: true },
      { key: 'type', label: '售后类型', type: 'select', options: ['仅退款', '退货退款'] },
      { key: 'amount', label: '退款金额', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待审核', '已完成', '已拒绝'] },
    ],
    bills: [
      { key: 'channel', label: '渠道', readonly: true },
      { key: 'period', label: '账单周期', readonly: true },
      { key: 'orderCount', label: '订单数', readonly: true },
      { key: 'platformAmount', label: '平台金额', type: 'number' },
      { key: 'erpAmount', label: '中台金额', type: 'number' },
      { key: 'diff', label: '差异金额', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待确认', '已确认', '有差异'] },
    ],
    settlements: [
      { key: 'storeName', label: '门店', readonly: true },
      { key: 'period', label: '结算周期', readonly: true },
      { key: 'orderCount', label: '订单数', readonly: true },
      { key: 'sales', label: '销售额', type: 'number', readonly: true },
      { key: 'settleAmount', label: '应结金额', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: ['待确认', '已结算'] },
    ],
  };

  /** 新增表单的快捷 schema（按页面） */
  const CREATE_FORMS = {
    'sys-user': 'users', 'sys-menu': 'menus', 'sys-dept': 'depts', 'prd-category': 'categories',
    'prd-brand': 'brands', 'prd-spu': 'spus', 'prd-sku': 'skus', 'sto-list': 'stores',
    'mem-coupon': 'coupons', 'pur-supplier': 'suppliers', 'inv-check': 'inventoryChecks',
    'inv-transfer': 'transfers', 'inv-inbound': 'inbounds', 'pur-order': 'purchaseOrders',
    'pur-return': 'purchaseReturns', 'mem-level': 'memberLevels',
  };

  function labelOf(key) {
    return FIELD_LABELS[key] || key;
  }

  function titleOf(entity) {
    return ENTITY_TITLES[entity] || '记录';
  }

  function displayValue(key, val) {
    if (val === null || val === undefined) return '—';
    if (key === 'perm') return DataStore.getDictLabel('sys_perm', val);
    if (key === 'isRx') return val === true || val === '是' ? '是' : '否';
    if (key === 'rxSupport') return val === true || val === '支持' ? '支持' : '不支持';
    if (key === 'success') return val ? '成功' : '失败';
    if (key === 'mapped') return val ? '已映射' : '未映射';
    if (key === 'syncFailed') return val ? '是' : '否';
    if (typeof val === 'boolean') return val ? '是' : '否';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  function rawValue(key, val) {
    if (key === 'isRx') return val === true || val === '是' ? '是' : '否';
    if (key === 'rxSupport') return val === true || val === '支持' ? '支持' : '不支持';
    if (val === null || val === undefined) return '';
    return String(val);
  }

  function normalizeOptions(raw) {
    if (!raw?.length) return [];
    if (typeof raw[0] === 'object' && raw[0].value !== undefined) return raw;
    return raw.map((s) => ({ label: s, value: s }));
  }

  function resolveOptions(field) {
    if (!field.options) return [];
    const raw = typeof field.options === 'function' ? field.options() : field.options;
    return normalizeOptions(raw);
  }

  function getSchema(entity) {
    if (SCHEMAS[entity]) return SCHEMAS[entity];
    return null;
  }

  function inferSchemaFromItem(entity, item) {
    if (!item) return [];
    return Object.keys(item)
      .filter((k) => !HIDDEN_KEYS.has(k) && !k.endsWith('Id') && k !== 'id')
      .map((k) => ({ key: k, label: labelOf(k), readonly: true }));
  }

  function toFormFields(entity, item, { editable = true } = {}) {
    const schema = getSchema(entity) || inferSchemaFromItem(entity, item);
    return schema
      .filter((f) => !HIDDEN_KEYS.has(f.key))
      .map((f) => {
        const readonly = f.readonly || !editable;
        const val = rawValue(f.key, item?.[f.key]);
        const field = {
          label: f.label,
          key: f.key,
          required: f.required,
          readonly,
          value: val,
        };
        if (f.type === 'select' && editable && !readonly) {
          field.type = 'select';
          field.options = resolveOptions(f);
        } else if (f.type === 'textarea') {
          field.type = readonly ? 'text' : 'textarea';
        } else if (f.type === 'number') {
          field.type = readonly ? 'text' : 'number';
        } else {
          field.type = readonly ? 'text' : (f.type || 'text');
        }
        if (readonly) field.type = 'text';
        return field;
      });
  }

  function toDetailRows(entity, item) {
    if (!item) return [['说明', '暂无数据']];
    const schema = getSchema(entity) || inferSchemaFromItem(entity, item);
    const rows = schema
      .filter((f) => !HIDDEN_KEYS.has(f.key))
      .map((f) => [f.label, displayValue(f.key, item[f.key])]);
    if (!rows.length) {
      Object.entries(item)
        .filter(([k]) => !HIDDEN_KEYS.has(k) && k !== 'id' && !k.endsWith('Id'))
        .forEach(([k, v]) => rows.push([labelOf(k), displayValue(k, v)]));
    }
    return rows;
  }

  function parseFormValues(entity, item, formValues) {
    const schema = getSchema(entity) || [];
    const patch = { ...item };
    schema.forEach((f) => {
      const v = formValues[f.label];
      if (v === undefined) return;
      if (f.key === 'isRx') patch.isRx = v === '是';
      else if (f.key === 'rxSupport') patch.rxSupport = v === '支持';
      else if (f.key === 'price' || f.key === 'amount' || f.key === 'threshold' || f.key === 'points') {
        patch[f.key] = parseFloat(v) || 0;
      } else if (f.type === 'number') patch[f.key] = parseInt(v, 10) || 0;
      else patch[f.key] = v;
    });
    Object.entries(formValues).forEach(([label, v]) => {
      const f = schema.find((x) => x.label === label);
      if (!f) return;
      if (f.key === 'isRx') patch.isRx = v === '是';
      else if (f.key === 'rxSupport') patch.rxSupport = v === '支持';
      else if (f.type === 'number') patch[f.key] = parseFloat(v) || parseInt(v, 10) || 0;
      else patch[f.key] = v;
    });
    return patch;
  }

  function createDefaults(entity) {
    const defaults = {
      users: { username: '', nickname: '', dept: '运营部', phone: '', status: '正常' },
      menus: { name: '', icon: '📁', sort: 99, perm: 'dashboard', menuType: '菜单', status: '正常', depth: 0 },
      depts: { name: '', sort: 99, manager: '', phone: '', status: '正常', depth: 0 },
      categories: { name: '', code: '', sort: 99, status: '启用', depth: 0 },
      skus: { name: '', spec: '', price: 0, category: '感冒用药', isRx: false, status: '上架' },
      stores: { name: '', city: '北京', address: '', manager: '', phone: '', rxSupport: true, status: '营业中' },
      inventoryChecks: { storeName: '朝阳店', checkType: '全盘', skuCount: 0, diffCount: 0, status: '盘点中', checker: '管理员' },
      transfers: { fromStore: '朝阳店', toStore: '海淀店', skuCount: 1, totalQty: 10, status: '在途' },
      inbounds: { storeName: '朝阳店', inboundType: '采购入库', skuCount: 1, totalQty: 10, status: '待入库', inboundTime: '—' },
      purchaseOrders: { supplier: '华润医药商业', skuCount: 1, amount: 1000, status: '待审核' },
      purchaseReturns: { supplier: '华润医药商业', skuCount: 1, amount: 500, status: '待审核' },
      coupons: { name: '', type: '满减', value: '¥10', threshold: '满¥50', total: 1000, expiry: '2026-12-31', status: '进行中', claimed: 0 },
      brands: { name: '', sort: 1, status: '启用' },
      spus: { name: '', category: '感冒用药', brand: '', skuCount: 0, status: '上架' },
      suppliers: { name: '', contact: '', phone: '', certExpiry: '', status: '合作中', skuCount: 0 },
      memberLevels: { name: '', code: '', threshold: 0, discount: '无', pointRate: '1x', sort: 1, status: '启用' },
    };
    return defaults[entity] || {};
  }

  return {
    titleOf, toFormFields, toDetailRows, parseFormValues, createDefaults,
    getSchema, CREATE_FORMS, HIDDEN_KEYS, labelOf,
  };
})();
