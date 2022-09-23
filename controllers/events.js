const  { response }=  require('express');
const Evento = require('../models/Evento')




const getEventos = async(req,res = response)=>{

    const eventos = await Evento.find()
                                .populate('user','name');
    res.json({
        ok:true,
        eventos
    })
    
}

const  crearEvento = async(req,res=response)=>{
    
    const evento = new Evento(req.body)

    try {
        evento.user=req.uid
        const eventoEnDb = await evento.save()
        res.json({
            ok:true,
            evento: eventoEnDb
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'errores de administrador...'
        })
    }    

   
    
}

const actualizarEvento = async(req,res=response)=>{

    const eventoId = req.params.id;
    const uid = req.uid
try {
    const evento = await Evento.findById( eventoId );
    console.log(evento.user)
    if(!evento){
        return res.status(404).json({
            ok:false,
            msg:'el evento no existe por ese id'
        })
    }
    if(evento.user.toString() !== uid){
        return res.status(401).json({
            ok:false,
            msg: 'no tiene privilegio para guardar'
        })
    }
    const nuevoEvento ={
        ...req.body,
        user:uid
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento,{new:true});
    res.json({
        ok:true,
        evento:eventoActualizado
    })
} catch (error) {
    console.log(error)
    res.status(500).json({
        ok:false,
        msg:'hable con administrador'
    })
}
   }

const eliminarEvento = async(req,res=response)=>{
    
    const eventoId = req.params.id;
    const uid = req.uid
try {
    const evento = await Evento.findById( eventoId );
    
    if(!evento){
        return res.status(404).json({
            ok:false,
            msg:'el evento no existe por ese id'
        })
    }
    if(evento.user.toString() !== uid){
        return res.status(401).json({
            ok:false,
            msg: 'no tiene privilegio para borrar'
        })
    }
    

    const eventoEliminado = await Evento.findByIdAndDelete(eventoId,{new:true});
    res.json({
        ok:true,
        evento:eventoEliminado
    })
} catch (error) {
    console.log(error)
    res.status(500).json({
        ok:false,
        msg:'hable con administrador'
    })
}
    
    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento

}
