/**
 * 全站按钮与操作交互 — 真实业务数据读写
 */
const Interactions = (() => {
  let toastTimer = null;

  function ensureShell() {
    if (document.getElementById('proto-toast')) return;

    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div id="proto-toast" class="proto-toast" aria-live="polite"></div>
      <div id="proto-modal" class="proto-modal hidden">
        <div class="proto-modal-mask"></div>
        <div class="proto-modal-box">
          <div class="proto-modal-header">
            <span id="proto-modal-title">提示</span>
            <button type="button" class="proto-modal-close" id="proto-modal-close">×</button>
          </div>
          <div class="proto-modal-body" id="proto-modal-body"></div>
          <div class="proto-modal-footer" id="proto-modal-footer"></div>
        </div>
      </div>
      <div id="proto-drawer" class="proto-drawer hidden">
        <div class="proto-drawer-mask"></div>
        <div class="proto-drawer-panel">
          <div class="proto-drawer-header">
            <span id="proto-drawer-title">表单</span>
            <button type="button" class="proto-modal-close" id="proto-drawer-close">×</button>
          </div>
          <div class="proto-drawer-body" id="proto-drawer-body"></div>
          <div class="proto-drawer-footer">
            <button type="button" class="btn btn-default" id="proto-drawer-cancel">取消</button>
            <button type="button" class="btn btn-primary" id="proto-drawer-save">保存</button>
          </div>
        </div>
      </div>
      <div id="proto-notify-panel" class="proto-notify-panel hidden">
        <div class="proto-notify-header">消息通知 <button type="button" class="proto-notify-close">×</button></div>
        <ul class="proto-notify-list"></ul>
      </div>
    `
    );

    document.getElementById('proto-modal-close')?.addEventListener('click', closeModal);
    document.querySelector('#proto-modal .proto-modal-mask')?.addEventListener('click', closeModal);
    document.getElementById('proto-drawer-close')?.addEventListener('click', closeDrawer);
    document.getElementById('proto-drawer-cancel')?.addEventListener('click', closeDrawer);
    document.querySelector('#proto-drawer .proto-drawer-mask')?.addEventListener('click', closeDrawer);
    document.getElementById('proto-drawer-save')?.addEventListener('click', handleDrawerSave);
    document.querySelector('.proto-notify-close')?.addEventListener('click', () => {
      document.getElementById('proto-notify-panel')?.classList.add('hidden');
    });
    document.getElementById('proto-notify-panel')?.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-goto]');
      if (li && typeof switchPage === 'function') {
        switchPage(li.dataset.goto);
        document.getElementById('proto-notify-panel')?.classList.add('hidden');
        toast('已跳转到相关页面', 'success');
      }
    });
  }

  function toast(msg, type = 'info') {
    const el = document.getElementById('proto-toast');
    if (!el) return;
    el.className = `proto-toast show proto-toast-${type}`;
    el.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function applyResult(res) {
    if (!res) return;
    toast(res.msg || (res.ok ? '操作成功' : '操作失败'), res.ok ? 'success' : 'error');
    if (res.ok) refreshCurrentPage();
  }

  function closeModal() {
    document.getElementById('proto-modal')?.classList.add('hidden');
  }

  function openModal(title, bodyHtml, footerHtml) {
    document.getElementById('proto-modal-title').textContent = title;
    document.getElementById('proto-modal-body').innerHTML = bodyHtml;
    document.getElementById('proto-modal-footer').innerHTML = footerHtml || '';
    document.getElementById('proto-modal')?.classList.remove('hidden');
  }

  function confirmDialog(title, message, onOk) {
    openModal(
      title,
      `<p class="proto-modal-text">${message}</p>`,
      `<button type="button" class="btn btn-default" data-modal-cancel>取消</button>
       <button type="button" class="btn btn-primary" data-modal-ok>确定</button>`
    );
    document.querySelector('[data-modal-cancel]')?.addEventListener('click', closeModal, { once: true });
    document.querySelector('[data-modal-ok]')?.addEventListener(
      'click',
      () => {
        closeModal();
        onOk?.();
      },
      { once: true }
    );
  }

  function closeDrawer() {
    document.getElementById('proto-drawer')?.classList.add('hidden');
    DataStore.setDrawerCtx(null);
  }

  function readDrawerFields() {
    const fields = {};
    document.querySelectorAll('#proto-drawer-body .proto-field').forEach((el) => {
      const label = el.querySelector('label')?.textContent?.replace(/\s*\*$/, '').trim();
      const input = el.querySelector('input, select, textarea');
      if (label && input) fields[label] = input.value.trim();
    });
    return fields;
  }

  function handleDrawerSave() {
    const ctx = DataStore.getDrawerCtx();
    if (ctx?.onSave) {
      const res = ctx.onSave(readDrawerFields());
      closeDrawer();
      applyResult(res);
      return;
    }
    closeDrawer();
    toast('保存成功', 'success');
    refreshCurrentPage();
  }

  function openDrawer(title, fields, ctx) {
    const body = fields
      .map(
        (f) => `
      <div class="proto-field" ${f.key ? `data-field-key="${f.key}"` : ''}>
        <label>${f.label}${f.required ? ' *' : ''}</label>
        ${
          f.readonly
            ? `<input type="text" class="proto-readonly" value="${f.value ?? ''}" readonly tabindex="-1" />`
            : f.type === 'select'
              ? `<select>${(f.options || []).map((o) => {
                  const label = typeof o === 'object' ? o.label : o;
                  const value = typeof o === 'object' ? o.value : o;
                  return `<option value="${value}"${String(value) === String(f.value) ? ' selected' : ''}>${label}</option>`;
                }).join('')}</select>`
              : f.type === 'textarea'
                ? `<textarea rows="3" placeholder="${f.placeholder || ''}">${f.value || ''}</textarea>`
                : `<input type="${f.type || 'text'}" placeholder="${f.placeholder || ''}" ${f.value !== undefined && f.value !== '' ? `value="${f.value}"` : ''} />`
        }
      </div>`
      )
      .join('');
    document.getElementById('proto-drawer-title').textContent = title;
    document.getElementById('proto-drawer-body').innerHTML = body;
    DataStore.setDrawerCtx(ctx || null);
    document.getElementById('proto-drawer')?.classList.remove('hidden');
  }

  function openEntityDetail(entity, id) {
    const item = DataStore.getState()[entity]?.find((x) => x.id === id);
    const title = `${FormSchemas.titleOf(entity)}详情`;
    if (!item) {
      openDetailDrawer(title, [['说明', '未找到相关记录']]);
      return;
    }
    openDetailDrawer(title, FormSchemas.toDetailRows(entity, item));
  }

  function openEntityEdit(entity, id, titleSuffix = '编辑') {
    const item = DataStore.getState()[entity]?.find((x) => x.id === id);
    if (!item) return toast('记录不存在', 'error');
    const title = `${FormSchemas.titleOf(entity)}${titleSuffix}`;
    const fields = FormSchemas.toFormFields(entity, item, { editable: true });
    openDrawer(title, fields, {
      onSave: (formValues) => {
        const patch = FormSchemas.parseFormValues(entity, item, formValues);
        DataStore.addOperLog(FormSchemas.titleOf(entity), `编辑 ${patch.name || patch.username || patch.nickname || titleSuffix}`);
        return DataStore.genericUpsert(entity, patch, false);
      },
    });
  }

  function openEntityCreate(pageId, title) {
    const entity = FormSchemas.CREATE_FORMS[pageId];
    if (!entity) {
      openDrawer(title, [
        { label: '名称', required: true, placeholder: '请输入名称' },
        { label: '备注', type: 'textarea', placeholder: '请输入备注' },
      ], {
        onSave: () => {
          DataStore.addOperLog(PAGES[pageId]?.breadcrumb || pageId, `新增 ${title}`);
          DataStore.persist();
          return { ok: true, msg: '新增成功' };
        },
      });
      return;
    }
    const defaults = FormSchemas.createDefaults(entity);
    const fields = FormSchemas.toFormFields(entity, defaults, { editable: true });
    openDrawer(title, fields, {
      onSave: (formValues) => {
        const patch = FormSchemas.parseFormValues(entity, defaults, formValues);
        if (entity === 'skus') {
          const patch = FormSchemas.parseFormValues(entity, defaults, formValues);
          return DataStore.addSku({ ...patch, isRx: patch.isRx ? '是' : '否' });
        }
        if (entity === 'users') {
          const patch = FormSchemas.parseFormValues(entity, defaults, formValues);
          return DataStore.addUser(patch);
        }
        patch.createdAt = patch.createdAt || DataStore.nowStr();
        if (entity === 'menus' || entity === 'depts' || entity === 'categories') patch.depth = 0;
        if (entity === 'categories' && !patch.code) patch.code = DataStore.uid('CAT');
        if (entity === 'inventoryChecks') patch.checker = localStorage.getItem('zhihe-erp-user') || '管理员';
        if (entity === 'transfers') patch.creator = localStorage.getItem('zhihe-erp-user') || '管理员';
        if (entity === 'purchaseOrders') patch.buyer = localStorage.getItem('zhihe-erp-user') || '管理员';
        DataStore.addOperLog(FormSchemas.titleOf(entity), `新增 ${patch.name || title}`);
        return DataStore.genericUpsert(entity, patch, true);
      },
    });
  }

  function openDetailDrawer(title, rows) {
    const body = rows.map(([k, v]) => `<div class="proto-detail-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
    document.getElementById('proto-drawer-title').textContent = title;
    document.getElementById('proto-drawer-body').innerHTML = `<div class="proto-detail">${body}</div>`;
    document.getElementById('proto-drawer')?.classList.remove('hidden');
  }

  function btnLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.origText = btn.textContent;
      btn.textContent = '处理中…';
      btn.classList.add('btn-loading');
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.origText || btn.textContent;
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }
  }

  function getActivePageId() {
    return document.querySelector('.page.active')?.id?.replace('page-', '') || '';
  }

  function getRowContext(tr) {
    return {
      entity: tr?.dataset?.entity,
      id: tr?.dataset?.id,
      pageId: tr?.closest('.page')?.id?.replace('page-', ''),
    };
  }

  function showEntityDetail(entity, id) {
    openEntityDetail(entity, id);
  }

  function resetSearchForm(card) {
    card?.querySelectorAll('input[type="text"]').forEach((i) => (i.value = ''));
    card?.querySelectorAll('select').forEach((s) => (s.selectedIndex = 0));
    const pageId = getActivePageId();
    if (pageId) DataStore.getState().pageFilters[pageId] = {};
    refreshCurrentPage();
    toast('已重置筛选条件', 'info');
  }

  function runSearch(btn, pageEl) {
    btnLoading(btn, true);
    setTimeout(() => {
      EntityRender.readFiltersFromDom(pageEl || document.querySelector('.page.active'));
      btnLoading(btn, false);
      refreshCurrentPage();
      toast('查询完成', 'success');
    }, 400);
  }

  function updateSelectedCount(scope) {
    const root = scope?.closest('.card') || scope?.closest('.page');
    if (!root) return;
    const checked = root.querySelectorAll('tbody input[type="checkbox"]:checked').length;
    const el = root.querySelector('.toolbar-right');
    if (el) el.textContent = `已选 ${checked} 项`;
  }

  function getGenericFormFields(actionLabel, defaults = {}) {
    if (/SKU|商品/.test(actionLabel)) {
      return FormSchemas.toFormFields('skus', { ...FormSchemas.createDefaults('skus'), ...defaults, isRx: defaults.isRx ? '是' : '否' }, { editable: true });
    }
    if (/用户/.test(actionLabel)) {
      return FormSchemas.toFormFields('users', { ...FormSchemas.createDefaults('users'), ...defaults }, { editable: true });
    }
    if (/补货/.test(actionLabel)) {
      return [{ label: '补货数量', type: 'number', required: true, placeholder: '请输入数量', value: '50' }];
    }
    if (/指派/.test(actionLabel)) {
      return [{ label: '骑手姓名', required: true, placeholder: '请输入骑手姓名' }];
    }
    if (/价格|调价/.test(actionLabel)) {
      return [{ label: '新零售价', type: 'number', required: true, value: defaults.price, placeholder: '请输入价格' }];
    }
    return [
      { label: '名称', required: true, placeholder: '请输入名称' },
      { label: '备注', type: 'textarea', placeholder: '请输入备注' },
    ];
  }

  function handleToolbarAction(label, btn) {
    const pageId = getActivePageId();

    if (/^\+|新建|新增|创建/.test(label)) {
      if (pageId === 'ord-ship-addr') {
        openEntityCreate(pageId, '新增发货地址');
        return;
      }
      if (pageId === 'ord-wave-strategy') {
        openDrawer('新增波次策略', [
          { label: '策略名称', required: true },
          { label: '波次类型', type: 'select', options: ['普通', '合单'] },
          { label: '规则说明', type: 'textarea', placeholder: '如：同门店+同渠道' },
          { label: '每批上限', type: 'number', value: '50' },
        ], {
          onSave: (f) => DataStore.genericUpsert('waveStrategies', {
            name: f['策略名称'], waveType: f['波次类型'], ruleDesc: f['规则说明'],
            maxOrders: parseInt(f['每批上限'], 10) || 50, enabled: true, sort: 99,
          }, true),
        });
        return;
      }
      openEntityCreate(pageId, label.replace(/^\+?\s*/, ''));
      return;
    }

    if (/拉取美团/.test(label)) return applyResult(DataStore.pullChannelOrders('美团'));
    if (/拉取饿了么/.test(label)) return applyResult(DataStore.pullChannelOrders('饿了么'));
    if (/拉取京东/.test(label)) return applyResult(DataStore.pullChannelOrders('京东'));
    if (label === '自动合单') return applyResult(DataStore.autoMergeOrders());
    if (label === '生成波次') return applyResult(DataStore.generateWave());
    if (label === '合单波次生成') return applyResult(DataStore.generateMergedWave());
    if (label === '批量请货') {
      const items = DataStore.getState().waveItems.filter((w) => w.status === '未请货');
      items.forEach((wi) => DataStore.requestGoods(wi.id, wi.requestQty));
      refreshCurrentPage();
      toast(`已批量请货 ${items.length} 条`, 'success');
      return;
    }
    if (label === '管理发货地址') {
      switchPage('ord-ship-addr');
      return;
    }
    if (typeof Phase1Data !== 'undefined') {
      if (label === '生成今日建议') return applyResult(Phase1Data.generateSuggestions(DataStore.getState()));
      if (label === '一键转采购') return applyResult(Phase1Data.convertToPurchase(DataStore.getState()));
      if (label === '拉取三平台销量') return applyResult(Phase1Data.pullSalesData(DataStore.getState()));
      if (label === '自动比对') return applyResult(Phase1Data.runThreeWayMatch(DataStore.getState()));
      if (label === '生成对账单') return applyResult(Phase1Data.generateStatement(DataStore.getState()));
      if (label === '推送供应商' || label === '批量推送') return applyResult(Phase1Data.pushStatement(DataStore.getState()));
      if (label === '计算应返') return applyResult(Phase1Data.calcRebate(DataStore.getState()));
      if (label === '一键同步三平台') return applyResult(Phase1Data.syncThreePlatforms(DataStore.getState()));
      if (label === '立即对账' || label === '自动修正' || label === '库存对账') return applyResult(Phase1Data.reconcilePlatformInv(DataStore.getState()));
      if (label === '立即备份') {
        DataStore.getState().backupRecords.unshift({ id: `BK${Date.now()}`, time: DataStore.nowStr(), size: '2.4 GB', retainDays: 90, status: '成功' });
        DataStore.persist();
        refreshCurrentPage();
        return toast('备份已完成', 'success');
      }
    }

    if (/同步|立即同步|启动/.test(label)) {
      btnLoading(btn, true);
      setTimeout(() => {
        const channel = label.includes('美团') ? '美团' : label.includes('饿了么') ? '饿了么' : label.includes('京东') ? '京东' : '美团';
        applyResult(DataStore.runChannelSync(channel));
        btnLoading(btn, false);
      }, 600);
      return;
    }

    if (/导出/.test(label)) {
      btnLoading(btn, true);
      setTimeout(() => {
        btnLoading(btn, false);
        DataStore.addOperLog('数据导出', `${pageId} 导出`);
        DataStore.persist();
        toast('导出任务已创建', 'success');
      }, 800);
      return;
    }

    if (/导入|批量/.test(label)) {
      btnLoading(btn, true);
      setTimeout(() => {
        btnLoading(btn, false);
        DataStore.addOperLog('数据导入', `${label}`);
        DataStore.persist();
        toast(`「${label}」已提交`, 'success');
      }, 900);
      return;
    }

    if (/清空|删除/.test(label)) {
      confirmDialog('确认操作', `确定要执行「${label}」吗？`, () => {
        DataStore.addOperLog('批量操作', label);
        DataStore.persist();
        toast('操作成功', 'success');
      });
      return;
    }

    DataStore.addOperLog(PAGES[pageId]?.breadcrumb || pageId, label);
    DataStore.persist();
    toast(`「${label}」已执行`, 'success');
  }

  function handleRowAction(action, row) {
    const { entity, id } = getRowContext(row);
    const s = DataStore.getState();

    if (entity === 'channelOrders') {
      if (action === '锁单') return applyResult(DataStore.toggleLockChannelOrder(id));
      if (action === '解锁') return applyResult(DataStore.toggleLockChannelOrder(id));
      if (action === '合单') return applyResult(DataStore.autoMergeOrders());
      if (action === '详情') return openEntityDetail('channelOrders', id);
    }

    if (entity === 'mergedGroups') {
      if (action === '合单波次生成') return applyResult(DataStore.generateMergedWave());
      if (action === '详情') return openEntityDetail('mergedGroups', id);
    }

    if (entity === 'waveStrategies') {
      if (action === '生成波次') return applyResult(DataStore.generateWave(id));
      if (action === '编辑') return openEntityEdit('waveStrategies', id);
      if (/启用|停用/.test(action)) {
        const ws = s.waveStrategies.find((x) => x.id === id);
        if (ws) { ws.enabled = action === '启用'; DataStore.persist(); }
        return applyResult({ ok: true, msg: `策略已${action}` });
      }
    }

    if (entity === 'waves') {
      if (action === '请货') {
        const items = s.waveItems.filter((wi) => wi.waveId === id && wi.status === '未请货');
        items.forEach((wi) => DataStore.requestGoods(wi.id, wi.requestQty));
        refreshCurrentPage();
        return toast(`波次 ${id} 已请货 ${items.length} 条`, 'success');
      }
      if (action === '查看明细') {
        DataStore.setWaveTab('全部');
        switchPage('ord-pick-ship');
        return;
      }
      if (action === '详情') return openEntityDetail('waves', id);
    }

    if (entity === 'waveItems') {
      const wi = s.waveItems.find((x) => x.id === id);
      if (action === '请货') {
        return openDrawer('请货', [
          { label: '请货数量', type: 'number', required: true, value: wi?.requestQty || 1 },
        ], { onSave: (f) => DataStore.requestGoods(id, f['请货数量']) });
      }
      if (action === '确认拣货') return applyResult(DataStore.confirmPick(id));
      if (action === '回库') return confirmDialog('回库确认', '确定将库存回库？', () => applyResult(DataStore.returnToStock(id)));
      if (action === '生成快递单') return applyResult(DataStore.generateWaybill(id));
      if (/打包|打印面单/.test(action)) {
        if (!wi?.waybillNo) return toast('请先生成快递单', 'error');
        return toast(`${action}完成`, 'success');
      }
      if (action === '出库') return applyResult(DataStore.confirmOutbound(id));
      if (action === '详情') return openEntityDetail('waveItems', id);
    }

    if (entity === 'shipAddresses') {
      if (action === '编辑') return openEntityEdit('shipAddresses', id);
      if (action === '设为默认') {
        s.shipAddresses.forEach((a) => { a.isDefault = a.id === id; });
        DataStore.persist();
        return applyResult({ ok: true, msg: '已设为默认发货地址' });
      }
      if (action === '删除') return confirmDialog('删除地址', '确定删除？', () => applyResult(DataStore.genericRemove('shipAddresses', id)));
    }

    if (entity === 'poApprovals') {
      if (action === '审批') {
        const p = s.poApprovals.find((x) => x.id === id);
        if (p) { p.status = '已审核'; DataStore.persist(); }
        return applyResult({ ok: true, msg: '采购单审批通过' });
      }
      if (action === '驳回') {
        const p = s.poApprovals.find((x) => x.id === id);
        if (p) { p.status = '已驳回'; DataStore.persist(); }
        return applyResult({ ok: true, msg: '已驳回' });
      }
      if (action === '详情') return openEntityDetail('poApprovals', id);
    }
    if (entity === 'replenishSuggestions') {
      if (action === '通过') {
        const r = s.replenishSuggestions.find((x) => x.id === id);
        if (r) { r.status = '已通过'; DataStore.persist(); }
        return applyResult({ ok: true, msg: '建议单已通过' });
      }
      if (action === '转采购') return applyResult(Phase1Data.convertToPurchase(s));
      if (action === '调整数量') {
        const r = s.replenishSuggestions.find((x) => x.id === id);
        return openDrawer('调整建议数量', [{ label: '建议数量', type: 'number', value: r?.suggestQty || 1 }], {
          onSave: (f) => { if (r) { r.suggestQty = parseInt(f['建议数量'], 10) || r.suggestQty; DataStore.persist(); } return { ok: true, msg: '已调整' }; },
        });
      }
    }
    if (entity === 'supplierStatements' && action === '推送供应商') return applyResult(Phase1Data.pushStatement(s, id));
    if (entity === 'supplierPortalConfirms') {
      if (action === '模拟确认') {
        const c = s.supplierPortalConfirms.find((x) => x.id === id);
        if (c) { c.confirmStatus = '已确认'; c.feedback = '供应商已确认'; DataStore.persist(); }
        return applyResult({ ok: true, msg: '供应商已在线确认' });
      }
      if (action === '差异反馈') {
        return openDrawer('差异反馈', [{ label: '差异说明', type: 'textarea', required: true }], {
          onSave: (f) => {
            const c = s.supplierPortalConfirms.find((x) => x.id === id);
            if (c) { c.confirmStatus = '有异议'; c.feedback = f['差异说明']; DataStore.persist(); }
            return { ok: true, msg: '差异已回流至采购员' };
          },
        });
      }
    }
    if (entity === 'platformShelf') {
      if (/上架|下架/.test(action)) {
        const p = s.platformShelf.find((x) => x.id === id);
        if (p) { p.shelfStatus = action === '上架' ? '上架' : '下架'; DataStore.persist(); }
        return applyResult({ ok: true, msg: `平台${action}成功` });
      }
      if (action === '重试') return applyResult(Phase1Data.syncThreePlatforms(s));
    }
    if (entity === 'platformInvDiffs' && action === '修正') return applyResult(Phase1Data.reconcilePlatformInv(s));

    if (entity === 'orders') {
      if (action === '拣货') return applyResult(DataStore.pickOrder(id));
      if (action === '取消') return confirmDialog('取消订单', `确定取消订单 ${id}？`, () => applyResult(DataStore.cancelOrder(id)));
      if (action === '发货') return applyResult(DataStore.shipOrder(id));
      if (action === '完成') return applyResult(DataStore.completeOrder(id));
      if (action === '售后') return applyResult(DataStore.createAfterSale(id));
      if (action === '详情') return showEntityDetail('orders', id);
    }

    if (entity === 'prescriptions') {
      if (action === '审核') {
        return openDrawer('处方审核', [
          { label: '审核意见', type: 'textarea', placeholder: '请输入审核意见' },
          { label: '结果', type: 'select', options: ['通过', '驳回'] },
        ], {
          onSave: (f) => DataStore.approveRx(id, f['结果'] === '通过' ? '通过' : '驳回', f['审核意见']),
        });
      }
      if (/详情|查看/.test(action)) return showEntityDetail('prescriptions', id);
    }

    if (entity === 'skus') {
      if (action === '上架') return applyResult(DataStore.toggleSkuStatus(id, true));
      if (action === '下架') return confirmDialog('下架 SKU', `确定下架 ${id}？`, () => applyResult(DataStore.toggleSkuStatus(id, false)));
      if (action === '价格') {
        const sku = s.skus.find((x) => x.id === id);
        return openDrawer('商品调价', getGenericFormFields('价格', { price: sku?.price }), {
          onSave: (f) => DataStore.updateSkuPrice(id, f['新零售价']),
        });
      }
      if (action === '编辑') return openEntityEdit('skus', id);
    }

    if (entity === 'afterSales') {
      if (action === '同意') return applyResult(DataStore.approveAfterSale(id, true));
      if (action === '拒绝') return confirmDialog('拒绝售后', '确定拒绝该售后申请？', () => applyResult(DataStore.approveAfterSale(id, false)));
      if (action === '详情') return showEntityDetail('afterSales', id);
    }

    if (entity === 'channelSyncLogs' && action === '重试') return applyResult(DataStore.retryChannelSync(id));

    if (entity === 'channelSyncTasks' && action === '重试') {
      const log = s.channelSyncLogs.find((l) => !l.success);
      if (log) return applyResult(DataStore.retryChannelSync(log.id));
      return applyResult(DataStore.runChannelSync('美团'));
    }

    if (entity === 'stocks') {
      if (action === '补货') {
        return openDrawer('库存补货', getGenericFormFields('补货'), {
          onSave: (f) => DataStore.restockStock(id, f['补货数量']),
        });
      }
      if (/流水|详情/.test(action)) {
        const st = s.stocks.find((x) => x.id === id);
        const logs = s.stockLogs.filter((l) => l.skuId === st?.skuId).slice(0, 5);
        openDetailDrawer('库存流水', logs.length ? logs.map((l) => [l.time, `${l.type} ${l.change} → ${l.afterQty}`]) : [['提示', '暂无流水']]);
        return;
      }
    }

    if (entity === 'stores') {
      if (/休息|营业|关闭/.test(action)) return applyResult(DataStore.toggleStoreStatus(id));
      if (action === '编辑') return openEntityEdit('stores', id);
    }

    if (entity === 'deliveries') {
      if (action === '完成') return applyResult(DataStore.completeDelivery(id));
      if (action === '指派') {
        return openDrawer('指派骑手', getGenericFormFields('指派'), {
          onSave: (f) => DataStore.assignDelivery(id, f['骑手姓名']),
        });
      }
      if (action === '详情') return showEntityDetail('deliveries', id);
    }

    if (entity === 'users') {
      if (action === '删除') return confirmDialog('删除用户', '确定删除该用户？', () => applyResult(DataStore.genericRemove('users', id)));
      if (action === '重置密码') return applyResult(DataStore.resetUserPassword(id));
      if (action === '编辑') return openEntityEdit('users', id);
    }

    if (entity === 'roles') {
      if (action === '编辑') return openEntityEdit('roles', id);
      if (action === '删除') return confirmDialog('删除角色', '确定删除该角色？', () => applyResult(DataStore.genericRemove('roles', id)));
      if (action === '权限') return openEntityDetail('roles', id);
    }

    if (entity === 'suppliers') {
      if (action === '编辑') return openEntityEdit('suppliers', id);
      if (action === '资质') return openEntityDetail('suppliers', id);
      if (action === '停用') return confirmDialog('停用供应商', '确定停用该供应商？', () => {
        const su = s.suppliers.find((x) => x.id === id);
        if (su) { su.status = '已停用'; DataStore.persist(); }
        return applyResult({ ok: true, msg: '供应商已停用' });
      });
    }

    if (entity === 'brands' && /编辑|删除/.test(action)) {
      if (action === '编辑') return openEntityEdit('brands', id);
    }

    if (entity === 'spus') {
      if (action === '编辑') return openEntityEdit('spus', id);
      if (/上架|下架/.test(action)) {
        const sp = s.spus.find((x) => x.id === id);
        if (sp) { sp.status = action === '上架' ? '上架' : '下架'; DataStore.persist(); }
        return applyResult({ ok: true, msg: `SPU 已${action}` });
      }
    }

    if (entity === 'dicts') {
      if (action === '编辑') return openEntityEdit('dicts', id);
      if (action === '字典数据') {
        const dict = s.dicts.find((x) => x.id === id);
        const items = DataStore.getDictItems(dict?.type || '');
        openDetailDrawer(`${dict?.name || '字典'} · 字典数据`, items.length
          ? items.map((i) => [`${i.label}（${i.value}）`, `排序 ${i.sort} · ${i.status}`])
          : [['提示', '暂无字典项，可在数据层维护 dictItems']]);
        return;
      }
    }

    if (entity === 'coupons') {
      if (action === '编辑') return openEntityEdit('coupons', id);
      if (action === '发放') return toast('优惠券已发放', 'success');
    }
    if (entity === 'members' && /详情|编辑|积分|优惠券/.test(action)) {
      if (action === '编辑') return openEntityEdit('members', id);
      return openEntityDetail('members', id);
    }
    if (entity === 'memberLevels' && action === '编辑') return openEntityEdit('memberLevels', id);

    if (entity === 'inventoryChecks') {
      if (action === '完成') return applyResult(DataStore.completeInventoryCheck(id));
      if (action === '录入') return openEntityEdit('inventoryChecks', id, '录入');
      if (/详情/.test(action)) return openEntityDetail('inventoryChecks', id);
    }

    if (entity === 'transfers') {
      if (action === '确认入库') return applyResult(DataStore.confirmTransferInbound(id));
      if (action === '详情') return showEntityDetail('transfers', id);
    }

    if (entity === 'inbounds') {
      if (action === '确认入库') return applyResult(DataStore.confirmInbound(id));
      if (action === '详情') return showEntityDetail('inbounds', id);
    }

    if (entity === 'purchaseOrders') {
      if (action === '审核') return applyResult(DataStore.approvePurchaseOrder(id));
      if (action === '入库') {
        let ib = DataStore.getState().inbounds.find((x) => x.refNo === id);
        if (!ib) {
          const po = DataStore.getState().purchaseOrders.find((p) => p.id === id);
          DataStore.genericUpsert('inbounds', {
            storeName: '朝阳店', inboundType: '采购入库', refNo: id,
            skuCount: po?.skuCount || 1, totalQty: 50, status: '待入库', inboundTime: '—',
          }, true);
          ib = DataStore.getState().inbounds.find((x) => x.refNo === id);
        }
        return applyResult(DataStore.confirmInbound(ib?.id));
      }
      if (action === '详情') return showEntityDetail('purchaseOrders', id);
    }

    if (entity === 'purchaseReturns') {
      if (action === '审核') return applyResult(DataStore.approvePurchaseReturn(id, true));
      if (action === '出库') return applyResult(DataStore.approvePurchaseReturn(id, true));
      if (action === '详情') return showEntityDetail('purchaseReturns', id);
    }

    if (entity === 'bills') {
      if (action === '对账') return applyResult(DataStore.confirmBill(id));
      if (action === '详情') return showEntityDetail('bills', id);
    }

    if (entity === 'reconciles') {
      if (action === '处理') return applyResult(DataStore.handleReconcile(id));
      if (action === '详情') return showEntityDetail('reconciles', id);
    }

    if (entity === 'settlements') {
      if (action === '确认') return applyResult(DataStore.confirmSettlement(id));
      if (action === '详情') return showEntityDetail('settlements', id);
    }

    if (entity === 'channelStoreMaps') {
      if (action === '映射') {
        return openDrawer('门店映射', [{ label: '平台门店编号', key: 'platformId', required: true, placeholder: '请输入平台门店编号' }], {
          onSave: (f) => DataStore.mapChannelStore(id, f['平台门店编号']),
        });
      }
      if (action === '解绑') return confirmDialog('解绑映射', '确定解绑该门店映射？', () => applyResult(DataStore.unmapChannelStore(id)));
      if (action === '同步') return applyResult(DataStore.runChannelSync(DataStore.getState().channelStoreMaps.find((m) => m.id === id)?.channel || '美团'));
      if (action === '编辑') return openEntityEdit('channelStoreMaps', id);
    }

    if (entity === 'channelProductMaps') {
      if (action === '映射') {
        return openDrawer('商品映射', [{ label: '平台商品编号', key: 'platformId', required: true, placeholder: '请输入平台商品编号' }], {
          onSave: (f) => DataStore.mapChannelProduct(id, f['平台商品编号']),
        });
      }
      if (action === '重试') return applyResult(DataStore.retryProductMap(id));
      if (/同步|编辑|日志/.test(action)) {
        if (action === '编辑') return openEntityEdit('channelProductMaps', id);
        return openEntityDetail('channelProductMaps', id);
      }
    }

    if (entity === 'memberLevels' && action === '删除') {
      return confirmDialog('删除等级', '确定删除该会员等级？', () => applyResult(DataStore.genericRemove('memberLevels', id)));
    }

    if (entity === 'coupons' && action === '停用') {
      const c = DataStore.getState().coupons.find((x) => x.id === id);
      if (c) { c.status = '已结束'; DataStore.persist(); }
      return applyResult({ ok: true, msg: '优惠券已停用' });
    }

    if (entity === 'menus' || entity === 'depts' || entity === 'categories') {
      if (action === '删除') return confirmDialog('确认删除', '确定删除吗？', () => applyResult(DataStore.genericRemove(entity, id)));
      if (action === '编辑') return openEntityEdit(entity, id);
      if (action === '新增') return openEntityCreate(entity === 'menus' ? 'sys-menu' : entity === 'depts' ? 'sys-dept' : 'prd-category', '新增');
      if (action === '详情') return openEntityDetail(entity, id);
    }

    if (/详情|查看|日志|流水|跟踪|资质|字典数据|权限|映射/.test(action)) {
      if (entity && id) return showEntityDetail(entity, id);
      openDetailDrawer(`${action} - 详情`, [
        ['操作', action],
        ['摘要', row?.innerText?.slice(0, 80) || '—'],
        ['时间', DataStore.nowStr()],
        ['操作人', localStorage.getItem('zhihe-erp-user') || '管理员'],
      ]);
      return;
    }

    if (/删除|取消|停用|驳回|下架|关闭|停止/.test(action)) {
      if (entity && id) {
        return confirmDialog('确认操作', `确定要「${action}」吗？`, () => applyResult(DataStore.genericRemove(entity, id)));
      }
      confirmDialog('确认操作', `确定要「${action}」吗？`, () => toast(`${action}成功`, 'success'));
      return;
    }

    if (/同意|上架|启用|完成|确认/.test(action)) {
      toast(`${action}成功`, 'success');
      refreshCurrentPage();
      return;
    }

    DataStore.addOperLog(entity || '操作', `${action} ${id || ''}`);
    DataStore.persist();
    toast(`「${action}」已执行`, 'info');
  }

  function handleTodoAction(link) {
    const target = link.dataset.todoTarget;
    const refId = link.dataset.todoRef;
    const action = link.dataset.todoAction;

    if (target && typeof switchPage === 'function') switchPage(target);

    setTimeout(() => {
      if (action === '重试' && refId) applyResult(DataStore.retryChannelSync(refId));
      else if (action === '去拣货' && refId) applyResult(DataStore.pickOrder(refId));
      else if (action === '去处理') toast('请在列表中选择处方进行审核', 'info');
      else toast(`已跳转：${action}`, 'success');
    }, 200);
  }

  function getPageTotal(pageId) {
    if (typeof REPORT_PAGES !== 'undefined' && REPORT_PAGES.has(pageId)) {
      return EntityRender.buildReportRows(pageId)?.total ?? 0;
    }
    return EntityRender.buildRows(pageId)?.total ?? 0;
  }

  function handlePagination(btn, pagination) {
    const pageId = pagination?.dataset?.pageId || getActivePageId();
    const total = getPageTotal(pageId);
    const totalPages = Math.max(1, Math.ceil(total / DataStore.PAGE_SIZE));
    let cur = DataStore.getPageNum(pageId);

    if (btn.dataset.page === 'prev') cur = Math.max(1, cur - 1);
    else if (btn.dataset.page === 'next') cur = Math.min(totalPages, cur + 1);
    else if (btn.dataset.page) cur = parseInt(btn.dataset.page, 10);

    DataStore.setPageNum(pageId, cur);
    refreshCurrentPage();
    toast(`已切换到第 ${cur} 页`, 'success');
  }

  function handleFormCardAction(label, card, btn) {
    const channel = card?.querySelector('.form-card-footer .tag')?.className?.match(/tag-(\w+)/)?.[1];
    if (/测试连接/.test(label)) {
      btnLoading(btn, true);
      setTimeout(() => {
        applyResult(DataStore.testChannelConnection(channel));
        btnLoading(btn, false);
      }, 500);
      return;
    }
    if (/同步门店/.test(label)) {
      const names = { meituan: '美团', eleme: '饿了么', jd: '京东' };
      applyResult(DataStore.runChannelSync(names[channel] || '美团'));
      return;
    }
    if (/编辑/.test(label)) {
      const cfg = DataStore.getState().channelConfig[channel];
      openDrawer('编辑渠道配置', [
        { label: '应用密钥', value: cfg?.appKey || '' },
        { label: '启用状态', type: 'select', options: ['已启用', '已停用'], value: cfg?.enabled !== false ? '已启用' : '已停用' },
      ], {
        onSave: (f) => {
          if (cfg) {
            cfg.appKey = f['应用密钥'];
            cfg.enabled = f['启用状态'] === '已启用';
            DataStore.persist();
          }
          return { ok: true, msg: '渠道配置已保存' };
        },
      });
      return;
    }
    handleToolbarAction(label, btn);
  }

  function onPageClick(e) {
    const target = e.target;

    if (target.matches('.search-form .btn-primary')) {
      e.preventDefault();
      runSearch(target, target.closest('.page'));
      return;
    }
    if (target.matches('.search-form .btn-default') && target.textContent.includes('重置')) {
      e.preventDefault();
      resetSearchForm(target.closest('.card'));
      return;
    }

    if (target.matches('.toolbar-left .btn')) {
      e.preventDefault();
      handleToolbarAction(target.textContent.trim(), target);
      return;
    }

    if (target.matches('.form-card-actions .btn, .form-card-actions .btn-sm')) {
      e.preventDefault();
      handleFormCardAction(target.textContent.trim(), target.closest('.form-card'), target);
      return;
    }

    if (target.matches('.map-toolbar .btn')) {
      e.preventDefault();
      const label = target.textContent.trim();
      const mapCard = target.closest('.map-card');
      const map = mapCard?.querySelector('.map-placeholder');
      const pageId = mapCard?.dataset?.mapPage;
      if (/绘制|保存/.test(label)) {
        map?.classList.add('map-active');
        if (label.includes('保存') && pageId === 'sto-delivery') {
          const storeName = document.querySelector('.page.active .search-form select')?.value;
          const store = DataStore.getState().stores.find((s) => s.name === storeName);
          if (store) applyResult(DataStore.saveDeliveryRange(store.id));
          else toast('配送范围已保存', 'success');
        } else {
          toast(`${label}成功`, 'success');
        }
      } else if (/清除/.test(label)) {
        map?.classList.remove('map-active');
        toast('已清除绘制', 'info');
      }
      return;
    }

    if (target.matches('.page-btn')) {
      e.preventDefault();
      handlePagination(target, target.closest('.pagination'));
      return;
    }

    const todoLink = target.closest('[data-todo-action]');
    if (todoLink) {
      e.preventDefault();
      handleTodoAction(todoLink);
      return;
    }

    if (target.matches('[data-phase1-action]')) {
      e.preventDefault();
      const act = target.dataset.phase1Action;
      const map = {
        'three-match': () => Phase1Data.runThreeWayMatch(DataStore.getState()),
        'sync-platforms': () => Phase1Data.syncThreePlatforms(DataStore.getState()),
      };
      applyResult(map[act]?.());
      return;
    }

    const phase1Goto = target.closest('[data-goto-page]');
    if (phase1Goto && phase1Goto.classList.contains('phase1-goto')) {
      e.preventDefault();
      switchPage(phase1Goto.dataset.gotoPage);
      return;
    }

    const workflowNode = target.closest('.workflow-node[data-goto-page]');
    if (workflowNode) {
      e.preventDefault();
      switchPage(workflowNode.dataset.gotoPage);
      return;
    }

    if (target.matches('[data-workflow-action]')) {
      e.preventDefault();
      const act = target.dataset.workflowAction;
      const map = {
        'pull-all': () => DataStore.pullChannelOrders('全部'),
        'auto-merge': () => DataStore.autoMergeOrders(),
        'gen-wave': () => DataStore.generateWave(),
        'gen-merge-wave': () => DataStore.generateMergedWave(),
      };
      applyResult(map[act]?.());
      return;
    }

    if (target.matches('.wave-tab')) {
      e.preventDefault();
      DataStore.setWaveTab(target.dataset.waveTab);
      refreshCurrentPage();
      return;
    }

    const actionLink = target.closest('.action-btns a');
    if (actionLink) {
      e.preventDefault();
      handleRowAction(actionLink.textContent.trim(), actionLink.closest('tr'));
      return;
    }

    if (target.matches('.text-link')) {
      e.preventDefault();
      const text = target.textContent.trim();
      const tr = target.closest('tr');
      if (tr?.dataset?.entity) return showEntityDetail(tr.dataset.entity, tr.dataset.id);
      if (/^ORD|^SKU|^RX|^DEL|^PO|^STO/.test(text)) {
        const coll = text.startsWith('ORD') ? 'orders' : text.startsWith('SKU') ? 'skus' : text.startsWith('RX') ? 'prescriptions' : null;
        if (coll) return showEntityDetail(coll, text);
      }
      toast(`查看：${text}`, 'info');
      return;
    }

    if (target.matches('thead input[type="checkbox"]')) {
      const table = target.closest('table');
      const checked = target.checked;
      table?.querySelectorAll('tbody input[type="checkbox"]').forEach((c) => (c.checked = checked));
      updateSelectedCount(table);
      return;
    }

    if (target.matches('tbody input[type="checkbox"]')) {
      updateSelectedCount(target);
      return;
    }

    const statCard = target.closest('#page-dashboard .stat-card');
    if (statCard) {
      const map = { 今日订单: 'ord-list', 今日销售额: 'rpt-sales', 待拣货: 'ord-list', 库存预警: 'inv-expiry' };
      const label = statCard.querySelector('.stat-label')?.textContent;
      if (map[label] && typeof switchPage === 'function') {
        switchPage(map[label]);
        toast(`已跳转：${label}`, 'success');
      }
    }
  }

  function init() {
    ensureShell();
    DataStore.updateNotifyPanel();

    document.getElementById('page-container')?.addEventListener('click', onPageClick);

    document.querySelector('.header-bell')?.addEventListener('click', (e) => {
      e.stopPropagation();
      DataStore.updateNotifyPanel();
      document.getElementById('proto-notify-panel')?.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-bell') && !e.target.closest('#proto-notify-panel')) {
        document.getElementById('proto-notify-panel')?.classList.add('hidden');
      }
    });
  }

  return { init, toast, openDrawer, confirmDialog };
})();

function initInteractions() {
  Interactions.init();
}
