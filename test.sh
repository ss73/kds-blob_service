#!/bin/sh
curl -X POST -d '{"name" : "A unique name", "content" : "QmFzZTY0IGVuY29kZWQgY29udGVudA=="}' http://localhost:3000/store
