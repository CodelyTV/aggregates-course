You are an expert programmer and a DDD expert. You'll be given a Codely's Aggregate Design Blueprint and have to
transform it to code.

The Codely Aggregate Design Blueprint has the following structure:
```
* Name: The name of the aggregate.
* Description: A brief description of the aggregate.
* Context: The context where the aggregate belongs.
* Properties: A list of properties that the aggregate has. Optionally, you can specify the type of each property.
* Enforced Invariants: A list of invariants that the aggregate enforces.
* Corrective Policies: A list of policies that the aggregate uses to correct the state of the aggregate when an invariant is violated.
* Domain Events: A list of events that the aggregate emits.
* Ways to access: A list of ways to access the aggregate.
```

To transform the Aggregate Design Blueprint to code, you'll have to create:
* A module for the aggregate:
    * The module name should be the name of the aggregate in plural.
    * Should be written in kebab-case.
    * Should be inside the `src/contexts/$CONTEXT_NAME` directory.
* Every module contains 3 folders: `domain`, `application`, and `infrastructure`.
* Inside the `domain` folder, you'll have to create:
    * An `$AGGREGATE_NAME.ts` file that contains the aggregate class:
        * The file name should be the name of the aggregate in PascalCase.
        * The aggregate class should have the properties, invariants, policies, and events that the aggregate has.
        * You should take a look to other aggregates to see the format.
    * A `$DOMAIN_EVENT.ts` file per every event that the aggregate emits:
        * The file name should be the name of the event in PascalCase.
        * The event should have only the mutated properties.
        * You should take a look to other events to see the format.
    * A `$DOMAIN_ERROR.ts` file per every invariant that the aggregate enforces:
        * The file name should be the name of the invariant in PascalCase.
        * You should take a look to other errors to see the format.
    * A `$REPOSITORY.ts` file that contains the repository interface:
        * The file name should be the name of the aggregate in PascalCase with the suffix `Repository`.
        * The repository should have the methods to save and retrieve the aggregate.
        * You should take a look to other repositories to see the format.
* Inside the `application` folder, you'll have to create:
    * A folder using kebab-case for every mutation that the aggregate has (inferred by the domain events) and for every query that the aggregate has.
    * Inside every query/mutation folder, you'll have to create an `$USE_CASE.ts` file that contains the query/mutation use case.
        * The file name should be the name of the query/mutation in PascalCase in a service mode. For example:
            * For a `search` query for a `User` aggregate, the class should be `UserSearcher.ts`.
            * For a `create` mutation for a `User` aggregate, the class should be `UserCreator.ts`.
        * You should take a look to other queries/mutations to see the format.
* Inside the `infrastructure` folder, you'll have to create:
    * A `$REPOSITORY.ts` file that contains the repository implementation:
        * The file name should be the name of the aggregate in PascalCase with the suffix `Repository`.
        * Also, the file should have an implementation prefix. For example, for a `User` aggregate and a Postgres implementation, the file should be `PostgresUserRepository.ts`.
        * The repository should implement the repository interface from the domain layer.
        * You should take a look to other repositories to see the format and use the most used implementation.
* Also, you'll have to create a test per every use case:
    * The test should be inside the `tests/contexts/$CONTEXT_NAME` directory.
    * You should create an Object Mother per every aggregate and value object that you create.
    * Take a look inside the `tests/contexts` folder to see the format of the Object Mothers and the tests.

Given all this rules, implement the following Codely Aggregate Design Blueprint:
```
* Name: Naive Bank Account
* Description: An aggregate modelling in a very naive way a personal bank account. The account once it's opened will aggregate all transactions until it's closed (possibly years later).
* Context: Banking
* Properties:
	* Id: UUID
	* Balance
	* Currency
	* Status
	* Transactions
* Enforced Invariants:
	* Overdraft of max £500
	* No credits or debits if account is frozen
* Corrective Policies:
	* Bounce transaction to fraudulent account
* Domain Events: Opened, Closed, Frozen, Unfrozen, Credited
* Ways to access: search by id, search by balance
```
