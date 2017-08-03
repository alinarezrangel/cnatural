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

# Directory with the source code
SRC=src
# Directory with the include headers
INC=include
# Directory with the binaries
BIN=bin
# Directory with the libraries
DLIB=libs

# Name of the target binary
TARGET=$(BIN)/cnatural

# All objects files (starting with main.o)
OBJC= \
	$(DLIB)/main.o \
	$(DLIB)/ajaxcore.o \
	$(DLIB)/ajaxtypes.o \
	$(DLIB)/coreutils_import.o \
	$(DLIB)/list.o \
	$(DLIB)/tokens.o \
	$(DLIB)/configfile.o \
	$(DLIB)/authcall.o \
	$(DLIB)/servercore.o \
	$(DLIB)/cmdline.o \
	$(DLIB)/utilfcn.o \
	$(DLIB)/coreutils_login.o \
	$(DLIB)/coreutils_timefcn.o \
	$(DLIB)/basicio_readfile.o \
	$(DLIB)/basicio_openf.o \
	$(DLIB)/basicio_closef.o
# All compilation libraries
LIBS=-L$PATH_TO_LIBMHD_LIBS -lmicrohttpd -lutil -lcrypt
# All compilation include paths
INCLUDES=-I$PATH_TO_LIBMHD_INCLUDES -I$(INC)
# Warning flags (-Wall by default)
WARN=-Wall
# Optimization flags (by default, none or -O0)
OPT=-O0
# Debug flags (can be removed in production)
DEBUG=-g
# C starndard to be used (by default, C99)
STD=-std=c99
# Compilation flags used by CNatural
# For an explanation about the macros, see the `docs/handwritten/macros.md`
# file
DFLAGS= \
	-D"CNATURAL_USE_POSIX_STDIO" \
	-U"CNATURAL_TOKEN_NO_IGNORE_ZERO" \
	-D"CNATURAL_DEBUG" \
	-D"CNATURAL_RANDOM_ENGINE" \
	-U"CNATURAL_RDC_SAFE_MODE" \
	-U"CNATURAL_NOT_USE_RESTRICT_KEYWORD" \
	-D"CNATURAL_PASSWD_CRYPT_MTH=0" \
	-U"CNATURAL_USE_ANSI_COLOR" \
	-D"CNATURAL_DEFAULT_LOG_LEVEL=0"
# Compilation flags
CFLAGS=$(STD) $(WARN) $(OPT) $(DEBUG) $(INCLUDES) -pthread $(DFLAGS)
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
# Output folder for JS docs
DOCS_OUTPUT_JS=docs/js/out/
# Output folder for C docs
DOCS_OUTPUT_C=docs/c/out/

$(TARGET): prepare $(OBJC)
	$(LD) $(OBJC) -o $(TARGET) $(LDFLAGS)

# Build files:

$(DLIB)/main.o: $(SRC)/main.c
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/ajaxcore.o: $(SRC)/ajaxcore.c $(INC)/ajaxcore.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/ajaxtypes.o: $(SRC)/ajaxtypes.c $(INC)/ajaxtypes.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/configfile.o: $(SRC)/configfile.c $(INC)/configfile.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/list.o: $(SRC)/list.c $(INC)/list.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/tokens.o: $(SRC)/tokens.c $(INC)/tokens.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/authcall.o: $(SRC)/authcall.c $(INC)/authcall.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/servercore.o: $(SRC)/servercore.c $(INC)/servercore.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/cmdline.o: $(SRC)/cmdline.c $(INC)/cmdline.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/utilfcn.o: $(SRC)/utilfcn.c $(INC)/utilfcn.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/coreutils_import.o: $(SRC)/coreutils/import.c $(INC)/coreutils/import.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/coreutils_login.o: $(SRC)/coreutils/login.c $(INC)/coreutils/login.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/coreutils_timefcn.o: $(SRC)/coreutils/timefcn.c $(INC)/coreutils/timefcn.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/basicio_readfile.o: $(SRC)/basicio/readfile.c $(INC)/basicio/readfile.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/basicio_openf.o: $(SRC)/basicio/openf.c $(INC)/basicio/openf.h
	$(CC) -c $< -o $@ $(CFLAGS)

$(DLIB)/basicio_closef.o: $(SRC)/basicio/closef.c $(INC)/basicio/closef.h
	$(CC) -c $< -o $@ $(CFLAGS)

# Special targets:

# Prepares the current directory to build cnatural
prepare:
	mkdir -p $(BIN)
	mkdir -p $(DLIB)

# Prepares the current directory to generate the docs
prepare_docs: prepare
	mkdir -p $(DOCS_OUTPUT_C)
	mkdir -p $(DOCS_OUTPUT_JS)

# Removes all generated files (except for documentation)
clean:
	rm $(TARGET) $(OBJC)

# Removes all generated documentation
cleandocs:
	rm docs/js/out -R
	rm docs/c/out -R

# Other targets:

# Installs cnatural
install: $(TARGET)
	mkdir $(INSTALLPATH)
	cp $(BIN) $(INSTALLPATH) -R
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
docsjs: prepare_docs
	jsdoc $(JSFILES_TO_DOC) --readme $(JSDOC_INDEX) -c $(JSDOC_CONF) $(JSDOC_TEMPLATE_ARG) --access all

# Documentation of c
# Needs Doxygen
docsc: prepare_docs
	doxygen $(DOXYFILE_PATH)
