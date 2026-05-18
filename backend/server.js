const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "boardingbridge",
    database: "boardingbridge"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

app.post("/book", (req, res) => {
    console.log("Booking received:", req.body);

    const {
        pnr,
        email,
        flight,
        from,
        to,
        date,
        departure,
        arrival,
        seat,
        terminal,
        travelClass,
        price
    } = req.body;

    const cleanFlight = flight.trim();
    const cleanDate = date.trim();

    const seats = seat.split(",").map(s => s.trim());

    const sql = `
        INSERT INTO bookings
        (pnr, email, flight_no, source, destination, flight_date,
        departure_time, arrival_time, seat_no, terminal, travel_class, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let completed = 0;

    for (let i = 0; i < seats.length; i++) {
        db.query(
            sql,
            [
                pnr,
                email,
                cleanFlight,
                from,
                to,
                cleanDate,
                departure,
                arrival,
                seats[i],
                terminal,
                travelClass,
                price
            ],
            (err, result) => {
                if (err) {
                    console.log("MYSQL INSERT ERROR:", err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            success: false,
                            message: "One or more selected seats are already booked. Please choose another seat."
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Booking failed. Please try again."
                    });
                }

                completed++;

                if (completed === seats.length) {
                    res.json({
                        success: true,
                        message: "Booking successful"
                    });
                }
            }
        );
    }
});

app.get("/booked-seats", (req, res) => {

    const flight = req.query.flight;

    const sql = `
        SELECT seat_no FROM bookings
        WHERE flight_no = ?
    `;

    db.query(sql, [flight], (err, result) => {

        if (err) {
            return res.status(500).json([]);
        }

        const seats = result.map(r => r.seat_no);

        res.json(seats);
    });
});

app.get("/my-bookings", (req, res) => {

    const email = req.query.email;

    console.log("EMAIL RECEIVED:", email);

    const sql = `
        SELECT * FROM bookings
        WHERE email = ?
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {

            console.log("MYSQL ERROR:", err);

            return res.status(500).json([]);
        }

        console.log("BOOKINGS FOUND:", result);

        res.json(result);
    });
});
app.delete("/cancel-booking/:pnr", (req, res) => {

    const pnr = req.params.pnr;

    const sql = `
        DELETE FROM bookings
        WHERE pnr = ?
    `;

    db.query(sql, [pnr], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Cancellation failed"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid PNR. Booking not found."
            });
        }

        res.json({
            success: true,
            message: "Cancellation done successfully."
        });
    });
});

app.listen(3000, () => {
    console.log("Server Running On Port 3000");
});