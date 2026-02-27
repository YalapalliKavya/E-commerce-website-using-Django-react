import React, { useEffect, useState } from "react";

const OccupiedDataDisplay = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings =
      JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  if (bookings.length === 0) {
    return <h2>No bookings yet.</h2>;
  }

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.map((room, index) => (
        <div key={index} className="room-card">
          <img
            src={
              room.image
                ? `http://localhost:8000${room.image}`
                : "https://via.placeholder.com/300"
            }
            alt={room.name}
            width="250"
          />
          <h3>{room.name}</h3>
          <p>{room.description}</p>
          <p>₹ {room.price} / night</p>
        </div>
      ))}
    </div>
  );
};

export default OccupiedDataDisplay;