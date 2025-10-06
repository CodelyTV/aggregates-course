type ToolContent = {
	type: "text";
	text: string;
};

export class McpToolResponse {
	private constructor(
		readonly content: ToolContent[],
		readonly structuredContent?: Record<string, string | number | object>,
		readonly isError?: boolean,
	) {}

	static text(text: string): McpToolResponse {
		return new McpToolResponse([{ type: "text", text }], undefined, false);
	}

	static structured(
		data: Record<string, string | number | object>,
	): McpToolResponse {
		const text = JSON.stringify(data);

		return new McpToolResponse([{ type: "text", text }], data, false);
	}

	static error(message: string): McpToolResponse {
		return new McpToolResponse(
			[{ type: "text", text: `${message}` }],
			undefined,
			true,
		);
	}
}
