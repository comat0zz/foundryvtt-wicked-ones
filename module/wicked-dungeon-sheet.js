
import { WickedSheet } from "./wicked-sheet.js";

/**
 * @extends {WickedSheet}
 */
export class WickedDungeonSheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
          template: "systems/wicked-ones/templates/dungeon-sheet.html",
      width: 600,
      height: 850,
      tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "rooms"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    const sheetData = await super.getData(options);
    sheetData.editable = this.options.editable;

    sheetData.actor = sheetData.data;
    sheetData.system = sheetData.document.system // project system data so that handlebars has the same name and value paths
    sheetData.notes = await TextEditor.enrichHTML(this.object.system.description, { async: true });

		// Add flexibility flag on mismatched theme
    let theme = "";
    sheetData.items.forEach(e => {
      if (e.type == "dungeon_theme") {
        theme = e.name;
      }
    });

    sheetData.items.forEach(e => {
      if (e.type == "tier3room" && e.system.theme != theme) {
        e.flexibility = true;
      }
      else {
        e.flexibility = false;
      }
    });

    // Override Code for updating the sheet goes here

    return sheetData;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-open-editor').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const item = this.document.items.get(element.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      this.document.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
      element.slideUp(200, () => this.render(false));
    });

  }

  /* -------------------------------------------- */
  /*  Form Submission  (Check relevance)          */
	/* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {

    // Update the Item
    super._updateObject(event, formData);

    if (event.target && event.target.name === "data.tier") {
      this.render(true);
    }
  }
  /* -------------------------------------------- */

}
