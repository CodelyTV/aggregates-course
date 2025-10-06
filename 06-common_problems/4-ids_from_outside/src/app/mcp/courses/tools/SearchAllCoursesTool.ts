import { Service } from "diod";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchAllCoursesTool implements McpTool {
	name = "courses-search_all";
	title = "List All Courses";
	description = "Returns a complete list of all available courses";
	inputSchema = {};

	constructor(private readonly searcher: AllCoursesSearcher) {}

	async handler(): Promise<McpToolResponse> {
		const courses = await this.searcher.search();

		return McpToolResponse.structured({
			courses,
			total: courses.length,
		});
	}
}
