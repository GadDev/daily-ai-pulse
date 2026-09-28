# Security Policy

## Supported version

The project is a continuously deployed static publication. Security fixes target the current `main` branch and the production deployment generated from it.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for a vulnerability that could expose users, contributors, credentials, publishing infrastructure, or repository integrity.

Use GitHub's private vulnerability-reporting mechanism for this repository when available. If private reporting is unavailable, contact the maintainer privately using the contact information on the maintainer's GitHub profile.

Include, when possible:

- the affected page, component, workflow, dependency, or configuration;
- reproduction steps or a minimal proof of concept;
- expected and observed impact;
- whether credentials, private data, supply-chain integrity, or deployment permissions are involved;
- suggested mitigations if you have them.

Please allow a reasonable period for validation and remediation before public disclosure. The project aims to acknowledge credible reports within five business days, but this is a best-effort target for a small independently maintained project.

## Security scope

Useful reports include vulnerabilities involving:

- GitHub Actions and deployment permissions;
- dependency or build-chain compromise;
- unsafe handling of secrets or credentials;
- cross-site scripting or unsafe HTML/content rendering;
- forms, third-party integrations, or future interactive features;
- mechanisms that could allow an attacker to publish or alter content without authorization.

Editorial disagreements, factual corrections, broken links, and ordinary content issues should be reported through normal GitHub issues instead.

## Secret handling

This static site should not require production secrets in source control. Never commit API keys, tokens, passwords, private keys, or personal credentials to the repository. If a secret is exposed, rotate or revoke it first; removing it from Git history is not sufficient on its own.
