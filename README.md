
# 🛒 Product Portal

Full Stack aplikacija za upravljanje korisnicima i proizvodima, sa admin i customer rolama. Aplikacija omogućava registraciju, prijavu, upravljanje profilima, dodavanje/brisanje proizvoda, statistiku i još mnogo toga.

## 🚀 Pokretanje projekta (lokalno bez Docker-a)

### 1. Kloniraj repozitorijum

```bash
git clone https://github.com/username/product-portal.git
cd product-portal
```

### 2. Pokreni backend (.NET Web API)

Otvori `ProductPortalAPI` folder u Visual Studio-u.

Provjeri da je konekcioni string u `appsettings.json` ispravno podešen, npr:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-THMDL7V\\SQLEXPRESS;Database=ProductPortalDB;Trusted_Connection=True;"
}
```

Pokreni projekat u Visual Studio-u (`F5` ili `Ctrl+F5`)

API će biti dostupan na: [http://localhost:5265](http://localhost:5265)

### 3. Pokreni SQL Server (SSMS)

- Otvori SQL Server Management Studio
- Poveži se na server (npr. `DESKTOP-THMDL7V\\SQLEXPRESS`)
- Baza će se automatski kreirati migracijama prilikom pokretanja aplikacije

### 4. Pokreni frontend (React)

```bash
cd product-portal-frontend
npm install
npm start
```

Frontend će biti dostupan na: [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktura projekta

```bash
product-portal/
├── ProductPortalAPI/           # Backend (.NET Web API)
├── product-portal-frontend/   # Frontend (React)
└── README.md
```

## 📦 Tehnologije

- **Frontend:** React, CSS  
- **Backend:** ASP.NET Core Web API, EF Core  
- **Baza:** SQL Server  
- **Autentifikacija:** JWT  
- **Role:** Admin, Customer  

---

## 🧑‍💻 Autor

**Radoslav (Ćole)**

---

## 🐳 Pokretanje sa Docker-om

U korijenskom folderu projekta pokreni sledeću komandu:

```bash
docker-compose up --build
```

Ova komanda će pokrenuti backend, frontend i SQL Server u kontejnerima.

> ⚠️ Napomena: Trenutno postoji problem sa povezivanjem backenda sa bazom iz Docker okruženja. Preporučuje se lokalno pokretanje dok se ne riješi problem.
