#!/usr/bin/env bash

rm -rf dist
npx tsc
mkdir -p dist/types

for x in $(ls dist/*.d.ts); do
  mv $x dist/types
done

npx eslint --fix dist