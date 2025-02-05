"use client";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";

import Link from "next/link";

export default function VerifyEmailToken() {
  const data = useSearchParams();
  const token_data = data.get("token");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [render, setRender] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClick = async (): Promise<void> => {
    try {
      const response = await axios.post(
        "/api/users/VerifyToken",
        {},
        {
          headers: {
            token: token_data,
          },
        }
      );
      console.log("Verification Success:", response.data);
      setSuccessMessage(response.data.msg); // Store success message
      setRender(false);
      setErrorMessage(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.msg || "An error occurred.";
        setErrorMessage(errorMessage);
        setRender(true);
      }
    }
  };

  if (!token_data) {
    throw new Error("Token not found in query");
  }

  return (
    <div className="flex items-center justify-center flex-col space-y-5 min-h-screen">
      <h2 className="text-center text-3xl text-yellow-600">
        Verify Your Email Address!
      </h2>

      {errorMessage && (
        <p className="text-red-700 font-bold tracker-wider text-3xl">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="text-green-700 font-bold tracker-wider text-3xl">
          {successMessage} 
        </p>
      )}

      <button
        onClick={handleClick}
        className="px-6 py-2 bg-green-800 text-white text-center text-xl rounded-2xl"
      >
        Verify
      </button>

      {render ? (
        <Link href={"/sigin"}>
          <p className="text-blue-800 underline text-xl text-center">
            SignIn page
          </p>
        </Link>
      ) : (
        <Link href={"/login"}>
          <p className="text-blue-800 underline text-xl text-center">
            Login
          </p>
        </Link>
      )}
    </div>
  );
}
