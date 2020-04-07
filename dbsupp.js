const pool = require('./bd');
const check = require('./check');

//Funciones de busqueda generales

async function getproductos(){
    let query = 'select * from productos';
    let rows = await pool.query(query);
    return rows;
}
async function activeorders(){
    let query = 'select * from delivery_order where year(Active) > 2018 and completado = 0 ORDER BY Fecha'
    let rows = pool.query(query);
    return rows;
}
async function noactiveorders(){
    let query = 'select * from delivery_order where completado > 0'
    let rows = pool.query(query);
    return rows;
}
async function kitchenorders(){
    let query = 'select * from delivery_order where stp1 > 0 and stp2 = 0'
    let rows = pool.query(query);
    return rows;
}
async function cancelorders(){
    let query = 'select * from delivery_order where completado = 9999'
    let rows = pool.query(query);
    return rows;
}

async function getpreorder(id_o){
    //regresa todo los productos correspondientes a la orden # id_o
    let query = 'select * from precompra where id_o_pc = ?';
    let rows = await pool.query(query, id_o);
    return rows;
}


//Funciones de busqueda especifica

async function getcat(id_cat){
    let query = 'select * from categorias where id_cat = ?';
    let rows = await pool.query(query, id_cat);
    return rows;
}

async function getperson(id){
    let query = 'select * from clientes where id_client = ?';
    let clientinfo = await pool.query(query, id);
    return clientinfo;
}

async function getproducto(id_p){
    let query = 'select * from productos where id_p = ?';
    let rows = await pool.query(query, id_p);
    return rows;
}

async function getdeli(id_o){
    let query = 'select * from delivery_order where id_d = ?';
    let order = await pool.query(query, id_o);
    return order;
}

async function lastactiveorder(id){
    let query = 'select * from delivery_order where id_c_d = ? and year(Active) = 0 ORDER BY Fecha DESC LIMIT 1';
    let rows = await pool.query(query, id);
    return rows;
}

async function getactiveorders(id){
    let query = 'select * from delivery_order where id_c_d = ? and year(Active) != 0 and completado = 0 ORDER BY Fecha'
    let rows = await pool.query(query, id);
    return rows;
}

async function getreserva(id_reserva){
    //regresa todo los productos correspondientes a la orden # id_o
    let query = 'select * from precompra where id_pc = ?';
    let rows = await pool.query(query, id_reserva);
    return rows;
}

//Funciones de ingreso de datos

async function addcarrito(obj){
    let query = 'insert into precompra set ?';
    await pool.query(query, obj);
    return true;
}

async function createorder(order, id_c){
    let query = 'insert into delivery_order set ?'
    let rows = await pool.query(query, order);
    return rows.insertId;
}

async function registrarUsuario(user){
    if(await check.mailtaken(user.mail_client)){
        return false    
    }else{
        let query = 'insert into clientes set ?'
        let rows = await pool.query(query, user)
        return rows.insertId;
    }
}

async function altaproducto(obj){
    let query = 'insert into productos set ?'
    let rows = await pool.query(query, obj)
    return rows.insertId;
}

// Funciones para borrar datos

async function borrame(tabla, id){
    let query = 'Delete from ' + tabla + ' where id_pc = ? '
    if(await pool.query(query, id)){
        return true
    }else{
        return false
    };
}

async function cancelorder(id){
    let query = 'delete from precompra where id_o_pc = ?';
    await pool.query(query, id);
    query = 'delete from delivery_order where id_d = ?';
    await pool.query(query, id);
    return true;
}

async function eliminarproductos(id_p){
    let query = 'DELETE from productos where id_p = ?'
    if (await pool.query(query, id_p)){
        return true
    }else{
        return false
    }
}

async function cleanup(){
    let date = new Date();
    let current_month = date.getMonth() + 1;
    let query = 'Select * from delivery_order where completado > 0 and Month(Active) < ? ';
    let rows = await pool.query(query, current_month);
    for (let i = 0; i < rows.length; i++) {
        await cancelorder(rows[i].id_d);
    }
    return true
}

// Funiones para actualizar datos

async function editproduct(data, id_p){
    let query = 'UPDATE productos SET ? WHERE id_p = ?';
    await pool.query(query, [data, id_p]);
    return true;
}

async function listo(id_o){
    // se da de alta la orden
    let query = 'UPDATE delivery_order SET Active = CURRENT_TIMESTAMP WHERE id_d = ?';
    await pool.query(query, id_o);
    // se suman a los contadores de ventas y se restan al stock
    let rows = await getpreorder(id_o);
    if(rows.length > 0){
        for (let i = 0; i < rows.length; i++){
            let producto = await getproducto(rows[i].id_p_pc);
            let stock = producto[0].stock - rows[i].cantip;
            let cantidad = producto[0].ventas + rows[i].cantip;
            await contup(rows[i].id_p_pc, cantidad);
            await stockdown(rows[i].id_p_pc, stock);
        }
        return true;
    }else{
        return false;
    }
}

async function stockdown(id_p, newstock){
    let query = 'UPDATE productos SET stock = ? WHERE id_p = ?'
    await pool.query(query, [newstock, id_p]);
    return true;
}

async function contup(id_p, cantidad){
    let query = 'UPDATE productos SET ventas = ? WHERE id_p = ?'
    await pool.query(query, [cantidad, id_p]);
    return true;
}

async function checkstp(id_o, stp, mins){
    let query = ''
    if (stp == 4){
        query = 'UPDATE delivery_order SET completado = ? WHERE id_d = ?';
    }else{
        query = 'UPDATE delivery_order SET stp'+ stp +' = ? WHERE id_d = ?';
    };
    await pool.query(query, [mins, id_o]);
    return true;
}

async function comentar(comentario, id_d){
    let query = 'UPDATE delivery_order SET Comentarios = ? WHERE id_d = ?';
    await pool.query(query, [comentario, id_d]);
    return true;
}

async function changepassword(id_u, newpass){
    let query = 'Update clientes set password_client = ? where id_client = ?';
    await pool.query(query, [newpass, id_u])
    return true;
}

async function editperson(id_c, user){
    let query = 'UPDATE clientes set ? where id_client = ?';
    if (await pool.query(query, [user, id_c])){
        return true;
    }else{
        return false;
    }
}


exports.getproductos = getproductos;
exports.activeorders = activeorders;
exports.noactiveorders = noactiveorders;
exports.kitchenorders = kitchenorders;
exports.cancelorders = cancelorders;
exports.getpreorder = getpreorder;

exports.getcat = getcat;
exports.getperson = getperson;
exports.getproducto = getproducto;
exports.getdeli = getdeli;
exports.lastactiveorder = lastactiveorder;
exports.getactiveorders = getactiveorders;
exports.getreserva = getreserva

exports.addcarrito = addcarrito;
exports.createorder = createorder;
exports.registrarUsuario = registrarUsuario
exports.altaproducto = altaproducto;

exports.borrame = borrame
exports.cancelorder = cancelorder;
exports.eliminarproductos = eliminarproductos
exports.cleanup = cleanup;

exports.editproduct = editproduct;
exports.listo = listo;
exports.stockdown = stockdown;
exports.contup = contup
exports.checkstp = checkstp
exports.comentar = comentar;
exports.changepassword = changepassword;
exports.editperson = editperson;