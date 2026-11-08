/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A misspelled CSS variable fails silently: the property just falls back to its inherited value. This
 * checks that every variable the styles read is defined somewhere, in a stylesheet or an inline style.
 */
const sourceFiles = readdirSync('src', { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(css|tsx?)$/.test(file))
  .map((file) => readFileSync(join('src', file), 'utf8'));

const matches = (pattern: RegExp) =>
  new Set(sourceFiles.flatMap((text) => [...text.matchAll(pattern)].map((match) => match[1] ?? '')));

describe('CSS variables', () => {
  it('are all defined', () => {
    const defined = new Set([
      ...matches(/(?<![\w-])(--[\w-]+)\s*:/g), // in a stylesheet
      ...matches(/'(--[\w-]+)'\s*:/g), // in an inline style object
      ...matches(/@property\s+(--[\w-]+)/g),
    ]);
    const undefinedVariables = [...matches(/var\(\s*(--[\w-]+)/g)].filter((name) => !defined.has(name));
    expect(undefinedVariables).toEqual([]);
  });
});
