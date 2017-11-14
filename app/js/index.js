'use strict';
(function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            var sw = navigator.serviceWorker;
            sw.register('service-worker.js').then(function(reg) {
                reg.onupdatefound = function() {
                    var installingWorker = reg.installing;
                    installingWorker.onstatechange = function() {
                        switch (installingWorker.state) {
                            case 'installed':
                                if (sw.controller) {
                                    Materialize.toast('Reload to get the latest version of this site!', 5000);
                                    console.log('New or updated content is available.');
                                } else {
                                    Materialize.toast('This site is now accessible offline!', 5000);
                                    console.log('Content is now available offline!');
                                }
                                break;
                            case 'redundant':
                                console.error('The installing service worker became redundant.');
                                break;
                        }
                    };
                };
            }).catch(function(e) {
                console.error('Error during service worker registration:', e);
            });
        })
    }
    var timeKey = [
            [
                ['seconds', 'secs', 'second', 'sec'], 1000
            ],
            [
                ['minutes', 'mins', 'minute', 'min'], 60 * 1000
            ],
            [
                ['hours', 'hrs', 'hour', 'hr'], 60 * 60 * 1000
            ],
            [
                ['days', 'day'], 24 * 60 * 60 * 1000
            ]
        ],
        inFocus = true,
        progressLock = false,
        currentTimer = 0,
        currentTime = 0,
        currentPosition = 0,
        progressTimer,
        activeTimer,
        finishTimeout,
        beepInterval;

    function parseUrlTimeString() {
        if (location.search) {
            var url = decodeURI(location.search.replace('?', '')).toLowerCase();
            var splitURL = url.match(/\d*\D*/ig);
            var doubleSplitURL = [];
            splitURL.forEach(function(param) {
                if (param.length > 0) {
                    var doubleSplit = param.match(/\d+|\D+/ig);
                    if (doubleSplit.length == 2) {
                        doubleSplitURL.push(doubleSplit);
                    }
                }
            })
            return doubleSplitURL
        }
    }

    function processTimeStringArray(arr) {
        var total = 0;
        arr.forEach(function(timeString) {
            var unit = timeString[1],
                foundUnit = false,
                timeInMS;
            timeKey.forEach(function(conversion) {
                var key = conversion[0]
                if (key.indexOf(unit) !== -1) {
                    foundUnit = true;
                    timeInMS = Number(timeString[0] * conversion[1]);
                }
            })
            if (foundUnit && timeInMS) {
                total += timeInMS;
            }
        })
        return total;
    }

    function getCurrentTime(ms) {
        var tabTimeTextArray = [],
          num,
          result = {
            tabTimeText: '',
            timeText: '',
          },
          curPos = ms;
        if (ms / 1000 / 60 / 60 / 24 > 1) {
          num = Math.floor(curPos / 1000 / 60 / 60 / 24);
          result.numDays = num;
          curPos -= num * 1000 * 60 * 60 * 24;
          if (num) {
            result.timeText += result.numDays + ' days ';
            tabTimeTextArray.push(result.numDays + 'd');
          }
        }
        if (ms / 1000 / 60 / 60 > 1) {
          num = Math.floor(curPos / 1000 / 60 / 60);
          result.numHours = num;
          curPos -= num * 1000 * 60 * 60;
          if (num) {
            result.timeText += result.numHours + ' hours ';
            tabTimeTextArray.push(result.numHours + 'h');
          }
        }
        if (ms / 1000 / 60 > 1) {
          num = Math.floor(curPos / 1000 / 60);
          result.numMinutes = num;
          curPos -= num * 1000 * 60;
          if (num) {
            result.timeText += result.numMinutes + ' minutes ';
            tabTimeTextArray.push(result.numMinutes + 'm');
          }
        }
        if (ms / 1000 >= 1) {
          num = Math.floor(curPos / 1000);
          result.numSeconds = num;
          curPos -= num * 1000;
          if (num) {
            result.timeText += result.numSeconds + ' seconds ';
            tabTimeTextArray.push(result.numSeconds + 's');
          }
        }
        for (var i = 0; i < tabTimeTextArray.length; i++) {
          var unit = tabTimeTextArray[i];
          result.tabTimeText += unit;
          if (i !== tabTimeTextArray.length - 1) {
            result.tabTimeText += ':';
          }
        }
        return result;
    }

    function startProgressTimer() {
        if (!progressTimer) {
            progressTimer = setInterval(function() {
                currentPosition += 250;
                $('#progress__time-remaning').css('width', ((currentPosition / currentTimer) * 100) + '%');
            }, 250);
        }   
    }
    function startTimer(time) {
        startProgressTimer();
        $('#text__time-remaining').text(getCurrentTime(time).timeText);
        currentTimer = time;
        currentTime = time;
        activeTimer = setInterval(function() {
            currentTime -= 1000;
            var timeTextResult = getCurrentTime(currentTime);
            $('#text__time-remaining').text(timeTextResult.timeText);
            if (!inFocus) {
                document.title = timeTextResult.tabTimeText;
            }
        }, 1000);
        finishTimeout = setTimeout(function() {
            if (activeTimer) {
                clearInterval(activeTimer);
            }
            if (progressTimer) {
                clearInterval(progressTimer);
            }
            $('#text__time-remaining').text('Time Over!');
            $('#progress__time-remaning').css('width', '100%');
            if (!inFocus) {
                document.title = 'Time Over!';
            }
            var audioElement = document.getElementById('audio__beep');
            audioElement.play();
            beepInterval = setInterval(function() {
                audioElement.play();
            }, 2000);
        }, time);
        if ($('.time-input-fields').is(':visible')) {
            $('.time-input-fields').fadeOut(125, function() {
                $('#text__time-remaining').fadeIn(125);
            });
        } else {
            $('#text__time-remaining').fadeIn(125);
        }
        setTimeout(function () {
            $('.control-buttons').animate({
                'margin-top': ($('#text__time-remaining').height() + 40) + 'px'
            },
            {   
                duration: 125
            });
        }, 130);
        if (inFocus) {
            $('.progress').slideDown();
        }
    }

    function resetTimer(isRestart) {
        if (!isRestart) {
            $('#number__days').val('').removeClass('valid');
            $('#number__hours').val('').removeClass('valid');
            $('#number__minutes').val('').removeClass('valid');
            $('#number__seconds').val('').removeClass('valid');
            $('#text__time-remaining').fadeOut(125, function() {
                $('.time-input-fields').fadeIn(125, function() {
                    $('.control-buttons').animate({
                        'margin-top': ($('.time-input-fields').height()) + 'px'
                    },
                    {   
                        duration: 125
                    });
                });
            });
        }
        $('#progress__time-remaning').css('width', '0%');
        if (finishTimeout) {
            clearTimeout(finishTimeout);
            finishTimeout = null;
        }
        if (activeTimer) {
            clearInterval(activeTimer);
            activeTimer = null;
        }
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        if (beepInterval) {
            clearInterval(beepInterval);
            beepInterval = null;
        }
        currentTime = 0;
        currentTimer = 0;
        currentPosition = 0;
    }

    function restartTimer() {
        if (currentTimer) {
            var startTime = currentTimer;
            resetTimer(true);
            startTimer(startTime);
        }
    }
    if (parseUrlTimeString() && parseUrlTimeString().length !== 0) {
        var total = processTimeStringArray(parseUrlTimeString());
        startTimer(total);
    }
    $(document).ready(function() {
        var checkIfLoaded = setInterval(function() {
            if (Window.removeLoader) {
                clearInterval(checkIfLoaded);
                $(".loader-background").animate(
                    {
                      width: "0px",
                      height: "0px"
                    },
                    675,
                    "swing",
                    function () {
                        $('.spinner').animate({
                            "top": $("#loading-overlay").height() +'px'
                          },
                        325,
                        "linear",
                        function () {
                            $('main').fadeIn(125, function () {
                                $('.control-buttons').fadeIn(125);
                                if (!currentTimer) {
                                    $('.time-input-fields').fadeIn(125);
                                }
                                $("#loading-overlay").remove();
                            });
                        })
                    }
                );
            }
        }, 125);
    });

    $(window).focus(function() {
        inFocus = true;
        if (document.title !== 'Timer') {
            document.title = 'Timer';
        }
        if (finishTimeout && !progressLock) {
            currentPosition = currentTimer - currentTime;
            $('.progress').slideDown();
            startProgressTimer();
            progressLock = true;
            setTimeout(function() {
                progressLock = false;
                if (inFocus) {
                    currentPosition = currentTimer - currentTime;
                    $('.progress').slideDown();
                    startProgressTimer();
                }
            }, 500);
        }
    }).blur(function() {
        inFocus = false;
        $('.progress').slideUp();
        clearInterval(progressTimer);
        progressTimer = null;
    });

    $(window).resize(function() {
        if ($('#text__time-remaining').is(':visible')) {
            $('.control-buttons').css('margin-top', ($('#text__time-remaining').height() - 16) + 'px');
        } else if ($('.time-input-fields').is(':visible')) {
            $('.control-buttons').css('margin-top', ($('.time-input-fields').height() - 16) + 'px');
        }
    });
    $('#button__reset-timer').click(function() {
        resetTimer();
    });

    $('#button__restart-timer').click(function() {
        restartTimer();
    });

    $('#button__start-timer').click(function() {
        if (!currentTimer) {
            if (($('#number__seconds').val() + $('#number__hours').val() + $('#number__minutes').val() + $('#number__days').val()) > 0) {
                var toConvert = [];
                if ($('#number__days').hasClass('valid')) {
                    toConvert.push([$('#number__days').val(), 'days']);
                }
                if ($('#number__hours').hasClass('valid')) {
                    toConvert.push([$('#number__hours').val(), 'hours']);
                }
                if ($('#number__minutes').hasClass('valid')) {
                    toConvert.push([$('#number__minutes').val(), 'minutes']);
                }
                if ($('#number__seconds').hasClass('valid')) {
                    toConvert.push([$('#number__seconds').val(), 'seconds']);
                }
                resetTimer(true);
                startTimer(processTimeStringArray(toConvert));
            }
        }
    });

})();