var recognition = null;
var final_transcript = "";
var inText = false;
var firstTime = true;

$(document).ready(function() {
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = function() {  };
      recognition.onresult = function(event) {
          var interim_transcript = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var something = event.results[i][0].transcript;
              final_transcript += something;
              console.log(something);
              handleCommand(something.trim());
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          final_transcript = capitalize(final_transcript);
          final_span.innerHTML = linebreak(final_transcript);
          interim_span.innerHTML = linebreak(interim_transcript);
        };
      }
      recognition.onerror = function(event) {  };
      recognition.onend = function() {  };
});

function handleCommand(command) {
    console.log(command);
    if(inText) {
        if(firstTime) {
            $("textarea").get(0).innerHTML = "";
            firstTime = false;
        }
        $("textarea").get(0).innerHTML += command + " ";
        inText = false;
        return;
    }
    var shouldAlert = true;
    $("button, textarea").each(function() {
        var resource = $(this).get(0).id;
        if(resource === command){
            simulateClick($(this).get( 0 ));
            if(resource === "text") {
                inText = true;
            }
            shouldAlert = false;
            return;
        }
        // is this the element that should be clicked?
    });
    if(shouldAlert) {
        alert(command + " is invalid");
    }
}

function startButton(event) {
  recognition.lang = "en-US";
  recognition.start();
  console.log("started");
}

function clickHello(event) {
    alert("you have clicked hello");
}

function clickBye(event) {
    alert("you have clicked goodbye");
}

function scrollUp(event) {
    $('html, body').animate({
        scrollTop: $(document).scrollTop()-150
    }, 1000);
}

function scrollDown(event) {
    $('html, body').animate({
        scrollTop: $(document).scrollTop()+150
    }, 1000);
}

function simulateClick(element) {
    if (!element) return;
    var dispatchEvent = function (elt, name) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(name, true, true);
        elt.dispatchEvent(clickEvent);
    };
    dispatchEvent(element, 'mouseover');
    dispatchEvent(element, 'mousedown');
    dispatchEvent(element, 'click');
    dispatchEvent(element, 'mouseup');
};


var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}