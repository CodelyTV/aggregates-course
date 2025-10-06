import "reflect-metadata";

import { ContainerBuilder } from "diod";

import { CourseFinder } from "../../../mooc/courses/application/find/CourseFinder";
import { CourseBySimilarNameFinder } from "../../../mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { CourseSearcher } from "../../../mooc/courses/application/search/CourseSearcher";
import { AllCoursesSearcher } from "../../../mooc/courses/application/search-all/AllCoursesSearcher";
import { AllCoursesPaginatedSearcher } from "../../../mooc/courses/application/search-all-paginated/AllCoursesPaginatedSearcher";
import { CoursesByIdsSearcher } from "../../../mooc/courses/application/search-by-ids/CoursesByIdsSearcher";
import { SimilarCoursesByIdsSearcher } from "../../../mooc/courses/application/search-similar-by-ids/SimilarCoursesByIdsSearcher";
import { CourseRepository } from "../../../mooc/courses/domain/CourseRepository";
import { PostgresCourseRepository } from "../../../mooc/courses/infrastructure/PostgresCourseRepository";
import { InvoiceCreator } from "../../../mooc/invoices/application/create/InvoiceCreator";
import { InvoiceRepository } from "../../../mooc/invoices/domain/InvoiceRepository";
import { PostgresInvoiceRepository } from "../../../mooc/invoices/infrastructure/PostgresInvoiceRepository";
import { UserCourseProgressCompleter } from "../../../mooc/user-course-progress/application/complete/UserCourseProgressCompleter";
import { GenerateUserCourseSuggestionsOnUserCourseProgressCompleted } from "../../../mooc/user-course-suggestions/application/generate/GenerateUserCourseSuggestionsOnUserCourseProgressCompleted";
import { UserCourseSuggestionsGenerator } from "../../../mooc/user-course-suggestions/application/generate/UserCourseSuggestionsGenerator";
import { CourseSuggestionsGenerator } from "../../../mooc/user-course-suggestions/domain/CourseSuggestionsGenerator";
import { UserCourseSuggestionsRepository } from "../../../mooc/user-course-suggestions/domain/UserCourseSuggestionsRepository";
import { OllamaCourseSuggestionsGenerator } from "../../../mooc/user-course-suggestions/infrastructure/OllamaCourseSuggestionsGenerator";
import { PostgresUserCourseSuggestionsRepository } from "../../../mooc/user-course-suggestions/infrastructure/PostgresUserCourseSuggestionsRepository";
import { UserFinder } from "../../../mooc/users/application/find/UserFinder";
import { UserRegistrar } from "../../../mooc/users/application/registrar/UserRegistrar";
import { UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated } from "../../../mooc/users/application/update-course-suggestions/UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated";
import { UserCourseSuggestionsUpdater } from "../../../mooc/users/application/update-course-suggestions/UserCourseSuggestionsUpdater";
import { DomainUserFinder } from "../../../mooc/users/domain/DomainUserFinder";
import { UserRepository } from "../../../mooc/users/domain/UserRepository";
import { PostgresUserRepository } from "../../../mooc/users/infrastructure/PostgresUserRepository";
import { EventBus } from "../../domain/event/EventBus";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { PostgresConnection } from "../postgres/PostgresConnection";

const builder = new ContainerBuilder();

// Shared
builder
	.register(PostgresConnection)
	.useFactory(() => {
		return new PostgresConnection(
			"localhost",
			5432,
			"supabase_admin",
			"c0d3ly7v",
			"postgres",
		);
	})
	.asSingleton();

builder.register(EventBus).use(InMemoryEventBus);

// User
builder.register(UserRepository).use(PostgresUserRepository);
builder.registerAndUse(PostgresUserRepository);

builder.registerAndUse(UserRegistrar);

builder.registerAndUse(UserFinder);
builder.registerAndUse(DomainUserFinder);

builder
	.registerAndUse(UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated)
	.addTag("subscriber");
builder.registerAndUse(UserCourseSuggestionsUpdater);

// UserCourseSuggestions
builder
	.register(CourseSuggestionsGenerator)
	.use(OllamaCourseSuggestionsGenerator);
builder.registerAndUse(OllamaCourseSuggestionsGenerator);
builder
	.register(UserCourseSuggestionsRepository)
	.use(PostgresUserCourseSuggestionsRepository);
builder.registerAndUse(UserCourseSuggestionsGenerator);
builder
	.registerAndUse(GenerateUserCourseSuggestionsOnUserCourseProgressCompleted)
	.addTag("subscriber");

builder.registerAndUse(UserCourseProgressCompleter);

// Course
builder.register(CourseRepository).use(PostgresCourseRepository);
builder.registerAndUse(PostgresCourseRepository);
builder.registerAndUse(CourseFinder);
builder.registerAndUse(CourseSearcher);
builder.registerAndUse(CoursesByIdsSearcher);
builder.registerAndUse(SimilarCoursesByIdsSearcher);
builder.registerAndUse(AllCoursesSearcher);
builder.registerAndUse(AllCoursesPaginatedSearcher);
builder.registerAndUse(CourseBySimilarNameFinder);

// Invoice
builder.register(InvoiceRepository).use(PostgresInvoiceRepository);
builder.registerAndUse(PostgresInvoiceRepository);
builder.registerAndUse(InvoiceCreator);

// Export container
export const container = builder.build();
