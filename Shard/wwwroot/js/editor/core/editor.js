import "./../elements/index.js";

import { SelectionManager } from "./selection.js";
import { ResizeManager } from "./resize.js";
import { QuickStyle } from "./quick-style.js";
import { EditorCommands } from "./commands.js";
import { DocumentManager } from "./document.js";
import { PageManager } from "./page.js";
import { DragManager } from "./drag.js";

export class ShardEditor {

    constructor() {

        this.viewer =
            document.getElementById(
                "viewer"
            );

        this.container =
            document.getElementById(
                "documentContainer"
            );


        this.selectedElement =
            null;


        this.selection =
            new SelectionManager(
                this
            );


        this.resize =
            new ResizeManager(
                this
            );


        this.quickStyle =
            new QuickStyle(
                this
            );


        this.commands =
            new EditorCommands(
                this
            );


        this.document =
            new DocumentManager(
                this
            );


        this.pages =
            new PageManager(
                this
            );

        this.drag =
            new DragManager(this);

        this.initialize();

    }


    initialize() {

        this.setupGlobalEvents();

        this.document.load();

        this.pages.refresh();

        this.sendReady();

    }


    setupGlobalEvents() {

        document.addEventListener(
            "mousedown",
            event => {

                if (
                    event.target.closest(
                        "#selectionBox"
                    )
                )
                    return;


                if (
                    event.target.closest(
                        "#quickStyle"
                    )
                )
                    return;


                const element =
                    event.target.closest(
                        [
                            "shard-text",
                            "shard-image",
                            "shard-table",
                            "shard-shape",
                            "shard-drawing"
                        ].join(",")
                    );


                if (element) {

                    event.stopPropagation();

                    this.select(
                        element
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "shard-page"
                    )
                )
                    return;


                this.deselect();

            }
        );


        if (this.viewer) {

            this.viewer.addEventListener(
                "scroll",
                () => {

                    this.selection.update();

                }
            );

        }


        window.addEventListener(
            "resize",
            () => {

                this.selection.update();

            }
        );


        window.addEventListener(
            "message",
            event => {

                const data =
                    event.data;


                if (!data)
                    return;


                if (
                    data.type ===
                    "shard-editor-command"
                ) {

                    console.log(
                        "Editor command:",
                        data.command,
                        data.value
                    );


                    this.commands.handle(
                        data.command,
                        data.value
                    );

                    return;

                }


                if (
                    data.type ===
                    "shard-ribbon-ready"
                ) {

                    this.sendReady();

                    this.sendState();

                    this.pages.sendState();

                    return;

                }

            }
        );

    }


    select(element) {

        if (!element)
            return;


        if (
            this.selectedElement ===
            element
        ) {

            this.selection.update();

            this.quickStyle.show(
                element
            );

            this.sendState();

            return;

        }


        this.selectedElement =
            element;


        this.selection.select(
            element
        );


        this.quickStyle.show(
            element
        );


        this.sendState();

    }


    deselect() {

        this.selectedElement =
            null;


        this.selection.deselect();

        this.quickStyle.hide();

    }


    get selected() {

        return this.selectedElement;

    }


    get currentPage() {

        if (!this.pages)
            return null;

        return this.pages.current;

    }


    sendState() {

        const element =
            this.selectedElement;


        if (!element) {

            window.parent.postMessage({

                type:
                    "shard-editor-state",

                selected:
                    false

            }, "*");

            return;

        }


        const style =
            getComputedStyle(
                element
            );


        window.parent.postMessage({

            type:
                "shard-editor-state",

            selected:
                true,

            tagName:
                element.tagName
                    .toLowerCase(),

            fontFamily:
                style.fontFamily,

            fontSize:
                style.fontSize,

            fontWeight:
                style.fontWeight,

            fontStyle:
                style.fontStyle,

            textDecoration:
                style.textDecoration,

            textAlign:
                style.textAlign,

            color:
                style.color

        }, "*");

    }


    sendReady() {

        window.parent.postMessage({

            type:
                "shard-editor-ready"

        }, "*");


        if (this.pages) {

            this.pages.sendState();

        }

    }

}


/*
 * Entry point
 */

new ShardEditor();