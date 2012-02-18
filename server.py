import os
from tornado.web import Application
from tornado.web import RequestHandler

class IndexHandler(RequestHandler):

    def get(self):
        self.write({"hello": "world"})


app = Application([
    ("/", IndexHandler)
])

if __name__ == "__main__":
    app.listen(os.environ["PORT"] or 3000);
