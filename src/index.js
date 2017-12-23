import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Utils } from './utils';
import { Timer } from './timer';

// Check to enable offline plugin
const production = false;

if (production) {
    OfflinePluginRuntime.install();
}

let timer;

// Define variables
var beepInterval,
    lazyLoadElementsLoaded = 0,
    mainElement = document.getElementsByTagName('main')[0],
    audioElement = document.getElementById('audio__beep'),
    textDays = document.getElementById('text__time-days').value,
    textHours = document.getElementById('text__time-hours').value,
    stopButton = document.getElementById('button__reset-timer'),
    textMinutes = document.getElementById('text__time-minutes').value,
    textSeconds = document.getElementById('text__time-seconds').value,
    startButton =  document.getElementById('button__start-timer'),
    loaderOverlay = document.getElementById('loading-overlay'),
    lazyLoadElements = document.getElementsByClassName('lazyLoad'),
    restartButton = document.getElementById('button__restart-timer'),
    loaderBackground = document.getElementsByClassName('loader-background')[0];

// Define a function to remove the loader
function removeLoader() {
    setTimeout(() => {
        mainElement.removeAttribute('style');
        if (loaderBackground) {
            Utils.addClass(loaderBackground, 'shrink');
        }
        if (loaderOverlay) {
            Utils.addClass(loaderOverlay, 'hide');
        }
        setTimeout(() => {
            // Remove loading overlay from DOM
            loaderOverlay.parentNode.removeChild(loaderOverlay)
        }, 2000);
    }, 250)
}

// Function to handle creating a new timer
function defineTimer(time, complete, tick) {
    timer = new Timer(time, () => {
        audioElement.play();
        if (complete) {
            complete();
        }
    }, () => {
        if (tick) {
            tick();
        }
    });
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

// Itterate through the preload stylesheets and start to load them
for (let i = 0; i < lazyLoadElements.length; i++) {
    const elem = lazyLoadElements[i];
    if (elem.getAttribute('rel') == 'preload') {
        elem.setAttribute('rel', 'stylesheet');
        elem.addEventListener('load', () => {
            lazyLoadElementsLoaded += 1;
            // Check if all of the stylesheets are loaded
            if (lazyLoadElementsLoaded == lazyLoadElements.length) {
                // Remove loader overlay
                removeLoader();
            }
        })
    }
}

// Check for Material Design Components
if (window.mdc) {
    // Auto initalize elements
    mdc.autoInit();
}

// Check for start button
if (startButton) {
    // Register listener
    startButton.addEventListener('click', () => {
        if (!timer) {
            if (textDays + textHours + textMinutes + textSeconds > 0) {
                let toConvert = [];
                if (num(textDays)) {
                    toConvert.push([textDays, 'days']);
                }
                if (num(textHours)) {
                    toConvert.push([textHours, 'hours']);
                }
                if (num(textMinutes)) {
                    toConvert.push([textMinutes, 'minutes']);
                }
                if (num(textSeconds)) {
                    toConvert.push([textSeconds, 'seconds']);
                }
                if (toConvert) {
                    defineTimer(Utils.processTimeStringArray(toConvert));
                    if (timer) {
                        timer.start();
                    }
                }
            }
        }
    });
}
// Check for stop button
if (stopButton) {
    // Reigter listener
    stopButton.addEventListener('click', () => {
        audioElement.currentTime = 0;
        audioElement.pause()
        if (timer) {
            timer = null;
        }
    })
}
// Check for restart button
if (restartButton) {
    // Regsiter listener
    restartButton.addEventListener('click', () => {
        if (timer) {
            // Call method to restrt timer
            timer.restart();
        }
    })
}

if (Utils.parseUrlTimeString() && Utils.parseUrlTimeString().length !== 0) {
    // Set the timer variable to the new timer
    defineTimer(Utils.processTimeStringArray(Utils.parseUrlTimeString()));
    // Start the timer
    if (timer) {
        timer.start();
    }
}