/**
 * 一期合同 UI — 功能总览、采购看板、运营看板
 */

function renderPhase1Overview() {
  const modules = [
    { code: 'M1', name: '采购对账自动化', count: 18, icon: '🧾', color: 'blue' },
    { code: 'M2', name: '门店补货计划', count: 12, icon: '📦', color: 'green' },
    { code: 'M3', name: '三平台商品库存', count: 16, icon: '🔗', color: 'orange' },
    { code: 'M4', name: '基础平台', count: 10, icon: '⚙️', color: 'purple' },
  ];
  const rows = (PHASE1_FEATURES || []).map((f) => `
    <tr data-goto-page="${f.page}">
      <td><code>${f.code}</code></td>
      <td>${f.module}</td>
      <td>${f.name}</td>
      <td><a href="javascript:void(0)" class="text-link phase1-goto" data-goto-page="${f.page}">进入功能 →</a></td>
    </tr>`).join('');

  return `
    <div class="card"><div class="card-title">一期建设范围（合同附件 · 62 项）</div>
      <p class="workflow-hint">建设目标：采购对账自动化、门店补货建议、三平台商品库存同步。实施周期 10 周。灰色项为二期范围（会员/营销/高级 BI 等）。</p>
      <div class="stat-grid">
        ${modules.map((m) => `
          <div class="stat-card phase1-module-card" data-goto-page="dash-purchase">
            <div class="stat-icon ${m.color}">${m.icon}</div>
            <div><div class="stat-label">${m.code} ${m.name}</div><div class="stat-value">${m.count} 项</div></div>
          </div>`).join('')}
        <div class="stat-card"><div class="stat-icon red">📋</div><div><div class="stat-label">合计</div><div class="stat-value">62 项</div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">功能清单索引</div>
      <div class="search-form" style="margin-bottom:12px">
        <div class="form-item"><label>模块</label><select id="phase1-filter-module"><option value="">全部</option><option>M1</option><option>M2</option><option>M3</option><option>M4</option></select></div>
        <div class="form-item w200"><label>关键词</label><input type="text" id="phase1-filter-kw" placeholder="功能名称/编号" /></div>
      </div>
      <div class="table-wrap"><table id="phase1-feature-table"><thead><tr><th>编号</th><th>模块</th><th>功能名称</th><th>入口</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
    <div class="card card-todo"><div class="card-title">不在本期范围（二期）</div>
      <ul class="workflow-notes">
        <li>自动开票、税务对接（M1 不含）</li>
        <li>门店收货 APP、报损管理（M2 不含）</li>
        <li>营销活动配置、会员体系（M3 不含）</li>
        <li>高级 BI 分析（M4 不含）</li>
      </ul>
    </div>`;
}

function renderPhase1Dashboard(kind) {
  const s = DataStore.getState();
  if (kind === 'purchase') {
    const st = Phase1Data.getPurchaseDashboardStats(s);
    return `
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon blue">💰</div><div><div class="stat-label">应付总额</div><div class="stat-value">¥${st.payable.toLocaleString()}</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">📋</div><div><div class="stat-label">待确认对账单</div><div class="stat-value">${st.pendingStmt}</div></div></div>
        <div class="stat-card"><div class="stat-icon red">⚠️</div><div><div class="stat-label">三单差异预警</div><div class="stat-value">${st.diffWarn}</div></div></div>
        <div class="stat-card"><div class="stat-icon red">↩️</div><div><div class="stat-label">返利预警</div><div class="stat-value">${st.rebateWarn}</div></div></div>
      </div>
      <div class="chart-grid">
        <div class="card"><div class="card-title">对账进度 (M4-6)</div>
          <div class="table-wrap"><table><thead><tr><th>供应商</th><th>周期</th><th>状态</th><th>差异</th></tr></thead><tbody>
          ${(s.supplierStatements||[]).map(x=>`<tr><td>${x.supplier}</td><td>${x.period}</td><td>${x.supplierConfirm}</td><td>${x.diffLevel}</td></tr>`).join('')}
          </tbody></table></div>
        </div>
        <div class="card"><div class="card-title">差异分级 (M1-3-3)</div>
          <div class="workflow-notes">
            <li><span class="tag tag-on">绿</span> 自动通过</li>
            <li><span class="tag tag-pending">黄</span> 采购员复核</li>
            <li><span class="tag tag-off">红</span> 主管+财务双人复核</li>
          </div>
          <div style="margin-top:16px"><button type="button" class="btn btn-primary" data-phase1-action="three-match">执行三单比对</button></div>
        </div>
      </div>`;
  }
  const st = Phase1Data.getOpsDashboardStats(s);
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon red">🔗</div><div><div class="stat-label">同步失败</div><div class="stat-value">${st.syncFail}</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">📦</div><div><div class="stat-label">库存预警 SKU</div><div class="stat-value">${st.stockWarn}</div></div></div>
      <div class="stat-card"><div class="stat-icon blue">📋</div><div><div class="stat-label">待审核补货建议</div><div class="stat-value">${st.pendingSuggest}</div></div></div>
      <div class="stat-card"><div class="stat-icon red">⚖️</div><div><div class="stat-label">平台库存差异</div><div class="stat-value">${st.invDiff}</div></div></div>
    </div>
    <div class="chart-grid">
      <div class="card"><div class="card-title">平台同步状态 (M3-2-2)</div>
        <div class="table-wrap"><table><thead><tr><th>SKU</th><th>渠道</th><th>状态</th></tr></thead><tbody>
        ${(s.platformShelf||[]).slice(0,5).map(x=>`<tr><td>${x.skuId}</td><td>${x.channel}</td><td>${x.syncStatus}</td></tr>`).join('')}
        </tbody></table></div>
        <button type="button" class="btn btn-primary" style="margin-top:12px" data-phase1-action="sync-platforms">一键同步三平台</button>
      </div>
      <div class="card"><div class="card-title">销售趋势 (M2/M4-6)</div>
        <div class="chart-placeholder"><div class="chart-bars">${[40,55,48,62,58,70,65].map(h=>`<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div></div>
      </div>
    </div>`;
}

function renderM2ReplenConfigCards() {
  const c = DataStore.getState().replenConfig || {};
  return [
    { title: '销量预测权重 (M2-2-1)', fields: [{ label: '近7日权重', value: c.weight7 ?? 0.5 }, { label: '近30日权重', value: c.weight30 ?? 0.3 }, { label: '同比上月权重', value: c.weightYoY ?? 0.2 }] },
    { title: '安全库存 (M2-2-2)', fields: [{ label: '服务水平', value: `${(c.serviceLevel ?? 0.95) * 100}%` }, { label: '补货提前期(天)', value: c.leadDays ?? 2 }, { label: '波动系数', value: c.volatility ?? 1.2 }] },
    { title: '供应商匹配 (M2-3)', fields: [{ label: '价格权重', value: `${(c.priceWeight ?? 0.4) * 100}%` }, { label: '账期权重', value: `${(c.paymentWeight ?? 0.2) * 100}%` }, { label: '时效权重', value: `${(c.leadWeight ?? 0.25) * 100}%` }] },
  ];
}

function renderM3InvSyncConfigCards() {
  const c = DataStore.getState().replenConfig || {};
  return [
    { title: '同步策略 (M3-3-2 / M3-3-3)', fields: [{ label: '同步延迟上限', value: `${c.syncDelaySec ?? 30} 秒` }, { label: '安全冗余比例', value: `${((c.bufferRatio ?? 0.05) * 100)}%` }, { label: '防超卖串行扣减 (M3-4-3)', value: '已启用' }] },
    { title: '定时对账 (M3-4-4)', fields: [{ label: '对账频率', value: `每 ${c.reconcileMin ?? 30} 分钟` }, { label: '自动修正', value: '是' }, { label: '上次对账', value: DataStore.nowStr() }] },
  ];
}
