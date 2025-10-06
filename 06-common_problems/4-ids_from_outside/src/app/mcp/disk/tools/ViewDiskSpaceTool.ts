import { Service } from "diod";
import { execSync } from "node:child_process";

import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class ViewDiskSpaceTool implements McpTool {
	readonly name = "disk-view_space";
	readonly title = "View disk space";
	readonly description = "View the disk space in G";
	readonly inputSchema = {};

	async handler(): Promise<McpToolResponse> {
		const stdout = execSync("df -h / | /usr/bin/awk 'NR==2 {print $4}'", {
			encoding: "utf8",
		});

		return McpToolResponse.text(`Available disk space: ${stdout.trim()}`);
	}
}
