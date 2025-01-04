const receptionistRouter = require("express").Router();
const {authentication} = require("../middleware/authentication");



const {createHotel, getHotel} = require("../controller/hotel");
const {createRoom, getRoom, getAllRoom, getRoomById} = require("../controller/room");
const {createRoomDetail, getRoomDetail} = require("../controller/room_detail");
const { getPricing, createPricing } = require("../controller/pricing");
const { createServices, getAllServices, bookingServices } = require("../controller/services");
const { getAllBookingForAdmin, getReportService, getReportTime, getReportRoom, getBookingById } = require("../controller/booking");
const { getAllUserGroup } = require("../controller/user");


//hotel
receptionistRouter.post("/hotel", authentication, createHotel);
receptionistRouter.get("/hotel/:id", getHotel);
receptionistRouter.get("/hotel/group/:id", getAllUserGroup);

//services
receptionistRouter.post("/services", authentication, createServices);
receptionistRouter.get("/services", authentication, getAllServices);
receptionistRouter.post("/services/booking", bookingServices);


//room
receptionistRouter.post("/room", createRoom);
receptionistRouter.get("/room", authentication, getRoom);
receptionistRouter.get("/room/:id", getRoomById);


//room_detail
receptionistRouter.post("/room_detail", createRoomDetail);
receptionistRouter.get("/room_detail", authentication, getRoomDetail);
receptionistRouter.get("/room_details", authentication, getAllRoom);

//pricing
receptionistRouter.get("/pricing", authentication, getPricing);
receptionistRouter.post("/pricing", createPricing);


//booking
receptionistRouter.get("/booking", authentication, getAllBookingForAdmin);
receptionistRouter.get("/booking/report/service", authentication, getReportService);
receptionistRouter.get("/booking/report/time", authentication, getReportTime);
receptionistRouter.get("/booking/report/room", authentication, getReportRoom);
receptionistRouter.get("/bookings/:id", getBookingById);


module.exports = receptionistRouter;