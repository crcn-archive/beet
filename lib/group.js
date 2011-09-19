var Structr = require('structr'),
path = require('path');


module.exports = Structr({
    
    /**
     */
     
    '__construct': function(beet, groupName)
    {
        //the db collection to persist to
        this._collection = beet._collection;
        
        this._idGen = beet._collection.idGen;
        
        //controller for supervisord
        this.beet = beet;
        
        //name of the group
        this.name = groupName;
    },
    
    /**
     * Lists all the processes under the given group
     */
     
     
    'all': function(callback)
    {
        var self = this;
        
        this.beet.client.getAllProcessInfo(function(err, processes)
        {
            if(processes)
            for(var i = processes.length; i--;)
            {
                if(processes[i].group != self.name) processes.splice(i, 1); 
            }   
            
            callback(err, processes);
        });
    },

    /**
     */

    'process': function(name, callback)
    {
        this.beet.client.getProcessInfo(this.name + ':' + this._name(name), callback);  
    },


    /**
     */

    'start': function(name, callback)
    {
        if(typeof name == 'function')
        {
            callback = name;
            name = '*';
        }
        else
        {
            name = this._name(name);
        }
        
        if(!name) name = '*';
        if(!callback) callback = function(){};
        
        this.beet.client.startProcess(this.name + ':' + name, callback);
    },

    /**
     */

    'exists': function(name, callback)
    {
        this._collection.findOne({ name: this._name(name) }, function(err, item)
        {
            callback(!!item);
        })
    },

    /**
     */
    
    'stop': function(name, callback)
    {
        
        if(typeof name == 'function')
        {
            callback = name;
            name = '*';
        }
        else
        {
            name = this._name(name);
        }
        
        if(!name) name = '*';
        if(!callback) callback = function(){};

        
        this.beet.client.stopProcess(this.name + ':' + name, callback);
    },
    
    
    /**
     * addes a process to a given group
     */
     
    'add': function(ops, callback)
    {
        if(!callback) callback = function(){};

        //name of the script to run for supervisord
        if(!ops.name) ops.name = 'undefined';

        ops.name = this._name(ops.name);
        
        //script exists? split it apart
        if(ops.script)
        {
             ops.directory =  path.dirname(ops.script);
             ops.command = 'node ' + path.basename(ops.script) +' '+ (ops.args || []).join(' ');
        }

        //directory to script - chdir for supervisord
        if(!ops.directory) return callback('directory is not provided');

        //the command to use for running supervisord
        if(!ops.command) return callback('command not provided');
         
        var self = this;

        var update = this._query({
            name: ops.name, 
            directory: ops.directory, 
            command: ops.command 
        });
        
        //insert into the beet db 
        this._collection.update({ _id: this._id(ops.name) }, { $set: update }, { upsert: true }, function(err, result)
        {
            if(callback) callback(err, result);
                self.beet.writeGroupConfig(self.name);
        });

    },

    /**
     * Removes a script from supervisord
     */

    'remove': function(ops, callback)
    {
        var search = typeof ops == 'string' ? { name: this._name(ops) } : ops,
        query = this._query(search),
        self = this;


        this._collection.findOne(query, function(err, item)
        {
            //stop the app in case...
            if(item) self.stop(item.name);

            self._collection.remove(query, function(err, result)
            {
                if(!callback) callback(err, result); 


                self.beet.writeGroupConfig(self.name);
            });    
        });
       
    },

    /**
     * adds group to the search
     */
     
    '_query': function(data)
    {
        data.group = this.name;
        return data;
    },
    
    /**
     */
     
    '_name': function(processName)
    {
        return this.name + '-' +processName;
    },
    
    /**
     * the ID of the process name
     */
     
    '_id': function(processName)
    {
        return this._idGen.hash(this.name + processName);
    }
});



