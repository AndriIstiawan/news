
# SmartEye VR/AR Viewer App

## Prerequisites
1. Install Node.js latest

2. Install Mongodb latest

3. Clone this repository:

		https://gitlab.playcourt.id/amoeba/smarteye/platform-smarteye/platform-backend.git
		

## How to build
1. Change directory to one of the sample folders, e.g. platform-backend:

		cd platform-backend/

2. Install the sample's dependencies (see the sample's README for details):

		npm install

3. Configure the environment variables in the `.env` file

		cp example.env .env

4. Run the sample:

		node app-platform.js

  

## API Usage


### Register & Login

1. CREATE (melakukan registrasi) user baru

	`POST` request ke `http://<server_ip>/api/v1/auth/register`

	dengan form berisi:

	* username

	* password

	* email

  

2. LOGIN

	`POST` request ke `http://<server_ip>/api/v1/auth/login`

	dengan form berisi:

	* username

	* password

	Return object berisi:

	`{

	user: <username>,

	token: <token_untuk_melakukan_modifikasi_data_selanjutnya>

	}`

  

### VR Content Management

1. CREATE konten VR baru dan mendaftarkannya ke database

	`POST` request ke `http://<server_ip>/codingcamp/api/v1/vrcontents`

	dengan form berisi:

	* title

	* category

	* description

	* owner (*harus sesuai dengan salah satu username yg sudah ada*)

	* projectDir (dengan format `http://<server_ip>/asset/projects/<username>/vr/<slug_title>`)

	* thumbnail (diisi dengan `thumbnail.jpg`)

	* scenarioName (diisi dengan `vrdata.json`)

	Catatan: `slug_title` adalah title yang di convert jadi lowercase, dan spasi nya diubah jadi '-'

  

2. LIST semua konten VR

	`GET` request ke `http://<server_ip>/codingcamp/api/v1/vrcontents`

  

### AR Content Management

1. CREATE konten AR baru dan mendaftarkannya ke database

	`POST` request ke `http://<server_ip>/codingcamp/api/v1/arcontents`

	dengan form berisi:

	* title

	* category

	* description

	* owner (*harus sesuai dengan salah satu username yg sudah ada*)

	* projectDir (dengan format `http://<server_ip>/asset/projects/<username>/ar/<slug_title>`)

	* thumbnail (diisi dengan `thumbnail.jpg`)

	* objectName (diisi dengan `bundle`)

	Catatan: `slug_title` adalah title yang di convert jadi lowercase, dan spasi nya diubah jadi '-'

  

2. LIST semua konten AR

	`GET` request ke `http://<server_ip>/codingcamp/api/v1/arcontents`

  

# Testing Code

1. lakukan perintah untuk menjalankan test
  

## Run all test

1. npm run unit-test

	perintah ini di jalankan untuk melakukan run unit-test.


## Contributing

  

1. Fork it!

2. Create your feature branch: `git checkout -b my-new-feature`

3. Commit your changes: `git commit -am 'Add some feature'`

4. Push to the branch: `git push origin my-new-feature`

5. Submit a pull request :D

  

## History

  

TODO: Write history

  

## Author

* Fahmi 
* Andri
  

TODO: Write credits

  

## License

  

TODO: Write license