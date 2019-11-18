var jsHue = require('./jshue'),
    hue = jsHue();
// ^ Require Philips Hue database of actions

// Checks if the browser has support for it, or else shows nothing.

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

// Connect to classes through jQuery
var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');

var noteContent = '';




/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = false;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;


    // Turn on Lights!! :D  
    if (transcript.toLowerCase() === 'turn on mood') {
        $('#chkMood').prop('checked', true);
        user.setGroupState(1, { on: true }).then(data => {
            // do stuff 
        });
    }

    else if (transcript.toLowerCase() === 'turn on kitchen') {
        $("#chkKitchen").prop("checked", true);
        user.setGroupState(2, { on: true }).then(data => {
            // do stuff
        });
    }

    else if (transcript.toLowerCase() === 'turn on bedroom') {
        $("#chkBedroom").prop("checked", true);
        user.setGroupState(5, { on: true }).then(data => {
            // do stuff
        });
    }

    else if (transcript.toLowerCase() === 'turn on bathroom') {
        $("#chkBathroom").prop("checked", true);
        user.setGroupState(6, { on: true }).then(data => {
            // do stuff
        });
    }

    else if (transcript.toLowerCase() === 'turn off mood') {
        $("#chkMood").prop("checked", false);
        user.setGroupState(1, { on: false }).then(data => {
            // do stuff
        });
    }

    else if (transcript.toLowerCase() === 'turn off kitchen') {
        $("#chkKitchen").prop("checked", false);
        user.setGroupState(2, { on: false }).then(data => {
            // do stuff
        });
    }

    else if (transcript.toLowerCase() === 'turn off bedroom') {
        $("#chkBedroom").prop("checked", false);
        user.setGroupState(5, { on: false }).then(data => {
            // do stuff  
        });
    }

    else if (transcript.toLowerCase() === 'turn off bathroom') {
        $("#chkBathroom").prop("checked", false);
        user.setGroupState(6, { on: false }).then(data => {
            // do stuff 
        });
    }

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};



/*-----------------------------
      App buttons and input 
------------------------------*/


// Start recording 
$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
    }
  recognition.start();
});

// Pause recording
$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function () {
    noteContent = $(this).val();
});


/*-----------------------------
      Hue commands
------------------------------*/


// Connect to bridges on the same IP
hue.discover().then(bridges => {
    if (bridges.length === 0) {
        console.log('No bridges found. :(');
    }
    else {
        bridges.forEach(b => console.log('Bridge found at IP address %s.', b.internalipaddress));
    }
}).catch(e => console.log('Error finding bridges', e));



// Give access to my username
var bridge = hue.bridge('192.168.0.71');
var user = bridge.user('wyBX9dwAITl9G5o8g7jhvuu08LwOL70ssEa7uIQk');

// Turns the hallway light on and off 
user.setLightState(17, { on: true }).then(data => {
    // do stuff
});

/*
let groupArray = [];
let groupObject = {};


user.getGroups().then(data => {
    groupArray = data;
    groupObject = data;
    console.log(data);
});

console.log(groupArray);
console.log(groupObject);

user.getGroups().then(grps => {
    console.log(grps[name]);
});


async function getMyGroups() {
    let groupGroup = await user.getGroups();
    console.log(groupGroup);
};

getMyGroups();

*/

// Cool math to translate hues xyb system to hex codes yay
function xyBriToRgb(x, y, bri) {
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255; if (r < 0) { r = 255 };
    g = g * 255; if (g < 0) { g = 255 };
    b = b * 255; if (b < 0) { b = 255 };

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    if (r.length < 2)
        r = "0" + r;
    if (g.length < 2)
        g = "0" + g;
    if (b.length < 2)
        b = "0" + r;
    rgb = "#" + r + g + b;

    return rgb;
};


async function getAllGroups() {
    let allGroups = await user.getGroups();
    let groupsArray = Object.values(allGroups);
    let roomArray = [];

    groupsArray.forEach((element) => {
        if (element.type === 'Room') {
            roomArray.push(element);
        }
    });

    roomArray.forEach((room) => {
        let bgColor = xyBriToRgb(room.action.xy[0], room.action.xy[1], room.action.bri);
        console.log(bgColor);

        let checked = '';
        if (room.state.any_on == true) {
            checked = 'checked';
        };
        document.getElementById('makeSwitches').innerHTML +=
            '<div class=\"card-panel\" style=\"background-color: ' + bgColor + '\"> ' +
                '<div class=\"switch\">' +
                '<label class=\"black-text\">' +
        'Turn on ' + room.name + ' Lights' +
        '<input id=\"chk' + room.name + '\" type=\"checkbox\"' + checked + '> ' +
                        '<span class=\"lever\"></span>' +
                        '</label>' +
                    '</div>' +
            '</div>';
    });
};

getAllGroups();


/*<i class="fas fa-bed"></i>
 * <i class="fas fa-bath"></i>
 * <i class="fas fa-door-open"></i>
 * <i class="fas fa-home"></i>
 */
