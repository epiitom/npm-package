"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function createProject(projectName, options) {
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
    }
    catch (error) {
        // Clean up on error
        if (fs.existsSync(projectPath)) {
            fs.rmSync(projectPath, { recursive: true, force: true });
        }
        throw error;
    }
}
async function copyTemplate(templateName, projectPath) {
    const templatePath = path.join(__dirname, '../../templates', templateName);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template "${templateName}" not found`);
    }
    // Copy template files
    copyFolderRecursive(templatePath, projectPath);
}
function copyFolderRecursive(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        if (fs.statSync(sourcePath).isDirectory()) {
            copyFolderRecursive(sourcePath, targetPath);
        }
        else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}
async function initializePackageJson(projectName, projectPath) {
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
//# sourceMappingURL=command.js.map