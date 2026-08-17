import { ShardElement } from "./base-element.js";

export class ShardShape extends ShardElement {

    connectedCallback() {

        super.connectedCallback();

        this.render();

    }


    render() {

        const type =
            this.getAttribute("shape") ||
            "rectangle";


        this.innerHTML = "";


        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );


        svg.setAttribute(
            "width",
            "100%"
        );

        svg.setAttribute(
            "height",
            "100%"
        );


        svg.style.display =
            "block";


        let shape;


        switch (type) {

            case "circle":

                shape =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );


                shape.setAttribute(
                    "cx",
                    "50%"
                );

                shape.setAttribute(
                    "cy",
                    "50%"
                );

                shape.setAttribute(
                    "r",
                    "45%"
                );

                break;


            case "ellipse":

                shape =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "ellipse"
                    );


                shape.setAttribute(
                    "cx",
                    "50%"
                );

                shape.setAttribute(
                    "cy",
                    "50%"
                );

                shape.setAttribute(
                    "rx",
                    "45%"
                );

                shape.setAttribute(
                    "ry",
                    "35%"
                );

                break;


            case "line":

                shape =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "line"
                    );


                shape.setAttribute(
                    "x1",
                    "0"
                );

                shape.setAttribute(
                    "y1",
                    "0"
                );

                shape.setAttribute(
                    "x2",
                    "100%"
                );

                shape.setAttribute(
                    "y2",
                    "100%"
                );

                break;


            case "rectangle":
            default:

                shape =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "rect"
                    );


                shape.setAttribute(
                    "x",
                    "0"
                );

                shape.setAttribute(
                    "y",
                    "0"
                );

                shape.setAttribute(
                    "width",
                    "100%"
                );

                shape.setAttribute(
                    "height",
                    "100%"
                );

                break;

        }


        shape.setAttribute(
            "fill",
            this.getAttribute("fill") ||
            "#cccccc"
        );


        shape.setAttribute(
            "stroke",
            this.getAttribute("stroke") ||
            "#000000"
        );


        shape.setAttribute(
            "stroke-width",
            this.getAttribute("stroke-width") ||
            "1"
        );


        svg.appendChild(shape);

        this.appendChild(svg);

    }


    get editableProperties() {

        return [

            {
                id: "fill",
                type: "color",
                label: "Fill"
            },

            {
                id: "stroke",
                type: "color",
                label: "Stroke"
            },

            {
                id: "stroke-width",
                type: "number",
                label: "Stroke width",
                unit: "px",
                min: 0,
                max: 50
            }

        ];

    }

}


if (!customElements.get("shard-shape")) {

    customElements.define(
        "shard-shape",
        ShardShape
    );

}