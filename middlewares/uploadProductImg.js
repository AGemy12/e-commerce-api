import multer from "multer";
import appError from "../utils/appError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    const fileOriginName = file.originalname.split(".")[0];
    const fileExt = file.mimetype.split("/")[1];
    const fileName = `${fileOriginName}-${Date.now()}.${fileExt}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];

  if (fileType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter });

export default upload;
