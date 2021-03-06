package com.enonic.xp.node;

public class NodeVersionQuery
    extends AbstractQuery
{
    private final NodeId nodeId;

    private NodeVersionQuery( final Builder builder )
    {
        super( builder );
        this.nodeId = builder.nodeId;
    }

    public NodeId getNodeId()
    {
        return nodeId;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public static final class Builder
        extends AbstractQuery.Builder<Builder>
    {
        private NodeId nodeId;

        private Builder()
        {
        }

        public Builder nodeId( NodeId nodeId )
        {
            this.nodeId = nodeId;
            return this;
        }

        public NodeVersionQuery build()
        {
            return new NodeVersionQuery( this );
        }
    }
}
