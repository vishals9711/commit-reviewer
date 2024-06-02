### Summary of Conventional Commits

**Conventional Commits** is a specification for formatting commit messages, making them explicit and easy to understand. It works well with Semantic Versioning (SemVer) by categorizing changes as features, fixes, or breaking changes, which help in automating version bumps.

#### Commit Message Structure

A commit message should follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types and Their Meanings

1. **fix:** Bug fixes (correlates with `PATCH` in SemVer).
2. **feat:** New features (correlates with `MINOR` in SemVer).
3. **BREAKING CHANGE:** Major changes (correlates with `MAJOR` in SemVer). Indicated by:
   - A `BREAKING CHANGE:` footer.
   - A `!` after the type/scope.

Additional types include:
- `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, and others.

#### Examples

- **Feature with breaking change footer:**
  ```
  feat: allow provided config object to extend other configs

  BREAKING CHANGE: `extends` key in config file is now used for extending other config files
  ```
- **Feature with `!` for breaking change:**
  ```
  feat!: send an email to the customer when a product is shipped
  ```
- **Simple documentation update:**
  ```
  docs: correct spelling of CHANGELOG
  ```

#### Guidelines

- **Prefix:** Commits must start with a type (e.g., `feat`, `fix`).
- **Scope:** Optional, for additional context (e.g., `feat(parser):`).
- **Description:** Short summary after type/scope.
- **Body:** Optional, detailed information one blank line after the description.
- **Footers:** Optional, for additional metadata (e.g., `BREAKING CHANGE:`).

#### Benefits

- Automatic changelog generation.
- Simplified semantic versioning.
- Clearer communication of changes.
- Streamlined build and publish processes.

### Specification Summary

1. **Types:** `feat` for features, `fix` for bug fixes, etc.
2. **Scope:** Optional, within parentheses.
3. **Description:** Mandatory, following type/scope.
4. **Body:** Optional, detailed info.
5. **Footers:** Optional, metadata such as `BREAKING CHANGE`.
6. **Breaking Changes:** Indicated in prefix or footer.
7. **Consistency:** Types and formatting should be consistent, but not case-sensitive except for `BREAKING CHANGE`.

### Usage

- **Generating Commit Messages:** Follow the format and guidelines.
- **Versioning:** Use commit types to determine SemVer changes.
- **Collaboration:** Ensure commit messages communicate changes clearly to all stakeholders. 

This structured approach enables automation and clarity in software development processes.