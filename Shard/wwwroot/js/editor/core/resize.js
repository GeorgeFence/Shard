export class ResizeManager {

    constructor(editor) {

        this.editor = editor;

        this.resizing = false;
        this.direction = null;
        this.pointerId = null;

        this.startX = 0;
        this.startY = 0;

        this.startLeft = 0;
        this.startTop = 0;

        this.startWidth = 0;
        this.startHeight = 0;

        this.pendingEvent = null;
        this.animationFrame = null;

        this.setupHandles();
    }


    setupHandles() {

        const handles =
            document.querySelectorAll(
                "#selectionBox .resize-handle"
            );

        handles.forEach(handle => {

            handle.style.touchAction = "none";

            handle.addEventListener(
                "pointerdown",
                this.start
            );

        });

    }


    start = event => {

        if (
            this.resizing
        )
            return;

        const element =
            this.editor.selected;

        if (!element)
            return;

        const direction =
            [...event.currentTarget.classList]
                .find(
                    value =>
                        [
                            "nw",
                            "n",
                            "ne",
                            "w",
                            "e",
                            "sw",
                            "s",
                            "se"
                        ].includes(value)
                );

        if (!direction)
            return;

        event.preventDefault();
        event.stopPropagation();

        this.resizing = true;
        this.direction = direction;
        this.pointerId = event.pointerId;

        this.startX =
            event.clientX;

        this.startY =
            event.clientY;

        this.startLeft =
            parseFloat(
                element.getAttribute("x")
            );

        this.startTop =
            parseFloat(
                element.getAttribute("y")
            );

        if (
            Number.isNaN(
                this.startLeft
            )
        ) {

            this.startLeft =
                parseFloat(
                    element.style.left
                ) || 0;

        }

        if (
            Number.isNaN(
                this.startTop
            )
        ) {

            this.startTop =
                parseFloat(
                    element.style.top
                ) || 0;

        }

        this.startWidth =
            element.offsetWidth;

        this.startHeight =
            element.offsetHeight;

        try {

            event.currentTarget.setPointerCapture(
                event.pointerId
            );

        } catch { }

        document.addEventListener(
            "pointermove",
            this.move
        );

        document.addEventListener(
            "pointerup",
            this.stop
        );

        document.addEventListener(
            "pointercancel",
            this.stop
        );

    };


    move = event => {

        if (
            !this.resizing ||
            event.pointerId !==
            this.pointerId
        )
            return;

        this.pendingEvent =
            event;

        if (
            this.animationFrame
        )
            return;

        this.animationFrame =
            requestAnimationFrame(
                () => {

                    this.animationFrame =
                        null;

                    if (
                        !this.pendingEvent
                    )
                        return;

                    this.applyResize(
                        this.pendingEvent
                    );

                    this.pendingEvent =
                        null;

                }
            );

    };


    applyResize(event) {

        const element =
            this.editor.selected;

        if (!element) {

            this.stop();

            return;

        }

        const dx =
            event.clientX -
            this.startX;

        const dy =
            event.clientY -
            this.startY;

        let width =
            this.startWidth;

        let height =
            this.startHeight;

        let left =
            this.startLeft;

        let top =
            this.startTop;


        if (
            this.direction.includes("e")
        ) {

            width =
                this.startWidth +
                dx;

        }


        if (
            this.direction.includes("w")
        ) {

            width =
                this.startWidth -
                dx;

            left =
                this.startLeft +
                dx;

        }


        if (
            this.direction.includes("s")
        ) {

            height =
                this.startHeight +
                dy;

        }


        if (
            this.direction.includes("n")
        ) {

            height =
                this.startHeight -
                dy;

            top =
                this.startTop +
                dy;

        }


        const minWidth =
            20;

        const minHeight =
            20;


        if (
            width < minWidth
        ) {

            if (
                this.direction.includes("w")
            ) {

                left =
                    this.startLeft +
                    (
                        this.startWidth -
                        minWidth
                    );

            }

            width =
                minWidth;

        }


        if (
            height < minHeight
        ) {

            if (
                this.direction.includes("n")
            ) {

                top =
                    this.startTop +
                    (
                        this.startHeight -
                        minHeight
                    );

            }

            height =
                minHeight;

        }


        element.style.left =
            `${left}px`;

        element.style.top =
            `${top}px`;

        element.style.width =
            `${width}px`;

        element.style.height =
            `${height}px`;


        element.setAttribute(
            "x",
            Math.round(left)
        );

        element.setAttribute(
            "y",
            Math.round(top)
        );

        element.setAttribute(
            "width",
            Math.round(width)
        );

        element.setAttribute(
            "height",
            Math.round(height)
        );


        this.editor.selection.update();

    };


    stop = event => {

        if (
            !this.resizing
        )
            return;

        if (
            event &&
            event.pointerId !==
            this.pointerId
        )
            return;

        this.resizing = false;
        this.direction = null;
        this.pointerId = null;
        this.pendingEvent = null;

        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame =
                null;

        }

        document.removeEventListener(
            "pointermove",
            this.move
        );

        document.removeEventListener(
            "pointerup",
            this.stop
        );

        document.removeEventListener(
            "pointercancel",
            this.stop
        );


        this.editor.sendState();

    };

}