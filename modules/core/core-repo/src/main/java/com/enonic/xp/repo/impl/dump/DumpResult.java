package com.enonic.xp.repo.impl.dump;

import java.util.List;

import com.google.common.collect.Lists;

import com.enonic.xp.repository.RepositoryId;

public class DumpResult
{
    private final List<BranchDumpResult> branchResults;

    private final RepositoryId repositoryId;

    private DumpResult( final Builder builder )
    {
        this.branchResults = builder.branchResults;
        this.repositoryId = builder.repositoryId;
    }

    public List<BranchDumpResult> getBranchResults()
    {
        return branchResults;
    }

    public RepositoryId getRepositoryId()
    {
        return repositoryId;
    }

    public static Builder create( final RepositoryId repositoryId )
    {
        return new Builder( repositoryId );
    }

    public static final class Builder
    {
        private final List<BranchDumpResult> branchResults = Lists.newArrayList();

        private final RepositoryId repositoryId;

        private Builder( final RepositoryId repositoryId )
        {
            this.repositoryId = repositoryId;
        }

        public Builder add( final BranchDumpResult val )
        {
            branchResults.add( val );
            return this;
        }

        public DumpResult build()
        {
            return new DumpResult( this );
        }
    }

    @Override
    public String toString()
    {
        StringBuilder builder = new StringBuilder();
        builder.append( "DumpResult{" );
        this.branchResults.forEach( ( entry ) -> builder.append( entry.toString() ).append( ", " ) );
        builder.append( ", repositoryId=" + repositoryId );
        builder.append( '}' );

        return builder.toString();
    }
}
