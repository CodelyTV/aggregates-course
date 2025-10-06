import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { DateMother } from "../../users/domain/DateMother";

import { CourseIdMother } from "./CourseIdMother";

export class CourseMother {
	static create(params?: {
		id?: string;
		name?: string;
		summary?: string;
		categories?: string[];
		publishedAt?: Date;
	}): Course {
		const id = CourseIdMother.create(params?.id);
		const name = params?.name ?? faker.company.name();
		const summary = params?.summary ?? faker.lorem.paragraph();
		const categories = params?.categories ?? [
			faker.helpers.arrayElement([
				"frontend",
				"backend",
				"devops",
				"testing",
				"architecture",
				"ddd",
				"php",
				"javascript",
				"typescript",
			]),
			faker.helpers.arrayElement([
				"beginner",
				"intermediate",
				"advanced",
			]),
		];
		const publishedAt = params?.publishedAt ?? faker.date.past();

		return new Course(id, name, summary, categories, publishedAt);
	}

	static createList(count: number): Course[] {
		return Array.from({ length: count }, () => this.create());
	}

	static createdToday(params?: { id?: string }): Course {
		return this.create({
			...params,
			publishedAt: DateMother.today(),
		});
	}

	static createdYesterday(params?: { id?: string }): Course {
		return this.create({
			...params,
			publishedAt: DateMother.yesterday(),
		});
	}

	static codelyStyleCourses(): Course[] {
		return [
			this.create({
				name: "DDD en PHP",
				summary: "Aprende Domain-Driven Design aplicado con PHP",
				categories: ["ddd", "php", "architecture", "backend"],
			}),
			this.create({
				name: "Testing en frontend",
				summary: "Testing exhaustivo para aplicaciones frontend",
				categories: ["testing", "frontend", "javascript"],
			}),
			this.create({
				name: "Arquitectura Hexagonal",
				summary: "Implementa arquitectura hexagonal en tus proyectos",
				categories: ["architecture", "backend", "advanced"],
			}),
			this.create({
				name: "TypeScript Avanzado",
				summary: "Domina TypeScript y sus características avanzadas",
				categories: ["typescript", "frontend", "advanced"],
			}),
			this.create({
				name: "CQRS y Event Sourcing",
				summary: "Implementa CQRS y Event Sourcing en tus aplicaciones",
				categories: ["architecture", "backend", "advanced", "ddd"],
			}),
			this.create({
				name: "Docker y Kubernetes",
				summary: "Containerización y orquestación de aplicaciones",
				categories: ["devops", "docker", "kubernetes", "intermediate"],
			}),
			this.create({
				name: "Refactoring",
				summary: "Técnicas de refactoring para mejorar tu código",
				categories: ["backend", "frontend", "intermediate"],
			}),
		];
	}
}
