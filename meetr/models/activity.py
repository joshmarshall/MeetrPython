import mogo
import random
import string

class Activity(mogo.Model):

    uid = mogo.Field(default=lambda: "".join([
        random.choice(string.letters) for i in range(10)]))
    name = mogo.Field(required=True)
    votes = mogo.Field(dict, default={})

    def attributes(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "votes": self.votes,
            "votes_url": "/activities/%s/votes" % self.uid,
            "url": "/activities/%s" % self.uid
        }
