#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

console.log('🚀 Setting up AI Form Sahayak...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Are you in the correct directory?');
  process.exit(1);
}

async function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr && !stderr.includes('npm WARN')) {
      console.warn('⚠️  Warning:', stderr);
    }
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function main() {
  try {
    // Install dependencies
    const installSuccess = await runCommand('npm install', 'Installing dependencies');
    if (!installSuccess) {
      console.log('\n💡 Trying alternative installation methods...');
      
      // Try clearing cache and reinstalling
      await runCommand('npm cache clean --force', 'Clearing npm cache');
      const retryInstall = await runCommand('npm install --legacy-peer-deps', 'Retrying installation');
      
      if (!retryInstall) {
        console.error('\n❌ Installation failed. Please try manually:');
        console.log('   1. npm cache clean --force');
        console.log('   2. rm -rf node_modules package-lock.json');
        console.log('   3. npm install');
        process.exit(1);
      }
    }

    // Check if TypeScript is working
    const tscCheck = await runCommand('npx tsc --noEmit', 'Checking TypeScript');
    if (!tscCheck) {
      console.warn('⚠️  TypeScript check failed, but this might be OK for development');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. npm run dev         # Start development server');
    console.log('   2. Open http://localhost:5000 in your browser');
    console.log('   3. Grant camera and microphone permissions when prompted');
    console.log('\n💡 For best experience, use Chrome or Edge browser');
    console.log('📖 See README.md for detailed instructions and troubleshooting');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();