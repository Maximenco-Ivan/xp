package com.enonic.wem.api.content.type.formitem.comptype;

import org.apache.commons.lang.StringUtils;

import com.enonic.wem.api.content.data.Data;
import com.enonic.wem.api.content.data.DataSet;
import com.enonic.wem.api.content.datatype.DataTypes;
import com.enonic.wem.api.content.datatype.InvalidValueTypeException;
import com.enonic.wem.api.content.type.formitem.BreaksRequiredContractException;
import com.enonic.wem.api.content.type.formitem.InvalidValueException;

import static com.enonic.wem.api.content.datatype.DataTool.newDataChecker;

public class Color
    extends BaseComponentType
{
    public Color()
    {
        super( "color" );
    }

    @Override
    public void checkBreaksRequiredContract( final Data data )
        throws BreaksRequiredContractException
    {
        final String stringValue = (String) data.getValue();
        if ( StringUtils.isBlank( stringValue ) )
        {
            throw new BreaksRequiredContractException( data, this );
        }
    }

    @Override
    public void ensureType( final Data data )
    {
        final DataSet dataSet = data.getDataSet();
        DataTypes.WHOLE_NUMBER.ensureType( dataSet.getData( "red" ) );
        DataTypes.WHOLE_NUMBER.ensureType( dataSet.getData( "green" ) );
        DataTypes.WHOLE_NUMBER.ensureType( dataSet.getData( "blue" ) );
    }

    @Override
    public void checkValidity( final Data data )
        throws InvalidValueTypeException, InvalidValueException
    {
        newDataChecker().pathRequired( "red" ).type( DataTypes.WHOLE_NUMBER ).range( 0, 255 ).check( data );
        newDataChecker().pathRequired( "green" ).type( DataTypes.WHOLE_NUMBER ).range( 0, 255 ).check( data );
        newDataChecker().pathRequired( "blue" ).type( DataTypes.WHOLE_NUMBER ).range( 0, 255 ).check( data );
    }
}
