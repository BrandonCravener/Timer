let timeKey = [
  [["seconds", "secs", "second", "sec"], 1000],
  [["minutes", "mins", "minute", "min"], 60 * 1000],
  [["hours", "hrs", "hour", "hr"], 60 * 60 * 1000],
  [["days", "day"], 24 * 60 * 60 * 1000]
];

export class Utils {
  static addClass(element, cls) {
    if (element.className && element.className.length == 0) {
      element.className = cls;
    } else if (element.className) {
      element.className += ` ${cls}`;
    } else if (element.classList) {
      element.classList.add(cls);
    }
  }
  static removeClass(element, cls) {
    if (element.className) {
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + element.className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    } else {
      element.classList.remove(cls);
    }
  }
  static currentTime(ms) {
    var tabTimeTextArray = [],
      num,
      result = {
        tabTimeText: "",
        timeText: ""
      },
      curPos = ms;
    if (ms / 1000 / 60 / 60 / 24 > 1) {
      num = Math.floor(curPos / 1000 / 60 / 60 / 24);
      result.numDays = num;
      curPos -= num * 1000 * 60 * 60 * 24;
      if (num) {
        result.timeText += result.numDays + " days ";
        tabTimeTextArray.push(result.numDays + "d");
      }
    }
    if (ms / 1000 / 60 / 60 > 1) {
      num = Math.floor(curPos / 1000 / 60 / 60);
      result.numHours = num;
      curPos -= num * 1000 * 60 * 60;
      if (num) {
        result.timeText += result.numHours + " hours ";
        tabTimeTextArray.push(result.numHours + "h");
      }
    }
    if (ms / 1000 / 60 > 1) {
      num = Math.floor(curPos / 1000 / 60);
      result.numMinutes = num;
      curPos -= num * 1000 * 60;
      if (num) {
        result.timeText += result.numMinutes + " minutes ";
        tabTimeTextArray.push(result.numMinutes + "m");
      }
    }
    if (ms / 1000 >= 1) {
      num = Math.floor(curPos / 1000);
      result.numSeconds = num;
      curPos -= num * 1000;
      if (num) {
        result.timeText += result.numSeconds + " seconds ";
        tabTimeTextArray.push(result.numSeconds + "s");
      }
    }
    for (var i = 0; i < tabTimeTextArray.length; i++) {
      var unit = tabTimeTextArray[i];
      result.tabTimeText += unit;
      if (i !== tabTimeTextArray.length - 1) {
        result.tabTimeText += ":";
      }
    }
    return result;
  }
  static processTimeStringArray(arr) {
    var total = 0;
    arr.forEach(function(timeString) {
      var unit = timeString[1],
        foundUnit = false,
        timeInMS;
      timeKey.forEach(function(conversion) {
        var key = conversion[0];
        if (key.indexOf(unit) !== -1) {
          foundUnit = true;
          timeInMS = Number(timeString[0] * conversion[1]);
        }
      });
      if (foundUnit && timeInMS) {
        total += timeInMS;
      }
    });
    return total;
  }
  static parseUrlTimeString() {
    if (location.search) {
      var url = decodeURI(location.search.replace("?", "")).toLowerCase();
      var splitURL = url.match(/\d*\D*/gi);
      var doubleSplitURL = [];
      splitURL.forEach(function(param) {
        if (param.length > 0) {
          var doubleSplit = param.match(/\d+|\D+/gi);
          if (doubleSplit.length == 2) {
            doubleSplitURL.push(doubleSplit);
          }
        }
      });
      return doubleSplitURL;
    }
  }
}
