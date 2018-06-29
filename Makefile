PROJECT_NAME ?= coursemanager
ORG_NAME ?= thishandp7
REPO_NAME ?= cmanager

DEV_DOCKERCOMPOSE_FILE := docker/test/docker-compose.yml
REL_DOCKERCOMPOSE_FILE := docker/release/docker-compose.yml

DEV_PROJECT := $(PROJECT_NAME)dev
REL_PROJECT := $(PROJECT_NAME)$(BUILD_ID)

APP_SERVICE_NAME := app

BUILD_TAG_EXPRESSION ?= data -u +%y%m%d%H%M%S

BUILD_EXPRESSION := $(shell $(BUILD_TAG_EXPRESSION))

BUILD_TAG ?= $(BUILD_EXPRESSION)

#for error handling
INSPECT := $$(docker-compose -p $$1 -f $$2 ps -q $$3 | xargs -I ARGS docker inspect -f "{{ .State.ExitCode }}" ARGS)

#for error handling
CHECK := @bash -c '\
  if [[ $(INSPECT) -ne 0 ]]; \
	then exit $(INSPECT); fi' VALUE

DOCKER_REGISTRY := docker.io

DOCKER_REGISTRY_AUTH ?=

.PHONY: test build release clean tag publish login logout

test:
	${INFO} "Pulling the latest images..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) pull
	${INFO} "Build dev image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) build --pull tests
	${INFO} "Running tests..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) run --rm tests
	${INFO} "Tests complete"

build:
	${INFO} "Pulling the latest image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) build builder
	${INFO} "Creating folders..."
	@ mkdir -p target/dist && mkdir -p target/tools
	${INFO} "Building files..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) up builder
	${CHECK} ${DEV_PROJECT} ${DEV_DOCKERCOMPOSE_FILE} builder
	${INFO} "Copying build artifacts..."
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/dist/. target/dist
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/package.json target
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/tools/distServer.js target/tools
	${INFO} "Build complete"

release:
	${INFO} "Pulling the latest images..."
	@ docker-compose -p $(REL_PROJECT) -f $(REL_DOCKERCOMPOSE_FILE) build --pull app
	@ docker-compose -p $(REL_PROJECT) -f $(REL_DOCKERCOMPOSE_FILE) run --rm -d app
	${INFO} "Release image complete"

tag:
	${INFO} "Tagging release image with tags $(TAG_ARGS)..."
	@ $(foreach tag, $(TAG_ARGS), docker tag $(IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag);)
	${INFO} "Tagging complete"

buildtag:
	${INFO} "Tagging release image with suffix $(BUILD_TAG) and build tags $(BUILDTAG_ARGS)..."
	@ $(foreach tag, $(BUILDTAG_ARGS), docker tag $(IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag).$(BUILD_TAG);)
	${INFO} "Tagging complete"

publish:
		${INFO} "Publishing release images $(IMAGE_ID) to $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME)..."
		@ $(foreach tag, $(shell echo $(REPO_EXPR)), docker push $(tag);)
		$(INFO) "Publish complete"

login:
	${INFO} "Loggin into Docker registry..."
	@ docker login -u $$DOCKER_USER -p $$DOCKER_PASSWORD $(DOCKER_REGISTRY_AUTH)
	$(INFO) "Logged in"

logout:
	$(INFO) "Logging out"
	@ docker logout
	$(INFO) "Logged out"

clean:
	${INFO} "Destroying development environment...."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) kill
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) rm -f -v
	${INFO} "Cleaning old build artifacts..."
	@ rm -rf target
	${INFO} "Cleaning complete"

#colors
LIGHT_YELLOW := "\e[93m"
NO_COLOR := "\e[0m"

#Shell Functions
INFO := @bash -c '\
	printf $(LIGHT_YELLOW); \
	echo "=> $$1"; \
	printf $(NO_COLOR)' VALUE


APP_CONTAINER_ID := $$(docker-compose -p $(REL_PROJECT) -f $(REL_DOCKERCOMPOSE_FILE) ps -q $(APP_SERVICE_NAME))

IMAGE_ID := $$(docker inspect -f '{{ .Image }}' $(APP_CONTAINER_ID))


ifeq ($(DOCKER_REGISTRY),docker.io)
  REPO_FILTER := $(ORG_NAME)/$(REPO_NAME)[^[:space:]|\$$]*
else
  REPO_FILTER := $(DOCKER_REGISTRY)/$(ORG_NAME)[^[:space:]|\$$]*
endif

REPO_EXPR := $$(docker inspect -f '{{range .RepoTags}}{{.}} {{end}}' $(IMAGE_ID) | grep -oh "$(REPO_FILTER)" | xargs)

#Build tags
ifeq (buildtag,$(firstword $(MAKECMDGOALS)))
	BUILDTAG_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  ifeq ($(BUILDTAG_ARGS),)
  	$(error you must specify a tag)
  endif
  $(eval $(BUILDTAG_ARGS):;@:)
endif

#tags
ifeq (tag,$(firstword $(MAKECMDGOALS)))
  TAG_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  ifeq ($(TAG_ARGS),)
    $(error you must specify a tag)
  endif
  $(eval $(TAG_ARGS):;@:)
endif
