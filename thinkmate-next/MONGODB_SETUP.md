# MongoDB Atlas Setup for ThinkMate

## Overview
ThinkMate now uses MongoDB Atlas for persistent data storage, replacing the in-memory user store. This provides secure, scalable, and production-ready database functionality.

## Database Connection

### Connection URI
The MongoDB connection URI is stored in `.env.local`:

```
MONGODB_URI=mongodb+srv://arincon73_db_user:GB43QqD9jeJsTMsy@thinkmate.y5tlj6d.mongodb.net/Thinkmate?appName=ThinkMate
```

### Database Structure
- **Database Name**: `Thinkmate`
- **Collection**: `users`
- **Connection Library**: Mongoose (ODM for MongoDB)

## User Schema

### Fields
- `email` (String, required, unique, lowercase)
  - Email address of the user
  - Automatically validated with regex pattern
  - Indexed for faster queries

- `password` (String, conditional)
  - Hashed password using bcrypt
  - Required only for email/password authentication
  - Not required for OAuth users

- `name` (String, optional)
  - User's display name

- `image` (String, optional)
  - Profile image URL (typically from OAuth providers)

- `provider` (String, required)
  - Authentication provider: `'email'` or `'google'`
  - Default: `'email'`

- `googleId` (String, optional, unique)
  - Google OAuth user ID
  - Only present for Google-authenticated users
  - Indexed for faster queries

- `createdAt` (Date, auto-generated)
  - Timestamp when user was created

- `updatedAt` (Date, auto-generated)
  - Timestamp when user was last updated

## Authentication Flow

### Email/Password Sign-Up
1. User submits sign-up form with email, password, and name
2. API validates input (email format, password strength)
3. Checks if user already exists in MongoDB
4. Hashes password using bcrypt (10 salt rounds)
5. Creates new user document in MongoDB with provider: `'email'`
6. Returns success response

### Email/Password Sign-In
1. User submits sign-in form with email and password
2. NextAuth.js Credentials Provider queries MongoDB for user by email
3. Verifies password using bcrypt comparison
4. Creates JWT session token
5. Redirects to dashboard

### Google OAuth Sign-In
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. Google redirects back with authorization code
4. NextAuth.js Google Provider exchanges code for user profile
5. Checks if user exists by Google ID or email
6. If existing user: Updates Google ID and image if needed
7. If new user: Creates new user with provider: `'google'`
8. Creates JWT session token
9. Redirects to dashboard

## Files and Their Roles

### `/src/lib/mongodb.ts`
- Database connection utility
- Implements connection pooling
- Caches connection to prevent connection spam in development
- Exports `connectDB()` function

### `/src/models/User.ts`
- Mongoose schema definition for User
- Defines field types, validation, and indexes
- Exports User model

### `/src/types/user.ts`
- TypeScript interfaces for type safety
- `IUser`: Base user interface
- `UserDocument`: User with MongoDB document fields

### `/src/lib/auth.ts`
- NextAuth.js configuration
- Database helper functions:
  - `findUserByEmail(email)`: Query user by email
  - `findUserByGoogleId(googleId)`: Query user by Google ID
  - `createUser(userData)`: Create new user in MongoDB
  - `verifyPassword(password, hash)`: Verify password against hash
- Provider configurations (Google, Credentials)
- Callbacks for handling sign-in, JWT, and sessions

### `/src/app/api/auth/signup/route.ts`
- Custom API endpoint for user registration
- Validates input, checks duplicates, creates user
- Uses MongoDB for persistence

## Security Features

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

### Email Security
- Emails converted to lowercase for consistency
- Validated with regex pattern
- Indexed for unique constraint

### Environment Variables
- MongoDB URI stored in `.env.local` (not committed to git)
- NextAuth secret for JWT signing
- Google OAuth credentials

### Session Management
- JWT-based sessions (not database sessions)
- 30-day session expiration
- Secure HTTP-only cookies

## Testing the Integration

### 1. Test Email Sign-Up
```bash
# Navigate to http://localhost:3002/auth/sign-up
# Fill in email, password, and name
# Click "Sign up"
# Should create user in MongoDB and redirect to dashboard
```

### 2. Test Email Sign-In
```bash
# Navigate to http://localhost:3002/auth/sign-in
# Enter registered email and password
# Click "Sign in"
# Should authenticate and redirect to dashboard
```

### 3. Test Google OAuth
```bash
# Navigate to http://localhost:3002/auth/sign-in
# Click "Continue with Google"
# Complete Google authentication
# Should create/find user in MongoDB and redirect to dashboard
```

### 4. Verify in MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Navigate to Collections → Thinkmate → users
3. Verify user documents are created with correct fields
4. Check that passwords are hashed (not plain text)
5. Verify Google users have googleId field

## Connection Pooling

Mongoose automatically manages connection pooling. The connection is:
- Created on first database operation
- Cached globally in development (prevents connection spam during hot reload)
- Reused for all subsequent operations
- Automatically reconnected if connection drops

## Error Handling

All database operations are wrapped in try-catch blocks:
- Connection errors logged to console
- User-friendly error messages returned to client
- Sensitive details (like MongoDB errors) not exposed to users

## Production Considerations

### Environment Variables
Ensure `.env.local` is never committed to version control:
- Already added to `.gitignore`
- Use separate MongoDB clusters for dev/staging/production
- Rotate credentials periodically

### Database Indexes
Already configured for optimal performance:
- Email: Unique index
- Google ID: Unique sparse index

### Scaling
MongoDB Atlas auto-scales:
- Connection pooling handles concurrent requests
- Mongoose connection caching prevents connection exhaustion
- Consider upgrading cluster tier for production traffic

## Troubleshooting

### "Cannot connect to MongoDB"
- Verify MONGODB_URI is set in `.env.local`
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0 for development)
- Ensure MongoDB cluster is running

### "User already exists"
- Email addresses are unique
- Check MongoDB collection for duplicate email
- Email comparison is case-insensitive

### "Invalid password"
- Password must be at least 8 characters
- Ensure correct password is being used
- Passwords are case-sensitive

### Development Server Not Reflecting Changes
- Restart development server: `npm run dev`
- Clear `.next` cache: `rm -rf .next && npm run dev`
- Check terminal for compilation errors

## Next Steps

The authentication system is now fully functional with MongoDB Atlas. Users can:
✅ Sign up with email/password
✅ Sign in with email/password
✅ Sign in with Google OAuth
✅ Access protected dashboard
✅ Sign out

All user data is persistently stored in MongoDB Atlas and survives server restarts.
