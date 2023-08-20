const map = L.map("map").setView([38.1365, 126.9780], 5); // 한국 중심

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© Team-ED",
}).addTo(map);

const totalPages = 867; // 총 페이지 수

    const fetchSatelliteData = async () => {
      const fetchPromises = [];

      for (let page = 1; page <= totalPages; page++) {
        fetchPromises.push(
          fetch(serverUrl+`/data/page/${page}`).then(
            (response) => response.json()
          )
        );
      }

      try {
        const allDataResponses = await Promise.all(fetchPromises);
        const allSatelliteData = allDataResponses.flatMap((response) => response.content);

        const markers = L.markerClusterGroup();

        allSatelliteData.forEach((satellite) => {
          const markerIcon = L.icon({
            iconUrl: "../assets/images/satellite.png",
            iconSize: [36, 36],
          });

          const marker = L.marker(
            [satellite.latitude, satellite.longitude],
            {
              icon: markerIcon,
            }
          );

          marker.bindPopup(satellite.name); // 마커 클릭 시 이름 표시
          markers.addLayer(marker);
        });

        map.addLayer(markers);
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    fetchSatelliteData();