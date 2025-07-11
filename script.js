import { ScriptEditor } from "./script-editor.js";

export const itemScriptT20 = {
  ID: "item-script-para-tormenta-20"
};


Hooks.on("renderItemSheet", (sheet, html) => {
  const btn = $(`<a class="script-btn"><i class="fas fa-terminal"></i> Script</a>`);
  btn.click(() => new ScriptEditor(sheet.item).render(true));
  html.find(".window-header .window-title").after(btn);
});

Hooks.once("init", () => {
  // Garante que o escopo do módulo é aceito para uso de flags
  const allowedScopes = foundry.data.DocumentMetadata.FILTER_KEYS.flags ?? [];
  if (!allowedScopes.includes(itemScriptT20.ID)) {
    foundry.data.DocumentMetadata.FILTER_KEYS.flags = [...allowedScopes, itemScriptT20.ID];
  }
});



Hooks.once("ready", () => {
  // Verifica se a classe ItemT20 existe e tem o método roll
  const ItemT20 = CONFIG.Item.documentClass;
  if (ItemT20?.prototype?.roll) {
    // Expõe ItemT20 no escopo global para o libWrapper encontrar
    window.ItemT20 = ItemT20;
    libWrapper.register(
      "item-script-para-tormenta-20",
      "ItemT20.prototype.roll",
      async function (wrapped, ...args) {
        const result = await wrapped(...args);
        await runItemScript(this);
        return result;
      },
      "WRAPPER"
    );
  }
});

async function runItemScript(item) {
  const script = getProperty(item, "flags.item-script-para-tormenta-20.script");
  if (script) {
    try {
      const actor = item.actor;
      const token = actor?.getActiveTokens()[0];
      const speaker = ChatMessage.getSpeaker({ actor, token });
      const fn = new Function("actor", "item", "token", "speaker", "ChatMessage", "canvas", "game", "ui", `"use strict";(async()=>{${script}})();`);
      await fn(actor, item, token, speaker, ChatMessage, canvas, game, ui);
    } catch (err) {
      console.error("Erro executing script:", err);
      ui.notifications.error("Erro no script do item (veja console).");
    }
  }
}