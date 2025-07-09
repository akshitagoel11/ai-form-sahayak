#!/usr/bin/env node

// Cross-platform production script
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Set environment variable
process.env.NODE_ENV = 'production';

console.log('🚀 Starting AI Form Sahayak in production mode...');
console.log('📍 Environment: production');

// Check if build exists
const buildPath = join(rootDir, 'dist', 'index.js');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build not found. Please run "npm run build" first.');
  process.exit(1);
}

// Start the production server
const child = spawn('node', [buildPath], {
  stdio: 'inherit',
  env: process.env,
  cwd: rootDir
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  child.kill('SIGTERM');
});