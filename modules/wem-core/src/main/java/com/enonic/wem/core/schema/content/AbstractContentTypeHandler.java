package com.enonic.wem.core.schema.content;

import com.enonic.wem.api.command.Command;
import com.enonic.wem.api.command.Commands;
import com.enonic.wem.api.command.entity.GetNodesByParent;
import com.enonic.wem.api.entity.Node;
import com.enonic.wem.api.entity.NodePath;
import com.enonic.wem.api.entity.Nodes;
import com.enonic.wem.api.form.Form;
import com.enonic.wem.api.form.MixinReferencesToFormItemsTransformer;
import com.enonic.wem.api.schema.content.ContentType;
import com.enonic.wem.api.schema.content.ContentTypes;
import com.enonic.wem.core.command.CommandHandler;
import com.enonic.wem.core.entity.GetNodesByParentService;

public abstract class AbstractContentTypeHandler<T extends Command>
    extends CommandHandler<T>
{
    private final static ContentTypeNodeTranslator CONTENT_TYPE_NODE_TRANSLATOR = new ContentTypeNodeTranslator();

    ContentTypes getAllContentTypes()
    {
        final GetNodesByParent getNodesByParentCommand = Commands.node().get().byParent( new NodePath( "/content-types" ) );

        final Nodes nodes = getNodesByParent( getNodesByParentCommand );

        return CONTENT_TYPE_NODE_TRANSLATOR.fromNodes( nodes );
    }

    private Nodes getNodesByParent( final GetNodesByParent getNodesByParentCommand )
    {
        return new GetNodesByParentService( this.context.getJcrSession(), getNodesByParentCommand ).execute();
    }

    ContentType transformMixinReferences( final ContentType contentType )
    {
        final ContentTypes contentTypes = doTranformMixinReferences( ContentTypes.from( contentType ) );

        return contentTypes.get( 0 );
    }

    ContentTypes transformMixinReferences( final ContentTypes contentTypes )
    {
        return doTranformMixinReferences( contentTypes );
    }

    private ContentTypes doTranformMixinReferences( final ContentTypes contentTypes )
    {
        final MixinReferencesToFormItemsTransformer transformer = new MixinReferencesToFormItemsTransformer( context.getClient() );

        ContentTypes.Builder transformedContentTypes = ContentTypes.newContentTypes();
        for ( final ContentType contentType : contentTypes )
        {
            final Form transformedForm = transformer.transformForm( contentType.form() );
            final ContentType transformedCty = ContentType.newContentType( contentType ).form( transformedForm ).build();
            transformedContentTypes.add( transformedCty );
        }
        return transformedContentTypes.build();
    }


    ContentTypes populateInheritors( final ContentTypes contentTypes )
    {
        final ContentTypes.Builder builder = ContentTypes.newContentTypes();

        final ContentTypeInheritorResolver contentTypeInheritorResolver = new ContentTypeInheritorResolver( this.context.getClient() );

        for ( final ContentType contentType : contentTypes )
        {
            builder.add( populateInheritors( contentTypeInheritorResolver, contentType ) );
        }
        return builder.build();
    }

    ContentType populateInheritors( final ContentTypeInheritorResolver contentTypeInheritorResolver, ContentType contentType )
    {
        contentType = ContentType.newContentType( contentType ).
            inheritors( contentTypeInheritorResolver.resolveInheritors( contentType.getName() ).isNotEmpty() ).
            build();
        return contentType;
    }

    ContentType nodeToContentType( final Node node, final ContentTypeInheritorResolver contentTypeInheritorResolver )
    {
        ContentType contentType = CONTENT_TYPE_NODE_TRANSLATOR.fromNode( node );

        contentType = populateInheritors( contentTypeInheritorResolver, contentType );

        return contentType;
    }
}
