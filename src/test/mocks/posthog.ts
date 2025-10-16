import { vi } from "vitest";

// Mock PostHog for tests to avoid analytics calls
export const mockPostHog = {
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  isFeatureEnabled: vi.fn(() => false),
  getFeatureFlag: vi.fn(),
  onFeatureFlags: vi.fn(),
  reloadFeatureFlags: vi.fn(),
  group: vi.fn(),
  setPersonProperties: vi.fn(),
};

vi.mock("posthog-js", () => ({
  default: mockPostHog,
}));
