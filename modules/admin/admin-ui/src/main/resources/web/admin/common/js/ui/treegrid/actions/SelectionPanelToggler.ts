module api.ui.treegrid.actions {

    import i18n = api.util.i18n;
    export class SelectionPanelToggler extends api.ui.button.TogglerButton {

        private tooltip: Tooltip;

        private description: api.dom.SpanEl;

        constructor(treeGrid: TreeGrid<any>) {
            super('selection-toggler');

            this.description = new api.dom.SpanEl('description');
            this.appendChild(this.description);

            this.setEnabled(true);

            this.tooltip = new Tooltip(this, '', 1000);

            treeGrid.onSelectionChanged((currentSelection: TreeNode<any>[], fullSelection: TreeNode<any>[]) => {

                let oldLabel = this.getLabel();
                let newLabel = fullSelection.length ? fullSelection.length.toString() : '';

                if (oldLabel == newLabel) {
                    return;
                }

                this.tooltip.setText(this.isActive() ? i18n('filed.selection.hide') : i18n('filed.selection.show'));
                this.description.setHtml('');
                this.removeClass(`size-${oldLabel.length}`);
                this.setLabel(newLabel);
                if (newLabel !== '') {
                    this.addClass(`size-${newLabel.length}`);
                    this.addClass('updated');
                    if (fullSelection.length == 1) {
                        this.description.setHtml(i18n('filed.item.single'));
                    } else if (fullSelection.length > 1) {
                        this.description.setHtml(i18n('filed.item.multiple'));
                    }
                    setTimeout(() => {
                        this.removeClass('updated');
                    }, 200);
                }

            });

            this.onActiveChanged((isActive: boolean) => {
                let isVisible = this.tooltip.isVisible();
                if (isVisible) {
                    this.tooltip.hide();
                }
                this.tooltip.setText(isActive ? 'Hide selection' : 'Show selection');
                if (isVisible) {
                    this.tooltip.show();
                }
            });
        }
    }
}
