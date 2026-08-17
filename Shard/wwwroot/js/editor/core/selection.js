export class SelectionManager {

    constructor(editor) {

        this.editor =
            editor;


        this.box =
            document.getElementById(
                "selectionBox"
            );

    }


    setup() {

        this.getElements()
            .forEach(element => {

                this.attach(element);

            });

    }


    getElements() {

        return document.querySelectorAll(
            "#documentContainer shard-page > *"
        );

    }


    attach(element) {

        if (
            element.dataset.selectionAttached
        )
            return;


        element.dataset.selectionAttached =
            "true";


        element.addEventListener(
            "mousedown",
            event => {

                event.stopPropagation();

                this.editor.select(
                    element
                );

            }
        );

    }


    select(element) {

        this.box.classList.add(
            "active"
        );


        this.update();

    }


    deselect() {

        this.box.classList.remove(
            "active"
        );

    }


    update() {

        const element =
            this.editor.selected;


        if (!element)
            return;


        const rect =
            element.getBoundingClientRect();


        this.box.style.left =
            `${rect.left}px`;

        this.box.style.top =
            `${rect.top}px`;

        this.box.style.width =
            `${rect.width}px`;

        this.box.style.height =
            `${rect.height}px`;


        this.updateToolbarPosition(
            rect
        );

    }


    updateToolbarPosition(rect) {

        const toolbar =
            document.getElementById(
                "quickStyle"
            );


        if (!toolbar)
            return;


        let left =
            rect.left;


        let top =
            rect.top -
            toolbar.offsetHeight -
            8;


        if (
            left +
            toolbar.offsetWidth >
            window.innerWidth
        ) {

            left =
                window.innerWidth -
                toolbar.offsetWidth -
                10;

        }


        if (left < 10)
            left = 10;


        if (top < 10) {

            top =
                rect.bottom + 8;

        }


        toolbar.style.left =
            `${left}px`;

        toolbar.style.top =
            `${top}px`;

    }


    refresh() {

        this.setup();

    }

}