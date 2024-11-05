import { useState } from "react";
import { BiChevronDown, BiUser } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";

export function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-4 text-oncontainer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="text-start">
          <div className="text-xs text-primary font-semibold">(Admin)</div>
          <div className="text-sm">Julian Aryo</div>
        </div>
        <BiChevronDown />
      </button>
      <ul
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[51px] right-0 bg-container rounded shadow w-[150px]  flex-col text-oncontainer text-sm`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-50 hover:rounded-tl hover:rounded-tr">
          <a href="" className="flex items-center gap-2">
            <BiUser />
            <span>Akun</span>
          </a>
        </li>
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-50 hover:rounded-bl hover:rounded-br">
          <a href="" className="flex items-center gap-2">
            <FaSignOutAlt />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
