/* eslint-disable no-console */
import { Service } from "diod";

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
	async save(course: Course): Promise<void> {
		const userPrimitives = course.toPrimitives();

		await this.execute`
			INSERT INTO mooc.courses (id, name, summary, categories, published_at)
			VALUES (
					   ${userPrimitives.id},
					   ${userPrimitives.name},
					   ${userPrimitives.summary},
					   ${userPrimitives.categories},
					   ${new Date(userPrimitives.publishedAt)}
				   )
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				summary = EXCLUDED.summary,
				categories = EXCLUDED.categories,
				published_at = EXCLUDED.published_at;
		`;
	}

	async search(id: CourseId): Promise<Course | null> {
		return await this.searchOne`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			WHERE id = ${id.value};
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

	async delete(id: CourseId): Promise<void> {
		await this.execute`DELETE FROM mooc.courses WHERE id = ${id.value};`;
	}

	protected toAggregate(row: DatabaseCourseRow): Course {
		return Course.fromPrimitives({
			aggregateId: row.id,
			aggregateName: Course.aggregateName,
			id: row.id,
			name: row.name,
			summary: row.summary,
			categories: row.categories,
			publishedAt: row.published_at.getTime(),
		});
	}
}
