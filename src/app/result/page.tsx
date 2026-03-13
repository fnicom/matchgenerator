"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Team } from "@/types/team";

type TeamCategory = "all" | "national" | "club";

interface ApiTeam {
  id: number;
  name: string;
  strength: number | null;
  badge_url: string;
  type: "national" | "club";
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") as TeamCategory) || "all";
  const minStars = Number(searchParams.get("minStars") ?? 0);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        const res = await fetch("/api/teams");
        if (!res.ok) {
          throw new Error("Não foi possível carregar os times.");
        }
        const data: ApiTeam[] = await res.json();

        const mapped: Team[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          displayName: t.name,
          type: t.type,
          country: null,
          league: null,
          overall: t.strength,
          stars: t.strength,
          badgeUrl: t.badge_url,
          isActive: true,
        }));

        setTeams(mapped);
        setError(null);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Erro inesperado ao carregar times.",
        );
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      if (!team.isActive) return false;
      if (category === "national" && team.type !== "national") return false;
      if (category === "club" && team.type !== "club") return false;
      if (minStars > 0 && (team.stars ?? 0) < minStars) return false;
      return true;
    });
  }, [teams, category, minStars]);

  useEffect(() => {
    if (!loadingTeams && filteredTeams.length >= 2) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        const shuffled = [...filteredTeams].sort(() => Math.random() - 0.5);
        setHomeTeam(shuffled[0]);
        setAwayTeam(shuffled[1]);
        setIsAnimating(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [loadingTeams, filteredTeams]);

  const handleBack = () => {
    router.push("/");
  };

  const handleDrawAgain = () => {
    if (filteredTeams.length < 2) return;
    setIsAnimating(true);
    setHomeTeam(null);
    setAwayTeam(null);

    setTimeout(() => {
      const shuffled = [...filteredTeams].sort(() => Math.random() - 0.5);
      setHomeTeam(shuffled[0]);
      setAwayTeam(shuffled[1]);
      setIsAnimating(false);
    }, 1200);
  };

  const showErrorState =
    !loadingTeams && (error || filteredTeams.length < 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-emerald-950 to-black text-emerald-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-emerald-500/40 bg-black/50 px-3 py-1 text-xs font-medium text-emerald-200 hover:border-emerald-300 hover:text-emerald-100"
          >
            ← Configurar sorteio
          </button>
          <div className="text-right text-xs text-emerald-200/80">
            <p className="font-semibold uppercase tracking-[0.25em] text-emerald-400">
              FIFA Randomizer
            </p>
            <p>Calculando melhor confronto...</p>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 rounded-3xl border border-emerald-500/30 bg-black/70 p-6 shadow-[0_0_120px_rgba(16,185,129,0.35)]">
          {showErrorState ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm">
              <p className="text-red-300">
                {error ??
                  "Poucos times disponíveis para essa combinação de filtros."}
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400"
              >
                Ajustar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  {isAnimating ? "Sorteando times..." : "Pronto para o Kickoff"}
                </p>
                <h1 className="text-xl font-semibold">
                  {isAnimating
                    ? "O algoritmo está analisando as melhores opções"
                    : "Confronto definido!"}
                </h1>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-3xl bg-gradient-to-b from-emerald-900/80 to-black/80 p-5">
                  <TeamCard
                    label="HOME"
                    team={isAnimating ? null : homeTeam}
                    placeholder={isAnimating}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black shadow-lg shadow-emerald-900/70">
                    VS
                  </div>
                  <TeamCard
                    label="AWAY"
                    team={isAnimating ? null : awayTeam}
                    placeholder={isAnimating}
                  />
                </div>

                <LoadingAnimation
                  isAnimating={isAnimating}
                  loadingTeams={loadingTeams}
                />
              </div>

              <div className="mt-4 flex flex-col items-center gap-3 text-xs text-emerald-200/80">
                <button
                  type="button"
                  onClick={handleDrawAgain}
                  disabled={isAnimating || filteredTeams.length < 2}
                  className="rounded-full bg-emerald-500 px-6 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-800/60"
                >
                  Sortear de novo
                </button>
                <p>
                  Filtros atuais:{" "}
                  <span className="font-medium text-emerald-100">
                    {category === "all"
                      ? "Clubes + Seleções"
                      : category === "national"
                        ? "Apenas Seleções"
                        : "Apenas Clubes"}
                  </span>
                  {minStars > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      <span className="font-medium text-emerald-100">
                        {minStars}★+
                      </span>
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

interface TeamCardProps {
  label: string;
  team: Team | null;
  placeholder?: boolean;
}

function TeamCard({ label, team, placeholder }: TeamCardProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
        {label}
      </p>
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-900/70 to-black/80">
        {placeholder ? (
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-emerald-500/40" />
        ) : team ? (
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
        {team ? team.displayName : placeholder ? "Sorteando..." : "—"}
      </p>
      {team?.stars != null && !placeholder && (
        <p className="text-[10px] text-emerald-200/80">
          {"★".repeat(team.stars)}{" "}
        </p>
      )}
    </div>
  );
}

interface LoadingAnimationProps {
  isAnimating: boolean;
  loadingTeams: boolean;
}

function LoadingAnimation({ isAnimating, loadingTeams }: LoadingAnimationProps) {
  if (loadingTeams) {
    return (
      <div className="flex flex-col items-center gap-3 text-xs text-emerald-200/80">
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-300 [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-200 [animation-delay:240ms]" />
        </div>
        <p>Carregando times da base de dados...</p>
      </div>
    );
  }

  if (isAnimating) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <div className="flex h-10 items-center gap-3 text-[11px] text-emerald-200/80">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          </span>
          <span>Escolhendo as melhores combinações...</span>
        </div>
        <div className="flex w-full justify-center gap-2 text-[10px] text-emerald-300/80">
          <span className="animate-pulse">Analisando força dos times</span>
          <span>·</span>
          <span className="animate-pulse [animation-delay:160ms]">
            Evitando repetidos
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 text-[11px] text-emerald-200/80">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/60 px-3 py-1">
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span>Confronto pronto! Boa partida.</span>
      </div>
    </div>
  );
}

