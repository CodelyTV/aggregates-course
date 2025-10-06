import { AllCoursesSearcher } from "../../../../../../src/contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

describe("AllCoursesSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new AllCoursesSearcher(repository);

	it("search all courses", async () => {
		const expectedCourses = [
			CourseMother.create(),
			CourseMother.create(),
			CourseMother.create(),
		];

		repository.shouldSearchAll(expectedCourses);

		expect(await searcher.search()).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("return empty array when no courses found", async () => {
		repository.shouldSearchAllAndReturnEmpty();

		expect(await searcher.search()).toEqual([]);
	});
});
