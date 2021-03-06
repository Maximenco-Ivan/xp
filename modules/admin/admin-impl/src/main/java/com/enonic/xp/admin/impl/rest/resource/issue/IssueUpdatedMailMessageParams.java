package com.enonic.xp.admin.impl.rest.resource.issue;

import com.enonic.xp.security.User;

public class IssueUpdatedMailMessageParams
    extends IssueMailMessageParams
{
    private User modifier;

    public IssueUpdatedMailMessageParams( final Builder builder )
    {
        super( builder );
        this.modifier = builder.modifier;
    }

    public User getModifier()
    {
        return modifier;
    }

    public static Builder create( final User modifier, final IssueMailMessageParams source )
    {
        return new Builder( modifier, source );
    }

    public static class Builder
        extends IssueMailMessageParams.Builder<Builder>
    {
        private User modifier;

        private Builder( final User modifier, final IssueMailMessageParams source )
        {
            super( source );
            this.modifier = modifier;
        }

        public IssueUpdatedMailMessageParams build()
        {
            return new IssueUpdatedMailMessageParams( this );
        }
    }
}
