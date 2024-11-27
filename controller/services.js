const Services = require("../service/services");

const createServices = async (req, res) => {
    const services = await Services.createServices(req.user.id, req.body);

    if (services == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else if(services == -1){
        res.status(404).json({
            status: false,
            message: "Tên dịch vụ đã tồn tại"
        })
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thêm thành công"
        })
    }
}


const getAllServices = async (req, res) => {

    const services = await Services.getAllServices(req.user.id);

    if (services == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Danh sách dịch vụ",
            services
        })
    }
}


const bookingServices = async (req, res) => {

    const services = await Services.bookingServices(req.body);

    if (services == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Đặt dịch vụ thành công"
        })
    }
}

module.exports = {createServices, getAllServices, bookingServices}