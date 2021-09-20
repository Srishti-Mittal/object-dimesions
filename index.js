const express = require('express')
const { spawn } = require('child_process')
const app = express()
const path=require("path");
const ejs=require("ejs");
const multer = require('multer')
// hello
const upload = multer({
  dest: 'data',
  limits: {
    fileSize: 1000000,
  },
  
  fileFilter(req, file, cb) {
  
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
    cb(new Error('Please upload an image.'))
  }
    cb(undefined, true)
  }
})
  
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname,'public')));

app.post('/upload', upload.single('upload'), (req, res) => {
  if(req.file){
    console.log("File name",req.file.filename)
    const python = spawn('python', ['object_size.py',`data/`+req.file.filename,4])
    let output;
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...')
      // output+=data
      output = data
    })
    
      python.stdout.on('close', function (code) {
        // console.log("OP",output.toString(),"end")
        var limit = output.toString().split("limit")[output.toString().split("limit").length-1]
      console.log(limit)
      // console.log("Limit is ",limit)

        // console.log('Closed with code ',code)
        var imgArray = []
        for(var i=0;i<limit;i++){
          imgArray.push("output/"+i+".jpeg")
        }
        console.log(imgArray)
        res.render('pages/image',{data: "output/0.jpeg",imgs:imgArray});

      })
    
    
  }else{
    res.status(400).json({msg:"Img Not Received"})
  }
})

app.get('/check',(req,res)=>{
  console.log("Check Route")
  res.render('pages/image',{data: "output/0.jpeg"});
})

app.get('/',(req,res)=>{
  console.log("Home Route")
  res.render('pages/index');
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
