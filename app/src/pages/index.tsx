import { Inter } from "next/font/google";
import Head from "next/head";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [formMode, setFormMode] = useState<"input" | "dashboard">("input");

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-300 to-orange-400 flex flex-col ${inter.className}`}
    >
      <Head>
        <title>Sustaina</title>
      </Head>

      {/* Header Section */}
      <div className="flex justify-end items-center p-4 mb-24"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-7xl inline-block transform mb-2">🌿</span>

        <h1 className="text-white text-4xl font-bold mb-2">Sustaina</h1>
        <p className="text-white text-lg">
          Streamlining Akash and Archway Rewards!
        </p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow mb-24">
        <div className="bg-white py-6 px-4 rounded-lg shadow-md max-w-lg w-full border border-green-200">
          <form className="space-y-4">
            {formMode === "input" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Akash Deployment Owner
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter Akash Deployment Owner"
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Akash Deployment Deseg
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter Akash Deployment Deseg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Archway Contract Address
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter Archway Contract Address"
                />
                <button
                  type="button"
                  onClick={() => setFormMode("dashboard")}
                  className="mt-4 w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
            {formMode === "dashboard" && <div>b</div>}
          </form>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Secret Sponsor Tx
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </header>
            <div className="space-y-4">Modal</div>
          </div>
        </div>
      )}
    </div>
  );
}
