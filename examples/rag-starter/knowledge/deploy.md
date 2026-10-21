# Fictional Acme deployment runbook

## Deployment process
For this fictional example, Acme engineers deploy the service by running the test suite, building the application image, and releasing to a staging environment before production. The release manager approves the production rollout.

## Rollback
If a fictional Acme release fails its health check, the on-call engineer rolls back to the previous image digest and records the incident in the release log. The rollback procedure requires no database schema migration.
