import { TCPConnection, RemoteDevice, RemoteControlClasses, Types } from 'aes70'
import * as fs from 'fs';

async function run()
{
    const connection = await TCPConnection.connect({
        host: "10.1.11.120",
        port: 50014,
    });
    const device = new RemoteDevice(connection);

    device.set_keepalive_interval(1);

    console.log("Device name:", await device.DeviceManager.GetModelDescription());

    console.log("Object inside this device:");

    const tree = await device.get_device_tree();
    
}

run().then(() => console.log("Done."));