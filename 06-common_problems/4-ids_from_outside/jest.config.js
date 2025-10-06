/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testTimeout: 10000,
	maxWorkers: 1,
	injectGlobals: true,
	transform: {
		"^.+\\.ts$": [
			"@swc/jest",
			{
				sourceMaps: true,
				jsc: {
					parser: {
						syntax: "typescript",
						decorators: true,
					},
					transform: {
						legacyDecorator: true,
						decoratorMetadata: true,
					},
				},
			},
		],
		"^.+\\.m?js$": "@swc/jest",
	},
	testPathIgnorePatterns: ["node_modules"],
	transformIgnorePatterns: [
		"/node_modules/(?!(nanoid|@codelytv/mcp-client|@modelcontextprotocol/sdk)/)",
	],
};
