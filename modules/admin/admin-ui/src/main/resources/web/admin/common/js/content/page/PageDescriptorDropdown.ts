module api.content.page {

    import LoadedDataEvent = api.util.loader.event.LoadedDataEvent;
    import Option = api.ui.selector.Option;
    import SiteModel = api.content.site.SiteModel;
    import LiveEditModel = api.liveedit.LiveEditModel;
    import DescriptorBasedDropdown = api.content.page.region.DescriptorBasedDropdown;
    import ApplicationRemovedEvent = api.content.site.ApplicationRemovedEvent;

    export class PageDescriptorDropdown extends DescriptorBasedDropdown<PageDescriptor> {

        private loadedDataListeners: {(event: LoadedDataEvent<PageDescriptor>): void}[];

        private liveEditModel: LiveEditModel;

        private request: GetPageDescriptorsByApplicationsRequest;

        constructor(model: LiveEditModel) {

            super('page-controller', {
                optionDisplayValueViewer: new PageDescriptorViewer(),
                dataIdProperty: 'value'
            });

            this.loadedDataListeners = [];
            this.liveEditModel = model;

            this.initListeners();
        }

        protected createLoader(): api.util.loader.BaseLoader<PageDescriptorsJson, PageDescriptor> {
            this.request = new GetPageDescriptorsByApplicationsRequest(this.liveEditModel.getSiteModel().getApplicationKeys());

            return new api.util.loader.BaseLoader<PageDescriptorsJson, PageDescriptor>(this.request)
                    .setComparator(new api.content.page.DescriptorByDisplayNameComparator());
        }

        handleLoadedData(event: LoadedDataEvent<PageDescriptor>) {
            super.handleLoadedData(event);
            this.notifyLoadedData(event);
        }

        private initListeners() {
            this.onOptionSelected((event: api.ui.selector.OptionSelectedEvent<api.content.page.PageDescriptor>) => {
                var pageDescriptor = event.getOption().displayValue;
                var setController = new SetController(this).setDescriptor(pageDescriptor);
                this.liveEditModel.getPageModel().setController(setController);
            });

            var onApplicationAddedHandler = () => {
                this.updateRequestApplicationKeys();
                this.load();
            };

            var onApplicationRemovedHandler = (event: ApplicationRemovedEvent) => {

                let currentController = this.liveEditModel.getPageModel().getController();
                let removedApp = event.getApplicationKey();
                if (currentController && removedApp.equals(currentController.getKey().getApplicationKey())) {
                    // no need to load as current controller's app was removed
                    this.liveEditModel.getPageModel().reset();
                } else {
                    this.updateRequestApplicationKeys();
                    this.load();
                }
            };

            this.liveEditModel.getSiteModel().onApplicationAdded(onApplicationAddedHandler);

            this.liveEditModel.getSiteModel().onApplicationRemoved(onApplicationRemovedHandler);

            this.onRemoved(() => {
                this.liveEditModel.getSiteModel().unApplicationAdded(onApplicationAddedHandler);
                this.liveEditModel.getSiteModel().unApplicationRemoved(onApplicationRemovedHandler);
            })
        }

        onLoadedData(listener: (event: LoadedDataEvent<PageDescriptor>) => void) {
            this.loadedDataListeners.push(listener);
        }

        unLoadedData(listener: (event: LoadedDataEvent<PageDescriptor>) => void) {
            this.loadedDataListeners = this.loadedDataListeners.filter((currentListener: (event: LoadedDataEvent<PageDescriptor>)=>void)=> {
                return currentListener != listener;
            });
        }

        private notifyLoadedData(event: LoadedDataEvent<PageDescriptor>) {
            this.loadedDataListeners.forEach((listener: (event: LoadedDataEvent<PageDescriptor>)=>void)=> {
                listener.call(this, event);
            });
        }

        private updateRequestApplicationKeys() {
            this.request.setApplicationKeys(this.liveEditModel.getSiteModel().getApplicationKeys());
        }

    }
}