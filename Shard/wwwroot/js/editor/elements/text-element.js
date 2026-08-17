import { ShardElement } from "element.js";


export class ShardTextElement extends ShardElement {

    constructor(element) {

        super(element);


        this.capabilities = {

            editable: true,

            textFormatting: true,

            fontFamily: true,

            fontSize: true,

            bold: true,

            italic: true,

            underline: true,

            color: true,

            alignment: true,

            resizable: true,

            movable: true,

            deletable: true,

            duplicatable: true

        };


        this.savedSelection = null;


        this.setup();

    }


    setup() {

        this.element.classList.add("view");


        /*
         * Single click = select object
         */
        this.element.addEventListener(
            "mousedown",
            event => {

                event.stopPropagation();

                window.shardEditor.select(
                    this
                );

            }
        );


        /*
         * Double click = text editing
         */
        this.element.addEventListener(
            "dblclick",
            event => {

                event.stopPropagation();

                this.enterEditMode();

            }
        );


        /*
         * Keep selection alive.
         */
        document.addEventListener(
            "selectionchange",
            () => {

                if (
                    this.mode !== "edit"
                )
                    return;

                const selection =
                    window.getSelection();

                if (
                    !selection ||
                    selection.rangeCount === 0
                )
                    return;

                if (
                    !this.element.contains(
                        selection.anchorNode
                    )
                )
                    return;

                this.savedSelection =
                    selection.getRangeAt(0).cloneRange();

                window.shardEditor
                    .sendState();

            }
        );


        /*
         * Clicking outside text exits edit mode.
         */
        this.element.addEventListener(
            "blur",
            () => {

                if (
                    this.mode === "edit"
                ) {

                    this.exitEditMode();

                }

            },
            true
        );

    }


    enterEditMode() {

        if (this.mode === "edit")
            return;


        super.enterEditMode();


        this.element.contentEditable =
            "true";


        this.element.focus();


        /*
         * Put caret where the user double-clicked.
         */
        const selection =
            window.getSelection();

        if (
            selection &&
            selection.rangeCount > 0
        ) {

            this.savedSelection =
                selection
                    .getRangeAt(0)
                    .cloneRange();

        }


        window.shardEditor
            .sendState();

    }


    exitEditMode() {

        if (this.mode !== "edit")
            return;


        this.saveSelection();


        this.element.contentEditable =
            "false";


        super.exitEditMode();


        window.shardEditor
            .sendState();

    }


    saveSelection() {

        const selection =
            window.getSelection();


        if (
            !selection ||
            selection.rangeCount === 0
        )
            return;


        if (
            !this.element.contains(
                selection.anchorNode
            )
        )
            return;


        this.savedSelection =
            selection
                .getRangeAt(0)
                .cloneRange();

    }


    restoreSelection() {

        if (!this.savedSelection)
            return;


        const selection =
            window.getSelection();


        selection.removeAllRanges();


        selection.addRange(
            this.savedSelection
        );

    }


    /*
     * Apply formatting to selected text.
     */
    applyTextCommand(command, value = null) {

        if (this.mode !== "edit")
            this.enterEditMode();


        this.restoreSelection();


        switch (command) {

            case "bold":

                document.execCommand(
                    "bold"
                );

                break;


            case "italic":

                document.execCommand(
                    "italic"
                );

                break;


            case "underline":

                document.execCommand(
                    "underline"
                );

                break;


            case "foreColor":

                document.execCommand(
                    "foreColor",
                    false,
                    value
                );

                break;


            case "fontName":

                document.execCommand(
                    "fontName",
                    false,
                    value
                );

                break;


            case "fontSize":

                /*
                 * execCommand fontSize uses
                 * HTML sizes 1-7, so we handle
                 * CSS manually below.
                 */
                this.applyCssToSelection(
                    "fontSize",
                    value
                );

                break;


            case "justifyLeft":

                document.execCommand(
                    "justifyLeft"
                );

                break;


            case "justifyCenter":

                document.execCommand(
                    "justifyCenter"
                );

                break;


            case "justifyRight":

                document.execCommand(
                    "justifyRight"
                );

                break;

        }


        this.saveSelection();

        window.shardEditor
            .sendState();

    }


    /*
     * Applies CSS to selected Range.
     *
     * This is what lets us do:
     *
     * Hello [world] !!!
     *
     * only "world" gets the style.
     */
    applyCssToSelection(
        property,
        value
    ) {

        this.restoreSelection();


        const selection =
            window.getSelection();


        if (
            !selection ||
            selection.rangeCount === 0
        )
            return;


        const range =
            selection.getRangeAt(0);


        if (
            !this.element.contains(
                range.commonAncestorContainer
            )
        )
            return;


        /*
         * No selection -> apply to whole element.
         */
        if (range.collapsed) {

            this.element.style[property] =
                value;

            return;

        }


        const span =
            document.createElement("span");


        span.style[property] =
            value;


        try {

            range.surroundContents(
                span
            );

        }
        catch {

            /*
             * Selection crossed multiple
             * existing elements.
             *
             * Fallback to execCommand.
             */
            document.execCommand(
                "fontSize",
                false,
                "7"
            );


            const elements =
                this.element.querySelectorAll(
                    'font[size="7"]'
                );


            elements.forEach(element => {

                element.removeAttribute(
                    "size"
                );

                element.style[property] =
                    value;

            });

        }


        this.saveSelection();

    }


    getTextState() {

        const selection =
            window.getSelection();


        if (
            this.mode !== "edit" ||
            !selection ||
            selection.rangeCount === 0
        ) {

            return {

                bold: false,
                italic: false,
                underline: false

            };

        }


        return {

            bold:
                document.queryCommandState(
                    "bold"
                ),

            italic:
                document.queryCommandState(
                    "italic"
                ),

            underline:
                document.queryCommandState(
                    "underline"
                )

        };

    }


    getState() {

        return {

            ...super.getState(),

            text:
                this.getTextState(),

            fontFamily:
                getComputedStyle(
                    this.element
                ).fontFamily,

            fontSize:
                getComputedStyle(
                    this.element
                ).fontSize,

            color:
                getComputedStyle(
                    this.element
                ).color,

            textAlign:
                getComputedStyle(
                    this.element
                ).textAlign

        };

    }

}