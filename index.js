const si = require('systeminformation');
require('better-logging')(console);

const HASS_TOKEN = process.env.HASS_TOKEN || "YOUR_TOKEN_HERE"

async function setPresetMode(modeStr) {
    console.log("setPresetMode: " + modeStr)
    await fetch("http://192.168.103.3:8123/api/services/fan/set_preset_mode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + HASS_TOKEN
        },
        body: JSON.stringify({
            entity_id: 'fan.zhimi_rma3_6199_air_purifier',
            preset_mode: modeStr
        })
    })
        .then(res => console.log('Response', res))
        .catch(err => console.error(err))
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitorTemperature() {
    await si.cpuTemperature().then(
        async data => {
            let temperature = data.main
            console.log("CPU Temperature: " + temperature)
            if (temperature > 85) {
                await setPresetMode("favorite")
            }
            else if (temperature < 83) {
                await setPresetMode("auto")
            }
        }
    );
}
async function main(){
    console.log('Token', HASS_TOKEN)
    while (true) {
        try{
            await monitorTemperature()
        }
        catch(err){
            console.error(err)
        }
        await sleep(5000)
    }
}
main()