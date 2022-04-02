const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "AKIAX2EARFLC24B3MKUZ", //노출주의
  secretAccessKey: "OgINmXgSpjfbVf141AWOul1EKhTjoBWJzDJMwI+J", //노출주의
  region: "ap-northeast-2", //노출주의
});

const storage = multerS3({
  s3: s3,
  bucket: "vtingimage",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `uploads/${Date.now()}_${file.originalname}`);
  },
});

exports.upload = multer({ storage: storage });
