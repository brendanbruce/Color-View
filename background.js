// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  var tabId = tab.id;


  chrome.tabs.executeScript(
    tabId,
    { file: 'get_sheets.js' },
    function(results) {
      console.log("test");
      chrome.tabs.query({ url: chrome.extension.getURL("popup.html") }, function(tabs) {
        var tab = tabs[0];
        console.log(tabs);
        return tab ? chrome.tabs.update(tab.id, {active:true}) : chrome.tabs.create({ url: chrome.extension.getURL("popup.html") });
      });
    }
  );
});
