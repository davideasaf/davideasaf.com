#!/usr/bin/env bash
set -euo pipefail

# Dev-Workflow Agent — Sibling .worktrees convention
# - Worktrees live outside the repo in a sibling folder: <repo>.worktrees
# - Worktree folder name = branch name with '/' replaced by '-'
# - Creates an isolated worktree from latest <REMOTE>/<BASE> and checks out a new branch

# --- Defaults & Inputs ---
AGENT_NAME="${AGENT_NAME:-dev-workflow-bot@1.0}"
MODEL_PROVIDER="${MODEL_PROVIDER:-unknown}"
MODEL_NAME="${MODEL_NAME:-unknown}"
MODEL_VERSION="${MODEL_VERSION:-unknown}"
MODEL_TEMPERATURE="${MODEL_TEMPERATURE:-NA}"
MODEL_TOP_P="${MODEL_TOP_P:-NA}"
MODEL_SEED="${MODEL_SEED:-NA}"
MODEL_MAX_TOKENS="${MODEL_MAX_TOKENS:-NA}"

BASE_BRANCH="${BASE_BRANCH:-main}"
REMOTE="${REMOTE:-origin}"
RUN_ID="${RUN_ID:-$(date +%s)}"

TASK=""
SLUG=""
ISSUE_ID="${ISSUE_ID:-}"
REVIEWERS="${REVIEWERS:-}"
LABELS="${LABELS:-agent,automation}"

usage() {
  echo "Usage: $0 --task <title> --slug <slug> [--issue <ID>] [--reviewers <csv>] [--labels <csv>]" >&2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --task) TASK="$2"; shift 2 ;;
    --slug) SLUG="$2"; shift 2 ;;
    --issue) ISSUE_ID="$2"; shift 2 ;;
    --reviewers) REVIEWERS="$2"; shift 2 ;;
    --labels) LABELS="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

[[ -n "$TASK" && -n "$SLUG" ]] || { echo "Need --task and --slug" >&2; usage; exit 1; }

# --- Preflight ---
command -v git >/dev/null || { echo "git missing" >&2; exit 1; }
command -v gh >/dev/null  || { echo "gh missing (GitHub CLI)" >&2; exit 1; }
if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI not authenticated; run 'gh auth login' or set GH_TOKEN" >&2
  exit 1
fi

# Repo root (absolute)
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Enforce clean working tree
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Repo not clean; commit or stash changes before running." >&2
  exit 1
fi

git fetch "$REMOTE" "$BASE_BRANCH" --prune

# --- Sibling .worktrees root ---
PARENT_DIR="$(dirname "$REPO_ROOT")"
REPO_NAME="$(basename "$REPO_ROOT")"
WORKTREE_ROOT="$PARENT_DIR/${REPO_NAME}.worktrees"
mkdir -p "$WORKTREE_ROOT"

# Branch & folder naming
TS="$(date +%Y%m%d-%H%M)"
BRANCH="topic/${SLUG}-run${RUN_ID}-${TS}"
FOLDER_NAME="${BRANCH//\//-}"
TARGET_DIR="$WORKTREE_ROOT/$FOLDER_NAME"

if [[ -e "$TARGET_DIR" ]]; then
  echo "Target worktree folder already exists: $TARGET_DIR" >&2
  exit 1
fi

# Create isolated worktree from latest base and checkout new branch
git -C "$REPO_ROOT" worktree add -b "$BRANCH" "$TARGET_DIR" "$REMOTE/$BASE_BRANCH"

# Safe local git config in the worktree
git -C "$TARGET_DIR" config pull.rebase true
git -C "$TARGET_DIR" config commit.gpgsign false

# --- Per-worktree dev server port allocation ---
# Compute a stable port from the folder name, fall back to next free ports if needed
PORT_BASE="${PORT_BASE:-5300}"
PORT_RANGE="${PORT_RANGE:-1000}"

hash_hex="$(printf '%s' "$FOLDER_NAME" | shasum -a 256 | head -c 8 || true)"
[[ -z "$hash_hex" ]] && hash_hex="0"
hash_dec=$((16#$hash_hex))
candidate=$((PORT_BASE + (hash_dec % PORT_RANGE)))

is_port_in_use() {
  lsof -i :"$1" -sTCP:LISTEN -t >/dev/null 2>&1
}

DEV_PORT="$candidate"
if is_port_in_use "$DEV_PORT"; then
  for ((i=1;i<50;i++)); do
    next=$((candidate + i))
    if ! is_port_in_use "$next"; then DEV_PORT="$next"; break; fi
  done
fi

DEV_URL="http://localhost:${DEV_PORT}"
mkdir -p "$TARGET_DIR/.agent"
printf "DEV_PORT=%s\nDEV_URL=%s\nPLAYWRIGHT_BASE_URL=%s\n" "$DEV_PORT" "$DEV_URL" "$DEV_URL" > "$TARGET_DIR/.agent/env"

# --- Helpers ---
agent_commit () {
  local msg="$1" ; local mi="$2" ; local of="$3" ; local title="$4"
  (
    cd "$TARGET_DIR"
    git add -A
    if git diff --cached --quiet; then echo "No changes; skip commit"; return 0; fi
    git commit -m "[agent] ${msg}" \
      -m "Implements: ${ISSUE_ID:-}" \
      -m "Milestone: ${mi}/${of} – ${title}" \
      -m "Agent: ${AGENT_NAME:-dev-workflow-bot@1.0}" \
      -m "Model: ${MODEL_PROVIDER:-unknown}/${MODEL_NAME:-unknown}@${MODEL_VERSION:-unknown}" \
      -m "Model-Params: temperature=${MODEL_TEMPERATURE:-NA}; top_p=${MODEL_TOP_P:-NA}; seed=${MODEL_SEED:-NA}; max_tokens=${MODEL_MAX_TOKENS:-NA}"
  )
}

rebase_main () {
  (
    cd "$TARGET_DIR"
    git fetch "$REMOTE" "$BASE_BRANCH"
    git rebase "$REMOTE/$BASE_BRANCH" || { echo "Rebase conflict." >&2; exit 2; }
  )
}

# --- Push & PR scaffolding ---
rebase_main
git -C "$TARGET_DIR" push -u "$REMOTE" "$BRANCH"

PR_BODY="$(mktemp)"
trap 'rm -f "$PR_BODY"' EXIT
cat > "$PR_BODY" <<EOF
## Summary
$TASK

## Milestones
- [ ] 1/3 – planning & interfaces
- [ ] 2/3 – implementation & tests
- [ ] 3/3 – docs & polish

## Model & Config
| Field | Value |
|---|---|
| Provider | ${MODEL_PROVIDER:-unknown} |
| Model | ${MODEL_NAME:-unknown} |
| Version | ${MODEL_VERSION:-unknown} |
| Temperature | ${MODEL_TEMPERATURE:-NA} |
| Top-p | ${MODEL_TOP_P:-NA} |
| Seed | ${MODEL_SEED:-NA} |
| Max tokens | ${MODEL_MAX_TOKENS:-NA} |

```
Agent: ${AGENT_NAME:-dev-workflow-bot@1.0}
Branch: ${BRANCH}
Worktree: ${TARGET_DIR}
Implements: ${ISSUE_ID:-}
Base: ${REMOTE}/${BASE_BRANCH}
```

## Dev Server (per-worktree)
Port: ${DEV_PORT}
URL: ${DEV_URL}
Start: ( cd ${TARGET_DIR} && npm ci && npm run dev -- --port ${DEV_PORT} )

## Playwright
Use baseURL=${DEV_URL}. Example: `npx playwright test --project=chromium`

## Validation
- [ ] Lints pass
- [ ] Unit tests pass
- [ ] CI green
- [ ] Docs updated (if needed)

## Notes
This PR was authored via an isolated sibling git worktree in ${WORKTREE_ROOT}.
EOF

(
  cd "$TARGET_DIR"
  gh pr create --title "${ISSUE_ID:+$ISSUE_ID: }${TASK}" --body-file "$PR_BODY" --base "$BASE_BRANCH" --draft
  IFS=',' read -ra LBL <<<"$LABELS"; for l in "${LBL[@]}"; do gh pr edit --add-label "$l" || true; done
  [[ -n "$REVIEWERS" ]] && gh pr edit --add-reviewer "$REVIEWERS" || true
)

echo "PR opened for $BRANCH"


