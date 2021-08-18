var isDevelopement = process.env.NODE_ENV !== 'production' // development environment

export function invariant(condition: boolean, format?: string, ...args: any[]): void {
  if (!isDevelopement)
    return;

  if (isDevelopement) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument')
    }
  }

  if (!condition) {
    let error

    if (format === undefined) {
      error = new Error('Minified exception occurred;')
    } else {
      let argIndex = 0;
      const fm = format.replace(/%s/g, () => args[argIndex++]);

      error = new Error(fm);
      console.error(fm);

      error.name = 'Invariant Violantion';
    }

    throw error;
  }
}