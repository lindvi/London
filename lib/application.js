var TaskApp = Spine.Controller.sub({
    events: {
      "submit form": "create",
      "click  .clear": "clear"
    },

    elements: {
      ".items": "items",
      "form input": "input"
    },

    init: function(){
      Task.bind("create",  this.proxy(this.addOne));
      Task.bind("refresh", this.proxy(this.addAll));
      Task.fetch();
    },

    addOne: function(task){
      var view = new Tasks({
        item: task
      });
      this.items.append(view.render().el);
    },

    addAll: function(){
      Task.each(this.proxy(this.addOne));
    },

    create: function(e) {
      e.preventDefault();
      Task.create({name: this.input.val()});
      this.input.val("");
    },

    clear: function(){
      Task.destroyDone();
    }
  });


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




jQuery(function($) {
  return new TaskApp({
    el: $("#tasks")
  });
});