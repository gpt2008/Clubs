#!/bin/sh
mvn clean package && docker build -t com.club/club-web .
docker rm -f club-web || true && docker run -d -p 9080:9080 -p 9443:9443 --name club-web com.club/club-web