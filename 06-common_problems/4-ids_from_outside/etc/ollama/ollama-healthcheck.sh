#!/bin/sh

CACHE_FILE="/tmp/ollama_models_ready"

if [ -f "$CACHE_FILE" ]; then
    echo "Models already verified as present (using cache). Health check passed."
    exit 0
fi

echo "Running healthcheck"
OLLAMA_LIST=$(ollama list 2>&1) || { echo "Error running ollama list: $?"; exit 1; }
echo "Ollama list output: $OLLAMA_LIST"

MODEL_1_STATUS=$(echo "$OLLAMA_LIST" | grep "nomic-embed-text" || echo "MODEL_NOT_FOUND")

echo "MODEL_1_STATUS: $MODEL_1_STATUS"

if [ "$MODEL_1_STATUS" != "MODEL_NOT_FOUND" ]; then
    echo "Healthcheck passed"
    touch "$CACHE_FILE"
    exit 0
else
    echo "Healthcheck failed"
    exit 1
fi
