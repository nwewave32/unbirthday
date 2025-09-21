#!/usr/bin/env node

/**
 * Configuration and setup for auto-documentation system
 * Manages settings and provides utilities for documentation automation
 */

import fs from 'fs';
import path from 'path';

// Default configuration
export const defaultConfig = {
    // Files to monitor for changes
    watchPatterns: [
        '**/*.{js,jsx,ts,tsx}',
        '**/*.{py,rb,go,rs}',
        '**/*.{json,yaml,yml}',
        '**/*.md',
        'package.json',
        'Dockerfile',
        '.env.example'
    ],

    // Files to exclude from documentation updates
    excludePatterns: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        '*.log',
        '.DS_Store'
    ],

    // Documentation sections to update
    updateSections: {
        readme: {
            enabled: true,
            sections: ['changelog', 'installation', 'usage']
        },
        claude: {
            enabled: true,
            sections: ['updates', 'commands', 'workflow']
        }
    },

    // Commit message analysis
    commitAnalysis: {
        enabled: true,
        keywords: {
            feat: 'New feature',
            fix: 'Bug fix',
            docs: 'Documentation',
            style: 'Code style',
            refactor: 'Code refactoring',
            test: 'Tests',
            chore: 'Maintenance'
        }
    },

    // Auto-update behavior
    autoUpdate: {
        onCommit: true,
        onPush: false,
        onMerge: true,
        generateSummary: true
    }
};

export function loadConfig() {
    const configPath = '.claude/docs-config.json';

    if (fs.existsSync(configPath)) {
        try {
            const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return { ...defaultConfig, ...userConfig };
        } catch (error) {
            console.warn('Warning: Invalid config file, using defaults');
            return defaultConfig;
        }
    }

    return defaultConfig;
}

export function saveConfig(config) {
    const configPath = '.claude/docs-config.json';

    try {
        // Create .claude directory if it doesn't exist
        const claudeDir = path.dirname(configPath);
        if (!fs.existsSync(claudeDir)) {
            fs.mkdirSync(claudeDir, { recursive: true });
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config:', error.message);
        return false;
    }
}

export function initializeConfig() {
    const config = loadConfig();

    // Create default config file if it doesn't exist
    if (!fs.existsSync('.claude/docs-config.json')) {
        saveConfig(config);
        console.log('✓ Created default documentation config');
    }

    return config;
}

// CLI interface for configuration
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'init':
            initializeConfig();
            console.log('📝 Documentation configuration initialized');
            break;

        case 'show':
            console.log(JSON.stringify(loadConfig(), null, 2));
            break;

        case 'set':
            if (args.length < 3) {
                console.error('Usage: docs-config set <key> <value>');
                process.exit(1);
            }

            const config = loadConfig();
            const key = args[1];
            const value = JSON.parse(args[2]);

            // Simple dot notation support
            const keys = key.split('.');
            let current = config;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;

            if (saveConfig(config)) {
                console.log(`✓ Set ${key} = ${JSON.stringify(value)}`);
            }
            break;

        default:
            console.log(`
Documentation Configuration Tool

Commands:
  init    Initialize default configuration
  show    Display current configuration
  set     Set configuration value (dot notation supported)

Examples:
  docs-config init
  docs-config show
  docs-config set autoUpdate.onCommit true
  docs-config set updateSections.readme.enabled false
`);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}