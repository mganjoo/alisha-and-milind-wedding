import {
  google,
  CalendarEvent,
  outlook,
  ical,
  yahoo,
} from "./AddToCalendarUtils"

const testAllDayEvent: CalendarEvent = {
  title: "Alisha & Milind's Wedding Weekend",
  location: "San Mateo, CA",
  description: `Save the date for Alisha & Milind's wedding! More details to come at https://alishaandmilind.wedding`,
  startTime: "2020-05-01T00:00:00-07:00",
  endTime: "2020-05-03T00:00:00-07:00",
  allDay: true,
  url: "https://alishaandmilind.wedding",
}

describe("AddToCalendarUtils", () => {
  describe("for all day events", () => {
    it("should generate a correct Google Calendar URL", () => {
      expect(google(testAllDayEvent)).toEqual(
        "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20200501%2F20200503&details=Save%20the%20date%20for%20Alisha%20%26%20Milind%27s%20wedding%21%20More%20details%20to%20come%20at%20https%3A%2F%2Falishaandmilind.wedding&location=San%20Mateo%2C%20CA&text=Alisha%20%26%20Milind%27s%20Wedding%20Weekend"
      )
    })
    it("should generate a correct Outlook.com URL", () => {
      expect(outlook(testAllDayEvent)).toEqual(
        "https://outlook.live.com/owa/?allday=true&body=Save%20the%20date%20for%20Alisha%20%26%20Milind%27s%20wedding%21%20More%20details%20to%20come%20at%20https%3A%2F%2Falishaandmilind.wedding&enddt=20200503T070000&location=San%20Mateo%2C%20CA&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=20200501T070000&subject=Alisha%20%26%20Milind%27s%20Wedding%20Weekend"
      )
    })
    it("should generate a correct iCal URL", () => {
      expect(ical(testAllDayEvent)).toEqual(
        "data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:https://alishaandmilind.wedding%0ADTSTART:20200501%0ADTEND:20200503%0ASUMMARY:Alisha%20&%20Milind's%20Wedding%20Weekend%0ADESCRIPTION:Save%20the%20date%20for%20Alisha%20&%20Milind's%20wedding!%20More%20details%20to%20come%20at%20https://alishaandmilind.wedding%0ALOCATION:San%20Mateo,%20CA%0AEND:VEVENT%0AEND:VCALENDAR"
      )
    })
    it("should generate a correct Yahoo URL", () => {
      expect(yahoo(testAllDayEvent)).toEqual(
        "https://calendar.yahoo.com/?desc=Save%20the%20date%20for%20Alisha%20%26%20Milind%27s%20wedding%21%20More%20details%20to%20come%20at%20https%3A%2F%2Falishaandmilind.wedding&et=20200503&in_loc=San%20Mateo%2C%20CA&st=20200501&title=Alisha%20%26%20Milind%27s%20Wedding%20Weekend&v=60"
      )
    })
  })
})
