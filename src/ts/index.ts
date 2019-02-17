import { AutoInit } from "materialize-css";

import "../css/index.scss";
import elements from "./elements";
import Timer from "./timer";

AutoInit();

const alphaRegex = /([a-z]+)/gi;

const hoursRegex = /(h|hr|hour)/gi;
const minutesRegex = /(m|min)/gi;
const secondsRegex = /(s|sec)/gi;

const timeQuery = document.location.search.replace("?t=", "").split(alphaRegex);

const audioNode = document.createElement("audio");

let timer: Timer = new Timer(tick, complete);
let notifications: Boolean = false;
let completeNotifcation: Notification;

function tick() {
  const text = timer.getTimeString();
  const width = ((timer.time - timer.currentTime) / timer.time) * 100;
  let titleText = text;

  titleText = titleText.replace(" hours", "h");
  titleText = titleText.replace(" hour", "h");

  titleText = titleText.replace(" minutes", "m");
  titleText = titleText.replace(" minute", "m");

  titleText = titleText.replace(" seconds", "s");
  titleText = titleText.replace(" second", "s");

  titleText = titleText.replace(/ /g, ":");

  elements.divProgress.style.width = `${width}%`;

  document.title = titleText;
  elements.textTime.textContent = text;
}

function stop() {
  // Stop beeping
  audioNode.pause();

  // Stop timer
  timer.stop();

  // Update tab title
  document.title = "Timer";
  // Hide / Show appropriate buttons

  elements.groupNotStart.forEach(button => {
    button.classList.remove("started");
  });
  elements.buttonStart.classList.remove("started");

  // Enable pause button
  elements.buttonPause.classList.remove("disabled");

  // Show time fields
  elements.divTimeFields.classList.remove("started");

  // Hide time text
  elements.textTime.classList.remove("started");

  // Reset progress bar
  elements.divProgress.style.width = "0%";

  // Close notifcation
  if (completeNotifcation) {
    completeNotifcation.close();
    completeNotifcation = undefined;
  }
}

function complete() {
  // Update text
  elements.textTime.textContent = "Completed";
  document.title = "Completed";

  // Play beep
  audioNode.currentTime = 0;
  audioNode.play();

  // Disable pause button
  elements.buttonPause.classList.add("disabled");

  // Complete progress bar
  elements.divProgress.style.width = "100%";

  // Handle desktop notification
  if (notifications) {
    completeNotifcation = new Notification("Timer Complete!", {
      icon: "images/icon-512x512.png",
      body: "Your timer has completed"
    });
  }

  completeNotifcation.addEventListener("click", () => {
    stop();
  });
}

function start(time: number) {
  if (time >= 1000) {
    // Start timer
    timer.start(time);

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
  }
}

elements.buttonStart.addEventListener("click", () => {
  // Calculate time in miliseconds
  let totalTime = 0;

  totalTime += Number(elements.inputHours.value) * (60 * 60 * 1000);
  totalTime += Number(elements.inputMinutes.value) * (60 * 1000);
  totalTime += Number(elements.inputSeconds.value) * 1000;

  start(totalTime);
});

elements.buttonStop.addEventListener("click", stop);

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

audioNode.src = "./audio/beep.wav";
audioNode.loop = true;

if ("Notification" in window) {
  if (Notification.permission == "default") {
    Notification.requestPermission().then(granted => {
      notifications = granted == "granted";
    });
  } else {
    notifications = Notification.permission == "granted";
  }
}

if (timeQuery.length > 0) {
  let cleanTimeQuery = [];

  // Clean up array
  timeQuery.forEach(time => {
    if (time != "") {
      cleanTimeQuery.push(time);
    }
  });

  let totalTime = 0;
  // Itterate through each pair
  for (let i = 0; i < cleanTimeQuery.length; i += 2) {
    const timeAmmount = cleanTimeQuery[i];
    const timeUnit = cleanTimeQuery[i + 1];
    console.log(timeAmmount, timeUnit);
    if (hoursRegex.test(timeUnit)) {
      totalTime += timeAmmount * (1000 * 60 * 60);
    } else if (minutesRegex.test(timeUnit)) {
      totalTime += timeAmmount * (1000 * 60);
    } else if (secondsRegex.test(timeUnit)) {
      totalTime += timeAmmount * 1000;
    } else {
      totalTime += timeAmmount * 1000;
    }
  }
  console.log(totalTime);

  start(totalTime);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      registration => {
        console.debug(`Service worker registered ${registration}`);
      },
      regError => {
        console.debug(`Service worker failed to register ${regError}`);
      }
    );
  });
}
