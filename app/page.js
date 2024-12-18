"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  }, []);

  return null;
}
