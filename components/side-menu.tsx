'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
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
];

export const SideMenu = ({ data }: { data: Session | null }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data?.user?.image as string} />
          <AvatarFallback>
            <CircleUserRound size="2rem" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Welcome <b>{data?.user.name}</b>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col items-start">
          {menuElements.map(({ path, label }) => (
            <DropdownMenuItem key={label}>
              <Button variant="link" onClick={() => router.push(path)}>
                {label}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Theme {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
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
