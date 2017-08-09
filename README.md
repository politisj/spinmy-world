# SpinMy-World

Spin my world is built to show a 3D model of the Earth spinning as the Accelerometer is moved.
This project has a few parts in order to make it work. First of all I use a Accelerometer / Gyro attached to a microcontroller development board( Beagle Bone Black).

This board is physically connected to the host PC running a browser. On the Browser I load SpinMy-World and it automatically connects to the microcontroller at the address 192.168.7.2.

On the microcontroller bbb-mpu6050-socket-server is started , this will listen on port 8888 for incoming requests from the client.The client subscribes to the Accelerometer and gyro channels in which it will recieve a continuous live feed containing (x,y,z) values from the sensor.


These sensor readings are used by the client browser to spin the Globe.

## System dependencies

- Threejs      (used to Render the 3D model )
- bbb-mpu6050-socket-server. This needs to be installed on the microcontroller and started
- Accelerometer / Gyro Sensor (mpu6050 was used for this project)
- BeagleBone Black Development Board was used for this project


## Screen

Showing the complete setup

![alt text](http://res.cloudinary.com/diess6mgu/image/upload/c_scale,w_3245/v1502280081/20170809_181739_001_l9sa5d.jpg)

<br>

Showing Accelerometer data coming from the mpu6050 Sensor that is attached to the microcontroller

![alt text](http://res.cloudinary.com/diess6mgu/image/upload/v1502280534/Screenshot_from_2017-08-09_22-07-53_lwdc70.png)
