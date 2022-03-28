#!/bin/bash
cd /home/ubuntu/vting/server/dist

<<<<<<< HEAD
=======
export DATABASE_URL=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_URL --query Parameters[0].Value | sed 's/"//g')
export 
PORT=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_PORT --query Parameters[0].Value | sed 's/"//g')
export ACCESS_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names ACCESS_SECRET --query Parameters[0].Value | sed 's/"//g')

>>>>>>> 6f1ca17a8da061c763774ed0efcbde3b5af2efbf
authbind --deep pm2 start index.js