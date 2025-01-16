"use client";

import { error } from "console";

export default function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // console.log(error);
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex flex-col w-dvw h-dvh items-center justify-center">
        <h2 className="text-2xl text-brand-text-primary">
          Something went wrong!
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="text-lg text-brand-text-secondary"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
