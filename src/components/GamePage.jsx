import Phaser from 'phaser';
import whaleUp from '../assets/images/Up (1).png';
import whalemiddledown from '../assets/images/Middle Down (1).png';
import whalemiddleUp from '../assets/images/Middle Up.png';
import whaleCenter from '../assets/images/Middle (1).png';
import whaleDown from '../assets/images/Down.png';
import meteoriteImage from '../assets/images/meteor.png';
import coinImage from '../assets/images/HD.png';  // Asegúrate de tener una imagen para la moneda
import footerImage from '../assets/images/background2.png';
import background from '../assets/images/background3.png';

function GamePage() {
  class WhaleGame extends Phaser.Scene {
    constructor() {
      super('WhaleGame');
    }

    preload() {
      // Cargar imágenes
      this.load.image('whaleUp', whaleUp);
      this.load.image('whaleMiddleUp', whalemiddleUp);
      this.load.image('whaleMiddleDown', whalemiddledown);
      this.load.image('whaleCenter', whaleCenter);
      this.load.image('whaleDown', whaleDown);
      this.load.image('meteorite', meteoriteImage);
      this.load.image('coin', coinImage);  // Cargar la imagen de la moneda
      this.load.image('footer', footerImage);
      this.load.image('background', background);
    }

    create() {
      this.isGameStarted = false;
      this.gameOver = false;
      this.meteorites = [];
      this.coins = [];  // Inicializar el array de monedas
      this.positionX = 450; // Ballena centrada en X
      this.positionY = 350; // Ballena centrada en Y
      this.currentImage = 'whaleCenter';
      this.movementSpeed = 5;
      this.maxMovementX = 900;
      this.minMovementX = 0;
      this.minMovementY = 0;
      this.maxMovementY = 620;
      this.gameAreaWidth = 900;  // Ancho del área de juego ajustado
      this.gameAreaHeight = 620;

      // Configurar fondo
      this.background = this.add.tileSprite(0, 0, this.gameAreaWidth, this.gameAreaHeight, 'background').setOrigin(0, 0);

      const gameContainer = this.add.rectangle(300, 200, 900, 620, 0x000000, 0.5);
      gameContainer.setOrigin(0.5, 0.5);

      // Crear título con animación "blink" y moverlo hacia arriba
      this.titleText = this.add.text(this.gameAreaWidth / 2, this.gameAreaHeight / 4 , 'WhaleXpace', {
        fontSize: '80px',
        fontFamily: '"Press Start 2P", monospace',
        color: 'linear-gradient(#9bd4ff,#8a8a8a)',
        backgroundColor: 'black',
      })
        .setOrigin(0.5, 0.5)
        .setStroke('#8ed4ff', 16) // Gradiente simulado con borde azul
        .setShadow(2, 2, '#dcdcdc', 0, true, false)
        .setAlpha(1); // Visibilidad inicial con opacidad 1

      // Configurar animación del parpadeo
      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.titleText.setAlpha(this.titleText.alpha === 1 ? 0 : 1);
        },
        loop: true,
      });

      // Fondo del subtítulo
      this.backgroundsub = this.add.graphics();
      const textWidth = 300;
      const textHeight = 50;
      const cornerRadius = 20;

      this.backgroundsub.fillStyle(0x006cbf, 1);
      this.backgroundsub.fillRoundedRect(
        this.gameAreaWidth / 2 - textWidth / 2,
        this.gameAreaHeight / 4 + 90 - textHeight / 2,
        textWidth,
        textHeight,
        cornerRadius
      );

      this.subtitleText = this.add.text(this.gameAreaWidth / 2, this.gameAreaHeight / 4 + 90, 'Insert Coin', {
        fontSize: '25px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#ffffff',
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
      })
        .setOrigin(0.5, 0.5)
        .setStyle({
          textShadow: '0 0 black, 0 2px black, 2px 0 black, 0 0 black',
        })
        .setAlpha(1); // Visibilidad inicial con opacidad 1

      this.tweens.add({
        targets: this.subtitleText,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });

      // Configurar ballena
      this.whale = this.add.image(this.positionX, this.positionY, this.currentImage);
      this.physics.add.existing(this.whale);
      this.whale.setDisplaySize(120, 100); 
      this.whale.body.setCircle(20); // Radio del círculo, ajusta según sea necesario
      this.whale.body.setOffset(20, 20); // Centrar la hitbox
      this.whale.angle = -90;

      // Configurar meteoritos
      this.meteoriteGroup = this.physics.add.group();

      // Configurar monedas
      this.coinGroup = this.physics.add.group();  // Grupo de monedas
        // Contador de monedas
    this.coinCounterText = this.add.text(20, 20, 'Coins: 0', {
      fontSize: '30px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FFFFFF',
    });


      // Footer
      this.footer = this.add.image(0, this.gameAreaHeight, 'footer').setOrigin(0, 1).setDisplaySize(this.gameAreaWidth, 120);

      // Teclado
      this.cursors = this.input.keyboard.createCursorKeys();

      // Eventos de teclado
      this.input.keyboard.on('keydown-SPACE', this.startGame, this);
      this.input.keyboard.on('keydown-M', this.toggleMute, this);

      // Animación de imágenes de la ballena
      this.whaleImages = ['whaleMiddleUp','whaleUp', 'whaleCenter', 'whaleMiddleDown','whaleDown', 'whaleMiddleDown', 'whaleCenter']; // Imágenes de la ballena
      this.imageIndex = 1; // Comenzamos con la imagen central
      this.whaleImageTween = null;
    }

    update() {
      if (this.isGameStarted && !this.gameOver) {
        this.moveWhale();
        this.moveMeteorites();
        this.moveCoins(); // Mover las monedas
        this.checkCollision();
        this.updateBackground(); // Fondo

        // Actualizar la animación de la ballena si está activa
        if (this.whaleImageTween) {
          this.whale.setTexture(this.whaleImages[this.imageIndex]);
        }
      }
    }

    startGame() {
      if (!this.isGameStarted) {
        this.isGameStarted = true;
        this.gameOver = false;
        this.meteorites = [];
        this.coin = 0;
        this.coins = [];  // Limpiar las monedas al iniciar el juego
        this.positionX = 450;
        this.positionY = 350;
        this.titleText.setAlpha(0);  // Hacer invisible el título
        this.subtitleText.setAlpha(0); // Hacer invisible el subtítulo
        this.whale.setPosition(this.positionX, this.positionY);
        this.meteoriteGroup.clear(true, true);
        this.coinGroup.clear(true, true);  // Limpiar las monedas
        this.handleSpacePress();
        this.meteoriteInterval = this.time.addEvent({
          delay: 1000,
          callback: this.generateMeteorite,
          callbackScope: this,
          loop: true,
        });

        // Comenzar la animación de imágenes de la ballena
        this.whaleImageTween = this.time.addEvent({
          delay: 250,
          callback: this.cycleWhaleImages,
          callbackScope: this,
          loop: true,
        });

        // Generar monedas
        this.coinInterval = this.time.addEvent({
          delay: 1500,
          callback: this.generateCoin,
          callbackScope: this,
          loop: true,
        });
      }
    }

    cycleWhaleImages() {
      // Cambiar la imagen de la ballena
      this.imageIndex = (this.imageIndex + 1) % this.whaleImages.length;
    }

    moveWhale() {
      if (this.cursors.left.isDown) {
        this.positionX = Math.max(this.positionX - this.movementSpeed, this.minMovementX +45);
      } else if (this.cursors.right.isDown) {
        this.positionX = Math.min(this.positionX + this.movementSpeed, this.maxMovementX -45);
      }

      if (this.cursors.up.isDown) {
        this.positionY = Math.max(this.positionY - this.movementSpeed, this.minMovementY + 60);
      } else if (this.cursors.down.isDown) {
        this.positionY = Math.min(this.positionY + this.movementSpeed, this.maxMovementY - 60);
      }

      this.whale.setPosition(this.positionX, this.positionY);
    }

    moveMeteorites() {
      this.meteoriteGroup.children.iterate((meteorite) => {
        meteorite.y += 5;
        if (meteorite.y > this.gameAreaHeight) {
          meteorite.destroy();
        }
      });
    }

    moveCoins() {
      this.coinGroup.children.iterate((coin) => {
        coin.y += 5;
        if (coin.y > this.gameAreaHeight) {
          coin.destroy();
        }
      });
    }

    generateMeteorite() {
      const randomX = Math.floor(Math.random() * this.gameAreaWidth);
      const meteorite = this.meteoriteGroup.create(randomX, -50, 'meteorite').setOrigin(0.5, 0.5);
      meteorite.setDisplaySize(90, 90);
      meteorite.body.setCircle(10); // Ajustar radio del círculo
      meteorite.body.setOffset(10, 10); // Centrar la hitbox
    }

    generateCoin() {
      const randomX = Math.floor(Math.random() * this.gameAreaWidth);
      const coin = this.coinGroup.create(randomX, -50, 'coin').setOrigin(0.5, 0.5);
      coin.setDisplaySize(50, 50);
      coin.body.setCircle(20);  // Ajustar tamaño de la moneda
    }

    checkCollision() {
      this.meteoriteGroup.children.iterate((meteorite) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.whale.getBounds(), meteorite.getBounds())) {
          this.gameOver = true;
          this.scene.restart();
        }
      });

      this.coinGroup.children.iterate((coin) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.whale.getBounds(), coin.getBounds())) {
          coin.destroy();  // Eliminar la moneda cuando la ballena la recoja
          // Aquí puedes agregar lógica para aumentar la puntuación o cualquier otro efecto
        }
      });
    }

    onCoinCollected(whale, coin) {
      coin.setPosition(Math.random() * this.gameAreaWidth, -50); // Recargar la moneda
      this.coin++; // Incrementar contador de monedas
      this.coinCounterText.setText('Coins: ' + this.coin);
    }

    handleSpacePress() {
      this.tweens.add({
        targets: this.titleText,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        onComplete: () => {
          this.titleText.setVisible(false);
        },
      });
      this.tweens.add({
        targets: this.subtitleText,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        onComplete: () => {
          this.subtitleText.setVisible(false);
        },
      });
      this.tweens.add({
        targets: this.backgroundsub,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        onComplete: () => {
          this.backgroundsub.setVisible(false);
        },
      });
      this.tweens.add({
        targets: this.footer,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        onComplete: () => {
          this.footer.setVisible(false);
        },
      });
    }

    toggleMute() {
      // Cambiar el estado de mute
      this.sound.mute = !this.sound.mute;
    }

    updateBackground() {
      this.background.tilePositionY += -1;
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 620,
    scene: WhaleGame,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
  };

  const game = new Phaser.Game(config);

  return (
    <div/>
  );
}

export default GamePage;
