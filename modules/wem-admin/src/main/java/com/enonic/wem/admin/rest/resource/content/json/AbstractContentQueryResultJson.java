package com.enonic.wem.admin.rest.resource.content.json;

import java.util.Set;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;

import com.enonic.wem.admin.json.aggregation.AggregationJson;
import com.enonic.wem.admin.json.content.ContentIdJson;
import com.enonic.wem.api.content.Content;

public abstract class AbstractContentQueryResultJson<T extends ContentIdJson>
{
    private ImmutableSet<AggregationJson> aggregations;

    protected ImmutableSet<T> contents;

    protected AbstractContentQueryResultJson( final Builder builder )
    {
        this.aggregations = ImmutableSet.copyOf( builder.aggregations );
    }

    public abstract static class Builder<T extends Builder>
    {
        private Set<AggregationJson> aggregations = Sets.newHashSet();

        public T addAggregation( final AggregationJson aggregation )
        {
            this.aggregations.add( aggregation );
            return (T) this;
        }

        public abstract T addContent( final Content content );

        public abstract AbstractContentQueryResultJson build();

    }

    public ImmutableSet<AggregationJson> getAggregations()
    {
        return aggregations;
    }

    public ImmutableSet<T> getContents()
    {
        return contents;
    }
}
