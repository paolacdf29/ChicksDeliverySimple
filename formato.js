const pool = require('./bd');
const supp = require('./dbsupp');
const timer = require('./timer')

// Funciones de formato de objeto

async function showorder(obj){
    let rows = [];
    let prod = [];
    for (let i = 0; i < obj.length; i++) {
        prod = await supp.getproducto(obj[i].id_p_pc);
        if(prod.length > 0){
            rows[i] = {
                id_pc: obj[i].id_pc,
                Nombre : prod[0].Nombre,
                canti : obj[i].cantip,
                precio : prod[0].precio,
                comentario : obj[i].coment
            }
        }else{
            rows[i] = {
                id_pc: obj[i].id_pc,
                Nombre : 'producto no existente',
                canti : obj[i].cantip,
                precio : '0',
                comentario : obj[i].coment
            }
        }
    };
    
    return rows
}

async function panelformat(data){
    let orders = [];
    let client = [];
    let order = [];
    for (let i = 0; i < data.length; i++) {
      client = await supp.getperson(data[i].id_c_d);
      stp1 = showstatus(data[i].stp1);
      stp2 = showstatus(data[i].stp2);
      stp3 = showstatus(data[i].stp3);
      stp4 = showstatus(data[i].completado);
      let horastr = await timer.stringhora(data[i].Fecha);
      order = {
        id_o : data[i].id_d,
        id_c : client[0].id_client,
        nombre_c : client[0].Nombre_client,
        direccion_c : client[0].direccion_client,
        tlf_c : client[0].Telefono_client,
        Coments: data[i].Comentarios,
        hora_o : horastr, 
        status1 : stp1,
        status2 : stp2,
        status3 : stp3,
        status4 : stp4
      };
      orders.push(order);
    };
    return orders;
}

async function getrealclient(order){
    let comentarios = await infoformat(order);
    client =[{
      Nombre_client : comentarios[0].substring(6),
      Telefono_client : comentarios[1].substring(6),
      direccion_client : comentarios[2].substring(8)
    }]

    return client;
}

function showstatus(data){
    if (data > 0){
      msj = 'font-size: 24px; color: green'
    }else{
      msj = 'font-size: 30px; color: black'
    };
    return msj;
}

async function infoformat(orden){
    let commentarray = orden[0].Comentarios.split(',');
    return commentarray
}

// Datos puntuales para mostrar en el front

async function countelement(rows){
    let items = rows.length;
    for (let i = 0; i < rows.length; i++) {
        if(rows[i].cantip > 1){
            items = items + rows[i].cantip - 1;
        }
    }
    return items;
}

async function checkme(obj){
    let sum = 0.0;
    for (let i = 0; i < obj.length; i++) {
        sum = sum + obj[i].precio;
    }
    return parseFloat(sum);
}

async function contfinishorders(id_user){
    let query = 'select * from delivery_order where id_c_d = ? and completado != 0';
    let rows = await pool.query(query, id_user);
    return rows.length;
}

exports.showorder = showorder;
exports.panelformat = panelformat;
exports.getrealclient = getrealclient;
exports.showstatus = showstatus;
exports.infoformat = infoformat;

exports.countelement = countelement;
exports.checkme = checkme;
exports.contfinishorders = contfinishorders;