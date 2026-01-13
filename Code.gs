// Google Apps Script pro synchronizaci rezervací z Google Sheets do Google Calendar
// Tento script běží každou minutu a automaticky přidává nové rezervace do kalendáře

// === KONFIGURACE ===
const CALENDAR_ID = 'primary'; // Váš hlavní kalendář (nebo ID konkrétního kalendáře)
const SHEET_NAME = 'Rezervace'; // Název listu v tabulce

// === FUNKCE PRO PŘÍJEM DAT Z WEBOVÉ APLIKACE ===
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // Přidání nového řádku do tabulky
    sheet.appendRow([
      new Date(), // Časová značka vytvoření
      data.date,
      data.time,
      data.customerName,
      data.customerPhone,
      data.customerEmail,
      data.address,
      data.chimneysCount,
      data.fireplaceCleaning ? 'Ano' : 'Ne',
      data.notes,
      data.lat,
      data.lon,
      data.duration,
      'Čeká na přidání', // Status
      '' // ID události v kalendáři (vyplní se automaticky)
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Chyba při příjmu dat: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// === FUNKCE PRO DOVOLÁNÍ Z GET REQUESTU (pro testování) ===
function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script běží! Použijte POST request pro odeslání rezervace.');
}

// === HLAVNÍ FUNKCE - Synchronizace tabulky do kalendáře ===
function syncReservationsToCalendar() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    
    if (!calendar) {
      Logger.log('CHYBA: Kalendář nenalezen!');
      return;
    }
    
    // Získej všechny řádky (kromě hlavičky)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Začni od řádku 2 (přeskočit hlavičku)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Sloupce:
      // 0: Časová značka, 1: Datum, 2: Čas, 3: Jméno, 4: Telefon, 5: Email,
      // 6: Adresa, 7: Počet komínů, 8: Krb, 9: Poznámka,
      // 10: Latitude, 11: Longitude, 12: Délka, 13: Status, 14: Event ID
      
      const status = row[13];
      
      // Přeskočit, pokud už je přidáno
      if (status === 'Přidáno do kalendáře') {
        continue;
      }
      
      // Parsování data a času
      const dateStr = row[1];
      const timeStr = row[2];
      const duration = row[12]; // minuty
      
      // Vytvoř Date objekty
      let startDate;
      if (typeof dateStr === 'string') {
        // Formát: YYYY-MM-DD
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        startDate = new Date(year, month - 1, day, hours, minutes);
      } else {
        // dateStr je už Date objekt
        startDate = new Date(dateStr);
        const [hours, minutes] = timeStr.split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      }
      
      const endDate = new Date(startDate.getTime() + duration * 60000);
      
      // Vytvoř popis události
      const description = `Zákazník: ${row[3]}
Email: ${row[5]}
Telefon: ${row[4]}
Počet komínů: ${row[7]}
${row[8] === 'Ano' ? 'Čištění krbu: Ano' : ''}
Poznámka: ${row[9] || '-'}

GPS: lat: ${row[10]}, lon: ${row[11]}`;
      
      // Vytvoř událost v kalendáři
      const event = calendar.createEvent(
        `${row[3]} - ${row[6]}`, // Název: Jméno - Adresa
        startDate,
        endDate,
        {
          description: description,
          location: row[6]
        }
      );
      
      // Aktualizuj status a ID události v tabulce
      sheet.getRange(i + 1, 14).setValue('Přidáno do kalendáře'); // Sloupec 14 (N) = Status
      sheet.getRange(i + 1, 15).setValue(event.getId()); // Sloupec 15 (O) = Event ID
      
      Logger.log(`✅ Přidáno: ${row[3]} - ${dateStr} ${timeStr}`);
    }
    
    Logger.log('✅ Synchronizace dokončena!');
    
  } catch (error) {
    Logger.log('❌ CHYBA při synchronizaci: ' + error.toString());
  }
}

// === FUNKCE PRO NAČÍTÁNÍ VŠECH UDÁLOSTÍ Z KALENDÁŘE (pro aplikaci) ===
// Tato funkce vrací všechny události, aby aplikace mohla blokovat termíny
function getCalendarEvents() {
  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    const now = new Date();
    const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 dní
    
    const events = calendar.getEvents(now, twoMonthsLater);
    
    const eventData = events.map(event => ({
      id: event.getId(),
      title: event.getTitle(),
      start: event.getStartTime().toISOString(),
      end: event.getEndTime().toISOString(),
      isAllDay: event.isAllDayEvent(),
      location: event.getLocation(),
      description: event.getDescription()
    }));
    
    return ContentService.createTextOutput(JSON.stringify(eventData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Chyba při načítání událostí: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// === MANUÁLNÍ TRIGGER PRO TESTOVÁNÍ ===
function manualTest() {
  Logger.log('🧪 Spouštím manuální test synchronizace...');
  syncReservationsToCalendar();
}
