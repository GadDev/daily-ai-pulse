# Security Policy

## Supported version

Pulse is a continuously deployed static publication. Security fixes target the current `main` branch and the latest deployed GitHub Pages version. Historical commits and abandoned feature branches are not supported releases.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for a vulnerability that could expose users, maintainers, credentials, deployment infrastructure, unpublished content, or third-party systems.

Preferred reporting path:

1. Use GitHub's private vulnerability reporting / security-advisory flow for this repository if it is available to you.
2. If that is unavailable, contact the repository owner through a private contact method listed on their GitHub profile.

Include, when possible:

- affected URL, file, component, workflow, or commit;
- impact and realistic attack scenario;
- reproduction steps or proof of concept;
- whether the issue is already public;
- suggested mitigation if you have one.

Please avoid accessing data that is not yours, disrupting the live site, or testing against third-party systems without authorization.

## Response process

The maintainer will aim to acknowledge a credible report within five business days, assess severity and scope, prepare a fix, and coordinate disclosure where appropriate.

For a static publication, the highest-risk areas are likely to include:

- GitHub Actions and deployment permissions;
- compromised dependencies or build tooling;
- unsafe external links or injected content;
- secrets accidentally committed to source control;
- future interactive/newsletter integrations;
- supply-chain risks in contributor-provided assets or scripts.

## Public disclosure

Please allow a reasonable remediation period before publishing vulnerability details. After remediation, a concise security note may be added to the changelog when disclosure is useful to downstream users or contributors.
