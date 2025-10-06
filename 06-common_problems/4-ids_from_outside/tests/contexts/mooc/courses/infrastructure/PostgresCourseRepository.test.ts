import "reflect-metadata";

import { PostgresCourseRepository } from "../../../../../src/contexts/mooc/courses/infrastructure/PostgresCourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseIdMother } from "../domain/CourseIdMother";
import { CourseMother } from "../domain/CourseMother";

const connection = container.get(PostgresConnection);
const repository = container.get(PostgresCourseRepository);

describe("PostgresCourseRepository should", () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("save a course", async () => {
		const course = CourseMother.create();

		await repository.save(course);
	});

	it("return null searching a non existing course", async () => {
		const courseId = CourseIdMother.create();

		expect(await repository.search(courseId)).toBeNull();
	});

	it("return an existing course", async () => {
		const course = CourseMother.create();

		await repository.save(course);

		expect(await repository.search(course.id)).toStrictEqual(course);
	});

	it("update an existing course when saving with the same id", async () => {
		const courseId = CourseIdMother.create();
		const originalCourse = CourseMother.create({ id: courseId.value });
		const updatedCourse = CourseMother.create({
			id: courseId.value,
			name: "Updated Course Name",
			summary: "Updated summary",
		});

		await repository.save(originalCourse);
		await repository.save(updatedCourse);

		const searchedCourse = await repository.search(courseId);

		expect(searchedCourse).toStrictEqual(updatedCourse);
	});

	describe("searchAll", () => {
		it("return empty array when no courses exist", async () => {
			const courses = await repository.searchAll();

			expect(courses).toHaveLength(0);
		});

		it("return all courses ordered by published date descending", async () => {
			const oldCourse = CourseMother.create({
				publishedAt: new Date("2023-01-01"),
			});
			const recentCourse = CourseMother.create({
				publishedAt: new Date("2024-01-01"),
			});
			const middleCourse = CourseMother.create({
				publishedAt: new Date("2023-06-01"),
			});

			await repository.save(oldCourse);
			await repository.save(recentCourse);
			await repository.save(middleCourse);

			const courses = await repository.searchAll();

			expect(courses).toHaveLength(3);
			expect(courses[0]).toStrictEqual(recentCourse);
			expect(courses[1]).toStrictEqual(middleCourse);
			expect(courses[2]).toStrictEqual(oldCourse);
		});

		it("return all courses without pagination limit", async () => {
			const courses = CourseMother.createList(20);

			await Promise.all(courses.map((course) => repository.save(course)));

			const result = await repository.searchAll();

			expect(result).toHaveLength(20);
		});
	});

	describe("searchAllPaginated", () => {
		it("return empty array when no courses exist", async () => {
			const courses = await repository.searchAllPaginated(null);

			expect(courses).toHaveLength(0);
		});

		it("return all courses ordered by published date descending when no lastCourseId provided", async () => {
			const oldCourse = CourseMother.create({
				publishedAt: new Date("2023-01-01"),
			});
			const recentCourse = CourseMother.create({
				publishedAt: new Date("2024-01-01"),
			});
			const middleCourse = CourseMother.create({
				publishedAt: new Date("2023-06-01"),
			});

			await repository.save(oldCourse);
			await repository.save(recentCourse);
			await repository.save(middleCourse);

			const courses = await repository.searchAllPaginated(null);

			expect(courses).toHaveLength(3);
			expect(courses[0]).toStrictEqual(recentCourse);
			expect(courses[1]).toStrictEqual(middleCourse);
			expect(courses[2]).toStrictEqual(oldCourse);
		});

		it("return courses published before the last course when lastCourseId is provided", async () => {
			const course1 = CourseMother.create({
				publishedAt: new Date("2024-01-01"),
			});
			const course2 = CourseMother.create({
				publishedAt: new Date("2023-06-01"),
			});
			const course3 = CourseMother.create({
				publishedAt: new Date("2023-01-01"),
			});

			await repository.save(course1);
			await repository.save(course2);
			await repository.save(course3);

			const courses = await repository.searchAllPaginated(course1.id);

			expect(courses).toHaveLength(2);
			expect(courses[0]).toStrictEqual(course2);
			expect(courses[1]).toStrictEqual(course3);
		});

		it("return empty array when lastCourseId does not exist", async () => {
			const nonExistingId = CourseIdMother.create();

			expect(
				await repository.searchAllPaginated(nonExistingId),
			).toHaveLength(0);
		});

		it("limit results to 10 courses", async () => {
			const courses = CourseMother.createList(15);

			await Promise.all(courses.map((course) => repository.save(course)));

			expect(await repository.searchAllPaginated(null)).toHaveLength(10);
		});
	});

	describe("searchByIds", () => {
		it("return empty array when searching with empty ids array", async () => {
			const courses = await repository.searchByIds([]);

			expect(courses).toHaveLength(0);
		});

		it("return empty array when searching for non-existing ids", async () => {
			const nonExistingIds = [
				CourseIdMother.create(),
				CourseIdMother.create(),
			];

			const courses = await repository.searchByIds(nonExistingIds);

			expect(courses).toHaveLength(0);
		});

		it("return only existing courses when searching by ids", async () => {
			const course1 = CourseMother.create();
			const course2 = CourseMother.create();
			const course3 = CourseMother.create();

			await repository.save(course1);
			await repository.save(course2);
			await repository.save(course3);

			const courses = await repository.searchByIds([
				course1.id,
				course3.id,
			]);

			expect(courses).toHaveLength(2);
			expect(courses).toContainEqual(course1);
			expect(courses).toContainEqual(course3);
		});

		it("return courses even if some ids don't exist", async () => {
			const existingCourse = CourseMother.create();
			const nonExistingId = CourseIdMother.create();

			await repository.save(existingCourse);

			const courses = await repository.searchByIds([
				existingCourse.id,
				nonExistingId,
			]);

			expect(courses).toHaveLength(1);
			expect(courses[0]).toStrictEqual(existingCourse);
		});
	});

	describe("searchSimilar", () => {
		it("return empty array when searching similar to non-existing courses", async () => {
			const nonExistingId = CourseIdMother.create();

			const courses = await repository.searchSimilar([nonExistingId]);

			expect(courses).toHaveLength(0);
		});

		it("return similar courses excluding the input courses", async () => {
			const dddCourse = CourseMother.create({
				name: "DDD en PHP",
				summary: "Aprende Domain-Driven Design con PHP",
				categories: ["ddd", "php", "architecture"],
			});
			const architectureCourse = CourseMother.create({
				name: "Arquitectura Hexagonal",
				summary: "Implementa arquitectura hexagonal",
				categories: ["architecture", "backend"],
			});
			const frontendCourse = CourseMother.create({
				name: "React Avanzado",
				summary: "Desarrollo frontend con React",
				categories: ["frontend", "javascript"],
			});

			await repository.save(dddCourse);
			await repository.save(architectureCourse);
			await repository.save(frontendCourse);

			const similarCourses = await repository.searchSimilar([
				dddCourse.id,
			]);

			expect(similarCourses.length).toBeGreaterThan(0);
			expect(similarCourses).not.toContainEqual(dddCourse);
		});

		it("return empty array when only the searched course exists", async () => {
			const course = CourseMother.create();

			await repository.save(course);

			const similarCourses = await repository.searchSimilar([course.id]);

			expect(similarCourses).toHaveLength(0);
		});

		it("limit similar courses to 10 results", async () => {
			const baseCourse = CourseMother.create({
				categories: ["backend", "php"],
			});

			await repository.save(baseCourse);

			const existingCourses = Array.from({ length: 15 }, () =>
				CourseMother.create({
					categories: ["backend", "php"],
				}),
			);
			await Promise.all(
				existingCourses.map((course) => repository.save(course)),
			);

			const similarCourses = await repository.searchSimilar([
				baseCourse.id,
			]);

			expect(similarCourses).toHaveLength(10);
		});

		it("find similar courses based on multiple input courses", async () => {
			const phpCourse = CourseMother.create({
				name: "PHP Básico",
				categories: ["php", "backend"],
			});
			const dddCourse = CourseMother.create({
				name: "DDD Avanzado",
				categories: ["ddd", "architecture"],
			});
			const phpDddCourse = CourseMother.create({
				name: "DDD con PHP",
				categories: ["php", "ddd", "backend"],
			});

			await repository.save(phpCourse);
			await repository.save(dddCourse);
			await repository.save(phpDddCourse);

			const similarCourses = await repository.searchSimilar([
				phpCourse.id,
				dddCourse.id,
			]);

			expect(similarCourses.length).toBeGreaterThan(0);
			expect(similarCourses).not.toContainEqual(phpCourse);
			expect(similarCourses).not.toContainEqual(dddCourse);
		});
	});

	describe("searchBySimilarName", () => {
		it("return null when no courses exist", async () => {
			const searchName = "JavaScript";

			const result = await repository.searchBySimilarName(searchName);

			expect(result).toBeNull();
		});

		it("return course with most similar name using embeddings", async () => {
			const reactCourse = CourseMother.create({
				name: "React Fundamentals",
				summary: "Learn React basics",
				categories: ["frontend", "javascript"],
			});
			const vueCourse = CourseMother.create({
				name: "Vue.js Complete Guide",
				summary: "Master Vue.js",
				categories: ["frontend", "javascript"],
			});
			const pythonCourse = CourseMother.create({
				name: "Python for Beginners",
				summary: "Learn Python programming",
				categories: ["backend", "python"],
			});

			await repository.save(reactCourse);
			await repository.save(vueCourse);
			await repository.save(pythonCourse);

			const foundCourse =
				await repository.searchBySimilarName("React development");

			expect(foundCourse).toStrictEqual(reactCourse);
		});

		it("return most similar course when multiple exist", async () => {
			const nodeCourse = CourseMother.create({
				name: "Node.js Backend Development",
				summary: "Build APIs with Node.js",
				categories: ["backend", "javascript"],
			});
			const expressCourse = CourseMother.create({
				name: "Express.js Framework",
				summary: "Web framework for Node.js",
				categories: ["backend", "javascript"],
			});
			const reactCourse = CourseMother.create({
				name: "React Frontend",
				summary: "Frontend with React",
				categories: ["frontend", "javascript"],
			});

			await repository.save(nodeCourse);
			await repository.save(expressCourse);
			await repository.save(reactCourse);

			const foundCourse =
				await repository.searchBySimilarName("Node backend");

			expect(foundCourse).toStrictEqual(nodeCourse);
		});
	});
});
