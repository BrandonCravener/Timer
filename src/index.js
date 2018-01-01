import { Utils } from './utils';
import { Timer } from './timer';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import mdcAutoInit from '@material/auto-init';
import { MDCRipple, MDCRippleFoundation } from '@material/ripple';
import { MDCTextField, MDCTextFieldFoundation } from '@material/textfield';

mdcAutoInit.register('MDCTextField', MDCTextField);
mdcAutoInit.register('MDCRipple', MDCRipple);

// Check to enable offline plugin
const production = true;

if (production) {
    OfflinePluginRuntime.install();
}

let notifications = false;

if ('Notification' in window) {
    Notification.requestPermission().then(status => {
        if (status == 'granted') {
            notifications = true;
        }
    }).catch(err => {
        console.log(err);
    })
}

let timer;

// Define variables
var beepInterval,
    lazyLoadElementsLoaded = 0,
    mainElement = document.getElementsByTagName('main')[0],
    audioElement = document.getElementById('audio__beep'),
    textDays = document.getElementById('text__time-days'),
    textHours = document.getElementById('text__time-hours'),
    stopButton = document.getElementById('button__reset-timer'),
    textMinutes = document.getElementById('text__time-minutes'),
    textSeconds = document.getElementById('text__time-seconds'),
    startButton =  document.getElementById('button__start-timer'),
    loaderOverlay = document.getElementById('loading-overlay'),
    lazyLoadElements = document.getElementsByClassName('lazyLoad'),
    restartButton = document.getElementById('button__restart-timer'),
    loaderBackground = document.getElementsByClassName('loader-background')[0],
    timeRemaningText = document.getElementById('text__time-remaining'),
    progressBarWrapper = document.getElementById('progress-bar-wrapper'),
    innerProgressBar = document.getElementById('progress-bar-inner'),
    inputFields = document.getElementById('input-fields'),
    endNotification;

// Define a function to remove the loader
function removeLoader() {
    mdcAutoInit();
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

// Define a function to stop the timer
function stopTimer() {
    document.title = 'Timer';
    audioElement.currentTime = 0;
    audioElement.pause()
    innerProgressBar.style.transition = '';
    innerProgressBar.style.width = '';
    Utils.removeClass(timeRemaningText, 'show')
    setTimeout(() => {
        Utils.removeClass(inputFields, 'hidden');
        Utils.removeClass(inputFields, 'fade');
    }, 500);
    if (timer) {
        timer.reset(() => {
            timer = undefined;
        });
    }
    /*
    if (endNotification) {
        endNotification.close().then(() => {
            endNotification = undefined;
        }).catch(err => console.err);
    }
    */
}

// Function to handle creating a new timer
function defineTimer(time, complete, tick) {
    timer = new Timer(time, () => {
        audioElement.play();
        if (notifications) {
            endNotification = new Notification('Timer Complete!', {
                icon: 'images/icon-512x512.png',
                body: 'Your timer has completed'
            })
            endNotification.addEventListener('click', stopTimer);
            endNotification.addEventListener('close', stopTimer);
        }
        if (complete) {
            complete();
        }
    }, () => {
        if (tick) {
            tick();
        }
        if (timer) {
            timeRemaningText.textContent = Utils.currentTime(timer.currentTime).timeText;
            document.title = Utils.currentTime(timer.currentTime).tabTimeText;
        }
    });
}

function startTimer(time) {
    if (timer) {
        timer.start();
        timeRemaningText.textContent = Utils.currentTime(timer.currentTime).timeText;
        document.title = Utils.currentTime(timer.currentTime).tabTimeText;
        Utils.addClass(inputFields, 'fade');
        setTimeout(() => {
            Utils.addClass(inputFields, 'hidden');
            Utils.addClass(timeRemaningText, 'show')
        }, 500);
        innerProgressBar.style.transition = `width ${time/1000}s linear`;
        innerProgressBar.style.width = '100%';
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

// Check for start button
if (startButton) {
    // Register listener
    startButton.addEventListener('click', () => {
        if (!timer) {
            if (textDays.value + textHours.value + textMinutes.value + textSeconds.value > 0) {
                let toConvert = [];
                if (num(textDays.value)) {
                    toConvert.push([textDays.value, 'days']);
                }
                if (num(textHours.value)) {
                    toConvert.push([textHours.value, 'hours']);
                }
                if (num(textMinutes.value)) {
                    toConvert.push([textMinutes.value, 'minutes']);
                }
                if (num(textSeconds.value)) {
                    toConvert.push([textSeconds.value, 'seconds']);
                }
                if (toConvert) {
                    let time = Utils.processTimeStringArray(toConvert);
                    defineTimer(time);
                    startTimer(time);
                }
            }
        }
    });
}
// Check for stop button
if (stopButton) {
    // Reigter listener
    stopButton.addEventListener('click', stopTimer);
}
// Check for restart button
if (restartButton) {
    // Regsiter listener
    restartButton.addEventListener('click', () => {
        if (timer) {
            let currentTimerTime = timer.time;
            // Call method to restrt timer
            stopTimer();
            defineTimer(currentTimerTime - 1000);
            setTimeout(() => {
                startTimer(currentTimerTime - 1000);
            }, 1000)
        }
    })
}

if (Utils.parseUrlTimeString() && Utils.parseUrlTimeString().length !== 0) {
    let time = Utils.processTimeStringArray(Utils.parseUrlTimeString());
    // Set the timer variable to the new timer
    defineTimer(time);
    // Start the timer
    setTimeout(() => {
        startTimer(time);
    })
}