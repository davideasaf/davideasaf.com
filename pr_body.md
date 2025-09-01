## Summary
Add banner and video media support with priority system across the site. Videos take precedence over banners/images, with graceful fallback to clean card design when no media is available.

## Milestones
- [x] 1/1 – Complete banner/video media implementation

## Model & Config

Field	Value
Provider	grok
Model	grok-code-fast-1
Version	unknown
Temperature	NA
Top-p	NA
Seed	NA
Max tokens	NA

# Agent metadata
Agent: dev-workflow-bot@1.0
Branch: topic/banner-video-media-feature-run20250901-1158
Worktree: /Users/dasaf/personal-dev/davideasaf.com.worktrees/topic-banner-video-media-feature-run20250901-1158
Implements: Banner/Video Media Feature Request

## Changes Made
- **Content Schema**: Added banner/video fields to neural notes and projects metadata
- **MediaDisplay Component**: New component handling video embeds and responsive images
- **Priority System**: Video > Banner > Image > Default card display logic
- **Component Updates**: Updated homepage, neural notes listing, and project showcase
- **Responsive Design**: Mobile-first approach with proper aspect ratios
- **Sample Content**: Added banner/video metadata to example content files

## Validation
- Lints pass (Biome check passed)
- TypeScript compilation successful
- Responsive design implemented
- Graceful error handling for missing media
- Lazy loading for performance

## Notes
This PR was authored via an isolated git worktree by an agent following the dev-workflow-agent protocol.
