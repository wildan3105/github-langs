FROM debian:stretch
WORKDIR /app
COPY . .
RUN mkdir build && mkdir build/screenshot-testing
RUN apt-get update
RUN apt-get install -y dialog apt-utils git curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs firefox-esr xvfb
RUN npm install
EXPOSE 5000
CMD ["bash"]
