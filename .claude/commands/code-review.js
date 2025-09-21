#!/usr/bin/env node

/**
 * /code:review command handler
 * Performs code review on a file or PR
 *
 * Args:
 * - path (file or PR): File path or PR number/URL
 *
 * Output: JSON list of review comments (line, severity, message, suggested_fix) + lint/test summary
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function codeReview(args) {
  const targetPath = args[0];

  if (!targetPath) {
    throw new Error('Path or PR is required. Usage: /code:review <path|PR>');
  }

  console.log(`🔍 Starting code review for: ${targetPath}`);

  try {
    // Determine if it's a PR or file path
    if (isPR(targetPath)) {
      return await reviewPR(targetPath);
    } else {
      return await reviewFile(targetPath);
    }
  } catch (error) {
    throw new Error(`Code review failed: ${error.message}`);
  }
}

function isPR(target) {
  // Check if it's a PR number or PR URL
  return /^(#?\d+|https:\/\/github\.com\/.+\/pull\/\d+)$/.test(target);
}

async function reviewPR(pr) {
  try {
    // Extract PR number
    const prNumber = pr.replace(/^#/, '').match(/\d+$/)?.[0];
    if (!prNumber) {
      throw new Error('Invalid PR format');
    }

    console.log(`📋 Reviewing PR #${prNumber}`);

    // Get PR info
    const prInfo = execSync(`gh pr view ${prNumber} --json title,body,files`, {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    const prData = JSON.parse(prInfo);

    // Get PR diff
    const diff = execSync(`gh pr diff ${prNumber}`, {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    // Analyze each changed file
    const reviewComments = [];
    const lintSummary = await runLintChecks();
    const testSummary = await runTestChecks();

    // Parse diff and analyze changes
    const diffAnalysis = parseDiff(diff);

    for (const file of diffAnalysis.files) {
      const fileComments = await analyzeFile(file.path, file.changes);
      reviewComments.push(...fileComments);
    }

    return {
      type: 'pr',
      prNumber,
      title: prData.title,
      body: prData.body,
      filesChanged: diffAnalysis.files.length,
      reviewComments,
      lintSummary,
      testSummary,
      summary: generateReviewSummary(reviewComments, lintSummary, testSummary)
    };

  } catch (error) {
    throw new Error(`PR review failed: ${error.message}`);
  }
}

async function reviewFile(filePath) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`📄 Reviewing file: ${filePath}`);

    const content = fs.readFileSync(fullPath, 'utf8');
    const stats = fs.statSync(fullPath);
    const extension = path.extname(filePath);

    // Analyze the file
    const reviewComments = await analyzeFile(filePath, content);
    const lintSummary = await runLintChecks([filePath]);
    const testSummary = await runTestChecks();

    return {
      type: 'file',
      path: filePath,
      size: stats.size,
      lines: content.split('\n').length,
      language: getLanguageFromExtension(extension),
      lastModified: stats.mtime,
      reviewComments,
      lintSummary,
      testSummary,
      summary: generateReviewSummary(reviewComments, lintSummary, testSummary)
    };

  } catch (error) {
    throw new Error(`File review failed: ${error.message}`);
  }
}

async function analyzeFile(filePath, content) {
  const comments = [];
  const lines = content.split('\n');
  const extension = path.extname(filePath);

  // Basic code quality checks
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Long lines
    if (line.length > 120) {
      comments.push({
        line: lineNumber,
        severity: 'warning',
        message: `Line too long (${line.length} characters). Consider breaking into multiple lines.`,
        suggested_fix: 'Break long line into multiple lines for better readability'
      });
    }

    // TODO/FIXME comments
    if (line.includes('TODO') || line.includes('FIXME')) {
      comments.push({
        line: lineNumber,
        severity: 'info',
        message: 'TODO/FIXME comment found',
        suggested_fix: 'Consider creating a proper issue tracker item for this'
      });
    }

    // Console.log statements (for JS/TS)
    if (['.js', '.jsx', '.ts', '.tsx'].includes(extension) && line.includes('console.log')) {
      comments.push({
        line: lineNumber,
        severity: 'warning',
        message: 'console.log statement found',
        suggested_fix: 'Remove console.log statements before production or use a proper logging library'
      });
    }

    // var usage (for JS/TS)
    if (['.js', '.jsx', '.ts', '.tsx'].includes(extension) && /\bvar\s+/.test(line)) {
      comments.push({
        line: lineNumber,
        severity: 'warning',
        message: 'Use of var keyword detected',
        suggested_fix: 'Use const or let instead of var for better scoping'
      });
    }

    // Missing semicolons (for JS/TS)
    if (['.js', '.jsx', '.ts', '.tsx'].includes(extension) && needsSemicolon(line)) {
      comments.push({
        line: lineNumber,
        severity: 'style',
        message: 'Missing semicolon',
        suggested_fix: 'Add semicolon at the end of the statement'
      });
    }
  });

  // Language-specific analysis
  if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
    comments.push(...analyzeJavaScript(content, filePath));
  } else if (['.py'].includes(extension)) {
    comments.push(...analyzePython(content, filePath));
  }

  return comments;
}

function analyzeJavaScript(content, filePath) {
  const comments = [];

  // Check for missing exports
  if (!content.includes('export') && !filePath.includes('test')) {
    comments.push({
      line: 1,
      severity: 'info',
      message: 'No exports found in module',
      suggested_fix: 'Consider adding exports to make this module reusable'
    });
  }

  // Check for large functions
  const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}/g) || [];
  functionMatches.forEach(func => {
    if (func.split('\n').length > 50) {
      comments.push({
        line: 1,
        severity: 'warning',
        message: 'Large function detected',
        suggested_fix: 'Consider breaking large functions into smaller, more focused functions'
      });
    }
  });

  return comments;
}

function analyzePython(content, filePath) {
  const comments = [];
  const lines = content.split('\n');

  // Check for missing docstrings
  if (content.includes('def ') && !content.includes('"""')) {
    comments.push({
      line: 1,
      severity: 'info',
      message: 'Functions found without docstrings',
      suggested_fix: 'Add docstrings to functions for better documentation'
    });
  }

  return comments;
}

function needsSemicolon(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.endsWith(';') || trimmed.endsWith('{') || trimmed.endsWith('}')) {
    return false;
  }

  // Simple heuristic for statements that need semicolons
  return /^(const|let|var|return|import|export|throw)\s/.test(trimmed) ||
         /\w+\s*=/.test(trimmed) ||
         /\w+\(.*\)$/.test(trimmed);
}

async function runLintChecks(files = []) {
  try {
    const command = files.length > 0
      ? `npm run lint -- ${files.join(' ')}`
      : 'npm run lint';

    const result = execSync(command, {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    return {
      passed: true,
      output: result.trim(),
      errors: 0,
      warnings: 0
    };
  } catch (error) {
    // Parse lint errors
    const output = error.stdout || error.stderr || '';
    const errors = (output.match(/error/gi) || []).length;
    const warnings = (output.match(/warning/gi) || []).length;

    return {
      passed: false,
      output: output.trim(),
      errors,
      warnings
    };
  }
}

async function runTestChecks() {
  try {
    // Check if there's a test script
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts?.test) {
      return {
        available: false,
        message: 'No test script found in package.json'
      };
    }

    const result = execSync('npm test', {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    return {
      available: true,
      passed: true,
      output: result.trim()
    };
  } catch (error) {
    return {
      available: true,
      passed: false,
      output: (error.stdout || error.stderr || '').trim()
    };
  }
}

function parseDiff(diff) {
  const files = [];
  const lines = diff.split('\n');
  let currentFile = null;

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      // Extract file path
      const match = line.match(/diff --git a\/(.+) b\/(.+)/);
      if (match) {
        currentFile = {
          path: match[2],
          changes: []
        };
        files.push(currentFile);
      }
    } else if (currentFile && (line.startsWith('+') || line.startsWith('-'))) {
      currentFile.changes.push(line);
    }
  }

  return { files };
}

function getLanguageFromExtension(ext) {
  const languages = {
    '.js': 'JavaScript',
    '.jsx': 'React/JSX',
    '.ts': 'TypeScript',
    '.tsx': 'React/TypeScript',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin'
  };
  return languages[ext] || 'Unknown';
}

function generateReviewSummary(comments, lintSummary, testSummary) {
  const errorCount = comments.filter(c => c.severity === 'error').length;
  const warningCount = comments.filter(c => c.severity === 'warning').length;
  const infoCount = comments.filter(c => c.severity === 'info').length;

  let summary = `Found ${comments.length} review comments: `;
  summary += `${errorCount} errors, ${warningCount} warnings, ${infoCount} info.`;

  if (lintSummary.passed) {
    summary += ' Linting passed.';
  } else {
    summary += ` Linting failed with ${lintSummary.errors} errors and ${lintSummary.warnings} warnings.`;
  }

  if (testSummary.available) {
    summary += testSummary.passed ? ' Tests passed.' : ' Tests failed.';
  } else {
    summary += ' No tests available.';
  }

  return summary;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  codeReview(args)
    .then(result => {
      console.log('\n📋 Code Review Summary:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    });
}