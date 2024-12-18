"use client";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import Image from "next/image";
import React from "react";

function Header() {
  // const {user}=useKindeBrowserClient();
  return (
    <div className="flex justify-end border shadow-sm p-5">
      {/* <Image src={user?.picture} width={35} height={35} alt='user' className='rounded-full'/> */}
    </div>
  );
}

export default Header;
