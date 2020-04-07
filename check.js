const pool = require('./bd');
const supp = require('./dbsupp');
const timer = require('./timer')


//Funciones de chequeo

async function issend(id_order){
    let query = 'select Active from delivery_order where id_d = ?';
    let rows = await pool.query(query, id_order);
    let anio = await timer.leeranio(rows[0].Active);
    if (anio > 2010){
        return true
    }else{
        return false
    }
}

async function isactive(id){
    let rows = await supp.getdeli(id);
    if(rows[0].stp1 > 1 && rows[0].completado == 0){
        return true;
    }else{
        return false;
    }
}

async function mailtaken(mail){
    let query = 'Select * from clientes where mail_client = ?';
    let rows = await pool.query(query, mail);
    if(rows.length > 0){
        return true
    }else{
        return false
    }
}

async function ordernotification(){
    let delis = await supp.activeorders();
    let noComfirmado = []
    for (let i = 0; i < delis.length; i++) {
        if(delis[i].stp1 == 0){
            noComfirmado.push(delis[i]);
        }
    }
    return noComfirmado;
}

exports.issend = issend
exports.isactive = isactive;
exports.mailtaken = mailtaken;
exports.ordernotification = ordernotification;