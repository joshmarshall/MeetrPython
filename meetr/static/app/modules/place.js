(function(Place){
  Place.Model = Backbone.Model.extend({
    initialize: function(data){
      this.set(data);
    }
  });

  Place.Collection = Backbone.Collection.extend({
    model: Place.Model,
    initialize: function(){
      //add some test data for now
      this.add(new Place.Model({
        name : 'Place 1'
      }))
    }
  });

  Place.Views.CategoryListView = Backbone.View.extend({
    template: '/app/templates/categories_list.html',
    el: "#content",
    render: function(){
      var self= this;
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl());
      });
    }
  });

  Place.Views.ListView = Backbone.View.extend({
    el: "#content",
    template: "/app/templates/places_list.html",
    model: Place.Collection,
    render: function(){
      var self= this,
        data= {
          collection : this.collection.models
        };
      
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data));
      });
    }
  });
})(meetr.module('place'));