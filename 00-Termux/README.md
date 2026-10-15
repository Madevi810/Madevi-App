# 00-Termux

Folder ini berisi script untuk instalasi dan menjalankan Madevi di Termux (Android).

## Isi

- `madevi-rebuild.sh` — bangun database dari nol (migrasi + seed artikel)
- `start-dev.sh` — jalankan web server di `http://127.0.0.1:3000`

## Cara pakai

```bash
cd 00-Termux

# Sekali saja (HP baru):
npm run db:bootstrap:termux   # dari root project

# Isi database (sekali saja):
bash madevi-rebuild.sh

# Setiap mau pakai:
npm run db:start               # dari root project
bash start-dev.sh
```
