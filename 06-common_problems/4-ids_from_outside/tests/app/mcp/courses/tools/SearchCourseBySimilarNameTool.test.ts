import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { TestServerManager } from "../../../../utils/TestServerManager";

describe("SearchCourseBySimilarNameTool should", () => {
	const serverManager = new TestServerManager();
	const mcpClient = new McpClient("http", [serverManager.mcpUrl()]);
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeAll(async () => {
		await mcpClient.connect();
	});

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await mcpClient.disconnect();
		await connection.end();
	});

	it("list search course by similar name tool", async () => {
		const toolsResponse = await mcpClient.listTools();

		expect(toolsResponse.names()).toContain(
			"courses-search_by_similar_name",
		);
	});

	it("return error when course is not found", async () => {
		const nonExistingCourseName = CourseMother.create().name;

		const response = await mcpClient.callTool(
			"courses-search_by_similar_name",
			{
				name: nonExistingCourseName,
			},
		);

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: `There are no courses similar to ${nonExistingCourseName}`,
				},
			],
			structuredContent: undefined,
			isError: true,
		});
	});

	it("return existing course", async () => {
		const course = CourseMother.create();
		await courseRepository.save(course);

		const response = await mcpClient.callTool(
			"courses-search_by_similar_name",
			{
				name: course.name,
			},
		);

		const expectedData = course.toPrimitives();

		expect(response.toPrimitives()).toEqual({
			content: [
				expect.objectContaining({
					type: "text",
					text: JSON.stringify(expectedData),
				}),
			],
			structuredContent: expectedData,
			isError: false,
		});
	});
});
