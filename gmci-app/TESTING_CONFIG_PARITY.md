# Maintenance Process for Testing Config Parity
## GMCI Events Platform - July 11, 2026

---

## 1. Goal
Ensure local and CI environments always use exactly the same test, lint, and build configurations!

---

## 2. Synchronization Checklist

### 2.1. Node.js Version
- **Action**: Ensure `.nvmrc` and `actions/setup-node` both use identical Node.js version
- **Current Version**: `20.x`

### 2.2. Dependencies
- **Action**: Use `npm ci` (not `npm install`) in both dev and CI to install exact versions from `package-lock.json`
- **Enforcement**: Pre-commit hook checks that `package.json` and `package-lock.json` are in sync

### 2.3. Configuration Files
- **Files to sync**:
  - `vite.config.ts`
  - `vitest.config.ts` (same as `vite.config.ts`)
  - `.eslintrc.cjs`
  - `tsconfig.json`
  - GitHub Actions workflow: `.github/workflows/deploy.yml`

### 2.4. Husky Hooks
- **Files**:
  - `.husky/pre-commit`
  - `.husky/pre-push`

---

## 3. Maintenance Tasks
1. **When updating a dependency**: Run `npm install` and commit the updated `package-lock.json`
2. **When changing a config file**:
   - Update it locally
   - Update GitHub Actions workflow if needed
   - Verify locally with `npm run lint`, `npm run test`, `npm run build`
3. **Every week**:
   - Check that GitHub Actions node version matches local
   - Audit dependencies (`npm audit`)
   - Update `TESTING_AUDIT.md`

---

## 4. Validation
- Before every commit: `npm run lint && npm run test -- --run`
- Before every push: All checks + build (`npm run build`)
- The GitHub Actions workflow runs *exactly* the same commands!
