#!/bin/sh
mvn clean package && docker build -t com.club/club-web-ui .
docker rm -f club-web-ui || true && docker run -d -p 9080:9080 -p 9443:9443 --name club-web-ui com.club/club-web-ui