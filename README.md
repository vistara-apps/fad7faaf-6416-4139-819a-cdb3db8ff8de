# EduConnect - Base MiniApp

**Find your study squad and connect over shared interests.**

EduConnect is a Base MiniApp that connects students for study groups and niche interests on the Base network. Built with Next.js, Supabase, and integrated with Farcaster for social authentication.

## 🚀 Features

### Core Features
- **Study Group Finder**: Create or join study groups based on specific courses, subjects, or exam preparation
- **Interest-Based Circles**: Join communities around non-academic interests like hobbies, career paths, or social causes
- **On-Demand Study Help**: Get quick, informal Q&A sessions between students

### Technical Features
- **Farcaster Authentication**: Sign in with your Farcaster account
- **Base Network Integration**: Built as a Base MiniApp using OnchainKit
- **Real-time Data**: Powered by Supabase for real-time updates
- **Social Sharing**: Announce study groups and help requests on Farcaster
- **Responsive Design**: Optimized for mobile and desktop

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Farcaster via Neynar API
- **Blockchain**: Base network via OnchainKit
- **Wallet**: Privy for wallet management
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Neynar API key for Farcaster integration
- A Privy account for wallet management
- An OnchainKit API key from Coinbase

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd educonnect-base-miniapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API keys:

```env
# Base MiniApp Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Neynar API Configuration (for Farcaster integration)
NEYNAR_API_KEY=your_neynar_api_key

# Privy Configuration (for wallet management)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the script to create all tables, indexes, and sample data

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 API Configuration

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database schema from `database/schema.sql`
4. Configure Row Level Security (RLS) policies (included in schema)

### Neynar API Setup

1. Sign up at [neynar.com](https://neynar.com)
2. Create a new API key
3. Add the key to your environment variables

### Privy Setup

1. Create an account at [privy.io](https://privy.io)
2. Create a new app and get your App ID
3. Configure your app settings for Base network support

### OnchainKit Setup

1. Get an API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Add the key to your environment variables

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── study-groups/  # Study group CRUD operations
│   │   ├── circles/       # Circle management
│   │   └── help-requests/ # Help request system
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main application page
│   └── providers.tsx     # Context providers
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── contexts/         # React contexts
│   ├── constants.ts      # App constants
│   ├── database.types.ts # Database type definitions
│   ├── neynar.ts        # Farcaster API client
│   ├── supabase.ts      # Supabase client and helpers
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
├── database/             # Database schema and migrations
│   └── schema.sql       # Complete database setup
└── public/              # Static assets
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Colors**: Primary (blue), Accent (green), Surface (white), Text (gray scale)
- **Typography**: Display, Heading, Body text styles
- **Spacing**: Consistent spacing scale (sm: 8px, md: 12px, lg: 16px)
- **Components**: Modular UI components with variants

## 🔐 Authentication Flow

1. User clicks "Sign In with Farcaster"
2. MiniKit handles Farcaster authentication
3. App receives Farcaster ID (FID)
4. Backend validates FID with Neynar API
5. User profile is created/updated in Supabase
6. Session is stored locally for persistence

## 📊 Database Schema

The application uses the following main entities:

- **Users**: Farcaster profiles with interests and courses
- **Study Groups**: Course-specific study groups with members
- **Circles**: Interest-based communities
- **Help Requests**: Q&A system for academic help
- **Messages**: Chat system for study groups

See `database/schema.sql` for the complete schema with relationships and indexes.

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to update these for production:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 📱 Base MiniApp Integration

This app is built as a Base MiniApp and includes:

- MiniKit integration for Base network interactions
- Optimized for mobile-first experience
- Frame-ready for Farcaster integration
- Wallet connection via Privy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the environment variable setup
3. Ensure all API keys are correctly configured
4. Check Supabase database setup

## 🔗 Links

- [Base Network](https://base.org/)
- [Farcaster](https://farcaster.xyz/)
- [Supabase](https://supabase.com/)
- [Neynar](https://neynar.com/)
- [Privy](https://privy.io/)
- [OnchainKit](https://onchainkit.xyz/)

---

Built with ❤️ for the Base ecosystem
