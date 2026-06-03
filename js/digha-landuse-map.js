const bounds = L.latLngBounds([21.565, 87.435], [21.705, 87.635]);
    const center = [21.6266, 87.5086];

    const map = L.map("map", {
      preferCanvas: true,
      minZoom: 11,
      maxZoom: 19
    }).setView(center, 13);
    map.createPane("blockPane");
    map.getPane("blockPane").style.zIndex = 635;
    map.createPane("buildings2026Pane");
    map.getPane("buildings2026Pane").style.zIndex = 645;
    map.createPane("road2026Pane");
    map.getPane("road2026Pane").style.zIndex = 638;
    map.createPane("mandarmaniVillagePane");
    map.getPane("mandarmaniVillagePane").style.zIndex = 636;
    map.createPane("dighaVillagePane");
    map.getPane("dighaVillagePane").style.zIndex = 637;
    map.createPane("tajpurSimPane");
    map.getPane("tajpurSimPane").style.zIndex = 637;
    map.createPane("dighaSimPane");
    map.getPane("dighaSimPane").style.zIndex = 637;
    map.createPane("dighaPart2Pane");
    map.getPane("dighaPart2Pane").style.zIndex = 638;
    map.createPane("khsirpalPane");
    map.getPane("khsirpalPane").style.zIndex = 639;
    //for raster file
    map.createPane("yaas2021VectorPane");
    map.getPane("yaas2021VectorPane").style.zIndex = 561;

    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      crossOrigin: true,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      crossOrigin: true,
      attribution: "Map data &copy; OpenStreetMap contributors, SRTM | OpenTopoMap"
    });
    const googleSat = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          attribution: "Google Satellite"
        }
      );

    L.control.scale({ imperial: false }).addTo(map);
    const categories = {
      beach: { label: "Beach / sand / coastline", color: getCss("--beach"), group: L.layerGroup().addTo(map), count: 0 },
      water: { label: "Water bodies / rivers / canals", color: getCss("--water"), group: L.layerGroup().addTo(map), count: 0 },
      residential: { label: "Residential / settlement", color: getCss("--residential"), group: L.layerGroup().addTo(map), count: 0 },
      commercial: { label: "Commercial / retail / tourism", color: getCss("--commercial"), group: L.layerGroup().addTo(map), count: 0 },
      industrial: { label: "Industrial / utilities", color: getCss("--industrial"), group: L.layerGroup().addTo(map), count: 0 },
      agriculture: { label: "Agriculture / farmland", color: getCss("--farm"), group: L.layerGroup().addTo(map), count: 0 },
      green: { label: "Parks / forest / open green", color: getCss("--green"), group: L.layerGroup().addTo(map), count: 0 },
      transport: { label: "Roads / rail / transport", color: getCss("--road"), group: L.layerGroup().addTo(map), count: 0 },
      buildings: { label: "Buildings / built footprint", color: "#9aa4aa", group: L.layerGroup(), count: 0 },
      points: { label: "Amenities / tourism points", color: "#2d6cdf", group: L.layerGroup().addTo(map), count: 0 },
      local: { label: "Local shapefile upload", color: getCss("--local"), group: L.layerGroup().addTo(map), count: 0 },
      github: { label: "Land-use vector layer", color: "#165d9c", group: L.layerGroup().addTo(map), count: 0 },
      githubRaster: { label: "Land-use GeoTIFF raster", color: "#111827", group: L.layerGroup().addTo(map), count: 0 },
      block: { label: "Block boundary layer", color: "#0f766e", group: L.layerGroup(), count: 0 },
      crz: { label: "CRZ 2026 line layer", color: "#7b2f14", group: L.layerGroup(), count: 0 },
      crzPoly: { label: "CRZ polygon layer", color: "#8ecae6", group: L.layerGroup(), count: 0 },
      buildings2026: { label: "Buildings 2026", color: "#f59e0b", group: L.layerGroup(), count: 0 },
      road2026: { label: "Road 2026 layer", color: "#e11d48", group: L.layerGroup(), count: 0 },
      mandarmaniVillage: { label: "Mandarmani village layer", color: "#7c3aed", group: L.layerGroup(), count: 0 },
      dighaVillage: { label: "Digha village layer", color: "#6b7280", group: L.layerGroup(), count: 0 },
      tajpurSim: { label: "Tajpur simulation layer", color: "#6b7280", group: L.layerGroup(), count: 0 },
      dighaSim: { label: "Digha part 1", color: "#6b7280", group: L.layerGroup(), count: 0 },
      dighaPart2: {label: "Digha Part2",color: "#6b7280",group: L.layerGroup(),count: 0},
      khsirpal: {label: "Khsirpal layer",color: "#6b7280",group: L.layerGroup(),count: 0},
      //for raster file
      yaas2021Vector: {label: "LULC Affected Yaas 2021",color: "#eff0f110",group: L.layerGroup(), count: 0},
    };

    const landUseClasses = [
      { value: 0, label: "No data / transparent", color: "transparent", hidden: true, aliases: ["nodata", "no data", "background"] },
      { value: 1, label: "Agricultural", color: "#f2c94c", aliases: ["agricultural", "agriculture", "cropland", "farm"] },
      { value: 2, label: "Commercial", color: "#005bd8", aliases: ["commercial", "retail", "market"] },
      { value: 3, label: "Industry", color: "#9d00d4", aliases: ["industry", "industrial"] },
      { value: 4, label: "Mangrove/Riparian Zone", color: "#0a6e12", aliases: ["mangrove/riparian zone", "mangrove", "riparian zone", "riparian"] },
      { value: 5, label: "Manufacturing", color: "#6729a9", aliases: ["manufacturing"] },
      { value: 6, label: "Mixed Used", color: "#7b5198", aliases: ["mixed used", "mixed use", "mixed"] },
      { value: 7, label: "Open Land", color: "#d8cbb7", aliases: ["open land", "vacant land", "open"] },
      { value: 8, label: "Plantation Forest Orchard", color: "#4f8f22", aliases: ["plantation forest orchard", "plantation", "forest orchard", "orchard", "forest"] },
      { value: 9, label: "Public and Semi Public", color: "#12a584", aliases: ["public and semi public", "public", "semi public"] },
      { value: 10, label: "Recreational", color: "#a4ff3c", aliases: ["recreational", "recreation", "park", "playground"] },
      { value: 11, label: "Residential", color: "#ffff00", aliases: ["residential", "settlement", "housing"] },
      { value: 12, label: "River canals", color: "#00b4d8", aliases: ["river canals", "river", "canal", "water"] },
      { value: 13, label: "Sea DYKE", color: "#ff8c42", aliases: ["sea dyke", "dyke"] },
      { value: 14, label: "Transport and Communication", color: "#6878c9", aliases: ["transport and communication", "transportation", "transport", "communication"] },
      { value: 15, label: "Utility and Services", color: "#8b8b8b", aliases: ["utility and services", "utility", "services"] },
      { value: 16, label: "Water Body", color: "#76d6ff", aliases: ["water body", "pond", "lake", "waterbody"] }
    ];

    const landUseClassByValue = Object.fromEntries(landUseClasses.map(item => [item.value, item]));
    const landUseClassByAlias = new Map();
    landUseClasses.forEach(item => item.aliases.forEach(alias => landUseClassByAlias.set(alias, item)));

    const crzClasses = [
      { label: "100CRZ", color: "#7b2f14", weight: 3, dashArray: "4,4", aliases: ["100crz"] },
      { label: "200CRZ", color: "#b45a1b", weight: 3, dashArray: "8,5", aliases: ["200crz"] },
      { label: "CRZ Boundary", color: "#e63946", weight: 3.4, dashArray: "", aliases: ["crz boundary"] },
      { label: "Hazard Line", color: "#ff8c00", weight: 3, dashArray: "10,5,2,5", aliases: ["hazard line"] },
      { label: "High Tide Line", color: "#005bd8", weight: 3.5, dashArray: "", aliases: ["high tide line"] },
      { label: "Low Tide Line", color: "#00a6a6", weight: 3, dashArray: "", aliases: ["low tide line"] },
      { label: "Sea Wall", color: "#111111", weight: 3.2, dashArray: "2,4", aliases: ["sea wall"] }
    ];
    const crzClassByAlias = new Map();
    crzClasses.forEach(item => item.aliases.forEach(alias => crzClassByAlias.set(alias, item)));

    const crzPolyClasses = [
      { label: "CRZ 1A", color: "#2a9d8f", aliases: ["crz 1a", "crz ia"] },
      { label: "CRZ-1B", color: "#90be6d", aliases: ["crz-1b", "crz 1b"] },
      { label: "CRZ-2", color: "#f94144", aliases: ["crz-2", "crz 2"] },
      { label: "CRZ IVB", color: "#577590", aliases: ["crz ivb"] },
      { label: "CRZ IVB1", color: "#277da1", aliases: ["crz ivb1"] },
      { label: "50 Mangrove Buffer Zone CRZ IA", color: "#006d3c", aliases: ["50 mangrove buffer zone crz ia", "mangrove buffer"] },
      { label: "200 to 500 From HLT", color: "#f9c74f", aliases: ["200 to 500 from hlt", "from hlt"] }
    ];
    const crzPolyClassByAlias = new Map();
    crzPolyClasses.forEach(item => item.aliases.forEach(alias => crzPolyClassByAlias.set(alias, item)));

    //for raster file
    const yaas2021VectorClasses = [
        { value: 3, label: "Built_up", color: "#d88c00", aliases: ["built_up", "built up", "builtup"] },
        { value: 2, label: "Open_area", color: "#c00000", aliases: ["open_area", "open area", "open"] },
        { value: 1, label: "Agriculture", color: "#1f6f00", aliases: ["agriculture", "agricultural"] },
        { value: 4, label: "Vegetation", color: "#00d000", aliases: ["vegetation", "veg"] },
        { value: 5, label: "Sand", color: "#4a4a4a", aliases: ["sand", "beach"] }
      ];

      const yaas2021VectorClassByValue = Object.fromEntries(
        yaas2021VectorClasses.map(item => [item.value, item])
      );
    let crzPolyFeatures = [];
    let crzPolyIndex = [];
    let crzPolyVersion = 0;
    let crzLineFeatures = [];
    let landUseFeatures = [];
    let landUseIndex = [];
    let landUseVersion = 0;
    let blockFeatures = [];
    let blockIndex = [];
    let blockSearchItems = [];
    let selectedBlockLayer = null;
    let buildings2026Features = [];
    let buildings2026Index = [];
    let activeLayerPopups = [];
    let road2026Features = [];
    let mandarmaniVillageFeatures = [];
    let mandarmaniVillageIndex = [];
    let dighaVillageFeatures = [];
    let dighaVillageIndex = [];
    let tajpurSimFeatures = [];
    let tajpurSimIndex = [];
    let dighaSimFeatures = [];
    let dighaSimIndex = [];
    let dighaPart2Features = [];
    let dighaPart2Index = [];
    let khsirpalFeatures = [];
    let khsirpalIndex = [];
    //for raster file
    let yaas2021VectorFeatures = [];
    let yaas2021VectorIndex = [];

    const layerControl = L.control.layers(
      { "OpenStreetMap": osm, "Topographic": topo ,"Satellite":googleSat},
      {
        [categories.github.label]: categories.github.group,
        [categories.block.label]: categories.block.group,
        [categories.crz.label]: categories.crz.group,
        [categories.crzPoly.label]: categories.crzPoly.group,
        [categories.buildings2026.label]: categories.buildings2026.group,
        [categories.road2026.label]: categories.road2026.group,
        [categories.mandarmaniVillage.label]: categories.mandarmaniVillage.group,
        [categories.dighaVillage.label]: categories.dighaVillage.group,
        [categories.tajpurSim.label]: categories.tajpurSim.group,
        [categories.dighaSim.label]: categories.dighaSim.group,
        [categories.dighaPart2.label]: categories.dighaPart2.group,
        [categories.khsirpal.label]: categories.khsirpal.group,
        //for raster file
        [categories.yaas2021Vector.label]: categories.yaas2021Vector.group,

      },
      { collapsed: true }
    ).addTo(map);

    const layerOpacity = {};

    installLayerPanelOpacitySliders();
    function installLayerPanelOpacitySliders() {
        map.on("overlayadd overlayremove", () => {
          setTimeout(updateLayerPanelOpacitySliders, 0);
        });

        setTimeout(updateLayerPanelOpacitySliders, 0);
      }

      function updateLayerPanelOpacitySliders() {
        const overlayPanel = document.querySelector(".leaflet-control-layers-overlays");
        if (!overlayPanel) return;

        Object.keys(categories).forEach(key => {
          const oldRow = overlayPanel.querySelector(`.layer-panel-opacity-row[data-layer-key="${key}"]`);
          if (oldRow) oldRow.remove();
        });

        const labels = Array.from(overlayPanel.querySelectorAll("label"));

        labels.forEach(label => {
          const layerName = label.textContent.trim();

          const entry = Object.entries(categories).find(([, category]) => {
            return category.label === layerName;
          });

          if (!entry) return;

          const [key, category] = entry;

          if (!map.hasLayer(category.group)) return;

          const opacityValue = layerOpacity[key] ?? 1;

          const row = document.createElement("div");
          row.className = "layer-panel-opacity-row";
          row.dataset.layerKey = key;

          row.innerHTML = `
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value="${opacityValue}"
              data-layer-key="${key}"
            >
            <span>${Math.round(opacityValue * 100)}%</span>
          `;

          const slider = row.querySelector("input");
          const valueText = row.querySelector("span");

          slider.addEventListener("input", event => {
            const value = Number(event.target.value);
            layerOpacity[key] = value;
            valueText.textContent = `${Math.round(value * 100)}%`;
            setLayerOpacity(category.group, value);
          });

          L.DomEvent.disableClickPropagation(row);
          L.DomEvent.disableScrollPropagation(row);

          label.insertAdjacentElement("afterend", row);
        });
      }

      function setLayerOpacity(layer, opacity) {
        if (!layer) return;

        // If this is a group / GeoJSON container, apply opacity only to child layers.
        // Do not call setStyle on the parent GeoJSON layer, because it can remove fill colors.
        if (layer.eachLayer) {
          layer.eachLayer(childLayer => setLayerOpacity(childLayer, opacity));
          return;
        }

        // For raster/tile layers.
        if (layer.setOpacity) {
          layer.setOpacity(opacity);
        }

        // For polygons, lines, circle markers.
        if (layer.setStyle) {
          const baseOpacity =
            layer.options.baseOpacity ??
            layer.options.opacity ??
            1;

          const baseFillOpacity =
            layer.options.baseFillOpacity ??
            layer.options.fillOpacity ??
            0;

          layer.options.baseOpacity = baseOpacity;
          layer.options.baseFillOpacity = baseFillOpacity;

          layer.setStyle({
            opacity: baseOpacity * opacity,
            fillOpacity: baseFillOpacity * opacity
          });
        }
      }

    const defaultGithubSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/Landuse_2026sim.json";
    const blockSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/block.json";
    const crzSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/crz_2026.json";
    const crzPolySource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/crz_poly_2026.json";
    const buildings2026Source = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/DSDA_building.json";
    const road2026Source = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/road_2026.json";
    const mandarmaniVillageSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/mandarmani_vill.json";
    const dighaVillageSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/Digha3_vill.json";
    const tajpurSimSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/Tajpur_sim.json";
    const dighaSimSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/Digha1_sim.json";
    const dighaPart2Source = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/Digha2_sim.json";
    const khsirpalSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/khsirpal.json";
    //for raster file
    const yaas2021VectorSource = "https://raw.githubusercontent.com/Bhaskar02/All_data_2026/refs/heads/main/LULC_Affected_yaas_2021f.json";

    addLandUseLegendControl();
    syncLegendWithLayerVisibility();
    buildLegend();
    buildLayerToggles();
    updateDashboard();
    loadGithubLayerFromUrl(defaultGithubSource, true);
    loadBlockLayer(blockSource);
    loadCrzLayer(crzSource);
    loadCrzPolyLayer(crzPolySource);
    loadBuildings2026Layer(buildings2026Source);
    loadRoad2026Layer(road2026Source);
    loadMandarmaniVillageLayer(mandarmaniVillageSource);
    loadDighaVillageLayer(dighaVillageSource);
    loadTajpurSimLayer(tajpurSimSource);
    loadDighaSimLayer(dighaSimSource);
    loadDighaPart2Layer(dighaPart2Source);
    loadKhsirpalLayer(khsirpalSource);
    //for raster file
    loadYaas2021VectorLayer(yaas2021VectorSource);

    document.getElementById("reloadBtn").addEventListener("click", loadData);
    document.getElementById("printBtn").addEventListener("click", () => window.print());
    document.getElementById("shapefileInput").addEventListener("change", loadLocalShapefile);
    document.getElementById("clearShapeBtn").addEventListener("click", clearLocalShapefile);
    document.getElementById("loadGithubBtn").addEventListener("click", loadGithubLayer);
    document.getElementById("clearGithubBtn").addEventListener("click", clearGithubLayer);
    document.getElementById("githubUrlInput").addEventListener("keydown", event => {
      if (event.key === "Enter") loadGithubLayer();
    });
    document.getElementById("dashboardToggle").addEventListener("click", toggleDashboard);
    document.getElementById("dashboardClose").addEventListener("click", () => setDashboardOpen(false));
    document.getElementById("exportPngBtn").addEventListener("click", () => exportVisibleMap("png"));
    document.getElementById("exportPdfBtn").addEventListener("click", () => exportVisibleMap("pdf"));
    document.getElementById("blockSearchForm").addEventListener("submit", searchBlockByName);
    document.getElementById("clearBlockSearchBtn").addEventListener("click", clearBlockSearch);
    document.getElementById("blockSearchInput").addEventListener("keydown", event => {
      if (event.key === "Escape") clearBlockSearch();
    });
    map.on("click", event => openActiveLayerPopups(event.latlng));

    function getCss(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function toggleDashboard() {
      const panel = document.getElementById("analysisDashboard");
      setDashboardOpen(panel.classList.contains("is-hidden"));
    }

    function setDashboardOpen(isOpen) {
      const panel = document.getElementById("analysisDashboard");
      const toggle = document.getElementById("dashboardToggle");
      panel.classList.toggle("is-hidden", !isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Hide analysis" : "Analysis";
    }

    async function exportVisibleMap(format) {
      const target = document.querySelector("main");
      if (map.hasLayer(topo)) {
        map.removeLayer(topo);
      }

      if (!map.hasLayer(osm)) {
        osm.addTo(map);
      }
      if (!target || typeof html2canvas !== "function") {
        alert("The map export library is still loading. Please try again in a moment.");
        return;
      }

      if (format === "pdf" && !(window.jspdf && window.jspdf.jsPDF)) {
        alert("The PDF export library is still loading. Please try again in a moment.");
        return;
      }

      setExportBusy(true, format);
      document.body.classList.add("is-exporting");

      try {
        await waitForActiveTileLayers();
        await nextPaint();
        const canvas = await html2canvas(target, {
          backgroundColor: "#eef3f5",
          useCORS: true,
          allowTaint: false,
          logging: false,
          scale: Math.min(3, window.devicePixelRatio || 1)
        });

        const customMapName = askExportMapName(format);

          if (!customMapName) {
            return;
          }

          const fileName = makeExportFileName(customMapName, format);

          function askExportMapName(format) {
            const today = new Date().toISOString().slice(0, 10);

            const suggestions = [
              "Digha Land Use Map 2026",
              "Digha CRZ and Building Exposure Map",
              `Digha Land Use Export ${today}`,
              'Do Not Use Any Kind Of Symbol eg. _,+'
            ];

            const message = [
              `Enter ${format.toUpperCase()} map title / file name:`,
              "",
              "Suggestions:",
              ...suggestions.map((name, index) => `${index + 1}. ${name}`),
              "",
              "Type your own name, or type 1-5 to use a suggestion."
            ].join("\n");

            const value = prompt(message, suggestions[0]);
            if (!value) return "";

            const trimmedValue = value.trim();
            const suggestionNumber = Number(trimmedValue);

            if (
              Number.isInteger(suggestionNumber) &&
              suggestionNumber >= 1 &&
              suggestionNumber <= suggestions.length
            ) {
              return suggestions[suggestionNumber - 1];
            }

            return trimmedValue;
          }

          function makeExportFileName(title, extension) {
            const cleanName = title
              .trim()
              .replace(/[\\/:*?"<>|]/g, "")
              .replace(/\s+/g, "-")
              .toLowerCase();

            return `${cleanName || "digha-map-export"}.${extension}`;
          }
        //const fileName = exportFileName(format);
        if (format === "png") {
            const templateCanvas = await createMapTemplate(canvas, customMapName);
            downloadDataUrl(templateCanvas.toDataURL("image/png"), fileName);
          } else {
            const templateCanvas = await createMapTemplate(canvas, customMapName);
            saveCanvasAsPdf(templateCanvas, fileName);
        }

      } catch (error) {
        console.error(error);
        alert("Could not export the visible map. If the topographic basemap is active, try OpenStreetMap and export again.");
      } finally {
        document.body.classList.remove("is-exporting");
        setExportBusy(false, format);
      }
    }
    async function createMapTemplate(mapCanvas, customMapName) {
      const template = document.createElement("div");

      template.style.width = "1400px";
      template.style.height = "1000px";
      template.style.background = "#ffffff";
      template.style.border = "2px solid #111111";
      template.style.padding = "26px";
      template.style.position = "fixed";
      template.style.left = "-9999px";
      template.style.top = "0";
      template.style.fontFamily = "Arial, sans-serif";
      template.style.color = "#111111";
      
      const mapImage = mapCanvas.toDataURL("image/png");
      const iitLogo = "iitkgplogo.png";
      const dsdaLogo = "icons/dsdalogo.jpg";


      template.innerHTML = `
        <div style="position: relative;width: 100%;height: 100%;border: 1px solid #111111;padding: 18px;box-sizing: border-box;">
          <div style="
            position: absolute;
            left: 0px;
            top: 30px;
            width: 100%;
            height: 800px;
            border: 2px solid #010811;
            box-sizing: border-box;
            overflow: hidden;
            background: #f7fafb;
          ">
            <img src="${mapImage}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            ">
          </div>

          <div style="
            position: absolute;
            left: 16px;
            bottom: 8px;
            width: 400px;
            min-height: 72px;
            border: 2px solid #fdf8f8;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            padding: 8px;
            box-sizing: border-box;
          ">
            ${escapeHtml(customMapName)}
          </div>

          <div style="
            position: absolute;
            left: 2px;
            bottom: 62px;
            width: 220px;
            height: 93px;
            text-align:center;
            
          ">
          <svg width="180" height="45">

              <rect x="10" y="10" width="40" height="12" fill="black"/>
              <rect x="50" y="10" width="40" height="12" fill="white" stroke="black"/>
              <rect x="90" y="10" width="40" height="12" fill="black"/>
              <rect x="130" y="10" width="40" height="12" fill="white" stroke="black"/>

              <text x="10" y="38" font-size="11">0</text>
              <text x="80" y="38" font-size="11">1 km</text>
              <text x="145" y="38" font-size="11">2 km</text>

          </svg>
          </div>

          <div style="
            position: absolute;
            left: 89px;
            bottom: 112px;
            width: 220px;
            height: 93px;
            
          ">
           <svg width="45" height="60">

                <polygon
                    points="22,5 35,40 22,30 9,40"
                    fill="black"
                />

                <text
                    x="22"
                    y="56"
                    text-anchor="middle"
                    font-size="14"
                    font-weight="bold"
                >
                    N
                </text>

            </svg>

          </div>

          <div style="
            position: absolute;
            right: 349px;
            bottom: 5px;
            width: 260px;
            font-size: 15px;
            line-height: 1.45;
          ">
            <div style="
              display:grid;
              grid-template-columns: 1fr 1fr;
              gap:20px;
              width:600px;
              font-family:Arial;
            ">

              <!-- Row 1 - Column 1 -->
              <div style="
                border:1px solid #ccc;
                padding:10px;
              ">

                <div style="font-weight: 700; margin-top: 18px; margin-bottom: 8px;">
                              Map Prepared by:
                </div>

                <!-- Nested 2 Columns -->
                <div style="display:flex; align-items:center; gap:10px;">

                  <!-- Logo -->
                  <div>
                    <img id="logo" width="40" src="data:image/png;base64,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" alt="IIT KGP logo">
                                
                  </div>

                  <!-- Text -->
                  <div style="font-size:14px;line-height:1.4;font-weight:bold;">
                    Department of Architecture &<br>
                    Regional Planning<br>
                    IIT Kharagpur
                  </div>

                </div>

              </div>

              <!-- Row 1 - Column 2 -->
              <div style="
                border:1px solid #ccc;
                padding:10px;
              ">

                <div style="font-weight: 700; margin-top: 18px; margin-bottom: 8px;">
                  Verified by:
                </div>

                <!-- Nested 2 Columns -->
                <div style="
                  display:grid;
                  grid-template-columns: 45px auto;
                  align-items:center;
                  gap:10px;
                ">

                  <!-- Logo -->
                  <div>
                    <img id="dsdaLogo" width="50" height="50" src="data:image/jpeg;base64,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" alt="DSDA logo">
                                    
                  </div>

                  <!-- Text -->
                  <div style="font-size:14px;line-height:1.4;font-weight:bold;">
                    DIGHA SANKARPUR<br>
                    DEVELOPMENT AUTHORITY
                  </div>

                </div>

              </div>

            </div>
            </div></div>
            </div>
      `;

      document.body.appendChild(template);

      const templateCanvas = await html2canvas(template, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true
      });

      template.remove();
      return templateCanvas;
    }


    function setExportBusy(isBusy, format) {
      const pngButton = document.getElementById("exportPngBtn");
      const pdfButton = document.getElementById("exportPdfBtn");
      if (!pngButton || !pdfButton) return;
      pngButton.disabled = isBusy;
      pdfButton.disabled = isBusy;
      pngButton.textContent = isBusy && format === "png" ? "Exporting..." : "Export PNG";
      pdfButton.textContent = isBusy && format === "pdf" ? "Exporting..." : "Export PDF";
    }

    function waitForActiveTileLayers(maxWait = 1500) {
      const loadingLayers = [];
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer && layer._loading) loadingLayers.push(layer);
      });

      if (!loadingLayers.length) return Promise.resolve();

      return new Promise(resolve => {
        let settled = false;
        let remaining = loadingLayers.length;
        const finish = () => {
          if (settled) return;
          settled = true;
          loadingLayers.forEach(layer => layer.off("load", onLayerLoad));
          resolve();
        };
        const onLayerLoad = () => {
          remaining -= 1;
          if (remaining <= 0) finish();
        };
        loadingLayers.forEach(layer => layer.once("load", onLayerLoad));
        window.setTimeout(finish, maxWait);
      });
    }

    function nextPaint() {
      return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
    }

    function saveCanvasAsPdf(canvas, fileName) {
      const { jsPDF } = window.jspdf;
      const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
      pdf.save(fileName);
    }

    function downloadDataUrl(dataUrl, fileName) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    function exportFileName(extension) {
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      return `digha-visible-map-${stamp}.${extension}`;
    }

    function overpassQuery() {
      const [south, west, north, east] = [21.565, 87.435, 21.705, 87.635];
      return `
        [out:json][timeout:60];
        (
          way["landuse"](${south},${west},${north},${east});
          way["natural"](${south},${west},${north},${east});
          way["leisure"](${south},${west},${north},${east});
          way["tourism"](${south},${west},${north},${east});
          way["amenity"](${south},${west},${north},${east});
          way["highway"](${south},${west},${north},${east});
          way["railway"](${south},${west},${north},${east});
          way["waterway"](${south},${west},${north},${east});
          way["building"](${south},${west},${north},${east});
          node["tourism"](${south},${west},${north},${east});
          node["amenity"](${south},${west},${north},${east});
          node["place"](${south},${west},${north},${east});
          node["shop"](${south},${west},${north},${east});
        );
        out body geom;
      `;
    }

    async function loadData() {
      setStatus("Loading OpenStreetMap land-use data for Digha...");
      clearLayers();
      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: "data=" + encodeURIComponent(overpassQuery())
        });
        if (!response.ok) throw new Error("Overpass request failed: " + response.status);
        const data = await response.json();
        renderElements(data.elements || []);
        updateLegendCounts();
        const total = Object.values(categories).reduce((sum, item) => sum + item.count, 0);
        const stamp = new Date().toLocaleString();
        setStatus(`Loaded ${total.toLocaleString()} mapped features. Last refreshed ${stamp}.`);
        map.fitBounds(bounds, { padding: [20, 20] });
      } catch (error) {
        console.error(error);
        setStatus("Could not load live OSM data. Check internet access and use Reload Data.");
      }
    }

    function clearLayers() {
      Object.entries(categories).forEach(([key, category]) => {
        if (key === "local" || key === "github" || key === "githubRaster" || key === "block" || key === "crz" || key === "crzPoly" || key === "buildings2026") return;
        category.group.clearLayers();
        category.count = 0;
      });
      updateLegendCounts();
    }

    function renderElements(elements) {
      elements.forEach(element => {
        const tags = element.tags || {};
        const categoryKey = classify(tags, element.type);
        if (!categoryKey || !categories[categoryKey]) return;
        const category = categories[categoryKey];
        const layer = makeLayer(element, categoryKey, category.color);
        if (!layer) return;
        layer.bindPopup(popupHtml(element, category.label));
        layer.on("mouseover", () => {
          if (layer.setStyle) layer.setStyle({ weight: categoryKey === "buildings" ? 1.2 : 3 });
        });
        layer.on("mouseout", () => {
          if (layer.setStyle) layer.setStyle(styleFor(categoryKey, category.color));
        });
        layer.addTo(category.group);
        category.count += 1;
      });
    }

    function classify(tags, type) {
      if (type === "node") return "points";
      if (tags.highway || tags.railway || tags.waterway === "drain") return "transport";
      if (tags.natural === "water" || tags.water || tags.waterway) return "water";
      if (tags.natural === "beach" || tags.natural === "sand" || tags.natural === "coastline") return "beach";
      if (["residential", "village_green"].includes(tags.landuse)) return "residential";
      if (["commercial", "retail"].includes(tags.landuse) || tags.tourism) return "commercial";
      if (["industrial", "railway", "military", "landfill"].includes(tags.landuse) || tags.man_made === "wastewater_plant") return "industrial";
      if (["farmland", "farmyard", "orchard", "plant_nursery", "aquaculture"].includes(tags.landuse)) return "agriculture";
      if (["forest", "grass", "meadow", "recreation_ground", "cemetery"].includes(tags.landuse)) return "green";
      if (["wood", "tree_row", "scrub", "wetland", "grassland"].includes(tags.natural) || tags.leisure === "park" || tags.leisure === "garden") return "green";
      if (tags.building) return "buildings";
      if (tags.amenity || tags.shop || tags.place) return "points";
      return null;
    }

    function makeLayer(element, categoryKey, color) {
      if (element.type === "node" && typeof element.lat === "number" && typeof element.lon === "number") {
        return L.circleMarker([element.lat, element.lon], {
          radius: 5,
          color: "#ffffff",
          weight: 1,
          fillColor: color,
          fillOpacity: 0.92
        });
      }

      if (!Array.isArray(element.geometry) || element.geometry.length < 2) return null;
      const coords = element.geometry.map(point => [point.lat, point.lon]);
      const closed = coords.length > 3 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
      const style = styleFor(categoryKey, color);

      if (categoryKey === "transport" || !closed) {
        return L.polyline(coords, style);
      }
      return L.polygon(coords, style);
    }

    function styleFor(categoryKey, color) {
      if (categoryKey === "transport") {
        return { color, weight: 2.4, opacity: 0.9 };
      }
      if (categoryKey === "buildings") {
        return { color: "#67727a", weight: 0.6, fillColor: color, fillOpacity: 0.32 };
      }
      if (categoryKey === "water") {
        return { color: "#347c9c", weight: 1.2, fillColor: color, fillOpacity: 0.58 };
      }
      return { color: "#4b5960", weight: 1, fillColor: color, fillOpacity: 0.58 };
    }

    function popupHtml(element, categoryLabel) {
      const tags = element.tags || {};
      const name = tags.name || tags["name:en"] || tags.place || tags.amenity || tags.tourism || tags.landuse || tags.natural || "Mapped feature";
      const preferred = ["landuse", "natural", "leisure", "tourism", "amenity", "shop", "highway", "railway", "waterway", "building", "place", "addr:street", "operator"];
      const rows = [];
      rows.push(["Category", categoryLabel]);
      rows.push(["OSM ID", `${element.type}/${element.id}`]);
      preferred.forEach(key => {
        if (tags[key]) rows.push([key, tags[key]]);
      });
      Object.keys(tags).sort().forEach(key => {
        if (!preferred.includes(key) && key !== "name" && rows.length < 18) rows.push([key, tags[key]]);
      });
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(name)}</div><table class="tag-table">${table}</table>`;
    }

    function escapeHtml(value) {
      return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char]));
    }

    function buildLegend() {
      const legend = document.getElementById("legend");
      legend.innerHTML = "";
      Object.entries(categories).forEach(([key, category]) => {
        const row = document.createElement("div");
        row.className = "legend-row";
        row.innerHTML = `
          <span class="swatch" style="background:${category.color}"></span>
          <span>${category.label}</span>
          <span class="count" id="count-${key}">0</span>
        `;
        legend.appendChild(row);
      });
    }

    function buildLayerToggles() {
      const container = document.getElementById("layerToggles");
      container.innerHTML = "";
      Object.entries(categories).forEach(([key, category]) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = map.hasLayer(category.group);
        input.addEventListener("change", () => {
          if (input.checked) {
            category.group.addTo(map);
            if (key === "buildings2026") bringBuildings2026ToFront();
          }
          else map.removeLayer(category.group);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(category.label));
        container.appendChild(label);
      });
    }

    function updateLegendCounts() {
      Object.entries(categories).forEach(([key, category]) => {
        const count = document.getElementById(`count-${key}`);
        if (count) count.textContent = category.count.toLocaleString();
      });
    }

    async function loadLocalShapefile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!window.shp) {
        setStatus("Shapefile reader could not load. Check internet access, then reload this page.");
        return;
      }
      clearLocalShapefile(false);
      setStatus(`Reading local shapefile: ${file.name}...`);
      try {
        const buffer = await file.arrayBuffer();
        const geojson = await shp(buffer);
        const collections = Array.isArray(geojson) ? geojson : [geojson];
        let featureCount = 0;
        const localBounds = L.latLngBounds();

        collections.forEach(collection => {
          const layer = L.geoJSON(collection, {
            style: localFeatureStyle,
            pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
              radius: 5,
              color: "#ffffff",
              weight: 1,
              fillColor: categories.local.color,
              fillOpacity: 0.95
            }),
            onEachFeature: (feature, featureLayer) => {
              featureCount += 1;
              featureLayer.bindPopup(localPopupHtml(feature, file.name));
            }
          });
          layer.eachLayer(featureLayer => {
            if (featureLayer.getBounds) localBounds.extend(featureLayer.getBounds());
            else if (featureLayer.getLatLng) localBounds.extend(featureLayer.getLatLng());
          });
          categories.local.group.addLayer(layer);
        });

        categories.local.count = featureCount;
        updateLegendCounts();
        if (!map.hasLayer(categories.local.group)) categories.local.group.addTo(map);
        if (localBounds.isValid()) map.fitBounds(localBounds, { padding: [24, 24] });
        setStatus(`Added ${featureCount.toLocaleString()} local shapefile feature${featureCount === 1 ? "" : "s"} from ${file.name}.`);
      } catch (error) {
        console.error(error);
        setStatus("Could not read that shapefile. Upload a .zip containing .shp, .shx, .dbf, and .prj files.");
      }
    }

    function clearLocalShapefile(resetInput = true) {
      categories.local.group.clearLayers();
      categories.local.count = 0;
      updateLegendCounts();
      if (resetInput) {
        document.getElementById("shapefileInput").value = "";
        setStatus("Local shapefile layer cleared.");
      }
    }

    function localFeatureStyle() {
      return {
        color: "#9f153b",
        weight: 2,
        opacity: 0.95,
        fillColor: categories.local.color,
        fillOpacity: 0.28
      };
    }

    function localPopupHtml(feature, fileName) {
      const properties = feature.properties || {};
      const keys = Object.keys(properties);
      const title = properties.name || properties.Name || properties.NAME || "Local shapefile feature";
      const rows = [
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.slice(0, 20).forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    async function loadGithubLayer() {
      const input = document.getElementById("githubUrlInput");
      const sourceUrl = input.value.trim();
      if (!sourceUrl) {
        setStatus("Paste a public GitHub repository, zip, or GeoJSON URL first.");
        return;
      }
      await loadGithubLayerFromUrl(sourceUrl, false);
    }

    async function loadGithubLayerFromUrl(sourceUrl, quietStart) {
      let source = normalizeGithubUrl(sourceUrl);
      clearGithubLayer(false);
      if (!quietStart) setStatus("Loading GitHub land-use layer...");

      try {
        if (source.kind === "repo") throw new Error("Repository scanning disabled.");

        const response = await fetch(source.url, { cache: "no-store" });
        if (!response.ok) throw new Error("GitHub request failed: " + response.status);
        if (source.kind === "tif") {
          await renderGithubGeoTiff(response, source.url, quietStart);
        } else {
          const geojson = source.kind === "geojson" ? await response.json() : await readGithubShapefileZip(response);
          renderGithubGeoJson(geojson, sourceUrl, quietStart);
        }
      } catch (error) {
        console.error(error);
        setStatus("Could not load that GitHub layer. Use a public repo containing a GeoTIFF, an exact .tif raw/blob URL, a shapefile .zip, or a GeoJSON file.");
      }
    }

    async function readGithubShapefileZip(response) {
      if (!window.shp) throw new Error("Shapefile reader is not available.");
      const buffer = await response.arrayBuffer();
      return shp(buffer);
    }

    function renderGithubGeoJson(geojson, sourceUrl, quietStart) {
      const collections = Array.isArray(geojson) ? geojson : [geojson];
      const featureCount = collections.reduce((sum, collection) => sum + countGeoJsonFeatures(collection), 0);
      if (!featureCount) throw new Error("No features found.");

      landUseFeatures = [];
      landUseIndex = [];
      const githubBounds = L.latLngBounds();
      collections.forEach(collection => {
        const features = geoJsonFeatures(collection);
        landUseFeatures = landUseFeatures.concat(features);
        const layer = L.geoJSON(collection, {
          style: githubFeatureStyle,
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            radius: 5,
            color: "#ffffff",
            weight: 1,
            fillColor: categories.github.color,
            fillOpacity: 0.95
          })
        });
        layer.eachLayer(featureLayer => {
          if (featureLayer.getBounds) githubBounds.extend(featureLayer.getBounds());
          else if (featureLayer.getLatLng) githubBounds.extend(featureLayer.getLatLng());
        });
        categories.github.group.addLayer(layer);
      });
      landUseIndex = landUseFeatures.map(feature => ({
        feature,
        label: landUseClassForProperties(feature.properties || {})?.label || "Land-use feature",
        sourceUrl,
        bbox: geometryBbox(feature.geometry)
      }));
      landUseVersion += 1;

      categories.github.count = featureCount;
      updateLegendCounts();
      if (!map.hasLayer(categories.github.group)) categories.github.group.addTo(map);
      if (githubBounds.isValid()) map.fitBounds(githubBounds, { padding: [24, 24] });
      updateDashboard();
      if (!quietStart) setStatus(`Loaded ${featureCount.toLocaleString()} GitHub land-use feature${featureCount === 1 ? "" : "s"}.`);
    }

    async function loadCrzLayer(sourceUrl) {
      categories.crz.group.clearLayers();
      categories.crz.count = 0;
      crzLineFeatures = [];
      try {
        const response = await fetch(sourceUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("CRZ request failed: " + response.status);
        const geojson = await response.json();
        const featureCount = countGeoJsonFeatures(geojson);
        if (!featureCount) throw new Error("No CRZ features found.");
        crzLineFeatures = geoJsonFeatures(geojson);
        const crzBounds = L.latLngBounds();
        const layer = L.geoJSON(geojson, {
          style: crzFeatureStyle
        });
        layer.eachLayer(featureLayer => {
          if (featureLayer.getBounds) crzBounds.extend(featureLayer.getBounds());
        });
        categories.crz.group.addLayer(layer);
        categories.crz.count = featureCount;
        updateLegendCounts();
        //if (!map.hasLayer(categories.crz.group)) categories.crz.group.addTo(map);
      } catch (error) {
        console.error(error);
        setStatus("Could not load the CRZ 2026 layer from GitHub.");
      }
    }

    function crzFeatureStyle(feature) {
      const crzClass = crzClassForProperties(feature && feature.properties ? feature.properties : {});
      return {
        color: crzClass.color,
        weight: crzClass.weight,
        opacity: 1,
        dashArray: crzClass.dashArray
      };
    }

    function crzClassForProperties(properties) {
      const value = String(properties.Name || properties.name || properties.NAME || "").trim().toLowerCase();
      const exact = crzClassByAlias.get(value);
      if (exact) return exact;
      return crzClasses.find(item => item.aliases.some(alias => value.includes(alias))) || crzClasses[2];
    }

    function crzPopupHtml(feature, sourceUrl) {
      const properties = feature.properties || {};
      const title = properties.Name || properties.name || "CRZ 2026 feature";
      const keys = Object.keys(properties);
      const rows = [
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    async function loadCrzPolyLayer(sourceUrl) {
      categories.crzPoly.group.clearLayers();
      categories.crzPoly.count = 0;
      crzPolyFeatures = [];
      crzPolyIndex = [];
      crzPolyVersion += 1;
      try {
        const response = await fetch(sourceUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("CRZ polygon request failed: " + response.status);
        const geojson = await response.json();
        const featureCount = countGeoJsonFeatures(geojson);
        if (!featureCount) throw new Error("No CRZ polygon features found.");
        crzPolyFeatures = geoJsonFeatures(geojson);
        crzPolyIndex = crzPolyFeatures.map(feature => ({
          feature,
          label: crzPolyClassForProperties(feature.properties || {}).label,
          bbox: geometryBbox(feature.geometry)
        }));
        crzPolyVersion += 1;
        const layer = L.geoJSON(geojson, {
          style: crzPolyFeatureStyle
        });
        categories.crzPoly.group.addLayer(layer);
        categories.crzPoly.count = featureCount;
        updateLegendCounts();
        //if (!map.hasLayer(categories.crzPoly.group)) categories.crzPoly.group.addTo(map);
        applyBuildings2026CrzColors();
        updateCrzBuildingCounts();
      } catch (error) {
        console.error(error);
        setStatus("Could not load the CRZ polygon layer from GitHub.");
      }
    }

    function crzPolyFeatureStyle(feature) {
      const crzClass = crzPolyClassForProperties(feature && feature.properties ? feature.properties : {});
      return {
        color: "#263238",
        weight: 0.9,
        opacity: 0.75,
        fillColor: crzClass.color,
        fillOpacity: 0.46
      };
    }

    function crzPolyClassForProperties(properties) {
      const value = String(properties.Name || properties.name || properties.NAME || "").trim().toLowerCase();
      const exact = crzPolyClassByAlias.get(value);
      if (exact) return exact;
      return crzPolyClasses.find(item => item.aliases.some(alias => value.includes(alias))) || crzPolyClasses[0];
    }

    function crzPolyPopupHtml(feature) {
      const properties = feature.properties || {};
      const title = properties.Name || properties.name || "CRZ polygon feature";
      const keys = Object.keys(properties);
      const rows = [
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    //for raster file
    async function loadYaas2021VectorLayer(sourceUrl) {
          categories.yaas2021Vector.group.clearLayers();
          categories.yaas2021Vector.count = 0;
          yaas2021VectorFeatures = [];
          yaas2021VectorIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Yaas 2021 LULC request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Yaas 2021 LULC features found.");

            yaas2021VectorFeatures = geoJsonFeatures(geojson);
            yaas2021VectorIndex = yaas2021VectorFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "yaas2021VectorPane",
              style: yaas2021VectorStyle,
              pointToLayer: (feature, latlng) => {
                const item = yaas2021VectorClassForProperties(feature.properties || {});
                return L.circleMarker(latlng, {
                  pane: "yaas2021VectorPane",
                  radius: 5,
                  color: "#ffffff",
                  weight: 1,
                  fillColor: item.color,
                  fillOpacity: 0.95
                });
              }
            });

            categories.yaas2021Vector.group.addLayer(layer);
            categories.yaas2021Vector.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the LULC Affected Yaas 2021 layer from GitHub.");
          }
        }

        function yaas2021VectorStyle(feature) {
          const item = yaas2021VectorClassForProperties(feature && feature.properties ? feature.properties : {});

          return {
            pane: "yaas2021VectorPane",
            color: "#263238",
            weight: 0.8,
            opacity: 0.8,
            fillColor: item.color,
            fillOpacity: 0.72
          };
        }

        function yaas2021VectorClassForProperties(properties) {
          const keys = [
            "value", "Value", "VALUE",
            "class", "Class", "CLASS",
            "gridcode", "GRIDCODE", "grid_code",
            "DN", "dn",
            "lulc", "LULC",
            "landuse", "Landuse", "LANDUSE",
            "name", "Name", "NAME"
          ];

          const rawValue = keys
            .map(key => properties[key])
            .find(value => value !== null && value !== undefined && String(value).trim() !== "");

          const textValue = String(rawValue || "").trim().toLowerCase();
          const numericValue = Math.round(Number(textValue));

          if (yaas2021VectorClassByValue[numericValue]) {
            return yaas2021VectorClassByValue[numericValue];
          }

          return yaas2021VectorClasses.find(item =>
            item.aliases.some(alias => textValue.includes(alias))
          ) || { label: "Unclassified", color: "#9ca3af" };
        }

        function yaas2021VectorPopupHtml(feature) {
          const properties = feature.properties || {};
          const item = yaas2021VectorClassForProperties(properties);
          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "LULC Affected Yaas 2021"],
            ["Class", item.label],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(item.label)}</div><table class="tag-table">${table}</table>`;
        }
        //raster file end
    async function loadRoad2026Layer(sourceUrl) {
          categories.road2026.group.clearLayers();
          categories.road2026.count = 0;
          road2026Features = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Road 2026 request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Road 2026 features found.");

            road2026Features = geoJsonFeatures(geojson);

            const layer = L.geoJSON(geojson, {
              pane: "road2026Pane",
              style: road2026Style,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "road2026Pane",
                radius: 4,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.road2026.color,
                fillOpacity: 0.95
              })
            });

            categories.road2026.group.addLayer(layer);
            categories.road2026.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Road 2026 layer from GitHub.");
          }
        }

        function road2026Style() {
          return {
            pane: "road2026Pane",
            color: "#9ca3af",//categories.road2026.color,
            weight: 0.5,
            opacity: 0.95
          };
        }

        function road2026PopupHtml(feature) {
          const properties = feature.properties || {};
          const title = properties.Name || properties.name || properties.ROAD_NAME || properties.road_name || "Road 2026 feature";
          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Road 2026"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadKhsirpalLayer(sourceUrl) {
          categories.khsirpal.group.clearLayers();
          categories.khsirpal.count = 0;
          khsirpalFeatures = [];
          khsirpalIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Khsirpal request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Khsirpal features found.");

            khsirpalFeatures = geoJsonFeatures(geojson);
            khsirpalIndex = khsirpalFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "khsirpalPane",
              style: khsirpalStyle,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "khsirpalPane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.khsirpal.color,
                fillOpacity: 0.95
              })
            });

            categories.khsirpal.group.addLayer(layer);
            categories.khsirpal.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Khsirpal layer from GitHub.");
          }
        }

        function khsirpalStyle() {
          return {
            pane: "khsirpalPane",
            color: categories.khsirpal.color,
            weight: 2,
            opacity: 0.95,
            fillOpacity: 0
          };
        }

        function khsirpalPopupHtml(feature) {
          const properties = feature.properties || {};

          const title =
            properties.Name ||
            properties.name ||
            properties.VILLAGE ||
            properties.village ||
            properties.MOUZA ||
            properties.mouza ||
            "Khsirpal feature";

          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Khsirpal"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadDighaVillageLayer(sourceUrl) {
          categories.dighaVillage.group.clearLayers();
          categories.dighaVillage.count = 0;
          dighaVillageFeatures = [];
          dighaVillageIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Digha village request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Digha village features found.");

            dighaVillageFeatures = geoJsonFeatures(geojson);
            dighaVillageIndex = dighaVillageFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "dighaVillagePane",
              style: dighaVillageStyle,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "dighaVillagePane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.dighaVillage.color,
                fillOpacity: 0.95
              })
            });

            categories.dighaVillage.group.addLayer(layer);
            categories.dighaVillage.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Digha village layer from GitHub.");
          }
        }

        function dighaVillageStyle() {
          return {
            pane: "dighaVillagePane",
            color: categories.dighaVillage.color,
            weight: 1,
            opacity: 0.95,
            fillOpacity: 0
          };
        }

        function dighaVillagePopupHtml(feature) {
          const properties = feature.properties || {};
          const title =
            properties.village ||
            properties.VILLAGE ||
            properties.vill_name ||
            properties.VILL_NAME ||
            properties.Name ||
            properties.name ||
            "Digha village feature";

          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Digha village"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadDighaSimLayer(sourceUrl) {
          categories.dighaSim.group.clearLayers();
          categories.dighaSim.count = 0;
          dighaSimFeatures = [];
          dighaSimIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Digha simulation request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Digha simulation features found.");

            dighaSimFeatures = geoJsonFeatures(geojson);
            dighaSimIndex = dighaSimFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "dighaSimPane",
              style: dighaSimStyle,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "dighaSimPane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.dighaSim.color,
                fillOpacity: 0.95
              })
            });

            categories.dighaSim.group.addLayer(layer);
            categories.dighaSim.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Digha simulation layer from GitHub.");
          }
        }

        function dighaSimStyle() {
          return {
            pane: "dighaSimPane",
            color: categories.dighaSim.color,
            weight: 1,
            opacity: 0.95,
            fillOpacity: 0
          };
        }

        function dighaSimPopupHtml(feature) {
          const properties = feature.properties || {};
          const title =
            properties.Name ||
            properties.name ||
            properties.VILLAGE ||
            properties.village ||
            properties.SIM_NAME ||
            properties.sim_name ||
            "Digha simulation feature";

          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Digha part 1"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadDighaPart2Layer(sourceUrl) {
          categories.dighaPart2.group.clearLayers();
          categories.dighaPart2.count = 0;
          dighaPart2Features = [];
          dighaPart2Index = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Digha Part2 request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Digha Part2 features found.");

            dighaPart2Features = geoJsonFeatures(geojson);
            dighaPart2Index = dighaPart2Features.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "dighaPart2Pane",
              style: dighaPart2Style,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "dighaPart2Pane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.dighaPart2.color,
                fillOpacity: 0.95
              })
            });

            categories.dighaPart2.group.addLayer(layer);
            categories.dighaPart2.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Digha Part2 layer from GitHub.");
          }
        }

        function dighaPart2Style() {
          return {
            pane: "dighaPart2Pane",
            color: categories.dighaPart2.color,
            weight: 2,
            opacity: 0.95,
            fillOpacity: 0
          };
        }

        function dighaPart2PopupHtml(feature) {
          const properties = feature.properties || {};
          const title =
            properties.Name ||
            properties.name ||
            properties.VILLAGE ||
            properties.village ||
            properties.SIM_NAME ||
            properties.sim_name ||
            "Digha Part2 feature";

          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Digha Part2"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadTajpurSimLayer(sourceUrl) {
          categories.tajpurSim.group.clearLayers();
          categories.tajpurSim.count = 0;
          tajpurSimFeatures = [];
          tajpurSimIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Tajpur simulation request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Tajpur simulation features found.");

            tajpurSimFeatures = geoJsonFeatures(geojson);
            tajpurSimIndex = tajpurSimFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "tajpurSimPane",
              style: tajpurSimStyle,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "tajpurSimPane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.tajpurSim.color,
                fillOpacity: 0.95
              })
            });

            categories.tajpurSim.group.addLayer(layer);
            categories.tajpurSim.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Tajpur simulation layer from GitHub.");
          }
        }

        function tajpurSimStyle() {
          return {
            pane: "tajpurSimPane",
            color: categories.tajpurSim.color,
            weight: 1,
            opacity: 0.95,
            fillOpacity: 0
          };
        }

        function tajpurSimPopupHtml(feature) {
          const properties = feature.properties || {};
          const title =
            properties.Name ||
            properties.name ||
            properties.VILLAGE ||
            properties.village ||
            properties.SIM_NAME ||
            properties.sim_name ||
            "Tajpur simulation feature";

          const keys = Object.keys(properties);

          const rows = [
            ["Layer", "Tajpur simulation"],
            ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
          ];

          keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

          const table = rows
            .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
            .join("");

          return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
        }
        async function loadMandarmaniVillageLayer(sourceUrl) {
          categories.mandarmaniVillage.group.clearLayers();
          categories.mandarmaniVillage.count = 0;
          mandarmaniVillageFeatures = [];
          mandarmaniVillageIndex = [];

          try {
            const response = await fetch(sourceUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Mandarmani village request failed: " + response.status);

            const geojson = await response.json();
            const featureCount = countGeoJsonFeatures(geojson);
            if (!featureCount) throw new Error("No Mandarmani village features found.");

            mandarmaniVillageFeatures = geoJsonFeatures(geojson);
            mandarmaniVillageIndex = mandarmaniVillageFeatures.map(feature => ({
              feature,
              bbox: geometryBbox(feature.geometry)
            }));

            const layer = L.geoJSON(geojson, {
              pane: "mandarmaniVillagePane",
              style: mandarmaniVillageStyle,
              pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                pane: "mandarmaniVillagePane",
                radius: 5,
                color: "#ffffff",
                weight: 1,
                fillColor: categories.mandarmaniVillage.color,
                fillOpacity: 0.95
              })
            });

            categories.mandarmaniVillage.group.addLayer(layer);
            categories.mandarmaniVillage.count = featureCount;
            updateLegendCounts();

          } catch (error) {
            console.error(error);
            setStatus("Could not load the Mandarmani village layer from GitHub.");
          }
        }

        function mandarmaniVillageStyle() {
          return {
            pane: "mandarmaniVillagePane",
            color: "#9ca3af",//categories.mandarmaniVillage.color,
            weight: 1,
            opacity: 0.95,
            fillColor: "transparent", //categories.mandarmaniVillage.color,
            fillOpacity: 0.14
          };
        }

        function mandarmaniVillagePopupHtml(feature) {
              const properties = feature.properties || {};
              const title =
                properties.village ||
                properties.VILLAGE ||
                properties.vill_name ||
                properties.VILL_NAME ||
                properties.Name ||
                properties.name ||
                "Mandarmani village feature";

              const keys = Object.keys(properties);

              const rows = [
                ["Layer", "Mandarmani village"],
                ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
              ];

              keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));

              const table = rows
                .map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`)
                .join("");

              return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
          }

    async function loadBlockLayer(sourceUrl) {
      categories.block.group.clearLayers();
      categories.block.count = 0;
      blockFeatures = [];
      blockIndex = [];
      blockSearchItems = [];
      clearBlockHighlight();
      setBlockSearchEnabled(false);
      try {
        const response = await fetch(sourceUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Block boundary request failed: " + response.status);
        const geojson = await response.json();
        const featureCount = countGeoJsonFeatures(geojson);
        if (!featureCount) throw new Error("No block boundary features found.");
        blockFeatures = geoJsonFeatures(geojson);
        blockIndex = blockFeatures.map(feature => ({
          feature,
          bbox: geometryBbox(feature.geometry)
        }));
        blockSearchItems = blockFeatures
          .map((feature, index) => ({
            feature,
            name: blockNameForFeature(feature.properties || {}),
            index
          }))
          .filter(item => item.name)
          .map(item => ({
            ...item,
            normalizedName: normalizeSearchText(item.name)
          }));
        const layer = L.geoJSON(geojson, {
          pane: "blockPane",
          style: blockFeatureStyle,
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            pane: "blockPane",
            radius: 5,
            color: "#ffffff",
            weight: 1,
            fillColor: categories.block.color,
            fillOpacity: 0.92
          })
        });
        categories.block.group.addLayer(layer);
        categories.block.count = featureCount;
        updateLegendCounts();
        //if (!map.hasLayer(categories.block.group)) categories.block.group.addTo(map);
        bringBlockLayerToFront();
        updateBlockSearchOptions();
        setBlockSearchEnabled(blockSearchItems.length > 0, "No block names found");
      } catch (error) {
        console.error(error);
        updateBlockSearchOptions();
        setBlockSearchEnabled(false, "Block search unavailable");
        setStatus("Could not load the block boundary layer from GitHub.");
      }
    }

    function blockFeatureStyle() {
      return {
        pane: "blockPane",
        color: categories.block.color,
        weight: 2.2,
        opacity: 0.95,
        dashArray: "7,4",
        fillColor: categories.block.color,
        fillOpacity: 0.04
      };
    }

    function bringBlockLayerToFront() {
      categories.block.group.eachLayer(layer => {
        if (layer.bringToFront) layer.bringToFront();
        if (layer.eachLayer) {
          layer.eachLayer(featureLayer => {
            if (featureLayer.bringToFront) featureLayer.bringToFront();
          });
        }
      });
    }

    function blockPopupHtml(feature) {
      const properties = feature.properties || {};
      const title = blockNameForFeature(properties) || "Block boundary feature";
      const keys = Object.keys(properties);
      const rows = [
        ["Layer", "Block boundary"],
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    function blockNameForFeature(properties) {
      const directKeys = [
        "block_name", "BLOCK_NAME", "Block_Name", "Block_name",
        "blockName", "BlockName", "BLOCKNAME",
        "Block", "BLOCK", "block",
        "Name", "NAME", "name"
      ];

      for (const key of directKeys) {
        const value = properties[key];
        if (value !== null && value !== undefined && String(value).trim()) return String(value).trim();
      }

      const fuzzyKey = Object.keys(properties).find(key => {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
        return normalizedKey === "blockname" || normalizedKey === "block";
      });
      const fuzzyValue = fuzzyKey ? properties[fuzzyKey] : "";
      return fuzzyValue !== null && fuzzyValue !== undefined && String(fuzzyValue).trim() ? String(fuzzyValue).trim() : "";
    }

    function updateBlockSearchOptions() {
      const options = document.getElementById("blockSearchOptions");
      if (!options) return;
      const uniqueNames = [...new Set(blockSearchItems.map(item => item.name))]
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
      options.innerHTML = uniqueNames
        .map(name => `<option value="${escapeHtml(name)}"></option>`)
        .join("");
    }

    function setBlockSearchEnabled(isEnabled, disabledPlaceholder = "Loading block names...") {
      const input = document.getElementById("blockSearchInput");
      const button = document.getElementById("blockSearchBtn");
      if (!input || !button) return;
      input.disabled = !isEnabled;
      button.disabled = !isEnabled;
      input.placeholder = isEnabled ? "Search block name" : disabledPlaceholder;
    }

    function searchBlockByName(event) {
      if (event) event.preventDefault();
      const input = document.getElementById("blockSearchInput");
      const query = input ? input.value.trim() : "";
      if (!query) {
        clearBlockSearch();
        return;
      }

      if (!blockSearchItems.length) {
        setStatus("Block names are not ready yet. Wait for the block layer to finish loading.");
        return;
      }

      const matches = findBlockSearchMatches(query);
      if (!matches.length) {
        setStatus(`No block found for "${query}".`);
        return;
      }

      zoomToBlock(matches[0], matches.length);
    }

    function findBlockSearchMatches(query) {
      const normalizedQuery = normalizeSearchText(query);
      const exactMatches = blockSearchItems.filter(item => item.normalizedName === normalizedQuery);
      if (exactMatches.length) return exactMatches;

      const startMatches = blockSearchItems.filter(item => item.normalizedName.startsWith(normalizedQuery));
      if (startMatches.length) return startMatches;

      return blockSearchItems.filter(item => item.normalizedName.includes(normalizedQuery));
    }

    function zoomToBlock(item, matchCount) {
      if (!map.hasLayer(categories.block.group)) categories.block.group.addTo(map);
      bringBlockLayerToFront();
      highlightBlockFeature(item.feature);

      const blockBounds = featureBounds(item.feature);
      if (blockBounds && blockBounds.isValid()) {
        map.fitBounds(blockBounds, { padding: [70, 70], maxZoom: 15 });
      } else {
        const point = representativePoint(item.feature.geometry);
        if (point) map.setView([point[1], point[0]], Math.max(map.getZoom(), 15));
      }

      closeActiveLayerPopups();
      const popupLatLng = blockBounds && blockBounds.isValid()
        ? blockBounds.getCenter()
        : representativePointLatLng(item.feature.geometry);
      if (popupLatLng) {
        const popup = L.popup({
          autoClose: false,
          closeOnClick: false,
          maxWidth: 330,
          className: "layer-hit-popup"
        })
          .setLatLng(popupLatLng)
          .setContent(`<div class="layer-popup-heading">${escapeHtml(categories.block.label)}</div>${blockPopupHtml(item.feature)}`)
          .addTo(map);
        activeLayerPopups.push(popup);
      }

      setStatus(`Zoomed to ${item.name}${matchCount > 1 ? `; ${matchCount.toLocaleString()} matching blocks found` : ""}.`);
    }

    function highlightBlockFeature(feature) {
      clearBlockHighlight();
      selectedBlockLayer = L.geoJSON(feature, {
        pane: "blockPane",
        style: {
          pane: "blockPane",
          color: "#f97316",
          weight: 4,
          opacity: 1,
          fillColor: "#f97316",
          fillOpacity: 0.18
        },
        pointToLayer: (item, latlng) => L.circleMarker(latlng, {
          pane: "blockPane",
          radius: 7,
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#f97316",
          fillOpacity: 0.95
        })
      }).addTo(map);
      if (selectedBlockLayer.bringToFront) selectedBlockLayer.bringToFront();
      if (map.hasLayer(categories.buildings2026.group)) bringBuildings2026ToFront();
    }

    function clearBlockSearch() {
      const input = document.getElementById("blockSearchInput");
      if (input) input.value = "";
      clearBlockHighlight();
      closeActiveLayerPopups();
    }

    function clearBlockHighlight() {
      if (!selectedBlockLayer) return;
      map.removeLayer(selectedBlockLayer);
      selectedBlockLayer = null;
    }

    function featureBounds(feature) {
      const featureLayer = L.geoJSON(feature);
      const bounds = L.latLngBounds();
      featureLayer.eachLayer(layer => {
        if (layer.getBounds) bounds.extend(layer.getBounds());
        else if (layer.getLatLng) bounds.extend(layer.getLatLng());
      });
      return bounds;
    }

    function representativePointLatLng(geometry) {
      const point = representativePoint(geometry);
      return point ? L.latLng(point[1], point[0]) : null;
    }

    function normalizeSearchText(value) {
      return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    async function loadBuildings2026Layer(sourceUrl) {
      categories.buildings2026.group.clearLayers();
      categories.buildings2026.count = 0;
      buildings2026Features = [];
      buildings2026Index = [];
      try {
        const response = await fetch(sourceUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Buildings 2026 request failed: " + response.status);
        const geojson = await response.json();
        const featureCount = countGeoJsonFeatures(geojson);
        if (!featureCount) throw new Error("No Buildings 2026 features found.");
        buildings2026Features = geoJsonFeatures(geojson);
        buildings2026Index = buildings2026Features.map(feature => ({
          feature,
          bbox: geometryBbox(feature.geometry)
        }));
        const layer = L.geoJSON(geojson, {
          pane: "buildings2026Pane",
          style: buildings2026Style,
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            pane: "buildings2026Pane",
            radius: 4,
            color: "#ffffff",
            weight: 1,
            fillColor: buildingCrzColor(feature),
            fillOpacity: 0.95
          })
        });
        categories.buildings2026.group.addLayer(layer);
        categories.buildings2026.count = featureCount;
        updateLegendCounts();
        //if (!map.hasLayer(categories.buildings2026.group)) categories.buildings2026.group.addTo(map);
        bringBuildings2026ToFront();
        updateCrzBuildingCounts();
      } catch (error) {
        console.error(error);
        setStatus("Could not load the Buildings 2026 layer from GitHub.");
      }
    }

    function buildings2026Style(feature) {
      const crzInfo = buildingCrzInfo(feature);
      return {
        pane: "buildings2026Pane",
        color: crzInfo.labels.length > 1 ? "#111827" : "#374151",
        weight: crzInfo.labels.length > 1 ? 1.3 : 0.8,
        opacity: 0.95,
        fillColor: buildingCrzColor(feature),
        fillOpacity: crzInfo.labels.length ? 0.68 : 0.34
      };
    }

    function buildingCrzColor(feature) {
      const crzInfo = buildingCrzInfo(feature);
      if (!crzInfo.primary) return "#b8c0c7";
      return crzInfo.primary.color;
    }

    function applyBuildings2026CrzColors() {
      categories.buildings2026.group.eachLayer(layer => {
        if (layer.setStyle && layer.feature) layer.setStyle(buildings2026Style(layer.feature));
        if (layer.eachLayer) {
          layer.eachLayer(featureLayer => {
            if (featureLayer.setStyle && featureLayer.feature) {
              featureLayer.setStyle(buildings2026Style(featureLayer.feature));
            }
          });
        }
      });
      bringBuildings2026ToFront();
    }

    function bringBuildings2026ToFront() {
      categories.buildings2026.group.eachLayer(layer => {
        if (layer.bringToFront) layer.bringToFront();
        if (layer.eachLayer) {
          layer.eachLayer(featureLayer => {
            if (featureLayer.bringToFront) featureLayer.bringToFront();
          });
        }
      });
    }

    function buildings2026PopupHtml(feature) {
      const properties = feature.properties || {};
      const title = properties.Name || properties.name || properties.NAME || properties.id || properties.ID || "Buildings 2026 feature";
      const keys = Object.keys(properties);
      const crzInfo = buildingCrzInfo(feature);
      const rows = [
        ["Layer", "Buildings 2026"],
        ["Color zone", crzInfo.labels.length ? crzInfo.labels.join(", ") : "Outside CRZ polygons"],
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    function openActiveLayerPopups(latlng) {
      closeActiveLayerPopups();
      const point = [latlng.lng, latlng.lat];
      const hits = [];

      if (map.hasLayer(categories.github.group)) {
        const landUseHit = firstFeatureAtPoint(landUseIndex, point);
        if (landUseHit) {
          hits.push({
            title: categories.github.label,
            html: githubPopupHtml(landUseHit.feature, landUseHit.sourceUrl || defaultGithubSource)
          });
        }
      }
      //for raster layer
      if (map.hasLayer(categories.yaas2021Vector.group)) {
        const yaasHit = firstFeatureAtPoint(yaas2021VectorIndex, point);

        if (yaasHit) {
          hits.push({
            title: categories.yaas2021Vector.label,
            html: yaas2021VectorPopupHtml(yaasHit.feature)
          });
        }
      }
      //end raster file
      if (map.hasLayer(categories.crzPoly.group)) {
        const crzPolyHits = featuresAtPoint(crzPolyIndex, point);
        crzPolyHits.slice(0, 3).forEach(hit => {
          hits.push({
            title: categories.crzPoly.label,
            html: crzPolyPopupHtml(hit.feature)
          });
        });
      }

      if (map.hasLayer(categories.crz.group)) {
        const crzLineHit = nearestCrzLineAtPoint(point);
        if (crzLineHit) {
          hits.push({
            title: categories.crz.label,
            html: crzPopupHtml(crzLineHit.feature, crzSource)
          });
        }
      }
      if (map.hasLayer(categories.dighaSim.group)) {
        const dighaSimHit = firstFeatureAtPoint(dighaSimIndex, point);

        if (dighaSimHit) {
          hits.push({
            title: categories.dighaSim.label,
            html: dighaSimPopupHtml(dighaSimHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.khsirpal.group)) {
        const khsirpalHit = firstFeatureAtPoint(khsirpalIndex, point);

        if (khsirpalHit) {
          hits.push({
            title: categories.khsirpal.label,
            html: khsirpalPopupHtml(khsirpalHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.dighaPart2.group)) {
        const dighaPart2Hit = firstFeatureAtPoint(dighaPart2Index, point);

        if (dighaPart2Hit) {
          hits.push({
            title: categories.dighaPart2.label,
            html: dighaPart2PopupHtml(dighaPart2Hit.feature)
          });
        }
      }
      if (map.hasLayer(categories.block.group)) {
        const blockHit = firstBlockFeatureAtPoint(point);
        if (blockHit) {
          hits.push({
            title: categories.block.label,
            html: blockPopupHtml(blockHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.road2026.group)) {
        const roadHit = nearestRoad2026AtPoint(point);

        if (roadHit) {
          hits.push({
            title: categories.road2026.label,
            html: road2026PopupHtml(roadHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.mandarmaniVillage.group)) {
        const villageHit = firstFeatureAtPoint(mandarmaniVillageIndex, point);

        if (villageHit) {
          hits.push({
            title: categories.mandarmaniVillage.label,
            html: mandarmaniVillagePopupHtml(villageHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.dighaVillage.group)) {
        const dighaVillageHit = firstFeatureAtPoint(dighaVillageIndex, point);

        if (dighaVillageHit) {
          hits.push({
            title: categories.dighaVillage.label,
            html: dighaVillagePopupHtml(dighaVillageHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.tajpurSim.group)) {
        const tajpurSimHit = firstFeatureAtPoint(tajpurSimIndex, point);

        if (tajpurSimHit) {
          hits.push({
            title: categories.tajpurSim.label,
            html: tajpurSimPopupHtml(tajpurSimHit.feature)
          });
        }
      }
      if (map.hasLayer(categories.buildings2026.group)) {
        const buildingHit = firstFeatureAtPoint(buildings2026Index, point);
        if (buildingHit) {
          hits.push({
            title: categories.buildings2026.label,
            html: buildings2026PopupHtml(buildingHit.feature)
          });
        }
      }

      hits.forEach((hit, index) => {
        const popup = L.popup({
          autoClose: false,
          closeOnClick: false,
          maxWidth: 330,
          className: "layer-hit-popup"
        })
          .setLatLng(offsetPopupLatLng(latlng, index))
          .setContent(`<div class="layer-popup-heading">${escapeHtml(hit.title)}</div>${hit.html}`)
          .addTo(map);
        activeLayerPopups.push(popup);
      });
    }
    function makePopupDraggable(popup) {
      const popupElement = popup.getElement();
      if (!popupElement || popupElement.dataset.draggable === "true") return;

      popupElement.dataset.draggable = "true";
      popupElement.style.cursor = "move";

      let startMousePoint = null;
      let startPopupPoint = null;

      function startDrag(event) {
        if (event.target.closest(".leaflet-popup-close-button")) return;

        L.DomEvent.stopPropagation(event);
        startMousePoint = map.mouseEventToContainerPoint(event);
        startPopupPoint = map.latLngToContainerPoint(popup.getLatLng());

        document.addEventListener("mousemove", dragPopup);
        document.addEventListener("mouseup", stopDrag);
      }

      function dragPopup(event) {
        const currentMousePoint = map.mouseEventToContainerPoint(event);
        const movement = currentMousePoint.subtract(startMousePoint);
        const newPopupPoint = startPopupPoint.add(movement);

        popup.setLatLng(map.containerPointToLatLng(newPopupPoint));
      }

      function stopDrag() {
        document.removeEventListener("mousemove", dragPopup);
        document.removeEventListener("mouseup", stopDrag);
      }

      popupElement.addEventListener("mousedown", startDrag);
    }


    function closeActiveLayerPopups() {
      activeLayerPopups.forEach(popup => map.removeLayer(popup));
      activeLayerPopups = [];
    }

    function offsetPopupLatLng(latlng, index) {
      if (index === 0) return latlng;
      const point = map.latLngToContainerPoint(latlng);
      const shifted = L.point(point.x + index * 28, point.y - index * 28);
      return map.containerPointToLatLng(shifted);
    }

    function featuresAtPoint(index, point) {
      return index.filter(item => {
        if (!item.bbox || !pointInsideBbox(point, item.bbox)) return false;
        return featureContainsPoint(item.feature, point);
      });
    }

    function firstFeatureAtPoint(index, point) {
      return featuresAtPoint(index, point)[0] || null;
    }

    function firstBlockFeatureAtPoint(point) {
      const polygonHit = firstFeatureAtPoint(blockIndex, point);
      if (polygonHit) return polygonHit;

      const tolerance = mapClickToleranceDegrees();
      let nearest = null;
      blockIndex.forEach(item => {
        if (!item.bbox) return;
        const paddedBbox = padBbox(item.bbox, tolerance);
        if (!pointInsideBbox(point, paddedBbox)) return;
        const distance = distanceToGeometry(point, item.feature.geometry);
        if (distance === null || distance > tolerance) return;
        if (!nearest || distance < nearest.distance) nearest = { ...item, distance };
      });
      return nearest;
    }

    function nearestCrzLineAtPoint(point) {
      if (!crzLineFeatures.length) return null;
      const tolerance = mapClickToleranceDegrees();
      let nearest = null;
      crzLineFeatures.forEach(feature => {
        const distance = distanceToGeometry(point, feature.geometry);
        if (distance === null || distance > tolerance) return;
        if (!nearest || distance < nearest.distance) nearest = { feature, distance };
      });
      return nearest;
    }
    function nearestRoad2026AtPoint(point) {
      if (!road2026Features.length) return null;

      const tolerance = mapClickToleranceDegrees();
      let nearest = null;

      road2026Features.forEach(feature => {
        const distance = distanceToGeometry(point, feature.geometry);
        if (distance === null || distance > tolerance) return;

        if (!nearest || distance < nearest.distance) {
          nearest = { feature, distance };
        }
      });

      return nearest;
    }
    function mapClickToleranceDegrees() {
      const mapBounds = map.getBounds();
      const size = map.getSize();
      if (!size.x) return 0.00018;
      return ((mapBounds.getEast() - mapBounds.getWest()) / size.x) * 10;
    }

    function padBbox(bbox, padding) {
      return {
        minLng: bbox.minLng - padding,
        minLat: bbox.minLat - padding,
        maxLng: bbox.maxLng + padding,
        maxLat: bbox.maxLat + padding
      };
    }

    function clearGithubLayer(resetInput = true) {
      categories.github.group.clearLayers();
      categories.github.count = 0;
      landUseFeatures = [];
      landUseIndex = [];
      landUseVersion += 1;
      categories.githubRaster.group.clearLayers();
      categories.githubRaster.count = 0;
      updateLegendCounts();
      updateDashboard();
      if (resetInput) {
        document.getElementById("githubUrlInput").value = "";
        setStatus("GitHub land-use layer cleared.");
      }
    }

    function normalizeGithubUrl(url) {
      try {
        const parsed = new URL(url);
        if (parsed.hostname === "github.com") {
          const parts = parsed.pathname.split("/").filter(Boolean);
          const blobIndex = parts.indexOf("blob");
          const treeIndex = parts.indexOf("tree");
          if (parts.length > 4 && blobIndex === 2) {
            const owner = parts[0];
            const repo = parts[1];
            const branch = parts[3];
            const path = parts.slice(4).join("/");
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
            if (isTifUrl(rawUrl)) return { url: rawUrl, kind: "tif" };
            return {
              url: rawUrl,
              kind: rawUrl.toLowerCase().endsWith(".geojson") || rawUrl.toLowerCase().endsWith(".json") ? "geojson" : "zip"
            };
          }
          if (parts.length >= 2 && (parts.length === 2 || treeIndex === 2)) {
            const owner = parts[0];
            const repo = parts[1];
            const branch = treeIndex === 2 && parts[3] ? parts[3] : "main";
            return {
              kind: "repo",
              owner,
              repo,
              branch,
              pathPrefix: treeIndex === 2 ? parts.slice(4).join("/") : "",
              zipUrl: `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`
            };
          }
        }
        const lower = url.toLowerCase();
        if (isTifUrl(lower)) return { url, kind: "tif" };
        return { url, kind: lower.endsWith(".geojson") || lower.endsWith(".json") ? "geojson" : "zip" };
      } catch {
        return { url, kind: "zip" };
      }
    }

    function isTifUrl(url) {
      const clean = url.split("?")[0].toLowerCase();
      return clean.endsWith(".tif") || clean.endsWith(".tiff");
    }

    async function findFirstGithubTif(source) {
      const apiUrl = `https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${source.branch}?recursive=1`;
      const response = await fetch(apiUrl, { cache: "no-store" });
      if (!response.ok) return "";
      const data = await response.json();
      const prefix = source.pathPrefix ? source.pathPrefix.replace(/\/$/, "") + "/" : "";
      const item = (data.tree || []).find(entry => {
        const path = entry.path || "";
        return entry.type === "blob" && path.startsWith(prefix) && isTifUrl(path);
      });
      return item ? `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.branch}/${item.path}` : "";
    }

    async function renderGithubGeoTiff(response, sourceUrl, quietStart) {
      if (!window.parseGeoraster || !window.GeoRasterLayer) {
        throw new Error("GeoTIFF reader is not available.");
      }
      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);
      const rasterLayer = new GeoRasterLayer({
        georaster,
        opacity: 0.9,
        resolution: 256,
        pixelValuesToColorFn: values => rasterPixelColor(values)
      });
      rasterLayer.bindPopup(`<div class="popup-title">Land-use GeoTIFF raster</div><table class="tag-table"><tr><td>Width</td><td>${escapeHtml(String(georaster.width || ""))}</td></tr><tr><td>Height</td><td>${escapeHtml(String(georaster.height || ""))}</td></tr></table>`);
      categories.githubRaster.group.addLayer(rasterLayer);
      categories.githubRaster.count = 1;
      updateLegendCounts();
      if (!map.hasLayer(categories.githubRaster.group)) categories.githubRaster.group.addTo(map);
      if (rasterLayer.getBounds) map.fitBounds(rasterLayer.getBounds(), { padding: [24, 24] });
      if (!quietStart) setStatus("Loaded land-use GeoTIFF raster layer.");
    }

    function rasterPixelColor(values) {
      const value = Array.isArray(values) ? values.find(item => item !== null && item !== undefined) : values;
      if (value === null || value === undefined || Number.isNaN(value)) return null;
      const numericValue = Math.round(Number(value));
      const landUseClass = landUseClassByValue[numericValue];
      if (!landUseClass || landUseClass.hidden) return null;
      return landUseClass.color;
    }

    function landUseClassForProperties(properties) {
      const candidateKeys = [
        "landuse", "LANDUSE", "Landuse",
        "name", "Name", "NAME",
        "class", "CLASS", "Class",
        "type", "TYPE", "Type",
        "category", "CATEGORY", "Category",
        "descriptio", "DESCRIPTIO", "Description",
        "Landuse_Pr", "LANDUSE_PR", "landuse_pr"
      ];
      const values = candidateKeys
        .map(key => properties[key])
        .filter(value => value !== null && value !== undefined)
        .map(value => String(value).trim().toLowerCase());

      for (const value of values) {
        const exact = landUseClassByAlias.get(value);
        if (exact) return exact;
      }

      for (const value of values) {
        for (const [alias, item] of landUseClassByAlias.entries()) {
          if (value.includes(alias)) return item;
        }
      }

      return null;
    }

    function addLandUseLegendControl() {
      const control = L.control({ position: "bottomright" });
      control.onAdd = () => {
        const container = L.DomUtil.create("div", "landuse-legend-control");
        const rows = landUseClasses
          .filter(item => !item.hidden)
          .map(item => `
            <div class="map-legend-row">
              <span class="map-legend-swatch ${item.pattern || ""}" style="${item.pattern ? "" : `background:${item.color}`}"></span>
              <span>${escapeHtml(item.label)}</span>
            </div>
          `).join("");
        const crzRows = crzClasses.map(item => `
          <div class="map-legend-row">
            <span class="map-legend-line" style="--line-color:${item.color}; --line-pattern:${legendLinePattern(item.dashArray)}"></span>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `).join("");
        const crzPolyRows = crzPolyClasses.map(item => `
          <div class="map-legend-row">
            <span class="map-legend-swatch" style="background:${item.color}"></span>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `).join("");
        const yaas2021VectorRows = yaas2021VectorClasses.map(item => `
        <div class="map-legend-row">
          <span class="map-legend-swatch" style="background:${item.color}"></span>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `).join("");
        container.innerHTML = `
          <div id="landuseLegendSection" class="legend-section">
            <div class="legend-heading">DSDA Land-Use Legend</div>
            ${rows}
          </div>
          <div id="blockLegendSection" class="legend-section">
            <div class="legend-heading legend-subheading">Block Boundary</div>
            <div class="map-legend-row">
              <span class="map-legend-line" style="--line-color:${categories.block.color}; --line-pattern:${legendLinePattern("7,4")}"></span>
              <span>Block boundary</span>
            </div>
          </div>
          <div id="crzLegendSection" class="legend-section">
            <div class="legend-heading legend-subheading">CRZ</div>
            ${crzRows}
          </div>
          <details id="crzPolyLegendSection" class="legend-section legend-collapse">
            <summary class="legend-heading legend-subheading">CRZ Polygon</summary>
            <div class="legend-collapse-body">
              ${crzPolyRows}
            </div>
          </details>
          <div id="yaas2021VectorLegendSection" class="legend-section">
            <div class="legend-heading legend-subheading">Yaas 2021 LULC</div>
            ${yaas2021VectorRows}
          </div>
        `;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        return container;
      };
      control.addTo(map);
    }

    function legendLinePattern(dashArray) {
      if (dashArray === "4,4") return "repeating-linear-gradient(90deg, var(--line-color) 0 4px, transparent 4px 8px)";
      if (dashArray === "7,4") return "repeating-linear-gradient(90deg, var(--line-color) 0 7px, transparent 7px 11px)";
      if (dashArray === "8,5") return "repeating-linear-gradient(90deg, var(--line-color) 0 8px, transparent 8px 13px)";
      if (dashArray === "10,5,2,5") return "repeating-linear-gradient(90deg, var(--line-color) 0 10px, transparent 10px 15px, var(--line-color) 15px 17px, transparent 17px 22px)";
      if (dashArray === "2,4") return "repeating-linear-gradient(90deg, var(--line-color) 0 2px, transparent 2px 6px)";
      return "linear-gradient(0deg, transparent 0 5px, var(--line-color) 5px 9px, transparent 9px 14px)";
    }

    function syncLegendWithLayerVisibility() {
      const update = () => {
        const landuseLegend = document.getElementById("landuseLegendSection");
        const blockLegend = document.getElementById("blockLegendSection");
        const crzLegend = document.getElementById("crzLegendSection");
        const crzPolyLegend = document.getElementById("crzPolyLegendSection");
        const yaas2021VectorLegend = document.getElementById("yaas2021VectorLegendSection");

        if (yaas2021VectorLegend) {
          yaas2021VectorLegend.classList.toggle(
            "is-hidden",
            !map.hasLayer(categories.yaas2021Vector.group)
          );
        }
        if (landuseLegend) landuseLegend.classList.toggle("is-hidden", !map.hasLayer(categories.github.group));
        if (blockLegend) blockLegend.classList.toggle("is-hidden", !map.hasLayer(categories.block.group));
        if (crzLegend) crzLegend.classList.toggle("is-hidden", !map.hasLayer(categories.crz.group));
        if (crzPolyLegend) crzPolyLegend.classList.toggle("is-hidden", !map.hasLayer(categories.crzPoly.group));
        if (map.hasLayer(categories.block.group)) bringBlockLayerToFront();
        else clearBlockHighlight();
        if (map.hasLayer(categories.buildings2026.group)) bringBuildings2026ToFront();
      };

      map.on("overlayadd overlayremove", update);
      update();
    }

    function updateCrzBuildingCounts() {
      const countContainer = document.getElementById("crzBuildingCounts");
      const note = document.getElementById("crzBuildingCountNote");
      const stats = getCrzBuildingStats();
      updateDashboard(stats);
      if (!countContainer || !note) return;

      if (!stats.ready) {
        countContainer.innerHTML = `
          <div class="building-count-row">
            <span class="building-count-swatch" style="background:#b8c0c7"></span>
            <span>Waiting for layers</span>
            <span class="building-count-value">...</span>
          </div>
        `;
        note.textContent = "";
        return;
      }

      const rows = crzPolyClasses.map(item => `
        <div class="building-count-row">
          <span class="building-count-swatch" style="background:${item.color}"></span>
          <span>${escapeHtml(item.label)}</span>
          <span class="building-count-value">${(stats.counts.get(item.label) || 0).toLocaleString()}</span>
        </div>
      `).join("");

      countContainer.innerHTML = `${rows}
        <div class="building-count-row">
          <span class="building-count-swatch" style="background:#b8c0c7"></span>
          <span>Outside CRZ polygons</span>
          <span class="building-count-value">${stats.outside.toLocaleString()}</span>
        </div>
      `;
      note.textContent = `${stats.total.toLocaleString()} buildings checked by center point${stats.overlapping ? `; ${stats.overlapping.toLocaleString()} in multiple zones` : ""}${stats.skipped ? `; ${stats.skipped.toLocaleString()} skipped` : ""}.`;
    }

    function getCrzBuildingStats() {
      const stats = {
        ready: buildings2026Features.length > 0 && crzPolyIndex.length > 0,
        total: buildings2026Features.length,
        inside: 0,
        outside: 0,
        skipped: 0,
        overlapping: 0,
        counts: new Map(crzPolyClasses.map(item => [item.label, 0]))
      };

      if (!stats.ready) return stats;

      buildings2026Features.forEach(building => {
        const crzInfo = buildingCrzInfo(building);
        if (crzInfo.skipped) {
          stats.skipped += 1;
          return;
        }

        if (!crzInfo.labels.length) {
          stats.outside += 1;
          return;
        }

        stats.inside += 1;
        if (crzInfo.labels.length > 1) stats.overlapping += 1;
        crzInfo.labels.forEach(label => stats.counts.set(label, (stats.counts.get(label) || 0) + 1));
      });

      return stats;
    }

    function updateDashboard(buildingStats = null) {
      const stats = buildingStats || getCrzBuildingStats();
      const landUseItems = landUseAreaStats();
      const crzAreaItems = crzAreaStats();
      const landUseTotalArea = landUseItems.reduce((sum, item) => sum + item.value, 0);

      setDashboardText("dashTotalBuildings", stats.total ? formatCount(stats.total) : "--");
      setDashboardText("dashBuildingsInside", stats.ready ? formatCount(stats.inside) : "--");
      setDashboardText("dashBuildingsOutside", stats.ready ? formatCount(stats.outside) : "--");
      setDashboardText("dashLandUseArea", landUseTotalArea ? formatArea(landUseTotalArea) : "--");

      const buildingItems = crzPolyClasses.map(item => ({
        label: item.label,
        color: item.color,
        value: stats.counts.get(item.label) || 0
      }));
      buildingItems.push({ label: "Outside CRZ polygons", color: "#b8c0c7", value: stats.outside || 0 });
      renderDashboardBars(
        "dashCrzBuildingBars",
        stats.ready ? buildingItems : [],
        formatCount,
        "Waiting for building and CRZ polygon layers."
      );

      renderDashboardBars(
        "dashLandUseAreaBars",
        landUseItems,
        formatArea,
        "Waiting for land-use layer."
      );

      renderDashboardBars(
        "dashCrzAreaBars",
        crzAreaItems,
        formatArea,
        "Waiting for CRZ polygon layer."
      );
    }

    function setDashboardText(id, value) {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    function landUseAreaStats() {
      return aggregateAreaStats(landUseFeatures, feature => {
        const landUseClass = landUseClassForProperties(feature.properties || {});
        return {
          label: landUseClass ? landUseClass.label : "Unclassified",
          color: landUseClass ? landUseClass.color : "#9aa4aa"
        };
      });
    }

    function crzAreaStats() {
      return aggregateAreaStats(crzPolyFeatures, feature => {
        const crzClass = crzPolyClassForProperties(feature.properties || {});
        return {
          label: crzClass.label,
          color: crzClass.color
        };
      });
    }

    function aggregateAreaStats(features, classifier) {
      const stats = new Map();
      features.forEach(feature => {
        const area = geometryAreaSqMeters(feature.geometry);
        if (!area) return;
        const item = classifier(feature);
        const existing = stats.get(item.label) || { label: item.label, color: item.color, value: 0 };
        existing.value += area;
        stats.set(item.label, existing);
      });
      return Array.from(stats.values()).sort((a, b) => b.value - a.value);
    }

    function renderDashboardBars(containerId, items, valueFormatter, emptyText) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const visibleItems = items.filter(item => item.value > 0);
      if (!visibleItems.length) {
        container.innerHTML = `<div class="dashboard-empty">${escapeHtml(emptyText)}</div>`;
        return;
      }

      const maxValue = Math.max(...visibleItems.map(item => item.value));
      container.innerHTML = visibleItems.map(item => {
        const width = maxValue ? Math.max(2, (item.value / maxValue) * 100) : 0;
        return `
          <div class="dashboard-bar-row">
            <span class="dashboard-bar-swatch" style="background:${item.color}"></span>
            <span class="dashboard-bar-label" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
            <span class="dashboard-bar-value">${escapeHtml(valueFormatter(item.value))}</span>
            <div class="dashboard-bar-track">
              <span class="dashboard-bar-fill" style="width:${width.toFixed(1)}%; background:${item.color}"></span>
            </div>
          </div>
        `;
      }).join("");
    }

    function formatCount(value) {
      return Math.round(value).toLocaleString();
    }

    function formatArea(value) {
      const km2 = value / 1000000;
      return `${km2.toLocaleString(undefined, { maximumFractionDigits: km2 >= 10 ? 1 : 2 })} sq km`;
    }

    function buildingCrzInfo(feature) {
      if (feature && feature.__crzInfo && feature.__crzInfoVersion === crzPolyVersion) {
        return feature.__crzInfo;
      }

      const point = representativePoint(feature && feature.geometry);
      if (!point) {
        const info = { labels: [], primary: null, skipped: true };
        if (feature) {
          feature.__crzInfo = info;
          feature.__crzInfoVersion = crzPolyVersion;
        }
        return info;
      }
      if (!crzPolyIndex.length) {
        const info = { labels: [], primary: null, skipped: false };
        if (feature) {
          feature.__crzInfo = info;
          feature.__crzInfoVersion = crzPolyVersion;
        }
        return info;
      }

      const zoneLabels = new Set();
      crzPolyIndex.forEach(item => {
        if (!item.bbox || !pointInsideBbox(point, item.bbox)) return;
        if (featureContainsPoint(item.feature, point)) zoneLabels.add(item.label);
      });

      const labels = crzPolyClasses
        .map(item => item.label)
        .filter(label => zoneLabels.has(label));
      const primary = crzPolyClasses.find(item => item.label === labels[0]) || null;
      const info = { labels, primary, skipped: false };
      if (feature) {
        feature.__crzInfo = info;
        feature.__crzInfoVersion = crzPolyVersion;
      }
      return info;
    }

    function buildingLandUseInfo(feature) {
      if (feature && feature.__landUseInfo && feature.__landUseInfoVersion === landUseVersion) {
        return feature.__landUseInfo;
      }

      const point = representativePoint(feature && feature.geometry);
      if (!point || !landUseIndex.length) {
        if (feature) {
          feature.__landUseInfo = null;
          feature.__landUseInfoVersion = landUseVersion;
        }
        return null;
      }

      const match = landUseIndex.find(item => {
        if (!item.bbox || !pointInsideBbox(point, item.bbox)) return false;
        return featureContainsPoint(item.feature, point);
      }) || null;

      const info = match ? {
        label: match.label,
        feature: match.feature
      } : null;
      if (feature) {
        feature.__landUseInfo = info;
        feature.__landUseInfoVersion = landUseVersion;
      }
      return info;
    }

    function nearestCrzLineInfo(feature) {
      const point = representativePoint(feature && feature.geometry);
      if (!point || !crzLineFeatures.length) return null;

      let nearest = null;
      crzLineFeatures.forEach(lineFeature => {
        const distance = distanceToGeometry(point, lineFeature.geometry);
        if (distance === null) return;
        if (!nearest || distance < nearest.distance) {
          const crzClass = crzClassForProperties(lineFeature.properties || {});
          nearest = {
            label: lineFeature.properties?.Name || lineFeature.properties?.name || crzClass.label,
            feature: lineFeature,
            distance
          };
        }
      });

      return nearest && nearest.distance <= 0.00018 ? nearest : null;
    }

    function countGeoJsonFeatures(geojson) {
      if (!geojson) return 0;
      if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) return geojson.features.length;
      if (geojson.type === "Feature") return 1;
      if (geojson.type && geojson.coordinates) return 1;
      return 0;
    }

    function geoJsonFeatures(geojson) {
      if (!geojson) return [];
      if (Array.isArray(geojson)) return geojson.flatMap(item => geoJsonFeatures(item));
      if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) return geojson.features;
      if (geojson.type === "Feature") return [geojson];
      if (geojson.type && geojson.coordinates) return [{ type: "Feature", properties: {}, geometry: geojson }];
      return [];
    }

    function geometryAreaSqMeters(geometry) {
      if (!geometry) return 0;
      if (geometry.type === "Polygon") return polygonAreaSqMeters(geometry.coordinates);
      if (geometry.type === "MultiPolygon") {
        return geometry.coordinates.reduce((sum, polygon) => sum + polygonAreaSqMeters(polygon), 0);
      }
      return 0;
    }

    function polygonAreaSqMeters(polygon) {
      if (!Array.isArray(polygon) || !polygon.length) return 0;
      const outerArea = Math.abs(ringAreaSqMeters(polygon[0]));
      const holeArea = polygon.slice(1).reduce((sum, ring) => sum + Math.abs(ringAreaSqMeters(ring)), 0);
      return Math.max(0, outerArea - holeArea);
    }

    function ringAreaSqMeters(ring) {
      if (!Array.isArray(ring) || ring.length < 3) return 0;
      const earthRadius = 6378137;
      let area = 0;

      for (let index = 0; index < ring.length; index += 1) {
        const lower = ring[index === 0 ? ring.length - 1 : index - 1];
        const middle = ring[index];
        const upper = ring[index === ring.length - 1 ? 0 : index + 1];
        area += (toRadians(upper[0]) - toRadians(lower[0])) * Math.sin(toRadians(middle[1]));
      }

      return (area * earthRadius * earthRadius) / 2;
    }

    function toRadians(value) {
      return (value * Math.PI) / 180;
    }

    function representativePoint(geometry) {
      const stats = coordinateStats(geometry && geometry.coordinates);
      if (!stats.count) return null;
      return [stats.lng / stats.count, stats.lat / stats.count];
    }

    function coordinateStats(coordinates, stats = { lng: 0, lat: 0, count: 0 }) {
      if (!Array.isArray(coordinates)) return stats;
      if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
        stats.lng += coordinates[0];
        stats.lat += coordinates[1];
        stats.count += 1;
        return stats;
      }
      coordinates.forEach(item => coordinateStats(item, stats));
      return stats;
    }

    function geometryBbox(geometry) {
      const stats = geometryBboxStats(geometry && geometry.coordinates);
      if (!stats.valid) return null;
      return stats;
    }

    function geometryBboxStats(coordinates, stats = { minLng: Infinity, minLat: Infinity, maxLng: -Infinity, maxLat: -Infinity, valid: false }) {
      if (!Array.isArray(coordinates)) return stats;
      if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
        stats.minLng = Math.min(stats.minLng, coordinates[0]);
        stats.minLat = Math.min(stats.minLat, coordinates[1]);
        stats.maxLng = Math.max(stats.maxLng, coordinates[0]);
        stats.maxLat = Math.max(stats.maxLat, coordinates[1]);
        stats.valid = true;
        return stats;
      }
      coordinates.forEach(item => geometryBboxStats(item, stats));
      return stats;
    }

    function pointInsideBbox(point, bbox) {
      return point[0] >= bbox.minLng && point[0] <= bbox.maxLng && point[1] >= bbox.minLat && point[1] <= bbox.maxLat;
    }

    function featureContainsPoint(feature, point) {
      const geometry = feature && feature.geometry;
      if (!geometry) return false;
      if (geometry.type === "Polygon") return polygonContainsPoint(geometry.coordinates, point);
      if (geometry.type === "MultiPolygon") return geometry.coordinates.some(polygon => polygonContainsPoint(polygon, point));
      return false;
    }

    function distanceToGeometry(point, geometry) {
      if (!geometry) return null;
      if (geometry.type === "LineString") return distanceToLineString(point, geometry.coordinates);
      if (geometry.type === "MultiLineString") {
        return geometry.coordinates.reduce((best, line) => {
          const distance = distanceToLineString(point, line);
          if (distance === null) return best;
          return best === null ? distance : Math.min(best, distance);
        }, null);
      }
      if (geometry.type === "Polygon") return distanceToPolygonRings(point, geometry.coordinates);
      if (geometry.type === "MultiPolygon") {
        return geometry.coordinates.reduce((best, polygon) => {
          const distance = distanceToPolygonRings(point, polygon);
          if (distance === null) return best;
          return best === null ? distance : Math.min(best, distance);
        }, null);
      }
      return null;
    }

    function distanceToPolygonRings(point, polygon) {
      if (!Array.isArray(polygon)) return null;
      return polygon.reduce((best, ring) => {
        const distance = distanceToLineString(point, ring);
        if (distance === null) return best;
        return best === null ? distance : Math.min(best, distance);
      }, null);
    }

    function distanceToLineString(point, line) {
      if (!Array.isArray(line) || line.length < 2) return null;
      let best = null;
      for (let index = 1; index < line.length; index += 1) {
        const distance = distanceToSegment(point, line[index - 1], line[index]);
        best = best === null ? distance : Math.min(best, distance);
      }
      return best;
    }

    function distanceToSegment(point, start, end) {
      const x = point[0];
      const y = point[1];
      const x1 = start[0];
      const y1 = start[1];
      const x2 = end[0];
      const y2 = end[1];
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
    }

    function polygonContainsPoint(polygon, point) {
      if (!Array.isArray(polygon) || !polygon.length || !ringContainsPoint(polygon[0], point)) return false;
      return !polygon.slice(1).some(ring => ringContainsPoint(ring, point));
    }

    function ringContainsPoint(ring, point) {
      if (!Array.isArray(ring) || ring.length < 3) return false;
      const x = point[0];
      const y = point[1];
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0];
        const yi = ring[i][1];
        const xj = ring[j][0];
        const yj = ring[j][1];
        const intersects = ((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersects) inside = !inside;
      }
      return inside;
    }

    function githubFeatureStyle(feature) {
      const color = landUseColor(feature && feature.properties ? feature.properties : {});
      return {
        color: color === "#000000" ? "#222222" : "#123f63",
        weight: 2,
        opacity: 0.95,
        fillColor: color,
        fillOpacity: 0.74
      };
    }

    function landUseColor(properties) {
      const landUseClass = landUseClassForProperties(properties);
      return landUseClass ? landUseClass.color : "#b7b7b7";
    }

    function githubPopupHtml(feature, sourceUrl) {
      const properties = feature.properties || {};
      const keys = Object.keys(properties);
      const title = properties.name || properties.Name || properties.NAME || properties.landuse || properties.LANDUSE || "GitHub land-use feature";
      const rows = [
        ["Geometry", feature.geometry ? feature.geometry.type : "Unknown"]
      ];
      keys.slice(0, 22).forEach(key => rows.push([key, properties[key]]));
      const table = rows.map(([key, value]) => `<tr><td>${escapeHtml(String(key))}</td><td>${escapeHtml(String(value ?? ""))}</td></tr>`).join("");
      return `<div class="popup-title">${escapeHtml(String(title))}</div><table class="tag-table">${table}</table>`;
    }

    function setStatus(message) {
      document.getElementById("status").textContent = message;
    }
    //popup drageble
    map.on("popupopen", event => makePopupDraggable(event.popup));

