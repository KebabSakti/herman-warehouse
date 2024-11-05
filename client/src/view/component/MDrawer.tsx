import { Drawer } from "flowbite-react";
import { useState } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { Menu } from "./Menu";

export function MDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={handleClose}
        className="bg-container"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <div className="flex h-full flex-col justify-between py-2">
            <Menu />
          </div>
        </Drawer.Items>
      </Drawer>
      <button
        type="button"
        className="border p-1 rounded hover:bg-gray-50"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <HiMenuAlt1 size={24} />
      </button>
    </>
  );
}
