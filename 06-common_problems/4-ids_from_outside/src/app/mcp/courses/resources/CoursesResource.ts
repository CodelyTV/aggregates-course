import { Service } from "diod";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { McpResource } from "../../../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceResponse";

@Service()
export class CoursesResource implements McpResource {
	name = "courses";
	title = "All Courses";
	description = "Complete list of all available courses";
	uriTemplate = "courses://all" as const;

	constructor(private readonly searcher: AllCoursesSearcher) {}

	async handler(): Promise<McpResourceResponse> {
		const courses = await this.searcher.search();

		return McpResourceResponse.success(this.uriTemplate, courses);
	}
}
