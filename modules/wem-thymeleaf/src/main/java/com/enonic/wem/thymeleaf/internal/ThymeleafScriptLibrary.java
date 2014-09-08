package com.enonic.wem.thymeleaf.internal;

import java.util.Map;

import javax.inject.Inject;
import javax.inject.Singleton;

import com.enonic.wem.api.resource.ResourceKey;
import com.enonic.wem.script.ScriptLibrary;
import com.enonic.wem.thymeleaf.ThymeleafProcessor;
import com.enonic.wem.thymeleaf.ThymeleafProcessorFactory;

@Singleton
public final class ThymeleafScriptLibrary
    implements ScriptLibrary
{
    private final ThymeleafProcessorFactory processorFactory;

    @Inject
    public ThymeleafScriptLibrary( final ThymeleafProcessorFactory processorFactory )
    {
        this.processorFactory = processorFactory;
    }

    @Override
    public String getName()
    {
        return "thymeleaf";
    }

    public String render( final ResourceKey view, final Map<String, Object> params )
    {
        final ThymeleafProcessor processor = this.processorFactory.newProcessor();
        processor.view( view );
        processor.parameters( params );
        return processor.process();
    }
}
