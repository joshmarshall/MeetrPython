import os
from tornado.web import Application
from tornado.web import RequestHandler
from tornado.ioloop import IOLoop

class IndexHandler(RequestHandler):

    def get(self):
        self.write({"hello": "world"})


app = Application([
    ("/", IndexHandler)
])

if __name__ == "__main__":
    port = os.environ.get("PORT") or 3000
    app.listen(port)
    IOLoop.instance().start()
