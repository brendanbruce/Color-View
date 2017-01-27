chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      var cssExpression = /(color:\s*.*?);/gim;
      var hexExpression = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;
      var stylesheets = getStyleSheets();

      var colors = [];

      $("body").append("<div class='swatch__container' id='swatchContainer'></div>");

      $.each(stylesheets, function(index, value) {
        colors.push.apply(colors, returnColors(stylesheets[index]));
      });

      var uniqueColors = [];

      $.each(colors, function(i, el){
        if($.inArray(el, uniqueColors) === -1) uniqueColors.push(el);
      });


      $.each(uniqueColors, function(index,value) {
        var colorSwatchInner =
          $("<div/>")
          .attr("class", "swatch__inner")
          .css("backgroundColor", value);

        var colorSwatch =
          $("<div/>")
          .attr("class", "swatch")
          .html(colorSwatchInner);

        var swatchDOM = $("#swatchContainer").append($(colorSwatch));
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
          if (hexCode != null) {
            hexColors.push(hexCode[0]);
          }
        });

        return hexColors;
      }

      function getStyleSheets() {
        var stylesheets = [];

        $.each(document.styleSheets, function(index, value) {
          stylesheets.push(document.styleSheets[index].href);
        });

        return stylesheets;
      }
    }
  }
);
