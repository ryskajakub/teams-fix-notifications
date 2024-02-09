const checkTabIsTeams = (tab) => {
    return tab.url.startsWith("https://teams.microsoft.com")
}

const response = chrome.windows.onFocusChanged.addListener(
    async () => {
        const windows = await chrome.windows.getAll({ populate: true, windowTypes: ["app"] })
        const tab = windows[0].tabs[0]
        if (checkTabIsTeams(tab)) {
            chrome.scripting.executeScript({ target: { tabId: tab.id } , func: function() { 
                document.getElementById("app-bar-86fcd49b-61a2-4701-b771-54728cd291fb").click()
            }})
        }
    }
)

function checkFocusedWindow() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(focusedWindow => {
            if (focusedWindow.type === "app") {
                const tab = focusedWindow.tabs[0]
                if (!focusedWindow.focused && checkTabIsTeams(tab)) {
                    chrome.scripting.executeScript({ target: { tabId: tab.id } , func: function() { 
                        document.getElementById("app-bar-14d6962d-6eeb-4f48-8890-de55454bb136").click()
                    }})
                }
            }
        })
    });
}

setInterval(checkFocusedWindow, 500);