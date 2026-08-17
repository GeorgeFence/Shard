import { ShardElement } from "./base-element.js";

export class ShardTable extends ShardElement {

    constructor() {

        super();

        this.activeCell = null;

    }


    connectedCallback() {

        super.connectedCallback();

        this.render();

    }


    render() {

        const rows =
            Math.max(
                1,
                parseInt(this.getAttribute("rows")) || 3
            );

        const columns =
            Math.max(
                1,
                parseInt(this.getAttribute("columns")) || 3
            );


        const oldTable =
            this.querySelector("table");

        const oldCells =
            oldTable
                ? [...oldTable.querySelectorAll("td")]
                : [];


        const values =
            oldCells.map(cell => cell.innerHTML);


        this.innerHTML = "";


        const table =
            document.createElement("table");


        table.style.width = "100%";
        table.style.height = "100%";
        table.style.borderCollapse = "collapse";
        table.style.tableLayout = "fixed";


        let valueIndex = 0;


        for (let row = 0; row < rows; row++) {

            const tr =
                document.createElement("tr");


            for (let column = 0; column < columns; column++) {

                const td =
                    document.createElement("td");


                td.style.border =
                    `1px solid ${this.getAttribute("borderColor") || "#999"}`;

                td.style.padding =
                    `${parseFloat(this.getAttribute("cellPadding")) || 6}px`;

                td.dataset.row =
                    row;

                td.dataset.column =
                    column;


                if (values[valueIndex] !== undefined) {

                    td.innerHTML =
                        values[valueIndex];

                }


                valueIndex++;


                td.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        this.activeCell =
                            td;

                    }
                );


                td.addEventListener(
                    "dblclick",
                    event => {

                        event.stopPropagation();

                        this.startCellEdit(td);

                    }
                );


                tr.appendChild(td);

            }


            table.appendChild(tr);

        }


        this.appendChild(table);

    }


    startCellEdit(cell) {

        if (!cell)
            return;


        if (cell.isContentEditable)
            return;


        cell.contentEditable =
            "true";

        cell.focus();


        const range =
            document.createRange();

        range.selectNodeContents(cell);

        range.collapse(false);


        const selection =
            window.getSelection();

        selection.removeAllRanges();

        selection.addRange(range);


        const finish =
            event => {

                if (
                    event.type === "keydown" &&
                    event.key !== "Enter"
                )
                    return;


                if (
                    event.type === "keydown" &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                }


                cell.contentEditable =
                    "false";


                cell.removeEventListener(
                    "blur",
                    finish
                );

                cell.removeEventListener(
                    "keydown",
                    finish
                );


                this.activeCell =
                    cell;


                this.dispatchEvent(
                    new CustomEvent(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            };


        cell.addEventListener(
            "blur",
            finish
        );


        cell.addEventListener(
            "keydown",
            finish
        );

    }


    getCellPosition() {

        const cell =
            this.activeCell;


        if (!cell)
            return null;


        return {

            row:
                parseInt(
                    cell.dataset.row
                ),

            column:
                parseInt(
                    cell.dataset.column
                )

        };

    }


    addRowUp() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const rows =
            parseInt(
                this.getAttribute("rows")
            ) || 1;


        this.setAttribute(
            "rows",
            rows + 1
        );


        this.insertRow(
            position.row
        );

    }


    addRowDown() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const rows =
            parseInt(
                this.getAttribute("rows")
            ) || 1;


        this.setAttribute(
            "rows",
            rows + 1
        );


        this.insertRow(
            position.row + 1
        );

    }


    insertRow(index) {

        const table =
            this.querySelector("table");


        if (!table)
            return;


        const columns =
            parseInt(
                this.getAttribute("columns")
            ) || 1;


        const tr =
            document.createElement("tr");


        for (
            let column = 0;
            column < columns;
            column++
        ) {

            const td =
                this.createCell(
                    index,
                    column
                );


            tr.appendChild(td);

        }


        table.insertBefore(
            tr,
            table.children[index] || null
        );


        this.refreshCellIndexes();

    }


    addColumnLeft() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const columns =
            parseInt(
                this.getAttribute("columns")
            ) || 1;


        this.setAttribute(
            "columns",
            columns + 1
        );


        this.insertColumn(
            position.column
        );

    }


    addColumnRight() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const columns =
            parseInt(
                this.getAttribute("columns")
            ) || 1;


        this.setAttribute(
            "columns",
            columns + 1
        );


        this.insertColumn(
            position.column + 1
        );

    }


    insertColumn(index) {

        const table =
            this.querySelector("table");


        if (!table)
            return;


        [...table.rows].forEach(
            (row, rowIndex) => {

                const td =
                    this.createCell(
                        rowIndex,
                        index
                    );


                row.insertBefore(
                    td,
                    row.children[index] || null
                );

            }
        );


        this.refreshCellIndexes();

    }


    removeRow() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const rows =
            parseInt(
                this.getAttribute("rows")
            ) || 1;


        if (rows <= 1)
            return;


        const table =
            this.querySelector("table");


        if (!table)
            return;


        table.deleteRow(
            position.row
        );


        this.setAttribute(
            "rows",
            rows - 1
        );


        this.activeCell =
            null;


        this.refreshCellIndexes();

    }


    removeColumn() {

        const position =
            this.getCellPosition();


        if (!position)
            return;


        const columns =
            parseInt(
                this.getAttribute("columns")
            ) || 1;


        if (columns <= 1)
            return;


        const table =
            this.querySelector("table");


        if (!table)
            return;


        [...table.rows].forEach(
            row => {

                row.deleteCell(
                    position.column
                );

            }
        );


        this.setAttribute(
            "columns",
            columns - 1
        );


        this.activeCell =
            null;


        this.refreshCellIndexes();

    }


    createCell(row, column) {

        const td =
            document.createElement("td");


        td.dataset.row =
            row;

        td.dataset.column =
            column;


        td.style.border =
            `1px solid ${this.getAttribute("borderColor") || "#999"}`;

        td.style.padding =
            `${parseFloat(this.getAttribute("cellPadding")) || 6}px`;


        td.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                this.activeCell =
                    td;

            }
        );


        td.addEventListener(
            "dblclick",
            event => {

                event.stopPropagation();

                this.startCellEdit(td);

            }
        );


        return td;

    }


    refreshCellIndexes() {

        const table =
            this.querySelector("table");


        if (!table)
            return;


        [...table.rows].forEach(
            (row, rowIndex) => {

                [...row.cells].forEach(
                    (cell, columnIndex) => {

                        cell.dataset.row =
                            rowIndex;

                        cell.dataset.column =
                            columnIndex;

                    }
                );

            }
        );


        this.dispatchEvent(
            new CustomEvent(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    get actions() {

        return [

            {
                id: "add-row-up",
                label: "Add row above",
                icon: "bi-arrow-up-square",
                action: () =>
                    this.addRowUp()
            },

            {
                id: "add-row-down",
                label: "Add row below",
                icon: "bi-arrow-down-square",
                action: () =>
                    this.addRowDown()
            },

            {
                id: "add-column-left",
                label: "Add column left",
                icon: "bi-arrow-left-square",
                action: () =>
                    this.addColumnLeft()
            },

            {
                id: "add-column-right",
                label: "Add column right",
                icon: "bi-arrow-right-square",
                action: () =>
                    this.addColumnRight()
            },

            {
                id: "remove-row",
                label: "Remove row",
                icon: "bi-dash-square",
                action: () =>
                    this.removeRow()
            },

            {
                id: "remove-column",
                label: "Remove column",
                icon: "bi-dash-square",
                action: () =>
                    this.removeColumn()
            }

        ];

    }


    get editableProperties() {

        return [

            {
                id: "borderColor",
                type: "color",
                label: "Border color"
            },

            {
                id: "borderWidth",
                type: "number",
                label: "Border width",
                unit: "px",
                min: 0,
                max: 20
            },

            {
                id: "cellPadding",
                type: "number",
                label: "Cell padding",
                unit: "px",
                min: 0,
                max: 50
            }

        ];

    }

}


if (!customElements.get("shard-table")) {

    customElements.define(
        "shard-table",
        ShardTable
    );

}