// UPRAVENÁ FUNKCE getCalendarEvents s JSONP podporou
// Toto nahraďte v Google Apps Script

function getCalendarEvents(e) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const now = new Date();
    const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 dní
    
    const events = calendar.getEvents(now, twoMonthsLater);
    
    const eventData = events.map(event => {
      // Zjisti jestli je to celodenní událost
      const isAllDay = event.isAllDayEvent();
      
      return {
        id: event.getId(),
        title: event.getTitle(),
        start: isAllDay ? event.getAllDayStartDate().toISOString().split('T')[0] : event.getStartTime().toISOString(),
        end: isAllDay ? event.getAllDayEndDate().toISOString().split('T')[0] : event.getEndTime().toISOString(),
        isAllDay: isAllDay,
        location: event.getLocation(),
        description: event.getDescription()
      };
    });
    
    const output = JSON.stringify({
      success: true,
      events: eventData
    });
    
    // JSONP callback
    const callback = e && e.parameter && e.parameter.callback ? e.parameter.callback : null;
    
    if (callback) {
      // Vrať JSONP response
      return ContentService
        .createTextOutput(callback + '(' + output + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Vrať normální JSON
      return ContentService
        .createTextOutput(output)
        .setMimeType(ContentService.MimeType.TEXT);
    }
      
  } catch (error) {
    Logger.log('Chyba při načítání událostí: ' + error.toString());
    
    const errorOutput = JSON.stringify({
      success: false,
      error: error.toString()
    });
    
    const callback = e && e.parameter && e.parameter.callback ? e.parameter.callback : null;
    
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + errorOutput + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(errorOutput)
        .setMimeType(ContentService.MimeType.TEXT);
    }
  }
}

function doGet(e) {
  try {
    Logger.log('Přijat GET request');
    Logger.log('Všechny parametry: ' + JSON.stringify(e));
    
    // Pokud jsou parametry, zavolej getCalendarEvents
    if (e && e.parameter) {
      Logger.log('Parametry existují - volám getCalendarEvents');
      return getCalendarEvents(e);
    }
    
    // Jinak vrať základní zprávu
    return ContentService.createTextOutput('Google Apps Script běží! Žádné parametry.')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    Logger.log('CHYBA v doGet: ' + error.toString());
    return ContentService.createTextOutput('CHYBA: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
