const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
     
       
        cb(null,'./uploads');
    },
    filename: (req, file, cb) => {
        console.log("inside filenmae")
        const filename = `image-${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})


const fileFilter = (req, file, cb) => {

    if (file.mimetype==="image/png" || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg') {
        cb(null, true)
    } else {

        cb(null, false)
        return cb(new Error("only png,jpg,jpeg files are allowed..."))
    }

}

// 


const multerConfig=multer({
    storage,fileFilter
})


module.exports = multerConfig