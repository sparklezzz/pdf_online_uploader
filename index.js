
var PDF = require('pdfkit');            //including the pdfkit module 
var fs = require('fs'); 
var path = require('path');
var express = require('express');
var multer  =   require('multer');
var app = express();

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
//var upload = multer({ storage : storage}).single('uploads');
var upload = multer({ storage : storage}).array('uploads');

// enable cross region call

app.use(function(req, res, next) {
    res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'POST', 'PUT']);
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/file-upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {

        	console.log("Error uploading file. " + err);
            return res.end("Error uploading file.");
        }
        console.log("File is uploaded");
        //console.log(req.files);

        //for (var i = 0; i < req.files.length; ++i) { // do not use this, will cause variable closure problem
        req.files.forEach(function (file) {
          // transform to pdf
          //var file = req.files[i];
          console.log(file);
          var upload_path = file['path'];
          var pdf_output_path = upload_path + '.pdf';
          console.log("transforming " + upload_path + " to " + pdf_output_path);
          fs.readFile(upload_path, 'utf8', function (err, text) {
            if (err) throw err;
              var doc = new PDF();                        //creating a new PDF object 
              console.log(pdf_output_path);
              doc.pipe(fs.createWriteStream(pdf_output_path));  //creating a write stream                           
              //to write the content on the file system 
              doc.text(text, 100, 100);             //adding the text to be written,            
              // more things can be added here including new pages 
              doc.end(); //we end the document writing.
          });
        });

        res.end("File is uploaded");
    });
});


app.post('/file-upload2', function(req, res) {
  console.log(req);
  console.log(req.xhr);
  console.log(req.body);
  console.log(req.files);
});


app.listen(3000);
console.log('Listening on port 3000!');
/*
var PDF = require('pdfkit');            //including the pdfkit module 
var fs = require('fs'); 
var text = 'ANY_TEXT_YOU_WANT_TO_WRITE_IN_PDF_DOC';

doc = new PDF();                        //creating a new PDF object 
doc.pipe(fs.createWriteStream('PATH_TO_PDF_FILE'));  //creating a write stream                           
              //to write the content on the file system 
doc.text(text, 100, 100);             //adding the text to be written,            
              // more things can be added here including new pages 
doc.end(); //we end the document writing.
*/
