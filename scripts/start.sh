#!/bin/bash
cd /home/ubuntu/vting/server/dist

authbind --deep pm2 start index.js