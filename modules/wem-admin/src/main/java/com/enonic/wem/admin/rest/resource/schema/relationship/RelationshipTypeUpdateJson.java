package com.enonic.wem.admin.rest.resource.schema.relationship;


import com.enonic.wem.api.schema.relationship.RelationshipTypeName;

public class RelationshipTypeUpdateJson
{
    private RelationshipTypeName relationshipTypeToUpdate;

    private RelationshipTypeName name;

    private String config;

    private String iconReference;

    public void setRelationshipTypeToUpdate( final RelationshipTypeName relationshipTypeToUpdate )
    {
        this.relationshipTypeToUpdate = relationshipTypeToUpdate;
    }

    public RelationshipTypeName getRelationshipTypeToUpdate()
    {
        return relationshipTypeToUpdate;
    }

    public void setName( final String name )
    {
        this.name = RelationshipTypeName.from( name );
    }

    public RelationshipTypeName getName()
    {
        return name;
    }

    public String getConfig()
    {
        return config;
    }

    public void setConfig( final String config )
    {
        this.config = config;
    }

    public String getIconReference()
    {
        return iconReference;
    }

    public void setIconReference( final String iconReference )
    {
        this.iconReference = iconReference;
    }
}
