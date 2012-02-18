(function(Meetup){
  var People = meetr.module('people'),
    Place = meetr.module('place');
    
      
  Meetup.Model = Backbone.Model.extend({
    initialize: function(data){
      this.set(data);
      this.set('people', new People.Collection());
      this.set('places', new Place.Collection());
    }
    
  });

  Meetup.Collection = Backbone.Collection.extend({
    initialize: function(){
      //adds test data for now
      this.add(new Meetup.Model({
        name: "Event 1"
      }));
      console.log(this);
    }
  });

  Meetup.Views.ListView = Backbone.View.extend({
    template: "/app/templates/meetups_list.html",
    model: Meetup.Collection,
    el: '#content',
    render: function(){
      var data = {
        collection: this.collection.models
      },
        self = this;
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data))
      })
    }
  });

  Meetup.Views.NewMeetupForm = Backbone.View.extend({
    template: "/app/templates/new_meetup_form.html",
    el: "#content",
    events: {
      'blur input': 'checkInputs',
      'click .btn-success': 'createMeetup'
    },
    render: function(){
      var self = this,
        data= {};
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data));
      });
    },
    checkInputs: function(){
      if($('[name=event_name]').val()){
        $('.btn-success').removeClass('disabled');
      } else {
        $('.btn-success').addClass('disabled');
      }
    },
    createMeetup: function(){
      console.log('submit.')
      meetr.app.router.navigate('#addNewMeetup/'+ $('[name=event_name]').val(), true);
    }
  })

})(meetr.module('meetup'));