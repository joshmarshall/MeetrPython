import mogo
import string
import random

class Meetup(mogo.Model):

    uid = mogo.Field(default=lambda x: "".join([
        random.choice(string.letters) for i in range(10)]))
    name = mogo.Field(required=True)
    username = mogo.Field(required=True)
    people = mogo.Field(list, default=[])
    activities = mogo.Field(list, default=[])




