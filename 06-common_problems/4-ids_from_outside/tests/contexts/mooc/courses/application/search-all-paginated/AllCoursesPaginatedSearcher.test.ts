import { AllCoursesPaginatedSearcher } from "../../../../../../src/contexts/mooc/courses/application/search-all-paginated/AllCoursesPaginatedSearcher";
import { InvalidBase64Error } from "../../../../../../src/contexts/shared/domain/InvalidBase64Error";
import { InvalidNanoIdError } from "../../../../../../src/contexts/shared/domain/InvalidNanoIdError";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

describe("AllCoursesPaginatedSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new AllCoursesPaginatedSearcher(repository);

	it("search all courses without pagination", async () => {
		const expectedCourses = [CourseMother.create(), CourseMother.create()];

		repository.shouldSearchAllPaginated(expectedCourses);

		expect(await searcher.search(null)).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("search courses with pagination using base64 encoded cursor", async () => {
		const lastCourseId = CourseIdMother.create();
		const cursor = Buffer.from(lastCourseId.value).toString("base64");
		const expectedCourses = [CourseMother.create(), CourseMother.create()];

		repository.shouldSearchAllPaginated(expectedCourses, lastCourseId);

		expect(await searcher.search(cursor)).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("return empty array when no courses found", async () => {
		repository.shouldSearchAllPaginatedAndReturnEmpty();

		expect(await searcher.search(null)).toEqual([]);
	});

	it("return empty array when no more courses found with pagination", async () => {
		const lastCourseId = CourseIdMother.create();
		const cursor = Buffer.from(lastCourseId.value).toString("base64");

		repository.shouldSearchAllPaginatedAndReturnEmpty(lastCourseId);

		expect(await searcher.search(cursor)).toEqual([]);
	});

	it("throw InvalidCourseCursorError when cursor is not valid base64", async () => {
		const invalidCursor = "invalid-base64!@#$%";

		await expect(searcher.search(invalidCursor)).rejects.toThrow(
			new InvalidBase64Error(invalidCursor),
		);
	});

	it("throw InvalidNanoIdError when cursor decodes to invalid nanoid", async () => {
		const invalidCursorNanoId =
			Buffer.from("invalid-nano-id").toString("base64");

		await expect(searcher.search(invalidCursorNanoId)).rejects.toThrow(
			new InvalidNanoIdError(invalidCursorNanoId),
		);
	});
});
