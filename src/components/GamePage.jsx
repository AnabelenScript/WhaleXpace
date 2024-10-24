import React, { useState, useEffect } from "react";
import './gamePageStyles.css';
import whaleUp from '../assets/images/ballenauphd.png';
import whaleCenter from '../assets/images/ballenacenter hd.png';
import whaleDown from '../assets/images/ballenadown hd.png';
import footerImage from '../assets/images/background2.png';
import meteoriteImage from '../assets/images/meteor.png';

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
  const [meteorites, setMeteorites] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const maxMovementX = 450;
  const minMovementY = -290;
  const maxMovementY = 70;
  const gameAreaWidth = 900; 
  const gameAreaHeight = 620; 
  const generateMeteorite = () => {
    const randomX = Math.floor(Math.random() * gameAreaWidth);
    if (randomX >= 0 && randomX <= gameAreaWidth) {
      setMeteorites((prevMeteorites) => [
        ...prevMeteorites,
        { id: Date.now(), x: randomX, y: -50 }, 
      ]);
    }
  };
  useEffect(() => {
    if (isGameStarted) {
      const meteoriteInterval = setInterval(() => {
        setMeteorites((prevMeteorites) =>
          prevMeteorites.map((meteorite) => ({
            ...meteorite,
            y: meteorite.y + 10,
          })).filter((meteorite) => meteorite.y < gameAreaHeight) 
        );
      }, 50);

      const generationInterval = setInterval(generateMeteorite, 1000);

      return () => {
        clearInterval(meteoriteInterval);
        clearInterval(generationInterval);
      };
    }
  }, [isGameStarted]);

  const checkCollision = () => {
    return meteorites.some((meteorite) => {
      const whaleHitbox = {
        x: positionX,
        y: positionY,
        width: 150,
        height: 84,
      };
      const meteoriteHitbox = {
        x: meteorite.x,
        y: meteorite.y,
        width: 90,
        height: 90,
      };
  
      return (
        whaleHitbox.x < meteoriteHitbox.x + meteoriteHitbox.width &&
        whaleHitbox.x + whaleHitbox.width > meteoriteHitbox.x && 
        whaleHitbox.y < meteoriteHitbox.y + meteoriteHitbox.height &&
        whaleHitbox.y + whaleHitbox.height > meteoriteHitbox.y 
      );
    });
  };
  
  const handleGameOver = () => {
    setGameOver(true);
    setIsGameStarted(false);
  };

  const handleRestart = () => {
    setPositionX(0);
    setPositionY(0);
    setMeteorites([]);
    setIsGameStarted(false);
    setGameOver(false);
    setIsVisible(true);
    setFooterVisible(true);
    setFooterOpacity(1);
  };

  const handleKeyDown = (event) => {
    const movementSpeed = 20; 
  
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
  
    if (!gameOver) {
      switch (event.code) {
        case 'ArrowLeft':
          setPositionX((prevPosition) => Math.max(prevPosition - movementSpeed, -maxMovementX));
          break;
        case 'ArrowRight':
          setPositionX((prevPosition) => Math.min(prevPosition + movementSpeed, maxMovementX));
          break;
        case 'ArrowUp':
          setPositionY((prevPosition) => Math.max(prevPosition - movementSpeed, minMovementY));
          break;
        case 'ArrowDown':
          setPositionY((prevPosition) => Math.min(prevPosition + movementSpeed, maxMovementY));
          break;
        default:
          break;
      }
    }
  };
  

  const handleKeyUp = (event) => {
    setIsAnimating(true);
  };
  useEffect(() => {
    if (isGameStarted && !gameOver) {
      const interval = setInterval(() => {
        setBackgroundPosition((prevPosition) => {
          const newPosition = (prevPosition + 8) % 620;
          return newPosition;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isGameStarted, gameOver]);
  useEffect(() => {
    if (isGameStarted && !gameOver) {
      const collisionInterval = setInterval(() => {
        if (checkCollision()) {
          handleGameOver();
        }
      }, 50);

      return () => clearInterval(collisionInterval);
    }
  }, [isGameStarted, gameOver, meteorites]);

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

        <div className="meteorContainer">
          {meteorites.map((meteorite) => (
            <img
              key={meteorite.id}
              src={meteoriteImage}
              alt="Meteorite"
              className="meteorite"
              style={{
                position: 'absolute',
                left: `${meteorite.x}px`,
                top: `${meteorite.y}px`,
                width: '90px',
                height: '90px',
              }}
            />
          ))}
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

        <div className="gameOverContainer">
          {gameOver && (
            <div className="gameOverOverlay">
              <h1>Game Over</h1>
              <button onClick={handleRestart} className="restartButton">
                Restart
              </button>
            </div>
          )}
        </div>
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
