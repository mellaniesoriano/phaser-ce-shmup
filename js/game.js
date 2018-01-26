(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const SQRT_TWO = Math.sqrt(2);

  const game = new Phaser.Game(
    GAME_WIDTH,
    GAME_HEIGHT,
    Phaser.AUTO,
    GAME_CONTAINER_ID, // binds  to html element (DOM)
    { preload, create, update }
  );

  // global variables
  let player;
  let cursors;
  let playerBullets;

  function preload() {
    game.load.spritesheet(
      GFX,
      '../assets/shmup-spritesheet-140x56-28x28-tile.png',
      28,
      28
    );
  }

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    player = game.add.sprite(100, 100, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
  }

  function update() {
    handlePlayerMovement();
  }

  // handler methods
  function handlePlayerMovement() {
    let movingH = Math.sqrt(2);
    let movingV = Math.sqrt(2);
    if (cursors.up.isDown || cursors.down.isDown) {
      movingH = 1; // slow down diagonal movement
    }
    if (cursors.left.isDown || cursors.right.isDown) {
      movingV = 1; // slow down diagonal movement
    }

    switch (true) {
      case cursors.left.isDown:
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch (true) {
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
    }
  }

  function handlePlayerFire() {
    console.log('fire');
  }
})(window.Phaser);
