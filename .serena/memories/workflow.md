# Development Workflow - davideasaf.com

## Git Workflow (Agent-Driven)
This project uses an agent-driven workflow with isolated git worktrees. The workflow emphasizes:
- **Worktree Isolation**: Worktrees live in sibling directory `.worktrees`
- **Milestone Commits**: Small, focused commits with specific format
- **Draft PRs**: All changes go through pull request review
- **Model Disclosure**: AI-generated changes are clearly marked

## Worktree Management
### Worktree Root
- **Location**: `/Users/dasaf/personal-dev/davideasaf.com.worktrees`
- **Naming**: Replace `/` with `-` in branch names (e.g., `topic/feat-x` → `topic-feat-x`)
- **Isolation**: Never work directly in the main repo

### Worktree Creation
```bash
# Automated with dev agent script
AGENT_NAME=dev-workflow-bot@1.0 \
MODEL_PROVIDER=openai MODEL_NAME=gpt-5 MODEL_VERSION=2025-08-30 \
bash scripts/dev_agent.sh \
  --task "Implement a new feature" \
  --slug "feature-new-ui"
```

### Manual Worktree Commands
```bash
# Create worktree
git worktree add -b "topic/feature-x" "../davideasaf.com.worktrees/topic-feature-x" "origin/main"

# Configure worktree
git -C "../davideasaf.com.worktrees/topic-feature-x" config pull.rebase true
git -C "../davideasaf.com.worktrees/topic-feature-x" config commit.gpgsign false
```

## Commit Protocol
### Milestone Commit Format
```
[agent] <concise summary>

Implements: <ISSUE-ID or URL>
Milestone: <i>/<n> – <short milestone title>
Agent: dev-workflow-bot@1.0
Model: <PROVIDER>/<MODEL_NAME>@<VERSION>
Model-Params: temperature=<t>; top_p=<p>; seed=<seed>; max_tokens=<n>
```

### Commit Guidelines
- **Small Commits**: One logical change per commit
- **Clear Messages**: Descriptive but concise
- **Agent Attribution**: Always include agent and model information
- **Issue Linking**: Reference GitHub issues or PRs

## Rebase Discipline
### Before Milestones
```bash
git fetch origin main
git rebase origin/main
```

### Conflict Resolution
- **Prevention**: Frequent rebasing prevents conflicts
- **Resolution**: Manual intervention required for conflicts
- **Testing**: Always test after resolving conflicts

## Pull Request Process
### Draft PR Creation
1. **Push Branch**: `git push -u origin <branch>`
2. **Create Draft**: Use GitHub CLI or web interface
3. **Model Disclosure**: Include model and parameters in PR description
4. **CI Check**: Wait for CI to pass
5. **Mark Ready**: Convert to ready-for-review when complete

### PR Template
```markdown
## Description
Brief description of changes

## Model Information
- **Agent**: dev-workflow-bot@1.0
- **Model**: <PROVIDER>/<MODEL_NAME>@<VERSION>
- **Parameters**: temperature=<t>; top_p=<p>; seed=<seed>; max_tokens=<n>

## Changes
- List of changes made

## Testing
- How changes were tested
- Any manual testing performed
```

## Content Management Workflow
### Adding Projects
1. **Create File**: Add MDX file to `/content/projects/`
2. **Frontmatter**: Include YAML metadata (title, description, date, tags)
3. **Content**: Write project description and details
4. **Images**: Add images to appropriate directories
5. **Test**: Verify rendering and responsive design

### Adding Neural Notes
1. **Create File**: Add MDX file to `/content/neural-notes/`
2. **Frontmatter**: Include metadata (title, excerpt, date, tags)
3. **Content**: Write blog post content
4. **Media**: Add images, videos, or other media
5. **SEO**: Ensure proper headings and meta information

## Quality Assurance
### Pre-commit Checks
- **Linting**: `npm run lint` passes
- **Type Checking**: TypeScript compilation succeeds
- **Build**: `npm run build` completes successfully
- **Testing**: Manual testing of new features

### Code Review
- **Automated Checks**: CI must pass
- **Manual Review**: Code review by team members
- **Design Review**: UI/UX changes reviewed for consistency
- **Performance**: Bundle size and loading performance checked

## Deployment Process
### Build and Deploy
```bash
# Build for production
npm run build

# Test production build
npm run preview

# Deploy to hosting provider
# Copy /dist contents to static host
```

### Environment Configuration
- **Development**: Local development with hot reload
- **Staging**: Optional staging environment for testing
- **Production**: Optimized build with asset optimization

## Safety Guidelines
- **No Secrets**: Never commit sensitive information
- **Clean Commits**: Don't batch unrelated changes
- **Rebase Safety**: Stop and request help for complex conflicts
- **Scope Limitation**: Only modify intended files

## Performance Optimization
### Build Optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Automatic WebP conversion
- **Bundle Analysis**: Monitor bundle sizes
- **Lazy Loading**: Components loaded on demand

### Runtime Performance
- **Fast Initial Load**: Optimize critical path
- **Smooth Navigation**: Instant-feeling route transitions
- **Image Loading**: Progressive image loading
- **Caching Strategy**: Effective browser caching