import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-sm"
          >
            Go to Homepage
          </Link>
          <Link
            href="/career-twin"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
          >
            Build Your CV
          </Link>
        </div>
      </div>
    </div>
  );
}
