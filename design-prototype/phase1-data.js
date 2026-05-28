/**
 * 一期合同业务数据与操作
 */
const Phase1Data = (() => {
  function seedExtension() {
    return {
      supplierContracts: [
        { id: 'CT001', supplier: '华润医药商业', validTo: '2027-06-30', paymentDays: 45, settleType: '月结', renewAlert: '正常', status: '生效中', snapshotNote: '账期45天/月结' },
        { id: 'CT002', supplier: '国药控股', validTo: '2026-07-15', paymentDays: 30, settleType: '半月结', renewAlert: '30天内到期', status: '即将到期', snapshotNote: '账期30天' },
      ],
      rebateRules: [
        { id: 'RR1', name: '华润年度阶梯返利', ruleType: '阶梯返利', params: '100万5%/300万8%', cycle: '年度', status: '启用' },
        { id: 'RR2', name: '感冒品类返利', ruleType: '品类返利', params: '感冒用药3%', cycle: '季度', status: '启用' },
      ],
      poApprovals: [
        { id: 'PO20260525001', supplier: '华润医药商业', amount: 28600, approveLevel: '采购员自审', contractSnap: 'CT001-v1', status: '部分入库', buyer: 'zhangsan' },
        { id: 'PO20260528002', supplier: '国药控股', amount: 68000, approveLevel: '采购主管审', contractSnap: 'CT002-v1', status: '待审批', buyer: 'lisi' },
        { id: 'PO20260528003', supplier: '华润医药商业', amount: 235000, approveLevel: '财务总监审', contractSnap: 'CT001-v1', status: '待审批', buyer: 'zhangsan' },
      ],
      purchaseInboundRegs: [
        { id: 'PIR001', poId: 'PO20260525001', skuId: 'SKU10086001', skuName: '阿莫西林胶囊', orderQty: 500, recvQty: 498, batchNo: '20260315', expiry: '2028-03-15', diff: '-2', diffRemark: '运输破损2盒' },
      ],
      purchaseInvoices: [
        { id: 'INV001', invoiceNo: '3100221130', supplier: '华润医药商业', poId: 'PO20260525001', amount: 28520, taxRate: '13%', createdAt: '2026-05-27 14:00' },
      ],
      threeWayMatches: [
        { id: 'TWM001', poId: 'PO20260525001', payable: 28600, inboundAmt: 28520, invoiceAmt: 28520, diff: 80, level: '黄', handleStatus: '采购员复核' },
        { id: 'TWM002', poId: 'PO20260520001', payable: 12300, inboundAmt: 12300, invoiceAmt: 12300, diff: 0, level: '绿', handleStatus: '自动通过' },
      ],
      supplierStatements: [
        { id: 'STMT202605001', supplier: '华润医药商业', period: '2026-05-01~05-31', orderCount: 12, totalPayable: 186420, diffLevel: '黄', supplierConfirm: '待确认' },
        { id: 'STMT202605002', supplier: '国药控股', period: '2026-05-01~05-31', orderCount: 8, totalPayable: 96200, diffLevel: '绿', supplierConfirm: '已确认' },
      ],
      supplierPortalConfirms: [
        { id: 'SPC001', stmtId: 'STMT202605001', supplier: '华润医药商业', amount: 186420, pushChannel: '企业微信+邮件', confirmStatus: '待确认', feedback: '—' },
      ],
      rebateLedgers: [
        { id: 'RL001', supplier: '华润医药商业', ruleName: '华润年度阶梯返利', shouldRebate: 12800, actualRebate: 9600, diff: 3200, dueDate: '2026-05-15', warn: true },
      ],
      salesDaily: [
        { id: 'SD1', date: '2026-05-27', storeName: '朝阳店', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', qty: 28, channel: '美团', updatedAt: '2026-05-28 00:05' },
        { id: 'SD2', date: '2026-05-27', storeName: '朝阳店', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', qty: 15, channel: '饿了么', updatedAt: '2026-05-28 00:05' },
      ],
      replenishSuggestions: [
        { id: 'RS20260528001', storeName: '朝阳店', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', suggestQty: 120, supplier: '华润医药商业', eta: '2026-05-30', matchScore: 92, status: '待审核' },
        { id: 'RS20260528002', storeName: '海淀店', skuId: 'SKU10086005', skuName: '胰岛素注射液', suggestQty: 40, supplier: '国药控股', eta: '2026-05-31', matchScore: 88, status: '待审核' },
      ],
      supplierPriorities: [
        { id: 'SP1', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', primarySupplier: '华润医药商业', backupSupplier: '国药控股', paymentDays: 45, leadTime: '2天', priority: 1 },
      ],
      platformPrices: [
        { id: 'PP1', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', basePrice: 18.5, meituanPrice: 18.9, elemePrice: 18.5, jdPrice: 19.9, updatedAt: '2026-05-28 08:00' },
      ],
      platformShelf: [
        { id: 'PS1', skuId: 'SKU10086002', storeName: '朝阳店', channel: '美团', shelfStatus: '上架', syncStatus: '成功', lastSync: '2026-05-28 10:00' },
        { id: 'PS2', skuId: 'SKU10086002', storeName: '朝阳店', channel: '饿了么', shelfStatus: '上架', syncStatus: '成功', lastSync: '2026-05-28 10:00' },
        { id: 'PS3', skuId: 'SKU10086004', storeName: '海淀店', channel: '京东', shelfStatus: '下架', syncStatus: '失败', lastSync: '2026-05-28 09:30' },
      ],
      invCenterView: [
        { id: 'IC1', storeName: '朝阳店', skuId: 'SKU10086002', skuName: '布洛芬缓释胶囊', available: 8, reserved: 2, inTransit: 50, platformPush: 6, bufferRatio: '5%' },
      ],
      platformInvDiffs: [
        { id: 'PID1', time: '2026-05-28 11:30', storeName: '朝阳店', skuId: 'SKU10086002', channel: '美团', sysQty: 6, platformQty: 8, diff: 2, handled: '待修正' },
      ],
      dataPermissions: [
        { id: 'DP1', name: '门店数据隔离', dimension: '门店', scope: '本门店', roles: '门店店长', status: '启用' },
        { id: 'DP2', name: '华北区运营', dimension: '区域', scope: '北京', roles: '运营', status: '启用' },
      ],
      notifyTemplates: [
        { id: 'NT1', name: '对账单推送', scene: 'M1-3-4', channel: '企业微信+邮件', lastSend: '2026-05-28 09:00', status: '启用' },
        { id: 'NT2', name: '返利预警', scene: 'M1-5-3', channel: '短信+企业微信', lastSend: '2026-05-27 10:00', status: '启用' },
      ],
      backupRecords: [
        { id: 'BK20260528001', time: '2026-05-28 02:00', size: '2.4 GB', retainDays: 90, status: '成功' },
        { id: 'BK20260527001', time: '2026-05-27 02:00', size: '2.3 GB', retainDays: 90, status: '成功' },
      ],
      replenConfig: {
        weight7: 0.5, weight30: 0.3, weightYoY: 0.2,
        serviceLevel: 0.95, leadDays: 2, volatility: 1.2,
        priceWeight: 0.4, paymentWeight: 0.2, leadWeight: 0.25, priorityWeight: 0.15,
        syncDelaySec: 30, bufferRatio: 0.05, reconcileMin: 30,
      },
    };
  }

  function mergeSeed(saved, fresh) {
    const ext = seedExtension();
    Object.keys(ext).forEach((k) => {
      if (saved[k] === undefined || saved[k] === null) saved[k] = fresh[k] ?? ext[k];
    });
    if (!saved.replenConfig) saved.replenConfig = ext.replenConfig;
    return saved;
  }

  function generateSuggestions(state) {
    const items = [
      { storeName: '朝阳店', skuId: 'SKU10086001', skuName: '阿莫西林胶囊', suggestQty: 80, supplier: '华润医药商业', eta: '2026-05-30', matchScore: 90 },
      { storeName: '西城店', skuId: 'SKU10086003', skuName: '连花清瘟胶囊', suggestQty: 60, supplier: '国药控股', eta: '2026-05-31', matchScore: 85 },
    ];
    items.forEach((it) => {
      state.replenishSuggestions.unshift({
        id: `RS${Date.now()}`, ...it, status: '待审核',
      });
    });
    DataStore.addOperLog('M2 门店补货', `生成补货建议 ${items.length} 条`);
    DataStore.persist();
    return { ok: true, msg: `已生成 ${items.length} 条补货建议，待审核` };
  }

  function convertToPurchase(state) {
    const pending = state.replenishSuggestions.filter((r) => r.status === '待审核' || r.status === '已通过');
    if (!pending.length) return { ok: false, msg: '暂无待转采购的建议单' };
    const g = pending[0];
    state.poApprovals.unshift({
      id: `PO${Date.now()}`, supplier: g.supplier, amount: g.suggestQty * 18,
      approveLevel: g.suggestQty * 18 < 50000 ? '采购员自审' : '采购主管审',
      contractSnap: '自动套用', status: '待审批', buyer: 'system',
    });
    g.status = '已转采购';
    DataStore.addOperLog('M2 门店补货', `建议单转采购 ${g.id}`);
    DataStore.persist();
    return { ok: true, msg: '已按供应商自动拆单并套用合同生成采购单' };
  }

  function runThreeWayMatch(state) {
    state.threeWayMatches.forEach((t) => {
      if (t.diff === 0) { t.level = '绿'; t.handleStatus = '自动通过'; }
      else if (Math.abs(t.diff) < 500) { t.level = '黄'; t.handleStatus = '采购员复核'; }
      else { t.level = '红'; t.handleStatus = '主管+财务复核'; }
    });
    DataStore.addOperLog('M1 采购对账', '三单自动比对完成');
    DataStore.persist();
    return { ok: true, msg: '三单比对完成，差异已分级' };
  }

  function generateStatement(state) {
    state.supplierStatements.unshift({
      id: `STMT${Date.now()}`, supplier: '华润医药商业', period: '2026-05-01~05-31',
      orderCount: 5, totalPayable: 58600, diffLevel: '绿', supplierConfirm: '待确认',
    });
    DataStore.addOperLog('M1 采购对账', '自动生成对账单');
    DataStore.persist();
    return { ok: true, msg: '对账单已生成' };
  }

  function pushStatement(state, id) {
    const s = state.supplierStatements.find((x) => x.id === id) || state.supplierStatements[0];
    if (!s) return { ok: false, msg: '无对账单' };
    state.supplierPortalConfirms.unshift({
      id: `SPC${Date.now()}`, stmtId: s.id, supplier: s.supplier, amount: s.totalPayable,
      pushChannel: '短信+企业微信+邮件', confirmStatus: '待确认', feedback: '—',
    });
    DataStore.addOperLog('M1 采购对账', `推送对账单 ${s.id}`);
    DataStore.persist();
    return { ok: true, msg: '已通过三通道推送给供应商' };
  }

  function syncThreePlatforms(state) {
    state.platformShelf.forEach((p) => { p.syncStatus = '成功'; p.lastSync = DataStore.nowStr(); });
    DataStore.addOperLog('M3 平台同步', '一键同步三平台');
    DataStore.persist();
    return { ok: true, msg: '30 秒内已推送至美团/饿了么/京东' };
  }

  function reconcilePlatformInv(state) {
    state.platformInvDiffs.forEach((d) => {
      if (d.diff !== 0) d.handled = '已自动修正';
      d.diff = 0;
      d.platformQty = d.sysQty;
    });
    DataStore.addOperLog('M3 平台同步', '平台库存对账完成');
    DataStore.persist();
    return { ok: true, msg: '库存对账完成，差异已修正' };
  }

  function pullSalesData(state) {
    state.salesDaily.unshift({
      id: `SD${Date.now()}`, date: new Date().toISOString().slice(0, 10),
      storeName: '朝阳店', skuId: 'SKU10086001', skuName: '阿莫西林胶囊',
      qty: Math.floor(Math.random() * 20) + 5, channel: '京东', updatedAt: DataStore.nowStr(),
    });
    DataStore.addOperLog('M2 门店补货', '拉取三平台销量');
    DataStore.persist();
    return { ok: true, msg: '销售数据已归集' };
  }

  function calcRebate(state) {
    state.rebateLedgers.forEach((r) => {
      r.shouldRebate = Math.round(r.shouldRebate * 1.02);
      if (r.actualRebate < r.shouldRebate * 0.8) r.warn = true;
    });
    DataStore.addOperLog('M1 返利', '应返自动计算');
    DataStore.persist();
    return { ok: true, msg: '应返金额已计算' };
  }

  function getPurchaseDashboardStats(state) {
    const payable = state.supplierStatements.reduce((s, x) => s + x.totalPayable, 0);
    const pendingStmt = state.supplierStatements.filter((x) => x.supplierConfirm === '待确认').length;
    const diffWarn = state.threeWayMatches.filter((x) => x.level !== '绿').length;
    return { payable, pendingStmt, diffWarn, rebateWarn: state.rebateLedgers.filter((r) => r.warn).length };
  }

  function getOpsDashboardStats(state) {
    const syncFail = state.platformShelf.filter((p) => p.syncStatus === '失败').length;
    const stockWarn = state.stocks.filter((s) => s.qty <= s.warnThreshold).length;
    const pendingSuggest = state.replenishSuggestions.filter((r) => r.status === '待审核').length;
    return { syncFail, stockWarn, pendingSuggest, invDiff: state.platformInvDiffs.filter((d) => d.diff !== 0).length };
  }

  return {
    seedExtension, mergeSeed,
    generateSuggestions, convertToPurchase, runThreeWayMatch, generateStatement,
    pushStatement, syncThreePlatforms, reconcilePlatformInv, pullSalesData, calcRebate,
    getPurchaseDashboardStats, getOpsDashboardStats,
  };
})();
