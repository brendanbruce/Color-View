hexValues = getHexValues();

function getHexValues() {
  var colorSet = [];
  var counter = 0;
  var stylesheets = [];

  for (var i = 0; i < document.styleSheets.length; i++) {
    checkNull(i, stylesheets);
  }

  var i = 0;
  function forLoop() {
    if (i < stylesheets.length) {
      grabColors(stylesheets, i, function() {
        colorSet.push(findHex(this.responseText));
        i++;
        forLoop();
      });
    } else {
      hexCollection = collectColors(colorSet);
      console.log(hexCollection);
      loopOut(hexCollection);
    }
  }

  forLoop();
}

function loopOut(collection) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  });
}

function checkNull(index, array) {
  if (document.styleSheets[index].href !== null) {
    array.push(document.styleSheets[index].href);
  }
}

function collectColors(item) {
  var collectedSet = [].concat.apply([], item);
  var collectedUniques = [];
  for (var i in collectedSet) {
    if (collectedUniques.indexOf(collectedSet[i]) === -1) {
      collectedUniques.push(collectedSet[i]);
    }
  }
  return collectedUniques;
}

function grabColors(array, index, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", array[index]);

  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if (this.readyState === DONE) {
      if (this.status === OK) {
        if (typeof callback == "function") {
          callback.apply(xhr);
        }
      } else {
        console.log("error " + xhr.status);
      }
    }
  };

  xhr.send(null);
}

function findHex(stylesheet) {
  var hexExpression = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/gi;
  var str = stylesheet;
  var test = str.match(hexExpression);
  return test;
}

