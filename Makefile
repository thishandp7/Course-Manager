PROJECT_NAME ?= coursemanager
ORG_NAEM ?= thishandp7

DEV_DOCKERCOMPOSE_FILE := docker/test/docker-compose.yml
REL_DOCKERCOMPOSE_FILE := docker/release/docker-compose.yml

DEV_PROJECT := $(PROJECT_NAME)dev
REL_PROJECT := $(PROJECT_NAME)$(BUILD_ID)

.PHONY: test build release clean

test:
	${INFO} "Pulling the latest images..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) pull
	${INFO} "Build dev image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) build --pull tests
	${INFO} "Running tests..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) up tests
	${INFO} "Tests complete"

build:
	${INFO} "Pulling the latest image..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) build builder
	${INFO} "Creating folders..."
	@ mkdir -p target/dist && mkdir -p target/tools
	${INFO} "Building files..."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) up builder
	${INFO} "Copying build artifacts..."
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/dist/. target/dist
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/package.json target
	@ docker cp $$(docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) ps -q builder):/app/tools/distServer.js target/tools
	${INFO} "Build complete"

release:
	${INFO} "Pulling the latest inages..."
	@ docker-compose -p $(REL_PROJECT) -f $(REL_DOCKERCOMPOSE_FILE) build --pull app

clean:
	${INFO} "Destroying development environment...."
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) kill
	@ docker-compose -p $(DEV_PROJECT) -f $(DEV_DOCKERCOMPOSE_FILE) rm -f -v
	${INFO} "Cleaning old build artifacts..."
	@ rm -rf target
	@ docker container prune
	@ docker volume prune
	@ docker image prune --all -f

#colors
LIGHT_YELLOW := "\e[93m"
NO_COLOR := "\e[0m"

#Shell Functions
INFO := @bash -c '\
	printf $(LIGHT_YELLOW); \
	echo "=> $$1"; \
	printf $(NO_COLOR)' VALUE
