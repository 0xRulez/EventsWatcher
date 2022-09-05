#!/bin/bash
tar --exclude="*DS_Store" -cvf deploy.tar network.js index.js database.js artifacts
