"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TeamCategory = "all" | "national" | "club";

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState<TeamCategory>("all");
  const [minStars, setMinStars] = useState<number>(0);

  const handleGoToDraw = () => {
    const params = new URLSearchParams();
    params.set("category", category);
    params.set("minStars", String(minStars));
    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-emerald-950 to-black text-emerald-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Kick-off Randomizer
            </p>
            <h1 className="mt-1 text-2xl font-semibold">
              Match Day Draw
            </h1>
          </div>
          <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Ultimate FIFA Picker
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="space-y-6 rounded-3xl border border-emerald-500/30 bg-black/60 p-5 shadow-xl shadow-emerald-900/40">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Configurações do Sorteio
            </h2>

            <div className="space-y-4">
              <p className="text-xs font-medium text-emerald-200/80">
                Categoria de Times
              </p>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    category === "all"
                      ? "border-emerald-400 bg-emerald-500/15"
                      : "border-emerald-500/20 bg-black/30 hover:border-emerald-400/60"
                  }`}
                >
                  <div>
                    <p className="font-medium">Incluir Seleções</p>
                    <p className="text-xs text-emerald-100/70">
                      Experiência completa com seleções e clubes.
                    </p>
                  </div>
                  <span className="h-5 w-5 rounded-full border border-emerald-400 bg-emerald-500/40" />
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("national")}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    category === "national"
                      ? "border-emerald-400 bg-emerald-500/15"
                      : "border-emerald-500/20 bg-black/30 hover:border-emerald-400/60"
                  }`}
                >
                  <div>
                    <p className="font-medium">Apenas Seleções</p>
                    <p className="text-xs text-emerald-100/70">
                      Clima de Copa do Mundo garantido.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("club")}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    category === "club"
                      ? "border-emerald-400 bg-emerald-500/15"
                      : "border-emerald-500/20 bg-black/30 hover:border-emerald-400/60"
                  }`}
                >
                  <div>
                    <p className="font-medium">Apenas Clubes</p>
                    <p className="text-xs text-emerald-100/70">
                      Ligas europeias e resto do mundo.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-emerald-200/80">
                Filtros Rápidos
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMinStars(0)}
                  className={`rounded-full border px-3 py-1 ${
                    minStars === 0
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-emerald-500/30 bg-black/40 hover:border-emerald-400/60"
                  }`}
                >
                  Todos os níveis
                </button>
                <button
                  type="button"
                  onClick={() => setMinStars(4)}
                  className={`rounded-full border px-3 py-1 ${
                    minStars === 4
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-emerald-500/30 bg-black/40 hover:border-emerald-400/60"
                  }`}
                >
                  4★+
                </button>
                <button
                  type="button"
                  onClick={() => setMinStars(5)}
                  className={`rounded-full border px-3 py-1 ${
                    minStars === 5
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-emerald-500/30 bg-black/40 hover:border-emerald-400/60"
                  }`}
                >
                  5★ apenas
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoToDraw}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Sortear Times
            </button>

            <p className="mt-2 text-[11px] text-emerald-200/70">
              As configurações escolhidas serão usadas para o sorteio.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-900/80 to-black/70 p-5 text-sm text-emerald-100 shadow-[0_0_120px_rgba(16,185,129,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Como funciona
            </p>
            <p>
              Escolha as regras do sorteio e clique em{" "}
              <span className="font-semibold text-emerald-300">
                Sortear Times
              </span>
              . Na próxima tela você verá uma animação de sorteio e o
              confronto gerado.
            </p>
            <p className="text-xs text-emerald-200/80">
              Depois podemos evoluir para mostrar histórico, favoritos e
              modos especiais de equilíbrio entre os times.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

interface TeamCardProps {
  label: string;
  team: Team | null;
}

function TeamCard({ label, team }: TeamCardProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
        {label}
      </p>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-900/70 to-black/80">
        {team ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.badgeUrl}
            alt={team.displayName}
            className="h-14 w-14 object-contain"
          />
        ) : (
          <span className="text-[10px] text-emerald-200/70">
            Aguardando
          </span>
        )}
      </div>
      <p className="truncate text-xs font-medium text-emerald-50">
        {team ? team.displayName : "—"}
      </p>
      {team?.stars != null && (
        <p className="text-[10px] text-emerald-200/80">
          {"★".repeat(team.stars)}{" "}
        </p>
      )}
    </div>
  );
}

