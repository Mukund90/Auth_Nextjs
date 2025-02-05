"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Log_out() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      if (response.status === 200) {
        router.push('/sigin'); 
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errMsg = err.response?.data?.msg || "An unexpected error occurred.";
        setError(errMsg);
      } else {
        setError("An error occurred while logging out.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center flex-col space-y-5 min-h-screen bg-black text-white">
      <h2 className="text-center text-3xl text-yellow-600">Welcome, you are logged in!</h2>

      <p className="text-xl">Are you sure you want to log out?</p>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-800 text-white text-center text-xl rounded-2xl"
      >
        Logout
      </button>
    </div>
  );
}
