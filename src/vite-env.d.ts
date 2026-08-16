/// <reference types="vite/client" />

// Without this, `import.meta.env` is untyped and `tsc -p tsconfig.app.json`
// reports 11 TS2339 errors across the app - which trains everyone to ignore the
// typecheck, and an ignored typecheck catches nothing.
