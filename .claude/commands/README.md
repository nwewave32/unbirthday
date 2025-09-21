# Claude Commands

This directory contains custom Claude Code commands for enhanced development workflow.

## 🚀 Quick Start

```bash
# Show available commands
npm run claude

# Create a new task
npm run project:create-task "Implement user authentication" --description="Add login/logout functionality" --priority=high

# Review code
npm run code:review src/App.tsx

# Refactor code
npm run code:refactor src/components --style=modern
```

## 📋 Available Commands

### /project:create-task
Creates new tasks in Backlog.md with optional GitHub integration.

**Features:**
- ✅ Automatic Backlog.md creation
- ✅ GitHub issue creation (if gh CLI available)
- ✅ Backlog CLI integration (if installed)
- ✅ Priority levels and descriptions

### /code:review
Performs comprehensive code review with detailed analysis.

**Features:**
- ✅ File and PR review support
- ✅ Language-specific analysis
- ✅ Lint and test integration
- ✅ Severity-based feedback
- ✅ Automatic issue detection

### /code:refactor
Automated code refactoring with quality validation.

**Features:**
- ✅ Git branch management
- ✅ Automatic code improvements
- ✅ Pull request creation
- ✅ Definition of Done validation
- ✅ Multiple coding styles

## 🔧 Prerequisites

### Required
- Node.js (ES modules support)
- Git repository

### Optional (for enhanced features)
- `gh` CLI for GitHub integration
- `backlog` CLI for task management
- Project-specific linting/testing setup

## 📁 File Structure

```
.claude/commands/
├── README.md           # This file
├── index.js           # Main CLI entry point
├── create-task.js     # Task creation handler
├── code-review.js     # Code review handler
└── code-refactor.js   # Refactoring handler
```

## 🎯 Integration with Claude Code

These commands are specifically designed to work with Claude Code's slash command system. Each command follows the specification documented in `CLAUDE.md`:

- **Handler**: Individual JavaScript modules
- **Args**: Structured argument parsing
- **Output**: JSON-formatted results with structured data

## 🛠️ Development

To add new commands:

1. Create a new handler file (e.g., `my-command.js`)
2. Export an async function that takes `args` parameter
3. Add the command to `index.js` imports and commands object
4. Update `package.json` scripts
5. Document in `CLAUDE.md`

Example handler structure:
```javascript
export async function myCommand(args) {
  // Command logic here
  return {
    success: true,
    data: "result"
  };
}
```

## 🐛 Troubleshooting

**Command not found**: Ensure you're using Node.js with ES modules support and the command exists in `.claude/commands/index.js`.

**Git errors**: Check you're in a Git repository and have appropriate permissions.

**GitHub integration fails**: Install and authenticate `gh` CLI for GitHub features.

**Linting errors**: Ensure your project has proper linting setup in `package.json`.