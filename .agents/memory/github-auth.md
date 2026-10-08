---
name: GitHub source-control authentication
description: Replit GitHub integration status can differ from whether the Git CLI can authenticate.
---

When `git ls-remote` or `git push` returns an invalid username/token error although the GitHub integration appears active, do not keep retrying or overwrite the configured remote. Replit's documented recovery is to disconnect and reconnect GitHub under account Settings → Git Providers. Confirm the intended repository separately before pushing.

**Why:** The connected-service status may not reflect a usable Git CLI credential, and a configured remote can differ from the repository the user named.

**How to apply:** Stop before pushing on authentication failure. Reconnect through Git Providers, then verify read access to the explicit target repository before sending commits.
