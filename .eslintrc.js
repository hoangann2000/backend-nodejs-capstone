module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: "standard",
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		quotes: ["off"],           // Tắt rule bắt buộc dùng single quote
		semi: ["off"],             // Tắt rule cấm dùng dấu chấm phẩy
		"no-unused-vars": ["warn"], // Không báo lỗi, chỉ cảnh báo nếu biến không dùng
		"spaced-comment": ["off"], // Cho phép comment không có dấu cách
	},
};
