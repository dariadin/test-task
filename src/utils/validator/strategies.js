const createError = (err) => new Error(err);
export const maxLengthStrategy = (value, maxLength) => (
  value.length > maxLength && createError('max length exceeded')
);
export const minLengthStrategy = (value, minLength) => (
  value.length < minLength && createError('less then minimal length')
);
