(function(People){

  People.Model = Backbone.Model.extend({
    initialize: function(data){
      this.set(data);
    }
  });

  People.Collection = Backbone.Collection.extend({
    model: People.Model,
    initialize: function(){
      //add test data for now
      this.add(new People.Model({
        fullName : 'Jane Doe'
      }))
    }
  });

  People.Views.ListView= Backbone.View.extend({
    model: People.Collection,
    template: '/app/templates/people_list.html',
    el: '#content',
    render: function(event_cid){
      var self = this,
        data = {
          collection: this.collection.models,
          event_cid: event_cid
        };
      console.log(data);
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data));
      })
    }
  });

  People.Views.AddPersonForm = Backbone.View.extend({
    template: '/app/templates/add_new_person.html',
    el: '#content',
    events: {
      'blur input' : 'checkInput',
      'click btn-success': 'addPerson'
    },
    render: function(){
      var self = this, 
        data = {};

      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data));
      })
    },
    checkInput: function(){
      if($('[name=nickname]').val() && $('[name=phone_number]').val()){
        $('.btn-success').removeClass('disabled');
      } else {
        $('.btn-success').addClass('disabled');
      }
    },
    addPerson: function(done){
      meetr.models.meetup.get('people').add(new People.Model({
        name: $('[name=nickname]').val(),
        phoneNumber: $('[name=phone_number]').val()
      }));

      done();
    }
  });

})(meetr.module('people'));