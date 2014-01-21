package com.enonic.wem.core.index;

import org.elasticsearch.client.Client;
import org.elasticsearch.node.Node;

import com.google.inject.AbstractModule;
import com.google.inject.Scopes;

import com.enonic.wem.core.index.elastic.ElasticClientProvider;
import com.enonic.wem.core.index.elastic.ElasticNodeProvider;
import com.enonic.wem.core.index.elastic.ElasticsearchIndexService;
import com.enonic.wem.core.index.elastic.ElasticsearchIndexServiceImpl;
import com.enonic.wem.core.index.entity.EntityQueryService;
import com.enonic.wem.core.index.entity.EntityQueryServiceImpl;

public final class IndexModule
    extends AbstractModule
{
    @Override
    protected void configure()
    {
        bind( Node.class ).toProvider( ElasticNodeProvider.class );
        bind( Client.class ).toProvider( ElasticClientProvider.class );
        bind( IndexService.class ).in( Scopes.SINGLETON );
        bind( ElasticsearchIndexService.class ).to( ElasticsearchIndexServiceImpl.class ).in( Scopes.SINGLETON );
        bind( EntityQueryService.class ).to( EntityQueryServiceImpl.class ).in( Scopes.SINGLETON );
    }
}
