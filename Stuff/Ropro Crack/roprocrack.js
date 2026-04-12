// Disclaimer: This is only for entertainment and educational purposes.  
// I’m not responsible for what you do with it or any consequences.  
// Made by Vexi :3

//RoPro v1.7

function getStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(obj) {
            resolve(obj[key]);
        });
    });
}

function normalizeVerificationUserId(value) {
    var parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return String(parsed);
}

function normalizeVerificationToken(value) {
    if (typeof value !== "string") {
        return null;
    }
    var normalizedToken = value.trim();
    return normalizedToken.length === 0 ? null : normalizedToken;
}

function normalizeVerificationDictionary(value) {
    if (
        value == null ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }
    return value;
}

function findVerificationTokenForUser(verificationDict, userID) {
    if (verificationDict == null || userID == null) {
        return null;
    }
    var normalizedUserId = normalizeVerificationUserId(userID);
    if (normalizedUserId == null) {
        return null;
    }

    var directToken = normalizeVerificationToken(verificationDict[normalizedUserId]);
    if (directToken != null) {
        return directToken;
    }

    var keys = Object.keys(verificationDict);
    for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        if (normalizeVerificationUserId(key) !== normalizedUserId) {
            continue;
        }
        var tokenForKey = normalizeVerificationToken(verificationDict[key]);
        if (tokenForKey != null) {
            return tokenForKey;
        }
    }
    return null;
}

async function resolveActiveVerificationUserId(verificationDict) {
    if (verificationDict == null) {
        return null;
    }

    var storedUserId = normalizeVerificationUserId(await getStorage("rpUserID"));
    if (storedUserId != null) {
        var storedToken = findVerificationTokenForUser(verificationDict, storedUserId);
        if (storedToken != null) {
            return storedUserId;
        }
    }

    var authenticatedUserId = normalizeVerificationUserId(await getCurrentAuthenticatedUserId());
    if (authenticatedUserId != null) {
        var authenticatedToken = findVerificationTokenForUser(
            verificationDict,
            authenticatedUserId
        );
        if (authenticatedToken != null) {
            if (authenticatedUserId !== storedUserId) {
                await setStorage("rpUserID", authenticatedUserId);
            }
            return authenticatedUserId;
        }
    }

    var keys = Object.keys(verificationDict);
    if (keys.length === 1) {
        var fallbackUserId = normalizeVerificationUserId(keys[0]);
        var fallbackToken = findVerificationTokenForUser(verificationDict, fallbackUserId);
        if (fallbackUserId != null && fallbackToken != null) {
            await setStorage("rpUserID", fallbackUserId);
            return fallbackUserId;
        }
    }

    return null;
}

async function isCurrentUserVerified() {
    var verificationDict = normalizeVerificationDictionary(await getStorage("userVerification"));
    if (verificationDict == null) {
        return false;
    }
    var userID = await resolveActiveVerificationUserId(verificationDict);
    if (userID == null) {
        return false;
    }
    return findVerificationTokenForUser(verificationDict, userID) != null;
}

function setStorage(key, value) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({
            [key]: value
        }, function() {
            resolve();
        });
    });
}

function getLocalStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, function(obj) {
            resolve(obj[key]);
        });
    });
}

function setLocalStorage(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            [key]: value
        }, function() {
            resolve();
        });
    });
}

async function getCsrfTokenFromStorage() {
    var localToken = await getLocalStorage("token");
    if (localToken != null) {
        return localToken;
    }
    return getStorage("token");
}

var defaultSettings = {
    embeddedRolimonsItemLink: true,
    embeddedRolimonsUserLink: true,
    fastestServersSort: true,
    gameLikeRatioFilter: true,
    genreFilters: true,
    groupDiscord: true,
    groupRank: true,
    featuredToys: true,
    itemPageValueDemand: true,
    linkedDiscord: true,
    liveLikeDislikeFavoriteCounters: true,
    livePlayers: true,
    liveVisits: true,
    roproVoiceServers: true,
    premiumVoiceServers: true,
    moreGameFilters: true,
    additionalServerInfo: true,
    moreServerFilters: true,
    serverInviteLinks: true,
    serverFilters: true,
    mostRecentServer: true,
    randomServer: true,
    tradeAge: true,
    itemInfoCard: true,
    profileThemes: true,
    globalThemes: true,
    profileThemeVisible: true,
    lastOnlinePrivacy: true,
    lastOnlineTimezone: "local",
    roproEggCollection: false,
    profileValue: true,
    projectedWarningItemPage: true,
    quickItemSearch: true,
    quickTradeResellers: true,
    hideSerials: true,
    quickUserSearch: true,
    randomGame: true,
    popularToday: true,
    reputation: true,
    reputationVote: true,
    sandbox: true,
    sandboxOutfits: true,
    serverSizeSort: true,
    singleSessionMode: false,
    tradeDemandRatingCalculator: true,
    tradeItemDemand: true,
    tradeItemValue: true,
    tradeNotifier: true,
    tradeOffersPage: true,
    tradeOffersPost: true,
    tradeOffersValueCalculator: true,
    tradeOffersWishlist: true,
    tradePageProjectedWarning: true,
    tradePreviews: true,
    tradeProtection: true,
    autoDecline: true,
    declineThreshold: 50,
    cancelThreshold: 50,
    tradeValueCalculator: true,
    moreTradePanel: true,
    hideTradeBots: true,
    autoDeclineTradeBots: true,
    suspectedBotBadges: true,
    hideDeclinedNotifications: true,
    hideOutboundNotifications: false,
    tradePanel: true,
    quickDecline: true,
    quickCancel: true,
    roproIcon: true,
    underOverRAP: true,
    winLossDisplay: true,
    mostPlayedGames: true,
    allExperiences: true,
    roproShuffle: true,
    experienceQuickSearch: true,
    experienceQuickPlay: true,
    avatarEditorChanges: true,
    playtimeTracking: true,
    activeServerCount: true,
    morePlaytimeSorts: true,
    roproBadge: true,
    mutualFriends: true,
    moreMutuals: true,
    animatedProfileThemes: true,
    cloudPlay: true,
    cloudPlayActive: false,
    hidePrivateServers: false,
    quickEquipItem: false,
    roproWishlist: true,
    themeColorAdjustments: true,
    tradeSearch: true,
    advancedTradeSearch: true,
};

var disabledFeatures = null;

const getDisabledFeatures = async () => {
    var disabledFeaturesString = await executeRoProApiOperation(
        "ropro_get_disabled_features", {}
    );
    if (typeof disabledFeaturesString === "string" && disabledFeaturesString !== "ERROR") {
        var parsed = disabledFeaturesString
            .split(",")
            .map(function(featureName) {
                return stripTags(String(featureName == null ? "" : featureName)).trim();
            })
            .filter(function(featureName) {
                return featureName.length > 0;
            });
        disabledFeatures = parsed;
        await setLocalStorage("disabledFeatures", disabledFeatures);
        await setLocalStorage("disabledFeaturesLastFetch", new Date().getTime());
    }
};

async function initializeSettings() {
    return new Promise((resolve) => {
        async function checkSettings() {
            var initialSettings = await getStorage("rpSettings");
            if (typeof initialSettings === "undefined") {
                initialSettings = Object.assign({}, defaultSettings);
                await setStorage("rpSettings", initialSettings);
            } else {
                var changed = false;
                var keys = Object.keys(defaultSettings);
                for (var i = 0; i < keys.length; i++) {
                    var settingKey = keys[i];
                    if (!(settingKey in initialSettings)) {
                        initialSettings[settingKey] = defaultSettings[settingKey];
                        changed = true;
                    }
                }
                if (changed) {
                    await setStorage("rpSettings", initialSettings);
                }
            }
            var userVerification = normalizeVerificationDictionary(await getStorage("userVerification"));
            if (userVerification == null) {
                await setStorage("userVerification", {});
            }
        }
        checkSettings()
            .then(function() {
                resolve();
            })
            .catch(function(e) {
                resolve();
            });
    });
}

async function initializeRoPro() {
    initializeSettings();
    refreshRoProRestrictSettings(null).catch(function() {});
    refreshRoProDiscordVerified13PlusStatus().catch(function() {});
    var disabledFeaturesLastFetch = await getLocalStorage("disabledFeaturesLastFetch");
    if (typeof disabledFeaturesLastFetch !== "number") {
        await getDisabledFeatures().catch(function() {});
    } else if (new Date().getTime() - disabledFeaturesLastFetch > 3600 * 1000) {
        getDisabledFeatures().catch(function() {});
    }
    var avatarBackground = await getStorage("avatarBackground");
    if (typeof avatarBackground === "undefined") {
        await setStorage("avatarBackground", "default");
    }
    var globalTheme = await getStorage("globalTheme");
    if (typeof globalTheme === "undefined") {
        await setStorage("globalTheme", "");
    }
    try {
        var myId = await getStorage("rpUserID");
        if (
            typeof myId != "undefined" &&
            (await loadSettings("globalThemes")) &&
            (!(await getLocalStorage("themeCheck")) ||
                new Date().getTime() - (await getLocalStorage("themeCheck")) >
                600 * 1000)
        ) {
            setLocalStorage("themeCheck", new Date().getTime());
            loadGlobalTheme();
        }
    } catch (e) {}
}

Promise.resolve()
    .then(function() {
        return initializeRoPro();
    })
    .catch(function(e) {});

async function fetchRoProServerCursorData(startIndex, placeId) {
    var normalizedStartIndex = parseInt(startIndex, 10);
    if (!Number.isFinite(normalizedStartIndex) || normalizedStartIndex < 0) {
        normalizedStartIndex = 0;
    }
    normalizedStartIndex = Math.floor(normalizedStartIndex / 100) * 100;
    var normalizedPlaceId = parseInt(placeId, 10);
    if (!Number.isFinite(normalizedPlaceId) || normalizedPlaceId <= 0) {
        return {
            cursor: "",
            bounds: [0, 0],
        };
    }
    var cacheKey = normalizedPlaceId + ":" + normalizedStartIndex;
    var now = Date.now();
    if (
        roproServerCursorCache.hasOwnProperty(cacheKey) &&
        roproServerCursorCache[cacheKey] != null &&
        roproServerCursorCache[cacheKey].expiresAt > now
    ) {
        return roproServerCursorCache[cacheKey].data;
    }
    var cursorData = await executeRoProApiOperation("ropro_get_server_cursor", {
        startIndex: normalizedStartIndex,
        placeId: normalizedPlaceId,
    });
    var normalizedCursorData = normalizeRoProServerCursorPayload(cursorData);
    roproServerCursorCache[cacheKey] = {
        data: normalizedCursorData,
        expiresAt: now + ROPRO_SERVER_CURSOR_CACHE_TTL_MS,
    };
    return normalizedCursorData;
}

var ROPRO_SERVER_CURSOR_CACHE_TTL_MS = 30000;
var ROPRO_SERVER_FILTER_METADATA_SAMPLE_SIZE = 150;
var ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS = 3;
var ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS = 5;
var ROPRO_SERVER_FILTER_PREFETCH_INTERVAL_MS = 3000;
var ROPRO_SERVER_FILTER_CURSOR_SUCCESS_DELAY_MS = 3000;
var ROPRO_SERVER_FILTER_CURSOR_FAILURE_BACKOFF_MS = 8000;
var ROPRO_SERVER_FILTER_PREFETCH_PAGE_BUDGET = 1;
var ROPRO_SERVER_FILTER_REFRESH_PAGE_BUDGET = 1;
var ROPRO_SERVER_FILTER_INTERACTIVE_PAGE_BUDGET = 5;
var ROPRO_SERVER_FILTER_LOCAL_CACHE_TTL_MS = 15 * 60 * 1000;
var ROPRO_SERVER_FILTER_SAMPLE_LIMIT = 800;
var ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT = 1200;
var ROPRO_SERVER_FILTER_LOCAL_CACHE_KEY = "roproServerFilterCursorSamples";
var ROPRO_SERVER_SAMPLE_CACHE_TTL_MS = 15000;
var ROPRO_ROBLOX_SERVER_PAGE_CACHE_TTL_MS = 5000;
var ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES = 3;
var ROPRO_ROBLOX_SERVER_PAGE_BACKOFF_BASE_MS = 4000;
var ROPRO_ROBLOX_SERVER_PAGE_BACKOFF_MAX_MS = 30000;
var roproServerCursorCache = {};
var roproServerSampleCache = {};
var roproRobloxServerPageCache = {};
var roproRobloxServerPageInflight = {};
var roproRobloxServerPageBackoff = {};
var roproServerFilterCursorSamples = {};
var roproServerFilterStaleGameIds = {};
var roproServerFilterCursorSamplesHydrated = false;
var roproServerFilterCursorSamplesHydrationPromise = null;
var roproServerFilterCursorSampleInflight = {};
var roproServerFilterPrimeInflight = {};
var roproServerFilterLastRefreshPrimeAt = {};
var roproServerPingHintSampleInflight = {};

function normalizeRoProServerCursorPayload(cursorData) {
    var normalizedData = {
        cursor: "",
        bounds: [0, 0],
    };
    if (cursorData == null || typeof cursorData !== "object") {
        return normalizedData;
    }
    if (typeof cursorData.cursor === "string") {
        normalizedData.cursor = cursorData.cursor;
    }
    if (Array.isArray(cursorData.bounds) && cursorData.bounds.length >= 2) {
        var minBound = parseInt(cursorData.bounds[0], 10);
        var maxBound = parseInt(cursorData.bounds[1], 10);
        if (!Number.isFinite(minBound) || minBound < 0) {
            minBound = 0;
        }
        if (!Number.isFinite(maxBound) || maxBound < 0) {
            maxBound = 0;
        }
        minBound = Math.floor(minBound / 100) * 100;
        maxBound = Math.floor(maxBound / 100) * 100;
        if (maxBound < minBound) {
            maxBound = minBound;
        }
        normalizedData.bounds = [minBound, maxBound];
    }
    return normalizedData;
}

function getServerPlayingValue(server) {
    if (server == null || typeof server !== "object") {
        return -1;
    }
    var playing = parseInt(server.playing, 10);
    if (Number.isFinite(playing) && playing >= 0) {
        return playing;
    }
    if (Array.isArray(server.playerTokens)) {
        return server.playerTokens.length;
    }
    return -1;
}

function getServerPingValue(server) {
    if (server == null || typeof server !== "object") {
        return null;
    }
    var ping = parseFloat(server.ping);
    if (Number.isFinite(ping) && ping >= 0) {
        return ping;
    }
    return null;
}

function getRoProServerCursorTargetForMinServers(minServers) {
    var normalizedMinServers = parseInt(minServers, 10);
    if (!Number.isFinite(normalizedMinServers) || normalizedMinServers <= 0) {
        return ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS;
    }
    var requestedCursorCount = Math.ceil(normalizedMinServers / 100);
    if (!Number.isFinite(requestedCursorCount) || requestedCursorCount <= 0) {
        requestedCursorCount = ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS;
    }
    return Math.max(
        ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS,
        Math.min(ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS, requestedCursorCount)
    );
}

function recordRoProRobloxServerPageBackoff(cacheKey, now) {
    var previousBackoff = roproRobloxServerPageBackoff[cacheKey];
    var failureCount = 1;
    if (
        previousBackoff != null &&
        typeof previousBackoff === "object" &&
        Number.isFinite(parseInt(previousBackoff.failureCount, 10))
    ) {
        failureCount = Math.min(6, parseInt(previousBackoff.failureCount, 10) + 1);
    }
    var delay = Math.min(
        ROPRO_ROBLOX_SERVER_PAGE_BACKOFF_MAX_MS,
        ROPRO_ROBLOX_SERVER_PAGE_BACKOFF_BASE_MS * Math.pow(2, failureCount - 1)
    );
    roproRobloxServerPageBackoff[cacheKey] = {
        failureCount: failureCount,
        until: now + delay,
    };
}

async function fetchRobloxPublicServersPage(gameID, cursor, options = {}) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return {};
    }
    var normalizedCursor = typeof cursor === "string" ? cursor : "";
    var excludeFullGames = options != null && options.excludeFullGames === true;
    var sortOrder =
        options != null && typeof options.sortOrder === "string" ?
        String(options.sortOrder).trim() :
        "Asc";
    if (sortOrder !== "Asc" && sortOrder !== "Desc") {
        sortOrder = "Asc";
    }
    var cacheScope = excludeFullGames ? "exclude" : "all";
    var cacheKey =
        normalizedGameId +
        ":" +
        normalizedCursor +
        ":" +
        cacheScope +
        ":" +
        sortOrder;
    var now = Date.now();
    if (
        roproRobloxServerPageCache.hasOwnProperty(cacheKey) &&
        roproRobloxServerPageCache[cacheKey] != null &&
        roproRobloxServerPageCache[cacheKey].expiresAt > now
    ) {
        return roproRobloxServerPageCache[cacheKey].data;
    }
    if (
        roproRobloxServerPageBackoff.hasOwnProperty(cacheKey) &&
        roproRobloxServerPageBackoff[cacheKey] != null &&
        roproRobloxServerPageBackoff[cacheKey].until > now
    ) {
        return {};
    }
    if (roproRobloxServerPageInflight.hasOwnProperty(cacheKey)) {
        return roproRobloxServerPageInflight[cacheKey];
    }

    var requestPromise = (async function() {
        var url =
            "https://games.roblox.com/v1/games/" +
            normalizedGameId +
            "/servers/Public?cursor=" +
            encodeURIComponent(normalizedCursor) +
            "&sortOrder=" +
            encodeURIComponent(sortOrder) +
            "&limit=100" +
            (excludeFullGames ? "&excludeFullGames=true" : "");
        for (var attempt = 0; attempt < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES; attempt++) {
            try {
                var response = await fetch(url);
                if (
                    response.status === 429 ||
                    response.status === 500 ||
                    response.status === 502 ||
                    response.status === 503 ||
                    response.status === 504
                ) {
                    if (attempt + 1 < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES) {
                        await roproSleep(250 * (attempt + 1));
                        continue;
                    }
                    recordRoProRobloxServerPageBackoff(cacheKey, Date.now());
                    return {};
                }
                if (!response.ok) {
                    recordRoProRobloxServerPageBackoff(cacheKey, Date.now());
                    return {};
                }
                var data = await response.json();
                if (data == null || typeof data !== "object") {
                    recordRoProRobloxServerPageBackoff(cacheKey, Date.now());
                    return {};
                }
                roproRobloxServerPageCache[cacheKey] = {
                    data: data,
                    expiresAt: Date.now() + ROPRO_ROBLOX_SERVER_PAGE_CACHE_TTL_MS,
                };
                delete roproRobloxServerPageBackoff[cacheKey];
                return data;
            } catch (e) {
                if (attempt + 1 < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES) {
                    await roproSleep(250 * (attempt + 1));
                    continue;
                }
            }
        }
        recordRoProRobloxServerPageBackoff(cacheKey, Date.now());
        return {};
    })();

    roproRobloxServerPageInflight[cacheKey] = requestPromise;
    try {
        return await requestPromise;
    } finally {
        delete roproRobloxServerPageInflight[cacheKey];
    }
}

function normalizeRoProServerSampleRow(serverRow) {
    if (serverRow == null || typeof serverRow !== "object") {
        return null;
    }
    var rawId = null;
    if (serverRow.id != null && (typeof serverRow.id === "string" || typeof serverRow.id === "number")) {
        rawId = serverRow.id;
    } else if (
        serverRow.server != null &&
        (typeof serverRow.server === "string" || typeof serverRow.server === "number")
    ) {
        rawId = serverRow.server;
    } else if (
        serverRow.serverId != null &&
        (typeof serverRow.serverId === "string" || typeof serverRow.serverId === "number")
    ) {
        rawId = serverRow.serverId;
    } else if (
        serverRow.jobId != null &&
        (typeof serverRow.jobId === "string" || typeof serverRow.jobId === "number")
    ) {
        rawId = serverRow.jobId;
    }
    rawId = rawId == null ? null : String(rawId);
    if (typeof rawId !== "string") {
        return null;
    }
    var serverId = rawId.replace(/[^0-9a-z-]/gi, "");
    if (serverId.length === 0) {
        return null;
    }
    var maxPlayers = parseInt(serverRow.maxPlayers, 10);
    if (!Number.isFinite(maxPlayers) || maxPlayers <= 0) {
        return null;
    }
    var playing = getServerPlayingValue(serverRow);
    if (!Number.isFinite(playing) || playing < 0) {
        return null;
    }
    if (playing > maxPlayers) {
        playing = maxPlayers;
    }
    var normalized = {
        id: serverId,
        maxPlayers: maxPlayers,
        playing: playing,
        playerTokens: [],
    };
    if (Array.isArray(serverRow.playerTokens)) {
        for (var tokenIndex = 0; tokenIndex < serverRow.playerTokens.length; tokenIndex++) {
            if (typeof serverRow.playerTokens[tokenIndex] === "string") {
                normalized.playerTokens.push(serverRow.playerTokens[tokenIndex]);
            }
            if (normalized.playerTokens.length >= 5) {
                break;
            }
        }
    }
    var ping = getServerPingValue(serverRow);
    if (ping != null) {
        normalized.ping = ping;
    }
    var fps = parseFloat(serverRow.fps);
    if (Number.isFinite(fps) && fps >= 0) {
        normalized.fps = fps;
    }
    return normalized;
}

function buildRoProServerFilterSampleState() {
    return {
        cursorCount: 0,
        nextCursor: "",
        exhausted: false,
        needsCursorRewarm: false,
        updatedAt: Date.now(),
        lastSuccessfulCursorPullAt: 0,
        lastCursorPullAt: 0,
        nextAllowedPullAt: 0,
        servers: [],
        cursorPages: [],
        pingHintsById: {},
        requestedCursors: {},
    };
}

function normalizeRoProServerFilterSampleState(rawState) {
    var state = buildRoProServerFilterSampleState();
    if (rawState == null || typeof rawState !== "object") {
        return state;
    }
    var cursorCount = parseInt(rawState.cursorCount, 10);
    if (Number.isFinite(cursorCount) && cursorCount >= 0) {
        state.cursorCount = Math.min(
            cursorCount,
            ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
        );
    }
    if (typeof rawState.nextCursor === "string") {
        state.nextCursor = rawState.nextCursor;
    }
    state.exhausted = rawState.exhausted === true;
    var updatedAt = parseInt(rawState.updatedAt, 10);
    if (Number.isFinite(updatedAt) && updatedAt > 0) {
        state.updatedAt = updatedAt;
    }
    var lastSuccessfulCursorPullAt = parseInt(rawState.lastSuccessfulCursorPullAt, 10);
    if (
        Number.isFinite(lastSuccessfulCursorPullAt) &&
        lastSuccessfulCursorPullAt > 0
    ) {
        state.lastSuccessfulCursorPullAt = lastSuccessfulCursorPullAt;
    }
    var lastCursorPullAt = parseInt(rawState.lastCursorPullAt, 10);
    if (Number.isFinite(lastCursorPullAt) && lastCursorPullAt > 0) {
        state.lastCursorPullAt = lastCursorPullAt;
    }
    var nextAllowedPullAt = parseInt(rawState.nextAllowedPullAt, 10);
    if (Number.isFinite(nextAllowedPullAt) && nextAllowedPullAt > 0) {
        state.nextAllowedPullAt = nextAllowedPullAt;
    }
    if (Array.isArray(rawState.servers)) {
        var dedupe = {};
        for (var i = 0; i < rawState.servers.length; i++) {
            var normalized = normalizeRoProServerSampleRow(rawState.servers[i]);
            if (normalized == null || dedupe.hasOwnProperty(normalized.id)) {
                continue;
            }
            dedupe[normalized.id] = true;
            state.servers.push(normalized);
            if (Number.isFinite(getServerPingValue(normalized))) {
                state.pingHintsById[normalized.id] = getServerPingValue(normalized);
            }
            if (state.servers.length >= ROPRO_SERVER_FILTER_SAMPLE_LIMIT) {
                break;
            }
        }
    }
    if (Array.isArray(rawState.cursorPages)) {
        for (var pageIndex = 0; pageIndex < rawState.cursorPages.length; pageIndex++) {
            var cursorPage = rawState.cursorPages[pageIndex];
            if (cursorPage == null || typeof cursorPage !== "object") {
                continue;
            }
            var cursorKey = typeof cursorPage.cursor === "string" ? cursorPage.cursor : "";
            var nextCursor = typeof cursorPage.nextCursor === "string" ? cursorPage.nextCursor : "";
            var pulledAt = parseInt(cursorPage.pulledAt, 10);
            if (!Number.isFinite(pulledAt) || pulledAt < 0) {
                pulledAt = 0;
            }
            var normalizedPage = {
                cursor: cursorKey,
                nextCursor: nextCursor,
                pulledAt: pulledAt,
                servers: [],
            };
            var pageDedupe = {};
            if (Array.isArray(cursorPage.servers)) {
                for (var serverIndex = 0; serverIndex < cursorPage.servers.length; serverIndex++) {
                    var normalizedServer = normalizeRoProServerSampleRow(cursorPage.servers[serverIndex]);
                    if (
                        normalizedServer == null ||
                        pageDedupe.hasOwnProperty(normalizedServer.id)
                    ) {
                        continue;
                    }
                    pageDedupe[normalizedServer.id] = true;
                    normalizedPage.servers.push(normalizedServer);
                    if (Number.isFinite(getServerPingValue(normalizedServer))) {
                        state.pingHintsById[normalizedServer.id] = getServerPingValue(normalizedServer);
                    }
                }
            }
            state.cursorPages.push(normalizedPage);
            if (state.cursorPages.length >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS) {
                break;
            }
        }
    }
    if (rawState.pingHintsById != null && typeof rawState.pingHintsById === "object") {
        var pingHintIds = Object.keys(rawState.pingHintsById);
        for (var pingHintIndex = 0; pingHintIndex < pingHintIds.length; pingHintIndex++) {
            var pingHintId = normalizeRoProServerSampleRow({
                id: pingHintIds[pingHintIndex],
                maxPlayers: 1,
                playing: 0,
                ping: rawState.pingHintsById[pingHintIds[pingHintIndex]],
            });
            if (pingHintId == null) {
                continue;
            }
            var normalizedHintPing = getServerPingValue(pingHintId);
            if (!Number.isFinite(normalizedHintPing)) {
                continue;
            }
            state.pingHintsById[pingHintId.id] = normalizedHintPing;
            if (Object.keys(state.pingHintsById).length >= ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT) {
                break;
            }
        }
    }
    if (Array.isArray(rawState.pingHints)) {
        for (var hintIndex = 0; hintIndex < rawState.pingHints.length; hintIndex++) {
            var hintRow = normalizeRoProServerSampleRow({
                id: rawState.pingHints[hintIndex] != null &&
                    typeof rawState.pingHints[hintIndex] === "object" ?
                    rawState.pingHints[hintIndex].id :
                    null,
                maxPlayers: 1,
                playing: 0,
                ping: rawState.pingHints[hintIndex] != null &&
                    typeof rawState.pingHints[hintIndex] === "object" ?
                    rawState.pingHints[hintIndex].ping :
                    null,
            });
            if (hintRow == null) {
                continue;
            }
            var hintPing = getServerPingValue(hintRow);
            if (!Number.isFinite(hintPing)) {
                continue;
            }
            state.pingHintsById[hintRow.id] = hintPing;
            if (Object.keys(state.pingHintsById).length >= ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT) {
                break;
            }
        }
    }
    return state;
}

function isRoProServerFilterSampleStateExpired(state, now) {
    var normalizedNow = Number.isFinite(parseInt(now, 10)) ? parseInt(now, 10) : Date.now();
    if (state == null || typeof state !== "object") {
        return true;
    }
    var updatedAt = parseInt(state.updatedAt, 10);
    if (!Number.isFinite(updatedAt) || updatedAt <= 0) {
        return true;
    }
    return normalizedNow - updatedAt > ROPRO_SERVER_FILTER_LOCAL_CACHE_TTL_MS;
}

async function hydrateRoProServerFilterCursorSamples() {
    if (roproServerFilterCursorSamplesHydrated) {
        return;
    }
    if (roproServerFilterCursorSamplesHydrationPromise != null) {
        await roproServerFilterCursorSamplesHydrationPromise;
        return;
    }
    roproServerFilterCursorSamplesHydrationPromise = (async function() {
        var storedSamples = await getLocalStorage(ROPRO_SERVER_FILTER_LOCAL_CACHE_KEY);
        var now = Date.now();
        roproServerFilterCursorSamples = {};
        roproServerFilterStaleGameIds = {};
        if (storedSamples != null && typeof storedSamples === "object") {
            var keys = Object.keys(storedSamples);
            for (var i = 0; i < keys.length; i++) {
                var gameId = parseInt(keys[i], 10);
                if (!Number.isFinite(gameId) || gameId <= 0) {
                    continue;
                }
                var normalizedState = normalizeRoProServerFilterSampleState(
                    storedSamples[keys[i]]
                );
                if (isRoProServerFilterSampleStateExpired(normalizedState, now)) {
                    roproServerFilterStaleGameIds[gameId] = true;
                    continue;
                }
                roproServerFilterCursorSamples[gameId] = normalizedState;
            }
        }
        roproServerFilterCursorSamplesHydrated = true;
    })();
    try {
        await roproServerFilterCursorSamplesHydrationPromise;
    } finally {
        roproServerFilterCursorSamplesHydrationPromise = null;
    }
}

async function persistRoProServerFilterCursorSamples() {
    var now = Date.now();
    var serialized = {};
    var keys = Object.keys(roproServerFilterCursorSamples);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var state = roproServerFilterCursorSamples[key];
        if (state == null || typeof state !== "object") {
            continue;
        }
        if (isRoProServerFilterSampleStateExpired(state, now)) {
            delete roproServerFilterCursorSamples[key];
            continue;
        }
        serialized[key] = {
            cursorCount: state.cursorCount,
            nextCursor: state.nextCursor,
            exhausted: state.exhausted === true,
            updatedAt: state.updatedAt,
            lastSuccessfulCursorPullAt: Number.isFinite(state.lastSuccessfulCursorPullAt) ?
                state.lastSuccessfulCursorPullAt :
                0,
            lastCursorPullAt: Number.isFinite(state.lastCursorPullAt) ?
                state.lastCursorPullAt :
                0,
            nextAllowedPullAt: Number.isFinite(state.nextAllowedPullAt) ?
                state.nextAllowedPullAt :
                0,
            servers: Array.isArray(state.servers) ?
                state.servers.slice(0, ROPRO_SERVER_FILTER_SAMPLE_LIMIT) :
                [],
            pingHints: state.pingHintsById != null && typeof state.pingHintsById === "object" ?
                Object.keys(state.pingHintsById)
                .map(function(serverId) {
                    return {
                        id: serverId,
                        ping: state.pingHintsById[serverId],
                    };
                })
                .slice(-ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT) :
                [],
            cursorPages: Array.isArray(state.cursorPages) ?
                state.cursorPages
                .slice(-ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS)
                .map(function(cursorPage) {
                    if (cursorPage == null || typeof cursorPage !== "object") {
                        return null;
                    }
                    return {
                        cursor: typeof cursorPage.cursor === "string" ? cursorPage.cursor : "",
                        nextCursor: typeof cursorPage.nextCursor === "string" ? cursorPage.nextCursor : "",
                        pulledAt: Number.isFinite(parseInt(cursorPage.pulledAt, 10)) ?
                            parseInt(cursorPage.pulledAt, 10) :
                            0,
                        servers: Array.isArray(cursorPage.servers) ?
                            cursorPage.servers.slice(0, 100) :
                            [],
                    };
                })
                .filter(function(cursorPage) {
                    return cursorPage != null;
                }) :
                [],
        };
    }
    await setLocalStorage(ROPRO_SERVER_FILTER_LOCAL_CACHE_KEY, serialized);
}

async function getRoProServerFilterSampleState(gameID) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return null;
    }
    await hydrateRoProServerFilterCursorSamples();
    var state = roproServerFilterCursorSamples[normalizedGameId];
    if (state == null || typeof state !== "object") {
        state = buildRoProServerFilterSampleState();
        if (roproServerFilterStaleGameIds[normalizedGameId] === true) {
            state.needsCursorRewarm = true;
            delete roproServerFilterStaleGameIds[normalizedGameId];
        }
        roproServerFilterCursorSamples[normalizedGameId] = state;
        return state;
    }
    if (isRoProServerFilterSampleStateExpired(state)) {
        state = buildRoProServerFilterSampleState();
        state.needsCursorRewarm = true;
        roproServerFilterCursorSamples[normalizedGameId] = state;
        return state;
    }
    if (state.requestedCursors == null || typeof state.requestedCursors !== "object") {
        state.requestedCursors = {};
    }
    if (state.pingHintsById == null || typeof state.pingHintsById !== "object") {
        state.pingHintsById = {};
    }
    if (!Number.isFinite(parseInt(state.nextAllowedPullAt, 10))) {
        state.nextAllowedPullAt = 0;
    }
    if (Array.isArray(state.cursorPages)) {
        for (var pageIndex = 0; pageIndex < state.cursorPages.length; pageIndex++) {
            var cursorPage = state.cursorPages[pageIndex];
            if (cursorPage == null || typeof cursorPage !== "object") {
                continue;
            }
            var cursorKey = typeof cursorPage.cursor === "string" ? cursorPage.cursor : null;
            if (cursorKey == null) {
                continue;
            }
            state.requestedCursors[cursorKey] = true;
        }
    } else {
        state.cursorPages = [];
    }
    return state;
}

function mergeRoProServerSampleRowsIntoState(state, serverRows) {
    if (!Array.isArray(serverRows) || state == null || typeof state !== "object") {
        return;
    }
    var indexById = {};
    for (var i = 0; i < state.servers.length; i++) {
        if (
            state.servers[i] != null &&
            typeof state.servers[i] === "object" &&
            typeof state.servers[i].id === "string"
        ) {
            indexById[state.servers[i].id] = i;
        }
    }
    for (var rowIndex = 0; rowIndex < serverRows.length; rowIndex++) {
        var normalized = normalizeRoProServerSampleRow(serverRows[rowIndex]);
        if (normalized == null) {
            continue;
        }
        if (indexById.hasOwnProperty(normalized.id)) {
            state.servers[indexById[normalized.id]] = normalized;
        } else {
            indexById[normalized.id] = state.servers.length;
            state.servers.push(normalized);
        }
    }
    if (state.servers.length > ROPRO_SERVER_FILTER_SAMPLE_LIMIT) {
        state.servers = state.servers.slice(
            state.servers.length - ROPRO_SERVER_FILTER_SAMPLE_LIMIT
        );
    }
}

function mergeRoProServerPingHintsIntoState(state, serverRows) {
    if (
        !Array.isArray(serverRows) ||
        state == null ||
        typeof state !== "object"
    ) {
        return;
    }
    if (state.pingHintsById == null || typeof state.pingHintsById !== "object") {
        state.pingHintsById = {};
    }
    for (var rowIndex = 0; rowIndex < serverRows.length; rowIndex++) {
        var normalized = normalizeRoProServerSampleRow(serverRows[rowIndex]);
        if (normalized == null || !Number.isFinite(getServerPingValue(normalized))) {
            continue;
        }
        state.pingHintsById[normalized.id] = getServerPingValue(normalized);
    }
    var nextHintIds = Object.keys(state.pingHintsById);
    if (nextHintIds.length > ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT) {
        var trimCount = nextHintIds.length - ROPRO_SERVER_FILTER_PING_HINT_SAMPLE_LIMIT;
        for (var trimIndex = 0; trimIndex < trimCount; trimIndex++) {
            delete state.pingHintsById[nextHintIds[trimIndex]];
        }
    }
}

function cacheRoProCursorPageSampleInState(state, cursor, nextCursor, serverRows) {
    if (state == null || typeof state !== "object") {
        return;
    }
    if (!Array.isArray(state.cursorPages)) {
        state.cursorPages = [];
    }
    var normalizedCursor = typeof cursor === "string" ? cursor : "";
    var normalizedNextCursor = typeof nextCursor === "string" ? nextCursor : "";
    var normalizedPage = {
        cursor: normalizedCursor,
        nextCursor: normalizedNextCursor,
        pulledAt: Date.now(),
        servers: [],
    };
    var dedupe = {};
    if (Array.isArray(serverRows)) {
        for (var i = 0; i < serverRows.length; i++) {
            var normalizedServer = normalizeRoProServerSampleRow(serverRows[i]);
            if (
                normalizedServer == null ||
                dedupe.hasOwnProperty(normalizedServer.id)
            ) {
                continue;
            }
            dedupe[normalizedServer.id] = true;
            normalizedPage.servers.push(normalizedServer);
        }
    }
    var replaced = false;
    for (var pageIndex = 0; pageIndex < state.cursorPages.length; pageIndex++) {
        if (
            state.cursorPages[pageIndex] != null &&
            typeof state.cursorPages[pageIndex] === "object" &&
            state.cursorPages[pageIndex].cursor === normalizedCursor
        ) {
            state.cursorPages[pageIndex] = normalizedPage;
            replaced = true;
            break;
        }
    }
    if (!replaced) {
        state.cursorPages.push(normalizedPage);
    }
    if (state.cursorPages.length > ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS) {
        state.cursorPages = state.cursorPages.slice(
            state.cursorPages.length - ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
        );
    }
}

async function pullRoProServerCursorPage(gameID, state, options) {
    if (state == null || typeof state !== "object") {
        return {
            attempted: false,
            pullSucceeded: false
        };
    }
    var interactive = options != null && options.interactive === true;
    if (
        !interactive &&
        Number.isFinite(parseInt(state.nextAllowedPullAt, 10)) &&
        state.nextAllowedPullAt > Date.now() &&
        state.cursorCount > 0
    ) {
        return {
            attempted: false,
            pullSucceeded: false,
            rateLimited: true
        };
    }
    if (state.cursorCount >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS) {
        state.exhausted = true;
        return {
            attempted: false,
            pullSucceeded: false
        };
    }
    var cursor = typeof state.nextCursor === "string" ? state.nextCursor : "";
    if (state.requestedCursors.hasOwnProperty(cursor)) {
        state.exhausted = true;
        return {
            attempted: false,
            pullSucceeded: false
        };
    }
    var normalizedLastCursorPullAt = Number.isFinite(parseInt(state.lastCursorPullAt, 10)) ?
        state.lastCursorPullAt :
        0;
    var cursorPullDelayMs = interactive ? 0 : (state.cursorCount > 0 ? ROPRO_SERVER_FILTER_CURSOR_SUCCESS_DELAY_MS : 0);
    var nextPullAt = normalizedLastCursorPullAt + cursorPullDelayMs;
    if (!interactive && Number.isFinite(parseInt(state.nextAllowedPullAt, 10)) && state.nextAllowedPullAt > nextPullAt) {
        nextPullAt = state.nextAllowedPullAt;
    }
    if (nextPullAt > Date.now()) {
        var waitDuration = nextPullAt - Date.now();
        if (waitDuration > 0) {
            await roproSleep(waitDuration);
        }
    }
    state.lastCursorPullAt = Date.now();
    var page = await fetchRobloxPublicServersPage(gameID, cursor, {
        excludeFullGames: false,
    });
    var pullSucceeded =
        page != null &&
        typeof page === "object" &&
        Array.isArray(page.data);
    if (!pullSucceeded) {
        state.nextAllowedPullAt = Date.now() + ROPRO_SERVER_FILTER_CURSOR_FAILURE_BACKOFF_MS;
        if (cursor.length > 0) {
            state.nextCursor = "";
            state.requestedCursors = {};
            state.exhausted = false;
        }
        if (Array.isArray(state.cursorPages)) {
            state.cursorCount = Math.min(
                ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS,
                state.cursorPages.length
            );
        }
        return {
            attempted: true,
            pullSucceeded: false,
            cursor: cursor,
            page: null,
        };
    }
    state.requestedCursors[cursor] = true;
    state.nextAllowedPullAt = 0;
    state.lastSuccessfulCursorPullAt = Date.now();
    cacheRoProCursorPageSampleInState(state, cursor, page.nextPageCursor, page.data);
    if (Array.isArray(state.cursorPages)) {
        state.cursorCount = Math.min(
            ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS,
            state.cursorPages.length
        );
    }
    if (Array.isArray(page.data) && page.data.length > 0) {
        mergeRoProServerPingHintsIntoState(state, page.data);
        mergeRoProServerSampleRowsIntoState(state, page.data);
    }
    if (
        typeof page.nextPageCursor !== "string" ||
        page.nextPageCursor.length === 0
    ) {
        state.nextCursor = "";
        state.exhausted = true;
    } else {
        state.nextCursor = page.nextPageCursor;
        state.exhausted = false;
    }
    return {
        attempted: true,
        pullSucceeded: true,
        cursor: cursor,
        page: page,
    };
}

async function ensureRoProServerCursorSample(gameID, minCursorRequests, options = {}) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return buildRoProServerFilterSampleState();
    }
    var normalizedMinCursorRequests = parseInt(minCursorRequests, 10);
    if (!Number.isFinite(normalizedMinCursorRequests) || normalizedMinCursorRequests < 0) {
        normalizedMinCursorRequests = 0;
    }
    normalizedMinCursorRequests = Math.min(
        normalizedMinCursorRequests,
        ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
    );
    var pageBudget = parseInt(options.pageBudget, 10);
    if (!Number.isFinite(pageBudget) || pageBudget <= 0) {
        pageBudget = ROPRO_SERVER_FILTER_PREFETCH_PAGE_BUDGET;
    }
    var state = await getRoProServerFilterSampleState(normalizedGameId);
    if (state.cursorCount >= normalizedMinCursorRequests) {
        return state;
    }
    if (
        state.exhausted === true ||
        state.cursorCount >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
    ) {
        return state;
    }
    if (roproServerFilterCursorSampleInflight.hasOwnProperty(normalizedGameId)) {
        await roproServerFilterCursorSampleInflight[normalizedGameId];
        return await getRoProServerFilterSampleState(normalizedGameId);
    }
    roproServerFilterCursorSampleInflight[normalizedGameId] = (async function() {
        var fetchedPages = 0;
        while (
            state.cursorCount < normalizedMinCursorRequests &&
            fetchedPages < pageBudget
        ) {
            var pullResult = await pullRoProServerCursorPage(normalizedGameId, state, {
                interactive: options.interactive === true,
            });
            if (pullResult.attempted !== true) {
                break;
            }
            fetchedPages += 1;
            if (pullResult.pullSucceeded !== true) {
                break;
            }
        }
        state.updatedAt = Date.now();
        roproServerSampleCache = {};
        await persistRoProServerFilterCursorSamples();
        return state;
    })();
    try {
        await roproServerFilterCursorSampleInflight[normalizedGameId];
    } finally {
        delete roproServerFilterCursorSampleInflight[normalizedGameId];
    }
    return await getRoProServerFilterSampleState(normalizedGameId);
}

function buildRoProServerFilterPrimeStatus(state) {
    var normalizedState =
        state != null && typeof state === "object" ?
        state :
        buildRoProServerFilterSampleState();
    return {
        ready: normalizedState.cursorCount >= ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS,
        cursorCount: normalizedState.cursorCount,
        maxCursorRequests: ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS,
        exhausted: normalizedState.exhausted === true,
        serverCount: Array.isArray(normalizedState.servers) ?
            normalizedState.servers.length :
            0,
        refreshIntervalMs: ROPRO_SERVER_FILTER_PREFETCH_INTERVAL_MS,
    };
}

async function primeRoProServerFilterSample(gameID, refresh) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return buildRoProServerFilterPrimeStatus(null);
    }
    var isRefreshRequest = refresh === true;
    var inflightKey = normalizedGameId;
    if (roproServerFilterPrimeInflight.hasOwnProperty(inflightKey)) {
        return await roproServerFilterPrimeInflight[inflightKey];
    }
    roproServerFilterPrimeInflight[inflightKey] = (async function() {
        var state = await ensureRoProServerCursorSample(
            normalizedGameId,
            ROPRO_SERVER_FILTER_MIN_CURSOR_REQUESTS, {
                pageBudget: ROPRO_SERVER_FILTER_PREFETCH_PAGE_BUDGET
            }
        );
        var shouldRewarmToMax = state.needsCursorRewarm === true;
        if (isRefreshRequest || shouldRewarmToMax) {
            var now = Date.now();
            var lastRefreshPrimeAt = parseInt(
                roproServerFilterLastRefreshPrimeAt[normalizedGameId],
                10
            );
            if (
                Number.isFinite(lastRefreshPrimeAt) &&
                now - lastRefreshPrimeAt < ROPRO_SERVER_FILTER_PREFETCH_INTERVAL_MS
            ) {
                return buildRoProServerFilterPrimeStatus(state);
            }
            roproServerFilterLastRefreshPrimeAt[normalizedGameId] = now;
            var refreshTarget = state.cursorCount + 1;
            if (
                state.exhausted === true ||
                state.cursorCount >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
            ) {
                state.needsCursorRewarm = false;
                return buildRoProServerFilterPrimeStatus(state);
            }
            if (shouldRewarmToMax) {
                refreshTarget = ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS;
            }
            refreshTarget = Math.min(
                ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS,
                refreshTarget
            );
            state = await ensureRoProServerCursorSample(
                normalizedGameId,
                refreshTarget, {
                    pageBudget: ROPRO_SERVER_FILTER_REFRESH_PAGE_BUDGET,
                }
            );
            if (
                state.needsCursorRewarm === true &&
                (state.exhausted === true ||
                    state.cursorCount >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS)
            ) {
                state.needsCursorRewarm = false;
            }
        }
        return buildRoProServerFilterPrimeStatus(state);
    })();
    try {
        return await roproServerFilterPrimeInflight[inflightKey];
    } finally {
        delete roproServerFilterPrimeInflight[inflightKey];
    }
}

async function getRoProSampledServers(gameID, minServers = 150, options = {}) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return [];
    }
    var normalizedMinServers = parseInt(minServers, 10);
    if (!Number.isFinite(normalizedMinServers) || normalizedMinServers <= 0) {
        normalizedMinServers = 150;
    }
    var cursorTarget = getRoProServerCursorTargetForMinServers(normalizedMinServers);
    var normalizedPageBudget = parseInt(options.pageBudget, 10);
    if (!Number.isFinite(normalizedPageBudget) || normalizedPageBudget <= 0) {
        normalizedPageBudget =
            normalizedMinServers >= 500 ?
            ROPRO_SERVER_FILTER_INTERACTIVE_PAGE_BUDGET :
            ROPRO_SERVER_FILTER_PREFETCH_PAGE_BUDGET;
    }
    var state = await ensureRoProServerCursorSample(
        normalizedGameId,
        cursorTarget, {
            pageBudget: normalizedPageBudget
        }
    );
    var servers = Array.isArray(state.servers) ? state.servers.slice() : [];
    shuffleArray(servers);
    return servers;
}

async function maxPlayerCount(gameID, count) {
    var normalizedCount = parseInt(count, 10);
    if (!Number.isFinite(normalizedCount) || normalizedCount < 0) {
        return [];
    }
    var sampledServers = await getRoProSampledServers(
        gameID,
        ROPRO_SERVER_FILTER_METADATA_SAMPLE_SIZE
    );
    var filteredServers = [];
    for (var i = 0; i < sampledServers.length; i++) {
        var playing = getServerPlayingValue(sampledServers[i]);
        if (playing >= 0 && playing <= normalizedCount) {
            filteredServers.push(sampledServers[i]);
        }
    }
    filteredServers.sort(function(a, b) {
        return getServerPlayingValue(b) - getServerPlayingValue(a);
    });
    return filteredServers;
}

async function serverFilterNotFull(gameID) {
    return serverFilterRandomShuffle(gameID, ROPRO_SERVER_FILTER_METADATA_SAMPLE_SIZE);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

async function serverFilterReverseOrder(gameID) {
    var sampledServers = await getRoProSampledServers(
        gameID,
        ROPRO_SERVER_FILTER_METADATA_SAMPLE_SIZE
    );
    sampledServers.sort(function(a, b) {
        return getServerPlayingValue(a) - getServerPlayingValue(b);
    });
    return sampledServers;
}

async function serverFilterRandomShuffle(gameID, minServers = 150, forceRefresh = false) {
    var normalizedGameId = parseInt(gameID, 10);
    var normalizedMinServers = parseInt(minServers, 10);
    if (!Number.isFinite(normalizedMinServers) || normalizedMinServers <= 0) {
        normalizedMinServers = 150;
    }
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return [];
    }
    var cacheKey = normalizedGameId + ":" + normalizedMinServers;
    var now = Date.now();
    if (forceRefresh === true && roproServerSampleCache.hasOwnProperty(cacheKey)) {
        delete roproServerSampleCache[cacheKey];
    }
    if (
        forceRefresh !== true &&
        roproServerSampleCache.hasOwnProperty(cacheKey) &&
        roproServerSampleCache[cacheKey] != null &&
        roproServerSampleCache[cacheKey].expiresAt > now
    ) {
        return roproServerSampleCache[cacheKey].data.slice();
    }
    var sampledServers = await getRoProSampledServers(normalizedGameId, normalizedMinServers, {
        pageBudget: normalizedMinServers >= 500 ?
            ROPRO_SERVER_FILTER_INTERACTIVE_PAGE_BUDGET :
            ROPRO_SERVER_FILTER_PREFETCH_PAGE_BUDGET,
    });
    if (sampledServers.length > normalizedMinServers) {
        sampledServers = sampledServers.slice(0, normalizedMinServers);
    }
    roproServerSampleCache[cacheKey] = {
        data: sampledServers.slice(),
        expiresAt: Date.now() + ROPRO_SERVER_SAMPLE_CACHE_TTL_MS,
    };
    return sampledServers;
}

async function getServerPingHints(
    gameID,
    minServers = 500,
    forceRefresh = false,
    requestedSortOrder = "Desc"
) {
    var normalizedGameId = parseInt(gameID, 10);
    var normalizedMinServers = parseInt(minServers, 10);
    if (!Number.isFinite(normalizedMinServers) || normalizedMinServers <= 0) {
        normalizedMinServers = 500;
    }
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return [];
    }
    var sortOrder =
        typeof requestedSortOrder === "string" ? String(requestedSortOrder).trim() : "Desc";
    if (sortOrder !== "Asc" && sortOrder !== "Desc") {
        sortOrder = "Desc";
    }
    var cacheKey = normalizedGameId + ":" + normalizedMinServers;
    var inflightKey = "ping_hints:" + cacheKey;
    var state = await getRoProServerFilterSampleState(normalizedGameId);
    var hasEnoughHints =
        state != null &&
        typeof state === "object" &&
        state.pingHintsById != null &&
        typeof state.pingHintsById === "object" &&
        Object.keys(state.pingHintsById).length >= normalizedMinServers;
    var cacheFresh =
        state != null &&
        typeof state === "object" &&
        Date.now() - state.updatedAt < ROPRO_ROBLOX_SERVER_PAGE_CACHE_TTL_MS;
    if (
        forceRefresh !== true &&
        hasEnoughHints &&
        cacheFresh
    ) {
        var cachedPingHints = Object.keys(state.pingHintsById).map(function(serverId) {
            return {
                id: serverId,
                ping: state.pingHintsById[serverId],
            };
        });
        shuffleArray(cachedPingHints);
        return cachedPingHints.slice(0, normalizedMinServers);
    }
    if (roproServerPingHintSampleInflight.hasOwnProperty(inflightKey)) {
        return await roproServerPingHintSampleInflight[inflightKey];
    }
    roproServerPingHintSampleInflight[inflightKey] = (async function() {
        var cursorTarget = getRoProServerCursorTargetForMinServers(normalizedMinServers);
        var pageBudget =
            forceRefresh === true ?
            ROPRO_SERVER_FILTER_REFRESH_PAGE_BUDGET :
            ROPRO_SERVER_FILTER_INTERACTIVE_PAGE_BUDGET;
        var state = await getRoProServerFilterSampleState(normalizedGameId);
        var cursor = "";
        var requestedCursors = {};
        var pulledPages = 0;
        while (
            pulledPages < pageBudget &&
            Object.keys(state.pingHintsById).length < normalizedMinServers &&
            Object.keys(requestedCursors).length < cursorTarget
        ) {
            if (state.lastCursorPullAt > 0) {
                var waitDuration =
                    state.lastCursorPullAt +
                    ROPRO_SERVER_FILTER_CURSOR_SUCCESS_DELAY_MS -
                    Date.now();
                if (waitDuration > 0) {
                    await roproSleep(waitDuration);
                }
            }
            state.lastCursorPullAt = Date.now();
            var page = await fetchRobloxPublicServersPage(normalizedGameId, cursor, {
                excludeFullGames: false,
                sortOrder: sortOrder,
            });
            if (page == null || typeof page !== "object" || !Array.isArray(page.data)) {
                break;
            }
            mergeRoProServerPingHintsIntoState(state, page.data);
            mergeRoProServerSampleRowsIntoState(state, page.data);
            if (
                typeof page.nextPageCursor !== "string" ||
                page.nextPageCursor.length === 0
            ) {
                break;
            }
            requestedCursors[cursor] = true;
            cursor = page.nextPageCursor;
            pulledPages += 1;
            if (requestedCursors.hasOwnProperty(cursor)) {
                break;
            }
        }
        state.updatedAt = Date.now();
        roproServerFilterCursorSamples[normalizedGameId] = state;
        await persistRoProServerFilterCursorSamples();
        var pingHints = Object.keys(state.pingHintsById).map(function(serverId) {
            return {
                id: serverId,
                ping: state.pingHintsById[serverId],
            };
        });
        shuffleArray(pingHints);
        return pingHints.slice(0, normalizedMinServers);
    })();
    try {
        return await roproServerPingHintSampleInflight[inflightKey];
    } finally {
        delete roproServerPingHintSampleInflight[inflightKey];
    }
}

async function serverFilterBestConnection(gameID) {
    return new Promise((resolve) => {
        async function doServerFilterBestConnection(gameID, resolve) {
            var serverArray = await serverFilterRandomShuffle(
                gameID,
                ROPRO_SERVER_FILTER_METADATA_SAMPLE_SIZE
            );
            var serverList = [];
            shuffleArray(serverArray);
            async function sortByPing(serverArray) {
                for (var i = 0; i < serverArray.length; i++) {
                    var server = serverArray[i];
                    if (server == null || typeof server !== "object") {
                        continue;
                    }
                    var score = getServerPingValue(server);
                    if (score == null) {
                        continue;
                    }
                    server["score"] = score;
                    serverList.push(server);
                }
                serverList = serverList.sort(function(a, b) {
                    return a["score"] < b["score"] ? -1 : a["score"] > b["score"] ? 1 : 0;
                });
                resolve(serverList);
            }
            sortByPing(serverArray);
        }
        doServerFilterBestConnection(gameID, resolve);
    });
}

async function serverFilterNewestServers(gameID) {
    // Deprecated: Roblox server pages no longer provide stable launch-age ordering.
    return [];
}

async function serverFilterOldestServers(gameID) {
    // Deprecated: Roblox server pages no longer provide stable launch-age ordering.
    return [];
}

async function roproSleep(ms) {
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve();
        }, ms);
    });
}

async function fetchRobloxFriendServerLookup(gameID) {
    var normalizedGameId = parseInt(gameID, 10);
    var friendServerLookup = {};
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return friendServerLookup;
    }
    var url =
        "https://games.roblox.com/v1/games/" +
        normalizedGameId +
        "/servers/Friend?limit=100";
    for (var attempt = 0; attempt < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES; attempt++) {
        try {
            var response = await fetch(url, {
                credentials: "include"
            });
            if (
                response.status === 429 ||
                response.status === 500 ||
                response.status === 502 ||
                response.status === 503 ||
                response.status === 504
            ) {
                if (attempt + 1 < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES) {
                    await roproSleep(250 * (attempt + 1));
                    continue;
                }
                return friendServerLookup;
            }
            if (!response.ok) {
                return friendServerLookup;
            }
            var data = await response.json();
            if (data == null || typeof data !== "object" || !Array.isArray(data.data)) {
                return friendServerLookup;
            }
            for (var i = 0; i < data.data.length; i++) {
                if (
                    data.data[i] != null &&
                    typeof data.data[i] === "object" &&
                    typeof data.data[i].id === "string"
                ) {
                    friendServerLookup[data.data[i].id] = true;
                }
            }
            return friendServerLookup;
        } catch (e) {
            if (attempt + 1 < ROPRO_ROBLOX_SERVER_PAGE_MAX_RETRIES) {
                await roproSleep(250 * (attempt + 1));
                continue;
            }
        }
    }
    return friendServerLookup;
}

function buildRoProRandomServerCandidatePool(serverRows, friendServerLookup) {
    var candidates = [];
    if (!Array.isArray(serverRows)) {
        return candidates;
    }
    var dedupe = {};
    for (var i = 0; i < serverRows.length; i++) {
        if (serverRows[i] == null || typeof serverRows[i] !== "object") {
            continue;
        }
        var normalized = normalizeRoProServerSampleRow(serverRows[i]);
        if (normalized == null) {
            continue;
        }
        if (dedupe.hasOwnProperty(normalized.id)) {
            continue;
        }
        var serverId = normalized.id;
        if (
            friendServerLookup != null &&
            typeof friendServerLookup === "object" &&
            friendServerLookup.hasOwnProperty(serverId)
        ) {
            continue;
        }
        var maxPlayers = normalized.maxPlayers;
        var playing = getServerPlayingValue(normalized);
        if (
            !Number.isFinite(maxPlayers) ||
            maxPlayers <= 0 ||
            playing < 0 ||
            playing >= maxPlayers ||
            dedupe.hasOwnProperty(serverId)
        ) {
            continue;
        }
        dedupe[serverId] = true;
        candidates.push(normalized);
    }
    return candidates;
}

function getRoProRandomServerFromCursorPages(state, friendServerLookup) {
    if (
        state == null ||
        typeof state !== "object" ||
        !Array.isArray(state.cursorPages)
    ) {
        return null;
    }
    var candidatePools = [];
    for (var pageIndex = 0; pageIndex < state.cursorPages.length; pageIndex++) {
        if (
            state.cursorPages[pageIndex] == null ||
            typeof state.cursorPages[pageIndex] !== "object"
        ) {
            continue;
        }
        var pageCandidates = buildRoProRandomServerCandidatePool(
            state.cursorPages[pageIndex].servers,
            friendServerLookup
        );
        if (pageCandidates.length > 0) {
            candidatePools.push(pageCandidates);
        }
    }
    if (candidatePools.length === 0) {
        return null;
    }
    var selectedPool =
        candidatePools[Math.floor(Math.random() * candidatePools.length)];
    return selectedPool[Math.floor(Math.random() * selectedPool.length)];
}

async function randomServer(gameID) {
    var normalizedGameId = parseInt(gameID, 10);
    if (!Number.isFinite(normalizedGameId) || normalizedGameId <= 0) {
        return null;
    }
    var friendServerLookupPromise = fetchRobloxFriendServerLookup(normalizedGameId);
    var state = await getRoProServerFilterSampleState(normalizedGameId);
    if (
        Array.isArray(state.cursorPages) &&
        state.cursorPages.length === 0 &&
        (state.cursorCount > 0 || state.exhausted === true)
    ) {
        state.cursorCount = 0;
        state.nextCursor = "";
        state.exhausted = false;
        state.lastSuccessfulCursorPullAt = 0;
        state.lastCursorPullAt = 0;
        state.requestedCursors = {};
        state.updatedAt = Date.now();
        roproServerFilterCursorSamples[normalizedGameId] = state;
        await persistRoProServerFilterCursorSamples();
    }
    state.nextAllowedPullAt = 0;
    var friendServerLookup = await friendServerLookupPromise;
    var candidate = getRoProRandomServerFromCursorPages(state, friendServerLookup);
    if (candidate != null) {
        return candidate;
    }
    var pullAttempts = 0;
    while (
        state.exhausted !== true &&
        state.cursorCount < ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS &&
        pullAttempts < ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
    ) {
        pullAttempts += 1;
        var nextTarget = Math.min(
            ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS,
            state.cursorCount + 1
        );
        state = await ensureRoProServerCursorSample(normalizedGameId, nextTarget, {
            pageBudget: 1,
            interactive: true,
        });
        candidate = getRoProRandomServerFromCursorPages(state, friendServerLookup);
        if (candidate != null) {
            return candidate;
        }
        if (
            state.exhausted === true ||
            state.cursorCount >= ROPRO_SERVER_FILTER_MAX_CURSOR_REQUESTS
        ) {
            break;
        }
    }
    return null;
}

async function getTimePlayed() {
    var playtimeTracking = await loadSettings("playtimeTracking");
    var mostRecentServer = await loadSettings("mostRecentServer");
    if (playtimeTracking || mostRecentServer) {
        var userID = await getStorage("rpUserID");
        if (playtimeTracking) {
            var timePlayed = await getLocalStorage("timePlayed");
            if (typeof timePlayed == "undefined") {
                timePlayed = {};
                setLocalStorage("timePlayed", timePlayed);
            }
        }
        if (mostRecentServer) {
            var mostRecentServers = await getLocalStorage("mostRecentServers");
            if (typeof mostRecentServers == "undefined") {
                mostRecentServers = {};
                setLocalStorage("mostRecentServers", mostRecentServers);
            }
        }
        fetch("https://presence.roblox.com/v1/presence/users", {
                method: "POST",
                body: JSON.stringify({
                    userIds: [userID]
                }),
            })
            .then((response) => response.json())
            .then(async (data) => {
                var placeId = data.userPresences[0].placeId;
                var universeId = data.userPresences[0].universeId;
                if (
                    placeId != null &&
                    universeId != null &&
                    data.userPresences[0].userPresenceType != 3
                ) {
                    if (playtimeTracking) {
                        if (universeId in timePlayed) {
                            timePlayed[universeId] = [
                                timePlayed[universeId][0] + 1,
                                new Date().getTime(),
                                true,
                            ];
                        } else {
                            timePlayed[universeId] = [1, new Date().getTime(), true];
                        }
                        if (timePlayed[universeId][0] >= 10) {
                            var postTimePlayedResult = await executeRoProApiOperation(
                                "ropro_post_time_played", {
                                    gameId: placeId,
                                    universeId: universeId,
                                }
                            );
                            if (postTimePlayedResult !== "ERROR") {
                                timePlayed[universeId] = [0, new Date().getTime(), true];
                            }
                        }
                        setLocalStorage("timePlayed", timePlayed);
                    }
                    if (mostRecentServer) {
                        var gameId = data.userPresences[0].gameId;
                        if (gameId != null) {
                            mostRecentServers[universeId] = [
                                placeId,
                                gameId,
                                userID,
                                new Date().getTime(),
                            ];
                            setLocalStorage("mostRecentServers", mostRecentServers);
                        }
                    }
                }
            });
    }
}

function stripTags(s) {
    if (typeof s == "undefined") {
        return s;
    }
    return s
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/'/g, "")
        .replace(/"/g, "")
        .replace(/`/g, "");
}

function normalizeMutualUserId(value) {
    var normalized = parseInt(value, 10);
    if (!Number.isFinite(normalized) || normalized <= 0) {
        return null;
    }
    return normalized;
}

function buildMutualPresenceStatus(presenceData) {
    if (presenceData == null || typeof presenceData != "object") {
        return null;
    }
    var presenceType = parseInt(presenceData.userPresenceType, 10);
    if (!Number.isFinite(presenceType)) {
        return null;
    }
    if (presenceType <= 0) {
        return {
            isOnline: false,
            status: "Offline"
        };
    }
    if (presenceType == 3) {
        return {
            isOnline: true,
            status: "Studio"
        };
    }
    if (presenceType == 2) {
        return {
            isOnline: true,
            status: "In Game"
        };
    }
    return {
        isOnline: true,
        status: "Online"
    };
}

function normalizeMutualFriendsData(payload) {
    if (
        payload == null ||
        typeof payload != "object" ||
        !Array.isArray(payload.data)
    ) {
        return [];
    }
    return payload.data;
}

function chunkArray(values, chunkSize) {
    var size = Number.isFinite(chunkSize) && chunkSize > 0 ? chunkSize : 100;
    var chunks = [];
    for (var i = 0; i < values.length; i += size) {
        chunks.push(values.slice(i, i + size));
    }
    return chunks;
}

async function fetchMutualUserDetailsById(userIds) {
    var detailsById = {};
    var chunks = chunkArray(userIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        try {
            var response = await fetch("https://users.roblox.com/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userIds: chunks[i],
                    excludeBannedUsers: false,
                }),
            });
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.data)) {
                for (var entryIndex = 0; entryIndex < payload.data.length; entryIndex++) {
                    var entry = payload.data[entryIndex];
                    var userId = normalizeMutualUserId(entry != null ? entry.id : null);
                    if (userId == null) {
                        continue;
                    }
                    detailsById[userId] = entry;
                }
            }
        } catch (e) {}
    }
    return detailsById;
}

async function fetchMutualPresenceById(userIds) {
    var presenceById = {};
    var chunks = chunkArray(userIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        try {
            var response = await fetch("https://presence.roblox.com/v1/presence/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userIds: chunks[i]
                }),
            });
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.userPresences)) {
                for (
                    var presenceIndex = 0; presenceIndex < payload.userPresences.length; presenceIndex++
                ) {
                    var presenceEntry = payload.userPresences[presenceIndex];
                    var presenceUserId = normalizeMutualUserId(
                        presenceEntry != null ? presenceEntry.userId : null
                    );
                    if (presenceUserId == null) {
                        continue;
                    }
                    presenceById[presenceUserId] = presenceEntry;
                }
            }
        } catch (e) {}
    }
    return presenceById;
}

async function fetchMutualAvatarThumbnailsById(userIds) {
    var thumbnailsById = {};
    var chunks = chunkArray(userIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        var requestPayload = [];
        for (var chunkIndex = 0; chunkIndex < chunks[i].length; chunkIndex++) {
            var userId = chunks[i][chunkIndex];
            requestPayload.push({
                requestId: userId + "::AvatarHeadshot:150x150:webp:regular:",
                type: "AvatarHeadShot",
                targetId: userId,
                token: "",
                format: "webp",
                size: "150x150",
                version: "",
            });
        }
        try {
            var response = await fetch("https://thumbnails.roblox.com/v1/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(requestPayload),
            });
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.data)) {
                for (var thumbIndex = 0; thumbIndex < payload.data.length; thumbIndex++) {
                    var thumb = payload.data[thumbIndex];
                    var thumbUserId = normalizeMutualUserId(
                        thumb != null ? thumb.targetId : null
                    );
                    if (thumbUserId == null) {
                        continue;
                    }
                    thumbnailsById[thumbUserId] = thumb;
                }
            }
        } catch (e) {}
    }
    return thumbnailsById;
}

async function buildMutualUsersFromEntries(entries) {
    var normalizedEntries = [];
    var seenIds = {};
    var userIds = [];
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var userId = normalizeMutualUserId(
            entry != null ? entry.id || entry.userId : null
        );
        if (userId == null) {
            continue;
        }
        normalizedEntries.push(entry);
        if (seenIds[userId] === true) {
            continue;
        }
        seenIds[userId] = true;
        userIds.push(userId);
    }
    if (userIds.length == 0) {
        return [];
    }

    var metadataResults = await Promise.all([
        fetchMutualUserDetailsById(userIds),
        fetchMutualPresenceById(userIds),
        fetchMutualAvatarThumbnailsById(userIds),
    ]);
    var userDetailsById = metadataResults[0];
    var presenceById = metadataResults[1];
    var thumbnailsById = metadataResults[2];

    var mutuals = [];
    for (var entryIndex = 0; entryIndex < normalizedEntries.length; entryIndex++) {
        var friend = normalizedEntries[entryIndex];
        var friendId = normalizeMutualUserId(friend != null ? friend.id : null);
        if (friendId == null) {
            continue;
        }
        var mutualUser = buildMutualUserSummary(
            friend,
            userDetailsById[friendId],
            presenceById[friendId],
            thumbnailsById[friendId]
        );
        if (mutualUser != null) {
            mutuals.push(mutualUser);
        }
    }
    return mutuals;
}

async function buildMutualUsersFromFriendLists(myFriendsPayload, theirFriendsPayload) {
    var myFriendIds = {};
    var myFriendsData = normalizeMutualFriendsData(myFriendsPayload);
    for (var myIndex = 0; myIndex < myFriendsData.length; myIndex++) {
        var myFriendId = normalizeMutualUserId(myFriendsData[myIndex].id);
        if (myFriendId == null) {
            continue;
        }
        myFriendIds[myFriendId] = true;
    }

    var mutualEntries = [];
    var theirFriendsData = normalizeMutualFriendsData(theirFriendsPayload);
    for (var theirIndex = 0; theirIndex < theirFriendsData.length; theirIndex++) {
        var theirFriend = theirFriendsData[theirIndex];
        var theirFriendId = normalizeMutualUserId(theirFriend.id);
        if (theirFriendId == null || myFriendIds[theirFriendId] !== true) {
            continue;
        }
        mutualEntries.push(theirFriend);
    }
    return await buildMutualUsersFromEntries(mutualEntries);
}

function buildMutualUserSummary(friend, userDetails, presenceData, thumbnailData) {
    if (friend == null || typeof friend != "object") {
        return null;
    }
    var userId = normalizeMutualUserId(friend.id || friend.userId);
    if (userId == null) {
        return null;
    }

    var displayName = stripTags(
        friend.displayName ||
        (userDetails != null ? userDetails.displayName : null) ||
        friend.name ||
        friend.username ||
        (userDetails != null ? userDetails.name : null) ||
        "Unknown User"
    );
    if (typeof displayName != "string" || displayName.trim().length == 0) {
        displayName = "Unknown User";
    }
    var username = stripTags(
        friend.name ||
        friend.username ||
        (userDetails != null ? userDetails.name : null) ||
        displayName
    );
    if (typeof username != "string" || username.trim().length == 0) {
        username = displayName;
    }

    var presenceStatus = buildMutualPresenceStatus(presenceData);
    var isOnline = false;
    var status = "Offline";
    if (presenceStatus != null) {
        isOnline = presenceStatus.isOnline === true;
        status = presenceStatus.status;
    } else if (typeof friend.isOnline == "boolean") {
        isOnline = friend.isOnline === true;
        status = isOnline ? "Online" : "Offline";
    }

    var iconUrl =
        thumbnailData != null &&
        typeof thumbnailData.imageUrl == "string" &&
        thumbnailData.imageUrl.length > 0 ?
        thumbnailData.imageUrl :
        "https://www.roblox.com/headshot-thumbnail/image?userId=" +
        userId +
        "&width=420&height=420&format=png";

    return {
        type: "user",
        userId: userId,
        name: displayName,
        username: username,
        status: status,
        link: "/users/" + userId + "/profile",
        icon: iconUrl,
        additional: status,
        isOnline: isOnline,
    };
}

var MUTUAL_CONNECTION_PAGE_SIZE = 100;
var MUTUAL_CONNECTION_MAX_PAGES = 30;
var MUTUAL_CONNECTION_MAX_RETRIES = 5;
var MUTUAL_FRIEND_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeMutualConnectionType(value) {
    if (value == "followers" || value == "followings") {
        return value;
    }
    return null;
}

function parseMutualConnectionPage(payload) {
    if (
        payload == null ||
        typeof payload != "object" ||
        !Array.isArray(payload.data)
    ) {
        return {
            data: [],
            nextPageCursor: null,
            error: "Unexpected connections payload shape.",
        };
    }
    return {
        data: payload.data,
        nextPageCursor: normalizeMutualCursorValue(payload.nextPageCursor),
        error: null,
    };
}

async function fetchMutualConnectionPage(userId, connectionType, cursor) {
    var normalizedUserId = normalizeMutualUserId(userId);
    var normalizedConnectionType = normalizeMutualConnectionType(connectionType);
    if (normalizedUserId == null || normalizedConnectionType == null) {
        return {
            data: [],
            nextPageCursor: null,
            error: "Invalid connection request.",
        };
    }
    var requestUrl =
        "https://friends.roblox.com/v1/users/" +
        normalizedUserId +
        "/" +
        normalizedConnectionType +
        "?sortOrder=Desc&limit=" +
        MUTUAL_CONNECTION_PAGE_SIZE;
    var normalizedCursor = normalizeMutualCursorValue(cursor);
    if (normalizedCursor != null) {
        requestUrl += "&cursor=" + encodeURIComponent(normalizedCursor);
    }
    var attempt = 0;
    while (attempt < MUTUAL_CONNECTION_MAX_RETRIES) {
        try {
            var response = await fetch(requestUrl, {
                credentials: "include"
            });
            if (response.status == 429) {
                attempt += 1;
                if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                    return {
                        data: [],
                        nextPageCursor: null,
                        error: "Rate limited while loading connections.",
                    };
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
                continue;
            }
            if (!response.ok) {
                return {
                    data: [],
                    nextPageCursor: null,
                    error: "Failed to load connections.",
                };
            }
            var payload = await response.json();
            return parseMutualConnectionPage(payload);
        } catch (e) {
            attempt += 1;
            if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                return {
                    data: [],
                    nextPageCursor: null,
                    error: "Failed to load connections.",
                };
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        }
    }
    return {
        data: [],
        nextPageCursor: null,
        error: "Failed to load connections.",
    };
}

async function fetchMutualConnectionList(userId, connectionType) {
    var entries = [];
    var seenIds = {};
    var seenCursors = {};
    var cursor = null;
    for (var pageIndex = 0; pageIndex < MUTUAL_CONNECTION_MAX_PAGES; pageIndex++) {
        var page = await fetchMutualConnectionPage(userId, connectionType, cursor);
        if (page.error != null) {
            return {
                data: entries,
                error: page.error
            };
        }
        for (var entryIndex = 0; entryIndex < page.data.length; entryIndex++) {
            var entry = page.data[entryIndex];
            var entryId = normalizeMutualUserId(entry != null ? entry.id : null);
            if (entryId == null || seenIds[entryId] === true) {
                continue;
            }
            seenIds[entryId] = true;
            entries.push(entry);
        }
        var nextCursor = normalizeMutualCursorValue(page.nextPageCursor);
        if (nextCursor == null || seenCursors[nextCursor] === true) {
            break;
        }
        seenCursors[nextCursor] = true;
        cursor = nextCursor;
    }
    return {
        data: entries,
        error: null
    };
}

async function fetchMutualFriendsList(userId) {
    var normalizedUserId = normalizeMutualUserId(userId);
    if (normalizedUserId == null) {
        return {
            data: []
        };
    }
    var attempt = 0;
    while (attempt < MUTUAL_CONNECTION_MAX_RETRIES) {
        try {
            var response = await fetch(
                "https://friends.roblox.com/v1/users/" + normalizedUserId + "/friends", {
                    credentials: "include"
                }
            );
            if (response.status == 429) {
                attempt += 1;
                if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                    return {
                        data: []
                    };
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
                continue;
            }
            if (!response.ok) {
                return {
                    data: []
                };
            }
            var payload = await response.json();
            return {
                data: normalizeMutualFriendsData(payload)
            };
        } catch (e) {
            attempt += 1;
            if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                return {
                    data: []
                };
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        }
    }
    return {
        data: []
    };
}

function isFreshMutualFriendCache(friendCache) {
    if (friendCache == null || typeof friendCache != "object") {
        return false;
    }
    if (!Number.isFinite(friendCache.expiration)) {
        return false;
    }
    if (Date.now() - friendCache.expiration > MUTUAL_FRIEND_CACHE_TTL_MS) {
        return false;
    }
    if (
        friendCache.friends == null ||
        typeof friendCache.friends != "object" ||
        !Array.isArray(friendCache.friends.data)
    ) {
        return false;
    }
    return true;
}

async function mutualFriends(userId) {
    try {
        var myId = normalizeMutualUserId(await getStorage("rpUserID"));
        var targetUserId = normalizeMutualUserId(userId);
        if (myId == null || targetUserId == null) {
            return [];
        }
        var friendCache = await getLocalStorage("friendCache");
        if (!isFreshMutualFriendCache(friendCache)) {
            var myFriends = await fetchMutualFriendsList(myId);
            await setLocalStorage("friendCache", {
                friends: myFriends,
                expiration: Date.now(),
            });
            var theirFriends = await fetchMutualFriendsList(targetUserId);
            var mutuals = await buildMutualUsersFromFriendLists(myFriends, theirFriends);
            return mutuals;
        }
        var cachedMyFriends = friendCache.friends;
        var cachedTheirFriends = await fetchMutualFriendsList(targetUserId);
        var cachedMutuals = await buildMutualUsersFromFriendLists(
            cachedMyFriends,
            cachedTheirFriends
        );
        return cachedMutuals;
    } catch (e) {
        return [];
    }
}

async function mutualFollowing(userId) {
    try {
        var myId = normalizeMutualUserId(await getStorage("rpUserID"));
        var targetUserId = normalizeMutualUserId(userId);
        if (myId == null || targetUserId == null) {
            return [];
        }
        var listResults = await Promise.all([
            fetchMutualConnectionList(myId, "followings"),
            fetchMutualConnectionList(targetUserId, "followings"),
        ]);
        var mutuals = await buildMutualUsersFromFriendLists({
            data: listResults[0].data
        }, {
            data: listResults[1].data
        });
        return mutuals;
    } catch (e) {
        return [];
    }
}

async function mutualFollowers(userId) {
    try {
        var myId = normalizeMutualUserId(await getStorage("rpUserID"));
        var targetUserId = normalizeMutualUserId(userId);
        if (myId == null || targetUserId == null) {
            return [];
        }
        var listResults = await Promise.all([
            fetchMutualConnectionList(myId, "followers"),
            fetchMutualConnectionList(targetUserId, "followers"),
        ]);
        var mutuals = await buildMutualUsersFromFriendLists({
            data: listResults[0].data
        }, {
            data: listResults[1].data
        });
        return mutuals;
    } catch (e) {
        return [];
    }
}

var MUTUAL_ICON_PLACEHOLDER_URL =
    "https://t0.rbxcdn.com/75c8a07ec89b142d63d9b8d91be23b26";
var MUTUAL_FAVORITES_MAX_PAGES = 30;
var MUTUAL_FAVORITES_PAGE_SIZE = 100;
var MUTUAL_FAVORITES_MAX_RETRIES = 5;

function normalizeMutualAssetOrUniverseId(value) {
    var parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

function normalizeMutualCursorValue(value) {
    if (typeof value != "string") {
        return null;
    }
    var trimmed = value.trim();
    if (trimmed.length == 0) {
        return null;
    }
    return trimmed;
}

function parseMutualFavoriteGamesPage(payload) {
    if (
        payload == null ||
        typeof payload != "object" ||
        !Array.isArray(payload.data)
    ) {
        return {
            data: [],
            nextPageCursor: null,
            error: "Unexpected favorite games payload shape.",
        };
    }
    return {
        data: payload.data,
        nextPageCursor: normalizeMutualCursorValue(payload.nextPageCursor),
        error: null,
    };
}

async function fetchMutualFavoriteGamesPage(userId, cursor) {
    var normalizedUserId = normalizeMutualAssetOrUniverseId(userId);
    if (normalizedUserId == null) {
        return {
            data: [],
            nextPageCursor: null,
            error: "Invalid user id."
        };
    }
    var requestUrl =
        "https://games.roblox.com/v2/users/" +
        normalizedUserId +
        "/favorite/games?accessFilter=2&limit=" +
        MUTUAL_FAVORITES_PAGE_SIZE +
        "&sortOrder=Desc";
    var normalizedCursor = normalizeMutualCursorValue(cursor);
    if (normalizedCursor != null) {
        requestUrl += "&cursor=" + encodeURIComponent(normalizedCursor);
    }
    var attempt = 0;
    while (attempt < MUTUAL_FAVORITES_MAX_RETRIES) {
        try {
            var response = await fetch(requestUrl, {
                credentials: "include"
            });
            if (response.status == 429) {
                attempt += 1;
                if (attempt >= MUTUAL_FAVORITES_MAX_RETRIES) {
                    return {
                        data: [],
                        nextPageCursor: null,
                        error: "Rate limited while loading favorite games.",
                    };
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
                continue;
            }
            if (!response.ok) {
                return {
                    data: [],
                    nextPageCursor: null,
                    error: "Failed to load favorite games.",
                };
            }
            var payload = await response.json();
            return parseMutualFavoriteGamesPage(payload);
        } catch (e) {
            attempt += 1;
            if (attempt >= MUTUAL_FAVORITES_MAX_RETRIES) {
                return {
                    data: [],
                    nextPageCursor: null,
                    error: "Failed to load favorite games.",
                };
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        }
    }
    return {
        data: [],
        nextPageCursor: null,
        error: "Failed to load favorite games."
    };
}

async function fetchMutualFavoriteGames(userId) {
    var favorites = [];
    var seenUniverseIds = {};
    var seenCursors = {};
    var cursor = null;
    for (var pageIndex = 0; pageIndex < MUTUAL_FAVORITES_MAX_PAGES; pageIndex++) {
        var page = await fetchMutualFavoriteGamesPage(userId, cursor);
        if (page.error != null) {
            break;
        }
        for (var gameIndex = 0; gameIndex < page.data.length; gameIndex++) {
            var favoriteGame = page.data[gameIndex];
            var universeId = normalizeMutualAssetOrUniverseId(
                favoriteGame != null ? favoriteGame.id : null
            );
            if (universeId == null || seenUniverseIds[universeId] === true) {
                continue;
            }
            seenUniverseIds[universeId] = true;
            favorites.push(favoriteGame);
        }
        var nextCursor = normalizeMutualCursorValue(page.nextPageCursor);
        if (nextCursor == null || seenCursors[nextCursor] === true) {
            break;
        }
        seenCursors[nextCursor] = true;
        cursor = nextCursor;
    }
    return favorites;
}

async function fetchMutualGameIconsByUniverseId(universeIds) {
    var iconsByUniverseId = {};
    var chunks = chunkArray(universeIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        if (!Array.isArray(chunks[i]) || chunks[i].length == 0) {
            continue;
        }
        try {
            var response = await fetch(
                "https://thumbnails.roblox.com/v1/games/icons?universeIds=" +
                chunks[i].join(",") +
                "&size=150x150&format=Webp&isCircular=false"
            );
            if (!response.ok) {
                continue;
            }
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.data)) {
                for (var iconIndex = 0; iconIndex < payload.data.length; iconIndex++) {
                    var iconEntry = payload.data[iconIndex];
                    var universeId = normalizeMutualAssetOrUniverseId(
                        iconEntry != null ? iconEntry.targetId : null
                    );
                    if (
                        universeId != null &&
                        iconEntry != null &&
                        typeof iconEntry.imageUrl == "string" &&
                        iconEntry.imageUrl.length > 0
                    ) {
                        iconsByUniverseId[universeId] = iconEntry.imageUrl;
                    }
                }
            }
        } catch (e) {}
    }
    return iconsByUniverseId;
}

async function fetchMutualAssetThumbnailsById(assetIds) {
    var thumbnailsById = {};
    var chunks = chunkArray(assetIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        if (!Array.isArray(chunks[i]) || chunks[i].length == 0) {
            continue;
        }
        var requestPayload = [];
        for (var chunkIndex = 0; chunkIndex < chunks[i].length; chunkIndex++) {
            var assetId = normalizeMutualAssetOrUniverseId(chunks[i][chunkIndex]);
            if (assetId == null) {
                continue;
            }
            requestPayload.push({
                requestId: assetId + ":undefined:Asset:150x150:webp:regular:0",
                type: "Asset",
                targetId: assetId,
                token: "",
                format: "webp",
                size: "150x150",
            });
        }
        if (requestPayload.length == 0) {
            continue;
        }
        try {
            var response = await fetch("https://thumbnails.roblox.com/v1/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestPayload),
            });
            if (!response.ok) {
                continue;
            }
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.data)) {
                for (var thumbIndex = 0; thumbIndex < payload.data.length; thumbIndex++) {
                    var thumb = payload.data[thumbIndex];
                    var thumbAssetId = normalizeMutualAssetOrUniverseId(
                        thumb != null ? thumb.targetId : null
                    );
                    if (
                        thumbAssetId != null &&
                        thumb != null &&
                        typeof thumb.imageUrl == "string" &&
                        thumb.imageUrl.length > 0
                    ) {
                        thumbnailsById[thumbAssetId] = thumb.imageUrl;
                    }
                }
            }
        } catch (e) {}
    }
    return thumbnailsById;
}

function buildMutualAssetFallbackThumbnailUrl(assetId) {
    var normalizedAssetId = normalizeMutualAssetOrUniverseId(assetId);
    if (normalizedAssetId == null) {
        return MUTUAL_ICON_PLACEHOLDER_URL;
    }
    return (
        "https://www.roblox.com/asset-thumbnail/image?assetId=" +
        normalizedAssetId +
        "&width=150&height=150&format=png"
    );
}

async function mutualFavorites(userId, assetType) {
    var normalizedAssetType = parseInt(assetType, 10);
    if (!Number.isFinite(normalizedAssetType) || normalizedAssetType != 9) {
        return [];
    }
    var myId = await getStorage("rpUserID");
    var myUserId = normalizeMutualAssetOrUniverseId(myId);
    var theirUserId = normalizeMutualAssetOrUniverseId(userId);
    if (myUserId == null || theirUserId == null) {
        return [];
    }

    var favoritesPayload = await Promise.all([
        fetchMutualFavoriteGames(myUserId),
        fetchMutualFavoriteGames(theirUserId),
    ]);
    var myFavorites = favoritesPayload[0];
    var theirFavorites = favoritesPayload[1];

    var myUniverseIds = {};
    for (var myIndex = 0; myIndex < myFavorites.length; myIndex++) {
        var myUniverseId = normalizeMutualAssetOrUniverseId(
            myFavorites[myIndex] != null ? myFavorites[myIndex].id : null
        );
        if (myUniverseId != null) {
            myUniverseIds[myUniverseId] = true;
        }
    }

    var mutualUniverseIds = [];
    var mutuals = [];
    for (var theirIndex = 0; theirIndex < theirFavorites.length; theirIndex++) {
        var favorite = theirFavorites[theirIndex];
        var universeId = normalizeMutualAssetOrUniverseId(
            favorite != null ? favorite.id : null
        );
        if (universeId == null || myUniverseIds[universeId] !== true) {
            continue;
        }
        var gameName = stripTags(favorite != null ? favorite.name : "");
        if (typeof gameName != "string" || gameName.trim().length == 0) {
            gameName = "Experience " + universeId;
        }
        var creatorName = stripTags(
            favorite != null &&
            favorite.creator != null &&
            typeof favorite.creator.name == "string" ?
            favorite.creator.name :
            "Unknown Creator"
        );
        if (typeof creatorName != "string" || creatorName.trim().length == 0) {
            creatorName = "Unknown Creator";
        }
        var rootPlaceId = normalizeMutualAssetOrUniverseId(
            favorite != null && favorite.rootPlace != null ? favorite.rootPlace.id : null
        );
        var gameLink =
            rootPlaceId == null ?
            "https://www.roblox.com/games?universeId=" + universeId :
            "https://www.roblox.com/games/" + rootPlaceId;
        mutualUniverseIds.push(universeId);
        mutuals.push({
            name: gameName,
            link: gameLink,
            icon: MUTUAL_ICON_PLACEHOLDER_URL,
            additional: "By " + creatorName,
        });
    }

    var iconMap = await fetchMutualGameIconsByUniverseId(mutualUniverseIds);
    for (var mutualIndex = 0; mutualIndex < mutuals.length; mutualIndex++) {
        var mutualUniverseId = mutualUniverseIds[mutualIndex];
        if (
            mutualUniverseId in iconMap &&
            typeof iconMap[mutualUniverseId] == "string" &&
            iconMap[mutualUniverseId].length > 0
        ) {
            mutuals[mutualIndex].icon = iconMap[mutualUniverseId];
        }
    }

    return mutuals;
}

async function fetchMutualUserCommunities(userId) {
    var normalizedUserId = normalizeMutualUserId(userId);
    if (normalizedUserId == null) {
        return [];
    }
    var requestUrl =
        "https://groups.roblox.com/v2/users/" +
        normalizedUserId +
        "/groups/roles?includeLocked=false&includeNotificationPreferences=false&discoveryType=0";
    var attempt = 0;
    while (attempt < MUTUAL_CONNECTION_MAX_RETRIES) {
        try {
            var response = await fetch(requestUrl, {
                credentials: "include"
            });
            if (response.status == 429) {
                attempt += 1;
                if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                    return [];
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
                continue;
            }
            if (!response.ok) {
                return [];
            }
            var payload = await response.json();
            if (
                payload == null ||
                typeof payload != "object" ||
                !Array.isArray(payload.data)
            ) {
                return [];
            }
            return payload.data;
        } catch (e) {
            attempt += 1;
            if (attempt >= MUTUAL_CONNECTION_MAX_RETRIES) {
                return [];
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        }
    }
    return [];
}

async function fetchMutualCommunityIconsById(communityIds) {
    var iconsById = {};
    var chunks = chunkArray(communityIds, 100);
    for (var i = 0; i < chunks.length; i++) {
        if (!Array.isArray(chunks[i]) || chunks[i].length == 0) {
            continue;
        }
        try {
            var response = await fetch(
                "https://thumbnails.roblox.com/v1/groups/icons?groupIds=" +
                chunks[i].join(",") +
                "&size=150x150&format=Webp&isCircular=false"
            );
            if (!response.ok) {
                continue;
            }
            var payload = await response.json();
            if (payload != null && Array.isArray(payload.data)) {
                for (var iconIndex = 0; iconIndex < payload.data.length; iconIndex++) {
                    var iconEntry = payload.data[iconIndex];
                    var communityId = normalizeMutualUserId(
                        iconEntry != null ? iconEntry.targetId : null
                    );
                    if (
                        communityId != null &&
                        iconEntry != null &&
                        typeof iconEntry.imageUrl == "string" &&
                        iconEntry.imageUrl.length > 0
                    ) {
                        iconsById[communityId] = iconEntry.imageUrl;
                    }
                }
            }
        } catch (e) {}
    }
    return iconsById;
}

var MUTUAL_COMMUNITY_LINK_URL_POLICY = Object.freeze({
    exactHosts: Object.freeze(["roblox.com", "www.roblox.com"]),
    suffixHosts: Object.freeze([".roblox.com"]),
    allowedPathPrefixes: Object.freeze(["/communities/"]),
});

function normalizeMutualCommunityLink(communityId) {
    var normalizedCommunityId = normalizeMutualUserId(communityId);
    if (normalizedCommunityId == null) {
        return null;
    }
    var rawUrl = "https://www.roblox.com/communities/" + normalizedCommunityId + "/group";
    try {
        var parsedUrl = new URL(rawUrl);
        if (hasBlockedUrlScheme(rawUrl, parsedUrl.protocol)) {
            recordUrlProxyProbe(
                "GetMutualGroups",
                "deny",
                rawUrl,
                "blocked_scheme",
                parsedUrl,
                MUTUAL_COMMUNITY_LINK_URL_POLICY
            );
            return null;
        }
        if (!isProxyAllowedHostname(parsedUrl.hostname, MUTUAL_COMMUNITY_LINK_URL_POLICY)) {
            recordUrlProxyProbe(
                "GetMutualGroups",
                "deny",
                rawUrl,
                "blocked_host",
                parsedUrl,
                MUTUAL_COMMUNITY_LINK_URL_POLICY
            );
            return null;
        }
        if (!isProxyAllowedPath(parsedUrl.pathname, MUTUAL_COMMUNITY_LINK_URL_POLICY)) {
            recordUrlProxyProbe(
                "GetMutualGroups",
                "deny",
                rawUrl,
                "blocked_path",
                parsedUrl,
                MUTUAL_COMMUNITY_LINK_URL_POLICY
            );
            return null;
        }
        recordUrlProxyProbe("GetMutualGroups", "allow", rawUrl, "allowed", parsedUrl, MUTUAL_COMMUNITY_LINK_URL_POLICY);
        return parsedUrl.href;
    } catch (e) {
        recordUrlProxyProbe(
            "GetMutualGroups",
            "deny",
            rawUrl,
            "invalid_url",
            null,
            MUTUAL_COMMUNITY_LINK_URL_POLICY
        );
        return null;
    }
}

async function mutualGroups(userId) {
    try {
        var myId = normalizeMutualUserId(await getStorage("rpUserID"));
        var targetUserId = normalizeMutualUserId(userId);
        if (myId == null || targetUserId == null) {
            return [];
        }
        var communitiesPayload = await Promise.all([
            fetchMutualUserCommunities(myId),
            fetchMutualUserCommunities(targetUserId),
        ]);
        var myCommunities = communitiesPayload[0];
        var theirCommunities = communitiesPayload[1];

        var myCommunityIds = {};
        for (var myIndex = 0; myIndex < myCommunities.length; myIndex++) {
            var myCommunity = myCommunities[myIndex];
            var myCommunityId = normalizeMutualUserId(
                myCommunity != null && myCommunity.group != null ? myCommunity.group.id : null
            );
            if (myCommunityId != null) {
                myCommunityIds[myCommunityId] = true;
            }
        }

        var mutualCommunityIds = [];
        var mutuals = [];
        for (var theirIndex = 0; theirIndex < theirCommunities.length; theirIndex++) {
            var theirCommunity = theirCommunities[theirIndex];
            var community = theirCommunity != null ? theirCommunity.group : null;
            var communityId = normalizeMutualUserId(community != null ? community.id : null);
            if (communityId == null || myCommunityIds[communityId] !== true) {
                continue;
            }
            var communityName = stripTags(community != null ? community.name : "");
            if (typeof communityName != "string" || communityName.trim().length == 0) {
                communityName = "Community " + communityId;
            }
            var memberCount = parseInt(community != null ? community.memberCount : 0, 10);
            if (!Number.isFinite(memberCount) || memberCount < 0) {
                memberCount = 0;
            }
            var safeCommunityLink =
                normalizeMutualCommunityLink(communityId) ||
                "https://www.roblox.com/communities/" + communityId + "/group";
            mutualCommunityIds.push(communityId);
            mutuals.push({
                id: communityId,
                name: communityName,
                link: safeCommunityLink,
                icon: MUTUAL_ICON_PLACEHOLDER_URL,
                additional: memberCount + " Members",
            });
        }

        var iconMap = await fetchMutualCommunityIconsById(mutualCommunityIds);
        for (var mutualIndex = 0; mutualIndex < mutuals.length; mutualIndex++) {
            var mutualCommunityId = mutualCommunityIds[mutualIndex];
            if (
                mutualCommunityId in iconMap &&
                typeof iconMap[mutualCommunityId] == "string" &&
                iconMap[mutualCommunityId].length > 0
            ) {
                mutuals[mutualIndex].icon = iconMap[mutualCommunityId];
            }
        }

        return mutuals;
    } catch (e) {
        return [];
    }
}

var MUTUAL_PROFILE_ITEM_ASSET_TYPES =
    "Hat,Face,Gear,Package,HairAccessory,FaceAccessory,NeckAccessory,ShoulderAccessory,FrontAccessory,BackAccessory,WaistAccessory,Shirt,Pants";
var MUTUAL_ITEMS_CACHE_TTL_MS = 2 * 60 * 1000;
var MUTUAL_LIMITEDS_CACHE_TTL_MS = 2 * 60 * 1000;
var MUTUAL_INVENTORY_CACHE_MAX_ENTRIES = 40;
var mutualItemsInventoryCache = {};
var mutualItemsInventoryInflight = {};
var mutualLimitedInventoryCache = {};
var mutualLimitedInventoryInflight = {};

function pruneMutualInventoryCache(cache) {
    var keys = Object.keys(cache);
    if (keys.length <= MUTUAL_INVENTORY_CACHE_MAX_ENTRIES) {
        return;
    }
    keys.sort(function(left, right) {
        var leftTimestamp =
            cache[left] != null && Number.isFinite(cache[left].expiresAt) ?
            cache[left].expiresAt :
            0;
        var rightTimestamp =
            cache[right] != null && Number.isFinite(cache[right].expiresAt) ?
            cache[right].expiresAt :
            0;
        return leftTimestamp - rightTimestamp;
    });
    var removeCount = keys.length - MUTUAL_INVENTORY_CACHE_MAX_ENTRIES;
    for (var i = 0; i < removeCount; i++) {
        delete cache[keys[i]];
    }
}

function getMutualInventoryCacheEntry(cache, key) {
    if (typeof key != "string" || key.length == 0) {
        return null;
    }
    var entry = cache[key];
    if (
        entry == null ||
        typeof entry != "object" ||
        !Number.isFinite(entry.expiresAt) ||
        entry.value == null
    ) {
        delete cache[key];
        return null;
    }
    if (Date.now() >= entry.expiresAt) {
        delete cache[key];
        return null;
    }
    return entry.value;
}

function setMutualInventoryCacheEntry(cache, key, value, ttlMs) {
    if (typeof key != "string" || key.length == 0 || value == null) {
        return;
    }
    cache[key] = {
        value: value,
        expiresAt: Date.now() + ttlMs,
    };
    pruneMutualInventoryCache(cache);
}

function buildMutualItemsCacheKey(userID, assetTypes) {
    var normalizedUserId = normalizeMutualUserId(userID);
    var normalizedAssetTypes = stripTags(
        typeof assetTypes == "string" ? assetTypes : ""
    );
    if (normalizedUserId == null || normalizedAssetTypes.length == 0) {
        return null;
    }
    return normalizedUserId + "::" + normalizedAssetTypes;
}

function buildMutualLimitedsCacheKey(userID) {
    var normalizedUserId = normalizeMutualUserId(userID);
    if (normalizedUserId == null) {
        return null;
    }
    return String(normalizedUserId);
}

function validateMutualInventoryMap(value) {
    return value != null && typeof value == "object" && !Array.isArray(value);
}

async function loadItemsForMutual(userID, assetTypes) {
    var cacheKey = buildMutualItemsCacheKey(userID, assetTypes);
    if (cacheKey == null) {
        throw new Error("Invalid mutual items cache key.");
    }
    var normalizedAssetTypes = stripTags(
        typeof assetTypes == "string" ? assetTypes : ""
    );
    if (normalizedAssetTypes.length == 0) {
        throw new Error("Invalid mutual items asset types.");
    }
    var cached = getMutualInventoryCacheEntry(mutualItemsInventoryCache, cacheKey);
    if (cached != null) {
        return cached;
    }
    if (mutualItemsInventoryInflight[cacheKey] != null) {
        return await mutualItemsInventoryInflight[cacheKey];
    }
    mutualItemsInventoryInflight[cacheKey] = (async function() {
        var inventory = null;
        if (normalizedAssetTypes === MUTUAL_PROFILE_ITEM_ASSET_TYPES) {
            var sharedResult = await getSharedInventory(
                "mutual_profile_items_map",
                userID,
                async function(loadUserId) {
                    var loaded = await loadItems(loadUserId, MUTUAL_PROFILE_ITEM_ASSET_TYPES);
                    if (!validateMutualInventoryMap(loaded)) {
                        return {
                            ok: false,
                            code: "failed",
                            error: "Unexpected mutual items payload.",
                            data: {},
                        };
                    }
                    return {
                        ok: true,
                        data: loaded
                    };
                }, {
                    allowStale: true,
                    refreshStale: true,
                }
            );
            if (!sharedResult.ok) {
                throw new Error(sharedResult.error || "Failed to load mutual items.");
            }
            inventory = sharedResult.data;
        } else {
            inventory = await loadItems(userID, normalizedAssetTypes);
        }
        if (!validateMutualInventoryMap(inventory)) {
            throw new Error("Unexpected mutual items payload.");
        }
        setMutualInventoryCacheEntry(
            mutualItemsInventoryCache,
            cacheKey,
            inventory,
            MUTUAL_ITEMS_CACHE_TTL_MS
        );
        return inventory;
    })();
    try {
        return await mutualItemsInventoryInflight[cacheKey];
    } finally {
        delete mutualItemsInventoryInflight[cacheKey];
    }
}

async function loadLimitedsForMutual(userID) {
    var cacheKey = buildMutualLimitedsCacheKey(userID);
    if (cacheKey == null) {
        throw new Error("Invalid mutual limiteds cache key.");
    }
    var cached = getMutualInventoryCacheEntry(mutualLimitedInventoryCache, cacheKey);
    if (cached != null) {
        return cached;
    }
    if (mutualLimitedInventoryInflight[cacheKey] != null) {
        return await mutualLimitedInventoryInflight[cacheKey];
    }
    mutualLimitedInventoryInflight[cacheKey] = (async function() {
        var sharedResult = await getSharedInventory(
            "mutual_limiteds_map",
            userID,
            async function(loadUserId) {
                var loaded = await loadInventory(loadUserId);
                if (!validateMutualInventoryMap(loaded)) {
                    return {
                        ok: false,
                        code: "failed",
                        error: "Unexpected mutual limiteds payload.",
                        data: {},
                    };
                }
                return {
                    ok: true,
                    data: loaded
                };
            }, {
                allowStale: true,
                refreshStale: true,
            }
        );
        if (!sharedResult.ok) {
            throw new Error(sharedResult.error || "Failed to load mutual limiteds.");
        }
        var inventory = sharedResult.data;
        if (!validateMutualInventoryMap(inventory)) {
            throw new Error("Unexpected mutual limiteds payload.");
        }
        setMutualInventoryCacheEntry(
            mutualLimitedInventoryCache,
            cacheKey,
            inventory,
            MUTUAL_LIMITEDS_CACHE_TTL_MS
        );
        return inventory;
    })();
    try {
        return await mutualLimitedInventoryInflight[cacheKey];
    } finally {
        delete mutualLimitedInventoryInflight[cacheKey];
    }
}

async function mutualItems(userId) {
    return new Promise((resolve) => {
        async function doGet() {
            var myId = await getStorage("rpUserID");
            var inventoryResults = await Promise.allSettled([
                loadItemsForMutual(myId, MUTUAL_PROFILE_ITEM_ASSET_TYPES),
                loadItemsForMutual(userId, MUTUAL_PROFILE_ITEM_ASSET_TYPES),
            ]);
            if (inventoryResults[1].status != "fulfilled") {
                resolve([{
                    error: true
                }]);
                return;
            }
            if (inventoryResults[0].status != "fulfilled") {
                resolve([]);
                return;
            }
            var myItems = inventoryResults[0].value;
            var theirItems = inventoryResults[1].value;
            var mutualAssetIds = [];
            var mutuals = [];
            for (let item in theirItems) {
                if (item in myItems) {
                    var mutualAssetId = normalizeMutualAssetOrUniverseId(myItems[item].assetId);
                    if (mutualAssetId == null) {
                        continue;
                    }
                    mutualAssetIds.push(mutualAssetId);
                    mutuals.push({
                        name: stripTags(myItems[item].name),
                        link: stripTags(
                            "https://www.roblox.com/catalog/" + myItems[item].assetId
                        ),
                        icon: MUTUAL_ICON_PLACEHOLDER_URL,
                        additional: "",
                    });
                }
            }
            var thumbnailMap = await fetchMutualAssetThumbnailsById(mutualAssetIds);
            for (var mutualIndex = 0; mutualIndex < mutuals.length; mutualIndex++) {
                var assetId = mutualAssetIds[mutualIndex];
                mutuals[mutualIndex].icon =
                    assetId in thumbnailMap ?
                    thumbnailMap[assetId] :
                    buildMutualAssetFallbackThumbnailUrl(assetId);
            }
            resolve(mutuals);
        }
        doGet();
    });
}

async function mutualLimiteds(userId) {
    return new Promise((resolve) => {
        async function doGet() {
            var targetUserId = normalizeMutualUserId(userId);
            if (targetUserId == null) {
                resolve([{
                    error: true
                }]);
                return;
            }
            if (await isInventoryPrivate(targetUserId)) {
                resolve([{
                    error: true
                }]);
                return;
            }
            var myId = await getStorage("rpUserID");
            var inventoryResults = await Promise.allSettled([
                loadLimitedsForMutual(myId),
                loadLimitedsForMutual(targetUserId),
            ]);
            if (inventoryResults[1].status != "fulfilled") {
                resolve([{
                    error: true
                }]);
                return;
            }
            if (inventoryResults[0].status != "fulfilled") {
                resolve([]);
                return;
            }
            var myLimiteds = inventoryResults[0].value;
            var theirLimiteds = inventoryResults[1].value;
            var mutualAssetIds = [];
            var mutuals = [];
            for (let item in theirLimiteds) {
                if (item in myLimiteds) {
                    var mutualAssetId = normalizeMutualAssetOrUniverseId(
                        myLimiteds[item].assetId
                    );
                    if (mutualAssetId == null) {
                        continue;
                    }
                    mutualAssetIds.push(mutualAssetId);
                    mutuals.push({
                        name: stripTags(myLimiteds[item].name),
                        link: stripTags(
                            "https://www.roblox.com/catalog/" + myLimiteds[item].assetId
                        ),
                        icon: MUTUAL_ICON_PLACEHOLDER_URL,
                        additional: "Quantity: " + parseInt(theirLimiteds[item].quantity),
                    });
                }
            }
            var thumbnailMap = await fetchMutualAssetThumbnailsById(mutualAssetIds);
            for (var mutualIndex = 0; mutualIndex < mutuals.length; mutualIndex++) {
                var assetId = mutualAssetIds[mutualIndex];
                mutuals[mutualIndex].icon =
                    assetId in thumbnailMap ?
                    thumbnailMap[assetId] :
                    buildMutualAssetFallbackThumbnailUrl(assetId);
            }
            resolve(mutuals);
        }
        doGet();
    });
}

var ROPRO_SHARED_INVENTORY_CACHE_KEY = "rpSharedInventoryCacheV1";
var ROPRO_SHARED_INVENTORY_CACHE_VERSION = 1;
var ROPRO_SHARED_INVENTORY_SCOPE_CONFIG = {
    tradable_instances: {
        ttlMs: 3 * 60 * 1000,
        staleTtlMs: 15 * 60 * 1000,
        maxEntries: 4,
        persistSelfOnly: true,
        validateData: isValidSharedInventoryArrayRows,
    },
    quick_equip_full: {
        ttlMs: 10 * 60 * 1000,
        staleTtlMs: 60 * 60 * 1000,
        maxEntries: 2,
        persistSelfOnly: true,
        validateData: isValidSharedInventoryArrayRows,
    },
    mutual_profile_items_map: {
        ttlMs: 2 * 60 * 1000,
        staleTtlMs: 10 * 60 * 1000,
        maxEntries: 12,
        persistSelfOnly: true,
        validateData: isValidSharedInventoryObjectMap,
    },
    mutual_limiteds_map: {
        ttlMs: 2 * 60 * 1000,
        staleTtlMs: 10 * 60 * 1000,
        maxEntries: 12,
        persistSelfOnly: true,
        validateData: isValidSharedInventoryObjectMap,
    },
};
var roproSharedInventoryCacheLoaded = false;
var roproSharedInventoryCache = {
    tradable_instances: {},
    quick_equip_full: {},
    mutual_profile_items_map: {},
    mutual_limiteds_map: {},
};
var roproSharedInventoryInflight = {};
var roproSharedInventoryPersistTimer = null;

function isValidSharedInventoryArrayRows(rows) {
    return Array.isArray(rows);
}

function isValidSharedInventoryObjectMap(rows) {
    return rows != null && typeof rows === "object" && !Array.isArray(rows);
}

function normalizeSharedInventoryCacheUserId(userID) {
    var normalized = parseInt(userID, 10);
    if (!Number.isFinite(normalized) || normalized <= 0) {
        return null;
    }
    return normalized;
}

function isValidSharedInventoryData(scopeName, rows) {
    var scopeConfig = ROPRO_SHARED_INVENTORY_SCOPE_CONFIG[scopeName];
    if (
        scopeConfig != null &&
        typeof scopeConfig === "object" &&
        typeof scopeConfig.validateData === "function"
    ) {
        return scopeConfig.validateData(rows);
    }
    return Array.isArray(rows);
}

function normalizeSharedInventoryCacheEntry(scopeName, rawEntry, scopeConfig, nowMs) {
    if (
        rawEntry == null ||
        typeof rawEntry !== "object" ||
        !isValidSharedInventoryData(scopeName, rawEntry.data)
    ) {
        return null;
    }
    var now = Number.isFinite(nowMs) ? nowMs : Date.now();
    var fetchedAt = parseInt(rawEntry.fetchedAt, 10);
    if (!Number.isFinite(fetchedAt) || fetchedAt <= 0) {
        fetchedAt = now;
    }
    var expiresAt = parseInt(rawEntry.expiresAt, 10);
    if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
        expiresAt = fetchedAt + scopeConfig.ttlMs;
    }
    var staleAt = parseInt(rawEntry.staleAt, 10);
    if (!Number.isFinite(staleAt) || staleAt < expiresAt) {
        staleAt = expiresAt + scopeConfig.staleTtlMs;
    }
    if (staleAt <= now) {
        return null;
    }
    return {
        data: rawEntry.data,
        fetchedAt: fetchedAt,
        expiresAt: expiresAt,
        staleAt: staleAt,
        persisted: rawEntry.persisted !== false,
    };
}

function pruneSharedInventoryScopeCache(scopeName, nowMs) {
    var scopeConfig = ROPRO_SHARED_INVENTORY_SCOPE_CONFIG[scopeName];
    var scopeCache = roproSharedInventoryCache[scopeName];
    if (
        !scopeConfig ||
        scopeCache == null ||
        typeof scopeCache !== "object" ||
        Array.isArray(scopeCache)
    ) {
        roproSharedInventoryCache[scopeName] = {};
        return;
    }
    var now = Number.isFinite(nowMs) ? nowMs : Date.now();
    var keys = Object.keys(scopeCache);
    var retainedKeys = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var normalizedEntry = normalizeSharedInventoryCacheEntry(
            scopeName,
            scopeCache[key],
            scopeConfig,
            now
        );
        if (normalizedEntry == null) {
            delete scopeCache[key];
            continue;
        }
        scopeCache[key] = normalizedEntry;
        retainedKeys.push(key);
    }
    if (retainedKeys.length <= scopeConfig.maxEntries) {
        return;
    }
    retainedKeys.sort(function(left, right) {
        return scopeCache[right].fetchedAt - scopeCache[left].fetchedAt;
    });
    for (var removeIndex = scopeConfig.maxEntries; removeIndex < retainedKeys.length; removeIndex++) {
        delete scopeCache[retainedKeys[removeIndex]];
    }
}

function pruneSharedInventoryCache(nowMs) {
    var scopeNames = Object.keys(ROPRO_SHARED_INVENTORY_SCOPE_CONFIG);
    for (var i = 0; i < scopeNames.length; i++) {
        pruneSharedInventoryScopeCache(scopeNames[i], nowMs);
    }
}

async function ensureSharedInventoryCacheLoaded() {
    if (roproSharedInventoryCacheLoaded) {
        return;
    }
    var stored = await getLocalStorage(ROPRO_SHARED_INVENTORY_CACHE_KEY);
    var isValidStoredCache =
        stored != null &&
        typeof stored === "object" &&
        parseInt(stored.version, 10) === ROPRO_SHARED_INVENTORY_CACHE_VERSION &&
        stored.scopes != null &&
        typeof stored.scopes === "object" &&
        !Array.isArray(stored.scopes);
    if (isValidStoredCache) {
        var nextCache = {};
        var scopeNames = Object.keys(ROPRO_SHARED_INVENTORY_SCOPE_CONFIG);
        for (var i = 0; i < scopeNames.length; i++) {
            var scopeName = scopeNames[i];
            var storedScope = stored.scopes[scopeName];
            nextCache[scopeName] =
                storedScope != null &&
                typeof storedScope === "object" &&
                !Array.isArray(storedScope) ?
                storedScope :
                {};
        }
        roproSharedInventoryCache = nextCache;
    } else {
        roproSharedInventoryCache = {
            tradable_instances: {},
            quick_equip_full: {},
            mutual_profile_items_map: {},
            mutual_limiteds_map: {},
        };
    }
    roproSharedInventoryCacheLoaded = true;
    pruneSharedInventoryCache(Date.now());
}

function buildSharedInventoryPersistPayload() {
    var scopesPayload = {};
    var scopeNames = Object.keys(ROPRO_SHARED_INVENTORY_SCOPE_CONFIG);
    for (var i = 0; i < scopeNames.length; i++) {
        var scopeName = scopeNames[i];
        var scopeCache = roproSharedInventoryCache[scopeName];
        var persistedScope = {};
        if (
            scopeCache != null &&
            typeof scopeCache === "object" &&
            !Array.isArray(scopeCache)
        ) {
            var keys = Object.keys(scopeCache);
            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                var cacheKey = keys[keyIndex];
                var entry = scopeCache[cacheKey];
                if (entry == null || typeof entry !== "object" || entry.persisted !== true) {
                    continue;
                }
                persistedScope[cacheKey] = {
                    data: entry.data,
                    fetchedAt: entry.fetchedAt,
                    expiresAt: entry.expiresAt,
                    staleAt: entry.staleAt,
                    persisted: true,
                };
            }
        }
        scopesPayload[scopeName] = persistedScope;
    }
    return {
        version: ROPRO_SHARED_INVENTORY_CACHE_VERSION,
        scopes: scopesPayload,
    };
}

async function persistSharedInventoryCacheNow() {
    pruneSharedInventoryCache(Date.now());
    try {
        await setLocalStorage(
            ROPRO_SHARED_INVENTORY_CACHE_KEY,
            buildSharedInventoryPersistPayload()
        );
    } catch (e) {}
}

function scheduleSharedInventoryCachePersist() {
    if (roproSharedInventoryPersistTimer != null) {
        clearTimeout(roproSharedInventoryPersistTimer);
    }
    roproSharedInventoryPersistTimer = setTimeout(function() {
        roproSharedInventoryPersistTimer = null;
        persistSharedInventoryCacheNow();
    }, 500);
}

function setSharedInventoryCacheEntry(scopeName, userID, rows, persisted) {
    var scopeConfig = ROPRO_SHARED_INVENTORY_SCOPE_CONFIG[scopeName];
    var normalizedUserId = normalizeSharedInventoryCacheUserId(userID);
    if (
        scopeConfig == null ||
        normalizedUserId == null ||
        !isValidSharedInventoryData(scopeName, rows)
    ) {
        return;
    }
    if (
        roproSharedInventoryCache[scopeName] == null ||
        typeof roproSharedInventoryCache[scopeName] !== "object" ||
        Array.isArray(roproSharedInventoryCache[scopeName])
    ) {
        roproSharedInventoryCache[scopeName] = {};
    }
    var now = Date.now();
    roproSharedInventoryCache[scopeName][String(normalizedUserId)] = {
        data: rows,
        fetchedAt: now,
        expiresAt: now + scopeConfig.ttlMs,
        staleAt: now + scopeConfig.ttlMs + scopeConfig.staleTtlMs,
        persisted: persisted === true,
    };
    pruneSharedInventoryScopeCache(scopeName, now);
    if (persisted === true) {
        scheduleSharedInventoryCachePersist();
    }
}

function getSharedInventoryCacheEntry(scopeName, userID, allowStale) {
    var scopeConfig = ROPRO_SHARED_INVENTORY_SCOPE_CONFIG[scopeName];
    var normalizedUserId = normalizeSharedInventoryCacheUserId(userID);
    if (scopeConfig == null || normalizedUserId == null) {
        return null;
    }
    var scopeCache = roproSharedInventoryCache[scopeName];
    if (
        scopeCache == null ||
        typeof scopeCache !== "object" ||
        Array.isArray(scopeCache)
    ) {
        return null;
    }
    var key = String(normalizedUserId);
    var entry = normalizeSharedInventoryCacheEntry(
        scopeName,
        scopeCache[key],
        scopeConfig,
        Date.now()
    );
    if (entry == null) {
        if (scopeCache[key] != null) {
            delete scopeCache[key];
        }
        return null;
    }
    scopeCache[key] = entry;
    var now = Date.now();
    if (now <= entry.expiresAt) {
        return {
            data: entry.data,
            stale: false,
        };
    }
    if (allowStale === true && now <= entry.staleAt) {
        return {
            data: entry.data,
            stale: true,
        };
    }
    if (entry.persisted === true) {
        scheduleSharedInventoryCachePersist();
    }
    delete scopeCache[key];
    return null;
}

function getSharedInventoryInflightKey(scopeName, userID) {
    var normalizedUserId = normalizeSharedInventoryCacheUserId(userID);
    if (normalizedUserId == null) {
        return null;
    }
    return scopeName + ":" + String(normalizedUserId);
}

async function shouldPersistSharedInventoryCache(scopeName, userID) {
    var scopeConfig = ROPRO_SHARED_INVENTORY_SCOPE_CONFIG[scopeName];
    if (scopeConfig == null) {
        return false;
    }
    if (scopeConfig.persistSelfOnly !== true) {
        return true;
    }
    var normalizedUserId = normalizeSharedInventoryCacheUserId(userID);
    if (normalizedUserId == null) {
        return false;
    }
    var localUserId = normalizePositiveUserId(await getStorage("rpUserID"));
    return localUserId != null && localUserId === normalizedUserId;
}

function normalizeSharedInventoryLoadFailure(result, fallbackError) {
    return {
        ok: false,
        code: result != null &&
            typeof result === "object" &&
            typeof result.code === "string" &&
            result.code.length > 0 ?
            result.code :
            "failed",
        error: result != null &&
            typeof result === "object" &&
            typeof result.error === "string" &&
            result.error.length > 0 ?
            result.error :
            fallbackError,
        data: [],
    };
}

async function loadAndCacheSharedInventory(scopeName, userID, loader) {
    var normalizedUserId = normalizeSharedInventoryCacheUserId(userID);
    if (normalizedUserId == null) {
        return normalizeSharedInventoryLoadFailure({
                code: "failed",
                error: "Invalid user ID."
            },
            "Invalid user ID."
        );
    }
    var inflightKey = getSharedInventoryInflightKey(scopeName, normalizedUserId);
    if (inflightKey == null) {
        return normalizeSharedInventoryLoadFailure({
                code: "failed",
                error: "Invalid inventory cache key."
            },
            "Invalid inventory cache key."
        );
    }
    if (roproSharedInventoryInflight[inflightKey] != null) {
        return await roproSharedInventoryInflight[inflightKey];
    }
    roproSharedInventoryInflight[inflightKey] = (async function() {
        var result = await loader(normalizedUserId);
        if (
            result != null &&
            typeof result === "object" &&
            result.ok === true &&
            isValidSharedInventoryData(scopeName, result.data)
        ) {
            var persisted = await shouldPersistSharedInventoryCache(scopeName, normalizedUserId);
            setSharedInventoryCacheEntry(scopeName, normalizedUserId, result.data, persisted);
            return {
                ok: true,
                data: result.data,
                cacheStatus: "network",
            };
        }
        return normalizeSharedInventoryLoadFailure(
            result,
            "Failed to load inventory."
        );
    })();
    try {
        return await roproSharedInventoryInflight[inflightKey];
    } finally {
        delete roproSharedInventoryInflight[inflightKey];
    }
}

function refreshSharedInventoryInBackground(scopeName, userID, loader) {
    loadAndCacheSharedInventory(scopeName, userID, loader).catch(function() {});
}

async function getSharedInventory(scopeName, userID, loader, options) {
    var safeOptions = options != null && typeof options === "object" ? options : {};
    var allowStale = safeOptions.allowStale !== false;
    var refreshStale = safeOptions.refreshStale !== false;
    await ensureSharedInventoryCacheLoaded();
    var cached = getSharedInventoryCacheEntry(scopeName, userID, allowStale);
    if (cached != null) {
        if (cached.stale === true && refreshStale) {
            refreshSharedInventoryInBackground(scopeName, userID, loader);
        }
        return {
            ok: true,
            data: cached.data,
            cacheStatus: cached.stale ? "stale" : "fresh",
        };
    }
    return await loadAndCacheSharedInventory(scopeName, userID, loader);
}

async function getPage(userID, cursor) {
    var maxRetries = 5;
    var attempt = 0;
    while (attempt < maxRetries) {
        try {
            var response = await fetch(
                `https://inventory.roblox.com/v1/users/${userID}/assets/collectibles?cursor=${cursor}&limit=50&sortOrder=Desc`
            );
            if (response.status == 429) {
                attempt += 1;
                if (attempt >= maxRetries) {
                    return {
                        previousPageCursor: null,
                        nextPageCursor: null,
                        data: [],
                        error: "Rate limited by Roblox while loading inventory.",
                    };
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
                continue;
            }
            if (!response.ok) {
                return {
                    previousPageCursor: null,
                    nextPageCursor: null,
                    data: [],
                    error: "Failed to load inventory.",
                };
            }
            return await response.json();
        } catch (e) {
            attempt += 1;
            if (attempt >= maxRetries) {
                return {
                    previousPageCursor: null,
                    nextPageCursor: null,
                    data: [],
                    error: "Failed to load inventory.",
                };
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        }
    }
    return {
        previousPageCursor: null,
        nextPageCursor: null,
        data: []
    };
}

function isUuidLike(value) {
    if (typeof value !== "string") {
        return false;
    }
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value.trim()
    );
}

function isValidTradableCursor(cursor) {
    return typeof cursor === "string" && cursor.trim().length > 0;
}

function parseTradablePagePayload(payload) {
    if (!payload || typeof payload !== "object" || !Array.isArray(payload.items)) {
        return {
            items: [],
            nextPageCursor: null,
            error: "Unexpected tradable inventory payload shape.",
        };
    }

    if (
        payload.nextPageCursor != null &&
        !isValidTradableCursor(payload.nextPageCursor)
    ) {
        return {
            items: [],
            nextPageCursor: null,
            error: "Unexpected tradable inventory cursor shape.",
        };
    }

    return {
        items: payload.items,
        nextPageCursor: isValidTradableCursor(payload.nextPageCursor) ?
            payload.nextPageCursor :
            null,
    };
}

function normalizeTradableInventoryItem(item) {
    if (!item || typeof item !== "object") {
        return null;
    }

    var rawUserAssetId =
        item.collectibleItemInstanceId ??
        item.userAssetId ??
        null;
    var userAssetId = null;
    if (typeof rawUserAssetId === "number" || /^\d+$/.test(String(rawUserAssetId))) {
        userAssetId = parseInt(rawUserAssetId);
    } else if (isUuidLike(String(rawUserAssetId || ""))) {
        userAssetId = String(rawUserAssetId);
    }
    if (userAssetId == null) {
        return null;
    }

    var rawAssetId =
        (item.itemTarget && item.itemTarget.targetId) ??
        item.assetId ??
        null;
    var assetId = parseInt(rawAssetId);
    if (!Number.isFinite(assetId) || assetId <= 0) {
        return null;
    }

    var name = item.name ?? item.itemName ?? (item.asset && item.asset.name) ?? "";
    if (typeof name !== "string" || name.trim().length === 0) {
        return null;
    }

    var recentAveragePrice = parseInt(item.recentAveragePrice ?? item.rap ?? 0);
    if (!Number.isFinite(recentAveragePrice) || recentAveragePrice < 0) {
        recentAveragePrice = 0;
    }

    return {
        userAssetId: userAssetId,
        assetId: assetId,
        name: name,
        recentAveragePrice: recentAveragePrice,
        serialNumber: item.serialNumber == null || item.serialNumber === "" ?
            null :
            parseInt(item.serialNumber),
        collectibleItemId: item.collectibleItemId ?? null,
        isOnHold: item.isOnHold === true,
    };
}

function expandTradableInventoryRows(item) {
    if (!item || typeof item !== "object") {
        return [];
    }
    if (!Array.isArray(item.instances) || item.instances.length === 0) {
        return [item];
    }
    var rows = [];
    for (var i = 0; i < item.instances.length; i++) {
        var instance = item.instances[i] || {};
        rows.push({
            userAssetId: instance.collectibleItemInstanceId ?? instance.userAssetId,
            assetId: (item.itemTarget && item.itemTarget.targetId) ?? item.assetId,
            name: item.itemName ?? item.name,
            recentAveragePrice: item.recentAveragePrice ?? instance.recentAveragePrice,
            serialNumber: instance.serialNumber,
            collectibleItemId: item.collectibleItemId ?? instance.collectibleItemId,
            isOnHold: instance.isOnHold === true,
        });
    }
    return rows;
}

function parseTradableRetryAfterHeaderMs(retryAfterHeaderValue) {
    if (
        typeof retryAfterHeaderValue !== "string" ||
        retryAfterHeaderValue.trim().length === 0
    ) {
        return null;
    }
    var normalizedValue = retryAfterHeaderValue.trim();
    if (/^[0-9]+$/.test(normalizedValue)) {
        var retryAfterSeconds = parseInt(normalizedValue, 10);
        if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
            return retryAfterSeconds * 1000;
        }
        return null;
    }
    var retryAtMs = Date.parse(normalizedValue);
    if (!Number.isFinite(retryAtMs)) {
        return null;
    }
    var delayMs = retryAtMs - Date.now();
    return delayMs > 0 ? delayMs : 0;
}

function getTradableRetryDelayMs(attempt, retryAfterMs) {
    if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
        return Math.min(20000, Math.max(500, Math.floor(retryAfterMs)));
    }
    var safeAttempt = Math.max(1, parseInt(attempt, 10) || 1);
    return Math.min(15000, safeAttempt * safeAttempt * 700);
}

function classifyTradableInventoryError(status, responseBody) {
    var responseStatus = Number.isFinite(status) ? status : 0;
    var bodyText = typeof responseBody === "string" ? responseBody.toLowerCase() : "";
    if (
        responseStatus === 403 ||
        bodyText.indexOf("privacy settings are too strict") !== -1 ||
        bodyText.indexOf("cannot be traded with") !== -1 ||
        bodyText.indexOf("permissions") !== -1
    ) {
        return {
            code: "private",
            error: "Inventory is private."
        };
    }
    if (
        responseStatus === 404 ||
        bodyText.indexOf("does not exist") !== -1 ||
        bodyText.indexOf("cannot be found") !== -1
    ) {
        return {
            code: "not_found",
            error: "User does not exist."
        };
    }
    if (
        responseStatus === 429 ||
        bodyText.indexOf("too many requests") !== -1 ||
        bodyText.indexOf("toomanyrequests") !== -1
    ) {
        return {
            code: "rate_limited",
            error: "Rate limited by Roblox while loading tradable inventory.",
        };
    }
    return {
        code: "failed",
        error: "Failed to load tradable inventory."
    };
}

async function getTradableItemsPage(userID, cursor) {
    var url =
        "https://trades.roblox.com/v2/users/" +
        userID +
        "/tradableItems?sortBy=CreationTime&cursor=" +
        encodeURIComponent(cursor || "") +
        "&limit=50&sortOrder=Desc";
    var maxRetries = 8;
    for (var attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            var response = await fetch(url, {
                credentials: "include"
            });
            if (response.status === 429 || response.status >= 500) {
                if (attempt >= maxRetries) {
                    var terminalClassification = classifyTradableInventoryError(
                        response.status,
                        ""
                    );
                    return {
                        items: [],
                        nextPageCursor: null,
                        error: terminalClassification.error,
                        code: terminalClassification.code,
                    };
                }
                var retryAfterHeader = "";
                if (response.headers && typeof response.headers.get === "function") {
                    retryAfterHeader = response.headers.get("Retry-After") || "";
                }
                var retryAfterMs = parseTradableRetryAfterHeaderMs(retryAfterHeader);
                await new Promise((resolve) =>
                    setTimeout(resolve, getTradableRetryDelayMs(attempt, retryAfterMs))
                );
                continue;
            }

            var responseText = "";
            try {
                responseText = await response.text();
            } catch (e) {}

            if (!response.ok) {
                var classification = classifyTradableInventoryError(
                    response.status,
                    responseText
                );
                return {
                    items: [],
                    nextPageCursor: null,
                    error: classification.error,
                    code: classification.code,
                };
            }

            var payload = {};
            try {
                payload = responseText === "" ? {} : JSON.parse(responseText);
            } catch (e) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: "Failed to load tradable inventory.",
                    code: "failed",
                };
            }

            var parsedPayload = parseTradablePagePayload(payload);
            if (parsedPayload.error) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: parsedPayload.error,
                    code: "failed",
                };
            }
            return parsedPayload;
        } catch (e) {
            if (attempt >= maxRetries) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: "Failed to load tradable inventory.",
                    code: "failed",
                };
            }
            await new Promise((resolve) =>
                setTimeout(resolve, getTradableRetryDelayMs(attempt, null))
            );
        }
    }
    return {
        items: [],
        nextPageCursor: null,
        error: "Failed to load tradable inventory.",
        code: "failed",
    };
}

async function loadTradableInventory(userID) {
    var inventory = [];
    var cursor = "";
    var seen = {};
    var seenCursors = {};
    var maxPages = 500;
    var completed = false;
    for (var pageIndex = 0; pageIndex < maxPages; pageIndex++) {
        var cursorKey = cursor === "" ? "__first__" : cursor;
        if (seenCursors[cursorKey]) {
            return {
                ok: false,
                code: "failed",
                error: "Failed to load tradable inventory.",
                data: [],
            };
        }
        seenCursors[cursorKey] = true;
        var page = await getTradableItemsPage(userID, cursor);
        if (page.error) {
            return {
                ok: false,
                code: page.code || "failed",
                error: page.error,
                data: [],
            };
        }
        var items = Array.isArray(page.items) ? page.items : [];
        for (var i = 0; i < items.length; i++) {
            var rows = expandTradableInventoryRows(items[i]);
            for (var j = 0; j < rows.length; j++) {
                var normalized = normalizeTradableInventoryItem(rows[j]);
                if (normalized == null) {
                    continue;
                }
                var key = String(normalized.userAssetId);
                if (seen[key]) {
                    continue;
                }
                seen[key] = true;
                inventory.push(normalized);
            }
        }
        if (!isValidTradableCursor(page.nextPageCursor)) {
            completed = true;
            break;
        }
        cursor = page.nextPageCursor;
    }
    if (!completed) {
        return {
            ok: false,
            code: "failed",
            error: "Failed to load tradable inventory.",
            data: [],
        };
    }
    return {
        ok: true,
        data: inventory
    };
}

var ROPRO_QUICK_EQUIP_ASSET_TYPES =
    "Head,Face,RightArm,LeftArm,LeftLeg,RightLeg,HairAccessory,FaceAccessory,NeckAccessory,ShoulderAccessory,FrontAccessory,BackAccessory,WaistAccessory,Hat,Gear,TShirt,Shirt,Pants,TShirtAccessory,ShirtAccessory,PantsAccessory,JacketAccessory,SweaterAccessory,ShortsAccessory,LeftShoeAccessory,RightShoeAccessory";

function isValidQuickEquipInventoryCursor(cursor) {
    return typeof cursor === "string" && cursor.trim().length > 0;
}

function normalizeQuickEquipInventoryItem(item) {
    if (item == null || typeof item !== "object") {
        return null;
    }
    var assetId = parseInt(item.assetId, 10);
    if (!Number.isFinite(assetId) || assetId <= 0) {
        return null;
    }
    var rawName = typeof item.name === "string" ? item.name : "";
    var rawAssetType =
        typeof item.assetType === "string" ?
        item.assetType :
        item.assetType != null &&
        typeof item.assetType === "object" &&
        typeof item.assetType.name === "string" ?
        item.assetType.name :
        "";
    var normalizedName = stripTags(rawName).trim();
    var normalizedAssetType = stripTags(rawAssetType).trim();
    return {
        assetId: assetId,
        name: normalizedName.length > 0 ? normalizedName : "Unknown Item",
        assetType: normalizedAssetType,
    };
}

function parseQuickEquipInventoryPagePayload(payload) {
    if (payload == null || typeof payload !== "object" || !Array.isArray(payload.data)) {
        return {
            items: [],
            nextPageCursor: null,
            error: "Unexpected quick equip inventory payload shape.",
            code: "failed",
        };
    }
    if (
        payload.nextPageCursor != null &&
        !isValidQuickEquipInventoryCursor(payload.nextPageCursor)
    ) {
        return {
            items: [],
            nextPageCursor: null,
            error: "Unexpected quick equip inventory cursor shape.",
            code: "failed",
        };
    }
    return {
        items: payload.data,
        nextPageCursor: isValidQuickEquipInventoryCursor(payload.nextPageCursor) ?
            payload.nextPageCursor :
            null,
    };
}

function getQuickEquipInventoryRetryDelayMs(attempt) {
    var safeAttempt = Math.max(1, parseInt(attempt, 10) || 1);
    return Math.min(15000, safeAttempt * safeAttempt * 600);
}

async function getQuickEquipInventoryPage(userID, cursor) {
    var url =
        "https://inventory.roblox.com/v2/users/" +
        userID +
        "/inventory?assetTypes=" +
        encodeURIComponent(ROPRO_QUICK_EQUIP_ASSET_TYPES) +
        "&limit=100&sortOrder=Asc&cursor=" +
        encodeURIComponent(cursor || "");
    var maxRetries = 8;
    for (var attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            var response = await fetch(url, {
                credentials: "include"
            });
            if (response.status === 429 || response.status >= 500) {
                if (attempt >= maxRetries) {
                    return {
                        items: [],
                        nextPageCursor: null,
                        error: "Failed to load quick equip inventory.",
                        code: response.status === 429 ? "rate_limited" : "failed",
                    };
                }
                await new Promise((resolve) =>
                    setTimeout(resolve, getQuickEquipInventoryRetryDelayMs(attempt))
                );
                continue;
            }
            var responseText = "";
            try {
                responseText = await response.text();
            } catch (e) {}
            if (!response.ok) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: response.status === 403 ?
                        "Inventory is private." :
                        "Failed to load quick equip inventory.",
                    code: response.status === 403 ? "private" : "failed",
                };
            }
            var payload = {};
            try {
                payload = responseText === "" ? {} : JSON.parse(responseText);
            } catch (e) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: "Failed to load quick equip inventory.",
                    code: "failed",
                };
            }
            var parsedPayload = parseQuickEquipInventoryPagePayload(payload);
            if (parsedPayload.error) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: parsedPayload.error,
                    code: parsedPayload.code || "failed",
                };
            }
            return parsedPayload;
        } catch (e) {
            if (attempt >= maxRetries) {
                return {
                    items: [],
                    nextPageCursor: null,
                    error: "Failed to load quick equip inventory.",
                    code: "failed",
                };
            }
            await new Promise((resolve) =>
                setTimeout(resolve, getQuickEquipInventoryRetryDelayMs(attempt))
            );
        }
    }
    return {
        items: [],
        nextPageCursor: null,
        error: "Failed to load quick equip inventory.",
        code: "failed",
    };
}

async function loadQuickEquipInventory(userID) {
    var inventory = [];
    var seen = {};
    var seenCursors = {};
    var cursor = "";
    var maxPages = 500;
    var completed = false;
    for (var pageIndex = 0; pageIndex < maxPages; pageIndex++) {
        var cursorKey = cursor === "" ? "__first__" : cursor;
        if (seenCursors[cursorKey]) {
            return {
                ok: false,
                code: "failed",
                error: "Failed to load quick equip inventory.",
                data: [],
            };
        }
        seenCursors[cursorKey] = true;
        var page = await getQuickEquipInventoryPage(userID, cursor);
        if (page.error) {
            return {
                ok: false,
                code: page.code || "failed",
                error: page.error,
                data: [],
            };
        }
        var items = Array.isArray(page.items) ? page.items : [];
        for (var i = 0; i < items.length; i++) {
            var normalizedItem = normalizeQuickEquipInventoryItem(items[i]);
            if (normalizedItem == null || seen[normalizedItem.assetId]) {
                continue;
            }
            seen[normalizedItem.assetId] = true;
            inventory.push(normalizedItem);
        }
        if (!isValidQuickEquipInventoryCursor(page.nextPageCursor)) {
            completed = true;
            break;
        }
        cursor = page.nextPageCursor;
    }
    if (!completed) {
        return {
            ok: false,
            code: "failed",
            error: "Failed to load quick equip inventory.",
            data: [],
        };
    }
    return {
        ok: true,
        data: inventory
    };
}

async function getSharedTradableInventory(userID, options) {
    return await getSharedInventory(
        "tradable_instances",
        userID,
        loadTradableInventory,
        options
    );
}

async function getSharedQuickEquipInventory(userID, options) {
    return await getSharedInventory(
        "quick_equip_full",
        userID,
        loadQuickEquipInventory,
        options
    );
}

async function getInventoryPage(userID, assetTypes, cursor) {
    return new Promise((resolve) => {
        fetch(
                "https://inventory.roblox.com/v2/users/" +
                userID +
                "/inventory?assetTypes=" +
                assetTypes +
                "&limit=100&sortOrder=Desc&cursor=" +
                cursor
            )
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(function() {
                resolve({});
            });
    });
}

async function declineBots() {
    //Code to decline all suspected trade botters
    return new Promise((resolve) => {
        var tempCursor = "";
        var botTrades = [];
        var totalLoops = 0;
        var totalDeclined = 0;
        async function doDecline() {
            var trades = await fetchTradesCursor("inbound", 100, tempCursor);
            tempCursor = trades.nextPageCursor;
            var tradeIds = [];
            var userIds = [];
            for (var i = 0; i < trades.data.length; i++) {
                tradeIds.push([trades.data[i].user.id, trades.data[i].id]);
                userIds.push(trades.data[i].user.id);
            }
            if (userIds.length > 0) {
                var flags = await fetchFlagsBatch(userIds);
                flags = JSON.parse(flags);
                for (var i = 0; i < tradeIds.length; i++) {
                    try {
                        if (flags.includes(tradeIds[i][0].toString())) {
                            botTrades.push(tradeIds[i][1]);
                        }
                    } catch (e) {}
                }
            }
            if (totalLoops < 20 && tempCursor != null) {
                setTimeout(function() {
                    doDecline();
                    totalLoops += 1;
                }, 100);
            } else {
                if (botTrades.length > 0) {
                    await loadToken();
                    var token = await getCsrfTokenFromStorage();
                    for (var i = 0; i < botTrades.length; i++) {
                        try {
                            if (totalDeclined < 300) {
                                await cancelTrade(botTrades[i], token);
                                totalDeclined = totalDeclined + 1;
                            } else {
                                resolve(totalDeclined);
                            }
                        } catch (e) {
                            resolve(totalDeclined);
                        }
                    }
                }
                resolve(botTrades.length);
            }
        }
        doDecline();
    });
}

async function fetchFlagsBatch(userIds) {
    return new Promise((resolve) => {
        executeRoProApiOperation("ropro_fetch_flags", {
            userIds: userIds,
        }).then((data) => {
            resolve(data === "ERROR" ? [] : data);
        });
    });
}

async function loadItems(userID, assetTypes) {
    var myInventory = {};
    async function handleAsset(cursor) {
        var response = await getInventoryPage(userID, assetTypes, cursor);
        for (var j = 0; j < response.data.length; j++) {
            var item = response.data[j];
            if (item["assetId"] in myInventory) {
                myInventory[item["assetId"]]["quantity"]++;
            } else {
                myInventory[item["assetId"]] = item;
                myInventory[item["assetId"]]["quantity"] = 1;
            }
        }
        if (response.nextPageCursor != null) {
            await handleAsset(response.nextPageCursor);
        }
    }
    await handleAsset("");
    var total = 0;
    for (var item in myInventory) {
        total += myInventory[item]["quantity"];
    }
    return myInventory;
}

async function loadInventory(userID) {
    var myInventory = {};
    async function handleAsset(cursor) {
        var response = await getPage(userID, cursor);
        for (var j = 0; j < response.data.length; j++) {
            var item = response.data[j];
            if (item["assetId"] in myInventory) {
                myInventory[item["assetId"]]["quantity"]++;
            } else {
                myInventory[item["assetId"]] = item;
                myInventory[item["assetId"]]["quantity"] = 1;
            }
        }
        if (response.nextPageCursor != null) {
            await handleAsset(response.nextPageCursor);
        }
    }
    await handleAsset("");
    var total = 0;
    for (var item in myInventory) {
        total += myInventory[item]["quantity"];
    }
    return myInventory;
}

async function isInventoryPrivate(userID) {
    return new Promise((resolve) => {
        fetch(
            "https://inventory.roblox.com/v1/users/" +
            userID +
            "/assets/collectibles?cursor=&sortOrder=Desc&limit=10&assetType=null"
        ).then((response) => {
            if (response.status == 403) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(function() {
            resolve(false);
        });
    });
}

var ROPRO_PROFILE_VALUE_CACHE_KEY = "rpProfileValueCacheV1";
var ROPRO_PROFILE_VALUE_CACHE_TTL_MS = 10 * 60 * 1000;
var ROPRO_PROFILE_VALUE_CACHE_MAX_ENTRIES = 300;
var roproProfileValueCacheLoaded = false;
var roproProfileValueCache = {};
var roproProfileValueInflightByUserId = {};

function normalizeProfileValueCacheUserId(userID) {
    var normalized = parseInt(userID, 10);
    if (!Number.isFinite(normalized) || normalized <= 0) {
        return null;
    }
    return String(normalized);
}

function normalizeProfileValueResult(result) {
    if (result == null || typeof result !== "object") {
        return null;
    }
    var normalizedValue = result.value;
    if (normalizedValue === "private") {
        return {
            value: "private"
        };
    }
    if (typeof normalizedValue === "number" && Number.isFinite(normalizedValue)) {
        return {
            value: Math.max(0, Math.round(normalizedValue))
        };
    }
    var parsed = parseInt(normalizedValue, 10);
    if (Number.isFinite(parsed)) {
        return {
            value: Math.max(0, parsed)
        };
    }
    if (typeof normalizedValue === "string" && normalizedValue.trim().length > 0) {
        return {
            value: stripTags(normalizedValue).slice(0, 64)
        };
    }
    return {
        value: 0
    };
}

function pruneProfileValueCache(nowMs) {
    var now = Number.isFinite(nowMs) ? nowMs : Date.now();
    var keys = Object.keys(roproProfileValueCache);
    var retained = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var entry = roproProfileValueCache[key];
        if (
            !entry ||
            typeof entry !== "object" ||
            !Number.isFinite(entry.expiresAt) ||
            entry.expiresAt <= now
        ) {
            delete roproProfileValueCache[key];
            continue;
        }
        var normalizedResult = normalizeProfileValueResult(entry.result);
        if (normalizedResult == null) {
            delete roproProfileValueCache[key];
            continue;
        }
        entry.result = normalizedResult;
        retained.push({
            key: key,
            expiresAt: entry.expiresAt
        });
    }
    if (retained.length <= ROPRO_PROFILE_VALUE_CACHE_MAX_ENTRIES) {
        return;
    }
    retained.sort(function(a, b) {
        return a.expiresAt - b.expiresAt;
    });
    var removeCount = retained.length - ROPRO_PROFILE_VALUE_CACHE_MAX_ENTRIES;
    for (var j = 0; j < removeCount; j++) {
        delete roproProfileValueCache[retained[j].key];
    }
}

async function ensureProfileValueCacheLoaded() {
    if (roproProfileValueCacheLoaded) {
        return;
    }
    var storedCache = await getLocalStorage(ROPRO_PROFILE_VALUE_CACHE_KEY);
    if (
        storedCache != null &&
        typeof storedCache === "object" &&
        !Array.isArray(storedCache)
    ) {
        roproProfileValueCache = storedCache;
    } else {
        roproProfileValueCache = {};
    }
    roproProfileValueCacheLoaded = true;
    pruneProfileValueCache(Date.now());
}

async function saveProfileValueCache() {
    try {
        await setLocalStorage(ROPRO_PROFILE_VALUE_CACHE_KEY, roproProfileValueCache);
    } catch (e) {}
}

async function getCachedProfileValue(userID) {
    var cacheUserId = normalizeProfileValueCacheUserId(userID);
    if (cacheUserId == null) {
        return null;
    }
    await ensureProfileValueCacheLoaded();
    var now = Date.now();
    var entry = roproProfileValueCache[cacheUserId];
    if (
        !entry ||
        typeof entry !== "object" ||
        !Number.isFinite(entry.expiresAt) ||
        entry.expiresAt <= now
    ) {
        if (entry != null) {
            delete roproProfileValueCache[cacheUserId];
            await saveProfileValueCache();
        }
        return null;
    }
    var normalizedResult = normalizeProfileValueResult(entry.result);
    if (normalizedResult == null) {
        delete roproProfileValueCache[cacheUserId];
        await saveProfileValueCache();
        return null;
    }
    return normalizedResult;
}

async function setCachedProfileValue(userID, result) {
    var cacheUserId = normalizeProfileValueCacheUserId(userID);
    var normalizedResult = normalizeProfileValueResult(result);
    if (cacheUserId == null || normalizedResult == null) {
        return;
    }
    await ensureProfileValueCacheLoaded();
    roproProfileValueCache[cacheUserId] = {
        expiresAt: Date.now() + ROPRO_PROFILE_VALUE_CACHE_TTL_MS,
        result: normalizedResult,
    };
    pruneProfileValueCache(Date.now());
    await saveProfileValueCache();
}

async function computeProfileValue(userID) {
    var tradableInventoryResult = await getSharedTradableInventory(userID, {
        allowStale: true,
        refreshStale: true,
    });
    if (!tradableInventoryResult.ok) {
        if (tradableInventoryResult.code === "private") {
            return {
                value: "private"
            };
        }
        if (tradableInventoryResult.code === "not_found") {
            return {
                value: 0
            };
        }
        return null;
    }
    var inventory = tradableInventoryResult.data;
    var items = new Set();
    for (var i = 0; i < inventory.length; i++) {
        var assetId = parseInt(inventory[i].assetId, 10);
        if (!Number.isFinite(assetId) || assetId <= 0) {
            continue;
        }
        items.add(assetId);
    }
    var values = await fetchItemValues(Array.from(items));
    var value = 0;
    for (var i = 0; i < inventory.length; i++) {
        var assetId = parseInt(inventory[i].assetId, 10);
        if (!Number.isFinite(assetId) || assetId <= 0) {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(values, assetId)) {
            value += values[assetId];
        }
    }
    return {
        value: value
    };
}

async function fetchCachedProfileValueFromRoPro(userID) {
    var response = await executeRoProApiOperation("ropro_get_profile_value_cache", {
        userId: userID,
    });
    return normalizeProfileValueResult(response);
}

async function getProfileValue(userID) {
    var cacheUserId = normalizeProfileValueCacheUserId(userID);
    if (cacheUserId == null) {
        return {
            value: 0
        };
    }

    var cached = await getCachedProfileValue(cacheUserId);
    if (cached != null) {
        return cached;
    }

    if (roproProfileValueInflightByUserId[cacheUserId] != null) {
        return await roproProfileValueInflightByUserId[cacheUserId];
    }

    roproProfileValueInflightByUserId[cacheUserId] = (async function() {
        var brokerResult = await fetchCachedProfileValueFromRoPro(cacheUserId);
        if (brokerResult != null) {
            await setCachedProfileValue(cacheUserId, brokerResult);
            return brokerResult;
        }
        var computedResult = await computeProfileValue(cacheUserId);
        if (computedResult == null) {
            return {
                value: "Unavailable"
            };
        }
        await setCachedProfileValue(cacheUserId, computedResult);
        return computedResult;
    })();

    try {
        return await roproProfileValueInflightByUserId[cacheUserId];
    } finally {
        delete roproProfileValueInflightByUserId[cacheUserId];
    }
}

function fetchTrades(tradesType, limit) {
    return new Promise((resolve) => {
        fetch(
                "https://trades.roblox.com/v1/trades/" +
                tradesType +
                "?cursor=&limit=" +
                limit +
                "&sortOrder=Desc", {
                    credentials: "include"
                }
            )
            .then((response) => response.json())
            .then(async (data) => {
                resolve(data);
            });
    });
}

function fetchTradesCursor(tradesType, limit, cursor) {
    return new Promise((resolve) => {
        fetch(
                "https://trades.roblox.com/v1/trades/" +
                tradesType +
                "?cursor=" +
                cursor +
                "&limit=" +
                limit +
                "&sortOrder=Desc", {
                    credentials: "include"
                }
            )
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            });
    });
}

function normalizeTradeDetailUser(user) {
    if (!user || typeof user !== "object") {
        return null;
    }
    var userId = parseInt(user.id);
    if (!Number.isFinite(userId) || userId <= 0) {
        return null;
    }
    return {
        id: userId,
        name: typeof user.name === "string" ? user.name : "",
        displayName: typeof user.displayName === "string" ? user.displayName : "",
    };
}

function normalizeTradeDetailInstanceId(value) {
    if (typeof value === "number") {
        var numericValue = parseInt(value);
        if (Number.isFinite(numericValue) && numericValue > 0) {
            return String(numericValue);
        }
        return null;
    }
    if (typeof value !== "string") {
        return null;
    }
    var trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
        var parsedNumeric = parseInt(trimmed);
        if (Number.isFinite(parsedNumeric) && parsedNumeric > 0) {
            return String(parsedNumeric);
        }
        return null;
    }
    if (isUuidLike(trimmed)) {
        return trimmed.toLowerCase();
    }
    return null;
}

function normalizeTradeDetailAssetId(item) {
    if (!item || typeof item !== "object") {
        return null;
    }
    var rawAssetId =
        (item.itemTarget && item.itemTarget.targetId) ??
        item.assetId ??
        null;
    var assetId = parseInt(rawAssetId);
    if (!Number.isFinite(assetId) || assetId <= 0) {
        return null;
    }
    return assetId;
}

function normalizeTradeDetailItem(item) {
    if (!item || typeof item !== "object") {
        return null;
    }
    var normalizedInstanceId = normalizeTradeDetailInstanceId(
        item.collectibleItemInstanceId ?? item.userAssetId
    );
    if (normalizedInstanceId == null) {
        return null;
    }
    var assetId = normalizeTradeDetailAssetId(item);
    if (assetId == null) {
        return null;
    }
    var itemName = item.itemName ?? item.name ?? "";
    if (typeof itemName !== "string" || itemName.trim().length === 0) {
        itemName = "Item #" + String(assetId);
    }
    var recentAveragePrice = parseInt(item.recentAveragePrice ?? item.rap ?? 0);
    if (!Number.isFinite(recentAveragePrice) || recentAveragePrice < 0) {
        recentAveragePrice = 0;
    }
    var serialNumber = parseInt(item.serialNumber);
    if (!Number.isFinite(serialNumber)) {
        serialNumber = null;
    }
    var assetStock = parseInt(item.assetStock);
    if (!Number.isFinite(assetStock) || assetStock < 0) {
        assetStock = null;
    }
    return {
        id: normalizedInstanceId,
        userAssetId: normalizedInstanceId,
        collectibleItemInstanceId: normalizedInstanceId,
        assetId: assetId,
        itemTarget: {
            itemType: "Asset",
            targetId: String(assetId)
        },
        name: itemName,
        itemName: itemName,
        recentAveragePrice: recentAveragePrice,
        serialNumber: serialNumber,
        originalPrice: Number.isFinite(parseInt(item.originalPrice)) && parseInt(item.originalPrice) >= 0 ?
            parseInt(item.originalPrice) :
            null,
        assetStock: assetStock,
        isOnHold: item.isOnHold === true,
    };
}

function normalizeTradeDetailOffer(offer) {
    if (!offer || typeof offer !== "object") {
        return null;
    }
    var user = normalizeTradeDetailUser(offer.user);
    if (user == null) {
        return null;
    }
    var items = Array.isArray(offer.items) ? offer.items : [];
    var userAssets = [];
    for (var i = 0; i < items.length; i++) {
        var normalizedItem = normalizeTradeDetailItem(items[i]);
        if (normalizedItem != null) {
            userAssets.push(normalizedItem);
        }
    }
    var robux = parseInt(offer.robux);
    if (!Number.isFinite(robux) || robux < 0) {
        robux = 0;
    }
    return {
        user: user,
        robux: robux,
        userAssets: userAssets,
    };
}

function normalizeTradeDetailV2(payload, myUserId) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var tradeId = parseInt(payload.tradeId ?? payload.id);
    if (!Number.isFinite(tradeId) || tradeId <= 0) {
        return null;
    }
    var offerA = normalizeTradeDetailOffer(payload.participantAOffer);
    var offerB = normalizeTradeDetailOffer(payload.participantBOffer);
    if (offerA == null || offerB == null) {
        return null;
    }
    var counterpartUser = offerA.user;
    var normalizedMyUserId = parseInt(myUserId);
    if (Number.isFinite(normalizedMyUserId) && normalizedMyUserId > 0) {
        if (offerA.user.id === normalizedMyUserId) {
            counterpartUser = offerB.user;
        } else if (offerB.user.id === normalizedMyUserId) {
            counterpartUser = offerA.user;
        }
    }
    return {
        id: tradeId,
        tradeId: tradeId,
        status: typeof payload.status === "string" ? payload.status : "",
        created: payload.created ?? null,
        expiration: payload.expiration ?? null,
        user: counterpartUser,
        offers: [offerA, offerB],
    };
}

var authenticatedUserIdCache = {
    userId: null,
    expiresAt: 0,
    promise: null,
};

function normalizePositiveUserId(value) {
    var parsed = parseInt(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

async function getCurrentAuthenticatedUserId() {
    var now = Date.now();
    if (
        authenticatedUserIdCache.userId != null &&
        now < authenticatedUserIdCache.expiresAt
    ) {
        return authenticatedUserIdCache.userId;
    }
    if (authenticatedUserIdCache.promise != null) {
        return await authenticatedUserIdCache.promise;
    }
    authenticatedUserIdCache.promise = (async function() {
        var storedUserId = normalizePositiveUserId(await getStorage("rpUserID"));
        var fetchedUserId = null;
        try {
            var response = await fetch("https://users.roblox.com/v1/users/authenticated", {
                credentials: "include",
            });
            if (response.ok) {
                var data = await response.json();
                fetchedUserId = normalizePositiveUserId(data && data.id);
            }
        } catch (e) {}

        var resolvedUserId = fetchedUserId != null ? fetchedUserId : storedUserId;
        if (fetchedUserId != null && fetchedUserId !== storedUserId) {
            await setStorage("rpUserID", fetchedUserId);
        }
        authenticatedUserIdCache.userId = resolvedUserId;
        authenticatedUserIdCache.expiresAt =
            Date.now() + (resolvedUserId == null ? 5000 : 30000);
        return resolvedUserId;
    })();
    try {
        return await authenticatedUserIdCache.promise;
    } finally {
        authenticatedUserIdCache.promise = null;
    }
}

var ROPRO_ROBLOX_PREMIUM_MEMBERSHIP_CACHE_KEY = "rpRobloxPremiumMembershipState";
var ROPRO_ROBLOX_PREMIUM_MEMBERSHIP_TTL_MS = 30 * 60 * 1000;
var roproRobloxPremiumMembershipCache = {
    hydrated: false,
    userId: null,
    hasPremium: null,
    fetchedAt: 0,
    promise: null,
    promiseUserId: null,
};

function normalizeRobloxPremiumMembershipResponse(payload) {
    if (payload === true || payload === false) {
        return payload;
    }
    if (typeof payload === "string") {
        var normalizedString = stripTags(payload).trim().toLowerCase();
        if (normalizedString === "true") {
            return true;
        }
        if (normalizedString === "false") {
            return false;
        }
        return null;
    }
    if (payload != null && typeof payload === "object" && !Array.isArray(payload)) {
        var candidateKeys = [
            "isPremium",
            "isPremiumMember",
            "isPremiumMembership",
            "isValidMembership",
            "isMembershipValid",
            "membershipValid",
            "hasPremium",
        ];
        for (var keyIndex = 0; keyIndex < candidateKeys.length; keyIndex++) {
            var key = candidateKeys[keyIndex];
            if (!Object.prototype.hasOwnProperty.call(payload, key)) {
                continue;
            }
            var normalizedBoolean = normalizeRoProBoolean(payload[key]);
            if (normalizedBoolean != null) {
                return normalizedBoolean;
            }
        }
    }
    return null;
}

function normalizeRobloxPremiumMembershipCacheEntry(rawEntry) {
    if (rawEntry == null || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
        return null;
    }
    var normalizedUserId = normalizePositiveUserId(rawEntry.userId);
    var normalizedHasPremium =
        rawEntry.hasPremium === true || rawEntry.hasPremium === false ?
        rawEntry.hasPremium :
        null;
    var normalizedFetchedAt = Number.isFinite(rawEntry.fetchedAt) ?
        rawEntry.fetchedAt :
        parseInt(rawEntry.fetchedAt, 10);
    if (
        normalizedUserId == null ||
        normalizedHasPremium == null ||
        !Number.isFinite(normalizedFetchedAt) ||
        normalizedFetchedAt <= 0
    ) {
        return null;
    }
    return {
        userId: String(normalizedUserId),
        hasPremium: normalizedHasPremium,
        fetchedAt: Math.floor(normalizedFetchedAt),
    };
}

async function hydrateRobloxPremiumMembershipCache() {
    if (roproRobloxPremiumMembershipCache.hydrated === true) {
        return;
    }
    roproRobloxPremiumMembershipCache.hydrated = true;
    var rawCacheEntry = await getLocalStorage(ROPRO_ROBLOX_PREMIUM_MEMBERSHIP_CACHE_KEY);
    var normalizedEntry = normalizeRobloxPremiumMembershipCacheEntry(rawCacheEntry);
    if (normalizedEntry == null) {
        return;
    }
    roproRobloxPremiumMembershipCache.userId = normalizedEntry.userId;
    roproRobloxPremiumMembershipCache.hasPremium = normalizedEntry.hasPremium;
    roproRobloxPremiumMembershipCache.fetchedAt = normalizedEntry.fetchedAt;
}

async function persistRobloxPremiumMembershipCache() {
    await setLocalStorage(ROPRO_ROBLOX_PREMIUM_MEMBERSHIP_CACHE_KEY, {
        userId: roproRobloxPremiumMembershipCache.userId,
        hasPremium: roproRobloxPremiumMembershipCache.hasPremium,
        fetchedAt: roproRobloxPremiumMembershipCache.fetchedAt,
    });
}

function hasFreshRobloxPremiumMembershipCache(userId, now) {
    return (
        typeof userId === "string" &&
        userId.length > 0 &&
        roproRobloxPremiumMembershipCache.userId === userId &&
        (roproRobloxPremiumMembershipCache.hasPremium === true ||
            roproRobloxPremiumMembershipCache.hasPremium === false) &&
        Number.isFinite(roproRobloxPremiumMembershipCache.fetchedAt) &&
        now <
        roproRobloxPremiumMembershipCache.fetchedAt +
        ROPRO_ROBLOX_PREMIUM_MEMBERSHIP_TTL_MS
    );
}

async function fetchRobloxPremiumMembershipFromApi(userId) {
    try {
        var response = await fetch(
            "https://premiumfeatures.roblox.com/v1/users/" + userId + "/validate-membership", {
                credentials: "include",
            }
        );
        if (!response.ok) {
            if (response.status === 401 || response.status === 403 || response.status === 404) {
                return {
                    resolved: true,
                    hasPremium: false
                };
            }
            return {
                resolved: false,
                hasPremium: null
            };
        }
        var text = "";
        try {
            text = await response.text();
        } catch (e) {}
        var parsedResponse = text;
        if (typeof text === "string" && text.trim().length > 0) {
            try {
                parsedResponse = JSON.parse(text);
            } catch (e) {}
        }
        var normalizedMembership = normalizeRobloxPremiumMembershipResponse(parsedResponse);
        if (normalizedMembership == null) {
            return {
                resolved: false,
                hasPremium: null
            };
        }
        return {
            resolved: true,
            hasPremium: normalizedMembership
        };
    } catch (e) {
        return {
            resolved: false,
            hasPremium: null
        };
    }
}

async function getRobloxPremiumMembershipStatus() {
    await hydrateRobloxPremiumMembershipCache();
    var authenticatedUserId = normalizePositiveUserId(await getCurrentAuthenticatedUserId());
    if (authenticatedUserId == null) {
        return {
            hasPremium: false,
            source: "no_user",
            fresh: true,
        };
    }
    var normalizedUserId = String(authenticatedUserId);
    var now = Date.now();
    if (hasFreshRobloxPremiumMembershipCache(normalizedUserId, now)) {
        return {
            hasPremium: roproRobloxPremiumMembershipCache.hasPremium === true,
            source: "cache",
            fresh: true,
        };
    }

    if (
        roproRobloxPremiumMembershipCache.promise != null &&
        roproRobloxPremiumMembershipCache.promiseUserId === normalizedUserId
    ) {
        return await roproRobloxPremiumMembershipCache.promise;
    }
    roproRobloxPremiumMembershipCache.promiseUserId = normalizedUserId;
    var requestPromise = (async function() {
        var refreshedMembership = await fetchRobloxPremiumMembershipFromApi(normalizedUserId);
        if (refreshedMembership.resolved === true) {
            if (roproRobloxPremiumMembershipCache.promiseUserId === normalizedUserId) {
                roproRobloxPremiumMembershipCache.userId = normalizedUserId;
                roproRobloxPremiumMembershipCache.hasPremium = refreshedMembership.hasPremium === true;
                roproRobloxPremiumMembershipCache.fetchedAt = Date.now();
                await persistRobloxPremiumMembershipCache();
            }
            return {
                hasPremium: refreshedMembership.hasPremium === true,
                source: "network",
                fresh: true,
            };
        }
        return {
            hasPremium: false,
            source: "network_error",
            fresh: false,
        };
    })();
    roproRobloxPremiumMembershipCache.promise = requestPromise;
    try {
        return await requestPromise;
    } finally {
        if (roproRobloxPremiumMembershipCache.promise === requestPromise) {
            roproRobloxPremiumMembershipCache.promise = null;
            roproRobloxPremiumMembershipCache.promiseUserId = null;
        }
    }
}

async function requestTradeDetailV2(tradeId, myUserId) {
    try {
        var response = await fetch("https://trades.roblox.com/v2/trades/" + tradeId, {
            credentials: "include"
        });
        if (!response.ok) {
            return {
                ok: false,
                status: response.status
            };
        }
        var payload = await response.json();
        var normalizedTrade = normalizeTradeDetailV2(payload, myUserId);
        if (normalizedTrade == null) {
            return {
                ok: false,
                status: 500
            };
        }
        return {
            ok: true,
            trade: normalizedTrade
        };
    } catch (e) {
        return {
            ok: false,
            status: 500
        };
    }
}

function fetchTrade(tradeId) {
    return new Promise((resolve) => {
        async function doFetchTrade() {
            var myUserId = await getCurrentAuthenticatedUserId();
            var result = await requestTradeDetailV2(tradeId, myUserId);
            if (result.ok) {
                resolve(result.trade);
            } else {
                resolve({});
            }
        }
        doFetchTrade();
    });
}

function fetchValues(trades) {
    return new Promise((resolve) => {
        executeRoProApiOperation("ropro_trade_protection_backend", {
            trades: trades,
        }).then((data) => {
            resolve(data === "ERROR" ? {} : data);
        });
    });
}

function fetchItemValues(items) {
    return new Promise((resolve) => {
        executeRoProApiOperation("ropro_item_info_backend", {
            items: items,
        }).then((data) => {
            resolve(data === "ERROR" ? {} : data);
        });
    });
}

function fetchPlayerThumbnails(userIds) {
    return new Promise((resolve) => {
        fetch(
                "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                userIds.join() +
                "&size=420x420&format=Png&isCircular=false"
            )
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            });
    });
}

function cancelTrade(id, token) {
    return new Promise((resolve) => {
        try {
            fetch("https://trades.roblox.com/v1/trades/" + id + "/decline", {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": token
                    },
                    credentials: "include",
                })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        } catch (e) {
            resolve("");
        }
    });
}

function addCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

function parseRoProRestrictSettingsFromHomeHtml(data) {
    if (typeof data !== "string" || data.length === 0) {
        return null;
    }
    return !(
        data.includes("data-isunder13=false") ||
        data.includes('data-isunder13="false"') ||
        data.includes("data-isunder13='false'")
    );
}

function normalizeRoProAgeBracketValue(value) {
    if (value == null) {
        return null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.floor(value);
    }
    if (typeof value === "string") {
        var normalized = stripTags(value).trim();
        if (normalized.length === 0) {
            return null;
        }
        if (/^-?\d+$/.test(normalized)) {
            return parseInt(normalized, 10);
        }
        return normalized.toLowerCase();
    }
    return null;
}

function isRoProAgeBracketUnder13(ageBracket) {
    if (ageBracket == null) {
        return null;
    }
    if (typeof ageBracket === "number") {
        if (!Number.isFinite(ageBracket) || ageBracket < 0) {
            return null;
        }
        // Roblox currently returns ageBracket=0 for known 21+ users.
        if (ageBracket === 1) {
            return true;
        }
        return false;
    }
    if (typeof ageBracket === "string") {
        if (ageBracket.includes("under")) {
            return true;
        }
        if (
            ageBracket.includes("13") ||
            ageBracket.includes("17") ||
            ageBracket.includes("18") ||
            ageBracket.includes("over")
        ) {
            return false;
        }
    }
    return null;
}

async function fetchRoProAuthenticatedAgeBracket() {
    try {
        var response = await fetch("https://users.roblox.com/v1/users/authenticated/age-bracket", {
            credentials: "include",
        });
        if (!response.ok) {
            return null;
        }
        var payload = await response.json();
        var rawAgeBracket = payload;
        if (payload != null && typeof payload === "object" && payload.hasOwnProperty("ageBracket")) {
            rawAgeBracket = payload.ageBracket;
        }
        var ageBracket = normalizeRoProAgeBracketValue(rawAgeBracket);
        var isUnder13 = isRoProAgeBracketUnder13(ageBracket);
        if (isUnder13 == null && payload != null && typeof payload === "object") {
            if (typeof payload.isUnder13 === "boolean") {
                isUnder13 = payload.isUnder13;
            }
        }
        if (isUnder13 == null) {
            return null;
        }
        return {
            ageBracket: ageBracket,
            isUnder13: isUnder13 === true,
        };
    } catch (e) {
        return null;
    }
}

function normalizeRoProVerifiedAge(value) {
    var verifiedAge = normalizeRoProInteger(value, {
        min: 0,
        max: 150
    });
    if (verifiedAge == null) {
        return null;
    }
    return verifiedAge;
}

async function fetchRoProVerifiedAgeStatus() {
    try {
        var response = await fetch(
            "https://apis.roblox.com/age-verification-service/v1/age-verification/verified-age", {
                credentials: "include"
            }
        );
        if (!response.ok) {
            return null;
        }
        var payload = await response.json();
        if (payload == null || typeof payload !== "object") {
            return null;
        }
        var isVerified = payload.isVerified === true;
        var verifiedAge = normalizeRoProVerifiedAge(payload.verifiedAge);
        var isSeventeenPlus = payload.isSeventeenPlus === true;
        return {
            isVerified: isVerified,
            verifiedAge: verifiedAge,
            isSeventeenPlus: isSeventeenPlus,
        };
    } catch (e) {
        return null;
    }
}

async function fetchRoProAgeGroupStatus() {
    try {
        var response = await fetch(
            "https://apis.roblox.com/user-settings-api/v1/account-insights/age-group", {
                credentials: "include"
            }
        );
        if (!response.ok) {
            return null;
        }
        var payload = await response.json();
        if (payload == null || typeof payload !== "object") {
            return null;
        }
        var isChecked = null;
        if (payload.isChecked === true || payload.isChecked === false) {
            isChecked = payload.isChecked;
        }
        var ageGroupTranslationKey =
            typeof payload.ageGroupTranslationKey === "string" ?
            payload.ageGroupTranslationKey :
            null;
        return {
            isChecked: isChecked,
            ageGroupTranslationKey: ageGroupTranslationKey,
        };
    } catch (e) {
        return null;
    }
}

async function refreshRoProDiscordVerified13PlusStatus() {
    var verifiedAgeInfo = await fetchRoProVerifiedAgeStatus();
    var ageGroupInfo = await fetchRoProAgeGroupStatus();
    if (verifiedAgeInfo == null && ageGroupInfo == null) {
        return null;
    }
    var isVerified13Plus =
        verifiedAgeInfo != null &&
        verifiedAgeInfo.isVerified === true &&
        typeof verifiedAgeInfo.verifiedAge === "number" &&
        verifiedAgeInfo.verifiedAge >= 13;
    if (ageGroupInfo != null && ageGroupInfo.isChecked === false) {
        isVerified13Plus = false;
    }
    await setStorage("discordVerified13Plus", isVerified13Plus === true);
    if (verifiedAgeInfo != null && verifiedAgeInfo.verifiedAge != null) {
        await setStorage("discordVerifiedAge", verifiedAgeInfo.verifiedAge);
    }
    if (ageGroupInfo != null && ageGroupInfo.isChecked != null) {
        await setStorage("discordAgeGroupChecked", ageGroupInfo.isChecked === true);
    }
    return {
        isVerified13Plus: isVerified13Plus === true,
        verifiedAgeInfo: verifiedAgeInfo,
        ageGroupInfo: ageGroupInfo,
    };
}

async function refreshRoProRestrictSettings(homeHtmlSnapshot) {
    var ageBracketInfo = await fetchRoProAuthenticatedAgeBracket();
    if (ageBracketInfo != null) {
        await setStorage("restrictSettings", ageBracketInfo.isUnder13 === true);
        return ageBracketInfo;
    }
    var fallbackRestrictSettings = parseRoProRestrictSettingsFromHomeHtml(homeHtmlSnapshot);
    if (typeof fallbackRestrictSettings === "boolean") {
        await setStorage("restrictSettings", fallbackRestrictSettings);
        return {
            ageBracket: null,
            isUnder13: fallbackRestrictSettings,
        };
    }
    return null;
}

var myToken = null;

function loadToken() {
    return new Promise((resolve) => {
        async function handleTokenResponse(token, homeHtmlSnapshot) {
            myToken = token;
            await setLocalStorage("token", token);
            var restrictSettings = parseRoProRestrictSettingsFromHomeHtml(homeHtmlSnapshot);
            if (typeof restrictSettings === "boolean") {
                chrome.storage.sync.set({
                    restrictSettings: restrictSettings
                });
            }
            refreshRoProRestrictSettings(homeHtmlSnapshot).catch(function() {});
            refreshRoProDiscordVerified13PlusStatus().catch(function() {});
            resolve(token);
        }

        try {
            fetch("https://roblox.com/home")
                .then((response) => response.text())
                .then((data) => {
                    var token = data
                        .split("data-token=")[1]
                        .split(">")[0]
                        .replace('"', "")
                        .replace('"', "")
                        .split(" ")[0];
                    handleTokenResponse(token, data);
                })
                .catch(function() {
                    fetch("https://roblox.com")
                        .then((response) => response.text())
                        .then((data) => {
                            var token = data
                                .split("data-token=")[1]
                                .split(">")[0]
                                .replace('"', "")
                                .replace('"', "")
                                .split(" ")[0];
                            handleTokenResponse(token, data);
                        })
                        .catch(function() {
                            fetch("https://www.roblox.com/home")
                                .then((response) => response.text())
                                .then((data) => {
                                    var token = data
                                        .split("data-token=")[1]
                                        .split(">")[0]
                                        .replace('"', "")
                                        .replace('"', "")
                                        .split(" ")[0];
                                    handleTokenResponse(token, data);
                                })
                                .catch(function() {
                                    fetch("https://web.roblox.com/home")
                                        .then((response) => response.text())
                                        .then((data) => {
                                            var token = data
                                                .split("data-token=")[1]
                                                .split(">")[0]
                                                .replace('"', "")
                                                .replace('"', "")
                                                .split(" ")[0];
                                            handleTokenResponse(token, data);
                                        });
                                });
                        });
                });
        } catch (e) {
            console.warn("Token fetch failed. Using backup token fetch.");
            fetch("https://catalog.roblox.com/v1/catalog/items/details")
                .then((response) => response.headers.get("x-csrf-token"))
                .then((token) => {
                    handleTokenResponse(token, null);
                });
        }
    });
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

async function handleAlert() {
    var timestamp = new Date().getTime();
    requestRoProApiOperationResponse("ropro_handle_alert", {
        timestamp: timestamp,
    }).then(async (response) => {
        if (response == null || !response.ok) {
            return;
        }
        var data = JSON.parse(atob(await response.text()));
        if (data.alert == true) {
            var validationHash =
                "d6ed8dd6938b1d02ef2b0178500cd808ed226437f6c23f1779bf1ae729ed6804";
            var validation = response.headers.get(
                "validation" + (await sha256(timestamp % 1024)).split("a")[0]
            );
            if ((await sha256(validation)) == validationHash) {
                var alreadyAlerted = await getLocalStorage("alreadyAlerted");
                var alertPayload = JSON.stringify({
                    message: stripTags(typeof data.message == "string" ? data.message : ""),
                    link: stripTags(typeof data.link == "string" ? data.link : ""),
                    linkText: stripTags(typeof data.linktext == "string" ? data.linktext : ""),
                });
                if (alreadyAlerted != alertPayload) {
                    setLocalStorage("rpAlert", alertPayload);
                }
            } else {
                setLocalStorage("rpAlert", "");
            }
        } else {
            setLocalStorage("rpAlert", "");
        }
    });
}

async function validateUser() {
    var response = await fetch("https://users.roblox.com/v1/users/authenticated", {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to validate user");
    }
    var data = await response.json();
    var userID = data.id;
    var ageBracketInfo = await fetchRoProAuthenticatedAgeBracket();
    var verifiedAgeStatus = await refreshRoProDiscordVerified13PlusStatus();
    if (ageBracketInfo != null) {
        await setStorage("restrictSettings", ageBracketInfo.isUnder13 === true);
    }
    var validationPayload = {
        userId: data.id,
        username: data.name,
    };
    if (ageBracketInfo != null) {
        if (ageBracketInfo.ageBracket != null) {
            validationPayload.ageBracket = ageBracketInfo.ageBracket;
        }
        validationPayload.isUnder13 = ageBracketInfo.isUnder13 === true;
    }
    if (verifiedAgeStatus != null && verifiedAgeStatus.verifiedAgeInfo != null) {
        validationPayload.ageVerified = verifiedAgeStatus.verifiedAgeInfo.isVerified === true;
        if (typeof verifiedAgeStatus.verifiedAgeInfo.verifiedAge === "number") {
            validationPayload.verifiedAge = verifiedAgeStatus.verifiedAgeInfo.verifiedAge;
        }
    }
    if (verifiedAgeStatus != null && verifiedAgeStatus.ageGroupInfo != null) {
        if (
            verifiedAgeStatus.ageGroupInfo.isChecked === true ||
            verifiedAgeStatus.ageGroupInfo.isChecked === false
        ) {
            validationPayload.ageChecked = verifiedAgeStatus.ageGroupInfo.isChecked;
        }
    }
    var validationData = await executeRoProApiOperation(
        "ropro_validate_user",
        validationPayload
    );
    if (validationData === "ERROR" || validationData == "err") {
        throw new Error("User validation failed.");
    }
    if (typeof validationData === "string" && validationData.includes(",")) {
        userID = parseInt(validationData.split(",")[0]);
        var username = validationData.split(",")[1].split(",")[0];
        await setStorage("rpUserID", userID);
        await setStorage("rpUsername", username);
        var existingGlobalTheme = await getStorage("globalTheme");
        if (typeof existingGlobalTheme !== "string" || existingGlobalTheme.length === 0) {
            loadGlobalTheme();
        }
    }
}

async function fetchSubscription() {
    var subscriptionResponse = await executeRoProApiOperation(
        "ropro_get_subscription_with_key", {}
    );
    if (subscriptionResponse === "ERROR") {
        throw new Error("Failed to fetch subscription.");
    }
    if (typeof subscriptionResponse !== "string") {
        return String(subscriptionResponse);
    }
    return subscriptionResponse;
}

async function getCachedSubscriptionOrDefault() {
    return "pro_tier"; // Change to what ever tier you would like.
}

var subscriptionPromise = [];

async function getSubscription() {
    return "pro_tier";
}
getSubscription();

async function getRoProLastOnlinePresencePayload() {
    var visibilitySetting = await loadSettings("lastOnlinePrivacy");
    return {
        isVisible: visibilitySetting === true,
        timezone: "local",
    };
}

async function refreshRoProLastOnlinePresence(forceSync) {
    try {
        var nextPayload = await getRoProLastOnlinePresencePayload();
        var cachedState = await getLocalStorage("rpLastOnlinePresenceState");
        var now = Date.now();
        var minIntervalMs = nextPayload.isVisible ? 5 * 60 * 1000 : 60 * 60 * 1000;
        var cachedLastSentAt =
            cachedState != null && Number.isFinite(cachedState.lastSentAt) ?
            cachedState.lastSentAt :
            0;
        var shouldSync =
            forceSync === true ||
            cachedState == null ||
            cachedState.isVisible !== nextPayload.isVisible ||
            cachedState.timezone !== nextPayload.timezone ||
            now >= cachedLastSentAt + minIntervalMs;
        if (!shouldSync) {
            return "SKIPPED";
        }
        var verificationHeaders = await getRoProVerificationHeaders();
        if (
            verificationHeaders["ropro-id"] === "none" ||
            verificationHeaders["ropro-verification"] === "none"
        ) {
            return "ERROR";
        }
        var response = await executeRoProApiOperation(
            "ropro_update_last_online_presence",
            nextPayload
        );
        if (response === "ERROR") {
            return "ERROR";
        }
        await setLocalStorage("rpLastOnlinePresenceState", {
            isVisible: nextPayload.isVisible,
            timezone: nextPayload.timezone,
            lastSentAt: now,
        });
        return response;
    } catch (e) {
        return "ERROR";
    }
}

var disabledFeatures = null;

var ROPRO_RESTRICTED_SETTINGS = new Set([
    "linkedDiscord",
    "groupDiscord",
    "featuredToys",
]);

var ROPRO_STANDARD_SETTINGS = new Set([
    "themeColorAdjustments",
    "moreMutuals",
    "animatedProfileThemes",
    "morePlaytimeSorts",
    "serverSizeSort",
    "fastestServersSort",
    "moreGameFilters",
    "moreServerFilters",
    "additionalServerInfo",
    "gameLikeRatioFilter",
    "premiumVoiceServers",
    "quickUserSearch",
    "liveLikeDislikeFavoriteCounters",
    "sandboxOutfits",
    "itemInfoCard",
    "tradePanel",
    "tradeSearch",
    "tradeValueCalculator",
    "tradeDemandRatingCalculator",
    "tradeItemValue",
    "tradeItemDemand",
    "itemPageValueDemand",
    "tradePageProjectedWarning",
    "embeddedRolimonsItemLink",
    "embeddedRolimonsUserLink",
    "tradeOffersPage",
    "winLossDisplay",
    "underOverRAP",
]);

var ROPRO_PRO_SETTINGS = new Set([
    "profileValue",
    "liveVisits",
    "livePlayers",
    "tradePreviews",
    "quickItemSearch",
    "tradeNotifier",
    "moreTradePanel",
    "singleSessionMode",
    "advancedTradeSearch",
    "tradeProtection",
    "hideTradeBots",
    "autoDeclineTradeBots",
    "suspectedBotBadges",
    "autoDecline",
    "declineThreshold",
    "cancelThreshold",
    "hideDeclinedNotifications",
    "hideOutboundNotifications",
    "tradeOffersPost",
    "tradeOffersValueCalculator",
    "tradeOffersWishlist",
]);

var ROPRO_ROBLOX_PREMIUM_REQUIRED_SETTINGS = new Set([
    "tradeOffersPage",
    "tradeOffersPost",
    "tradeOffersWishlist",
    "tradeOffersValueCalculator",
]);

var ROPRO_VISUAL_GATES = {
    trade_offers_view: {
        setting: "tradeOffersPage",
        requiredTier: "standard_tier",
        upgradeTier: "plus",
    },
    trade_offers_post: {
        setting: "tradeOffersPost",
        requiredTier: "pro_tier",
        upgradeTier: "rex",
    },
    trade_offers_wishlist_manage: {
        setting: "tradeOffersWishlist",
        requiredTier: "pro_tier",
        upgradeTier: "rex",
    },
    server_ping_visibility: {
        setting: "moreServerFilters",
        requiredTier: "standard_tier",
        upgradeTier: "plus",
    },
};

function normalizeSubscriptionTier(subscriptionLevel) {
    var normalized = stripTags(
            String(subscriptionLevel == null ? "" : subscriptionLevel)
        )
        .trim()
        .toLowerCase();
    if (normalized === "free" || normalized === "free_tier") {
        return "free_tier";
    }
    if (
        normalized === "plus" ||
        normalized === "standard" ||
        normalized === "standard_tier"
    ) {
        return "standard_tier";
    }
    if (
        normalized === "rex" ||
        normalized === "pro_tier" ||
        normalized === "ultra_tier" ||
        normalized === "ultra"
    ) {
        return "pro_tier";
    }
    return "unknown";
}

function getSubscriptionTierRank(subscriptionTier) {
    if (subscriptionTier === "free_tier") {
        return 0;
    }
    if (subscriptionTier === "standard_tier") {
        return 1;
    }
    if (subscriptionTier === "pro_tier") {
        return 2;
    }
    return -1;
}

function normalizeVisualGateKey(gateKey) {
    var normalized = stripTags(String(gateKey == null ? "" : gateKey)).trim();
    if (normalized.length === 0) {
        return "";
    }
    if (!/^[A-Za-z0-9_.-]{1,120}$/.test(normalized)) {
        return "";
    }
    return normalized;
}

function getSettingRequiredTier(setting) {
    if (!Object.prototype.hasOwnProperty.call(defaultSettings, setting)) {
        return null;
    }
    if (ROPRO_PRO_SETTINGS.has(setting)) {
        return "pro_tier";
    }
    if (ROPRO_STANDARD_SETTINGS.has(setting)) {
        return "standard_tier";
    }
    return "free_tier";
}

function normalizeVisualGateRequiredTier(tierName) {
    var normalizedTier = normalizeSubscriptionTier(tierName);
    if (normalizedTier === "unknown") {
        return null;
    }
    return normalizedTier;
}

function getUpgradeTierFromRequiredTier(requiredTier) {
    if (requiredTier === "pro_tier") {
        return "rex";
    }
    if (requiredTier === "standard_tier") {
        return "plus";
    }
    return null;
}

function buildVisualGateConfig(gateKey) {
    var normalizedRequestKey = normalizeVisualGateKey(gateKey);
    if (normalizedRequestKey.length === 0) {
        return null;
    }
    var canonicalGateKey = normalizedRequestKey.toLowerCase();
    var gateConfig =
        Object.prototype.hasOwnProperty.call(ROPRO_VISUAL_GATES, canonicalGateKey) ?
        ROPRO_VISUAL_GATES[canonicalGateKey] :
        null;

    var setting = null;
    var requiredTier = null;
    var upgradeTier = null;

    if (gateConfig != null) {
        if (typeof gateConfig.setting === "string" && gateConfig.setting.length > 0) {
            setting = gateConfig.setting;
        }
        requiredTier = normalizeVisualGateRequiredTier(gateConfig.requiredTier);
        if (typeof gateConfig.upgradeTier === "string" && gateConfig.upgradeTier.length > 0) {
            upgradeTier = gateConfig.upgradeTier;
        }
    } else if (Object.prototype.hasOwnProperty.call(defaultSettings, normalizedRequestKey)) {
        setting = normalizedRequestKey;
    } else {
        return null;
    }

    if (requiredTier == null && setting != null) {
        requiredTier = getSettingRequiredTier(setting);
    }
    if (requiredTier == null) {
        requiredTier = "free_tier";
    }
    if (setting != null) {
        var settingRequiredTier = getSettingRequiredTier(setting);
        if (
            settingRequiredTier != null &&
            getSubscriptionTierRank(requiredTier) < getSubscriptionTierRank(settingRequiredTier)
        ) {
            requiredTier = settingRequiredTier;
        }
    }
    if (upgradeTier == null) {
        upgradeTier = getUpgradeTierFromRequiredTier(requiredTier);
    }

    return {
        key: gateConfig == null ? normalizedRequestKey : canonicalGateKey,
        requestKey: normalizedRequestKey,
        setting: setting,
        requiredTier: requiredTier,
        upgradeTier: upgradeTier,
    };
}

async function getRawSettingValue(setting) {
    var settings = await getStorage("rpSettings");
    if (typeof settings === "undefined") {
        await initializeSettings();
        settings = await getStorage("rpSettings");
    }
    if (settings == null || typeof settings !== "object") {
        return undefined;
    }
    return settings[setting];
}

function normalizeBooleanSettingValue(setting, value) {
    if (typeof defaultSettings[setting] !== "boolean") {
        return value;
    }
    if (value === true || value === false) {
        return value;
    }
    if (value === 1 || value === "1") {
        return true;
    }
    if (value === 0 || value === "0") {
        return false;
    }
    if (typeof value === "string") {
        var normalizedValue = value.trim().toLowerCase();
        if (normalizedValue === "true") {
            return true;
        }
        if (normalizedValue === "false") {
            return false;
        }
    }
    return defaultSettings[setting];
}

async function loadVisualGateState(gateKey) {
    var gate = buildVisualGateConfig(gateKey);
    if (gate == null) {
        return {
            key: normalizeVisualGateKey(gateKey),
            requestKey: normalizeVisualGateKey(gateKey),
            allowed: false,
            reason: "unknown_gate",
            setting: null,
            settingEnabled: null,
            settingValid: false,
            disabledByMaintenance: false,
            settingInvalidReason: null,
            blockedByRobloxPremium: false,
            currentTier: "unknown",
            requiredTier: null,
            upgradeTier: null,
        };
    }

    var currentTier = normalizeSubscriptionTier(await getSubscription());
    var currentTierRank = getSubscriptionTierRank(currentTier);
    var requiredTierRank = getSubscriptionTierRank(gate.requiredTier);
    var tierAllowed = requiredTierRank <= currentTierRank && currentTierRank >= 0;

    var settingEnabled = true;
    var settingValid = true;
    var disabledByMaintenance = false;
    var settingInvalidReason = null;
    var blockedByRobloxPremium = false;
    if (gate.setting != null) {
        var validityInfo = await loadSettingValidityInfo(gate.setting);
        settingValid =
            Array.isArray(validityInfo) &&
            validityInfo.length > 0 &&
            validityInfo[0] === true;
        disabledByMaintenance =
            Array.isArray(validityInfo) &&
            validityInfo.length > 1 &&
            validityInfo[1] === true;
        settingInvalidReason =
            Array.isArray(validityInfo) &&
            validityInfo.length > 2 &&
            typeof validityInfo[2] === "string" &&
            validityInfo[2].length > 0 ?
            validityInfo[2] :
            null;
        blockedByRobloxPremium = settingInvalidReason === "roblox_premium_required";

        if (typeof defaultSettings[gate.setting] === "boolean") {
            settingEnabled =
                normalizeBooleanSettingValue(gate.setting, await getRawSettingValue(gate.setting)) === true;
        }
    }

    var allowed = settingEnabled && settingValid && tierAllowed;
    var reason = "allowed";
    if (!allowed) {
        if (disabledByMaintenance) {
            reason = "disabled_feature";
        } else if (!settingEnabled) {
            reason = "setting_off";
        } else if (currentTier === "unknown") {
            reason = "subscription_unknown";
        } else if (!tierAllowed) {
            reason = "tier";
        } else if (!settingValid) {
            reason = "policy";
        } else {
            reason = "blocked";
        }
    }

    return {
        key: gate.key,
        requestKey: gate.requestKey,
        allowed: allowed,
        reason: reason,
        setting: gate.setting,
        settingEnabled: settingEnabled,
        settingValid: settingValid,
        disabledByMaintenance: disabledByMaintenance,
        settingInvalidReason: settingInvalidReason,
        blockedByRobloxPremium: blockedByRobloxPremium,
        currentTier: currentTier,
        requiredTier: gate.requiredTier,
        upgradeTier: gate.upgradeTier,
    };
}

async function loadVisualGateStates(gateKeys) {
    var keys = Array.isArray(gateKeys) ? gateKeys : [];
    var response = {};
    for (var i = 0; i < keys.length; i++) {
        var normalizedKey = normalizeVisualGateKey(keys[i]);
        if (normalizedKey.length === 0) {
            continue;
        }
        response[normalizedKey] = await loadVisualGateState(normalizedKey);
    }
    return response;
}

function tierCanUseSetting(setting, normalizedSubscriptionTier) {
    return true;
}

async function loadSettingValidityDetail(setting) {
    var restrictSettings = await getStorage("restrictSettings");
    if (typeof restrictSettings !== "boolean") {
        var refreshedRestriction = await refreshRoProRestrictSettings(null);
        if (refreshedRestriction != null) {
            restrictSettings = refreshedRestriction.isUnder13 === true;
        }
    }
    if (typeof restrictSettings !== "boolean") {
        restrictSettings = true;
    }
    var subscriptionLevel = normalizeSubscriptionTier(await getSubscription());
    var valid = true;
    var reason = null;

    function setReason(nextReason) {
        if (typeof nextReason === "string" && nextReason.length > 0) {
            reason = nextReason;
        }
    }

    if (subscriptionLevel === "unknown") {
        valid = false;
        setReason("subscription_unknown");
    } else if (!tierCanUseSetting(setting, subscriptionLevel)) {
        valid = false;
        setReason("tier");
    }
    if (ROPRO_RESTRICTED_SETTINGS.has(setting) && restrictSettings) {
        valid = false;
        setReason("restricted_setting");
    }
    if (setting === "linkedDiscord") {
        var discordVerified13Plus = await getStorage("discordVerified13Plus");
        if (typeof discordVerified13Plus !== "boolean") {
            var refreshedDiscordVerification = await refreshRoProDiscordVerified13PlusStatus();
            if (refreshedDiscordVerification != null) {
                discordVerified13Plus = refreshedDiscordVerification.isVerified13Plus === true;
            }
        }
        if (typeof discordVerified13Plus === "boolean" && discordVerified13Plus !== true) {
            valid = false;
            setReason("discord_verified_13_plus_required");
        }
    }
    var hasRobloxPremium = true;
    var disabled = false;
    return {
        valid: valid === true,
        disabled: disabled,
        reason: reason,
        hasRobloxPremium: hasRobloxPremium,
    };
}

async function loadSettingValidity(setting) {
    var detail = await loadSettingValidityDetail(setting);
    return new Promise((resolve) => {
        resolve(detail.valid === true);
    });
}

async function loadSettings(setting) {
    var settings = await getStorage("rpSettings");
    if (typeof settings === "undefined") {
        await initializeSettings();
        settings = await getStorage("rpSettings");
    }
    var valid = await loadSettingValidity(setting);
    var settingValue = settings[setting];
    settingValue = normalizeBooleanSettingValue(setting, settingValue);
    if (typeof defaultSettings[setting] === "boolean") {
        settingValue = settingValue && valid;
    } else if (
        valid !== true &&
        Object.prototype.hasOwnProperty.call(defaultSettings, setting)
    ) {
        settingValue = defaultSettings[setting];
    }
    return new Promise((resolve) => {
        resolve(settingValue);
    });
}

async function loadSettingValidityInfo(setting) {
    var detail = await loadSettingValidityDetail(setting);
    return new Promise((resolve) => {
        resolve([
            detail.valid === true,
            detail.disabled === true,
            typeof detail.reason === "string" ? detail.reason : null,
            detail.hasRobloxPremium === true || detail.hasRobloxPremium === false ?
            detail.hasRobloxPremium :
            null,
        ]);
    });
}

var inbounds = [];
var inboundsCache = {};
var allPagesDone = false;

var inbounds = [];
var inboundsCache = {};
var allPagesDone = false;

function loadTrades(inboundCursor, tempArray) {
    fetch(
            "https://trades.roblox.com/v1/trades/Inbound?sortOrder=Asc&limit=100&cursor=" +
            inboundCursor, {
                credentials: "include"
            }
        )
        .then(async (response) => {
            if (response.ok) {
                var data = await response.json();
                return data;
            } else {
                throw new Error("Failed to fetch trades");
            }
        })
        .then((data) => {
            var done = false;
            for (var i = 0; i < data.data.length; i++) {
                if (!(data.data[i].id in inboundsCache)) {
                    tempArray.push(data.data[i].id);
                    inboundsCache[data.data[i].id] = null;
                } else {
                    done = true;
                    break;
                }
            }
            if (data.nextPageCursor != null && done == false) {
                loadTrades(data.nextPageCursor, tempArray);
            } else {
                inbounds = tempArray.concat(inbounds);
                allPagesDone = true;
                setTimeout(function() {
                    loadTrades("", []);
                }, 61000);
            }
        })
        .catch((error) => {
            setTimeout(function() {
                loadTrades(inboundCursor, tempArray);
            }, 61000);
        });
}

var tradesNotified = {};

function getTrades() {
    return new Promise((resolve) => {
        async function doGet(resolve) {
            var lastTradeCheck = await getLocalStorage("lastTradeCheck");
            var initialCheck = !lastTradeCheck ||
                lastTradeCheck + 1000 * 60 * 5 < new Date().getTime();
            var limit = initialCheck ? 25 : 10;
            var hideDeclinedNotifications = await loadSettings(
                "hideDeclinedNotifications"
            );
            var sectionRequests = [
                fetchTrades("inbound", limit),
                fetchTrades("outbound", limit),
                fetchTrades("completed", limit),
            ];
            if (!hideDeclinedNotifications) {
                sectionRequests.push(fetchTrades("inactive", limit));
            }
            var sections = await Promise.all(sectionRequests);
            var tradesList = await getLocalStorage("tradesList");
            if (typeof tradesList == "undefined" || initialCheck) {
                tradesList = {
                    inboundTrades: {},
                    outboundTrades: {},
                    completedTrades: {},
                    inactiveTrades: {},
                };
            }
            var storageNames = [
                "inboundTrades",
                "outboundTrades",
                "completedTrades",
                "inactiveTrades",
            ];
            var newTrades = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if ("data" in section && section.data.length > 0) {
                    var store = tradesList[storageNames[i]];
                    var tradeIds = [];
                    for (var j = 0; j < section.data.length; j++) {
                        tradeIds.push(section.data[j]["id"]);
                    }
                    for (var j = 0; j < tradeIds.length; j++) {
                        var tradeId = tradeIds[j];
                        if (!(tradeId in store)) {
                            tradesList[storageNames[i]][tradeId] = true;
                            newTrades.push({
                                [tradeId]: storageNames[i]
                            });
                        }
                    }
                }
            }
            if (newTrades.length > 0) {
                if (!initialCheck) {
                    await setLocalStorage("tradesList", tradesList);
                    if (newTrades.length < 9) {
                        notifyTrades(newTrades);
                    }
                } else {
                    await setLocalStorage("tradesList", tradesList);
                }
            }
            await setLocalStorage("lastTradeCheck", new Date().getTime());
            resolve();
        }
        doGet(resolve);
    });
}

function normalizeTradeListType(tradeType) {
    if (typeof tradeType !== "string") {
        return null;
    }
    var normalized = tradeType.trim().toLowerCase();
    if (
        normalized === "inbound" ||
        normalized === "outbound" ||
        normalized === "completed" ||
        normalized === "inactive"
    ) {
        return normalized;
    }
    return null;
}

function loadTradesType(tradeType) {
    return new Promise((resolve) => {
        var normalizedTradeType = normalizeTradeListType(tradeType);
        if (normalizedTradeType == null) {
            resolve([]);
            return;
        }

        function doLoad(tradeCursor, tempArray) {
            fetch(
                    "https://trades.roblox.com/v1/trades/" +
                    normalizedTradeType +
                    "?sortOrder=Asc&limit=100&cursor=" +
                    tradeCursor, {
                        credentials: "include"
                    }
                )
                .then(async (response) => {
                    if (response.ok) {
                        var data = await response.json();
                        return data;
                    } else {
                        throw new Error("Failed to fetch trades");
                    }
                })
                .then((data) => {
                    for (var i = 0; i < data.data.length; i++) {
                        tempArray.push([data.data[i].id, data.data[i].user.id]);
                    }
                    if (data.nextPageCursor != null) {
                        doLoad(data.nextPageCursor, tempArray);
                    } else {
                        resolve(tempArray);
                    }
                })
                .catch(function() {
                    setTimeout(function() {
                        doLoad(tradeCursor, tempArray);
                    }, 31000);
                });
        }
        doLoad("", []);
    });
}

function loadTradesData(tradeType) {
    return new Promise((resolve) => {
        var normalizedTradeType = normalizeTradeListType(tradeType);
        if (normalizedTradeType == null) {
            resolve([]);
            return;
        }

        function doLoad(tradeCursor, tempArray) {
            fetch(
                    "https://trades.roblox.com/v1/trades/" +
                    normalizedTradeType +
                    "?sortOrder=Asc&limit=100&cursor=" +
                    tradeCursor, {
                        credentials: "include"
                    }
                )
                .then(async (response) => {
                    if (response.ok) {
                        var data = await response.json();
                        return data;
                    } else {
                        throw new Error("Failed to fetch trades");
                    }
                })
                .then((data) => {
                    for (var i = 0; i < data.data.length; i++) {
                        tempArray.push(data.data[i]);
                    }
                    if (data.nextPageCursor != null) {
                        doLoad(data.nextPageCursor, tempArray);
                    } else {
                        resolve(tempArray);
                    }
                })
                .catch(function() {
                    setTimeout(function() {
                        doLoad(tradeCursor, tempArray);
                    }, 31000);
                });
        }
        doLoad("", []);
    });
}

var notifications = {};

// setLocalStorage("cachedTrades", {});

function createNotification(notificationId, options) {
    return new Promise((resolve) => {
        chrome.notifications.create(notificationId, options, function() {
            resolve();
        });
    });
}

function normalizeTradeLossValue(value) {
    var normalizedValue = parseInt(value);
    if (!Number.isFinite(normalizedValue)) {
        return null;
    }
    return normalizedValue;
}

function getTradeLossRatio(myValue, theirValue) {
    var normalizedMyValue = normalizeTradeLossValue(myValue);
    var normalizedTheirValue = normalizeTradeLossValue(theirValue);
    if (!Number.isFinite(normalizedMyValue) || !Number.isFinite(normalizedTheirValue)) {
        return null;
    }
    if (normalizedMyValue <= normalizedTheirValue) {
        return 0;
    }
    if (normalizedMyValue <= 0) {
        return null;
    }
    return ((normalizedMyValue - normalizedTheirValue) / normalizedMyValue) * 100;
}

async function notifyTrades(trades) {
    for (var i = 0; i < trades.length; i++) {
        var trade = trades[i];
        var tradeId = Object.keys(trade)[0];
        var tradeType = trade[tradeId];
        if (!(tradeId + "_" + tradeType in tradesNotified)) {
            tradesNotified[tradeId + "_" + tradeType] = true;
            var context = "";
            var buttons = [];
            switch (tradeType) {
                case "inboundTrades":
                    context = "Trade Inbound";
                    buttons = [{
                        title: "Open"
                    }, {
                        title: "Decline"
                    }];
                    break;
                case "outboundTrades":
                    context = "Trade Outbound";
                    buttons = [{
                        title: "Open"
                    }, {
                        title: "Cancel"
                    }];
                    break;
                case "completedTrades":
                    context = "Trade Completed";
                    buttons = [{
                        title: "Open"
                    }];
                    break;
                case "inactiveTrades":
                    context = "Trade Declined";
                    buttons = [{
                        title: "Open"
                    }];
                    break;
            }
            trade = await fetchTrade(tradeId);
            var valuationResponse = await fetchValues([trade]);
            var values = Array.isArray(valuationResponse) ? valuationResponse[0] : null;
            if (values == null || typeof values !== "object") {
                continue;
            }
            var myName = values["us"];
            var theirName = values["them"];
            if (
                typeof myName !== "string" ||
                myName.length === 0 ||
                typeof theirName !== "string" ||
                theirName.length === 0
            ) {
                continue;
            }
            var myValue = normalizeTradeLossValue(values[myName]);
            var theirValue = normalizeTradeLossValue(values[theirName]);
            if (!Number.isFinite(myValue)) {
                myValue = 0;
            }
            if (!Number.isFinite(theirValue)) {
                theirValue = 0;
            }
            var compare = theirValue - myValue;
            var lossRatio = getTradeLossRatio(myValue, theirValue);
            if (
                context == "Trade Inbound" &&
                (await loadSettings("autoDecline")) &&
                lossRatio != null &&
                lossRatio >= (await loadSettings("declineThreshold"))
            ) {
                cancelTrade(tradeId, await getCsrfTokenFromStorage());
            }
            if (
                context == "Trade Outbound" &&
                (await loadSettings("tradeProtection")) &&
                lossRatio != null &&
                lossRatio >= (await loadSettings("cancelThreshold"))
            ) {
                cancelTrade(tradeId, await getCsrfTokenFromStorage());
            }
            if (await loadSettings("tradeNotifier")) {
                var compareText = "Win: +";
                if (compare > 0) {
                    compareText = "Win: +";
                } else if (compare == 0) {
                    compareText = "Equal: +";
                } else if (compare < 0) {
                    compareText = "Loss: ";
                }
                var thumbnail = await fetchPlayerThumbnails([trade.user.id]);
                var options = {
                    type: "basic",
                    title: context,
                    iconUrl: thumbnail.data[0].imageUrl,
                    buttons: buttons,
                    priority: 2,
                    message: `Partner: ${theirName}\nYour Value: ${addCommas(
            myValue
          )}\nTheir Value: ${addCommas(theirValue)}`,
                    contextMessage: compareText + addCommas(compare) + " Value",
                    eventTime: Date.now(),
                };
                var notificationId = Math.floor(Math.random() * 10000000).toString();
                notifications[notificationId] = {
                    type: "trade",
                    tradeType: tradeType,
                    tradeid: tradeId,
                    buttons: buttons,
                };
                if (
                    context != "Trade Declined" ||
                    (await loadSettings("hideDeclinedNotifications")) == false
                ) {
                    await createNotification(notificationId, options);
                }
            }
        }
    }
}

const tradeNotifierCheck = async () => {
    if (
        (await loadSettings("tradeNotifier")) ||
        (await loadSettings("autoDecline")) ||
        (await loadSettings("tradeProtection"))
    ) {
        getTrades();
    }
};

async function notificationButtonClicked(notificationId, buttonIndex) {
    //Notification button clicked
    var notification = notifications[notificationId];
    if (notification["type"] == "trade") {
        if (notification["tradeType"] == "inboundTrades") {
            if (buttonIndex == 0) {
                chrome.tabs.create({
                    url: "https://www.roblox.com/trades"
                });
            } else if (buttonIndex == 1) {
                cancelTrade(notification["tradeid"], await getCsrfTokenFromStorage());
            }
        } else if (notification["tradeType"] == "outboundTrades") {
            if (buttonIndex == 0) {
                chrome.tabs.create({
                    url: "https://www.roblox.com/trades#outbound"
                });
            } else if (buttonIndex == 1) {
                cancelTrade(notification["tradeid"], await getCsrfTokenFromStorage());
            }
        } else if (notification["tradeType"] == "completedTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades#completed"
            });
        } else if (notification["tradeType"] == "inactiveTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades#inactive"
            });
        }
    }
}

function notificationClicked(notificationId) {
    var notification = notifications[notificationId];
    if (notification["type"] == "trade") {
        if (notification["tradeType"] == "inboundTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades"
            });
        } else if (notification["tradeType"] == "outboundTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades#outbound"
            });
        } else if (notification["tradeType"] == "completedTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades#completed"
            });
        } else if (notification["tradeType"] == "inactiveTrades") {
            chrome.tabs.create({
                url: "https://www.roblox.com/trades#inactive"
            });
        }
    } else if (notification["type"] == "wishlist") {
        chrome.tabs.create({
            url: "https://www.roblox.com/catalog/" +
                parseInt(notification["itemId"]) +
                "/",
        });
    }
}

chrome.notifications.onClicked.addListener(notificationClicked);

chrome.notifications.onButtonClicked.addListener(notificationButtonClicked);

async function loadGlobalTheme() {
    var myId = await getStorage("rpUserID");
    var numericMyId = normalizeRoProInteger(myId, {
        min: 1
    });
    if (numericMyId == null) {
        return;
    }
    var data = await executeRoProApiOperation("ropro_get_profile_theme", {
        userId: numericMyId,
    });
    if (data !== "ERROR" && data != null && typeof data === "object") {
        if (typeof data.theme === "string" && data.theme.length > 0) {
            await setStorage("globalTheme", data.theme);
        } else {
            await setStorage("globalTheme", "");
        }
    }
}

//RoPro's user verification system is different in RoPro v2.0, and includes support for Roblox OAuth2 authentication.
//In RoPro v1.7, we only support ingame verification via our "RoPro User Verification" experience on Roblox: https://www.roblox.com/games/16699976687/RoPro-User-Verification
function verifyUser(emoji_verification_code) {
    return new Promise((resolve) => {
        async function doVerify(resolve) {
            try {
                executeRoProApiOperation("ropro_ingame_verification", {
                        emojiVerificationCode: emoji_verification_code,
                    })
                    .then(async (data) => {
                        if (data === "ERROR" || data == null || typeof data !== "object") {
                            throw new Error("Failed to verify user");
                        }
                        var verificationToken = normalizeVerificationToken(data.token);
                        var myId = normalizeVerificationUserId(await getStorage("rpUserID"));
                        var verifiedUserId = normalizeVerificationUserId(data.userid);
                        if (verifiedUserId == null) {
                            verifiedUserId = normalizeVerificationUserId(data.userId);
                        }
                        if (verifiedUserId == null) {
                            verifiedUserId = normalizeVerificationUserId(data.UserId);
                        }
                        if (verifiedUserId == null) {
                            verifiedUserId = normalizeVerificationUserId(data.id);
                        }
                        if (verifiedUserId == null) {
                            verifiedUserId = normalizeVerificationUserId(data.user_id);
                        }
                        var verificationUserId =
                            verifiedUserId != null ? verifiedUserId : myId;
                        var verificationDict = normalizeVerificationDictionary(await getStorage("userVerification"));
                        if (verificationDict == null) {
                            verificationDict = {};
                        }
                        if (
                            verificationToken != null &&
                            verificationToken.length > 0 &&
                            verificationUserId != null
                        ) {
                            if (myId !== verificationUserId) {
                                await setStorage("rpUserID", verificationUserId);
                            }
                            verificationDict[verificationUserId] = verificationToken;
                            await setStorage("userVerification", verificationDict);
                            loadGlobalTheme();
                            resolve("success");
                        } else {
                            resolve(null);
                        }
                    })
                    .catch(function(r, e, s) {
                        resolve(null);
                    });
            } catch (e) {
                resolve(null);
            }
        }
        doVerify(resolve);
    });
}

function isRoProUrl(url) {
    return (
        typeof url === "string" &&
        (url.startsWith("https://ropro.io") ||
            url.startsWith(ROPRO_API_BASE_URL))
    );
}

function normalizeRoProString(value, maxLength, options) {
    if (value == null) {
        return null;
    }
    var normalized = stripTags(String(value));
    if (normalized.length === 0) {
        if (options != null && options.allowEmpty === true) {
            return "";
        }
        return null;
    }
    if (Number.isFinite(maxLength) && maxLength > 0) {
        return normalized.slice(0, maxLength);
    }
    return normalized;
}

function normalizeRoProInteger(value, options) {
    var parsed = parseInt(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    var opts = options || {};
    if (Number.isFinite(opts.min) && parsed < opts.min) {
        return null;
    }
    if (Number.isFinite(opts.max) && parsed > opts.max) {
        return null;
    }
    return parsed;
}

function normalizeRoProNumericCsv(value, maxItems) {
    var parts = [];
    if (Array.isArray(value)) {
        parts = value;
    } else if (typeof value === "string") {
        parts = value.split(",");
    } else if (value != null) {
        parts = [value];
    }
    var normalized = [];
    var seen = {};
    for (var i = 0; i < parts.length; i++) {
        var numeric = normalizeRoProInteger(parts[i], {
            min: 1
        });
        if (numeric == null) {
            continue;
        }
        var key = String(numeric);
        if (seen[key]) {
            continue;
        }
        seen[key] = true;
        normalized.push(key);
        if (Number.isFinite(maxItems) && normalized.length >= maxItems) {
            break;
        }
    }
    if (normalized.length === 0) {
        return null;
    }
    return normalized.join(",");
}

function normalizeRoProTradeOfferItemIdsCsv(value, maxItems) {
    var parts = [];
    if (Array.isArray(value)) {
        parts = value;
    } else if (typeof value === "string") {
        parts = value.split(",");
    } else if (value != null) {
        parts = [value];
    }
    var normalized = [];
    var seen = {};
    for (var i = 0; i < parts.length; i++) {
        var numeric = parseInt(parts[i], 10);
        if (!Number.isFinite(numeric)) {
            continue;
        }
        var isAssetId = numeric >= 1;
        var isTradeTermToken = numeric <= -2 && numeric >= -9;
        if (!isAssetId && !isTradeTermToken) {
            continue;
        }
        var key = String(numeric);
        if (seen[key]) {
            continue;
        }
        seen[key] = true;
        normalized.push(key);
        if (Number.isFinite(maxItems) && normalized.length >= maxItems) {
            break;
        }
    }
    if (normalized.length === 0) {
        return null;
    }
    return normalized.join(",");
}

function normalizeRoProOutfitThumbnail(value) {
    if (typeof value === "number" && Number.isInteger(value) && value > 0) {
        return String(value);
    }
    if (typeof value === "string" && /^\s*[1-9]\d*\s*$/.test(value)) {
        return String(parseInt(value, 10));
    }
    var normalized = normalizeRoProString(value, 2048);
    if (normalized == null) {
        return null;
    }
    try {
        var parsed = new URL(normalized);
        var protocol = parsed.protocol.toLowerCase();
        if (
            protocol === "https:" ||
            protocol === "chrome-extension:" ||
            protocol === "safari-web-extension:"
        ) {
            return parsed.toString();
        }
    } catch (e) {
        return null;
    }
    return null;
}

function normalizeRoProTradeBotReqType(value) {
    var normalized = stripTags(String(value == null ? "" : value))
        .trim()
        .toLowerCase();
    if (
        normalized === "flagged" ||
        normalized === "suspected_tiers" ||
        normalized === "bit_sus" ||
        normalized === "kinda_sus" ||
        normalized === "pretty_sus" ||
        normalized === "mad_sus"
    ) {
        return normalized;
    }
    return null;
}

function normalizeRoProFlagTraderReqType(value) {
    var normalized = stripTags(String(value == null ? "" : value))
        .trim()
        .toLowerCase();
    if (normalized === "1") {
        return "add";
    }
    if (normalized === "0") {
        return "remove";
    }
    if (normalized === "flag") {
        return "add";
    }
    if (normalized === "unflag") {
        return "remove";
    }
    if (normalized === "add" || normalized === "remove") {
        return normalized;
    }
    return null;
}

function normalizeRoProTradeLogicOp(value) {
    var normalized = stripTags(String(value == null ? "" : value))
        .trim()
        .toLowerCase();
    if (
        normalized === "loss_threshold" ||
        normalized === "projected_inbounds" ||
        normalized === "invalid_inbounds" ||
        normalized === "filter_by_item"
    ) {
        return normalized;
    }
    return null;
}

function normalizeRoProNumber(value, options) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    var opts = options || {};
    if (Number.isFinite(opts.min) && parsed < opts.min) {
        return null;
    }
    if (Number.isFinite(opts.max) && parsed > opts.max) {
        return null;
    }
    return parsed;
}

function normalizeRoProBoolean(value) {
    if (value === true || value === false) {
        return value;
    }
    if (value === 1 || value === "1") {
        return true;
    }
    if (value === 0 || value === "0") {
        return false;
    }
    if (typeof value !== "string") {
        return null;
    }
    var normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "yes" || normalized === "on") {
        return true;
    }
    if (normalized === "false" || normalized === "no" || normalized === "off") {
        return false;
    }
    return null;
}

function normalizeRoProTradeOffersItemSide(value) {
    var normalized = stripTags(String(value == null ? "" : value))
        .trim()
        .toLowerCase();
    if (
        normalized === "offered" ||
        normalized === "offering" ||
        normalized === "offer"
    ) {
        return "offered";
    }
    if (
        normalized === "wanted" ||
        normalized === "wants" ||
        normalized === "want"
    ) {
        return "wanted";
    }
    if (normalized === "" || normalized === "either" || normalized === "any") {
        return "either";
    }
    return null;
}

function normalizeRoProTradeOffersSort(value) {
    var normalized = stripTags(String(value == null ? "" : value))
        .trim()
        .toLowerCase();
    if (
        normalized === "oldest" ||
        normalized === "old" ||
        normalized === "asc" ||
        normalized === "oldest_first"
    ) {
        return "oldest";
    }
    if (
        normalized === "" ||
        normalized === "newest" ||
        normalized === "new" ||
        normalized === "desc" ||
        normalized === "newest_first"
    ) {
        return "newest";
    }
    return null;
}

function normalizeRoProTimeZone(value) {
    var normalized = stripTags(String(value == null ? "" : value)).trim();
    if (normalized.length === 0) {
        return "local";
    }
    if (normalized.toLowerCase() === "local") {
        return "local";
    }
    if (normalized.toLowerCase() === "utc") {
        return "UTC";
    }
    if (!/^[A-Za-z0-9_+/-]{1,64}$/.test(normalized)) {
        return null;
    }
    try {
        Intl.DateTimeFormat("en-US", {
            timeZone: normalized
        }).format(new Date());
    } catch (e) {
        return null;
    }
    return normalized;
}

var ROPRO_API_BASE_URL = "https://api.ropro.io";
var ROPRO_AUTH_VERSION = "1";
var ROPRO_CONTRACT_REQUIRED_HEADERS = [
    "ropro-id",
    "ropro-verification",
    "x-ropro-auth-v",
    "x-ropro-operation",
    "x-ropro-install-id",
    "x-ropro-key-id",
    "x-ropro-session-token",
    "x-ropro-request-id",
    "x-ropro-timestamp",
    "x-ropro-nonce",
    "x-ropro-body-sha256",
    "x-ropro-signature",
];
var roproContractStateCache = null;
var roproContractStatePromise = null;

function normalizeRoProPath(path) {
    var normalizedPath = stripTags(String(path == null ? "" : path))
        .trim()
        .replace(/^\/+/, "");
    if (normalizedPath.length === 0) {
        return null;
    }
    return normalizedPath;
}

function buildRoProQueryParts(query, sortPairs) {
    if (query == null || typeof query !== "object") {
        return [];
    }
    var pairs = [];
    var keys = Object.keys(query);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = query[key];
        if (value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                pairs.push([String(key), String(value[j])]);
            }
        } else {
            pairs.push([String(key), String(value)]);
        }
    }
    if (sortPairs) {
        pairs.sort(function(a, b) {
            if (a[0] === b[0]) {
                return a[1].localeCompare(b[1]);
            }
            return a[0].localeCompare(b[0]);
        });
    }
    var encodedPairs = [];
    for (var k = 0; k < pairs.length; k++) {
        encodedPairs.push(
            encodeURIComponent(pairs[k][0]) + "=" + encodeURIComponent(pairs[k][1])
        );
    }
    return encodedPairs;
}

function buildRoProApiUrl(path, query) {
    var normalizedPath = normalizeRoProPath(path);
    if (normalizedPath == null) {
        return null;
    }
    var url = ROPRO_API_BASE_URL + "/" + normalizedPath;
    if (query == null || typeof query !== "object") {
        return url;
    }
    var queryParts = buildRoProQueryParts(query, false);
    if (queryParts.length > 0) {
        return url + "?" + queryParts.join("&");
    }
    return url;
}

function buildRoProCanonicalQuery(query) {
    return buildRoProQueryParts(query, true).join("&");
}

function utf8ToBytes(value) {
    return new TextEncoder().encode(String(value == null ? "" : value));
}

function bytesToBase64Url(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
    var normalized = String(value == null ? "" : value)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    var paddingLength = (4 - (normalized.length % 4)) % 4;
    normalized += "=".repeat(paddingLength);
    var binary = atob(normalized);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function generateRoProUuid() {
    if (crypto && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = [];
    for (var i = 0; i < bytes.length; i++) {
        hex.push(bytes[i].toString(16).padStart(2, "0"));
    }
    return (
        hex.slice(0, 4).join("") +
        "-" +
        hex.slice(4, 6).join("") +
        "-" +
        hex.slice(6, 8).join("") +
        "-" +
        hex.slice(8, 10).join("") +
        "-" +
        hex.slice(10, 16).join("")
    );
}

function generateRoProNonce() {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return bytesToBase64Url(bytes);
}

function canonicalizeRoProJsonValue(value) {
    if (value === null) {
        return null;
    }
    if (Array.isArray(value)) {
        var arrayResult = [];
        for (var i = 0; i < value.length; i++) {
            var normalizedArrayValue = canonicalizeRoProJsonValue(value[i]);
            arrayResult.push(
                typeof normalizedArrayValue === "undefined" ? null : normalizedArrayValue
            );
        }
        return arrayResult;
    }
    var valueType = typeof value;
    if (valueType === "string" || valueType === "boolean") {
        return value;
    }
    if (valueType === "number") {
        return Number.isFinite(value) ? value : null;
    }
    if (valueType === "object") {
        var keys = Object.keys(value).sort();
        var objectResult = {};
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var normalizedObjectValue = canonicalizeRoProJsonValue(value[key]);
            if (typeof normalizedObjectValue !== "undefined") {
                objectResult[key] = normalizedObjectValue;
            }
        }
        return objectResult;
    }
    return undefined;
}

function stableRoProJsonStringify(value) {
    var normalized = canonicalizeRoProJsonValue(value);
    if (typeof normalized === "undefined") {
        return "";
    }
    return JSON.stringify(normalized);
}

function buildRoProRequestBody(requestConfig) {
    var config = requestConfig || {};
    if (config.bodyType === "form") {
        if (config.body == null || typeof config.body !== "object" || Array.isArray(config.body)) {
            return null;
        }
        var formData = new FormData();
        var formKeys = Object.keys(config.body);
        for (var i = 0; i < formKeys.length; i++) {
            var key = formKeys[i];
            var value = config.body[key];
            if (value == null) {
                continue;
            }
            formData.append(key, value);
        }
        return {
            fetchBody: formData,
            canonicalBody: stableRoProJsonStringify(config.body),
        };
    }
    if (config.bodyType === "wrap_json") {
        var wrappedFormData = new FormData();
        wrappedFormData.append("data", JSON.stringify(config.body));
        return {
            fetchBody: wrappedFormData,
            canonicalBody: stableRoProJsonStringify(config.body),
        };
    }
    if (config.bodyType === "json") {
        var rawBody =
            typeof config.body === "string" ? config.body : JSON.stringify(config.body);
        var canonicalBody = "";
        if (typeof config.body === "string") {
            try {
                canonicalBody = stableRoProJsonStringify(JSON.parse(config.body));
            } catch (e) {
                canonicalBody = config.body;
            }
        } else {
            canonicalBody = stableRoProJsonStringify(config.body);
        }
        return {
            fetchBody: rawBody,
            canonicalBody: canonicalBody,
        };
    }
    return {
        fetchBody: null,
        canonicalBody: "",
    };
}

async function getRoProContractState() {
    if (roproContractStateCache != null) {
        return roproContractStateCache;
    }
    if (roproContractStatePromise != null) {
        return roproContractStatePromise;
    }
    roproContractStatePromise = (async function() {
        var installId = await getLocalStorage("rpContractInstallId");
        if (typeof installId !== "string" || installId.length === 0) {
            installId = generateRoProUuid();
            await setLocalStorage("rpContractInstallId", installId);
        }

        var signingKey = await getLocalStorage("rpContractSigningKey");
        if (typeof signingKey !== "string" || signingKey.length === 0) {
            var signingKeyBytes = new Uint8Array(32);
            crypto.getRandomValues(signingKeyBytes);
            signingKey = bytesToBase64Url(signingKeyBytes);
            await setLocalStorage("rpContractSigningKey", signingKey);
        }

        var keyId = await getLocalStorage("rpContractKeyId");
        if (typeof keyId !== "string" || keyId.length === 0) {
            keyId = await sha256(signingKey);
            await setLocalStorage("rpContractKeyId", keyId);
        }

        var sessionToken = await getLocalStorage("rpContractSessionToken");
        if (typeof sessionToken !== "string" || sessionToken.length === 0) {
            sessionToken = "none";
        }

        var signingKeyBytes;
        try {
            signingKeyBytes = base64UrlToBytes(signingKey);
        } catch (e) {
            var regeneratedBytes = new Uint8Array(32);
            crypto.getRandomValues(regeneratedBytes);
            signingKey = bytesToBase64Url(regeneratedBytes);
            await setLocalStorage("rpContractSigningKey", signingKey);
            keyId = await sha256(signingKey);
            await setLocalStorage("rpContractKeyId", keyId);
            signingKeyBytes = regeneratedBytes;
        }

        var cryptoKey = await crypto.subtle.importKey(
            "raw",
            signingKeyBytes, {
                name: "HMAC",
                hash: "SHA-256"
            },
            false,
            ["sign"]
        );

        roproContractStateCache = {
            installId: installId,
            keyId: keyId,
            sessionToken: sessionToken,
            cryptoKey: cryptoKey,
        };
        roproContractStatePromise = null;
        return roproContractStateCache;
    })();
    return roproContractStatePromise;
}

async function updateRoProSessionTokenFromResponse(response) {
    if (response == null || response.headers == null) {
        return;
    }
    var nextToken = response.headers.get("x-ropro-session-token");
    if (typeof nextToken !== "string" || nextToken.length === 0) {
        return;
    }
    var state = await getRoProContractState();
    if (state.sessionToken !== nextToken) {
        state.sessionToken = nextToken;
        await setLocalStorage("rpContractSessionToken", nextToken);
    }
}

function parseRoProApiResponseText(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

async function getRoProVerificationHeaders() {
    var verificationDict = normalizeVerificationDictionary(await getStorage("userVerification"));
    var userID = await resolveActiveVerificationUserId(verificationDict);
    var roproVerificationToken = "none";
    if (verificationDict != null && userID != null) {
        var verificationToken = findVerificationTokenForUser(verificationDict, userID);
        if (verificationToken != null) {
            roproVerificationToken = verificationToken;
        }
    }
    if (
        typeof roproVerificationToken !== "string" ||
        roproVerificationToken.length === 0
    ) {
        roproVerificationToken = "none";
    }
    var normalizedUserId =
        userID == null || userID === "" ? "none" : String(userID);
    return {
        "ropro-verification": roproVerificationToken,
        "ropro-id": normalizedUserId,
    };
}

function hasValidRoProContractHeaders(headers) {
    for (var i = 0; i < ROPRO_CONTRACT_REQUIRED_HEADERS.length; i++) {
        var headerName = ROPRO_CONTRACT_REQUIRED_HEADERS[i];
        if (
            !Object.prototype.hasOwnProperty.call(headers, headerName) ||
            typeof headers[headerName] !== "string" ||
            headers[headerName].length === 0
        ) {
            return false;
        }
    }
    return true;
}

async function buildRoProContractHeaders(operationName, method, path, query, canonicalBody) {
    var normalizedOperation = normalizeRoProString(operationName, 128);
    if (normalizedOperation == null) {
        normalizedOperation = "ropro_unknown_operation";
    }
    var normalizedMethod = String(method == null ? "POST" : method).toUpperCase();
    var normalizedPath = normalizeRoProPath(path);
    if (normalizedPath == null) {
        return null;
    }
    var canonicalQuery = buildRoProCanonicalQuery(query);
    var bodyHash = await sha256(String(canonicalBody == null ? "" : canonicalBody));
    var requestId = generateRoProUuid();
    var timestamp = String(Math.floor(Date.now() / 1000));
    var nonce = generateRoProNonce();
    var verificationHeaders = await getRoProVerificationHeaders();
    var state = await getRoProContractState();
    var sessionToken =
        typeof state.sessionToken === "string" && state.sessionToken.length > 0 ?
        state.sessionToken :
        "none";

    var signaturePayload = [
        normalizedMethod,
        "/" + normalizedPath,
        canonicalQuery,
        bodyHash,
        normalizedOperation,
        state.installId,
        state.keyId,
        requestId,
        timestamp,
        nonce,
    ].join("\n");
    var signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        state.cryptoKey,
        utf8ToBytes(signaturePayload)
    );
    var signature = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return {
        "ropro-id": String(verificationHeaders["ropro-id"]),
        "ropro-verification": String(verificationHeaders["ropro-verification"]),
        "x-ropro-auth-v": ROPRO_AUTH_VERSION,
        "x-ropro-operation": normalizedOperation,
        "x-ropro-install-id": String(state.installId),
        "x-ropro-key-id": String(state.keyId),
        "x-ropro-session-token": sessionToken,
        "x-ropro-request-id": requestId,
        "x-ropro-timestamp": timestamp,
        "x-ropro-nonce": nonce,
        "x-ropro-body-sha256": bodyHash,
        "x-ropro-signature": signature,
    };
}

async function sendRoProApiRequest(operationName, operation, requestConfig) {
    var safeRequestConfig = requestConfig || {};
    var method =
        typeof operation.method === "string" && operation.method.length > 0 ?
        operation.method :
        "POST";
    var normalizedPath = normalizeRoProPath(operation.path);
    if (normalizedPath == null) {
        throw new Error("Invalid RoPro operation path.");
    }
    var url = buildRoProApiUrl(normalizedPath, safeRequestConfig.query);
    if (url == null) {
        throw new Error("Unable to build RoPro request URL.");
    }
    var bodyConfig = buildRoProRequestBody(safeRequestConfig);
    if (bodyConfig == null) {
        throw new Error("Invalid RoPro request body.");
    }
    var contractHeaders = await buildRoProContractHeaders(
        operationName,
        method,
        normalizedPath,
        safeRequestConfig.query,
        bodyConfig.canonicalBody
    );
    if (contractHeaders == null || !hasValidRoProContractHeaders(contractHeaders)) {
        throw new Error("Invalid RoPro contract headers.");
    }
    if (safeRequestConfig.cacheHeaders) {
        contractHeaders["Cache-Control"] = "public, max-age=604800";
        contractHeaders.Pragma = "public, max-age=604800";
    }

    var fetchOptions = {
        method: method,
        headers: contractHeaders,
        credentials: "include",
    };
    if (bodyConfig.fetchBody != null) {
        fetchOptions.body = bodyConfig.fetchBody;
    }
    var response = await fetch(url, fetchOptions);
    await updateRoProSessionTokenFromResponse(response);
    return response;
}

var ROPRO_OPERATION_CAPABILITIES = {
    trade_data_access: {
        settingsAny: [
            "tradeValueCalculator",
            "tradeDemandRatingCalculator",
            "tradeItemValue",
            "tradeItemDemand",
            "itemInfoCard",
            "profileValue",
            "tradeSearch",
            "advancedTradeSearch",
            "tradePageProjectedWarning",
            "tradeOffersPage",
        ],
    },
    trade_previews: {
        settingsAny: ["tradePreviews"],
    },
    trade_bot_actions: {
        settingsAny: [
            "tradePanel",
            "moreTradePanel",
            "hideTradeBots",
            "autoDeclineTradeBots",
            "suspectedBotBadges",
            "tradeNotifier",
            "tradeProtection",
            "autoDecline",
        ],
    },
    trade_panel_automation: {
        settingsAny: ["moreTradePanel"],
    },
    trade_offers_view: {
        settingsAny: ["tradeOffersPage"],
    },
    trade_offers_post: {
        settingsAny: ["tradeOffersPost"],
    },
    trade_offers_wishlist_manage: {
        settingsAny: ["tradeOffersWishlist"],
    },
    voice_servers: {
        settingsAny: ["premiumVoiceServers", "roproVoiceServers"],
    },
    playtime_data: {
        settingsAny: ["morePlaytimeSorts", "mostPlayedGames"],
    },
    quick_item_search: {
        settingsAny: ["quickItemSearch"],
    },
    profile_value: {
        settingsAny: [
            "profileValue",
            "reputation",
            "reputationVote",
            "linkedDiscord",
        ],
    },
    profile_theme_write: {
        settingsAny: ["profileThemes", "animatedProfileThemes", "themeColorAdjustments"],
    },
    sandbox_outfits: {
        settingsAny: ["sandboxOutfits"],
    },
    linked_discord: {
        settingsAny: ["linkedDiscord"],
    },
    reputation_write: {
        settingsAny: ["reputation", "reputationVote"],
    },
    server_info: {
        settingsAny: ["additionalServerInfo", "serverInviteLinks"],
    },
};

async function resolveRoProCapability(capabilityName) {
    if (capabilityName == null || capabilityName === "") {
        return true;
    }
    if (!ROPRO_OPERATION_CAPABILITIES.hasOwnProperty(capabilityName)) {
        return false;
    }
    var capabilityConfig = ROPRO_OPERATION_CAPABILITIES[capabilityName];
    if (
        !capabilityConfig ||
        !Array.isArray(capabilityConfig.settingsAny) ||
        capabilityConfig.settingsAny.length === 0
    ) {
        return false;
    }
    for (var i = 0; i < capabilityConfig.settingsAny.length; i++) {
        if (await loadSettingValidity(capabilityConfig.settingsAny[i])) {
            return true;
        }
    }
    return false;
}

var ROPRO_API_OPERATIONS = {
    ropro_get_discord_id: {
        path: "getDiscordID.php",
        method: "POST",
        buildRequest: function(payload) {
            var link = normalizeRoProString(payload.link, 2048);
            if (link == null) {
                return null;
            }
            return {
                query: {
                    link: link
                }
            };
        },
    },
    ropro_get_disabled_features: {
        path: "disabledFeatures.php",
        method: "POST",
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_get_server_cursor: {
        path: "getServerCursor.php",
        method: "GET",
        buildRequest: function(payload) {
            var startIndex = normalizeRoProInteger(payload.startIndex, {
                min: 0
            });
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1
            });
            if (startIndex == null || placeId == null) {
                return null;
            }
            return {
                query: {
                    startIndex: startIndex,
                    placeId: placeId
                }
            };
        },
    },
    ropro_trade_preview_backend: {
        path: "tradePreviewBackend.php",
        method: "POST",
        capability: "trade_previews",
        buildRequest: function(payload) {
            if (payload == null || typeof payload !== "object") {
                return null;
            }
            return {
                query: payload.form === true ? {
                    form: "true"
                } : {
                    form: ""
                },
                bodyType: "wrap_json",
                body: payload.trades,
            };
        },
    },
    ropro_trade_protection_backend: {
        path: "tradeProtectionBackend.php",
        method: "POST",
        capability: "trade_bot_actions",
        buildRequest: function(payload) {
            if (
                payload == null ||
                typeof payload !== "object" ||
                !Array.isArray(payload.trades)
            ) {
                return null;
            }
            return {
                query: {
                    form: ""
                },
                bodyType: "wrap_json",
                body: {
                    data: payload.trades
                },
            };
        },
    },
    ropro_item_info_backend: {
        path: "itemInfoBackend.php",
        method: "POST",
        capability: "trade_data_access",
        buildRequest: function(payload) {
            if (
                payload == null ||
                typeof payload !== "object" ||
                !Array.isArray(payload.items)
            ) {
                return null;
            }
            return {
                bodyType: "json",
                body: payload.items,
            };
        },
    },
    ropro_get_voice_servers: {
        path: "getVoiceServers.php",
        method: "POST",
        capability: "voice_servers",
        buildRequest: function(payload) {
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1
            });
            if (placeId == null) {
                return null;
            }
            return {
                query: {
                    placeid: placeId
                }
            };
        },
    },
    ropro_get_voice_server: {
        path: "getVoiceServer.php",
        method: "POST",
        capability: "voice_servers",
        buildRequest: function(payload) {
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1
            });
            var serverId = normalizeRoProInteger(payload.serverId, {
                min: 1
            });
            if (placeId == null || serverId == null) {
                return null;
            }
            return {
                query: {
                    placeid: placeId,
                    serverid: serverId
                }
            };
        },
    },
    ropro_get_play_time: {
        path: "getPlayTime.php",
        method: "POST",
        capability: "playtime_data",
        buildRequest: function(payload) {
            var universeId = normalizeRoProInteger(payload.universeId, {
                min: 1
            });
            var time = normalizeRoProInteger(payload.time, {
                min: 0
            });
            var offset = normalizeRoProInteger(payload.offset, {
                min: -100000,
                max: 100000
            });
            if (universeId == null || time == null || offset == null) {
                return null;
            }
            return {
                query: {
                    universeid: universeId,
                    time: time,
                    offset: offset
                }
            };
        },
    },
    ropro_post_time_played: {
        path: "postTimePlayed.php",
        method: "POST",
        capability: "playtime_data",
        buildRequest: function(payload) {
            var gameId = normalizeRoProInteger(payload.gameId, {
                min: 1
            });
            var universeId = normalizeRoProInteger(payload.universeId, {
                min: 1
            });
            if (gameId == null || universeId == null) {
                return null;
            }
            return {
                query: {
                    gameid: gameId,
                    universeid: universeId
                }
            };
        },
    },
    ropro_get_server_connection_score: {
        path: "getServerConnectionScore.php",
        method: "POST",
        capability: "server_info",
        buildRequest: function(payload) {
            if (payload == null || typeof payload !== "object") {
                return null;
            }
            return {
                query: {
                    form: ""
                },
                bodyType: "wrap_json",
                body: payload.data,
            };
        },
    },
    ropro_get_server_age: {
        path: "getServerAge.php",
        method: "POST",
        capability: "server_info",
        buildRequest: function(payload) {
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1
            });
            if (
                placeId == null ||
                !Array.isArray(payload.servers)
            ) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    placeID: placeId,
                    servers: JSON.stringify(payload.servers),
                },
            };
        },
    },
    ropro_get_invite: {
        path: "getInvite.php",
        method: "POST",
        buildRequest: function(payload) {
            var key = normalizeRoProString(payload.key, 512);
            if (key == null) {
                return null;
            }
            return {
                query: {
                    key: key
                }
            };
        },
    },
    ropro_create_invite: {
        path: "createInvite.php",
        method: "POST",
        buildRequest: function(payload) {
            var universeId = normalizeRoProInteger(payload.universeId, {
                min: 1
            });
            var serverId = normalizeRoProString(payload.serverId, 100);
            if (
                universeId == null ||
                serverId == null ||
                !/^[A-Za-z0-9-]{6,100}$/.test(serverId)
            ) {
                return null;
            }
            return {
                query: {
                    universeid: universeId,
                    serverid: serverId
                }
            };
        },
    },
    ropro_get_game_cache_refresh_status: {
        path: "getGameCacheRefreshStatus.php",
        method: "GET",
        buildRequest: function(payload) {
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1,
                max: 9007199254740991,
            });
            if (placeId == null) {
                return null;
            }
            return {
                query: {
                    placeId: placeId
                }
            };
        },
    },
    ropro_upsert_game_cache_from_client: {
        path: "upsertGameCacheFromClient.php",
        method: "POST",
        buildRequest: function(payload) {
            var placeId = normalizeRoProInteger(payload.placeId, {
                min: 1,
                max: 9007199254740991,
            });
            if (
                placeId == null ||
                payload.game == null ||
                typeof payload.game !== "object" ||
                Array.isArray(payload.game)
            ) {
                return null;
            }
            var requestBody = {
                placeId: placeId,
                game: payload.game,
            };
            if (stableRoProJsonStringify(requestBody).length > 32000) {
                return null;
            }
            return {
                bodyType: "json",
                body: requestBody,
            };
        },
    },
    ropro_get_cached_genre_games: {
        path: "getCachedGenreGames.php",
        method: "GET",
        buildRequest: function(payload) {
            var genre = normalizeRoProString(payload.genre, 80);
            if (genre == null) {
                return null;
            }
            var subgenre = normalizeRoProString(payload.subgenre, 80, {
                allowEmpty: true,
            });
            var limit = normalizeRoProInteger(payload.limit, {
                min: 1,
                max: 2000
            });
            var minPlaying = normalizeRoProInteger(payload.minPlaying, {
                min: 0,
                max: 1000000,
            });
            var universeIds = normalizeRoProNumericCsv(payload.universeIds, 300);
            var offset = normalizeRoProInteger(payload.offset, {
                min: 0,
                max: 10000
            });
            var sort = normalizeRoProString(payload.sort, 30, {
                allowEmpty: true
            });
            var query = {
                genre: genre,
            };
            if (typeof subgenre === "string" && subgenre.length > 0) {
                query.subgenre = subgenre;
            }
            if (limit != null) {
                query.limit = limit;
            }
            if (minPlaying != null) {
                query.minPlaying = minPlaying;
            }
            if (universeIds != null) {
                query.universeIds = universeIds;
            }
            if (offset != null) {
                query.offset = offset;
            }
            if (typeof sort === "string" && sort.length > 0) {
                query.sort = sort;
            }
            return {
                query: query
            };
        },
    },
    ropro_get_most_played_universe: {
        path: "getMostPlayedUniverse.php",
        method: "POST",
        capability: "playtime_data",
        buildRequest: function(payload) {
            var time = normalizeRoProInteger(payload.time, {
                min: 0
            });
            if (time == null) {
                return null;
            }
            return {
                query: {
                    time: time
                }
            };
        },
    },
    ropro_get_default_themes: {
        path: "getDefaultThemes.php",
        method: "POST",
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_get_themes_v2: {
        path: "getThemesV2.json",
        method: "POST",
        buildRequest: function() {
            return {
                query: {
                    "1": ""
                }
            };
        },
    },
    ropro_get_video_themes_v2: {
        path: "getVideoThemesV2.json",
        method: "POST",
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_get_profile_theme: {
        path: "getProfileTheme.php",
        method: "POST",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (userId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId
                }
            };
        },
    },
    ropro_get_user_last_online: {
        path: "getUserLastOnline.php",
        method: "GET",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (userId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId
                }
            };
        },
    },
    ropro_get_users_last_online: {
        path: "getUsersLastOnline.php",
        method: "GET",
        buildRequest: function(payload) {
            var userIds = normalizeRoProNumericCsv(payload.userIds, 100);
            if (userIds == null) {
                return null;
            }
            return {
                query: {
                    userIds: userIds
                }
            };
        },
    },
    ropro_update_last_online_presence: {
        path: "updateLastOnline.php",
        method: "POST",
        buildRequest: function(payload) {
            var normalizedVisible = normalizeRoProBoolean(payload.isVisible);
            var normalizedTimeZone = normalizeRoProTimeZone(payload.timezone);
            if (normalizedVisible == null || normalizedTimeZone == null) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    visible: normalizedVisible ? "1" : "0",
                    timezone: normalizedTimeZone,
                },
            };
        },
    },
    ropro_get_decal_image: {
        path: "getDecalImage.php",
        method: "POST",
        buildRequest: function(payload) {
            var decalId = normalizeRoProInteger(payload.decalId, {
                min: 1
            });
            if (decalId == null) {
                return null;
            }
            return {
                query: {
                    id: decalId
                }
            };
        },
    },
    ropro_save_profile_theme: {
        path: "saveProfileTheme.php",
        method: "POST",
        capability: "profile_theme_write",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var themeName = normalizeRoProString(payload.themeName, 256);
            var version = normalizeRoProInteger(payload.version, {
                min: 1,
                max: 2
            });
            if (userId == null || themeName == null || version == null) {
                return null;
            }
            var query = {
                userid: userId,
                themename: themeName,
                version: version,
            };
            var h = normalizeRoProInteger(payload.h, {
                min: -360,
                max: 360
            });
            var s = normalizeRoProNumber(payload.s, {
                min: -100,
                max: 100
            });
            var l = normalizeRoProNumber(payload.l, {
                min: -100,
                max: 100
            });
            if (h != null && s != null && l != null) {
                query.h = h;
                query.s = s;
                query.l = l;
            }
            return {
                query: query
            };
        },
    },
    ropro_activate_key: {
        path: "activateKey.php",
        method: "POST",
        buildRequest: function(payload) {
            var key = normalizeRoProString(payload.key, 256);
            if (key == null) {
                return null;
            }
            return {
                query: {
                    key: key
                }
            };
        },
    },
    ropro_trade_backend: {
        path: "tradeBackend.php",
        method: "POST",
        capability: "trade_data_access",
        buildRequest: function(payload) {
            var ids = normalizeRoProNumericCsv(payload.ids, 120);
            if (ids == null) {
                return null;
            }
            return {
                query: {
                    ids: ids
                }
            };
        },
    },
    ropro_get_wishlist_all: {
        path: "getWishlistAll.php",
        method: "POST",
        capability: "trade_offers_view",
        buildRequest: function(payload) {
            var page = normalizeRoProInteger(payload.page, {
                min: 0,
                max: 100
            });
            if (page == null) {
                page = 0;
            }
            var itemIds = normalizeRoProTradeOfferItemIdsCsv(
                payload.item_ids ?? payload.itemIds,
                80
            );
            var itemSide = normalizeRoProTradeOffersItemSide(
                payload.item_side ?? payload.itemSide
            );
            var sort = normalizeRoProTradeOffersSort(payload.sort);
            var wishlistOnly = normalizeRoProBoolean(
                payload.wishlist_only ?? payload.wishlistOnly
            );
            var myPostsOnly = normalizeRoProBoolean(
                payload.my_posts_only ?? payload.myPostsOnly
            );
            var query = {
                page: page
            };
            if (itemIds != null) {
                query.item_ids = itemIds;
            }
            if (itemSide != null) {
                query.item_side = itemSide;
            }
            query.sort = sort == null ? "newest" : sort;
            if (wishlistOnly != null) {
                query.wishlist_only = wishlistOnly ? 1 : 0;
            }
            if (myPostsOnly != null) {
                query.my_posts_only = myPostsOnly ? 1 : 0;
            }
            return {
                query: query
            };
        },
    },
    ropro_post_wishlist: {
        path: "postWishlist.php",
        method: "POST",
        capability: "trade_offers_post",
        buildRequest: function(payload) {
            var rawUserId = payload.userId ?? payload.userid;
            var userId = null;
            if (rawUserId != null && String(rawUserId).trim().length > 0) {
                userId = normalizeRoProInteger(rawUserId, {
                    min: 1,
                });
                if (userId == null) {
                    return null;
                }
            }
            var wantItem = normalizeRoProInteger(payload.want_item, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var wantItem2 = normalizeRoProInteger(payload.want_item2, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var wantItem3 = normalizeRoProInteger(payload.want_item3, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var wantItem4 = normalizeRoProInteger(payload.want_item4, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var wantValue = normalizeRoProInteger(payload.want_value, {
                min: -10000000,
                max: 10000000,
            });
            var item1 = normalizeRoProInteger(payload.item1, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var item2 = normalizeRoProInteger(payload.item2, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var item3 = normalizeRoProInteger(payload.item3, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var item4 = normalizeRoProInteger(payload.item4, {
                min: -9,
                max: Number.MAX_SAFE_INTEGER,
            });
            var note = normalizeRoProString(payload.note, 40, {
                allowEmpty: true
            });
            if (
                wantItem == null ||
                wantItem2 == null ||
                wantItem3 == null ||
                wantItem4 == null ||
                wantValue == null ||
                item1 == null ||
                item2 == null ||
                item3 == null ||
                item4 == null ||
                note == null
            ) {
                return null;
            }
            var requestBody = {
                want_item: wantItem,
                want_item2: wantItem2,
                want_item3: wantItem3,
                want_item4: wantItem4,
                want_value: wantValue,
                item1: item1,
                item2: item2,
                item3: item3,
                item4: item4,
                note: note,
            };
            if (userId != null) {
                requestBody.userid = userId;
            }
            return {
                bodyType: "form",
                body: requestBody,
            };
        },
    },
    ropro_delete_wish: {
        path: "deleteWish.php",
        method: "POST",
        capability: "trade_offers_post",
        buildRequest: function(payload) {
            var wishId = normalizeRoProInteger(payload.wishid, {
                min: 1
            });
            if (wishId == null) {
                return null;
            }
            return {
                query: {
                    wishid: wishId
                }
            };
        },
    },
    ropro_get_wishlist_assets: {
        path: "getWishlistAssets.php",
        method: "POST",
        capability: "trade_offers_wishlist_manage",
        buildRequest: function(payload) {
            var limit = normalizeRoProInteger(payload.limit, {
                min: 1,
                max: 300
            });
            var query = {};
            if (limit != null) {
                query.limit = limit;
            }
            return {
                query: query
            };
        },
    },
    ropro_set_wishlist_asset: {
        path: "setWishlistAsset.php",
        method: "POST",
        capability: "trade_offers_wishlist_manage",
        buildRequest: function(payload) {
            var assetId = normalizeRoProInteger(payload.assetId, {
                min: 1
            });
            var value = normalizeRoProBoolean(payload.value);
            var type = normalizeRoProString(payload.type, 45);
            if (typeof type === "string") {
                type = type.toLowerCase();
            }
            if (assetId == null || value == null || type == null) {
                return null;
            }
            if (type !== "asset" && type !== "gamepass") {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    assetId: assetId,
                    value: value ? "true" : "false",
                    type: type,
                },
            };
        },
    },
    ropro_trade_item_search: {
        path: "itemSearch.php",
        method: "POST",
        capability: "trade_data_access",
        buildRequest: function(payload) {
            var q = normalizeRoProString(payload.q, 120);
            if (q == null) {
                return null;
            }
            return {
                query: {
                    q: q
                }
            };
        },
    },
    ropro_fetch_flag: {
        path: "fetchFlag.php",
        method: "POST",
        capability: "trade_bot_actions",
        buildRequest: function(payload) {
            var id = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (id == null) {
                return null;
            }
            return {
                query: {
                    id: id
                }
            };
        },
    },
    ropro_fetch_flags: {
        path: "fetchFlags.php",
        method: "POST",
        capability: "trade_bot_actions",
        buildRequest: function(payload) {
            var ids = normalizeRoProNumericCsv(payload.userIds, 250);
            if (ids == null) {
                return null;
            }
            return {
                query: {
                    ids: ids
                }
            };
        },
    },
    ropro_batch_flags: {
        path: "batchFlags.php",
        method: "POST",
        capability: "trade_bot_actions",
        buildRequest: function(payload) {
            var reqType = normalizeRoProTradeBotReqType(payload.reqType);
            var ids = normalizeRoProNumericCsv(payload.userIds, 250);
            if (reqType == null || ids == null) {
                return null;
            }
            return {
                query: {
                    form: ""
                },
                bodyType: "wrap_json",
                body: {
                    reqType: reqType,
                    ids: ids
                },
            };
        },
    },
    ropro_additional_item_info: {
        path: "additionalItemInfo.php",
        method: "POST",
        capability: "trade_data_access",
        buildRequest: function(payload) {
            var id = normalizeRoProInteger(payload.itemId, {
                min: 1
            });
            if (id == null) {
                return null;
            }
            return {
                query: {
                    id: id
                }
            };
        },
    },
    ropro_trade_sales_context: {
        path: "tradeLogicBackend.php",
        method: "POST",
        capability: "trade_data_access",
        buildRequest: function(payload) {
            if (
                payload == null ||
                typeof payload !== "object" ||
                payload.salesData == null ||
                typeof payload.salesData !== "object" ||
                Array.isArray(payload.salesData)
            ) {
                return null;
            }
            return {
                bodyType: "json",
                body: {
                    op: "sales_context",
                    salesData: payload.salesData,
                },
            };
        },
    },
    ropro_trade_logic_backend: {
        path: "tradeLogicBackend.php",
        method: "POST",
        capability: "trade_panel_automation",
        buildRequest: function(payload) {
            if (payload == null || typeof payload !== "object") {
                return null;
            }
            var op = normalizeRoProTradeLogicOp(payload.op);
            if (op == null) {
                return null;
            }
            if (!Array.isArray(payload.trades) || payload.trades.length === 0) {
                return null;
            }
            var safeBody = {
                op: op,
                trades: payload.trades.slice(0, 600),
            };
            if (op === "filter_by_item") {
                var itemId = normalizeRoProInteger(payload.itemId, {
                    min: 1
                });
                if (itemId == null) {
                    return null;
                }
                safeBody.itemId = itemId;
            } else {
                var myUserId = normalizeRoProInteger(payload.myUserId, {
                    min: 1
                });
                if (myUserId == null) {
                    return null;
                }
                safeBody.myUserId = myUserId;
            }
            if (op === "loss_threshold") {
                var threshold = normalizeRoProInteger(payload.threshold, {
                    min: 0,
                    max: 100
                });
                safeBody.threshold = threshold == null ? 0 : threshold;
            }
            if (op === "invalid_inbounds") {
                if (payload.inventories == null || typeof payload.inventories !== "object") {
                    return null;
                }
                safeBody.inventories = payload.inventories;
            }
            return {
                bodyType: "json",
                body: safeBody,
            };
        },
    },
    ropro_flag_trader: {
        path: "flagTrader.php",
        method: "POST",
        capability: "trade_bot_actions",
        buildRequest: function(payload) {
            var id = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var reqType = normalizeRoProFlagTraderReqType(payload.reqType);
            if (id == null || reqType == null) {
                return null;
            }
            return {
                query: {
                    id: id,
                    reqType: reqType
                }
            };
        },
    },
    ropro_get_avatar_editor_backgrounds: {
        path: "getAvatarEditorBackgrounds.php",
        method: "POST",
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_get_asset_thumbnail_url: {
        path: "getAssetThumbnailUrl.php",
        method: "GET",
        requiresVerification: false,
        buildRequest: function(payload) {
            var id = normalizeRoProInteger(payload.assetId, {
                min: 1
            });
            if (id == null) {
                return null;
            }
            return {
                query: {
                    id: id
                },
                cacheHeaders: true,
            };
        },
    },
    ropro_get_item_search: {
        path: "getItemSearch.php",
        method: "POST",
        capability: "quick_item_search",
        buildRequest: function(payload) {
            var q = normalizeRoProString(payload.q, 120);
            if (q == null) {
                return null;
            }
            return {
                query: {
                    q: q
                }
            };
        },
    },
    ropro_get_merch: {
        path: "getMerch.php",
        method: "POST",
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_create_outfit: {
        path: "createOutfit.php",
        method: "POST",
        capability: "sandbox_outfits",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var outfitAssets = normalizeRoProNumericCsv(payload.outfitAssets, 80);
            var outfitName = normalizeRoProString(payload.outfitName, 120);
            var outfitThumbnail = normalizeRoProOutfitThumbnail(payload.outfitThumbnail);
            if (
                userId == null ||
                outfitAssets == null ||
                outfitName == null ||
                outfitThumbnail == null
            ) {
                return null;
            }
            return {
                query: {
                    userid: userId,
                    outfitAssets: outfitAssets,
                    outfitName: outfitName,
                    outfitThumbnail: outfitThumbnail,
                },
            };
        },
    },
    ropro_update_outfit_thumbnail: {
        path: "updateOutfitThumbnail.php",
        method: "POST",
        capability: "sandbox_outfits",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var outfitAssets = normalizeRoProNumericCsv(payload.outfitAssets, 80);
            var outfitThumbnail = normalizeRoProOutfitThumbnail(payload.outfitThumbnail);
            if (userId == null || outfitAssets == null || outfitThumbnail == null) {
                return null;
            }
            return {
                query: {
                    userid: userId,
                    outfitAssets: outfitAssets,
                    outfitThumbnail: outfitThumbnail,
                },
            };
        },
    },
    ropro_delete_outfit: {
        path: "deleteOutfit.php",
        method: "POST",
        capability: "sandbox_outfits",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var outfitAssets = normalizeRoProNumericCsv(payload.outfitAssets, 80);
            if (userId == null || outfitAssets == null) {
                return null;
            }
            return {
                query: {
                    userid: userId,
                    outfitAssets: outfitAssets,
                },
            };
        },
    },
    ropro_load_outfits: {
        path: "loadOutfits.php",
        method: "POST",
        capability: "sandbox_outfits",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (userId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId,
                },
            };
        },
    },
    ropro_free_trial_time: {
        path: "freeTrialTime.php",
        method: "POST",
        requiresVerification: false,
        buildRequest: function() {
            return {
                query: null
            };
        },
    },
    ropro_handle_alert: {
        path: "handleRoProAlert.php",
        method: "GET",
        buildRequest: function(payload) {
            var timestamp = normalizeRoProInteger(payload.timestamp, {
                min: 1
            });
            if (timestamp == null) {
                return null;
            }
            return {
                query: {
                    timestamp: timestamp
                }
            };
        },
    },
    ropro_validate_user: {
        path: "validateUser.php",
        method: "POST",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var username = normalizeRoProString(payload.username, 64);
            var ageBracket = normalizeRoProInteger(payload.ageBracket, {
                min: 0,
                max: 100,
            });
            var isUnder13 = null;
            if (payload.isUnder13 === true || payload.isUnder13 === false) {
                isUnder13 = payload.isUnder13;
            }
            var ageVerified = null;
            if (payload.ageVerified === true || payload.ageVerified === false) {
                ageVerified = payload.ageVerified;
            }
            var verifiedAge = normalizeRoProInteger(payload.verifiedAge, {
                min: 0,
                max: 150,
            });
            var ageChecked = null;
            if (payload.ageChecked === true || payload.ageChecked === false) {
                ageChecked = payload.ageChecked;
            }
            if (userId == null || username == null) {
                return null;
            }
            var body = {
                user_id: userId,
                username: username,
            };
            if (ageBracket != null) {
                body.age_bracket = ageBracket;
            }
            if (isUnder13 != null) {
                body.is_under13 = isUnder13 ? 1 : 0;
            }
            if (ageVerified != null) {
                body.age_verified = ageVerified ? 1 : 0;
            }
            if (verifiedAge != null) {
                body.verified_age = verifiedAge;
            }
            if (ageChecked != null) {
                body.age_checked = ageChecked ? 1 : 0;
            }
            return {
                bodyType: "form",
                body: body,
            };
        },
    },
    ropro_ingame_verification: {
        path: "ingameVerification.php",
        method: "POST",
        buildRequest: function(payload) {
            var emojiVerificationCode = normalizeRoProString(
                payload.emojiVerificationCode,
                64
            );
            if (emojiVerificationCode == null) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    emoji_verification_code: emojiVerificationCode,
                },
            };
        },
    },
    ropro_get_subscription_with_key: {
        path: "getSubscription.php",
        method: "POST",
        buildRequest: function(payload) {
            var key = "";
            if (payload.key != null) {
                key = normalizeRoProString(payload.key, 256);
                if (key == null) {
                    key = "";
                }
            }
            return {
                query: {
                    key: key,
                    options_page: ""
                }
            };
        },
    },
    ropro_save_discord: {
        path: "saveDiscord.php",
        method: "POST",
        capability: "linked_discord",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var discord = normalizeRoProString(payload.discord, 64, {
                allowEmpty: true,
            });
            if (userId == null || discord == null) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    userid: userId,
                    discord: discord,
                },
            };
        },
    },
    ropro_submit_bug_report: {
        path: "submitBugReport.php",
        method: "POST",
        buildRequest: function(payload) {
            var relatedFeature = normalizeRoProString(payload.relatedFeature, 32);
            var description = normalizeRoProString(payload.description, 600);
            var stepsToReproduce = normalizeRoProString(payload.stepsToReproduce, 900);
            if (
                relatedFeature == null ||
                description == null ||
                stepsToReproduce == null
            ) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    related_feature: relatedFeature,
                    description: description,
                    steps_to_reproduce: stepsToReproduce,
                },
            };
        },
    },
    ropro_submit_feature_request: {
        path: "submitFeatureRequest.php",
        method: "POST",
        buildRequest: function(payload) {
            var requestedFeature = normalizeRoProString(payload.requestedFeature, 600);
            var reason = normalizeRoProString(payload.reason, 900);
            if (requestedFeature == null || reason == null) {
                return null;
            }
            return {
                bodyType: "form",
                body: {
                    requested_feature: requestedFeature,
                    reason: reason,
                },
            };
        },
    },
    ropro_get_profile_value_cache: {
        path: "profileValueCache.php",
        method: "POST",
        capability: "profile_value",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (userId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId
                }
            };
        },
    },
    ropro_get_user_info_test: {
        path: "getUserInfo.php",
        method: "POST",
        capability: "profile_value",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            var myId = normalizeRoProInteger(payload.myId, {
                min: 1
            });
            if (userId == null || myId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId,
                    myid: myId
                }
            };
        },
    },
    ropro_get_egg_collection: {
        path: "getEggCollection.php",
        method: "POST",
        buildRequest: function(payload) {
            var userId = normalizeRoProInteger(payload.userId, {
                min: 1
            });
            if (userId == null) {
                return null;
            }
            return {
                query: {
                    userid: userId
                }
            };
        },
    },
    ropro_post_reputation: {
        path: "postReputation.php",
        method: "POST",
        capability: "reputation_write",
        buildRequest: function(payload) {
            if (payload == null || typeof payload !== "object") {
                return null;
            }
            return {
                bodyType: "form",
                body: payload.reputation,
            };
        },
    },
};

async function requestRoProApiOperationResponse(operationName, payload) {
    if (
        ROPRO_API_OPERATIONS == null ||
        typeof ROPRO_API_OPERATIONS !== "object" ||
        !Object.prototype.hasOwnProperty.call(ROPRO_API_OPERATIONS, operationName)
    ) {
        return null;
    }
    var operation = ROPRO_API_OPERATIONS[operationName];
    var capabilityAllowed = await resolveRoProCapability(operation.capability);
    if (!capabilityAllowed) {
        return null;
    }
    var safePayload = payload != null && typeof payload === "object" ? payload : {};
    var requestConfig = operation.buildRequest(safePayload);
    if (requestConfig == null || typeof requestConfig !== "object") {
        return null;
    }
    try {
        return await sendRoProApiRequest(operationName, operation, requestConfig);
    } catch (e) {
        return null;
    }
}

async function executeRoProApiOperation(operationName, payload) {
    if (operationName === "ropro_get_egg_collection") {
        return {
            data: [],
            metadata: {
                numEggs: 0,
                linkName: "",
                linkUrl: "",
                displaySubheader: false,
                visible: false,
            },
            disabled: true,
        };
    }
    var response = await requestRoProApiOperationResponse(operationName, payload);
    if (response == null || !response.ok || response.status === 401 || response.status === 403) {
        return "ERROR";
    }
    try {
        var data = await response.text();
        return parseRoProApiResponseText(data);
    } catch (e) {
        return "ERROR";
    }
}

function isAllowedBackgroundMessageSender(sender) {
    if (sender == null || typeof sender !== "object") {
        return false;
    }

    if (typeof sender.id === "string") {
        return sender.id === chrome.runtime.id;
    }
    return false;
}

function sendInvalidMessageResponse(sendResponse, action, code) {
    sendResponse({
        ok: false,
        error: "invalid_message",
        code: code,
        action: action,
    });
}

var URL_PROXY_SCHEME_ALLOWLIST = Object.freeze(["https:"]);
var URL_PROXY_SCHEME_BLOCKLIST = Object.freeze([
    "javascript",
    "data",
    "vbscript",
    "file",
    "chrome",
    "chrome-extension",
    "safari-web-extension",
    "moz-extension",
    "moz",
    "app",
]);
var URL_PROXY_EVENT_LIMIT = 128;
var urlProxySecurityProbeLog = [];

function normalizeUrlControlChars(value) {
    return String(value == null ? "" : value).replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

function decodeUrlLikely(rawUrl) {
    var decoded = rawUrl;
    for (var i = 0; i < 3; i++) {
        try {
            var nextDecoded = decodeURIComponent(decoded);
            if (nextDecoded === decoded) {
                break;
            }
            decoded = nextDecoded;
        } catch (e) {
            break;
        }
    }
    return decoded;
}

function hasBlockedUrlScheme(rawUrl, parsedProtocol) {
    var normalizedProtocol = typeof parsedProtocol === "string" ? parsedProtocol.toLowerCase() : "";
    if (URL_PROXY_SCHEME_ALLOWLIST.indexOf(normalizedProtocol) === -1) {
        return true;
    }

    var normalizedUrl = String(rawUrl == null ? "" : rawUrl).trim().toLowerCase();
    var normalizedUrlControlFree = normalizeUrlControlChars(normalizedUrl);
    var decodedUrl = decodeUrlLikely(normalizedUrlControlFree);
    var checkedUrls = [normalizedUrlControlFree, decodedUrl];

    for (var i = 0; i < URL_PROXY_SCHEME_BLOCKLIST.length; i++) {
        var blockedScheme = URL_PROXY_SCHEME_BLOCKLIST[i];
        var blockedPrefix = blockedScheme + ":";
        var blockedBypass = blockedScheme + "-";
        for (var j = 0; j < checkedUrls.length; j++) {
            var candidate = checkedUrls[j];
            if (candidate.indexOf(blockedPrefix) === 0) {
                return true;
            }
            if (candidate.indexOf(blockedBypass) === 0) {
                return true;
            }
            if (candidate.indexOf(blockedPrefix + "%") === 0) {
                return true;
            }
            if (candidate.indexOf(blockedBypass + "%") === 0) {
                return true;
            }
        }
    }
    return false;
}

function isProxyAllowedHostname(hostname, policy) {
    var normalizedHostname = String(hostname == null ? "" : hostname).toLowerCase();
    if (normalizedHostname.length === 0) {
        return false;
    }

    var exactHosts = policy == null || !Array.isArray(policy.exactHosts) ? [] : policy.exactHosts;
    for (var i = 0; i < exactHosts.length; i++) {
        if (normalizedHostname === exactHosts[i]) {
            return true;
        }
    }

    var suffixHosts = policy == null || !Array.isArray(policy.suffixHosts) ? [] : policy.suffixHosts;
    for (var j = 0; j < suffixHosts.length; j++) {
        var suffix = suffixHosts[j];
        if (
            normalizedHostname === suffix.replace(/^\./, "") ||
            normalizedHostname.indexOf(suffix) === normalizedHostname.length - suffix.length
        ) {
            return true;
        }
    }

    return false;
}

function isProxyAllowedPath(pathname, policy) {
    var normalizedPath = pathname == null ? "/" : String(pathname);
    if (normalizedPath.length === 0) {
        normalizedPath = "/";
    }
    var allowedPathPrefixes =
        policy == null || !Array.isArray(policy.allowedPathPrefixes) || policy.allowedPathPrefixes.length === 0 ?
        ["/"] :
        policy.allowedPathPrefixes;
    for (var i = 0; i < allowedPathPrefixes.length; i++) {
        var prefix = allowedPathPrefixes[i];
        if (prefix === "/" || normalizedPath === prefix || normalizedPath.indexOf(prefix) === 0) {
            return true;
        }
    }
    return false;
}

var URL_PROXY_POLICIES = Object.freeze({
    default: Object.freeze({
        exactHosts: Object.freeze(["roblox.com", "www.roblox.com"]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze(["/"]),
    }),
    GetURL: Object.freeze({
        exactHosts: Object.freeze([
            "roblox.com",
            "www.roblox.com",
            "node.ropro.io",
            "apis.roblox.com",
            "trades.roblox.com",
            "games.roblox.com",
            "users.roblox.com",
            "thumbnails.roblox.com",
            "search.roblox.com",
            "friends.roblox.com",
            "economy.roblox.com",
            "catalog.roblox.com",
            "assetgame.roblox.com",
            "avatar.roblox.com",
        ]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze([
            "/experiences/",
            "/v1/",
            "/thumbnails/",
            "/games/getgameinstancesjson",
            "/Game/PlaceLauncher.ashx",
            "/assetgame/Game/PlaceLauncher.ashx",
            "/search-api/omni-search",
            "/marketplace-sales/v1/",
            "/explore-api/v1/",
            "/catalog/json",
        ]),
    }),
    GetURLCached: Object.freeze({
        exactHosts: Object.freeze([
            "roblox.com",
            "www.roblox.com",
            "apis.roblox.com",
            "trades.roblox.com",
            "games.roblox.com",
            "users.roblox.com",
            "thumbnails.roblox.com",
            "search.roblox.com",
            "friends.roblox.com",
            "economy.roblox.com",
            "catalog.roblox.com",
            "assetgame.roblox.com",
            "avatar.roblox.com",
        ]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze([
            "/v1/",
            "/thumbnails/",
            "/games/getgameinstancesjson",
            "/Game/PlaceLauncher.ashx",
            "/assetgame/Game/PlaceLauncher.ashx",
            "/search-api/omni-search",
            "/marketplace-sales/v1/",
            "/explore-api/v1/",
            "/catalog/json",
        ]),
    }),
    GetStatusCode: Object.freeze({
        exactHosts: Object.freeze([
            "roblox.com",
            "www.roblox.com",
            "apis.roblox.com",
            "trades.roblox.com",
            "games.roblox.com",
            "users.roblox.com",
            "thumbnails.roblox.com",
            "search.roblox.com",
            "friends.roblox.com",
            "economy.roblox.com",
            "catalog.roblox.com",
            "assetgame.roblox.com",
            "avatar.roblox.com",
        ]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze([
            "/v1/",
            "/thumbnails/",
            "/games/getgameinstancesjson",
            "/Game/PlaceLauncher.ashx",
            "/assetgame/Game/PlaceLauncher.ashx",
            "/search-api/omni-search",
            "/marketplace-sales/v1/",
            "/explore-api/v1/",
            "/catalog/json",
        ]),
    }),
    PostURL: Object.freeze({
        exactHosts: Object.freeze([
            "roblox.com",
            "www.roblox.com",
            "apis.roblox.com",
            "trades.roblox.com",
            "games.roblox.com",
            "users.roblox.com",
            "thumbnails.roblox.com",
            "search.roblox.com",
            "friends.roblox.com",
            "economy.roblox.com",
            "catalog.roblox.com",
            "assetgame.roblox.com",
            "avatar.roblox.com",
        ]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze([
            "/v1/",
            "/thumbnails/",
            "/games/getgameinstancesjson",
            "/Game/PlaceLauncher.ashx",
            "/assetgame/Game/PlaceLauncher.ashx",
            "/search-api/omni-search",
            "/marketplace-sales/v1/",
            "/explore-api/v1/",
            "/catalog/json",
        ]),
    }),
    PostValidatedURL: Object.freeze({
        exactHosts: Object.freeze([
            "roblox.com",
            "www.roblox.com",
            "apis.roblox.com",
            "trades.roblox.com",
            "games.roblox.com",
            "users.roblox.com",
            "thumbnails.roblox.com",
            "search.roblox.com",
            "friends.roblox.com",
            "economy.roblox.com",
            "catalog.roblox.com",
            "assetgame.roblox.com",
            "avatar.roblox.com",
        ]),
        suffixHosts: Object.freeze([".roblox.com", ".rbxcdn.com"]),
        allowedPathPrefixes: Object.freeze([
            "/v1/",
            "/v2/avatar/set-wearing-assets",
            "/thumbnails/",
            "/games/getgameinstancesjson",
            "/Game/PlaceLauncher.ashx",
            "/assetgame/Game/PlaceLauncher.ashx",
            "/search-api/omni-search",
            "/marketplace-sales/v1/",
            "/explore-api/v1/",
            "/catalog/json",
        ]),
    }),
});

function getUrlActionPolicy(action) {
    if (action === "GetURL") {
        return URL_PROXY_POLICIES.GetURL;
    }
    if (action === "GetURLCached") {
        return URL_PROXY_POLICIES.GetURLCached;
    }
    if (action === "GetStatusCode") {
        return URL_PROXY_POLICIES.GetStatusCode;
    }
    if (action === "PostURL") {
        return URL_PROXY_POLICIES.PostURL;
    }
    if (action === "PostValidatedURL") {
        return URL_PROXY_POLICIES.PostValidatedURL;
    }
    return URL_PROXY_POLICIES.default;
}

function getUrlPolicyLabel(policy) {
    if (policy === URL_PROXY_POLICIES.GetURL) {
        return "GetURL";
    }
    if (policy === URL_PROXY_POLICIES.GetURLCached) {
        return "GetURLCached";
    }
    if (policy === URL_PROXY_POLICIES.GetStatusCode) {
        return "GetStatusCode";
    }
    if (policy === URL_PROXY_POLICIES.PostURL) {
        return "PostURL";
    }
    if (policy === URL_PROXY_POLICIES.PostValidatedURL) {
        return "PostValidatedURL";
    }
    return "default";
}

function recordUrlProxyProbe(action, status, rawUrl, reason, parsedUrl, policy) {
    urlProxySecurityProbeLog.push({
        action: action,
        status: status,
        reason: reason,
        policy: getUrlPolicyLabel(policy),
        host: parsedUrl == null ? null : parsedUrl.hostname,
        path: parsedUrl == null ? null : parsedUrl.pathname,
        url: rawUrl,
        timestamp: Date.now(),
    });
    if (urlProxySecurityProbeLog.length > URL_PROXY_EVENT_LIMIT) {
        urlProxySecurityProbeLog.shift();
    }
}

function getUrlProxySecurityProbeState() {
    return {
        total: urlProxySecurityProbeLog.length,
        events: urlProxySecurityProbeLog.slice(),
    };
}

function resetUrlProxySecurityProbeState() {
    urlProxySecurityProbeLog = [];
    return true;
}

function normalizeMessageUrl(value, action) {
    if (typeof value !== "string") {
        return null;
    }
    var normalized = normalizeRoProString(value, 2048);
    if (normalized == null) {
        return null;
    }
    try {
        var parsedUrl = new URL(normalized);
        if (hasBlockedUrlScheme(normalized, parsedUrl.protocol)) {
            recordUrlProxyProbe(action, "deny", normalized, "blocked_scheme", parsedUrl, getUrlActionPolicy(action));
            return null;
        }
        var policy = getUrlActionPolicy(action);
        if (!isProxyAllowedHostname(parsedUrl.hostname, policy)) {
            recordUrlProxyProbe(action, "deny", normalized, "blocked_host", parsedUrl, policy);
            return null;
        }
        if (!isProxyAllowedPath(parsedUrl.pathname, policy)) {
            recordUrlProxyProbe(action, "deny", normalized, "blocked_path", parsedUrl, policy);
            return null;
        }
        recordUrlProxyProbe(action, "allow", normalized, "allowed", parsedUrl, policy);
        return parsedUrl.toString();
    } catch (e) {
        recordUrlProxyProbe(action, "deny", value, "invalid_url", null, getUrlActionPolicy(action));
        return null;
    }
}

function normalizeMessagePayload(value) {
    if (typeof value === "string") {
        return value;
    }
    if (value == null) {
        return "";
    }
    var valueType = typeof value;
    if (valueType === "number" || valueType === "boolean" || valueType === "object") {
        return JSON.stringify(value);
    }
    return null;
}

function hasExactMessageKeys(request, allowedKeys, requiredKeys) {
    if (request == null || typeof request !== "object" || Array.isArray(request)) {
        return false;
    }
    var keyMap = {};
    for (var i = 0; i < allowedKeys.length; i++) {
        keyMap[allowedKeys[i]] = true;
    }
    var keys = Object.keys(request);
    for (var j = 0; j < keys.length; j++) {
        if (!keyMap[keys[j]]) {
            return false;
        }
    }
    for (var k = 0; k < requiredKeys.length; k++) {
        if (!Object.prototype.hasOwnProperty.call(request, requiredKeys[k])) {
            return false;
        }
    }
    return true;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!isAllowedBackgroundMessageSender(sender)) {
        sendInvalidMessageResponse(sendResponse, "forbidden", "invalid_sender");
        return true;
    }

    var requestAction =
        request != null &&
        typeof request === "object" &&
        !Array.isArray(request) &&
        typeof request.greeting === "string" ?
        normalizeRoProString(request.greeting, 64) :
        null;
    if (requestAction == null) {
        sendInvalidMessageResponse(sendResponse, "unknown", "missing_or_invalid_greeting");
        return true;
    }

    switch (requestAction) {
        case "RoProApiRequest":
            if (
                !hasExactMessageKeys(request, ["greeting", "operation", "payload"], [
                    "greeting",
                    "operation",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "operation"], [
                    "greeting",
                    "operation",
                ])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var operationName = normalizeRoProString(request.operation, 128);
            var operationPayload =
                request.payload == null ? {} : request.payload;
            if (operationName == null || typeof operationPayload !== "object") {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_request");
                break;
            }
            executeRoProApiOperation(operationName, operationPayload)
                .then(function(data) {
                    sendResponse(data);
                })
                .catch(function() {
                    sendResponse("ERROR");
                });
            break;
        case "GetURL":
            if (
                !hasExactMessageKeys(request, ["greeting", "url"], ["greeting", "url"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var messageUrl = normalizeMessageUrl(request.url, "GetURL");
            if (messageUrl == null) {
                sendResponse("ERROR");
                break;
            }
            if (isRoProUrl(messageUrl)) {
                recordUrlProxyProbe("GetURL", "deny", messageUrl, "self_call_blocked", null, getUrlActionPolicy("GetURL"));
                sendResponse("ERROR");
                break;
            }
            fetch(messageUrl)
                .then(async (response) => {
                    if (response.ok) {
                        var data = await response.text();
                        return data;
                    } else {
                        throw new Error("Get failed");
                    }
                })
                .then((data) => {
                    try {
                        var json_data = JSON.parse(data);
                        sendResponse(json_data);
                    } catch (e) {
                        sendResponse(data);
                    }
                })
                .catch(function() {
                    sendResponse("ERROR");
                });
            break;
        case "GetURLCached":
            if (
                !hasExactMessageKeys(request, ["greeting", "url"], ["greeting", "url"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var messageCachedUrl = normalizeMessageUrl(request.url, "GetURLCached");
            if (messageCachedUrl == null) {
                sendResponse("ERROR");
                break;
            }
            if (isRoProUrl(messageCachedUrl)) {
                recordUrlProxyProbe("GetURLCached", "deny", messageCachedUrl, "self_call_blocked", null, getUrlActionPolicy("GetURLCached"));
                sendResponse("ERROR");
                break;
            }
            fetch(messageCachedUrl, {
                    headers: {
                        "Cache-Control": "public, max-age=604800",
                        Pragma: "public, max-age=604800",
                    },
                })
                .then(async (response) => {
                    if (response.ok) {
                        var data = await response.text();
                        return data;
                    } else {
                        throw new Error("Get with cache failed");
                    }
                })
                .then((data) => {
                    try {
                        var json_data = JSON.parse(data);
                        sendResponse(json_data);
                    } catch (e) {
                        sendResponse(data);
                    }
                })
                .catch(function() {
                    sendResponse("ERROR");
                });
            break;
        case "PostURL":
            if (
                !hasExactMessageKeys(request, ["greeting", "url", "jsonData"], [
                    "greeting",
                    "url",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "url"], ["greeting", "url"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var postUrl = normalizeMessageUrl(request.url, "PostURL");
            if (postUrl == null) {
                sendResponse("ERROR");
                break;
            }
            if (isRoProUrl(postUrl)) {
                recordUrlProxyProbe("PostURL", "deny", postUrl, "self_call_blocked", null, getUrlActionPolicy("PostURL"));
                sendResponse("ERROR");
                break;
            }
            var postBody = normalizeMessagePayload(request.jsonData);
            if (postBody == null) {
                sendResponse("ERROR");
                break;
            }
            fetch(postUrl, {
                    method: "POST",
                    body: postBody,
                })
                .then((response) => response.text())
                .then((data) => {
                    sendResponse(data);
                })
                .catch(function() {
                    sendResponse("ERROR");
                });
            break;
        case "PostValidatedURL":
            if (
                !hasExactMessageKeys(request, ["greeting", "url", "jsonData"], [
                    "greeting",
                    "url",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "url"], ["greeting", "url"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var validatedUrl = normalizeMessageUrl(request.url, "PostValidatedURL");
            var validatedBody = normalizeMessagePayload(request.jsonData);
            if (validatedUrl == null || validatedBody == null) {
                sendResponse(null);
                break;
            }
            if (isRoProUrl(validatedUrl)) {
                recordUrlProxyProbe("PostValidatedURL", "deny", validatedUrl, "self_call_blocked", null, getUrlActionPolicy("PostValidatedURL"));
                sendResponse(null);
                break;
            }

            function hasErrorEntries(data) {
                return (
                    data != null &&
                    typeof data === "object" &&
                    Array.isArray(data.errors) &&
                    data.errors.length > 0
                );
            }

            function isXsrfTokenErrorPayload(data) {
                if (!hasErrorEntries(data)) {
                    return false;
                }
                for (var i = 0; i < data.errors.length; i++) {
                    var error = data.errors[i];
                    if (error == null || typeof error !== "object") {
                        continue;
                    }
                    var message = typeof error.message === "string" ? error.message.toLowerCase() : "";
                    if (
                        message.includes("xsrf token invalid") ||
                        message.includes("token validation failed")
                    ) {
                        return true;
                    }
                }
                return false;
            }
            async function postValidatedUrlWithRetry(hasRetried) {
                if (myToken == null && !hasRetried) {
                    try {
                        await loadToken();
                    } catch (e) {}
                }
                try {
                    var response = await fetch(validatedUrl, {
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": myToken,
                            "Content-Type": "application/json",
                        },
                        body: validatedBody,
                    });
                    var data = null;
                    try {
                        data = await response.json();
                    } catch (e) {}
                    if (response.ok) {
                        if (data == null) {
                            return {
                                success: true
                            };
                        }
                        if (typeof data !== "object" || data == null || !hasErrorEntries(data)) {
                            return data;
                        }
                    }
                    var hasXsrfError = isXsrfTokenErrorPayload(data);
                    if (!hasRetried && (response.status === 403 || hasXsrfError)) {
                        var headerToken = response.headers.get("x-csrf-token");
                        if (typeof headerToken === "string" && headerToken.length > 0) {
                            myToken = headerToken;
                            await setLocalStorage("token", headerToken);
                        } else {
                            try {
                                await loadToken();
                            } catch (e) {}
                        }
                        return await postValidatedUrlWithRetry(true);
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
            postValidatedUrlWithRetry(false)
                .then(function(data) {
                    sendResponse(data);
                })
                .catch(function() {
                    sendResponse(null);
                });
            break;
        case "GetStatusCode":
            if (
                !hasExactMessageKeys(request, ["greeting", "url"], ["greeting", "url"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var statusUrl = normalizeMessageUrl(request.url, "GetStatusCode");
            if (statusUrl == null) {
                sendResponse("ERROR");
                break;
            }
            if (isRoProUrl(statusUrl)) {
                recordUrlProxyProbe("GetStatusCode", "deny", statusUrl, "self_call_blocked", null, getUrlActionPolicy("GetStatusCode"));
                sendResponse("ERROR");
                break;
            }
            fetch(statusUrl)
                .then((response) => sendResponse(response.status))
                .catch(function() {
                    sendResponse(null);
                });
            break;
        case "ValidateLicense":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            getSubscription();
            break;
        case "DeclineTrade":
            if (!hasExactMessageKeys(request, ["greeting", "tradeId"], ["greeting", "tradeId"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var tradeId = normalizeRoProInteger(request.tradeId, {
                min: 1,
            });
            if (tradeId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_trade_id");
                break;
            }
            fetch("https://trades.roblox.com/v1/trades/" + tradeId + "/decline", {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": myToken
                    },
                })
                .then((response) => {
                    if (response.ok) {
                        sendResponse(response.status);
                    } else {
                        if (response.status == 403) {
                            fetch(
                                "https://trades.roblox.com/v1/trades/" +
                                parseInt(request.tradeId) +
                                "/decline", {
                                    method: "POST",
                                    headers: {
                                        "X-CSRF-TOKEN": response.headers.get("x-csrf-token"),
                                    },
                                }
                            ).then((response) => {
                                sendResponse(response.status);
                            });
                        } else {
                            sendResponse(response.status);
                        }
                    }
                });
            break;
        case "GetUserID":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            getCurrentAuthenticatedUserId()
                .then((userId) => {
                    sendResponse(userId);
                })
                .catch(function() {
                    sendResponse(null);
                });
            break;
        case "GetCachedTrades":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            sendResponse(inboundsCache);
            break;
        case "DoCacheTrade":
            if (!hasExactMessageKeys(request, ["greeting", "tradeId"], ["greeting", "tradeId"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var tradeIdToCache = normalizeRoProInteger(request.tradeId, {
                min: 1,
            });
            if (tradeIdToCache == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_trade_id");
                break;
            }

            function loadInbound(id) {
                if (id in inboundsCache && inboundsCache[id] != null) {
                    sendResponse([inboundsCache[id], 1]);
                } else {
                    async function loadTradeDetails() {
                        var myUserId = await getCurrentAuthenticatedUserId();
                        var result = await requestTradeDetailV2(id, myUserId);
                        if (result.ok) {
                            var normalizedTrade = result.trade;
                            inboundsCache[normalizedTrade.id] = normalizedTrade;
                            sendResponse([normalizedTrade, 0]);
                        } else {
                            sendResponse(result.status);
                        }
                    }
                    loadTradeDetails();
                }
            }
            loadInbound(tradeIdToCache);
            break;
        case "GetUsername":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getUsername() {
                var username = await getStorage("rpUsername");
                sendResponse(username);
            }
            getUsername();
            break;
        case "GetUserTradableInventory":
            if (
                !hasExactMessageKeys(request, ["greeting", "userID", "allowStale", "prewarm"], [
                    "greeting",
                    "userID",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var tradableUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (tradableUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function getTradableInventory() {
                var result = await getSharedTradableInventory(tradableUserId, {
                    allowStale: request.allowStale !== false,
                    refreshStale: true,
                });
                if (request.prewarm === true) {
                    sendResponse({
                        ok: result.ok === true,
                        data: [],
                        cacheStatus: result != null && typeof result === "object" ? result.cacheStatus : null,
                    });
                    return;
                }
                if (result.ok) {
                    var inventory = result.data;
                    sendResponse({
                        ok: true,
                        data: inventory,
                        cacheStatus: result.cacheStatus || "network",
                    });
                } else {
                    sendResponse({
                        ok: false,
                        code: result.code || "failed",
                        error: result.error || "Failed to load tradable inventory.",
                        data: [],
                    });
                }
            }
            getTradableInventory();
            break;
        case "GetUserQuickEquipInventory":
            if (
                !hasExactMessageKeys(request, ["greeting", "userID", "allowStale", "prewarm"], [
                    "greeting",
                    "userID",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var quickEquipUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (quickEquipUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function getQuickEquipInventory() {
                var result = await getSharedQuickEquipInventory(quickEquipUserId, {
                    allowStale: request.allowStale !== false,
                    refreshStale: true,
                });
                if (request.prewarm === true) {
                    sendResponse({
                        ok: result.ok === true,
                        data: [],
                        cacheStatus: result != null && typeof result === "object" ? result.cacheStatus : null,
                    });
                    return;
                }
                if (result.ok) {
                    sendResponse({
                        ok: true,
                        data: result.data,
                        cacheStatus: result.cacheStatus || "network",
                    });
                } else {
                    sendResponse({
                        ok: false,
                        code: result.code || "failed",
                        error: result.error || "Failed to load quick equip inventory.",
                        data: [],
                    });
                }
            }
            getQuickEquipInventory();
            break;
        case "ServerFilterReverseOrder":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var reverseGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (reverseGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getServerFilterReverseOrder() {
                var serverList = await serverFilterReverseOrder(reverseGameId);
                sendResponse(serverList);
            }
            getServerFilterReverseOrder();
            break;
        case "ServerFilterNotFull":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var notFullGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (notFullGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getServerFilterNotFull() {
                var serverList = await serverFilterNotFull(notFullGameId);
                sendResponse(serverList);
            }
            getServerFilterNotFull();
            break;
        case "ServerFilterRandomShuffle":
            if (
                !hasExactMessageKeys(
                    request,
                    ["greeting", "gameID", "minServers", "refresh"],
                    ["greeting", "gameID"]
                )
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var randomShuffleGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            var randomMinServers = normalizeRoProInteger(request.minServers, {
                min: 1
            });
            if (randomShuffleGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            if (request.minServers != null && randomMinServers == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_min_servers");
                break;
            }
            async function getServerFilterRandomShuffle() {
                var serverList = await serverFilterRandomShuffle(
                    randomShuffleGameId,
                    randomMinServers,
                    request.refresh === true
                );
                sendResponse(serverList);
            }
            getServerFilterRandomShuffle();
            break;
        case "GetServerPingHints":
            if (
                !hasExactMessageKeys(
                    request,
                    ["greeting", "gameID", "minServers", "refresh", "sortOrder"],
                    ["greeting", "gameID"]
                )
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var pingGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            var pingMinServers = normalizeRoProInteger(request.minServers, {
                min: 1
            });
            if (pingGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            if (request.minServers != null && pingMinServers == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_min_servers");
                break;
            }
            async function getServerPingHintRows() {
                var pingHintRows = await getServerPingHints(
                    pingGameId,
                    pingMinServers,
                    request.refresh === true,
                    request.sortOrder
                );
                sendResponse(pingHintRows);
            }
            getServerPingHintRows();
            break;
        case "PrimeServerFilterCache":
            if (!hasExactMessageKeys(request, ["greeting", "gameID", "refresh"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var primeGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (primeGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function primeServerFilterCache() {
                var cacheStatus = await primeRoProServerFilterSample(
                    primeGameId,
                    request.refresh === true
                );
                sendResponse(cacheStatus);
            }
            primeServerFilterCache();
            break;
        case "ServerFilterBestConnection":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var bestConnGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (bestConnGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getServerFilterBestConnection() {
                var serverList = await serverFilterBestConnection(bestConnGameId);
                sendResponse(serverList);
            }
            getServerFilterBestConnection();
            break;
        case "ServerFilterNewestServers":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var newestGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (newestGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getServerFilterNewestServers() {
                var serverList = await serverFilterNewestServers(newestGameId);
                sendResponse(serverList);
            }
            getServerFilterNewestServers();
            break;
        case "ServerFilterOldestServers":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var oldestGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (oldestGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getServerFilterOldestServers() {
                var serverList = await serverFilterOldestServers(oldestGameId);
                sendResponse(serverList);
            }
            getServerFilterOldestServers();
            break;
        case "ServerFilterMaxPlayers":
            if (
                !hasExactMessageKeys(request, ["greeting", "gameID", "count"], [
                    "greeting",
                    "gameID",
                    "count",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "gameID"], [
                    "greeting",
                    "gameID",
                ])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var maxPlayerGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            var maxPlayerCount = normalizeRoProInteger(request.count, {
                min: 1
            });
            if (maxPlayerGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            if (request.count != null && maxPlayerCount == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_count");
                break;
            }
            async function getServerFilterMaxPlayers() {
                var servers = await maxPlayerCount(maxPlayerGameId, maxPlayerCount);
                sendResponse(servers);
            }
            getServerFilterMaxPlayers();
            break;
        case "GetRandomServer":
            if (!hasExactMessageKeys(request, ["greeting", "gameID"], ["greeting", "gameID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var randomServerGameId = normalizeRoProInteger(request.gameID, {
                min: 1
            });
            if (randomServerGameId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_game_id");
                break;
            }
            async function getRandomServer() {
                var randomServerElement = await randomServer(randomServerGameId);
                sendResponse(randomServerElement);
            }
            getRandomServer();
            break;
        case "GetProfileValue":
            if (
                !hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var profileUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (profileUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            getProfileValue(profileUserId)
                .then(sendResponse)
                .catch(function() {
                    sendResponse({
                        value: "Unavailable"
                    });
                });
            break;
        case "GetSetting":
            if (!hasExactMessageKeys(request, ["greeting", "setting"], ["greeting", "setting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getSettings() {
                var setting = await loadSettings(request.setting);
                sendResponse(setting);
            }
            getSettings();
            break;
        case "GetVisualGate":
            if (
                !hasExactMessageKeys(request, ["greeting", "gateKey"], [
                    "greeting",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "gate"], [
                    "greeting",
                ])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getVisualGate() {
                var gate = normalizeRoProString(request.gateKey != null ? request.gateKey : request.gate, 128);
                if (gate == null) {
                    sendInvalidMessageResponse(sendResponse, requestAction, "invalid_visual_gate_key");
                    return;
                }
                gate = await loadVisualGateState(gate);
                sendResponse(gate);
            }
            getVisualGate();
            break;
        case "GetVisualGates":
            if (!hasExactMessageKeys(request, ["greeting", "gates"], ["greeting", "gates"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getVisualGates() {
                if (!Array.isArray(request.gates)) {
                    sendResponse({});
                    return;
                }
                var gates = await loadVisualGateStates(request.gates);
                sendResponse(gates);
            }
            getVisualGates();
            break;
        case "GetUrlProxySecurityProbeState":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            sendResponse(getUrlProxySecurityProbeState());
            break;
        case "ResetUrlProxySecurityProbeState":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            sendResponse(resetUrlProxySecurityProbeState());
            break;
        case "GetTrades":
            if (!hasExactMessageKeys(request, ["greeting", "type"], ["greeting", "type"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getTradesType(type) {
                if (type == null || type.length === 0) {
                    sendInvalidMessageResponse(sendResponse, requestAction, "invalid_trade_type");
                    return;
                }
                var tradesType = await loadTradesType(type);
                sendResponse(tradesType);
            }
            getTradesType(normalizeRoProString(request.type, 45));
            break;
        case "GetTradesData":
            if (!hasExactMessageKeys(request, ["greeting", "type"], ["greeting", "type"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getTradesData(type) {
                if (type == null || type.length === 0) {
                    sendInvalidMessageResponse(sendResponse, requestAction, "invalid_trade_type");
                    return;
                }
                var tradesData = await loadTradesData(type);
                sendResponse(tradesData);
            }
            getTradesData(normalizeRoProString(request.type, 45));
            break;
        case "GetSettingValidity":
            if (!hasExactMessageKeys(request, ["greeting", "setting"], ["greeting", "setting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getSettingValidity() {
                var valid = await loadSettingValidity(request.setting);
                sendResponse(valid);
            }
            getSettingValidity();
            break;
        case "GetSettingValidityInfo":
            if (!hasExactMessageKeys(request, ["greeting", "setting"], ["greeting", "setting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getSettingValidityInfo() {
                var valid = await loadSettingValidityInfo(request.setting);
                sendResponse(valid);
            }
            getSettingValidityInfo();
            break;
        case "CheckVerification":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function getUserVerification() {
                sendResponse(await isCurrentUserVerified());
            }
            getUserVerification();
            return true;
            break;
        case "HandleUserVerification":
            if (
                !hasExactMessageKeys(request, ["greeting", "verification_code"], [
                    "greeting",
                    "verification_code",
                ])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function doUserVerification() {
                if (typeof request.verification_code !== "string") {
                    sendInvalidMessageResponse(sendResponse, requestAction, "invalid_verification_code");
                    return;
                }
                await verifyUser(request.verification_code);
                sendResponse(await isCurrentUserVerified());
            }
            doUserVerification();
            return true;
            break;
        case "SyncSettings":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            setLocalStorage("rpSubscriptionFreshness", 0);
            getSubscription().then(async function() {
                sendResponse("sync");
            });
            break;
        case "SyncLastOnlinePresence":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            refreshRoProLastOnlinePresence(true)
                .then(sendResponse)
                .catch(function() {
                    sendResponse("ERROR");
                });
            break;
        case "OpenOptions":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            chrome.tabs.create({
                url: chrome.runtime.getURL("/options.html")
            });
            break;
        case "GetSubscription":
            if (!hasExactMessageKeys(request, ["greeting", "setting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            getSubscription().then(sendResponse);
            break;
        case "DeclineBots":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            async function doDeclineBots() {
                var tradesDeclined = await declineBots();
                sendResponse(tradesDeclined);
            }
            doDeclineBots();
            break;
        case "GetMutualFriends":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var mutualUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (mutualUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualFriends() {
                var mutuals = await mutualFriends(mutualUserId);
                sendResponse(mutuals);
            }
            doGetMutualFriends();
            break;
        case "GetMutualFollowers":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var followerUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (followerUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualFollowers() {
                var mutuals = await mutualFollowers(followerUserId);
                sendResponse(mutuals);
            }
            doGetMutualFollowers();
            break;
        case "GetMutualFollowing":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var followingUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (followingUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualFollowing() {
                var mutuals = await mutualFollowing(followingUserId);
                sendResponse(mutuals);
            }
            doGetMutualFollowing();
            break;
        case "GetMutualFavorites":
            if (
                !hasExactMessageKeys(request, ["greeting", "userID", "assetType"], [
                    "greeting",
                    "userID",
                ]) &&
                !hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])
            ) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var favoritesUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            var favoriteAssetType = normalizeRoProInteger(request.assetType, {
                min: 1
            });
            if (favoritesUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            if (request.assetType != null && favoriteAssetType == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_asset_type");
                break;
            }
            async function doGetMutualFavorites() {
                var mutuals = await mutualFavorites(favoritesUserId, favoriteAssetType);
                sendResponse(mutuals);
            }
            doGetMutualFavorites();
            break;
        case "GetMutualBadges":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var badgeUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (badgeUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualBadges() {
                var mutuals = await mutualFavorites(badgeUserId, request.assetType);
                sendResponse(mutuals);
            }
            doGetMutualBadges();
            break;
        case "GetMutualGroups":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var groupUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (groupUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualGroups() {
                var mutuals = await mutualGroups(groupUserId);
                sendResponse(mutuals);
            }
            doGetMutualGroups();
            break;
        case "GetMutualLimiteds":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var limitedUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (limitedUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualLimiteds() {
                var mutuals = await mutualLimiteds(limitedUserId);
                sendResponse(mutuals);
            }
            doGetMutualLimiteds();
            break;
        case "GetMutualItems":
            if (!hasExactMessageKeys(request, ["greeting", "userID"], ["greeting", "userID"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var itemUserId = normalizeRoProInteger(request.userID, {
                min: 1
            });
            if (itemUserId == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_user_id");
                break;
            }
            async function doGetMutualItems() {
                var mutuals = await mutualItems(itemUserId);
                sendResponse(mutuals);
            }
            doGetMutualItems();
            break;
        case "GetItemValues":
            if (!hasExactMessageKeys(request, ["greeting", "assetIds"], ["greeting", "assetIds"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            fetchItemValues(request.assetIds).then(sendResponse);
            break;
        case "CreateInviteTab":
            if (!hasExactMessageKeys(request, ["greeting", "placeid", "key"], ["greeting", "placeid", "key"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            var invitePlaceId = normalizeRoProInteger(request.placeid, {
                min: 1
            });
            var inviteKey = normalizeRoProString(request.key, 64);
            if (invitePlaceId == null || inviteKey == null) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_invite_payload");
                break;
            }
            inviteKey = inviteKey.substring(0, 6).replace(/[^0-9a-z-]/gi, "");
            if (inviteKey.length === 0) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_invite_payload");
                return;
            }
            chrome.tabs.create({
                    url: "https://www.roblox.com/games/" + invitePlaceId,
                    active: true,
                },
                function(tab) {
                    chrome.tabs.onUpdated.addListener(function tempListener(tabId, info) {
                        if (tabId == tab.id && info.status === "complete") {
                            function sendInvitePayload(retriesLeft) {
                                chrome.tabs.sendMessage(tabId, {
                                    type: "invite",
                                    key: inviteKey,
                                }, function() {
                                    if (chrome.runtime.lastError != null && retriesLeft > 0) {
                                        setTimeout(function() {
                                            sendInvitePayload(retriesLeft - 1);
                                        }, 600);
                                    }
                                });
                            }
                            sendInvitePayload(4);
                            chrome.tabs.onUpdated.removeListener(tempListener);
                            setTimeout(function() {
                                sendResponse(tab);
                            }, 2000);
                        }
                    });
                }
            );
            break;
        case "UpdateGlobalTheme":
            async function doLoadGlobalTheme() {
                await loadGlobalTheme();
                sendResponse();
            }
            doLoadGlobalTheme();
            break;
        case "ClearExtensionCache":
            if (!hasExactMessageKeys(request, ["greeting"], ["greeting"])) {
                sendInvalidMessageResponse(sendResponse, requestAction, "invalid_message_shape");
                break;
            }
            (async function() {
                try {
                    var PRESERVE_LOCAL_KEYS = ["timePlayed", "mostRecentServers"];
                    var PRESERVE_SYNC_KEYS = ["rpSettings"];

                    // Preserve local keys
                    var preserved = {};
                    for (var pi = 0; pi < PRESERVE_LOCAL_KEYS.length; pi++) {
                        var pVal = await getLocalStorage(PRESERVE_LOCAL_KEYS[pi]);
                        if (typeof pVal !== "undefined") {
                            preserved[PRESERVE_LOCAL_KEYS[pi]] = pVal;
                        }
                    }

                    // Preserve sync keys
                    var preservedSync = {};
                    for (var si = 0; si < PRESERVE_SYNC_KEYS.length; si++) {
                        var sVal = await getStorage(PRESERVE_SYNC_KEYS[si]);
                        if (typeof sVal !== "undefined") {
                            preservedSync[PRESERVE_SYNC_KEYS[si]] = sVal;
                        }
                    }

                    console.log("[RoPro] ClearExtensionCache: preserved local keys:", Object.keys(preserved));
                    console.log("[RoPro] ClearExtensionCache: preserved sync keys:", Object.keys(preservedSync));

                    // Clear both storage areas
                    await new Promise(function(resolve) {
                        chrome.storage.local.clear(resolve);
                    });
                    console.log("[RoPro] ClearExtensionCache: chrome.storage.local.clear() completed");

                    await new Promise(function(resolve) {
                        chrome.storage.sync.clear(resolve);
                    });
                    console.log("[RoPro] ClearExtensionCache: chrome.storage.sync.clear() completed");

                    // Restore preserved local keys
                    if (Object.keys(preserved).length > 0) {
                        await new Promise(function(resolve) {
                            chrome.storage.local.set(preserved, resolve);
                        });
                        console.log("[RoPro] ClearExtensionCache: restored local keys:", Object.keys(preserved));
                    }

                    // Restore preserved sync keys
                    if (Object.keys(preservedSync).length > 0) {
                        await new Promise(function(resolve) {
                            chrome.storage.sync.set(preservedSync, resolve);
                        });
                        console.log("[RoPro] ClearExtensionCache: restored sync keys:", Object.keys(preservedSync));
                    }

                    console.log("[RoPro] ClearExtensionCache: done");
                    sendResponse({
                        success: true
                    });
                } catch (e) {
                    console.error("[RoPro] ClearExtensionCache: error", e);
                    sendResponse({
                        success: false
                    });
                }
            })();
            break;
        default:
            sendInvalidMessageResponse(sendResponse, requestAction, "invalid_action");
            break;
    }

    return true;
});

// ========================================================================== //
// RoPro Service Worker Alarms
// ========================================================================== //

const ropro_alarms = {
    disabled_features_alarm: {
        func: getDisabledFeatures,
        period: 60
    },
    experience_playtime_alarm: {
        func: getTimePlayed,
        period: 1
    },
    ropro_alerts_alarm: {
        func: handleAlert,
        period: 30
    },
    last_online_presence_alarm: {
        func: function() {
            refreshRoProLastOnlinePresence(false).catch(function(e) {
                console.error("[RoPro] Failed to refresh last online presence:", e);
            });
        },
        period: 5,
    },
    load_token_alarm: {
        func: loadToken,
        period: 5
    },
    trade_notifier_alarm: {
        func: tradeNotifierCheck,
        period: 1
    },
};

chrome.alarms.onAlarm.addListener((alarm) => {
    var alarmConfig = ropro_alarms[alarm.name];
    if (alarmConfig && alarmConfig.func) {
        try {
            var result = alarmConfig.func();
            if (result && typeof result.catch === "function") {
                result.catch(function(e) {
                    console.error("[RoPro] Alarm '" + alarm.name + "' failed:", e);
                });
            }
        } catch (e) {
            console.error("[RoPro] Alarm '" + alarm.name + "' threw synchronously:", e);
        }
    }
});
