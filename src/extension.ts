import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

const STATE_DB_KEY = "history.recentlyOpenedPathsList";

interface RecentEntry {
  folderUri?: string;
  fileUri?: string;
  label?: string;
}

interface RecentPathsList {
  entries: RecentEntry[];
}

function getStateDbPath(): string | null {
  const appName = vscode.env.appName;
  const home = os.homedir();
  let appDataDir: string;

  if (process.platform === "darwin") {
    appDataDir = path.join(home, "Library", "Application Support", appName);
  } else if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    appDataDir = path.join(appData, appName);
  } else {
    appDataDir = path.join(home, ".config", appName);
  }

  const stateDbPath = path.join(appDataDir, "User", "globalStorage", "state.vscdb");
  return fs.existsSync(stateDbPath) ? stateDbPath : null;
}

function readRecentPathsViaCli(stateDbPath: string): RecentPathsList | null {
  try {
    const { execSync } = require("child_process");
    const out = execSync(
      `sqlite3 "${stateDbPath.replace(/"/g, '\\"')}" "SELECT value FROM ItemTable WHERE key = '${STATE_DB_KEY}'"`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    ).trim();
    if (!out) return null;
    return JSON.parse(out) as RecentPathsList;
  } catch {
    return null;
  }
}

async function readRecentPathsViaSqlJs(stateDbPath: string): Promise<RecentPathsList | null> {
  try {
    const initSqlJs = require("sql.js");
    const SQL = await initSqlJs();
    const buf = fs.readFileSync(stateDbPath);
    const db = new SQL.Database(new Uint8Array(buf));
    const res = db.exec(
      `SELECT value FROM ItemTable WHERE key = '${STATE_DB_KEY.replace(/'/g, "''")}'`
    );
    db.close();
    if (!res?.length || !res[0].values?.length) return null;
    const value = res[0].values[0][0];
    return value ? (JSON.parse(value as string) as RecentPathsList) : null;
  } catch {
    return null;
  }
}

async function getRecentPaths(): Promise<RecentEntry[]> {
  const stateDbPath = getStateDbPath();
  if (!stateDbPath) return [];

  let data: RecentPathsList | null = readRecentPathsViaCli(stateDbPath);
  if (!data) {
    data = await readRecentPathsViaSqlJs(stateDbPath);
  }
  if (!data?.entries?.length) return [];

  const seen = new Set<string>();
  return data.entries.filter((e) => {
    const uri = e.folderUri ?? e.fileUri;
    if (!uri) return false;
    // VS Code/Cursor store local paths as path:/// or file://
    const isFile = uri.startsWith("file://");
    const isPath = uri.startsWith("path://");
    if (!isFile && !isPath) return false;
    const normalized = uri.replace(/\/$/, "");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

/** Normalize path:/// or file:// URIs to a file path for display and opening. */
function uriToFilePath(uri: string): string {
  if (uri.startsWith("file://")) {
    try {
      return path.normalize(decodeURIComponent(new URL(uri).pathname));
    } catch {
      return uri.replace(/^file:\/\//, "");
    }
  }
  if (uri.startsWith("path://")) {
    try {
      const p = new URL(uri).pathname;
      return path.normalize(decodeURIComponent(p || uri.replace(/^path:\/\//, "")));
    } catch {
      return uri.replace(/^path:\/\//, "");
    }
  }
  return uri;
}

function folderLabel(uri: string): string {
  try {
    const p = uriToFilePath(uri);
    return path.basename(p) || p || uri;
  } catch {
    return uri;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "cursor-recent-projects.openRecent",
    async () => {
      const entries = await getRecentPaths();

      if (entries.length === 0) {
        vscode.window.showInformationMessage(
          "No recent projects found. Open some folders first."
        );
        return;
      }

      const items: vscode.QuickPickItem[] = entries.map((e) => {
        const uri = e.folderUri ?? e.fileUri ?? "";
        const filePath = uriToFilePath(uri);
        return {
          label: folderLabel(uri),
          description: filePath,
          detail: uri,
        };
      });

      const picked = await vscode.window.showQuickPick(items, {
        title: "Open Recent Project",
        placeHolder: "Choose a project to open",
        matchOnDescription: true,
        matchOnDetail: true,
        canPickMany: false,
      });

      if (!picked?.detail) return;

      const filePath = uriToFilePath(picked.detail);
      const uri = vscode.Uri.file(filePath);
      await vscode.commands.executeCommand("vscode.openFolder", uri);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
