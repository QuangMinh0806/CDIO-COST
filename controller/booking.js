const Booking = require("../service/booking");

const createBooking = async (req, res) => {
    if(req.user.id){
        req.body.booking.UserId = req.user.id;
    }

    const booking = await Booking.createBooking(req.body);

    if (booking == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Đặt phòng thành công",
            booking
        })
    }
}


const getAllBookingForCustomer = async (req, res) => {

    const booking = await Booking.getAllBookingForCustomer(req.user.id);

    if (booking == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Danh sách đặt phòng",
            booking
        })
    }
}



const getAllBookingForAdmin = async (req, res) => {

    const room = await Booking.getAllBookingForAdmin(req.user.id, req.query);

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

const getBookingById = async (req, res) => {

    const room = await Booking.getBookingById(req.params.id);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Chi tiết đơn đặt phòng",
            room
        })
    }

}


const getReportService = async (req, res) => {

    const room = await Booking.getReportService(req.user.id, req.query);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Báo cáo theo dịch vụ",
            room
        })
    }

}


const getReportRoom = async (req, res) => {

    const room = await Booking.getReportRoom(req.user.id, req.query);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Báo cáo theo phòng",
            room
        })
    }

}


const getReportTime = async (req, res) => {

    const room = await Booking.getReportTime(req.user.id, req.query);

    if (room == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Báo cáo theo thời gian",
            room
        })
    }

}
module.exports = {createBooking, getAllBookingForCustomer, getAllBookingForAdmin, getReportService, getReportTime, getReportRoom, getBookingById}