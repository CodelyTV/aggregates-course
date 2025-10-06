import { Service } from "diod";

import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";
import { McpPromptResponse } from "../../../../contexts/shared/infrastructure/mcp/McpPromptResponse";

@Service()
export class ListAllTestsPrompt implements McpPrompt {
	name = "utils-list_all_tests";
	title = "List all application tests";
	description = "Generate a prompt to list all application tests";
	inputSchema = {};

	async handler(): Promise<McpPromptResponse> {
		return McpPromptResponse.user(
			`
			List all tests and test case inside the /tests folder. The format should be:
			🧪 Test "describe" content
			  - ✅ Test case name
			  - …
			`.trim(),
		);
	}
}
