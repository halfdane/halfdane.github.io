#!/bin/bash

if [[ $2 != *__* ]] && [[ $2 != *.idea* ]] && [[ $2 != *_site* ]]; then
    jekyll build
fi
