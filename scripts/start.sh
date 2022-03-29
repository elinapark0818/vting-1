#!/bin/bash
cd /home/ubuntu/vting/server/dist

export DATABASE_URL=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_URL --query Parameters[0].Value | sed 's/"//g')
export 
DATABASE_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_PORT --query Parameters[0].Value | sed 's/"//g')
export ACCESS_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names ACCESS_SECRET --query Parameters[0].Value | sed 's/"//g')

authbind --deep pm2 start index.js