const mongoose = require('mongoose');

mongoose
.connect(process.env.dbUrl)
.then(()=>{console.log('Database Connected')})
.catch((err)=>{console.log(err)})