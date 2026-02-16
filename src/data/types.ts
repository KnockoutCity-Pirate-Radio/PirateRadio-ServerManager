// ── Dashboard ──────────────────────────────────────────────────────────────────

export type ConnectedPlayer = {
  /** The user's internal ID */
  userId: string;
  /** The player's display name */
  username: string;
  /** Current round-trip latency in milliseconds */
  ping: number;
  /** Server region the player is connected to */
  region: string;
};

export type Stats = {
  /** All players currently connected to the server */
  connectedPlayers: ConnectedPlayer[];
  /** Player with the lowest ping, or null if no players are connected */
  lowestPing: ConnectedPlayer | null;
  /** Player with the highest ping, or null if no players are connected */
  highestPing: ConnectedPlayer | null;
  /** Mean ping across all connected players (0 when no players) */
  averagePing: number;
  /** Total number of registered accounts on the server */
  totalUserCount: number;
};

// ── Maintenance ────────────────────────────────────────────────────────────────

export type DenyPeriodMessage = {
  /** Database row ID */
  id: number;
  /** BCP 47 language code (e.g. 'en', 'de') */
  languageCode: string;
  /** Localised message shown to blocked players */
  message: string;
};

export type DenyPeriod = {
  /** Database row ID */
  id: number;
  /** Unix timestamp (seconds) when the deny period begins */
  startTime: number;
  /** Unix timestamp (seconds) when the deny period ends */
  endTime: number;
  /** Localised messages for this period, one per language */
  messages: DenyPeriodMessage[];
};

export type AllowlistEntry = {
  /** Numeric user ID */
  userId: number;
  /** Display name, null if the user has no username set */
  username: string | null;
};

/** Computed status of a DenyPeriod relative to the current time */
export type PeriodStatus = 'active' | 'upcoming' | 'past';

// ── Crew ───────────────────────────────────────────────────────────────────────

export type CrewMember = {
  /** User's internal ID */
  id: string;
  /** Player's display name */
  username: string;
  /** Unix timestamp (milliseconds) when the member joined */
  joinedAt: number;
  /** Whether this member is the crew captain */
  isCaptain: boolean;
};

export type Crew = {
  /** Unique crew identifier (UUID) */
  guid: string;
  /** Crew display name */
  name: string;
  /** Numeric crew code used to invite players */
  code: number;
  /** Whether the crew name is publicly visible; null means server default */
  nameVisible: boolean | null;
  /** Unix timestamp (milliseconds) when the crew was created */
  createdAt: number;
  /** Unix timestamp (milliseconds) of the last update, or null if never updated */
  updatedAt: number | null;
  /** Minimal captain info for list views (full info is in `members`) */
  captain: { id: string; username: string };
  /** Full member list including the captain */
  members: CrewMember[];
  /** Cached member count (may lag slightly behind `members.length`) */
  memberCount: number;
};

// ── User ───────────────────────────────────────────────────────────────────────

export type UserFund = {
  /** Currency identifier, e.g. 'VAR' (Style Chips) or 'CUR' (Holo Bux) */
  currency: string;
  /** Current balance for this currency */
  balance: number;
};

export type UserCrew = {
  /** Crew's unique identifier (UUID) */
  guid: string;
  /** Crew display name */
  name: string;
  /** Numeric crew code */
  code: number;
  /** Whether this user is the captain of the crew */
  isCaptain: boolean;
};

export type UserAllowlist = {
  /** Whether the user may always log in, even during deny periods */
  alwaysAllowLogin: boolean;
  /** Force the user into matchmaking cohort A */
  forceCohortA: boolean;
  /** Force the user into matchmaking cohort B */
  forceCohortB: boolean;
  /** Whether a content update is pending for this user */
  contentUpdate: boolean;
};

export type UserMatchmaking = {
  /** Unix timestamp (seconds) when matchmaking started, or null if not in queue */
  startTime: number | null;
  /** Internal match flow identifier */
  matchFlow: number;
  /** Platform identifier (e.g. 'PC', 'XBOX') */
  platform: string;
  /** UUID of the playlist the user queued for, or null */
  playlistGuid: string | null;
};

export type User = {
  /** User's internal unique ID */
  id: string;
  /** In-game display name */
  username: string;
  /** Publisher-side account name (e.g. EA account), or null if not linked */
  publisherUsername: string | null;
  /** Unix timestamp (milliseconds) when the account was created, or null */
  insertedAt: number | null;
  /** Unix timestamp (milliseconds) of the last successful login, or null */
  lastAuthenticatedAt: number | null;
  /** Whether the username is publicly visible; null means server default */
  usernameVisible: boolean | null;
  /** Raw XP earned in Season 6, or null if not tracked */
  rawXpS6: number | null;
  /** Matchmaking rating score, or null if unranked */
  mmr: number | null;
  /** UTC unix timestamp (seconds) until which the user has a matchmaking penalty, or null */
  penaltyUtc: number | null;
  /** Number of friends, or null if not loaded */
  friendCount?: number | null;
  /** Number of blocked players, or null if not loaded */
  blockCount?: number | null;
  /** All currency balances for this user */
  funds: UserFund[];
  /** Crew membership info, or null if not in a crew */
  crew: UserCrew | null;
  /** Allowlist flags, or null if the user is not allowlisted */
  allowlisted: UserAllowlist | null;
  /** Active matchmaking state, or null if not in queue */
  matchmaking: UserMatchmaking | null;
};
