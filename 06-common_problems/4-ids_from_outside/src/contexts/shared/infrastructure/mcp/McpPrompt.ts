import { McpPromptResponse } from "./McpPromptResponse";

export interface McpPrompt {
	name: string;
	title: string;
	description: string;
	inputSchema?: Record<string, unknown>;

	handler(params?: Record<string, unknown>): Promise<McpPromptResponse>;
}
