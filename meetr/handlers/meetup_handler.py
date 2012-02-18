from tornado.web import RequestHandler, HTTPError
from meetr.models.meetup import Meetup
from meetr.models.user import User
from meetr.models.activity import Activity
import json

def _get_meetup(meetup_uid):
    meetup = Meetup.find({"uid": meetup_uid}).first()
    if not meetup:
        raise HTTPError(404, "Unknown meetup.")
    return meetup

class MeetupListHandler(RequestHandler):

    def get(self, username):
        results = Meetup.find({"username": username})
        self.write({"meetups": [meetup.attributes() for meetup in results]})

    def post(self, username):
        body = json.loads(self.request.body)
        body["username"] = username
        meetup = Meetup(**body)
        meetup.save()
        self.write(meetup.attributes())


class MeetupHandler(RequestHandler):

    def get(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        self.write(meetup.attributes())

    def post(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        body = json.loads(self.request.body)
        for key, val in body.iteritems():
            setattr(meetup, key, val)
        meetup.save()
        self.write(meetup.attributes())


class MeetupActivitiesHandler(RequestHandler):

    def get(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        self.write({"activities": [
            a.attributes() for a in meetup.get_activities()
        ]})

    def post(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        body = json.loads(self.request.body)
        if "name" not in body:
            raise HTTPError(400, "Requires a name.")
        activity = Activity(name=body["name"])
        activity.save()
        meetup.add_activity(activity)
        self.write({"activity": [
            p.attributes() for p in meetup.get_activities()
        ]})

class MeetupPeopleHandler(RequestHandler):

    def get(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        self.write({"people": [
            p.attributes() for p in meetup.get_people()
        ]})

    def post(self, meetup_uid):
        meetup = _get_meetup(meetup_uid)
        body = json.loads(self.request.body)
        if "phone" in body:
            user = User.find({"phone": body["phone"]}).first()
        elif "email" in body:
            user = User.find({"email": body["email"]}).first()
        else:
            raise HTTPError(400, "Requires email or phone number.")
        if not user:
            name = body["name"] or "Unknown"
            if "name" in body:
                del body["name"]
            user = User(name=name, **body)
            user.save()
        meetup.add_person(user)
        self.write({"people": [
            p.attributes() for p in meetup.get_people()
        ]})
