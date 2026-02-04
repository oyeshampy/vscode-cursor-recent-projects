# Publishing to the VS Code Marketplace

Author-only reference. This file is not included in the extension package (see .vscodeignore).

To publish this extension so others can install it from the Extensions view, ensure `package.json` has your Marketplace publisher ID (and optionally `repository`, `license`, `keywords`), then run `vsce login <publisher-id>` and `vsce publish` (see below). You need an Azure DevOps PAT with **Marketplace → Manage** and a publisher created at [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage).

## 1. Install vsce

```bash
npm install -g @vscode/vsce
```

## 2. Create a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/) and sign in with your Microsoft account.
2. If you don't have an organization, create one.
3. Click your profile icon → **Personal access tokens** → **New Token**.
4. Set:
   - **Name**: e.g. "VS Code Marketplace"
   - **Organization**: **All accessible organizations**
   - **Scopes**: **Custom defined** → click **Show all scopes** → under **Marketplace**, select **Manage**
5. Click **Create** and **copy the token** (you won't see it again).

## 3. Create a publisher

1. Go to [Visual Studio Marketplace - Manage](https://marketplace.visualstudio.com/manage).
2. Sign in with the same Microsoft account.
3. Click **Create publisher**.
4. Fill in:
   - **ID**: unique identifier (e.g. `yourname` or `yourcompany`) — **cannot be changed later**
   - **Name**: display name (e.g. your name or company)
5. Click **Create**.

## 4. Update package.json

Set the `publisher` in `package.json` to your publisher ID:

```json
"publisher": "your-publisher-id"
```

Add optional fields for better Marketplace presentation:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/yourusername/cursor-recent-projects"
},
"license": "MIT",
"keywords": ["recent", "projects", "open recent"]
```

## 5. Login and publish

```bash
# Login (enter your PAT when prompted)
vsce login your-publisher-id

# Publish
vsce publish
```

Or publish with auto-increment version:

```bash
vsce publish patch   # 0.1.0 → 0.1.1
vsce publish minor   # 0.1.0 → 0.2.0
vsce publish major   # 0.1.0 → 1.0.0
```

## 6. Manual publish (alternative)

If you prefer to upload the VSIX manually:

```bash
vsce package
```

Then go to [Manage Extensions](https://marketplace.visualstudio.com/manage) → **New extension** → **VS Code** → upload the `.vsix` file.

## Notes

- **SVG images** in README/CHANGELOG are not allowed (use PNG/JPG or trusted badge URLs).
- **Image URLs** in README must use `https://`.
- Add a `LICENSE` file and optionally `CHANGELOG.md` for a better Marketplace page.
