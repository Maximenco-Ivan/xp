module LiveEdit {

    import Component = api.content.page.region.Component;
    import Page = api.content.page.Page;
    import Regions = api.content.page.region.Regions;
    import Region = api.content.page.region.Region;
    import ComponentType = api.content.page.region.ComponentType;
    import ComponentName = api.content.page.region.ComponentName;
    import DescriptorBasedComponentBuilder = api.content.page.region.DescriptorBasedComponentBuilder;
    import DescriptorBasedComponent = api.content.page.region.DescriptorBasedComponent;
    import ComponentView = api.liveedit.ComponentView;
    import PageView = api.liveedit.PageView;
    import PageViewBuilder = api.liveedit.PageViewBuilder;
    import ItemView = api.liveedit.ItemView;
    import RegionView = api.liveedit.RegionView;
    import ItemViewId = api.liveedit.ItemViewId;
    import LayoutComponentView = api.liveedit.layout.LayoutComponentView;
    import TextComponentView = api.liveedit.text.TextComponentView;
    import ComponentViewDragStartedEvent = api.liveedit.ComponentViewDragStartedEvent;
    import ComponentViewDragStoppedEvent = api.liveedit.ComponentViewDragStoppedEvent;
    import ComponentAddedEvent = api.liveedit.ComponentAddedEvent;
    import ItemViewDeselectEvent = api.liveedit.ItemViewDeselectEvent;
    import ComponentRemoveEvent = api.liveedit.ComponentRemovedEvent;
    import ItemViewSelectedEvent = api.liveedit.ItemViewSelectedEvent;
    import ComponentResetEvent = api.liveedit.ComponentResetEvent;
    import ItemViewIdProducer = api.liveedit.ItemViewIdProducer;
    import Shader = api.liveedit.Shader;
    import Highlighter = api.liveedit.Highlighter;
    import Cursor = api.liveedit.Cursor;
    import DragAndDrop = api.liveedit.DragAndDrop;
    import Exception = api.Exception;

    export class LiveEditPage {

        private pageView: PageView;

        private skipNextReloadConfirmation: boolean = false;

        constructor() {

            api.liveedit.SkipLiveEditReloadConfirmationEvent.on((event: api.liveedit.SkipLiveEditReloadConfirmationEvent) => {
                this.skipNextReloadConfirmation = event.isSkip();
            });

            api.liveedit.InitializeLiveEditEvent.on((event: api.liveedit.InitializeLiveEditEvent) => {

                var liveEditModel = event.getLiveEditModel();

                var body = api.dom.Body.get().loadExistingChildren();
                try {
                    this.pageView = new PageViewBuilder().
                        setItemViewProducer(new ItemViewIdProducer()).
                        setLiveEditModel(liveEditModel).
                        setElement(body).
                        build();
                } catch (error) {
                    if (api.ObjectHelper.iFrameSafeInstanceOf(error, Exception)) {
                        new api.liveedit.LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                                              error.getMessage()).fire();
                    } else {
                        new api.liveedit.LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                                              error).fire();
                    }
                    return;
                }

                DragAndDrop.init(this.pageView);

                api.ui.Tooltip.allowMultipleInstances(false);

                this.registerGlobalListeners();

                new api.liveedit.LiveEditPageViewReadyEvent(this.pageView).fire();
            });
        }


        private registerGlobalListeners(): void {

            api.dom.WindowDOM.get().asWindow().onbeforeunload = (event) => {
                if (!this.skipNextReloadConfirmation) {
                    var message = "This will close this wizard!";
                    (event || window.event)['returnValue'] = message;
                    return message;
                }
            };

            api.dom.WindowDOM.get().asWindow().onunload = (event) => {
                if (!this.skipNextReloadConfirmation) {
                    new api.liveedit.PageUnloadedEvent(this.pageView).fire();
                } else {
                    this.skipNextReloadConfirmation = false;
                }
            };

            api.liveedit.ComponentLoadedEvent.on((event: api.liveedit.ComponentLoadedEvent) => {

                if (api.liveedit.layout.LayoutItemType.get().equals(event.getItemView().getType())) {
                    DragAndDrop.get().createSortableLayout(event.getItemView());
                } else {
                    DragAndDrop.get().refreshSortable();
                }
            });

            ComponentResetEvent.on((event: ComponentResetEvent) => {
                DragAndDrop.get().refreshSortable();
            });

            ComponentViewDragStartedEvent.on(() => {
                Highlighter.get().hide();
                Shader.get().hide();
                Cursor.get().hide();

                // dragging anything should exit the text edit mode
                //this.exitTextEditModeIfNeeded();
            });

            ComponentViewDragStoppedEvent.on(() => {
                Cursor.get().reset();
            });

        }

    }
}