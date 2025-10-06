type ResourceContent = {
	uri: string;
	mimeType?: string;
	text: string;
};

export class McpResourceResponse {
	private constructor(readonly contents: ResourceContent[]) {}

	static success(uri: string, data: unknown): McpResourceResponse {
		return new McpResourceResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(data),
			},
		]);
	}
}
