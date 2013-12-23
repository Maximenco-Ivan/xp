package com.enonic.wem.core.content;

import com.enonic.wem.api.content.ContentPath;
import com.enonic.wem.api.content.ContentPaths;
import com.enonic.wem.api.entity.NodePath;
import com.enonic.wem.api.entity.NodePaths;
import com.enonic.wem.core.entity.dao.NodeJcrDao;

public class ContentNodeHelper
{
    public static NodePath translateContentPathToNodePath( final ContentPath contentPath )
    {
        return new NodePath( NodeJcrDao.CONTENT_ROOT_NODE_NAME + "/" + contentPath.toString() ).asAbsolute();
    }

    public static NodePaths translateContentPathsToNodePaths( final ContentPaths contentPaths )
    {
        final NodePaths.Builder builder = NodePaths.newNodePaths();
        for ( final ContentPath contentPath : contentPaths )
        {
            builder.addNodePath( ContentNodeHelper.translateContentPathToNodePath( contentPath ) );
        }

        return builder.build();
    }

}


