FROM openjdk:11.0.13-jdk

RUN adduser --system --group documentserver

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar

USER documentserver:documentserver

ENTRYPOINT ["java", "-jar", "/app.jar"]
