var express = require('express');
var router = express.Router();
var request = require('request');

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
  request('http://localhost:3002/asn_rec_cortina', function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    // console.log(JSON.parse(body));
    res.render('recepcion', { title: 'Recepción de Mercancía', option: 'recepcion' , arrAsnRecCor: JSON.parse(body)});
  });
});

// socket
var http = require('http');
var server = http.createServer(express);
var io = require('socket.io').listen(server);

io.on('connection', (socket)=> {
  socket.emit('rec_cortina', request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
    return JSON.parse(body);
  }));
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
