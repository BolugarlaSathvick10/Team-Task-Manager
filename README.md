# TeamFlow - Collaborative Task Management Platform

A modern full-stack web application for team task management with role-based access control. Built with Next.js, Prisma, and PostgreSQL.

## Features

### Admin Features
- 📊 Dashboard with analytics and progress tracking
- 📁 Create, edit, and delete projects
- 👥 Manage team members
- 📋 Create and assign tasks to users
- 📈 View real-time project completion progress
- 🔍 Search and filter capabilities

### User Features
- ✅ View assigned tasks and projects
- 📝 Update task status (Pending → In Progress → Completed)
- 📊 View personal task completion statistics
- 🎯 Track task priorities and deadlines

## Tech Stack

- **Frontend + Backend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon recommended)
- **ORM**: Prisma
- **Authentication**: JWT-based
- **Password Hashing**: bcryptjs
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, AWS RDS, or local)

## Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd teamflow

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database URL (Neon PostgreSQL)
# Get your URL from https://console.neon.tech
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/teamflow?sslmode=require"

# JWT Secret (change this for production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migrations (for new database)
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

### Admin Account
- **Email**: admin@teamflow.com
- **Password**: admin123

### User Account
- **Email**: user@teamflow.com
- **Password**: user123

## Project Structure

```
teamflow/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── projects/     # Project management
│   │   ├── tasks/        # Task management
│   │   ├── users/        # User management
│   │   └── analytics/    # Analytics data
│   ├── admin/            # Admin dashboard and pages
│   ├── user/             # User dashboard and pages
│   └── login/            # Login page
├── components/           # Reusable React components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Prisma client
│   ├── types.ts         # TypeScript types
│   └── validations.ts   # Input validation
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── public/              # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Create user (admin only)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (admin only)

### Tasks
- `GET /api/tasks` - Get tasks with filters
- `POST /api/tasks` - Create task (admin only)
- `GET /api/tasks/[id]` - Get task details
- `PUT /api/tasks/[id]` - Update task (users can update their own tasks)
- `DELETE /api/tasks/[id]` - Delete task (admin only)

### Users
- `GET /api/users` - Get all users (admin only)

### Analytics
- `GET /api/analytics` - Get dashboard analytics

## Database Schema

### Users
```
- id (string, primary)
- name (string)
- email (string, unique)
- password (string, hashed)
- role (enum: ADMIN, USER)
- tasks (relation)
- createdAt, updatedAt
```

### Projects
```
- id (string, primary)
- title (string)
- description (string, optional)
- deadline (datetime, optional)
- tasks (relation)
- createdAt, updatedAt
```

### Tasks
```
- id (string, primary)
- title (string)
- description (string, optional)
- status (enum: PENDING, IN_PROGRESS, COMPLETED)
- priority (enum: LOW, MEDIUM, HIGH)
- dueDate (datetime, optional)
- assignedToId (string, foreign key)
- projectId (string, foreign key)
- assignedTo (relation)
- project (relation)
- createdAt, updatedAt
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed demo data
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The project is ready for deployment on any platform supporting Node.js:
- Heroku
- Railway
- Render
- AWS
- Google Cloud
- Azure

## Performance Considerations

- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Server-side authentication verification
- ✅ Database indexing on frequently queried fields
- ✅ Pagination ready (can be added to endpoints)
- ✅ Query optimization with Prisma relations

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ HTTP-only cookies for token storage
- ✅ Environment variables for sensitive data

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email support@teamflow.com or open an issue on GitHub.

## Changelog

### v0.1.0
- Initial release
- Admin dashboard with analytics
- Project management
- Task management
- User management
- Admin and user dashboards
- Demo data seeding
