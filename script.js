const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

const plataformas = [
    { x: 0, y: 580, width: 500, height: 20 },
    { x: 0, y: 450, width: 150, height: 20 },
    { x: 420, y: 320, width: -300, height: 20 }, // Corrigi o valor negativo da largura
];

const playerData = {
    vida: 100,
    x: 0,
    y: 530,
    width: 50,
    height: 50,
    isJump: false,
};

const enemy = {
    vida: 100,
    x: 0,
    y: 0,
    width: 50,
    height: 50,
};

class Game {
    constructor() {}

    desenharGame() {
        CTX.fillStyle = '#78b0ec';
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    }

    desenharPlataformas() {
        for (let i = 0; i < plataformas.length; i++) {
            const plataforma = new Plataforma(plataformas[i].x, plataformas[i].y, plataformas[i].width, plataformas[i].height);
            plataforma.DesenharPlataforma();
        }
    }
}

class Player {
    constructor() {
        this.x = 0;
        this.y = 570;
        this.width = 40;
        this.height = 60;
        this.isJump = false;
        this.speedY = 0;
        this.gravity = 0.8;
        this.speedX = 5; // Adicionei velocidade horizontal
    }

    DesenharPlayer() {
        CTX.fillStyle = 'red';
        CTX.fillRect(this.x, this.y, this.width, this.height);
    }

    Pulo() {
        if (!this.isJump) {
            this.speedY = -15; // Força do pulo
            this.isJump = true;
        }
    }

    MoverPlayer(direction) {
        if (direction === 'ArrowRight') {
            this.x += this.speedX;
        } else if (direction === 'ArrowLeft') {
            this.x -= this.speedX;
        }
    }

    LimitarMovimento(){
        if(this.x < 0){
            this.x = 0;
        } else if(this.x > 460){
            this.x = 460;
        }
    }

    verificarColisaoPlataformas() {
        for (let i = 0; i < plataformas.length; i++) {
            const plataforma = plataformas[i];

            // Verifica se o jogador está acima da plataforma e caindo
            if (
                this.y + this.height > plataforma.y && // Jogador está acima da plataforma
                this.y + this.height <= plataforma.y + 20 && // Jogador está caindo em direção à plataforma
                this.x + this.width > plataforma.x && // Jogador está dentro dos limites horizontais da plataforma
                this.x < plataforma.x + plataforma.width
            ) {
                // Ajusta a posição do jogador para ficar em cima da plataforma
                this.y = plataforma.y - this.height;
                this.speedY = 0; // Para de cair
                this.isJump = false; // Permite pular novamente
            }
        }
    }

    update() {
        // Aplica gravidade
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.verificarColisaoPlataformas();
        this.LimitarMovimento();
        // Verifica colisão com o chão (simulação)
        if (this.y + this.height > 550) {
            this.y = 550 - this.height;
            this.speedY = 0;
            this.isJump = false;
        }
    }
}

class Plataforma {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    DesenharPlataforma() {
        CTX.fillStyle = 'black';
        CTX.fillRect(this.x, this.y, this.width, this.height);
    }
}

const game = new Game();
const player = new Player();

function gameLoop() {
    game.desenharGame();
    game.desenharPlataformas();
    player.update(); // Atualiza a posição do jogador
    player.DesenharPlayer();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', () => {
    gameLoop(); 
});

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        player.Pulo(); // Chama o método de pulo
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        player.MoverPlayer(event.key); // Chama o método de movimento
    }
});