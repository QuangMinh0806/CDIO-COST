const Hotel = require("../service/hotel");

const createHotel = async (req, res) => {
    req.body.UserId = req.user.id;
    const hotel = await Hotel.createHotel(req.body);

    if (hotel == -1) {
        res.status(404).json({
            status: false,
            message: "Tên khách sạn đã tồn tại"
        })
    }
    else if (hotel == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thêm khách sạn thành công"
        })
    }

}


const getHotel = async (req, res) => {
    const hotel = await Hotel.getHotel(req.params.id);

    if (hotel == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thông tin của khách sạn",
            hotel
        })
    }

}

module.exports = { createHotel, getHotel}