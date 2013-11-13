$(window).ready(function(){
  return new TaskApp({
    el: $("#tasks")
  });
});



var Task = Spine.Model.sub();

Task.configure("Task", "name", "lon", "lat", "done");

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

var Tasks = Spine.Controller.sub({      
 events: {
    "change input[type=checkbox]": "toggle",
    "click  .destroy": "destroyItem"
  },

  init: function(){
    this.item.bind("update", this.proxy(this.render));
    this.item.bind("destroy", this.proxy(this.destroy));
  },

  render: function(){
    this.html($("#taskTemplate").tmpl(this.item));
    return this;
  },

  toggle: function(){
    this.item.done = !this.item.done;
    this.item.save();
  },

  destroyItem: function(){
    this.item.destroy();
  }
});


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
      var location = Task.fromForm(e.target);
      location.save();
    },

    clear: function(){
      Task.destroyDone();
    }
});