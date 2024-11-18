export function DashboardPage() {
  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <div className="text-onsurface text-xl font-semibold">DASHBOARD</div>
        <div className="bg-container rounded p-4">
          <div className="flex flex-wrap gap-4">
            {[...Array(100)].map((_, i) => {
              return (
                <div
                  key={i}
                  className="bg-surface p-10 flex-1 text-center text-onsurface font-bold text-lg"
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
