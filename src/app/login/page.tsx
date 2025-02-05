"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios"
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const [sucessfull, setsucessfull] = useState<string | null>(null);
  const [unsucessfull, setunsucessfull] = useState<string | null>(null);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
     try
     {
           const response = await axios.post("/api/users/login",formdata);
           const msg = response.data.msg;
           setsucessfull(msg)
           if(response.status === 200)
           {
            router.push('/logout')
           }

     }catch(error)
     {
         if(axios.isAxiosError(error))
         {
            const error_msg = error?.response?.data?.msg;
             setunsucessfull(error_msg);
         }
     } 
  };

  return (
    <div className="flex items-center justify-center flex-col space-y-5 min-h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-center text-4xl text-yellow-500 font-semibold">Login</h2>

        {sucessfull && (
          <p className="text-white font-semibold text-2xl tracking-wide text-center mt-5">{sucessfull}</p>
        )}

     {unsucessfull&& (
          <p className="text-white font-semibold text-2xl tracking-wide text-center mt-5">{unsucessfull}</p>
        )}


        <div>
          <label htmlFor="email" className="block text-xl font-medium text-gray-200">Email:</label>
          <input
            type="email"
            id="email"
            value={formdata.email}
            onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
            className="mt-2 px-5 py-3 border border-gray-600 rounded-lg w-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xl font-medium text-gray-200">Password:</label>
          <input
            type="password"
            id="password"
            value={formdata.password}
            onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
            className="mt-2 px-5 py-3 border border-gray-600 rounded-lg w-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-800 text-white text-xl font-medium rounded-2xl hover:bg-green-700 transition duration-300"
        >
          Login
        </button>
      </form>

      <div className="mt-4">
        <Link href="/sigin">
          <p className="text-blue-500 text-xl text-center underline hover:text-blue-300 transition duration-300">
            Don't have an account? Sign Up
          </p>
        </Link>
      </div>
    </div>
  );
}
