#!/usr/bin/env node

/**
 * Auto-documentation updater for README.md and CLAUDE.md
 * This script can be run manually or integrated into CI/CD pipelines
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function getGitStatus() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.split('\n').filter(line => line.trim()).map(line => line.substring(3));
    } catch (error) {
        log('Warning: Could not get git status', 'yellow');
        return [];
    }
}

function getLastCommitInfo() {
    try {
        const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        const message = execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim();
        const date = execSync('git log -1 --pretty=%cd --date=short', { encoding: 'utf8' }).trim();
        return { hash, message, date };
    } catch (error) {
        log('Warning: Could not get git commit info', 'yellow');
        return null;
    }
}

function updateReadme(changedFiles = []) {
    const readmePath = 'README.md';

    if (!fs.existsSync(readmePath)) {
        log('README.md not found', 'red');
        return false;
    }

    let content = fs.readFileSync(readmePath, 'utf8');
    const timestamp = getCurrentTimestamp();
    const commitInfo = getLastCommitInfo();

    // Add changelog section if it doesn't exist
    if (!content.includes('## 📝 Changelog')) {
        content += '\n## 📝 Changelog\n\n';
    }

    // Create changelog entry
    let changelogEntry = `- **${timestamp}**:`;

    if (changedFiles.length > 0) {
        changelogEntry += ` Updated files: ${changedFiles.join(', ')}`;
    } else {
        changelogEntry += ' Project documentation updated';
    }

    if (commitInfo) {
        changelogEntry += ` (${commitInfo.hash}: ${commitInfo.message})`;
    }

    // Insert the new entry after the Changelog header
    const lines = content.split('\n');
    const changelogIndex = lines.findIndex(line => line.includes('## 📝 Changelog'));

    if (changelogIndex !== -1) {
        lines.splice(changelogIndex + 2, 0, changelogEntry);
        content = lines.join('\n');

        fs.writeFileSync(readmePath, content);
        log('✓ README.md updated with changelog entry', 'green');
        return true;
    }

    return false;
}

function updateClaude(changedFiles = []) {
    const claudePath = 'CLAUDE.md';

    if (!fs.existsSync(claudePath)) {
        log('CLAUDE.md not found', 'red');
        return false;
    }

    let content = fs.readFileSync(claudePath, 'utf8');
    const timestamp = getCurrentTimestamp();
    const commitInfo = getLastCommitInfo();

    // Add project updates section if it doesn't exist
    if (!content.includes('# Project Updates')) {
        content += '\n# Project Updates\n\n';
    }

    // Create update entry
    let updateEntry = `## ${timestamp}\n\n`;

    if (changedFiles.length > 0) {
        updateEntry += '**Modified Files:**\n';
        changedFiles.forEach(file => {
            updateEntry += `- ${file}\n`;
        });
        updateEntry += '\n';
    }

    updateEntry += '**Changes:**\n';
    if (commitInfo) {
        updateEntry += `- ${commitInfo.message} (${commitInfo.hash})\n`;
    } else {
        updateEntry += '- Project documentation updated\n';
    }
    updateEntry += '- Automated documentation sync\n\n';

    // Insert the new entry after the Project Updates header
    const lines = content.split('\n');
    const updatesIndex = lines.findIndex(line => line.includes('# Project Updates'));

    if (updatesIndex !== -1) {
        lines.splice(updatesIndex + 2, 0, updateEntry);
        content = lines.join('\n');

        fs.writeFileSync(claudePath, content);
        log('✓ CLAUDE.md updated with project changes', 'green');
        return true;
    }

    return false;
}

function addNpmScript() {
    const packagePath = 'package.json';

    if (!fs.existsSync(packagePath)) {
        log('package.json not found', 'red');
        return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }

    // Add our documentation update script
    if (!packageJson.scripts['docs:update']) {
        packageJson.scripts['docs:update'] = 'node .claude/commands/update-docs.js';
        packageJson.scripts['hooks:install'] = 'bash .claude/hooks/install-hooks.sh';

        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        log('✓ Added npm scripts: docs:update and hooks:install', 'green');
        return true;
    }

    return false;
}

function main() {
    log('🚀 Auto-documentation updater starting...', 'blue');

    const args = process.argv.slice(2);
    const changedFiles = args.length > 0 ? args : getGitStatus();

    log(`Files to document: ${changedFiles.join(', ') || 'none detected'}`, 'yellow');

    let updated = false;

    // Update documentation files
    if (updateReadme(changedFiles)) updated = true;
    if (updateClaude(changedFiles)) updated = true;

    // Add npm scripts if they don't exist
    addNpmScript();

    if (updated) {
        log('✅ Documentation updated successfully!', 'green');
        log('💡 Tip: Run "npm run hooks:install" to auto-update docs on every commit', 'blue');
    } else {
        log('ℹ️  No updates needed', 'yellow');
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { updateReadme, updateClaude };