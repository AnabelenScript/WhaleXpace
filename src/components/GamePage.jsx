import React, { useState, useEffect } from "react";
import './gamePageStyles.css';
import whaleUp from '../assets/images/ballenauphd.png';
import whaleCenter from '../assets/images/ballenacenter hd.png';
import whaleDown from '../assets/images/ballenadown hd.png';
import footerImage from '../assets/images/background2.png';

function GamePage() {
  const [isVisible, setIsVisible] = useState(true);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [currentImage, setCurrentImage] = useState(whaleCenter);
  const [isAnimating, setIsAnimating] = useState(true);
  const [backgroundPosition, setBackgroundPosition] = useState(0); 
  const [currentBackground, setCurrentBackground] = useState('background1'); 
  const [isGameStarted, setIsGameStarted] = useState(false); 
  const [footerVisible, setFooterVisible] = useState(true); 
  const [footerOpacity, setFooterOpacity] = useState(1); 
  const maxMovementX = 450; 
  const minMovementY = -290; 
  const maxMovementY = 70;

  const handleKeyDown = (event) => {
    if (event.code === 'Space' && !isGameStarted) {
      setIsGameStarted(true);
      setIsVisible(false); 
      const interval = setInterval(() => {
        setFooterOpacity((prevOpacity) => {
          if (prevOpacity === 0) {
            clearInterval(interval); 
            setFooterVisible(false); 
            return prevOpacity;
          }
          return prevOpacity - 0.1; 
        });
      }, 100); 
    }
    switch (event.code) {
      case 'ArrowLeft':
        setPositionX((prevPosition) => Math.max(prevPosition - 10, -maxMovementX));
        break;
      case 'ArrowRight':
        setPositionX((prevPosition) => Math.min(prevPosition + 10, maxMovementX));
        break;
      case 'ArrowUp':
        setPositionY((prevPosition) => Math.max(prevPosition - 10, minMovementY));
        break;
      case 'ArrowDown':
        setPositionY((prevPosition) => Math.min(prevPosition + 10, maxMovementY));
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    setIsAnimating(true); 
  };
  useEffect(() => {
    if (isGameStarted) {
      const interval = setInterval(() => {
        setBackgroundPosition((prevPosition) => {
          const newPosition = (prevPosition + 8) % 620; 
          return newPosition;
        });
      }, 30); 
      return () => clearInterval(interval);
    }
  }, [isGameStarted]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  useEffect(() => {
    if (isAnimating) {
      const imageCycle = [whaleUp, whaleCenter, whaleDown];
      let currentIndex = 0;

      const interval = setInterval(() => {
        setCurrentImage(imageCycle[currentIndex]);
        currentIndex = (currentIndex + 1) % imageCycle.length;
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);
  return (
    <div>
      <div
        className={`gameContent ${currentBackground}`}
        style={{ backgroundPositionY: `${backgroundPosition}px` }}
      >
        <div className={`overlay ${!isVisible ? 'fade-out' : ''}`}>
          <div className={`info ${!isVisible ? 'fade-out' : ''}`}>
            <h1 className="blink">WhaleXpace</h1>
            <p className="subtitle">Insert a coin</p>
          </div>
        </div>
        <div
          className="whale-container"
          style={{
            transform: `translate(${positionX}px, ${positionY}px)`,
          }}
        >
          <img src={currentImage} alt="Whale" className="whale-image" />
        </div>
        {footerVisible && (
          <img
            src={footerImage}
            alt="Footer"
            id="footer"
            style={{
              opacity: footerOpacity,
              transition: 'opacity 0.0001s ease-in-out',
              width: '100%',
              bottom: '0',
            }}
          />
        )}
      </div>

      <div id="controls">
        <span className="control-item">
          <span className="key">Space</span> Jugar
        </span>
        <span className="control-item">
          <span className="key">M</span> Silencio
        </span>
        <span className="control-item">
          <span className="key pixel-icon"><i className='bx bx-chevron-left'></i></span>
          <span className="key pixel-icon"><i className='bx bx-chevron-right'></i></span> Mover
        </span>
        <span className="control-item">
          <span className="key pixel-icon"><i className='bx bx-chevron-up'></i></span>
          <span className="key pixel-icon"><i className='bx bx-chevron-down'></i></span> Mover
        </span>
      </div>
    </div>
  );
}

export default GamePage;
