(async () => {
  const puppeteer = require("puppeteer");

  const FLIGHT_RADAR_URL =
    "https://www.flightradar24.com/data/airports/{airport}/ground";

  const airport = "CGH"; // Viracopos hard coded

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(FLIGHT_RADAR_URL.replace("{airport}", airport));

  let numberOnGround = "";

  while (numberOnGround === "") {
    numberOnGround = await page.evaluate(() => {
      let $ = window.$;
      return $(".number-on-ground .ng-binding").html();
    });
  }

  const name = await page.evaluate(() => {
    let $ = window.$;
    return $(".airport-name").html();
  });

  const weather = await page.evaluate(() => {
    let $ = window.$;
    return $(".weather-value").html();
  });

  const aircraftsOnGround = await page.evaluate(() => {
    let $ = window.$;

    let aircrafts = [];
    $(".airport-schedule-data table tr").each((index, value) => {
      const aircraft = jQuery(value)
        .children("td")
        .eq(1)
        .children("span")
        .eq(0)
        .html();

      const type = jQuery(value)
        .children("td")
        .eq(2)
        .children("span")
        .eq(0)
        .html();
      const airline = jQuery(value)
        .children("td")
        .eq(3)
        .children("span ")
        .eq(0)
        .children("a")
        .eq(0)
        .html();
      aircrafts.push({
        aircraft,
        type,
        airline,
      });
    });

    aircrafts = aircrafts.filter(
      (aircraft) => aircraft.type && aircraft.type != " "
    );

    return aircrafts;
  });

  await page.evaluate(() => {
    let $ = window.$;

    $(".logout").click();
  });

  await page.evaluate(() => {
    let $ = window.$;

    $("#fr24_SignInEmail").val("guilherme@brain.agr.br");
  });

  console.log({
    numberOnGround,
    name,
    weather,
    aircraftsOnGround,
  });
})();
