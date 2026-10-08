---
title: "Microsoft MXC gives local coding agents a policy boundary across operating systems"
description: "Microsoft released its cross-platform containment SDK as GitHub made MXC-backed local sandboxing generally available in Copilot."
date: 2026-10-08
category: engineering
tags:
  - agent-runtime
  - agent-security
  - sandboxing
  - permissions
  - coding-agents
  - sdk
  - cli
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies:
  - Microsoft
  - GitHub
image: "/images/stories/2026-10-08-microsoft-mxc-agent-containment.webp"
imageAlt: "A contained working chamber surrounded by layered physical barriers and controlled access channels"
sources:
  - label: "Microsoft — Execution Containers: Policy-driven containment for AI agents"
    url: "https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/"
  - label: "Microsoft — MXC repository"
    url: "https://github.com/microsoft/mxc"
  - label: "GitHub — Local sandboxing for Copilot is generally available"
    url: "https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/"
  - label: "GitHub Docs — About cloud and local sandboxes for Copilot"
    url: "https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes"
---

Microsoft has made Microsoft eXecution Containers, or MXC, generally available as a policy-driven containment layer for untrusted workloads. At the same time, GitHub made MXC-backed local sandboxing generally available in Copilot CLI, the GitHub Copilot app, and VS Code sessions using Agent Host.

The important change is not a new permission prompt. MXC separates the policy that defines an agent's authority from the agent, model, plugin, and generated code operating inside that boundary. A workload can be granted read-write access to one repository, read-only access to selected configuration, and no access to other files or network destinations. Code inside the workload cannot expand that policy for itself.

## One policy model, several containment backends

MXC exposes a versioned JSON configuration and Rust, .NET, and Node SDKs. The application declares a workload command, a container type, and rules for resources such as files, network connectivity, and user-interface access. MXC validates the request and maps it to an operating-system-specific backend.

The available isolation levels are not equivalent.

- Process containers use AppContainer on Windows, Seatbelt on macOS, and Bubblewrap on Linux for comparatively lightweight local execution.
- Windows session containers run an agent under a separate account and session, isolating the desktop, clipboard, input, and active session from the user.
- Windows can also host Linux-oriented agent toolchains through a WSL container.
- MXC lists a MicroVM backend on Windows and Linux as experimental for workloads that need a hardware-backed boundary.

Microsoft explicitly says teams must evaluate the security properties of the chosen backend against the workload. The common policy vocabulary reduces integration work; it does not make a process sandbox equivalent to a virtual machine.

## Copilot shows the practical boundary—and its limits

GitHub's implementation makes the abstraction concrete. Copilot can restrict filesystem paths, outbound and local-network access, Git and GitHub CLI credentials, subprocesses, and, on macOS, keychain access. Enterprise-managed settings can require sandboxing and prevent ordinary configuration from weakening the policy.

By default, shell commands and local MCP and language servers run in the process sandbox. Remote MCP servers do not. Built-in Copilot file tools run inside the CLI process, so the operating-system sandbox cannot intercept their file operations; GitHub says those tools perform policy checks in the harness on a best-effort basis.

Network enforcement also differs by host. GitHub documents that programs on macOS and Linux cannot bypass configured outbound proxy rules with a direct connection, while the current Windows implementation relies on programs honoring proxy settings for host rules. When a required control is unavailable, administrators can configure Copilot to fail closed instead of silently running tools without a sandbox.

Those details are the reason to review the implementation, not only the policy file. A sandbox boundary is the combination of policy, backend, harness behavior, host support, and failure mode.

## A workable policy-authoring loop

MXC supports enforcement, learning, and permissive operating modes on Windows. Learning mode blocks and records ungranted access, which helps diagnose a least-privilege policy without relaxing it. Permissive mode records activity that would have been denied but allows it to proceed, making it suitable only for trusted policy-development runs—not untrusted code.

A practical rollout should therefore start with representative tasks and an explicit threat model:

1. inventory the files, credentials, network destinations, local services, and UI capabilities the workflow actually needs;
2. choose a backend whose isolation properties fit the risk, rather than defaulting to the lightest option;
3. run trusted tasks in an observation mode to discover legitimate dependencies;
4. switch to deny-and-record learning where supported and add only the missing grants;
5. test direct network access, credential discovery, path traversal, subprocesses, MCP servers, and host-feature failure; and
6. require fail-closed behavior before delegating unattended work.

## Engineer takeaway

Local model execution and local tool containment are separate decisions. Moving inference onto a workstation does not reduce the authority inherited by shell commands. MXC gives agent builders a reusable way to express that authority, while Copilot demonstrates how much product-specific behavior still sits around the OS boundary.

Treat the policy as executable security configuration. Review the selected backend, test denied operations, inspect which tools bypass child-process isolation, and verify what happens when the host cannot enforce a requested control. General availability makes the capability usable; it does not eliminate the need for workload-specific validation.

## Evidence boundary

The release state, SDK surface, policy dimensions, containment backends, and Copilot integration are documented by Microsoft and GitHub. The source repository and samples are public. This run did not independently penetration-test the backends or verify that equivalent policies provide equivalent protection across operating systems.

The story therefore reports the released containment architecture and its documented limitations, not a comparative security certification.
