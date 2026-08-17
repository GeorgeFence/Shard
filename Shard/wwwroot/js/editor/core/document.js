export class DocumentManager {

    constructor(editor) {

        this.editor =
            editor;

    }


    getPath() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return params.get("path");

    }


    async load() {

        const path =
            this.getPath();


        if (!path) {

            this.showError(
                "No document path specified."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "/files/Open?path=" +
                    encodeURIComponent(path)
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!data.content) {

                throw new Error(
                    "Document is empty."
                );

            }


            this.render(
                data.content
            );

        }
        catch (error) {

            console.error(
                "Document load error:",
                error
            );


            this.showError(
                "Unable to load document."
            );

        }

    }


    render(html) {

        const parser =
            new DOMParser();


        const parsed =
            parser.parseFromString(
                html,
                "text/html"
            );


        const root =
            parsed.querySelector(
                "shard-document"
            );


        if (!root) {

            this.showError(
                "Invalid Shard document."
            );

            return;

        }


        this.editor.container.innerHTML =
            "";


        this.editor.container.appendChild(
            root
        );


        this.editor.selection.refresh();

    }


    async save() {

        const path =
            this.getPath();


        if (!path)
            return;


        const root =
            document.querySelector(
                "shard-document"
            );


        if (!root)
            return;


        try {

            const response =
                await fetch(
                    "/files/Save?path=" +
                    encodeURIComponent(path),
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                root.outerHTML
                            )

                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            console.log(
                "Document saved."
            );

        }
        catch (error) {

            console.error(
                "Save error:",
                error
            );

        }

    }


    showError(message) {

        this.editor.container.innerHTML = `

            <div class="error">

                <i class="bi bi-exclamation-triangle"></i>

                <strong>
                    Document error
                </strong>

                <br><br>

                ${message}

            </div>

        `;

    }

}