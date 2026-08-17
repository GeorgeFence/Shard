import { ShardElement } from "./base-element.js";

export class ShardImage extends ShardElement {

    connectedCallback() {

        super.connectedCallback();

        this.render();

    }


    render() {

        const src =
            this.getAttribute("src");

        if (!src)
            return;


        this.innerHTML = "";


        const img =
            document.createElement("img");


        img.src = src;

        img.draggable = false;

        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.pointerEvents = "none";


        this.appendChild(img);

    }


    get editableProperties() {

        return [

            {
                id: "src",
                type: "image",
                label: "Image"
            },

            {
                id: "objectFit",
                type: "select",
                label: "Fit",

                options: [
                    "contain",
                    "cover",
                    "fill"
                ]

            }

        ];

    }

}


customElements.define(
    "shard-image",
    ShardImage
);