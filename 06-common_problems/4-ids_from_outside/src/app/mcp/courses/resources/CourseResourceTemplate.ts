import { Service } from "diod";

import {
	CourseByIdFinderErrors,
	CourseFinder,
} from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { assertNever } from "../../../../contexts/shared/domain/assertNever";
import { InvalidNanoIdError } from "../../../../contexts/shared/domain/InvalidNanoIdError";
import { McpResourceErrorResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceErrorResponse";
import { McpResourceListResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceListResponse";
import { McpResourceResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceResponse";
import {
	McpResourceTemplate,
	McpResourceTemplateCompleteResponse,
} from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

@Service()
export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by id";
	uriTemplate = "courses://{id}" as const;

	constructor(
		private readonly finder: CourseFinder,
		private readonly allCoursesSearcher: AllCoursesSearcher,
	) {}

	async handler(
		uri: string,
		params: { id: string },
	): Promise<McpResourceResponse> {
		const course = await this.finder.find(params.id);

		return McpResourceResponse.success(uri, course);
	}

	onError(
		error: CourseByIdFinderErrors,
		uri: string,
	): McpResourceErrorResponse {
		switch (true) {
			case error instanceof CourseNotFoundError:
				return McpResourceErrorResponse.notFound(
					`The course <${error.id}> has not been found`,
					uri,
				);
			case error instanceof InvalidNanoIdError:
				return McpResourceErrorResponse.badRequest(
					`The id <${error.id}> is not a valid nano id`,
					uri,
				);
			default:
				assertNever(error);
		}
	}

	async list(): Promise<McpResourceListResponse> {
		const courses = await this.allCoursesSearcher.search();

		return McpResourceListResponse.create(
			courses.map((course) => ({
				name: course.id,
				uri: `course://${course.id}`,
				title: course.name,
				description: course.summary,
			})),
		);
	}

	complete(): McpResourceTemplateCompleteResponse {
		return {
			id: async (value: string): Promise<string[]> => {
				const courses = await this.allCoursesSearcher.search();
				const courseIds = courses.map((course) => course.id);

				if (!value) {
					return courseIds;
				}

				return courseIds.filter((id) =>
					id.toLowerCase().includes(value.toLowerCase()),
				);
			},
		};
	}
}
