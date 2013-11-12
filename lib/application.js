var Task = Spine.Model.sub();

Task.configure("Task", "name", "done");

// Persist with Local Storage
Task.extend(Spine.Model.Local);

Task.extend({
	active: function(){
		return this.select(function(item) {
			return !item.done;
		});
	},

	done: function(){
		return this.select(function(item) {
			return !!item.done;
		});
	},

	destroyDone: function(){
		var items = this.done();
		for(var i=0; i < items.length; i++)
			items[i].destroy();
	}
});



var TaskApp = Spine.Controller.sub({
	elements: {
		".items": "items"
	},

	init: function(){
		Task.bind("create",  this.proxy(this.addOne));
		Task.bind("refresh", this.proxy(this.addAll));
		Task.fetch();
	},

	addOne: function(task){
		var view = new Task({item: task});
		this.items.append(view.render().el);
	},

	addAll: function(){
		Task.each(this.proxy(this.addOne));
	}
});


var Tasks = Spine.Controller.sub({      
	init: function(){
		this.item.bind("update", this.proxy(this.render));
		this.item.bind("destroy", this.proxy(this.remove));
	},

	render: function(){
		this.replace($("#taskTemplate").tmpl(this.item));
		return this;
	},

	remove: function(){
		this.el.remove();
		this.release();
	}
});

jQuery(function($) {
  return new TaskApp({
    el: $("#tasks")
  });
});