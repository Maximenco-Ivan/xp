package com.enonic.wem.web.rest.rpc.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.enonic.wem.web.rest.rpc.AbstractDataRpcHandler;
import com.enonic.wem.web.json.rpc.JsonRpcContext;

import com.enonic.wem.core.locale.LocaleService;

@Component
public final class GetLocalesRpcHandler
    extends AbstractDataRpcHandler
{
    private LocaleService localeService;

    public GetLocalesRpcHandler()
    {
        super( "util_getLocales" );
    }

    @Override
    public void handle( final JsonRpcContext context )
        throws Exception
    {
        final LocaleJsonResult result = new LocaleJsonResult( this.localeService.getLocales() );
        context.setResult( result );
    }

    @Autowired
    public void setLocaleService( final LocaleService localeService )
    {
        this.localeService = localeService;
    }
}
