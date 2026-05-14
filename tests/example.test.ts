import { describe, it, expect } from '@jest/globals';

describe('Example Test Suite', () => {
  it('should pass this basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });
});
