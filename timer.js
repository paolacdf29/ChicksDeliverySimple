const supp = require('./dbsupp');

function JSClock(tiempo) {
    let timearray = [tiempo.getHours(), tiempo.getMinutes(), tiempo.getSeconds()];
    let temp = "" + ((timearray[0] > 12) ? timearray[0] - 12 : timearray[0]);
    if (timearray[0] == 0){
        temp = "12";
    }
    temp += ((timearray[1] < 10) ? ":0" : ":") + timearray[1];
    temp += ((timearray[2] < 10) ? ":0" : ":") + timearray[2];
    temp += (timearray[0] >= 12) ? " P.M." : " A.M.";
    return temp;
}

function tiempoTranscurrido(tiempo, minspass){
    let newmins = minspass + tiempo.getMinutes();
    if(newmins >= 60){
        let newhour = tiempo.getHours() + 1
        if (newhour >= 24){
            let newdate = tiempo.getDate() + 1;
            tiempo.setDate(newdate);
            newhour = 00;
        }
        tiempo.setHours(newhour);
        newmins = newmins - 60;
    }
    tiempo.setMinutes(newmins);

    return tiempo
}

function DifDeTiempo(fecha){
    let currentdate = new Date();
    let mins = 0;
    let hs = currentdate.getHours() - fecha.getHours();
    if(hs > 0){
        mins = hs*60;   
    }
    mins = mins + (currentdate.getMinutes() - fecha.getMinutes());

    return mins
}

function JSFecha(fecha){

    let strfecha = String(fecha);
    // Fri Dec 13 2019 17:30:16 GTM-0300 (Argentina Standar Time)
    // 0000-00-00 00:00:00
    
    let arrayFecha = strfecha.split(' ');
    // la fecha se convierte en un array donde [dia, mes, dia, año, hora, zona horaria]
    if(arrayFecha.length > 2){
        let horacompt = gethora(arrayFecha[4])
        let intFecha = {
            anio: parseInt(arrayFecha[3]),
            mes: getmes(arrayFecha[1]),
            dia: parseInt(arrayFecha[2]),
            hora: parseInt(horacompt[0]),
            min: parseInt(horacompt[1]),
            seg: parseInt(horacompt[2])
        }
        let jsfecha = new Date(intFecha.anio, intFecha.mes, intFecha.dia, intFecha.hora, intFecha.min, intFecha.seg)
        return jsfecha

    }else{
        let jsfecha = new Date(0, 0, 0, 0, 0, 0)
        return jsfecha

    }


}

function getmes(mes){
    let arraymeses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < arraymeses.length; i++) {
        if (mes == arraymeses[i]){
            return i
        }
        
    }

    return 0

}

function gethora(hora){
    let arryhora = hora.split(':');

    return arryhora
}

function startime(order){
    let fechajs = JSFecha(order[0].Active);
    let fechita = JSClock(fechajs);
    return fechita
}

function finishtime(order){
    let starttime = JSFecha(order[0].Active);
    let timetaken = order[0].stp1 + order[0].stp2 + order[0].stp3 + order[0].completado;
    let endtime = tiempoTranscurrido(starttime, timetaken);
    let fechita = JSClock(endtime);
    return fechita;
}

async function stringhora(fecha){
    let jsfecha = JSFecha(fecha);
    let horastr = JSClock(jsfecha);

    return horastr
}

async function leeranio(fecha){
    let jsfecha = JSFecha(fecha);
    let anio = jsfecha.getUTCFullYear();
    
    return anio
}

async function checkmins(id_o){
    let order = await supp.getdeli(id_o);
    let fecha = JSFecha(order[0].Active)
    let mins = DifDeTiempo(fecha)
    return mins
}

exports.finishtime = finishtime;
exports.startime = startime;
exports.JSFecha = JSFecha;
exports.DifDeTiempo = DifDeTiempo;
exports.tiempoTranscurrido = tiempoTranscurrido;
exports.JSClock = JSClock;
exports.stringhora = stringhora;
exports.leeranio = leeranio;
exports.checkmins = checkmins;