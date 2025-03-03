/* eslint-disable no-console */
import { Service } from "diod";

import { CourseId } from "../../../mooc/courses/domain/CourseId";
import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { ShopCourse } from "../domain/ShopCourse";
import { ShopCourseRepository } from "../domain/ShopCourseRepository";

type DatabaseShopCourseRow = {
	id: string;
	name: string;
	summary: string;
	categories: string[];
	published_at: Date;
};

@Service()
export class PostgresShopCourseRepository
	extends PostgresRepository<ShopCourse>
	implements ShopCourseRepository
{
	async save(course: ShopCourse): Promise<void> {
		const userPrimitives = course.toPrimitives();

		await this.execute`
			INSERT INTO shop.courses (id, name, summary, categories, published_at)
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

	async search(id: CourseId): Promise<ShopCourse | null> {
		return await this.searchOne`
			SELECT id, name, summary, categories, published_at
			FROM mooc.courses
			WHERE id = ${id.value};
		`;
	}

	async delete(id: CourseId): Promise<void> {
		await this.execute`DELETE FROM shop.courses WHERE id = ${id.value};`;
	}

	protected toAggregate(row: DatabaseShopCourseRow): ShopCourse {
		return ShopCourse.fromPrimitives({
			aggregateId: row.id,
			aggregateName: ShopCourse.aggregateName,
			id: row.id,
			name: row.name,
			summary: row.summary,
			categories: row.categories,
			publishedAt: row.published_at.getTime(),
		});
	}
}
