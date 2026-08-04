export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Loading review...</span>
      </div>
    </div>
  );
}
