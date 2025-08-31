# Story: Add Pre-commit Hooks and CI/CD Linting Integration

<!-- Source: Brownfield enhancement request -->
<!-- Context: Brownfield enhancement to davideasaf.com personal website -->

ALERT: STORY NEEDS ADJUSTING. LINTING MOVED TO BIOME

## Status: Draft

## Story

**As a** developer working on davideasaf.com,
**I want** pre-commit hooks that run ESLint automatically on every commit with matching CI/CD pipeline validation,
**so that** code quality is consistently enforced locally and in the deployment pipeline, preventing lint errors from reaching production.

## Context Source

- Source Document: Brownfield enhancement request
- Enhancement Type: Developer Experience (DevEx) tooling integration
- Existing System Impact: Enhances development workflow without affecting runtime functionality

## Acceptance Criteria

1. Pre-commit hooks are installed and configured to run ESLint on staged TypeScript/React files
2. Commits are blocked when ESLint errors are found (warnings allowed with configuration)
3. Pre-commit hooks respect existing ESLint configuration (eslint.config.js)
4. GitHub Actions workflow validates the same linting rules on pull requests
5. CI/CD pipeline fails builds when linting errors are present
6. Existing development workflow (`npm run dev`, `npm run build`) continues to work unchanged
7. Performance remains acceptable (pre-commit runs only on staged files)
8. Documentation is updated with setup instructions for new contributors

## Dev Technical Guidance

### Existing System Context

**Current Tech Stack:**

- Build Tool: Vite 5.4.19
- Linting: ESLint 9.32.0 with TypeScript ESLint integration
- Package Manager: Uses bun.lockb (Bun package manager)
- Existing Scripts: `npm run lint` available for manual linting
- Current CI: GitHub Actions with claude.yml and claude-code-review.yml workflows

**ESLint Configuration Analysis:**

- Uses modern flat config format (eslint.config.js)
- TypeScript-first setup with React hooks and refresh plugins
- Configured for browser globals and ECMAScript 2020
- Ignores dist/ directory

**File Patterns to Lint:**

- Primary: `**/*.{ts,tsx}` (matches existing ESLint config)
- Exclusions: `dist/` directory (already configured)

### Integration Approach

**Pre-commit Implementation:**

1. Use Husky for Git hook management (industry standard)
2. Use lint-staged to run linters only on staged files (performance)
3. Integrate with existing `npm run lint` command pattern
4. Maintain compatibility with Bun package manager

**CI/CD Integration:**

1. Extend existing GitHub Actions workflows
2. Add linting step before build/deploy steps
3. Use same ESLint configuration as local development
4. Fail fast on lint errors to save CI resources

### Technical Constraints

- Must work with Bun package manager (existing lockfile)
- Must respect existing ESLint flat config format
- Cannot break existing development commands
- Should not significantly slow down commit process
- Must be cross-platform compatible for contributors

### Missing Information

None - all technical context is available from project analysis.

## Tasks / Subtasks

- [ ] Task 1: Install and configure pre-commit dependencies

  - [ ] Add Husky for Git hooks management
  - [ ] Add lint-staged for selective file processing
  - [ ] Update package.json with necessary dev dependencies
  - [ ] Verify Bun compatibility

- [ ] Task 2: Configure pre-commit hooks

  - [ ] Set up Husky pre-commit hook
  - [ ] Configure lint-staged to run ESLint on staged TS/TSX files
  - [ ] Test hook blocks commits with ESLint errors
  - [ ] Verify hook allows commits with warnings (configurable)

- [ ] Task 3: Enhance GitHub Actions CI/CD pipeline

  - [ ] Add linting step to existing workflows
  - [ ] Ensure linting runs before build/deploy steps
  - [ ] Configure workflow to fail on ESLint errors
  - [ ] Test CI integration with intentional lint error

- [ ] Task 4: Verify existing functionality

  - [ ] Test `npm run dev` still works unchanged
  - [ ] Test `npm run build` still works unchanged
  - [ ] Test `npm run lint` manual command still works
  - [ ] Verify existing workflows (claude.yml, claude-code-review.yml) remain functional

- [ ] Task 5: Add documentation and testing
  - [ ] Update README or create CONTRIBUTING.md with pre-commit setup instructions
  - [ ] Document how to bypass hooks for emergency commits (`--no-verify`)
  - [ ] Test full workflow: local development → commit → PR → CI validation
  - [ ] Add configuration documentation for ESLint rule modifications

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Pre-commit hooks might conflict with existing development workflow
- **Mitigation**: Use lint-staged to only process staged files, maintain existing lint command
- **Verification**: Test all existing npm scripts continue to work

- **Secondary Risk**: CI/CD changes could break existing deployment pipeline
- **Mitigation**: Add linting as separate job/step, don't modify existing build logic
- **Verification**: Test deployment to existing hosting platform

- **Performance Risk**: Pre-commit hooks slow down commit process
- **Mitigation**: Use lint-staged for selective processing, only lint changed files
- **Verification**: Measure commit time before and after implementation

### Rollback Plan

- Remove Husky hooks: `rm -rf .husky/`
- Remove lint-staged configuration from package.json
- Revert GitHub Actions workflow changes
- Remove added dev dependencies: husky, lint-staged

### Safety Checks

- [ ] Existing ESLint configuration tested before changes
- [ ] Pre-commit hooks can be bypassed with `--no-verify` flag
- [ ] CI/CD changes are additive, not modifying existing build steps
- [ ] All existing npm scripts remain functional
- [ ] Rollback procedure documented and tested

## Dev Notes

### Testing Standards

**Test Requirements:**

- Manual testing of commit workflow with various scenarios
- CI/CD pipeline testing with intentional lint failures
- Cross-platform compatibility verification (if applicable)
- Performance baseline measurement for commit times

**Test File Locations:**

- No unit tests required for this DevEx enhancement
- Integration testing via actual Git commits and CI pipeline

**Testing Frameworks:**

- Manual testing of Git hooks and CI/CD pipeline
- Use existing project structure for testing scenarios

### Relevant Source Tree Information

**Key Files to Modify:**

- `package.json` - Add dev dependencies and lint-staged configuration
- `.husky/pre-commit` - New Git hook script (to be created)
- `.github/workflows/claude.yml` - Add linting step
- `.github/workflows/claude-code-review.yml` - Add linting step
- `README.md` or `CONTRIBUTING.md` - Documentation updates

**Configuration Dependencies:**

- `eslint.config.js` - Existing configuration to respect
- `bun.lockb` - Package manager lockfile to maintain

## Change Log

| Date       | Version | Description                                         | Author            |
| ---------- | ------- | --------------------------------------------------- | ----------------- |
| 2025-08-31 | 1.0     | Initial story creation for pre-commit DevEx feature | BMad Orchestrator |

## Dev Agent Record

_This section will be populated by the development agent during implementation_

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_

## QA Results

_Results from QA Agent review will be populated here after implementation_
