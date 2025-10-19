---
name: Blog Editor
description: Use when you need to review, validate, and provide recommendations for improving a Neural Notes blog post draft. This skill checks technical accuracy, structure, style, and provides actionable feedback for the blog writer.
---

# Blog Editor

## Instructions

This skill provides comprehensive editorial review of Neural Notes blog posts, ensuring they meet quality standards for technical accuracy, readability, engagement, and SEO. Use this after the Blog Writer skill generates a draft or when reviewing existing posts.

### Inputs

- **File path**: Path to the MDX file to review (e.g., `content/neural-notes/post-name.mdx`)
- **Focus areas** (optional): Specific aspects to emphasize (e.g., technical accuracy, SEO, structure)

### Editorial Review Framework

Evaluate the blog post across these dimensions:

#### 1. Frontmatter Validation
- [ ] All required fields present (`title`, `excerpt`, `date`, `author`, `tags`)
- [ ] Title is 50-70 characters, compelling and descriptive
- [ ] Excerpt is 120-160 characters, SEO-friendly
- [ ] Date is in correct ISO format (YYYY-MM-DD)
- [ ] Tags are 3-5 relevant categories
- [ ] Boolean flags are set correctly (`featured`, `hasVideo`, `hasAudio`, `draft`)
- [ ] `editorTodos` lists actionable items (if any)

#### 2. Structure & Organization
- [ ] Clear, logical flow from introduction to conclusion
- [ ] Main heading (h1) matches frontmatter title
- [ ] Proper heading hierarchy (h2 for sections, h3 for subsections)
- [ ] Sections are balanced in length (no 3-paragraph h2 followed by 20-paragraph h2)
- [ ] Visual breaks (---) separate major sections appropriately
- [ ] Each section has a clear purpose and topic

#### 3. Opening & Hook
- [ ] First paragraph immediately establishes value or problem
- [ ] Hook is compelling and relevant to target audience
- [ ] Reader knows within 2-3 sentences why they should care
- [ ] Avoids generic openings ("In today's world...", "Technology is changing...")

#### 4. Technical Accuracy
- [ ] Terminology is precise and correct
- [ ] Code examples are syntactically valid
- [ ] Technology names and versions are accurate
- [ ] Claims are verifiable or clearly marked as opinion
- [ ] Mermaid diagrams render correctly
- [ ] Technical concepts are explained clearly

#### 5. Code Quality
- [ ] Code blocks have proper language syntax highlighting
- [ ] Examples are minimal but complete (no essential parts missing)
- [ ] Code follows modern best practices
- [ ] Comments explain "why" not just "what"
- [ ] Examples are realistic and practical

#### 6. Writing Quality
- [ ] Active voice predominates over passive voice
- [ ] Sentences are clear and concise (avg 15-20 words)
- [ ] Paragraphs are scannable (3-5 sentences max)
- [ ] Tone matches target audience (tech professionals)
- [ ] No jargon without explanation
- [ ] Transitions between sections are smooth

#### 7. Engagement & Readability
- [ ] Content delivers on the title's promise
- [ ] Practical, actionable insights (not just theory)
- [ ] Concrete examples illustrate key points
- [ ] Subheadings are descriptive and compelling
- [ ] Lists and code blocks break up dense text
- [ ] Reader can skim and still get value

#### 8. SEO & Discoverability
- [ ] Title includes relevant keywords naturally
- [ ] Excerpt is compelling and search-friendly
- [ ] Tags reflect actual content topics
- [ ] Headers use natural language (not keyword-stuffed)
- [ ] Content answers specific questions or solves problems

#### 9. Completeness
- [ ] All editor todos from frontmatter are addressed or noted
- [ ] Links are provided where referenced
- [ ] Screenshots/images are present or flagged as needed
- [ ] No placeholder text remains (e.g., "[TODO]", "[Insert here]")
- [ ] Conclusion or takeaways section exists

#### 10. Audience Alignment
- [ ] Technical depth matches target audience (intermediate to advanced devs)
- [ ] Assumes appropriate baseline knowledge
- [ ] Explains specialized concepts without talking down
- [ ] Examples resonate with tech/AI professionals

### Review Output Format

Provide feedback in this structure:

```markdown
## Editorial Review: [Post Title]

**Overall Assessment**: [One-line summary - e.g., "Strong technical content, needs structural improvements"]

**Recommendation**: [Ready to publish | Needs minor revisions | Needs significant revisions]

---

### Strengths
- [Specific positive element 1]
- [Specific positive element 2]
- [Specific positive element 3]

### Issues Found

#### Critical (must fix before publishing)
- **[Category]**: [Specific issue with location/example]
- **[Category]**: [Specific issue with location/example]

#### Moderate (should fix)
- **[Category]**: [Specific issue]
- **[Category]**: [Specific issue]

#### Minor (nice to have)
- **[Category]**: [Suggestion]
- **[Category]**: [Suggestion]

---

### Specific Recommendations

#### Frontmatter
- [Suggestion 1]
- [Suggestion 2]

#### Structure
- [Suggestion 1]
- [Suggestion 2]

#### Content
- [Suggestion 1 with line reference if possible]
- [Suggestion 2 with line reference if possible]

#### Code Examples
- [Suggestion 1]
- [Suggestion 2]

#### SEO
- [Suggestion 1]
- [Suggestion 2]

---

### Revised Elements (if applicable)

If specific elements need rewriting, provide them here:

**Suggested Title**: [Alternative if current title needs improvement]

**Suggested Excerpt**: [Alternative if current excerpt needs improvement]

**Suggested Opening**: [First 2-3 paragraphs if hook needs improvement]

---

### Editor Checklist

Review the `editorTodos` from frontmatter and mark progress:
- [ ] [Todo 1] - Status/Notes
- [ ] [Todo 2] - Status/Notes
- [ ] [Todo 3] - Status/Notes

---

### Next Steps

1. [Specific action item 1]
2. [Specific action item 2]
3. [Specific action item 3]
```

### Editorial Guidelines

#### When Reviewing Structure
- **Look for imbalance**: One section shouldn't dominate
- **Check flow**: Ideas should build logically
- **Verify headers**: H2s should be parallel in construction
- **Assess pacing**: Mix of short and long sections keeps interest

#### When Reviewing Code
- **Test mentally**: Could this code run as-is?
- **Check clarity**: Is the example minimal but complete?
- **Verify syntax**: Language tags correct? Indentation consistent?
- **Assess relevance**: Does this code serve the narrative?

#### When Reviewing Technical Content
- **Verify facts**: Are tool names, versions, APIs correct?
- **Check currency**: Is this info still current?
- **Assess depth**: Right level for the audience?
- **Look for gaps**: Are key concepts explained?

#### When Reviewing Writing
- **Flag passive voice**: "was created by" → "created"
- **Simplify jargon**: Define or replace unnecessarily complex terms
- **Tighten prose**: Can you remove words without losing meaning?
- **Improve transitions**: Does each section connect to the next?

#### When Reviewing SEO
- **Natural keywords**: In title, excerpt, headers, but not forced
- **Search intent**: Does this answer a real question?
- **Tag accuracy**: Would readers searching these tags find value?
- **Shareability**: Would this title work in social shares?

### Issue Severity Levels

**Critical** (blocks publishing):
- Technical inaccuracies or broken code
- Missing required frontmatter fields
- Broken structure (heading hierarchy issues)
- Completely generic or misleading title/excerpt
- No clear value proposition or takeaway

**Moderate** (should fix):
- Weak hook or opening
- Imbalanced structure
- Unclear code examples
- Passive voice overuse
- Missing editor todos from frontmatter
- SEO could be stronger

**Minor** (nice to have):
- Small wording improvements
- Additional examples could help
- Formatting consistency
- Could add more visual breaks
- Minor tag adjustments

### Best Practices

1. **Be specific**: Don't say "improve the opening" - suggest actual text or approach
2. **Balance criticism**: Always note strengths alongside issues
3. **Provide examples**: Show don't just tell (e.g., show a better version)
4. **Reference locations**: Mention section headers or line numbers when possible
5. **Prioritize issues**: Critical > Moderate > Minor
6. **Explain reasoning**: Why is this an issue? What's the impact?
7. **Offer alternatives**: If you flag a problem, suggest solutions
8. **Check completeness**: Did you address all editorTodos from frontmatter?

## Examples

### Example 1: Review of Technical Tutorial

**Input**: Review `content/neural-notes/playwright-e2e-testing.mdx`

**Assistant Actions**:
1. Reads the file completely
2. Validates frontmatter structure
3. Checks heading hierarchy and flow
4. Verifies code examples (Playwright syntax)
5. Evaluates technical accuracy of testing concepts
6. Assesses whether examples are practical
7. Reviews hook and conclusion strength
8. Generates comprehensive review with:
   - Overall assessment (e.g., "Strong practical examples, weak SEO")
   - Specific issues categorized by severity
   - Actionable recommendations with examples
   - Revised title/excerpt if needed
   - Next steps checklist

### Example 2: Review of Opinion Piece

**Input**: Review `content/neural-notes/ai-tools-wrong-metrics.mdx` with focus on persuasiveness

**Assistant Actions**:
1. Reads post and notes opinion-driven style
2. Evaluates argument structure and flow
3. Checks if claims are supported with reasoning
4. Assesses tone (appropriately opinionated but not abrasive)
5. Verifies examples strengthen the argument
6. Reviews SEO for opinion/hot-take style
7. Generates review emphasizing:
   - Argument clarity and logic
   - Supporting evidence quality
   - Provocative but defensible claims
   - Engagement potential
   - Recommendations for stronger impact

### Example 3: Quick Review for Minor Fixes

**Input**: Review `content/neural-notes/new-draft.mdx` - just check if it's ready

**Assistant Actions**:
1. Quickly scans frontmatter (validates all fields)
2. Checks structure at high level (headings, flow)
3. Spot-checks code examples (syntax highlighting, validity)
4. Verifies editorTodos are resolved
5. Provides brief review:
   - "Ready to publish with minor changes"
   - 2-3 critical or moderate issues to fix
   - Quick wins for improvement
   - Approval or request for revision

### Example 4: Deep Review with Rewrites

**Input**: Review `content/neural-notes/agentic-workflow.mdx` and help improve weak sections

**Assistant Actions**:
1. Full editorial review across all 10 dimensions
2. Identifies weak opening (too generic)
3. Notes imbalanced structure (section 3 is too long)
4. Finds passive voice overuse in section 2
5. Generates comprehensive review with:
   - Detailed issue breakdown
   - **Revised opening** (3 alternative hooks)
   - **Restructured outline** for section 3
   - **Rewritten paragraph** showing active voice
   - Specific line-by-line suggestions
   - Before/after examples

## Post-Review Checklist

After completing the review, confirm:
- [ ] All 10 review dimensions were evaluated
- [ ] Issues are categorized by severity (Critical/Moderate/Minor)
- [ ] Specific recommendations are actionable
- [ ] Strengths are noted alongside issues
- [ ] Examples or rewrites are provided where helpful
- [ ] Editor todos from frontmatter are addressed
- [ ] Next steps are clearly stated
- [ ] Overall recommendation is clear (publish / revise)

## Success Criteria

A successful editorial review:
- Provides clear, actionable feedback the writer can implement
- Balances positive reinforcement with constructive criticism
- Catches technical inaccuracies and structural issues
- Improves reader engagement and SEO potential
- Maintains the author's voice while elevating quality
- Gives specific examples and suggestions, not vague critiques
- Helps the blog writer improve their craft over time

## Integration with Blog Writer Skill

This skill complements the Blog Writer skill:
1. **Blog Writer** generates the initial draft with `editorTodos` flagged
2. **Blog Editor** reviews the draft and provides recommendations
3. **Blog Writer** implements suggested changes
4. **Blog Editor** does final check before publishing

The two skills work in tandem to produce high-quality, publication-ready content for the Neural Notes blog.
