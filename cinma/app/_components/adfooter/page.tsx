import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &copy; 2025 YourCompany. All rights reserved.
          </p>

          <ul className="mt-4 sm:mt-0 flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 text-sm">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 text-sm">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 text-sm">
                Reports
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 text-sm">
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
