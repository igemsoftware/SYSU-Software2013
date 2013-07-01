/**
The GPL License (GPL)

Copyright (c) 2012 Andreas Herz

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details. You should
have received a copy of the GNU General Public License along with this program; if
not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
MA 02111-1307 USA

**/



/**
 * @class graphiti.command.CommandConnect
 * 
 * Connects two ports with a connection.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends graphiti.command.Command
 */
graphiti.command.CommandConnect = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandConnect", 
    
    /**
     * @constructor
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     * @param {graphiti.Canvas} canvas the canvas to user
     * @param {graphiti.Port} source the source port for the connection to create
     * @param {graphiti.Port} target the target port for the connection to create
     */
    init : function(canvas, source, target, decorator)
     {
       this._super("Connecting Ports");
       this.canvas = canvas;
       this.source   = source;
       this.target   = target;
       this.connection = null;
       this.decorator = decorator;
    },
    
    setConnection:function(connection)
    {
       this.connection=connection;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       if(this.connection===null)
          this.connection = new graphiti.Connection();

       if(this.decorator === "T"){
          this.connection.setSourceDecorator(new graphiti.decoration.connection.TDecorator());
       }
       else if(this.decorator === "Arrow") {
          this.connection.setSourceDecorator(new graphiti.decoration.connection.ArrowDecorator());
       }
       this.connection.setSource(this.source);
       this.connection.setTarget(this.target);
       this.canvas.addFigure(this.connection);
    },
    
    /**
     * @method
     * Redo the command after the user has undo this command.
     *
     **/
    redo:function()
    {
       this.canvas.addFigure(this.connection);
       this.connection.reconnect();
    },
    
    /** 
     * @method
     * Undo the command.
     *
     **/
    undo:function()
    {
        this.canvas.removeFigure(this.connection);
    }
});
