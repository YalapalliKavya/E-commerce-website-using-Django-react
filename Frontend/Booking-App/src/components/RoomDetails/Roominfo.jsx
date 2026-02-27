import React, { useEffect, useState } from "react";
import "./Roominfo.css";

const Roominfo = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    // Ensure each booking has canceled flag
    const updated = storedBookings.map((b) => ({ ...b, canceled: b.canceled || false }));
    setBookings(updated);
  }, []);

  const handleCancel = (roomId) => {
    const updatedBookings = bookings.map((b) =>
      b.id === roomId ? { ...b, canceled: true } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <h2>No rooms booked yet.</h2>
      ) : (
        bookings.map((room) => (
          <div key={room.id} className="booking-card">
            <img
              src={room.image || "/images/deluxe1.jpg"}
              alt={room.name}
              className="booking-image"
            />

            <div className="booking-info">
              <h3>{room.name}</h3>
              <p><strong>Room ID:</strong> {room.id}</p>
              <p><strong>Price:</strong> ₹ {room.price} / night</p>
              <p><strong>Capacity:</strong> {room.capacity} Guests</p>
              <p><strong>Description:</strong> {room.description}</p>

              {room.occupiedDates && room.occupiedDates.length > 0 && (
                <p className="occupied-dates">
                  📅 Occupied Dates: {room.occupiedDates.join(", ")}
                </p>
              )}

              {!room.canceled ? (
                <button className="cancel-btn" onClick={() => handleCancel(room.id)}>
                  Cancel Booking
                </button>
              ) : (
                <button className="canceled-btn" disabled>
                  Canceled
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Roominfo;