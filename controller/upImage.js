const upImage = async (req, res) => {
    try {
        const image = [];
        req.files.map(file => {
            image.push(file.path);
        });
        res.json(image);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {upImage}