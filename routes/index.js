var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('asn', { title: 'Aviso de Arribos', option: 'asn', needTbl: true });
});

/* ASN. */
router.get('/asn', (req, res, next) => {
  res.render('asn', { title: 'Aviso de Arribos', option: 'asn', needTbl: true });
});

/* Recepcion. */
router.get('/recepcion', (req, res, next) => {
  request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    // console.log(JSON.parse(body));
    res.render('recepcion', { title: 'Recepción de Mercancía', option: 'recepcion' , arrAsnRecCor: JSON.parse(body)});
  });
  
  // Example of how to use socket
  /* res.io.on('connection', (socket) => {
    socket.on('udt_rec_cortina', () => {
      request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
        socket.emit('udt_rec_cortina', JSON.parse(body));
      });
    });
  }) */
});

/* Almacenamiento. */
router.get('/almacenamiento', (req, res, next) => {
  res.render('almacenamiento', { title: 'Almacenamiento', option: 'almacenamiento', needTbl: true });
});

/* Inventario. */
router.get('/inventario', (req, res, next) => {
  res.render('inventario', { title: 'Inventario', option: 'inventario' });
});

/* Expedicion. */
router.get('/expedicion', (req, res, next) => {
  res.render('expedicion', { title: 'Expedicion', option: 'expedicion' });
});

/* Devolución. */
router.get('/devolucion', (req, res, next) => {
  res.render('devolucion', { title: 'Devoluciones', option: 'devolucion' });
});

module.exports = router;
