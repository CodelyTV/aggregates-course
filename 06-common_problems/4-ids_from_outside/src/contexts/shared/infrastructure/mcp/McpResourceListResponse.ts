type Resource = {
	name: string;
	uri: string;
	title: string;
	description: string;
};

export class McpResourceListResponse {
	private constructor(readonly resources: Resource[]) {}

	static create(resources: Resource[]): McpResourceListResponse {
		return new McpResourceListResponse(resources);
	}
}
