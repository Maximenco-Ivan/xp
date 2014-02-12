module app.wizard {

    import ComponentPath = api.content.page.ComponentPath;
    import ImageComponent = api.content.page.image.ImageComponent;
    import ImageComponentBuilder = api.content.page.image.ImageComponentBuilder;


    export interface LiveFormPanelConfig {

        siteTemplate:api.content.site.template.SiteTemplate;
        contentWizardPanel:ContentWizardPanel;
    }

    export class LiveFormPanel extends api.ui.Panel {

        private siteTemplate: api.content.site.template.SiteTemplate;
        private initialized: boolean;
        private defaultImageDescriptor: api.content.page.image.ImageDescriptor

        private pageContent: api.content.Content;
        private pageTemplate: api.content.page.PageTemplate;
        private selectedComponent: app.contextwindow.Component;
        private pageRegions: api.content.page.PageRegions;

        private pageNeedsReload: boolean;
        private pageLoading: boolean;

        private pageSkipReload: boolean;
        private frame: api.dom.IFrameEl;
        private baseUrl: string;

        private pageUrl: string;
        private contextWindow: app.contextwindow.ContextWindow;
        private liveEditWindow: any;
        private liveEditJQuery: JQueryStatic;

        private contentWizardPanel: ContentWizardPanel;

        constructor(config: LiveFormPanelConfig) {
            super("live-form-panel");
            this.contentWizardPanel = config.contentWizardPanel;
            this.siteTemplate = config.siteTemplate;

            this.initialized = false;

            this.pageNeedsReload = true;
            this.pageLoading = false;
            this.pageSkipReload = false;

            this.baseUrl = api.util.getUri("portal/edit/");
            this.frame = new api.dom.IFrameEl();
            this.frame.addClass("live-edit-frame");
            this.appendChild(this.frame);
        }

        private initialize(): Q.Promise<void> {
            var deferred = Q.defer<void>();

            if (!this.initialized) {

                this.resolveDefaultImageDescriptor(this.siteTemplate.getModules()).
                    done((imageDescriptor: api.content.page.image.ImageDescriptor)=> {

                        this.defaultImageDescriptor = imageDescriptor;
                        this.initialized = true;
                        deferred.resolve(null);
                    });
            }
            else {
                deferred.resolve(null);
            }

            return deferred.promise;
        }

        loadPageIfNotLoaded(): Q.Promise<void> {

            console.log("LiveFormPanel.loadPageIfNotLoaded() this.needsReload = " + this.pageNeedsReload);
            var deferred = Q.defer<void>();

            this.initialize().done(() => {

                if (this.pageNeedsReload && !this.pageLoading) {

                    this.pageLoading = true;
                    this.doLoad().done(()=> {

                        this.pageLoading = false;
                        this.pageNeedsReload = false;

                        this.setupContextWindow();
                        deferred.resolve(null);
                    });
                }
                else {
                    deferred.resolve(null);
                }
            });

            return deferred.promise;
        }


        private doLoad(): Q.Promise<void> {

            console.log("LiveFormPanel.doLoad() ... url: " + this.pageUrl);

            api.util.assertNotNull(this.pageUrl, "No page to load");

            var deferred = Q.defer<void>();

            this.frame.setSrc(this.pageUrl);

            var maxIterations = 100;
            var iterations = 0;
            var pageLoaded = false;
            var intervalId = setInterval(() => {

                if (this.frame.isLoaded()) {
                    var liveEditWindow = this.frame.getHTMLElement()["contentWindow"];
                    if (liveEditWindow && liveEditWindow.$liveEdit) {

                        // Give loaded page same CONFIG.baseUri as in admin
                        liveEditWindow.CONFIG = {};
                        liveEditWindow.CONFIG.baseUri = CONFIG.baseUri

                        var pageLoaded = true;
                        clearInterval(intervalId);

                        console.log("LiveFormPanel.doLoad() ... Live edit loaded");

                        deferred.resolve(null);
                    }
                }

                iterations++;
                if (!pageLoaded && iterations >= maxIterations) {
                    clearInterval(intervalId);
                    if (pageLoaded) {
                        deferred.resolve(null);
                    }
                    else {
                        deferred.reject(null);
                    }
                }
            }, 50);

            return deferred.promise;
        }

        renderExisting(content: api.content.Content, pageTemplate: api.content.page.PageTemplate) {

            console.log("LiveFormPanel.renderExisting() ...");

            api.util.assertNotNull(content, "Expected content not be null");
            api.util.assertNotNull(pageTemplate, "Expected content not be null");
            api.util.assert(content.isPage(), "Expected content to be a page: " + content.getPath().toString());

            this.pageContent = content;
            this.pageTemplate = pageTemplate;
            this.pageUrl = this.baseUrl + content.getContentId().toString();

            console.log("LiveFormPanel.renderExisting() ... pageSkipReload = " + this.pageSkipReload);

            if (!this.pageSkipReload) {
                this.pageRegions = this.resolvePageRegions();
            }

            if (!this.isVisible()) {

                this.pageNeedsReload = true;

                console.log("LiveFormPanel.renderExisting() ... not visible, returning");
                return;
            }

            if (this.pageSkipReload == true) {
                console.log("LiveFormPanel.renderExisting() ... skipReload is true, returning");
                return;
            }

            this.doLoad().
                then(() => {

                    this.setupContextWindow();

                }).fail(()=> {
                    console.log("LiveFormPanel.renderExisting() loading Live edit failed (time out)");
                }).done();
        }

        private resolvePageRegions(): api.content.page.PageRegions {

            var page = this.pageContent.getPage();
            if (page.hasRegions()) {
                return page.getRegions();
            }
            else {
                return this.pageTemplate.getRegions();
            }
        }

        private setupContextWindow() {

            if (this.contextWindow) {
                // Have to remove previous ContextWindow to avoid two
                // TODO: ContextWindow should be resued with new values instead
                this.contextWindow.remove();
            }

            this.contextWindow = this.createContextWindow();

            this.appendChild(this.contextWindow);

            this.liveEditListen();
        }

        private createContextWindow(): app.contextwindow.ContextWindow {

            this.liveEditWindow = this.frame.getHTMLElement()["contentWindow"];
            this.liveEditJQuery = <JQueryStatic>this.liveEditWindow.$liveEdit;

            var contextWindow = new app.contextwindow.ContextWindow({
                liveEditIFrame: this.frame,
                siteTemplate: this.siteTemplate,
                liveEditWindow: this.liveEditWindow,
                liveEditJQuery: this.liveEditJQuery,
                liveFormPanel: this
            });

            return contextWindow;
        }


        public getRegions(): api.content.page.PageRegions {

            return this.pageRegions;
        }

        getDefaultImageDescriptor(): api.content.page.image.ImageDescriptor {
            return this.defaultImageDescriptor;
        }

        private resolveDefaultImageDescriptor(moduleKeys: api.module.ModuleKey[]): Q.Promise<api.content.page.image.ImageDescriptor> {

            var d = Q.defer<api.content.page.image.ImageDescriptor>();
            new api.content.page.image.GetImageDescriptorsByModulesRequest(moduleKeys).
                sendAndParse().done((imageDescriptors: api.content.page.image.ImageDescriptor[]) => {
                    if (imageDescriptors.length == 0) {
                        d.resolve(null);
                    }
                    else {
                        d.resolve(imageDescriptors[0]);
                    }
                });
            return d.promise;
        }


        private liveEditListen() {
            this.liveEditJQuery(this.liveEditWindow).on('selectComponent.liveEdit',
                (event, component?, mouseClickPagePosition?) => {
                    new app.contextwindow.SelectComponentEvent(<app.contextwindow.Component>component).fire();
                    this.selectedComponent = component;
                });

            this.liveEditJQuery(this.liveEditWindow).on('componentSelect.liveEdit',
                (event, name?) => {
                    new app.contextwindow.ComponentSelectEvent(new api.content.page.ComponentName(name)).fire();
                });

            this.liveEditJQuery(this.liveEditWindow).on('pageSelect.liveEdit',
                (event) => {
                    new app.contextwindow.PageSelectEvent().fire();
                });

            this.liveEditJQuery(this.liveEditWindow).on('regionSelect.liveEdit',
                (event, name?) => {
                    new app.contextwindow.RegionSelectEvent(name).fire();
                });

            this.liveEditJQuery(this.liveEditWindow).on('deselectComponent.liveEdit', (event) => {
                new app.contextwindow.ComponentDeselectEvent().fire();
                this.selectedComponent = null;
            });

            this.liveEditJQuery(this.liveEditWindow).on('componentRemoved.liveEdit', (event, component?) => {
                new app.contextwindow.ComponentRemovedEvent().fire();
                if (component) {
                    this.pageRegions.removeComponent(api.content.page.ComponentPath.fromString(component.getComponentPath()));
                    this.selectedComponent = null;
                }
            });
            this.liveEditJQuery(this.liveEditWindow).on('sortableStop.liveEdit', (event) => {
                new app.contextwindow.LiveEditDragStopEvent().fire();
                this.contextWindow.show();
            });
            this.liveEditJQuery(this.liveEditWindow).on('sortableStart.liveEdit', (event) => {
                new app.contextwindow.LiveEditDragStartEvent().fire();
                this.contextWindow.hide();
            });
            this.liveEditJQuery(this.liveEditWindow).on('sortableUpdate.liveEdit', (event, component?) => {
                if (component) {
                    var componentPath = api.content.page.ComponentPath.fromString(component.getComponentPath());
                    var afterComponentPath = api.content.page.ComponentPath.fromString(component.getPrecedingComponentPath());
                    this.pageRegions.moveComponent(componentPath, component.getRegionName(), afterComponentPath);
                }
            });


            this.liveEditJQuery(this.liveEditWindow).on('componentAdded.liveEdit',
                (event, component?, regionName?, componentPathToAddAfterAsString?: string) => {
                    //TODO: Make all components work and not only image

                    var componentName = this.pageRegions.ensureUniqueComponentName(new api.content.page.ComponentName("Image"));

                    var componentToAddAfter: api.content.page.ComponentPath = null;
                    if (componentPathToAddAfterAsString) {
                        componentToAddAfter = api.content.page.ComponentPath.fromString(componentPathToAddAfterAsString);
                    }

                    var regionPath: api.content.page.RegionPath;
                    if (componentToAddAfter != null) {
                        regionPath = componentToAddAfter.getRegionPath();
                    }
                    else {
                        regionPath = api.content.page.RegionPath.fromString(regionName);
                    }

                    var imageComponent = new ImageComponentBuilder();
                    imageComponent.setName(componentName);
                    imageComponent.setRegion(regionPath);

                    var componentPath;
                    if (componentToAddAfter) {
                        componentPath = this.pageRegions.addComponentAfter(imageComponent.build(), componentToAddAfter);
                    }
                    else {
                        this.pageRegions.addComponentFirst(imageComponent.build(), regionName);
                        componentPath = ComponentPath.fromString(regionName + "/" + componentName.toString());
                    }

                    component.getEl().setData("live-edit-component", componentPath.toString());
                    component.getEl().setData("live-edit-name", componentName.toString());
                });

            this.liveEditJQuery(this.liveEditWindow).on('imageComponentSetImage.liveEdit',
                (event, imageId?, componentPathAsString?, component?) => {

                    component.showLoadingSpinner();
                    var componentPath = ComponentPath.fromString(componentPathAsString);
                    var imageComponent = this.pageRegions.getImageComponent(componentPath);
                    if (imageComponent != null) {
                        imageComponent.setImage(imageId);
                        if (this.defaultImageDescriptor) {
                            imageComponent.setDescriptor(this.defaultImageDescriptor.getKey());
                        }

                        this.pageSkipReload = true;
                        this.contentWizardPanel.saveChanges().done(() => {
                            this.pageSkipReload = false;
                            $.ajax({
                                url: api.util.getComponentUri(this.pageContent.getContentId().toString(), componentPath.toString(),
                                    true),
                                method: 'GET',
                                success: (data) => {
                                    var newElement = $(data);
                                    $(component.getHTMLElement()).replaceWith(newElement);
                                    this.liveEditWindow.LiveEdit.component.Selection.deselect();
                                    this.liveEditWindow.LiveEdit.component.Selection.handleSelect(newElement[0]);
                                }
                            });
                        })

                    }
                    else {
                        console.log("ImageComponent to set image on not found: " + componentPath);
                    }
                });
        }
    }
}