import { colours } from "./style";

export const mapStyle = {
  version: 8,
  name: "Ngemil Custom Map Style",
  metadata: {
    "mapbox:autocomposite": true,
    "mapbox:type": "template",
  },
  sources: {
    composite: {
      url: "mapbox://mapbox.mapbox-streets-v8",
      type: "vector",
    },
  },
  sprite: "mapbox://sprites/mapbox/light-v10",
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": colours.primary_bg,
      },
    },
    {
      id: "landuse",
      type: "fill",
      source: "composite",
      "source-layer": "landuse",
      paint: {
        "fill-color": colours.accent_2, // soft light pastel purple #D7C7F7
        "fill-opacity": 0.25,
      },
    },
    {
      id: "water",
      type: "fill",
      source: "composite",
      "source-layer": "water",
      paint: {
        "fill-color": colours.border_1, // soft blue/lavender #EDF0FE
      },
    },
    {
      id: "building",
      type: "fill",
      source: "composite",
      "source-layer": "building",
      paint: {
        "fill-color": "#EAEAE2",
        "fill-opacity": 0.5,
      },
    },
    {
      id: "road-minor",
      type: "line",
      source: "composite",
      "source-layer": "road",
      paint: {
        "line-color": colours.secondary_bg, // White
        "line-width": 1.5,
      },
    },
    {
      id: "road-major",
      type: "line",
      source: "composite",
      "source-layer": "road",
      filter: ["in", "class", "primary", "secondary", "tertiary"],
      paint: {
        "line-color": colours.secondary_bg, // White
        "line-width": 3,
      },
    },
    {
      id: "road-label",
      type: "symbol",
      source: "composite",
      "source-layer": "road_label",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 10,
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      },
      paint: {
        "text-color": colours.text_primary, // #5A5869
        "text-halo-color": colours.primary_bg,
        "text-halo-width": 1,
      },
    },
    {
      id: "place-label",
      type: "symbol",
      source: "composite",
      "source-layer": "place_label",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 12,
        "text-font": ["Open Sans Bold", "Arial Unicode MS Regular"],
      },
      paint: {
        "text-color": colours.text_primary, // #5A5869
        "text-halo-color": colours.primary_bg,
        "text-halo-width": 1.5,
      },
    },
  ],
};
