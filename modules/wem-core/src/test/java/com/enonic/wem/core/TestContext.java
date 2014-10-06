package com.enonic.wem.core;

import com.enonic.wem.api.context.Context;
import com.enonic.wem.api.context.Context2;
import com.enonic.wem.api.context.ContextBuilder;
import com.enonic.wem.api.repository.Repository;
import com.enonic.wem.api.repository.RepositoryId;
import com.enonic.wem.api.workspace.Workspace;

public class TestContext
{
    public static final Workspace TEST_WORKSPACE = Workspace.from( "test" );

    public static final Repository TEST_REPOSITORY = Repository.create().
        id( RepositoryId.from( "test" ) ).
        build();

    public static final Context OLD_TEST_CONTEXT = Context.create().
        workspace( TEST_WORKSPACE ).
        repositoryId( TEST_REPOSITORY.getId() ).
        build();


    public static final Context2 TEST_CONTEXT = ContextBuilder.create().
        object( TEST_WORKSPACE ).
        object( TEST_REPOSITORY.getId() ).
        build();

}
