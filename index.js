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
    await page.setGeolocation({latitude:parseFloat(Lat), longitude:parseFloat(Long)});  //-->   Establesco la ubicacion que me interesa <--

    await page.setViewport({ width: 1280, height: 1800 })
    await page.setDefaultTimeout(0) 
    await page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.smn.gob.ar/", {waitUntil: 'load', timeout: 0})         //-->   Cargo la pagina del SMN <--
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
//-->   Retorno los datos relevantes en forma de un json    <--
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
    console.log(`Escuchando en el puerto : ${port}`)
  })
