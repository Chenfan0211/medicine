/**
 * 渠道订单履约流程 UI — 流程图 + 波次管理 Tab 页
 */

const WORKFLOW_PAGES = new Set(['ord-workflow', 'ord-wave']);

function renderOrderWorkflow() {
  const s = DataStore.getState();
  const stats = DataStore.getFulfillStats();
  const steps = [
    { icon: '📥', title: '拉取订单', desc: '美团/饿了么/京东', page: 'ord-channel-pool', count: stats.pulled },
    { icon: '🔒', title: '锁单', desc: '不参与波次', page: 'ord-channel-pool', count: stats.locked },
    { icon: '🔗', title: '合单', desc: '同手机+地址+商品', page: 'ord-merge', count: stats.merged },
    { icon: '⚙️', title: '波次策略', desc: '自定义规则', page: 'ord-wave-strategy', count: s.waveStrategies?.length || 0 },
    { icon: '📋', title: '波次生成', desc: '校验 ERP 库存', page: 'ord-wave', count: stats.waves },
    { icon: '📦', title: '请货/拣货', desc: '未请货→已拣货', page: 'ord-wave', count: stats.unrequested },
    { icon: '📍', title: '发货地址', desc: '面单发件人', page: 'ord-ship-addr', count: s.shipAddresses?.length || 0 },
    { icon: '🚚', title: '发货出库', desc: '面单/打包/出库', page: 'ord-pick-ship', count: stats.picked },
  ];
  return `
    <div class="card"><div class="card-title">渠道订单履约流程</div>
      <p class="workflow-hint">拉取京东、饿了么、美团订单后的标准处理链路，点击节点可跳转对应功能页。</p>
      <div class="workflow-pipeline">
        ${steps.map((st, i) => `
          <div class="workflow-node" data-goto-page="${st.page}" title="${st.desc}">
            <div class="workflow-node-icon">${st.icon}</div>
            <div class="workflow-node-title">${st.title}</div>
            <div class="workflow-node-desc">${st.desc}</div>
            <div class="workflow-node-badge">${st.count}</div>
          </div>
          ${i < steps.length - 1 ? '<div class="workflow-arrow">→</div>' : ''}
        `).join('')}
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon blue">📥</div><div><div class="stat-label">渠道订单池</div><div class="stat-value">${stats.pooled}</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">📋</div><div><div class="stat-label">未请货波次</div><div class="stat-value">${stats.unrequested}</div></div></div>
      <div class="stat-card"><div class="stat-icon green">✅</div><div><div class="stat-label">已拣货待发货</div><div class="stat-value">${stats.picked}</div></div></div>
      <div class="stat-card"><div class="stat-icon red">↩️</div><div><div class="stat-label">待回库</div><div class="stat-value">${stats.returnStock}</div></div></div>
    </div>
    <div class="card">
      <div class="card-title">快捷操作</div>
      <div class="workflow-actions">
        <button type="button" class="btn btn-primary" data-workflow-action="pull-all">拉取三渠道订单</button>
        <button type="button" class="btn btn-default" data-workflow-action="auto-merge">自动合单</button>
        <button type="button" class="btn btn-default" data-workflow-action="gen-wave">生成波次</button>
        <button type="button" class="btn btn-default" data-workflow-action="gen-merge-wave">合单波次生成</button>
      </div>
    </div>
    <div class="card card-todo"><div class="card-title">流程说明</div>
      <ul class="workflow-notes">
        <li><strong>锁单</strong>：暂时不发货的订单锁定后，不参与波次生成。</li>
        <li><strong>合单</strong>：相同手机号、相同地址、相同商品的可合并为一单。</li>
        <li><strong>波次生成</strong>：按策略生成波次，校验 ERP 库存后进入「未请货」。</li>
        <li><strong>请货</strong>：可手动修改请货数量，调用 ERP 接口；拣货成功进入「已拣货」，异常取消则「回库」。</li>
        <li><strong>出库</strong>：已拣货订单生成快递单 → 打包 → 打印面单 → 出库，定时回传 ERP 生成出库单。</li>
      </ul>
    </div>`;
}

function renderWaveManagePage(pageId, page) {
  const tab = DataStore.getState().waveTab || '全部';
  const tabs = ['全部', '未请货', '已请货', '已拣货', '已出库', '异常'];
  const tabHtml = tabs.map((t) =>
    `<button type="button" class="wave-tab${t === tab ? ' active' : ''}" data-wave-tab="${t}">${t}</button>`
  ).join('');

  const built = EntityRender.buildRows(pageId);
  const { table, pagination } = renderTableDynamic(pageId, page);

  return `
    ${renderSearchForm(page.search)}
    <div class="card wave-manage-card">
      <div class="wave-tab-bar">${tabHtml}</div>
      ${renderToolbar(page.toolbar)}
      ${table}
      ${pagination}
    </div>`;
}

function bindWorkflowPageEvents() {
  document.querySelectorAll('.workflow-node[data-goto-page]').forEach((node) => {
    node.style.cursor = 'pointer';
  });
}
