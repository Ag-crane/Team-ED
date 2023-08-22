const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const configPath = path.join(__dirname, "..", "..", "config.yml");

const configFile = fs.readFileSync(configPath, "utf8");
const config = yaml.load(configFile);

const axios = require("axios");
const mysql = require("mysql2");

const satellite = require("satellite.js"); 

const apiKey = config.api_key;
const apiUrl = `https://tle.ivanstanojevic.me/api/tle/?api_key=${apiKey}`;

const mysqlConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  port: config.mysql.port,
  database: config.mysql.database,
};

let connection;

let totalUpdatedCount = 0;
let totalNewCount = 0;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveTLEInfo(updatedCount, newCount, totalCount, fetchTime) {
  const queryInsertInfo =
    "INSERT INTO tle_data_info (updated_count, new_count, total_count, fetch_time) VALUES (?, ?, ?, ?)";
  connection.query(
    queryInsertInfo,
    [updatedCount, newCount, totalCount, fetchTime],
    (error, results) => {
      if (error) {
        console.error("Error saving TLE info:", error);
      } else {
        //console.log("TLE info saved successfully.");
      }
    }
  );
}

async function getTotalCount() {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) AS total_count FROM tle_data";

    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          const totalCount = results[0].total_count;
          resolve(totalCount);
        } else {
          resolve(0);
        }
      }
    });
  });
}

function calculateSatellitePosition(line1, line2, date) {
  const satrec = satellite.twoline2satrec(line1, line2);

  const positionAndVelocity = satellite.propagate(satrec, date);
  const positionEci = positionAndVelocity.position;

  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);

  const latitude = satellite.degreesLat(positionGd.latitude);
  const longitude = satellite.degreesLong(positionGd.longitude);

  return {
    latitude: latitude,
    longitude: longitude,
  };
}

function updateInfoBasedOnName(name) {
  if (name.startsWith('BEIDOU')) {
    return '중국';
  } else if (name.startsWith('COSMOS')) {
    return '러시아';
  } else if (name.startsWith('EUTELSAT')) {
    return 'Eutelsat';
  } else if (name.startsWith('FALCON')) {
    return 'SpaceX';
  } else if (name.startsWith('FENGYUN')) {
    return '중국';
  } else if (name.startsWith('GALAXY')) {
    return 'Intelsat';
  } else if (name.startsWith('INTELSAT')) {
    return 'Intelsat';
  } else if (name.startsWith('GAOFEN')) {
    return '중국';
  } else if (name.startsWith('GLOBALSTAR')) {
    return 'Globalstar';
  } else if (name.startsWith('GONETS')) {
    return '러시아';
  } else if (name.startsWith('GORIZONT')) {
    return '러시아';
  } else if (name.startsWith('GOES')) {
    return '미국';
  } else if (name.startsWith('GPS BIIA')) {
    return '미국';
  } else if (name.startsWith('GPS BIIF')) {
    return '미국';
  } else if (name.startsWith('GPS BIII')) {
    return '미국';
  } else if (name.startsWith('GPS BIIIR')) {
    return '미국';
  } else if (name.startsWith('GPS BIIIRM')) {
    return '미국';
  } else if (name.startsWith('GSAT')) {
    return '인도';
  } else if (name.startsWith('IRIDIUM')) {
    return 'Iridium communication system';
  } else if (name.startsWith('LEMUR')) {
    return 'Spire Global';
  } else if (name.startsWith('MOLNIYA')) {
    return '러시아';
  } else if (name.startsWith('RADUGA')) {
    return '러시아';
  } else if (name.startsWith('NUSAT')) {
    return '아르헨티나';
  } else if (name.startsWith('ONEWEB')) {
    return 'ONEWEB';
  } else if (name.startsWith('ORBCOMM')) {
    return 'ORBCOMM';
  } else if (name.startsWith('SHIJIAN')) {
    return '중국';
  } else if (name.startsWith('SHIYAN')) {
    return '중국';
  } else if (name.startsWith('SPACEBEE')) {
    return 'Swarm Technologies';
  } else if (name.startsWith('STARLINK')) {
    return 'SpaceX';
  } else if (name.startsWith('APRIZESAT')) {
    return '미국, 영국';
  } else if (name.startsWith('ASTROCAST')) {
    return 'Astrocast SA';
  } else if (name.startsWith('CHINASAT')) {
    return '중국';
  } else if (name.startsWith('CZ')) {
    return '중국';
  } else if (name.startsWith('ECHOSTAR')) {
    return 'EchoStar Satellite Services';
  } else if (name.startsWith('YAOGAN')) {
    return '중국';
  } else if (name.startsWith('ISS')) {
    return '국제우주정거장';
  } else if (name.startsWith('YUNHAI')) {
    return '중국';
  } else if (name.startsWith('NOAA')) {
    return '미국';
  } else if (name.startsWith('USA')) {
    return '미국';
  } else if (name.startsWith('WGS')) {
    return '미국';
  } else if (name.startsWith('UNKNOWN')) {
    return '비식별위성';
  } else if (name.startsWith('GALILEO')) {
    return '유럽';
  } else if (name.startsWith('ROBUSTA')) {
    return '프랑스';
  } else if (name.startsWith('INMARSAT')) {
    return 'Inmarsat';
  } else if (name.startsWith('JILIN')) {
    return '중국';
  } else if (name.startsWith('KANOPUS')) {
    return '러시아';
  } else if (name.startsWith('KEPLER')) {
    return 'NASA';
  } else if (name.startsWith('KOREASAT')) {
    return '대한민국';
  } else if (name.startsWith('KSF')) {
    return '대한민국';
  } else if (name.startsWith('O3B')) {
    return 'O3B Networks';
  } else if (name.startsWith('SAUDI')) {
    return '사우디 아라비아';
  } else if (name.startsWith('SKYSAT')) {
    return 'Planets Labs';
  }
  
  return null;
}

function processTLEData(tleData, fetchTime) {
  const extractedTLEData = [];

  tleData.forEach((tle) => {
    const line1 = tle.line1;
    const line2 = tle.line2;

    if (line1 && line2) {
      const line1Fields = {
        satelliteNumber: line1.substr(2, 5),
        classification: line1.substr(7, 1),
        launch: line1.substr(9, 5),
        firstLaunch: line1.substr(9, 2),
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

      // 위성의 위도와 경도 계산
      const satellitePosition = calculateSatellitePosition(line1, line2, new Date(tle.date));
      const latitude = satellitePosition.latitude;
      const longitude = satellitePosition.longitude;
      const info = updateInfoBasedOnName(tle.name);

      extractedTLEData.push({
        satellite_id: tle.satelliteId,
        name: tle.name,
        date: new Date(tle.date).toISOString().slice(0, 19).replace("T", " "),
        line1: tle.line1,
        line2: tle.line2,
        line1Fields: line1Fields,
        line2Fields: line2Fields,
        fetch_timestamp: fetchTime,
        latitude: latitude,
        longitude: longitude,
        info: info,
        isNew: true,
      });
    } else {
      console.error("Line data is not available for this TLE.");
    }
  });

  return extractedTLEData;
}

function saveTLEData(tleData, fetchTime) {
  const querySelect = "SELECT * FROM tle_data WHERE satellite_id = ?";
  const queryUpdate = "UPDATE tle_data SET ? WHERE satellite_id = ?";
  const queryInsert = "INSERT INTO tle_data SET ?";
  const queryInsertLog =
  "INSERT INTO tle_data_log (satellite_id, name, date, satellite_number, classification, launch, first_launch, launch_piece, epoch, first_time_derivative, second_time_derivative, bstar_drag_term, ephemeris_type, element_number, checksum, inclination, right_ascension, eccentricity, argument_of_perigee, mean_anomaly, mean_motion, fetch_timestamp, changed_time, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  tleData.forEach((tle) => {
    const satellite_id = tle.satellite_id;
    const name = tle.name;
    const date = tle.date;
    const line1Fields = tle.line1Fields;
    const line2Fields = tle.line2Fields;
    const latitude = tle.latitude;
    const longitude = tle.longitude;
    const first_launch = line1Fields.firstLaunch;
    const isNew = tle.isNew ? 1 : 0;
    const info = tle.info;

    //console.log(`Satellite Name: ${name}, Info: ${info}`);
    const changed_time = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    if (connection && !connection._closed) {
      connection.query(querySelect, [satellite_id], (error, results) => {
        if (error) {
          console.error("Error checking for existing satellite_id:", error);
        } else {
          if (results.length === 0) {
            connection.query(
              queryInsert,
              {
                satellite_id,
                name,
                date,
                satellite_number: line1Fields.satelliteNumber,
                classification: line1Fields.classification,
                launch: line1Fields.launch,
                first_launch,
                launch_piece: line1Fields.launchPiece,
                epoch: line1Fields.epoch,
                first_time_derivative: line1Fields.firstTimeDerivative,
                second_time_derivative: line1Fields.secondTimeDerivative,
                bstar_drag_term: line1Fields.bstarDragTerm,
                ephemeris_type: line1Fields.ephemerisType,
                element_number: line1Fields.elementNumber,
                checksum: line1Fields.checksum,
                inclination: line2Fields ? line2Fields.inclination : null,
                right_ascension: line2Fields ? line2Fields.rightAscension : null,
                eccentricity: line2Fields ? line2Fields.eccentricity : null,
                argument_of_perigee: line2Fields ? line2Fields.argumentOfPerigee : null,
                mean_anomaly: line2Fields ? line2Fields.meanAnomaly : null,
                mean_motion: line2Fields ? line2Fields.meanMotion : null,
                fetch_timestamp: fetchTime,
                latitude: latitude,
                longitude: longitude,
                info: info,
                isNew: isNew,
              },
              (error, results) => {
                if (error) {
                  console.error("Error saving TLE data:", error);
                } else {
                  //console.log("TLE data saved successfully for :",name);
                }
              }
            );

            // tle_data_log 저장
            connection.query(
              queryInsertLog,
              [
                satellite_id,
                name,
                date,
                line1Fields.satelliteNumber,
                line1Fields.classification,
                line1Fields.launch,
                first_launch,
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
                fetchTime,
                changed_time,
                latitude,
                longitude,
                isNew,
              ],
              (error, results) => {
                if (error) {
                  console.error("Error saving TLE data to tle_data_log:", error);
                } else {
                  //console.log("TLE data saved to tle_data_log successfully for:", name);
                }
              }
            );
          } else {
            const existingData = results[0];
            const newData = {
              name,
              date,
              satellite_number: line1Fields.satelliteNumber,
              classification: line1Fields.classification,
              launch: line1Fields.launch,
              first_launch,
              launch_piece: line1Fields.launchPiece,
              epoch: line1Fields.epoch,
              first_time_derivative: line1Fields.firstTimeDerivative,
              second_time_derivative: line1Fields.secondTimeDerivative,
              bstar_drag_term: line1Fields.bstarDragTerm,
              ephemeris_type: line1Fields.ephemerisType,
              element_number: line1Fields.elementNumber,
              checksum: line1Fields.checksum,
              inclination: line2Fields ? line2Fields.inclination : null,
              right_ascension: line2Fields ? line2Fields.rightAscension : null,
              eccentricity: line2Fields ? line2Fields.eccentricity : null,
              argument_of_perigee: line2Fields ? line2Fields.argumentOfPerigee : null,
              mean_anomaly: line2Fields ? line2Fields.meanAnomaly : null,
              mean_motion: line2Fields ? line2Fields.meanMotion : null,
              fetch_timestamp: fetchTime,
              latitude: latitude,
              longitude: longitude,
              info: info,
            };

            const hasChanges =
              JSON.stringify(existingData) !== JSON.stringify(newData);

              if (hasChanges) {
                connection.query(queryUpdate, [{ ...newData }, satellite_id], (error, results) => {
                  if (error) {
                    console.error("Error updating TLE data:", error);
                  } else {
                    //console.log("TLE data saved successfully:", name);
                  }
                });
              
                // tle_data_log 테이블
                connection.query(queryInsertLog, [
                  satellite_id,
                  name,
                  date,
                  line1Fields.satelliteNumber,
                  line1Fields.classification,
                  line1Fields.launch,
                  first_launch,
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
                  fetchTime,
                  changed_time,
                  latitude,
                  longitude,
                  isNew ? 1 : 0,
                ],
                (error, results) => {
                  if (error) {
                    console.error("Error saving TLE data to tle_data_log:",error);
                  } else {
                    //console.log("TLE data saved to tle_data_log successfully for:", name);
                  }
                }
              );
            } else {
              //console.log(`Skipping duplicate data for satellite_id: ${satellite_id}`);
            }
          }
        }
      });
    }
  });
}

async function fetchTLE() {
  try {
    let page = 1;
    let hasNextPage = true;
    let pageCounter = 0;

    const fetchTime = new Date();
    const formattedFetchTime = fetchTime.toISOString().slice(0, 19).replace("T", " ");

    while (hasNextPage) {
      pageCounter++;

      const response = await axios.get(`${apiUrl}&page=${page}`);
      const tleData = response.data;

      if (!tleData.member || tleData.member.length === 0) {
        hasNextPage = false;
        console.log("No more data found in API response.");
        break;
      }

      if (page % 10 === 0) {
        console.log(`Processing page ${page}`);
      }

      const extractedTLEData = processTLEData(tleData.member, formattedFetchTime);

      const updatedCount = extractedTLEData.length;
      const newCount = extractedTLEData.filter(tle => tle.isNew === 1).length;

      totalUpdatedCount += updatedCount;
      totalNewCount += newCount;

      if (extractedTLEData.length > 0) {
        await saveTLEData(extractedTLEData, formattedFetchTime);
      } else {
        console.error("Processed TLE data is empty or invalid.");
      }

      await sleep(1000);

      page++;

      if (pageCounter === 100) {
        console.log(`Wait...`);
        await sleep(10 * 60 * 1000); // 100페이지마다 10분 대기
        pageCounter = 0;
      }
    }
    
    const totalCount = await getTotalCount();
    saveTLEInfo(totalUpdatedCount, totalNewCount, totalCount, formattedFetchTime);

  } catch (error) {
    console.error("Error fetching or saving TLE data:", error);
    
    const totalCount = await getTotalCount();
    saveTLEInfo(totalUpdatedCount, totalNewCount, totalCount, formattedFetchTime);;

    if (connection && !connection._closed) {
      connection.end();
    }

    await sleep(60 * 60 * 1000);

    fetchTLE();
  }
}


async function run() {
  while (true) {
    totalUpdatedCount = 0;
    totalNewCount = 0;
    console.log("Fetching TLE data from API...");
    try {
      await fetchTLE();
    } catch (error) {
      console.error("Error occurred:", error);
    }
    await sleep(150 * 60 * 1000); // 150분마다 갱신
  }
}

connection = mysql.createConnection(mysqlConfig);
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the MySQL database.");
    run();
  }
});