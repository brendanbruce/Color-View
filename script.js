var port = chrome.runtime.connect({ name: "mycontentscript" });
port.onMessage.addListener(function(message,sender){
  alert(doc[0].href);
});

$(document).ready(function() {
  cssExpression = /color:\s.*;/gi;
  hexExpression = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;
  stylesheets = getStyleSheets();

  $("#loadCss").bind("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      $("#test").append(tabs[0]);
      console.log(tabs[0]);
    });
    var colors = [];

    $.each(stylesheets, function(index, value) {
      colors.push.apply(colors, returnColors(stylesheets[index]));
    });

    $.each(colors, function(index, value) {
      var colorLink = "<p>" + colors[index] + "</p>";
      $("#test").append(colorLink);
      console.log(colorLink);
    });
  });

  function returnColors(url) {
    var colorSets;
    var hexColors = [];
    $.ajax({
      type: "GET",
      url: url,
      async: false,
      success: function(text) {
        var response = text;
        colorSets = response.match(cssExpression);
      }
    });

    $.each(colorSets, function(index, value) {
      var hexCode = colorSets[index].match(hexExpression);
      hexColors.push(hexCode[0]);
    });

    console.log(hexColors);

    return hexColors;
  };

  function getStyleSheets() {
    var stylesheets = [];

    $.each(document.styleSheets, function(index, value) {
      stylesheets.push(document.styleSheets[index].href);
    });

    return stylesheets
  };
});
