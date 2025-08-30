## Dev-Workflow Agent — Worktree → Milestones → PR (Sibling .worktrees)

This project uses an agent-driven workflow with isolated git worktrees that live outside the repo as a sibling directory: `<repo>.worktrees`. This replaces the old in-repo `_wt/` convention.

### Key Changes

- **Worktree root**: `/Users/dasaf/personal-dev/generative-spark-studio.worktrees`
- **Folder naming**: Replace `/` with `-` in the branch name (e.g., `topic/feat-x` → `topic-feat-x`).
- **Isolation**: Work only inside the created worktree folder. Keep the main repo clean.

### Preflight

1. Tools: `git ≥ 2.38`, `gh` (GitHub CLI), optionally `jq`.
2. Auth: `gh auth status` must succeed (or `GH_TOKEN` is set).
3. Clean repo at the root (no uncommitted changes).
4. `git fetch origin main --prune`.

### Worktree Creation (Sibling Convention)

- Repo root (example): `/Users/dasaf/personal-dev/generative-spark-studio`
- Worktrees root: `/Users/dasaf/personal-dev/generative-spark-studio.worktrees`
- Branch: `topic/<slug>-run<runId>-<ts>`
- Folder: replace `/` with `-` → `topic-<slug>-run<runId>-<ts>`
- Target: `<worktrees_root>/<folder>`

Command performed by the agent script:

```bash
git -C "$REPO_ROOT" worktree add -b "$BRANCH" "$TARGET" "$REMOTE/$BASE"
```

Then set safe local git config in the worktree:

```bash
git -C "$TARGET" config pull.rebase true
git -C "$TARGET" config commit.gpgsign false
```

### Milestone Commit Protocol

Commit in small milestones inside the worktree:

```
[agent] <concise summary>

Implements: <ISSUE-ID or URL>
Milestone: <i>/<n> – <short milestone title>
Agent: dev-workflow-bot@1.0
Model: <PROVIDER>/<MODEL_NAME>@<VERSION>
Model-Params: temperature=<t>; top_p=<p>; seed=<seed>; max_tokens=<n>
```

### Rebase Discipline

Always stay synced with `origin/main` before milestones and before pushing:

```bash
git fetch origin main
git rebase origin/main
```

### Push & Draft PR (with Model Disclosure)

1. Push the branch from the worktree: `git push -u origin <branch>`
2. Open a draft PR via GitHub CLI with a Model & Config section.
3. Wait for CI to pass, then mark PR ready.

### Ready-to-Use Script

Use `scripts/dev_agent.sh` (added in this repo) to automate the entire flow including worktree creation under the sibling root, push, and draft PR creation with model disclosure.

Example:

```bash
AGENT_NAME=dev-workflow-bot@1.0 \
MODEL_PROVIDER=openai MODEL_NAME=gpt-5 MODEL_VERSION=2025-08-30 \
bash scripts/dev_agent.sh \
  --task "Implement a new feature" \
  --slug "feature-new-ui"
```

### Safety & Guardrails

- Enforce write scope; never commit secrets.
- Keep commits focused; do not batch unrelated edits.
- If rebase conflicts or CI failures require human input, stop and request review.
