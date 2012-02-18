import mogo

class User(mogo.Model):

    username = mogo.Field(required=True)
    name = mogo.Field(required=True)
    email = mogo.Field(required=True)

