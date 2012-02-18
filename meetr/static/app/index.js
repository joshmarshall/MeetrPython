(function() {

// Include the example module
var Application = meetr.module('application'),
  Meetup = meetr.module('meetup'),
  People = meetr.module('people'),
  Place = meetr.module('place');

// Defining the application router, you can attach sub routers here.
var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    "home": "index",
    "showMeetup/:cid": "people",
    "places/:cid": "places",
    "newMeetup" : 'newMeetup',
    "addNewMeetup/:event_name": "addNewMeetup",
    "removeMeetup/:event_cid": "removeMeetup",
    "addPerson/:event_cid": "addPerson"
  },

  index: function() {
    var route = this,
      header_data = {
        left: '',
        title: 'Meetr Home',
        right: ''
      };
    if(!meetr.models.meetup_collection){
      meetr.models.meetup_collection = new Meetup.Collection();
    }

    if(!meetr.panes.header){
      meetr.panes.header = new Application.HeaderView();
    }

    if(!meetr.panes.meetup_list_view){
      meetr.panes.meetup_list_view = new Meetup.Views.ListView();
    }

    meetr.panes.meetup_list_view.collection = meetr.models.meetup_collection;

    meetr.panes.header.render(header_data);

    meetr.models.meetup_collection.fetch({
      success: function(){
        meetr.panes.meetup_list_view.render();
      }
    });
  },

  newMeetup: function(){
    var header_data ={
      left: '<a class="nav_link btn" rel="home">Back</a>',
      title: 'New Event',
      right: ''
    }

    if(!meetr.panes.header){
      meetr.panes.header = new Application.HeaderView();
    }

    if(!meetr.panes.new_meetup_form){
      meetr.panes.new_meetup_form = new Meetup.Views.NewMeetupForm();
    }

    meetr.panes.header.render(header_data);
    meetr.panes.new_meetup_form.render();
  },

  addNewMeetup: function(event_name){
    meetr.models.meetup = new Meetup.Model();
    meetr.models.meetup.get('people').reset([], {silent: true});
    meetr.models.meetup.get('places').reset([], {silent: true});
    meetr.models.meetup.set('name', event_name);
    meetr.models.meetup_collection.add(meetr.models.meetup);
    this.navigate('#showMeetup/'+meetr.models.meetup.cid, true);
  }, 

  removeMeetup: function(event_cid){
    var meetup_to_remove = meetr.models.meetup_collection.getByCid(event_cid);
    meetr.models.meetup_collection.remove(meetup_to_remove);
    meetr.panes.meetup_list_view.render();
    meetr.app.router.navigate('#home', {silent: true});
  },

  people: function(cid){
    meetr.models.meetup = meetr.models.meetup_collection.getByCid(cid);

    var header_data = {
      left: '<a class="nav_link btn" rel="home">Back</a>',
      title: 'People',
      right: '<a class="nav_link btn btn-success rel="places/'+ meetr.models.meetup.cid+ '">Next</a>'
    };

    if(!meetr.panes.header){
      meetr.panes.header = new Application.HeaderView();
    }

    if(!meetr.panes.people_list_view){
      meetr.panes.people_list_view = new People.Views.ListView();
    }
    
    //meetr.models.meetup.get('people').fetch({
    //   success: function(){
            meetr.panes.people_list_view.collection = meetr.models.meetup.get('people');

            meetr.panes.header.render(header_data);
            meetr.panes.people_list_view.render(cid);
    //   }
    // });
    
    
  },

  addPerson: function(event_cid){
    meetr.models.meetup = meetr.models.meetup_collection.getByCid(event_cid);

    var header_data = {
      left: '<a class="nav_link btn" rel="showMeetup/'+event_cid+'">Back</a>',
      title: 'Add Person',
      right: ''
    };

    if(!meetr.panes.header){
      meetr.panes.header = new Application.HeaderView();
    }

    if(!meetr.panes.add_new_person){
      meetr.panes.add_new_person = new People.Views.AddPersonForm();
    }
    
    meetr.panes.header.render(header_data);
    meetr.panes.add_new_person.render();
  },

  places: function(cid){
    var header_data = {
      left: '<a class="nav_link btn" rel="showMeetup/'+ cid +'">Back</a>',
      title: 'Places',
      right: ''
    };

    meetr.models.meetup = meetr.models.meetup_collection.getByCid(cid);

    if(!meetr.panes.header){
      meetr.panes.header = new Application.HeaderView();
    }

    if(!meetr.panes.cat_list_view){
      meetr.panes.cat_list_view = new Place.Views.CategoryListView();
    }

    meetr.panes.header.render(header_data);
    meetr.panes.cat_list_view.render();
  }
});
  
// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function($) {
  // Shorthand the application meetr
  var app = meetr.app;

  // Define your master router on the application meetr and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support
  Backbone.history.start({ pushState: false });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router.  If the link has a data-bypass
  // attribute, bypass the delegation completely.
  $(document).on("click", ".nav_link", function(evt) {
    // Get the anchor href and protcol
    var href = $(evt.target).attr("rel");

    app.router.navigate(href, true);
  });
});

})();
