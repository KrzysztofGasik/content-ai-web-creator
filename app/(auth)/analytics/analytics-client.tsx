import { AnalyticsCards } from './analytics-cards';
import { AnalyticsCharts } from './analytics-charts';
import type { ChartData, TokensData } from '@/types/types';
import { AnalyticsTokens } from './analytics-tokens';

type AnalyticsClientProps = {
  data: {
    content: number | undefined;
    image: number | undefined;
    project: number | undefined;
    groupedContentData: {
      name: string;
      value: number;
    }[];
    chartData: ChartData;
    tokensData: TokensData | undefined;
  };
};

export const AnalyticsClient = ({ data }: AnalyticsClientProps) => {
  const { content, image, project, groupedContentData, chartData, tokensData } =
    data;
  return (
    <div className="grid grid-cols-1 w-full">
      <h2 className="text-3xl font-bold my-5">Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <AnalyticsCards data={{ content, image, project }} />
      </div>
      <div className="grid grid-cols-1 gap-4 w-full my-4">
        <h2 className="text-3xl font-bold my-5">Activity</h2>
        <AnalyticsCharts
          contentData={groupedContentData}
          chartData={chartData}
        />
      </div>
      <h2 className="text-3xl font-bold my-5">Usage</h2>
      <AnalyticsTokens tokensData={tokensData} />
    </div>
  );
};
