export const LabelInputWrapper = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-4 items-start">
      {label && <span className="px-1 py-1 text-sm font-bold">{label}</span>}
      {children}
    </div>
  );
};
