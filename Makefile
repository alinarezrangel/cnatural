TARGET=cnatural.out
SRC=src
INC=include
OBJC=main.o ajaxcore.o
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
	$(CC) -c $(SRC)/main.c -o main.o $(CFLAGS)

ajaxcore.o: $(SRC)/ajaxcore.c $(INC)/ajaxcore.h
	$(CC) -c $(SRC)/ajaxcore.c -o ajaxcore.o $(CFLAGS)

clean:
	rm $(TARGET) $(OBJC)
