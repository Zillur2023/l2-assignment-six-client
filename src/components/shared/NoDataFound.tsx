import { useRouter } from 'next/navigation';

const NoDataFound = () => {
  const router = useRouter(); // for navigating back or refreshing
  
  const handleGoBack = () => {
    router.push('/'); // Change to your desired route, or use `router.back()` to go back
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <div className="flex flex-col items-center">
      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-full shadow-md mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-3-3v6m8 8a9 9 0 10-18 0 9 9 0 0018 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">No Data Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
        Sorry, we couldn&apos;t find any data matching your criteria. Please try adjusting your filters or come back later.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </div>
  </div>
  );
};

export default NoDataFound;
