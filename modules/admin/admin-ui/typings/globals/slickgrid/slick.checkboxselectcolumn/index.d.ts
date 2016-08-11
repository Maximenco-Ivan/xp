// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/a866157b01236c0c43f3d99b2b2d57abb06f8d4d/slickgrid/slick.checkboxselectcolumn.d.ts
declare namespace Slick {
    export interface SlickGridCheckBoxSelectColumnOptions extends PluginOptions {
        /**
         * Column to add the checkbox to
         * @default "_checkbox_selector"
         */
        columnId?: string;

        /**
         * CSS class to be added to cells in this column
         * @default null
         */
        cssClass?: string;

        /**
         * Tooltip text to display for this column
         * @default "Select/Deselect All"
         */
        toolTip?: string;

        /**
         * Width of the column
         * @default 30
         */
        width?: number;
    }

    export class CheckboxSelectColumn<T extends Slick.SlickData> extends Plugin<T> {
        constructor(options?: SlickGridCheckBoxSelectColumnOptions);
        init(grid: Slick.Grid<T>): void;
        destroy(): void;
        getColumnDefinition(): Slick.ColumnMetadata<T>;
    }
}