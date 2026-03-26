import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cool-2 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-navy mb-2">404</h1>
      <p className="text-lg text-gray-500 mb-6">Page not found.</p>
      <Link
        href="/"
        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy-dark transition-colors"
      >
        Back to CV
      </Link>
    </div>
  )
}
