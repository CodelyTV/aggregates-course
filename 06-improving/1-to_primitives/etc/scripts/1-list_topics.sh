docker exec -it 3-versioning-kafka-1 \
  /bin/kafka-topics --list \
                    --bootstrap-server kafka:9092
