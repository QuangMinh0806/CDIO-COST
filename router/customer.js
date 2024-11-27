const customerRouter = require("express").Router();
const {authentication} = require("../middleware/authentication");


const {getAllRoomForCustomer, getAllRoom} = require("../controller/room");
const {registerUser, activeUser, loginUser} = require("../controller/user");
const {createBooking, getAllBookingForCustomer} = require("../controller/booking");



//login
customerRouter.post("/signup", registerUser);
customerRouter.post("/active", activeUser);
customerRouter.post("/login", loginUser);


//booking
customerRouter.post("/booking", authentication, createBooking);
customerRouter.get("/booking", authentication, getAllBookingForCustomer);


//room
customerRouter.get("/room/:id/suggest", getAllRoomForCustomer);
customerRouter.get("/room/:id", getAllRoom);

module.exports = customerRouter;