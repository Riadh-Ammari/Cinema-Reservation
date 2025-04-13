import React from "react";

const AdminHome: React.FC = () => {
  return (
    <section
      className="relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:flex lg:h-[80vh] lg:items-center lg:px-8">
        <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            Welcome to the Admin Dashboard
            <strong className="block font-extrabold text-[#374151]">Manage and Monitor with Ease</strong>
          </h1>

          <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
            Monitor system performance, review user activity, and manage content efficiently from a single platform.
          </p>

          <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
            Stay updated with streamline your workflow to ensure seamless operations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
