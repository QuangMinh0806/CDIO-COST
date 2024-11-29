const RoomDetail = require("../service/room_detail");

const createRoomDetail = async (req, res) => {

    const room = await RoomDetail.createRoomDetail(req.body);

    if (room == -1) {
        res.status(404).json({
            status: false,
            message: "Tên phòng khách sạn đã tồn tại"
        })
    }
    else if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thêm phòng khách sạn thành công"
        })
    }

}


const getRoomDetail = async (req, res) => {

    const room = await RoomDetail.getRoomDetail(req.user.id);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Danh sách phòng",
            room
        })
    }

}


module.exports = { createRoomDetail, getRoomDetail}