import { Dropdown } from "flowbite-react";
import { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiChevronDown, HiCog, HiUser } from "react-icons/hi";
import { Outlet } from "react-router-dom";
import { Dependency } from "./App";
import logo from "../asset/logo.png";
import { MDrawer } from "./MDrawer";
import { Menu } from "./Menu";

export function Root() {
  const { auth } = useContext(Dependency)!;

  return (
    <>
      <div className="min-h-screen w-full bg-surface flex">
        <div className="bg-container h-[65px] w-full fixed flex justify-between items-center px-4 border lg:justify-end lg:pl-[270px] z-10">
          <div className="flex gap-2 lg:hidden">
            <MDrawer />
            <div className="flex items-center gap-2 text-[16px] font-bold text-primary">
              <img src={logo} className="w-[28px]" />
              <span>WR SYSTEM</span>
            </div>
          </div>
          <Dropdown
            dismissOnClick
            inline
            label=""
            placement="bottom-end"
            renderTrigger={() => (
              <button
                type="button"
                className="text-oncontainer flex gap-2 items-center text-sm"
              >
                <span>Julian Aryo (Admin)</span> <HiChevronDown />
              </button>
            )}
          >
            <Dropdown.Item icon={HiUser}>My Account</Dropdown.Item>
            <Dropdown.Item icon={HiCog}>Setting</Dropdown.Item>
            <Dropdown.Item
              icon={FaSignOutAlt}
              onClick={auth.logout}
              className="text-red-500"
            >
              Logout
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="hidden lg:block lg:bg-container lg:min-h-screen lg:w-[250px] lg:fixed border z-20">
          <div className="px-6 py-2 flex flex-col gap-10">
            <div className="flex items-center gap-2 text-xl font-bold text-primary">
              <img src={logo} className="w-[40px]" />
              <span>WR SYSTEM</span>
            </div>
            <Menu />
          </div>
        </div>
        <div className="w-full mt-[65px] lg:ml-[250px] overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
