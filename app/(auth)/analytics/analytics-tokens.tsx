import { CardStats } from '@/components/card-stats';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { TokensData } from '@/types/types';
import { DollarSign } from 'lucide-react';

type AnalyticsTokensProps = {
  tokensData: TokensData | undefined;
};

export const AnalyticsTokens = ({ tokensData }: AnalyticsTokensProps) => {
  if (!tokensData) return;
  const {
    totalCredits,
    creditsRemaining,
    tokensUsed,
    contentTokens,
    imageTokens,
  } = tokensData;
  const totalPercentage = (tokensUsed / totalCredits) * 100;
  const color =
    totalPercentage < 50
      ? '[&>div]:bg-green-600'
      : totalPercentage < 80
        ? '[&>div]:bg-yellow-400'
        : '[&>div]:bg-red-500';
  return (
    <CardStats
      data={{
        id: 'token-count',
        title: 'Token usage',
        description: '',
        content: (
          <div className="flex flex-col gap-3">
            <Badge className="text-xl">
              Total credits: {totalCredits.toLocaleString('de-de')}
            </Badge>
            <Badge className="text-xl" variant="destructive">
              Credits remaining: {creditsRemaining.toLocaleString('de-de')}
            </Badge>
            <Badge className="text-xl bg-[#8884d8]">
              Content tokens: {contentTokens.toLocaleString('de-de')}
            </Badge>
            <Badge className="text-xl bg-[#82ca9d]">
              Image tokens: {imageTokens.toLocaleString('de-de')}
            </Badge>
            <Progress
              value={totalPercentage}
              className={`${color}`}
              max={100}
            />
          </div>
        ),
        footer: '',
        action: undefined,
        icon: <DollarSign />,
      }}
    />
  );
};
