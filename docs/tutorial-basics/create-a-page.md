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