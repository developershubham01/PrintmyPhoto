"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md w-full bg-card rounded-3xl p-8 border border-border shadow-xl text-center">
        <h2 className="text-2xl font-display font-bold mb-3 text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <button
          onClick={() => reset()}
          className="btn-gradient px-6 py-2.5 rounded-full font-semibold text-white transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

