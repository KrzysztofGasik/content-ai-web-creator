export const WrapperCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex justify-center items-center m-4">
      {children}
    </div>
  );
};
