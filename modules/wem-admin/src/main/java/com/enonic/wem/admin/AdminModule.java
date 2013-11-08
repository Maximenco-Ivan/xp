package com.enonic.wem.admin;

import com.google.inject.AbstractModule;

import com.enonic.wem.admin.jsonrpc.JsonRpcModule;
import com.enonic.wem.admin.jsp.LiveEditHelper;
import com.enonic.wem.admin.rest.RestModule;
import com.enonic.wem.core.servlet.WebInitializerBinder;

public final class AdminModule
    extends AbstractModule
{
    @Override
    protected void configure()
    {
        install( new JsonRpcModule() );
        install( new RestModule() );

        WebInitializerBinder.from( binder() ).add( AdminWebInitializer.class );

        requestStaticInjection( LiveEditHelper.class );
    }
}
