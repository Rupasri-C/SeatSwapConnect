/* ========================================
   SEATSWAPCONNECT
   FRONTEND JAVASCRIPT
======================================== */


/* ========================================
   DEMO DATA

   Note:
   These records are stored in browser
   memory only. They are not connected
   to the Java/MySQL backend yet.
======================================== */

const demoSeats = [
    {
        id: 101,
        number: "A-101",
        location: "Block A",
        type: "Regular",
        status: "AVAILABLE"
    },
    {
        id: 102,
        number: "A-102",
        location: "Block A",
        type: "Window",
        status: "AVAILABLE"
    },
    {
        id: 103,
        number: "A-103",
        location: "Block A",
        type: "Regular",
        status: "AVAILABLE"
    },
    {
        id: 104,
        number: "B-201",
        location: "Block B",
        type: "Window",
        status: "AVAILABLE"
    },
    {
        id: 105,
        number: "B-202",
        location: "Block B",
        type: "Regular",
        status: "AVAILABLE"
    },
    {
        id: 106,
        number: "C-301",
        location: "Block C",
        type: "Premium",
        status: "AVAILABLE"
    }
];


const demoRequests = [
    {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        requestedSeatId: 102,
        offeredSeatId: 101,
        status: "PENDING"
    },
    {
        id: 2,
        requesterId: 2,
        receiverId: 3,
        requestedSeatId: 104,
        offeredSeatId: 103,
        status: "ACCEPTED"
    },
    {
        id: 3,
        requesterId: 3,
        receiverId: 1,
        requestedSeatId: 105,
        offeredSeatId: 106,
        status: "REJECTED"
    }
];


const demoUsers = [
    {
        id: 1,
        name: "Arun Kumar",
        email: "arun@gmail.com",
        password: "demo123"
    },
    {
        id: 2,
        name: "Priya",
        email: "priya@gmail.com",
        password: "demo123"
    },
    {
        id: 3,
        name: "Karthik",
        email: "karthik@gmail.com",
        password: "demo123"
    }
];


/* ========================================
   APPLICATION STATE
======================================== */

let currentUser = null;

let nextRequestId = Math.max(
    0,
    ...demoRequests.map(request => request.id)
) + 1;

let toastTimer = null;


/* ========================================
   ELEMENT REFERENCES
======================================== */

const loginSection =
    document.getElementById("loginSection");

const applicationSection =
    document.getElementById("applicationSection");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const pageTitle =
    document.getElementById("pageTitle");

const profileName =
    document.getElementById("profileName");

const toast =
    document.getElementById("toast");


/* ========================================
   LOGIN
======================================== */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value;

    const user = demoUsers.find(function (item) {

        return item.email === email &&
            item.password === password;

    });

    if (!user) {

        loginMessage.textContent =
            "Invalid email or password. Please try again.";

        loginMessage.className = "message error";

        return;
    }

    currentUser = user;

    profileName.textContent = user.name;

    loginMessage.textContent = "";

    loginSection.classList.add("hidden");

    applicationSection.classList.remove("hidden");

    logoutButton.classList.remove("hidden");

    document.querySelector(".profile").classList.remove("hidden");

    document.querySelector(".navigation").classList.remove("hidden");

    document.querySelector(".sidebar-bottom").classList.remove("hidden");

    showPage("dashboard");

    updateDashboard();

    showToast("Welcome, " + user.name + "!");

});


/* ========================================
   LOGOUT
======================================== */

logoutButton.addEventListener("click", function () {

    currentUser = null;

    applicationSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

    loginForm.reset();

    profileName.textContent = "Arun Kumar";

    showToast("You have logged out.");

});


/* ========================================
   NAVIGATION
======================================== */

document.querySelectorAll("[data-page]").forEach(function (button) {

    button.addEventListener("click", function () {

        const page = button.dataset.page;

        showPage(page);

    });

});


document.querySelectorAll("[data-go]").forEach(function (button) {

    button.addEventListener("click", function () {

        const page = button.dataset.go;

        showPage(page);

    });

});


function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {

        page.classList.add("hidden");

    });

    const selectedPage = document.getElementById(
        pageName + "Page"
    );

    if (!selectedPage) {
        return;
    }

    selectedPage.classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(function (link) {

        link.classList.remove("active");

        if (link.dataset.page === pageName) {

            link.classList.add("active");

        }

    });

    const titles = {
        dashboard: "Dashboard",
        seats: "Available Seats",
        requests: "Swap Requests",
        create: "Create Request"
    };

    pageTitle.textContent = titles[pageName] || "Dashboard";

    if (pageName === "dashboard") {

        updateDashboard();

    }

    if (pageName === "seats") {

        renderSeats();

    }

    if (pageName === "requests") {

        renderRequests();

    }

    if (pageName === "create") {

        populateSeatDropdowns();

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ========================================
   DASHBOARD STATISTICS
======================================== */

function updateDashboard() {

    const availableSeats = demoSeats.filter(function (seat) {

        return seat.status === "AVAILABLE";

    });

    const pendingRequests = demoRequests.filter(function (request) {

        return request.status === "PENDING";

    });

    const acceptedRequests = demoRequests.filter(function (request) {

        return request.status === "ACCEPTED";

    });

    document.getElementById("availableCount").textContent =
        availableSeats.length;

    document.getElementById("pendingCount").textContent =
        pendingRequests.length;

    document.getElementById("acceptedCount").textContent =
        acceptedRequests.length;

    document.getElementById("totalCount").textContent =
        demoSeats.length;

    renderRecentRequests();

}


/* ========================================
   GET SEAT DETAILS
======================================== */

function getSeat(seatId) {

    return demoSeats.find(function (seat) {

        return seat.id === Number(seatId);

    });

}


function getSeatNumber(seatId) {

    const seat = getSeat(seatId);

    return seat ? seat.number : "Unknown";

}


/* ========================================
   REQUEST STATUS BADGE
======================================== */

function getStatusBadge(status) {

    const statusClasses = {
        PENDING: "status-pending",
        ACCEPTED: "status-accepted",
        REJECTED: "status-rejected",
        AVAILABLE: "status-available",
        SWAPPED: "status-swapped"
    };

    const cssClass = statusClasses[status] || "";

    return `
        <span class="status ${cssClass}">
            ${escapeHTML(status)}
        </span>
    `;

}


/* ========================================
   RECENT REQUESTS
======================================== */

function renderRecentRequests() {

    const tableBody = document.getElementById(
        "recentRequestsBody"
    );

    const latestRequests = [...demoRequests]
        .sort(function (a, b) {

            return b.id - a.id;

        })
        .slice(0, 5);

    if (latestRequests.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    No swap requests available.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = latestRequests.map(function (request) {

        return `
            <tr>

                <td>#${request.id}</td>

                <td>
                    User ${request.requesterId}
                </td>

                <td>
                    ${escapeHTML(getSeatNumber(request.requestedSeatId))}
                </td>

                <td>
                    ${escapeHTML(getSeatNumber(request.offeredSeatId))}
                </td>

                <td>
                    ${getStatusBadge(request.status)}
                </td>

            </tr>
        `;

    }).join("");

}


/* ========================================
   AVAILABLE SEATS
======================================== */

function renderSeats() {

    const seatGrid = document.getElementById("seatGrid");

    const searchValue = document
        .getElementById("seatSearch")
        .value
        .trim()
        .toLowerCase();

    const selectedStatus = document
        .getElementById("seatStatusFilter")
        .value;

    const filteredSeats = demoSeats.filter(function (seat) {

        const matchesSearch =
            seat.number.toLowerCase().includes(searchValue) ||
            seat.location.toLowerCase().includes(searchValue) ||
            seat.type.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "ALL" ||
            seat.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });

    if (filteredSeats.length === 0) {

        seatGrid.innerHTML = `
            <div class="content-card">
                No seats found matching your search.
            </div>
        `;

        return;
    }

    seatGrid.innerHTML = filteredSeats.map(function (seat) {

        const isAvailable = seat.status === "AVAILABLE";

        return `
            <div class="seat-card">

                <div class="seat-card-top">

                    <span class="seat-number">
                        ${escapeHTML(seat.number)}
                    </span>

                    ${getStatusBadge(seat.status)}

                </div>

                <div class="seat-details">

                    <div>
                        <strong>Seat ID:</strong>
                        ${seat.id}
                    </div>

                    <div>
                        <strong>Location:</strong>
                        ${escapeHTML(seat.location)}
                    </div>

                    <div>
                        <strong>Seat Type:</strong>
                        ${escapeHTML(seat.type)}
                    </div>

                </div>

                ${
            isAvailable
                ? `
                            <button
                                class="primary-button"
                                data-request-seat="${seat.id}"
                            >
                                Request This Seat
                            </button>
                        `
                : `
                            <button
                                class="secondary-button"
                                disabled
                            >
                                Not Available
                            </button>
                        `
        }

            </div>
        `;

    }).join("");


    seatGrid.querySelectorAll("[data-request-seat]").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const seatId = Number(
                    button.dataset.requestSeat
                );

                showPage("create");

                document.getElementById(
                    "requestedSeatId"
                ).value = String(seatId);

            });

        }
    );

}


/* ========================================
   SEAT SEARCH AND FILTER
======================================== */

document.getElementById("seatSearch").addEventListener(
    "input",
    renderSeats
);

document.getElementById("seatStatusFilter").addEventListener(
    "change",
    renderSeats
);


/* ========================================
   POPULATE SEAT DROPDOWNS
======================================== */

function populateSeatDropdowns() {

    const requestedSelect = document.getElementById(
        "requestedSeatId"
    );

    const offeredSelect = document.getElementById(
        "offeredSeatId"
    );

    const currentRequestedValue = requestedSelect.value;

    const currentOfferedValue = offeredSelect.value;

    const availableSeats = demoSeats.filter(function (seat) {

        return seat.status === "AVAILABLE";

    });

    const options = availableSeats.map(function (seat) {

        return `
            <option value="${seat.id}">
                ${escapeHTML(seat.number)}
                - ${escapeHTML(seat.location)}
                (ID: ${seat.id})
            </option>
        `;

    }).join("");

    requestedSelect.innerHTML =
        '<option value="">Select requested seat</option>' +
        options;

    offeredSelect.innerHTML =
        '<option value="">Select offered seat</option>' +
        options;

    if (
        availableSeats.some(
            seat => String(seat.id) === currentRequestedValue
        )
    ) {

        requestedSelect.value = currentRequestedValue;

    }

    if (
        availableSeats.some(
            seat => String(seat.id) === currentOfferedValue
        )
    ) {

        offeredSelect.value = currentOfferedValue;

    }

}


/* ========================================
   CREATE SWAP REQUEST
======================================== */

const swapRequestForm = document.getElementById(
    "swapRequestForm"
);

swapRequestForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const requesterId = Number(
        document.getElementById("requesterId").value
    );

    const receiverId = Number(
        document.getElementById("receiverId").value
    );

    const requestedSeatId = Number(
        document.getElementById("requestedSeatId").value
    );

    const offeredSeatId = Number(
        document.getElementById("offeredSeatId").value
    );

    const message = document.getElementById(
        "requestMessage"
    );


    if (
        !requesterId ||
        !receiverId ||
        !requestedSeatId ||
        !offeredSeatId
    ) {

        showFormMessage(
            message,
            "Please fill in all fields.",
            "error"
        );

        return;
    }


    if (requesterId === receiverId) {

        showFormMessage(
            message,
            "Requester ID and Receiver ID must be different.",
            "error"
        );

        return;
    }


    if (requestedSeatId === offeredSeatId) {

        showFormMessage(
            message,
            "Please select two different seats.",
            "error"
        );

        return;
    }


    const requestedSeat = getSeat(requestedSeatId);

    const offeredSeat = getSeat(offeredSeatId);


    if (!requestedSeat || !offeredSeat) {

        showFormMessage(
            message,
            "One or both selected seats do not exist.",
            "error"
        );

        return;
    }


    if (
        requestedSeat.status !== "AVAILABLE" ||
        offeredSeat.status !== "AVAILABLE"
    ) {

        showFormMessage(
            message,
            "Both seats must be available.",
            "error"
        );

        populateSeatDropdowns();

        return;
    }


    const alreadyExists = demoRequests.some(function (request) {

        return (
            request.status === "PENDING" &&
            request.requesterId === requesterId &&
            request.receiverId === receiverId &&
            request.requestedSeatId === requestedSeatId &&
            request.offeredSeatId === offeredSeatId
        );

    });


    if (alreadyExists) {

        showFormMessage(
            message,
            "This pending request already exists.",
            "error"
        );

        return;
    }


    const newRequest = {

        id: nextRequestId++,

        requesterId: requesterId,

        receiverId: receiverId,

        requestedSeatId: requestedSeatId,

        offeredSeatId: offeredSeatId,

        status: "PENDING"

    };


    demoRequests.push(newRequest);


    showFormMessage(
        message,
        "Swap request created successfully! Request ID: " +
        newRequest.id,
        "success"
    );


    updateDashboard();

    renderRequests();

    populateSeatDropdowns();

    showToast("Swap request created successfully!");


    swapRequestForm.reset();

    document.getElementById("requesterId").value = "1";

    document.getElementById("receiverId").value = "2";

    populateSeatDropdowns();

});


/* ========================================
   SWAP REQUEST SEARCH AND FILTER
======================================== */

document.getElementById("requestSearch").addEventListener(
    "input",
    renderRequests
);

document.getElementById("requestStatusFilter").addEventListener(
    "change",
    renderRequests
);


/* ========================================
   RENDER REQUEST TABLE
======================================== */

function renderRequests() {

    const tableBody = document.getElementById(
        "requestsTableBody"
    );

    const searchValue = document
        .getElementById("requestSearch")
        .value
        .trim()
        .toLowerCase();

    const selectedStatus = document
        .getElementById("requestStatusFilter")
        .value;


    const filteredRequests = [...demoRequests]
        .sort(function (a, b) {

            return b.id - a.id;

        })
        .filter(function (request) {

            const searchText = [

                request.id,

                request.requesterId,

                request.receiverId,

                getSeatNumber(request.requestedSeatId),

                getSeatNumber(request.offeredSeatId),

                request.status

            ].join(" ").toLowerCase();


            const matchesSearch =
                searchText.includes(searchValue);

            const matchesStatus =
                selectedStatus === "ALL" ||
                request.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    if (filteredRequests.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">
                    No swap requests found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = filteredRequests.map(
        function (request) {

            let actionButtons = "-";


            if (request.status === "PENDING") {

                actionButtons = `
                    <button
                        class="small-button accept-button"
                        data-accept="${request.id}"
                    >
                        Accept
                    </button>

                    <button
                        class="small-button reject-button"
                        data-reject="${request.id}"
                    >
                        Reject
                    </button>
                `;

            }


            return `
                <tr>

                    <td>#${request.id}</td>

                    <td>
                        User ${request.requesterId}
                    </td>

                    <td>
                        User ${request.receiverId}
                    </td>

                    <td>
                        ${escapeHTML(
                getSeatNumber(request.requestedSeatId)
            )}
                    </td>

                    <td>
                        ${escapeHTML(
                getSeatNumber(request.offeredSeatId)
            )}
                    </td>

                    <td>
                        ${getStatusBadge(request.status)}
                    </td>

                    <td>
                        ${actionButtons}
                    </td>

                </tr>
            `;

        }
    ).join("");


    attachRequestActionListeners();

}


/* ========================================
   ACCEPT / REJECT BUTTON LISTENERS
======================================== */

function attachRequestActionListeners() {

    document.querySelectorAll("[data-accept]").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const requestId = Number(
                    button.dataset.accept
                );

                acceptRequest(requestId);

            });

        }
    );


    document.querySelectorAll("[data-reject]").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const requestId = Number(
                    button.dataset.reject
                );

                rejectRequest(requestId);

            });

        }
    );

}


/* ========================================
   ACCEPT REQUEST
======================================== */

function acceptRequest(requestId) {

    const request = demoRequests.find(function (item) {

        return item.id === requestId;

    });


    if (!request) {

        showToast("Request not found.");

        return;
    }


    if (request.status !== "PENDING") {

        showToast("This request is no longer pending.");

        return;
    }


    const requestedSeat = getSeat(request.requestedSeatId);

    const offeredSeat = getSeat(request.offeredSeatId);


    if (!requestedSeat || !offeredSeat) {

        showToast("Seat details could not be found.");

        return;
    }


    if (
        requestedSeat.status !== "AVAILABLE" ||
        offeredSeat.status !== "AVAILABLE"
    ) {

        showToast(
            "Cannot accept: one or both seats are unavailable."
        );

        return;
    }


    const confirmed = window.confirm(
        "Are you sure you want to accept request #" +
        requestId + "?"
    );


    if (!confirmed) {

        return;
    }


    /*
       DEMO BEHAVIOUR ONLY

       This updates JavaScript demo data.
       It does not update the real database.
    */

    requestedSeat.status = "SWAPPED";

    offeredSeat.status = "SWAPPED";

    request.status = "ACCEPTED";


    updateDashboard();

    renderRequests();

    renderSeats();

    populateSeatDropdowns();


    showToast(
        "Request accepted and both seats marked as swapped."
    );

}


/* ========================================
   REJECT REQUEST
======================================== */

function rejectRequest(requestId) {

    const request = demoRequests.find(function (item) {

        return item.id === requestId;

    });


    if (!request) {

        showToast("Request not found.");

        return;
    }


    if (request.status !== "PENDING") {

        showToast("Only pending requests can be rejected.");

        return;
    }


    const confirmed = window.confirm(
        "Are you sure you want to reject request #" +
        requestId + "?"
    );


    if (!confirmed) {

        return;
    }


    request.status = "REJECTED";


    updateDashboard();

    renderRequests();


    showToast("Swap request rejected.");

}


/* ========================================
   MESSAGE HELPERS
======================================== */

function showFormMessage(element, message, type) {

    element.textContent = message;

    element.className = "message " + type;

}


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    if (toastTimer) {

        clearTimeout(toastTimer);

    }


    toastTimer = setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* ========================================
   BASIC HTML ESCAPING

   Helps prevent user-controlled text
   from being inserted as HTML.
======================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ========================================
   INITIALIZE APPLICATION
======================================== */

function initializeApplication() {

    loginSection.classList.remove("hidden");

    applicationSection.classList.add("hidden");

    logoutButton.classList.remove("hidden");

    renderRecentRequests();

    updateDashboard();

    populateSeatDropdowns();

}


initializeApplication();