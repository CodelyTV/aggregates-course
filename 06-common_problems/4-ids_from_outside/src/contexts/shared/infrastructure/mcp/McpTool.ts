import { CodelyError } from "../../domain/CodelyError";

import { McpToolResponse } from "./McpToolResponse";

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: unknown;

	handler(params?: Record<string, unknown>): Promise<McpToolResponse>;

	onError?(error: CodelyError): McpToolResponse;
}
