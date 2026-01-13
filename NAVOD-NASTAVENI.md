# 📋 Návod na nastavení rezervačního systému s Google Sheets

## 🎯 Přehled

Tento systém funguje takto:
1. **Zákazník** vyplní rezervaci na webu
2. **Aplikace** zapíše rezervaci do Google Sheets
3. **Google Apps Script** (každou minutu) přečte nové rezervace
4. **Script automaticky přidá** rezervaci do vašeho Google Calendar
5. **Aplikace načítá** všechny události z vašeho kalendáře a blokuje obsazené termíny

---

## 📝 Krok 1: Vytvoření Google Sheets tabulky

### 1.1 Vytvoř novou tabulku

1. Jděte na: https://sheets.google.com
2. Klikněte **"Blank"** (prázdná tabulka)
3. Pojmenujte: **"Rezervace komín"**

### 1.2 Vytvoř strukturu tabulky

**V prvním řádku (hlavička) vyplňte:**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vytvořeno | Datum | Čas | Jméno | Telefon | Email | Adresa | Komíny | Krb | Poznámka | Lat | Lon | Délka | Status | Event ID |

**Zkopírujte tento řádek a vložte do prvního řádku tabulky:**
```
Vytvořeno	Datum	Čas	Jméno	Telefon	Email	Adresa	Komíny	Krb	Poznámka	Lat	Lon	Délka	Status	Event ID
```

### 1.3 Pojmenuj list

1. Klikněte pravým tlačítkem na záložku "Sheet1" dole
2. **Rename** → `Rezervace`
3. ✅ Hotovo!

---

## 🔧 Krok 2: Nastavení Google Apps Script

### 2.1 Otevři Script Editor

1. V tabulce klikněte: **Extensions** (Rozšíření) → **Apps Script**
2. Otevře se nové okno s editorem

### 2.2 Vlož kód

1. **Smažte** veškerý kód v editoru (pokud tam nějaký je)
2. **Zkopírujte CELÝ** kód ze souboru `Code.gs`
3. **Vložte** do editoru
4. Klikněte **💾 Save** (Uložit)
5. Pojmenujte projekt: **"Rezervace Sync"**

### 2.3 Publikuj jako Web App

1. Klikněte **Deploy** (Nasadit) → **New deployment** (Nové nasazení)
2. Klikněte na **⚙️ ikonu** vedle "Select type"
3. Vyberte **"Web app"**
4. Nastavte:
   - **Description:** "Rezervace API"
   - **Execute as:** **Me** (your-email@gmail.com)
   - **Who has access:** **Anyone** ⚠️ DŮLEŽITÉ!
5. Klikněte **Deploy**
6. **Autorizujte** aplikaci:
   - Klikněte "Authorize access"
   - Vyberte váš Google účet
   - Klikněte "Advanced" → "Go to Rezervace Sync (unsafe)"
   - Klikněte "Allow"
7. **ZKOPÍRUJTE URL** (vypadá jako: `https://script.google.com/macros/s/XXXXX/exec`)
   - ⚠️ **ULOŽTE SI TOTO URL!** Budete ho potřebovat!

---

## 🔄 Krok 3: Nastavení automatické synchronizace (Trigger)

### 3.1 Vytvoř trigger

1. V Apps Script editoru klikněte na **⏰ Triggers** (ikona budíku vlevo)
2. Klikněte **+ Add Trigger** (Přidat trigger) vpravo dole
3. Nastavte:
   - **Choose which function to run:** `syncReservationsToCalendar`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `Time-driven` (Časový)
   - **Select type of time based trigger:** `Minutes timer` (Minutový časovač)
   - **Select minute interval:** `Every minute` (Každou minutu)
4. Klikněte **Save**
5. Znovu autorizujte pokud se zeptá

✅ **Hotovo!** Script teď běží každou minutu automaticky!

### 3.2 Otestuj synchronizaci

1. V tabulce **ručně přidejte** testovací řádek:
   
   | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
   | [nechte prázdné] | 2026-01-20 | 10:00 | Jan Testovací | 123456789 | test@test.cz | Děčín | 1 | Ne | Test | 50.7821 | 14.2148 | 45 | Čeká na přidání | |

2. Počkejte **1 minutu**
3. Zkontrolujte:
   - Sloupec **N (Status)** by měl být: `Přidáno do kalendáře`
   - Sloupec **O (Event ID)** by měl obsahovat ID události
   - V **Google Calendar** by měla být nová událost "Jan Testovací - Děčín"

✅ Pokud funguje → skvělé! Pokud ne → podívejte se na Krok 5 (Troubleshooting)

---

## 🌐 Krok 4: Propojení aplikace s Google Sheets

### 4.1 Najdi správný soubor

1. Rozbalte **kominik-google-sheets.zip**
2. Otevřete `app.jsx` v textovém editoru (Notepad++, VS Code...)

### 4.2 Vlož URL do aplikace

1. **Najděte řádek 93** (nebo hledejte text: `YOUR_DEPLOYMENT_ID`):
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

2. **Nahraďte** `YOUR_DEPLOYMENT_ID` svým URL z Kroku 2.3:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

3. **Uložte** soubor

### 4.3 Nahraj na GitHub

1. Jděte na: https://github.com/vencakrasl-cloud/kominik-rezervace
2. Klikněte na `app.jsx`
3. Klikněte na **tužku** (Edit)
4. **Smažte vše** (Cmd+A → Delete)
5. **Zkopírujte celý** upravený `app.jsx`
6. **Vložte** (Cmd+V)
7. **Commit changes**

### 4.4 Vyčkej na build

1. Počkejte **2-3 minuty**
2. Otevřete: https://vencakrasl-cloud.github.io/kominik-rezervace/
3. **Hard refresh:** Cmd + Shift + R

---

## ✅ Krok 5: Testování celého systému

### 5.1 Otestuj rezervaci

1. Otevřete aplikaci
2. Vyplňte formulář a **vytvořte testovací rezervaci**
3. Po odeslání:
   - Zkontrolujte **Google Sheets** → měl by tam být nový řádek
   - Počkejte **1 minutu**
   - Zkontrolujte **Google Calendar** → měla by tam být nová událost
   - Zkontrolujte **aplikaci** → termín by měl být zablokovaný

### 5.2 Otestuj blokování

1. Zkuste zarezervovat **stejný čas** znovu
2. Termín by měl být **červený** a **zablokovaný**
3. ✅ Pokud ano → vše funguje!

---

## 🐛 Krok 6: Troubleshooting (řešení problémů)

### Problém: Rezervace se nepřidává do tabulky

**Řešení:**
1. Zkontrolujte že jste nahradili `YOUR_DEPLOYMENT_ID` správným URL
2. Zkontrolujte že Web App má **"Who has access: Anyone"**
3. Zkuste Web App **znovu publikovat** (Deploy → New deployment)

### Problém: Rezervace je v tabulce, ale ne v kalendáři

**Řešení:**
1. Zkontrolujte trigger:
   - Apps Script → Triggers
   - Měl by tam být trigger pro `syncReservationsToCalendar`
   - Interval: `Every minute`
2. Spusťte manuálně:
   - Apps Script editor → vyberte funkci `manualTest`
   - Klikněte **Run**
   - Zkontrolujte **View → Logs** (Ctrl+Enter)
3. Zkontrolujte název listu: musí být přesně `Rezervace`

### Problém: Script hlásí chybu

**Řešení:**
1. Apps Script → **Executions** (vlevo)
2. Najděte chybné spuštění a klikněte na něj
3. Přečtěte si chybovou zprávu
4. Obvykle problém:
   - Špatný název listu (musí být `Rezervace`)
   - Chybějící autorizace
   - Špatná struktura sloupců

### Problém: Aplikace nečte události z kalendáře

**Řešení:**
1. Zkontrolujte že máte ve vašem kalendáři nějaké události
2. Zkuste vytvořit ručně událost "Test" na příští týden
3. Refreshněte aplikaci
4. Pokud pořád nefunguje → pošlete mi screenshot console (F12)

---

## 📊 Jak to používat

### Denní použití

1. **Zákazníci** si rezervují na webu
2. **Vy** vidíte rezervace v:
   - 📅 Google Calendar (automaticky)
   - 📊 Google Sheets (pro přehled, export)
3. **Vaše ruční události** v kalendáři fungují normálně
4. **Aplikace automaticky blokuje** všechny obsazené termíny

### Správa rezervací

- **Zrušení rezervace:**
  1. Smažte událost z kalendáře
  2. (Volitelně) Označte v Sheets jako "Zrušeno"

- **Změna termínu:**
  1. Přesuňte událost v kalendáři
  2. (Volitelně) Upravte v Sheets

- **Export dat:**
  1. Google Sheets → File → Download → CSV/Excel
  2. Máte všechny rezervace v Excelu!

---

## 💰 Náklady

✅ **ÚPLNĚ ZDARMA!**

- Google Sheets: zdarma
- Google Apps Script: zdarma
- Google Calendar: zdarma
- GitHub Pages: zdarma
- **Neomezený počet rezervací** ✅

---

## 🎉 Hotovo!

Máte plně funkční rezervační systém který:
- ✅ Zapisuje rezervace automaticky do kalendáře
- ✅ Blokuje obsazené termíny
- ✅ Funguje s vašimi ručními událostmi
- ✅ Je úplně zdarma
- ✅ Neomezený počet rezervací

**Potřebujete pomoct?** Napište mi!
