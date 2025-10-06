type ResourceError = {
	code: number;
	message: string;
	uri: string;
};

export class McpResourceErrorResponse {
	private constructor(readonly error: ResourceError) {}

	static notFound(message: string, uri: string): McpResourceErrorResponse {
		return new McpResourceErrorResponse({
			code: -32002, // Resource not found: https://modelcontextprotocol.io/specification/2025-06-18/server/resources#error-handling
			message,
			uri,
		});
	}

	static badRequest(message: string, uri: string): McpResourceErrorResponse {
		return new McpResourceErrorResponse({
			code: -32000, // Bad Request: https://github.com/modelcontextprotocol/typescript-sdk/tree/0551cc52b8920d7da46a4519b42f335a0a852b6c?tab=readme-ov-file#streamable-http
			message,
			uri,
		});
	}
}
