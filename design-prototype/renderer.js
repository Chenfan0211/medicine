/**
 * 页面渲染器 — 根据 pages-config 生成 HTML
 */

function renderSearchForm(search) {
  if (!search || !search.length) return '';
  const fields = search
    .map((f) => {
      const w = f.width ? ` w${f.width}` : '';
      if (f.type === 'select') {
        const opts = (f.options || []).map((o) => `<option>${o}</option>`).join('');
        return `<div class="form-item"><label>${f.label}</label><select>${opts}</select></div>`;
      }
      return `<div class="form-item${w}"><label>${f.label}</label><input type="text" placeholder="${f.placeholder || '请输入' + f.label}" /></div>`;
    })
    .join('');
  return `<div class="card"><div class="search-form">${fields}<div class="form-item"><label>&nbsp;</label><div style="display:flex;gap:8px"><button type="button" class="btn btn-primary">查询</button><button type="button" class="btn btn-default">重置</button></div></div></div></div>`;
}

function renderToolbar(buttons) {
  if (!buttons || !buttons.length) return '';
  const btns = buttons
    .map((b, i) => `<button type="button" class="btn ${i === 0 && b.startsWith('+') ? 'btn-primary' : 'btn-default'}">${b}</button>`)
    .join('');
  return `<div class="toolbar"><div class="toolbar-left">${btns}</div><div class="toolbar-right">已选 0 项</div></div>`;
}

function renderPagination(total) {
  const pages = Math.max(1, Math.ceil((total || 0) / 20));
  const pageBtns = [1, 2, 3]
    .filter((p) => p <= pages)
    .map((p) => `<button type="button" class="page-btn${p === 1 ? ' active' : ''}">${p}</button>`)
    .join('');
  return `<div class="pagination"><span>共 ${(total || 0).toLocaleString()} 条</span><button type="button" class="page-btn">‹</button>${pageBtns}${pages > 3 ? '<button type="button" class="page-btn">…</button>' : ''}<button type="button" class="page-btn">›</button><span>每页 20 条</span></div>`;
}

function renderTable(columns, rows, checkbox = true) {
  const thCheckbox = checkbox ? `<th style="width:48px"><input type="checkbox" /></th>` : '';
  const thead = `<thead><tr>${thCheckbox}${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = (rows || [])
    .map((row) => {
      const tdCheckbox = checkbox ? `<td><input type="checkbox" /></td>` : '';
      const cells = row.map((cell) => `<td>${cellValue(cell)}</td>`).join('');
      return `<tr>${tdCheckbox}${cells}</tr>`;
    })
    .join('');
  return `<div class="table-wrap"><table>${thead}<tbody>${tbody}</tbody></table></div>`;
}

function renderTreeTable(columns, treeRows) {
  const thead = `<thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = (treeRows || [])
    .map((row) => {
      const cells = row
        .map((cell, i) => (i === 0 ? `<td class="tree-name">${cellValue(cell)}</td>` : `<td>${cellValue(cell)}</td>`))
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');
  return `<div class="table-wrap"><table>${thead}<tbody>${tbody}</tbody></table></div>`;
}

function renderDashboard() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-icon blue">📦</div><div><div class="stat-label">今日订单</div><div class="stat-value">1,286</div><div class="stat-trend up">↑ 12% 较昨日</div></div></div>
      <div class="stat-card"><div class="stat-icon green">💰</div><div><div class="stat-label">今日销售额</div><div class="stat-value">¥86,420</div><div class="stat-trend up">↑ 8% 较昨日</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">📋</div><div><div class="stat-label">待拣货</div><div class="stat-value">47</div><div class="stat-trend warn">需及时处理</div></div></div>
      <div class="stat-card"><div class="stat-icon red">⚠️</div><div><div class="stat-label">库存预警</div><div class="stat-value">23</div><div class="stat-trend down">SKU 低于安全库存</div></div></div>
    </div>
    <div class="chart-grid">
      <div class="card"><div class="card-title">近 7 日销售趋势</div><div class="chart-placeholder"><div class="chart-bars">${[60, 75, 55, 90, 70, 85, 95].map((h) => `<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div><div style="margin-top:12px;font-size:12px;color:#9ca3af">5/22 — 5/28</div></div></div>
      <div class="card"><div class="card-title">渠道订单占比</div><div class="chart-placeholder" style="height:280px"><div class="pie-chart"></div><div class="pie-legend"><span class="legend-item"><span class="legend-dot" style="background:#ffc300"></span>美团 33%</span><span class="legend-item"><span class="legend-dot" style="background:#0097ff"></span>饿了么 28%</span><span class="legend-item"><span class="legend-dot" style="background:#e1251b"></span>京东 22%</span><span class="legend-item"><span class="legend-dot" style="background:#059669"></span>自营 17%</span></div></div></div>
    </div>
    <div class="card"><div class="card-title">待办事项</div>${renderTable(['类型', '内容', '门店', '时间', '操作'], [
      [tag('处方审核', 'rx'), '订单 #202605280001 待药师审核', '朝阳店', '2026-05-28 10:32', actions(['去处理'])],
      [tag('待拣货', 'pending'), '美团订单 #MT202605280088 超时预警', '海淀店', '2026-05-28 10:28', actions(['去拣货'])],
      [tag('库存预警', 'off'), '阿莫西林胶囊 库存 ≤ 10', '朝阳店', '2026-05-28 09:15', actions(['查看'])],
      [tag('渠道同步', 'picking'), '饿了么商品同步失败 3 条', '—', '2026-05-28 08:50', actions(['重试'])],
    ], false)}</div>`;
}

function renderFormCards(cards) {
  return (cards || [])
    .map(
      (card) => `
    <div class="card form-card">
      <div class="form-card-header">
        <div class="card-title">${card.title}</div>
        ${card.actions ? `<div class="form-card-actions">${card.actions.map((a) => `<button type="button" class="btn btn-default btn-sm">${a}</button>`).join('')}</div>` : ''}
      </div>
      <div class="form-card-body">
        ${(card.fields || [])
          .map(
            (f) => `
          <div class="form-card-row">
            <span class="form-card-label">${f.label}</span>
            <span class="form-card-value">${cellValue(f.value)}</span>
          </div>`
          )
          .join('')}
      </div>
      ${card.channel ? `<div class="form-card-footer"><span class="tag tag-${card.channel}">${card.title}</span></div>` : ''}
    </div>`
    )
    .join('');
}

function renderMap(pageId, page) {
  if (typeof MAP_PAGES !== 'undefined' && MAP_PAGES.has(pageId)) {
    return renderMapDynamic(pageId, page);
  }
  const info = page.trackInfo
    ? `<div class="map-track-info">
        <div><strong>订单：</strong>${page.trackInfo.order}</div>
        <div><strong>骑手：</strong>${page.trackInfo.rider} ${page.trackInfo.phone}</div>
        <div><strong>状态：</strong>${page.trackInfo.status} · 预计 ${page.trackInfo.eta} 送达</div>
      </div>`
    : '';
  return `
    ${renderSearchForm(page.search)}
    <div class="card map-card">
      <div class="card-title">${page.mapTitle}</div>
      ${info}
      <div class="map-placeholder">
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

function renderReport(pageId, page) {
  if (typeof REPORT_PAGES !== 'undefined' && REPORT_PAGES.has(pageId)) {
    return renderReportDynamic(pageId, page);
  }
  const stats = page.statCards
    ? `<div class="stat-grid">${page.statCards
        .map(
          (s) => `
      <div class="stat-card"><div class="stat-icon green">📊</div><div><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-trend up">${s.trend}</div></div></div>`
        )
        .join('')}</div>`
    : '';
  return `
    ${renderSearchForm(page.search)}
    ${stats}
    <div class="card"><div class="card-title">${page.chartTitle}</div><div class="chart-placeholder" style="height:200px"><div class="chart-bars">${[40, 55, 48, 72, 65, 80, 75, 90].map((h) => `<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div></div></div>
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      ${renderTable(page.columns, page.rows, false)}
      ${renderPagination(page.rows?.length * 50 || 100)}
    </div>`;
}

function renderListPage(pageId, page) {
  if (typeof DYNAMIC_PAGES !== 'undefined' && DYNAMIC_PAGES.has(pageId)) {
    const { table, pagination } = renderTableDynamic(pageId, page);
    return `
    ${renderSearchForm(page.search)}
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      ${table}
      ${pagination}
    </div>`;
  }
  return `
    ${renderSearchForm(page.search)}
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      ${renderTable(page.columns, page.rows)}
      ${renderPagination(page.total)}
    </div>`;
}

function renderTreeListPage(pageId, page) {
  if (typeof TREE_PAGES !== 'undefined' && TREE_PAGES.has(pageId)) {
    return `
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      ${renderTreeTableDynamic(pageId, page)}
    </div>`;
  }
  return `
    <div class="card" style="padding-top:12px">
      ${renderToolbar(page.toolbar)}
      ${renderTreeTable(page.treeColumns, page.treeRows)}
    </div>`;
}

function renderPage(pageId) {
  const page = PAGES[pageId];
  if (!page) return '<div class="card"><p>页面未找到</p></div>';

  switch (page.type) {
    case 'dashboard':
      return typeof renderDashboardFromStore === 'function' ? renderDashboardFromStore() : renderDashboard();
    case 'list':
      return renderListPage(pageId, page);
    case 'tree-list':
      return renderTreeListPage(pageId, page);
    case 'form-cards':
      if (pageId === 'sys-config' && typeof renderSysConfigCards === 'function') return renderFormCards(renderSysConfigCards());
      if (pageId === 'chn-config' && typeof renderChannelConfigCards === 'function') return renderFormCards(renderChannelConfigCards());
      return renderFormCards(page.cards);
    case 'map':
      return renderMap(pageId, page);
    case 'report':
      return renderReport(pageId, page);
    default:
      return renderListPage(pageId, page);
  }
}

function renderSidebar() {
  let html = '';
  MENU_CONFIG.forEach((item, index) => {
    if (item.page) {
      html += `<div class="menu-item" id="menu-${item.page}" data-page="${item.page}" title="${item.label}">
        <span class="icon">${item.icon}</span>
        <span class="menu-text">${item.label}</span>
      </div>`;
    } else if (item.group) {
      const groupId = `group-${index}`;
      const childHtml = (item.children || [])
        .map(
          (child) =>
            `<div class="menu-sub" id="menu-${child.page}" data-page="${child.page}" title="${child.label}">${child.label}</div>`
        )
        .join('');
      html += `
        <div class="menu-group group-collapsed" data-group-id="${groupId}" data-group-name="${item.group}">
          <div class="menu-group-header" data-group-toggle="${groupId}" title="${item.group}">
            <span class="icon">${item.icon || '📁'}</span>
            <span class="menu-text menu-group-label">${item.group}</span>
            <span class="menu-group-arrow">▾</span>
          </div>
          <div class="menu-group-body" data-group-name="${item.group}">${childHtml}</div>
        </div>`;
    }
  });
  return html;
}

function buildPageRegistry() {
  const registry = {};
  MENU_CONFIG.forEach((item, index) => {
    if (item.page) {
      registry[item.page] = {
        breadcrumb: PAGES[item.page]?.breadcrumb || item.label,
        menuId: `menu-${item.page}`,
      };
    } else if (item.children) {
      const groupId = `group-${index}`;
      item.children.forEach((child) => {
        registry[child.page] = {
          breadcrumb: PAGES[child.page]?.breadcrumb || `${item.group} / ${child.label}`,
          menuId: `menu-${child.page}`,
          groupId,
        };
      });
    }
  });
  return registry;
}

function initPages() {
  const container = document.getElementById('page-container');
  if (!container) return;

  Object.keys(PAGES).forEach((pageId) => {
    const div = document.createElement('div');
    div.className = 'page';
    div.id = `page-${pageId}`;
    div.innerHTML = renderPage(pageId);
    container.appendChild(div);
  });
}

function initSidebar() {
  const nav = document.getElementById('sidebar-menu');
  if (nav) nav.innerHTML = renderSidebar();
}
