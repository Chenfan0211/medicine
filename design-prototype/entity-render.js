/**
 * 从 DataStore 渲染表格行（含 data-entity / data-id）
 */
const DYNAMIC_PAGES = new Set([
  'sys-user', 'sys-role', 'sys-dict', 'sys-oper-log', 'sys-login-log',
  'prd-brand', 'prd-spu', 'prd-sku',
  'inv-stock', 'inv-log', 'inv-check', 'inv-transfer', 'inv-inbound', 'inv-expiry',
  'ord-list', 'ord-after-sale', 'sto-list',
  'chn-store-map', 'chn-product-map', 'chn-sync', 'chn-sync-log',
  'mem-list', 'mem-level', 'mem-point', 'mem-coupon',
  'pur-supplier', 'pur-order', 'pur-return',
  'fin-bill', 'fin-reconcile', 'fin-settlement',
  'rx-pending', 'rx-list', 'rx-log', 'del-list',
]);

const TREE_PAGES = new Set(['sys-menu', 'sys-dept', 'prd-category']);
const REPORT_PAGES = new Set(['rpt-sales', 'rpt-stock', 'rpt-purchase', 'rpt-analysis']);
const MAP_PAGES = new Set(['sto-delivery', 'del-track']);

const EntityRender = (() => {
  function treeIndent(depth, name) {
    if (depth === 0) return name;
    if (depth === 1) return `├ ${name}`;
    return `│ └ ${name}`;
  }

  function treeTr(entity, id, cells) {
    const td = cells.map((c, i) => `<td${i === 0 ? ' class="tree-name"' : ''}>${cellValue(c)}</td>`).join('');
    return `<tr data-entity="${entity}" data-id="${id}">${td}</tr>`;
  }

  function tr(entity, id, cells) {
    const td = cells.map((c) => `<td>${cellValue(c)}</td>`).join('');
    return `<tr data-entity="${entity}" data-id="${id}">${td}</tr>`;
  }

  function paginate(list, pageId) {
    const page = DataStore.getPageNum(pageId);
    const size = DataStore.PAGE_SIZE;
    const start = (page - 1) * size;
    return { items: list.slice(start, start + size), total: list.length };
  }

  function pack(pageId, list, mapper) {
    const { items, total } = paginate(list, pageId);
    return { rowsHtml: items.map(mapper), total };
  }

  function buildRows(pageId) {
    if (!DYNAMIC_PAGES.has(pageId)) return null;
    const s = DataStore.getState();
    const f = DataStore.getFilters(pageId);

    switch (pageId) {
      case 'sys-user': {
        let list = s.users.filter((u) => {
          if (f['用户名'] && !u.username.includes(f['用户名']) && !u.nickname.includes(f['用户名'])) return false;
          if (f['状态'] && f['状态'] !== '全部' && u.status !== f['状态']) return false;
          if (f['部门'] && !f['部门'].includes('全部') && u.dept !== f['部门']) return false;
          return true;
        });
        return pack(pageId, list, (u) => tr('users', u.id, [
          u.username, u.nickname, u.dept, DataStore.maskPhone(u.phone),
          tag(u.status, u.status === '正常' ? 'on' : 'off'), u.createdAt, actions(['编辑', '重置密码', '删除']),
        ]));
      }
      case 'sys-role': {
        let list = s.roles.filter((r) => !f['状态'] || f['状态'] === '全部' || r.status === f['状态']);
        if (f['角色名称']) list = list.filter((r) => r.name.includes(f['角色名称']));
        return pack(pageId, list, (r) => tr('roles', r.id, [
          r.name, r.code, r.sort, tag(r.status, r.status === '正常' ? 'on' : 'off'), r.createdAt, actions(['编辑', '权限', '删除']),
        ]));
      }
      case 'prd-sku': {
        let list = s.skus.filter((sk) => {
          if (f['SKU 编码/名称'] && !sk.id.includes(f['SKU 编码/名称']) && !sk.name.includes(f['SKU 编码/名称'])) return false;
          if (f['处方药'] && f['处方药'] !== '全部') {
            if ((f['处方药'] === '是') !== sk.isRx) return false;
          }
          if (f['状态'] && f['状态'] !== '全部' && sk.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (sk) => tr('skus', sk.id, [
          thumb(sk.emoji || '💊'), sk.id, sk.name, sk.spec, sk.approvalNo, sk.manufacturer,
          `¥${sk.price.toFixed(2)}`, tag(sk.isRx ? 'Rx' : 'OTC', sk.isRx ? 'rx' : 'otc'),
          tag(sk.status, sk.status === '上架' ? 'on' : 'off'),
          actions(['编辑', '价格', sk.status === '上架' ? '下架' : '上架']),
        ]));
      }
      case 'ord-list': {
        let list = s.orders.filter((o) => {
          if (f['订单号'] && !o.id.includes(f['订单号'])) return false;
          if (f['渠道'] && f['渠道'] !== '全部' && o.channel !== f['渠道']) return false;
          if (f['门店'] && !String(f['门店']).includes('全部') && o.storeName !== f['门店']) return false;
          if (f['状态'] && f['状态'] !== '全部' && o.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (o) => {
          const acts = ['详情'];
          if (o.status === '待处方审核') acts.push('取消');
          else if (o.status === '待拣货') acts.push('拣货', '取消');
          else if (o.status === '待配送') acts.push('发货', '取消');
          else if (o.status === '配送中') acts.push('完成');
          else if (o.status === '待支付') acts.push('取消');
          else if (o.status === '已完成') acts.push('售后');
          return tr('orders', o.id, [
            link(o.id), tag(o.channel, DataStore.channelTag[o.channel] || 'self'), o.storeName,
            `¥${o.amount.toFixed(2)}`, tag(o.status, DataStore.orderStatusTag[o.status] || 'pending'),
            `${o.receiver.slice(0, 1)}** ${DataStore.maskPhone(o.phone)}`, o.createdAt, actions(acts),
          ]);
        });
      }
      case 'inv-stock':
        return pack(pageId, s.stocks, (st) => tr('stocks', st.id, [
          st.storeName, st.skuId, st.skuName, st.spec, st.batchNo, st.expiry, st.qty, st.lockQty,
          tag(st.qty <= st.warnThreshold ? '预警' : '正常', st.qty <= st.warnThreshold ? 'pending' : 'on'),
          actions(['流水', '补货']),
        ]));
      case 'inv-log':
        return pack(pageId, s.stockLogs, (l) => tr('stockLogs', l.id, [
          l.id, l.storeName, l.skuId, tag(l.type, l.type === '出库' ? 'picking' : 'on'),
          l.change, l.afterQty, l.refNo, l.operator, l.time,
        ]));
      case 'inv-expiry': {
        const expiryList = s.stocks.map((st) => {
          const days = Math.ceil((new Date(st.expiry) - new Date()) / 86400000);
          return { ...st, _days: days };
        }).filter((st) => st._days <= 90);
        return pack(pageId, expiryList, (st) => tr('stocks', st.id, [
          st.storeName, st.skuId, st.skuName, st.batchNo, st.expiry,
          st._days <= 0 ? tag('已过期', 'off') : `${st._days}天`, st.qty,
          tag(st._days <= 30 ? '≤30天' : '≤90天', st._days <= 30 ? 'off' : 'pending'),
          actions(['详情', '促销']),
        ]));
      }
      case 'rx-pending':
        return pack(pageId, s.prescriptions.filter((r) => r.status === '待审核'), (r) => tr('prescriptions', r.id, [
          r.id, link(r.orderId), r.storeName, r.patient, r.drugCount, thumb('📄'),
          r.submitTime, `${r.waitMin}分钟`, actions(['审核', '查看']),
        ]));
      case 'rx-list':
        return pack(pageId, s.prescriptions.filter((r) => r.status !== '待审核'), (r) => tr('prescriptions', r.id, [
          r.id, r.orderId, r.storeName, r.patient, '药师', tag(r.status, r.status === '已通过' ? 'on' : 'off'),
          r.submitTime, actions(['详情', '查看处方']),
        ]));
      case 'rx-log': {
        const logs = s.rxLogs.length ? s.rxLogs : [{ id: '-', rxId: '-', reviewer: '-', result: '暂无', reason: '-', time: '-' }];
        return { rowsHtml: logs.map((l) => tr('rxLogs', l.id, [l.id, l.rxId, l.reviewer, tag(l.result, l.result === '已通过' ? 'on' : 'off'), l.reason, l.time, actions(['详情'])])), total: logs.length };
      }
      case 'ord-after-sale':
        return pack(pageId, s.afterSales, (a) => tr('afterSales', a.id, [
          a.id, a.orderId, tag(a.channel, DataStore.channelTag[a.channel] || 'meituan'), a.type,
          `¥${a.amount.toFixed(2)}`, tag(a.status, a.status === '待审核' ? 'pending' : 'on'),
          a.createdAt, actions(a.status === '待审核' ? ['详情', '同意', '拒绝'] : ['详情']),
        ]));
      case 'sto-list':
        return pack(pageId, s.stores, (st) => tr('stores', st.id, [
          st.id, st.name, st.city, st.address, st.manager, st.phone,
          tag(st.rxSupport ? '支持' : '不支持', st.rxSupport ? 'on' : 'off'),
          tag(st.status, st.status === '营业中' ? 'on' : 'pending'),
          actions(['编辑', '配送范围', st.status === '营业中' ? '休息' : '营业']),
        ]));
      case 'mem-list':
        return pack(pageId, s.members, (m) => tr('members', m.id, [
          m.id, m.nickname, DataStore.maskPhone(m.phone), tag(m.level, 'on'), m.points.toLocaleString(),
          `¥${m.totalSpend.toLocaleString()}`, tag(m.channel, DataStore.channelTag[m.channel] || 'self'),
          m.createdAt, actions(['详情', '积分', '优惠券']),
        ]));
      case 'pur-supplier':
        return pack(pageId, s.suppliers, (su) => tr('suppliers', su.id, [
          su.id, su.name, su.contact, su.phone, su.certExpiry, su.skuCount, tag(su.status, 'on'), actions(['编辑', '资质', '停用']),
        ]));
      case 'del-list':
        return pack(pageId, s.deliveries, (d) => tr('deliveries', d.id, [
          d.id, link(d.orderId), d.storeName, d.mode, d.rider,
          tag(d.status, DataStore.orderStatusTag[d.status] || 'pending'), d.eta,
          actions(d.status === '待接单' ? ['详情', '指派', '完成'] : ['详情', '完成']),
        ]));
      case 'chn-sync-log':
        return pack(pageId, s.channelSyncLogs, (l) => tr('channelSyncLogs', l.id, [
          l.id, l.taskId, tag(l.channel, DataStore.channelTag[l.channel] || 'eleme'), l.type, l.target,
          tag(l.success ? '成功' : '失败', l.success ? 'on' : 'off'), l.error || '—', l.time,
          actions(l.success ? ['详情'] : ['详情', '重试']),
        ]));
      case 'chn-sync':
        return pack(pageId, s.channelSyncTasks, (t) => tr('channelSyncTasks', t.id, [
          t.id, t.type, tag(t.channel, DataStore.channelTag[t.channel] || 'meituan'), t.scope,
          tag(t.status, 'delivering'), t.progress, t.createdAt, actions(['详情', '重试']),
        ]));
      case 'sys-oper-log':
        return pack(pageId, s.operLogs, (l) => tr('operLogs', l.id, [
          l.id, l.module, l.action, l.user, l.ip, l.time, actions(['详情']),
        ]));
      case 'prd-brand':
        return pack(pageId, s.brands, (b) => tr('brands', b.id, [
          thumb('🏭'), b.name, b.id, b.sort, tag(b.status, 'on'), actions(['编辑', '删除']),
        ]));
      case 'prd-spu':
        return pack(pageId, s.spus, (sp) => tr('spus', sp.id, [
          sp.id, sp.name, sp.category, sp.brand, sp.skuCount, tag(sp.status, 'on'), actions(['编辑', 'SKU', '下架']),
        ]));
      case 'sys-dict':
        return pack(pageId, s.dicts, (d) => tr('dicts', d.id, [
          d.name, d.type, tag(d.status, 'on'), d.remark, d.createdAt, actions(['编辑', '字典数据', '删除']),
        ]));
      case 'mem-coupon':
        return pack(pageId, s.coupons, (c) => tr('coupons', c.id, [
          c.name, c.type, c.value, c.threshold, `${c.claimed}/${c.total}`, c.expiry,
          tag(c.status, 'on'), actions(['编辑', '发放', '停用']),
        ]));
      case 'sys-login-log': {
        let list = s.loginLogs.filter((l) => {
          if (f['用户名'] && !l.username.includes(f['用户名'])) return false;
          if (f['登录状态'] && f['登录状态'] !== '全部' && l.status !== f['登录状态']) return false;
          return true;
        });
        return pack(pageId, list, (l) => tr('loginLogs', l.id, [
          l.username, l.ip, l.location, l.browser,
          tag(l.status, l.status === '成功' ? 'on' : 'off'), l.time, actions(['详情']),
        ]));
      }
      case 'inv-check': {
        let list = s.inventoryChecks.filter((c) => {
          if (f['盘点单号'] && !c.id.includes(f['盘点单号'])) return false;
          if (f['门店'] && !String(f['门店']).includes('全部') && c.storeName !== f['门店']) return false;
          if (f['状态'] && f['状态'] !== '全部' && c.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (c) => tr('inventoryChecks', c.id, [
          c.id, c.storeName, c.checkType, c.skuCount, c.diffCount,
          tag(c.status, c.status === '已完成' ? 'on' : 'pending'), c.checker, c.createdAt,
          actions(c.status === '盘点中' ? ['详情', '录入', '完成'] : ['详情', '导出']),
        ]));
      }
      case 'inv-transfer': {
        let list = s.transfers.filter((t) => {
          if (f['调拨单号'] && !t.id.includes(f['调拨单号'])) return false;
          if (f['状态'] && f['状态'] !== '全部' && t.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (t) => tr('transfers', t.id, [
          t.id, t.fromStore, t.toStore, t.skuCount, t.totalQty,
          tag(t.status, t.status === '已完成' ? 'on' : 'delivering'), t.creator, t.createdAt,
          actions(t.status === '在途' ? ['详情', '确认入库'] : ['详情']),
        ]));
      }
      case 'inv-inbound': {
        let list = s.inbounds.filter((ib) => {
          if (f['入库单号'] && !ib.id.includes(f['入库单号'])) return false;
          if (f['门店'] && !String(f['门店']).includes('全部') && ib.storeName !== f['门店']) return false;
          if (f['状态'] && f['状态'] !== '全部' && ib.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (ib) => tr('inbounds', ib.id, [
          ib.id, ib.storeName, ib.inboundType, ib.refNo, ib.skuCount, ib.totalQty,
          tag(ib.status, ib.status === '已入库' ? 'on' : 'pending'), ib.inboundTime,
          actions(ib.status === '待入库' ? ['详情', '确认入库'] : ['详情']),
        ]));
      }
      case 'chn-store-map': {
        let list = s.channelStoreMaps.filter((m) => {
          if (f['门店'] && !String(f['门店']).includes('全部') && m.storeName !== f['门店']) return false;
          if (f['渠道'] && f['渠道'] !== '全部' && m.channel !== f['渠道']) return false;
          if (f['映射状态'] && f['映射状态'] !== '全部') {
            const st = m.mapped ? '已映射' : '未映射';
            if (st !== f['映射状态']) return false;
          }
          return true;
        });
        return pack(pageId, list, (m) => tr('channelStoreMaps', m.id, [
          m.storeName, tag(m.channel, DataStore.channelTag[m.channel] || 'meituan'),
          m.platformId || '—', m.platformName,
          tag(m.mapped ? '已映射' : '未映射', m.mapped ? 'on' : 'off'), m.lastSync,
          actions(m.mapped ? ['编辑', '解绑', '同步'] : ['映射', '同步']),
        ]));
      }
      case 'chn-product-map': {
        let list = s.channelProductMaps.filter((m) => {
          if (f['SKU 编码/名称'] && !m.skuId.includes(f['SKU 编码/名称']) && !m.skuName.includes(f['SKU 编码/名称'])) return false;
          if (f['渠道'] && f['渠道'] !== '全部' && m.channel !== f['渠道']) return false;
          return true;
        });
        return pack(pageId, list, (m) => tr('channelProductMaps', m.id, [
          m.skuId, m.skuName, tag(m.channel, DataStore.channelTag[m.channel] || 'meituan'),
          m.platformId || '—',
          tag(m.syncFailed ? '同步失败' : m.mapped ? '已映射' : '未映射', m.syncFailed ? 'off' : m.mapped ? 'on' : 'pending'),
          m.lastSync, actions(m.mapped ? (m.syncFailed ? ['编辑', '重试', '日志'] : ['编辑', '同步']) : ['映射', '同步']),
        ]));
      }
      case 'mem-level':
        return pack(pageId, s.memberLevels, (lv) => tr('memberLevels', lv.id, [
          lv.name, lv.code, `¥${lv.threshold.toLocaleString()}`, lv.discount, lv.pointRate, lv.sort,
          tag(lv.status, 'on'), actions(['编辑', '删除']),
        ]));
      case 'mem-point': {
        let list = s.pointLogs.filter((p) => {
          if (f['会员手机号'] && !p.memberPhone.includes(f['会员手机号'].replace(/\*/g, ''))) return false;
          if (f['变动类型'] && f['变动类型'] !== '全部' && p.type !== f['变动类型']) return false;
          return true;
        });
        return pack(pageId, list, (p) => tr('pointLogs', p.id, [
          p.id, DataStore.maskPhone(p.memberPhone), tag(p.type, p.change > 0 ? 'on' : 'off'),
          p.change > 0 ? `+${p.change}` : String(p.change), p.balance.toLocaleString(),
          p.orderId, p.time,
        ]));
      }
      case 'pur-order': {
        let list = s.purchaseOrders.filter((po) => {
          if (f['采购单号'] && !po.id.includes(f['采购单号'])) return false;
          if (f['状态'] && f['状态'] !== '全部' && po.status !== f['状态']) return false;
          return true;
        });
        return pack(pageId, list, (po) => tr('purchaseOrders', po.id, [
          po.id, po.supplier, po.skuCount, `¥${po.amount.toLocaleString()}`,
          tag(po.status, po.status === '已完成' ? 'on' : 'pending'), po.buyer, po.createdAt,
          actions(['详情', '审核', '入库'].filter((a) => po.status !== '已完成' || a === '详情')),
        ]));
      }
      case 'pur-return':
        return pack(pageId, s.purchaseReturns, (pr) => tr('purchaseReturns', pr.id, [
          pr.id, pr.poId, pr.supplier, pr.skuCount, `¥${pr.amount.toLocaleString()}`,
          tag(pr.status, pr.status === '待审核' ? 'pending' : 'on'), pr.createdAt,
          actions(pr.status === '待审核' ? ['详情', '审核', '出库'] : ['详情']),
        ]));
      case 'fin-bill':
        return pack(pageId, s.bills, (b) => tr('bills', b.id, [
          b.id, tag(b.channel, DataStore.channelTag[b.channel] || 'meituan'), b.period, b.orderCount.toLocaleString(),
          `¥${b.platformAmount.toLocaleString()}`, `¥${b.erpAmount.toLocaleString()}`, `¥${b.diff}`,
          tag(b.status, b.status === '已确认' ? 'on' : 'pending'),
          actions(b.status !== '已确认' ? ['详情', '对账'] : ['详情']),
        ]));
      case 'fin-reconcile': {
        let list = s.reconciles.filter((r) => {
          if (f['订单号'] && !r.orderId.includes(f['订单号'])) return false;
          if (f['对账结果'] && f['对账结果'] !== '全部' && r.result !== f['对账结果']) return false;
          return true;
        });
        return pack(pageId, list, (r) => tr('reconciles', r.id, [
          r.orderId, tag(r.channel, DataStore.channelTag[r.channel] || 'meituan'),
          `¥${r.erpAmount.toFixed(2)}`, `¥${r.platformAmount.toFixed(2)}`, `¥${r.diff}`,
          tag(r.result, r.result === '一致' ? 'on' : 'pending'), r.time,
          actions(r.result !== '一致' ? ['详情', '处理'] : ['详情']),
        ]));
      }
      case 'fin-settlement':
        return pack(pageId, s.settlements, (st) => tr('settlements', st.id, [
          st.id, st.storeName, st.period, st.orderCount, `¥${st.sales.toLocaleString()}`,
          `¥${st.commission.toLocaleString()}`, `¥${st.deliveryFee.toLocaleString()}`, `¥${st.settleAmount.toLocaleString()}`,
          tag(st.status, st.status === '已结算' ? 'on' : 'pending'),
          actions(st.status === '待确认' ? ['详情', '确认'] : ['详情']),
        ]));
      default:
        return null;
    }
  }

  function buildTreeRows(pageId) {
    if (!TREE_PAGES.has(pageId)) return null;
    const s = DataStore.getState();
    switch (pageId) {
      case 'sys-menu':
        return s.menus.map((m) => treeTr('menus', m.id, [
          treeIndent(m.depth, m.name), m.icon || '—', m.sort, DataStore.getDictLabel('sys_perm', m.perm), m.menuType,
          tag(m.status, 'on'), actions(['编辑', '新增', '删除']),
        ]));
      case 'sys-dept':
        return s.depts.map((d) => treeTr('depts', d.id, [
          treeIndent(d.depth, d.name), d.sort, d.manager, d.phone,
          tag(d.status, 'on'), actions(['编辑', '新增', '删除']),
        ]));
      case 'prd-category':
        return s.categories.map((c) => treeTr('categories', c.id, [
          treeIndent(c.depth, c.name), c.code, c.sort,
          tag(c.status, 'on'), actions(['编辑', '新增', '删除']),
        ]));
      default:
        return null;
    }
  }

  function buildReportRows(pageId) {
    if (!REPORT_PAGES.has(pageId)) return null;
    switch (pageId) {
      case 'rpt-sales':
        return {
          rows: DataStore.getSalesReportRows().map((r) => tr('salesReports', r.id, [
            r.date, r.storeName, r.channel, r.count, `¥${Math.round(r.sales).toLocaleString()}`,
            r.count ? `¥${(r.sales / r.count).toFixed(2)}` : '—', `¥${Math.round(r.refund)}`,
          ])),
          total: DataStore.getSalesReportRows().length,
          statCards: null,
        };
      case 'rpt-stock':
        return {
          rows: DataStore.getStockReportRows().map((r) => tr('stockReports', r.id, [
            r.storeName, r.skuCount, r.totalQty.toLocaleString(), `¥${r.amount.toLocaleString()}`,
            '28天', r.warn, r.expiry,
          ])),
          total: DataStore.getStockReportRows().length,
          statCards: null,
        };
      case 'rpt-purchase':
        return {
          rows: DataStore.getPurchaseReportRows().map((r) => tr('purchaseReports', r.id, [
            r.month, r.supplier, r.poCount, `¥${Math.round(r.amount).toLocaleString()}`,
            `¥${Math.round(r.inbound).toLocaleString()}`, `¥${Math.round(r.ret).toLocaleString()}`,
          ])),
          total: DataStore.getPurchaseReportRows().length,
          statCards: null,
        };
      case 'rpt-analysis': {
        const stats = DataStore.getDashboardStats();
        const orderTotal = DataStore.getState().orders.filter((o) => o.status !== '已取消').length;
        return {
          rows: DataStore.getAnalysisReportRows().map((r) => tr('analysisReports', r.id, [
            r.metric, r.current, r.prev, r.mom, r.yoy,
          ])),
          total: 4,
          statCards: [
            { label: '总销售额', value: `¥${Math.round(stats.sales).toLocaleString()}`, trend: '实时' },
            { label: '总订单数', value: orderTotal.toLocaleString(), trend: '实时' },
            { label: '毛利率', value: '32.5%', trend: '↑ 1.2%' },
            { label: '复购率', value: '28.6%', trend: '↑ 3.1%' },
          ],
        };
      }
      default:
        return null;
    }
  }

  function readFiltersFromDom(pageEl) {
    const pageId = pageEl.id.replace('page-', '');
    const filters = {};
    pageEl.querySelectorAll('.search-form .form-item').forEach((item) => {
      const label = item.querySelector('label')?.textContent?.trim();
      if (!label) return;
      const input = item.querySelector('input');
      const select = item.querySelector('select');
      if (input) filters[label] = input.value.trim();
      if (select) filters[label] = select.value;
    });
    DataStore.getState().pageFilters[pageId] = filters;
    DataStore.setPageNum(pageId, 1);
    return filters;
  }

  return { buildRows, buildTreeRows, buildReportRows, readFiltersFromDom };
})();

function refreshPage(pageId) {
  const el = document.getElementById(`page-${pageId}`);
  if (!el || !PAGES[pageId]) return;
  el.innerHTML = renderPage(pageId);
}

function refreshCurrentPage() {
  const active = document.querySelector('.page.active');
  if (active) refreshPage(active.id.replace('page-', ''));
  if (document.getElementById('page-dashboard')?.classList.contains('active')) {
    document.getElementById('page-dashboard').innerHTML = renderDashboardFromStore();
    bindDashboardCards();
  }
  DataStore.updateNotifyPanel();
}

function bindDashboardCards() {
  document.querySelectorAll('#page-dashboard .stat-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.onclick = () => {
      const map = { 今日订单: 'ord-list', 今日销售额: 'rpt-sales', 待拣货: 'ord-list', 库存预警: 'inv-expiry' };
      const label = card.querySelector('.stat-label')?.textContent;
      if (map[label]) switchPage(map[label]);
    };
  });
}

function renderDashboardFromStore() {
  const stats = DataStore.getDashboardStats();
  const todos = DataStore.getTodos();
  const channels = ['美团', '饿了么', '京东', '自营'];
  const total = DataStore.getState().orders.length || 1;
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon blue">📦</div><div><div class="stat-label">今日订单</div><div class="stat-value">${stats.orderCount.toLocaleString()}</div><div class="stat-trend up">实时</div></div></div>
      <div class="stat-card"><div class="stat-icon green">💰</div><div><div class="stat-label">今日销售额</div><div class="stat-value">¥${Math.round(stats.sales).toLocaleString()}</div><div class="stat-trend up">实时</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">📋</div><div><div class="stat-label">待拣货</div><div class="stat-value">${stats.pendingPick}</div><div class="stat-trend warn">需处理</div></div></div>
      <div class="stat-card"><div class="stat-icon red">⚠️</div><div><div class="stat-label">库存预警</div><div class="stat-value">${stats.stockWarn}</div><div class="stat-trend down">实时</div></div></div>
    </div>
    <div class="chart-grid">
      <div class="card"><div class="card-title">近 7 日销售趋势</div><div class="chart-placeholder"><div class="chart-bars">${[60,75,55,90,70,85,95].map(h=>`<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div></div></div>
      <div class="card"><div class="card-title">渠道订单占比</div><div class="chart-placeholder" style="height:280px"><div class="pie-chart"></div><div class="pie-legend">${channels.map(c=>{
        const n=DataStore.getState().orders.filter(o=>o.channel===c).length;
        return `<span class="legend-item">${c} ${Math.round(n/total*100)}%</span>`;
      }).join('')}</div></div></div>
    </div>
    <div class="card card-todo"><div class="card-title">待办事项</div>
    <div class="table-wrap"><table><thead><tr><th>类型</th><th>内容</th><th>门店</th><th>时间</th><th>操作</th></tr></thead><tbody>
    ${todos.map(t=>`<tr data-todo-ref="${t.refId||''}"><td>${cellValue(tag(t.type,t.typeTag))}</td><td>${t.text}</td><td>${t.store}</td><td>${t.time}</td><td><div class="action-btns"><a href="javascript:void(0)" data-todo-action="${t.action}" data-todo-target="${t.target}" data-todo-ref="${t.refId||''}">${t.action}</a></div></td></tr>`).join('')||'<tr><td colspan="5" style="text-align:center;color:#999">暂无待办</td></tr>'}
    </tbody></table></div></div>`;
}

function renderTableDynamic(pageId, page, checkbox = true) {
  const built = EntityRender.buildRows(pageId);
  const rows = built?.rowsHtml ?? null;
  const total = built?.total ?? (page.total || 0);
  const pageNum = DataStore.getPageNum(pageId);
  const totalPages = Math.max(1, Math.ceil(total / DataStore.PAGE_SIZE));

  const thCheckbox = checkbox ? `<th style="width:48px"><input type="checkbox"/></th>` : '';
  const thead = `<thead><tr>${thCheckbox}${page.columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = rows?.length
    ? rows.map((r) => (checkbox ? r.replace(/(<tr[^>]*>)/, '$1<td><input type="checkbox"/></td>') : r)).join('')
    : `<tr><td colspan="${page.columns.length+(checkbox?1:0)}" style="text-align:center;padding:32px;color:#9ca3af">暂无数据，可点击「新增」添加</td></tr>`;

  let pageBtns = '';
  for (let p = 1; p <= Math.min(3, totalPages); p++) {
    pageBtns += `<button type="button" class="page-btn${p===pageNum?' active':''}" data-page="${p}">${p}</button>`;
  }

  return {
    table: `<div class="table-wrap"><table data-page-id="${pageId}">${thead}<tbody>${tbody}</tbody></table></div>`,
    pagination: `<div class="pagination" data-page-id="${pageId}"><span>共 ${total.toLocaleString()} 条</span><button type="button" class="page-btn" data-page="prev">‹</button>${pageBtns}${totalPages>3?'<button type="button" class="page-btn">…</button>':''}<button type="button" class="page-btn" data-page="next">›</button><span>每页 ${DataStore.PAGE_SIZE} 条</span></div>`,
  };
}

function renderSysConfigCards() {
  const c = DataStore.getState().sysConfig;
  return [
    { title: '基础参数', fields: [{ label: '系统名称', value: c.systemName }, { label: '默认分页大小', value: c.pageSize }, { label: '会话超时(分钟)', value: c.sessionTimeout }] },
    { title: '业务参数', fields: [{ label: '库存预警阈值', value: c.stockWarn }, { label: '近效期预警天数', value: c.expiryWarnDays }, { label: '订单自动取消(分钟)', value: c.orderCancelMin }] },
    { title: 'OSS 配置', fields: [{ label: 'Bucket', value: c.ossBucket }, { label: 'Endpoint', value: c.ossEndpoint }, { label: 'CDN 域名', value: c.ossCdn }] },
  ];
}

function renderTreeTableDynamic(pageId, page) {
  const rows = EntityRender.buildTreeRows(pageId);
  const thead = `<thead><tr>${page.treeColumns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = rows?.length
    ? rows.join('')
    : `<tr><td colspan="${page.treeColumns.length}" style="text-align:center;padding:32px;color:#9ca3af">暂无数据</td></tr>`;
  return `<div class="table-wrap"><table data-page-id="${pageId}">${thead}<tbody>${tbody}</tbody></table></div>`;
}

function renderReportDynamic(pageId, page) {
  const built = EntityRender.buildReportRows(pageId);
  const rows = built?.rows ?? [];
  const total = built?.total ?? 0;
  const stats = built?.statCards
    ? `<div class="stat-grid">${built.statCards.map((s) => `
      <div class="stat-card"><div class="stat-icon green">📊</div><div><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-trend up">${s.trend}</div></div></div>`).join('')}</div>`
    : '';
  const pageNum = DataStore.getPageNum(pageId);
  const totalPages = Math.max(1, Math.ceil(total / DataStore.PAGE_SIZE));
  let pageBtns = '';
  for (let p = 1; p <= Math.min(3, totalPages); p++) {
    pageBtns += `<button type="button" class="page-btn${p === pageNum ? ' active' : ''}" data-page="${p}">${p}</button>`;
  }
  const thead = `<thead><tr>${page.columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = rows.length
    ? rows.join('')
    : `<tr><td colspan="${page.columns.length}" style="text-align:center;padding:32px;color:#9ca3af">暂无数据</td></tr>`;
  return `
    ${renderSearchForm(page.search)}
    ${stats}
    <div class="card"><div class="card-title">${page.chartTitle}</div><div class="chart-placeholder" style="height:200px"><div class="chart-bars">${[40, 55, 48, 72, 65, 80, 75, 90].map((h) => `<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div></div></div>
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      <div class="table-wrap"><table data-page-id="${pageId}">${thead}<tbody>${tbody}</tbody></table></div>
      <div class="pagination" data-page-id="${pageId}"><span>共 ${total.toLocaleString()} 条</span><button type="button" class="page-btn" data-page="prev">‹</button>${pageBtns}<button type="button" class="page-btn" data-page="next">›</button><span>每页 ${DataStore.PAGE_SIZE} 条</span></div>
    </div>`;
}

function renderMapDynamic(pageId, page) {
  let trackInfo = page.trackInfo;
  if (pageId === 'del-track') {
    const track = DataStore.getActiveDeliveryTrack();
    if (track?.delivery) {
      trackInfo = {
        order: track.delivery.orderId,
        rider: track.delivery.rider,
        phone: DataStore.maskPhone('13812349999'),
        status: track.delivery.status,
        eta: track.delivery.eta,
      };
    }
  }
  const info = trackInfo
    ? `<div class="map-track-info">
        <div><strong>订单：</strong>${trackInfo.order}</div>
        <div><strong>骑手：</strong>${trackInfo.rider} ${trackInfo.phone || ''}</div>
        <div><strong>状态：</strong>${trackInfo.status} · 预计 ${trackInfo.eta} 送达</div>
      </div>`
    : '';
  const storeOptions = DataStore.getState().stores.map((st) => st.name);
  const search = page.search ? page.search.map((f) => {
    if (f.label === '选择门店' && f.type === 'select') return { ...f, options: storeOptions };
    return f;
  }) : page.search;
  const selectedStore = DataStore.getState().stores[0];
  const hasRange = selectedStore && DataStore.getState().deliveryRanges?.[selectedStore.id];
  return `
    ${renderSearchForm(search)}
    <div class="card map-card" data-map-page="${pageId}">
      <div class="card-title">${page.mapTitle}</div>
      ${info}
      <div class="map-placeholder${hasRange && pageId === 'sto-delivery' ? ' map-active' : ''}">
        <div class="map-grid"></div>
        <div class="map-pin store">🏪 门店</div>
        <div class="map-pin rider">🛵 骑手</div>
        <div class="map-pin dest">📍 收货地址</div>
        <div class="map-route"></div>
        <p class="map-hint">${page.mapHint}</p>
      </div>
      <div class="map-toolbar">
        <button type="button" class="btn btn-primary">绘制范围</button>
        <button type="button" class="btn btn-default">清除</button>
        <button type="button" class="btn btn-default">保存</button>
      </div>
    </div>`;
}

function renderChannelConfigCards() {
  const cfg = DataStore.getState().channelConfig;
  return [
    { title: '美团闪购', channel: 'meituan', fields: [{ label: '应用密钥', value: cfg.meituan.appKey }, { label: '最后同步', value: cfg.meituan.lastSync }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
    { title: '饿了么零售', channel: 'eleme', fields: [{ label: '应用密钥', value: cfg.eleme.appKey }, { label: '最后同步', value: cfg.eleme.lastSync }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
    { title: '京东到家', channel: 'jd', fields: [{ label: '应用密钥', value: cfg.jd.appKey }, { label: '最后同步', value: cfg.jd.lastSync }, { label: '状态', value: tag('已启用', 'on') }], actions: ['编辑', '测试连接', '同步门店'] },
  ];
}
