
    import { TCPConnection, RemoteDevice } from 'aes70';

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
        let keys =[];
        device.get_role_map().then((map) => {
            keys = [...map.keys()];
            console.log(keys)
        })

    }

    run().then(() => console.log("Done."));

    