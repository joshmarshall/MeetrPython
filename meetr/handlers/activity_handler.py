from tornado.web import RequestHandler, HTTPError
from meetr.models.activity import Activity
import json


def _get_activity(activity_uid):
    activity = Activity.find({"uid": activity_uid}).first()
    if not activity:
        raise HTTPError(404)
    return activity

class ActivityHandler(RequestHandler):

    def get(self, activity_uid):
        activity = _get_activity(activity_uid)
        return self.write(activity.attributes())


class ActivityVotesHandler(RequestHandler):

    def post(self, activity_uid):
        activity = _get_activity(activity_uid)
        body = json.loads(self.request.body)
        if "username" not in body:
            raise HTTPError(400, "Missing username")
        username = body["username"]
        if "vote" not in body:
            raise HTTPError(400, "Missing vote.")
        vote = body["vote"].lower() is not "down"
        if vote:
            activity.votes[username] = True
        else:
            activity.votes[username] = False
        activity.save()
        self.write(activity.attributes())
