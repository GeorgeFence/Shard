import { ShardElement } from "./base-element.js";

export class ShardDrawing extends ShardElement {

    connectedCallback() {

        super.connectedCallback();

        this.render();

    }


    render() {

        this.innerHTML = "";


        const canvas =
            document.createElement("canvas");


        canvas.style.width =
            "100%";

        canvas.style.height =
            "100%";

        canvas.style.display =
            "block";


        const width =
            this.offsetWidth || 300;

        const height =
            this.offsetHeight || 200;


        const devicePixelRatio =
            window.devicePixelRatio || 1;


        canvas.width =
            width * devicePixelRatio;

        canvas.height =
            height * devicePixelRatio;


        const context =
            canvas.getContext("2d");


        context.scale(
            devicePixelRatio,
            devicePixelRatio
        );


        this.appendChild(canvas);


        this.canvas =
            canvas;

        this.context =
            context;

    }


    get editableProperties() {

        return [

            {
                id: "strokeColor",
                type: "color",
                label: "Color"
            },

            {
                id: "strokeWidth",
                type: "number",
                label: "Width",
                unit: "px",
                min: 1,
                max: 100
            }

        ];

    }

}


if (!customElements.get("shard-drawing")) {

    customElements.define(
        "shard-drawing",
        ShardDrawing
    );

}