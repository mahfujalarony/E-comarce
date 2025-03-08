const mega = require("mega");
const fs = require("fs");

const megaStorage = mega({ email: "mahfujalamrony07@gmail.com", password: "MS4i=s+@U'5W%a}" });

const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or invalid file type!" });
    }

    const fileStream = fs.createReadStream(req.file.path);
    megaStorage.upload(req.file.filename, fileStream, (err, file) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error uploading to Mega!" });
        }

        // লোকাল ফাইল ডিলিট (ঐচ্ছিক)
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting local file:", unlinkErr);
        });

        res.status(200).json({
            message: "File uploaded to Mega successfully!",
            url: file.url,
        });
    });
};

module.exports = { uploadFile };