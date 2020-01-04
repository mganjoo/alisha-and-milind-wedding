#!/usr/bin/env bash

# Setup based on instructions in:
# http://www.btellez.com/posts/triggering-github-actions-with-webhooks.html

if [ "$PULL_REQUEST" = true ]; then
  echo "Ignoring GitHub trigger for pull request build"
elif [ "$DEPLOY_ID" != "" ] && [ "$GITHUB_TRIGGER_TOKEN" != "" ]; then
  echo "Triggering GitHub build against deployed ID $DEPLOY_ID"

  curl_command="curl -X POST \
    -H \"Accept: application/vnd.github.everest-preview+json\" \
    -H \"Authorization: token <GITHUB_TRIGGER_TOKEN>\" \
    -H \"Content-Type: application/json\" \
    --data '{\"event_type\": \"externalUrl_${DEPLOY_ID}\"}' \
    https://api.github.com/repos/mganjoo/alisha-and-milind-wedding/dispatches"

  echo "Running cURL command:"
  echo ${curl_command}

  eval ${curl_command/<GITHUB_TRIGGER_TOKEN>/$GITHUB_TRIGGER_TOKEN}
else
  echo "Either DEPLOY_ID or GITHUB_TRIGGER_TOKEN environment variable was not provided to GitHub trigger job"
  exit 1
fi
