export class PageManager {

    constructor(editor) {

        this.editor =
            editor;

        this.currentIndex =
            0;

        this.manager =
            null;

        this.draggedIndex =
            null;

    }


    get pages() {

        if (!this.editor.container)
            return [];

        return [
            ...this.editor.container.querySelectorAll(
                "shard-page"
            )
        ];

    }


    get current() {

        const pages =
            this.pages;

        if (!pages.length)
            return null;

        if (this.currentIndex < 0)
            this.currentIndex = 0;

        if (this.currentIndex >= pages.length)
            this.currentIndex =
                pages.length - 1;

        return pages[
            this.currentIndex
        ];

    }


    get index() {

        return this.currentIndex;

    }


    select(index) {

        const pages =
            this.pages;

        index =
            Number(index);

        if (!pages.length)
            return;

        if (
            index < 0 ||
            index >= pages.length
        )
            return;

        this.currentIndex =
            index;

        this.editor.deselect();

        this.updateVisibility();

        this.sendState();

        this.refreshManager();

    }


    next() {

        const pages =
            this.pages;

        if (
            this.currentIndex <
            pages.length - 1
        ) {

            this.select(
                this.currentIndex + 1
            );

        }

    }


    previous() {

        if (
            this.currentIndex > 0
        ) {

            this.select(
                this.currentIndex - 1
            );

        }

    }


    add() {

        const documentElement =
            this.editor.container.querySelector(
                "shard-document"
            );

        if (!documentElement)
            return null;

        const page =
            document.createElement(
                "shard-page"
            );

        page.setAttribute(
            "width",
            "794"
        );

        page.setAttribute(
            "height",
            "1123"
        );

        const current =
            this.current;

        if (current) {

            current.after(
                page
            );

            this.currentIndex += 1;

        } else {

            documentElement.appendChild(
                page
            );

            this.currentIndex = 0;

        }

        this.updateVisibility();

        this.editor.selection.refresh();

        this.sendState();

        this.refreshManager();

        return page;

    }


    duplicate() {

        const current =
            this.current;

        if (!current)
            return null;

        const clone =
            current.cloneNode(
                true
            );

        current.after(
            clone
        );

        this.currentIndex += 1;

        this.editor.deselect();

        this.updateVisibility();

        this.editor.selection.refresh();

        this.sendState();

        this.refreshManager();

        return clone;

    }


    delete() {

        const pages =
            this.pages;

        if (
            pages.length <= 1
        )
            return;

        const current =
            this.current;

        if (!current)
            return;

        current.remove();

        if (
            this.currentIndex >=
            this.pages.length
        ) {

            this.currentIndex =
                this.pages.length - 1;

        }

        this.editor.deselect();

        this.updateVisibility();

        this.editor.selection.refresh();

        this.sendState();

        this.refreshManager();

    }


    move(fromIndex, toIndex) {

        const pages =
            this.pages;

        if (
            fromIndex < 0 ||
            fromIndex >= pages.length ||
            toIndex < 0 ||
            toIndex >= pages.length ||
            fromIndex === toIndex
        )
            return;

        const page =
            pages[fromIndex];

        const target =
            pages[toIndex];

        const currentPage =
            this.current;

        if (!page || !target)
            return;

        if (fromIndex < toIndex) {

            target.after(
                page
            );

        } else {

            target.before(
                page
            );

        }

        if (
            currentPage === page
        ) {

            this.currentIndex =
                toIndex;

        } else if (
            fromIndex < this.currentIndex &&
            toIndex >= this.currentIndex
        ) {

            this.currentIndex -= 1;

        } else if (
            fromIndex > this.currentIndex &&
            toIndex <= this.currentIndex
        ) {

            this.currentIndex += 1;

        }

        this.updateVisibility();

        this.sendState();

        this.refreshManager();

    }


    moveCurrentLeft() {

        if (
            this.currentIndex <= 0
        )
            return;

        this.move(
            this.currentIndex,
            this.currentIndex - 1
        );

    }


    moveCurrentRight() {

        if (
            this.currentIndex >=
            this.pages.length - 1
        )
            return;

        this.move(
            this.currentIndex,
            this.currentIndex + 1
        );

    }


    updateVisibility() {

        const pages =
            this.pages;

        pages.forEach(
            (page, index) => {

                page.classList.toggle(
                    "active-page",
                    index ===
                    this.currentIndex
                );

                page.style.display =
                    index ===
                        this.currentIndex
                        ? ""
                        : "none";

            }
        );

    }


    sendState() {

        window.parent.postMessage({

            type:
                "shard-page-state",

            index:
                this.currentIndex,

            pageCount:
                this.pages.length

        }, "*");

    }


    refresh() {

        const pages =
            this.pages;

        if (!pages.length) {

            this.currentIndex =
                0;

            this.sendState();

            this.refreshManager();

            return;

        }

        if (
            this.currentIndex >=
            pages.length
        ) {

            this.currentIndex =
                pages.length - 1;

        }

        if (
            this.currentIndex < 0
        ) {

            this.currentIndex =
                0;

        }

        this.updateVisibility();

        this.sendState();

        this.refreshManager();

    }


    openManager() {

        if (this.manager) {

            this.refreshManager();

            return;

        }

        this.injectStyles();

        const overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "shardPageManager";

        overlay.innerHTML = `

            <div class="shard-page-manager">

                <div class="shard-page-manager-header">

                    <div>
                        <div class="shard-page-manager-title">
                            Pages
                        </div>

                        <div class="shard-page-manager-subtitle">
                            Drag pages to reorder them
                        </div>
                    </div>

                    <button
                        class="shard-page-manager-close"
                        type="button">
                        ×
                    </button>

                </div>

                <div
                    class="shard-page-manager-pages">
                </div>

                <div class="shard-page-manager-footer">

                    <button
                        type="button"
                        data-action="add">
                        ＋ Add page
                    </button>

                    <button
                        type="button"
                        data-action="duplicate">
                        ⧉ Duplicate
                    </button>

                    <button
                        type="button"
                        data-action="delete">
                        🗑 Delete
                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(
            overlay
        );

        this.manager =
            overlay;

        const close =
            overlay.querySelector(
                ".shard-page-manager-close"
            );

        close.addEventListener(
            "click",
            () => {

                this.closeManager();

            }
        );

        overlay.addEventListener(
            "mousedown",
            event => {

                if (
                    event.target ===
                    overlay
                ) {

                    this.closeManager();

                }

            }
        );

        overlay.querySelector(
            '[data-action="add"]'
        ).addEventListener(
            "click",
            () => {

                this.add();

            }
        );

        overlay.querySelector(
            '[data-action="duplicate"]'
        ).addEventListener(
            "click",
            () => {

                this.duplicate();

            }
        );

        overlay.querySelector(
            '[data-action="delete"]'
        ).addEventListener(
            "click",
            () => {

                this.delete();

            }
        );

        this.refreshManager();

    }


    closeManager() {

        if (!this.manager)
            return;

        this.manager.remove();

        this.manager =
            null;

        this.draggedIndex =
            null;

    }


    refreshManager() {

        if (!this.manager)
            return;

        const container =
            this.manager.querySelector(
                ".shard-page-manager-pages"
            );

        if (!container)
            return;

        container.innerHTML = "";

        const pages =
            this.pages;

        pages.forEach(
            (page, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "shard-page-preview";

                if (
                    index ===
                    this.currentIndex
                ) {

                    item.classList.add(
                        "selected"
                    );

                }

                item.draggable =
                    true;

                item.dataset.index =
                    index;

                const preview =
                    document.createElement(
                        "div"
                    );

                preview.className =
                    "shard-page-preview-paper";

                const clone =
                    page.cloneNode(
                        true
                    );

                clone.removeAttribute(
                    "id"
                );

                clone.querySelectorAll(
                    "*"
                ).forEach(
                    element => {

                        element.removeAttribute(
                            "id"
                        );

                    }
                );

                preview.appendChild(
                    clone
                );

                const number =
                    document.createElement(
                        "div"
                    );

                number.className =
                    "shard-page-preview-number";

                number.textContent =
                    `Page ${index + 1}`;

                item.appendChild(
                    preview
                );

                item.appendChild(
                    number
                );

                item.addEventListener(
                    "click",
                    () => {

                        this.select(
                            index
                        );

                    }
                );

                item.addEventListener(
                    "dragstart",
                    event => {

                        this.draggedIndex =
                            index;

                        item.classList.add(
                            "dragging"
                        );

                        event.dataTransfer.effectAllowed =
                            "move";

                        event.dataTransfer.setData(
                            "text/plain",
                            String(index)
                        );

                    }
                );

                item.addEventListener(
                    "dragend",
                    () => {

                        item.classList.remove(
                            "dragging"
                        );

                        this.draggedIndex =
                            null;

                        container
                            .querySelectorAll(
                                ".drag-over"
                            )
                            .forEach(
                                element => {

                                    element.classList.remove(
                                        "drag-over"
                                    );

                                }
                            );

                    }
                );

                item.addEventListener(
                    "dragover",
                    event => {

                        event.preventDefault();

                        item.classList.add(
                            "drag-over"
                        );

                        event.dataTransfer.dropEffect =
                            "move";

                    }
                );

                item.addEventListener(
                    "dragleave",
                    () => {

                        item.classList.remove(
                            "drag-over"
                        );

                    }
                );

                item.addEventListener(
                    "drop",
                    event => {

                        event.preventDefault();

                        item.classList.remove(
                            "drag-over"
                        );

                        const from =
                            this.draggedIndex;

                        const to =
                            index;

                        if (
                            from === null ||
                            from === undefined
                        )
                            return;

                        this.move(
                            from,
                            to
                        );

                    }
                );

                container.appendChild(
                    item
                );

            }
        );

    }


    injectStyles() {

        if (
            document.getElementById(
                "shardPageManagerStyles"
            )
        )
            return;

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "shardPageManagerStyles";

        style.textContent = `

            #shardPageManager {
                position:fixed;
                inset:0;
                z-index:999999;
                display:flex;
                align-items:center;
                justify-content:center;
                background:rgba(0,0,0,.35);
                backdrop-filter:blur(4px);
            }

            .shard-page-manager {
                width:min(1000px,92vw);
                max-height:85vh;
                display:flex;
                flex-direction:column;
                background:#fff;
                border:1px solid #d8d8d8;
                border-radius:12px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
                overflow:hidden;
                font-family:"Segoe UI",system-ui,sans-serif;
            }

            .shard-page-manager-header {
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:18px 20px;
                border-bottom:1px solid #e5e5e5;
            }

            .shard-page-manager-title {
                font-size:18px;
                font-weight:600;
                color:#202020;
            }

            .shard-page-manager-subtitle {
                margin-top:3px;
                font-size:12px;
                color:#777;
            }

            .shard-page-manager-close {
                width:32px;
                height:32px;
                border:0;
                border-radius:6px;
                background:transparent;
                font-size:24px;
                color:#555;
                cursor:pointer;
            }

            .shard-page-manager-close:hover {
                background:#f0f0f0;
            }

            .shard-page-manager-pages {
                flex:1;
                min-height:200px;
                overflow:auto;
                padding:24px;
                display:flex;
                flex-wrap:wrap;
                align-content:flex-start;
                gap:18px;
            }

            .shard-page-preview {
                width:150px;
                cursor:pointer;
                user-select:none;
            }

            .shard-page-preview-paper {
                width:150px;
                height:190px;
                overflow:hidden;
                position:relative;
                display:flex;
                justify-content:center;
                align-items:flex-start;
                padding-top:6px;
                background:#f3f3f3;
                border:2px solid transparent;
                border-radius:7px;
                transition:
                    border-color .12s,
                    transform .12s,
                    box-shadow .12s;
            }

            .shard-page-preview-paper shard-page {
                position:relative!important;
                display:block!important;
                width:120px!important;
                height:170px!important;
                min-width:120px!important;
                min-height:170px!important;
                max-width:120px!important;
                max-height:170px!important;
                overflow:hidden!important;
                transform:none!important;
                box-shadow:0 1px 5px rgba(0,0,0,.18);
                background:#fff;
            }

            .shard-page-preview:hover
            .shard-page-preview-paper {
                transform:translateY(-2px);
                box-shadow:0 5px 14px rgba(0,0,0,.12);
            }

            .shard-page-preview.selected
            .shard-page-preview-paper {
                border-color:#2563eb;
            }

            .shard-page-preview.dragging {
                opacity:.45;
            }

            .shard-page-preview.drag-over
            .shard-page-preview-paper {
                border-color:#2563eb;
                box-shadow:0 0 0 3px rgba(37,99,235,.15);
            }

            .shard-page-preview-number {
                padding-top:7px;
                text-align:center;
                font-size:12px;
                color:#555;
            }

            .shard-page-manager-footer {
                display:flex;
                gap:8px;
                padding:14px 20px;
                border-top:1px solid #e5e5e5;
                background:#fafafa;
            }

            .shard-page-manager-footer button {
                height:34px;
                padding:0 14px;
                border:1px solid #d2d2d2;
                border-radius:6px;
                background:#fff;
                color:#333;
                cursor:pointer;
                font-size:12px;
            }

            .shard-page-manager-footer button:hover {
                background:#f1f1f1;
            }

            .shard-page-manager-footer
            button:first-child {
                background:#2563eb;
                border-color:#2563eb;
                color:#fff;
            }

            .shard-page-manager-footer
            button:first-child:hover {
                background:#1d4ed8;
            }

            @media(max-width:600px) {

                .shard-page-manager {
                    width:96vw;
                    max-height:92vh;
                }

                .shard-page-preview {
                    width:120px;
                }

                .shard-page-preview-paper {
                    width:120px;
                    height:160px;
                }

            }

        `;

        document.head.appendChild(
            style
        );

    }

}