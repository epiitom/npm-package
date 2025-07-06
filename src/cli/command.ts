import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ProjectOptions {
  template: string;
  force: boolean;
}

export async function createProject(projectName: string, options: ProjectOptions): Promise<void> {
  if (!projectName) {
    throw new Error('Project name is required');
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  
  // Check if directory exists
  if (fs.existsSync(projectPath) && !options.force) {
    throw new Error(`Directory ${projectName} already exists. Use --force to overwrite.`);
  }

  // Create project directory
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  console.log(`Creating project: ${projectName}`);
  console.log(`Template: ${options.template}`);
  console.log(`Project path: ${projectPath}`);

  try {
    // Copy template files based on the selected template
    await copyTemplate(options.template, projectPath);
    
    // Initialize package.json
    await initializePackageJson(projectName, projectPath);
    
    console.log('Project created successfully!');
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    throw error;
  }
}

async function copyTemplate(templateName: string, projectPath: string): Promise<void> {
  const templatePath = path.join(__dirname, '../../templates', templateName);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateName}" not found`);
  }

  // Copy template files
  copyFolderRecursive(templatePath, projectPath);
}

function copyFolderRecursive(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

async function initializePackageJson(projectName: string, projectPath: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: 'A full-stack application',
      scripts: {
        'install:all': 'npm install && cd frontend && npm install && cd ../backend && npm install',
        'dev': 'concurrently "npm run dev:backend" "npm run dev:frontend"',
        'dev:frontend': 'cd frontend && npm run dev',
        'dev:backend': 'cd backend && npm run dev'
      },
      devDependencies: {
        'concurrently': '^8.2.2'
      }
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}