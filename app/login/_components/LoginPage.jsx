"use client";
import { useRouter } from "next/navigation";
import { React, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Image from "next/image";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = await GlobalApi.getUserRole(email, password);
      console.log(role);
      if (role === "teacher") {
        router.push(process.env.NEXT_PUBLIC_DASHBOARD_URL); // Redirect teacher
      } else if (role === "student") {
        router.push(process.env.NEXT_PUBLIC_STUDENT_DASHBOARD_URL); // Redirect student
      } else {
        alert("Invalid credentials or role not found.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <Image
          src="/licet.png"
          width={190}
          height={190}
          alt="logo"
          className="mx-auto"
        />
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="block mx-auto w-40 h-14 bg-white border-primary border-2 text-primary hover:bg-primary hover:text-white py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
