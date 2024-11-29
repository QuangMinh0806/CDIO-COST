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
            message: "Đặt phòng thành công"
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

    const booking = await Booking.getAllBookingForAdmin(req.user.id, req.query);

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

module.exports = {createBooking, getAllBookingForCustomer, getAllBookingForAdmin}