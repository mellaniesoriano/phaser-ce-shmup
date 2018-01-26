(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const SQRT_TWO = Math.sqrt(2);
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 100;
  const randomGenerator = new Phaser.RandomDataGenerator();
  const ENEMY_SPEED = 3.5;
  const ENEMY_FIRE_FREQ = 30;
  const ENEMY_BULLET_ACCEL = 100;

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
  let enemies;
  let enemyBullets;

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

    player = game.add.sprite(200, 400, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
  }

  function update() {
    handlePlayerMovement();
    handleBulletAnimations();
    randomlySpawnEnemy();
    handleEnemyActions();
    handleCollisions();

    cleanup();
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
    playerBullets.add(game.add.sprite(player.x, player.y, GFX, 7));
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => (bullet.y -= PLAYER_BULLET_SPEED));
    enemyBullets.children.forEach(bullet => {
      game.physics.arcade.accelerateToObject(
        bullet,
        player,
        ENEMY_BULLET_ACCEL
      );
    });
  }

  function handleEnemyActions() {
    enemies.children.forEach(enemy => (enemy.y += ENEMY_SPEED));
    enemies.children.forEach(enemy => randomEnemyFire(enemy));
  }

  function handleCollisions() {
    // check if any bullets touch any enemies
    let enemiesHit = enemies.children
      .filter(enemy => enemy.alive)
      .filter(enemy =>
        playerBullets.children.some(bullet => enemy.overlap(bullet))
      );

    if (enemiesHit.length) {
      // clean up bullets that land
      playerBullets.children
        .filter(bullet => bullet.overlap(enemies))
        .forEach(removeBullet);

      enemiesHit.forEach(destroyEnemy);
    }
    // check if enemies hit the player
    enemiesHit = enemies.children.filter(enemy => enemy.overlap(player));

    if (enemiesHit.length) {
      handlePlayerHit();

      enemiesHit.forEach(destroyEnemy);
    }
  }

  function handlePlayerHit() {
    gameOver();
  }

  function randomlySpawnEnemy() {
    if (randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add(game.add.sprite(randomX, -24, GFX, 0));
    }
  }

  function randomEnemyFire(enemy) {
    if (randomGenerator.between(0, ENEMY_FIRE_FREQ) === 0) {
      let enemyBullet = game.add.sprite(enemy.x, enemy.y, GFX, 9);
      enemyBullet.checkWorldBounds = true;
      enemyBullet.outOfBoundsKill = true;
      enemyBullets.add(enemyBullet);
    }
  }

  // utility functions
  function cleanup() {
    playerBullets.children
      // if y < 0 means if bullet is offscreen
      .filter(bullet => bullet.y < 0)
      // destroy if bullet is offscreen
      .forEach(bullet => bullet.destroy());
    enemies.children
      .filter(enemy => enemy.y > GAME_HEIGHT || !enemy.alive)
      .forEach(enemy => enemy.destroy());
    enemyBullets.children
      .filter(bullet => !bullet.alive)
      .forEach(bullet => bullet.destroy());
  }

  function removeBullet(bullet) {
    bullet.destroy();
  }

  function destroyEnemy(enemy) {
    enemy.kill();
  }

  function gameOver() {
    game.state.destroy();
    game.add.text(90, 200, 'BOOM! YOU DEAD! x_X', { fill: '#FFFFFF' });
    let playAgain = game.add.text(120, 300, 'Play Again', { fill: '#ffffff' });
    playAgain.inputEnabled = true;
    playAgain.events.onInputUp.add(() => window.location.reload());
  }
})(window.Phaser);
