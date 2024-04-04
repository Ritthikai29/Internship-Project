# STSBidding


Code insert and return id
```
INSERT INTO projects([key], [name], [Tor_uri], [Job_description_uri], [add_datetime], [price])
OUTPUT Inserted.id
VALUES('1221', 'Testing', 'file', 'file', '2022-10-10', DEFAULT);
```

# when deploy
on deploy we use folder 
`asset` `errors` `service` `vendor` `src-old -> src` 

and for react we should run `npm run build` and copy file in `dist` and paste to `frontend`

or (change a web.config) of the server to active in this server



# How To Run this project
1. install `php` (windows => [xampp](https://www.apachefriends.org/download.html), macos => [HomeBrew](https://www.apachefriends.org/download.html))
2. set path of php to path env (only windows)
3. install [composer](https://getcomposer.org/)
4. in macos can follow this [docs](https://nextflow.in.th/2015/install-php-composer-os-x/)
5. in windows can follow this [docs](https://nextflow.in.th/2017/install-php-composer-windows-thai/)
6. use command `composer install`
7. in local you can use `docker compose up -d` to run backend and use `npm run dev` to run frontend
