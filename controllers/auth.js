const  { response }=  require('express')
const bcrypt =  require('bcryptjs')
const Usuario = require('../models/Usuario')
const {generarJWT} = require('../helpers/jwt')


const crearUsuario = async(req,res = response)=>{

    const{name,email,password} =req.body
    try{ 

        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'el usuario ya existe con ese correo'
            })
        }
        usuario =  new Usuario(req.body)
        //encriptar
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt)
        usuario.save();
        //generar token
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
        ok:true,
        uid:usuario.id,
        name:usuario.name,
        msg:'usuario creado correctamente',
        token
      
    })}
    catch(error){
        res.status(500).json({
            ok:false,
            msg:'Error en db'})
    }
   
}

const loginUsuario = async(req,res=response)=>{
    
    const{email,password} =req.body
    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'el usuario no existe con ese correo'
            })
        }
        const validPassword = bcrypt.compareSync(password,usuario.password);
        
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: "password incorrecto"

            })
        }
        const token = await generarJWT(usuario.id, usuario.name)
        res.json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })



    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error en db'})
    }
    
}

const revalidarToken = async (req,res=response)=>{

    const uid = req.uid
    const name= req.name
    const token = await generarJWT(uid,name)

    res.json({
        ok:true,
        msg:'renew',
        uid:uid,
        token
    })
}
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}