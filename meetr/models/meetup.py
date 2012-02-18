import mogo
import string
import random

class Meetup(mogo.Model):

    uid = mogo.Field(default=lambda: "".join([
        random.choice(string.letters) for i in range(10)]))
    name = mogo.Field(required=True)
    username = mogo.Field(required=True)
    people = mogo.Field(list, default=[])
    activities = mogo.Field(list, default=[])

    def add_activity(self, activity):
        if activity.uid not in self.activities:
            self.activities.append(activity.uid)
            self.save()

    def add_person(self, person):
        if person.uid not in self.people:
            self.people.append(person.uid)
            self.save()

    def get_people(self):
        from meetr.models.user import User
        return User.find({"uid": {"$in": [p for p in self.people]}})

    def get_activities(self):
        from meetr.models.activity import Activity
        return Activity.find({"uid": {"$in": [a for a in
            self.activities]}})

    def attributes(self):
        return {
            "name": self.name,
            "people": [p.attributes() for p in self.get_people()],
            "activities": [a.attributes() for a in self.get_activities()],
            "url": "/meetups/%s" % self.uid,
            "activities_url": "/meetups/%s/activities" % self.uid,
            "people_url": "/meetups/%s/people" % self.uid
        }

