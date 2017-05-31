package com.enonic.xp.repo.impl.dump.serializer.json;


import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.enonic.xp.node.NodePath;
import com.enonic.xp.node.NodeState;
import com.enonic.xp.node.NodeVersionId;
import com.enonic.xp.repo.impl.dump.model.Meta;

public class MetaJson
{
    @JsonProperty("nodePath")
    private String nodePath;

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("version")
    private String version;

    @JsonProperty("nodeState")
    private String nodeState;

    public MetaJson()
    {
    }

    private MetaJson( final Builder builder )
    {
        nodePath = builder.nodePath;
        timestamp = builder.timestamp;
        version = builder.version;
        nodeState = builder.nodeState;
    }

    public static Meta fromJson( final MetaJson json )
    {
        return Meta.create().
            nodePath( NodePath.create( json.nodePath ).build() ).
            timestamp( Instant.parse( json.getTimestamp() ) ).
            version( NodeVersionId.from( json.getVersion() ) ).
            nodeState( NodeState.from( json.getNodeState() ) ).
            build();
    }

    public static MetaJson from( final Meta meta )
    {
        return MetaJson.create().
            nodePath( meta.getNodePath().toString() ).
            timestamp( meta.getTimestamp().toString() ).
            version( meta.getVersion().toString() ).
            build();
    }

    public static Builder create()
    {
        return new Builder();
    }

    public String getNodePath()
    {
        return nodePath;
    }

    public String getTimestamp()
    {
        return timestamp;
    }

    public String getVersion()
    {
        return version;
    }

    public String getNodeState()
    {
        return nodeState;
    }

    public static final class Builder
    {
        private String nodePath;

        private String timestamp;

        private String version;

        private String nodeState;

        private Builder()
        {
        }

        public Builder nodePath( final String val )
        {
            nodePath = val;
            return this;
        }

        public Builder timestamp( final String val )
        {
            timestamp = val;
            return this;
        }

        public Builder version( final String val )
        {
            version = val;
            return this;
        }

        public Builder nodeState( final String val )
        {
            nodeState = val;
            return this;
        }

        public MetaJson build()
        {
            return new MetaJson( this );
        }
    }
}
