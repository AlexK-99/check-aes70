import { TCPConnection, RemoteDevice, RemoteControlClasses, Types } from 'aes70'
import * as fs from 'fs';
import { readFile } from 'fs/promises';

async function run()
{
    const json = JSON.parse(
        await readFile(
            new URL('./config.json', import.meta.url)
            )
    );

    const connection = await TCPConnection.connect({
        host: json.host,
        port: json.port,
    });
    const device = new RemoteDevice(connection);

    device.set_keepalive_interval(1);

    console.log("Device name:", await device.DeviceManager.GetModelDescription());

    console.log("Object inside this device:");

    const tree = await device.get_device_tree();

    let allele = []

    const rec = async (a) => {
        for (let i = 0; i < a.length; i++)
        {
            const obj = a[i];

            if (Array.isArray(obj))
            {
                // children
                await rec(obj);
            }
      else
      {
          let ele = {"type":  obj.constructor.ClassName}
          //console.log("Type: %s", obj.constructor.ClassName);
          //console.log("Properties:");
          const properties = obj.GetPropertySync();

          // fetch the values of all properties from the device.
          await properties.sync();

          properties.forEach((value, name) => {
              ele[name] = value;
          });
          allele.push(ele);
          // unsubscribe all event handlers
          properties.Dispose();
      }
        }
    };

    await rec(tree);
    let keys =[];
    device.get_role_map().then((map) => {
        keys = [...map.keys()];
        fs.writeFileSync('./rolemapdata.json', JSON.stringify(keys) , 'utf-8');
    })
    fs.writeFileSync('./msgdata.json', JSON.stringify(allele) , 'utf-8');
}

run().then(() => console.log("Done."));