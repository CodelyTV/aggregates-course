import { McpResourceResponse } from "./McpResourceResponse";

export type UriScheme = Lowercase<string>;

export interface McpResource {
	name: string;
	title: string;
	description: string;
	uriTemplate: `${UriScheme}://${string}`;

	handler(): Promise<McpResourceResponse>;
}
