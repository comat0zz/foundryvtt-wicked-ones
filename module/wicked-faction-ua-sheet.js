
import { WickedSheet } from "./wicked-sheet.js";

/**
 * @extends {WickedSheet}
 */
export class WickedFactionUASheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
          template: "systems/wicked-ones/templates/faction-ua-sheet.html",
      width: 400,
      height: 500,
      tabs: []
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
		
    // Override Code for updating the sheet goes here

    return sheetData;
  }


  /* -------------------------------------------- */

   /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

  }

  /* -------------------------------------------- */
  /*  Form Submission                             */
	/* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {

    // Update the Item
    super._updateObject(event, formData);

    // Update the Actor
    return this.object.update(formData);
  }

  /* -------------------------------------------- */

}
