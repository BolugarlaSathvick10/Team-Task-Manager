# TeamFlow - Developer Guide

Complete reference for developers working on TeamFlow.

## Quick Start for Development

```bash
# Install and run
npm install
npm run dev

# Visit
http://localhost:3000
```

## Project Overview

TeamFlow is a task management system with two user types:
- **Admins**: Full access to manage projects, tasks, and users
- **Users**: Limited access to view and update their assigned tasks

## Architecture

### Frontend (React + Next.js)
- App Router for routing
- Server components for optimization
- Client components for interactivity
- Tailwind CSS for styling

### Backend (Next.js API Routes)
- REST API endpoints
- Prisma ORM for database access
- JWT authentication
- Role-based access control

### Database (PostgreSQL)
- 3 main models: User, Project, Task
- Relationships properly defined
- Migrations for schema management

## File Structure Deep Dive

### `/app`
- **`api/`** - REST API endpoints
  - `auth/` - Login, logout, register endpoints
  - `projects/` - Project CRUD operations
  - `tasks/` - Task CRUD operations
  - `users/` - User management
  - `analytics/` - Dashboard statistics

- **`admin/`** - Admin-only pages
  - `layout.tsx` - Admin layout with sidebar
  - `page.tsx` - Admin dashboard
  - `projects/page.tsx` - Project management page
  - `tasks/page.tsx` - Task management page
  - `users/page.tsx` - User management page

- **`user/`** - User-only pages
  - `layout.tsx` - User layout with sidebar
  - `page.tsx` - User dashboard
  - `tasks/page.tsx` - My tasks page
  - `projects/page.tsx` - View projects page

- **`login/`** - Authentication
  - `page.tsx` - Login form

- **`layout.tsx`** - Root layout with providers
- **`page.tsx`** - Root redirect to login
- **`globals.css`** - Global styles

### `/components`
Reusable React components:
- **`Sidebar.tsx`** - Navigation sidebar (appears in admin/user layouts)
- **`Button.tsx`** - Reusable button component
- **`Card.tsx`** - Card components (Card, CardHeader, CardBody, CardFooter)
- **`Input.tsx`** - Form inputs (Input, TextArea, Select)
- **`Modal.tsx`** - Modal dialog component

### `/lib`
Utility functions and helpers:
- **`auth.ts`** - Authentication utilities
  - `hashPassword()` - Hash passwords
  - `comparePasswords()` - Verify passwords
  - `generateToken()` - Create JWT
  - `verifyToken()` - Validate JWT
  - `setAuthCookie()` - Set auth cookie
  - `getAuthToken()` - Get auth cookie
  - `clearAuthCookie()` - Remove auth cookie
  - `getCurrentUser()` - Get logged-in user

- **`db.ts`** - Prisma client singleton
  - Prevents multiple instances in development

- **`types.ts`** - TypeScript interfaces
  - `User`, `Project`, `Task`, `Role`, `TaskStatus`, `Priority`, `ApiResponse`

- **`validations.ts`** - Input validation functions
  - `validateEmail()` - Email format
  - `validatePassword()` - Password strength
  - `validateProjectTitle()` - Project name
  - `validateTaskTitle()` - Task name
  - `validateUserName()` - User name

### `/prisma`
- **`schema.prisma`** - Database schema definition
  - User model with role enum
  - Project model
  - Task model with relations
  - Enums: Role, TaskStatus, Priority

- **`seed.ts`** - Database seeding script
  - Creates demo admin and user
  - Creates sample projects
  - Creates sample tasks

## Authentication Flow

1. **Login**
   - User submits email/password
   - API validates credentials
   - JWT token generated
   - Cookie set with token
   - Redirect based on role

2. **Route Protection**
   - Layout components check localStorage for user
   - Verify user role matches page requirement
   - Redirect to login if unauthorized

3. **API Access**
   - Token extracted from cookie
   - User data included in requests
   - API validates token and role
   - Request processed or rejected

## Database Relations

```
User
├── id
├── name
├── email
├── password
├── role
└── tasks (many)

Project
├── id
├── title
├── description
├── deadline
└── tasks (many)

Task
├── id
├── title
├── description
├── status
├── priority
├── dueDate
├── projectId (FK to Project)
├── assignedToId (FK to User)
├── assignedTo (relation)
└── project (relation)
```

## API Response Format

All endpoints return consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Adding New Features

### Adding a New Model
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Create API routes in `/app/api/[model]/`
4. Create components if needed
5. Create page(s) in `/app/admin/` or `/app/user/`

### Adding API Endpoint
1. Create route file: `app/api/route/file.ts`
2. Implement handler function
3. Add authentication check
4. Add role-based authorization if needed
5. Return consistent API response format

### Adding UI Component
1. Create component in `components/`
2. Export from component
3. Import where needed
4. Extend from existing components if possible

### Adding Validation
1. Add function to `lib/validations.ts`
2. Use in API routes and form submissions
3. Provide user-friendly error messages

## Common Tasks

### Creating a Task in Admin
```typescript
// POST /api/tasks
{
  "title": "Task title",
  "description": "Task description",
  "priority": "HIGH",
  "dueDate": "2026-05-20",
  "projectId": "project-id",
  "assignedToId": "user-id"
}
```

### Updating Task Status (User)
```typescript
// PUT /api/tasks/[id]
{
  "status": "IN_PROGRESS"
}
```

### Getting Analytics
```typescript
// GET /api/analytics
// Returns:
{
  "totalProjects": 3,
  "totalTasks": 10,
  "completedTasks": 5,
  "projectCompletionPercentage": 50,
  "projectStats": [...]
}
```

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=secret-key

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development Tips

1. **Use Prisma Studio** - Visualize database
   ```bash
   npx prisma studio
   ```

2. **Check Authentication** - In browser console
   ```javascript
   localStorage.getItem('user')
   localStorage.getItem('token')
   ```

3. **Debug API** - Check network tab
   - Verify Authorization headers
   - Check response format
   - Validate error messages

4. **Reset Database**
   ```bash
   npx prisma migrate reset
   npm run prisma:seed
   ```

5. **Clear Cache**
   - Delete `.next` folder
   - Restart dev server

## Testing

### Manual Testing Checklist
- [ ] Admin can login
- [ ] Admin dashboard shows stats
- [ ] Admin can create project
- [ ] Admin can create user
- [ ] Admin can create task
- [ ] Admin can assign task to user
- [ ] User can login
- [ ] User can see assigned tasks
- [ ] User can update task status
- [ ] User can see projects
- [ ] Logout works for both roles
- [ ] Unauthorized access blocked

### Test Credentials
- Admin: admin@teamflow.com / admin123
- User: user@teamflow.com / user123

## Performance Optimization

### Query Optimization
- Use `include` for relations in Prisma
- Avoid N+1 queries
- Index frequently queried fields

### UI Optimization
- Use React.memo for expensive components
- Lazy load heavy components
- Optimize images and assets

### Build Optimization
- Tree-shaking unused code
- Minify CSS and JS
- Split bundles appropriately

## Security Checklist

- [ ] All inputs validated
- [ ] SQL injection prevented (using Prisma)
- [ ] XSS protection (React escapes by default)
- [ ] CSRF tokens if needed
- [ ] Passwords hashed (bcryptjs)
- [ ] Sensitive data in env variables
- [ ] API rate limiting (consider adding)
- [ ] CORS configured if needed

## Debugging

### Enable Debug Logging
```env
DEBUG=prisma:*
```

### Check Network Requests
1. Open DevTools
2. Go to Network tab
3. Make requests
4. Check response status and data

### Check Database State
```bash
# Open Prisma Studio
npx prisma studio

# Or query directly
psql $DATABASE_URL -c "SELECT * FROM users;"
```

## Common Issues & Solutions

### Issue: Token not persisting
**Solution**: Check if cookies are enabled, verify domain settings

### Issue: CORS errors
**Solution**: Add CORS headers in API routes if needed

### Issue: Slow queries
**Solution**: Add database indexes, use query profiling

### Issue: Session lost after refresh
**Solution**: Implement token refresh mechanism

## Deployment Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Demo data seeded (optional)
- [ ] Build succeeds without errors
- [ ] All routes tested
- [ ] Error handling works
- [ ] Logging configured
- [ ] Backups scheduled
- [ ] SSL/TLS enabled
- [ ] Monitoring set up

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [PostgreSQL](https://www.postgresql.org/docs)

## Support & Questions

- Check README.md for overview
- Check SETUP.md for setup issues
- Check DEPLOYMENT.md for deployment
- Review code comments for implementation details
