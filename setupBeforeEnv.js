// This code runs before the Jest test environment is set up

// https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext
import registerRequireContextHook from "babel-plugin-require-context-hook/register"
registerRequireContextHook()

// Mock Gatsby loader methods to prevent console errors in storybook
global.___loader = {
  enqueue: jest.fn(),
  hovering: jest.fn(),
}
