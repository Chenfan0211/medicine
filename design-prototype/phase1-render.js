/**
 * 一期合同页面表格渲染
 */
const PHASE1_DYNAMIC_PAGES = new Set([
  'm1-contract', 'm1-rebate-rule', 'm1-po-approve', 'm1-inbound-reg', 'm1-invoice',
  'm1-three-match', 'm1-statement', 'm1-supplier-portal', 'm1-rebate-ledger',
  'm2-sales-data', 'm2-suggestion', 'm2-supplier-priority',
  'm3-platform-price', 'm3-platform-shelf', 'm3-inv-center', 'm3-inv-platform-diff',
  'm4-data-perm', 'm4-notify', 'm4-backup',
]);

const Phase1Render = (() => {
  function buildRows(pageId) {
    if (!PHASE1_DYNAMIC_PAGES.has(pageId)) return null;
    const s = DataStore.getState();
    const f = DataStore.getFilters(pageId);

    function row(entity, id, cells) {
      const td = cells.map((c) => `<td>${typeof c === 'object' && c?.__html ? c.value : (c ?? '—')}</td>`).join('');
      return `<tr data-entity="${entity}" data-id="${id}">${td}</tr>`;
    }

    function paginate(list) {
      const page = DataStore.getPageNum(pageId);
      const size = DataStore.PAGE_SIZE;
      const start = (page - 1) * size;
      return { items: list.slice(start, start + size), total: list.length };
    }

    function packList(list, mapper) {
      const { items, total } = paginate(list);
      return { rowsHtml: items.map(mapper), total };
    }

    switch (pageId) {
      case 'm1-contract':
        return packList((s.supplierContracts || []).filter((c) => !f['供应商'] || c.supplier.includes(f['供应商'])), (c) => row('supplierContracts', c.id, [
          c.id, c.supplier, c.validTo, c.paymentDays, c.settleType,
          tag(c.renewAlert === '正常' ? '正常' : c.renewAlert, c.renewAlert === '正常' ? 'on' : 'pending'),
          tag(c.status, c.status === '生效中' ? 'on' : 'pending'), actions(['详情', '编辑', '续签提醒']),
        ]));
      case 'm1-rebate-rule':
        return packList(s.rebateRules || [], (r) => row('rebateRules', r.id, [
          r.name, r.ruleType, r.params, r.cycle, tag(r.status, 'on'), actions(['编辑', '停用']),
        ]));
      case 'm1-po-approve':
        return packList((s.poApprovals || []).filter((p) => !f['审批状态'] || f['审批状态'] === '全部' || p.status === f['审批状态']), (p) => row('poApprovals', p.id, [
          p.id, p.supplier, `¥${p.amount.toLocaleString()}`, p.approveLevel, p.contractSnap,
          tag(p.status, p.status.includes('待') ? 'pending' : 'on'), p.buyer,
          actions(p.status === '待审批' ? ['详情', '审批', '驳回'] : ['详情']),
        ]));
      case 'm1-inbound-reg':
        return packList(s.purchaseInboundRegs || [], (r) => row('purchaseInboundRegs', r.id, [
          r.id, r.poId, r.skuName, r.orderQty, r.recvQty, r.batchNo, r.expiry,
          tag(r.diff === '0' || r.diff === 0 ? '无' : r.diff, r.diff === '0' ? 'on' : 'off'),
          actions(['详情', '备注差异']),
        ]));
      case 'm1-invoice':
        return packList(s.purchaseInvoices || [], (inv) => row('purchaseInvoices', inv.id, [
          inv.invoiceNo, inv.supplier, inv.poId, `¥${inv.amount.toLocaleString()}`, inv.taxRate, inv.createdAt,
          actions(['详情', '查看附件']),
        ]));
      case 'm1-three-match':
        return packList((s.threeWayMatches || []).filter((t) => !f['差异级别'] || f['差异级别'] === '全部' || t.level === f['差异级别']), (t) => row('threeWayMatches', t.id, [
          t.poId, `¥${t.payable}`, `¥${t.inboundAmt}`, `¥${t.invoiceAmt}`, `¥${t.diff}`,
          tag(t.level, t.level === '绿' ? 'on' : t.level === '黄' ? 'pending' : 'off'),
          t.handleStatus, actions(['详情', '处理']),
        ]));
      case 'm1-statement':
        return packList(s.supplierStatements || [], (st) => row('supplierStatements', st.id, [
          st.id, st.supplier, st.period, st.orderCount, `¥${st.totalPayable.toLocaleString()}`,
          tag(st.diffLevel, st.diffLevel === '绿' ? 'on' : 'pending'),
          tag(st.supplierConfirm, st.supplierConfirm === '已确认' ? 'on' : 'pending'),
          actions(['详情', '推送供应商', 'PDF导出']),
        ]));
      case 'm1-supplier-portal':
        return packList(s.supplierPortalConfirms || [], (c) => row('supplierPortalConfirms', c.id, [
          c.stmtId, c.supplier, `¥${c.amount.toLocaleString()}`, c.pushChannel,
          tag(c.confirmStatus, c.confirmStatus === '已确认' ? 'on' : 'pending'), c.feedback,
          actions(['详情', '模拟确认', '差异反馈']),
        ]));
      case 'm1-rebate-ledger':
        return packList(s.rebateLedgers || [], (r) => row('rebateLedgers', r.id, [
          r.id, r.supplier, r.ruleName, `¥${r.shouldRebate}`, `¥${r.actualRebate}`, `¥${r.diff}`, r.dueDate,
          tag(r.warn ? '预警' : '正常', r.warn ? 'off' : 'on'),
          actions(['详情', '登记实返']),
        ]));
      case 'm2-sales-data':
        return packList((s.salesDaily || []).filter((d) => !f['门店'] || String(f['门店']).includes('全部') || d.storeName === f['门店']), (d) => row('salesDaily', d.id, [
          d.date, d.storeName, d.skuId, d.skuName, d.qty, tag(d.channel, DataStore.channelTag[d.channel] || 'meituan'), d.updatedAt,
        ]));
      case 'm2-suggestion':
        return packList((s.replenishSuggestions || []).filter((r) => !f['状态'] || f['状态'] === '全部' || r.status === f['状态']), (r) => row('replenishSuggestions', r.id, [
          r.id, r.storeName, r.skuId, r.suggestQty, r.supplier, r.eta, r.matchScore,
          tag(r.status, r.status === '已转采购' ? 'done' : 'pending'),
          actions(r.status === '待审核' ? ['详情', '调整数量', '通过', '转采购'] : ['详情']),
        ]));
      case 'm2-supplier-priority':
        return packList(s.supplierPriorities || [], (p) => row('supplierPriorities', p.id, [
          p.skuId, p.skuName, p.primarySupplier, p.backupSupplier, `${p.paymentDays}天`, p.leadTime, p.priority,
          actions(['编辑', '备选切换']),
        ]));
      case 'm3-platform-price':
        return packList(s.platformPrices || [], (p) => row('platformPrices', p.id, [
          p.skuId, p.skuName, `¥${p.basePrice}`, `¥${p.meituanPrice}`, `¥${p.elemePrice}`, `¥${p.jdPrice}`, p.updatedAt,
          actions(['编辑', '同步价格']),
        ]));
      case 'm3-platform-shelf':
        return packList((s.platformShelf || []).filter((p) => !f['渠道'] || f['渠道'] === '全部' || p.channel === f['渠道']), (p) => row('platformShelf', p.id, [
          p.skuId, p.storeName, tag(p.channel, DataStore.channelTag[p.channel] || 'meituan'),
          tag(p.shelfStatus, p.shelfStatus === '上架' ? 'on' : 'off'),
          tag(p.syncStatus, p.syncStatus === '成功' ? 'on' : 'off'), p.lastSync,
          actions(p.shelfStatus === '上架' ? ['下架', '重试'] : ['上架', '重试']),
        ]));
      case 'm3-inv-center':
        return packList(s.invCenterView || [], (v) => row('invCenterView', v.id, [
          v.storeName, v.skuId, v.skuName, v.available, v.reserved, v.inTransit, v.platformPush, v.bufferRatio,
          actions(['流水', '调整冗余']),
        ]));
      case 'm3-inv-platform-diff':
        return packList(s.platformInvDiffs || [], (d) => row('platformInvDiffs', d.id, [
          d.time, d.storeName, d.skuId, tag(d.channel, DataStore.channelTag[d.channel] || 'meituan'),
          d.sysQty, d.platformQty, d.diff, tag(d.handled, d.handled === '待修正' ? 'pending' : 'on'),
          actions(['详情', '修正']),
        ]));
      case 'm4-data-perm':
        return packList(s.dataPermissions || [], (d) => row('dataPermissions', d.id, [
          d.name, d.dimension, d.scope, d.roles, tag(d.status, 'on'), actions(['编辑', '删除']),
        ]));
      case 'm4-notify':
        return packList(s.notifyTemplates || [], (n) => row('notifyTemplates', n.id, [
          n.name, n.scene, n.channel, n.lastSend, tag(n.status, 'on'), actions(['编辑', '测试发送']),
        ]));
      case 'm4-backup':
        return packList(s.backupRecords || [], (b) => row('backupRecords', b.id, [
          b.id, b.time, b.size, b.retainDays, tag(b.status, 'on'), actions(['详情', '恢复']),
        ]));
      default:
        return null;
    }
  }

  return { buildRows, PHASE1_DYNAMIC_PAGES };
})();
