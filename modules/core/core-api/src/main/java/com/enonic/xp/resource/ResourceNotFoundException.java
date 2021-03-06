package com.enonic.xp.resource;

import com.google.common.annotations.Beta;

import com.enonic.xp.exception.NotFoundException;

@Beta
public final class ResourceNotFoundException
    extends NotFoundException
{
    private final ResourceKey resource;

    public ResourceNotFoundException( final ResourceKey resource )
    {
        super( "Resource [{0}] was not found", resource.getUri() );
        this.resource = resource;
    }

    public ResourceKey getResource()
    {
        return this.resource;
    }
}
