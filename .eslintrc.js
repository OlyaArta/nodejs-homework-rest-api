module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
    sendgrid: true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};
