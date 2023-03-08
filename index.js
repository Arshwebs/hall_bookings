const express = require("express");
const app = express();
const port = 8000;
app.use(express.json());

let rooms = [];
let bookings = [];

app.post("/rooms", (req, res) => {
	const {name, seats, amenities, price_per_hour} = req.body;
	const room = {id: (rooms.length + 1).toString(), name, seats, amenities, price_per_hour};
	rooms.push(room);
	res.json(room);
});

app.get("/rooms", (req, res) => {
	res.json(rooms);
});

app.delete("/rooms/:name", (req, res) => {
	rooms.splice(req.params.name, 1);
	res.json({
		statusCode: "Deleted successfully",
		name: req.params,
	});
});

app.post("/bookings", (req, res) => {
	const {customer_name, room_id, date, start_time, end_time} = req.body;
	const room = rooms.find(r => r.id === room_id);
	if (!room) return res.status(404).json({error: "Room not found"});
	const booking = {id: (bookings.length + 1).toString(), customer_name, room_id, date, start_time, end_time};
	bookings.push(booking);
	res.json(booking);
});

app.delete("/bookings/:customer_name", (req, res) => {
	bookings.splice(req.params.name, 1);
	res.json({
		statusCode: "Deleted successfully",
		name: req.params,
	});
});

app.get("/rooms/bookings", (req, res) => {
	const roomsWithBookings = rooms.map(room => {
		const roomBookings = bookings.filter(booking => booking.room_id === room.id);
		return {...room, bookings: roomBookings};
	});
	res.json(roomsWithBookings);
});

app.get("/customers/bookings", (req, res) => {
	const customerBookings = bookings.map(booking => {
		const room = rooms.find(room => room.id === booking.room_id);
		return {
			customer_name: booking.customer_name,
			room_name: room.name,
			date: booking.date,
			start_time: booking.start_time,
			end_time: booking.end_time,
		};
	});
	res.json(customerBookings);
});

app.listen(port, () => {
	console.log("running");
});
