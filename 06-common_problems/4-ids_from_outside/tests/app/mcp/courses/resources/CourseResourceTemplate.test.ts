import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseIdMother } from "../../../../contexts/mooc/courses/domain/CourseIdMother";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { TestServerManager } from "../../../../utils/TestServerManager";

describe("CourseResourceTemplate should", () => {
	const serverManager = new TestServerManager();
	const mcpClient = new McpClient("http", [serverManager.mcpUrl()]);
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeAll(async () => {
		await serverManager.start();
		await mcpClient.connect();
	});

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await mcpClient.disconnect();
		await serverManager.stop();
		await connection.end();
	});

	it("be listed as an available resource template", async () => {
		const resourceTemplates = await mcpClient.listResourceTemplates();

		expect(resourceTemplates.uris()).toContain("courses://{id}");
	});

	it("return bad request error when course id is invalid", async () => {
		const invalidId = CourseIdMother.invalid();

		await expect(
			mcpClient.readResource(`courses://${invalidId}`),
		).rejects.toThrow(
			`MCP error -32000: The id <${invalidId}> is not a valid nano id`,
		);
	});

	it("return not found error when course is not found", async () => {
		const nonExistingCourseId = CourseIdMother.create().value;

		await expect(
			mcpClient.readResource(`courses://${nonExistingCourseId}`),
		).rejects.toThrow(
			`MCP error -32002: The course <${nonExistingCourseId}> has not been found`,
		);
	});

	it("return course details when course exists", async () => {
		const course = CourseMother.create();

		await courseRepository.save(course);

		const response = await mcpClient.readResource(
			`courses://${course.id.value}`,
		);

		expect(response.toPrimitives()).toEqual({
			contents: [
				{
					uri: `courses://${course.id.value}`,
					mimeType: "application/json",
					text: JSON.stringify(course.toPrimitives()),
				},
			],
		});
	});

	it("list all available courses as resources", async () => {
		const course = CourseMother.create();
		const anotherCourse = CourseMother.create();

		await courseRepository.save(course);
		await courseRepository.save(anotherCourse);

		const response = await mcpClient.listResources();

		expect(response.uris()).toEqual(
			expect.arrayContaining([
				`course://${course.id.value}`,
				`course://${anotherCourse.id.value}`,
			]),
		);
	});

	it("complete the id param", async () => {
		const testCourse = CourseMother.createdToday({ id: "t3st" });
		const teatCourse = CourseMother.createdYesterday({ id: "t3at" });
		const codeCourse = CourseMother.create({ id: "c0d3" });

		await courseRepository.save(testCourse);
		await courseRepository.save(teatCourse);
		await courseRepository.save(codeCourse);

		const response = await mcpClient.completeResourceTemplateParam(
			"courses://{id}",
			"id",
			"t3",
		);

		expect(response).toEqual(["t3st", "t3at"]);
	});
});
