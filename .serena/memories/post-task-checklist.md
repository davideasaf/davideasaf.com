# Post-Task Checklist - davideasaf.com

## Quality Assurance
- [ ] **Linting**: Run `npm run lint` and fix any issues
- [ ] **Type Checking**: Ensure TypeScript compilation passes
- [ ] **Build**: Run `npm run build` successfully
- [ ] **Preview**: Test production build with `npm run preview`

## Code Quality
- [ ] **DRY Principle**: No code duplication (check `src/lib/` utilities)
- [ ] **Component Organization**: UI components in `src/components/ui/`
- [ ] **Import Organization**: External deps → UI → Local → Utils → Types
- [ ] **Naming Conventions**: PascalCase for components, camelCase for functions
- [ ] **Type Safety**: All components and functions properly typed

## Content Management
- [ ] **Frontmatter**: Consistent YAML structure in MDX files
- [ ] **Image Optimization**: Images properly optimized with vite-imagetools
- [ ] **SEO**: Proper meta tags and structured data
- [ ] **Responsive Design**: Test on mobile and desktop
- [ ] **Accessibility**: Semantic HTML and proper ARIA labels

## Performance
- [ ] **Bundle Size**: Check build output for large bundles
- [ ] **Lazy Loading**: Routes properly code-split
- [ ] **Image Loading**: Images load progressively
- [ ] **Core Web Vitals**: Monitor loading performance

## Git Workflow
- [ ] **Commit Format**: Follow milestone commit protocol
- [ ] **Branch Naming**: Proper feature branch naming
- [ ] **Rebase**: Synced with origin/main before pushing
- [ ] **PR Ready**: Convert draft PR to ready-for-review

## Testing
- [ ] **Manual Testing**: Test all affected user flows
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari
- [ ] **Mobile Testing**: Test on mobile devices
- [ ] **Edge Cases**: Test error states and edge cases

## Documentation
- [ ] **Code Comments**: Complex logic properly documented
- [ ] **README Updates**: Update if new features added
- [ ] **Changelog**: Document breaking changes
- [ ] **API Documentation**: Update if public APIs changed

## Deployment Readiness
- [ ] **Environment Variables**: All required env vars documented
- [ ] **Build Configuration**: Vite config properly set
- [ ] **Asset Optimization**: Images and assets optimized
- [ ] **Caching Headers**: Proper cache headers for static assets

## Security
- [ ] **Dependencies**: Check for vulnerable dependencies
- [ ] **Secrets**: No sensitive data committed
- [ ] **Input Validation**: User inputs properly validated
- [ ] **XSS Prevention**: Content properly sanitized

## Final Checks
- [ ] **Git Status**: Clean working directory
- [ ] **CI Status**: All CI checks passing
- [ ] **Peer Review**: Code reviewed by team member
- [ ] **User Acceptance**: Feature works as expected

## Rollback Plan
- [ ] **Revert Commit**: Know how to revert if needed
- [ ] **Backup**: Important data backed up
- [ ] **Communication**: Team notified of deployment
- [ ] **Monitoring**: Post-deployment monitoring in place