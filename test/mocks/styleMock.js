// Jest mock for style imports (css/less/scss/sass).
//
// Mirrors identity-obj-proxy's behaviour without requiring it as a dependency:
// - Side-effect imports (e.g. `import '@carbon/styles/css/styles.css'`) resolve to this module.
// - CSS-module style access (e.g. `styles.someClass`) returns the property name as a string.
module.exports = new Proxy(
  {},
  {
    get: (target, key) => (key === '__esModule' ? false : key),
  }
);
