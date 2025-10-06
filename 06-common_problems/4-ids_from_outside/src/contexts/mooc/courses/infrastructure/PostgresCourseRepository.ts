import { Primitives } from "@codelytv/primitives-type";
import { ISODateTime } from "@codelytv/primitives-type/src/Primitives";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Service } from "diod";

import { PostgresConnection } from "../../../shared/infrastructure/postgres/PostgresConnection";
import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { Course } from "../domain/Course";
import { CourseId } from "../domain/CourseId";
import { CourseRepository } from "../domain/CourseRepository";

type DatabaseCourseRow = {
	id: string;
	name: string;
	summary: string;
	categories: string[];
	published_at: Date;
};

@Service()
export class PostgresCourseRepository
	extends PostgresRepository<Course>
	implements CourseRepository
{
	private readonly embeddingsGenerator: OllamaEmbeddings;

	constructor(connection: PostgresConnection) {
		super(connection);

		this.embeddingsGenerator = new OllamaEmbeddings({
			model: "nomic-embed-text",
			baseUrl: "http://localhost:11434",
		});
	}

	async save(course: Course): Promise<void> {
		const userPrimitives = course.toPrimitives();
		const embedding =
			await this.generateCourseDocumentEmbedding(userPrimitives);

		await this.execute`
			INSERT INTO mooc.courses (id, name, summary, categories, published_at, embedding)
			VALUES (
				${userPrimitives.id},
				${userPrimitives.name},
				${userPrimitives.summary},
				${userPrimitives.categories},
				${userPrimitives.publishedAt},
				${embedding}
			)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				summary = EXCLUDED.summary,
				categories = EXCLUDED.categories,
				published_at = EXCLUDED.published_at,
				embedding = EXCLUDED.embedding;
		`;
	}

	async search(id: CourseId): Promise<Course | null> {
		return await this.searchOne`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			WHERE id = ${id.value};
		`;
	}

	async searchAll(): Promise<Course[]> {
		return await this.searchMany`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			ORDER BY published_at DESC;
		`;
	}

	async searchAllPaginated(lastCourseId: CourseId | null): Promise<Course[]> {
		if (lastCourseId) {
			const lastCourse = await this.search(lastCourseId);
			if (!lastCourse) {
				return [];
			}

			return await this.searchMany`
				SELECT id, name, summary, categories, published_at
				FROM mooc.courses
				WHERE published_at < ${lastCourse.publishedAt.toISOString()}
				ORDER BY published_at DESC
				LIMIT 10;
			`;
		}

		return await this.searchMany`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			ORDER BY published_at DESC
			LIMIT 10;
		`;
	}

	async searchByIds(ids: CourseId[]): Promise<Course[]> {
		const plainIds = ids.map((id) => id.value);

		return await this.searchMany`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			WHERE id = ANY(${plainIds}::text[]);
		`;
	}

	async searchSimilar(ids: CourseId[]): Promise<Course[]> {
		const coursesToSearchSimilar = await this.searchByIds(ids);

		if (coursesToSearchSimilar.length === 0) {
			return [];
		}

		const embeddings = await this.generateCoursesQueryEmbeddings(
			coursesToSearchSimilar.map((course) => course.toPrimitives()),
		);

		const plainIds = ids.map((id) => id.value);
		const recencyWeight = 0.0001;

		return await this.searchMany`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			WHERE id != ALL(${plainIds}::text[])
			ORDER BY
				(embedding <=> ${embeddings}) +
				${recencyWeight} * EXTRACT(EPOCH FROM NOW() - published_at) / 86400
			LIMIT 10;
		`;
	}

	async searchBySimilarName(name: string): Promise<Course | null> {
		const nameEmbedding = await this.embeddingsGenerator.embedQuery(
			`Name: ${name}`,
		);
		const nameEmbeddingStr = JSON.stringify(nameEmbedding);

		return await this.searchOne`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			ORDER BY embedding <=> ${nameEmbeddingStr}
			LIMIT 1;
		`;
	}

	protected toAggregate(row: DatabaseCourseRow): Course {
		return Course.fromPrimitives({
			id: row.id,
			name: row.name,
			summary: row.summary,
			categories: row.categories,
			publishedAt: row.published_at.toISOString() as ISODateTime,
		});
	}

	private async generateCourseDocumentEmbedding(
		course: Primitives<Course>,
	): Promise<string> {
		const [vectorEmbedding] = await this.embeddingsGenerator.embedDocuments(
			[this.serializeCourseForEmbedding(course)],
		);

		return JSON.stringify(vectorEmbedding);
	}

	private async generateCoursesQueryEmbeddings(
		courses: Primitives<Course>[],
	): Promise<string> {
		const vectorEmbedding = await this.embeddingsGenerator.embedQuery(
			courses
				.map((course) => this.serializeCourseForEmbedding(course))
				.join("\n"),
		);

		return JSON.stringify(vectorEmbedding);
	}

	private serializeCourseForEmbedding(course: Primitives<Course>): string {
		return [
			`Name: ${course.name}`,
			`Summary: ${course.summary}`,
			`Categories: ${course.categories.join(", ")}`,
		].join("|");
	}
}
