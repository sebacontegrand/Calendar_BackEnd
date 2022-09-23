const { Router } = require('express');
const router = Router();
const {validarCampos} = require('../middlewares/validar-campos')
const {isDate} = require('../helpers/isDate')
const {validarJWT} = require('../middlewares/validar-jwt')
const {getEventos,crearEvento,actualizarEvento,eliminarEvento} =require('../controllers/events')
const{check} = require('express-validator')
router.use(validarJWT)

router.get('/',
[], getEventos);

router.post('/',[
    check('title','el titulo es obligatorio').not().isEmpty(),
    check('initialDate','Fecha de inicio es obligatoria').custom(isDate),
    check('finalDate','Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
], crearEvento);

router.put('/:id',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('initialDate', 'Fecha de inicio es obligatoria').custom(isDate),
    check('finalDate', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports=router
