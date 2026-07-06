#!/usr/bin/env sh
set -eu

if command -v npm >/dev/null 2>&1; then
  npm run start -- "$@"
else
  npx expo start "$@"
fi
