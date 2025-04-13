"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { getComptes } from "@/app/utils/api";
import Userna from '../_components/nav/page'; // Make sure it's correctly imported
import { compte } from "../model/compte";
import Footer from "../_components/lofooter/page";

const Page = () => {
  const [comptes, setComptes] = useState<compte[]>([]);
  const [comptesname, setComptename] = useState<string>(""); // Store the entered film ID
  const [password, setPassword] = useState<string>(""); // Store the entered password
  const [role, setRole] = useState<string | null>(null); // Store the user role (admin or client)
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store error message
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    // Fetch comptes (user accounts) from your API
    const fetchComptes = async () => {
      try {
        const comptedata = await getComptes();
        setComptes(comptedata);
      } catch (error) {
        console.error("Error fetching comptes:", error);
      }
    };
    fetchComptes();
  }, []);

  const handleLogin = () => {
    // Find the matching account based on the entered username and password
    const compte = comptes.find(
      (compte) => compte.name === comptesname && compte.password === password
    );

    // If user is admin
    if (compte?.name === "admin" && compte?.password === "admin") {
      setRole("admin");
      setErrorMessage(null); // Reset error message and navigate to admin dashboard
      router.push("/admin-dashboard");
    } else if (compte) {
      // If user is a regular client
      setRole("client");
      setErrorMessage(null); // Reset error message and navigate to client dashboard
      router.push("/client-dashboard");
    } else {
      // If no matching credentials
      setRole(null);
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Userna /> {/* This will render the navbar */}

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>

          <p className="mt-4 text-gray-500">
            Please enter your username and password to log in.
          </p>
        </div>

        {/* Login Form with Border */}
        <form
          className="mx-auto mb-0 mt-8 max-w-md space-y-4 p-6 border-4 border-gray-650 rounded-lg"
        >
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter your username"
                value={comptesname}
                onChange={(e) => setComptename(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No account? <a className="underline" href="/comptes/addCompte">Sign up</a>
            </p>

            <button
              type="button"
              onClick={handleLogin}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            >
              Login
            </button>
          </div>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 p-4 mt-4"
          >
            <strong className="block font-medium text-red-800">
              Something went wrong
            </strong>

            <p className="mt-2 text-sm text-red-700">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
