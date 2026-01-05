# Code Execution Docker Images

This folder contains Dockerfiles for building custom images used by the code execution service.
These images include the `time` package pre-installed for accurate memory usage tracking.

## Why Custom Images?

The standard slim Docker images (python:3.13-slim, node:20-slim) don't include `/usr/bin/time`,
which is required for tracking memory usage of submitted code. These custom images pre-install
the `time` package so memory tracking works correctly.

## Build Instructions

Run these commands from the project root directory:

```bash
# Build Python execution image
docker build -t unicode-python:latest -f docker/python.Dockerfile docker/

# Build Node.js execution image
docker build -t unicode-node:latest -f docker/node.Dockerfile docker/

# Build GCC (C++) execution image
docker build -t unicode-gcc:latest -f docker/gcc.Dockerfile docker/
```

## Verify Images

```bash
docker image ls | findstr unicode
```

You should see:
- `unicode-python:latest`
- `unicode-node:latest`
- `unicode-gcc:latest`

## Image Details

| Image | Base Image | Purpose |
|-------|------------|---------|
| unicode-python | python:3.13-slim | Execute Python submissions |
| unicode-node | node:20-slim | Execute JavaScript submissions |
| unicode-gcc | gcc:latest | Compile and execute C++ submissions |
