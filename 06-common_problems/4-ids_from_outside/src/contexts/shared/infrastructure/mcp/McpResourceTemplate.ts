import { CodelyError } from "../../domain/CodelyError";

import { UriScheme } from "./McpResource";
import { McpResourceErrorResponse } from "./McpResourceErrorResponse";
import { McpResourceListResponse } from "./McpResourceListResponse";
import { McpResourceResponse } from "./McpResourceResponse";

export type McpResourceTemplateCompleteResponse = Record<
	string,
	(value: string) => Promise<string[]>
>;

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: `${UriScheme}://${string}{${string}}${string}`;

	handler(
		uri: string,
		params: Record<string, string>,
	): Promise<McpResourceResponse>;

	onError?(error: CodelyError, uri: string): McpResourceErrorResponse;

	list?(): Promise<McpResourceListResponse>;

	complete?(): McpResourceTemplateCompleteResponse;
}
