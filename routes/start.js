const express = require('express');
const router = express.Router();
const supp = require('../dbsupp');


router.get('/', async(req, res, next)=>{
  if(req.session.user){
    let id_client = req.session.user;
    let data = await supp.getperson(id_client);
    let delis = await supp.getactiveorders(id_client);
    // let status = statuspliz(delis);
    res.render('start',{user: data[0].Nombre_client, id_c: id_client, orders: delis});
  }else{
    res.redirect('/login');
  };
});

router.get('/newdeli', async(req, res, next)=>{
  if(req.session.user){
    let id_client = req.session.user;
    let setorder = {
      id_c_d : id_client
    }
    let id_order = await supp.createorder(setorder, id_client);
    req.session.deli = id_order
    res.redirect('/step1');
  }else{
    res.redirect('/login');
  }
})

router.get('/olddeli', async(req, res, next)=>{
  if(req.session.user){
    let id_c = req.session.user;
    let data = await supp.lastactiveorder(id_c);
    if(data.length>0){
      req.session.deli = data[0].id_d;
      res.redirect('/step1');
    }else{
      let person = await supp.getperson(id_c);
      let delis = await supp.getactiveorders(id_c);
      let msj = 'There are no pending orders, please start a new one'
      res.render('start',{user: person[0].Nombre_client, id_c: id_c, orders: delis, alert: msj});
    };
  }else{
    res.redirect('/login');
  }
})

router.get('/onthego/:id_d', async(req, res, next)=>{
  if(req.session.user){
    let id_d = req.params.id_d;
    req.session.deli = id_d;
    res.redirect('/step4');
  }else{
    res.redirect('/login');
  }
})

router.get('/admin/newdeli', async(req, res, next)=>{
  if(req.session.admin){
    let id_client = req.session.admin;
    let lastorder = await supp.lastactiveorder(id_client);
    if(lastorder.length > 0){
      req.session.deli = lastorder[0].id_d  
    }else{
      let setorder = {
        id_c_d : id_client
      }
      let id_order = await supp.createorder(setorder, id_client);
      req.session.deli = id_order
    }
    res.redirect('/step1');

  }else{
    res.redirect('/login');
  }
})

// function statuspliz(delis){
//   // console.log(delis);
// }

// function delistat(deli){
//   let status = '';
//   if (deli.stp1 <= 0){
//     status = 'Waiting for confirmation';
//   }else{
//     if (deli.stp2 <= 0){
//       status = 'on preparation'; 
//     }else{
//       if (deli.stp3 <= 0){
//         status = 'on the way';
//       }
//     }
//   }
  
//   return status

// }

module.exports = router;
