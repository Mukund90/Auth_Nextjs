"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [disable, setDisable] = useState(true);
  const [error, setError] = useState("");
 

  useEffect(() => {
    setDisable(
      formdata.username.trim() === "" ||
      formdata.email.trim() === "" ||
      formdata.password.trim() === ""
    );
  }, [formdata]);

  const handleChange:any = (e:any) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/api/users/signup", formdata);
      if(response.status === 201)
      {
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const error_value = error?.response?.data?.msg;
        setError(error_value);

      } else {
        setError("An error occurred while submitting the data.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="max-w-md w-full p-8 bg-gray-900 text-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Welcome Back!</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-200">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formdata.username}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 text-lg border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 text-lg border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 text-lg border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-red-500 mt-2 text-center tracker-wider text-lg">{error}</div>}
         
          <button
            type="submit"
            disabled={disable}
            className={`w-full py-3 text-xl transition-all duration-200 ${
              disable
                ? "bg-blue-400 cursor-not-allowed opacity-50"
                : "bg-slate-50 hover:bg-white focus:ring focus:white-blue-500 focus:ring-offset-2"
            } text-black rounded-lg shadow-md font-semibold`}
          >
            {disable ? "Sign In" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
