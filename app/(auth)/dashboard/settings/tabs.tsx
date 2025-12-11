'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePage from './profile';
import SecurityPage from './security';
import { Button } from '@/components/ui/button';
import DangerZonePage from './danger-zone';

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="dangerZone">Danger zone</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfilePage />
      </TabsContent>
      <TabsContent value="security">
        <SecurityPage />
      </TabsContent>
      <TabsContent
        value="api"
        className="flex flex-col items-center text-2xl gap-4"
      >
        Coming soon :)
        <Button>Copy API key</Button>
      </TabsContent>
      <TabsContent value="dangerZone">
        <DangerZonePage />
      </TabsContent>
    </Tabs>
  );
};
