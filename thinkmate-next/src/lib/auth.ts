/**
 * Authentication Configuration for ThinkMate
 * Handles Google OAuth 2.0 and Email/Password authentication
 * Uses NextAuth.js for session management with MongoDB Atlas
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { IUser } from '@/types/user';

/**
 * Find user by email in MongoDB
 */
export async function findUserByEmail(email: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  return user;
}

/**
 * Find user by Google ID in MongoDB
 */
export async function findUserByGoogleId(googleId: string) {
  await connectDB();
  const user = await User.findOne({ googleId });
  return user;
}

/**
 * Create a new user in MongoDB
 */
export async function createUser(userData: {
  email: string;
  password?: string;
  name?: string;
  provider: 'email' | 'google';
  googleId?: string;
  image?: string;
}) {
  await connectDB();
  
  // Hash password if provided
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const user = await User.create({
    email: userData.email.toLowerCase(),
    password: userData.password,
    name: userData.name,
    provider: userData.provider,
    googleId: userData.googleId,
    image: userData.image,
  });

  return user;
}

/**
 * Verify user password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth 2.0 Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // Email/Password Credentials Provider
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Find user in MongoDB
          const user = await findUserByEmail(credentials.email);

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          // Verify password
          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object (password excluded for security)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || '',
            image: user.image,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && profile?.email) {
        try {
          console.log('🔵 Google OAuth sign-in attempt for:', profile.email);
          
          // Connect to MongoDB with error handling
          try {
            await connectDB();
            console.log('✅ MongoDB connection established');
          } catch (dbError: any) {
            console.error('❌ MongoDB connection failed:', dbError.message);
            // Still return true to allow sign-in even if DB is down (for testing)
            // In production, you might want to return false
            return '/auth/error?error=Configuration';
          }
          
          // Check if user exists by Google ID or email
          let existingUser = await findUserByGoogleId(account.providerAccountId);
          
          if (!existingUser) {
            existingUser = await findUserByEmail(profile.email);
          }

          if (existingUser) {
            console.log('✅ Found existing user:', existingUser.email);
            // Update existing user with Google info if needed
            if (!existingUser.googleId && account.providerAccountId) {
              existingUser.googleId = account.providerAccountId;
              existingUser.provider = 'google';
              existingUser.image = profile.image;
              await existingUser.save();
              console.log('✅ Updated user with Google credentials');
            }
          } else {
            console.log('🆕 Creating new user for:', profile.email);
            // Create new user for Google sign-in
            await createUser({
              email: profile.email,
              name: profile.name || '',
              provider: 'google',
              googleId: account.providerAccountId,
              image: profile.image,
            });
            console.log('✅ New user created successfully');
          }
          
          return true;
        } catch (error: any) {
          console.error('❌ Google sign-in error:', error.message || error);
          // Return error URL instead of false to get better error messages
          return '/auth/error?error=OAuthCallback';
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      // Add user ID to token
      if (user) {
        token.id = user.id;
      }

      // Add provider info
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      // Add user ID and provider to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign-in
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl + '/dashboard';
    },
  },

  // Session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT secret
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Helper function to get current session on server
 */
export { getServerSession } from 'next-auth';
