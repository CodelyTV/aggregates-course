import "reflect-metadata";

import { testApiHandler } from "next-test-api-route-handler";

import * as handler from "../../../../../src/app/api/mooc/courses/route";
import { PostgresCourseRepository } from "../../../../../src/contexts/mooc/courses/infrastructure/PostgresCourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";

const connection = container.get(PostgresConnection);
const repository = container.get(PostgresCourseRepository);

describe("/api/mooc/courses should", () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("return empty when no courses exist", async () => {
		await testApiHandler({
			appHandler: handler,
			test: async ({ fetch }) => {
				const response = await fetch({ method: "GET" });

				expect(response.status).toBe(200);
				expect(await response.json()).toEqual([]);
			},
		});
	});

	it("return all courses", async () => {
		const courses = [
			CourseMother.create({
				publishedAt: new Date("2023-02-01"),
			}),
			CourseMother.create({
				publishedAt: new Date("2023-01-01"),
			}),
		];

		await Promise.all(courses.map((course) => repository.save(course)));

		await testApiHandler({
			appHandler: handler,
			test: async ({ fetch }) => {
				const response = await fetch({ method: "GET" });

				expect(response.status).toBe(200);
				expect(await response.json()).toEqual(
					courses.map((course) => course.toPrimitives()),
				);
			},
		});
	});

	it("return courses ordered by published date descending", async () => {
		const oldCourse = CourseMother.create({
			name: "Old Course",
			publishedAt: new Date("2023-01-01"),
		});
		const recentCourse = CourseMother.create({
			name: "Recent Course",
			publishedAt: new Date("2024-01-01"),
		});

		await repository.save(oldCourse);
		await repository.save(recentCourse);

		await testApiHandler({
			appHandler: handler,
			test: async ({ fetch }) => {
				const response = await fetch({ method: "GET" });
				const data = await response.json();

				expect(response.status).toBe(200);
				expect(data).toHaveLength(2);
				expect(data[0].name).toBe("Recent Course");
				expect(data[1].name).toBe("Old Course");
			},
		});
	});
});
