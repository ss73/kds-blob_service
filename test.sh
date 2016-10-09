#!/bin/sh
curl -H "Content-Type: application/json" -X POST -d '{"name" : "A unique name", "content" : "QmFzZTY0IGVuY29kZWQgY29udGVudA=="}' http://localhost:32500/store
