const express = require('express');
const router = express.Router();
const supp = require('../dbsupp');
const format = require('../formato');
const check = require('../check');
const timer = require('../timer');
const multer = require('multer');
const upload = multer({dest : './uploads'});
const uuid = require('uuid');
const fs = require('fs'); // core de nodejs (no se descarga)


router.get('/', async function(req, res, next) {
  if(req.session.admin){
    let admin = await supp.getperson(req.session.admin);
    let data = await supp.activeorders();
    let orders = await format.panelformat(data);
    data = await supp.noactiveorders();
    let forders = await format.panelformat(data);
    let uncheckdelis = await check.ordernotification();
    res.render('paneladmin', {admin: admin, order: orders, forders : forders, alerts: uncheckdelis});
  }else{
    res.redirect('/login')
  }

})

router.get('/cancelorder/:id_d', async(req,res,next)=>{
  if(req.session.admin){
    let id_d = req.params.id_d;
    await supp.cancelorder(id_d);
    res.redirect('/paneladmin');
  }else{
    res.redirect('/login')
  }
})
    
router.get('/limpiar', async(req,res,next)=>{
  if(req.session.admin){
    await supp.cleanup();
    res.redirect('/paneladmin')
  }else{
    res.redirect('/login')
  }
})

// Detalles de los pedidos

router.get('/orderpage/:deli', async(req, res, next)=>{
  let id_order = req.params.deli;
  let obj = await supp.getpreorder(id_order);
  let obj2 = await format.showorder(obj);
  let total= await format.checkme(obj2);

 res.render('orderpage', {product: obj2, check: total, order: id_order});
})

router.get('/clientdata/:id_c/:id_o', async(req,res,next)=>{
  let client = await supp.getperson(req.params.id_c);
  let id_order = req.params.id_o;

  // Si el cliente es el admin se cambia el valor de client por los valores del array comentarios
  if (client[0].permisos == 1){
    let order = await supp.getdeli(id_order);
    client = await format.getrealclient(order);
  }

  res.render('DeliveryClient', {ClientData : client, order : id_order})
})

router.get('/info/:id_o', async(req,res,next)=>{
  let id_order = req.params.id_o;
  let order = await supp.getdeli(id_order);
  let comentarios = await format.infoformat(order);
  if (comentarios.length > 1){
    res.render('DeliveryComments', {comments: comentarios[0], order: id_order});
  }else{
    res.render('DeliveryComments', {comments: comentarios, order: id_order});
  }

})

// Checkeo de pasos

router.get('/checkit/:order/:stp/:lugar', async(req, res, next)=>{
  let donde = req.params.lugar;
  let id_o = req.params.order;
  let stp = req.params.stp;
  let mins = await timer.checkmins(id_o);
  let ok = await supp.checkstp(id_o, stp, mins);
  let admin = await supp.getperson(req.session.admin);
  let data = await supp.activeorders();
  let orders = await format.panelformat(data);
  data = await supp.noactiveorders();
  let forders = await format.panelformat(data);
  if (ok){
    if (donde == 1){
      res.render('paneladmin', {admin: admin, order: orders, forders : forders,});
    }else{
      res.redirect('/kitchen');
    };
  }else{
    res.render('paneladmin', {admin: admin, order: orders, forders : forders, msj: 'err'});
  }
})

// Administrador de productos

router.get('/productos', async(req, res, next)=>{
  if(req.session.admin){
    let productos = await supp.getproductos();
    res.render('admproductos', {data: productos});
  }else{
    res.redirect('/login');
  }
})

router.get('/productos/edit/:id_p', async(req, res, next)=>{
  if(req.session.admin){
    let item = await supp.getproducto(req.params.id_p)
    res.render('editproduct', {option: 'edit', item: item})
  }else{
    res.redirect('/login')
  }
})

router.get('/productos/add', async(req,res,next)=>{
  if(req.session.admin){
    res.render('altaproducto')
  }else{
    res.redirect('/login')
  }
})

router.post('/productos/editproduct',  upload.array('img_p', 1), async(req, res, next)=>{
  let item = {};
  let id_p = req.body.id_p;
  if(req.files[0]){
    let obj = await supp.getproducto(id_p);
    let mimetype = req.files[0].mimetype;
    let arrayMimeType = mimetype.split('/');
    let extension = arrayMimeType[1];
    let nombre_imagen = uuid();
    item = {
      Nombre: req.body.nmbr,
      Descripcion: req.body.descripcion,
      stock: req.body.stck,
      precio: req.body.precio,
      pic : nombre_imagen + "." + extension 
    }
    fs.unlink('./public/images/'+ obj.pic, (error)=>{
      if(error){
        console.log(error);
      }  
    })  
    fs.createReadStream('./uploads/'+req.files[0].filename).pipe(fs.createWriteStream('./public/images/'+ item.pic));
    fs.unlink('./uploads/'+req.files[0].filename, (error)=>{
        if(error){
            console.log(error);
        }
    });
  }else{
    item = {
      Nombre: req.body.nmbr,
      Descripcion: req.body.descripcion,
      stock: req.body.stck,
      precio: req.body.precio,
    }
  }
  await supp.editproduct(item, id_p);
  res.redirect('/paneladmin/productos');
})

router.post('/productos/alta', upload.array('img_p', 1), async(req,res,next)=> {
  if(req.files[0]){
    let mimetype = req.files[0].mimetype;
    let arrayMimeType = mimetype.split('/');
    var extension = arrayMimeType[1];
    var nombre_imagen = uuid();

    fs.createReadStream('./uploads/'+ req.files[0].filename).pipe(fs.createWriteStream('./public/images/'+  nombre_imagen + "." + extension));
    fs.unlink('./uploads/'+req.files[0].filename, (error)=>{
        if(error){
            console.log(error);
        }
    });
  }
  let obj = {
      Nombre : req.body.nmbr,
      Descripcion:req.body.descripcion ,
      precio : req.body.precio,
      stock :req.body.stck ,
      pic : nombre_imagen + "." + extension 
  }
  let alta = await supp.altaproducto(obj);
  res.redirect('/paneladmin/productos')
})

router.get('/productos/delete/:id_p', async(req, res, next)=>{
  if(req.session.admin){
    await supp.eliminarproductos(req.params.id_p);
    res.redirect('/paneladmin/productos');
  }else{
    res.redirect('/login');
  }

})


module.exports = router;
