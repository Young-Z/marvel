'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var express = require('express'),
  app = express(),
  path = require('path');



//////////////////////////////
// App Variables
//////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////
// Start the server
//////////////////////////////
app.listen(7376, function () {
  console.log('Server starting on 7376');
});
