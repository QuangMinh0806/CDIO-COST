const Room = require("../service/room");

const createRoom = async (req, res) => {

    const room = await Room.createRoom(req.body);

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


//Gợi ý đặt phòng
const getSuggestRoom = async (req, res) => {

    const room = await Room.getSuggestRoom(req.params.id, req.query);

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


//Trạng thái của phòng trong khách sạn
const getAllRoom = async (req, res) => {

    const room = await Room.getAllRoom(req.user.id, req.query);

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

//Tất cả phòng trống của khách sạn
const getRoomEmpty = async (req, res) => {

    const room = await Room.getRoomEmpty(req.params.id, req.query);

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

const getRoom = async (req, res) => {

    const room = await Room.getRoom(req.user.id);

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

const getRoomById = async (req, res) => {

    const room = await Room.getRoomById(req.params.id);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thông tin phòng",
            room
        })
    }

}


module.exports = {createRoom, getSuggestRoom, getAllRoom, getRoom, getRoomById, getRoomEmpty}