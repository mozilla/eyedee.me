#!/usr/bin/env bash

sudo /sbin/chkconfig mysqld on
sudo /sbin/service mysqld start
echo "CREATE USER 'eyedeeme'@'localhost';" | mysql -u root
echo "CREATE DATABASE eyedeeme;" | mysql -u root
echo "GRANT ALL ON eyedeeme.* TO 'eyedeeme'@'localhost';" | mysql -u root
