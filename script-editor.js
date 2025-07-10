export class ScriptEditor extends FormApplication {
  constructor(item) { super(item, {}); this.item = item; }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "item-script-editor",
      title: "Script do Item",
      template: "modules/item-script-para-tormenta-20/templates/script-editor.html",
      width: 600
    });
  }

  getData() {
    return {
      script: getProperty(this.item, "flags.item-script-para-tormenta-20.script") || ""
    };
  }

  async _updateObject(_, formData) {
    await this.item.setFlag("item-script-para-tormenta-20", "script", formData.script);
    ui.notifications.info("Script salvo.");
  }
}