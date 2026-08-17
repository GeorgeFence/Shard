import { ShardElement } from "./base-element.js";


export class ShardText extends ShardElement {

    connectedCallback() {

        super.connectedCallback();

        this.render();
        this.setupEditing();

    }


    render() {

        this.style.whiteSpace = "pre-wrap";
        this.style.overflow = "hidden";
        this.style.userSelect = "text";
        this.style.cursor = "pointer";

    }


    setupEditing() {

        this.addEventListener(
            "dblclick",
            event => {

                event.stopPropagation();

                this.enterEditMode();

            }
        );


        this.addEventListener(
            "blur",
            () => {

                this.exitEditMode();

            }
        );

    }


    enterEditMode() {

        if (
            this.contentEditable === "true"
        )
            return;


        this.contentEditable = "true";

        this.classList.add(
            "editing"
        );

        this.style.cursor = "text";


        this.focus();


        // Pokud chceš kurzor přibližně tam,
        // kam uživatel kliknul.
        const selection =
            window.getSelection();


        const range =
            document.createRange();


        range.selectNodeContents(
            this
        );


        range.collapse(false);


        selection.removeAllRanges();

        selection.addRange(
            range
        );

    }


    exitEditMode() {

        if (
            this.contentEditable !== "true"
        )
            return;


        this.contentEditable = "false";

        this.classList.remove(
            "editing"
        );

        this.style.cursor = "pointer";


        if (this.editor) {
            this.editor.document?.markDirty?.();
        }

    }


    get editableProperties() {

        return [

            {
                id: "fontFamily",
                type: "font-family",
                label: "Font",

                options: [
                    "Arial",
                    "Calibri",
                    "Courier New",
                    "Georgia",
                    "Segoe UI",
                    "Times New Roman",
                    "Verdana"
                ]
            },

            {
                id: "fontSize",
                type: "number",
                label: "Size",
                unit: "px",
                min: 1,
                max: 300,
                step: 1
            },

            {
                id: "fontWeight",
                type: "toggle",
                label: "Bold",
                enabledValue: "bold",
                disabledValue: "normal"
            },

            {
                id: "fontStyle",
                type: "toggle",
                label: "Italic",
                enabledValue: "italic",
                disabledValue: "normal"
            },

            {
                id: "textDecoration",
                type: "toggle",
                label: "Underline",
                enabledValue: "underline",
                disabledValue: "none"
            },

            {
                id: "color",
                type: "color",
                label: "Color"
            },

            {
                id: "textAlign",
                type: "alignment",
                label: "Alignment"
            }

        ];

    }

}


if (!customElements.get("shard-text")) {

    customElements.define(
        "shard-text",
        ShardText
    );

}