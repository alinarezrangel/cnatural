# Copyright 2016 Alejandro Linarez Rangel
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# 		http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Name of the target binary
TARGET=cnatural.out
# Directory with the server source code
SRC=src
# Directory with the server include headers
INC=include
# All objects files (starting with main.o)
OBJC=main.o ajaxcore.o ajaxtypes.o coreutils_import.o list.o tokens.o configfile.o coreutils_login.o coreutils_time.o basicio_readfile.o
# All compilation libraries
LIBS=-L$PATH_TO_LIBMHD_LIBS -lmicrohttpd -lutil
# All compilation include paths
INCLUDES=-I$PATH_TO_LIBMHD_INCLUDES -I$(INC)
# Warning flags (-Wall by default)
WARN=-Wall
# Optimization flags (by default, none or -O0)
OPT=-O0
# Debug flags (may be removed in production)
DEBUG=-g
# C starndard to be used (by default, C99)
STD=-std=c99
# Compilation flags
CFLAGS=$(STD) $(WARN) $(OPT) $(DEBUG) $(INCLUDES) -pthread
# Linker flags
LDFLAGS=$(LIBS) -ljwt
# C compiler
CC=gcc
# Linker
LD=gcc
# Path where the server will be installed
INSTALLPATH=/opt/cnatural-server
# Prefix of NPM when installs a module
NPM_PREFIX=/usr/local/lib/node_modules
# Template used to the JSDoc3 output
# By default uses ink-docstar (npm install --global ink-docstrap)
# but you can change it
JSDOC_TEMPLATE=$(NPM_PREFIX)/ink-docstrap/template
# Argument passed to JSDoc3 for set a template
# Leave it blank for NOT use a template
JSDOC_TEMPLATE_ARG=-t $(JSDOC_TEMPLATE)
# JavaScript files to document
JSFILES_TO_DOC=public_http/jscore/* private_http/jscore/shells/*
# Index page for the JavaScript documentation
JSDOC_INDEX=docs/js/home.md
# Configuration file of the JavaScript documentation
JSDOC_CONF=docs/js/conf.json
# Path to the Doxyfile conf. file
DOXYFILE_PATH=docs/c/Doxyfile

$(TARGET): $(OBJC)
	$(LD) $(OBJC) -o $(TARGET) $(LDFLAGS)

main.o: $(SRC)/main.c
	$(CC) -c $< -o $@ $(CFLAGS)

ajaxcore.o: $(SRC)/ajaxcore.c $(INC)/ajaxcore.h
	$(CC) -c $< -o $@ $(CFLAGS)

ajaxtypes.o: $(SRC)/ajaxtypes.c $(INC)/ajaxtypes.h
	$(CC) -c $< -o $@ $(CFLAGS)

configfile.o: $(SRC)/configfile.c $(INC)/configfile.h
	$(CC) -c $< -o $@ $(CFLAGS)

list.o: $(SRC)/list.c $(INC)/list.h
	$(CC) -c $< -o $@ $(CFLAGS)

tokens.o: $(SRC)/tokens.c $(INC)/tokens.h
	$(CC) -c $< -o $@ $(CFLAGS)

coreutils_import.o: $(SRC)/coreutils/import.c $(INC)/coreutils/import.h
	$(CC) -c $< -o $@ $(CFLAGS)

coreutils_login.o: $(SRC)/coreutils/login.c $(INC)/coreutils/login.h
	$(CC) -c $< -o $@ $(CFLAGS)

coreutils_time.o: $(SRC)/coreutils/time.c $(INC)/coreutils/time.h
	$(CC) -c $< -o $@ $(CFLAGS)

basicio_readfile.o: $(SRC)/basicio/readfile.c $(INC)/basicio/readfile.h
	$(CC) -c $< -o $@ $(CFLAGS)

clean:
	rm $(TARGET) $(OBJC)

cleandocs:
	rm docs/js/out -R
	rm docs/c/out -R

# Other targets:

# Installation
install: $(TARGET)
	mkdir $(INSTALLPATH)
	cp $(TARGET) $(INSTALLPATH)
	cp cnatural.conf $(INSTALLPATH)
	if [ -d docs/ ]; then
		cp docs/ $(INSTALLPATH)/docs -R
	fi
	cp public_http/ $(INSTALLPATH)/public_http/ -R
	cp private_http/ $(INSTALLPATH)/private_http/ -R
	cp LICENSE $(INSTALLPATH)

# Minimal build:
minimal: $(TARGET)
	echo "You can remove the " $(SRC) " folder for free up space."
	echo "Optionally, if you will not compile apps in C, you can remove"
	echo "the " $(INC) " folder, but this is not recommended"

## Documentation

docs: docsjs docsc

# Documentation of javascript
# Needs JSDoc3
docsjs:
	jsdoc $(JSFILES_TO_DOC) --readme $(JSDOC_INDEX) -c $(JSDOC_CONF) $(JSDOC_TEMPLATE_ARG) --access all

# Documentation of c
# Needs Doxygen
docsc:
	doxygen $(DOXYFILE_PATH)

