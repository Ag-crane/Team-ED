const axios = require("axios");
const mysql = require("mysql2");

const apiKey = "eqM1mTFhhBIOgdK1Obq4xTiJhFxzXMAwv7xZtnwR";
const apiUrl = `https://tle.ivanstanojevic.me/api/tle/?api_key=${apiKey}`;

const sshConfig = {
  host: "14.52.137.81",
  port: 22,
  username: "team_ed_user3",
  password: "team_ed!@#123",
};

const mysqlConfig = {
  host: "127.0.0.1",
  user: "team_ed",
  password: "team_ed!@#123",
  port: 3306,
  database: "team_ed_user3",
};

const connection = mysql.createConnection(mysqlConfig);

async function fetchTLE() {
  try {
    const response = await axios.get(apiUrl);
    const tleData = response.data;

    console.log("API Response Data:", tleData);

    if (!tleData.member || tleData.member.length === 0) {
      console.error("TLE data is not available in the API response.");
      return;
    }

    const extractedTLEData = processTLEData(tleData.member);
    if (extractedTLEData.length > 0) {
      saveTLEData(extractedTLEData);
    } else {
      console.error("Processed TLE data is empty or invalid.");
    }
  } catch (error) {
    console.error("Error fetching TLE data:", error);
  }
}

function processTLEData(tleData) {
  const extractedTLEData = [];

  tleData.forEach((tle) => {
    const line1 = tle.line1;
    const line2 = tle.line2;
    console.log("Satellite Name:", tle.name);
    if (line1 && line2) {
      const line1Fields = {
        satelliteNumber: line1.substr(2, 5),
        classification: line1.substr(7, 1),
        launch: line1.substr(9, 5),
        launchPiece: line1.substr(14, 1),
        epoch: line1.substr(18, 14),
        firstTimeDerivative: line1.substr(33, 10),
        secondTimeDerivative: line1.substr(44, 8),
        bstarDragTerm: line1.substr(53, 8),
        ephemerisType: line1.substr(62, 1),
        elementNumber: line1.substr(64, 4),
        checksum: line1.substr(68, 1),
      };

      const line2Fields = {
        inclination: line2.substr(8, 8),
        rightAscension: line2.substr(17, 8),
        eccentricity: line2.substr(26, 7),
        argumentOfPerigee: line2.substr(34, 8),
        meanAnomaly: line2.substr(43, 8),
        meanMotion: line2.substr(52, 11),
      };

      console.log("Satellite Number:", line1Fields.satelliteNumber);
      console.log("Classification:", line1Fields.classification);
      console.log("Launch:", line1Fields.launch);
      console.log("Launch Piece:", line1Fields.launchPiece);
      console.log("Epoch:", line1Fields.epoch);
      console.log("First Time Derivative:", line1Fields.firstTimeDerivative);
      console.log("Second Time Derivative:", line1Fields.secondTimeDerivative);
      console.log("BSTAR Drag Term:", line1Fields.bstarDragTerm);
      console.log("Ephemeris Type:", line1Fields.ephemerisType);
      console.log("Element Number:", line1Fields.elementNumber);
      console.log("Checksum:", line1Fields.checksum);

      if (line2Fields && line2Fields.inclination) {
        console.log("Inclination:", line2Fields.inclination);
      } else {
        console.error("Inclination data is not available for this TLE.");
      }
      console.log("Right Ascension:", line2Fields.rightAscension);
      console.log("Eccentricity:", line2Fields.eccentricity);
      console.log("Argument of Perigee:", line2Fields.argumentOfPerigee);
      console.log("Mean Anomaly:", line2Fields.meanAnomaly);
      console.log("Mean Motion:", line2Fields.meanMotion);
      console.log("-------------------------------------------------");

      extractedTLEData.push({
        satelliteId: tle.satellite_number,
        name: tle.name,
        date: tle.date,
        line1: tle.line1,
        line2: tle.line2,
        line1Fields: line1Fields,
        line2Fields: line2Fields,
      });
    } else {
      console.error("Line data is not available for this TLE.");
    }
  });

  return extractedTLEData;
}

function saveTLEData(tleData) {
  const query =
    "INSERT INTO tle_data (satellite_id, name, date, satellite_number, classification, launch, launch_piece, epoch, first_time_derivative, second_time_derivative, bstar_drag_term, ephemeris_type, element_number, checksum, inclination, right_ascension, eccentricity, argument_of_perigee, mean_anomaly, mean_motion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  tleData.forEach((tle) => {
    const satelliteId = tle.satellite_id;
    const name = tle.name;
    const date = tle.date;
    const line1Fields = tle.line1Fields;
    const line2Fields = tle.line2Fields;

    connection.query(
      query,
      [
        satelliteId,
        name,
        date,
        line1Fields.satelliteNumber,
        line1Fields.classification,
        line1Fields.launch,
        line1Fields.launchPiece,
        line1Fields.epoch,
        line1Fields.firstTimeDerivative,
        line1Fields.secondTimeDerivative,
        line1Fields.bstarDragTerm,
        line1Fields.ephemerisType,
        line1Fields.elementNumber,
        line1Fields.checksum,
        line2Fields ? line2Fields.inclination : null,
        line2Fields ? line2Fields.rightAscension : null,
        line2Fields ? line2Fields.eccentricity : null,
        line2Fields ? line2Fields.argumentOfPerigee : null,
        line2Fields ? line2Fields.meanAnomaly : null,
        line2Fields ? line2Fields.meanMotion : null,
      ],
      (error, results) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            console.warn(`Data with satellite_id ${satelliteId} already exists. Skipping...`);
          } else {
            console.error("Error saving TLE data:", error);
          }
        } else {
          console.log("TLE data saved successfully for:", name);
        }
      }
    );
  });
}

fetchTLE();
