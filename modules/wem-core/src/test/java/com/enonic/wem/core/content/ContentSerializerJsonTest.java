package com.enonic.wem.core.content;


public class ContentSerializerJsonTest
    extends AbstractContentSerializerTest
{
    @Override
    ContentSerializer getSerializer()
    {
        return new ContentSerializerJson( contentTypeFetcher );
    }

}
