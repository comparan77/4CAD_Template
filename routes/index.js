var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('asn', { title: 'Aviso de Arribos', option: 'asn', needTbl: true });
});

/* ASN. */
router.get('/asn', function(req, res, next) {
  res.render('asn', { title: 'Aviso de Arribos', option: 'asn', needTbl: true });
});

/* Recepcion. */
router.get('/recepcion', function(req, res, next) {
  res.render('recepcion', { title: 'Recepción de Mercancía', option: 'recepcion' });
});

/* Almacenamiento. */
router.get('/almacenamiento', function(req, res, next) {
  res.render('almacenamiento', { title: 'Almacenamiento', option: 'almacenamiento', needTbl: true });
});

/* Inventario. */
router.get('/inventario', function(req, res, next) {
  res.render('inventario', { title: 'Inventario', option: 'inventario' });
});

/* Expedicion. */
router.get('/expedicion', function(req, res, next) {
  res.render('expedicion', { title: 'Expedicion', option: 'expedicion' });
});

/* Devolución. */
router.get('/devolucion', function(req, res, next) {
  res.render('devolucion', { title: 'Devoluciones', option: 'devolucion' });
});

module.exports = router;
