---
name: GitHub Issue & Kanban Management
description: Use when you need to create a well-structured GitHub issue and add it to the davideasaf.com Kanban board with proper estimates and prioritization.
---

# GitHub Issue & Kanban Management

## Instructions

This skill helps you create comprehensive GitHub issues for the davideasaf.com project and automatically integrates them with the project's Kanban board.

### Inputs

- **title**: Clear, concise title for the issue
- **type**: Either "bug" or "enhancement"
- **description**: The problem statement or feature request
- **expected_behavior**: What should happen (required for bugs and enhancements)
- **priority**: P0 (critical), P1 (high), P2 (medium), or none
- **estimate**: Fibonacci points: 1, 2, 3, 5, 8, or 13

If any required information is missing, ask the user before proceeding.

### Workflow Steps

Execute these steps **in sequence**:

#### Step 1: Create the Issue Body

Structure the issue based on type:

**For Bugs:**
```markdown
## Problem
[Clear description of the bug]

## Current Behavior
- [What's happening now]
- [Specific examples]

## Expected Behavior
- [What should happen instead]

## Impact
- **User Experience**: [How this affects users]
- **Severity**: [Low/Medium/High/Critical]

## Technical Details

### Affected Components
- [Components/files affected]

### Potential Causes
- [Possible reasons]

## Implementation Checklist
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Testing steps]

## Success Criteria
- [Clear definition of done]
```

**For Enhancements:**
```markdown
## Problem
[What problem does this solve?]

## Proposed Solution
[High-level description]

## Current Behavior
- [How things work now]

## Expected Behavior
- [How it should work]

## Design Specifications
[Detailed specs]

## Technical Details

### Affected Files
- [File paths]

### Implementation Checklist
- [ ] [Task 1]
- [ ] [Task 2]

## Success Criteria
- [Definition of done]
```

#### Step 2: Create the GitHub Issue

```bash
gh issue create --title "TITLE" --body "BODY" --label "bug|enhancement"
```

#### Step 3: Add to Project Board

```bash
gh project item-add 1 --owner davideasaf --url ISSUE_URL
```

#### Step 4: Get Item ID

```bash
gh project item-list 1 --owner davideasaf --format json --limit 50 | jq '.items[] | select(.content.number == ISSUE_NUMBER) | {id: .id, number: .content.number}'
```

#### Step 5: Set Estimate

```bash
gh project item-edit --id ITEM_ID --field-id PVTF_lAHOALDZUc4BFqkFzg277OQ --project-id PVT_kwHOALDZUc4BFqkF --number ESTIMATE
```

#### Step 6: Set Priority (if provided)

Priority option IDs:
- P0: `79628723`
- P1: `0a877460`
- P2: `da944a9c`

```bash
gh project item-edit --id ITEM_ID --field-id PVTSSF_lAHOALDZUc4BFqkFzg277OI --project-id PVT_kwHOALDZUc4BFqkF --single-select-option-id PRIORITY_ID
```

#### Step 7: Set Status to Backlog

```bash
gh project item-edit --id ITEM_ID --field-id PVTSSF_lAHOALDZUc4BFqkFzg277Do --project-id PVT_kwHOALDZUc4BFqkF --single-select-option-id f75ad846
```

### Confirmation Message

After completing all steps, provide this summary:

```
 Issue Created: https://github.com/davideasaf/davideasaf.com/issues/NUMBER

Configuration:
- Title: TITLE
- Type: bug|enhancement
- Priority: P0|P1|P2|none
- Estimate: X points
- Status: Backlog

The issue is now in your Kanban board!
```

### Estimation Guidelines

- **1-2 points**: Simple, quick fixes (< 2 hours)
- **3 points**: Small features or moderate bugs (2-4 hours)
- **5 points**: Medium complexity features (4-6 hours)
- **8 points**: Large features or complex bugs (6-8 hours)
- **13 points**: Very large, complex work (7-9+ hours)

### Project Context

The davideasaf.com project:
- **Tech Stack**: React + Vite + Tailwind CSS
- **Content**: File-based with Markdown + YAML frontmatter
- **Testing**: Playwright for E2E, Vitest for unit tests
- **Linting**: Biome (not ESLint)
- **Key Pages**: Home, Projects, Neural Notes (blog), About
- **Design**: Orange theme (#FF6B35), dark background

### Best Practices

1. **Be thorough**: Include all relevant details
2. **Be specific**: Use concrete examples and clear acceptance criteria
3. **Be actionable**: Provide checklists an AI agent can follow
4. **Ask questions**: If information is missing, ask the user
5. **Use proper formatting**: Markdown code blocks, lists, headers

## Examples

### Example 1: Creating a Bug Report

**User:** Create an issue for the header overlapping breadcrumbs at 767-836px

**Assistant:**
1. Asks clarifying questions if needed
2. Creates detailed issue with:
   - Problem description with viewport range
   - Current vs expected behavior
   - Technical details about responsive design
   - Implementation checklist
3. Executes all 7 workflow steps
4. Confirms with summary message

### Example 2: Creating an Enhancement

**User:** Create an issue to make blog post cards fully clickable

**Assistant:**
1. Gathers requirements (priority, estimate)
2. Creates detailed issue with:
   - Problem statement (UX improvement)
   - Proposed solution (entire card as CTA)
   - Design specifications
   - Accessibility considerations
3. Executes workflow steps
4. Confirms completion with issue URL and configuration
