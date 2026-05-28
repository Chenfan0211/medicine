/**
 * 登录页逻辑
 */
const STORAGE_KEY_AUTH = 'zhihe-erp-auth';

function randomCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function refreshCaptcha() {
  const el = document.getElementById('captcha-display');
  if (el) el.textContent = randomCaptcha();
}

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value;

  if (!username) {
    alert('请输入用户名');
    return;
  }
  if (!password) {
    alert('请输入密码');
    return;
  }

  localStorage.setItem(STORAGE_KEY_AUTH, '1');
  localStorage.setItem('zhihe-erp-user', username);
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem(STORAGE_KEY_AUTH) === '1') {
    window.location.href = 'index.html';
    return;
  }

  refreshCaptcha();
  document.getElementById('captcha-display')?.addEventListener('click', refreshCaptcha);
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    const btn = e.target.querySelector('.login-btn');
    if (btn) {
      btn.textContent = '登录中…';
      btn.disabled = true;
    }
    handleLogin(e);
    setTimeout(() => {
      if (btn && !localStorage.getItem(STORAGE_KEY_AUTH)) {
        btn.textContent = '登 录';
        btn.disabled = false;
      }
    }, 500);
  });

  document.querySelector('.login-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('原型演示：请联系管理员重置密码');
  });
});
