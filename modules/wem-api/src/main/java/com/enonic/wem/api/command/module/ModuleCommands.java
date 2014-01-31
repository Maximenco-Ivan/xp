package com.enonic.wem.api.command.module;


public final class ModuleCommands
{
    public CreateModule create()
    {
        return new CreateModule();
    }

    public UpdateModule update()
    {
        return new UpdateModule();
    }

    public GetModules list()
    {
        return new GetModules();
    }

    public GetModules getAll()
    {
        return new GetModules().all();
    }

    public GetModuleResource getResource()
    {
        return new GetModuleResource();
    }

    public CreateModuleResource createResource()
    {
        return new CreateModuleResource();
    }
}
