import multer from "multer";

const randomString = () => {
  return Math.random().toString(36).substring(7);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./temp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + randomString() + file.originalname);
  },
});

const upload = multer({
  storage,
});

export { upload };
