import { TCPConnection, RemoteDevice, RemoteControlClasses, Types } from 'aes70'
import * as fs from 'fs';

		TCPConnection.connect({
            host: "10.1.11.120",
            port: 50014,
        })			.then((con) => {
            let aescon = con
            let remoteDevice = new RemoteDevice(con)
            remoteDevice.set_keepalive_interval(1)
            remoteDevice.get_role_map().then((map) => {
                let keys =[ ...map.keys() ];
                fs.writeFileSync('./msgdata.json', JSON.stringify(keys) , 'utf-8'); 
            })
            remoteDevice.get_device_tree().then((tree) => {
            })
        })
			.catch((e) => {
                this.log('error', 'Aes70 Device Connection Error')
            })