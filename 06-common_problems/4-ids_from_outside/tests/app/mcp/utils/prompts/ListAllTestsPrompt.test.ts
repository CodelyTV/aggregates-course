import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

import { evaluatePrompt } from "../../../../contexts/shared/infrastructure/evaluatePrompt";
import { TestServerManager } from "../../../../utils/TestServerManager";

describe("ListAllTestsPrompt should", () => {
	const serverManager = new TestServerManager();
	const mcpClient = new McpClient("http", [serverManager.mcpUrl()]);

	beforeAll(async () => {
		await serverManager.start();
		await mcpClient.connect();
	});

	afterAll(async () => {
		await mcpClient.disconnect();
		await serverManager.stop();
	});

	it("list the utils-list_all_tests prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain("utils-list_all_tests");
	});

	it("return a user message with instructions to list all tests", async () => {
		const response = await mcpClient.getPrompt("utils-list_all_tests");

		const score = await evaluatePrompt(
			`The prompt should guide how to list all tests and test cases inside the test folder using emojis`,
			response.firstPromptText(),
		);

		expect(score).toBeGreaterThan(0.7);
	}, 20000);
});
