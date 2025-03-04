import { CourseSearcher } from "../../../../../../src/contexts/mooc/courses/application/search/CourseSearcher";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new CourseSearcher(repository);

	it("return null searching a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		expect(await searcher.search(nonExistingCourseId.value)).toBeNull();
	});

	it("return an existing course", async () => {
		const expectedCourse = CourseMother.create();
		const coursePrimitives = expectedCourse.toPrimitives();

		repository.shouldSearch(expectedCourse);

		expect(await searcher.search(coursePrimitives.id)).toEqual(
			coursePrimitives,
		);
	});
});
