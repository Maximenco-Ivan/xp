package com.enonic.wem.api.content.schema.content.form.inputtype;


import org.apache.commons.lang.StringUtils;

import com.enonic.wem.api.content.data.Data;
import com.enonic.wem.api.content.data.datatype.DataTypes;
import com.enonic.wem.api.content.data.datatype.InvalidValueTypeException;
import com.enonic.wem.api.content.schema.content.form.BreaksRequiredContractException;
import com.enonic.wem.api.content.schema.content.form.InvalidValueException;

public class Phone
    extends BaseInputType
{
    public Phone()
    {

    }

    @Override
    public void checkValidity( final Data data )
        throws InvalidValueTypeException, InvalidValueException
    {
        DataTypes.TEXT.checkValidity( data );
    }

    @Override
    public void ensureType( final Data data )
    {
        DataTypes.TEXT.ensureType( data );
    }

    @Override
    public void checkBreaksRequiredContract( final Data data )
    {
        final String stringValue = (String) data.getObject();
        if ( StringUtils.isBlank( stringValue ) )
        {
            throw new BreaksRequiredContractException( data, this );
        }
    }

}

