module api.liveedit {

    import Component = api.content.page.region.Component;
    import ComponentPath = api.content.page.region.ComponentPath;
    import ComponentName = api.content.page.region.ComponentName;
    import DescriptorBasedComponent = api.content.page.region.DescriptorBasedComponent;
    import ComponentPropertyChangedEvent = api.content.page.region.ComponentPropertyChangedEvent;
    import ComponentResetEvent = api.content.page.region.ComponentResetEvent;

    export class ComponentViewBuilder<COMPONENT extends Component> {

        itemViewProducer: ItemViewIdProducer;

        type: ComponentItemType;

        parentRegionView: RegionView;

        parentElement: api.dom.Element;

        component: COMPONENT;

        element: api.dom.Element;

        positionIndex: number;

        contextMenuActions: api.ui.Action[];

        placeholder: ComponentPlaceholder;

        tooltipViewer: api.ui.Viewer<any>;

        /**
         * Optional. The ItemViewIdProducer of parentRegionView will be used if not set.
         */
        setItemViewProducer(value: ItemViewIdProducer): ComponentViewBuilder<COMPONENT> {
            this.itemViewProducer = value;
            return this;
        }

        setType(value: ComponentItemType): ComponentViewBuilder<COMPONENT> {
            this.type = value;
            return this;
        }

        setParentRegionView(value: RegionView): ComponentViewBuilder<COMPONENT> {
            this.parentRegionView = value;
            return this;
        }

        setParentElement(value: api.dom.Element): ComponentViewBuilder<COMPONENT> {
            this.parentElement = value;
            return this;
        }

        setComponent(value: COMPONENT): ComponentViewBuilder<COMPONENT> {
            this.component = value;
            return this;
        }

        setElement(value: api.dom.Element): ComponentViewBuilder<COMPONENT> {
            this.element = value;
            return this;
        }

        setPositionIndex(value: number): ComponentViewBuilder<COMPONENT> {
            this.positionIndex = value;
            return this;
        }

        setContextMenuActions(actions: api.ui.Action[]): ComponentViewBuilder<COMPONENT> {
            this.contextMenuActions = actions;
            return this;
        }

        setPlaceholder(value: ComponentPlaceholder): ComponentViewBuilder<COMPONENT> {
            this.placeholder = value;
            return this;
        }

        setTooltipViewer(value: api.ui.Viewer<any>): ComponentViewBuilder<COMPONENT> {
            this.tooltipViewer = value;
            return this;
        }
    }

    export class ComponentView<COMPONENT extends Component> extends ItemView implements api.Cloneable {

        private parentRegionView: RegionView;

        private component: COMPONENT;

        private moving: boolean;

        private itemViewAddedListeners: {(event: ItemViewAddedEvent) : void}[];

        private itemViewRemovedListeners: {(event: ItemViewRemovedEvent) : void}[];

        private propertyChangedListener: (event: ComponentPropertyChangedEvent) => void;

        private resetListener: (event: ComponentResetEvent) => void;

        public static debug: boolean = false;

        constructor(builder: ComponentViewBuilder<COMPONENT>) {

            this.itemViewAddedListeners = [];
            this.itemViewRemovedListeners = [];
            this.moving = false;
            this.parentRegionView = builder.parentRegionView;

            super(new ItemViewBuilder().
                    setItemViewIdProducer(builder.itemViewProducer
                        ? builder.itemViewProducer
                        : builder.parentRegionView.getItemViewIdProducer()).
                    setPlaceholder(builder.placeholder).
                    setTooltipViewer(builder.tooltipViewer).
                    setType(builder.type).
                    setElement(builder.element).
                    setParentView(builder.parentRegionView).
                    setParentElement(builder.parentElement).
                    setContextMenuActions(this.createComponentContextMenuActions(builder.contextMenuActions)).
                    setContextMenuTitle(new ComponentViewContextMenuTitle(builder.component, builder.type))
            );

            this.propertyChangedListener = () => this.refreshEmptyState();
            this.resetListener = () => {
                // recreate the component view from scratch
                // if the component has been reset
                this.deselect();
                var clone = this.clone();
                this.replaceWith(clone);
                clone.select();

                new api.liveedit.ComponentResetEvent(clone).fire();
            };

            this.setComponent(builder.component);

            // TODO: by task about using HTML5 DnD api (JVS 2014-06-23) - do not remove
            //this.setDraggable(true);
            //this.onDragStart(this.handleDragStart2.bind(this));
            //this.onDrag(this.handleDrag.bind(this));
            //this.onDragEnd(this.handleDragEnd.bind(this));
        }

        //remove(): ComponentView {
        //    super.remove();
        //    this.unregisterComponentListeners(this.component);
        //    return this;
        //}

        private registerComponentListeners(component: COMPONENT) {
            component.onReset(this.resetListener);
            component.onPropertyChanged(this.propertyChangedListener);
        }

        private unregisterComponentListeners(component: COMPONENT) {
            component.unPropertyChanged(this.propertyChangedListener);
            component.unReset(this.resetListener);
        }

        private createComponentContextMenuActions(actions: api.ui.Action[]): api.ui.Action[] {
            var actions = actions || [];
            actions.push(new api.ui.Action("Parent").onExecuted(() => {
                var parentView: ItemView = this.getParentItemView();
                if (parentView) {
                    this.deselect();
                    parentView.select(null, ItemViewContextMenuPosition.TOP);
                    parentView.scrollComponentIntoView();
                }
            }));
            actions.push(new api.ui.Action("Empty").onExecuted(() => {
                this.component.reset();
            }));
            actions.push(new api.ui.Action("Remove").onExecuted(() => {
                this.deselect();
                this.remove();
            }));
            actions.push(new api.ui.Action("Duplicate").onExecuted(() => {
                this.deselect();

                var duplicatedComponent = <COMPONENT> this.getComponent().duplicate();
                var duplicatedView = this.duplicate(duplicatedComponent);

                duplicatedView.select();
                duplicatedView.showLoadingSpinner();

                new ComponentDuplicatedEvent(this, duplicatedView).fire();
            }));
            return actions;
        }

        remove(): ComponentView<Component> {
            this.unregisterComponentListeners(this.component);

            var parentView = this.getParentItemView();
            if (parentView) {
                parentView.removeComponentView(this);
            }

            super.remove();

            return this;
        }

        getType(): ComponentItemType {
            return <ComponentItemType>super.getType();
        }

        setComponent(component: COMPONENT) {
            if (component) {
                if (this.component) {
                    this.unregisterComponentListeners(this.component);
                }
                this.setTooltipObject(component);
                this.registerComponentListeners(component);
            }

            this.component = component;
            this.refreshEmptyState();
        }

        getComponent(): COMPONENT {
            return this.component;
        }

        hasComponentPath(): boolean {
            return this.component && this.component.hasPath();
        }

        getComponentPath(): ComponentPath {
            return this.hasComponentPath() ? this.component.getPath() : null;
        }

        getName(): string {
            return this.component && this.component.getName() ? this.component.getName().toString() : null;
        }

        getParentItemView(): RegionView {
            return this.parentRegionView;
        }

        setParentItemView(regionView: RegionView) {
            super.setParentItemView(regionView);
            this.parentRegionView = regionView;
        }

        setMoving(value: boolean) {
            this.moving = value;
        }

        isMoving(): boolean {
            return this.moving;
        }

        clone(): ComponentView<Component> {

            var index = this.getParentItemView().getComponentViewIndex(this);

            var clone = this.getType().createView(
                new CreateItemViewConfig<RegionView,Component>().
                    setParentView(this.getParentItemView()).
                    setParentElement(this.getParentElement()).
                    setData(this.getComponent()).
                    setPositionIndex(index));

            return clone;
        }

        duplicate(duplicate: COMPONENT): ComponentView<Component> {

            var parentView = this.getParentItemView();
            var index = parentView.getComponentViewIndex(this);

            var duplicateView = this.getType().createView(
                new CreateItemViewConfig<RegionView,Component>().
                    setParentView(this.getParentItemView()).
                    setParentElement(this.getParentElement()).
                    setData(duplicate).
                    setPositionIndex(index + 1));

            parentView.addComponentView(duplicateView, index + 1);

            return duplicateView;
        }

        toString() {
            var extra = "";
            if (this.hasComponentPath()) {
                extra = " : " + this.getComponentPath().toString();
            }
            return super.toString() + extra;
        }

        replaceWith(replacement: ComponentView<Component>) {
            if (ComponentView.debug) {
                console.log('ComponentView[' + this.toString() + '].replaceWith', this, replacement);
            }
            super.replaceWith(replacement);

            var index = this.getParentItemView().getComponentViewIndex(this);

            // unbind the old view from the component and bind the new one
            this.unregisterComponentListeners(this.component);

            var parentRegionView = this.parentRegionView;
            this.parentRegionView.unregisterComponentView(this);
            parentRegionView.registerComponentView(replacement, index);
        }

        moveToRegion(toRegionView: RegionView, toIndex: number) {
            if (ComponentView.debug) {
                console.log('ComponentView[' + this.toString() + '].moveToRegion', this, this.parentRegionView, toRegionView);
            }

            this.moving = false;

            if (this.parentRegionView.getRegionPath().equals(toRegionView.getRegionPath()) &&
                toIndex == this.parentRegionView.getComponentViewIndex(this)) {

                if (ComponentView.debug) {
                    console.debug('Dropped in the same region at the same index, no need to move', this.parentRegionView, toRegionView);
                }
                return;
            }

            // Unregister from previous region...
            var parentView = this.getParentItemView();
            if (parentView) {
                parentView.removeComponentView(this);
            }

            // Register with new region...
            toRegionView.addComponentView(this, toIndex);
        }

        onItemViewAdded(listener: (event: ItemViewAddedEvent) => void) {
            this.itemViewAddedListeners.push(listener);
        }

        unItemViewAdded(listener: (event: ItemViewAddedEvent) => void) {
            this.itemViewAddedListeners = this.itemViewAddedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        notifyItemViewAdded(view: ItemView) {
            var event = new ItemViewAddedEvent(view);
            this.itemViewAddedListeners.forEach((listener) => {
                listener(event);
            });
        }

        onItemViewRemoved(listener: (event: ItemViewRemovedEvent) => void) {
            this.itemViewRemovedListeners.push(listener);
        }

        unItemViewRemoved(listener: (event: ItemViewRemovedEvent) => void) {
            this.itemViewRemovedListeners = this.itemViewRemovedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        notifyItemViewRemoved(view: ItemView) {
            var event = new ItemViewRemovedEvent(view);
            this.itemViewRemovedListeners.forEach((listener) => {
                listener(event);
            });
        }


        static findParentRegionViewHTMLElement(htmlElement: HTMLElement): HTMLElement {

            var parentItemView = ItemView.findParentItemViewAsHTMLElement(htmlElement);
            while (!RegionView.isRegionViewFromHTMLElement(parentItemView)) {
                parentItemView = ItemView.findParentItemViewAsHTMLElement(parentItemView);
            }
            return parentItemView;
        }


        // TODO: by task about using HTML5 DnD api (JVS 2014-06-23) - do not remove
        private handleDragStart2(event: DragEvent) {

            if (event.target === this.getHTMLElement()) {
                event.dataTransfer.effectAllowed = "move";
                //event.dataTransfer.setData('text/plain', 'This text may be dragged');
                console.log("ComponentView[" + this.getItemId().toNumber() + "].handleDragStart", event, this.getHTMLElement());
                this.hideTooltip();
            }
        }

        // TODO: by task about using HTML5 DnD api (JVS 2014-06-23) - do not remove
        private handleDrag(event: DragEvent) {
            if (event.target === this.getHTMLElement()) {
                console.log("ComponentView[" + this.getItemId().toNumber() + "].handleDrag", event, this.getHTMLElement());
            }
        }

        // TODO: by task about using HTML5 DnD api (JVS 2014-06-23) - do not remove
        private handleDragEnd(event: DragEvent) {
            if (event.target === this.getHTMLElement()) {
                console.log("ComponentView[" + this.getItemId().toNumber() + "].handleDragEnd", event, this.getHTMLElement());
                //this.hideTooltip();
            }
        }
    }
}