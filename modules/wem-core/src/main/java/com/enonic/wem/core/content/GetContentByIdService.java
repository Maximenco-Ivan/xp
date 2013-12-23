package com.enonic.wem.core.content;

import javax.jcr.Session;

import com.enonic.wem.api.command.content.GetContentById;
import com.enonic.wem.api.command.entity.GetNodeById;
import com.enonic.wem.api.content.Content;
import com.enonic.wem.api.content.ContentNotFoundException;
import com.enonic.wem.api.entity.EntityId;
import com.enonic.wem.api.entity.NoEntityWithIdFound;
import com.enonic.wem.api.entity.Node;
import com.enonic.wem.core.entity.GetNodeByIdService;

class GetContentByIdService
extends ContentService
{
    private final GetContentById command;

    GetContentByIdService( final Session session, final GetContentById command )
    {
        super( session );
        this.command = command;
    }

    public Content execute()
    {
        final GetNodeById getNodeByIdCommand = new GetNodeById( EntityId.from( command.getId().toString() ) );

        try
        {
            final Node node = new GetNodeByIdService( session, getNodeByIdCommand ).execute();
            return CONTENT_TO_NODE_TRANSLATOR.fromNode( node );
        }
        catch ( NoEntityWithIdFound e )
        {
            throw new ContentNotFoundException( command.getId() );
        }
    }
}
