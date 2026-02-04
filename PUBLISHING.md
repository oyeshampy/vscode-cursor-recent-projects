# Publishing to VS Code Marketplace, OpenVSX, and Other Mirrors

Author-only reference. This file is not included in the extension package (see .vscodeignore).

The same `.vsix` package works for all registries. You can publish to one or more of:

- **VS Code Marketplace** (marketplace.visualstudio.com) — used by VS Code and Cursor by default
- **Open VSX** (open-vsx.org) — used by VSCodium, Eclipse Theia, Gitpod, **Ubuntu** (Snap VSCode/Codium), and other editors that support Open VSX
- **Other mirrors** — any OpenVSX-compatible registry (e.g. self-hosted) via `ovsx --registryUrl <url>`

---

## Prerequisites (shared)

1. **Package the extension** (same for all registries):
   ```bash
   npm run package
   ```
   Or manually: `npm run compile && npx @vscode/vsce package`

2. **package.json** must have `publisher`, and optionally `repository`, `license`, `keywords` (already set for this extension).

---

## 1. VS Code Marketplace

Used by Visual Studio Code and Cursor when installing from the Extensions view (default).

### Install vsce

```bash
npm install -g @vscode/vsce
```

### Create a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/) and sign in with your Microsoft account.
2. If you don't have an organization, create one.
3. Click your profile icon → **Personal access tokens** → **New Token**.
4. Set:
   - **Name**: e.g. "VS Code Marketplace"
   - **Organization**: **All accessible organizations**
   - **Scopes**: **Custom defined** → **Show all scopes** → under **Marketplace**, select **Manage**
5. Click **Create** and copy the token (you won’t see it again).

### Create a publisher

1. Go to [Visual Studio Marketplace - Manage](https://marketplace.visualstudio.com/manage).
2. Sign in with the same Microsoft account.
3. Click **Create publisher**.
4. Fill in **ID** (e.g. `oyeshampy`) and **Name**. The ID cannot be changed later.

### Publish

```bash
vsce login <publisher-id>
vsce publish
# Or with version bump:
vsce publish patch   # 0.1.0 → 0.1.1
vsce publish minor   # 0.1.0 → 0.2.0
vsce publish major   # 0.1.0 → 1.0.0
```

Or use the script (after logging in once):

```bash
npm run publish:marketplace
```

### Manual upload

```bash
npm run package
```

Then go to [Manage Extensions](https://marketplace.visualstudio.com/manage) → **New extension** → **VS Code** → upload the `.vsix` file.

---

## 2. Open VSX (open-vsx.org)

Used by VSCodium, Eclipse Theia, Gitpod, and other OpenVSX-compatible editors.

### Create an Eclipse account

1. Register at [accounts.eclipse.org](https://accounts.eclipse.org/user/register).
2. Fill in the **GitHub Username** field and use the same GitHub account you will use to log in to open-vsx.org.

### Sign the Publisher Agreement

1. Log in at [open-vsx.org](https://open-vsx.org) with your GitHub account (account icon → authorize).
2. Go to [Profile / Settings](https://open-vsx.org/user-settings/profile) (avatar → **Settings**).
3. Click **Log in with Eclipse** and authorize with your eclipse.org account.
4. Click **Show Publisher Agreement**, read it, and click **Agree**.

### Create an access token

1. Go to [open-vsx.org Access Tokens](https://open-vsx.org/user-settings/tokens) (avatar → **Settings** → **Access Tokens**).
2. Click **Generate New Token**, enter a description (e.g. "CI" or "Local publish"), then **Generate Token**.
3. Copy the token and store it securely (e.g. `OVSX_PAT` in CI secrets). It is not shown again.

### Create the namespace (first time only)

The namespace must match the `publisher` in `package.json` (e.g. `oyeshampy`). Create it once:

```bash
npx ovsx create-namespace oyeshampy -p <your-openvsx-token>
```

### Publish to Open VSX

From the extension root, with token in env (recommended):

```bash
OVSX_PAT=<your-token> npm run publish:openvsx
```

Or pass the token explicitly:

```bash
npx ovsx publish -p <your-token>
```

To publish an already built `.vsix`:

```bash
npx ovsx publish ./vscode-cursor-recent-projects-<version>.vsix -p <your-token>
```

Optional: install `ovsx` globally so the npm script works without npx:

```bash
npm install -g ovsx
npm run publish:openvsx   # still requires OVSX_PAT or -p
```

---

## 3. Other OpenVSX-compatible mirrors

To publish to a different registry (e.g. self-hosted Open VSX):

```bash
npx ovsx publish -p <token> --registryUrl https://your-registry.example.com
```

Or set the URL via env:

```bash
OVSX_REGISTRY_URL=https://your-registry.example.com OVSX_PAT=<token> npx ovsx publish
```

The same `.vsix` and the same `ovsx` tool are used; only the registry URL and token change.

---

## 4. GitHub Action (publish on release)

The repository includes a workflow that can publish to both marketplaces when you create a release.

1. **Secrets** (Settings → Secrets and variables → Actions):
   - `VSCE_PAT` — Azure DevOps PAT with Marketplace **Manage** (for VS Code Marketplace).
   - `OVSX_PAT` — Open VSX access token (from [open-vsx.org/user-settings/tokens](https://open-vsx.org/user-settings/tokens)).

2. **Trigger**: Create a new **Release** (tag, e.g. `v0.1.4` matching `version` in package.json). The workflow runs and:
   - Publishes to the VS Code Marketplace if `VSCE_PAT` is set.
   - Publishes to Open VSX if `OVSX_PAT` is set.

You can run the workflow manually from the **Actions** tab → **Publish extension** → **Run workflow** (optional: override version).

---

## Updating the version (single source of truth)

1. Edit **`package.json`** and set the `"version"` field (e.g. `"0.1.4"`).
2. Run **`npm run version:sync`** to update `CHANGELOG.md` with that version and today’s date.
3. Commit and create a release tag matching the version (e.g. `v0.1.4`).

No other files need the version number; docs use placeholders like `<version>`.

---

## Notes

- **SVG images** in README/CHANGELOG are not allowed on the VS Code Marketplace (use PNG/JPG or trusted badge URLs). Open VSX is generally more permissive but keeping to PNG/JPG is safe for both.
- **Image URLs** in README must use `https://` for the Marketplace.
- A `LICENSE` file and `CHANGELOG.md` improve the listing on both marketplaces.
- After publishing to Open VSX, you can [claim the namespace](https://github.com/eclipse/openvsx/wiki/Namespace-Access) so the extension is shown as verified.
