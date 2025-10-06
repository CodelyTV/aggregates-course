import { Service } from "diod";
import * as z from "zod/v3";

import { CourseSearcher } from "../../../../contexts/mooc/courses/application/search/CourseSearcher";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseByIdTool implements McpTool {
	name = "courses-search_by_id";
	title = "Search Course by id";
	description = "Search for a specific course by its id";
	inputSchema = { id: z.string() };

	constructor(private readonly searcher: CourseSearcher) {}

	async handler({ id }: { id: string }): Promise<McpToolResponse> {
		const course = await this.searcher.search(id);

		return course === null
			? McpToolResponse.error(`Course with id ${id} not found`)
			: McpToolResponse.structured(course);
	}
}
