import React, { useState } from "react";

const RoomImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <img src="https://via.placeholder.com/300" alt="No Room" />;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="slider">
      <button onClick={prevSlide}>◀</button>
      <img
        src={images[currentIndex]}
        alt="Room"
        className="room-image"
      />
      <button onClick={nextSlide}>▶</button>
    </div>
  );
};

export default RoomImageSlider;