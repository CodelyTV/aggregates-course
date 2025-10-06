#!/bin/sh
set -e

pull_model() {
    model_name=$1
    max_retries=10
    retry_count=0

    echo "Pulling $model_name model"

    while [ $retry_count -lt $max_retries ]; do
        if ollama pull "$model_name"; then
            echo "$model_name model pulled successfully!"
            return 0
        else
            retry_count=$((retry_count + 1))
            echo "Attempt $retry_count: Failed to pull $model_name, retrying..."
            sleep 5
        fi
    done

    echo "Failed to pull $model_name model after $max_retries attempts."
    return 1
}

echo "Starting Ollama server"
ollama serve &
SERVER_PID=$!

echo "Waiting for Ollama server to be ready"
sleep 5

pull_model "nomic-embed-text"
pull_model "gemma3"

echo "Server is now running and ready to use"
wait $SERVER_PID
