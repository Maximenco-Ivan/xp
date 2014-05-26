module LiveEdit.component.mouseevent {

    import ItemView = api.liveedit.ItemView;

    export class Base {
        public componentCssSelectorFilter: string = '';

        constructor() {
        }

        attachMouseOverEvent(): void {

            wemjq(document).on('mouseover', this.componentCssSelectorFilter, (event: JQueryEventObject) => {
                if (this.cancelMouseOverEvent(event)) {
                    return;
                }
                event.stopPropagation();

                LiveEdit.component.Selection.removeSelectedAttribute();
                var component = ItemView.fromJQuery(wemjq(event.currentTarget));

                wemjq(window).trigger('mouseOverComponent.liveEdit', [ component ]);
            });
        }

        attachMouseOutEvent(): void {
            wemjq(document).on('mouseout', () => {
                if (LiveEdit.component.Selection.pageHasSelectedElement()) {
                    return;
                }
                wemjq(window).trigger('mouseOutComponent.liveEdit');
            });
        }

        attachClickEvent(): void {

            wemjq(document).on('click contextmenu touchstart', this.componentCssSelectorFilter, (event: JQueryEventObject) => {
                if (this.targetIsLiveEditUiComponent(wemjq(event.target))) {
                    return;
                }

                // Make sure the event is not propagated to any parent
                event.stopPropagation();

                // Needed so the browser's context menu is not shown on contextmenu
                event.preventDefault();

                var itemView = ItemView.fromJQuery(wemjq(event.currentTarget));
//                var deselectComponent:boolean = component.isSelected() || LiveEdit.component.Selection.pageHasSelectedElement();
//
//                // Toggle select/deselect
//                if (deselectComponent) {
//                    LiveEdit.component.Selection.deselect();
//                } else {
                LiveEdit.component.Selection.handleSelect(itemView, event);
//                }
            });
        }

        // fixme: move when empty placeholder stuff is refactored
        getAll(): JQuery {
            return wemjq(this.componentCssSelectorFilter);
        }

        cancelMouseOverEvent(event: JQueryEventObject): boolean {
            return this.targetIsLiveEditUiComponent(wemjq(event.target)) || LiveEdit.component.Selection.pageHasSelectedElement() ||
                   LiveEdit.component.dragdropsort.DragDropSort.isDragging();
        }

        private targetIsLiveEditUiComponent(target: JQuery): boolean {
            return target.is('[id*=live-edit-ui-cmp]') || target.parents('[id*=live-edit-ui-cmp]').length > 0;
        }

    }
}
