const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');
const check = require('../check');
const md5 = require('md5');
const uuidv3 = require('uuid/v3');

// Registro de nuevos usuarios

router.get('/', (req, res, next)=>{
    res.render('registro', {title: 'Sing up'});
})

router.get('/registro/mailConfirmation/:id_u/:ConfirmationCode', async(req,res,next)=>{
    let person = await supp.getperson(req.params.id_u);
    let code = req.params.ConfirmationCode;
    let msj = ''
    if(person[0].Confirmado == code){
        await supp.Confirmado(req.params.id_u);
        msj = 'Your account has been confirm';
    }else{
        msj = 'Error, we could not confrim your account :(';
    }
    res.render('verification', {alerta: msj});
})

router.post('/', async function(req, res, next){
    let user = {
        Nombre_client: req.body.nombre,
        Apellido_client: req.body.apellido,
        mail_client: req.body.mail,
        Telefono_client: req.body.tlf,
        direccion_client: req.body.direc,
        password_client: md5(req.body.pass1),
        // Confirmado: uuidv3()
    };
    console.log(user)
    
    //
    //     let obj = {
        //         to : 'paolacdf29@gmail.com',
        //         subject : 'Email confirmation',
        //         text : '/registro/mailConfirmation/'+ok+'/'+ user.Confirmado
        //     }
        //   let envio_mail = await mail.main(obj);
        
        //   if(envio_mail) {
        //     // mensaje enviado correctamente
        //     console.log("Mail enviado")
        //   } else {
        //     // no se pudo enviar el mensaje
        //   }

        let alerta = await checkform(user.mail_client, req.body.pass1, req.body.pass2);
        await supp.registrarUsuario(user);

    if (alerta == ''){
        console.log('Registro exitoso');
        res.redirect('/login')
    }else{
        console.log('Registro fallido')
        res.render('registro', {msj: alerta})
    };
    
    
})

// Editar usuarios existentes

router.get('/editar', async function(req, res, next){
    if(req.session.user || req.session.admin){
        let id_c;
        if (req.session.user){
            id_c = req.session.user;
        }else if(req.session.admin){
            id_c = req.session.admin 
        }
        let user = await supp.getperson(id_c);
        res.render('editperfil', {person: user});

    }else{
        res.redirect('/login')
    }
})

router.post('/editar', async function(req, res, next){
    if(req.session.user || req.session.admin){
        let id_c;
        if (req.session.user){
            id_c = req.session.user;
        }else if(req.session.admin){
            id_c = req.session.admin 
        }
        let user = {
            Nombre_client: req.body.nombre,
            Apellido_client: req.body.apellido,
            mail_client: req.body.mail,
            Telefono_client: req.body.tlf,
            direccion_client: req.body.direc,
        };
        await supp.editperson(id_c, user);
        res.redirect('/userconf');
    }else{
        res.redirect('/login')
    }
})

async function checkform(mail, pass1, pass2){
    let msj = ''
    if(pass1 != pass2){
        msj = 'passwords must match'
    }else if(await check.mailtaken(mail)){
        msj = 'There is one account registered with this email'
    }

    return msj;
}

module.exports = router;