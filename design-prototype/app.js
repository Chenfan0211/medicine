/**
 * 智合医药 ERP 中台 - 应用入口
 */
let PAGE_REGISTRY = {};

const STORAGE_KEY_SIDEBAR = 'zhihe-erp-sidebar-collapsed';
const STORAGE_KEY_GROUPS = 'zhihe-erp-menu-groups-v2';
const STORAGE_KEY_AUTH = 'zhihe-erp-auth';

function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEY_AUTH) === '1';
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function switchPage(pageId) {
  if (!PAGES[pageId]) return;

  document.querySelectorAll('.page').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.menu-item, .menu-sub').forEach((el) => el.classList.remove('active'));

  const pageEl = document.getElementById(`page-${pageId}`);
  if (pageEl) pageEl.classList.add('active');

  const config = PAGE_REGISTRY[pageId];
  if (config) {
    const parts = config.breadcrumb.split(' / ');
    document.getElementById('breadcrumb').innerHTML = parts
      .map((part, i) => (i === parts.length - 1 ? `<span>${part}</span>` : `<span>${part}</span> / `))
      .join('');

    const menuEl = document.getElementById(config.menuId);
    if (menuEl) menuEl.classList.add('active');

    document.querySelectorAll('.menu-group-header').forEach((h) => h.classList.remove('active-group'));

    if (config.groupId) {
      expandMenuGroup(config.groupId);
      const group = document.querySelector(`.menu-group[data-group-id="${config.groupId}"]`);
      group?.querySelector('.menu-group-header')?.classList.add('active-group');
    }
  }

  if (pageId !== getCurrentHash()) {
    window.location.hash = pageId;
  }

  if (pageId === 'dashboard' && typeof bindDashboardCards === 'function') {
    bindDashboardCards();
  }
}

function getCurrentHash() {
  return window.location.hash.replace('#', '');
}

function isSidebarCollapsed() {
  return document.querySelector('.app')?.classList.contains('sidebar-collapsed');
}

function toggleSidebar() {
  const app = document.querySelector('.app');
  const btn = document.getElementById('sidebar-toggle');
  if (!app) return;

  const collapsed = app.classList.toggle('sidebar-collapsed');
  localStorage.setItem(STORAGE_KEY_SIDEBAR, collapsed ? '1' : '0');

  if (btn) {
    btn.title = collapsed ? '展开菜单' : '收起菜单';
    btn.textContent = collapsed ? '☰' : '«';
  }

  closeAllFlyouts();
}

function restoreSidebarState() {
  const collapsed = localStorage.getItem(STORAGE_KEY_SIDEBAR) === '1';
  const app = document.querySelector('.app');
  const btn = document.getElementById('sidebar-toggle');
  if (collapsed && app) {
    app.classList.add('sidebar-collapsed');
    if (btn) {
      btn.title = '展开菜单';
      btn.textContent = '☰';
    }
  }
}

function expandMenuGroup(groupId) {
  const group = document.querySelector(`.menu-group[data-group-id="${groupId}"]`);
  if (group) group.classList.remove('group-collapsed');
  saveGroupState();
}

function collapseAllMenuGroups() {
  document.querySelectorAll('.menu-group').forEach((group) => {
    group.classList.add('group-collapsed');
  });
}

function toggleMenuGroup(groupId) {
  const group = document.querySelector(`.menu-group[data-group-id="${groupId}"]`);
  if (!group) return;

  if (isSidebarCollapsed()) {
    toggleFlyout(group);
    return;
  }

  group.classList.toggle('group-collapsed');
  saveGroupState();
}

function saveGroupState() {
  const state = {};
  document.querySelectorAll('.menu-group').forEach((group) => {
    state[group.dataset.groupId] = !group.classList.contains('group-collapsed');
  });
  localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(state));
}

function initGroupState() {
  collapseAllMenuGroups();
}

function restoreGroupState() {
  const raw = localStorage.getItem(STORAGE_KEY_GROUPS);
  if (!raw) {
    initGroupState();
    return;
  }

  try {
    const state = JSON.parse(raw);
    document.querySelectorAll('.menu-group').forEach((group) => {
      const expanded = state[group.dataset.groupId];
      if (expanded) {
        group.classList.remove('group-collapsed');
      } else {
        group.classList.add('group-collapsed');
      }
    });
  } catch (_) {
    initGroupState();
  }
}

function closeAllFlyouts() {
  document.querySelectorAll('.menu-group.flyout-open').forEach((g) => g.classList.remove('flyout-open'));
}

function toggleFlyout(group) {
  const wasOpen = group.classList.contains('flyout-open');
  closeAllFlyouts();
  if (!wasOpen) {
    group.classList.add('flyout-open');
    positionFlyout(group);
  }
}

function positionFlyout(group) {
  const body = group.querySelector('.menu-group-body');
  const header = group.querySelector('.menu-group-header');
  if (!body || !header) return;

  const rect = header.getBoundingClientRect();
  body.style.top = `${rect.top}px`;
}

function logout() {
  localStorage.removeItem(STORAGE_KEY_AUTH);
  window.location.href = 'login.html';
}

function bindMenuEvents() {
  document.querySelectorAll('[data-page]').forEach((el) => {
    el.addEventListener('click', () => {
      const pageId = el.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
        if (isSidebarCollapsed()) closeAllFlyouts();
      }
    });
  });

  document.querySelectorAll('[data-group-toggle]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const groupId = el.getAttribute('data-group-toggle');
      if (groupId) toggleMenuGroup(groupId);
    });
  });

  document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  document.addEventListener('click', (e) => {
    if (!isSidebarCollapsed()) return;
    if (!e.target.closest('.menu-group')) closeAllFlyouts();
  });

  document.querySelectorAll('.menu-group-header').forEach((header) => {
    header.addEventListener('mouseenter', () => {
      if (!isSidebarCollapsed()) return;
      const group = header.closest('.menu-group');
      if (group) {
        closeAllFlyouts();
        group.classList.add('flyout-open');
        positionFlyout(group);
      }
    });
  });
}

function getInitialPage() {
  const hash = getCurrentHash();
  if (hash && PAGES[hash]) return hash;
  return 'dashboard';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  if (typeof DataStore !== 'undefined') DataStore.init();

  initSidebar();
  initPages();
  PAGE_REGISTRY = buildPageRegistry();
  restoreSidebarState();
  restoreGroupState();
  bindMenuEvents();

  const savedUser = localStorage.getItem('zhihe-erp-user') || '管理员';
  const userNameEl = document.getElementById('user-name');
  const userAvatarEl = document.getElementById('user-avatar');
  if (userNameEl) userNameEl.textContent = savedUser;
  if (userAvatarEl) userAvatarEl.textContent = savedUser.charAt(0).toUpperCase();

  switchPage(getInitialPage());
  initInteractions();
  if (typeof bindDashboardCards === 'function') bindDashboardCards();
});

window.addEventListener('hashchange', () => {
  if (!isAuthenticated()) return;
  const hash = getCurrentHash();
  if (hash && PAGES[hash]) {
    switchPage(hash);
  } else if (!hash) {
    switchPage('dashboard');
  }
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.menu-group.flyout-open').forEach(positionFlyout);
});

window.addEventListener('scroll', () => {
  if (isSidebarCollapsed()) closeAllFlyouts();
}, true);
