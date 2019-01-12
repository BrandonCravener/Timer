import mdcAutoInit from "@material/auto-init";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";
import * as OfflinePluginRuntime from "offline-plugin/runtime";

import { Timer } from "./timer";
import { Utils } from "./utils";

const mainElement = document.getElementsByTagName("main")[0],
  audioElement = document.getElementById("audio__beep"),
  textDays = document.getElementById("text__time-days"),
  textHours = document.getElementById("text__time-hours"),
  stopButton = document.getElementById("button__reset-timer"),
  pauseButton = document.getElementById("button__pause-timer"),
  textMinutes = document.getElementById("text__time-minutes"),
  textSeconds = document.getElementById("text__time-seconds"),
  startButton = document.getElementById("button__start-timer"),
  loaderOverlay = document.getElementById("loading-overlay"),
  lazyLoadElements = document.getElementsByClassName("lazyLoad"),
  restartButton = document.getElementById("button__restart-timer"),
  loaderBackground = document.getElementsByClassName("loader-background")[0],
  timeRemaningText = document.getElementById("text__time-remaining"),
  innerProgressBar = document.getElementById("progress-bar-inner"),
  inputFields = document.getElementById("input-fields");

let notifications = false,
  timer = new Timer(complete, tick),
  lazyLoadElementsLoaded = 0,
  endNotification;

// Define a function to request access to the Notification API
function requestNotifiaction() {
  if ("Notification" in window) {
    Notification.requestPermission()
      .then(status => {
        if (status == "granted") {
          notifications = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

// Number handler function
function num(number) {
  if (number) {
    if (isNaN(number)) {
      return 0;
    } else {
      return number;
    }
  } else {
    return 0;
  }
}

// Define a function to remove the loader
function removeLoader() {
  mdcAutoInit();
  setTimeout(() => {
    mainElement.removeAttribute("style");
    if (loaderBackground) {
      Utils.addClass(loaderBackground, "shrink");
    }
    if (loaderOverlay) {
      Utils.addClass(loaderOverlay, "hide");
    }
    setTimeout(() => {
      // Remove loading overlay from DOM
      loaderOverlay.parentNode.removeChild(loaderOverlay);
    }, 2000);
  }, 250);
}

function getProvidedTime() {
  let toConvert = [];
  if (num(textDays.value)) {
    toConvert.push([textDays.value, "days"]);
  }
  if (num(textHours.value)) {
    toConvert.push([textHours.value, "hours"]);
  }
  if (num(textMinutes.value)) {
    toConvert.push([textMinutes.value, "minutes"]);
  }
  if (num(textSeconds.value)) {
    toConvert.push([textSeconds.value, "seconds"]);
  }
  return Utils.processTimeStringArray(toConvert);
}

function resetProgressBar() {
  innerProgressBar.style.transition = "";
  innerProgressBar.style.width = "";
}

function updateProgressBar(time) {
  innerProgressBar.style.transition = `width ${time / 1000}s linear`;
  innerProgressBar.style.width = "100%";
}

function complete() {
  audioElement.play();
  if (notifications) {
    endNotification = new Notification("Timer Complete!", {
      icon: "images/icon-512x512.png",
      body: "Your timer has completed"
    });
    endNotification.addEventListener("click", stopTimer);
    endNotification.addEventListener("close", stopTimer);
  }
}

function tick() {
  timeRemaningText.textContent = Utils.currentTime(timer.currentTime).timeText;
  document.title = Utils.currentTime(timer.currentTime).tabTimeText;
}

// Define a function to stop the timer
function stopTimer() {
  document.title = "Timer";
  audioElement.currentTime = 0;
  audioElement.pause();
  Utils.removeClass(timeRemaningText, "show");
  setTimeout(() => {
    Utils.removeClass(inputFields, "hidden");
    Utils.removeClass(inputFields, "fade");
  }, 500);
  if (timer) {
    timer.reset(() => {
      timer = undefined;
    });
  }
}

// OfflinePluginRuntime.install();

mdcAutoInit.register("MDCTextField", MDCTextField);
mdcAutoInit.register("MDCRipple", MDCRipple);

if (startButton) {
  startButton.addEventListener("click", () => {
    let providedTime = getProvidedTime();
    console.log(`Time: ${providedTime}`);
    if (providedTime != 0) {
      timer.start(providedTime);
    }
    updateProgressBar(providedTime);
  });
}

if (pauseButton) {
  pauseButton.addEventListener("click", () => {});
}

if (stopButton) {
  stopButton.addEventListener("click", () => {});
}

if (restartButton) {
  restartButton.addEventListener("click", () => {});
}

if (Utils.parseUrlTimeString() && Utils.parseUrlTimeString().length !== 0) {
  let time = Utils.processTimeStringArray(Utils.parseUrlTimeString());
  timer.start(time);
}

// Itterate through the preload stylesheets and start to load them
for (let i = 0; i < lazyLoadElements.length; i++) {
  const elem = lazyLoadElements[i];
  if (elem.getAttribute("rel") == "preload") {
    elem.setAttribute("rel", "stylesheet");
    elem.addEventListener("load", () => {
      lazyLoadElementsLoaded += 1;
      // Check if all of the stylesheets are loaded
      if (lazyLoadElementsLoaded == lazyLoadElements.length) {
        // Remove loader overlay
        removeLoader();
      }
    });
  }
}
