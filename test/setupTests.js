import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

// react-select v5+ no longer uses findDOMNode, so the polyfill has been removed

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};


if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore - Node's TextDecoder and the DOM TextDecoder have slight type mismatches
  global.TextDecoder = TextDecoder;
}