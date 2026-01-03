const customThemeToggle = `
(function () {
  function applyTheme(isDark) {
    try {
      if (isDark) {
        document.documentElement.classList.add('swagger-ui-dark');
        document.documentElement.setAttribute('data-swagger-theme', 'dark');
      } else {
        document.documentElement.classList.remove('swagger-ui-dark');
        document.documentElement.setAttribute('data-swagger-theme', 'light');
      }
    } catch (e) {}
  }

  var stored = null; try { stored = localStorage.getItem('swagger-theme'); } catch (e) {}
  applyTheme(stored === 'dark');

  function createToggle() {
    // Prevent duplicate toggles
    if (document.querySelector('.swagger-theme-toggle')) return;

    var swaggerRoot = document.querySelector('.swagger-ui');
    var titleEl = swaggerRoot ? swaggerRoot.querySelector('h1.title') : document.querySelector('h1.title');
    var parent = titleEl && titleEl.parentNode ? titleEl.parentNode : (swaggerRoot || document.body);
    if (!parent) return;

    var containerWrap = document.createElement('div');
    containerWrap.style.width = '100%';
    containerWrap.style.display = 'flex';
    containerWrap.style.justifyContent = 'flex-start';
    containerWrap.style.marginBottom = '8px';

    var container = document.createElement('div');
    container.className = 'swagger-theme-toggle';

    var lightBtn = document.createElement('button'); lightBtn.type = 'button';
    lightBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>Light';

    var darkBtn = document.createElement('button'); darkBtn.type = 'button';
    darkBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Dark';

    function setActive(isDark) {
      if (isDark) {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
      }
    }

    lightBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      applyTheme(false);
      setActive(false);
      try { localStorage.setItem('swagger-theme', 'light'); } catch (e) {}
    });
    darkBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      applyTheme(true);
      setActive(true);
      try { localStorage.setItem('swagger-theme', 'dark'); } catch (e) {}
    });

    container.appendChild(lightBtn);
    container.appendChild(darkBtn);
    containerWrap.appendChild(container);

    if (titleEl && titleEl.parentNode) titleEl.parentNode.insertBefore(containerWrap, titleEl);
    else if (swaggerRoot && swaggerRoot.parentNode) swaggerRoot.parentNode.insertBefore(containerWrap, swaggerRoot);
    else document.body.insertBefore(containerWrap, document.body.firstChild);

    // initialize active state
    setActive(stored === 'dark');
  }

  // Wait for Swagger UI to render; use MutationObserver as a fallback
  function whenReady(cb) {
    if (document.querySelector('.swagger-ui')) { cb(); return; }
    var obs = new MutationObserver(function () { if (document.querySelector('.swagger-ui')) { obs.disconnect(); cb(); } });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    // Fallback: try to run after 3s in case observer didn't fire
    setTimeout(function () { try { obs.disconnect(); cb(); } catch (e) {} }, 3000);
  }

  whenReady(createToggle);
})();
`;

export default customThemeToggle;
