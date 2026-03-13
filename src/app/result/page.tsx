import { Suspense } from "react";
import ResultClient from "./result-client";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-black via-emerald-950 to-black text-emerald-50">
          <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-3 px-4 py-8">
            <div className="flex gap-2">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-300 [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-200 [animation-delay:240ms]" />
            </div>
            <p className="text-xs text-emerald-200/80">Carregando...</p>
          </main>
        </div>
      }
    >
      <ResultClient />
    </Suspense>
  );
}

