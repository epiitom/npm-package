#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');

// Import the compiled CLI functions
const { createProject } = require('../dist/cli/command');

program
  .name('create-fullstack-app')
  .description('Create a new full-stack application')
  .version('1.0.0')
  .argument('[project-name]', 'name of the project')
  .option('-t, --template <template>', 'template to use (fullstack, frontend, backend)', 'fullstack')
  .option('-f, --force', 'overwrite existing directory')
  .action(async (projectName, options) => {
    try {
      console.log(chalk.blue('🚀 Creating your full-stack project...'));
      await createProject(projectName, options);
      console.log(chalk.green('✅ Project created successfully!'));
      console.log(chalk.yellow('\nNext steps:'));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white('  npm run install:all'));
      console.log(chalk.white('  npm run dev'));
    } catch (error) {
      console.error(chalk.red('❌ Error creating project:'), error.message);
      process.exit(1);
    }
  });

program.parse();