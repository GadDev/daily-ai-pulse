# M2 automatic preview acceptance probe

This temporary document exists only to exercise the automatic Firebase preview
pipeline independently from product PRs.

Acceptance sequence:

1. A successful same-repository PR CI run deploys `pr-<number>`.
2. A newer successful revision replaces the same preview channel.
3. A deliberately failing CI revision does not deploy.
4. Restoring the valid revision deploys again.
5. Closing the PR makes the channel eligible for M3 cleanup.

Probe revision: 2 — verify that the existing `pr-166` channel is replaced.

This file and branch can be removed after the acceptance evidence is recorded.
