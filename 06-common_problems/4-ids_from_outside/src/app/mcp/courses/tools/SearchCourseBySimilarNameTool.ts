import { Service } from "diod";
import * as z from "zod/v3";
import { util } from "zod/v3";

import {
	CourseBySimilarNameFinder,
	CourseBySimilarNameFinderErrors,
} from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { CourseBySimilarNameNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseBySimilarNameNotFoundError";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";
import assertNever = util.assertNever;

@Service()
export class SearchCourseBySimilarNameTool implements McpTool {
	name = "courses-search_by_similar_name";
	title = "Search Course by similar name";
	description = "Search for a specific course by its similar name";
	inputSchema = { name: z.string() };

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler({ name }: { name: string }): Promise<McpToolResponse> {
		const course = await this.finder.find(name);

		return McpToolResponse.structured(course);
	}

	onError(error: CourseBySimilarNameFinderErrors): McpToolResponse {
		switch (true) {
			case error instanceof CourseBySimilarNameNotFoundError:
				return McpToolResponse.error(
					`There are no courses similar to ${error.courseName}`,
				);
			default:
				assertNever(error);
		}
	}
}
