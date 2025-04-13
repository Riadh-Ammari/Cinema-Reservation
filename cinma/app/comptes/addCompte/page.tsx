"use client"; // Mark the file as a client-side component

import { useState, useEffect } from "react";
import { addCompte } from "@/app/utils/api";
import { compte } from "@/app/model/compte";
import { useRouter } from "next/navigation";
import Navbar from "@/app/_components/nav/page";
import Footer from "@/app/_components/footer/page";
// Compte Add Component
const AddCompte = () => {
  const router = useRouter();

  // State to hold the form data
  const [comptesdata, setcomptesdata] = useState<compte>({
    name: '',
    password: '',
    id: 0,
    solde: 0,
  });

  // State for handling error and loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all comptes to determine the next ID
  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/cinemaresrvation/cinemaREST/me/compte");
        if (response.ok) {
          const comptes: compte[] = await response.json();
          const maxId = Math.max(...comptes.map(compte => compte.id), 0);
          setcomptesdata((prevData) => ({
            ...prevData,
          }));
        } else {
          throw new Error("Failed to fetch comptes.");
        }
      } catch (error) {
        setError("Error fetching comptes.");
        console.error(error);
      }
    };

    fetchComptes();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setcomptesdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator

    try {
      // Add the compte using the API
      await addCompte(comptesdata);
      setLoading(false); // Stop loading indicator
      router.push("/login"); // Navigate to success page after adding compte
    } catch (error) {
      setError("Error submitting compte.");
      console.error(error);
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <><Navbar /><section className="bg-white dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="/bg.png"
            className="absolute inset-0 h-full w-full object-cover opacity-80" />

          <div className="hidden lg:relative lg:block lg:p-12">
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to CinemaHub 🎥
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Dive into the world of movies, explore your favorite theaters, and book your tickets effortlessly!
            </p>
          </div>
        </section>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                   Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="name"
                  value={comptesdata.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8" />
              </div>

              <div className="col-span-6">
                <label htmlFor="solde" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Solde
                </label>

                <input
                  type="number"
                  id="solde"
                  name="solde"
                  value={comptesdata.solde}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8" />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  value={comptesdata.password}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8" />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password Confirmation
                </label>

                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8" />
              </div>

              <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900" />

                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    I want to receive emails about events, product updates, and company announcements.
                  </span>
                </label>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our
                  <a href="#" className="text-gray-700 underline dark:text-gray-200">
                    terms and conditions
                  </a>
                  and
                  <a href="#" className="text-gray-700 underline dark:text-gray-200"> privacy policy </a>.
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Register"}
                </button>

                {error && (
                  <p className="mt-2 text-sm text-red-500 sm:mt-0">
                    {error}
                  </p>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
    <Footer/></>
  );
};

export default AddCompte;
