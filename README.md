# Recent Projects

A Cursor/VS Code extension that shows a list of recently opened projects and lets you open one with a single pick—like **IntelliJ IDEA's "Open Recent"**.

## How to Use

1. **Keyboard shortcut**: `Option+R` (macOS) or `Alt+R` (Windows/Linux)
2. **Or Command Palette**: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) → run **"Open Recent Project..."**
3. Pick a project from the list (searchable by name or path).
4. The chosen folder opens in the current window.

## How It Works

- Reads Cursor's (or VS Code's) internal SQLite DB where recent paths are stored.
- On macOS/Linux it uses the system `sqlite3` CLI when available.
- On Windows (or when `sqlite3` isn't available) it falls back to the bundled **sql.js** library.

## Installation

### Option 1: Install from VSIX (recommended)

1. Download or build the `.vsix` file (see [Build from source](#option-3-build-from-source) below).
2. **In Cursor or VS Code:**
   - Open the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`)
   - Click the **`...`** menu at the top
   - Select **"Install from VSIX..."**
   - Choose the `cursor-recent-projects-*.vsix` file

3. **Or use the command line:**
   ```bash
   # For Cursor
   cursor --install-extension /path/to/cursor-recent-projects-0.1.0.vsix

   # For VS Code
   code --install-extension /path/to/cursor-recent-projects-0.1.0.vsix
   ```

### Option 2: Install from source (development / local)

1. Clone or copy this folder.
2. In the extension folder, run:
   ```bash
   npm install
   npm run compile
   ```
3. Press **F5** or use **Run → Start Debugging** to open a new Cursor/VS Code window with the extension loaded.
4. Or pack and install the VSIX:
   ```bash
   npx @vscode/vsce package
   ```
   Then install the generated `.vsix` via **Extensions → ... → Install from VSIX...**

### Option 3: Build from source

To create a fresh `.vsix` package:

```bash
git clone <this-repo>
cd cursor-recent-projects
npm install
npm run compile
npx @vscode/vsce package
```

This produces `cursor-recent-projects-0.1.0.vsix` in the project root. Install it using any method from [Option 1](#option-1-install-from-vsix-recommended).

### Option 4: Manual copy (advanced)

1. Build the extension (`npm install && npm run compile`).
2. Copy the entire project folder to your extensions directory:
   - **macOS**: `~/.cursor/extensions/` or `~/.vscode/extensions/`
   - **Windows**: `%USERPROFILE%\.cursor\extensions\` or `%USERPROFILE%\.vscode\extensions\`
   - **Linux**: `~/.cursor/extensions/` or `~/.vscode/extensions/`
3. Restart Cursor or VS Code.

## Develop / Debug

1. Open this folder in Cursor or VS Code.
2. Run `npm install` and `npm run compile`.
3. Press **F5** or use **Run → Start Debugging** to open a new window with the extension loaded.
4. In that window, run **"Open Recent Project..."** from the Command Palette.

## Supported Apps

- **Cursor** (primary)
- **VS Code** (same storage format)

Recent projects are read from the active app's user data directory (e.g. `~/Library/Application Support/Cursor/` on macOS, `%APPDATA%\Cursor\` on Windows).

---

## Publishing to the VS Code Marketplace

To publish this extension so others can install it from the Extensions view:

### 1. Install vsce

```bash
npm install -g @vscode/vsce
```

### 2. Create a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/) and sign in with your Microsoft account.
2. If you don't have an organization, create one.
3. Click your profile icon → **Personal access tokens** → **New Token**.
4. Set:
   - **Name**: e.g. "VS Code Marketplace"
   - **Organization**: **All accessible organizations**
   - **Scopes**: **Custom defined** → click **Show all scopes** → under **Marketplace**, select **Manage**
5. Click **Create** and **copy the token** (you won't see it again).

### 3. Create a publisher

1. Go to [Visual Studio Marketplace - Manage](https://marketplace.visualstudio.com/manage).
2. Sign in with the same Microsoft account.
3. Click **Create publisher**.
4. Fill in:
   - **ID**: unique identifier (e.g. `yourname` or `yourcompany`) — **cannot be changed later**
   - **Name**: display name (e.g. your name or company)
5. Click **Create**.

### 4. Update package.json

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
"keywords": ["recent", "projects", "intellij", "open recent"]
```

### 5. Login and publish

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

### 6. Manual publish (alternative)

If you prefer to upload the VSIX manually:

```bash
vsce package
```

Then go to [Manage Extensions](https://marketplace.visualstudio.com/manage) → **New extension** → **VS Code** → upload the `.vsix` file.

### Notes

- **SVG images** in README/CHANGELOG are not allowed (use PNG/JPG or trusted badge URLs).
- **Image URLs** in README must use `https://`.
- Add a `LICENSE` file and optionally `CHANGELOG.md` for a better Marketplace page.
