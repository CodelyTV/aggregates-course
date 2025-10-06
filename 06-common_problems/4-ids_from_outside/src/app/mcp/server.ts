/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CodelyError } from "../../contexts/shared/domain/CodelyError";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpPrompt } from "../../contexts/shared/infrastructure/mcp/McpPrompt";
import { McpResource } from "../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceTemplate } from "../../contexts/shared/infrastructure/mcp/McpResourceTemplate";
import { McpTool } from "../../contexts/shared/infrastructure/mcp/McpTool";

const server = new McpServer({
	name: "codely-mcp",
	version: "1.0.0",
	capabilities: {
		resources: true,
		tools: true,
		prompts: true,
	},
});

const tools = container
	.findTaggedServiceIdentifiers<McpTool>("mcp-tool")
	.map((identifier) => container.get(identifier));

tools.forEach((tool) => {
	server.registerTool(
		tool.name,
		{
			title: tool.title,
			description: tool.description,
			inputSchema: tool.inputSchema as any,
		},
		async (args?: Record<string, unknown>) => {
			try {
				const response = await tool.handler(args);

				return {
					content: response.content,
					structuredContent: response.structuredContent,
					isError: response.isError,
				};
			} catch (error) {
				if (tool.onError && error instanceof CodelyError) {
					const errorResponse = tool.onError(error);

					return {
						content: errorResponse.content,
						structuredContent: errorResponse.structuredContent,
						isError: errorResponse.isError,
					};
				}

				throw new Error("Internal server error");
			}
		},
	);
});

const resources = container
	.findTaggedServiceIdentifiers<McpResource>("mcp-resource")
	.map((identifier) => container.get(identifier));

resources.forEach((resource) => {
	server.registerResource(
		resource.name,
		resource.uriTemplate,
		{
			title: resource.title,
			description: resource.description,
		},
		async (_uri) => {
			const response = await resource.handler();

			return { contents: response.contents };
		},
	);
});

const resourceTemplates = container
	.findTaggedServiceIdentifiers<McpResourceTemplate>("mcp-resource_template")
	.map((identifier) => container.get(identifier));

resourceTemplates.forEach((resourceTemplate) => {
	server.registerResource(
		resourceTemplate.name,
		new ResourceTemplate(resourceTemplate.uriTemplate, {
			list: resourceTemplate.list
				? async () => {
						if (!resourceTemplate.list) {
							return { resources: [] };
						}

						const result = await resourceTemplate.list();

						return {
							resources: result.resources.map((response) => ({
								name: response.name,
								uri: response.uri,
								title: response.title,
								description: response.description,
							})),
						};
					}
				: undefined,
			complete: resourceTemplate.complete?.(),
		}),
		{
			title: resourceTemplate.title,
			description: resourceTemplate.description,
		},
		async (uri, params) => {
			try {
				const response = await resourceTemplate.handler(
					uri.href,
					params as Record<string, string>,
				);

				return { contents: response.contents };
			} catch (error) {
				if (resourceTemplate.onError && error instanceof CodelyError) {
					const errorResponse = resourceTemplate.onError(
						error,
						uri.href,
					);

					throw generateMcpError(
						errorResponse.error.message,
						errorResponse.error.code,
						errorResponse.error.uri,
					);
				}

				throw new Error("Internal server error");
			}
		},
	);
});

const prompts = container
	.findTaggedServiceIdentifiers<McpPrompt>("mcp-prompt")
	.map((identifier) => container.get(identifier));

prompts.forEach((prompt) => {
	server.registerPrompt(
		prompt.name,
		{
			title: prompt.title,
			description: prompt.description,
			argsSchema: prompt.inputSchema as any,
		},
		async (params?: Record<string, unknown>) => {
			const response = await prompt.handler(params);

			return {
				messages: response.messages,
				description: response.description,
			};
		},
	);
});

function generateMcpError(message: string, code: number, uri: string): Error {
	const error = new Error(message);
	(error as any).code = code;
	(error as any).data = { uri };

	return error;
}

async function main() {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
