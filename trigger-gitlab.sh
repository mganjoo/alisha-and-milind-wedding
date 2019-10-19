#!/usr/bin/env bash

if [ "$PULL_REQUEST" = true ]; then
    echo "Ignoring GitLab trigger for pull request build"
else
    echo "Triggering GitLab build against deployed url $DEPLOY_URL on branch $BRANCH"

    curl_command="curl -X POST \
        -F token=<GITLAB_TRIGGER_TOKEN> \
        -F ref=${BRANCH} \
        -F variables[CYPRESS_baseUrl]=${DEPLOY_URL} \
        https://gitlab.com/api/v4/projects/14023493/trigger/pipeline"

    echo "Running cURL command:"
    echo ${curl_command}

    eval ${curl_command/<GITLAB_TRIGGER_TOKEN>/$GITLAB_TRIGGER_TOKEN}
fi
