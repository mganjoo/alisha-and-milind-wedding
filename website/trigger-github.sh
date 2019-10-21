#!/usr/bin/env bash

# Setup based on instructions in:
# http://www.btellez.com/posts/triggering-github-actions-with-webhooks.html

if [ "$PULL_REQUEST" = true ]; then
    echo "Ignoring GitHub trigger for pull request build"
else
    echo "Triggering GitHub build against deployed url $DEPLOY_URL"

    curl_command="curl -X POST \
        -H \"Accept: application/vnd.github.everest-preview+json\" \
        -H \"Authorization: token <GITHUB_TRIGGER_TOKEN>\" \
        -H \"Content-Type: application/json\" \
        --data '{\"event_type\": \"externalUrl_${DEPLOY_URL}\"}' \
        https://api.github.com/repos/mganjoo/alisha-and-milind-wedding/dispatches"

    echo "Running cURL command:"
    echo ${curl_command}

    eval ${curl_command/<GITHUB_TRIGGER_TOKEN>/$GITHUB_TRIGGER_TOKEN}
fi
