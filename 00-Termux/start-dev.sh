#!/bin/bash
# Madevi dev server starter (Termux/Android)
# Dijalankan dari folder 00-Termux/, project root satu level di atas.
cd "$(dirname "$0")/.." || { echo "Project root tidak ditemukan"; exit 1; }
export NEXT_SWC_PATH=.npm-cache/next-swc
exec node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3000
