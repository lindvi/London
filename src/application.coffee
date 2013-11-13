jQuery ($) ->
  new TaskApp(el: $("#tasks"))

class Task extends Spine.Model
  @configure "Task", "name", "lon", "lat", "done"

  # Persist with Local Storage
  @extend Spine.Model.Local

  @active: ->
    @select (item) -> !item.done

  @done: ->
    @select (item) -> !!item.done

  @destroyDone: ->
    rec.destroy() for rec in @done()


class TaskApp extends Spine.Controller
  # Add event listeners
  events:
    "submit form":   "create"
    "click  .clear": "clear"

  # Create some local variables refering to elements
  elements:
    ".items":     "items"
    "form input": "input"

  constructor: ->
    super
    Task.bind("create",  @addOne)
    Task.bind("refresh", @addAll)
    Task.fetch()

  addOne: (task) =>
    view = new Tasks(item: task)
    @items.append(view.render().el)

  addAll: =>
    Task.each(@addOne)

  create: (e) ->
    e.preventDefault()
    location = Task.fromForm(e.target)
    location.save()

  clear: ->
    Task.destroyDone()


class Tasks extends Spine.Controller
  events:
   "change   input[type=checkbox]": "toggle"
   "click    .destroy":             "destroyItem"

  constructor: ->
    super
    @item.bind("update",  @render)
    @item.bind("destroy", @release)

  render: =>
    @replace($("#taskTemplate").tmpl(@item))
    @

  toggle: ->
    @item.done = !@item.done
    @item.save()

  destroyItem: ->
    @item.destroy()