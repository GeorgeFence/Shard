export class ShardElement {

    constructor(domElement) {

        this.element = domElement;

    }


    get type() {

        return this.element.tagName
            .toLowerCase();

    }


    get editableProperties() {

        return {};

    }


    get nonEditableProperties() {

        return {};

    }


    getProperty(name) {

        return this.element.getAttribute(name);

    }


    setProperty(name, value) {

        this.element.setAttribute(
            name,
            value
        );

    }


    getStyle(name) {

        return this.element.style[name];

    }


    setStyle(name, value) {

        this.element.style[name] =
            value;

    }


    delete() {

        this.element.remove();

    }


    duplicate() {

        return this.element.cloneNode(true);

    }

}