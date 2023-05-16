---
sidebar_position: 3
---

# Step 3: Deploy new app with docker-compose

1. login to portainer and create a new stack (admin.test.yourdomain.com)
2. copy the docker-compose.yml file
3. create the directory /mnt/data/appname
4. click on deploy the stack

### Example for deploying gitlab CE

Login ssh to your server dans create the directory for gitlab

```bash
    mkdir /mnt/gitlabce
```

**Create stack on portainer**

Select you environment and click on "Add stack"

Copy the docker-compose.yml file and click on "Deploy the stack". Please make sure the directory (volumes in docker compose) is created.

```yml
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