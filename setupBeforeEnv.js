// This code runs before the Jest test environment is set up

// Mock Gatsby loader methods to prevent console errors in storybook
global.___loader = {
  enqueue: jest.fn(),
  hovering: jest.fn(),
}
