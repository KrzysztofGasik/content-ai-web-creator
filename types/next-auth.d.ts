import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      lastLogin?: Date | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    lastLogin?: Date | null;
  }
}
