# TeamFlow - Quick Start Guide

Get TeamFlow up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup PostgreSQL Database

### Option A: Using Neon (Cloud - Easiest)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string (PostgreSQL URL)

### Option B: Using Local PostgreSQL

```bash
# On Windows (with chocolatey):
choco install postgresql

# On macOS (with homebrew):
brew install postgresql

# Start PostgreSQL service
pg_ctl -D /usr/local/var/postgres start

# Create database
createdb teamflow
```

### Option C: Using Docker

```bash
docker run --name teamflow-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=teamflow \
  -p 5432:5432 \
  -d postgres:15
```

## Step 3: Configure Environment

Create `.env.local` file:

```bash
# For Neon
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/teamflow?sslmode=require"

# Or for local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/teamflow"

JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Step 4: Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create tables
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Login

Use these credentials:

**Admin:**
- Email: admin@teamflow.com
- Password: admin123

**User:**
- Email: user@teamflow.com
- Password: user123

## What's Next?

### Admin Actions:
1. Go to Dashboard to see analytics
2. Create a project in Projects
3. Add users in Users
4. Create tasks and assign to users

### User Actions:
1. Check My Tasks
2. Update task status
3. View Projects

## Common Issues & Fixes

### Database Connection Error

```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1;"

# If fails, regenerate schema
npm run prisma:generate
npm run prisma:migrate reset
```

### Port Already in Use

```bash
# Change port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
teamflow/
├── app/
│   ├── api/           # Backend APIs
│   ├── admin/         # Admin pages
│   ├── user/          # User pages
│   └── login/         # Login page
├── components/        # React components
├── lib/              # Utilities & helpers
├── prisma/           # Database schema
└── public/           # Static files
```

## File Structure Explanation

**app/api/** - REST API endpoints
- `auth/` - Login, logout, register
- `projects/` - Project management
- `tasks/` - Task management
- `users/` - User management
- `analytics/` - Dashboard stats

**components/** - Reusable UI Components
- `Sidebar.tsx` - Navigation menu
- `Button.tsx` - Button component
- `Card.tsx` - Card component
- `Input.tsx` - Form inputs
- `Modal.tsx` - Modal dialogs

**lib/** - Utility Functions
- `auth.ts` - Authentication helpers
- `db.ts` - Database client
- `types.ts` - TypeScript types
- `validations.ts` - Input validation

## Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Check code quality

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed demo data
```

## Features Overview

### For Admins
- 📊 Dashboard with analytics
- 📁 Full project management
- 👥 User management
- 📋 Task assignment
- 📈 Progress tracking

### For Users
- ✅ View assigned tasks
- 📝 Update task status
- 📊 Track progress
- 🎯 See project details

## Next Steps

1. **Customize Demo Data**: Edit `prisma/seed.ts`
2. **Add More Users**: Use Admin panel
3. **Create Projects**: Add your projects
4. **Assign Tasks**: Manage team workload
5. **Deploy**: See DEPLOYMENT.md

## Need Help?

- Check README.md for detailed docs
- See DEPLOYMENT.md for production setup
- Review the code comments
- Check .env.example for env variables

## Database Models

### Users
- Admins: Full system access
- Users: Limited to assigned tasks

### Projects
- Have multiple tasks
- Track completion percentage

### Tasks
- Assigned to users
- Have status (Pending/In Progress/Completed)
- Have priority (Low/Medium/High)

## Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- Tokens stored in secure HTTP-only cookies
- Role-based access control enforced
- Change JWT_SECRET in production

## Performance Tips

- Database queries are optimized
- Prisma handles relationships efficiently
- UI components are reusable
- API responses are cached where possible

## Troubleshooting Commands

```bash
# Check Node version (should be 18+)
node --version

# Check npm
npm --version

# Validate Prisma schema
npx prisma validate

# Open Prisma Studio (database UI)
npx prisma studio

# Generate fresh Prisma Client
npx prisma generate --skip-engine-check

# Reset database
npm run prisma:migrate reset
```

## Success Checklist

- [ ] Database connected
- [ ] npm install completed
- [ ] npm run dev works
- [ ] Can login with admin@teamflow.com
- [ ] Can access admin dashboard
- [ ] Can see demo projects and tasks
- [ ] Can login as user@teamflow.com
- [ ] Can update task status

Once all checked, you're ready to go! 🚀

## Ready to Deploy?

See DEPLOYMENT.md for production deployment options:
- Vercel
- Railway
- Render
- AWS
- Docker
- Heroku
- And more!
