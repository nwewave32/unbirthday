#!/usr/bin/env node

/**
 * /project:create-task command handler
 * Creates a new task entry in Backlog.md and optionally creates a GitHub issue
 *
 * Args:
 * - title (required): Task title
 * - description (optional): Task description
 * - priority (optional): Task priority (low, medium, high)
 *
 * Output: Markdown task entry appended to Backlog.md + optional GitHub Issue link
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function createTask(args) {
  const { title, description, priority = 'medium' } = parseArgs(args);

  if (!title) {
    throw new Error('Task title is required. Usage: /project:create-task <title> [--description="desc"] [--priority=high]');
  }

  console.log(`📝 Creating task: ${title}`);

  try {
    // Check if backlog CLI is available
    try {
      execSync('which backlog', { stdio: 'ignore' });
      console.log('✅ Backlog CLI found, using CLI method');
      return await createTaskWithCLI(title, description, priority);
    } catch {
      console.log('⚠️  Backlog CLI not found, using direct Backlog.md method');
      return await createTaskDirect(title, description, priority);
    }
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

async function createTaskWithCLI(title, description, priority) {
  try {
    let command = `backlog task create "${title}"`;

    if (description) {
      command += ` -d "${description}"`;
    }

    if (priority !== 'medium') {
      command += ` --priority ${priority}`;
    }

    const result = execSync(command, {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    console.log('✅ Task created successfully via Backlog CLI');
    console.log(result);

    // Try to create GitHub issue if gh CLI is available
    const githubIssue = await createGitHubIssue(title, description, priority);

    return {
      method: 'backlog-cli',
      title,
      description,
      priority,
      backlogResult: result.trim(),
      githubIssue
    };
  } catch (error) {
    throw new Error(`Backlog CLI error: ${error.message}`);
  }
}

async function createTaskDirect(title, description, priority) {
  const backlogPath = path.join(process.cwd(), 'Backlog.md');
  const timestamp = new Date().toISOString().split('T')[0];
  const taskId = generateTaskId();

  const taskEntry = formatTaskEntry(taskId, title, description, priority, timestamp);

  try {
    // Create Backlog.md if it doesn't exist
    if (!fs.existsSync(backlogPath)) {
      const header = `# Project Backlog\n\nGenerated on ${timestamp}\n\n## Tasks\n\n`;
      fs.writeFileSync(backlogPath, header);
    }

    // Append task to Backlog.md
    fs.appendFileSync(backlogPath, taskEntry);

    console.log('✅ Task added to Backlog.md');

    // Try to create GitHub issue
    const githubIssue = await createGitHubIssue(title, description, priority);

    return {
      method: 'direct',
      title,
      description,
      priority,
      taskId,
      backlogPath,
      githubIssue
    };
  } catch (error) {
    throw new Error(`Failed to write to Backlog.md: ${error.message}`);
  }
}

async function createGitHubIssue(title, description, priority) {
  try {
    execSync('which gh', { stdio: 'ignore' });

    const labels = [`priority:${priority}`];
    const body = description || 'No description provided';

    const result = execSync(
      `gh issue create --title "${title}" --body "${body}" --label "${labels.join(',')}"`,
      { encoding: 'utf8', cwd: process.cwd() }
    );

    const issueUrl = result.trim();
    console.log(`✅ GitHub issue created: ${issueUrl}`);

    return {
      created: true,
      url: issueUrl,
      labels
    };
  } catch (error) {
    console.log('⚠️  GitHub CLI not available or issue creation failed');
    return {
      created: false,
      error: error.message
    };
  }
}

function parseArgs(args) {
  const parsed = {
    title: '',
    description: '',
    priority: 'medium'
  };

  // First argument is the title
  if (args.length > 0 && !args[0].startsWith('--')) {
    parsed.title = args[0];
  }

  // Parse named arguments
  args.forEach(arg => {
    if (arg.startsWith('--description=')) {
      parsed.description = arg.substring('--description='.length).replace(/^["']|["']$/g, '');
    } else if (arg.startsWith('--priority=')) {
      parsed.priority = arg.substring('--priority='.length);
    }
  });

  return parsed;
}

function generateTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function formatTaskEntry(taskId, title, description, priority, timestamp) {
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };

  return `
### ${priorityEmoji[priority]} ${title}

- **ID**: ${taskId}
- **Priority**: ${priority}
- **Created**: ${timestamp}
- **Status**: To Do

${description ? `**Description**: ${description}\n` : ''}
**Acceptance Criteria**:
- [ ] Define requirements
- [ ] Implement solution
- [ ] Add tests
- [ ] Update documentation

---

`;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  createTask(args)
    .then(result => {
      console.log('\n📋 Task Creation Summary:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    });
}