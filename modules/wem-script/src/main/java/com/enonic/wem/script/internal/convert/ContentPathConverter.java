package com.enonic.wem.script.internal.convert;

import com.enonic.wem.api.content.ContentPath;

final class ContentPathConverter
    implements Converter<ContentPath>
{
    @Override
    public Class<ContentPath> getType()
    {
        return ContentPath.class;
    }

    @Override
    public ContentPath convert( final Object value )
    {
        if ( value instanceof ContentPath )
        {
            return (ContentPath) value;
        }

        return ContentPath.from( value.toString() );
    }
}
