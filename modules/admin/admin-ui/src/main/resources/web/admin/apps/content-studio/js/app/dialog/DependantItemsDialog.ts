import "../../api.ts";
import {StatusSelectionItem} from "./StatusSelectionItem";
import {DependantItemViewer} from "./DependantItemViewer";

import ContentIconUrlResolver = api.content.ContentIconUrlResolver;
import ContentSummary = api.content.ContentSummary;
import GetDescendantsOfContents = api.content.GetDescendantsOfContents;
import ContentSummaryAndCompareStatusFetcher = api.content.ContentSummaryAndCompareStatusFetcher;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import CompareStatus = api.content.CompareStatus;
import BrowseItem = api.app.browse.BrowseItem;
import SelectionItem = api.app.browse.SelectionItem;
import ListBox = api.ui.selector.list.ListBox;
import LoadMask = api.ui.mask.LoadMask;
import DialogButton = api.ui.dialog.DialogButton;

export class DependantItemsDialog extends api.ui.dialog.ModalDialog {

    protected actionButton: DialogButton;

    private dialogName: string;

    private autoUpdateTitle: boolean = true;

    private ignoreItemsChanged: boolean;

    private subTitle: api.dom.H6El;

    private itemList: ListBox<ContentSummaryAndCompareStatus>;

    private dependantsContainer: api.dom.DivEl;

    private dependantsHeader: api.dom.H6El;

    private dependantList: ListBox<ContentSummaryAndCompareStatus>;

    protected loadMask: LoadMask;

    protected loading: boolean = false;

    protected loadingRequested: boolean = false;

    protected previousScrollTop: number;

    protected fullDependantSize: number;

    constructor(dialogName: string, dialogSubName: string, dependantsName: string) {
        super({
            title: new api.ui.dialog.ModalDialogHeader(dialogName)
        });
        this.addClass("dependant-dialog");

        this.dialogName = dialogName;

        this.subTitle = new api.dom.H6El("sub-title")
            .setHtml(dialogSubName, false);
        this.appendChildToTitle(this.subTitle);

        this.itemList = this.createItemList();
        this.itemList.addClass("item-list");
        this.appendChildToContentPanel(this.itemList);

        let itemsChangedListener = (items) => {
            let count = this.itemList.getItemCount();
            if (this.autoUpdateTitle) {
                this.setTitle(this.dialogName + (count > 1 ? "s" : ''));
            }

            this.toggleClass("contains-removable", (count > 1));
        };
        this.itemList.onItemsRemoved(itemsChangedListener);
        this.itemList.onItemsAdded(itemsChangedListener);

        this.dependantsHeader = new api.dom.H6El("dependants-header").setHtml(dependantsName, false);

        this.dependantList = this.createDependantList();
        this.dependantList.addClass("dependant-list");

        this.dependantsContainer = new api.dom.DivEl('dependants');
        this.dependantsContainer.appendChildren(this.dependantsHeader, this.dependantList);

        let dependantsChangedListener = (items) => {
            let count = this.dependantList.getItemCount();
            this.dependantsContainer.setVisible(count > 0);
        };
        this.dependantList.onItemsRemoved(dependantsChangedListener);
        this.dependantList.onItemsAdded(dependantsChangedListener);

        this.appendChildToContentPanel(this.dependantsContainer);

        this.initLoadMask();

        this.getContentPanel().onScrolled(() => {
            this.doPostLoad();
        });

        this.getContentPanel().onScroll(() => {
            this.doPostLoad();
        });

    }

    private initLoadMask() {
        this.loadMask = new LoadMask(this.getContentPanel());
    }

    protected createItemList(): ListBox<ContentSummaryAndCompareStatus> {
        return new DialogItemList();
    }

    protected createDependantList(): ListBox<ContentSummaryAndCompareStatus> {
        return new DialogDependantList();
    }

    protected getItemList(): ListBox<ContentSummaryAndCompareStatus> {
        return this.itemList;
    }

    protected getDependantList(): ListBox<ContentSummaryAndCompareStatus> {
        return this.dependantList;
    }

    protected getDependantSize(): number {
        return this.fullDependantSize;
    }

    protected isIgnoreItemsChanged(): boolean {
        return this.ignoreItemsChanged;
    }

    protected setIgnoreItemsChanged(value: boolean) {
        this.ignoreItemsChanged = value;
    }

    show() {
        api.dom.Body.get().appendChild(this);
        super.show();
        this.appendChildToContentPanel(this.loadMask);
        this.loadMask.show();
    }

    close() {
        super.close();
        this.remove();
        this.itemList.clearItems();
        this.dependantList.clearItems();
    }

    setAutoUpdateTitle(value: boolean) {
        this.autoUpdateTitle = value;
    }

    setListItems(items: ContentSummaryAndCompareStatus[]) {
        this.itemList.setItems(items);
        if (items.length == 1) {
            (<StatusSelectionItem>this.getItemList().getItemView(items[0])).hideRemoveButton();
        }
    }

    setDependantItems(items: ContentSummaryAndCompareStatus[]) {
        this.dependantList.setItems(items);
    }

    addDependantItems(items: ContentSummaryAndCompareStatus[]) {
        this.dependantList.addItems(items);
    }

    setSubTitle(text: string) {
        this.subTitle.setHtml(text);
    }

    protected updateButtonCount(actionString: string, count: number) {
        this.actionButton.setLabel(count > 1 ? actionString + "(" + count + ")" : actionString);
    }

    protected loadDescendants(from?: number,
                              size?: number, filterStatuses?: CompareStatus[]): wemQ.Promise<ContentSummaryAndCompareStatus[]> {

        let contents = this.getItemList().getItems();

        return new api.content.GetDescendantsOfContents().setFrom(from).setSize(size).
            setContentPaths(contents.map(content => content.getContentSummary().getPath())).
            setFilterStatuses(filterStatuses).sendAndParse()
            .then((result: api.content.ContentResponse<ContentSummary>) => {

                this.fullDependantSize = result.getMetadata().getTotalHits();

                return api.content.CompareContentRequest.fromContentSummaries(result.getContents()).sendAndParse()
                    .then((compareContentResults: api.content.CompareContentResults) => {
                        return ContentSummaryAndCompareStatusFetcher
                            .updateCompareStatus(result.getContents(), compareContentResults);
                    });
            });
    }

    protected countTotal(): number {
        return this.getItemList().getItemCount()
               + this.getDependantSize();
    }

    private doPostLoad() {
        if (this.previousScrollTop != this.getContentPanel().getEl().getScrollTop()) {
            setTimeout(this.postLoad.bind(this), 100);
        }
    }

    protected postLoad() {
        let lastVisible;

        this.previousScrollTop = this.getContentPanel().getEl().getScrollTop();

        let start = this.getContentPanel().getEl().getOffsetTop();
        let end = this.getContentPanel().getEl().getHeight() + start;

        let items = this.getDependantList().getItemViews();

        let visibleItems = [];

        for (let key in items) {
            let position = items[key].getEl().getOffsetTop();
            if (position >= start && position <= end) {
                visibleItems.push(items[key]);
            }
        }

        lastVisible = items.indexOf(visibleItems[visibleItems.length - 1]);

        let size = this.getDependantList().getItemCount();

        if (!this.loading) {
            if (lastVisible + GetDescendantsOfContents.LOAD_SIZE / 2 >= size) {

                this.loading = true;

                this.loadDescendants(size, GetDescendantsOfContents.LOAD_SIZE).then((newItems) => {

                    this.addDependantItems(newItems);
                    this.loading = false;
                    if (this.loadingRequested) {
                        this.loadingRequested = false;
                        this.postLoad();
                    }
                });
            }
        } else {
            this.loadingRequested = true;
        }
    }

    protected showLoadingSpinner() {
        this.actionButton.addClass("spinner");
    }

    protected hideLoadingSpinner() {
        this.actionButton.removeClass("spinner");
    }

}

export class DialogItemList extends ListBox<ContentSummaryAndCompareStatus> {

    constructor(className?: string) {
        super(className);

        this.onItemsRemoved((items: ContentSummaryAndCompareStatus[]) => {
            if (this.getItemCount() == 1) {
                (<StatusSelectionItem>this.getItemViews()[0]).hideRemoveButton();
            }
        });
    }

    createItemView(item: ContentSummaryAndCompareStatus, readOnly: boolean): api.dom.Element {
        let itemViewer = new api.content.ContentSummaryAndCompareStatusViewer();

        itemViewer.setObject(item);

        let browseItem = new BrowseItem<ContentSummaryAndCompareStatus>(item).
            setId(item.getId()).
            setDisplayName(item.getDisplayName()).
            setPath(item.getPath().toString()).
            setIconUrl(new ContentIconUrlResolver().setContent(item.getContentSummary()).resolve());

        return new StatusSelectionItem(itemViewer, browseItem, () => {
            this.removeItem(item);
        });
    }

    getItemId(item: ContentSummaryAndCompareStatus): string {
        return item.getContentSummary().getId();
    }

}

export class DialogDependantList extends ListBox<ContentSummaryAndCompareStatus> {

    constructor(className?: string) {
        super(className);
    }

    createItemView(item: ContentSummaryAndCompareStatus, readOnly: boolean): api.dom.Element {

        let dependantViewer = new DependantItemViewer();

        dependantViewer.setObject(item);

        let browseItem = new BrowseItem<ContentSummaryAndCompareStatus>(item).
            setId(item.getId()).
            setDisplayName(item.getDisplayName()).
            setPath(item.getPath().toString()).
            setIconUrl(new ContentIconUrlResolver().setContent(item.getContentSummary()).resolve());

        let selectionItem = new StatusSelectionItem(dependantViewer, browseItem);

        return selectionItem;
    }

    getItemId(item: ContentSummaryAndCompareStatus): string {
        return item.getContentSummary().getId();
    }
}

