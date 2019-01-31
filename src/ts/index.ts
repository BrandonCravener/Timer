import { AutoInit } from "materialize-css";

import "../css/index.scss";
import elements from "./elements";
import Timer from "./timer";

/*
 * TODO: URL Parsing
 *       Timer Beep
 */
AutoInit();

const audioNode = document.createElement("audio");
audioNode.src = "./audio/beep.wav";
audioNode.loop = true;

let timer = new Timer(tick, complete);
let notifications = false;

function tick() {
  const text = timer.getTimeString();
  let titleText = text;

  titleText = titleText.replace(" hours", "h");
  titleText = titleText.replace(" hour", "h");

  titleText = titleText.replace(" minutes", "m");
  titleText = titleText.replace(" minute", "m");

  titleText = titleText.replace(" seconds", "s");
  titleText = titleText.replace(" second", "s");

  titleText = titleText.replace(/ /g, ":");

  document.title = titleText;
  elements.textTime.textContent = text;
}

function complete() {
  elements.textTime.textContent = "Completed";
  document.title = "Completed";
  audioNode.currentTime = 0;
  audioNode.play();
}

elements.buttonStart.addEventListener("click", () => {
  // Start timer
  let totalTime = 0;
  totalTime += Number(elements.inputHours.value) * (60 * 60 * 1000);
  totalTime += Number(elements.inputMinutes.value) * (60 * 1000);
  totalTime += Number(elements.inputSeconds.value) * 1000;
  timer.start(totalTime);
  // Update time text
  elements.textTime.textContent = timer.getTimeString();

  // Hide / Show appropriate buttons
  elements.groupNotStart.forEach(button => {
    button.classList.add("started");
  });
  elements.buttonStart.classList.add("started");
  // Hide time fields
  elements.divTimeFields.classList.add("started");
  // Show time text
  elements.textTime.classList.add("started");
});

elements.buttonStop.addEventListener("click", () => {
  // Stop beeping
  audioNode.pause();
  // Stop timer
  timer.stop();
  // Update time text
  elements.textTime.textContent = timer.getTimeString();
  // Update tab title
  document.title = "Timer";
  // Hide / Show appropriate buttons
  elements.groupNotStart.forEach(button => {
    button.classList.remove("started");
  });
  elements.buttonStart.classList.remove("started");
  // Show time fields
  elements.divTimeFields.classList.remove("started");
  // Hide time text
  elements.textTime.classList.remove("started");
});

elements.buttonReStart.addEventListener("click", () => {
  timer.restart();
});

elements.buttonPause.addEventListener("click", () => {
  // Update time text
  elements.textTime.textContent = timer.getTimeString();

  if (timer.paused) {
    timer.resume();

    elements.buttonStop.classList.remove("disabled");
    elements.buttonReStart.classList.remove("disabled");

    elements.buttonPause.childNodes[0].textContent = "pause";
    elements.buttonPause.setAttribute("data-tooltip", "Pause");
    document.getElementsByClassName("tooltip-content")[0].textContent = "Pause";
  } else {
    timer.pause();

    elements.buttonStop.classList.add("disabled");
    elements.buttonReStart.classList.add("disabled");

    elements.buttonPause.setAttribute("data-tooltip", "Resume");
    elements.buttonPause.childNodes[0].textContent = "play_arrow";
    document.getElementsByClassName("tooltip-content")[0].textContent =
      "Resume";
  }
});

if ("Notification" in window) {
  if (Notification.permission == "default") {
    Notification.requestPermission().then(granted => {
      notifications = granted == "granted";
    });
  } else {
    notifications = Notification.permission == "granted";
  }
}
