from tornado.web import RequestHandler
from meetr.models.meetup import Meetup

class MeetupListHandler(RequestHandler):

    def get(self, username):
        results = Meetup.find({"username": username})
        self.write({"meetups": [meetup.attributes() for meetup in results]})
