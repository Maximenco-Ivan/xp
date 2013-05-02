package com.enonic.wem.api.content.data.type;


import com.enonic.wem.api.content.data.Property;
import com.enonic.wem.api.content.data.Value;

public class Xml
    extends ValueType<String>
{
    Xml( int key )
    {
        super( key, JavaTypeConverter.String.GET );
    }

    @Override
    public Value newValue( final Object value )
    {
        return new Value.Xml( convert( value ) );
    }

    @Override
    public Property newProperty( final String name, final Value value )
    {
        return new Property.Xml( name, value );
    }
}
