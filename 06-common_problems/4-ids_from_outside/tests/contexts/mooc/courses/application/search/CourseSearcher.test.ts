import { CourseSearcher } from "../../../../../../src/contexts/mooc/courses/application/search/CourseSearcher";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

const repository = new MockCourseRepository();
const searcher = new CourseSearcher(repository);

describe("CourseSearcher should", () => {
	it("return null when course is not found", async () => {
		const id = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(id);

		expect(await searcher.search(id.value)).toBeNull();
	});

	it("search a course by id", async () => {
		const course = CourseMother.create();

		repository.shouldSearch(course);

		expect(await searcher.search(course.id.value)).toStrictEqual(
			course.toPrimitives(),
		);
	});
});
