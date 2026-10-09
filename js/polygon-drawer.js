/**
 * Silicone Roof Pros - Polygon Drawer
 *
 * Drop-in replacement for the parts of google.maps.drawing.DrawingManager that
 * hero-map.js and quote-map.js use. Google removed DrawingManager from the Maps
 * JavaScript API in version 3.65, and constructing one now throws - which
 * aborted map setup part-way and broke address autocomplete and the roof map.
 *
 * Supported surface (matches what the old code called):
 *   createPolygonDrawer({ polygonOptions })
 *   drawer.setMap(map)
 *   drawer.setDrawingMode('polygon' | null)
 *   drawer.getDrawingMode()
 *   google.maps.event.addListener(drawer, 'polygoncomplete', fn(polygon))
 *
 * Interaction: click to place corners, then double-click or click the first
 * corner again to close the shape. Needs the "geometry" library.
 */
(function() {
    'use strict';

    // How close (in screen pixels) a click must be to the first corner to close the shape.
    var CLOSE_THRESHOLD_PX = 12;

    window.createPolygonDrawer = function(options) {
        var polygonOptions = (options && options.polygonOptions) || {};
        var drawer = new google.maps.MVCObject();

        var map = null;
        var mode = null;
        var points = [];
        var outline = null;   // corners placed so far
        var rubberBand = null; // segment from the last corner to the mouse
        var listeners = [];
        var savedDoubleClickZoom = false;
        var savedCursor = null;

        function metersPerPixel() {
            var lat = map.getCenter().lat();
            return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, map.getZoom());
        }

        function isNear(a, b) {
            return google.maps.geometry.spherical.computeDistanceBetween(a, b)
                <= CLOSE_THRESHOLD_PX * metersPerPixel();
        }

        function lineOptions(opacity) {
            return {
                map: map,
                clickable: false, // let clicks fall through to the map
                strokeColor: polygonOptions.strokeColor || '#f4a21c',
                strokeWeight: polygonOptions.strokeWeight || 3,
                strokeOpacity: opacity
            };
        }

        function clearInProgress() {
            points = [];
            if (outline) { outline.setMap(null); outline = null; }
            if (rubberBand) { rubberBand.setMap(null); rubberBand = null; }
        }

        function detach() {
            listeners.forEach(function(l) { google.maps.event.removeListener(l); });
            listeners = [];
            clearInProgress();
            if (map) {
                map.setOptions({
                    disableDoubleClickZoom: savedDoubleClickZoom,
                    draggableCursor: savedCursor
                });
            }
        }

        function finish() {
            if (points.length < 3) return;
            var polygon = new google.maps.Polygon(Object.assign({}, polygonOptions, {
                paths: points.slice(),
                map: map
            }));
            clearInProgress();
            // Defer so every other listener for this click (e.g. the page's
            // pin-dropping handler) still sees drawing mode as active and ignores it.
            setTimeout(function() {
                google.maps.event.trigger(drawer, 'polygoncomplete', polygon);
            }, 0);
        }

        function onClick(e) {
            if (points.length >= 3 && isNear(points[0], e.latLng)) {
                finish();
                return;
            }
            points.push(e.latLng);
            outline.setPath(points);
        }

        function onMouseMove(e) {
            if (!points.length) return;
            rubberBand.setPath([points[points.length - 1], e.latLng]);
        }

        function onDoubleClick() {
            // A double-click also delivers two clicks, each of which placed a
            // corner. Drop the near-duplicate so the shape has no zero-length edge.
            while (points.length >= 2 && isNear(points[points.length - 1], points[points.length - 2])) {
                points.pop();
            }
            finish();
        }

        function attach() {
            savedDoubleClickZoom = !!map.get('disableDoubleClickZoom');
            savedCursor = map.get('draggableCursor') || null;
            map.setOptions({ disableDoubleClickZoom: true, draggableCursor: 'crosshair' });
            outline = new google.maps.Polyline(lineOptions(0.9));
            rubberBand = new google.maps.Polyline(lineOptions(0.5));
            listeners.push(map.addListener('click', onClick));
            listeners.push(map.addListener('mousemove', onMouseMove));
            listeners.push(map.addListener('dblclick', onDoubleClick));
        }

        drawer.setMap = function(newMap) {
            if (mode) detach();
            map = newMap;
            if (mode && map) attach();
        };

        drawer.getDrawingMode = function() {
            return mode;
        };

        drawer.setDrawingMode = function(newMode) {
            newMode = newMode || null;
            if (newMode === mode) return;
            if (mode) detach();
            mode = newMode;
            if (mode && map) attach();
        };

        return drawer;
    };
})();
