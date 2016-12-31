TARGET=cnatural.out
SRC=src
INC=include
OBJC=main.o ajaxcore.o ajaxtypes.o coreutils_import.o list.o tokens.o coreutils_login.o
LIBS=-L$PATH_TO_LIBMHD_LIBS -lmicrohttpd -lutil
INCLUDES=-I$PATH_TO_LIBMHD_INCLUDES -I$(INC)
WARN=-Wall
OPT=-O0
DEBUG=-g
STD=-std=c99
CFLAGS=$(STD) $(WARN) $(OPT) $(DEBUG) $(INCLUDES)
LDFLAGS=$(LIBS)
CC=gcc
LD=gcc

$(TARGET): $(OBJC)
	$(LD) $(OBJC) -o $(TARGET) $(LDFLAGS)

main.o: $(SRC)/main.c
	$(CC) -c $< -o $@ $(CFLAGS)

ajaxcore.o: $(SRC)/ajaxcore.c $(INC)/ajaxcore.h
	$(CC) -c $< -o $@ $(CFLAGS)

ajaxtypes.o: $(SRC)/ajaxtypes.c $(INC)/ajaxtypes.h
	$(CC) -c $< -o $@ $(CFLAGS)

list.o: $(SRC)/list.c $(INC)/list.h
	$(CC) -c $< -o $@ $(CFLAGS)

tokens.o: $(SRC)/tokens.c $(INC)/tokens.h
	$(CC) -c $< -o $@ $(CFLAGS)

coreutils_import.o: $(SRC)/coreutils/import.c $(INC)/coreutils/import.h
	$(CC) -c $< -o $@ $(CFLAGS)

coreutils_login.o: $(SRC)/coreutils/login.c $(INC)/coreutils/login.h
	$(CC) -c $< -o $@ $(CFLAGS)

clean:
	rm $(TARGET) $(OBJC)
