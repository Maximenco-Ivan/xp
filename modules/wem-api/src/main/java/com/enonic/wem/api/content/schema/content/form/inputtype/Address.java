package com.enonic.wem.api.content.schema.content.form.inputtype;


import com.enonic.wem.api.content.data.Data;
import com.enonic.wem.api.content.data.DataSet;
import com.enonic.wem.api.content.data.datatype.DataTypes;
import com.enonic.wem.api.content.data.datatype.InvalidValueTypeException;
import com.enonic.wem.api.content.schema.content.form.BreaksRequiredContractException;
import com.enonic.wem.api.content.schema.content.form.InvalidValueException;

import static com.enonic.wem.api.content.data.datatype.DataTool.checkDataType;

public class Address
    extends BaseInputType
{
    public Address()
    {
    }

    @Override
    public void checkValidity( final Data data )
        throws InvalidValueTypeException, InvalidValueException
    {
        checkDataType( data, "street", DataTypes.TEXT );
        checkDataType( data, "postalCode", DataTypes.TEXT );
        checkDataType( data, "postalPlace", DataTypes.TEXT );
        checkDataType( data, "region", DataTypes.TEXT );
        checkDataType( data, "country", DataTypes.TEXT );
    }

    @Override
    public void ensureType( final Data data )
    {
        DataSet datSet = data.toDataSet();
        DataTypes.TEXT.ensureType( datSet.getData( "street" ) );
        DataTypes.TEXT.ensureType( datSet.getData( "postalCode" ) );
        DataTypes.TEXT.ensureType( datSet.getData( "postalPlace" ) );
        DataTypes.TEXT.ensureType( datSet.getData( "region" ) );
        DataTypes.TEXT.ensureType( datSet.getData( "country" ) );
    }

    @Override
    public void checkBreaksRequiredContract( final Data data )
        throws BreaksRequiredContractException
    {

    }

}

