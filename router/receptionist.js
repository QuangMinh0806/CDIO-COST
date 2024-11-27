const receptionistRouter = require("express").Router();
const {authentication} = require("../middleware/authentication");



const {createHotel, getHotel} = require("../controller/hotel");
const {createRoom, getRoom} = require("../controller/room");
const {createRoomDetail, getRoomDetail, getScheduleRoomDetail} = require("../controller/room_detail");
const { getPricing, createPricing } = require("../controller/pricing");
const { createServices, getAllServices } = require("../controller/services");
const { getAllBookingForAdmin } = require("../controller/booking");


//hotel
receptionistRouter.post("/hotel", authentication, createHotel);
receptionistRouter.get("/hotel/:id", getHotel);

//services
receptionistRouter.post("/services", authentication, createServices);
receptionistRouter.get("/services", authentication, getAllServices);


//room
receptionistRouter.post("/room", createRoom);
receptionistRouter.get("/room", authentication, getRoom);


//room_detail
receptionistRouter.post("/room_detail", createRoomDetail);
receptionistRouter.get("/room_detail", authentication, getRoomDetail);
receptionistRouter.get("/room_details", authentication, getScheduleRoomDetail);

//pricing
receptionistRouter.get("/pricing", authentication, getPricing);
receptionistRouter.post("/pricing", createPricing);


//booking
receptionistRouter.get("/booking", authentication, getAllBookingForAdmin);


module.exports = receptionistRouter;