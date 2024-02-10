const checkTabIsTeams = (tab) => {
    return tab.url.startsWith("https://teams.microsoft.com")
}

let lastTeamsFocused = false
let lastTabActive = "Chat"

function checkFocusedWindow() {
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(async maybeTeamsWindow => {
            const tab = maybeTeamsWindow.tabs[0]
            if (maybeTeamsWindow.type === "app" && checkTabIsTeams(tab) && maybeTeamsWindow.focused !== lastTeamsFocused) {
                lastTeamsFocused = maybeTeamsWindow.focused

                const func = (lastTabActive, focused) => {

                    const getButtonText = (e) => {
                        return [...e.querySelectorAll(".app-bar-text")][0]?.innerText
                    }

                    const click = (tabName) => {
                        const found = [...document.getElementsByClassName("app-bar-button")].find(button => { 
                            const buttonText = getButtonText(button)
                            return buttonText === tabName
                        })
                        found.click()
                    }

                    if (focused) {
                        if (lastTabActive === "Chat") {
                            click("Chat")
                        }
                    } else {
                        const selected = [...document.getElementsByClassName("app-bar-button app-bar-selected")][0]
                        if (getButtonText(selected) === "Chat") {
                            click("Activity")
                            return "Chat"
                        }
                    }
                }
                
                const returnedValue = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func, 
                    args: [lastTabActive, maybeTeamsWindow.focused] })

                lastTabActive = returnedValue[0]?.result


            }
        })
    });
}

setInterval(checkFocusedWindow, 500);