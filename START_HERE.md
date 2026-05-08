# 🚀 TeamFlow - Getting Started

Welcome to **TeamFlow**, your collaborative team task management platform!

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

**Choose one option:**

**Option A: Neon Cloud (Easiest - Recommended)**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create free account → New project
3. Copy your PostgreSQL connection string

**Option B: Local PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb teamflow

# Windows (with Docker)
docker run -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
```

### 3. Configure Environment
Create `.env.local`:
```env
DATABASE_URL="your-connection-string-here"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Initialize Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Open Browser
Go to [http://localhost:3000](http://localhost:3000)

### 7. Login
- **Admin**: admin@teamflow.com / admin123
- **User**: user@teamflow.com / user123

✅ **You're ready!**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [**README.md**](README.md) | Complete feature overview |
| [**SETUP.md**](SETUP.md) | Detailed setup guide |
| [**DEVELOPER.md**](DEVELOPER.md) | Developer reference |
| [**DEPLOYMENT.md**](DEPLOYMENT.md) | Production deployment |

---

## 🎯 Next Steps

### For First-Time Users:
1. ✅ Login as admin@teamflow.com
2. 📁 Create a new project
3. 👥 Add team members
4. 📋 Create and assign tasks
5. 📊 View analytics dashboard

### For Developers:
1. 📖 Read DEVELOPER.md
2. 🔍 Explore `/app/api` structure
3. 💻 Review components in `/components`
4. 📝 Check `lib/` utilities
5. 🗄️ Understand Prisma schema in `prisma/schema.prisma`

### For Production:
1. 🚀 See DEPLOYMENT.md for options:
   - Vercel (recommended)
   - Render
   - AWS
   - Docker
2. 📊 Set up monitoring
3. 💾 Configure backups
4. 🔒 Enable SSL/TLS

---

## 🔑 Key Features

### For Admins
- 📊 Dashboard with real-time analytics
- 📁 Create and manage projects
- 👥 User management & assignment
- 📋 Task creation & tracking
- 📈 Project completion monitoring
- 🔍 Full system visibility

### For Users
- ✅ View assigned tasks
- 📝 Update task status
- 📊 Track personal progress
- 🎯 See project details
- 📋 Manage workload

---

## 📁 Project Structure

```
teamflow/
├── app/
│   ├── api/          ← REST endpoints
│   ├── admin/        ← Admin pages
│   ├── user/         ← User pages
│   └── login/        ← Authentication
├── components/       ← Reusable UI
├── lib/             ← Utilities
├── prisma/          ← Database
└── public/          ← Static files
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm start               # Run production

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Load demo data

# Code Quality
npm run lint            # Check code
```

---

## 🗄️ Database Models

| Model | Purpose |
|-------|---------|
| **User** | Team members (Admin/User role) |
| **Project** | Work projects with deadline |
| **Task** | Individual tasks assigned to users |

---

## 📱 UI Components

Reusable components available in `/components`:
- `Button` - Styled buttons
- `Card` - Flexible card layouts
- `Input` - Form inputs & validation
- `Modal` - Dialog boxes
- `Sidebar` - Navigation menu

---

## 🔐 Security Features

✅ Password hashing with bcryptjs
✅ JWT authentication
✅ Role-based access control
✅ HTTP-only secure cookies
✅ Input validation
✅ SQL injection prevention

---

## 🌍 Tech Stack

```
Frontend:  React 19 + Next.js 16
Styling:   Tailwind CSS 4
Backend:   Next.js API Routes
Database:  PostgreSQL + Prisma
Auth:      JWT + bcryptjs
Icons:     Lucide React
Alerts:    React Hot Toast
```

---

## ❓ Common Questions

**Q: Where's my database?**
A: Check DATABASE_URL in .env.local

**Q: Forgot admin password?**
A: Reseed the database: `npx prisma migrate reset && npm run prisma:seed`

**Q: How to add more users?**
A: Use Admin panel → Users → New User

**Q: Can I change demo credentials?**
A: Edit `prisma/seed.ts` and reseed

**Q: Ready to deploy?**
A: See DEPLOYMENT.md for 6+ deployment options

---

## 🚨 Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- -p 3001
```

### Database connection error?
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Regenerate
npm run prisma:generate
```

### Module not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Need fresh start?
```bash
npx prisma migrate reset
npm run prisma:seed
```

---

## 📞 Support

- 📖 **Documentation**: See README.md
- 🛠️ **Setup Issues**: See SETUP.md
- 👨‍💻 **Development**: See DEVELOPER.md
- 🚀 **Deployment**: See DEPLOYMENT.md

---

## ✨ What's Included

✅ Complete Next.js app with TypeScript
✅ PostgreSQL database with Prisma
✅ JWT authentication system
✅ Role-based access control
✅ Admin & User dashboards
✅ Project & Task management
✅ Real-time analytics
✅ Beautiful UI components
✅ Demo data seeding
✅ Error handling & validation
✅ Production-ready code
✅ Comprehensive documentation

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Guide](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## 🎉 You're All Set!

Start building with TeamFlow. Happy coding! 🚀

**Need help?** Check the documentation files or review the code comments.

---

## 📝 License

MIT License - Feel free to use this project for any purpose.

---

**Ready to start?**
1. Run: `npm install`
2. Configure: `.env.local`
3. Start: `npm run dev`
4. Visit: `http://localhost:3000`

**Let's build something amazing! 💪**
