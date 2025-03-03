import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

import { CourseCategory } from "./CourseCategory";
import { CourseCategoryAddedDomainEvent } from "./CourseCategoryAddedDomainEvent";
import { CourseCategoryRemovedDomainEvent } from "./CourseCategoryRemovedDomainEvent";
import { CourseCreatedDomainEvent } from "./CourseCreatedDomainEvent";
import { CourseDeletedDomainEvent } from "./CourseDeletedDomainEvent";
import { CourseId } from "./CourseId";
import { CourseName } from "./CourseName";
import { CourseRenamedDomainEvent } from "./CourseRenamedDomainEvent";
import { CourseResummarizedDomainEvent } from "./CourseResummarizedDomainEvent";
import { CourseSummary } from "./CourseSummary";

export class Course extends AggregateRoot {
	constructor(
		public readonly id: CourseId,
		public name: CourseName,
		public summary: CourseSummary,
		public categories: CourseCategory[],
	) {
		super();
	}

	static fromPrimitives(primitives: Primitives<Course>): Course {
		return new Course(
			new CourseId(primitives.id),
			new CourseName(primitives.name),
			new CourseSummary(primitives.summary),
			primitives.categories.map(
				(category) => new CourseCategory(category),
			),
		);
	}

	static create(
		id: string,
		name: string,
		summary: string,
		categories: string[],
	): Course {
		const course = Course.fromPrimitives({ id, name, summary, categories });

		course.record(
			new CourseCreatedDomainEvent(id, name, summary, categories),
		);

		return course;
	}

	rename(newName: string): void {
		this.name = new CourseName(newName);

		this.record(new CourseRenamedDomainEvent(this.id.value, newName));
	}

	resummarize(newSummary: string): void {
		this.summary = new CourseSummary(newSummary);

		this.record(
			new CourseResummarizedDomainEvent(this.id.value, newSummary),
		);
	}

	hasCategory(category: string): boolean {
		return this.categories.includes(new CourseCategory(category));
	}

	addCategory(category: string): void {
		if (!this.hasCategory(category)) {
			this.categories.push(new CourseCategory(category));

			this.record(
				new CourseCategoryAddedDomainEvent(this.id.value, category),
			);
		}
	}

	removeCategory(category: string): void {
		const index = this.categories.indexOf(new CourseCategory(category));

		if (index !== -1) {
			this.categories.splice(index, 1);

			this.record(
				new CourseCategoryRemovedDomainEvent(this.id.value, category),
			);
		}
	}

	delete(): void {
		this.record(new CourseDeletedDomainEvent(this.id.value));
	}

	toPrimitives(): Primitives<Course> {
		return {
			id: this.id.value,
			name: this.name.value,
			summary: this.summary.value,
			categories: this.categories.map((category) => category.value),
		};
	}
}
