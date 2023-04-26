---
sidebar_position: 1
---

# Step 1: SetUp server

## Install docker and docker-compose
Follow the instructions on the official website to install docker and docker-compose on your machine.
Install Docker Engine on Debian : https://docs.docker.com/engine/install/debian/

# For debian 11 in 2023
Uninstall old docker version 
```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

## Set up the repository

Update the apt package index and install packages to allow apt to use a repository over HTTPS:

```bash
 sudo apt-get update

 sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
```

**Add Docker’s official GPG key:**

```bash
 sudo install -m 0755 -d /etc/apt/keyrings

 curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

 sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

**Use the following command to set up the repository:**
```bash
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## Install Docker Engine

This procedure works for Debian on x86_64 / amd64, armhf, arm64, and Raspbian.

Update the apt package index:

```bash
 sudo apt-get update
```

Install Docker Engine, containerd, and Docker Compose.
Latest
Specific version


To install the latest version, run:

```bash
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify that the Docker Engine installation is successful by running the hello-world image:

```bash
 sudo docker run hello-world
```

This command downloads a test image and runs it in a container. When the container runs, it prints a confirmation message and exits.

## Setting up docker swarm with traefik and portainer 

## Intro

In this post we will see how to create a docker swarm and deploy traefik and portainer in a debian server.
### What is traefik?

Traefik is a leading modern reverse proxy and load balancer that makes deploying microservices easy. Traefik integrates with your existing infrastructure components and configures itself automatically and dynamically.

For more info visit : https://traefik.io/traefik
What is portainer?

Portainer is the definitive container management tool for Docker, Docker Swarm with it's highly intuitive GUI and API. Portainer is a fully featured management tool for Docker. It runs locally, giving developers a rich UI to build and publish container images, deploy and manage applications and leverage data persistence and horizontal scaling for their applications. And, once an application is deployed into a container, Portainer makes it easy for users to secure, monitor and measure the performance of the platform. The tool negates the need for developers to learn Infrastructure as Code and makes it easy for them to maximize their efficiency which means both users and organizations love it.

For more info visit: https://www.portainer.io/

### What is Docker Swarm?

Docker swarm is a container orchestration tool, meaning that it allows the user to manage multiple containers deployed across multiple host machines. One of the key benefits associated with the operation of a docker swarm is the high level of availability offered for applications.

For more info: https://docs.docker.com/engine/swarm/

### Init Docker Swarm

** Know your ip **

```bash
ip addr
```
```bash
sudo docker swarm init --advertise-addr 10.0.0.3 # change the ip here with your machine ip
```

This will initialize docker in swarm mode and also display a join token for the other machines to join the cluster.

### Create a traefik network

```bash
docker network create --driver overlay traefik-public 
```

This is our primary network for the traefik.

### Create a htpasswd password

```bash
sudo docker run --rm httpd:2.4-alpine htpasswd -nbB admin <password> | cut -d ":" -f 2
```

** Escape the $ sign in the password by adding one more $ to the generated password. We need this password to protect our end point in the traefik proxy. **

Keep this password safe we will need it later.

### Create folders for Traefik

create a folder and set 600 as permission.

```bash
mkdir /mnt/data
mkdir /mnt/data/traefik
touch /mnt/data/traefik/acme.json
chmod 600 /mnt/data/traefik/acme.json
mkdir /mnt/compose 
```

for Portainer

mkdir /mnt/data/portainer

### Traefik docker compose

Traefik is our main reverse proxy and it will sit in front of all out application. we will control all the routes to our containers using traefik.

```bash
cd /mnt/compose
touch traefik.yml
```

```yaml
version: "3.3"

services:
  traefik:
    image: "traefik:latest"
    command:
      - --log.level=INFO
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker
      - --providers.docker.exposedbydefault=false
      - --providers.docker.swarmmode=true
      - --providers.docker.network=traefik-public
      - --api
      - --api.dashboard=true
      - --certificatesresolvers.leresolver.acme.caserver=https://acme-v02.api.letsencrypt.org/directory
      # update your email here
      - --certificatesresolvers.leresolver.acme.email=valentino.folio@yourdomain.com
      # Make sure the this file is available and permission is set correctly
      - --certificatesresolvers.leresolver.acme.storage=/le/acme.json
      - --certificatesresolvers.leresolver.acme.tlschallenge=true
    ports:
      - "80:80"
      - "443:443"
    networks:
      - traefik-public
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      # Make sure the volume folder is created
      - "/mnt/data/traefik/acme.json:/le/acme.json"
    deploy:
      labels:
        # Dashboard
        - "traefik.enable=true"
        # Change the host url here
        - "traefik.http.routers.traefik.rule=Host(`traefik.yourdomain.com`)"
        - "traefik.http.routers.traefik.service=api@internal"
        - "traefik.http.services.traefik.loadbalancer.server.port=8080"
        - "traefik.http.routers.traefik.tls.certresolver=leresolver"
        - "traefik.http.routers.traefik.entrypoints=websecure"
        - "traefik.http.routers.traefik.middlewares=authtraefik"
        # Change the auth password here
        - "traefik.http.middlewares.authtraefik.basicauth.users=admin:$$2y$$05$$bgRr0cehUg8CL8us4u80UuIsy.kDi9DjVNdCuXhVEHF626kIE5Glu" # user/password

        # global redirect to https
        - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-to-https"

        # middleware redirect
        - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"

  my-app:
    image: containous/whoami:latest
    networks:
      - traefik-public
    command:
      - --port=8082 # Our service listens on 8082
    deploy:
      labels:
        - "traefik.enable=true"
        # Change the host url here
        - "traefik.http.routers.my-app.rule=Host(`whoami.test.yourdomain.com`)"
        - "traefik.http.services.my-app.loadbalancer.server.port=8082"
        - "traefik.http.routers.my-app.middlewares=auth"
        - "traefik.http.routers.my-app.entrypoints=websecure"
        - "traefik.http.routers.my-app.tls=true"
        - "traefik.http.routers.my-app.tls.certresolver=leresolver"
        # Change the password here
        - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$05$$bgRr0cehUg8CL8us4u80UuIsy.kDi9DjVNdCuXhVEHF626kIE5Glu" # user/password

networks:
  traefik-public:
    external: true

```

```bash
 docker stack deploy -c traefik.yml traefik
```


### Portainer

Portainer is our container management software. We will use to deploy our docker containers.

```yml
version: "3.2"

services:
  agent:
    image: portainer/agent
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - traefik-public
    deploy:
      mode: global
      placement:
        constraints: [node.platform.os == linux]

  portainer:
    image: portainer/portainer
    command: -H tcp://tasks.agent:9001 --tlsskipverify
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      # make sure the folder is available (mkdir /mnt/data/portainer)
      - /mnt/data/portainer:/data
    networks:
      - traefik-public
    deploy:
      labels:
        - "traefik.enable=true"
        # change the host here
        - "traefik.http.routers.portainer.rule=Host(`admin.test.yourdomain.com`)"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls=true"
        - "traefik.http.routers.portainer.tls.certresolver=leresolver"
      mode: replicated
      placement:
        constraints: [node.role == manager]

networks:
  traefik-public:
    external: true
```

```bash
 docker stack deploy -c portainer.yml portainer
```

## Deploy new app with docker-compose

1. login to portainer and create a new stack (admin.test.yourdomain.com)
2. copy the docker-compose.yml file
3. create the directory /mnt/data/appname
4. click on deploy the stack

### Example for deploying gitlab CE

Login ssh to your server dans create the directory

```bash
    mkdir /mnt/gitlabce
```

**Create stack on portainer**

Select you environment and click on "Add stack"

Copy the docker-compose.yml file and click on "Deploy the stack". Please make sure the directory (volumes in docker compose) is created.

```yml
version: '3'

services:
  gitlabce:
    image: gitlab/gitlab-ce
    networks:
      - traefik-public
    environment:
      ACCEPT_EULA: "Y"
      GITLAB_ROOT_PASSWORD: "gitlabpass"
      GITLAB_OMNIBUS_CONFIG: |
        external_url gitlab.test.yourdomain.com
        gitlab_rails['smtp_enable'] = true
    volumes:
      # make sure the folder is available (mkdir /mnt/gitlabce)
      - /mnt/gitlabce:/data
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.gitlabce.rule=Host(`gitlab.test.yourdomain.com`)"
        - "traefik.http.services.gitlabce.loadbalancer.server.port=80"
        
networks:
  traefik-public:
    external: true
```

## Deploy mattermost

```bash
    mkdir /mnt/mattermost
    # mkdir /etc/localtime # if not exist

    mkdir -p /mnt/mattermost/app/config
    mkdir -p /mnt/mattermost/app/data
    mkdir -p /mnt/mattermost/app/logs
    mkdir -p /mnt/mattermost/app/plugins
    mkdir -p /mnt/mattermost/app/client-plugins
    mkdir -p /mnt/mattermost/db

    sudo chown -R 2000:2000 /mnt/mattermost/app
    sudo chmod -R 0750 /mnt/mattermost/app
    sudo chown -R 2000:2000 /mnt/mattermost/app/plugins
    sudo chmod -R 0750 /mnt/mattermost/app/plugins
    sudo chown -R 2000:2000 /mnt/mattermost/app/client-plugins
    sudo chmod -R 0750 /mnt/mattermost/app/client-plugins

```

**Create stack on portainer**

Select you environment and click on "Add stack"

Copy the docker-compose.yml file and click on "Deploy the stack". Please make sure the directory (volumes in docker compose) is created.

```yml
version: "3.8"

services:
  db:
    image: postgres:13
    networks:
      - traefik-public
    environment:
      - POSTGRES_USER=mmuser # change this with your own username or by an environment variable
      - POSTGRES_PASSWORD=mmuser_password # change this with your own ids or by an environment variable
      - POSTGRES_DB=mattermost # change this with your own ids or by an environment variable
    volumes:
      - /mnt/mattermost/db:/var/lib/postgresql/data
      - /etc/localtime:/etc/localtime:ro

  app:
    image: mattermost/mattermost-team-edition
    networks:
      - traefik-public
    environment:
        # change this with your own ids or by an environment variable
      - MM_USERNAME=mmuser
      - MM_PASSWORD=mmuser_password
      - MM_DBNAME=mattermost
      - MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:mmuser_password@db:5432/mattermost?sslmode=disable&connect_timeout=10
    volumes:
      - /mnt/mattermost/app/config:/mattermost/config:rw
      - /mnt/mattermost/app/data:/mattermost/data:rw
      - /mnt/mattermost/app/logs:/mattermost/logs:rw
      - /mnt/mattermost/app/plugins:/mattermost/plugins:rw
      - /mnt/mattermost/app/client-plugins:/mattermost/client/plugins:rw
      - /etc/localtime:/etc/localtime:ro
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=traefik-public"
        - "traefik.http.routers.mattermost.entrypoints=websecure"
        # change the host here
        - "traefik.http.routers.mattermost.rule=Host(`mattermost.test.domain.com`)"
        - "traefik.http.routers.mattermost.tls=true"
        - "traefik.http.routers.mattermost.tls.certresolver=leresolver"
        - "traefik.http.services.mattermost.loadbalancer.server.port=8065"

networks:
  traefik-public:
    external: true
```