(function(Application){
  Application.HeaderView = Backbone.View.extend({
    template: '/static/app/templates/header.html',
    el: 'header',
    render: function(data){
      var self = this;
      meetr.fetchTemplate(this.template, function(tmpl){
        self.$el.html(tmpl(data));
      })
    }
  })
})(meetr.module("application"));