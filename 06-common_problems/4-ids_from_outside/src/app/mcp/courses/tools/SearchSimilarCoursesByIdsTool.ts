import { Service } from "diod";
import * as z from "zod/v3";

import { SimilarCoursesByIdsSearcher } from "../../../../contexts/mooc/courses/application/search-similar-by-ids/SimilarCoursesByIdsSearcher";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchSimilarCoursesByIdsTool implements McpTool {
	name = "courses-search_similar_by_ids";
	title = "Search Similar Courses by IDs";
	description =
		"Search for courses similar to the ones with the provided IDs";

	inputSchema = {
		ids: z.array(z.string()).min(1, "At least one id is required"),
	};

	constructor(private readonly searcher: SimilarCoursesByIdsSearcher) {}

	async handler({ ids }: { ids: string[] }): Promise<McpToolResponse> {
		const courses = await this.searcher.search(ids);

		return McpToolResponse.structured({
			courses,
			total: courses.length,
			searchedIds: ids,
		});
	}
}
