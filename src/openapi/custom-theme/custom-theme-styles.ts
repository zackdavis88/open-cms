const customThemeStyles = `
/* Dark theme: applied when documentElement has class 'swagger-ui-dark' */
.swagger-ui-dark {
  background-color: #0b1220 !important;
}
.swagger-ui-dark .swagger-ui {
  background-color: #0b1220 !important;
}
.swagger-ui-dark .scheme-container {
  background-color: #0b1220 !important;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.15) !important;
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
.swagger-ui-dark section.models h4 svg { fill: #afaeae !important; }
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

export default customThemeStyles;
