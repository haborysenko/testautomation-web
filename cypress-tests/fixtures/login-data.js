export const validInputs = [
  { label: 'admin',     email: 'admin@admin.com',        password: '2020'       },
  { label: 'biancunha', email: 'biancunha@gmail.com',    password: '123456'     },
  { label: 'growdev',   email: 'growdev@growdev.com.br', password: 'growdev123' },

  // TODO BUG-006: uppercase email should be accepted once app normalises email to lowercase
  // { label: 'admin uppercase email', email: 'ADMIN@ADMIN.COM', password: '2020' },

  // TODO BUG-004: email with leading/trailing spaces should be trimmed before comparison
  // { label: 'admin padded email', email: '  admin@admin.com  ', password: '2020' },
];

export const defaultUser = validInputs[0];

export const fromDefaultUser = (overrides = {}) => ({
  ...defaultUser,
  ...overrides,
});

export const invalidInputs = [
  { name: 'wrong password',     user: fromDefaultUser({ password: 'wrong' }) },
  { name: 'unknown email',      user: fromDefaultUser({ email: 'ghost@nowhere.com' }) },
  { name: 'empty email',        user: fromDefaultUser({ email: '' }) },
  { name: 'empty password',     user: fromDefaultUser({ password: '' }) },
  { name: 'both empty',         user: fromDefaultUser({ email: '', password: '' }) },
  { name: 'whitespace only',    user: fromDefaultUser({ email: '   ', password: '   ' }) },
  { name: 'sql-like payload',   user: { email: "' OR '1'='1", password: "' OR '1'='1" } },
  { name: 'xss script payload', user: { email: '<script>alert(1)</script>', password: '<script>alert(1)</script>' } },
  { name: 'oversized password', user: fromDefaultUser({ password: 'a'.repeat(200) }) },
];
