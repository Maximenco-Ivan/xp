package com.enonic.wem.api.schema.content.form;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.enonic.wem.api.data.Property;

public class ValidationRegex
{
    private Pattern pattern;

    private String string;

    public ValidationRegex( final String pattern )
    {
        this.pattern = Pattern.compile( pattern );
        this.string = pattern;
    }

    public void checkValidity( final Property property )
        throws BreaksRegexValidationException
    {
        if ( !( property.getValueType().getClassType().equals( java.lang.String.class ) ) )
        {
            return;
        }

        final Matcher matcher = pattern.matcher( property.getString() );
        if ( !matcher.matches() )
        {
            throw new BreaksRegexValidationException( property, pattern.toString() );
        }
    }

    @Override
    public String toString()
    {
        return string;
    }
}
