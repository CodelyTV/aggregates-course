export type McpPromptMessage = {
	role: "user" | "assistant";
	content: {
		type: "text";
		text: string;
	};
};

export class McpPromptResponse {
	private constructor(
		readonly messages: McpPromptMessage[],
		readonly description?: string,
	) {}

	static user(text: string, description?: string): McpPromptResponse {
		return new McpPromptResponse(
			[{ role: "user", content: { type: "text", text } }],
			description,
		);
	}

	static replicateWithAssistant(
		text: string,
		description?: string,
	): McpPromptResponse {
		return new McpPromptResponse(
			[
				{ role: "assistant", content: { type: "text", text } },
				{ role: "user", content: { type: "text", text } },
			],
			description,
		);
	}
}
