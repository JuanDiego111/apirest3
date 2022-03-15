const express=require('express')
const app=express()
const mysql = require('mysql2');
const bodyParser = require('body-parser')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Xeraton246810',
  database: 'bodeganodejs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/api/existencia', function(pet,res){
  pool.getConnection(function(err,connec){
    const query = `SELECT * FROM existencia`
    connec.query(query, function(error, filas, campos){
      res.json({data:filas[0]})
    } )
    connec.release()
  })
})

app.get('/api/existencia/:id', function(pet,res){
  pool.getConnection(function(err,connec){
    const query = `SELECT * FROM existencia WHERE id=${connec.escape(pet.params.id)}`
    connec.query(query, function(error, filas, campos){
      if (filas.length>0){
        res.status(201)
        res.json({data:filas})

      }
      else{
        res.status(404)
        res.send("No existe el registro")
      }
    } )
    connec.release()
  })
})

app.post('/api/existencia', function(pet,res){
  pool.getConnection(function(err,connec){
    const query = `INSERT INTO existencia (producto,cantidad) VALUES (${connec.escape(pet.body.producto)},${connec.escape(pet.body.cantidad)})`
    console.log(query)
    connec.query(query, function(error, filas, campos){
      const nuevoId=filas.insertId
      const queryConsultas= `SELECT * FROM existencia WHERE id=${connec.escape(nuevoId)}`
      connec.query(queryConsultas, function (error,filas,campos) {
        res.status(201)
        res.json({data:filas[0]})
        
      })
    } )
    connec.release()
  })
})

app.listen(8080,function () { 
  console.log("inventario en linea")
})