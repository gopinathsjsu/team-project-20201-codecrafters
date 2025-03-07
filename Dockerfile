FROM openjdk:23
EXPOSE 8080
ADD target/server-0.1.jar /server/srv/server-0.1.jar
CMD ["java", "-jar", "/server/srv/server-0.1.jar"]
