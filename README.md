# AI Form Sahayak - Smart Government Form Assistant

A bilingual AI-powered government form assistant with voice guidance and speech recognition in English and Hindi.

## Features

- 🎙️ **Voice Recognition** - Fill forms using speech in English and Hindi
- 🌐 **Multilingual Support** - Complete UI translation between English and Hindi
- 📷 **Camera Integration** - Photo capture and document scanning
- ✍️ **Digital Signature** - Canvas-based signature pad
- 🏛️ **Government Schemes** - Support for various Indian government schemes
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM (or in-memory storage)
- **Voice**: Web Speech API
- **UI Components**: Shadcn/ui with Radix UI

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-form-sahayak.git
   cd ai-form-sahayak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## Environment Setup

Create a `.env` file (optional for PostgreSQL):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema

## Browser Requirements

- Chrome, Edge, or Safari (for Web Speech API support)
- Camera and microphone permissions required for full functionality

## Government Schemes Supported

- Pradhan Mantri Ujjwala Yojana
- Pradhan Mantri Awas Yojana
- Ayushman Bharat Scheme
- PM Kisan Samman Nidhi
- Sukanya Samriddhi Yojana
- National Scholarship Portal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support
For issues or questions, please create an issue on GitHub.