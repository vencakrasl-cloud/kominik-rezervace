# 🔥 Rezervační systém pro kominíka

Inteligentní rezervační systém s automatickým plánováním tras, Google Calendar integrací a real-time blokováním obsazených termínů.

## ✨ Funkce

- ✅ **Google Calendar integrace** - Automatická synchronizace rezervací
- ✅ **Inteligentní plánování tras** - Optimalizace podle vzdálenosti a směru
- ✅ **Autocomplete adres** - Vyhledávání všech českých adres
- ✅ **Půlhodinové sloty** - Flexibilní časové intervaly
- ✅ **Automatické blokování** - Konfliktní termíny se nezobraují
- ✅ **Responsive design** - Funguje na mobilu i PC

## 🚀 Nasazení na GitHub Pages

### Krok 1: Forkněte tento repozitář
1. Klikněte na tlačítko **"Fork"** vpravo nahoře
2. Vyberte svůj účet

### Krok 2: Zapněte GitHub Pages
1. Jděte do **Settings** (nastavení vašeho forku)
2. V levém menu klikněte na **"Pages"**
3. V sekci **"Source"** vyberte **"Deploy from a branch"**
4. V **"Branch"** vyberte **"main"** a složku **"/ (root)"**
5. Klikněte **"Save"**

### Krok 3: Získejte URL
- Za pár minut bude web dostupný na: `https://vase-uzivatelske-jmeno.github.io/kominik-rezervace/`
- URL najdete nahoře na stránce Pages v Settingu

## 🔧 Jak upravit Google Client ID

Pokud chcete použít vlastní Google Calendar:

1. Otevřete soubor `app.jsx`
2. Najděte řádek (cca řádek 92):
   ```javascript
   const GOOGLE_CLIENT_ID = '906589944502-45phnl4plesvc97b227nprn4rbckfkhg.apps.googleusercontent.com';
   ```
3. Nahraďte svým Client ID z Google Cloud Console
4. V Google Cloud Console přidejte do **Authorized JavaScript origins**:
   ```
   https://vase-uzivatelske-jmeno.github.io
   ```

## 📝 Jak upravit města a vesnice

Města a vesnice jsou v souboru `app.jsx` v objektu `CITIES_DATABASE` (cca řádek 100).

Příklad přidání nového města:
```javascript
'Nové Město': { lat: 50.1234, lon: 14.5678, district: 'Děčín' },
```

## 🎨 Jak změnit barvy

Aplikace používá Tailwind CSS. Barvy můžete změnit nahrazením:
- `orange-` → `blue-`, `green-`, `purple-` atd.
- Např. `bg-orange-600` → `bg-blue-600`

## 📱 Jak vložit do Wixu

1. Ve Wix Editoru přidejte element **"HTML iFrame"**
2. Vložte URL vašeho GitHub Pages webu
3. Nastavte výšku na `800px` nebo více

## 🐛 Řešení problémů

### Google Calendar se nepřipojuje
- Zkontrolujte, že máte správný Client ID
- Ověřte, že jste přidali správnou URL do Google Cloud Console
- Zkuste vymazat cookies a zkusit znovu

### Aplikace se nenačítá
- Zkontrolujte, že GitHub Pages jsou zapnuté
- Počkejte 2-5 minut po zapnutí (GitHub potřebuje čas na build)
- Zkuste hard refresh (Ctrl+F5)

## 📞 Podpora

Pro otázky a problémy vytvořte Issue v tomto repozitáři.

---

Made with ❤️ for komina.cz
