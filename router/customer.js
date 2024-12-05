const customerRouter = require("express").Router();
const {authentication} = require("../middleware/authentication");


const {getSuggestRoom, getRoomEmpty} = require("../controller/room");
const {registerUser, activeUser, loginUser} = require("../controller/user");
const {createBooking, getAllBookingForCustomer} = require("../controller/booking");
const { findHotel } = require("../controller/hotel");



//login
customerRouter.post("/signup", registerUser);
customerRouter.post("/active", activeUser);
customerRouter.post("/login", loginUser);


//booking
customerRouter.post("/booking", authentication, createBooking);
customerRouter.get("/booking", authentication, getAllBookingForCustomer);


//room
customerRouter.get("/room/:id/suggest", getSuggestRoom);
customerRouter.get("/room/:id", getRoomEmpty);


//hotel
customerRouter.get("/search-hotel", findHotel);
module.exports = customerRouter;