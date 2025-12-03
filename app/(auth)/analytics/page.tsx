import {
  getGroupContentStats,
  getTimeLineStats,
  getUserContentStats,
  getUserCreditsInfo,
} from '@/lib/actions/analytics-actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { AnalyticsClient } from './analytics-client';

export default async function Analytics() {
  await getServerSession(authOptions);
  const [stats, grouped, timeline, credits] = await Promise.all([
    getUserContentStats(),
    getGroupContentStats(),
    getTimeLineStats(),
    getUserCreditsInfo(),
  ]);

  return (
    <AnalyticsClient
      data={{
        content: stats.contentCount,
        image: stats.imageCount,
        project: stats.projectCount,
        groupedContentData: grouped.content ?? [],
        chartData: timeline.chartData ?? [],
        tokensData: credits.tokens ?? undefined,
      }}
    />
  );
}
