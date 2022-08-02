const express = require('express')
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browser.newPage()

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://www.smn.gob.ar", ['geolocation']);
    const Lat=(req.query.Latitud===undefined)?-32.94682:req.query.Latitud; 
    const Long=(req.query.Longi===undefined)?-60.63932:req.query.Longi;
    
    //const Lat=-32.94682;
    //const Long=-60.63932;
    await page.setGeolocation({latitude:parseFloat(Lat), longitude:parseFloat(Long)});

    await page.setViewport({ width: 1280, height: 1800 })
    await page.setDefaultTimeout(0) //Wait Maximum amount of time for page to load
    await page.setDefaultNavigationTimeout(0) //Wait Maximum amount of time for page to load
    await page.goto("https://www.smn.gob.ar/", {waitUntil: 'load', timeout: 0})
    const citi=await page.evaluate(()=> {
        return document.getElementById("citytitle").innerText;
    });
    const Temp=await page.evaluate(()=>{
        return document.getElementById("estado_tempDesc").innerText;
   });
   const Humedad=await page.evaluate(()=> {
    return document.getElementById("estado_humidity").innerText;
    
});
const Pres=await page.evaluate(()=>{ 
    return document.getElementById("estado_pressure").innerText;
    
});
const Viento=await page.evaluate(()=> {
    return document.getElementById("estado_wind").innerText;
    
});
const Visible=await page.evaluate(()=> {
    return document.getElementById("estado_visibility").innerText;
});

res.json({
    "Localidad":citi,
    "Temperatura":Temp,
    "Humedad":Humedad,
    "Presion":Pres,
    "Viento":Viento,
    "Visibilidad":Visible

});
    browser.close();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })