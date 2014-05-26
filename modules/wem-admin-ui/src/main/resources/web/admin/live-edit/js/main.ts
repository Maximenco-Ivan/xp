declare var Ext: Ext_Packages;
declare var Admin;
declare var CONFIG;

declare var wemjq: JQueryStatic;

function initializeLiveEdit() {
    //TODO: Maybe move/make more generic
    wemjq('[data-live-edit-empty-component="true"]').each((index, element) => {
        var type = wemjq(element).data('live-edit-type');
        var path: string = wemjq(element).data('live-edit-component');
        console.log("found empty component", type, path);
        var newEl;
        if (type === "image") {
            newEl = new LiveEdit.component.ImagePlaceholder();
        } else if (type === "part") {
            newEl = new LiveEdit.component.PartPlaceholder();
        } else if (type === "layout") {
            newEl = new LiveEdit.component.LayoutPlaceholder();
        }
        newEl.setComponentPath(api.content.page.ComponentPath.fromString(path));
        wemjq(element).replaceWith(newEl.getHTMLElement());
    });

    var body = api.dom.Body.getAndLoadExistingChildren();
    var map = new api.liveedit.PageComponentIdMapResolver(body).resolve();
    new api.liveedit.NewPageComponentIdMapEvent(map).fire();
}

function getComponentByPath(path: api.content.page.ComponentPath): api.liveedit.ItemView {
    return api.liveedit.ItemView.fromJQuery(wemjq('[data-live-edit-component="' + path.toString() + '"]'), false);
}

console.log("** USING jquery version" + wemjq.fn.jquery);

wemjq(window).load(() => {
    new LiveEdit.component.mouseevent.Page();
    new LiveEdit.component.mouseevent.Region();
    new LiveEdit.component.mouseevent.Layout();
    new LiveEdit.component.mouseevent.Part();
    new LiveEdit.component.mouseevent.Image();
    new LiveEdit.component.mouseevent.Text();
    new LiveEdit.component.mouseevent.Content();

    new LiveEdit.component.helper.ComponentResizeObserver();

    new LiveEdit.ui.Highlighter();
    new LiveEdit.ui.ToolTip();
    new LiveEdit.ui.Cursor();
    new LiveEdit.ui.contextmenu.ContextMenu();
    new LiveEdit.ui.Shader();
    new LiveEdit.ui.Editor();

    LiveEdit.component.dragdropsort.DragDropSort.init();

    wemjq(window).resize(() => wemjq(window).trigger('resizeBrowserWindow.liveEdit'));

    wemjq(window).unload(() => console.log('Clean up any css classes etc. that live edit / sortable has added'));

        //TODO: move this somewhere logical
        api.liveedit.PageComponentLoadedEvent.on((event: api.liveedit.PageComponentLoadedEvent) => {
            if (event.getItemView().getType() == api.liveedit.layout.LayoutItemType.get()) {
                LiveEdit.component.dragdropsort.DragDropSort.createSortableLayout(event.getItemView());
            }
        });
    });

    wemjq(document).ready(() => {
    // Prevent the user from clicking on things
    // This needs more work as we want them to click on Live Edit ui stuff.
        wemjq(document).on('mousedown', 'btn, button, a, select, input', (event) => {
            event.preventDefault();
        });

    // Notify parent frame if any modifier except shift is pressed
    // For the parent shortcuts to work if the inner iframe has focus
    wemjq(document).on("keypress keydown keyup", (event) => {

        if ((event.metaKey || event.ctrlKey || event.altKey) && event.keyCode) {
            wemjq(parent.document).simulate(event.type, {
                bubbles: event.bubbles,
                cancelable: event.cancelable,
                view: parent,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                metaKey: event.metaKey,
                keyCode: event.keyCode,
                charCode: event.charCode
            });
            return false;
        }
    });
});

