import { ReactNode } from "react";
import { Spinner } from "./Spinner";

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
            <div className="w-full h-full z-1 bg-white absolute opacity-80 flex justify-center items-center">
              <Spinner />
            </div>
          );
        }
      })()}

      {children}
    </div>
  );
}
