"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[735],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),m=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=m(e.components);return r.createElement(l.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=m(n),d=a,k=c["".concat(l,".").concat(d)]||c[d]||u[d]||o;return n?r.createElement(k,i(i({ref:t},p),{},{components:n})):r.createElement(k,i({ref:t},p))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:a,i[1]=s;for(var m=2;m<o;m++)i[m]=n[m];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3391:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>m});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:3},i="Step 3: Deploy new app with docker-compose",s={unversionedId:"tutorial-basics/step-3",id:"tutorial-basics/step-3",title:"Step 3: Deploy new app with docker-compose",description:"1. login to portainer and create a new stack (admin.test.yourdomain.com)",source:"@site/docs/tutorial-basics/step-3.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/step-3",permalink:"/wiki/docs/tutorial-basics/step-3",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/tutorial-basics/step-3.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Step 2: Setting up docker swarm with traefik and portainer",permalink:"/wiki/docs/tutorial-basics/step-2"},next:{title:"\u2699\ufe0f Ansible",permalink:"/wiki/docs/category/\ufe0f-ansible"}},l={},m=[{value:"Example for deploying gitlab CE",id:"example-for-deploying-gitlab-ce",level:3},{value:"Deploy mattermost",id:"deploy-mattermost",level:2}],p={toc:m},c="wrapper";function u(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"step-3-deploy-new-app-with-docker-compose"},"Step 3: Deploy new app with docker-compose"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"login to portainer and create a new stack (admin.test.yourdomain.com)"),(0,a.kt)("li",{parentName:"ol"},"copy the docker-compose.yml file"),(0,a.kt)("li",{parentName:"ol"},"create the directory /mnt/data/appname"),(0,a.kt)("li",{parentName:"ol"},"click on deploy the stack")),(0,a.kt)("h3",{id:"example-for-deploying-gitlab-ce"},"Example for deploying gitlab CE"),(0,a.kt)("p",null,"Login ssh to your server dans create the directory for gitlab"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"    mkdir /mnt/gitlabce\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Create stack on portainer")),(0,a.kt)("p",null,'Select you environment and click on "Add stack"'),(0,a.kt)("p",null,'Copy the docker-compose.yml file and click on "Deploy the stack". Please make sure the directory (volumes in docker compose) is created.'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: \'3\'\n\nservices:\n  gitlabce:\n    image: gitlab/gitlab-ce\n    networks:\n      - traefik-public\n    environment:\n      ACCEPT_EULA: "Y"\n      GITLAB_ROOT_PASSWORD: "gitlabpass"\n      GITLAB_OMNIBUS_CONFIG: |\n        external_url gitlab.test.yourdomain.com\n        gitlab_rails[\'smtp_enable\'] = true\n    volumes:\n      # make sure the folder is available (mkdir /mnt/gitlabce)\n      - /mnt/gitlabce:/data\n    deploy:\n      labels:\n        - "traefik.enable=true"\n        - "traefik.http.routers.gitlabce.rule=Host(`gitlab.test.yourdomain.com`)"\n        - "traefik.http.services.gitlabce.loadbalancer.server.port=80"\n        \nnetworks:\n  traefik-public:\n    external: true\n')),(0,a.kt)("h2",{id:"deploy-mattermost"},"Deploy mattermost"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"    mkdir /mnt/mattermost\n    # mkdir /etc/localtime # if not exist\n\n    mkdir -p /mnt/mattermost/app/config\n    mkdir -p /mnt/mattermost/app/data\n    mkdir -p /mnt/mattermost/app/logs\n    mkdir -p /mnt/mattermost/app/plugins\n    mkdir -p /mnt/mattermost/app/client-plugins\n    mkdir -p /mnt/mattermost/db\n\n    sudo chown -R 2000:2000 /mnt/mattermost/app\n    sudo chmod -R 0750 /mnt/mattermost/app\n    sudo chown -R 2000:2000 /mnt/mattermost/app/plugins\n    sudo chmod -R 0750 /mnt/mattermost/app/plugins\n    sudo chown -R 2000:2000 /mnt/mattermost/app/client-plugins\n    sudo chmod -R 0750 /mnt/mattermost/app/client-plugins\n\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Create stack on portainer")),(0,a.kt)("p",null,'Select you environment and click on "Add stack"'),(0,a.kt)("p",null,'Copy the docker-compose.yml file and click on "Deploy the stack". Please make sure the directory (volumes in docker compose) is created.'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: "3.8"\n\nservices:\n  db:\n    image: postgres:13\n    networks:\n      - traefik-public\n    environment:\n      - POSTGRES_USER=mmuser # change this with your own username or by an environment variable\n      - POSTGRES_PASSWORD=mmuser_password # change this with your own ids or by an environment variable\n      - POSTGRES_DB=mattermost # change this with your own ids or by an environment variable\n    volumes:\n      - /mnt/mattermost/db:/var/lib/postgresql/data\n      - /etc/localtime:/etc/localtime:ro\n\n  app:\n    image: mattermost/mattermost-team-edition\n    networks:\n      - traefik-public\n    environment:\n        # change this with your own ids or by an environment variable\n      - MM_USERNAME=mmuser\n      - MM_PASSWORD=mmuser_password\n      - MM_DBNAME=mattermost\n      - MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:mmuser_password@db:5432/mattermost?sslmode=disable&connect_timeout=10\n    volumes:\n      - /mnt/mattermost/app/config:/mattermost/config:rw\n      - /mnt/mattermost/app/data:/mattermost/data:rw\n      - /mnt/mattermost/app/logs:/mattermost/logs:rw\n      - /mnt/mattermost/app/plugins:/mattermost/plugins:rw\n      - /mnt/mattermost/app/client-plugins:/mattermost/client/plugins:rw\n      - /etc/localtime:/etc/localtime:ro\n    deploy:\n      labels:\n        - "traefik.enable=true"\n        - "traefik.docker.network=traefik-public"\n        - "traefik.http.routers.mattermost.entrypoints=websecure"\n        # change the host here\n        - "traefik.http.routers.mattermost.rule=Host(`mattermost.test.domain.com`)"\n        - "traefik.http.routers.mattermost.tls=true"\n        - "traefik.http.routers.mattermost.tls.certresolver=leresolver"\n        - "traefik.http.services.mattermost.loadbalancer.server.port=8065"\n\nnetworks:\n  traefik-public:\n    external: true\n')))}u.isMDXComponent=!0}}]);