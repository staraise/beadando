# Dokumentáció

##Követelmény analizis
###Funkcionális követelmények
- Tanulóként szeretnék tantárgyakat felvenni és leadni. --> Tantárgy felvétel
- Tanulóként szeretném ha láthatnám az eddig felvett tantárgyaim --> Felvett tárgyak
- Tanárként szeretném látni az összes tantárgyat.
- Tanárként szeretnék új tantárgyat létrehozni, szerkeszteni és törölni.
- A tanulók és a tanárok bejelentkezés után használhatják a funkciókat.
- A főoldalon az alkalmazás ismertetése jelenik meg.

###Nem funkcionális követelmények
- Felhasználóbarát, ergonomikus elrendezés és kinézet.
- Gyors működés.
- Biztonságos működés: jelszavak tárolása, funkciókhoz való hozzáférés.

###Szerepkörök

- vendég: a főoldal tartalmához fér hozzá.
- tanuló: a vendég szerepkörén túl tud tantárgyat felvenni.
- tanár: az összes tantárgyat látja és tud felvenni újat.

![Kép felirata](docs/images/elsokep.PNG)

###Folyamatok
![Kép felirata](docs/images/masodikkep.PNG)

A fenti ábrán látható egy folyamat. A felhasználó megérkezik a főoldalra. Ezután lehetősége van átlépni a bejelentkező oldalra, ha a felhasználó sikeresen bejelentkezett akkor lehetősége van jelentkezni egy adott tantárgyhoz és azokat a tárgyakat megnézni ahova már jelentkezett.

![Kép felirata](docs/images/harmadikkep.PNG)

##Tervezés

###Oldaltérkép
Publikus:

- Főoldal
- Login

Tanuló

- Főoldal
- Login/Logout
- Tantárgylista
    + tantárgy jelenetkezes
    + összes tantárgy kilistázása

Tanár

- Főoldal
- Login/Logout
- Összes tantárgy lista
    + Tantárgy szerkesztése, törlése
- Új tantárgy felvétel

![Kép felirata](docs/images/negyedikkep.PNG)

###Végpontok

- GET /: főoldal
- GET /welcome: bejelentkezes utani oldal
- GET /login: bejelentkező oldal
- POST /login: bejelentkezési adatok felküldése
- GET /login/signup : regisztrációs oldal
- POST /login/signup : regisztrációs adatok felküldése
- GET /student/mysubjects: felvett tárgyak
- GET /student/registrate: összes tantárgy listázása
- POST /student/registrate: tantárgy jelentkezés
- GET /teacher/all: összes tantárgy
- POST /teacher/all: tantárgy szerkesztés törlés
- GET /teacher/new: új tantárgy felvétele
- POST /teacher/new: új tantárgy felküldése
- GET /logout: kijelentkezes

###Adatbázisterv

![Kép felirata](docs/images/otodikkep.PNG)

A fenti kép ábrázolja az adatbázis tervet. Az adatbázis 3 táblából áll.
- User
- usrelation
- subject
A usrelation tábla egy kapcsolótábla, erre azért volt szükség hogy egy user több tárgyat is feltudjon venni, viszont ezt a különböző diákok ne láthassák.

A subject tábla tartalma:
- id : Elsődleges kulcs.
- date : Ebben a mezőben tárolom a dátumot amikor az adott tantárgy létre lett hozva
- subjectname : A tantárgy neve.
- description : Tantárgy leírása.
- creditvalue : Tantárgy kreditértéke.

A user tábla tartalma:
- id : Elsődleges kulcs.
- neptun : A felhasználó neptun kódja.
- password : A felhasználó jelszava.
- surname : Vezetéknév.
- forename : Keresztnév.
- role : A felhasználó szerepe. Lehet tanár vagy diák.

##Tesztelés
A teszteléshez a mocha, chai modulokat használtam. És ezek segitségével teszteltem.

A user model egységtesztelésénél teszteltem hogy létretudunk-e hozni új felhasználót ezt updatelni és törölni.
Próbátlam egy adott usert megkeresni, és hogy a jelszava jól kódolható/dekódolható.

A funkcionális teszteléshez zombie.js-t használtam.
Ezenbelül teszteltem hogy az index jelenik meg amikor a felhasználó elösször meglátogatja az oldalt,
majd pedig teszteltem hogyha olyan oldalra próbál a felhasználó menni ahova nincs joga akkor a login page-re dobja.
És hogy itt sikeresen bejelentkezik-e a megadott paraméterekkel.

##Felhasználói dokumentáció
Az oldal a ... oldalon érhető el.

Ha tanárként akarunk bejelentkezni akkor használjuk az admin felhasználó nevet admin jelszóval.

Ha diákként akkor vagy regisztrálunk egy újat vagy pedig wtcscq/asd.
