
# Kompas News API

## Prerequisites
1. Clone this repository:

		https://github.com/AndriIstiawan/news.git
		

## How to build
1. Change directory to one of the sample folders, e.g. news:

		cd news/

2. Configure the environment variables in the `.env` file

		cp example.env .env

3. if you run nginx in os, please stop before run the docker-compose

4. Run the docker-compose:

		docker-compose up -d --build

5. run in browser http://0.0.0.0
  

## API Usage


### Register & Login

1. CREATE register user

	`POST` request ke `http://<server_ip>/api/v1/auth/register`

	form:

	* username

	* password

	* email


2. LOGIN

	`POST` request ke `http://<server_ip>/api/v1/auth/login`

	form:

	* username

	* password

	*default user ( username: author, pass: author)*

	Return object berisi:

	`{

	user: <username>,

	token: <token_untuk_melakukan_modifikasi_data_selanjutnya>

	}`

  

### News Management

1. CREATE news 

	`POST` request ke `http://<server_ip>/api/v1/news`

	form:

	* title

	* body

	* status (*must match one of the existing*)

2. Update news 

	`PUT` request ke `http://<server_ip>/api/v1/news/{newsId} ` ( *ex newsId : 918293847591829384951293*) 

	form:

	* title

	* body

	* status (*must match one of the existing*)

3. Delete news 

	`DELETE` request ke `http://<server_ip>/api/v1/news/{newsId} ` ( *ex newsId : 918293847591829384951293*)   

4. LIST All news

	`GET` request ke `http://<server_ip>/api/v1/news`

5. LIST news by Author

	`GET` request ke `http://<server_ip>/api/v1/news/me`

6. Get One news

	`GET` request ke `http://<server_ip>/api/v1/news/{newsId} ` ( *ex newsId : 918293847591829384951293*) 
	

### Status Management

1. LIST All status

	`GET` request ke `http://<server_ip>/api/v1/status`


## Contributing

  

1. Fork it!

2. Create your feature branch: `git checkout -b my-new-feature`

3. Commit your changes: `git commit -am 'Add some feature'`

4. Push to the branch: `git push origin my-new-feature`

5. Submit a pull request :D

  

## History

  

TODO: Write history

  

## Author

* Andri
  

TODO: Write credits

  

## License

  

TODO: Write license