module api.ui.selector.combobox {

    import NamesAndIconView = api.app.NamesAndIconView;
    export class RichSelectedOptionView<T> extends api.ui.selector.combobox.BaseSelectedOptionView<T> {

        private optionDisplayValue: T;

        private size: api.app.NamesAndIconViewSize;

        private draggable: boolean;
        private removable: boolean;

        private namesAndIconView: NamesAndIconView;

        constructor(builder: RichSelectedOptionViewBuilder<T>) {
            super(builder.option);

            this.optionDisplayValue = builder.option.displayValue;
            this.size = builder.size;

            this.setEditable(builder.editable);
            this.draggable = builder.draggable;
            this.removable = builder.removable;
        }

        resolveIconUrl(content: T): string {
            return '';
        }

        resolveTitle(content: T): string {
            return '';
        }

        resolveSubTitle(content: T): string {
            return '';
        }

        resolveIconClass(content: T): string {
            return '';
        }

        protected createActionButtons(content: T): api.dom.Element[] {
            let buttons = [];
            if (this.draggable) {
                buttons.push(new api.dom.DivEl('drag-control'));
            }
            if (this.isEditButtonNeeded()) {
                buttons.push(this.createEditButton(content));
            }
            if (this.removable) {
                buttons.push(this.createRemoveButton());
            }
            return buttons;
        }

        protected isEditButtonNeeded(): boolean {
            return this.isEditable();
        }

        protected createView(content: T): api.dom.Element {

            this.namesAndIconView = new api.app.NamesAndIconViewBuilder().setSize(this.size).build();

            this.setValues(content);

            return this.namesAndIconView;
        }

        setOption(option: api.ui.selector.Option<T>): any {
            super.setOption(option);

            this.setValues(option.displayValue);
        }

        private setValues(values: T) {
            this.namesAndIconView.setMainName(this.resolveTitle(values))
                .setSubName(this.resolveSubTitle(values));

            let url = this.resolveIconUrl(values);
            if (!api.util.StringHelper.isBlank(url)) {
                this.namesAndIconView.setIconUrl(this.resolveIconUrl(values) + '?crop=false');
            } else {
                this.namesAndIconView.setIconClass(this.resolveIconClass(values));
            }
        }

        protected createEditButton(content: T): api.dom.AEl {
            let editButton = new api.dom.AEl('edit');
            editButton.onClicked((event: Event) => {
                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            return editButton;
        }

        protected createRemoveButton(): api.dom.AEl {
            let removeButton = new api.dom.AEl('remove');
            removeButton.onClicked((event: Event) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            return removeButton;
        }

        doRender(): wemQ.Promise<boolean> {
            this.appendChildren(...this.createActionButtons(this.optionDisplayValue));
            this.appendChild(this.createView(this.optionDisplayValue));

            return wemQ(true);
        }
    }

    export class RichSelectedOptionViewBuilder<T> {
        option: api.ui.selector.Option<T>;
        size: api.app.NamesAndIconViewSize = api.app.NamesAndIconViewSize.small;

        editable: boolean = false;
        draggable: boolean = false;
        removable: boolean = true;

        constructor(option: api.ui.selector.Option<T>) {
            this.option = option;
        }

        setEditable(value: boolean): RichSelectedOptionViewBuilder<T> {
            this.editable = value;

            return this;
        }

        setDraggable(value: boolean): RichSelectedOptionViewBuilder<T> {
            this.draggable = value;

            return this;
        }

        setRemovable(value: boolean): RichSelectedOptionViewBuilder<T> {
            this.removable = value;

            return this;
        }

        setSize(size: api.app.NamesAndIconViewSize): RichSelectedOptionViewBuilder<T> {
            this.size = size;

            return this;
        }

        build(): RichSelectedOptionView<T> {
            return new RichSelectedOptionView(this);
        }
    }
}
