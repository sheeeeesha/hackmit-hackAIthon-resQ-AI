import Link from "next/link";
import Image from 'next/image'; // Import the Image component

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Logo and Title */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/resqai_logo.svg" // Replace with the correct path to your logo
            alt="ResQAI Logo"
            width={100} // Adjust as needed
            height={100} // Adjust as needed
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Welcome to ResQAI
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Intelligent emergency response, at your fingertips.
        </p>

        {/* Get Started Button */}
        <div className="flex justify-center">
          <Link href="/dashboard">
            <button className="mt-4 px-8 py-3 text-white font-lexend rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Optional: Add some visually appealing background or elements */}
      {/* Example: A subtle background image or animation */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-20"></div> */}
    </div>
  );
}