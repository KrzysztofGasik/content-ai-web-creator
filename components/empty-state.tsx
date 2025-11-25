import { cn } from '@/lib/utils';

type Props = {
  title: string;
  text: string;
  fullHeight?: boolean;
};

export const EmptyState = ({ title, text, fullHeight = true }: Props) => {
  return (
    <div
      className={`w-full ${
        fullHeight ? 'h-[100vh]' : 'h-auto'
      } flex justify-center items-center m-4`}
    >
      <div className="flex flex-col items-center gap-5">
        <h4 className="text-3xl">{title}</h4>
        <h2 className="text-2xl">{text}</h2>
      </div>
    </div>
  );
};
