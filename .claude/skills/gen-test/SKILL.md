---
name: gen-test
description: Generate Jest unit test for a NestJS service or controller
disable-model-invocation: true
---

# Generate Test

Generate a Jest test file for the specified NestJS module.

## Usage

```
/gen-test <module-name>
```

Example: `/gen-test scoring` generates `server/src/assessments/scoring.service.spec.ts`

## Conventions

1. **Test location**: Place test file alongside the source file with `.spec.ts` suffix
2. **Test module setup**: Use `@nestjs/testing` `Test.createTestingModule` pattern
3. **Dependency mocking**: Mock all injected dependencies using `jest.fn()` factories
4. **Reference test**: Follow patterns from `server/src/auth/auth.service.spec.ts`
5. **Test structure**:
   - `describe` block per class
   - Nested `describe` per public method
   - Test happy path, error cases, and edge cases
   - Use `beforeEach` for test module setup

## Steps

1. Read the target source file to understand its dependencies and public methods
2. Read `server/src/auth/auth.service.spec.ts` as a reference for test patterns
3. Generate the test file covering all public methods
4. Run `cd server && npx jest <path-to-new-spec> --no-coverage` to verify the tests pass
5. Fix any failing tests
