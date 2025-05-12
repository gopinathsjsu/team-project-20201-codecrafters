import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-center text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <p className="text-center text-gray-600">
        Please check the URL or return to the{" "}
        <Link to="/" className="text-blue-600 underline">
          homepage
        </Link>
        .
      </p>
    </div>
  );
};

export default NoPage;
