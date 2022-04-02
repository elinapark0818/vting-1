import multer from "multer";
// import multerS3 from "multer-s3";
// import aws from "aws-sdk";
// aws.config.loadFromPath(__dirname + "/../config/s3.json");

// const s3 = new aws.S3();
// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "vtingimage",
//     acl: "public-read",
//     key: function (req, file, cb) {
//       cb(null, Date.now() + "." + file.originalname.split(".").pop()); // 이름 설정
//     },
//   }),
// });

// export default upload;
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });
