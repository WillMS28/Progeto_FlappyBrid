

const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const som_hit = new Audio()
som_hit.src = './efeitos/hit.wav'

const som_pulo = new Audio()
som_pulo.src = './efeitos/pulo.wav'

let frames = 0

// Plano de Fundo
const background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    posX: 0,
    posY: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            background.spriteX, background.spriteY, // sprite x, sprite y
            background.largura, background.altura, // Tamanho do recorte no sprite  
            background.posX, background.posY,  // local onde o sprite vai estar no canvas 
            background.largura, background.altura  // tamanho do sprite dentro do canvas 
        )
        contexto.drawImage(
            sprites,
            background.spriteX, background.spriteY, // sprite x, sprite y
            background.largura, background.altura, // Tamanho do recorte no sprite  
            background.posX + background.largura, background.posY,  // local onde o sprite vai estar no canvas 
            background.largura, background.altura  // tamanho do sprite dentro do canvas 
        )
    }
}

// Chão
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        posX: 0,
        posY: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1
            const repeteEM = chao.largura / 2
            const movimentacao = chao.posX - movimentoDoChao

            chao.posX = movimentacao % repeteEM
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, // sprite x, sprite y
                chao.largura, chao.altura, // Tamanho do recorte no sprite  
                chao.posX, chao.posY,  // local onde o sprite vai estar no canvas 
                chao.largura, chao.altura  // tamanho do sprite dentro do canvas 
            )
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, // sprite x, sprite y
                chao.largura, chao.altura, // Tamanho do recorte no sprite  
                chao.posX + chao.largura, chao.posY,  // local onde o sprite vai estar no canvas 
                chao.largura, chao.altura  // tamanho do sprite dentro do canvas 
            )
        }
    }
    return chao
}

// Funções
function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.posY + flappyBird.altura
    const chaoY = chao.posY

    if (flappyBirdY >= chaoY) {
        return true
    }

    return false
}

// Personagem FlappyBird
function criarFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        posX: 10,
        posY: 50,
        gravidade: 0.25,
        aceleracao: 0,
        pulo: 4.6,
        atualiza() {
    
            if (fazColisao(flappyBird, globais.chao)) {
                console.log('bateu')
                
                som_hit.play()

                setTimeout(() => {
                    mudaTela(telas.inicio)
                }, 500)
                return
            }
    
    
            flappyBird.aceleracao = flappyBird.aceleracao + flappyBird.gravidade
            flappyBird.posY = flappyBird.posY + flappyBird.aceleracao
        },
        movimentos: [
            { spriteX: 0, spriteY: 0}, // asa para cima
            { spriteX: 0, spriteY: 26}, // asa no meio
            { spriteX: 0, spriteY: 52}, // asa para baixo
            { spriteX: 0, spriteY: 26} // asa no meio
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloDeFrames = 10
            const passouOIntervalo = frames % intervaloDeFrames === 0

            if(passouOIntervalo) {

                const baseDoIncremento = 1
                const incremento = baseDoIncremento + flappyBird.frameAtual
                const baseRepeticao = flappyBird.movimentos.length
    
                flappyBird.frameAtual = incremento % baseRepeticao
            }
        },
        desenha() {
            flappyBird.atualizaFrameAtual()
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
            contexto.drawImage( 
    
                sprites,
                spriteX, spriteY, // sprite x, sprite y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte no sprite  
                flappyBird.posX, flappyBird.posY,  // local onde o sprite vai estar no canvas 
                flappyBird.largura, flappyBird.altura  // tamanho do sprite dentro do canvas 
    
            )
    
        },
        pula() {
            
            //som_pulo.play()
            flappyBird.aceleracao = -flappyBird.pulo
        }
        
    }
    return flappyBird;
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169
        },
        espaço: 80,
        desenha() {
            
            canos.pares.forEach(function(par) {
                
                const yRandom = par.y
                const espacamentoEntreCanos = 80
    
                const canoCeuX = par.x
                const canoCeuY = yRandom
                
                // Cano do Céu    
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
    
                const canoChaoX = par.x
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom
                
                // Cano do Chão    
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

            })
            
        },
        pares: [],
        atualiza()  {
            const passou100frames = frames % 100 === 0
            if(passou100frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -140 * (Math.random() + 1)
                })

            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2
            })

        }

    }
    return canos
}

//
// Telas
//


// Tela de inicio 
const StartGame = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    posX: (canvas.width/2) - 174 /2,
    posY: 50,
    desenha() {
        contexto.drawImage( 

            sprites,
            StartGame.spriteX, StartGame.spriteY, // sprite x, sprite y
            StartGame.largura, StartGame.altura, // Tamanho do recorte no sprite  
            StartGame.posX, StartGame.posY,  // local onde o sprite vai estar no canvas 
            StartGame.largura, StartGame.altura  // tamanho do sprite dentro do canvas 

        )
    }
}

const globais = {}
let telaAtiva = {}

function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializar) {
        telaAtiva.inicializar()
    }
}

const telas = {
    inicio: {
        inicializar() {
            globais.flappyBird = criarFlappyBird()
            globais.chao = criaChao()
            globais.canos = criaCanos()

        },
        desenha() {
            background.desenha()
            globais.chao.desenha()
            globais.flappyBird.desenha()

            globais.canos.desenha()
            //StartGame.desenha()
        },

        click() {
             mudaTela(telas.jogo) 
        },

        atualiza() {
            globais.chao.atualiza()
            globais.canos.atualiza()
        }
    },

    jogo: {
        desenha() {
            background.desenha(),
            globais.chao.desenha(),
            globais.flappyBird.desenha()
        },
        click() {
            globais.flappyBird.pula() 
        },
        atualiza() {
            globais.flappyBird.atualiza()
            globais.chao.atualiza()
        }
    }
}



function loop() {
    
    telaAtiva.desenha()
    telaAtiva.atualiza()
    
    frames = frames +1

    requestAnimationFrame(loop)
}


window.addEventListener('click', () => {
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaTela(telas.inicio)
loop()

