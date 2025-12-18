# Task: Build & Release Pipeline

## Responsibility
Configure the build system, bundling, and release process for the plugin.

## Description
This task sets up the development toolchain including TypeScript compilation, esbuild bundling, and the release workflow for publishing to Obsidian's community plugins.

## Scope
- **Single Responsibility**: Build configuration and release automation only
- **Not Responsible For**: Source code, tests, or documentation

## Deliverables

### 1. Package Configuration (`package.json`)
```json
{
  "name": "obsidian-dollar-smith",
  "version": "0.1.0",
  "description": "Safely normalize LaTeX-style math delimiters in Obsidian",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "version": "node version-bump.mjs && git add manifest.json versions.json"
  },
  "keywords": ["obsidian", "math", "latex", "markdown"],
  "author": "",
  "license": "Apache-2.0",
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "builtin-modules": "^3.3.0",
    "esbuild": "^0.19.0",
    "obsidian": "latest",
    "tslib": "^2.6.0",
    "typescript": "^5.2.0"
  }
}
```

### 2. TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "inlineSourceMap": true,
    "inlineSources": true,
    "module": "ESNext",
    "target": "ES6",
    "allowJs": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "lib": ["DOM", "ES5", "ES6", "ES7"]
  },
  "include": ["**/*.ts"]
}
```

### 3. ESBuild Configuration (`esbuild.config.mjs`)
```javascript
import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const prod = process.argv[2] === "production";

esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/state",
    "@codemirror/view",
    ...builtins
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  watch: !prod,
}).catch(() => process.exit(1));
```

### 4. Plugin Manifest (`manifest.json`)
```json
{
  "id": "obsidian-dollar-smith",
  "name": "Dollar Smith",
  "version": "0.1.0",
  "minAppVersion": "1.0.0",
  "description": "Safely normalize LaTeX-style math delimiters using CodeMirror 6",
  "author": "",
  "authorUrl": "",
  "isDesktopOnly": false
}
```

### 5. Versions File (`versions.json`)
```json
{
  "0.1.0": "1.0.0"
}
```

### 6. Version Bump Script (`version-bump.mjs`)
```javascript
import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
```

### 7. Git Ignore (`.gitignore`)
```
node_modules/
main.js
*.js.map
data.json
.DS_Store
```

## Dependencies
- esbuild
- TypeScript
- obsidian (types)

## Acceptance Criteria
- [ ] `npm install` succeeds
- [ ] `npm run build` produces `main.js`
- [ ] `npm run dev` starts watch mode
- [ ] Built plugin loads in Obsidian
- [ ] Version bump script works correctly

## Technical Notes
- Use esbuild for fast bundling (< 1s builds)
- External Obsidian and CodeMirror modules (Obsidian provides them)
- Keep `main.js` as single output file
- Support source maps for development

## Files to Create
- `package.json`
- `tsconfig.json`
- `esbuild.config.mjs`
- `manifest.json`
- `versions.json`
- `version-bump.mjs`
- `.gitignore`

## Estimated Effort
2-3 hours
