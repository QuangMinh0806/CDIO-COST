const {Booking} = require("../model/booking");
const {Booking_Detail} = require("../model/booking_detail");
const {Payments} = require("../model/payment");

const {Sequelize, Op} = require("sequelize");
const { sequelize } = require("../config/mysql");
const { User } = require("../model/user");

const find_room = async (id, count, start, end) => {
    const sql = `SELECT 
                    rd.id
                FROM 
                    roomdetails rd
                JOIN 
                    room r ON rd."RoomId" = r.id
                WHERE 
                    r.id = ${id}
                    AND rd.id NOT IN (
                        SELECT 
                            "RoomDetailId"
                        FROM 
                            inventory
                        WHERE 
                            inventory_date BETWEEN '${start}' AND '${end}'
                    )
                ORDER BY 
                    rd.id ASC
                LIMIT ${count};`

    const list_room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
    
    return list_room;
}
const createBooking = async (data) => {
    try {
        const check = await User.findOne({
            where : {
                id : data.booking.UserId
            }
        })
        if(check.role == "admin"){
            data.booking.UserId = null;
        }
        const booking = await Booking.create(data.booking);

        const booking_detail = [];
        
        for(const value of data.booking_detail){
            const {
                price,
                RoomId,
                count
            } = value;

            
            const list_id = await find_room(RoomId, count, data.booking.checkin, data.booking.checkout);
            for (let i = 0; i < count; i++) {
                booking_detail.push({
                    price : price,
                    BookingId : booking.id,
                    RoomDetailId: list_id[i].id                   
                });
            }
        }
        
        await Booking_Detail.bulkCreate(booking_detail);

        return booking.id;

    } catch (error) {
        console.log(error);
        return "error";
    }
}



//Tất cả đặt phòng của khách hàng
const getAllBookingForCustomer = async (id) => {
    try {
        const sql = `SELECT 
                        h.name AS name_hotel,
                        b.id AS booking_id,
                        b."status" AS booking_status,
                        b."createdAt",
                        b.note AS note,
                        b.checkin,
                        b.checkout,
                        (b.checkout - b.checkin) AS total_day,
                        b.total_price + COALESCE(SUM(bs.total_price), 0) AS total_price,
                        COALESCE(SUM(p.amount), 0) AS amount,
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'room_name', r."name",
                                'room_number', rd.room_number,
                                'price', bd.price,
                                'services', (
                                    SELECT JSONB_AGG(
                                        JSONB_BUILD_OBJECT(
                                            'service_name', s.service_name,
                                            'price', bs.price,
                                            'quantity', bs.quantity,
                                            'total_price', bs.total_price,
                                            'createdAt', bs."createdAt"
                                        )
                                    )
                                    FROM booking_services bs
                                    JOIN services s ON s.id = bs."ServiceId"
                                    WHERE bs."BookingDetailId" = bd.id
                                )
                            )
                        ) AS details
                    FROM 
                        booking b
                    JOIN 
                        "user" u ON u.id = b."UserId"
                    LEFT JOIN 
                        payments p ON b.id = p."BookingId"
                    JOIN 
                        booking_detail bd ON b.id = bd."BookingId"
                    LEFT JOIN 
                        booking_services bs ON bs."BookingDetailId" = bd.id
                    LEFT JOIN 
                        services s ON s.id = bs."ServiceId"
                    JOIN 
                        roomdetails rd ON rd.id = bd."RoomDetailId"
                    JOIN 
                        room r ON rd."RoomId" = r.id
                    JOIN
                        hotel h ON h.id = r."HotelId"
                    WHERE
                        u.id = ${id}
                    GROUP BY
                        h.name, b.id, b."status", b."createdAt", u.fullname, u.phone, b.note, b.checkin, b.checkout
                    ORDER BY
	                    b."createdAt";`

        const list_room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return list_room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}


//Tất cả đặt phòng 
const getAllBookingForAdmin = async (id, data) => {
    try {
        const sql = `SELECT 
                        b.id AS booking_id,
                        b."status" AS booking_status,
                        b."createdAt",
                        u.fullname,
                        u.phone,
                        b.note AS note,
                        b.checkin,
                        b.checkout,
                        (b.checkout - b.checkin) AS total_day,
                        b.total_price + COALESCE(SUM(bs.total_price), 0) AS total_price,
                        COALESCE(SUM(p.amount), 0) AS amount,
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'room_name', r."name",
                                'room_number', rd.room_number,
                                'price', bd.price,
                                'services', (
                                    SELECT JSONB_AGG(
                                        JSONB_BUILD_OBJECT(
                                            'service_name', s.service_name,
                                            'price', bs.price,
                                            'quantity', bs.quantity,
                                            'total_price', bs.total_price,
                                            'createdAt', bs."createdAt"
                                        )
                                    )
                                    FROM booking_services bs
                                    JOIN services s ON s.id = bs."ServiceId"
                                    WHERE bs."BookingDetailId" = bd.id
                                )
                            )
                        ) AS details
                    FROM 
                        booking b
                    JOIN 
                        "user" u ON u.id = b."UserId"
                    LEFT JOIN 
                        payments p ON b.id = p."BookingId"
                    JOIN 
                        booking_detail bd ON b.id = bd."BookingId"
                    LEFT JOIN 
                        booking_services bs ON bs."BookingDetailId" = bd.id
                    LEFT JOIN 
                        services s ON s.id = bs."ServiceId"
                    JOIN 
                        roomdetails rd ON rd.id = bd."RoomDetailId"
                    JOIN 
                        room r ON rd."RoomId" = r.id
                    WHERE
                        b."createdAt" BETWEEN ${data.start} AND ${data.end} AND r."HotelId" = ${id}
                    GROUP BY
                        b.id, b."status", b."createdAt", u.fullname, u.phone, b.note, b.checkin, b.checkout;`

        const list_room = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return list_room;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

//Xem chi tiết đơn đặt phòng
const getBookingById = async (id) => {
    try {
        const sql = `SELECT 
                        b.id AS booking_id,
                        b."status" AS booking_status,
                        b."createdAt",
                        u.fullname,
                        u.phone,
                        b.note AS note,
                        b.checkin,
                        b.checkout,
                        (b.checkout - b.checkin) AS total_day,
                        b.total_price + COALESCE(SUM(bs.total_price), 0) AS total_price,
                        COALESCE(SUM(p.amount), 0) AS amount,
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'room_name', r."name",
                                'room_number', rd.room_number,
                                'price', bd.price,
                                'services', (
                                    SELECT JSONB_AGG(
                                        JSONB_BUILD_OBJECT(
                                            'service_name', s.service_name,
                                            'price', bs.price,
                                            'quantity', bs.quantity,
                                            'total_price', bs.total_price,
                                            'createdAt', bs."createdAt"
                                        )
                                    )
                                    FROM booking_services bs
                                    JOIN services s ON s.id = bs."ServiceId"
                                    WHERE bs."BookingDetailId" = bd.id
                                )
                            )
                        ) AS details
                    FROM 
                        booking b
                    JOIN 
                        "user" u ON u.id = b."UserId"
                    LEFT JOIN 
                        payments p ON b.id = p."BookingId"
                    JOIN 
                        booking_detail bd ON b.id = bd."BookingId"
                    LEFT JOIN 
                        booking_services bs ON bs."BookingDetailId" = bd.id
                    LEFT JOIN 
                        services s ON s.id = bs."ServiceId"
                    JOIN 
                        roomdetails rd ON rd.id = bd."RoomDetailId"
                    JOIN 
                        room r ON rd."RoomId" = r.id
                    WHERE
                        b.id = ${id}
                    GROUP BY
                        b.id, b."status", b."createdAt", u.fullname, u.phone, b.note, b.checkin, b.checkout;`

        const report = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return report;
    } catch (error) {
        console.log(error);
        return "error";
    }
}


//Doanh thu theo thời gian
const getReportTime = async (id, data) => {
    try {
        const sql = `WITH BookingRevenue AS (
                        SELECT
                            p.amount,
                            DATE(p.payment_date) AS payment_date
                        FROM 
                            payments p
                        JOIN 
                            booking b ON b.id = p."BookingId"
                        JOIN 
                            booking_detail bd ON b.id = bd."BookingId"
                        JOIN 
                            roomdetails rd ON rd.id = bd."RoomDetailId"
                        JOIN 
                            room r ON rd."RoomId" = r.id
                        WHERE
                            r."HotelId" = ${id}
                            AND p.payment_date BETWEEN ${data.start} AND ${data.end}
                        GROUP BY
                            p.id
                        ORDER BY 
                            p.payment_date
                    )
                    SELECT
                        payment_date,
                        SUM(amount) AS total_revenue
                    FROM
                        BookingRevenue
                    GROUP BY
                        payment_date
                    ORDER BY
                        payment_date;`

        const report = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return report;
    } catch (error) {
        console.log(error);
        return "error";
    }
}



//Doanh thu theo dịch vụ
const getReportService = async (id, data) => {
    try {
        const sql = `SELECT
                        s.service_name,
                        COALESCE(SUM(bs.total_price), 0) AS total_revenue
                    FROM 
                        services s
                    LEFT JOIN 
                        booking_services bs ON bs."ServiceId" = s.id
                    LEFT JOIN 
                        booking_detail bd ON bd.id = bs."BookingDetailId"
                    LEFT JOIN 
                        booking b ON bd."BookingId" = b.id
                    LEFT JOIN 
                        payments p ON p."BookingId" = b.id AND p.payment_date BETWEEN ${data.start} AND ${data.end} AND p.status = 'service'
                    JOIN 
                        hotel h ON h.id = s."HotelId"
                    WHERE
                        h.id = ${id}
                    GROUP BY
                        s.service_name;`

        const report = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return report;
    } catch (error) {
        console.log(error);
        return "error";
    }
}


//Doanh thu theo phòng
const getReportRoom = async (id, data) => {
    try {
        const sql = `SELECT
                        r.name AS room_name,
                        COALESCE(SUM(bd.price), 0) AS total_revenue
                    FROM 
                        room r
                    LEFT JOIN 
                        roomdetails rd ON rd."RoomId" = r.id
                    LEFT JOIN 
                        booking_detail bd ON rd.id = bd."RoomDetailId"
                    LEFT JOIN 
                        booking b ON b.id = bd."BookingId"
                    LEFT JOIN 
                        payments p ON p."BookingId" = b.id 
                                AND p.payment_date BETWEEN ${data.start} AND ${data.end}
                                AND p."status" = 'hotel'
                    WHERE
                        r."HotelId" = ${id}
                    GROUP BY
                        r.name;`

        const report = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
        
        return report;
    } catch (error) {
        console.log(error);
        return "error";
    }
}
module.exports = {createBooking, getAllBookingForCustomer, getAllBookingForAdmin, getReportService, getReportRoom, getReportTime, getBookingById}