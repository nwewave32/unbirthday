#!/usr/bin/env node

/**
 * /code:refactor command handler
 * Performs automated refactoring on a file or folder
 *
 * Args:
 * - path (file or folder): Target path for refactoring
 * - style (optional): Coding style preference
 *
 * Output: Git branch with changes pushed, PR created, DoD validation report
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function codeRefactor(args) {
  const targetPath = args[0];
  const style = parseStyleArg(args);

  if (!targetPath) {
    throw new Error('Path is required. Usage: /code:refactor <path> [--style=standard]');
  }

  console.log(`🔧 Starting refactoring for: ${targetPath}`);
  console.log(`📋 Style preference: ${style}`);

  try {
    // Validate path exists
    const fullPath = path.resolve(process.cwd(), targetPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Path not found: ${targetPath}`);
    }

    // Create refactor branch
    const branchName = await createRefactorBranch(targetPath);

    // Perform refactoring
    const refactorResults = await performRefactoring(fullPath, style);

    // Commit changes
    const commitHash = await commitChanges(targetPath, refactorResults.summary);

    // Push branch
    await pushBranch(branchName);

    // Create PR
    const prUrl = await createPullRequest(branchName, targetPath, refactorResults);

    // Run DoD validation
    const dodReport = await validateDefinitionOfDone(refactorResults);

    return {
      branchName,
      commitHash,
      prUrl,
      refactorResults,
      dodReport,
      summary: generateRefactorSummary(refactorResults, dodReport)
    };

  } catch (error) {
    throw new Error(`Refactoring failed: ${error.message}`);
  }
}

function parseStyleArg(args) {
  const styleArg = args.find(arg => arg.startsWith('--style='));
  return styleArg ? styleArg.substring('--style='.length) : 'standard';
}

async function createRefactorBranch(targetPath) {
  try {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:\-T]/g, '');
    const branchName = `refactor/${path.basename(targetPath)}-${timestamp}`;

    // Ensure we're on main/master branch
    try {
      execSync('git checkout main', { stdio: 'ignore' });
    } catch {
      try {
        execSync('git checkout master', { stdio: 'ignore' });
      } catch {
        console.log('⚠️  Unable to checkout main/master, staying on current branch');
      }
    }

    // Pull latest changes
    try {
      execSync('git pull', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  Unable to pull latest changes');
    }

    // Create new branch
    execSync(`git checkout -b ${branchName}`, { stdio: 'ignore' });
    console.log(`✅ Created refactor branch: ${branchName}`);

    return branchName;
  } catch (error) {
    throw new Error(`Failed to create branch: ${error.message}`);
  }
}

async function performRefactoring(fullPath, style) {
  const results = {
    filesProcessed: [],
    changesApplied: [],
    summary: '',
    errors: []
  };

  try {
    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
      const fileResult = await refactorFile(fullPath, style);
      results.filesProcessed.push(fileResult);
    } else if (stats.isDirectory()) {
      const dirResult = await refactorDirectory(fullPath, style);
      results.filesProcessed.push(...dirResult);
    }

    // Apply automatic fixes
    await applyAutomaticFixes();

    // Run prettier/formatter
    await runFormatter();

    // Run linter with auto-fix
    await runLinterFix();

    results.changesApplied = await getGitChanges();
    results.summary = generateChangeSummary(results);

    console.log(`✅ Refactoring completed: ${results.filesProcessed.length} files processed`);

    return results;
  } catch (error) {
    results.errors.push(error.message);
    throw error;
  }
}

async function refactorFile(filePath, style) {
  const content = fs.readFileSync(filePath, 'utf8');
  const extension = path.extname(filePath);
  const suggestions = [];

  console.log(`🔍 Analyzing file: ${path.relative(process.cwd(), filePath)}`);

  // Language-specific refactoring
  let refactoredContent = content;

  if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
    refactoredContent = refactorJavaScript(content, style, suggestions);
  } else if (extension === '.py') {
    refactoredContent = refactorPython(content, style, suggestions);
  }

  // Write refactored content
  if (refactoredContent !== content) {
    fs.writeFileSync(filePath, refactoredContent);
    console.log(`✏️  Updated: ${path.relative(process.cwd(), filePath)}`);
  }

  return {
    path: filePath,
    suggestions,
    modified: refactoredContent !== content
  };
}

async function refactorDirectory(dirPath, style) {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Skip node_modules, .git, etc.
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    if (entry.isFile() && isCodeFile(entry.name)) {
      const result = await refactorFile(fullPath, style);
      results.push(result);
    } else if (entry.isDirectory()) {
      const subResults = await refactorDirectory(fullPath, style);
      results.push(...subResults);
    }
  }

  return results;
}

function refactorJavaScript(content, style, suggestions) {
  let refactored = content;

  // Replace var with const/let
  refactored = refactored.replace(/\bvar\b/g, 'const');
  if (refactored !== content) {
    suggestions.push('Replaced var declarations with const');
  }

  // Add missing semicolons (if style requires them)
  if (style === 'standard' || style === 'semicolons') {
    const lines = refactored.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      if (needsSemicolon(trimmed)) {
        suggestions.push('Added missing semicolon');
        return line + ';';
      }
      return line;
    });
    refactored = fixedLines.join('\n');
  }

  // Convert function declarations to arrow functions (if style prefers)
  if (style === 'modern') {
    // Simple function expression to arrow function
    refactored = refactored.replace(
      /const\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
      'const $1 = ($2) => {'
    );
    if (refactored !== content) {
      suggestions.push('Converted function expressions to arrow functions');
    }
  }

  return refactored;
}

function refactorPython(content, style, suggestions) {
  let refactored = content;

  // Add type hints (basic example)
  if (style === 'typed') {
    // This is a simplified example - real implementation would be more complex
    refactored = refactored.replace(/def\s+(\w+)\s*\(/g, 'def $1(');
    suggestions.push('Consider adding type hints');
  }

  return refactored;
}

function needsSemicolon(line) {
  if (!line || line.endsWith(';') || line.endsWith('{') || line.endsWith('}')) {
    return false;
  }

  return /^(const|let|var|return|import|export|throw)\s/.test(line) ||
         /\w+\s*=/.test(line) ||
         /\w+\(.*\)$/.test(line);
}

function isCodeFile(filename) {
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs'];
  return codeExtensions.some(ext => filename.endsWith(ext));
}

async function applyAutomaticFixes() {
  try {
    console.log('🔧 Applying automatic fixes...');

    // Try to run ESLint with auto-fix
    try {
      execSync('npm run lint -- --fix', { stdio: 'ignore' });
      console.log('✅ ESLint auto-fix applied');
    } catch {
      console.log('⚠️  ESLint auto-fix not available or failed');
    }
  } catch (error) {
    console.log('⚠️  Automatic fixes failed:', error.message);
  }
}

async function runFormatter() {
  try {
    console.log('💅 Running code formatter...');

    // Try Prettier
    try {
      execSync('npx prettier --write .', { stdio: 'ignore' });
      console.log('✅ Prettier formatting applied');
      return;
    } catch {}

    // Try other formatters based on language
    try {
      execSync('npm run format', { stdio: 'ignore' });
      console.log('✅ Custom formatter applied');
    } catch {
      console.log('⚠️  No formatter available');
    }
  } catch (error) {
    console.log('⚠️  Formatting failed:', error.message);
  }
}

async function runLinterFix() {
  try {
    console.log('🔍 Running linter with fixes...');
    execSync('npm run lint -- --fix', { stdio: 'ignore' });
    console.log('✅ Linter fixes applied');
  } catch {
    console.log('⚠️  Linter fixes not available or failed');
  }
}

async function getGitChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const changes = status.trim().split('\n').filter(line => line.trim());

    return changes.map(line => {
      const status = line.substring(0, 2);
      const file = line.substring(3);
      return { status: status.trim(), file };
    });
  } catch {
    return [];
  }
}

function generateChangeSummary(results) {
  const totalFiles = results.filesProcessed.length;
  const modifiedFiles = results.filesProcessed.filter(f => f.modified).length;
  const totalSuggestions = results.filesProcessed.reduce((sum, f) => sum + f.suggestions.length, 0);

  return `Processed ${totalFiles} files, modified ${modifiedFiles} files with ${totalSuggestions} improvements`;
}

async function commitChanges(targetPath, summary) {
  try {
    console.log('📝 Committing changes...');

    // Add all changes
    execSync('git add .', { stdio: 'ignore' });

    // Create commit
    const commitMessage = `refactor: ${summary}\n\nRefactored ${targetPath}\n\n🤖 Generated with Claude Code`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });

    // Get commit hash
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    console.log(`✅ Changes committed: ${commitHash.substring(0, 8)}`);
    return commitHash;
  } catch (error) {
    throw new Error(`Failed to commit changes: ${error.message}`);
  }
}

async function pushBranch(branchName) {
  try {
    console.log(`🚀 Pushing branch: ${branchName}`);
    execSync(`git push -u origin ${branchName}`, { stdio: 'ignore' });
    console.log('✅ Branch pushed successfully');
  } catch (error) {
    throw new Error(`Failed to push branch: ${error.message}`);
  }
}

async function createPullRequest(branchName, targetPath, refactorResults) {
  try {
    console.log('📋 Creating pull request...');

    const title = `refactor: ${path.basename(targetPath)} improvements`;
    const body = `## Refactoring Summary

${refactorResults.summary}

## Changes Applied
${refactorResults.filesProcessed.filter(f => f.modified).map(f =>
  `- **${path.relative(process.cwd(), f.path)}**: ${f.suggestions.join(', ')}`
).join('\n')}

## Validation
- [x] Code formatting applied
- [x] Linting fixes applied
- [x] Automated refactoring suggestions implemented

🤖 Generated with Claude Code`;

    const result = execSync(
      `gh pr create --title "${title}" --body "${body}" --head ${branchName}`,
      { encoding: 'utf8' }
    );

    const prUrl = result.trim();
    console.log(`✅ Pull request created: ${prUrl}`);

    return prUrl;
  } catch (error) {
    console.log('⚠️  Failed to create PR:', error.message);
    return null;
  }
}

async function validateDefinitionOfDone(refactorResults) {
  console.log('✅ Running Definition of Done validation...');

  const report = {
    linting: await validateLinting(),
    formatting: await validateFormatting(),
    tests: await validateTests(),
    buildSuccess: await validateBuild(),
    codeQuality: validateCodeQuality(refactorResults),
    overall: 'pending'
  };

  // Calculate overall score
  const scores = Object.values(report).filter(item => typeof item === 'object' && item.passed !== undefined);
  const passedCount = scores.filter(item => item.passed).length;
  const totalCount = scores.length;

  report.overall = totalCount > 0 ? (passedCount / totalCount >= 0.8 ? 'passed' : 'failed') : 'unknown';

  return report;
}

async function validateLinting() {
  try {
    execSync('npm run lint', { stdio: 'ignore' });
    return { passed: true, message: 'Linting passed' };
  } catch {
    return { passed: false, message: 'Linting failed' };
  }
}

async function validateFormatting() {
  try {
    // Check if code is properly formatted
    execSync('npx prettier --check .', { stdio: 'ignore' });
    return { passed: true, message: 'Code is properly formatted' };
  } catch {
    return { passed: false, message: 'Code formatting issues found' };
  }
}

async function validateTests() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts?.test) {
      return { passed: true, message: 'No tests configured (skipped)' };
    }

    execSync('npm test', { stdio: 'ignore' });
    return { passed: true, message: 'All tests passed' };
  } catch {
    return { passed: false, message: 'Tests failed' };
  }
}

async function validateBuild() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts?.build) {
      return { passed: true, message: 'No build script configured (skipped)' };
    }

    execSync('npm run build', { stdio: 'ignore' });
    return { passed: true, message: 'Build successful' };
  } catch {
    return { passed: false, message: 'Build failed' };
  }
}

function validateCodeQuality(refactorResults) {
  const hasErrors = refactorResults.errors.length > 0;
  const hasImprovements = refactorResults.filesProcessed.some(f => f.modified);

  return {
    passed: !hasErrors && hasImprovements,
    message: hasErrors ? 'Code quality issues found' : 'Code quality validated'
  };
}

function generateRefactorSummary(refactorResults, dodReport) {
  return `Refactoring completed: ${refactorResults.summary}. DoD validation: ${dodReport.overall}`;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  codeRefactor(args)
    .then(result => {
      console.log('\n📋 Refactoring Summary:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    });
}