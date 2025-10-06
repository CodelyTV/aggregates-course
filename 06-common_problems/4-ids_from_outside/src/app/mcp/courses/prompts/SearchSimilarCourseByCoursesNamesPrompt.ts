import { Service } from "diod";
import * as z from "zod/v3";

import { CourseBySimilarNameFinder } from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";
import { McpPromptResponse } from "../../../../contexts/shared/infrastructure/mcp/McpPromptResponse";

@Service()
export class SearchSimilarCourseByCoursesNamesPrompt implements McpPrompt {
	name = "courses-search_similar_by_names";
	title = "Buscar Cursos con Nombres Similares";
	description =
		"Genera un prompt para buscar un curso similar a los cursos enviados";

	inputSchema = {
		names: z.string(),
	};

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler({ names }: { names: string }): Promise<McpPromptResponse> {
		const coursesPromises = names
			.split(",")
			.map((name) => name.trim())
			.map((name) => this.finder.find(name));

		const courses = await Promise.all(coursesPromises);

		return McpPromptResponse.user(
			`Buscar cursos similares usando la herramienta courses-search_similar_by_ids a estos ids: ${courses
				.map((course) => course.id)
				.join(", ")}`.trim(),
			`Buscar cursos similares a ${courses.length} curso(s) encontrado(s)`,
		);
	}
}
