package com.enonic.wem.core.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.enonic.wem.api.Client;
import com.enonic.wem.api.command.Command;
import com.enonic.wem.core.command.CommandContext;
import com.enonic.wem.core.command.CommandInvoker;
import com.enonic.wem.core.jcr.old.SessionFactory;

@Component
public final class StandardClient
    implements Client
{
    private CommandInvoker invoker;

    private SessionFactory sessionFactory;

    @Override
    public <R, C extends Command<R>> R execute( final C command )
    {
        command.validate();
        doInvoke( command );
        return command.getResult();
    }

    private void doInvoke( final Command command )
    {
        final CommandContext context = createContext();

        try
        {
            this.invoker.invoke( context, command );
        }
        finally
        {
            context.dispose();
        }
    }

    @Autowired
    public void setInvoker( final CommandInvoker invoker )
    {
        this.invoker = invoker;
    }

    @Autowired
    public void setSessionFactory( final SessionFactory sessionFactory )
    {
        this.sessionFactory = sessionFactory;
    }

    private CommandContext createContext()
    {
        final CommandContext context = new CommandContext();
        context.setClient( this );
//        context.setJcrSession( this.sessionFactory.getSession() );
        return context;
    }
}
