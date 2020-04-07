const app = require('express');
const router = app.Router();
const pool = require('../bd');
const md5 = require('md5');


router.get('/', async(req, res, next)=>{
    res.render('login');
})

router.get('/logout', async(req,res,next)=> {
    req.session.destroy(); // destruye la sesion DEL 
    res.redirect('/login');
})

router.post('/', async(req, res, next)=>{
    let username = req.body.usuario_u;
    let pass = md5(req.body.password_u);
    let user = await login(username, pass);
    if (user.length > 0){
        const id = user[0].id_client;
        if (user[0].permisos == 1) {
            req.session.admin = id;
            res.redirect('/paneladmin');
        }else{
            req.session.user = id;
            res.redirect('/start');
        };
    }else{
        res.render('login', {alerta: 'Usuario o clave invalidas'});
    }; 
})

async function login(mail, pass){
    let query = 'select * from clientes where mail_client = ? and password_client = ?';
    let rows = await pool.query(query, [mail, pass]);
    return rows;
}

module.exports = router;