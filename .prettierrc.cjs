module.exports = {
  useTabs: false, // Indent lines with tabs instead of spaces.
  printWidth: 100, // Specify the length of line that the printer will wrap on.
  tabWidth: 2, // Specify the number of spaces per indentation-level.
  singleQuote: true, // Use single quotes instead of double quotes.
  /**
   * Change when properties in objects are quoted.
   * Valid options:
   * "as-needed" - Only add quotes around object properties where required.
   * "consistent" - If at least one property in an object requires quotes, quote all properties.
   * "preserve" - Respect the input use of quotes in object properties.
   */
  quoteProps: 'preserve',
  /**
   * Print trailing commas wherever possible.
   * Valid options:
   *   - "none" - no trailing commas
   *   - "es5" - trailing commas where valid in ES5 (objects, arrays, etc)
   *   - "all" - trailing commas wherever possible (function arguments)
   */
  trailingComma: 'all',
  /**
   * Do not print spaces between brackets.
   * If true, puts the > of a multi-line jsx element at the end of the last line instead of being
   * alone on the next line
   */
  // "jsxBracketSameLine": false,
  /**
   * Specify which parse to use.
   * Valid options:
   *   - "flow"
   *   - "babylon"
   */
  // "parser": "babylon",
  /**
   * Do not print semicolons, except at the beginning of lines which may need them.
   * Valid options:
   * - true - add a semicolon at the end of every line
   * - false - only add semicolons at the beginning of lines that may introduce ASI failures
   */
  semi: true,
  /**
   * Print spaces between brackets in object literals.
   * Valid options:
   * true - Example: { foo: bar }.
   * false - Example: {foo: bar}.
   */
  bracketSpacing: true,
  /**
   * Include parentheses around a sole arrow function parameter.
   * Valid options:
   * "always" - Always include parens. Example: (x) => x
   * "avoid" - Omit parens when possible. Example: x => x
   */
  arrowParens: 'always',
  endOfLine: 'lf',
};
