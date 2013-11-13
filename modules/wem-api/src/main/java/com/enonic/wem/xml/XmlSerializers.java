package com.enonic.wem.xml;

import com.enonic.wem.xml.template.PageTemplateXml;
import com.enonic.wem.xml.template.SiteTemplateXml;

public final class XmlSerializers
{
    public static <T extends XmlObject> XmlSerializer<T> create( final Class<T> type )
    {
        return new XmlSerializerImpl<>( type );
    }

    public static XmlSerializer<PageTemplateXml> pageTemplate()
    {
        return create( PageTemplateXml.class );
    }

    public static XmlSerializer<SiteTemplateXml> siteTemplate()
    {
        return create( SiteTemplateXml.class );
    }
}
