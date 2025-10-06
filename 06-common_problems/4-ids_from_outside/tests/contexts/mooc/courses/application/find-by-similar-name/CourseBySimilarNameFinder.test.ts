import { CourseBySimilarNameFinder } from "../../../../../../src/contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { CourseBySimilarNameNotFoundError } from "../../../../../../src/contexts/mooc/courses/domain/CourseBySimilarNameNotFoundError";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

const repository = new MockCourseRepository();
const finder = new CourseBySimilarNameFinder(repository);

describe("CourseBySimilarNameFinder should", () => {
	it("find a course by similar name", async () => {
		const course = CourseMother.create({ name: "React Fundamentals" });
		const searchName = "React development";

		repository.shouldSearchBySimilarName(searchName, course);

		const result = await finder.find(searchName);

		expect(result).toStrictEqual(course.toPrimitives());
	});

	it("throw CourseBySimilarNameNotFoundError when course is not found", async () => {
		const searchName = "Non-existing course";

		repository.shouldSearchBySimilarNameAndReturnNull(searchName);

		await expect(finder.find(searchName)).rejects.toThrow(
			new CourseBySimilarNameNotFoundError(searchName),
		);
	});
});
