export function Root() {
  return (
    <div className="min-h-screen bg-surface flex">
      <div className="bg-primary min-h-screen w-[300px] fixed"></div>
      <div className="flex flex-col ml-[300px]">
        <div className="bg-container w-full h-[65px] fixed"></div>
        <div className="mt-[65px] p-6">
          <div className="flex flex-col gap-4">
            <div className="h-96 w-96 bg-container"></div>
            <div className="h-96 w-96 bg-container"></div>
            <div className="h-96 w-96 bg-container"></div>
          </div>
        </div>
      </div>
    </div>

    // <div className="min-h-screen bg-surface p-6">
    //   <div className="flex flex-col gap-6">
    //     <div className="w-full bg-container rounded-xl p-4">a</div>
    //     <div className="flex gap-6 min-h-screen">
    //       <div className="hidden xl:block xl:w-[350px] bg-container rounded-xl p-4">
    //         b
    //       </div>
    //       <div className="w-full bg-container rounded-xl p-4">c</div>
    //     </div>
    //   </div>
    // </div>
  );
}
