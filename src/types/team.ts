export type TeamType = "national" | "club";

export interface Team {
  id: number;
  name: string;
  displayName: string;
  type: TeamType;
  country: string | null;
  league: string | null;
  overall: number | null;
  stars: number | null;
  badgeUrl: string;
  isActive: boolean;
}

