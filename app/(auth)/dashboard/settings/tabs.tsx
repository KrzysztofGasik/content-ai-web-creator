'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePage from './profile';
import SecurityPage from './security';
import DangerZonePage from './danger-zone';
import ApiPage from './api-key';

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
      <TabsContent value="api">
        <ApiPage />
      </TabsContent>
      <TabsContent value="dangerZone">
        <DangerZonePage />
      </TabsContent>
    </Tabs>
  );
};
