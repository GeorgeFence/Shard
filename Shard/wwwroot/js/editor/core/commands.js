export class EditorCommands {

    constructor(editor) {
        this.editor = editor;
    }

    handle(command, value) {

        switch (command) {

            case "setStyle":
                this.setStyle(value);
                break;

            case "toggleStyle":
                this.toggleStyle(value);
                break;

            case "alignLeft":
                this.setStyle({
                    property: "textAlign",
                    value: "left"
                });
                break;

            case "alignCenter":
                this.setStyle({
                    property: "textAlign",
                    value: "center"
                });
                break;

            case "alignRight":
                this.setStyle({
                    property: "textAlign",
                    value: "right"
                });
                break;

            case "undo":
                document.execCommand("undo");
                break;

            case "redo":
                document.execCommand("redo");
                break;

            case "delete":
                this.delete();
                break;

            case "duplicate":
                this.duplicate();
                break;

            case "insert":
                this.insert(value);
                break;

            case "bringForward":
                this.bringForward();
                break;

            case "sendBackward":
                this.sendBackward();
                break;

            case "addPage":
                this.openPageManager("add");
                break;

            case "duplicatePage":
                this.openPageManager("duplicate");
                break;

            case "deletePage":
                this.openPageManager("delete");
                break;

            case "previousPage":
                this.previousPage();
                break;

            case "nextPage":
                this.nextPage();
                break;

            case "pageSettings":
                this.pageSettings(value);
                break;

            case "save":
                this.editor.document.save();
                break;

            default:
                console.warn(
                    "Unknown editor command:",
                    command
                );
        }
    }

    setStyle(value) {

        const element =
            this.editor.selected;

        if (
            !element ||
            !value ||
            !value.property
        )
            return;

        element.style[value.property] =
            value.value;

        this.editor.selection.update();

        this.editor.quickStyle.show(
            element
        );

        this.editor.sendState();
    }

    toggleStyle(value) {

        const element =
            this.editor.selected;

        if (
            !element ||
            !value
        )
            return;

        const current =
            getComputedStyle(
                element
            )[value.property];

        element.style[value.property] =
            current === value.enabledValue
                ? value.disabledValue
                : value.enabledValue;

        this.editor.selection.update();

        this.editor.quickStyle.show(
            element
        );

        this.editor.sendState();
    }

    delete() {

        const element =
            this.editor.selected;

        if (!element)
            return;

        if (
            this.editor.isEditingText &&
            typeof this.editor.exitTextEdit ===
            "function"
        ) {
            this.editor.exitTextEdit();
        }

        element.remove();

        this.editor.deselect();
    }

    duplicate() {

        const element =
            this.editor.selected;

        if (!element)
            return;

        const clone =
            element.cloneNode(true);

        const x =
            parseFloat(
                element.getAttribute("x")
            ) || 0;

        const y =
            parseFloat(
                element.getAttribute("y")
            ) || 0;

        clone.setAttribute(
            "x",
            x + 20
        );

        clone.setAttribute(
            "y",
            y + 20
        );

        if (
            typeof clone.applyPosition ===
            "function"
        ) {
            clone.applyPosition();
        }

        element.parentElement.appendChild(
            clone
        );

        this.editor.selection.refresh();

        this.editor.select(
            clone
        );
    }

    insert(type) {

        const page =
            this.editor.pages.current;

        if (!page) {

            console.warn(
                "Cannot insert element: no active page."
            );

            return;
        }

        let element;

        switch (type) {

            case "text":

                element =
                    document.createElement(
                        "shard-text"
                    );

                element.textContent =
                    "New text";

                element.style.fontSize =
                    "24px";

                break;

            case "image":

                element =
                    document.createElement(
                        "shard-image"
                    );

                break;

            case "table":

                element =
                    document.createElement(
                        "shard-table"
                    );

                break;

            case "shape":

                element =
                    document.createElement(
                        "shard-shape"
                    );

                break;

            case "drawing":

                element =
                    document.createElement(
                        "shard-drawing"
                    );

                break;

            default:

                console.warn(
                    "Unknown insert type:",
                    type
                );

                return;
        }

        element.setAttribute(
            "x",
            "100"
        );

        element.setAttribute(
            "y",
            "100"
        );

        element.setAttribute(
            "width",
            "300"
        );

        element.setAttribute(
            "height",
            "100"
        );

        page.appendChild(
            element
        );

        this.editor.selection.refresh();

        this.editor.select(
            element
        );
    }

    bringForward() {

        const element =
            this.editor.selected;

        if (!element)
            return;

        const next =
            element.nextElementSibling;

        if (next) {

            element.parentElement
                .insertBefore(
                    next,
                    element
                );
        }

        this.editor.selection.update();
    }

    sendBackward() {

        const element =
            this.editor.selected;

        if (!element)
            return;

        const previous =
            element.previousElementSibling;

        if (previous) {

            element.parentElement
                .insertBefore(
                    element,
                    previous
                );
        }

        this.editor.selection.update();
    }

    openPageManager(action = null) {

        const pages =
            this.editor.pages;

        if (!pages) {

            console.warn(
                "PageManager is not available."
            );

            return;
        }

        if (
            typeof pages.openManager !==
            "function"
        ) {

            console.warn(
                "PageManager.openManager() is not implemented."
            );

            return;
        }

        pages.openManager(
            action
        );
    }

    previousPage() {

        const pages =
            this.editor.pages;

        if (!pages)
            return;

        pages.previous();
    }

    nextPage() {

        const pages =
            this.editor.pages;

        if (!pages)
            return;

        pages.next();
    }

    pageSettings(value) {

        const pages =
            this.editor.pages;

        if (!pages)
            return;

        if (
            typeof pages.settings ===
            "function"
        ) {

            pages.settings(
                value
            );

            return;
        }

        console.warn(
            "Page settings are not implemented yet.",
            value
        );
    }
}