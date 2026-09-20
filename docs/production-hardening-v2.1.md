# v2.1 — Production Hardening

## Scope
Turn the v2.0 vertical-slice contract into a small, testable TypeScript core inside ALCHEMIST_WORLD.

## Added
- canonical vertical-slice state
- completion invariant
- stable deterministic checksum
- Node test coverage for the integration contract

## Repository alignment
The repository already declares TypeScript/Node as the proposed baseline and exposes workspace-level build/test/lint/typecheck scripts.

## Next
- connect the core state to real domain packages
- add save migration/versioning
- add CI artifact validation
- add application adapter in `apps/world`
- add device-facing telemetry boundaries without coupling persistence to presentation
