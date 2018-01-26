(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';

  const game = new Phaser.Game(
    GAME_WIDTH,
    GAME_HEIGHT,
    Phaser.AUTO,
    GAME_CONTAINER_ID, // binds  to html element (DOM)
    { preload, create, update }
  );

  let player;

  function preload() {
    game.load.spritesheet(
      GFX,
      '../assets/shmup-spritesheet-140x56-28x28-tile.png',
      28,
      28
    );
  }

  function create() {
    game.add.sprite(100, 100, GFX, 8);
  }

  function update() {}
})(window.Phaser);
