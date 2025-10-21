# Foliomesh

Create stunning portfolios without coding. Showcase your work, connect with opportunities.

## Features

- 🎨 **No-Code Editor**: Drag, drop, and customize with an intuitive visual editor
- 🌐 **Custom Subdomains**: Get your own subdomain (yourname.foliomesh.com)
- 🔒 **Privacy Controls**: Public portfolios or private with shareable links
- 🐙 **GitHub Integration**: Automatically showcase your repositories
- 🌍 **Auto Translation**: Your portfolio translates for global visitors
- 🎭 **Dark/Light Mode**: Beautiful themes that adapt to user preferences
- 📱 **Mobile Responsive**: Looks great on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Translation**: DeepL API
- **Rate Limiting**: Upstash Redis
- **GitHub Integration**: Octokit

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/foliomesh.git
cd foliomesh
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure your environment variables in \`.env\`

5. Set up the database:
\`\`\`bash
npm run db:push
npm run db:generate
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Required Services Setup

### 1. Supabase (Database + Auth + Storage)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API
4. Enable Google OAuth in Authentication > Providers
5. Configure redirect URL: \`http://localhost:3000/auth/callback\`

### 2. Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: \`YOUR_SUPABASE_URL/auth/v1/callback\`

### 3. DeepL (Translation)
1. Sign up at [deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Get your API key from account settings

### 4. Upstash Redis (Rate Limiting)
1. Sign up at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Get REST URL and token

### 5. GitHub (Optional - for repo integration)
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: \`http://localhost:3000/api/auth/github/callback\`

## Development

### Local Subdomain Testing

Add these entries to your hosts file (\`C:\\Windows\\System32\\drivers\\etc\\hosts\` on Windows):

\`\`\`
127.0.0.1 foliomesh.local
127.0.0.1 kevinmendoza.foliomesh.local
127.0.0.1 johnsmith.foliomesh.local
\`\`\`

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run db:generate\` - Generate Prisma client
- \`npm run db:push\` - Push schema to database
- \`npm run db:migrate\` - Run database migrations
- \`npm run db:studio\` - Open Prisma Studio

## Project Structure

\`\`\`
foliomesh/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── portfolio/         # Portfolio viewer
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── editor/           # Portfolio editor components
│   └── portfolio/        # Portfolio display components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please [open an issue](https://github.com/yourusername/foliomesh/issues) or contact us at support@foliomesh.com.