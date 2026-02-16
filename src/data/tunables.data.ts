import type { Tag, Props as TunableProps } from '~/components/tunable/tunable';

const EMOTE_TAG: Tag = { text: 'emote', colorPalette: 'orange' } as const;
const TAUNT_TAG: Tag = { text: 'taunt', colorPalette: 'orange' } as const;
const CLIENT_TAG: Tag = { text: 'client', colorPalette: 'mint' } as const;
const CONNECTION_TAG: Tag = {
  text: 'connection',
  colorPalette: 'teal',
} as const;
const TIMEOUT_TAG: Tag = { text: 'timeout', colorPalette: 'amber' } as const;
const PENALTY_TAG: Tag = { text: 'penalty', colorPalette: 'red' } as const;
const MMR_TAG: Tag = { text: 'mmr', colorPalette: 'amber' } as const;
const NEW_PLAYER_TAG: Tag = {
  text: 'new player',
  colorPalette: 'amber',
} as const;
const STREET_RANK_TAG: Tag = {
  text: 'street rank',
  colorPalette: 'amber',
} as const;
const DROID_TAG: Tag = {
  text: 'droid',
  colorPalette: 'amber',
} as const;
const CREW_TAG: Tag = {
  text: 'crew',
  colorPalette: 'amber',
} as const;
const PLAYER_TAG: Tag = {
  text: 'player',
  colorPalette: 'amber',
} as const;
const MATCHMAKING_TAG: Tag = {
  text: 'matchmaking',
  colorPalette: 'purple',
} as const;
const QUICKPLAY_TAG: Tag = {
  text: 'quickplay',
  colorPalette: 'green',
} as const;
const RANKED_TAG: Tag = {
  text: 'ranked',
  colorPalette: 'violet',
} as const;
const SERVER_TAG: Tag = {
  text: 'server',
  colorPalette: 'blue',
} as const;
const HTTP_TAG: Tag = {
  text: 'http',
  colorPalette: 'cyan',
} as const;
const DB_TAG: Tag = {
  text: 'database',
  colorPalette: 'brown',
} as const;
const COMMERCE_TAG: Tag = {
  text: 'commerce',
  colorPalette: 'yellow',
} as const;
const TRIAL_TAG: Tag = {
  text: 'trial',
  colorPalette: 'pink',
} as const;
const AB_EXPERIMENT_TAG: Tag = {
  text: 'experiment',
  colorPalette: 'indigo',
} as const;
const DEBUG_TAG: Tag = {
  text: 'debug',
  colorPalette: 'gray',
} as const;

export const TUNABLES: TunableProps[] = [
  {
    id: 'emote_cooldown_seconds',
    description:
      'The amount of seconds that need to pass before the player can use an emote again. Used to prevent emote spamming.',
    tags: [EMOTE_TAG],
    defaultValue: 0,
  },
  {
    id: 'emote_cooldown_stock',
    description: '',
    tags: [EMOTE_TAG],
    defaultValue: 3,
  },
  {
    id: 'emote_cooldown_stock_replenish_seconds',
    description: '',
    tags: [EMOTE_TAG],
    defaultValue: 1,
  },
  {
    id: 'taunt_cooldown_seconds',
    description: '',
    tags: [TAUNT_TAG],
    defaultValue: 0,
  },
  {
    id: 'taunt_cooldown_stock',
    description: '',
    tags: [TAUNT_TAG],
    defaultValue: 3,
  },
  {
    id: 'taunt_cooldown_stock_replenish_seconds',
    description: '',
    tags: [TAUNT_TAG],
    defaultValue: 1,
  },
  {
    id: 'server_reconnect_attempt_limit',
    description:
      'The maximum number of attempts a gameserver will try to reconnect with the master server. Theory: Server will shutdown.',
    tags: [CONNECTION_TAG],
    defaultValue: 6,
  },
  {
    id: 'client_reconnect_attempt_limit',
    description:
      'The maximum number of attempts a client will try to reconnect before being kicked from a gameserver.',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 6,
  },
  {
    id: 'client_reconnect_interval_ms',
    description:
      'The amount of time that needs to pass before the next reconnect attempt of the client.',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 6000,
  },
  {
    id: 'client_reconnect_grace_period_ms',
    description: '',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 20000,
  },
  {
    id: 'reconnect_grace_period_ms',
    description: '',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 300000,
  },
  {
    id: 'crew_lookups_max',
    description: '',
    tags: [CREW_TAG],
    defaultValue: 3,
  },
  {
    id: 'max_crew_members',
    description: 'The maximum number of brawlers a crew can have.',
    tags: [CREW_TAG],
    defaultValue: 32,
  },
  {
    id: 'max_crew_invites',
    description: 'The maximum number of open invites a crew can have.',
    tags: [CREW_TAG],
    defaultValue: 100,
  },
  {
    id: 'max_recent_players',
    description:
      'The maximum number of brawlers that are listed as recent players.',
    tags: [PLAYER_TAG],
    defaultValue: 100,
  },
  {
    id: 'max_friends',
    description: 'The maximum number of friends a brawler can have.',
    tags: [PLAYER_TAG],
    defaultValue: 2000,
  },
  {
    id: 'max_blocks',
    description: 'The maximum number of user blocks a brawler can have.',
    tags: [PLAYER_TAG],
    defaultValue: 1000,
  },
  {
    id: 'max_friend_requests',
    description:
      'The maximum number of open friend requests a brawler can have.',
    tags: [PLAYER_TAG],
    defaultValue: 100,
  },
  {
    id: 'max_blocked_platform_players',
    description:
      'The maximum number of user blocks on console a brawler can have.',
    tags: [PLAYER_TAG],
    defaultValue: 500,
  },
  {
    id: 'playable_ping_max',
    description:
      'The maximum ping a player can have before being kicked from the gameserver.',
    tags: [CONNECTION_TAG],
    defaultValue: 500,
  },
  {
    id: 'eaten_throw_threshold_ms',
    description: '',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 300,
  },
  {
    id: 'ping_alert_threshold',
    description:
      'The maximum ping after which a warning will be displayed to the user.',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 125,
  },
  {
    id: 'loss_alert_threshold',
    description:
      'The maximum amount of package loss after which a warning will be displayed to the user.',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 10,
  },
  {
    id: 'jitter_alert_threshold',
    description:
      'The maximum amount of jitter after which a warning will be displayed to the user.',
    tags: [CLIENT_TAG, CONNECTION_TAG],
    defaultValue: 25,
  },
  {
    id: 'ping_timeout_ms',
    description:
      'The amount of time that needs to pass before a user gets deemed as timeouted.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 1000,
  },
  {
    id: 'present_match_timeout_seconds',
    description: '',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 10,
  },
  {
    id: 'client_matchmaking_request_timeout_ms',
    description:
      'The amount of time that needs to pass before the client matchmaking request gets deemed as timeouted.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 10000,
  },
  {
    id: 'load_hideout_timeout_seconds',
    description:
      'The amount of time that needs to pass before loading into the hideout is deemed as timeouted.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 300,
  },
  {
    id: 'load_hideout_cosmetics_timeout_seconds',
    description:
      'The amount of time that needs to pass before the loading of cosmetics in the hideout from a user are deemed as timeouted. If this is the case the brawler of the user will be displayed as a "default" look.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 30,
  },
  {
    id: 'load_match_timeout_seconds',
    description:
      'The amount of time that needs to pass before loading into the match is deemed as timeouted.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 60,
  },
  {
    id: 'load_match_cosmetics_timeout_seconds',
    description:
      'The amount of time that needs to pass before the loading of cosmetics during a match from a user are deemed as timeouted. If this is the case the brawler of the user will be displayed as a "default" look.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 30,
  },
  {
    id: 'load_match_jip_cosmetics_timeout_seconds',
    description:
      'The amount of time that needs to pass before the loading of cosmetics during a match that the users joins while its in progress before deemed as timeouted.  If this is the case the brawler of the user will be displayed as a "default" look.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 30,
  },
  {
    id: 'load_match_jip_timeout_seconds',
    description:
      'The amount of time that needs to pass before loading into a match that is already in progress is deemed as timeouted.',
    tags: [CONNECTION_TAG, TIMEOUT_TAG],
    defaultValue: 60,
  },
  {
    id: 'quit_penalty_marks_per_quickplay',
    description:
      'The number of penalty marks a user gets when leaving a quickplay match.',
    tags: [PENALTY_TAG],
    defaultValue: 5,
  },
  {
    id: 'quit_penalty_marks_per_ranked',
    description:
      'The number of penalty marks a user gets when leaving a ranked match.',
    tags: [PENALTY_TAG],
    defaultValue: 10,
  },
  {
    id: 'max_quit_penalty_mark_count',
    description:
      'The maximum number of penalty marks a user can have before a matchmaking ban is issued.',
    tags: [PENALTY_TAG],
    defaultValue: 75,
  },
  {
    id: 'quit_penalty_marks_removed_per_match',
    description:
      'The number of penalty marks that are removed when a user finished a match.',
    tags: [PENALTY_TAG],
    defaultValue: 1,
  },
  {
    id: 'quit_penalty_marks_removed_per_day',
    description:
      'The maximum number of penalty marks that can be removed from a user per day.',
    tags: [PENALTY_TAG],
    defaultValue: 10,
  },
  {
    id: 'match_xp_multiplier',
    description:
      'The multiplier by which the final experience points of a match gets multiplied with.',
    tags: [STREET_RANK_TAG],
    defaultValue: 1,
  },
  {
    id: 'mmr_loss_on_quit',
    description: 'The amount of MMR that is lost when leaving a game.',
    tags: [MMR_TAG],
    defaultValue: 50,
  },
  {
    id: 'new_player_mmr_discount_wins_count',
    description: '',
    tags: [NEW_PLAYER_TAG, MMR_TAG],
    defaultValue: 25,
  },
  {
    id: 'default_skill_rating_change_on_win',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 20,
  },
  {
    id: 'default_skill_rating_change_on_loss',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 20,
  },
  {
    id: 'skill_rating_multiplier_on_win_with_high_mmr',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 110,
  },
  {
    id: 'skill_rating_multiplier_on_loss_with_high_mmr',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 90,
  },
  {
    id: 'skill_rating_multiplier_on_win_with_low_mmr',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 90,
  },
  {
    id: 'skill_rating_multiplier_on_loss_with_low_mmr',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 110,
  },
  {
    id: 'skill_rating_change_adjustment_1',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 2,
  },
  {
    id: 'skill_rating_change_adjustment_1_threshold',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 4000,
  },
  {
    id: 'skill_rating_change_adjustment_2',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 4,
  },
  {
    id: 'skill_rating_change_adjustment_2_threshold',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 4500,
  },
  {
    id: 'skill_rating_change_adjustment_3',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 8,
  },
  {
    id: 'skill_rating_change_adjustment_3_threshold',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 4900,
  },
  {
    id: 'skill_rating_mmr_difference_adjustment_threshold',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 200,
  },
  {
    id: 'skill_decay_threshold',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 4900,
  },
  {
    id: 'skill_decay_amount',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 100,
  },
  {
    id: 'skill_decay_update_ms',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 300000,
  },
  {
    id: 'skill_decay_update_batch_size',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 100,
  },
  {
    id: 'skill_decay_period_seconds',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 604800,
  },
  {
    id: 'skill_decay_period_leeway_seconds',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 86400,
  },
  {
    id: 'missing_teammate_loss_forgiveness_match_percentage',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 25,
  },
  {
    id: 'loss_forgiveness_skill_rating_bonus_percentage',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 10,
  },
  {
    id: 'max_tier_that_allows_for_loss_forgiveness',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 7,
  },
  {
    id: 'max_tier_that_allows_for_loss_forgiveness_bonus_point',
    description: '',
    tags: [MMR_TAG],
    defaultValue: 3,
  },
  {
    id: 'new_player_raw_street_level',
    description: '',
    tags: [NEW_PLAYER_TAG, STREET_RANK_TAG],
    defaultValue: 50,
  },
  {
    id: 'respawn_tips_max_street_rank',
    description: '',
    tags: [CLIENT_TAG, STREET_RANK_TAG],
    defaultValue: 50,
  },
  {
    id: 'droid_skill_offset',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_human_vs_human_skill_offset',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_charge_duration_ms_max_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1500,
  },
  {
    id: 'droid_charge_duration_ms_max_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 3000,
  },
  {
    id: 'droid_charge_duration_ms_min_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 100,
  },
  {
    id: 'droid_charge_duration_ms_min_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1000,
  },
  {
    id: 'droid_defend_chance_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 75,
  },
  {
    id: 'droid_defend_chance_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_desired_distance_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 900,
  },
  {
    id: 'droid_desired_distance_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 2000,
  },
  {
    id: 'droid_fake_throw_chance_percentage_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 33,
  },
  {
    id: 'droid_fake_throw_chance_percentage_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 10,
  },
  {
    id: 'droid_fake_throw_skill_threshold',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1,
  },
  {
    id: 'droid_gang_up_skill_threshold',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1,
  },
  {
    id: 'droid_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 5,
  },
  {
    id: 'droid_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_mash_time_ms_max_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1000,
  },
  {
    id: 'droid_mash_time_ms_max_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 3000,
  },
  {
    id: 'droid_mash_time_ms_min_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_mash_time_ms_min_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1000,
  },
  {
    id: 'droid_offensive_dodge_tackle_ideal_delay_ms_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 500,
  },
  {
    id: 'droid_offensive_dodge_tackle_ideal_delay_ms_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 5000,
  },
  {
    id: 'droid_offensive_dodge_tackle_skill_threshold',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 1,
  },
  {
    id: 'droid_perfect_chance_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 30,
  },
  {
    id: 'droid_perfect_chance_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_reaction_time_ms_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 50,
  },
  {
    id: 'droid_reaction_time_ms_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 600,
  },
  {
    id: 'droid_skill_ratchet_step',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 4,
  },
  {
    id: 'droid_throw_delay_ms_max_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 500,
  },
  {
    id: 'droid_throw_delay_ms_max_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 10000,
  },
  {
    id: 'droid_throw_delay_ms_min_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 0,
  },
  {
    id: 'droid_throw_delay_ms_min_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 5000,
  },
  {
    id: 'droid_throw_visibilty_cone_half_angle_hi_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 180,
  },
  {
    id: 'droid_throw_visibilty_cone_half_angle_lo_skill',
    description: '',
    tags: [DROID_TAG],
    defaultValue: 35,
  },

  // Matchmaking - General
  {
    id: 'matchmaking_create_sessions_update_ms',
    description: '',
    tags: [MATCHMAKING_TAG, SERVER_TAG],
    defaultValue: 1000,
  },
  {
    id: 'matchmaking_create_sessions_poll_ms',
    description: '',
    tags: [MATCHMAKING_TAG, SERVER_TAG],
    defaultValue: 1111,
  },
  {
    id: 'matchmaking_users_batch_size',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 3500,
  },
  {
    id: 'matchmaking_multiplier',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 1,
  },
  {
    id: 'matchmaking_job_timeout_ms',
    description: '',
    tags: [MATCHMAKING_TAG, TIMEOUT_TAG],
    defaultValue: 10000,
  },
  {
    id: 'matchmaking_inactivity_seconds',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 2700,
  },
  {
    id: 'matchmaking_cooldown_seconds',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 5,
  },
  {
    id: 'recent_jip_history_size',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 20,
  },
  {
    id: 'minimum_volatility',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 200,
  },
  {
    id: 'volatility_reset_value',
    description: '',
    tags: [MATCHMAKING_TAG],
    defaultValue: 834,
  },

  // Matchmaking - Quickplay
  {
    id: 'quickplay_bots_start_seconds',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 10,
  },
  {
    id: 'mm_ping_max_quickplay',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 140,
  },
  {
    id: 'mm_ping_max_quickplay_seconds',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 110,
  },
  {
    id: 'mm_bend_quickplay_ping',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 90,
  },
  {
    id: 'mm_bend_quickplay_seconds',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 40,
  },
  {
    id: 'mm_quickplay_start_ping',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 60,
  },
  {
    id: 'jip_override_quickplay_seconds',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 100,
  },
  {
    id: 'recent_matches_before_jip_quickplay',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 3,
  },
  {
    id: 'quickplay_volatility_range_max',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 5000,
  },
  {
    id: 'quickplay_volatility_range_start_time',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 15,
  },
  {
    id: 'quickplay_volatility_range_mid_time',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 30,
  },
  {
    id: 'quickplay_volatility_range_max_time',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 70,
  },
  {
    id: 'quickplay_volatility_min',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 100,
  },
  {
    id: 'quickplay_volatility_start_percent',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 20,
  },
  {
    id: 'quickplay_volatility_mid_percent',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG],
    defaultValue: 100,
  },
  {
    id: 'quickplay_low_mmr_volatility_max_percent',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, MMR_TAG],
    defaultValue: 100,
  },
  {
    id: 'quickplay_low_mmr_volatility_start_mmr',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, MMR_TAG],
    defaultValue: 2000,
  },
  {
    id: 'quickplay_high_mmr_volatility_max_percent',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, MMR_TAG],
    defaultValue: 100,
  },
  {
    id: 'quickplay_high_mmr_volatility_start_mmr',
    description: '',
    tags: [QUICKPLAY_TAG, MATCHMAKING_TAG, MMR_TAG],
    defaultValue: 4000,
  },

  // Matchmaking - Ranked
  {
    id: 'mm_ping_max_ranked',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 120,
  },
  {
    id: 'mm_ping_max_ranked_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 140,
  },
  {
    id: 'mm_bend_ranked_ping',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 80,
  },
  {
    id: 'mm_bend_ranked_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 50,
  },
  {
    id: 'mm_ranked_start_ping',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG, CONNECTION_TAG],
    defaultValue: 60,
  },
  {
    id: 'jip_override_ranked_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 165,
  },
  {
    id: 'recent_matches_before_jip_ranked',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 5,
  },
  {
    id: 'ranked_exact_match_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 25,
  },
  {
    id: 'ranked_tier_match_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 190,
  },
  {
    id: 'ranked_adjacent_tier_match_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 215,
  },
  {
    id: 'ranked_2_adjacent_tier_match_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 240,
  },
  {
    id: 'ranked_tiers_lost_per_season_reset',
    description: '',
    tags: [RANKED_TAG],
    defaultValue: 1,
  },
  {
    id: 'min_wins_to_unlock_ranked',
    description: '',
    tags: [RANKED_TAG],
    defaultValue: 0,
  },
  {
    id: 'rank_bots_start_seconds',
    description: '',
    tags: [RANKED_TAG, MATCHMAKING_TAG],
    defaultValue: 15,
  },

  // New Player
  {
    id: 'new_player_starting_mmr',
    description: '',
    tags: [NEW_PLAYER_TAG, MMR_TAG],
    defaultValue: 2500,
  },
  {
    id: 'new_player_matchmaking_seconds',
    description: '',
    tags: [NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 60,
  },
  {
    id: 'new_player_regular_matchmaking_swap_seconds',
    description: '',
    tags: [NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 90,
  },
  {
    id: 'new_player_expand_seconds',
    description: '',
    tags: [NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 15,
  },
  {
    id: 'new_player_fillin_seconds',
    description: '',
    tags: [NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 60,
  },
  {
    id: 'new_player_fillin_seconds_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 1,
  },
  {
    id: 'new_player_games_played',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 0,
  },
  {
    id: 'min_games_played_to_unlock_all_quickplay',
    description: '',
    tags: [NEW_PLAYER_TAG, QUICKPLAY_TAG],
    defaultValue: 0,
  },
  {
    id: 'new_player_required_mvps_tier1',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 1,
  },
  {
    id: 'new_player_required_mvps_tier2',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 2,
  },
  {
    id: 'new_player_required_mvps_tier3',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 3,
  },
  {
    id: 'new_player_required_mvps_tier4',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 4,
  },
  {
    id: 'new_player_required_mvps_tier5',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 5,
  },
  {
    id: 'new_player_required_wins_tier1',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 2,
  },
  {
    id: 'new_player_required_wins_tier2',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 4,
  },
  {
    id: 'new_player_required_wins_tier3',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 6,
  },
  {
    id: 'new_player_required_wins_tier4',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 8,
  },
  {
    id: 'new_player_required_wins_tier5',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 10,
  },
  {
    id: 'new_player_required_matches_tier1',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 3,
  },
  {
    id: 'new_player_required_matches_tier2',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 6,
  },
  {
    id: 'new_player_required_matches_tier3',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 9,
  },
  {
    id: 'new_player_required_matches_tier4',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 12,
  },
  {
    id: 'new_player_required_matches_tier5',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 15,
  },
  {
    id: 'new_player_required_mvps_tier1_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 4,
  },
  {
    id: 'new_player_required_mvps_tier2_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 8,
  },
  {
    id: 'new_player_required_mvps_tier3_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 10,
  },
  {
    id: 'new_player_required_mvps_tier4_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 12,
  },
  {
    id: 'new_player_required_mvps_tier5_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 14,
  },
  {
    id: 'new_player_required_wins_tier1_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 5,
  },
  {
    id: 'new_player_required_wins_tier2_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 10,
  },
  {
    id: 'new_player_required_wins_tier3_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 13,
  },
  {
    id: 'new_player_required_wins_tier4_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 15,
  },
  {
    id: 'new_player_required_wins_tier5_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 17,
  },
  {
    id: 'new_player_required_matches_tier1_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 6,
  },
  {
    id: 'new_player_required_matches_tier2_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 12,
  },
  {
    id: 'new_player_required_matches_tier3_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 15,
  },
  {
    id: 'new_player_required_matches_tier4_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 18,
  },
  {
    id: 'new_player_required_matches_tier5_test_cohort',
    description: '',
    tags: [NEW_PLAYER_TAG],
    defaultValue: 20,
  },

  // Backend Server
  {
    id: 'backend_active_update_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 30000,
  },
  {
    id: 'backend_reaper_update_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 30000,
  },
  {
    id: 'backend_reaper_inactive_threshold_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 90000,
  },
  {
    id: 'backend_reaper_scan_count',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 1500,
  },
  {
    id: 'backend_reaper_scan_iterations',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 32,
  },
  {
    id: 'update_switches_and_tunables_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 30000,
  },
  {
    id: 'periodic_update_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 1000,
  },
  {
    id: 'stats_update_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 5000,
  },
  {
    id: 'telemetry_flush_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 1000,
  },
  {
    id: 'drain_batch_count',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 256,
  },
  {
    id: 'drain_batch_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 1000,
  },
  {
    id: 'poll_uuid_count',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 64,
  },
  {
    id: 'job_worker_thread_count',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 2,
  },
  {
    id: 'key_value_pairs_per_message_max',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 80,
  },

  // Game Server
  {
    id: 'game_server_timeout_seconds',
    description: '',
    tags: [SERVER_TAG, TIMEOUT_TAG],
    defaultValue: 60,
  },
  {
    id: 'game_server_redis_expire_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 9000,
  },
  {
    id: 'game_server_configure_ttl_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 300,
  },
  {
    id: 'game_server_timeout_allowance_multiplier',
    description: '',
    tags: [SERVER_TAG, TIMEOUT_TAG],
    defaultValue: 2000,
  },
  {
    id: 'game_server_timeout_decay',
    description: '',
    tags: [SERVER_TAG, TIMEOUT_TAG],
    defaultValue: 900,
  },

  // Fleet
  {
    id: 'fleet_poll_pending_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 5000,
  },
  {
    id: 'fleet_type',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'high_density_fleet_max_players',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 2,
  },

  // Client
  {
    id: 'client_timeout_ms',
    description: '',
    tags: [CLIENT_TAG, TIMEOUT_TAG],
    defaultValue: 30000,
  },
  {
    id: 'client_token_expiration_ms',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 30000,
  },
  {
    id: 'client_display_crossplay_enable_popup',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 340,
  },

  // Connection / Network
  {
    id: 'user_connections_rate_count',
    description: '',
    tags: [SERVER_TAG, CONNECTION_TAG],
    defaultValue: 1000,
  },
  {
    id: 'user_reconnections_rate_count',
    description: '',
    tags: [SERVER_TAG, CONNECTION_TAG],
    defaultValue: 10000,
  },
  {
    id: 'user_connections_rate_seconds',
    description: '',
    tags: [SERVER_TAG, CONNECTION_TAG],
    defaultValue: 0,
  },
  {
    id: 'user_message_rate_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 30,
  },
  {
    id: 'user_message_rate_count',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 2000,
  },
  {
    id: 'user_connections_max_per_backend',
    description: '',
    tags: [SERVER_TAG, CONNECTION_TAG],
    defaultValue: 40000,
  },
  {
    id: 'trial_user_connections_max_per_backend',
    description: '',
    tags: [TRIAL_TAG, SERVER_TAG, CONNECTION_TAG],
    defaultValue: 20000,
  },
  {
    id: 'qos_ping_selection',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 0,
  },
  {
    id: 'qos_ping_sample_percent',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 20,
  },
  {
    id: 'region_ping_selection',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 1,
  },
  {
    id: 'regions_update_ms',
    description: '',
    tags: [CONNECTION_TAG, SERVER_TAG],
    defaultValue: 600000,
  },
  {
    id: 'netrep_packet_max_high_bandwidth',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 1180,
  },
  {
    id: 'netrep_packet_max_low_bandwidth',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 500,
  },
  {
    id: 'upnp_update_ms',
    description: '',
    tags: [CONNECTION_TAG],
    defaultValue: 300000,
  },

  // HTTP
  {
    id: 'http_circuit_breaker_error_limit',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG],
    defaultValue: 10,
  },
  {
    id: 'http_circuit_breaker_error_time_limit_ms',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG],
    defaultValue: 5000,
  },
  {
    id: 'http_circuit_breaker_timeout_ms',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG, TIMEOUT_TAG],
    defaultValue: 10000,
  },
  {
    id: 'http_keepalive_age_max_ms',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG],
    defaultValue: 180000,
  },
  {
    id: 'http_keepalive_idle_max_ms',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG],
    defaultValue: 5000,
  },
  {
    id: 'http_keepalive_request_max',
    description: '',
    tags: [HTTP_TAG, SERVER_TAG],
    defaultValue: 999,
  },

  // Database
  {
    id: 'db_statements_per_session_max',
    description: '',
    tags: [DB_TAG],
    defaultValue: 10000000,
  },
  {
    id: 'db_connection_count',
    description: '',
    tags: [DB_TAG],
    defaultValue: 4,
  },

  // Inactivity
  {
    id: 'public_gameplay_inactivity_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 60,
  },
  {
    id: 'commerce_and_credits_inactivity_seconds',
    description: '',
    tags: [SERVER_TAG, COMMERCE_TAG],
    defaultValue: 1020,
  },
  {
    id: 'solo_inactivity_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 600,
  },
  {
    id: 'group_inactivity_seconds',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 600,
  },

  // Penalty / Moderation
  {
    id: 'quit_penalty_enforcement_time',
    description: '',
    tags: [PENALTY_TAG],
    defaultValue: 0,
  },
  {
    id: 'sanctions_update_ms',
    description: '',
    tags: [PENALTY_TAG, SERVER_TAG],
    defaultValue: 3600000,
  },
  {
    id: 'right_to_be_forgotten_ms',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 600000,
  },

  // Player
  {
    id: 'max_first_party_friend_results',
    description: '',
    tags: [PLAYER_TAG],
    defaultValue: 192,
  },
  {
    id: 'max_friends_per_message',
    description: '',
    tags: [PLAYER_TAG],
    defaultValue: 256,
  },
  {
    id: 'skill_stats_valid_user_id_min',
    description: '',
    tags: [PLAYER_TAG, MMR_TAG],
    defaultValue: 0,
  },

  // Crew
  {
    id: 'crew_contracts_window_days',
    description: '',
    tags: [CREW_TAG],
    defaultValue: 126,
  },
  {
    id: 'crew_profanity_check_frequency_minutes',
    description: '',
    tags: [CREW_TAG],
    defaultValue: 60,
  },

  // Commerce
  {
    id: 'commerce_currency_expiration_seconds',
    description: '',
    tags: [COMMERCE_TAG],
    defaultValue: 15552000,
  },
  {
    id: 'commerce_offers_per_message',
    description: '',
    tags: [COMMERCE_TAG],
    defaultValue: 1280,
  },
  {
    id: 'confirm_platform_purchase_rate_limit_ms',
    description: '',
    tags: [COMMERCE_TAG],
    defaultValue: 10000,
  },
  {
    id: 'velan_marketplace_migrate_interval_ms',
    description: '',
    tags: [COMMERCE_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'velan_marketplace_migrate_count_per_interval',
    description: '',
    tags: [COMMERCE_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'marketplace_environment',
    description: '',
    tags: [COMMERCE_TAG],
    defaultValue: 12,
  },
  {
    id: 'epic_promo_armazillo_end_utc',
    description: '',
    tags: [COMMERCE_TAG],
    defaultValue: 1662465600,
  },

  // Trial
  {
    id: 'begin_trial_checks_timestamp_utc',
    description: '',
    tags: [TRIAL_TAG],
    defaultValue: 1623196800,
  },
  {
    id: 'end_trial_checks_timestamp_utc',
    description: '',
    tags: [TRIAL_TAG],
    defaultValue: 1654084800,
  },
  {
    id: 'trial_level_cap',
    description: '',
    tags: [TRIAL_TAG],
    defaultValue: 25,
  },

  // Contracts
  {
    id: 'max_contracts_per_contract_progress_message',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 25,
  },
  {
    id: 'max_contracts_per_crew_contract_get_message',
    description: '',
    tags: [CREW_TAG, SERVER_TAG],
    defaultValue: 800,
  },
  {
    id: 'contract_hud_widget_display_time_seconds',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 10,
  },

  // Leaderboard / Dashboard
  {
    id: 'leaderboard_page_size_max',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 500,
  },
  {
    id: 'dashboard_query_timeout_seconds',
    description: '',
    tags: [SERVER_TAG, TIMEOUT_TAG],
    defaultValue: 30,
  },
  {
    id: 'dashboard_profile_lookup_limit',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 50,
  },

  // Progression / XP
  {
    id: 'minimum_changelist_to_rebalance_xp',
    description: '',
    tags: [STREET_RANK_TAG, SERVER_TAG],
    defaultValue: 203000,
  },
  {
    id: 'progression_2_0_migrate_interval_ms',
    description: '',
    tags: [STREET_RANK_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'progression_2_0_migrate_count_per_interval',
    description: '',
    tags: [STREET_RANK_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'season_6_xp_rebalance_interval_ms',
    description: '',
    tags: [STREET_RANK_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'season_6_xp_rebalance_count_per_interval',
    description: '',
    tags: [STREET_RANK_TAG, SERVER_TAG],
    defaultValue: 0,
  },
  {
    id: 'daily_hideout_bonus_max_days',
    description: '',
    tags: [STREET_RANK_TAG],
    defaultValue: 7,
  },

  // Gameplay / Match
  {
    id: 'match_score_blowout_percentage',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 301,
  },
  {
    id: 'catch_data_collection_max_distance',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: -1,
  },

  // UI / Client
  {
    id: 'cooldown_hud_display_seconds',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 5,
  },
  {
    id: 'periodic_upsell_rate_for_1st_visit_seconds',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 28800,
  },
  {
    id: 'periodic_upsell_rate_for_2nd_visit_seconds',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 28800,
  },
  {
    id: 'training_reminder_popup_interval_minutes',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 30,
  },
  {
    id: 'fun_survey_appearance_rate',
    description: '',
    tags: [CLIENT_TAG],
    defaultValue: 0,
  },

  // AB Experiments / Cohorts
  {
    id: 'active_cohort_set',
    description: '',
    tags: [AB_EXPERIMENT_TAG],
    defaultValue: 2,
  },
  {
    id: 'cohort_override',
    description: '',
    tags: [AB_EXPERIMENT_TAG],
    defaultValue: -1,
  },
  {
    id: 'ab_experiment_linear_ftue_behavior',
    description: '',
    tags: [AB_EXPERIMENT_TAG],
    defaultValue: 0,
  },
  {
    id: 'ab_experiment_faster_new_player_bot_matchmaking',
    description: '',
    tags: [AB_EXPERIMENT_TAG, NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 0,
  },
  {
    id: 'ab_experiment_no_new_player_matchmaking_behavior',
    description: '',
    tags: [AB_EXPERIMENT_TAG, NEW_PLAYER_TAG, MATCHMAKING_TAG],
    defaultValue: 3,
  },
  {
    id: 'ab_experiment_new_news_screen_behavior',
    description: '',
    tags: [AB_EXPERIMENT_TAG],
    defaultValue: 0,
  },
  {
    id: 'ab_experiment_upsell_freq_behavior',
    description: '',
    tags: [AB_EXPERIMENT_TAG],
    defaultValue: 0,
  },

  // Infrastructure
  {
    id: 'ea_environment',
    description: '',
    tags: [SERVER_TAG],
    defaultValue: 0,
  },

  // Debug
  {
    id: 'use_legacy_player_connection_logic',
    description: '',
    tags: [DEBUG_TAG, CONNECTION_TAG],
    defaultValue: 0,
  },
  {
    id: 'debug_loadtest_current_season',
    description: '',
    tags: [DEBUG_TAG],
    defaultValue: 1,
  },
  {
    id: 'debug_utc',
    description: '',
    tags: [DEBUG_TAG],
    defaultValue: 0,
  },
  {
    id: 'debug_utc_set_at',
    description: '',
    tags: [DEBUG_TAG],
    defaultValue: 1771344197,
  },
];
