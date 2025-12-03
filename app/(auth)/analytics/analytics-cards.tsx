import { CardStats } from '@/components/card-stats';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderKanban, ImageIcon } from 'lucide-react';

type AnalyticsCardsProps = {
  data: {
    content: number | undefined;
    image: number | undefined;
    project: number | undefined;
  };
};

export const AnalyticsCards = ({ data }: AnalyticsCardsProps) => {
  const { content, image, project } = data;
  return (
    <>
      <CardStats
        data={{
          id: 'content-count',
          title: 'Total content',
          description: '',
          content: <Badge className="text-2xl w-10 h-10">{content}</Badge>,
          footer: '',
          action: undefined,
          icon: <FileText />,
        }}
      />
      <CardStats
        data={{
          id: 'image-count',
          title: 'Total images',
          description: '',
          content: <Badge className="text-2xl w-10 h-10">{image}</Badge>,
          footer: '',
          action: undefined,
          icon: <ImageIcon />,
        }}
      />
      <CardStats
        data={{
          id: 'project-count',
          title: 'Total projects',
          description: '',
          content: <Badge className="text-2xl w-10 h-10">{project}</Badge>,
          footer: '',
          action: undefined,
          icon: <FolderKanban />,
        }}
      />
    </>
  );
};
