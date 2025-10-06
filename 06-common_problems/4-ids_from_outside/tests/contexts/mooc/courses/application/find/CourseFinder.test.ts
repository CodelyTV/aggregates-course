import { CourseFinder } from "../../../../../../src/contexts/mooc/courses/application/find/CourseFinder";
import { CourseNotFoundError } from "../../../../../../src/contexts/mooc/courses/domain/CourseNotFoundError";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

const repository = new MockCourseRepository();
const finder = new CourseFinder(repository);

describe("CourseFinder should", () => {
	it("find a course by id", async () => {
		const course = CourseMother.create();

		repository.shouldSearch(course);

		expect(await finder.find(course.id.value)).toStrictEqual(
			course.toPrimitives(),
		);
	});

	it("throw CourseNotFoundError when course is not found", async () => {
		const id = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(id);

		await expect(finder.find(id.value)).rejects.toThrow(
			new CourseNotFoundError(id.value),
		);
	});
});
