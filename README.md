# Open Recent Projects / Folders (Quick access)

A Cursor/VS Code extension that shows a list of recently opened projects and lets you open one with a single pick.

## How to Use

1. **Keyboard shortcut**: `Option+R` (macOS) or `Alt+R` (Windows/Linux)
2. **Or Command Palette**: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) → run **"Open Recent Project or Folders (Quick access)..."**
3. Pick a project from the list (searchable by name or path).
4. The chosen folder opens in the current window.

## How It Works

- Reads Cursor's (or VS Code's) internal SQLite DB where recent paths are stored.
- On macOS/Linux it uses the system `sqlite3` CLI when available.
- On Windows (or when `sqlite3` isn't available) it falls back to the bundled **sql.js** library.

## Installation

### From Open VSX (VSCodium, Eclipse Theia, Gitpod, etc.)

If your editor uses the [Open VSX Registry](https://open-vsx.org/), install from there:

- **[open-vsx.org – Open Recent Projects / Folders](https://open-vsx.org/extension/oyeshampy/vscode-cursor-recent-projects)**  
  In your editor’s Extensions view, search for “Open Recent Projects” or “vscode-cursor-recent-projects” and install.

### Option 1: Install from VSIX (recommended)

1. Download or build the `.vsix` file (see [Build from source](#option-3-build-from-source) below).
2. **In Cursor or VS Code:**
   - Open the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`)
   - Click the **`...`** menu at the top
   - Select **"Install from VSIX..."**
   - Choose the `vscode-cursor-recent-projects-*.vsix` file

3. **Or use the command line:**
   ```bash
   # For Cursor
   cursor --install-extension /path/to/vscode-cursor-recent-projects-<version>.vsix

   # For VS Code
   code --install-extension /path/to/vscode-cursor-recent-projects-<version>.vsix
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
cd vscode-cursor-recent-projects
npm install
npm run compile
npx @vscode/vsce package
```

This produces `vscode-cursor-recent-projects-<version>.vsix` in the project root (version comes from package.json). Install it using any method from [Option 1](#option-1-install-from-vsix-recommended).

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
4. In that window, run **"Open Recent Project or Folders (Quick access)..."** from the Command Palette.

## Supported Apps

- **Cursor** (primary)
- **VS Code** (same storage format)

Recent projects are read from the active app's user data directory (e.g. `~/Library/Application Support/Cursor/` on macOS, `%APPDATA%\Cursor\` on Windows).
