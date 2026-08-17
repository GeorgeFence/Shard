export class ShardElement extends HTMLElement {

    connectedCallback() {

        this.applyPosition();

    }


    applyPosition() {

        const x =
            parseFloat(
                this.getAttribute("x")
            ) || 0;

        const y =
            parseFloat(
                this.getAttribute("y")
            ) || 0;

        const width =
            this.getAttribute("width");

        const height =
            this.getAttribute("height");


        this.style.position =
            "absolute";

        this.style.left =
            `${x}px`;

        this.style.top =
            `${y}px`;


        if (width)
            this.style.width =
                `${width}px`;


        if (height)
            this.style.height =
                `${height}px`;

    }


    get editableProperties() {

        return [];

    }


    render() {

        // každý element může override

    }

}