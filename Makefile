PROJECT_NAME ?= coursemanager
ORG_NAEM ?= thishandp7

DEV_DOCKERCOMPOSE_FILE := docker/test/docker-compose.yml
REL_DOCKERCOMPOSE_FILE := docker/release/docker-compose.yml

DEV_PROJECT := $(PROJECT_NAME)dev
REL_PROJECT := $(PROJECT_NAME)$(BUILD_ID)

.PHONY: test build release clean

test:
	${INFO} "Creating packages volume..."
	@ docker volume create --name=packages
	${INFO} "Pulling the latest images..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) pull
	${INFO} "Build dev image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) build --pull tests
	${INFO} "Running tests..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) up -d tests
	${INFO} "Tests complete"

build:
	${INFO} "Pulling the latest image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) pull builder
	${INFO} "Building files..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) up -d builder
	${INFO} "Cleaning old build artifacts..."
	@ rm -rf target
	${INFO} "Copying build artifacts..."
	@ mkdir -p target && mkdir -p target/tools
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):usr/src/app/dist/ target
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):usr/src/app/tools/distServer.js target/tools
	${INFO} "Build complete"

release:

clean:
	${INFO} "Destroying development environment...."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) kill
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) rm -f -v


#colors
LIGHT_YELLOW := "\e[93m"
NO_COLOR := "\e[0m"

#Shell Functions
INFO := @bash -c '\
	printf $(LIGHT_YELLOW); \
	echo "=> $$1"; \
	printf $(NO_COLOR)' VALUE
