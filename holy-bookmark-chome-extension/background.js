(function (api) {

    // Delay between requests in minutes.
    const REFRESHING_DELAY = 1;

    // Watchdog delay in minutes.
    const WATCHDOG_DELAY = 5;

    // Legacy support for pre-event-pages.
    const oldChromeVersion = !chrome.runtime;

    function fetchBookmarks() {
        return api.getNewBookmarksCount()
            .then(bookmarksCount => {
                const normalizedBookmarksCount = Math.min(bookmarksCount, 999);
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                });
                chrome.browserAction.setBadgeText({
                    text: normalizedBookmarksCount > 0 ? String(normalizedBookmarksCount) : ''
                });
                return normalizedBookmarksCount;
            });
    }

    function scheduleRequest() {
        console.log('The next request is scheduled in ' + REFRESHING_DELAY + ' minute(s)');
        if (oldChromeVersion) {
            setTimeout(onAlarm, REFRESHING_DELAY);
        } else {
            chrome.alarms.create('refresh', {periodInMinutes: REFRESHING_DELAY});
        }
    }

    function startRequest(params) {
        if (api.isAuthenticated()) {
            console.log('Fetching bookmarks...');
            fetchBookmarks()
                .then(function (count) {
                    console.log('Fetched ' + count + ' bookmark(s)');
                })
                .catch(function (error) {
                    console.error('Fetching bookmarks failed', error);
                })
                .finally(function () {
                    if (params && params.scheduleRequest) {
                        scheduleRequest();
                    }
                });
        } else {
            console.log('User is not authenticated. Waiting for authentication...');
        }
    }

    function onInit() {
        console.log('onInit');
        startRequest({scheduleRequest: true});
        if (!oldChromeVersion) {
            // TODO(mpcomplete): We should be able to remove this now, but leaving it
            // for a little while just to be sure the refresh alarm is working nicely.
            chrome.alarms.create('watchdog', {periodInMinutes: WATCHDOG_DELAY});
        }
    }

    function onAlarm(alarm) {
        console.log('Got alarm', alarm);
        // |alarm| can be undefined because onAlarm also gets called from
        // window.setTimeout on old chrome versions.
        if (alarm && alarm.name === 'watchdog') {
            onWatchdog();
        } else {
            startRequest({scheduleRequest: true});
        }
    }

    function onWatchdog() {
        chrome.alarms.get('refresh', function(alarm) {
            if (alarm) {
                console.log('Refresh alarm exists. Yay.');
            } else {
                console.log('Refresh alarm doesn\'t exist!? Refreshing now and rescheduling.');
                startRequest({scheduleRequest: true});
            }
        });
    }

    if (oldChromeVersion) {
        onInit();
    } else {
        chrome.runtime.onInstalled.addListener(onInit);
        chrome.alarms.onAlarm.addListener(onAlarm);
    }

    if (chrome.runtime && chrome.runtime.onMessage) {
        // in new version of chrome first request will be executed immediately after authentication
        // in old version of chrome will have to wait for next 'refresh' event
        chrome.runtime.onMessage.addListener(function(message) {
            if (message.type === 'holy-bookmark-authentication-success') {
                console.log('User authenticated.');
                startRequest({scheduleRequest: true});
            }
        });
    }

    if (chrome.runtime && chrome.runtime.onStartup) {
        chrome.runtime.onStartup.addListener(function() {
            console.log('Starting browser...');
            startRequest({scheduleRequest: false});
        });
    } else {
        // This hack is needed because Chrome 22 does not persist browserAction icon
        // state, and also doesn't expose onStartup. So the icon always starts out in
        // wrong state. We don't actually use onStartup except as a clue that we're
        // in a version of Chrome that has this problem.
        chrome.windows.onCreated.addListener(function() {
            console.log('Window created...');
            startRequest({scheduleRequest: false});
        });
    }

})(holyBookmarkApi);