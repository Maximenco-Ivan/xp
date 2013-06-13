module app_ui {

    export class ContextMenu extends api_ui_menu.ContextMenu {

        constructor() {
            super(
                app.ContentActions.NEW_CONTENT,
                app.ContentActions.EDIT_CONTENT,
                app.ContentActions.OPEN_CONTENT,
                app.ContentActions.DELETE_CONTENT,
                app.ContentActions.DUPLICATE_CONTENT,
                app.ContentActions.MOVE_CONTENT
            );
        }
    }

}

