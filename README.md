# Item Script para Tormenta 20

Permite executar um script personalizado automaticamente ao usar qualquer item no Foundry VTT.

## Funcionalidades

- Adiciona botão "Script" no topo da janela de interface dos itens.
- Executa o script definido sempre que o item for usado. Exemplos de scripts uteis são: ligar a outros módulos que não tem compatibilidade direta com o Tormenta 20, controlar CD de Engenhocas e outros recursos que são baseados em numero de usos (tipo as cargas do magimarcialista).
- Consegue interagir com propriedades do item que está ligado (como obter o nome ou circulo da magia).

## Como usar

1. Edite um item qualquer.
2. Clique no botão `Script` no topo da ficha.
3. Digite o script que deseja executar.
4. Salve e use o item normalmente.

Exemplo de script dentro de uma engenhoca para controlar sua CD de ativação:

```js
const SCOPE = "my-macros";
const ENGENHOCA = item.name;
const CIRCULO = Number(item.system?.circulo) || 1;
const CIRCULO_BONUS = [0, 1, 3, 6, 10, 15][CIRCULO] || 1;
const KEY = `cd_${ENGENHOCA.toLowerCase().replace(/\s+/g, "_")}`;

// Sempre registra novamente com default correto
game.settings.register(SCOPE, KEY, {
  name: `CD da Engenhoca: ${ENGENHOCA}`,
  scope: "world",
  config: false,
  type: Number,
  default: 15 + CIRCULO_BONUS
});

// Atualiza valor
let valor = game.settings.get(SCOPE, KEY);
valor += 5;
await game.settings.set(SCOPE, KEY, valor);

// Mensagem
ChatMessage.create({
  content: `<b>CD atual de ${ENGENHOCA}:</b> ${valor - 5} (Círculo: ${CIRCULO})`,
  speaker: ChatMessage.getSpeaker()
});
```
Assim toda vez que for conjurado, vai aparecer sua CD atual, basta somar os PMs extras de aprimoramentos.

O módulo inclui um compêndio com macros para controle de Engenhocas.

## info

Desenvolvido por Haydgi
Discord: xdhayd

