#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <unistd.h>

#include <microhttpd.h>

#define PORT 8888

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	size_t upload_data_size,
	void** conn_klass
);
char* mystrdup(const char* str);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;

	daemon = MHD_start_daemon(
		MHD_USE_SELECT_INTERNALLY,
		PORT,
		NULL,
		NULL,
		&request_handler,
		NULL,
		MHD_OPTION_END
	);
	if(daemon == NULL)
	{
		perror("Error getting the daemon");
		exit(EXIT_FAILURE);
	}

	getchar();

	MHD_stop_daemon(daemon);
	exit(EXIT_SUCCESS);
}

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	size_t upload_data_size,
	void** conn_klass
)
{
	int ret;
	struct MHD_Response* res;
	FILE* resc;
	char* page;
	char* ufile;
	char* final_file_name;
	size_t fsize;
	size_t i;
	int urlsize;

	if(strcmp(method, "GET") != 0)
		return MHD_NO;

	urlsize = strlen(url);

	ufile = malloc(sizeof(char) * urlsize);
	if(ufile == NULL)
	{
		perror("Error malloc(ufile)");
		return MHD_NO;
	}

	memset(ufile, '\0', urlsize);
	for(i = 1; i < urlsize; i++)
	{
		ufile[i - 1] = url[i];
	}

	if(urlsize == 1)
	{
		free(ufile);
		ufile = mystrdup("htcore/index.html");
	}

	final_file_name = malloc(
		sizeof(char) *
		(
			strlen("public_http/") +
			strlen(ufile)
		)
	);
	if(final_file_name == NULL)
	{
		perror("final_file_name = malloc()");
		free(ufile);
		return MHD_NO;
	}
	sprintf(final_file_name, "public_http/%s", ufile);

	printf("Handling URL %s with the method %s and the version %s.\n", final_file_name, method, version);
	resc = fopen(final_file_name, "r");
	if(resc == NULL)
	{
		perror("Error fopening resource");
		free(ufile);
		return MHD_NO;
	}
	fseek(resc, 0L, SEEK_END);
	fsize = ftell(resc);
	rewind(resc);

	page = malloc(sizeof(char) * (fsize + 1));
	if(page == NULL)
	{
		perror("RequestHandler malloc");
		fclose(resc);
		free(ufile);
		return MHD_NO;
	}

	memset(page, '\0', fsize);
	fread(page, sizeof(char), fsize, resc);

	fclose(resc);
	free(ufile);
	free(final_file_name);

	res = MHD_create_response_from_buffer(
		fsize,
		(void*) page,
		MHD_RESPMEM_PERSISTENT
	);

	ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
	MHD_destroy_response(res);

	free(page);

	return ret;
}

char* mystrdup(const char* str)
{
	char* res = malloc(strlen(str) * sizeof(char));
	if(res == NULL)
		return NULL;
	return strcpy(res, str);
}

