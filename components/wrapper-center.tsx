export const WrapperCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex justify-center align-center m-4">
      {children}
    </div>
  );
};
