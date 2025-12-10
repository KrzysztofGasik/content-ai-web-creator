'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { CircleUserRound, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const menuElements = [
  {
    path: '/dashboard',
    label: 'Dashboard',
  },
  {
    path: '/generate',
    label: 'Generate Content',
  },
  {
    path: '/generate/image',
    label: 'Generate Image',
  },
  {
    path: '/projects/new',
    label: 'Create Project',
  },
  {
    path: '/content',
    label: 'View All Content',
  },
  {
    path: '/images',
    label: 'View All Images',
  },
  {
    path: '/projects',
    label: 'View All Projects',
  },
  {
    path: '/analytics',
    label: 'View Analytics',
  },
  {
    path: '/dashboard/settings',
    label: 'Settings',
  },
];

export const SideMenu = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session?.user?.image as string} />
          <AvatarFallback>
            <CircleUserRound size="2rem" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Welcome <b>{session?.user.name}</b>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col items-start">
          {menuElements.map(({ path, label }) => (
            <DropdownMenuItem key={label}>
              <Button
                variant="link"
                onClick={() => router.push(path)}
                className="transition-colors duration-200"
              >
                {label}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Button
            className="transition-colors duration-200"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Theme {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            className="transition-colors duration-200"
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            variant="link"
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
