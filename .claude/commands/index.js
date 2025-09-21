#!/usr/bin/env node

/**
 * Claude Commands CLI Entry Point
 *
 * Usage: node commands/index.js <command> [args...]
 *
 * Available commands:
 * - project:create-task <title> [--description="desc"] [--priority=high]
 * - code:review <path>
 * - code:refactor <path> [--style=standard]
 */

import { createTask } from './create-task.js';
import { codeReview } from './code-review.js';
import { codeRefactor } from './code-refactor.js';

const commands = {
  'project:create-task': createTask,
  'code:review': codeReview,
  'code:refactor': codeRefactor
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🤖 Claude Commands CLI');
    console.log('');
    console.log('Available commands:');
    console.log('');
    console.log('📋 /project:create-task <title> [--description="desc"] [--priority=high]');
    console.log('   → Creates a new task in Backlog.md and optionally GitHub issue');
    console.log('');
    console.log('🔍 /code:review <path>');
    console.log('   → Reviews code file or PR with detailed analysis');
    console.log('');
    console.log('🔧 /code:refactor <path> [--style=standard]');
    console.log('   → Refactors code with automatic improvements and PR creation');
    console.log('');
    console.log('Examples:');
    console.log('  node .claude/commands/index.js project:create-task "New feature"');
    console.log('  node .claude/commands/index.js code:review src/App.tsx');
    console.log('  node .claude/commands/index.js code:refactor src/utils --style=modern');
    console.log('');
    return;
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  if (!commands[commandName]) {
    console.error(`❌ Unknown command: ${commandName}`);
    console.log('');
    console.log('Available commands:');
    Object.keys(commands).forEach(name => {
      console.log(`  ${name}`);
    });
    process.exit(1);
  }

  try {
    console.log(`🚀 Executing: ${commandName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const result = await commands[commandName](commandArgs);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Command completed successfully');

    if (result && typeof result === 'object') {
      console.log('');
      console.log('📊 Result Summary:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { commands, main };