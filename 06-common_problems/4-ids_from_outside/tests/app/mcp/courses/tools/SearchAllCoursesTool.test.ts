import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { TestServerManager } from "../../../../utils/TestServerManager";

describe("SearchAllCoursesTool should", () => {
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

	it("list search all courses tool", async () => {
		const tools = await mcpClient.listTools();

		expect(tools.names()).toContain("courses-search_all");
	});

	it("return empty when there are no courses", async () => {
		const response = await mcpClient.callTool("courses-search_all");

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify({
						courses: [],
						total: 0,
					}),
				},
			],
			structuredContent: {
				courses: [],
				total: 0,
			},
			isError: false,
		});
	});

	it("return existing courses", async () => {
		const courses = [
			CourseMother.createdToday(),
			CourseMother.createdYesterday(),
		];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.callTool("courses-search_all");

		const expectedData = {
			courses: courses.map((course) => course.toPrimitives()),
			total: 2,
		};

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
			isError: false,
		});
	});
});
