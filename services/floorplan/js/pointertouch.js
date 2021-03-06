/**
 * jquery.event.pointertouch
 * Lift touch and pointer event properties to the jQuery event object
 * @version v0.1.3
 * @license MIT
 */
! function(e, t) {
	"function" == typeof define && define.amd ? define(["jquery"], function(o) {
		return t(e, o)
	}) : "object" == typeof exports ? t(e, require("jquery")) : t(e, e.jQuery)
}("undefined" != typeof window ? window : this, function(e, t) {
	"use strict";
	var o = "over out down up move enter leave cancel".split(" "),
		n = t.extend({}, t.event.mouseHooks),
		r = {};
	if (e.PointerEvent) t.each(o, function(e, o) {
		t.event.fixHooks[r[o] = "pointer" + o] = n
	});
	else {
		var u = n.props;
		n.props = u.concat(["touches", "changedTouches", "targetTouches", "altKey", "ctrlKey", "metaKey", "shiftKey"]), n.filter = function(e, t) {
			var o, n = u.length;
			if (!t.pageX && t.touches && (o = t.touches[0]))
				for (; n--;) e[u[n]] = o[u[n]];
			return e
		}, t.each(o, function(e, o) {
			if (2 > e) r[o] = "mouse" + o;
			else {
				var u = "touch" + ("down" === o ? "start" : "up" === o ? "end" : o);
				t.event.fixHooks[u] = n, r[o] = u + " mouse" + o
			}
		})
	}
	return t.pointertouch = r, r
});