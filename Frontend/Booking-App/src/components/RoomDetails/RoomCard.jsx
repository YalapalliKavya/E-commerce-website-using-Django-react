import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoomCard.css";

const RoomCard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Static room data
  const rooms = [
    {
      id: 101,
      name: "Deluxe",
      price: 2500,
      capacity: 3,
      description: "Spacious deluxe room with sea view.",
      occupiedDates: ["2026-02-26", "2026-02-28", "2026-03-01"],
      image: "/images/deluxe1.jpg",
    },
    {
      id: 102,
      name: "Family Suite",
      price: 4000,
      capacity: 5,
      description: "Large family suite with two bedrooms.",
      occupiedDates: ["2026-03-01", "2026-03-05"],
      image: "/images/family_suite1.jpg",
    },
    {
      id: 103,
      name: "Standard",
      price: 1800,
      capacity: 2,
      description: "Comfortable standard room for couples.",
      occupiedDates: ["2026-02-27"],
      image: "/images/standard1.jpg",
    },
  ];

  // Load bookings from localStorage
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  const handleBooking = (room) => {
    const existingBookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    // Avoid booking canceled rooms
    const canceledRoom = existingBookings.find(
      (r) => r.id === room.id && r.canceled
    );
    if (canceledRoom) {
      alert("This room has been canceled and cannot be booked again.");
      return;
    }

    const updatedBookings = [...existingBookings, room];
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    alert(`Room "${room.name}" booked successfully!`);
    navigate("/my-bookings");
  };

  // Check if room is canceled
  const isCanceled = (room) => {
    const canceledRoom = bookings.find(
      (r) => r.id === room.id && r.canceled
    );
    return !!canceledRoom;
  };

  return (
    <div className="room-container">
      <h1>Available Rooms</h1>
      {rooms.map((room) => (
        <div key={room.id} className="room-card">
          {/* Room Image */}
          <img src={room.image} alt={room.name} className="room-image" />

          {/* Room Info */}
          <div className="room-info">
            <h2>{room.name}</h2>
            <p><strong>Room ID:</strong> {room.id}</p>
            <p><strong>Price:</strong> ₹ {room.price} / night</p>
            <p><strong>Capacity:</strong> {room.capacity} Guests</p>
            <p><strong>Description:</strong> {room.description}</p>

            {room.occupiedDates && room.occupiedDates.length > 0 && (
              <p className="occupied-dates">
                📅 Occupied Dates: {room.occupiedDates.join(", ")}
              </p>
            )}

            <button
              className={`book-btn ${isCanceled(room) ? "disabled" : ""}`}
              onClick={() => handleBooking(room)}
              disabled={isCanceled(room)}
            >
              {isCanceled(room) ? "Canceled" : "Book Room"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomCard;