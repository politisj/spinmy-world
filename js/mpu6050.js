/**
 *  01-Aug-2017  John Politis
 * Description: connect to our socket server
 */
var socket = io.connect('http://192.168.7.2:8888/');
/**
 * 01-Aug-2017  John Politis
 * Description: Storage for our recieved accelerometer and gyro information
 */
var sensor = {
        accelerometer: {x: undefined, y: undefined, z: undefined},
        gyro: {x: undefined, y: undefined, z: undefined},
};
/**
 * 01-Aug-2017  John Politis
 * Description: Subscribe to for accelerometer data by default
 */
 socket.emit('accelerometer','{"request":1}');
/**
 * 01-Aug-2017  John Politis
 * Description: Subscribe to for Gyro data
 */
socket.emit('gyro','{"request":1}');
/**
 * 01-Aug-2017  John Politis
 * Description: handle a connection from the device
 */
socket.on('connect', function() { console.log('connected to remote server');});
/**
 * 01-Aug-2017  John Politis
 * Description: handle disconnection from the device
 */
socket.on('disconnect', function(){ console.log('disconnected');});
/**
 * 30-Jul-2017  John Politis
 * Description: Handles incoming packets from the accelerometer
 */
socket.on('accelerometer', function (data) {
    sensor.accelerometer.x = data.x;
    sensor.accelerometer.y = data.y;
    sensor.accelerometer.z = data.z;
    console.log(sensor.accelerometer);
    textarea.textContent = JSON.stringify( sensor.accelerometer, null );
});
/**
 * 30-Jul-2017  John Politis
 * Description: Handles incoming packets from the Gyro
 */
socket.on('gyro', function (data) {
    sensor.gyro.x = data.x;
    sensor.gyro.y = data.y;
    sensor.gyro.z = data.z;
    console.log(sensor.gyro);
    // textarea.textContent = JSON.stringify( sensor.gyro, null );

});
