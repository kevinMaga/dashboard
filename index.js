let get_dia= string_dia=>{
    let partesFecha = string_dia.split("-");
    let año = parseInt(partesFecha[0], 10);
    let mes = parseInt(partesFecha[1], 10) - 1; // Meses en JavaScript son de 0 a 11
    let dia = parseInt(partesFecha[2], 10);
    let fecha = new Date(año, mes, dia);
    let numeroDiaSemana = fecha.getDay();
    let diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    return diasSemana[numeroDiaSemana];
  }
const cargarPrediccionActual=async()=>{

    const endpoint="https://api.openweathermap.org/data/2.5/weather?q=Guayaquil&lang=es&appid=aa0173cf382c54cd4c697f4bfd465fee&units=metric";
    let data=await fetch(endpoint);
    let json=await data.json();
    console.log(json);
    let main_temp=json.main.temp;
    let humedad=json.main.humidity;
    let ciudad=json.name;
    let weather_description=json.weather[0];
    let description=weather_description.description;
    let weather_icon=weather_description.icon;
    let carta_seccion=document.querySelector("#pronostico_diario .card_container .card");
    console.log(carta_seccion);
    
    console.log(main_temp);

    console.log(weather_description);
    console.log(description);
    console.log(weather_icon);

    let plantilla=`

    <div class="card-header bg-primary bg-gradient text-light fs-5">${ciudad} 
        <p class="text-light fs-6 lh-1 fw-light" > ${get_dia(getFechaActual())}, ${getFechaActual()}</p>
        <img src="http://openweathermap.org/img/wn/${weather_icon}.png" class="img-fluid mx-auto d-block" alt="icono"> 
    </div>
    <div class="card-body">
      <p class="card-text fs-6 text-muted"> Temperatura: ${main_temp} °C</p>
      <p class="card-text fs-6 text-muted"> Descripcion: ${description} </p>
      <p class="card-text fs-6 text-muted"> Humedad: ${humedad} %</p>
      
</div>
    `;

  carta_seccion.innerHTML=plantilla;
}

cargarPrediccionActual();

const getFechaActual=()=>{
    return new Date().toISOString().slice(0,10);
}

const getDataMaxMinAVg=(arrayDias,arrayData)=>{
    let currentDay=getFechaActual();
    let dataFiltered=[]

    for (let i=0; i<arrayDias.length; i++){
        let dia=arrayDias[i];
        let data=arrayData[i];
        if (dia.includes(currentDay)){
            dataFiltered.push(data);
        }

    }
    let min, max, prom;
    min = Math.min(...dataFiltered);
    max = Math.max(...dataFiltered);
    prom = dataFiltered.reduce((a, b) => a + b, 0)/dataFiltered.length;
    return [min,max,prom.toFixed(2)]
    
}

const cargarIndicadores=async()=>{
    let endpoint="https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,uv_index&past_days=1";
    let data=await fetch(endpoint);
    let json_data=await data.json();
    //arreglo con los datos del clima en una prediccion de 7 dias
    console.log(json_data)
    let array_days=json_data.hourly.time;
    let array_precipitacion=json_data.hourly.precipitation_probability;
    let array_temperature=json_data.hourly.temperature_2m;
    let arrayUv=json_data.hourly.uv_index;
    //IndicadorTemperatura
    let [min_temp,max_temp,avg_temp]=getDataMaxMinAVg(array_days,array_temperature);
    document.getElementById("temperaturaMinValue").textContent="Min: "+min_temp+" [°C]";
    document.getElementById("temperaturaMaxValue").textContent="Max: "+max_temp+" [°C]";
    document.getElementById("temperaturaPromValue").textContent="Prom: "+avg_temp+" [°C]";
    //IndicadorPreciptacion
    let [min_prep,max_prep,avg_prep]=getDataMaxMinAVg(array_days,array_precipitacion);

    document.getElementById("precipitacionMinValue").textContent="Min: "+min_prep+" [%]";
    document.getElementById("precipitacionMaxValue").textContent="Max: "+max_prep+" [%]";
    document.getElementById("precipitacionPromValue").textContent="Prom: "+avg_prep+" [%]";
    //IndicadorUvIndex
    let [min_uv,max_uv,avg_uv]=getDataMaxMinAVg(array_days,arrayUv);

    document.getElementById("uvMinValue").textContent="Min: "+min_uv+" [--]";
    document.getElementById("uvMaxValue").textContent="Max: "+max_uv+" [--]";
    document.getElementById("uvPromValue").textContent="Prom: "+avg_uv+" [--]";


}

cargarIndicadores();

let getWeeklyDates=()=>{
    let fechas=[];
    let [anio,mes,dia]=getFechaActual().split("-");
    let dia_actual=parseInt(dia);
    console.log(getFechaActual());
    for (let i=0; i<5; i++){
        let dia_siguiente=dia_actual+1;
        let new_fecha=[dia_siguiente,mes,anio].join('-');
        fechas.push(new_fecha)
        dia_actual=dia_siguiente;
        
    }
    return fechas;
}


let prediccionSemanal=async()=>{
    const endpoint="https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&lang=es&appid=aa0173cf382c54cd4c697f4bfd465fee&units=metric"
    let data=await fetch(endpoint);
    let json_data= await data.json();
    let listaData=json_data.list;
    console.log("dias de la data")
    console.log(listaData)
    //filtro las fechas 
    fechas=getWeeklyDates();
    fechas_api=[];
    //arreglo con los datos filtrados
    let api_filtrada=[];
    for (let i=0; i<fechas.length; i++){
        
        let df=fechas[i];
        console.log(df.split("-")[0])
        let filtrado=listaData.filter((item)=>{return item.dt_txt.split(" ")[0].split("-")[2]==df.split("-")[0]});
        api_filtrada.push(filtrado[0]);
        
    }
    console.log(api_filtrada)
    const container=document.getElementById("weekly_report");
    let cont_dias=1;
    container.innerHTML='';
    let plantilla=` `
    for (data of api_filtrada){
        let fecha_dia=data.dt_txt.split(" ")[0]
        let nombre_dia=get_dia(fecha_dia); 
        let descripcion=data.weather[0].description;
        let icono=data.weather[0].icon;
        let temperature=data.main.temp;
        plantilla=`<div class="card" id="dia-${cont_dias}">
        <div class="card-header bg-primary bg-gradient text-light fs-5"> 
            <p class="text-light fs-6 lh-1 fw-light" > ${nombre_dia}, ${fecha_dia}</p>
            <img src="http://openweathermap.org/img/wn/${icono}.png" class="img-fluid mx-auto d-block" alt="icono"> 
        </div>
        <div class="card-body">
          <p class="card-text fs-6 text-muted"> Temperatura: ${temperature} °C</p>
          <p class="card-text fs-6 text-muted"> Descripcion: ${descripcion} </p>  
    </div>`
        container.innerHTML+=plantilla;
        cont_dias++;
        
    }
    
}

prediccionSemanal();
let parseXML = (responseText) => {

    const parser = new DOMParser();
    const xml = parser.parseFromString(responseText, "application/xml");
  
  
    // Referencia al elemento `#forecastbody` del documento HTML
  
    let forecastElement = document.querySelector("#forecastbody")
    forecastElement.innerHTML = ''
  
    // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
    let timeArr = xml.querySelectorAll("time")
  
    timeArr.forEach(time => {
        
        let from = time.getAttribute("from").replace("T", " ")
  
        let humidity = time.querySelector("humidity").getAttribute("value")
        let windSpeed = time.querySelector("windSpeed").getAttribute("mps")
        let precipitation = time.querySelector("precipitation").getAttribute("probability")
        let pressure = time.querySelector("pressure").getAttribute("value")
        let cloud =time.querySelector("clouds").getAttribute("value")
  
        let template = `
            <tr>
                <td>${from}</td>
                <td>${humidity}</td>
                <td>${windSpeed}</td>
                <td>${precipitation}</td>
                <td>${pressure}</td>
                <td>${cloud}</td>
            </tr>
        `
  
        //Renderizando la plantilla en el elemento HTML
        forecastElement.innerHTML += template;
    })
  
  }

const diferencia=timestamp=> {
    let timeStampActual=new Date().getTime();
    // Calcular la diferencia en milisegundos
    
    let date1=new Date(timeStampActual);
    let date2=new Date(timestamp);
    // Convertir la diferencia a horas
    const diferenciaEnMilisegundos = Math.abs(date2 - date1);
    const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
    console.log(diferenciaEnHoras);
 
    // Verificar si la diferencia es al menos de tres horas
    return diferenciaEnHoras >=3;
}
//Callback
let hora_llamada;
let selectListener = async (event) => {

    let selectedCity = event.target.value
    let cityStorage = localStorage.getItem(selectedCity);

    console.log("funcion")
    console.log(hora_llamada)
    
    console.log(cityStorage);
    if (cityStorage === null || diferencia(hora_llamada) ) {
        const fechaActual = new Date();
        hora_llamada=fechaActual.getTime();
         console.log(hora_llamada)
      console.log("el localStorage esta vacio o hay una difewrencia de 3 horas")
      try {
         //API key
         let APIkey = 'aa0173cf382c54cd4c697f4bfd465fee'
         let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&lang=es&mode=xml&appid=${APIkey}`
   
         let response = await fetch(url)
         let responseText = await response.text()
        
         await localStorage.setItem(selectedCity, responseText)
         parseXML(responseText);
        
        
      } catch (error) {
         console.log(error)
      }
  
  } else {
      console.log("el local storage ya esta lleno")
      // Procese un valor previo
      parseXML(cityStorage)
      console.log("else")
      console.log(hora_llamada)
      //hacer que solo se llame cada 3 horas

  
  }
  
  
  }




  let loadForecastByCity = () => {
  
    let selectElement = document.querySelector("select")
    selectElement.addEventListener("change", selectListener)
  
  }
  
  loadForecastByCity()

  let cargarOpenMeteo = ()=>{
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,uv_index&past_days=1';
    fetch(URL)
    .then(responseText => responseText.json())
    .then (responseJSON =>{
        console.log(responseJSON)
        //codigo para el chart
        let plotRef = document.getElementById('plot1');
        let plotRef2 = document.getElementById('plot2');

    //Etiquetas del gráfico
    let labels = responseJSON.hourly.time;
    console.log(responseJSON)
    //Etiquetas de los datos
    let data = responseJSON.hourly.temperature_2m;
    let data_uv=responseJSON.hourly.uv_index;
    //Objeto de configuración del gráfico
    let config = {
      type: 'line',
      data: {
        labels: labels, 
        datasets: [
          {
            label: 'Temperature [2m]',
            data: data
          }
        ]
      }
    };
   
      const config2 = {

        type: 'bar',
        data: {
          labels: labels, 
          datasets: [
            {
              label: 'UV Index',
              barPercentage: 0.5,
              barThickness: 6,
              maxBarThickness: 8,
              minBarLength: 2,
              data: data_uv
            }
          ]
        }
      };
    //Objeto con la instanciación del gráfico
    let chart1  = new Chart(plotRef, config);
    let chart2= new Chart(plotRef2,config2);
    })
    .catch(console.error);

}

cargarOpenMeteo();

let loadExternalTable = async() => {
    console.log("Gestion de riesgo")

     let proxyURL = 'https://cors-anywhere.herokuapp.com/'
     let url = proxyURL + 'https://www.gestionderiesgos.gob.ec/monitoreo-de-inundaciones/'


    let response= await fetch(url)
    let responseText =await response.text()

    const parser= await new DOMParser();
    const xml =await parser.parseFromString(responseText, "text/html")

    let table= await xml.querySelector("#postcontent table")
    document.getElementById("monitoreo").innerHTML=table.outerHTML




   }

 
   loadExternalTable();
