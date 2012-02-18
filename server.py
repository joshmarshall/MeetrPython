import os
import mogo
import urlparse
from tornado.web import Application
from tornado.ioloop import IOLoop

from meetr.handlers import index_handler
from meetr.handlers import meetup_handler



def main():
    mongo_uri = os.environ.get("MONGOHQ_URL") or \
        "mongodb://localhost:27017/meetr_test"
    mongo_uri_parts = urlparse.urlparse(mongo_uri)

    database = mongo_uri_parts.path[1:]

    mogo.connect(database, host=mongo_uri)

    app = Application([
        # List routes here
        ("/", index_handler.IndexHandler),
        ("/users/(\w+)/meetups", meetup_handler.MeetupListHandler)
    ])
    port = os.environ.get("PORT") or 3000
    app.listen(port)
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
