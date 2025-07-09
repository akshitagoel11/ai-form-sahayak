# VS Code Setup Guide for AI Form Sahayak

This guide will help you run the AI Form Sahayak application in VS Code without any errors.

## Prerequisites

Make sure you have these installed:
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Prepare Your VS Code Environment

#### Install Recommended Extensions

Open VS Code and install these extensions:
- **ES7+ React/Redux/React-Native snippets** - For React development
- **TypeScript Importer** - For auto-imports
- **Prettier - Code formatter** - For code formatting
- **ESLint** - For linting
- **Tailwind CSS IntelliSense** - For CSS classes

### 2. Download and Extract Project Files

1. Download all project files to a folder on your computer
2. Open VS Code
3. Click **File** → **Open Folder** and select your project folder

### 3. Install Dependencies

Open VS Code terminal (`Ctrl+` ` or `View` → `Terminal`) and run:

```bash
npm install
```

If you get any errors, try:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json (if they exist)
rm -rf node_modules package-lock.json

# Install again
npm install
```

### 4. Run the Application

#### Option 1: Using Cross-Platform Script (Recommended)
```bash
node scripts/dev.js
```

#### Option 2: Using Batch File (Windows Only)
```bash
dev.bat
```

#### Option 3: Using npx directly
```bash
npx cross-env NODE_ENV=development tsx server/index.ts
```

#### Option 4: Manual Environment Setup
**Windows Command Prompt:**
```cmd
set NODE_ENV=development && npx tsx server/index.ts
```

**Windows PowerShell:**
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

**Mac/Linux:**
```bash
NODE_ENV=development npx tsx server/index.ts
```

You should see output like:
```
🚀 Starting AI Form Sahayak in development mode...
[express] serving on port 5000
```

### 5. Access the Application

Open your browser and go to: `http://localhost:5000`

## Troubleshooting Common Issues

### Issue: "NODE_ENV is not recognized" on Windows

This is the exact error you're seeing. **Solutions:**

**Solution 1: Use the batch file (Easiest)**
```cmd
dev.bat
```

**Solution 2: Use cross-platform script**
```bash
node scripts/dev.js
```

**Solution 3: Install cross-env and use npm scripts**
```bash
npm install cross-env
# Then use: npm run dev
```

### Issue: "npm install" fails with permission errors

**Solution for Windows:**
```cmd
npm config set prefix %APPDATA%\npm
npm install
```

**Solution for Mac/Linux:**
```bash
sudo npm install
```

### Issue: Port 5000 is already in use

**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or use a different port:**
```bash
PORT=3000 npm run dev
```

### Issue: TypeScript errors in VS Code

**Solution:**
1. Press `Ctrl+Shift+P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Issue: Camera/microphone not working

**Solution:**
1. Make sure you're using `https://` or `localhost`
2. Check browser permissions for camera/microphone
3. Try Google Chrome or Microsoft Edge (best compatibility)

### Issue: Voice recognition not working

**Solution:**
1. Use Google Chrome or Microsoft Edge
2. Check microphone permissions
3. Speak clearly and close to the microphone

## VS Code Configuration

### Recommended Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Workspace Settings

1. Open VS Code settings (`Ctrl+,`)
2. Click "Workspace" tab
3. Set these options:
   - Format on Save: ✓ Enabled
   - Default Formatter: Prettier
   - Auto Save: afterDelay

## Development Tips

### Running Different Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run check
```

### Debugging

1. Add breakpoints in VS Code by clicking left margin
2. Use browser developer tools (F12)
3. Check console for error messages

### Environment Variables

Create `.env` file in root directory (optional):
```env
NODE_ENV=development
PORT=5000
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # App pages
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Main server
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage
├── shared/                # Shared code
└── README.md              # Main documentation
```

## Testing the Application

1. **Home Page**: Should load without errors
2. **Language Toggle**: Switch between English/Hindi
3. **Voice Mode**: Click voice button and grant permissions
4. **Camera**: Test photo capture and document scanning
5. **Form Submission**: Fill and submit a form

## Performance Tips

- Use Chrome or Edge for best performance
- Close unnecessary browser tabs
- Ensure good internet connection for dependencies
- Use SSD storage for faster file operations

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Look at the VS Code terminal for server errors
3. Try restarting the development server
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

## Security Notes

- The application uses in-memory storage by default
- Camera and microphone permissions are required
- Use HTTPS in production
- Don't commit sensitive data to version control

## Next Steps

Once everything is working:
1. Explore the codebase
2. Make your modifications
3. Test thoroughly
4. Deploy to production when ready

The application should now run smoothly in VS Code with full functionality including voice recognition, camera access, and form processing.