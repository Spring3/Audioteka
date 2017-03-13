#!/bin/bash
if [ $1 = "mac" ]
  then npm run pack-$1-x64
elif [ $1 = "linux" ]
  then npm run pack-$1-ia32 && npm run pack-$1-x64
fi
