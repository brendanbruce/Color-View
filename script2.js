chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      var cssExpression = /(color:\s*.*?);/gim;
      var hexExpression = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;
      var stylesheets = getStyleSheets();

      var colors = [];

      initialize();

      $("#convertToHsl").bind("click", function() {
        displayAsHsl(colorSet);
      });

      $.each(stylesheets, function(index, value) {
        colors.push.apply(colors, returnColors(stylesheets[index]));
      });

      var uniqueColors = [];

      $.each(colors, function(index, value){
        var lowerCaseColor = value.toLowerCase();

        if (lowerCaseColor.length <7) {
          switch (lowerCaseColor.length) {
            case 4:
              lowerCaseColor = lowerCaseColor + lowerCaseColor.slice(1, 4);
              break;
            case 2:
              lowerCaseColor = lowerCaseColor + (lowerCaseColor.slice(1, 2) * 2);
              break;
          }
        }

        if($.inArray(lowerCaseColor, uniqueColors) === -1) {
          uniqueColors.push(lowerCaseColor);
        }
      });

      var colorSet = [];

      $.each(uniqueColors, function(index, value) {
        var red = parseInt("0x" + value.slice(1, 2));
        var blue = parseInt("0x" + value.slice(3, 4));
        var green = parseInt("0x" + value.slice(5, 6));

        var hsl = rgbToHsl(red, blue, green);

        var colorObject = {
          hex: value,
          hue: hsl[0],
          saturation: hsl[1],
          lightness: hsl[2]
        };

        colorSet.push(colorObject);
      });

      $.each(colorSet, function(index,value) {
        buildSwatches(value);
      });

      function buildSwatches(value) {
        var colorSwatchText = 
          $("<div/>")
          .attr("class", "swatch__text")
          .html(
            "<h5>" + value.hex + "</h5>" +
            "<h5>" + value.hue + "</h5>" +
            "<h5>" + value.saturation + "</h5>" +
            "<h5>" + value.lightness + "</h5>"
          );

        var colorSwatchInner =
          $("<div/>")
          .attr("class", "swatch__inner")
          .css("backgroundColor", value.hex);

        var colorSwatch =
          $("<div/>")
          .attr("class", "swatch")
          .html(colorSwatchInner)
          .append(colorSwatchText);

        var swatchDOM = $("#swatchContainer").append($(colorSwatch));
      }

      function initialize() {
        $("body").append("<div class='container' id='container'></div>");
        //create header
        $("#container").append("<header class='header' id='header'></header>");
        $("#header").append("<a class='button' href='#' id='convertToHsl'>Convert to HSL</a>");
        //create swatch container
        $("#container").append("<div class='swatch__container' id='swatchContainer'></div>");
      }

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

      function displayAsHsl(colorSet) {
        $("#swatchContainer").html("");
        var hslColorSet = colorSet;
        hslColorSet.sort(function(a, b) {
          return a.hue - b.hue;
        });
        $.each(hslColorSet, function(index,value) {
          if (value.saturation > 0.1) {
            buildSwatches(value);
          }
        });
      }

      function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }

          h /= 6;
        }

        return [ h, s, l ];
      }
    }
  }
);
