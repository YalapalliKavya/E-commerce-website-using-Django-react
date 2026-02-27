import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RoomCard from "./RoomDetails/RoomCard";
import "./BookingComponent.css";

const BookingComponent = ({ currentUser }) => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roomData, setRoomData] = useState([]);

  // ✅ FETCH ROOMS
  useEffect(() => {
    async function fetchRoomData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/rooms/");

        if (!response.ok) {
          throw new Error("Failed to fetch room data.");
        }

        const data = await response.json();

        // ✅ Ensure occupiedDates always exists
        const safeData = data.map((room) => ({
          ...room,
          occupiedDates: room.occupiedDates || [],
        }));

        setRoomData(safeData);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }

    fetchRoomData();
  }, []);

  // ✅ DATE CLICK
  const handleDateClick = (day, monthOffset = 0) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    selectedDate.setHours(0, 0, 0, 0);

    if (!selectedDates.startDate || selectedDates.endDate) {
      setSelectedDates({ startDate: selectedDate, endDate: null });
    } else if (
      selectedDate.getTime() === selectedDates.startDate.getTime()
    ) {
      setSelectedDates({
        startDate: selectedDate,
        endDate: selectedDate,
      });
    } else {
      if (selectedDate > selectedDates.startDate) {
        setSelectedDates({ ...selectedDates, endDate: selectedDate });
      } else {
        setSelectedDates({
          startDate: selectedDate,
          endDate: selectedDates.startDate,
        });
      }
    }

    setError("");
  };

  // ✅ MONTH CHANGE
  const handleMonthChange = (increment) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1
    );
    setCurrentDate(newDate);
  };

  // ✅ GENERATE CALENDAR
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, monthOffset: 1 });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // ✅ CHECK SELECTED
  const isDateSelected = (day, monthOffset) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    date.setHours(0, 0, 0, 0);

    return (
      (selectedDates.startDate &&
        selectedDates.startDate.getTime() === date.getTime()) ||
      (selectedDates.endDate &&
        selectedDates.endDate.getTime() === date.getTime()) ||
      (selectedDates.startDate &&
        selectedDates.endDate &&
        date >= selectedDates.startDate &&
        date <= selectedDates.endDate)
    );
  };

  // ✅ FILTER ROOMS (FIXED SAFELY)
  const handleFilterRooms = () => {
    if (!selectedDates.startDate) {
      setError("Please select a valid date.");
      setIsFiltered(false);
      return;
    }

    const startDate = selectedDates.startDate;
    const endDate = selectedDates.endDate || selectedDates.startDate;

    const isDateInRange = (occupiedDate) => {
      const occupied = new Date(occupiedDate);
      occupied.setHours(0, 0, 0, 0);

      if (endDate.getTime() !== startDate.getTime()) {
        return occupied >= startDate && occupied <= endDate;
      } else {
        return occupied.getTime() === startDate.getTime();
      }
    };

    const availableRooms = roomData.filter((room) => {
      if (!room.occupiedDates || room.occupiedDates.length === 0) {
        return true;
      }

      return room.occupiedDates.every(
        (occ) => !isDateInRange(occ.date)
      );
    });

    setFilteredRooms(availableRooms);
    setIsFiltered(true);
    setError("");
  };

  return (
    <div className="booking-container">
      <div className="calender-header">
        <button
          className="date-switcher"
          onClick={() => handleMonthChange(-1)}
        >
          <FaArrowLeft />
        </button>

        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          className="date-switcher"
          onClick={() => handleMonthChange(1)}
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="calender-days">
        {calendarDays.map(({ day, monthOffset }, index) => (
          <div
            key={index}
            className={`calender-day ${
              isDateSelected(day, monthOffset) ? "selected" : ""
            } ${monthOffset !== 0 ? "overflow" : ""}`}
            onClick={() => handleDateClick(day, monthOffset)}
          >
            {day}
          </div>
        ))}
      </div>

      <button className="book-rooms-button" onClick={handleFilterRooms}>
        Book Rooms
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="filtered-rooms">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              selectedDateRange={selectedDates}
              onBookingSuccess={() => {
                setSelectedDates({ startDate: null, endDate: null });
                setFilteredRooms([]);
                setSuccess("Booking Successful!");
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                }, 5000);
              }}
            />
          ))
        ) : isFiltered && selectedDates.startDate ? (
          <p>No available rooms for the selected dates.</p>
        ) : success !== "" ? (
          <p>{success}</p>
        ) : (
          <p>Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;