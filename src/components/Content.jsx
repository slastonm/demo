import React, {useState} from "react";
import "./Content.css";
import VideoFile from "../assets/pictures/26 event/Version 2.6 Trailer - Folie et Dйraison _ Reverse_ 1999.mp4";
import slideImg1 from "../assets/pictures/26 event/Dialogues behind bars.jpg";
import slideImg2 from "../assets/pictures/26 event/The answering machine the butterfly and the literary critic.jpg";
import slideImg3 from "../assets/pictures/26 event/wilderness pack.jpg";

const Content = () => {
  
  const imgs = [slideImg1, slideImg2, slideImg3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };
  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imgs.length);
  };

  return (
    <section className="content-grid">
      <div className="carousel-container">
          <button
          onClick={showPrev}
          id="prevBtn"
          className="carousel-btn left-btn"
        >
          ❮ 
        </button>
        <div className="event-poster">
          {imgs.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className={index === currentIndex ? "active" : "hidden"}
            />
          ))}
        </div>
        <button
          id="nextBtn"
          className="carousel-btn right-btn"
          onClick={showNext}
        >
          ❯
        </button>
      </div>

      <section className="treiler-ver">
        <video src={VideoFile} controls></video>
      </section>
    </section>
  );
};

export default Content;