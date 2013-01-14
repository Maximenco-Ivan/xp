package com.enonic.wem.api.content.type;


import org.joda.time.DateTime;

import com.enonic.wem.api.module.ModuleName;

public interface BaseType
{
    String getName();

    String getDisplayName();

    ModuleName getModuleName();

    DateTime getCreatedTime();

    DateTime getModifiedTime();

}
