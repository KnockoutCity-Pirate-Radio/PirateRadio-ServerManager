import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: text('id').primaryKey(), // bigint in DB, kept as text for compatibility
  authProvider: text('auth_provider').notNull(),
  username: text('username').notNull(),
  publisherUsername: text('publisher_username').notNull(),
  publisherUsernameCode: integer('publisher_username_code'),
  insertedAt: bigint('inserted_at', { mode: 'number' }),
  lastAuthenticatedAt: bigint('last_authenticated_at', { mode: 'number' }),
  lastAuthenticatedPlatform: text('last_authenticated_platform'),
  lastAuthenticatedPersonaNamespace: text('last_authenticated_persona_namespace').notNull(),
  usernameVisible: boolean('username_visible'),
  currencyExpires: boolean('currency_expires'),
  deleteScheduledFor: bigint('delete_scheduled_for', { mode: 'number' }),
  nucleusId: bigint('nucleus_id', { mode: 'number' }),
  nucleusIdAbandoned: bigint('nucleus_id_abandoned', { mode: 'number' }),
  xboxPersonaId: bigint('xbox_persona_id', { mode: 'number' }),
  xboxPlatformId: bigint('xbox_platform_id', { mode: 'number' }),
  switchPersonaId: bigint('switch_persona_id', { mode: 'number' }),
  switchPlatformId: bigint('switch_platform_id', { mode: 'number' }),
  playstationPersonaId: bigint('playstation_persona_id', { mode: 'number' }),
  playstationPlatformId: bigint('playstation_platform_id', { mode: 'number' }),
  originPersonaId: bigint('origin_persona_id', { mode: 'number' }),
  originPlatformId: bigint('origin_platform_id', { mode: 'number' }),
  steamPersonaId: bigint('steam_persona_id', { mode: 'number' }),
  steamPlatformId: bigint('steam_platform_id', { mode: 'number' }),
  epicAccountId: text('epic_account_id'),
  epicAccountIdAbandoned: text('epic_account_id_abandoned'),
  epicConnectId: text('epic_connect_id'),
  epicConnectIdAbandoned: text('epic_connect_id_abandoned'),
  gamesightId: bigint('gamesight_id', { mode: 'number' }).notNull(),
});

export const allowlistedUsers = pgTable('allowlisted_users', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  notes: text('notes'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  alwaysAllowLogin: boolean('always_allow_login').notNull(),
  velanValueTransfer: boolean('velan_value_transfer').notNull(),
  forceCohortA: boolean('force_cohort_a').notNull(),
  forceCohortB: boolean('force_cohort_b').notNull(),
  contentUpdate: boolean('content_update').notNull(),
});

export const userSettings = pgTable(
  'user_settings',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    key: text('key').notNull(),
    value: text('value').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

export const keyValuePairs = pgTable(
  'key_value_pairs',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    key: text('key').notNull(),
    value: text('value').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

export const blocks = pgTable(
  'blocks',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    blockedUserId: bigint('blocked_user_id', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.blockedUserId] })],
);

export const friends = pgTable(
  'friends',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    friendUserId: bigint('friend_user_id', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.friendUserId] })],
);

export const friendRequests = pgTable(
  'friend_requests',
  {
    senderUserId: bigint('sender_user_id', { mode: 'number' }).notNull(),
    recipientUserId: bigint('recipient_user_id', { mode: 'number' }).notNull(),
    senderPersonaKind: integer('sender_persona_kind').notNull(),
  },
  (t) => [primaryKey({ columns: [t.senderUserId, t.recipientUserId] })],
);

export const recentPlayers = pgTable(
  'recent_players',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    recentPlayerUserId: bigint('recent_player_user_id', { mode: 'number' }).notNull(),
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.recentPlayerUserId] })],
);

export const userMigrationWork = pgTable('user_migration_work', {
  key: text('key').notNull().primaryKey(),
  backendId: bigint('backend_id', { mode: 'number' }),
});

export const thankYouBonusQualifiedUsers = pgTable('thank_you_bonus_qualified_users', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  grantedTimestamp: integer('granted_timestamp'),
  displayed: boolean('displayed'),
});

export const valueTransferFulfilledNintendo = pgTable('value_transfer_fulfilled_nintendo', {
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  entitlementId: uuid('entitlement_id').notNull(),
});

// ---------------------------------------------------------------------------
// Skill / Ranking
// ---------------------------------------------------------------------------

export const skill = pgTable(
  'skill',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    playlistGuid: uuid('playlist_guid').notNull(),
    season: integer('season'),
    matchFlow: integer('match_flow').notNull(),
    currentMmr: integer('current_mmr'),
    currentTier: integer('current_tier'),
    currentDivision: integer('current_division'),
    currentDivisionProgress: integer('current_division_progress'),
    volatility: integer('volatility'),
    winStreak: integer('win_streak').notNull(),
    skillRating: integer('skill_rating'),
    skillRatingDecayed: integer('skill_rating_decayed'),
    totalGamesPlayed: integer('total_games_played'),
    wins: integer('wins'),
    mvps: integer('mvps'),
    timestamp: integer('timestamp').notNull(),
    decayTimestamp: integer('decay_timestamp'),
    lastMatchLossForgiveness: integer('last_match_loss_forgiveness'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.playlistGuid] })],
);

export const seasonRank = pgTable(
  'season_rank',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    season: integer('season').notNull(),
    highestRank: integer('highest_rank').notNull(),
    seasonRewardsGranted: boolean('season_rewards_granted').notNull(),
    leaderboardRewardsGranted: boolean('leaderboard_rewards_granted').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.season] })],
);

export const seasonRewards = pgTable(
  'season_rewards',
  {
    season: integer('season').notNull(),
    leagueTier: integer('league_tier').notNull(),
    reward: text('reward'),
  },
  (t) => [primaryKey({ columns: [t.season, t.leagueTier] })],
);

export const seasonLeaderboardRewards = pgTable(
  'season_leaderboard_rewards',
  {
    season: integer('season').notNull(),
    highestRank: integer('highest_rank').notNull(),
    lowestRank: integer('lowest_rank').notNull(),
    reward: text('reward'),
  },
  (t) => [primaryKey({ columns: [t.season, t.highestRank, t.lowestRank] })],
);

// ---------------------------------------------------------------------------
// Street Rank (XP / Level)
// ---------------------------------------------------------------------------

export const streetRank = pgTable('street_rank', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  rawXp: integer('raw_xp').notNull(),
  lastRewardedXp: integer('last_rewarded_xp').notNull(),
  rawXpS6: integer('raw_xp_s6').notNull(),
  lastRewardedXpS6: integer('last_rewarded_xp_s6').notNull(),
});

/** Lookup table: raw_level (PK) → total_xp / level / tier / reward */
export const streetRankRewards = pgTable('street_rank_rewards', {
  rawLevel: integer('raw_level').notNull().primaryKey(),
  totalXp: integer('total_xp'),
  deltaXp: integer('delta_xp'),
  tier: integer('tier'),
  level: integer('level'),
  reward: text('reward'),
});

/** Season 6 variant of the XP→level lookup table */
export const streetRankRewardsSeason6 = pgTable('street_rank_rewards_season_6', {
  rawLevel: integer('raw_level').notNull().primaryKey(),
  totalXp: integer('total_xp'),
  deltaXp: integer('delta_xp'),
  tier: integer('tier'),
  level: integer('level'),
  reward: text('reward'),
});

// ---------------------------------------------------------------------------
// Matchmaking / Penalties
// ---------------------------------------------------------------------------

export const matchmaking = pgTable('matchmaking', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  startTime: bigint('start_time', { mode: 'number' }),
  playlistGuid: uuid('playlist_guid'),
  matchFlow: integer('match_flow').notNull(),
  eligibleForJoinInProgress: boolean('eligible_for_join_in_progress').notNull(),
  groupSize: integer('group_size').notNull(),
  mmr: integer('mmr'),
  volatility: integer('volatility'),
  bestRegion: text('best_region').notNull(),
  clientVersion: integer('client_version').notNull(),
  platform: text('platform').notNull(),
  crossplay: boolean('crossplay').notNull(),
  tier: integer('tier'),
  division: integer('division'),
  requestId: integer('request_id').notNull(),
  gamesPlayed: integer('games_played').notNull(),
  pings: text('pings'),
  newPlayersCount: integer('new_players_count').notNull(),
  newPlayerMatchmakingTier: integer('new_player_matchmaking_tier').notNull(),
  skillRating: integer('skill_rating').notNull(),
  manualRegion: boolean('manual_region'),
});

export const matchmakingCooldown = pgTable('matchmaking_cooldown', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  utc: integer('utc'),
});

export const matchmakingParameters = pgTable('matchmaking_parameters', {
  parameter: integer('parameter').notNull().primaryKey(),
  timeInterval: integer('time_interval').notNull(),
  initialValue: integer('initial_value').notNull(),
  maxValue: integer('max_value').notNull(),
  rateOfIncrease: integer('rate_of_increase').notNull(),
});

export const matchmakingWork = pgTable(
  'matchmaking_work',
  {
    playlistGuid: uuid('playlist_guid').notNull(),
    matchFlow: integer('match_flow').notNull(),
    clientVersion: integer('client_version').notNull(),
    backendId: integer('backend_id'),
    lastPollTime: bigint('last_poll_time', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.playlistGuid, t.matchFlow, t.clientVersion] })],
);

export const quitPenalties = pgTable('quit_penalties', {
  marks: integer('marks').notNull().primaryKey(),
  durationS: integer('duration_s').notNull(),
});

export const joinInProgressPlayers = pgTable('join_in_progress_players', {
  id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
  gameServerUuid: text('game_server_uuid'),
  teamId: integer('team_id'),
  timestamp: bigint('timestamp', { mode: 'number' }),
  lastPollTime: bigint('last_poll_time', { mode: 'number' }).notNull(),
  averageMmr: integer('average_mmr').notNull(),
  playlistGuid: uuid('playlist_guid').notNull(),
  region: text('region').notNull(),
  matchFlow: integer('match_flow').notNull(),
  clientVersion: integer('client_version').notNull(),
  tier: integer('tier').notNull(),
  division: integer('division').notNull(),
  platform: text('platform').notNull(),
  crossplayAllowed: boolean('crossplay_allowed').notNull(),
  averageSr: integer('average_sr').notNull(),
});

// ---------------------------------------------------------------------------
// Crews
// ---------------------------------------------------------------------------

export const crews = pgTable('crews', {
  guid: uuid('guid').notNull().primaryKey(),
  captain: bigint('captain', { mode: 'number' }).notNull(),
  name: text('name').notNull(),
  code: integer('code').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }),
  nameVisible: boolean('name_visible'),
  namer: bigint('namer', { mode: 'number' }),
});

export const crewMembers = pgTable('crew_members', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  crewGuid: uuid('crew_guid').notNull(),
  joinedAt: bigint('joined_at', { mode: 'number' }).notNull(),
});

export const crewInvites = pgTable(
  'crew_invites',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    senderId: bigint('sender_id', { mode: 'number' }).notNull(),
    crewGuid: uuid('crew_guid').notNull(),
    senderPersonaKind: integer('sender_persona_kind').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.senderId] })],
);

export const crewJoinRequests = pgTable(
  'crew_join_requests',
  {
    recipientId: bigint('recipient_id', { mode: 'number' }).notNull(),
    senderId: bigint('sender_id', { mode: 'number' }).notNull(),
    crewGuid: uuid('crew_guid').notNull(),
  },
  (t) => [primaryKey({ columns: [t.recipientId, t.senderId] })],
);

export const crewContracts = pgTable('crew_contracts', {
  crewGuid: uuid('crew_guid').notNull(),
  contractGuid: uuid('contract_guid').notNull(),
  completionProgress: integer('completion_progress'),
  completionCriteria: integer('completion_criteria').notNull(),
  activationTimestamp: bigint('activation_timestamp', { mode: 'number' }).notNull(),
  lifetimeMs: bigint('lifetime_ms', { mode: 'number' }).notNull(),
});

export const crewContractRewards = pgTable('crew_contract_rewards', {
  contractGuid: uuid('contract_guid').notNull().primaryKey(),
  reward: text('reward'),
});

export const crewContractsUserRewards = pgTable(
  'crew_contracts_user_rewards',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    contractGuid: uuid('contract_guid').notNull(),
    expirationTimestamp: bigint('expiration_timestamp', { mode: 'number' }),
    rewardState: integer('reward_state'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.contractGuid] })],
);

// ---------------------------------------------------------------------------
// Contracts
// ---------------------------------------------------------------------------

export const contracts = pgTable(
  'contracts',
  {
    guid: uuid('guid').notNull(),
    stage: integer('stage').notNull(),
    platform: integer('platform').notNull(),
    contractName: text('contract_name'),
    denominator: integer('denominator').notNull(),
    canReset: boolean('can_reset').notNull(),
    stageCount: integer('stage_count').notNull(),
    reward: text('reward'),
    token: text('token'),
  },
  (t) => [primaryKey({ columns: [t.guid, t.stage, t.platform] })],
);

export const contractProgress = pgTable(
  'contract_progress',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    contractGuid: uuid('contract_guid').notNull(),
    contractStage: integer('contract_stage').notNull(),
    contractPlatform: integer('contract_platform').notNull(),
    state: integer('state').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.contractGuid, t.contractStage, t.contractPlatform] })],
);

export const contractNumerators = pgTable(
  'contract_numerators',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    guid: uuid('guid').notNull(),
    platform: integer('platform').notNull(),
    numerator: integer('numerator'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.guid, t.platform] })],
);

// ---------------------------------------------------------------------------
// Brawl Pass
// ---------------------------------------------------------------------------

export const brawlPass = pgTable('brawl_pass', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  premiumSeason: integer('premium_season'),
  levelSeason: integer('level_season'),
  level: integer('level'),
  lastRewardedLevel: integer('last_rewarded_level').notNull(),
  lastPremiumRewardedLevel: integer('last_premium_rewarded_level').notNull(),
});

export const brawlPassRewards = pgTable(
  'brawl_pass_rewards',
  {
    season: integer('season').notNull(),
    brawlPassLevel: integer('brawl_pass_level').notNull(),
    premiumOnly: boolean('premium_only').notNull(),
    reward: text('reward'),
  },
  (t) => [primaryKey({ columns: [t.season, t.brawlPassLevel] })],
);

// ---------------------------------------------------------------------------
// Commerce
// ---------------------------------------------------------------------------

export const commerceAccessories = pgTable('commerce_accessories', {
  item: uuid('item').notNull().primaryKey(),
  isCrew: boolean('is_crew'),
  isConsumable: boolean('is_consumable'),
  uiName: text('ui_name'),
  rarity: text('rarity'),
  accessoryType: text('accessory_type'),
  platformRestriction: text('platform_restriction'),
});

export const commerceCodes = pgTable('commerce_codes', {
  code: varchar('code').notNull().primaryKey(),
  useLimit: integer('use_limit').notNull(),
  uses: integer('uses').notNull(),
  offerId: varchar('offer_id').notNull(),
  createUser: varchar('create_user').notNull(),
  createTimestamp: bigint('create_timestamp', { mode: 'number' }).notNull(),
  revoked: boolean('revoked').notNull(),
});

export const commerceCodesRedeemed = pgTable('commerce_codes_redeemed', {
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  code: varchar('code').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
});

export const commerceCurrencies = pgTable('commerce_currencies', {
  alias: text('alias').notNull().primaryKey(),
  premium: boolean('premium'),
  currencyName: text('currency_name'),
});

export const commerceFunds = pgTable(
  'commerce_funds',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    currency: text('currency').notNull(),
    balance: integer('balance').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.currency] })],
);

export const commerceFundsExpirations = pgTable(
  'commerce_funds_expirations',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    currency: text('currency').notNull(),
    grantedAt: bigint('granted_at', { mode: 'number' }).notNull(),
    amount: integer('amount'),
    expiresAt: bigint('expires_at', { mode: 'number' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.currency, t.grantedAt] })],
);

export const commerceInventoryConsumables = pgTable(
  'commerce_inventory_consumables',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    content: uuid('content').notNull(),
    consumableQuantity: integer('consumable_quantity').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.content] })],
);

export const commerceInventoryDurables = pgTable(
  'commerce_inventory_durables',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    content: uuid('content').notNull(),
    isFavorited: boolean('is_favorited').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.content] })],
);

export const commerceInventoryDurablesInactive = pgTable(
  'commerce_inventory_durables_inactive',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    content: uuid('content').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.content] })],
);

export const commerceInventoryEquipped = pgTable(
  'commerce_inventory_equipped',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    slot: text('slot').notNull(),
    content: uuid('content'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.slot] })],
);

export const commerceInventoryInitial = pgTable('commerce_inventory_initial', {
  contents: uuid('contents').notNull().primaryKey(),
});

export const commerceCrewInventoryEquipped = pgTable('commerce_crew_inventory_equipped', {
  crewGuid: uuid('crew_guid').notNull(),
  slot: text('slot').notNull(),
  content: uuid('content'),
});

export const commerceOffers = pgTable('commerce_offers', {
  offer: uuid('offer').notNull().primaryKey(),
  currency: text('currency'),
  fullPrice: integer('full_price').notNull(),
  minPrice: integer('min_price').notNull(),
  purchaseLimit: integer('purchase_limit'),
});

export const commerceOfferItems = pgTable('commerce_offer_items', {
  offer: uuid('offer').notNull(),
  itemIndex: integer('item_index'),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export const commerceOfferItemContents = pgTable('commerce_offer_item_contents', {
  offer: uuid('offer').notNull(),
  itemIndex: integer('item_index').notNull(),
  contents: uuid('contents'),
});

export const commerceOfferCurrencies = pgTable(
  'commerce_offer_currencies',
  {
    offer: uuid('offer').notNull(),
    currency: text('currency').notNull(),
    amount: integer('amount').notNull(),
  },
  (t) => [primaryKey({ columns: [t.offer, t.currency] })],
);

export const commerceOffersPurchasedWithLimits = pgTable(
  'commerce_offers_purchased_with_limits',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    offer: uuid('offer').notNull(),
    quantity: integer('quantity'),
  },
  (t) => [primaryKey({ columns: [t.userId, t.offer] })],
);

export const commerceRandomRewardGroups = pgTable(
  'commerce_random_reward_groups',
  {
    reward: uuid('reward').notNull(),
    groupIndex: integer('group_index').notNull(),
    weight: integer('weight').notNull(),
    quantity: integer('quantity').notNull(),
  },
  (t) => [primaryKey({ columns: [t.reward, t.groupIndex] })],
);

export const commerceRandomRewardAccessories = pgTable('commerce_random_reward_accessories', {
  reward: uuid('reward').notNull(),
  groupIndex: integer('group_index').notNull(),
  collectionIndex: integer('collection_index').notNull(),
  content: uuid('content').notNull(),
});

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export const news = pgTable('news', {
  name: text('name').primaryKey(),
  startAt: bigint('start_at', { mode: 'number' }),
  endAt: bigint('end_at', { mode: 'number' }),
});

export const newsItems = pgTable(
  'news_items',
  {
    newsName: text('news_name').notNull(),
    name: text('name').notNull(),
    priority: integer('priority'),
    slot0: boolean('slot_0'),
    slot1: boolean('slot_1'),
    slot2: boolean('slot_2'),
    platforms: text('platforms'),
    imageIndex: integer('image_index'),
  },
  (t) => [primaryKey({ columns: [t.newsName, t.name] })],
);

export const newsItemText = pgTable(
  'news_item_text',
  {
    newsName: text('news_name'),
    itemName: text('item_name'),
    language: text('language'),
    title: text('title'),
    message: text('message'),
  },
);

export const newNews = pgTable('new_news', {
  name: text('name').notNull().primaryKey(),
  startAt: bigint('start_at', { mode: 'number' }),
  endAt: bigint('end_at', { mode: 'number' }),
});

export const newNewsItems = pgTable(
  'new_news_items',
  {
    newsName: text('news_name').notNull(),
    name: text('name').notNull(),
    priority: integer('priority'),
    platforms: text('platforms'),
    tabType: integer('tab_type'),
    fgImageIndex: integer('fg_image_index'),
    bgImageIndex: integer('bg_image_index'),
    ctaBaseColor: text('cta_base_color'),
    ctaEnergyColor: text('cta_energy_color'),
    targetBundleIndex: integer('target_bundle_index'),
  },
  (t) => [primaryKey({ columns: [t.newsName, t.name] })],
);

export const newNewsItemText = pgTable('new_news_item_text', {
  newsName: text('news_name'),
  itemName: text('item_name'),
  language: text('language'),
  title: text('title'),
  message: text('message'),
  tabTitle: text('tab_title'),
  cta1: text('cta_1'),
  cta2: text('cta_2'),
});

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------

export const playlists = pgTable('playlists', {
  guid: uuid('guid').notNull().primaryKey(),
  name: text('name'),
  teamSize: integer('team_size').notNull(),
  teamCount: integer('team_count').notNull(),
  activeCustom: boolean('active_custom'),
  activeTutorial: boolean('active_tutorial'),
  activeQuickplay: boolean('active_quickplay'),
  activeRanked: boolean('active_ranked'),
  metadata: text('metadata'),
  allowNewPlayerMatchmaking: boolean('allow_new_player_matchmaking').notNull(),
  isPracticeTrainingPlaylist: boolean('is_practice_training_playlist').notNull(),
  allowReplacementDroids: boolean('allow_replacement_droids').notNull(),
});

// ---------------------------------------------------------------------------
// Ping / Backends
// ---------------------------------------------------------------------------

export const pingData = pgTable(
  'ping_data',
  {
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    region: text('region').notNull(),
    ping: integer('ping').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.region] })],
);

export const backends = pgTable('backends', {
  id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
  activeTime: bigint('active_time', { mode: 'number' }).notNull(),
  ordinal: integer('ordinal'),
  isActive: boolean('is_active').notNull(),
});

// ---------------------------------------------------------------------------
// FTUE
// ---------------------------------------------------------------------------

export const ftueBreadcrumbs = pgTable('ftue_breadcrumbs', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  breadcrumbStep: integer('breadcrumb_step'),
});

export const linearFtue = pgTable('linear_ftue', {
  userId: bigint('user_id', { mode: 'number' }).notNull().primaryKey(),
  trainingNumber: integer('training_number'),
  trainingItemProgress0: integer('training_item_progress_0'),
  trainingItemProgress1: integer('training_item_progress_1'),
  trainingItemProgress2: integer('training_item_progress_2'),
  trainingItemProgress3: integer('training_item_progress_3'),
  step: integer('step'),
});

// ---------------------------------------------------------------------------
// Data Manifest / Fleet
// ---------------------------------------------------------------------------

export const dataManifestPlatforms = pgTable('data_manifest_platforms', {
  id: integer('id').notNull().primaryKey(),
  name: text('name').notNull(),
});

export const dataManifestChangelists = pgTable('data_manifest_changelists', {
  id: integer('id').notNull().primaryKey(),
  changelistNumber: bigint('changelist_number', { mode: 'number' }).notNull(),
  platformId: bigint('platform_id', { mode: 'number' }).notNull(),
});

export const dataManifestPackages = pgTable('data_manifest_packages', {
  id: integer('id').notNull().primaryKey(),
  changelistId: bigint('changelist_id', { mode: 'number' }).notNull(),
  url: text('url').notNull(),
  fileName: text('file_name').notNull(),
  fileHash: text('file_hash').notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
  mode: text('mode'),
  build: text('build'),
  buildUrl: text('build_url'),
  releaseVersion: text('release_version'),
  contentUpdateVersion: text('content_update_version'),
  requiresAllowlist: boolean('requires_allowlist').notNull(),
});

export const contentUpdateFiles = pgTable('content_update_files', {
  name: text('name').notNull().primaryKey(),
  value: text('value'),
});

export const fleetImages = pgTable('fleet_images', {
  imageId: integer('image_id').notNull().primaryKey(),
  version: integer('version').notNull(),
  project: text('project').notNull(),
  buildId: integer('build_id').notNull(),
  accountServiceId: integer('account_service_id').notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
  name: text('name'),
  networkVersion: integer('network_version'),
  pinned: boolean('pinned').notNull(),
  broken: boolean('broken').notNull(),
});

export const fleetProfiles = pgTable('fleet_profiles', {
  profileId: integer('profile_id').notNull().primaryKey(),
  fleetId: text('fleet_id').notNull(),
  fleetImageId: integer('fleet_image_id').notNull(),
  density: text('density'),
});

// ---------------------------------------------------------------------------
// Server / Global Settings
// ---------------------------------------------------------------------------

export const settingsGlobal = pgTable('settings_global', {
  key: text('key').notNull().primaryKey(),
  value: text('value'),
});

export const statsGlobal = pgTable('stats_global', {
  key: text('key').notNull().primaryKey(),
  value: bigint('value', { mode: 'number' }).notNull(),
});

export const denyLoginPeriods = pgTable('deny_login_periods', {
  id: integer('id').notNull().primaryKey(),
  startTime: bigint('start_time', { mode: 'number' }).notNull(),
  endTime: bigint('end_time', { mode: 'number' }).notNull(),
});

export const denyLoginPeriodMessages = pgTable('deny_login_period_messages', {
  id: integer('id').notNull().primaryKey(),
  message: text('message').notNull(),
  languageCode: text('language_code').notNull(),
  denyLoginPeriodId: bigint('deny_login_period_id', { mode: 'number' }).notNull(),
});

export const inactiveLocations = pgTable('inactive_locations', {
  locationId: integer('location_id').notNull().primaryKey(),
});

export const inactiveRegions = pgTable('inactive_regions', {
  regionId: text('region_id').notNull().primaryKey(),
});

export const thankYouBonusRewards = pgTable('thank_you_bonus_rewards', {
  season: integer('season').notNull().primaryKey(),
  rewards: text('rewards').notNull(),
});

export const vsqlDbVersion = pgTable('vsql_db_version', {
  id: integer('id').notNull().primaryKey(),
  versionId: bigint('version_id', { mode: 'number' }).notNull(),
  isApplied: boolean('is_applied').notNull(),
  tstamp: timestamp('tstamp').notNull(),
  rollbackSql: text('rollback_sql').notNull(),
});
