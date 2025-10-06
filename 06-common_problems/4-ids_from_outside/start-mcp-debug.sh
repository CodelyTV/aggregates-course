#!/bin/bash
export NODE_OPTIONS='--inspect-brk=9229'
exec ts-node ./src/app/mcp/server.ts