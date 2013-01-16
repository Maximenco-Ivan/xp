package com.enonic.wem.web.rest.rpc.util;

import java.util.Locale;

import org.junit.Test;
import org.mockito.Mockito;

import com.enonic.wem.core.locale.LocaleService;
import com.enonic.wem.web.rest.rpc.AbstractRpcHandlerTest;
import com.enonic.wem.web.json.rpc.JsonRpcHandler;

public class GetLocalesRpcHandlerTest
    extends AbstractRpcHandlerTest
{
    private LocaleService localeService;

    @Override
    protected JsonRpcHandler createHandler()
        throws Exception
    {
        this.localeService = Mockito.mock( LocaleService.class );
        final GetLocalesRpcHandler handler = new GetLocalesRpcHandler();
        handler.setLocaleService( this.localeService );
        return handler;
    }

    @Test
    public void testRequest()
        throws Exception
    {
        Mockito.when( localeService.getLocales() ).thenReturn( new Locale[]{Locale.ENGLISH, Locale.GERMAN} );
        testSuccess( "getLocales_result.json" );
    }
}
