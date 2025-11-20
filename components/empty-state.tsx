type Props = {
  title: string;
  text: string;
};

export const EmptyState = ({ title, text }: Props) => {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center m-4">
      <div className="flex flex-col items-center gap-5">
        <h4 className="text-3xl">{title}</h4>
        <h2 className="text-2xl">{text}</h2>
      </div>
    </div>
  );
};
