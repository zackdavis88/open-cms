import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';
import { NotFoundError } from './errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'src/openapi';

const configureRoutes = (app: Express) => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const routeFiles = fs.globSync(`./${rootPath}/routes/**/index.${fileExtension}`);
  const apiRouter = express.Router();

  const swaggerCustomCss = `
/* Dark theme: applied when documentElement has class 'swagger-ui-dark' */
.swagger-ui-dark {
  background-color: #0b1220 !important;
}
.swagger-ui-dark .swagger-ui {
  background-color: #0b1220 !important;
}
.swagger-ui-dark .scheme-container {
  background-color: #0b1220 !important;
}
.swagger-ui-dark .title {
  color: #e6eef8 !important;
}
.swagger-ui-dark p {
  color: #e6eef8 !important;
}

.swagger-ui-dark .topbar {
  background: linear-gradient(90deg,#0b1220,#0f1724) !important;
}

.swagger-ui-dark .opblock, .swagger-ui-dark .opblock-section, .swagger-ui-dark .info {
  color: #d8e9ff !important;
}
.swagger-ui-dark .servers-title { color: #e6eef8 !important; }
.swagger-ui-dark .opblock.opblock-get { border-color: #3d6e9f; !important; }
.swagger-ui-dark .opblock.opblock-get .opblock-summary { border-color: #3d6e9f; !important; }
.swagger-ui-dark .opblock.opblock-post { border-color: #266a4b; !important; }
.swagger-ui-dark .opblock.opblock-post .opblock-summary { border-color: #266a4b; !important; }
.swagger-ui-dark .opblock.opblock-delete { border-color: #8a2323; !important; }
.swagger-ui-dark .opblock.opblock-delete .opblock-summary { border-color: #8a2323; !important; }
.swagger-ui-dark .opblock.opblock-patch { border-color: #389f88; !important; }
.swagger-ui-dark .opblock.opblock-patch .opblock-summary { border-color: #389f88; !important; }
.swagger-ui-dark .opblock .opblock-summary { color: #e6eef8 !important; }
.swagger-ui-dark .opblock .opblock-section-header { background-color: #3b4151 !important; }
.swagger-ui-dark .opblock .opblock-section-header h4 { color: #e6eef8 !important; }
.swagger-ui-dark .opblock.opblock-patch .opblock-summary-method { background-color: #349d86 !important; }
.swagger-ui-dark .opblock.opblock-post .opblock-summary-method { background-color: #41b781 !important; }
.swagger-ui-dark .opblock .opblock-summary-path { color: #e6eef8 !important; }
.swagger-ui-dark .opblock .opblock-summary-description { color: #e6eef8 !important; }
.swagger-ui-dark .authorization__btn > svg { fill: #e6eef8 !important }
.swagger-ui-dark .opblock-control-arrow > svg { fill: #afaeae !important }
.swagger-ui-dark .model, .swagger-ui-dark .model-content { background: #07101a !important; border-color: #183041 !important; color: #cfe6ff !important; }
.swagger-ui-dark .parameter__name, .swagger-ui-dark .property__type { color: #9fb7d8 !important; }
.swagger-ui-dark .response-col_status { color: #ffd080 !important; }
.swagger-ui-dark .try-out > button { color: #e6eef8 !important; border: 2px solid #e6eef8 !important }
.swagger-ui-dark table thead tr td, .swagger-ui table thead tr th { color: #e6eef8 !important; }
.swagger-ui-dark .response-col_links { color: #e6eef8 !important; }
.swagger-ui-dark .tab li { color: #e6eef8 !important; }
.swagger-ui-dark .model-box { background: rgba(0,0,0,.5) !important}
.swagger-ui-dark .json-schema-2020-12-property .json-schema-2020-12__title { color: #e6eef8 !important; }
.swagger-ui-dark .json-schema-2020-12-keyword--examples .json-schema-2020-12-json-viewer__name { color: #e6eef8 !important; }
.swagger-ui-dark .json-schema-2020-12-keyword--examples .json-schema-2020-12-json-viewer__value { color: #e6eef8 !important; }
.swagger-ui-dark .json-schema-2020-12-accordion__icon svg { fill: #afaeae !important;}
.swagger-ui-dark .json-schema-2020-12__attribute--primary { color: #ee64b2 !important; }
.swagger-ui-dark .expand-operation { fill: #afaeae !important; }
.swagger-ui-dark .opblock-tag-section h3 { color: #e6eef8 !important; }

.swagger-ui-dark section.models h4 { color: #afaeae !important; border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
.swagger-ui-dark section.models { border: 1px solid rgba(255, 255, 255, 0.05) !important; }
.swagger-ui-dark section.models article[data-json-schema-level="0"] { background-color: rgba(255, 255, 255, 0.05) !important;}
.swagger-ui-dark .json-schema-2020-12-accordion { background: transparent !important; }
.swagger-ui-dark .models .json-schema-2020-12:not(.json-schema-2020-12--embedded) > .json-schema-2020-12-head .json-schema-2020-12__title:first-of-type { color: #afaeae !important; }
.swagger-ui-dark .json-schema-2020-12-expand-deep-button { background: transparent !important;}
.swagger-ui-dark .json-schema-2020-12-keyword--enum .json-schema-2020-12-json-viewer__name { color: #e6eef8 !important; }
.swagger-ui-dark .json-schema-2020-12-keyword__name--primary { color: #e6eef8 !important; }
.swagger-ui-dark .json-schema-2020-12-keyword--enum .json-schema-2020-12-json-viewer__value { color: #e6eef8 !important; }
.swagger-ui-dark .btn.execute { background-color: #4673a8 !important; border-color: #4673a8 !important; }
.swagger-ui-dark .btn.btn-clear { border-color: #fff !important; color: #fff !important; }
.swagger-ui-dark .responses-inner h4 { color: #e6eef8 !important; }
.swagger-ui-dark .responses-inner h5 { color: #e6eef8 !important; }

/* Theme toggle control (pill placed above the title) */
.swagger-theme-toggle {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 999px;
  background: rgba(0,0,0,0.04);
  box-shadow: 0 2px 6px rgba(16,24,40,0.06);
  margin: 12px 0;
}
.swagger-theme-toggle button {
  border: none;
  background: transparent;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #0f1724;
}
.swagger-theme-toggle button svg { width: 14px; height: 14px; }
.swagger-theme-toggle button.active {
  background: linear-gradient(90deg,#2563eb,#7c3aed);
  color: white;
  box-shadow: 0 3px 8px rgba(37,99,235,0.18);
}
.swagger-ui-dark .swagger-theme-toggle { background: rgba(255,255,255,0.04); }
.swagger-ui-dark .swagger-theme-toggle button { color: #e6eef8; }
.swagger-ui-dark .swagger-theme-toggle button.active { background: linear-gradient(90deg,#0ea5a4,#7c3aed); color: #07101a; }
`;

  const swaggerCustomJs = `
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

  const routeFilePromises = routeFiles.map(async (file) => {
    const routeModule = await import(path.resolve(file));
    if (routeModule.default && typeof routeModule.default === 'function') {
      routeModule.default(apiRouter);
      app.use('/api', apiRouter);
    }
  });

  return Promise.all(routeFilePromises).then(() => {
    const documentationRouter = express.Router();

    // Serve the custom JS and (optionally) CSS for theme toggling before the swagger static serve
    documentationRouter.get('/docs/swagger-theme.js', (_req, res) => {
      res.type('application/javascript').send(swaggerCustomJs);
    });
    documentationRouter.get('/docs/swagger-theme.css', (_req, res) => {
      res.type('text/css').send(swaggerCustomCss);
    });

    documentationRouter.use('/docs', swaggerUi.serve);
    documentationRouter.route('/docs').get(
      swaggerUi.setup(swaggerSpec, {
        // Inject custom CSS (defines both themes; dark applied by JS toggle)
        customCss: swaggerCustomCss,
        // Load custom JS that adds a theme toggle and persists selection
        customJs: ['/docs/swagger-theme.js'],
        swaggerOptions: {
          // Set this option to true to persist authorization
          persistAuthorization: true,
        },
        customSiteTitle: 'Open CMS Documentation',
      }),
    );
    app.use(documentationRouter);

    const catchAllRouter = express.Router();
    catchAllRouter.route('/{*splat}').all((_req, res) => {
      const routeNotFoundError = new NotFoundError('API route not found');
      res.sendError(routeNotFoundError);
    });
    app.use(catchAllRouter);
  });
};

export default configureRoutes;
