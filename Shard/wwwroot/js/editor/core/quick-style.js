export class QuickStyle {

    constructor(editor) {

        this.editor = editor;

        this.container =
            document.getElementById(
                "quickStyle"
            );

        this.visibleFor = null;

    }


    show(element) {

        if (!element)
            return;


        this.visibleFor = element;

        this.container.innerHTML = "";

        this.container.classList.add(
            "active"
        );


        const properties =
            element.editableProperties || [];


        for (const property of properties) {

            const control =
                this.createControl(
                    element,
                    property
                );


            if (control)
                this.container.appendChild(
                    control
                );

        }


        this.editor.selection.update();

    }


    hide() {

        this.visibleFor = null;

        this.container.classList.remove(
            "active"
        );

        this.container.innerHTML = "";

    }


    refresh() {

        const element =
            this.editor.selected;


        if (!element) {

            this.hide();

            return;

        }


        this.show(element);

    }


    createControl(
        element,
        property
    ) {

        switch (property.type) {

            case "toggle":
                return this.createToggle(
                    element,
                    property
                );


            case "color":
                return this.createColor(
                    element,
                    property
                );


            case "number":
                return this.createNumber(
                    element,
                    property
                );


            case "alignment":
                return this.createAlignment(
                    element,
                    property
                );


            case "select":
                return this.createSelect(
                    element,
                    property
                );


            case "font-family":
                return this.createFontFamily(
                    element,
                    property
                );


            default:

                console.warn(
                    "Unknown editor property:",
                    property.type
                );

                return null;

        }

    }


    /* =====================================================
       BUTTON
       ===================================================== */

    createButton(
        icon,
        title
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "quick-button";

        button.title =
            title;


        const i =
            document.createElement(
                "i"
            );


        i.className =
            `bi ${icon}`;


        button.appendChild(i);


        return button;

    }


    /* =====================================================
       TOGGLE
       ===================================================== */

    createToggle(
        element,
        property
    ) {

        const button =
            this.createButton(
                this.getToggleIcon(
                    property.id
                ),
                property.label
            );


        const update =
            () => {

                const current =
                    getComputedStyle(
                        element
                    )[property.id];


                button.classList.toggle(
                    "active",
                    current ===
                    property.enabledValue
                );

            };


        button.onclick =
            () => {

                const current =
                    getComputedStyle(
                        element
                    )[property.id];


                element.style[property.id] =
                    current ===
                        property.enabledValue
                        ? property.disabledValue
                        : property.enabledValue;


                update();

                this.editor.selection.update();

                this.editor.sendState();

            };


        update();

        return button;

    }


    getToggleIcon(property) {

        switch (property) {

            case "fontWeight":
                return "bi-type-bold";

            case "fontStyle":
                return "bi-type-italic";

            case "textDecoration":
                return "bi-type-underline";

            default:
                return "bi-circle";

        }

    }


    /* =====================================================
       COLOR
       ===================================================== */

    createColor(
        element,
        property
    ) {

        const wrapper =
            document.createElement(
                "label"
            );


        wrapper.className =
            "quick-color";


        wrapper.title =
            property.label;


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "color";


        input.value =
            this.rgbToHex(
                getComputedStyle(
                    element
                )[property.id]
            );


        wrapper.appendChild(
            input
        );


        input.addEventListener(
            "input",
            () => {

                element.style[property.id] =
                    input.value;


                wrapper.style
                    .setProperty(
                        "--color",
                        input.value
                    );


                this.editor.sendState();

            }
        );


        wrapper.style.setProperty(
            "--color",
            input.value
        );


        return wrapper;

    }


    /* =====================================================
       NUMBER
       ===================================================== */

    createNumber(
        element,
        property
    ) {

        const wrapper =
            document.createElement(
                "label"
            );


        wrapper.className =
            "quick-number";


        wrapper.title =
            property.label;


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "number";


        if (property.min != null)
            input.min =
                property.min;


        if (property.max != null)
            input.max =
                property.max;


        if (property.step != null)
            input.step =
                property.step;


        const value =
            parseFloat(
                getComputedStyle(
                    element
                )[property.id]
            );


        input.value =
            Number.isNaN(value)
                ? ""
                : value;


        wrapper.appendChild(
            input
        );


        if (property.unit) {

            const unit =
                document.createElement(
                    "span"
                );


            unit.textContent =
                property.unit;


            wrapper.appendChild(
                unit
            );

        }


        input.addEventListener(
            "input",
            () => {

                if (
                    input.value === ""
                )
                    return;


                element.style[property.id] =
                    input.value +
                    (property.unit || "");


                this.editor.selection.update();

                this.editor.sendState();

            }
        );


        return wrapper;

    }


    /* =====================================================
       FONT
       ===================================================== */

    createFontFamily(
        element,
        property
    ) {

        const select =
            document.createElement(
                "select"
            );


        select.className =
            "quick-font";


        select.title =
            property.label;


        const fonts =
            property.options ||
            [
                "Arial",
                "Calibri",
                "Courier New",
                "Georgia",
                "Segoe UI",
                "Times New Roman",
                "Verdana"
            ];


        for (const font of fonts) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                font;

            option.textContent =
                font;


            select.appendChild(
                option
            );

        }


        const current =
            getComputedStyle(
                element
            )
                .fontFamily
                .split(",")[0]
                .replaceAll(
                    '"',
                    ""
                )
                .replaceAll(
                    "'",
                    ""
                )
                .trim();


        if (
            fonts.includes(current)
        ) {

            select.value =
                current;

        }


        select.addEventListener(
            "change",
            () => {

                element.style.fontFamily =
                    select.value;


                this.editor.sendState();

            }
        );


        return select;

    }


    /* =====================================================
       ALIGNMENT
       ===================================================== */

    createAlignment(
        element,
        property
    ) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "quick-group";


        const values = [

            ["left", "bi-text-left", "Align left"],

            ["center", "bi-text-center", "Align center"],

            ["right", "bi-text-right", "Align right"]

        ];


        for (
            const [value, icon, title]
            of values
        ) {

            const button =
                this.createButton(
                    icon,
                    title
                );


            button.classList.toggle(
                "active",
                getComputedStyle(
                    element
                )[property.id] === value
            );


            button.onclick =
                () => {

                    element.style[property.id] =
                        value;


                    this.refresh();

                    this.editor.sendState();

                };


            group.appendChild(
                button
            );

        }


        return group;

    }


    /* =====================================================
       SELECT
       ===================================================== */

    createSelect(
        element,
        property
    ) {

        const select =
            document.createElement(
                "select"
            );


        select.className =
            "quick-select";


        select.title =
            property.label;


        for (
            const option
            of property.options
        ) {

            const item =
                document.createElement(
                    "option"
                );


            if (
                typeof option ===
                "object"
            ) {

                item.value =
                    option.value;

                item.textContent =
                    option.label ??
                    option.value;

            }
            else {

                item.value =
                    option;

                item.textContent =
                    option;

            }


            select.appendChild(
                item
            );

        }


        const current =
            getComputedStyle(
                element
            )[property.id];


        if (
            [...select.options]
                .some(
                    option =>
                        option.value ===
                        current
                )
        ) {

            select.value =
                current;

        }


        select.addEventListener(
            "change",
            () => {

                element.style[property.id] =
                    select.value;


                this.editor.sendState();

            }
        );


        return select;

    }


    /* =====================================================
       RGB → HEX
       ===================================================== */

    rgbToHex(rgb) {

        if (!rgb)
            return "#000000";


        if (
            rgb.startsWith("#")
        )
            return rgb;


        const match =
            rgb.match(/\d+/g);


        if (!match)
            return "#000000";


        return "#" +
            match
                .slice(0, 3)
                .map(
                    value =>
                        parseInt(
                            value,
                            10
                        )
                            .toString(16)
                            .padStart(
                                2,
                                "0"
                            )
                )
                .join("");

    }

}