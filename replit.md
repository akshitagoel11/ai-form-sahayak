# replit.md

## Overview

AI Form Sahayak is a smart, multilingual government form assistant that helps users fill out government scheme applications using voice assistance. The application supports both English and Hindi languages and provides an intuitive interface for completing various government forms with step-by-step voice guidance.

## Recent Changes (January 2025)

### Enhanced Voice Recognition and Processing
- Improved speech-to-text processing for dates, states, and email formatting
- Added comprehensive state recognition for both English and Hindi
- Enhanced date parsing with month name recognition
- Better email formatting (lowercase, no spaces)
- Improved number and currency recognition for income fields

### Photo, Signature, and Document Features
- **Photo Capture**: Camera-based photo capture with gallery upload option
- **Digital Signature**: Canvas-based signature pad with touch/mouse support
- **Document Scanner**: Camera-based document scanning for identity, address, and income documents
- Modal interfaces for all capture components
- Real-time preview and retake functionality

### Form Schema Updates
- Extended base schema to include applicantPhoto, applicantSignature, identityDocument, addressProof, and incomeDocument fields
- All new fields are optional to maintain backward compatibility

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management, React Hook Form for form state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom government color scheme
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Middleware**: Express middleware for request logging and error handling

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Shared schema definitions between client and server
- **Development Storage**: In-memory storage for development/testing
- **Migrations**: Drizzle migrations in `./migrations` directory

## Key Components

### Voice Integration
- **Speech Recognition**: Web Speech API with support for English (en-IN) and Hindi (hi-IN)
- **Text-to-Speech**: Web Speech Synthesis API with language-specific voice selection
- **Voice Processing**: Custom utilities for processing voice input based on field types

### Form Management
- **Dynamic Forms**: Schema-driven form generation based on government schemes
- **Validation**: Zod schemas for both client and server-side validation
- **Multilingual Support**: Complete UI translation for English and Hindi

### Government Schemes
- **Predefined Schemes**: Six government schemes with multilingual metadata
- **Form Fields**: Common fields (name, contact, address) plus scheme-specific fields
- **Data Structure**: JSON-based form data storage with language preference

## Data Flow

1. **User Journey**: Home → Scheme Selection → Form Filling → Submission
2. **Voice Interaction**: Field selection → Voice prompt → Speech recognition → Field population
3. **Form Submission**: Client validation → API submission → Database storage → Response handling
4. **Language Switching**: Real-time UI updates and voice settings adjustment

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state and validation
- **@hookform/resolvers**: Zod integration for form validation

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Voice Dependencies
- **Web Speech API**: Browser-native speech recognition and synthesis
- **Custom hooks**: useSpeechRecognition and useTextToSpeech for voice functionality

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **Environment**: NODE_ENV=development
- **Database**: Requires DATABASE_URL environment variable

### Production
- **Build Process**: Vite build for frontend, esbuild for backend
- **Server Bundle**: Single ESM bundle with external packages
- **Static Assets**: Served from `/dist/public`
- **Environment**: NODE_ENV=production

### Database Setup
- **Schema Push**: `npm run db:push` command for development
- **Migrations**: Drizzle migrations for production deployments
- **Connection**: PostgreSQL via DATABASE_URL environment variable

### Replit Integration
- **Development Banner**: Replit development banner for external access
- **Cartographer Plugin**: Development-only mapping plugin
- **Runtime Error Overlay**: Enhanced error reporting in development