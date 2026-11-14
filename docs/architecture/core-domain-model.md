# Core domain model

The core package defines the stable, framework-independent vocabulary shared by the Alchemist World runtime.

## Primitives

- **Entity** represents a person, agent, project, artifact, place, organization, concept, or resource.
- **Relationship** is a directed, typed link between two entities.
- **WorldEvent** is an immutable record of something that happened, with an optional actor and subject.

## Identifier rules

Identifiers are branded TypeScript strings at compile time and validated at runtime. They use 3–64 lowercase ASCII letters, digits, underscores, or hyphens and must begin with a letter.

## Design constraints

- Core types do not depend on a database, web framework, or agent SDK.
- Persisted timestamps use ISO-8601 strings.
- Domain payloads are readonly at the type boundary.
- Relationships are directed; reciprocal links are represented as two records.
- Events describe facts that happened, not commands that might happen.

## Next

A later persistence adapter will map these contracts to a database without changing domain types. Validation schemas and event-versioning policy will be introduced alongside that adapter.
