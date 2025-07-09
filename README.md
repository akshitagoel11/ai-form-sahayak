# AI Form Sahayak - Government Form Assistant

A bilingual AI-powered government form assistant with voice guidance and speech recognition in English and Hindi.

## Features

- 🎙️ Voice-guided form filling with speech recognition
- 📱 Multilingual support (English & Hindi)
- 📷 Camera integration for photo capture and document scanning
- ✍️ Digital signature pad
- 🏛️ Government scheme applications
- 🌐 Real-time language switching
- 📋 Form validation and submission

## Prerequisites

Before running the application, ensure you have:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** database (optional - uses in-memory storage by default)

## Quick Start

### 1. Clone or Download the Project

If you have the project files, ensure all files are in your VS Code workspace.

### 2. Install Dependencies

Open terminal in VS Code and run:

```bash
npm install
```

### 3. Environment Setup (Optional)

If you want to use PostgreSQL database, create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

**Note:** The application works without database setup using in-memory storage.

### 4. Run the Application

Start the development server:

**For Windows (if you get NODE_ENV error):**
```bash
dev.bat
```

**For all platforms:**
```bash
node scripts/dev.js
```

**Using npm (after installing cross-env):**
```bash
npm run dev
```

This will start:
- Backend server on port 5000
- Frontend with hot reload
- Both accessible at `http://localhost:5000`

### 5. Access the Application

Open your browser and go to: `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema (if using PostgreSQL)

## Browser Requirements

For full functionality, use a modern browser that supports:
- Web Speech API (Chrome, Edge, Safari)
- MediaDevices API (for camera access)
- ES6+ features

## Troubleshooting

### Common Issues and Solutions

#### 1. "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### 2. Port 5000 already in use
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change port in package.json scripts
```

#### 3. TypeScript errors
```bash
# Install TypeScript globally
npm install -g typescript

# Check TypeScript version
tsc --version
```

#### 4. Camera not working
- Ensure HTTPS or localhost (required for camera access)
- Check browser permissions for camera access
- Try different browsers (Chrome recommended)

#### 5. Voice recognition not working
- Ensure microphone permissions are granted
- Check browser console for errors
- Try Chrome or Edge browsers

### Database Setup (Optional)

If you want to use PostgreSQL instead of in-memory storage:

1. Install PostgreSQL locally
2. Create a database
3. Add DATABASE_URL to `.env` file
4. Run: `npm run db:push`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
└── package.json           # Dependencies and scripts
```

## Development Tips

### VS Code Extensions (Recommended)

Install these extensions for better development experience:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

### VS Code Settings

Add to your `.vscode/settings.json`:

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

## API Endpoints

- `GET /api/schemes` - Get all government schemes
- `GET /api/schemes/:id` - Get specific scheme details
- `POST /api/form-submissions` - Submit form data
- `GET /api/form-submissions` - Get form submissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all dependencies are installed correctly
4. Try running with different browsers

## Additional Notes

- The application uses in-memory storage by default - data resets on server restart
- For production, configure PostgreSQL database
- Camera and microphone permissions are required for full functionality
- Works best in Chrome or Edge browsers for voice features