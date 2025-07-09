#!/usr/bin/env node

// Cross-platform development script
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Set environment variable
process.env.NODE_ENV = 'development';

console.log('🚀 Starting AI Form Sahayak in development mode...');
console.log('📍 Environment: development');

// Start the server using tsx
const serverPath = join(rootDir, 'server', 'index.ts');
const child = spawn('npx', ['tsx', serverPath], {
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