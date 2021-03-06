import mogo
import random
import string

class User(mogo.Model):

    uid = mogo.Field(default=lambda: "".join([
        random.choice(string.letters) for i in range(10)]))
    username = mogo.Field()
    name = mogo.Field()
    email = mogo.Field()
    phone = mogo.Field()

    def attributes(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "email": self.email,
        }

