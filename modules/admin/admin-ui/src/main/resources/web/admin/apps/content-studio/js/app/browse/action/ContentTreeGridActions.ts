import "../../../api.ts";
import {ContentTreeGrid} from "../ContentTreeGrid";
import {ToggleSearchPanelAction} from "./ToggleSearchPanelAction";
import {ShowNewContentDialogAction} from "./ShowNewContentDialogAction";
import {PreviewContentAction} from "./PreviewContentAction";
import {EditContentAction} from "./EditContentAction";
import {DeleteContentAction} from "./DeleteContentAction";
import {DuplicateContentAction} from "./DuplicateContentAction";
import {MoveContentAction} from "./MoveContentAction";
import {SortContentAction} from "./SortContentAction";
import {PublishContentAction} from "./PublishContentAction";
import {PublishTreeContentAction} from "./PublishTreeContentAction";
import {UnpublishContentAction} from "./UnpublishContentAction";
import {ContentBrowseItem} from "../ContentBrowseItem";

import Action = api.ui.Action;
import TreeGridActions = api.ui.treegrid.actions.TreeGridActions;
import BrowseItem = api.app.browse.BrowseItem;
import BrowseItemsChanges = api.app.browse.BrowseItemsChanges;
import ContentSummary = api.content.ContentSummary;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import Content = api.content.Content;
import PermissionHelper = api.security.acl.PermissionHelper;
import AccessControlEntry = api.security.acl.AccessControlEntry;
import AccessControlList = api.security.acl.AccessControlList;
import ContentId = api.content.ContentId;
import ContentAccessControlList = api.security.acl.ContentAccessControlList;

export class ContentTreeGridActions implements TreeGridActions<ContentSummaryAndCompareStatus> {

    public SHOW_NEW_CONTENT_DIALOG_ACTION: Action;
    public PREVIEW_CONTENT: Action;
    public EDIT_CONTENT: Action;
    public DELETE_CONTENT: Action;
    public DUPLICATE_CONTENT: Action;
    public MOVE_CONTENT: Action;
    public SORT_CONTENT: Action;
    public PUBLISH_CONTENT: Action;
    public PUBLISH_TREE_CONTENT: Action;
    public UNPUBLISH_CONTENT: Action;
    public TOGGLE_SEARCH_PANEL: Action;

    private actions: api.ui.Action[] = [];

    constructor(grid: ContentTreeGrid) {
        this.TOGGLE_SEARCH_PANEL = new ToggleSearchPanelAction();

        this.SHOW_NEW_CONTENT_DIALOG_ACTION = new ShowNewContentDialogAction(grid);
        this.PREVIEW_CONTENT = new PreviewContentAction(grid);
        this.EDIT_CONTENT = new EditContentAction(grid);
        this.DELETE_CONTENT = new DeleteContentAction(grid);
        this.DUPLICATE_CONTENT = new DuplicateContentAction(grid);
        this.MOVE_CONTENT = new MoveContentAction(grid);
        this.SORT_CONTENT = new SortContentAction(grid);
        this.PUBLISH_CONTENT = new PublishContentAction(grid);
        this.PUBLISH_TREE_CONTENT = new PublishTreeContentAction(grid);
        this.UNPUBLISH_CONTENT = new UnpublishContentAction(grid);

        this.actions.push(
            this.SHOW_NEW_CONTENT_DIALOG_ACTION,
            this.EDIT_CONTENT, this.DELETE_CONTENT,
            this.DUPLICATE_CONTENT, this.MOVE_CONTENT,
            this.SORT_CONTENT, this.PREVIEW_CONTENT
        );

        let previewHandler = (<PreviewContentAction>this.PREVIEW_CONTENT).getPreviewHandler();

        previewHandler.onPreviewStateChanged((value) => {
            this.PREVIEW_CONTENT.setEnabled(value);
        })

    }

    getAllActions(): api.ui.Action[] {
        return [...this.actions, this.PUBLISH_CONTENT, this.UNPUBLISH_CONTENT];
    }

    getAllActionsNoPublish(): api.ui.Action[] {
        return this.actions;
    }

    updateActionsEnabledState(contentBrowseItems: ContentBrowseItem[],
                              changes?: BrowseItemsChanges<ContentSummaryAndCompareStatus>): wemQ.Promise<BrowseItem<ContentSummaryAndCompareStatus>[]> {

        this.TOGGLE_SEARCH_PANEL.setVisible(false);

        let contentSummaries: ContentSummary[] = contentBrowseItems.map((elem: ContentBrowseItem) => {
            return elem.getModel().getContentSummary();
        });

        let deferred = wemQ.defer<ContentBrowseItem[]>();

        let parallelPromises: wemQ.Promise<any>[];

        let previewHandler = (<PreviewContentAction>this.PREVIEW_CONTENT).getPreviewHandler();

        let publishEnabled = true;
        let treePublishEnabled = true;
        let unpublishEnabled = true;

        switch (contentBrowseItems.length) {
        case 0:
            this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(true);
            this.EDIT_CONTENT.setEnabled(false);
            this.DELETE_CONTENT.setEnabled(false);
            this.DUPLICATE_CONTENT.setEnabled(false);
            this.MOVE_CONTENT.setEnabled(false);
            this.SORT_CONTENT.setEnabled(false);

            this.PUBLISH_CONTENT.setEnabled(false);
            this.PUBLISH_CONTENT.setVisible(true);
            this.PUBLISH_TREE_CONTENT.setEnabled(false);
            this.UNPUBLISH_CONTENT.setEnabled(false);
            this.UNPUBLISH_CONTENT.setVisible(false);

            parallelPromises = [
                previewHandler.updateState(contentBrowseItems, changes),
                this.updateActionsEnabledStateByPermissions(contentBrowseItems)
            ];

            wemQ.all(parallelPromises).spread<void>(() => {
                deferred.resolve(contentBrowseItems);
                return wemQ(null);
            }).catch(api.DefaultErrorHandler.handle);
            break;
        case 1:
            let contentSummary = contentSummaries[0];
            this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(true);
            this.EDIT_CONTENT.setEnabled(!contentSummary ? false : contentSummary.isEditable());
            this.DELETE_CONTENT.setEnabled(!contentSummary ? false : contentSummary.isDeletable());
            this.DUPLICATE_CONTENT.setEnabled(true);
            this.MOVE_CONTENT.setEnabled(true);

            let publishEnabled = !this.isOnline(contentBrowseItems[0].getModel().getCompareStatus());
            let isPublished = this.isPublished(contentBrowseItems[0].getModel().getCompareStatus());


            if (this.isEveryLeaf(contentSummaries)) {
                treePublishEnabled = false;
                unpublishEnabled = isPublished;
            } else if (this.isOneNonLeaf(contentSummaries)) {
                // treePublishEnabled = true;
                unpublishEnabled = isPublished;
            }

            this.PUBLISH_CONTENT.setEnabled(publishEnabled);
            this.PUBLISH_TREE_CONTENT.setEnabled(treePublishEnabled);
            this.UNPUBLISH_CONTENT.setEnabled(unpublishEnabled);

            this.PUBLISH_CONTENT.setVisible(!isPublished);
            this.UNPUBLISH_CONTENT.setVisible(isPublished);

            this.SORT_CONTENT.setEnabled(true);
            // this.PREVIEW_CONTENT.setEnabled(false);
            parallelPromises = [
                previewHandler.updateState(contentBrowseItems, changes),
                this.updateActionsEnabledStateByPermissions(contentBrowseItems)
            ];
            wemQ.all(parallelPromises).spread<void>(() => {
                deferred.resolve(contentBrowseItems);
                return wemQ(null);
            }).catch(api.DefaultErrorHandler.handle);
            break;
        default:
            this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(false);
            //   this.PREVIEW_CONTENT.setEnabled(false);
            this.EDIT_CONTENT.setEnabled(this.anyEditable(contentSummaries));
            this.DELETE_CONTENT.setEnabled(this.anyDeletable(contentSummaries));
            this.DUPLICATE_CONTENT.setEnabled(false);
            this.MOVE_CONTENT.setEnabled(true);
            this.SORT_CONTENT.setEnabled(false);

            let anyUnpublished = contentBrowseItems.some((browseItem) => {
                return !this.isPublished(browseItem.getModel().getCompareStatus());
            });

            let anyPublished = contentBrowseItems.some((browseItem) => {
                return this.isPublished(browseItem.getModel().getCompareStatus());
            });

            if (this.isEveryLeaf(contentSummaries)) {
                //publishEnabled = anyUnpublished;
                treePublishEnabled = false;
                unpublishEnabled = anyPublished;
            } else if (this.isOneNonLeaf(contentSummaries)) {
                // publishEnabled = true;
                // treePublishEnabled = true;
                unpublishEnabled = anyPublished;
            } else if (this.isNonLeafInMany(contentSummaries)) {
                // publishEnabled = true;
                // treePublishEnabled = true;
                // unpublishEnabled = true;
            }

            this.PUBLISH_CONTENT.setEnabled(anyUnpublished);
            this.PUBLISH_TREE_CONTENT.setEnabled(treePublishEnabled);
            this.UNPUBLISH_CONTENT.setEnabled(unpublishEnabled);

            this.PUBLISH_CONTENT.setVisible(anyUnpublished);
            this.UNPUBLISH_CONTENT.setVisible(!anyUnpublished);

            parallelPromises = [
                previewHandler.updateState(contentBrowseItems, changes),
                this.updateActionsEnabledStateByPermissions(contentBrowseItems)
            ];
            wemQ.all(parallelPromises).spread<void>(() => {
                deferred.resolve(contentBrowseItems);
                return wemQ(null);
            }).catch(api.DefaultErrorHandler.handle);
        }
        return deferred.promise;
    }

    private isEveryLeaf(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.every((obj: ContentSummary) => !obj.hasChildren());
    }

    private isOneNonLeaf(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.length === 1 && contentSummaries[0].hasChildren();
    }

    private isNonLeafInMany(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.length > 1 && contentSummaries.some((obj: ContentSummary) => obj.hasChildren());
    }

    private isPublished(status: api.content.CompareStatus): boolean {
        return status != api.content.CompareStatus.NEW && status != api.content.CompareStatus.UNKNOWN;
    }

    private isOnline(status: api.content.CompareStatus): boolean {
        return status == api.content.CompareStatus.EQUAL;
    }

    private updateActionsEnabledStateByPermissions(contentBrowseItems: ContentBrowseItem[]): wemQ.Promise<any> {
        return new api.security.auth.IsAuthenticatedRequest().sendAndParse().then((loginResult: api.security.auth.LoginResult) => {
            switch (contentBrowseItems.length) {
            case 0:
                return this.updateActionsWhenNoItemsSelected(loginResult);
                break;
            case 1:
                return this.updateActionsWhenSingleItemSelected(loginResult, contentBrowseItems);
                break;
            default:
                return this.updateActionsWhenMultipleItemsSelected(loginResult, contentBrowseItems);
            }
        });
    }

    private updateActionsWhenNoItemsSelected(loginResult: api.security.auth.LoginResult): wemQ.Promise<any> {
        return new api.content.GetContentRootPermissionsRequest().sendAndParse().then((accessControlList: AccessControlList) => {
            var hasCreatePermission =
                PermissionHelper.hasPermission(api.security.acl.Permission.CREATE, loginResult, accessControlList);

            this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(hasCreatePermission);
        })
    }

    private updateActionsWhenSingleItemSelected(loginResult: api.security.auth.LoginResult,
                                                contentBrowseItems: ContentBrowseItem[]): wemQ.Promise<any> {
        var selectedItem = contentBrowseItems[0].getModel().getContentSummary();

        this.checkIsDuplicateAllowedByPermissions(selectedItem, loginResult).then((result: boolean) => {
            this.DUPLICATE_CONTENT.setEnabled(result);
        });

        return this.checkIsChildrenAllowedByPermissions(selectedItem).then((contentTypesAllowChildren: boolean) => {
            return this.updateActionsWhenMultipleItemsSelected(loginResult, contentBrowseItems, contentTypesAllowChildren);
        });
    }

    private updateActionsWhenMultipleItemsSelected(loginResult: api.security.auth.LoginResult, contentBrowseItems: ContentBrowseItem[],
                                                   contentTypesAllowChildren: boolean = true): wemQ.Promise<any> {
        let selectedItemsIds: ContentId[] = contentBrowseItems.map((contentBrowseItem: ContentBrowseItem) => {
            return contentBrowseItem.getModel().getContentId();
        });

        return new api.content.GetContentPermissionsByIdsRequest(selectedItemsIds).sendAndParse().then(
            (items: ContentAccessControlList[]) => {

                let canCreate = !items.some((item: ContentAccessControlList) => {
                    return !PermissionHelper.hasPermission(api.security.acl.Permission.CREATE,
                        loginResult, item)
                });

                let canDelete = !items.some((item: ContentAccessControlList) => {
                    return !PermissionHelper.hasPermission(api.security.acl.Permission.DELETE,
                        loginResult, item)
                });

                let canPublish = !items.some((item: ContentAccessControlList) => {
                    return !PermissionHelper.hasPermission(api.security.acl.Permission.PUBLISH,
                        loginResult, item)
                });

                if (!contentTypesAllowChildren || !canCreate) {
                    this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(false);
                    this.SORT_CONTENT.setEnabled(false);
                }

                if (!canDelete) {
                    this.DELETE_CONTENT.setEnabled(false);
                    this.MOVE_CONTENT.setEnabled(false);
                }

                if (!canPublish) {
                    this.PUBLISH_CONTENT.setEnabled(false);
                    this.PUBLISH_TREE_CONTENT.setEnabled(false);
                }

        });
    }

    private checkIsChildrenAllowedByPermissions(contentSummary: ContentSummary): wemQ.Promise<Boolean> {
        var deferred = wemQ.defer<boolean>();

        new api.schema.content.GetContentTypeByNameRequest(contentSummary.getType()).sendAndParse().then(
            (contentType: api.schema.content.ContentType) => {
                return deferred.resolve(contentType && contentType.isAllowChildContent());
            });

        return deferred.promise;
    }

    private checkIsDuplicateAllowedByPermissions(contentSummary: ContentSummary,
                                                 loginResult: api.security.auth.LoginResult): wemQ.Promise<Boolean> {
        var deferred = wemQ.defer<boolean>();

        if (contentSummary.hasParent()) {
            new api.content.GetContentByPathRequest(contentSummary.getPath().getParentPath()).sendAndParse().then(
                (parent: api.content.Content) => {

                    deferred.resolve(PermissionHelper.hasPermission(api.security.acl.Permission.CREATE,
                        loginResult,
                        parent.getPermissions()));
                });
        } else {
            new api.content.GetContentRootPermissionsRequest().sendAndParse().then((accessControlList: AccessControlList) => {

                deferred.resolve(PermissionHelper.hasPermission(api.security.acl.Permission.CREATE,
                    loginResult,
                    accessControlList));
            });
        }

        return deferred.promise;
    }

    private anyEditable(contentSummaries: api.content.ContentSummary[]): boolean {
        for (var i = 0; i < contentSummaries.length; i++) {
            var content: api.content.ContentSummary = contentSummaries[i];
            if (!!content && content.isEditable()) {
                return true;
            }
        }
        return false;
    }

    private anyDeletable(contentSummaries: api.content.ContentSummary[]): boolean {
        for (var i = 0; i < contentSummaries.length; i++) {
            var content: api.content.ContentSummary = contentSummaries[i];
            if (!!content && content.isDeletable()) {
                return true;
            }
        }
        return false;
    }
}
