function hideAll() {
    document.querySelector(".hero").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.add("hidden");
    document.getElementById("dashboardPage").classList.add("hidden");
    document.getElementById("bookFlightPage").classList.add("hidden");
    document.getElementById("searchFlightsPage").classList.add("hidden");
    document.getElementById("myBookingsPage").classList.add("hidden");
    document.getElementById("cancelBookingPage").classList.add("hidden");
    document.getElementById("seatMapPage").classList.add("hidden");
}

function showLogin() {
    hideAll();
    document.getElementById("loginPage").classList.remove("hidden");
}

function showSignup() {
    hideAll();
    document.getElementById("signupPage").classList.remove("hidden");
}

function showDashboard() {
    hideAll();
    document.getElementById("dashboardPage").classList.remove("hidden");
}

function showAbout() {
    hideAllPages();
    document.getElementById("aboutPage").classList.remove("hidden");

}

let selectedFlight = "";
let selectedSeat = "";
let bookings = [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUserEmail = localStorage.getItem("currentUserEmail") || "";
let searchOpenedFromHome = false;
let adults = 1;
let children = 0;
let infants = 0;
let economyCount = 0;
let businessCount = 0;
let firstCount = 0;
let selectedSeats = [];

function changeClassCount(type, change) {
    let passengers = parseInt(document.getElementById("passengerSelect").value);

    let newEconomy = economyCount;
    let newBusiness = businessCount;
    let newFirst = firstCount;

    if (type === "economy") newEconomy += change;
    if (type === "business") newBusiness += change;
    if (type === "first") newFirst += change;

    if (newEconomy < 0) newEconomy = 0;
    if (newBusiness < 0) newBusiness = 0;
    if (newFirst < 0) newFirst = 0;

    if (newEconomy > 52) {
        alert("Economy Class has only 52 seats.");
        return;
    }

    if (newBusiness > 12) {
        alert("Business Class has only 12 seats.");
        return;
    }

    if (newFirst > 8) {
        alert("First Class has only 8 seats.");
        return;
    }

    if (newEconomy + newBusiness + newFirst > passengers) {
        alert("Class split cannot exceed total passengers.");
        return;
    }

    economyCount = newEconomy;
    businessCount = newBusiness;
    firstCount = newFirst;

    document.getElementById("economyCount").innerText = economyCount;
    document.getElementById("businessCount").innerText = businessCount;
    document.getElementById("firstCount").innerText = firstCount;
}

function changePassenger(type, change) {

    let newAdults = adults;
    let newChildren = children;
    let newInfants = infants;

    if (type === "adult") {
        newAdults += change;
    }

    if (type === "child") {
        newChildren += change;
    }

    if (type === "infant") {
        newInfants += change;
    }

    if (newAdults < 1) {
        newAdults = 1;
    }

    if (newChildren < 0) {
        newChildren = 0;
    }

    if (newInfants < 0) {
        newInfants = 0;
    }

    let totalPassengers = newAdults + newChildren + newInfants;

    if (totalPassengers > 8) {
        alert("Please Note : You can book for a maximum of eight passengers.");
        return;
    }

    adults = newAdults;
    children = newChildren;
    infants = newInfants;

    document.getElementById("adultCount").innerText = adults;
    document.getElementById("childCount").innerText = children;
    document.getElementById("infantCount").innerText = infants;

    updatePassengerSummary();
}

function togglePassengerBox() {
    document.getElementById("passengerDropdown").classList.toggle("hidden");
}

function updatePassengerSummary() {

    let text = adults + " Adult";

    if (adults > 1) {
        text = adults + " Adults";
    }

    if (children > 0) {
        text += ", " + children + " Child";

        if (children > 1) {
            text += "ren";
        }
    }

    if (infants > 0) {
        text += ", " + infants + " Infant";

        if (infants > 1) {
            text += "s";
        }
    }

    document.getElementById("passengerSummary").innerText = text;
}

let flights = {

    "BB101": { from: "Chennai", to: "Mumbai", departure: "07:30", arrival: "10:15", terminal: "T1", seats: 72, basePrice: 4500 },
    "BB102": { from: "Chennai", to: "Mumbai", departure: "13:20", arrival: "16:05", terminal: "T1", seats: 72, basePrice: 5200 },
    "BB103": { from: "Chennai", to: "Mumbai",  departure: "19:10", arrival: "21:55", terminal: "T2", seats: 72, basePrice: 6100 },

    "BB201": { from: "Chennai", to: "Delhi",  departure: "08:15", arrival: "11:10", terminal: "T1", seats: 72, basePrice: 6200 },
    "BB202": { from: "Chennai", to: "Delhi",  departure: "14:30", arrival: "17:25", terminal: "T2", seats: 72, basePrice: 6900 },
    "BB203": { from: "Chennai", to: "Delhi",  departure: "21:00", arrival: "23:55", terminal: "T1", seats: 72, basePrice: 7400 },

    "BB301": { from: "Chennai", to: "Bangalore",  departure: "06:45", arrival: "07:55", terminal: "T1", seats: 72, basePrice: 2800 },
    "BB302": { from: "Chennai", to: "Bangalore", departure: "12:10", arrival: "13:20", terminal: "T1", seats: 72, basePrice: 3100 },
    "BB303": { from: "Chennai", to: "Bangalore", departure: "18:20", arrival: "19:30", terminal: "T2", seats: 72, basePrice: 3500 },

    "BB401": { from: "Chennai", to: "Hyderabad",  departure: "07:20", arrival: "08:45", terminal: "T1", seats: 72, basePrice: 3300 },
    "BB402": { from: "Chennai", to: "Hyderabad",  departure: "13:40", arrival: "15:05", terminal: "T1", seats: 72, basePrice: 3700 },
    "BB403": { from: "Chennai", to: "Hyderabad",  departure: "20:15", arrival: "21:40", terminal: "T2", seats: 72, basePrice: 4100 },

    "BB501": { from: "Chennai", to: "Dubai",  departure: "04:30", arrival: "07:20", terminal: "T4", seats: 72, basePrice: 14500 },
    "BB502": { from: "Chennai", to: "Dubai",  departure: "15:45", arrival: "18:35", terminal: "T4", seats: 72, basePrice: 15800 },
    "BB503": { from: "Chennai", to: "Dubai",  departure: "21:15", arrival: "00:10", terminal: "T4", seats: 72, basePrice: 17200 },

    "BB601": { from: "Chennai", to: "Singapore", departure: "05:50", arrival: "12:45", terminal: "T4", seats: 72, basePrice: 18000 },
    "BB602": { from: "Chennai", to: "Singapore",  departure: "11:25", arrival: "18:15", terminal: "T4", seats: 72, basePrice: 19500 },
    "BB603": { from: "Chennai", to: "Singapore",  departure: "23:40", arrival: "06:30", terminal: "T4", seats: 72, basePrice: 21000 },

    "BB701": { from: "Chennai", to: "London",  departure: "01:10", arrival: "10:55", terminal: "T4", seats: 72, basePrice: 42000 },
    "BB702": { from: "Chennai", to: "London",  departure: "09:45", arrival: "19:30", terminal: "T4", seats: 72, basePrice: 45500 },
    "BB703": { from: "Chennai", to: "London",  departure: "22:25", arrival: "08:10", terminal: "T4", seats: 72, basePrice: 48000 },

    "BB801": { from: "Chennai", to: "Paris",  departure: "02:15", arrival: "11:30", terminal: "T4", seats: 72, basePrice: 39000 },
    "BB802": { from: "Chennai", to: "Paris",  departure: "10:20", arrival: "19:35", terminal: "T4", seats: 72, basePrice: 42500 },
    "BB803": { from: "Chennai", to: "Paris",  departure: "23:10", arrival: "08:25", terminal: "T4", seats: 72, basePrice: 45000 },

    "BB901": { from: "Chennai", to: "New York",  departure: "03:40", arrival: "18:20", terminal: "T4", seats: 72, basePrice: 68000 },
    "BB902": { from: "Chennai", to: "New York", departure: "12:30", arrival: "03:10", terminal: "T4", seats: 72, basePrice: 72500 },
    "BB903": { from: "Chennai", to: "New York",  departure: "22:50", arrival: "13:30", terminal: "T4", seats: 72, basePrice: 76000 },

    "BB1001": { from: "Chennai", to: "Tokyo",  departure: "06:25", arrival: "15:40", terminal: "T4", seats: 72, basePrice: 47000 },
    "BB1002": { from: "Chennai", to: "Tokyo",  departure: "14:15", arrival: "23:30", terminal: "T4", seats: 72, basePrice: 49500 },
    "BB1003": { from: "Chennai", to: "Tokyo", departure: "23:55", arrival: "09:10", terminal: "T4", seats: 72, basePrice: 52000 },

    "BB1101": { from: "Chennai", to: "Sydney",  departure: "09:30", arrival: "20:40", terminal: "T4", seats: 72, basePrice: 52000 },
    "BB1102": { from: "Chennai", to: "Sydney",  departure: "16:10", arrival: "03:20", terminal: "T4", seats: 72, basePrice: 56000 },
    "BB1103": { from: "Chennai", to: "Sydney", departure: "22:10", arrival: "09:20", terminal: "T4", seats: 72, basePrice: 59000 }

};

let selectedFlightData = null;

function getClassMultiplier(selectedClass) {
    if (selectedClass === "business") return 2.5;
    if (selectedClass === "first") return 5;
    return 1;
}

function getClassName(selectedClass) {
    if (selectedClass === "business") return "Business Class";
    if (selectedClass === "first") return "First Class";
    return "Economy Class";
}

function calculatePrice(basePrice, selectedClass) {
    return basePrice * getClassMultiplier(selectedClass);
}
   
const seatSections = [
    {
        title: "First Class",
        prefix: "F",
        rows: 2,
        seatsPerRow: 4,
        className: "first-class"
    },
    {
        title: "Business Class",
        prefix: "B",
        rows: 3,
        seatsPerRow: 4,
        className: "business-class"
    },
    {
        title: "Economy Class",
        prefix: "E",
        rows: 13,
        seatsPerRow: 4,
        className: "economy-class"
    }
];

function loadFlightTable() {
    let tableBody = document.getElementById("flightTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    Object.keys(flights).forEach(flightNo => {
        tableBody.innerHTML += `
            <tr>
                <td>${flightNo}</td>
                <td>${flights[flightNo].from}</td>
                <td>${flights[flightNo].to}</td>
                <td>${flights[flightNo].date}</td>
                <td>${flights[flightNo].departure}</td>
                <td>${flights[flightNo].arrival}</td>
                <td>${flights[flightNo].terminal}</td>
                <td>${flights[flightNo].seats}</td>
                <td>
                    <button onclick="selectFlight('${flightNo}', event)">Book</button>
                </td>
            </tr>
        `;
    });
}

function showBookFlight() {

    hideAll();

    document.getElementById("bookFlightPage").classList.remove("hidden");

    adults = 1;
    children = 0;
    infants = 0;
    selectedSeats = [];
    selectedSeat = "";
    selectedFlight = "";
    selectedFlightData = null;

    loadBookingForm();
}

function loadBookingForm() {
    let page = document.getElementById("bookFlightPage");

    page.innerHTML = `
        <button onclick="showDashboard()" class="back-btn">← Back</button>

        <div class="flight-search-layout">

            <div class="flight-search-card">
                <label>Departure airport</label>
                <h3>Chennai (MAA)</h3>
            </div>

            <div class="flight-search-card">
                <label>Arrival airport</label>
                <select id="arrivalSelect">
                    <option value="">Arrival airport</option>

                    <!-- DOMESTIC -->

                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>

                     <!-- INTERNATIONAL -->

                    <option value="Dubai">Dubai</option>
                    <option value="Singapore">Singapore</option>
                    <option value="London">London</option>
                    <option value="Paris">Paris</option>
                    <option value="New York">New York</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="Sydney">Sydney</option>

                </select>
            </div>

            <div class="flight-search-card dropdown-box" onclick="togglePassengerBox()">
                <label>Passengers</label>
                <div class="passenger-header">
    <h3 id="passengerSummary">1 Adult</h3>
    <span class="passenger-arrow">⌄</span>
</div>

                <div id="passengerDropdown" class="passenger-dropdown hidden">
                    <div class="passenger-row">
                        <div>
                            <h4>Adults</h4>
                            <p>Ages 12+</p>
                        </div>
                        <div class="passenger-controls">
                            <button onclick="event.stopPropagation(); changePassenger('adult', -1)">−</button>
                            <span id="adultCount">1</span>
                            <button onclick="event.stopPropagation(); changePassenger('adult', 1)">+</button>
                        </div>
                    </div>

                    <div class="passenger-row">
                        <div>
                            <h4>Children</h4>
                            <p>Ages 2-11</p>
                        </div>
                        <div class="passenger-controls">
                            <button onclick="event.stopPropagation(); changePassenger('child', -1)">−</button>
                            <span id="childCount">0</span>
                            <button onclick="event.stopPropagation(); changePassenger('child', 1)">+</button>
                        </div>
                    </div>

                    <div class="passenger-row">
                        <div>
                            <h4>Infants</h4>
                            <p>Ages under 2</p>
                        </div>
                        <div class="passenger-controls">
                            <button onclick="event.stopPropagation(); changePassenger('infant', -1)">−</button>
                            <span id="infantCount">0</span>
                            <button onclick="event.stopPropagation(); changePassenger('infant', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flight-search-card">
                <label>Class</label>
                <select id="classSelect">
                    <option value="economy">Economy Class</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                </select>
            </div>

            <div class="flight-search-card">
                <label>Departing</label>
                 <input type="date" id="departureDate">
            </div>

            <button class="flight-search-btn" onclick="searchAvailableFlights()">Search flights</button>

        </div>

        <div id="availableFlightsArea"></div>

        <h3 id="selectedFlightText"></h3>

        <div id="seatMap"></div>
    `;
}

function searchAvailableFlights() {
    let arrival = document.getElementById("arrivalSelect").value;
    let departureDate = document.getElementById("departureDate").value;
    let selectedClass = document.getElementById("classSelect").value;
    let area = document.getElementById("availableFlightsArea");

    if (arrival === "") {
        alert("Please select arrival airport.");
        return;
    }

    if (departureDate === "") {
        alert("Please select departure date.");
        return;
    }

    let matchedFlights = Object.keys(flights).filter(flightNo =>
        flights[flightNo].from === "Chennai" &&
        flights[flightNo].to === arrival
    );

    if (matchedFlights.length === 0) {
        area.innerHTML = '<h3 style="color:red;">No flights available for this city.</h3>';
        return;
    }

    let content = `
        <h2 class="available-title">Available Flights</h2>

        <table class="available-flight-table">
            <tr>
                <th>Flight No</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Class</th>
                <th>Price</th>
                <th>Action</th>
            </tr>
    `;

    matchedFlights.forEach(flightNo => {
        let flight = flights[flightNo];
        let price = calculatePrice(flight.basePrice, selectedClass);

        content += `
            <tr>
                <td>${flightNo}</td>
                <td>${flight.from}</td>
                <td>${flight.to}</td>
                <td>${flight.departure} IST</td>
                <td>${flight.arrival} IST</td>
                <td>${getClassName(selectedClass)}</td>
                <td>₹${price.toLocaleString("en-IN")}</td>
                <td>
                    <button onclick="chooseAvailableFlight('${flightNo}', event)">Select</button>
                </td>
            </tr>
        `;
    });

    content += '</table>';

    area.innerHTML = content;
}

function chooseAvailableFlight(flightNo, event) {
    selectedFlight = flightNo;
    selectedSeat = "";
    selectedSeats = [];
    selectedFlightData = flights[flightNo];

    document.querySelectorAll(".available-flight-table tr").forEach(row => {
        row.classList.remove("selected-flight");
    });

    event.target.closest("tr").classList.add("selected-flight");

    document.getElementById("selectedFlightText").innerText =
        "Selected Flight: " + flightNo + " | Now choose your seat";

    createSeatMap();

    document.getElementById("seatMap").scrollIntoView({
        behavior: "smooth"
    });
}

function continueBooking() {
    let arrival = document.getElementById("arrivalSelect").value;
    let passengers = adults + children + infants;
    let selectedClass = document.getElementById("classSelect").value;
    let departureDate = document.getElementById("departureDate").value;
    if (departureDate === "") {
        alert("Please select departure date.");
        return;
    }
    if (arrival === "") {
        alert("Please select arrival airport.");
        return;
    }

    selectedFlight = "BB" + Math.floor(Math.random() * 900 + 100);
    selectedSeat = "";
    selectedSeats = [];

    document.getElementById("selectedFlightText").innerText =
    "Chennai to " + arrival +
    " | Date: " + departureDate +
    " | Passengers: " + passengers +
    " | Class: " + selectedClass;

    createSeatMap();
}
      
function selectFlight(flightNo, event) {
    selectedFlight = flightNo;
    selectedSeat = "";

    document.querySelectorAll("#flightTableBody tr").forEach(row => {
        row.classList.remove("selected-flight");
    });

    if (event) {
        event.target.closest("tr").classList.add("selected-flight");
    }

    document.getElementById("selectedFlightText").innerText =
        "Selected Flight: " + flightNo;

    document.getElementById("seatMap").style.display = "flex";

    createSeatMap();
}
    
function createSeatMap() {
    const seatMap = document.getElementById("seatMap");

    if (!seatMap) {
        return;
    }

    seatMap.innerHTML = "";

    fetch("http://localhost:3000/booked-seats?flight=" + selectedFlight)
    .then(res => res.json())
    .then(data => {
        renderSeats(data);
    })
    .catch(() => {
        renderSeats([]);
    });
}

function renderSeats(bookedSeats) {

    const seatMap = document.getElementById("seatMap");

    seatMap.innerHTML = "";

    let selectedClass = document.getElementById("classSelect").value;

    let section = seatSections.find(s => {
        if (selectedClass === "first") return s.prefix === "F";
        if (selectedClass === "business") return s.prefix === "B";
        if (selectedClass === "economy") return s.prefix === "E";
    });

    let heading = document.createElement("h3");

    heading.innerText = section.title;
    heading.className = "seat-section-title";

    seatMap.appendChild(heading);

    let grid = document.createElement("div");

    grid.className = "seat-grid";

    for (let row = 1; row <= section.rows; row++) {

        for (let col = 1; col <= section.seatsPerRow; col++) {

            let seatNo = section.prefix + row + String.fromCharCode(64 + col);

            let seat = document.createElement("button");

            seat.innerText = seatNo;

            seat.className = "seat " + section.className;

            if (bookedSeats.includes(seatNo)) {

                seat.classList.add("booked");

                seat.disabled = true;

            } else {

                seat.onclick = function () {

                    let passengers = adults + children + infants;

                    if (selectedSeats.includes(seatNo)) {

                        selectedSeats = selectedSeats.filter(s => s !== seatNo);

                        seat.classList.remove("selected");

                        showConfirmButton();

                        return;
                    }

                    if (selectedSeats.length >= passengers) {

                        alert("You can select only " + passengers + " seats.");

                        return;
                    }

                    selectedSeats.push(seatNo);

                    seat.classList.add("selected");

                    selectedSeat = selectedSeats.join(", ");

                    showConfirmButton();
                };
            }

            grid.appendChild(seat);

            if (col === 2) {

                let aisle = document.createElement("div");

                aisle.className = "aisle";

                grid.appendChild(aisle);
            }
        }
    }

    seatMap.appendChild(grid);
}


function showConfirmButton() {
    let passengers = adults + children + infants;

    let oldButton = document.getElementById("confirmBookingBtn");

    if (oldButton) {
        oldButton.remove();
    }

    if (selectedSeats.length === passengers) {
        let button = document.createElement("button");
        button.id = "confirmBookingBtn";
        button.innerText = "Confirm Booking";
        button.className = "continue-booking-btn";
        button.onclick = confirmBooking;

        document.getElementById("seatMap").appendChild(button);
    }
}

function confirmBooking() {
    let passengers = adults + children + infants;
    let selectedClass = document.getElementById("classSelect").value;

    if (!selectedFlight || !selectedFlightData) {
        alert("Please select a flight first.");
        return;
    }

    if (selectedSeats.length !== passengers) {
        alert("Please select " + passengers + " seats.");
        return;
    }

    let pnr = "BB" + Math.floor(Math.random() * 900000 + 100000);

    let price = calculatePrice(selectedFlightData.basePrice, selectedClass);

    let bookingData = {
        pnr: pnr,
        email: currentUserEmail,
        flight: selectedFlight,
        from: selectedFlightData.from,
        to: selectedFlightData.to,
        date: document.getElementById("departureDate").value,
        departure: selectedFlightData.departure,
        time: selectedFlightData.departure,
        arrival: selectedFlightData.arrival,
        terminal: selectedFlightData.terminal,
        seat: selectedSeats.join(", "),
        travelClass: selectedClass,
        price: price
    };

    

fetch("http://localhost:3000/book", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
})
.then(async (response) => {

    const data = await response.json();

    if (!response.ok) {

    alert(data.message);

    selectedSeats = [];
    selectedSeat = "";

    createSeatMap();

    return;
}

    alert("Booking successful");

    bookings.push(bookingData);

    showBookingConfirmation(bookingData);

})
.catch(error => {
    console.log(error);
    alert("Server error");
});

;
}

function showBookingConfirmation(b) {
    hideAll();

    let page = document.getElementById("myBookingsPage");
    page.classList.remove("hidden");

    page.innerHTML = `
        <button onclick="showDashboard()" class="back-btn">← Back</button>

        <div class="flight-detail-card">
            <div class="booking-card-header">
                <h2>${b.flight}</h2>
                <h3>${b.pnr}</h3>
            </div>

            <div class="route-box">
                <div>
                    <h1>${b.from}</h1>
                    <p>${b.departure}</p>
                </div>

                <div class="flight-line">
                    <span>✈️</span>
                </div>

                <div>
                    <h1>${b.to}</h1>
                    <p>${b.arrival}</p>
                </div>
            </div>

            <div class="flight-info-grid">

    <div>
        <h4>PNR</h4>
        <p>${b.pnr}</p>
    </div>

    <div>
        <h4>Date</h4>
        <p>${b.date}</p>
    </div>

    <div>
        <h4>Seat</h4>
        <p>${b.seat}</p>
    </div>

    <div>
        <h4>Terminal</h4>
        <p>${b.terminal}</p>
    </div>

    <div>
        <h4>Class</h4>
        <p>${getClassName(b.travelClass)}</p>
    </div>

    <div>
        <h4>Price</h4>
        <p>₹${b.price.toLocaleString("en-IN")}</p>
    </div>

</div>
        </div>
    `;
}

function showSearchFlights(fromHome = false) {

    searchOpenedFromHome = fromHome;

    hideAll();

    document.getElementById("searchFlightsPage").classList.remove("hidden");
    document.querySelector(".search-card").style.display = "block";
    document.getElementById("fromInput").value = "";
    document.getElementById("toInput").value = "";
    document.getElementById("searchResult").innerHTML = "";

    let backButton = document.querySelector("#searchFlightsPage button");

    if (searchOpenedFromHome) {
        backButton.setAttribute("onclick", "goHome()");
    } else {
        backButton.setAttribute("onclick", "showDashboard()");
    }
}

function getAirportCode(city) {
    let codes = {
        "Chennai": "MAA",
        "Delhi": "DEL",
        "Mumbai": "BOM",
        "Bangalore": "BLR",
        "Hyderabad": "HYD",
        "Kolkata": "CCU",
        "Dubai": "DXB",
        "Singapore": "SIN",
        "London": "LHR"
    };

    return codes[city] || city;
}

function searchFlights() {
    let from = document.getElementById("fromInput").value.toLowerCase().trim();
    let to = document.getElementById("toInput").value.toLowerCase().trim();
    let result = document.getElementById("searchResult");

    let foundFlights = Object.keys(flights).filter(flightNo =>
        flights[flightNo].from.toLowerCase() === from &&
        flights[flightNo].to.toLowerCase() === to
    );

    if (foundFlights.length === 0) {
        result.innerHTML = "<h3 style='color:red;'>Flight Not Found</h3>";
        return;
    }

    let flightNo = foundFlights[0];
    let flight = flights[flightNo];

    result.innerHTML = `
        <div class="flight-detail-card">
            <h2>${flightNo} Flight Details</h2>

            <div class="route-box">
                <div>
                    <h1>${getAirportCode(flight.from)}</h1>
                    <p>${flight.from}</p>
                    <span>${flight.departure}</span>
                </div>

                <div class="flight-line">
                    <span>✈️</span>
                </div>

                <div>
                    <h1>${getAirportCode(flight.to)}</h1>
                    <p>${flight.to}</p>
                    <span>${flight.arrival}</span>
                </div>
            </div>

            <div class="flight-info-grid">
                <div>
                    <h4>Date</h4>
                    <p>${flight.date}</p>
                </div>

                <div>
                    <h4>Terminal</h4>
                    <p>${flight.terminal}</p>
                </div>

                <div>
                    <h4>Seats Available</h4>
                    <p>${flight.seats}</p>
                </div>
        </div>
    `;
}

function showMyBookings() {

    hideAll();

    let page = document.getElementById("myBookingsPage");

    page.classList.remove("hidden");

    page.innerHTML = `
        <button onclick="showDashboard()" class="back-btn">← Back</button>
        <h2>My Bookings</h2>
        <p>Loading...</p>
    `;
    console.log(currentUserEmail);

    fetch("http://localhost:3000/my-bookings?email=" + currentUserEmail)

    .then(res => res.json())

    .then(userBookings => {

        if (!userBookings || userBookings.length === 0) {

            page.innerHTML = `
                <button onclick="showDashboard()" class="back-btn">← Back</button>

                <h2>My Bookings</h2>

                <p>No bookings yet.</p>
            `;

            return;
        }

        let content = `
            <button onclick="showDashboard()" class="back-btn">← Back</button>

            <h2>My Bookings</h2>

            <div class="booking-card-container">
        `;

        userBookings.forEach(b => {

            content += `
                <div class="booking-card">

                    <div class="booking-card-header">
                        <h3>${b.flight_no}</h3>
                        <span>${b.pnr}</span>
                    </div>

                    <div class="booking-route">

                        <div>
                            <h2>${b.source}</h2>
                            <p>${b.departure_time}</p>
                        </div>

                        <div class="booking-line">✈️</div>

                        <div>
                            <h2>${b.destination}</h2>
                            <p>${b.arrival_time}</p>
                        </div>

                    </div>

                    <div class="booking-details">

                        <div>
                            <h4>Date</h4>
                            <p>${b.flight_date}</p>
                        </div>

                        <div>
                            <h4>Seat</h4>
                            <p>${b.seat_no}</p>
                        </div>

                        <div>
                            <h4>Terminal</h4>
                            <p>${b.terminal}</p>
                        </div>

                    </div>

                </div>
            `;
        });

        content += `</div>`;

        page.innerHTML = content;
    })

    .catch(error => {

        console.log(error);

        page.innerHTML = `
            <button onclick="showDashboard()" class="back-btn">← Back</button>

            <h2>My Bookings</h2>

            <p>No bookings yet.</p>
        `;
    });
}

function showCancelBooking() {
    hideAll();
    document.getElementById("cancelBookingPage").classList.remove("hidden");

    let page = document.getElementById("cancelBookingPage");

    page.innerHTML = `
        <button onclick="showDashboard()">← Back</button>

        <div class="cancel-card">
            <h2>Cancel Booking</h2>
            <p>Enter your PNR number to cancel your confirmed booking.</p>

            <input type="text" id="cancelPnrInput" placeholder="Enter PNR Number">

            <button onclick="cancelBooking()">Cancel Booking</button>

            <h3 id="cancelMessage"></h3>
        </div>
    `;
}

function cancelBooking() {
    let pnrInput = document.getElementById("cancelPnrInput").value.trim().toUpperCase();
    let message = document.getElementById("cancelMessage");

    if (pnrInput === "") {
        message.innerHTML = "Please enter your PNR number.";
        message.style.color = "red";
        return;
    }

    fetch("http://localhost:3000/cancel-booking/" + pnrInput, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        message.innerHTML = data.message;

        if (data.success) {
            message.style.color = "green";
            document.getElementById("cancelPnrInput").value = "";
        } else {
            message.style.color = "red";
        }
    })
    .catch(error => {
        console.log(error);
        message.innerHTML = "Server error";
        message.style.color = "red";
    });
}
function showSeatMap() {
    hideAll();
    document.getElementById("seatMapPage").classList.remove("hidden");
    createMainSeatMap();
}

function createMainSeatMap() {
    const seatMap = document.getElementById("mainSeatMap");

    seatMap.innerHTML = "";

    let userBookings = bookings.filter(b => b.email === currentUserEmail);

    fetch("http://localhost:3000/my-bookings?email=" + currentUserEmail)

.then(res => res.json())

.then(userBookings => {

    if (userBookings.length === 0) {

        seatMap.innerHTML = "<h3>No seats booked yet.</h3>";

        return;
    }

    let content = `
        <h3 class="seatmap-title">Click a booking to view its seat map</h3>

        <table class="booking-table">

            <tr>
                <th>PNR</th>
                <th>Flight</th>
                <th>From</th>
                <th>To</th>
                <th>Seat</th>
            </tr>
    `;

    userBookings.forEach(b => {

        content += `
            <tr onclick="showFlightSeatMap('${b.flight_no}')" class="booking-row">

                <td>${b.pnr}</td>
                <td>${b.flight_no}</td>
                <td>${b.source}</td>
                <td>${b.destination}</td>
                <td>${b.seat_no}</td>

            </tr>
        `;
    });

    content += `
        </table>

        <div id="flightSeatMapArea"></div>
    `;

    seatMap.innerHTML = content;
});

    let content = `
        <h3 class="seatmap-title">Click a booking to view its seat map</h3>
        <table class="booking-table">
            <tr>
                <th>PNR</th>
                <th>Flight</th>
                <th>From</th>
                <th>To</th>
                <th>Seat</th>
            </tr>
    `;

    userBookings.forEach(b => {
        content += `
            <tr onclick="showFlightSeatMap('${b.flight}')" class="booking-row">
                <td>${b.pnr}</td>
                <td>${b.flight}</td>
                <td>${b.from}</td>
                <td>${b.to}</td>
                <td>${b.seat}</td>
            </tr>
        `;
    });

    content += `
        </table>
        <div id="flightSeatMapArea"></div>
    `;

    seatMap.innerHTML = content;
}

function showFlightSeatMap(flightNo) {
    const area = document.getElementById("flightSeatMapArea");

    let bookedSeats = bookings
    .filter(b => b.flight === flightNo)
    .flatMap(b => b.seat.split(",").map(s => s.trim()));

    let content = `
        <div class="seatmap-container">
            <h2>Seat Map for ${flightNo}</h2>
    `;

    seatSections.forEach(section => {
        content += `
            <h3 class="seat-section-title">${section.title}</h3>
            <div class="seat-grid">
        `;

        for (let row = 1; row <= section.rows; row++) {
            for (let col = 1; col <= section.seatsPerRow; col++) {
                let seatNo = section.prefix + row + String.fromCharCode(64 + col);
        
                if (bookedSeats.includes(seatNo)) {
                    content += `<button class="seat ${section.className} booked" disabled>${seatNo}</button>`;
                } else {
                   content += `<button class="seat ${section.className}">${seatNo}</button>`; 
                }
        
                if (col === 2) {
                    content += '<div class="aisle"></div>';
                }
            }
        }

        content += '</div>';
    });

    content += '</div>';

    area.innerHTML = content;
}

function goHome() {
    hideAll();
    document.querySelector(".hero").classList.remove("hidden");
    document.getElementById("aboutPage").classList.add("hidden");
}

function loginUser() {

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    let emailExists = users.some(user => user.email === email);

    if (!emailExists) {
        alert("No account found with this email ID. Please sign up first.");
        return;
    }

    let validUser = users.find(user =>
        user.email === email &&
        user.password === password
    );

    if (!validUser) {
        alert("Incorrect password. Please try again.");
        return;
    }

    currentUserEmail = email;
    localStorage.setItem("currentUserEmail", email);

    alert("Login successful!");

    showDashboard();
}

function signupUser() {

    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters");
        return;
    }

    let alreadyExists = users.some(user => user.email === email);

    if (alreadyExists) {
        alert("This email ID is already registered. Please login instead.");
        return;
    }

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login now.");

    showLogin();
}

let popupFlightNo = "";

function openCityPopup(city) {

    let flightNo = Object.keys(flights).find(f =>
        flights[f].to === city
    );

    if (!flightNo) {
        alert("No flight found for " + city);
        return;
    }

    popupFlightNo = flightNo;

    document.getElementById("popupCityName").innerText = city;

    document.getElementById("popupFlightDetails").innerHTML =
    "Flight: " + flightNo + "<br>" +
    "From: " + flights[flightNo].from + "<br>" +
    "To: " + flights[flightNo].to + "<br>" +
    "Date: " + flights[flightNo].date + "<br>" +
    "Departure: " + flights[flightNo].departure + "<br>" +
    "Arrival: " + flights[flightNo].arrival + "<br>" +
    "Terminal: " + flights[flightNo].terminal + "<br>" +
    "Seats Available: " + flights[flightNo].seats;

    document.getElementById("cityPopup").classList.remove("hidden");
}

function closeCityPopup() {
    document.getElementById("cityPopup").classList.add("hidden");
}

function viewFlightFromPopup() {

    searchOpenedFromHome = true;

    closeCityPopup();

    showSearchFlights(true);

    document.querySelector(".search-card").style.display = "none";

    document.getElementById("fromInput").value = flights[popupFlightNo].from;

    document.getElementById("toInput").value = flights[popupFlightNo].to;

    searchFlights();
}

function bookFlightFromPopup() {

    closeCityPopup();

    showBookFlight();

    loadFlightTable();

    document.querySelectorAll("#flightTableBody tr").forEach(row => {

        let flightCell = row.children[0].innerText.trim();

        if (flightCell === popupFlightNo) {

            row.style.display = "";

            row.classList.add("selected-flight");

        } else {

            row.style.display = "none";

        }

    });

    selectedFlight = popupFlightNo;

    document.getElementById("selectedFlightText").innerText =
        "Selected Flight: " + popupFlightNo;

    createSeatMap();
}

function showAbout() {
    document.querySelector(".hero").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.add("hidden");
    document.getElementById("dashboardPage").classList.add("hidden");

    document.getElementById("aboutPage").classList.remove("hidden");
}

