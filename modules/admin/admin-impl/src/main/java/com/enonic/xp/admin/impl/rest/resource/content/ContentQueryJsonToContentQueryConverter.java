package com.enonic.xp.admin.impl.rest.resource.content;

import java.util.List;

import org.codehaus.jparsec.util.Lists;

import com.enonic.xp.admin.impl.rest.resource.content.json.AggregationQueryJson;
import com.enonic.xp.admin.impl.rest.resource.content.json.ContentQueryJson;
import com.enonic.xp.admin.impl.rest.resource.content.json.filter.FilterJson;
import com.enonic.xp.content.ContentId;
import com.enonic.xp.content.ContentIds;
import com.enonic.xp.content.ContentQuery;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.content.Contents;
import com.enonic.xp.content.GetContentByIdsParams;
import com.enonic.xp.query.parser.QueryParser;

public class ContentQueryJsonToContentQueryConverter
{
    final private ContentQueryJson contentQueryJson;

    final private ContentService contentService;

    private ContentQueryJsonToContentQueryConverter( final Builder builder )
    {
        this.contentQueryJson = builder.contentQueryJson;
        this.contentService = builder.contentService;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public ContentQuery createQuery()
    {
        final ContentQuery.Builder builder = ContentQuery.create().
            from( contentQueryJson.getFrom() ).
            size( contentQueryJson.getSize() ).
            queryExpr( QueryParser.parse( contentQueryJson.getQueryExprString() ) ).
            addContentTypeNames( contentQueryJson.getContentTypeNames() );

        addAggregationQueries( builder );

        addQueryFilters( builder );

        addOutboundContentIdsToFilter( builder );

        return builder.build();
    }

    private void addOutboundContentIdsToFilter( final ContentQuery.Builder builder )
    {
        if ( contentQueryJson.getMustBeReferencedById() != null )
        {

            final ContentIds ids = this.contentService.getOutboundDependencies( contentQueryJson.getMustBeReferencedById() );

            //TODO: no need to filter when we fix that removed content will be removed from references
            builder.filterContentIds( getExistingContentIds( ids ) );
        }

    }

    private ContentIds getExistingContentIds( final ContentIds contentIds )
    {
        final Contents contents = this.contentService.getByIds( new GetContentByIdsParams( contentIds ) );
        final List<ContentId> existingContentIds = Lists.arrayList();
        contents.forEach( content -> existingContentIds.add( content.getId() ) );
        return ContentIds.from( existingContentIds );
    }

    private void addAggregationQueries( final ContentQuery.Builder builder )
    {
        if ( contentQueryJson.getAggregationQueries() != null )
        {
            for ( final AggregationQueryJson aggregationQueryJson : contentQueryJson.getAggregationQueries() )
            {
                builder.aggregationQuery( aggregationQueryJson.getAggregationQuery() );
            }
        }
    }

    private void addQueryFilters( final ContentQuery.Builder builder )
    {
        if ( contentQueryJson.getQueryFilters() != null )
        {
            for ( final FilterJson queryFilterJson : contentQueryJson.getQueryFilters() )
            {
                builder.queryFilter( queryFilterJson.getFilter() );
            }
        }
    }

    static class Builder
    {
        private ContentQueryJson contentQueryJson;

        private ContentService contentService;

        public Builder contentQueryJson( final ContentQueryJson contentQueryJson )
        {
            this.contentQueryJson = contentQueryJson;
            return this;
        }

        public Builder contentService( final ContentService contentService )
        {
            this.contentService = contentService;
            return this;
        }

        public ContentQueryJsonToContentQueryConverter build()
        {
            return new ContentQueryJsonToContentQueryConverter( this );
        }
    }
}
