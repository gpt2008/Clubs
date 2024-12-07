@echo off
call mvn clean package
call docker build -t com.club/club-web .
call docker rm -f club-web
call docker run -d -p 9080:9080 -p 9443:9443 --name club-web com.club/club-web