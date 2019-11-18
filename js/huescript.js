var jsHue = require('./jshue'),
    hue = jsHue();

hue.discover().then(bridges => {
    if (bridges.length === 0) {
        console.log('No bridges found. :(');
    }
    else {
        bridges.forEach(b => console.log('Bridge found at IP address %s.', b.internalipaddress));
    }
}).catch(e => console.log('Error finding bridges', e));


var bridge = hue.bridge('192.168.0.71');
var user = bridge.user('wyBX9dwAITl9G5o8g7jhvuu08LwOL70ssEa7uIQk');

user.setLightState(17, { on: false }).then(data => {
    // process response data, do other things 
});

user.setGroupState(2, { on: false }).then(data => {
    // process response data, do other things 
});