const checkTabIsTeams = (tab) => {
    return tab.url.startsWith("https://teams.microsoft.com")
}

let focused = false

const ChatBarId = "app-bar-86fcd49b-61a2-4701-b771-54728cd291fb"
const ActivityBarId = "app-bar-14d6962d-6eeb-4f48-8890-de55454bb136"

function checkFocusedWindow() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(focusedWindow => {
            const tab = focusedWindow.tabs[0]
            if (focusedWindow.type === "app" && checkTabIsTeams(tab) && focusedWindow.focused !== focused) {
                focused = focusedWindow.focused
                const elementId = focusedWindow.focused ? ChatBarId : ActivityBarId
                const func = (elementId) => { 
                    document.getElementById(elementId).click() 
                }
                chrome.scripting.executeScript({ target: { tabId: tab.id }, func, args: [elementId] })
            }
        })
    });
}

setInterval(checkFocusedWindow, 500);