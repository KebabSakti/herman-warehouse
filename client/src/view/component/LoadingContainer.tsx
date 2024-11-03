import { ReactNode } from "react";

export function LoadingContainer({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  return (
    <div className="relative">
      {(() => {
        if (loading) {
          return (
            <div className="w-full h-full z-1 bg-white absolute opacity-80 flex justify-center items-center text-black font-semibold text-2xl dark:bg-black dark:text-white">
              Loading..
            </div>
          );
        }
      })()}

      {children}
    </div>
  );
}
