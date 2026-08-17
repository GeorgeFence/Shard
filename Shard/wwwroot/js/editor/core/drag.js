export class DragManager {

    constructor(editor) {
        this.editor = editor;
        this.dragging = false;
        this.element = null;
        this.handle = null;
        this.pointerId = null;
        this.startPointerX = 0;
        this.startPointerY = 0;
        this.startElementX = 0;
        this.startElementY = 0;
        this.setup();
    }

    setup() {
        const handle = document.getElementById("dragHandle");

        if (!handle)
            return;

        this.handle = handle;

        handle.addEventListener("pointerdown", this.start);
        handle.addEventListener("pointermove", this.move);
        handle.addEventListener("pointerup", this.stop);
        handle.addEventListener("pointercancel", this.stop);
    }

    start = event => {
        if (event.button !== undefined && event.button !== 0)
            return;

        const element = this.editor.selected;

        if (!element)
            return;

        event.preventDefault();
        event.stopPropagation();

        this.dragging = true;
        this.element = element;
        this.pointerId = event.pointerId;

        this.startPointerX = event.clientX;
        this.startPointerY = event.clientY;

        this.startElementX =
            parseFloat(element.getAttribute("x")) ||
            parseFloat(element.style.left) ||
            0;

        this.startElementY =
            parseFloat(element.getAttribute("y")) ||
            parseFloat(element.style.top) ||
            0;

        try {
            this.handle.setPointerCapture(event.pointerId);
        } catch { }

        this.handle.style.cursor = "grabbing";
    };

    move = event => {
        if (
            !this.dragging ||
            !this.element ||
            event.pointerId !== this.pointerId
        )
            return;

        event.preventDefault();
        event.stopPropagation();

        const dx =
            event.clientX -
            this.startPointerX;

        const dy =
            event.clientY -
            this.startPointerY;

        const x =
            this.startElementX +
            dx;

        const y =
            this.startElementY +
            dy;

        this.element.setAttribute(
            "x",
            Math.round(x)
        );

        this.element.setAttribute(
            "y",
            Math.round(y)
        );

        this.element.style.left =
            `${x}px`;

        this.element.style.top =
            `${y}px`;

        if (
            typeof this.element.applyPosition ===
            "function"
        ) {
            this.element.applyPosition();
        }

        this.editor.selection.update();
    };

    stop = event => {
        if (
            !this.dragging ||
            event.pointerId !== this.pointerId
        )
            return;

        event.preventDefault();
        event.stopPropagation();

        this.dragging = false;

        if (
            this.handle &&
            this.pointerId !== null
        ) {
            try {
                this.handle.releasePointerCapture(
                    this.pointerId
                );
            } catch { }
        }

        if (this.handle)
            this.handle.style.cursor = "grab";

        this.element = null;
        this.pointerId = null;

        this.editor.selection.update();
        this.editor.sendState();
    };

}