TARGET=cnatural.out
OBJC=main.o
LIBS=-L$PATH_TO_LIBMHD_LIBS -lmicrohttpd -lutil
INCLUDES=-I$PATH_TO_LIBMHD_INCLUDES
WARN=-Wall
OPT=-O0
DEBUG=-g
STD=-std=c99
CFLAGS=$(STD) $(WARN) $(OPT) $(DEBUG) $(INCLUDES)
LDFLAGS=$(LIBS)
SRC=src/
INC=include/
CC=gcc
LD=gcc

$(TARGET): $(OBJC)
	$(LD) $(OBJC) -o $(TARGET) $(LDFLAGS)

main.o: $(SRC)/main.c
	$(CC) -c $(SRC)/main.c -o main.o $(CFLAGS)

clean:
	rm $(TARGET) $(OBJC)
