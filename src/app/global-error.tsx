"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#f7f5ed] text-[#33140c] flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#e5e0cf] shadow-xl text-center">
          <h2 className="text-2xl font-serif font-bold mb-3 text-[#33140c]">Something went wrong</h2>
          <p className="text-sm text-[#61929a] mb-6">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full font-semibold text-white bg-gradient-to-b from-[#45632d] to-[#2b3d1c] hover:from-[#4b6b31] hover:to-[#30451f] transition-all"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

