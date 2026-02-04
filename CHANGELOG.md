# Change Log

All notable changes to the "Recent Projects" extension will be documented in this file.

## [0.1.0] - 2025-02-12

### Added

- Initial release: Open Recent Project.
- Command "Open Recent Project..." with keyboard shortcut `Alt+R` (Windows/Linux) / `Option+R` (macOS).
- Reads recent paths from Cursor/VS Code SQLite state DB.
- Fallback to sql.js when system sqlite3 is not available (e.g. on Windows).
