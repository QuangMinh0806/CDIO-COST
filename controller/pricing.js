const Pricing = require("../service/pricing");

const createPricing = async (req, res) => {

    const pricing = await Pricing.createPricing(req.body);

    if (pricing == -1) {
        res.status(404).json({
            status: false,
            message: "Bảng giá đã tồn tại"
        })
    }
    else if (pricing == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Thêm bảng giá thành công"
        })
    }

}


const getPricing = async (req, res) => {

    const pricing = await Pricing.getPricing(req.user.id);

    if (pricing == "error") {
        res.status(505).json("Lỗi hệ thống");
    }
    else {
        res.status(201).json({
            status: true,
            message: "Danh sách bảng giá",
            pricing
        })
    }

}


module.exports = { createPricing, getPricing}