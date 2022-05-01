const multer = require("multer");
const path = require("path")
const multerconfiguration = multer({
    storage: multer.diskStorage({}),
    filefilter:(req,file,cb)=>{
        let extension =path.extname(file.orignalname)
        if (extension!=="jpg"&&extension!=="jpeg"&&extension!=="png"){
            cb(new Error("filetype not supported",false));
            return;
        }
        cb(null,true);
    },

})
module.exports = multerconfiguration;