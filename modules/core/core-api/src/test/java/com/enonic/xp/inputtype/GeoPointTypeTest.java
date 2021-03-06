package com.enonic.xp.inputtype;

import org.junit.Test;

import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueFactory;
import com.enonic.xp.data.ValueTypes;
import com.enonic.xp.form.Input;

import static org.junit.Assert.*;

public class GeoPointTypeTest
    extends BaseInputTypeTest
{
    public GeoPointTypeTest()
    {
        super( GeoPointType.INSTANCE );
    }

    @Test
    public void testName()
    {
        assertEquals( "GeoPoint", this.type.getName().toString() );
    }

    @Test
    public void testToString()
    {
        assertEquals( "GeoPoint", this.type.toString() );
    }

    @Test
    public void testCreateProperty()
    {
        final InputTypeConfig config = InputTypeConfig.create().build();
        final Value value = this.type.createValue( ValueFactory.newString( "1,2" ), config );

        assertNotNull( value );
        assertSame( ValueTypes.GEO_POINT, value.getType() );
    }

    @Test
    public void testCreateDefaultValue()
    {
        final Input input = getDefaultInputBuilder( InputTypeName.GEO_POINT, "41.387588,2.169994" ).build();

        final Value value = this.type.createDefaultValue( input );

        assertNotNull( value );
        assertEquals( "41.387588,2.169994", value.toString() );

    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateDefaultValue_invalid()
    {
        final Input input = getDefaultInputBuilder( InputTypeName.GEO_POINT, "41.387588;2.169994" ).build();
        final Value value = this.type.createDefaultValue( input );
    }

    @Test
    public void testValidate()
    {
        final InputTypeConfig config = InputTypeConfig.create().build();
        this.type.validate( geoPointProperty( "1,2" ), config );
    }

    @Test(expected = InputTypeValidationException.class)
    public void testValidate_invalidType()
    {
        final InputTypeConfig config = InputTypeConfig.create().build();
        this.type.validate( booleanProperty( true ), config );
    }
}
