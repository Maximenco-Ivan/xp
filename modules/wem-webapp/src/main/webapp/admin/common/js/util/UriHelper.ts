module api.util {
    /**
     * Creates an URI from supplied path.
     *
     * @param path path to append to base URI.
     * @returns {string} the URI (base + path).
     */
    export function getUri(path: string): string {
        return window['CONFIG']['baseUri'] + '/' + path;
    }

    /**
     * Creates an URI to an admin path.
     *
     * @param path path to append to base admin URI.
     * @returns {string} the URI to a admin path.
     */
    export function getAdminUri(path: string): string {
        return api.util.getUri('admin/' + path);
    }

    /**
     * Creates an URI to a rest service.
     *
     * @param path path to append to base rest URI.
     * @returns {string} the URI to a rest service.
     */
    export function getRestUri(path: string): string {
        return api.util.getAdminUri('rest/' + path);
    }

    export function getPortalUri(path: string, edit: boolean): string {
        if (edit) {
            return api.util.getUri('portal/edit/' + path);
        } else {
            return api.util.getUri('portal/live/' + path);
        }
    }

    export function getComponentUri(contentId: string, componentPath: string, edit: boolean) {
        return api.util.getPortalUri(contentId + "/_/component/" + componentPath, edit);
    }
}
