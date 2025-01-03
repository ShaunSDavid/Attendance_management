"use client";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { GraduationCap, Hand, LayoutIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function SideNav() {
  // const { user } = useKindeBrowserClient();
  const menuList = [
    {
      id: 1,
      name: "DashBoard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      path: "/dashboard/students",
    },
    {
      id: 3,
      name: "Attendance",
      icon: Hand,
      path: "/dashboard/attendance",
    },
    {
      id: 4,
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  const path = usePathname();
  useEffect(() => console.log(path), [path]);
  return (
    <div className="border shadow-md h-screen p-4">
      <Image
        src="/licet.png"
        width={180}
        height={180}
        alt="logo"
        className="ml-5"
      />

      <hr className="my-5"></hr>

      {menuList.map((menu, index) => (
        <Link href={menu.path}>
          <h2
            className={`flex gap-4 items-center text-md p-4 text-slate-500 hover:bg-primary hover:text-white cursor-pointer rounded-lg my-2 ${
              path == menu.path && "bg-primary text-white"
            }`}
          >
            <menu.icon />
            {menu.name}
          </h2>
        </Link>
      ))}
      {/* <div className="flex gap-1.5 bottom-5 items-center fixed">
        <Image
          src={user?.picture}
          width={35}
          height={35}
          alt="user"
          className="rounded-full"
        />
        <div>
          <h2 className="text-sm font-bold">
            {user?.given_name} {user?.family_name}
          </h2>
          <h2 className="text-xs">{user?.email}</h2>
        </div>
      </div> */}
    </div>
  );
}

export default SideNav;
