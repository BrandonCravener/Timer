import { AutoInit } from "materialize-css";

import "../css/index.scss";
import elements from "./elements";
import Timer from "./timer";

AutoInit();

let timer = new Timer(tick, complete);

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

function complete() {}

elements.buttonStart.addEventListener("click", () => {
  // Hide / Show appropriate buttons
  elements.groupNotStart.forEach(button => {
    button.classList.add("started");
  });
  elements.buttonStart.classList.add("stopped");
  // Hide time fields
  elements.divTimeFields.classList.add("started");
  // Start timer
  let totalTime = 0;
  totalTime += Number(elements.inputHours.value) * (60 * 60 * 1000);
  totalTime += Number(elements.inputMinutes.value) * (60 * 1000);
  totalTime += Number(elements.inputSeconds.value) * 1000;
  timer.start(totalTime);
});

elements.buttonStop.addEventListener("click", () => {
  // Hide / Show appropriate buttons
  elements.groupNotStart.forEach(button => {
    button.classList.remove("started");
  });
  elements.buttonStart.classList.remove("stopped");
  // Show time fields
  elements.divTimeFields.classList.remove("started");
  // Stop timer
  timer.stop();
});

elements.buttonReStart.addEventListener("click", () => {
  timer.restart();
});

elements.buttonPause.addEventListener("click", () => {
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
