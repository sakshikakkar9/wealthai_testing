import React from "react";
import { Link } from "react-router-dom";

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">
        This page is currently under development. Please check back later.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default PlaceholderPage;
