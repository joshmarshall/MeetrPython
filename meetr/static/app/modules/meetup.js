(function(Meetup){
  var People = meetr.module('people'),
    Place = meetr.module('place');
    
      
  Meetup.Model = Backbone.Model.extend({
    initialize: function(data){
      this.set('people', new People.Collection());
      this.get('people').url = 'http://meetr-python.herokuapp.com/users/josh'+ this.get('people_url');
      this.set('places', new Place.Collection());
      this.get('places').url = 'http://meetr-python.herokuapp.com/users/josh'+ this.get('activities_url');
    }
    
  });

  Meetup.Collection = Backbone.Collection.extend({
    url: 'http://meetr-python.herokuapp.com/users/josh/meetups',
    parse: function(data){
      return data.meetups;
    },
    initialize: function(){
      this.url = 'http://meetr-python.herokuapp.com/users/josh'+this.url;
    }
  });

  Meetup.Views.ListView = Backbone.View.extend({
    template: "/static/app/templates/meetups_list.html",
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
    template: "/static/app/templates/new_meetup_form.html",
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