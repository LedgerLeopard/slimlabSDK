! function(t, e) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.jspdf = e()
}(this, function() {
	"use strict";
	var t = {};
	t["typeof"] = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	};
	/** @preserve
	 * jsPDF - PDF Document creation from JavaScript
	 * Version 1.3.1 Built on 2018-01-12T13:43:24.489Z
	 *                           CommitID 0890b8f5f2
	 *
	 * Copyright (c) 2010-2014 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
	 *               2010 Aaron Spike, https://github.com/acspike
	 *               2012 Willow Systems Corporation, willow-systems.com
	 *               2012 Pablo Hess, https://github.com/pablohess
	 *               2012 Florian Jenett, https://github.com/fjenett
	 *               2013 Warren Weckesser, https://github.com/warrenweckesser
	 *               2013 Youssef Beddad, https://github.com/lifof
	 *               2013 Lee Driscoll, https://github.com/lsdriscoll
	 *               2013 Stefan Slonevskiy, https://github.com/stefslon
	 *               2013 Jeremy Morel, https://github.com/jmorel
	 *               2013 Christoph Hartmann, https://github.com/chris-rock
	 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
	 *               2014 James Makes, https://github.com/dollaruw
	 *               2014 Diego Casorran, https://github.com/diegocr
	 *               2014 Steven Spungin, https://github.com/Flamenco
	 *               2014 Kenneth Glassey, https://github.com/Gavvers
	 *
	 * Licensed under the MIT License
	 *
	 * Contributor(s):
	 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
	 *    kim3er, mfo, alnorth, Flamenco
	 */
	var e = function(e) {
		function n(t) {
			var n = {};
			this.subscribe = function(t, e, r) {
				if ("function" != typeof e) return !1;
				n.hasOwnProperty(t) || (n[t] = {});
				var i = Math.random().toString(35);
				return n[t][i] = [e, !!r], i
			}, this.unsubscribe = function(t) {
				for (var e in n)
					if (n[e][t]) return delete n[e][t], !0;
				return !1
			}, this.publish = function(r) {
				if (n.hasOwnProperty(r)) {
					var i = Array.prototype.slice.call(arguments, 1),
						o = [];
					for (var s in n[r]) {
						var a = n[r][s];
						try {
							a[0].apply(t, i)
						} catch (c) {
							e.console && console.error("jsPDF PubSub Error", c.message, c)
						}
						a[1] && o.push(s)
					}
					o.length && o.forEach(this.unsubscribe)
				}
			}
		}

		function i(c, h, u, l) {
			var f = {};
			"object" === ("undefined" == typeof c ? "undefined" : t["typeof"](c)) && (f = c, c = f.orientation, h = f.unit || h, u = f.format || u, l = f.compress || f.compressPdf || l), h = h || "mm", u = u || "a4", c = ("" + (c || "P")).toLowerCase();
			var d, p, g, m, y, w, v, b, x, S, k, I, C = (("" + u).toLowerCase(), !!l && "function" == typeof Uint8Array),
				A = f.textColor || "0 g",
				_ = f.drawColor || "0 G",
				q = f.fontSize || 16,
				T = f.charSpace || 0,
				P = f.R2L || !1,
				E = f.lineHeight || 1.15,
				O = f.lineWidth || .200025,
				F = 2,
				B = !1,
				R = [],
				D = {},
				j = {},
				M = [],
				N = {},
				L = {},
				z = {},
				U = {},
				H = null,
				W = 0,
				X = [],
				G = [],
				V = [],
				Y = [],
				J = [],
				Q = 0,
				K = 0,
				Z = 0,
				$ = {},
				tt = {},
				et = [],
				nt = {
					title: "",
					subject: "",
					author: "",
					keywords: "",
					creator: ""
				},
				rt = {},
				it = new n(rt),
				ot = function(t) {
					return t.toFixed(2)
				},
				st = function(t) {
					return t.toFixed(3)
				},
				at = function(t) {
					return ("0" + parseInt(t)).slice(-2)
				},
				ct = function(t) {
					var e = "00" + t;
					return e.substr(e.length - 2)
				},
				ht = function(t) {
					B ? X[m].push(t) : (Z += t.length + 1, Y.push(t))
				},
				ut = function() {
					return F++, R[F] = Z, ht(F + " 0 obj"), F
				},
				lt = function() {
					var t = 2 * X.length + 1;
					t += J.length;
					var e = {
						objId: t,
						content: ""
					};
					return J.push(e), e
				},
				ft = function() {
					return F++, R[F] = function() {
						return Z
					}, F
				},
				dt = function(t) {
					R[t] = Z
				},
				pt = function(t) {
					ht("stream"), ht(t), ht("endstream")
				},
				gt = function() {
					var t, n, r, s, a, c, h, u, l;
					for (h = e.adler32cs || i.adler32cs, C && "undefined" == typeof h && (C = !1), t = 1; W >= t; t++) {
						if (ut(), u = (b = V[t].width) * p, l = (x = V[t].height) * p, ht("<</Type /Page"), ht("/Parent 1 0 R"), ht("/Resources 2 0 R"), ht("/MediaBox [0 0 " + ot(u) + " " + ot(l) + "]"), it.publish("putPage", {
								pageNumber: t,
								page: X[t]
							}), ht("/Contents " + (F + 1) + " 0 R"), ht(">>"), ht("endobj"), n = X[t].join("\n"), n = new jt(p, 0, 0, -p, 0, x * p).toString() + " cm\n/F1 " + 16 / p + " Tf\n" + n, ut(), C) {
							for (r = [], s = n.length; s--;) r[s] = n.charCodeAt(s);
							c = h.from(n), a = new o(6), a.append(new Uint8Array(r)), n = a.flush(), r = new Uint8Array(n.length + 6), r.set(new Uint8Array([120, 156])), r.set(n, 2), r.set(new Uint8Array([255 & c, c >> 8 & 255, c >> 16 & 255, c >> 24 & 255]), n.length + 2), n = String.fromCharCode.apply(null, r), ht("<</Length " + n.length + " /Filter [/FlateDecode]>>")
						} else ht("<</Length " + n.length + ">>");
						pt(n), ht("endobj")
					}
					R[1] = Z, ht("1 0 obj"), ht("<</Type /Pages");
					var f = "/Kids [";
					for (s = 0; W > s; s++) f += 3 + 2 * s + " 0 R ";
					ht(f + "]"), ht("/Count " + W), ht(">>"), ht("endobj"), it.publish("postPutPages")
				},
				mt = function(t) {
					if (t.id.slice(1) >= 14) {
						var e = t.metadata.embedTTF(t.encoding, ut, ht);
						e ? t.objectNumber = e : delete D[t.id]
					} else t.objectNumber = ut(), ht("<</BaseFont/" + t.postScriptName + "/Type/Font"), "string" == typeof t.encoding && ht("/Encoding/" + t.encoding), ht("/Subtype/Type1>>"), ht("endobj")
				},
				yt = function() {
					for (var t in D) D.hasOwnProperty(t) && mt(D[t])
				},
				wt = function(t) {
					t.objectNumber = ut(), ht("<<"), ht("/Type /XObject"), ht("/Subtype /Form"), ht("/BBox [" + [ot(t.x), ot(t.y), ot(t.x + t.width), ot(t.y + t.height)].join(" ") + "]"), ht("/Matrix [" + t.matrix.toString() + "]");
					var e = t.pages[1].join("\n");
					ht("/Length " + e.length), ht(">>"), pt(e), ht("endobj")
				},
				vt = function() {
					for (var t in $) $.hasOwnProperty(t) && wt($[t])
				},
				bt = function(t, e) {
					var n, r = [],
						i = 1 / (e - 1);
					for (n = 0; 1 > n; n += i) r.push(n);
					if (r.push(1), 0 != t[0].offset) {
						var o = {
							offset: 0,
							color: t[0].color
						};
						t.unshift(o)
					}
					if (1 != t[t.length - 1].offset) {
						var s = {
							offset: 1,
							color: t[t.length - 1].color
						};
						t.push(s)
					}
					for (var a = "", c = 0, h = 0; h < r.length; h++) {
						for (n = r[h]; n > t[c + 1].offset;) c++;
						var u = t[c].offset,
							l = t[c + 1].offset,
							f = (n - u) / (l - u),
							d = t[c].color,
							p = t[c + 1].color;
						a += ct(Math.round((1 - f) * d[0] + f * p[0]).toString(16)) + ct(Math.round((1 - f) * d[1] + f * p[1]).toString(16)) + ct(Math.round((1 - f) * d[2] + f * p[2]).toString(16))
					}
					return a.trim()
				},
				xt = function(t, e) {
					e || (e = 21);
					var n = ut(),
						r = bt(t.colors, e);
					ht("<< /FunctionType 0"), ht("/Domain [0.0 1.0]"), ht("/Size [" + e + "]"), ht("/BitsPerSample 8"), ht("/Range [0.0 1.0 0.0 1.0 0.0 1.0]"), ht("/Decode [0.0 1.0 0.0 1.0 0.0 1.0]"), ht("/Length " + r.length), ht("/Filter /ASCIIHexDecode"), ht(">>"), pt(r), ht("endobj"), t.objectNumber = ut(), ht("<< /ShadingType " + t.type), ht("/ColorSpace /DeviceRGB");
					var i = "/Coords [" + st(parseFloat(t.coords[0])) + " " + st(parseFloat(t.coords[1])) + " ";
					i += 2 === t.type ? st(parseFloat(t.coords[2])) + " " + st(parseFloat(t.coords[3])) : st(parseFloat(t.coords[2])) + " " + st(parseFloat(t.coords[3])) + " " + st(parseFloat(t.coords[4])) + " " + st(parseFloat(t.coords[5])), i += "]", ht(i), t.matrix && ht("/Matrix [" + t.matrix.toString() + "]"), ht("/Function " + n + " 0 R"), ht("/Extend [true true]"), ht(">>"), ht("endobj")
				},
				St = function(t) {
					var e = ut();
					ht("<<"), Pt(), ht(">>"), ht("endobj"), t.objectNumber = ut(), ht("<< /Type /Pattern"), ht("/PatternType 1"), ht("/PaintType 1"), ht("/TilingType 1"), ht("/BBox [" + t.boundingBox.map(st).join(" ") + "]"), ht("/XStep " + st(t.xStep)), ht("/YStep " + st(t.yStep)), ht("/Length " + t.stream.length), ht("/Resources " + e + " 0 R"), t.matrix && ht("/Matrix [" + t.matrix.toString() + "]"), ht(">>"), pt(t.stream), ht("endobj")
				},
				kt = function() {
					var t;
					for (t in N) N.hasOwnProperty(t) && (N[t] instanceof rt.ShadingPattern ? xt(N[t]) : N[t] instanceof rt.TilingPattern && St(N[t]))
				},
				It = function(t) {
					t.objectNumber = ut(), ht("<<");
					for (var e in t) switch (e) {
						case "opacity":
							ht("/ca " + ot(t[e]));
							break;
						case "stroke-opacity":
							ht("/CA " + ot(t[e]))
					}
					ht(">>"), ht("endobj")
				},
				Ct = function() {
					var t;
					for (t in z) z.hasOwnProperty(t) && It(z[t])
				},
				At = function() {
					for (var t in $) $.hasOwnProperty(t) && $[t].objectNumber >= 0 && ht("/" + t + " " + $[t].objectNumber + " 0 R");
					it.publish("putXobjectDict")
				},
				_t = function() {
					for (var t in N) N.hasOwnProperty(t) && N[t] instanceof rt.ShadingPattern && N[t].objectNumber >= 0 && ht("/" + t + " " + N[t].objectNumber + " 0 R");
					it.publish("putShadingPatternDict")
				},
				qt = function() {
					for (var t in N) N.hasOwnProperty(t) && N[t] instanceof rt.TilingPattern && N[t].objectNumber >= 0 && ht("/" + t + " " + N[t].objectNumber + " 0 R");
					it.publish("putTilingPatternDict")
				},
				Tt = function() {
					var t;
					for (t in z) z.hasOwnProperty(t) && z[t].objectNumber >= 0 && ht("/" + t + " " + z[t].objectNumber + " 0 R");
					it.publish("putGStateDict")
				},
				Pt = function() {
					ht("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), ht("/Font <<");
					for (var t in D) D.hasOwnProperty(t) && ht("/" + t + " " + D[t].objectNumber + " 0 R");
					ht(">>"), ht("/Shading <<"), _t(), ht(">>"), ht("/Pattern <<"), qt(), ht(">>"), ht("/ExtGState <<"), Tt(), ht(">>"), ht("/XObject <<"), At(), ht(">>")
				},
				Et = function() {
					yt(), Ct(), vt(), kt(), it.publish("putResources"), R[2] = Z, ht("2 0 obj"), ht("<<"), Pt(), ht(">>"), ht("endobj"), it.publish("postPutResources")
				},
				Ot = function() {
					it.publish("putAdditionalObjects");
					for (var t = 0; t < J.length; t++) {
						var e = J[t];
						R[e.objId] = Z, ht(e.objId + " 0 obj"), ht(e.content), ht("endobj")
					}
					F += J.length, it.publish("postPutAdditionalObjects")
				},
				Ft = function(t, e, n) {
					j.hasOwnProperty(e) || (j[e] = {}), j[e][n] = t
				},
				Bt = function(t, e, n, r) {
					var i = "F" + (Object.keys(D).length + 1).toString(10),
						o = D[i] = {
							id: i,
							postScriptName: t,
							fontName: e,
							fontStyle: n,
							encoding: r,
							metadata: {}
						};
					return Ft(i, e, n), it.publish("addFont", o), i
				},
				Rt = function() {
					for (var t = "helvetica", e = "times", n = "courier", r = "normal", i = "bold", o = "italic", s = "bolditalic", a = "zapfdingbats", c = [["Helvetica", t, r, "WinAnsiEncoding"], ["Helvetica-Bold", t, i, "WinAnsiEncoding"], ["Helvetica-Oblique", t, o, "WinAnsiEncoding"], ["Helvetica-BoldOblique", t, s, "WinAnsiEncoding"], ["Courier", n, r, "WinAnsiEncoding"], ["Courier-Bold", n, i, "WinAnsiEncoding"], ["Courier-Oblique", n, o, "WinAnsiEncoding"], ["Courier-BoldOblique", n, s, "WinAnsiEncoding"], ["Times-Roman", e, r, "WinAnsiEncoding"], ["Times-Bold", e, i, "WinAnsiEncoding"], ["Times-Italic", e, o, "WinAnsiEncoding"], ["Times-BoldItalic", e, s, "WinAnsiEncoding"], ["ZapfDingbats", a, void 0, "StandardEncoding"]], h = 0, u = c.length; u > h; h++) {
						var l = Bt(c[h][0], c[h][1], c[h][2], c[h][3]),
							f = c[h][0].split("-");
						Ft(l, f[0], f[1] || "")
					}
					it.publish("addFonts", {
						fonts: D,
						dictionary: j
					})
				},
				Dt = function(t, e) {
					return new jt(t.a * e.a + t.b * e.c, t.a * e.b + t.b * e.d, t.c * e.a + t.d * e.c, t.c * e.b + t.d * e.d, t.e * e.a + t.f * e.c + e.e, t.e * e.b + t.f * e.d + e.f)
				},
				jt = function(t, e, n, r, i, o) {
					this.a = t, this.b = e, this.c = n, this.d = r, this.e = i, this.f = o
				};
			jt.prototype = {
				toString: function() {
					return [st(this.a), st(this.b), st(this.c), st(this.d), st(this.e), st(this.f)].join(" ")
				}
			};
			var Mt = new jt(1, 0, 0, 1, 0, 0),
				Nt = function() {
					this.page = W, this.currentPage = m, this.pages = X.slice(0), this.pagedim = V.slice(0), this.pagesContext = G.slice(0), this.x = y, this.y = w, this.matrix = v, this.width = b, this.height = x, this.id = "", this.objectNumber = -1
				};
			Nt.prototype = {
				restore: function() {
					W = this.page, m = this.currentPage, G = this.pagesContext, V = this.pagedim, X = this.pages, y = this.x, w = this.y, v = this.matrix, b = this.width, x = this.height
				}
			};
			var Lt = function(t, e, n, r, i) {
					et.push(new Nt), W = m = 0, X = [], y = t, w = e, v = i, Qt(n, r)
				},
				zt = function(t) {
					if (!tt[t]) {
						var e = new Nt,
							n = "Xo" + (Object.keys($).length + 1).toString(10);
						e.id = n, tt[t] = n, $[n] = e, it.publish("addFormObject", e), et.pop().restore()
					}
				},
				Ut = function(t, e) {
					if (!L[t]) {
						var n = e instanceof rt.ShadingPattern ? "Sh" : "P",
							r = n + (Object.keys(N).length + 1).toString(10);
						e.id = r, L[t] = r, N[r] = e, it.publish("addPattern", e)
					}
				},
				Ht = function(t, e) {
					if (!t || !U[t]) {
						var n = !1;
						for (var r in z)
							if (z.hasOwnProperty(r) && z[r].equals(e)) {
								n = !0;
								break
							}
						if (n) e = z[r];
						else {
							var i = "GS" + (Object.keys(z).length + 1).toString(10);
							z[i] = e, e.id = i
						}
						return t && (U[t] = e.id), it.publish("addGState", e), e
					}
				},
				Wt = function(t) {
					return t.foo = function() {
						try {
							return t.apply(this, arguments)
						} catch (n) {
							var r = n.stack || "";
							~r.indexOf(" at ") && (r = r.split(" at ")[1]);
							var i = "Error in function " + r.split("\n")[0].split("<")[0] + ": " + n.message;
							if (!e.console) throw new Error(i);
							e.console.error(i, n), e.alert && alert(i)
						}
					}, t.foo.bar = t, t.foo
				},
				Xt = function(t, e) {
					var n, r, i, o, s, a, c, h, u;
					if (e = e || {}, i = e.sourceEncoding || "Unicode", s = e.outputEncoding, (e.autoencode || s) && D[d].metadata && D[d].metadata[i] && D[d].metadata[i].encoding && (o = D[d].metadata[i].encoding, !s && D[d].encoding && (s = D[d].encoding), !s && o.codePages && (s = o.codePages[0]), "string" == typeof s && (s = o[s]), s)) {
						for (c = !1, a = [], n = 0, r = t.length; r > n; n++) h = s[t.charCodeAt(n)], h ? a.push(String.fromCharCode(h)) : a.push(t[n]), a[n].charCodeAt(0) >> 8 && (c = !0);
						t = a.join("")
					}
					for (n = t.length; void 0 === c && 0 !== n;) t.charCodeAt(n - 1) >> 8 && (c = !0), n--;
					if (!c) return t;
					for (a = e.noBOM ? [] : [254, 255], n = 0, r = t.length; r > n; n++) {
						if (h = t.charCodeAt(n), u = h >> 8, u >> 8) throw new Error("Character at position " + n + " of string '" + t + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
						a.push(u), a.push(h - (u << 8))
					}
					return String.fromCharCode.apply(void 0, a)
				},
				Gt = function(t, e) {
					return Xt(t, e).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
				},
				Vt = function() {
					ht("/Producer (jsPDF " + i.version + ")");
					for (var t in nt) nt.hasOwnProperty(t) && nt[t] && ht("/" + t.substr(0, 1).toUpperCase() + t.substr(1) + " (" + Gt(nt[t]) + ")");
					var e = new Date,
						n = e.getTimezoneOffset(),
						r = 0 > n ? "+" : "-",
						o = Math.floor(Math.abs(n / 60)),
						s = Math.abs(n % 60),
						a = [r, at(o), "'", at(s), "'"].join("");
					ht(["/CreationDate (D:", e.getFullYear(), at(e.getMonth() + 1), at(e.getDate()), at(e.getHours()), at(e.getMinutes()), at(e.getSeconds()), a, ")"].join(""))
				},
				Yt = function() {
					switch (ht("/Type /Catalog"), ht("/Pages 1 0 R"), k || (k = "fullwidth"), k) {
						case "fullwidth":
							ht("/OpenAction [3 0 R /FitH null]");
							break;
						case "fullheight":
							ht("/OpenAction [3 0 R /FitV null]");
							break;
						case "fullpage":
							ht("/OpenAction [3 0 R /Fit]");
							break;
						case "original":
							ht("/OpenAction [3 0 R /XYZ null null 1]");
							break;
						default:
							var t = "" + k;
							"%" === t.substr(t.length - 1) && (k = parseInt(k) / 100), "number" == typeof k && ht("/OpenAction [3 0 R /XYZ null null " + ot(k) + "]")
					}
					switch (I || (I = "continuous"), I) {
						case "continuous":
							ht("/PageLayout /OneColumn");
							break;
						case "single":
							ht("/PageLayout /SinglePage");
							break;
						case "two":
						case "twoleft":
							ht("/PageLayout /TwoColumnLeft");
							break;
						case "tworight":
							ht("/PageLayout /TwoColumnRight")
					}
					S && ht("/PageMode /" + S), it.publish("putCatalog")
				},
				Jt = function() {
					ht("/Size " + (F + 1)), ht("/Root " + F + " 0 R"), ht("/Info " + (F - 1) + " 0 R")
				},
				Qt = function(t, e) {
					B = !0, X[++W] = [], V[W] = {
						width: Number(t) || b,
						height: Number(e) || x
					}, G[W] = {}, $t(W)
				},
				Kt = function(t, e) {
					var n = "string" == typeof e && e.toLowerCase();
					if ("string" == typeof t) {
						var r = t.toLowerCase();
						a.hasOwnProperty(r) && (t = a[r][0] / p, e = a[r][1] / p)
					}
					if (Array.isArray(t) && (e = t[1], t = t[0]), n) {
						switch (n.substr(0, 1)) {
							case "l":
								e > t && (n = "s");
								break;
							case "p":
								t > e && (n = "s")
						}
						"s" === n && (g = t, t = e, e = g)
					}
					Qt(t, e), ht(ot(O) + " w"), ht(_), 0 !== Q && ht(Q + " J"), 0 !== K && ht(K + " j"), it.publish("addPage", {
						pageNumber: W
					})
				},
				Zt = function(t) {
					t > 0 && W >= t && (X.splice(t, 1), V.splice(t, 1), W--, m > W && (m = W), this.setPage(m))
				},
				$t = function(t) {
					t > 0 && W >= t && (m = t, b = V[t].width, x = V[t].height)
				},
				te = function(t, e) {
					var n;
					t = void 0 !== t ? t : D[d].fontName, e = void 0 !== e ? e : D[d].fontStyle;
					var r = t;
					switch (void 0 !== t && (t = t.toLowerCase()), t) {
						case "sans-serif":
						case "verdana":
						case "arial":
						case "helvetica":
							t = "helvetica";
							break;
						case "fixed":
						case "monospace":
						case "terminal":
						case "courier":
							t = "courier";
							break;
						case "serif":
						case "cursive":
						case "fantasy":
							t = "times";
							break;
						default:
							t = r
					}
					try {
						n = j[t][e]
					} catch (i) {}
					return n || (n = j.times[e], null == n && (n = j.times.normal)), n
				},
				ee = function() {
					B = !1, F = 2, Y = [], R = [], J = [], ht("%PDF-" + s), gt(), Ot(), Et(), ut(), ht("<<"), Vt(), ht(">>"), ht("endobj"), ut(), ht("<<"), Yt(), ht(">>"), ht("endobj");
					var t, e = Z,
						n = "0000000000";
					for (ht("xref"), ht("0 " + (F + 1)), ht(n + " 65535 f "), t = 1; F >= t; t++) {
						var r = R[t];
						ht("function" == typeof r ? (n + R[t]()).slice(-10) + " 00000 n " : (n + R[t]).slice(-10) + " 00000 n ")
					}
					return ht("trailer"), ht("<<"), Jt(), ht(">>"), ht("startxref"), ht(e), ht("%%EOF"), B = !0, Y.join("\n")
				},
				ne = function(t) {
					var e = "n";
					return "D" === t ? e = "S" : "F" === t ? e = "f" : "FD" === t || "DF" === t ? e = "B" : "f" !== t && "f*" !== t && "B" !== t && "B*" !== t || (e = t), e
				},
				re = function(t, e, n) {
					if (t = ne(t), !e) return void ht(t);
					n || (n = Mt);
					var r = L[e],
						i = N[r];
					if (i instanceof rt.ShadingPattern) ht("q"), ht("W " + t), i.gState && rt.setGState(i.gState), ht(n.toString() + " cm"), ht("/" + r + " sh"), ht("Q");
					else if (i instanceof rt.TilingPattern) {
						var o = new jt(1, 0, 0, -1, 0, x);
						n.matrix && (o = Dt(n.matrix || Mt, o), r = i.createClone(e, n.boundingBox, n.xStep, n.yStep, o).id), ht("q"), ht("/Pattern cs"), ht("/" + r + " scn"), i.gState && rt.setGState(i.gState), ht(t), ht("Q")
					}
				},
				ie = function() {
					for (var t = ee(), e = t.length, n = new ArrayBuffer(e), r = new Uint8Array(n); e--;) r[e] = t.charCodeAt(e);
					return n
				},
				oe = function() {
					return new Blob([ie()], {
						type: "application/pdf"
					})
				},
				se = Wt(function(t, n) {
					var i = "dataur" === ("" + t).substr(0, 6) ? "data:application/pdf;base64," + btoa(ee()) : 0;
					switch (t) {
						case void 0:
							return ee();
						case "save":
							if (navigator.getUserMedia && (void 0 === e.URL || void 0 === e.URL.createObjectURL)) return rt.output("dataurlnewwindow");
							r(oe(), n), "function" == typeof r.unload && e.setTimeout && setTimeout(r.unload, 911);
							break;
						case "arraybuffer":
							return ie();
						case "blob":
							return oe();
						case "bloburi":
						case "bloburl":
							return e.URL && e.URL.createObjectURL(oe()) || void 0;
						case "datauristring":
						case "dataurlstring":
							return i;
						case "dataurlnewwindow":
							var o = e.open(i);
							if (o || "undefined" == typeof safari) return o;
						case "datauri":
						case "dataurl":
							return e.document.location.href = i;
						default:
							throw new Error('Output type "' + t + '" is not supported.')
					}
				});
			switch (h) {
				case "pt":
					p = 1;
					break;
				case "mm":
					p = 72 / 25.4000508;
					break;
				case "cm":
					p = 72 / 2.54000508;
					break;
				case "in":
					p = 72;
					break;
				case "px":
					p = 96 / 72;
					break;
				case "pc":
					p = 12;
					break;
				case "em":
					p = 12;
					break;
				case "ex":
					p = 6;
					break;
				default:
					throw "Invalid unit: " + h
			}
			q /= p, rt.internal = {
				pdfEscape: Gt,
				getStyle: ne,
				getFont: function() {
					return D[te.apply(rt, arguments)]
				},
				getFontSize: function() {
					return q
				},
				getCharSpace: function() {
					return T
				},
				getLineHeight: function() {
					return q * E
				},
				write: function(t) {
					ht(1 === arguments.length ? t : Array.prototype.join.call(arguments, " "))
				},
				getCoordinateString: function(t) {
					return ot(t)
				},
				getVerticalCoordinateString: function(t) {
					return ot(t)
				},
				collections: {},
				newObject: ut,
				newAdditionalObject: lt,
				newObjectDeferred: ft,
				newObjectDeferredBegin: dt,
				putStream: pt,
				events: it,
				scaleFactor: p,
				pageSize: {
					get width() {
						return b
					},
					get height() {
						return x
					}
				},
				output: function(t, e) {
					return se(t, e)
				},
				getNumberOfPages: function() {
					return X.length - 1
				},
				pages: X,
				out: ht,
				f2: ot,
				getPageInfo: function(t) {
					var e = 2 * (t - 1) + 3;
					return {
						objId: e,
						pageNumber: t,
						pageContext: G[t]
					}
				},
				getCurrentPageInfo: function() {
					var t = 2 * (m - 1) + 3;
					return {
						objId: t,
						pageNumber: m,
						pageContext: G[m]
					}
				},
				getPDFVersion: function() {
					return s
				}
			}, rt.comment = function(t) {
				return ht("#" + t), this
			}, rt.GState = function(t) {
				var e = "opacity,stroke-opacity".split(",");
				for (var n in t) t.hasOwnProperty(n) && e.indexOf(n) >= 0 && (this[n] = t[n]);
				this.id = "", this.objectNumber = -1
			}, rt.GState.prototype.equals = function(e) {
				var n = "id,objectNumber,equals";
				if (!e || ("undefined" == typeof e ? "undefined" : t["typeof"](e)) !== t["typeof"](this)) return !1;
				var r = 0;
				for (var i in this)
					if (!(n.indexOf(i) >= 0)) {
						if (this.hasOwnProperty(i) && !e.hasOwnProperty(i)) return !1;
						if (this[i] !== e[i]) return !1;
						r++
					}
				for (var i in e) e.hasOwnProperty(i) && n.indexOf(i) < 0 && r--;
				return 0 === r
			}, rt.addGState = function(t, e) {
				return Ht(t, e), this
			}, rt.addPage = function() {
				return Kt.apply(this, arguments), this
			}, rt.setPage = function() {
				return $t.apply(this, arguments), this
			}, rt.insertPage = function(t) {
				return this.addPage(), this.movePage(m, t), this
			}, rt.movePage = function(t, e) {
				var n, r, i, o;
				if (t > e) {
					for (i = X[t], r = V[t], n = G[t], o = t; o > e; o--) X[o] = X[o - 1], V[o] = V[o - 1], G[o] = G[o - 1];
					X[e] = i, V[e] = r, G[e] = n, this.setPage(e)
				} else if (e > t) {
					for (i = X[t], r = V[t], n = G[t], o = t; e > o; o++) X[o] = X[o + 1], V[o] = V[o + 1], G[o] = G[o + 1];
					X[e] = i, V[e] = r, G[e] = n, this.setPage(e)
				}
				return this
			}, rt.deletePage = function() {
				return Zt.apply(this, arguments), this
			}, rt.setDisplayMode = function(t, e, n) {
				return k = t, I = e, S = n, this
			}, rt.saveGraphicsState = function() {
				return ht("q"), M.push({
					key: d,
					size: q
				}), this
			}, rt.restoreGraphicsState = function() {
				ht("Q");
				var t = M.pop();
				return d = t.key, q = t.size, H = null, this
			}, rt.setCurrentTransformationMatrix = function(t) {
				return ht(t.toString() + " cm"), this
			}, rt.beginFormObject = function(t, e, n, r, i) {
				return Lt(t, e, n, r, i), this
			}, rt.endFormObject = function(t) {
				return zt(t), this
			}, rt.doFormObject = function(t, e) {
				var n = $[tt[t]];
				return ht("q"), ht(e.toString() + " cm"), ht("/" + n.id + " Do"), ht("Q"), this
			}, rt.getFormObject = function(t) {
				var e = $[tt[t]];
				return {
					x: e.x,
					y: e.y,
					width: e.width,
					height: e.height,
					matrix: e.matrix
				}
			}, rt.Matrix = jt, rt.matrixMult = Dt, rt.unitMatrix = Mt;
			var ae = function(t, e) {
				this.gState = t, this.matrix = e, this.id = "", this.objectNumber = -1
			};
			rt.ShadingPattern = function(t, e, n, r, i) {
				this.type = "axial" === t ? 2 : 3, this.coords = e, this.colors = n, ae.call(this, r, i)
			}, rt.TilingPattern = function(t, e, n, r, i) {
				this.boundingBox = t, this.xStep = e, this.yStep = n, this.stream = "", this.cloneIndex = 0, ae.call(this, r, i)
			}, rt.TilingPattern.prototype = {
				createClone: function(t, e, n, r, i) {
					var o = new rt.TilingPattern(e || this.boundingBox, n || this.xStep, r || this.yStep, this.gState, i || this.matrix);
					o.stream = this.stream;
					var s = t + "$$" + this.cloneIndex++ + "$$";
					return Ut(s, o), o
				}
			}, rt.addShadingPattern = function(t, e) {
				return Ut(t, e), this
			}, rt.beginTilingPattern = function(t) {
				Lt(t.boundingBox[0], t.boundingBox[1], t.boundingBox[2] - t.boundingBox[0], t.boundingBox[3] - t.boundingBox[1], t.matrix)
			}, rt.endTilingPattern = function(t, e) {
				e.stream = X[m].join("\n"), Ut(t, e), it.publish("endTilingPattern", e), et.pop().restore()
			}, rt.text = function(t, e, n, r, i, o) {
				function s(t) {
					return t = t.split("	").join(Array(f.TabLen || 9).join(" ")), Gt(t, r)
				}
				if ("number" == typeof t) {
					var a = n;
					n = e, e = t, t = a
				}
				"string" == typeof t && (t = t.match(/[\n\r]/) ? t.split(/\r\n|\r|\n/g) : [t]), "string" == typeof i && (o = i, i = null), "string" == typeof r && (o = r, r = null), "number" == typeof r && (i = r, r = null);
				var c;
				if (i && "number" == typeof i) {
					i *= Math.PI / 180;
					var h = Math.cos(i),
						u = Math.sin(i);
					i = new jt(h, u, -u, h, 0, 0)
				} else i || (i = Mt);
				r = r || {}, "noBOM" in r || (r.noBOM = !0), "autoencode" in r || (r.autoencode = !0);
				var l = "",
					g = this.internal.getCurrentPageInfo().pageContext;
				if (!0 === r.stroke ? g.lastTextWasStroke !== !0 && (l = "1 Tr\n", g.lastTextWasStroke = !0) : (g.lastTextWasStroke && (l = "0 Tr\n"), g.lastTextWasStroke = !1), "undefined" == typeof this._runningPageHeight && (this._runningPageHeight = 0), "string" == typeof t) t = s(t);
				else {
					if ("[object Array]" !== Object.prototype.toString.call(t)) throw new Error('Type of text must be string or Array. "' + t + '" is not recognized.');
					for (var m = t.concat(), y = [], w = m.length, v = D[d], b = "MacRomanEncoding" === v.encoding; w--;) y.push(b ? m.shift() : s(m.shift()));
					var x = Math.ceil((n - this._runningPageHeight) / (q * E));
					if (x >= 0 && x < y.length + 1, o) {
						var S, k, I, C = q * E,
							A = d.slice(1) < 14 ? {} : {
								font: v.metadata,
								fontSize: q,
								charSpace: T
							},
							_ = t.map(function(t) {
								return this.getStringUnitWidth(t, A) * q / p
							}, this);
						if (I = Math.max.apply(Math, _), "center" === o) S = e - I / 2, e -= _[0] / 2;
						else {
							if ("right" !== o) throw new Error('Unrecognized alignment option, use "center" or "right".');
							S = e - I, e -= _[0]
						}
						k = e, t = b ? v.metadata.encode(v.metadata.subset, y[0], P) : y[0];
						for (var O = 1, w = y.length; w > O; O++) {
							var F = I - _[O];
							"center" === o && (F /= 2), t += b ? "> Tj\n" + (S - k + F) + " -" + C + " Td <" + y[O] : ") Tj\n" + (S - k + F) + " -" + C + " Td (" + y[O], k = S + F
						}
					} else t = b ? y.map(function(t) {
						return v.metadata.encode(v.metadata.subset, t, P)
					}).join("> Tj\nT* <") : y.join(") Tj\nT* (");
					t = b ? "<" + t + ">" : "(" + t + ")"
				}
				var B;
				c || (B = n);
				var R = new jt(1, 0, 0, -1, e, B);
				i = Dt(R, i);
				var j = i.toString() + " Tm";
				return ht("BT\n" + q * E + " TL\n" + l + j + "\n" + t + " Tj\nET"), c && this.text(c, e, n), this
			}, rt.lstext = function(t, e, n, r) {
				console.warn("jsPDF.lstext is deprecated");
				for (var i = 0, o = t.length; o > i; i++, e += r) this.text(t[i], e, n)
			}, rt.line = function(t, e, n, r) {
				return this.lines([[n - t, r - e]], t, e, [1, 1], "D")
			}, rt.clip = function() {
				ht("W"), ht("S")
			}, rt.lines = function(t, e, n, r, i, o, s, a) {
				var c, h, u, l, f, d, p, g, m, y, w;
				if ("number" == typeof t) {
					var v = n;
					n = e, e = t, t = v
				}
				for (r = r || [1, 1], ht(st(e) + " " + st(n) + " m "), c = r[0], h = r[1], l = t.length, y = e, w = n, u = 0; l > u; u++) f = t[u], 2 === f.length ? (y = f[0] * c + y, w = f[1] * h + w, ht(st(y) + " " + st(w) + " l")) : (d = f[0] * c + y, p = f[1] * h + w, g = f[2] * c + y, m = f[3] * h + w, y = f[4] * c + y, w = f[5] * h + w, ht(st(d) + " " + st(p) + " " + st(g) + " " + st(m) + " " + st(y) + " " + st(w) + " c"));
				return o && ht("h"), re(i, s, a), this
			}, rt.path = function(t, e, n, r) {
				for (var i = 0; i < t.length; i++) {
					var o = t[i],
						s = o.c;
					switch (o.op) {
						case "m":
							ht(st(s[0]) + " " + st(s[1]) + " m");
							break;
						case "l":
							ht(st(s[0]) + " " + st(s[1]) + " l");
							break;
						case "c":
							ht([st(s[0]), st(s[1]), st(s[2]), st(s[3]), st(s[4]), st(s[5]), "c"].join(" "));
							break;
						case "h":
							ht("h")
					}
				}
				return re(e, n, r), this
			}, rt.rect = function(t, e, n, r, i, o, s) {
				return ht([ot(t), ot(e), ot(n), ot(-r), "re"].join(" ")), re(i, o, s), this
			}, rt.triangle = function(t, e, n, r, i, o, s, a, c) {
				return this.lines([[n - t, r - e], [i - n, o - r], [t - i, e - o]], t, e, [1, 1], s, !0, a, c), this
			}, rt.roundedRect = function(t, e, n, r, i, o, s, a, c) {
				var h = 4 / 3 * (Math.SQRT2 - 1);
				return i = Math.min(i, .5 * n), o = Math.min(o, .5 * r), this.lines([[n - 2 * i, 0], [i * h, 0, i, o - o * h, i, o], [0, r - 2 * o], [0, o * h, -(i * h), o, -i, o], [-n + 2 * i, 0], [-(i * h), 0, -i, -(o * h), -i, -o], [0, -r + 2 * o], [0, -(o * h), i * h, -o, i, -o]], t + i, e, [1, 1], s, !0, a, c), this
			}, rt.ellipse = function(t, e, n, r, i, o, s) {
				var a = 4 / 3 * (Math.SQRT2 - 1) * n,
					c = 4 / 3 * (Math.SQRT2 - 1) * r;
				return ht([ot(t + n), ot(e), "m", ot(t + n), ot(e - c), ot(t + a), ot(e - r), ot(t), ot(e - r), "c"].join(" ")), ht([ot(t - a), ot(e - r), ot(t - n), ot(e - c), ot(t - n), ot(e), "c"].join(" ")), ht([ot(t - n), ot(e + c), ot(t - a), ot(e + r), ot(t), ot(e + r), "c"].join(" ")), ht([ot(t + a), ot(e + r), ot(t + n), ot(e + c), ot(t + n), ot(e), "c"].join(" ")), re(i, o, s), this
			}, rt.circle = function(t, e, n, r, i, o) {
				return this.ellipse(t, e, n, n, r, i, o)
			}, rt.setProperties = function(t) {
				for (var e in nt) nt.hasOwnProperty(e) && t[e] && (nt[e] = t[e]);
				return this
			}, rt.setFontSize = function(t) {
				return q = t / p, ht("/" + d + " " + q + " Tf"), this
			}, rt.getFontSize = function() {
				return q
			}, rt.setFont = function(t, e) {
				return d = te(t, e), ht("/" + d + " " + q + " Tf"), this
			}, rt.setFontStyle = rt.setFontType = function(t) {
				return d = te(void 0, t), this
			}, rt.getFontList = function() {
				var t, e, n, r = {};
				for (t in j)
					if (j.hasOwnProperty(t)) {
						r[t] = n = [];
						for (e in j[t]) j[t].hasOwnProperty(e) && n.push(e)
					}
				return r
			}, rt.addFont = function(t, e, n) {
				Bt(t, e, n, "StandardEncoding")
			}, rt.setLineWidth = function(t) {
				return ht(t.toFixed(2) + " w"), this
			}, rt.setDrawColor = function(t, e, n, r) {
				var i;
				return i = void 0 === e || void 0 === r && t === e === n ? "string" == typeof t ? t + " G" : ot(t / 255) + " G" : void 0 === r ? "string" == typeof t ? [t, e, n, "RG"].join(" ") : [ot(t / 255), ot(e / 255), ot(n / 255), "RG"].join(" ") : "string" == typeof t ? [t, e, n, r, "K"].join(" ") : [ot(t), ot(e), ot(n), ot(r), "K"].join(" "), ht(i), this
			}, rt.setFillColor = function(e, n, r, i) {
				var o;
				return void 0 === n || void 0 === i && e === n === r ? o = "string" == typeof e ? e + " g" : ot(e / 255) + " g" : void 0 === i || "object" === ("undefined" == typeof i ? "undefined" : t["typeof"](i)) ? (o = "string" == typeof e ? [e, n, r, "rg"].join(" ") : [ot(e / 255), ot(n / 255), ot(r / 255), "rg"].join(" "), i && 0 === i.a && (o = ["255", "255", "255", "rg"].join(" "))) : o = "string" == typeof e ? [e, n, r, i, "k"].join(" ") : [ot(e), ot(n), ot(r), ot(i), "k"].join(" "), ht(o), this
			}, rt.setTextColor = function(t, e, n) {
				if ("string" == typeof t && /^#[0-9A-Fa-f]{6}$/.test(t)) {
					var r = parseInt(t.substr(1), 16);
					t = r >> 16 & 255, e = r >> 8 & 255, n = 255 & r
				}
				return A = 0 === t && 0 === e && 0 === n || "undefined" == typeof e ? st(t / 255) + " g" : [st(t / 255), st(e / 255), st(n / 255), "rg"].join(" "), ht(A), this
			}, rt.setCharSpace = function(t) {
				return T = t / p, this
			}, rt.setR2L = function(t) {
				return P = t, this
			}, rt.setGState = function(t) {
				t = "string" == typeof t ? z[U[t]] : Ht(null, t), t.equals(H) || (ht("/" + t.id + " gs"), H = t)
			}, rt.CapJoinStyles = {
				0: 0,
				butt: 0,
				but: 0,
				miter: 0,
				1: 1,
				round: 1,
				rounded: 1,
				circle: 1,
				2: 2,
				projecting: 2,
				project: 2,
				square: 2,
				bevel: 2
			}, rt.setLineCap = function(t) {
				var e = this.CapJoinStyles[t];
				if (void 0 === e) throw new Error("Line cap style of '" + t + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
				return Q = e, ht(e + " J"), this
			}, rt.setLineJoin = function(t) {
				var e = this.CapJoinStyles[t];
				if (void 0 === e) throw new Error("Line join style of '" + t + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
				return K = e, ht(e + " j"), this
			}, rt.setLineMiterLimit = function(t) {
				return ht(ot(t) + " M"), this
			}, rt.setLineDashPattern = function(t, e) {
				return ht(["[" + (void 0 !== t[0] ? t[0] : ""), (void 0 !== t[1] ? t[1] : "") + "]", e, "d"].join(" ")), this
			}, rt.output = se, rt.save = function(t) {
				rt.output("save", t)
			};
			for (var ce in i.API) i.API.hasOwnProperty(ce) && ("events" === ce && i.API.events.length ? ! function(t, e) {
				var n, r, i;
				for (i = e.length - 1; - 1 !== i; i--) n = e[i][0], r = e[i][1], t.subscribe.apply(t, [n].concat("function" == typeof r ? [r] : r))
			}(it, i.API.events) : rt[ce] = i.API[ce]);
			return Rt(), d = "F1", Kt(u, c), it.publish("initialized"), rt
		}
		var s = "1.3",
			a = {
				a0: [2383.94, 3370.39],
				a1: [1683.78, 2383.94],
				a2: [1190.55, 1683.78],
				a3: [841.89, 1190.55],
				a4: [595.28, 841.89],
				a5: [419.53, 595.28],
				a6: [297.64, 419.53],
				a7: [209.76, 297.64],
				a8: [147.4, 209.76],
				a9: [104.88, 147.4],
				a10: [73.7, 104.88],
				b0: [2834.65, 4008.19],
				b1: [2004.09, 2834.65],
				b2: [1417.32, 2004.09],
				b3: [1000.63, 1417.32],
				b4: [708.66, 1000.63],
				b5: [498.9, 708.66],
				b6: [354.33, 498.9],
				b7: [249.45, 354.33],
				b8: [175.75, 249.45],
				b9: [124.72, 175.75],
				b10: [87.87, 124.72],
				c0: [2599.37, 3676.54],
				c1: [1836.85, 2599.37],
				c2: [1298.27, 1836.85],
				c3: [918.43, 1298.27],
				c4: [649.13, 918.43],
				c5: [459.21, 649.13],
				c6: [323.15, 459.21],
				c7: [229.61, 323.15],
				c8: [161.57, 229.61],
				c9: [113.39, 161.57],
				c10: [79.37, 113.39],
				dl: [311.81, 623.62],
				letter: [612, 792],
				"government-letter": [576, 756],
				legal: [612, 1008],
				"junior-legal": [576, 360],
				ledger: [1224, 792],
				tabloid: [792, 1224],
				"credit-card": [153, 243]
			};
		return i.API = {
			events: []
		}, i.version = "1.3.1 2018-01-12T13:43:24.489Z:lukas-pc\lukas", "function" == typeof define && define.amd ? define("jsPDF", function() {
			return i
		}) : "undefined" != typeof module && module.exports ? module.exports = i : e.jsPDF = i, i
	}("undefined" != typeof self && self || "undefined" != typeof window && window || this);
	/**
	 * jsPDF AcroForm Plugin
	 * Copyright (c) 2016 Alexander Weidt, https://github.com/BiggA94
	 *
	 * Licensed under the MIT License.
	 * http://opensource.org/licenses/mit-license
	 */
	(window.AcroForm = function(t) {
		var n = window.AcroForm;
		n.scale = function(t) {
			return t * (r.internal.scaleFactor / 1)
		}, n.antiScale = function(t) {
			return 1 / r.internal.scaleFactor * t
		};
		var r = {
			fields: [],
			xForms: [],
			acroFormDictionaryRoot: null,
			printedOut: !1,
			internal: null
		};
		e.API.acroformPlugin = r;
		var i = function() {
				for (var t in this.acroformPlugin.acroFormDictionaryRoot.Fields) {
					var e = this.acroformPlugin.acroFormDictionaryRoot.Fields[t];
					e.hasAnnotation && s.call(this, e)
				}
			},
			o = function() {
				if (this.acroformPlugin.acroFormDictionaryRoot) throw new Error("Exception while creating AcroformDictionary");
				this.acroformPlugin.acroFormDictionaryRoot = new n.AcroFormDictionary, this.acroformPlugin.internal = this.internal, this.acroformPlugin.acroFormDictionaryRoot._eventID = this.internal.events.subscribe("postPutResources", h), this.internal.events.subscribe("buildDocument", i), this.internal.events.subscribe("putCatalog", c), this.internal.events.subscribe("postPutPages", u)
			},
			s = function(t) {
				var n = {
					type: "reference",
					object: t
				};
				e.API.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(n)
			},
			a = function(t) {
				this.acroformPlugin.printedOut && (this.acroformPlugin.printedOut = !1, this.acroformPlugin.acroFormDictionaryRoot = null), this.acroformPlugin.acroFormDictionaryRoot || o.call(this), this.acroformPlugin.acroFormDictionaryRoot.Fields.push(t)
			},
			c = function() {
				"undefined" != typeof this.acroformPlugin.acroFormDictionaryRoot ? this.internal.write("/AcroForm " + this.acroformPlugin.acroFormDictionaryRoot.objId + " 0 R") : console.log("Root missing...")
			},
			h = function() {
				this.internal.events.unsubscribe(this.acroformPlugin.acroFormDictionaryRoot._eventID), delete this.acroformPlugin.acroFormDictionaryRoot._eventID, this.acroformPlugin.printedOut = !0
			},
			u = function(t) {
				var e = !t;
				t || (this.internal.newObjectDeferredBegin(this.acroformPlugin.acroFormDictionaryRoot.objId), this.internal.out(this.acroformPlugin.acroFormDictionaryRoot.getString()));
				var t = t || this.acroformPlugin.acroFormDictionaryRoot.Kids;
				for (var r in t) {
					var i = t[r],
						o = i.Rect;
					i.Rect && (i.Rect = n.internal.calculateCoordinates.call(this, i.Rect)), this.internal.newObjectDeferredBegin(i.objId);
					var s = "";
					if (s += i.objId + " 0 obj\n", s += "<<\n" + i.getContent(), i.Rect = o, i.hasAppearanceStream && !i.appearanceStreamContent) {
						var a = n.internal.calculateAppearanceStream.call(this, i);
						s += "/AP << /N " + a + " >>\n", this.acroformPlugin.xForms.push(a)
					}
					if (i.appearanceStreamContent) {
						s += "/AP << ";
						for (var c in i.appearanceStreamContent) {
							var h = i.appearanceStreamContent[c];
							if (s += "/" + c + " ", s += "<< ", Object.keys(h).length >= 1 || Array.isArray(h))
								for (var r in h) {
									var u = h[r];
									"function" == typeof u && (u = u.call(this, i)), s += "/" + r + " " + u + " ", this.acroformPlugin.xForms.indexOf(u) >= 0 || this.acroformPlugin.xForms.push(u)
								} else {
									var u = h;
									"function" == typeof u && (u = u.call(this, i)), s += "/" + r + " " + u + " \n", this.acroformPlugin.xForms.indexOf(u) >= 0 || this.acroformPlugin.xForms.push(u)
								}
							s += " >>\n"
						}
						s += ">>\n"
					}
					s += ">>\nendobj\n", this.internal.out(s)
				}
				e && l.call(this, this.acroformPlugin.xForms)
			},
			l = function(t) {
				for (var e in t) {
					var n = e,
						r = t[e];
					this.internal.newObjectDeferredBegin(r && r.objId);
					var i = "";
					i += r ? r.getString() : "", this.internal.out(i), delete t[n]
				}
			};
		t.addField = function(t) {
			return t instanceof n.TextField ? d.call(this, t) : t instanceof n.ChoiceField ? p.call(this, t) : t instanceof n.Button ? f.call(this, t) : t instanceof n.ChildClass ? a.call(this, t) : t && a.call(this, t), this
		};
		var f = function(t) {
				var t = t || new n.Field;
				t.FT = "/Btn";
				var e = t.Ff || 0;
				t.pushbutton && (e = n.internal.setBitPosition(e, 17), delete t.pushbutton), t.radio && (e = n.internal.setBitPosition(e, 16), delete t.radio), t.noToggleToOff && (e = n.internal.setBitPosition(e, 15)), t.Ff = e, a.call(this, t)
			},
			d = function(t) {
				var t = t || new n.Field;
				t.FT = "/Tx";
				var e = t.Ff || 0;
				t.multiline && (e = 4096 | e), t.password && (e = 8192 | e), t.fileSelect && (e |= 1 << 20), t.doNotSpellCheck && (e |= 1 << 22), t.doNotScroll && (e |= 1 << 23), t.Ff = t.Ff || e, a.call(this, t)
			},
			p = function(t) {
				var e = t || new n.Field;
				e.FT = "/Ch";
				var r = e.Ff || 0;
				e.combo && (r = n.internal.setBitPosition(r, 18), delete e.combo), e.edit && (r = n.internal.setBitPosition(r, 19), delete e.edit), e.sort && (r = n.internal.setBitPosition(r, 20), delete e.sort), e.multiSelect && this.internal.getPDFVersion() >= 1.4 && (r = n.internal.setBitPosition(r, 22), delete e.multiSelect), e.doNotSpellCheck && this.internal.getPDFVersion() >= 1.4 && (r = n.internal.setBitPosition(r, 23), delete e.doNotSpellCheck), e.Ff = r, a.call(this, e)
			}
	})(e.API);
	var n = window.AcroForm;
	n.internal = {}, n.createFormXObject = function(t) {
			var e = new n.FormXObject,
				r = n.Appearance.internal.getHeight(t) || 0,
				i = n.Appearance.internal.getWidth(t) || 0;
			return e.BBox = [0, 0, i, r], e
		}, n.Appearance = {
			CheckBox: {
				createAppearanceStream: function() {
					var t = {
						N: {
							On: n.Appearance.CheckBox.YesNormal
						},
						D: {
							On: n.Appearance.CheckBox.YesPushDown,
							Off: n.Appearance.CheckBox.OffPushDown
						}
					};
					return t
				},
				createMK: function() {
					return "<< /CA (3)>>"
				},
				YesPushDown: function(t) {
					var e = n.createFormXObject(t),
						r = "";
					t.Q = 1;
					var i = n.internal.calculateX(t, "3", "ZapfDingbats", 50);
					return r += "0.749023 g\n             0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n             f\n             BMC\n             q\n             0 0 1 rg\n             /F13 " + i.fontSize + " Tf 0 g\n             BT\n", r += i.text, r += "ET\n             Q\n             EMC\n", e.stream = r, e
				},
				YesNormal: function(t) {
					var e = n.createFormXObject(t),
						r = "";
					t.Q = 1;
					var i = n.internal.calculateX(t, "3", "ZapfDingbats", .9 * n.Appearance.internal.getHeight(t));
					return r += "1 g\n0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\nf\nq\n0 0 1 rg\n0 0 " + (n.Appearance.internal.getWidth(t) - 1) + " " + (n.Appearance.internal.getHeight(t) - 1) + " re\nW\nn\n0 g\nBT\n/F13 " + i.fontSize + " Tf 0 g\n", r += i.text, r += "ET\n             Q\n", e.stream = r, e
				},
				OffPushDown: function(t) {
					var e = n.createFormXObject(t),
						r = "";
					return r += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n", e.stream = r, e
				}
			},
			RadioButton: {
				Circle: {
					createAppearanceStream: function(t) {
						var e = {
							D: {
								Off: n.Appearance.RadioButton.Circle.OffPushDown
							},
							N: {}
						};
						return e.N[t] = n.Appearance.RadioButton.Circle.YesNormal, e.D[t] = n.Appearance.RadioButton.Circle.YesPushDown, e
					},
					createMK: function() {
						return "<< /CA (l)>>"
					},
					YesNormal: function(t) {
						var e = n.createFormXObject(t),
							r = "",
							i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
						i *= .9;
						var o = n.Appearance.internal.Bezier_C;
						return r += "q\n1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + i + " 0 m\n" + i + " " + i * o + " " + i * o + " " + i + " 0 " + i + " c\n-" + i * o + " " + i + " -" + i + " " + i * o + " -" + i + " 0 c\n-" + i + " -" + i * o + " -" + i * o + " -" + i + " 0 -" + i + " c\n" + i * o + " -" + i + " " + i + " -" + i * o + " " + i + " 0 c\nf\nQ\n", e.stream = r, e
					},
					YesPushDown: function(t) {
						var e = n.createFormXObject(t),
							r = "",
							i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
						i *= .9;
						var o = n.Appearance.internal.Bezier_C;
						return r += "0.749023 g\n            q\n           1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + 2 * i + " 0 m\n" + 2 * i + " " + 2 * i * o + " " + 2 * i * o + " " + 2 * i + " 0 " + 2 * i + " c\n-" + 2 * i * o + " " + 2 * i + " -" + 2 * i + " " + 2 * i * o + " -" + 2 * i + " 0 c\n-" + 2 * i + " -" + 2 * i * o + " -" + 2 * i * o + " -" + 2 * i + " 0 -" + 2 * i + " c\n" + 2 * i * o + " -" + 2 * i + " " + 2 * i + " -" + 2 * i * o + " " + 2 * i + " 0 c\n            f\n            Q\n            0 g\n            q\n            1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + i + " 0 m\n" + i + " " + i * o + " " + i * o + " " + i + " 0 " + i + " c\n-" + i * o + " " + i + " -" + i + " " + i * o + " -" + i + " 0 c\n-" + i + " -" + i * o + " -" + i * o + " -" + i + " 0 -" + i + " c\n" + i * o + " -" + i + " " + i + " -" + i * o + " " + i + " 0 c\n            f\n            Q\n", e.stream = r, e
					},
					OffPushDown: function(t) {
						var e = n.createFormXObject(t),
							r = "",
							i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
						i *= .9;
						var o = n.Appearance.internal.Bezier_C;
						return r += "0.749023 g\n            q\n 1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + 2 * i + " 0 m\n" + 2 * i + " " + 2 * i * o + " " + 2 * i * o + " " + 2 * i + " 0 " + 2 * i + " c\n-" + 2 * i * o + " " + 2 * i + " -" + 2 * i + " " + 2 * i * o + " -" + 2 * i + " 0 c\n-" + 2 * i + " -" + 2 * i * o + " -" + 2 * i * o + " -" + 2 * i + " 0 -" + 2 * i + " c\n" + 2 * i * o + " -" + 2 * i + " " + 2 * i + " -" + 2 * i * o + " " + 2 * i + " 0 c\n            f\n            Q\n", e.stream = r, e
					}
				},
				Cross: {
					createAppearanceStream: function(t) {
						var e = {
							D: {
								Off: n.Appearance.RadioButton.Cross.OffPushDown
							},
							N: {}
						};
						return e.N[t] = n.Appearance.RadioButton.Cross.YesNormal, e.D[t] = n.Appearance.RadioButton.Cross.YesPushDown, e
					},
					createMK: function() {
						return "<< /CA (8)>>"
					},
					YesNormal: function(t) {
						var e = n.createFormXObject(t),
							r = "",
							i = n.Appearance.internal.calculateCross(t);
						return r += "q\n            1 1 " + (n.Appearance.internal.getWidth(t) - 2) + " " + (n.Appearance.internal.getHeight(t) - 2) + " re\n            W\n            n\n            " + i.x1.x + " " + i.x1.y + " m\n            " + i.x2.x + " " + i.x2.y + " l\n            " + i.x4.x + " " + i.x4.y + " m\n            " + i.x3.x + " " + i.x3.y + " l\n            s\n            Q\n", e.stream = r, e
					},
					YesPushDown: function(t) {
						var e = n.createFormXObject(t),
							r = n.Appearance.internal.calculateCross(t),
							i = "";
						return i += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n            q\n            1 1 " + (n.Appearance.internal.getWidth(t) - 2) + " " + (n.Appearance.internal.getHeight(t) - 2) + " re\n            W\n            n\n            " + r.x1.x + " " + r.x1.y + " m\n            " + r.x2.x + " " + r.x2.y + " l\n            " + r.x4.x + " " + r.x4.y + " m\n            " + r.x3.x + " " + r.x3.y + " l\n            s\n            Q\n", e.stream = i, e
					},
					OffPushDown: function(t) {
						var e = n.createFormXObject(t),
							r = "";
						return r += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n", e.stream = r, e
					}
				}
			},
			createDefaultAppearanceStream: function(t) {
				var e = "";
				return e += "/Helv 12 Tf 0 g"
			}
		}, n.Appearance.internal = {
			Bezier_C: .551915024494,
			calculateCross: function(t) {
				var e = function(t, e) {
						return t > e ? e : t
					},
					r = n.Appearance.internal.getWidth(t),
					i = n.Appearance.internal.getHeight(t),
					o = e(r, i),
					s = {
						x1: {
							x: (r - o) / 2,
							y: (i - o) / 2 + o
						},
						x2: {
							x: (r - o) / 2 + o,
							y: (i - o) / 2
						},
						x3: {
							x: (r - o) / 2,
							y: (i - o) / 2
						},
						x4: {
							x: (r - o) / 2 + o,
							y: (i - o) / 2 + o
						}
					};
				return s
			}
		}, n.Appearance.internal.getWidth = function(t) {
			return t.Rect[2]
		}, n.Appearance.internal.getHeight = function(t) {
			return t.Rect[3]
		}, n.internal.inherit = function(t, e) {
			Object.create || function(t) {
				var e = function() {};
				return e.prototype = t, new e
			};
			t.prototype = Object.create(e.prototype), t.prototype.constructor = t
		}, n.internal.arrayToPdfArray = function(t) {
			if (Array.isArray(t)) {
				var e = " [";
				for (var n in t) {
					var r = t[n].toString();
					e += r, e += n < t.length - 1 ? " " : ""
				}
				return e += "]"
			}
		}, n.internal.toPdfString = function(t) {
			return t = t || "", 0 !== t.indexOf("(") && (t = "(" + t), ")" != t.substring(t.length - 1) && (t += "("), t
		}, n.PDFObject = function() {
			var t;
			Object.defineProperty(this, "objId", {
				get: function() {
					return t || (this.internal ? t = this.internal.newObjectDeferred() : e.API.acroformPlugin.internal && (t = e.API.acroformPlugin.internal.newObjectDeferred())), t || console.log("Couldn't create Object ID"), t
				},
				configurable: !1
			})
		}, n.PDFObject.prototype.toString = function() {
			return this.objId + " 0 R"
		}, n.PDFObject.prototype.getString = function() {
			var t = this.objId + " 0 obj\n<<",
				e = this.getContent();
			return t += e + ">>\n", this.stream && (t += "stream\n", t += this.stream, t += "endstream\n"), t += "endobj\n"
		}, n.PDFObject.prototype.getContent = function() {
			var t = function(t) {
					var e = "",
						r = Object.keys(t).filter(function(t) {
							return "content" != t && "appearanceStreamContent" != t && "_" != t.substring(0, 1)
						});
					for (var i in r) {
						var o = r[i],
							s = t[o];
						s && (e += Array.isArray(s) ? "/" + o + " " + n.internal.arrayToPdfArray(s) + "\n" : s instanceof n.PDFObject ? "/" + o + " " + s.objId + " 0 R\n" : "/" + o + " " + s + "\n")
					}
					return e
				},
				e = "";
			return e += t(this)
		}, n.FormXObject = function() {
			n.PDFObject.call(this), this.Type = "/XObject", this.Subtype = "/Form", this.FormType = 1, this.BBox, this.Matrix, this.Resources = "2 0 R", this.PieceInfo;
			var t;
			Object.defineProperty(this, "Length", {
				enumerable: !0,
				get: function() {
					return void 0 !== t ? t.length : 0
				}
			}), Object.defineProperty(this, "stream", {
				enumerable: !1,
				set: function(e) {
					t = e
				},
				get: function() {
					return t ? t : null
				}
			})
		}, n.internal.inherit(n.FormXObject, n.PDFObject), n.AcroFormDictionary = function() {
			n.PDFObject.call(this);
			var t = [];
			Object.defineProperty(this, "Kids", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return t.length > 0 ? t : void 0
				}
			}), Object.defineProperty(this, "Fields", {
				enumerable: !0,
				configurable: !0,
				get: function() {
					return t
				}
			}), this.DA
		}, n.internal.inherit(n.AcroFormDictionary, n.PDFObject), n.Field = function() {
			n.PDFObject.call(this);
			var t;
			Object.defineProperty(this, "Rect", {
				enumerable: !0,
				configurable: !1,
				get: function() {
					if (t) {
						var e = t;
						return e
					}
				},
				set: function(e) {
					t = e
				}
			});
			var e = "";
			Object.defineProperty(this, "FT", {
				enumerable: !0,
				set: function(t) {
					e = t
				},
				get: function() {
					return e
				}
			});
			var r;
			Object.defineProperty(this, "T", {
				enumerable: !0,
				configurable: !1,
				set: function(t) {
					r = t
				},
				get: function() {
					if (!r || r.length < 1) {
						if (this instanceof n.ChildClass) return;
						return "(FieldObject" + n.Field.FieldNum++ + ")"
					}
					return "(" == r.substring(0, 1) && r.substring(r.length - 1) ? r : "(" + r + ")"
				}
			});
			var i;
			Object.defineProperty(this, "DA", {
				enumerable: !0,
				get: function() {
					return i ? "(" + i + ")" : void 0
				},
				set: function(t) {
					i = t
				}
			});
			var o;
			Object.defineProperty(this, "DV", {
				enumerable: !0,
				configurable: !0,
				get: function() {
					return o ? o : void 0
				},
				set: function(t) {
					o = t
				}
			}), Object.defineProperty(this, "Type", {
				enumerable: !0,
				get: function() {
					return this.hasAnnotation ? "/Annot" : null
				}
			}), Object.defineProperty(this, "Subtype", {
				enumerable: !0,
				get: function() {
					return this.hasAnnotation ? "/Widget" : null
				}
			}), this.BG, Object.defineProperty(this, "hasAnnotation", {
				enumerable: !1,
				get: function() {
					return !!(this.Rect || this.BC || this.BG)
				}
			}), Object.defineProperty(this, "hasAppearanceStream", {
				enumerable: !1,
				configurable: !0,
				writable: !0
			})
		}, n.Field.FieldNum = 0, n.internal.inherit(n.Field, n.PDFObject), n.ChoiceField = function() {
			n.Field.call(this), this.FT = "/Ch", this.Opt = [], this.V = "()", this.TI = 0, this.combo = !1, Object.defineProperty(this, "edit", {
				enumerable: !0,
				set: function(t) {
					1 == t ? (this._edit = !0, this.combo = !0) : this._edit = !1
				},
				get: function() {
					return this._edit ? this._edit : !1
				},
				configurable: !1
			}), this.hasAppearanceStream = !0, Object.defineProperty(this, "V", {
				get: function() {
					n.internal.toPdfString()
				}
			})
		}, n.internal.inherit(n.ChoiceField, n.Field), window.ChoiceField = n.ChoiceField, n.ListBox = function() {
			n.ChoiceField.call(this)
		}, n.internal.inherit(n.ListBox, n.ChoiceField), window.ListBox = n.ListBox, n.ComboBox = function() {
			n.ListBox.call(this), this.combo = !0
		}, n.internal.inherit(n.ComboBox, n.ListBox), window.ComboBox = n.ComboBox, n.EditBox = function() {
			n.ComboBox.call(this), this.edit = !0
		}, n.internal.inherit(n.EditBox, n.ComboBox), window.EditBox = n.EditBox, n.Button = function() {
			n.Field.call(this), this.FT = "/Btn"
		}, n.internal.inherit(n.Button, n.Field), window.Button = n.Button, n.PushButton = function() {
			n.Button.call(this), this.pushbutton = !0
		}, n.internal.inherit(n.PushButton, n.Button), window.PushButton = n.PushButton, n.RadioButton = function() {
			n.Button.call(this), this.radio = !0;
			var t = [];
			Object.defineProperty(this, "Kids", {
				enumerable: !0,
				get: function() {
					return t.length > 0 ? t : void 0
				}
			}), Object.defineProperty(this, "__Kids", {
				get: function() {
					return t
				}
			});
			var e;
			Object.defineProperty(this, "noToggleToOff", {
				enumerable: !1,
				get: function() {
					return e
				},
				set: function(t) {
					e = t
				}
			})
		}, n.internal.inherit(n.RadioButton, n.Button), window.RadioButton = n.RadioButton, n.ChildClass = function(t, e) {
			n.Field.call(this), this.Parent = t, this._AppearanceType = n.Appearance.RadioButton.Circle, this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(e), this.F = n.internal.setBitPosition(this.F, 3, 1), this.MK = this._AppearanceType.createMK(), this.AS = "/Off", this._Name = e
		}, n.internal.inherit(n.ChildClass, n.Field), n.RadioButton.prototype.setAppearance = function(t) {
			if (!("createAppearanceStream" in t && "createMK" in t)) return void console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
			for (var e in this.__Kids) {
				var n = this.__Kids[e];
				n.appearanceStreamContent = t.createAppearanceStream(n._Name), n.MK = t.createMK()
			}
		}, n.RadioButton.prototype.createOption = function(t) {
			var r = this,
				i = (this.__Kids.length, new n.ChildClass(r, t));
			return this.__Kids.push(i), e.API.addField(i), i
		}, n.CheckBox = function() {
			Button.call(this), this.appearanceStreamContent = n.Appearance.CheckBox.createAppearanceStream(), this.MK = n.Appearance.CheckBox.createMK(), this.AS = "/On", this.V = "/On"
		}, n.internal.inherit(n.CheckBox, n.Button), window.CheckBox = n.CheckBox, n.TextField = function() {
			n.Field.call(this);
			var t;
			Object.defineProperty(this, "V", {
				get: function() {
					return t ? "(" + t + ")" : t
				},
				enumerable: !0,
				set: function(e) {
					t = e
				}
			});
			var e;
			Object.defineProperty(this, "DV", {
				get: function() {
					return e ? "(" + e + ")" : e
				},
				enumerable: !0,
				set: function(t) {
					e = t
				}
			});
			var r = !1;
			Object.defineProperty(this, "multiline", {
				enumerable: !1,
				get: function() {
					return r
				},
				set: function(t) {
					r = t
				}
			}), Object.defineProperty(this, "hasAppearanceStream", {
				enumerable: !1,
				get: function() {
					return this.V || this.DV
				}
			})
		}, n.internal.inherit(n.TextField, n.Field), window.TextField = n.TextField, n.PasswordField = function() {
			TextField.call(this), Object.defineProperty(this, "password", {
				value: !0,
				enumerable: !1,
				configurable: !1,
				writable: !1
			})
		}, n.internal.inherit(n.PasswordField, n.TextField), window.PasswordField = n.PasswordField, n.internal.calculateFontSpace = function(t, e, r) {
			var r = r || "helvetica",
				i = n.internal.calculateFontSpace.canvas || (n.internal.calculateFontSpace.canvas = document.createElement("canvas")),
				o = i.getContext("2d");
			o.save();
			var s = e + " " + r;
			o.font = s;
			var a = o.measureText(t);
			o.fontcolor = "black";
			var o = i.getContext("2d");
			a.height = 1.5 * o.measureText("3").width, o.restore();
			a.width;
			return a
		}, n.internal.calculateX = function(t, e, r, i) {
			var i = i || 12,
				r = r || "helvetica",
				o = {
					text: "",
					fontSize: ""
				};
			e = "(" == e.substr(0, 1) ? e.substr(1) : e, e = ")" == e.substr(e.length - 1) ? e.substr(0, e.length - 1) : e;
			var s = e.split(" "),
				a = i,
				c = 2,
				h = 2,
				u = n.Appearance.internal.getHeight(t) || 0;
			u = 0 > u ? -u : u;
			var l = n.Appearance.internal.getWidth(t) || 0;
			l = 0 > l ? -l : l;
			var f = function(t, e, i) {
				if (t + 1 < s.length) {
					var o = e + " " + s[t + 1],
						a = n.internal.calculateFontSpace(o, i + "px", r).width,
						c = l - 2 * h;
					return c >= a
				}
				return !1
			};
			a++;
			t: for (;;) {
				var e = "";
				a--;
				var d = n.internal.calculateFontSpace("3", a + "px", r).height,
					p = t.multiline ? u - a : (u - d) / 2;
				p += c;
				var g = -h,
					m = g,
					y = p,
					w = 0,
					v = 0,
					b = 0;
				if (0 == a) {
					a = 12, e = "(...) Tj\n", e += "% Width of Text: " + n.internal.calculateFontSpace(e, "1px").width + ", FieldWidth:" + l + "\n";
					break
				}
				b = n.internal.calculateFontSpace(s[0] + " ", a + "px", r).width;
				var x = "",
					S = 0;
				for (var k in s) {
					x += s[k] + " ", x = " " == x.substr(x.length - 1) ? x.substr(0, x.length - 1) : x;
					var I = parseInt(k);
					b = n.internal.calculateFontSpace(x + " ", a + "px", r).width;
					var C = f(I, x, a),
						A = k >= s.length - 1;
					if (!C || A) {
						if (C || A) {
							if (A) v = I;
							else if (t.multiline && (d + c) * (S + 2) + c > u) continue t
						} else {
							if (!t.multiline) continue t;
							if ((d + c) * (S + 2) + c > u) continue t;
							v = I
						}
						for (var _ = "", q = w; v >= q; q++) _ += s[q] + " ";
						switch (_ = " " == _.substr(_.length - 1) ? _.substr(0, _.length - 1) : _, b = n.internal.calculateFontSpace(_, a + "px", r).width, t.Q) {
							case 2:
								g = l - b - h;
								break;
							case 1:
								g = (l - b) / 2;
								break;
							case 0:
							default:
								g = h
						}
						e += g + " " + y + " Td\n", e += "(" + _ + ") Tj\n", e += -g + " 0 Td\n", y = -(a + c), m = g, b = 0, w = v + 1, S++, x = ""
					} else x += " "
				}
				break
			}
			return o.text = e, o.fontSize = a, o
		}, n.internal.calculateAppearanceStream = function(t) {
			if (t.appearanceStreamContent) return t.appearanceStreamContent;
			if (t.V || t.DV) {
				var e = "",
					r = t.V || t.DV,
					i = n.internal.calculateX(t, r);
				e += "/Tx BMC\nq\n/F1 " + i.fontSize + " Tf\n1 0 0 1 0 0 Tm\n", e += "BT\n", e += i.text, e += "ET\n", e += "Q\nEMC\n";
				var o = new n.createFormXObject(t);
				o.stream = e;
				return o
			}
		}, n.internal.calculateCoordinates = function(t, e, r, i) {
			var o = {};
			if (this.internal) {
				var s = function(t) {
					return t * this.internal.scaleFactor
				};
				Array.isArray(t) ? (t[0] = n.scale(t[0]), t[1] = n.scale(t[1]), t[2] = n.scale(t[2]), t[3] = n.scale(t[3]), o.lowerLeft_X = 0 | t[0], o.lowerLeft_Y = s.call(this, this.internal.pageSize.height) - t[3] - t[1] | 0, o.upperRight_X = t[0] + t[2] | 0, o.upperRight_Y = s.call(this, this.internal.pageSize.height) - t[1] | 0) : (t = n.scale(t), e = n.scale(e), r = n.scale(r), i = n.scale(i), o.lowerLeft_X = 0 | t, o.lowerLeft_Y = this.internal.pageSize.height - e | 0, o.upperRight_X = t + r | 0, o.upperRight_Y = this.internal.pageSize.height - e + i | 0)
			} else Array.isArray(t) ? (o.lowerLeft_X = 0 | t[0], o.lowerLeft_Y = 0 | t[1], o.upperRight_X = t[0] + t[2] | 0, o.upperRight_Y = t[1] + t[3] | 0) : (o.lowerLeft_X = 0 | t, o.lowerLeft_Y = 0 | e, o.upperRight_X = t + r | 0, o.upperRight_Y = e + i | 0);
			return [o.lowerLeft_X, o.lowerLeft_Y, o.upperRight_X, o.upperRight_Y]
		}, n.internal.calculateColor = function(t, e, n) {
			var r = new Array(3);
			return r.r = 0 | t, r.g = 0 | e, r.b = 0 | n, r
		}, n.internal.getBitPosition = function(t, e) {
			t = t || 0;
			var n = 1;
			return n <<= e - 1, t | n
		}, n.internal.setBitPosition = function(t, e, n) {
			t = t || 0, n = n || 1;
			var r = 1;
			if (r <<= e - 1, 1 == n) var t = t | r;
			else var t = t & ~r;
			return t
		},
		/**
		 * jsPDF addHTML PlugIn
		 * Copyright (c) 2014 Diego Casorran
		 *
		 * Licensed under the MIT License.
		 * http://opensource.org/licenses/mit-license
		 */
		function(t) {
			t.addHTML = function(t, e, n, r, i) {
				if ("undefined" == typeof html2canvas && "undefined" == typeof rasterizeHTML) throw new Error("You need either https://github.com/niklasvh/html2canvas or https://github.com/cburgmer/rasterizeHTML.js");
				"number" != typeof e && (r = e, i = n), "function" == typeof r && (i = r, r = null);
				var o = this.internal,
					s = o.scaleFactor,
					a = o.pageSize.width,
					c = o.pageSize.height;
				if (r = r || {}, r.onrendered = function(t) {
						e = parseInt(e) || 0, n = parseInt(n) || 0;
						var o = r.dim || {},
							h = o.h || 0,
							u = o.w || Math.min(a, t.width / s) - e,
							l = "JPEG";
						if (r.format && (l = r.format), t.height > c && r.pagesplit) {
							var f = function() {
								for (var r = 0;;) {
									var o = document.createElement("canvas");
									o.width = Math.min(a * s, t.width), o.height = Math.min(c * s, t.height - r);
									var h = o.getContext("2d");
									h.drawImage(t, 0, r, t.width, o.height, 0, 0, o.width, o.height);
									var f = [o, e, r ? 0 : n, o.width / s, o.height / s, l, null, "SLOW"];
									if (this.addImage.apply(this, f), r += o.height, r >= t.height) break;
									this.addPage()
								}
								i(u, r, null, f)
							}.bind(this);
							if ("CANVAS" === t.nodeName) {
								var d = new Image;
								d.onload = f, d.src = t.toDataURL("image/png"), t = d
							} else f()
						} else {
							var p = Math.random().toString(35),
								g = [t, e, n, u, h, l, p, "SLOW"];
							this.addImage.apply(this, g), i(u, h, p, g)
						}
					}.bind(this), "undefined" != typeof html2canvas && !r.rstz) return html2canvas(t, r);
				if ("undefined" != typeof rasterizeHTML) {
					var h = "drawDocument";
					return "string" == typeof t && (h = /^http/.test(t) ? "drawURL" : "drawHTML"), r.width = r.width || a * s, rasterizeHTML[h](t, void 0, r).then(function(t) {
						r.onrendered(t.image)
					}, function(t) {
						i(null, t)
					})
				}
				return null
			}
		}(e.API),
		function(e) {
			var n = "addImage_",
				r = ["jpeg", "jpg", "png"],
				i = function S(t) {
					var e = this.internal.newObject(),
						n = this.internal.write,
						r = this.internal.putStream;
					if (t.n = e, n("<</Type /XObject"), n("/Subtype /Image"), n("/Width " + t.w), n("/Height " + t.h), t.cs === this.color_spaces.INDEXED ? n("/ColorSpace [/Indexed /DeviceRGB " + (t.pal.length / 3 - 1) + " " + ("smask" in t ? e + 2 : e + 1) + " 0 R]") : (n("/ColorSpace /" + t.cs), t.cs === this.color_spaces.DEVICE_CMYK && n("/Decode [1 0 1 0 1 0 1 0]")), n("/BitsPerComponent " + t.bpc), "f" in t && n("/Filter /" + t.f), "dp" in t && n("/DecodeParms <<" + t.dp + ">>"), "trns" in t && t.trns.constructor == Array) {
						for (var i = "", o = 0, s = t.trns.length; s > o; o++) i += t.trns[o] + " " + t.trns[o] + " ";
						n("/Mask [" + i + "]")
					}
					if ("smask" in t && n("/SMask " + (e + 1) + " 0 R"), n("/Length " + t.data.length + ">>"), r(t.data), n("endobj"), "smask" in t) {
						var a = "/Predictor 15 /Colors 1 /BitsPerComponent " + t.bpc + " /Columns " + t.w,
							c = {
								w: t.w,
								h: t.h,
								cs: "DeviceGray",
								bpc: t.bpc,
								dp: a,
								data: t.smask
							};
						"f" in t && (c.f = t.f), S.call(this, c)
					}
					t.cs === this.color_spaces.INDEXED && (this.internal.newObject(), n("<< /Length " + t.pal.length + ">>"), r(this.arrayBufferToBinaryString(new Uint8Array(t.pal))), n("endobj"))
				},
				o = function() {
					var t = this.internal.collections[n + "images"];
					for (var e in t) i.call(this, t[e])
				},
				s = function() {
					var t, e = this.internal.collections[n + "images"],
						r = this.internal.write;
					for (var i in e) t = e[i], r("/I" + t.i, t.n, "0", "R")
				},
				a = function(t) {
					return t && "string" == typeof t && (t = t.toUpperCase()), t in e.image_compression ? t : e.image_compression.NONE
				},
				c = function() {
					var t = this.internal.collections[n + "images"];
					return t || (this.internal.collections[n + "images"] = t = {}, this.internal.events.subscribe("putResources", o), this.internal.events.subscribe("putXobjectDict", s)), t
				},
				h = function(t) {
					var e = 0;
					return t && (e = Object.keys ? Object.keys(t).length : function(t) {
						var e = 0;
						for (var n in t) t.hasOwnProperty(n) && e++;
						return e
					}(t)), e
				},
				u = function(t) {
					return "undefined" == typeof t || null === t
				},
				l = function(t) {
					return "string" == typeof t && e.sHashCode(t)
				},
				f = function(t) {
					return -1 === r.indexOf(t)
				},
				d = function(t) {
					return "function" != typeof e["process" + t.toUpperCase()]
				},
				p = function(e) {
					return "object" === ("undefined" == typeof e ? "undefined" : t["typeof"](e)) && 1 === e.nodeType
				},
				g = function(e, n, r) {
					if ("IMG" === e.nodeName && e.hasAttribute("src")) {
						var i = "" + e.getAttribute("src");
						if (!r && 0 === i.indexOf("data:image/")) return i;
						!n && /\.png(?:[?#].*)?$/i.test(i) && (n = "png")
					}
					if ("CANVAS" === e.nodeName) var o = e;
					else {
						var o = document.createElement("canvas");
						o.width = e.clientWidth || e.width, o.height = e.clientHeight || e.height;
						var s = o.getContext("2d");
						if (!s) throw "addImage requires canvas to be supported by browser.";
						if (r) {
							var a, c, h, u, l, f, d, p, g = Math.PI / 180;
							"object" === ("undefined" == typeof r ? "undefined" : t["typeof"](r)) && (a = r.x, c = r.y, h = r.bg, r = r.angle), p = r * g, u = Math.abs(Math.cos(p)), l = Math.abs(Math.sin(p)), f = o.width, d = o.height, o.width = d * l + f * u, o.height = d * u + f * l, isNaN(a) && (a = o.width / 2), isNaN(c) && (c = o.height / 2), s.clearRect(0, 0, o.width, o.height), s.fillStyle = h || "white", s.fillRect(0, 0, o.width, o.height), s.save(), s.translate(a, c), s.rotate(p), s.drawImage(e, -(f / 2), -(d / 2)), s.rotate(-p), s.translate(-a, -c), s.restore()
						} else s.drawImage(e, 0, 0, o.width, o.height)
					}
					return o.toDataURL("png" == ("" + n).toLowerCase() ? "image/png" : "image/jpeg")
				},
				m = function(t, e) {
					var n;
					if (e)
						for (var r in e)
							if (t === e[r].alias) {
								n = e[r];
								break
							}
					return n
				},
				y = function(t, e, n) {
					return t || e || (t = -96, e = -96), 0 > t && (t = -1 * n.w * 72 / t / this.internal.scaleFactor), 0 > e && (e = -1 * n.h * 72 / e / this.internal.scaleFactor), 0 === t && (t = e * n.w / n.h), 0 === e && (e = t * n.h / n.w), [t, e]
				},
				w = function(t, e, n, r, i, o, s) {
					var a = y.call(this, n, r, i),
						c = this.internal.getCoordinateString,
						h = this.internal.getVerticalCoordinateString;
					n = a[0], r = a[1], s[o] = i, this.internal.write("q", c(n), "0 0", c(-r), c(t), h(e + r), "cm /I" + i.i, "Do Q")
				};
			e.color_spaces = {
				DEVICE_RGB: "DeviceRGB",
				DEVICE_GRAY: "DeviceGray",
				DEVICE_CMYK: "DeviceCMYK",
				CAL_GREY: "CalGray",
				CAL_RGB: "CalRGB",
				LAB: "Lab",
				ICC_BASED: "ICCBased",
				INDEXED: "Indexed",
				PATTERN: "Pattern",
				SEPERATION: "Seperation",
				DEVICE_N: "DeviceN"
			}, e.decode = {
				DCT_DECODE: "DCTDecode",
				FLATE_DECODE: "FlateDecode",
				LZW_DECODE: "LZWDecode",
				JPX_DECODE: "JPXDecode",
				JBIG2_DECODE: "JBIG2Decode",
				ASCII85_DECODE: "ASCII85Decode",
				ASCII_HEX_DECODE: "ASCIIHexDecode",
				RUN_LENGTH_DECODE: "RunLengthDecode",
				CCITT_FAX_DECODE: "CCITTFaxDecode"
			}, e.image_compression = {
				NONE: "NONE",
				FAST: "FAST",
				MEDIUM: "MEDIUM",
				SLOW: "SLOW"
			}, e.sHashCode = function(t) {
				return Array.prototype.reduce && t.split("").reduce(function(t, e) {
					return t = (t << 5) - t + e.charCodeAt(0), t & t
				}, 0)
			}, e.isString = function(t) {
				return "string" == typeof t
			}, e.extractInfoFromBase64DataURI = function(t) {
				return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(t)
			}, e.supportsArrayBuffer = function() {
				return "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array
			}, e.isArrayBuffer = function(t) {
				return this.supportsArrayBuffer() ? t instanceof ArrayBuffer : !1
			}, e.isArrayBufferView = function(t) {
				return this.supportsArrayBuffer() ? "undefined" == typeof Uint32Array ? !1 : t instanceof Int8Array || t instanceof Uint8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array : !1
			}, e.binaryStringToUint8Array = function(t) {
				for (var e = t.length, n = new Uint8Array(e), r = 0; e > r; r++) n[r] = t.charCodeAt(r);
				return n
			}, e.arrayBufferToBinaryString = function(t) {
				if ("TextDecoder" in window) {
					var e = "ascii",
						n = new TextDecoder(e);
					if (n.encoding === e) return n.decode(t)
				}
				this.isArrayBuffer(t) && (t = new Uint8Array(t));
				for (var r = "", i = t.byteLength, o = 0; i > o; o++) r += String.fromCharCode(t[o]);
				return r
			}, e.arrayBufferToBase64 = function(t) {
				for (var e, n, r, i, o, s = "", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = new Uint8Array(t), h = c.byteLength, u = h % 3, l = h - u, f = 0; l > f; f += 3) o = c[f] << 16 | c[f + 1] << 8 | c[f + 2], e = (16515072 & o) >> 18, n = (258048 & o) >> 12, r = (4032 & o) >> 6, i = 63 & o, s += a[e] + a[n] + a[r] + a[i];
				return 1 == u ? (o = c[l], e = (252 & o) >> 2, n = (3 & o) << 4, s += a[e] + a[n] + "==") : 2 == u && (o = c[l] << 8 | c[l + 1], e = (64512 & o) >> 10, n = (1008 & o) >> 4, r = (15 & o) << 2, s += a[e] + a[n] + a[r] + "="), s
			}, e.createImageInfo = function(t, e, n, r, i, o, s, a, c, h, u, l) {
				var f = {
					alias: a,
					w: e,
					h: n,
					cs: r,
					bpc: i,
					i: s,
					data: t
				};
				return o && (f.f = o), c && (f.dp = c), h && (f.trns = h), u && (f.pal = u), l && (f.smask = l), f
			}, e.addImage = function(e, n, i, o, s, y, v, b, x) {
				if ("string" != typeof n) {
					var S = y;
					y = s, s = o, o = i, i = n, n = S
				}
				if ("object" === ("undefined" == typeof e ? "undefined" : t["typeof"](e)) && !p(e) && "imageData" in e) {
					var k = e;
					e = k.imageData, n = k.format || n, i = k.x || i || 0, o = k.y || o || 0, s = k.w || s, y = k.h || y, v = k.alias || v, b = k.compression || b, x = k.rotation || k.angle || x
				}
				if (isNaN(i) || isNaN(o)) throw console.error("jsPDF.addImage: Invalid coordinates", arguments), new Error("Invalid coordinates passed to jsPDF.addImage");
				var I, C = c.call(this);
				if (!(I = m(e, C))) {
					var A;
					if (p(e) && (e = g(e, n, x)), u(v) && (v = l(e)), !(I = m(v, C))) {
						if (this.isString(e)) {
							var _ = this.extractInfoFromBase64DataURI(e);
							_ ? (n = _[2], e = atob(_[3])) : 137 === e.charCodeAt(0) && 80 === e.charCodeAt(1) && 78 === e.charCodeAt(2) && 71 === e.charCodeAt(3) && (n = "png")
						}
						if (n = (n || "JPEG").toLowerCase(), f(n)) throw new Error("addImage currently only supports formats " + r + ", not '" + n + "'");
						if (d(n)) throw new Error("please ensure that the plugin for '" + n + "' support is added");
						if (this.supportsArrayBuffer() && (e instanceof Uint8Array || (A = e, e = this.binaryStringToUint8Array(e))), I = this["process" + n.toUpperCase()](e, h(C), v, a(b), A), !I) throw new Error("An unkwown error occurred whilst processing the image")
					}
				}
				return w.call(this, i, o, s, y, I, I.i, C), this
			};
			var v = function(t) {
					var e, n, r;
					if (255 === !t.charCodeAt(0) || 216 === !t.charCodeAt(1) || 255 === !t.charCodeAt(2) || 224 === !t.charCodeAt(3) || !t.charCodeAt(6) === "J".charCodeAt(0) || !t.charCodeAt(7) === "F".charCodeAt(0) || !t.charCodeAt(8) === "I".charCodeAt(0) || !t.charCodeAt(9) === "F".charCodeAt(0) || 0 === !t.charCodeAt(10)) throw new Error("getJpegSize requires a binary string jpeg file");
					for (var i = 256 * t.charCodeAt(4) + t.charCodeAt(5), o = 4, s = t.length; s > o;) {
						if (o += i, 255 !== t.charCodeAt(o)) throw new Error("getJpegSize could not find the size of the image");
						if (192 === t.charCodeAt(o + 1) || 193 === t.charCodeAt(o + 1) || 194 === t.charCodeAt(o + 1) || 195 === t.charCodeAt(o + 1) || 196 === t.charCodeAt(o + 1) || 197 === t.charCodeAt(o + 1) || 198 === t.charCodeAt(o + 1) || 199 === t.charCodeAt(o + 1)) return n = 256 * t.charCodeAt(o + 5) + t.charCodeAt(o + 6), e = 256 * t.charCodeAt(o + 7) + t.charCodeAt(o + 8), r = t.charCodeAt(o + 9), [e, n, r];
						o += 2, i = 256 * t.charCodeAt(o) + t.charCodeAt(o + 1)
					}
				},
				b = function(t) {
					var e = t[0] << 8 | t[1];
					if (65496 !== e) throw new Error("Supplied data is not a JPEG");
					for (var n, r, i, o, s = t.length, a = (t[4] << 8) + t[5], c = 4; s > c;) {
						if (c += a, n = x(t, c), a = (n[2] << 8) + n[3], (192 === n[1] || 194 === n[1]) && 255 === n[0] && a > 7) return n = x(t, c + 5), r = (n[2] << 8) + n[3], i = (n[0] << 8) + n[1], o = n[4], {
							width: r,
							height: i,
							numcomponents: o
						};
						c += 2
					}
					throw new Error("getJpegSizeFromBytes could not find the size of the image")
				},
				x = function(t, e) {
					return t.subarray(e, e + 5)
				};
			e.processJPEG = function(t, e, n, r, i) {
				var o, s = this.color_spaces.DEVICE_RGB,
					a = this.decode.DCT_DECODE,
					c = 8;
				return this.isString(t) ? (o = v(t), this.createImageInfo(t, o[0], o[1], 1 == o[3] ? this.color_spaces.DEVICE_GRAY : s, c, a, e, n)) : (this.isArrayBuffer(t) && (t = new Uint8Array(t)), this.isArrayBufferView(t) ? (o = b(t), t = i || this.arrayBufferToBinaryString(t), this.createImageInfo(t, o.width, o.height, 1 == o.numcomponents ? this.color_spaces.DEVICE_GRAY : s, c, a, e, n)) : null)
			}, e.processJPG = function() {
				return this.processJPEG.apply(this, arguments)
			}
		}(e.API),
		/**
		 * jsPDF Annotations PlugIn
		 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
		 *
		 * Licensed under the MIT License.
		 * http://opensource.org/licenses/mit-license
		 */
		function(t) {
			var n = {
				annotations: [],
				f2: function(t) {
					return t.toFixed(2)
				},
				notEmpty: function(t) {
					return "undefined" != typeof t && "" != t ? !0 : void 0
				}
			};
			return e.API.annotationPlugin = n, e.API.events.push(["addPage", function(t) {
				this.annotationPlugin.annotations[t.pageNumber] = []
			}]), t.events.push(["putPage", function(t) {
				for (var e = this.annotationPlugin.annotations[t.pageNumber], r = !1, i = 0; i < e.length && !r; i++) {
					var o = e[i];
					switch (o.type) {
						case "link":
							if (n.notEmpty(o.options.url) || n.notEmpty(o.options.pageNumber)) {
								r = !0;
								break
							}
						case "reference":
						case "text":
						case "freetext":
							r = !0
					}
				}
				if (0 != r) {
					this.internal.write("/Annots [");
					for (var s = this.annotationPlugin.f2, a = this.internal.scaleFactor, c = this.internal.pageSize.height, h = this.internal.getPageInfo(t.pageNumber), i = 0; i < e.length; i++) {
						var o = e[i];
						switch (o.type) {
							case "reference":
								this.internal.write(" " + o.object.objId + " 0 R ");
								break;
							case "text":
								var u = this.internal.newAdditionalObject(),
									l = this.internal.newAdditionalObject(),
									f = o.title || "Note",
									d = "/Rect [" + s(o.bounds.x * a) + " " + s(c - (o.bounds.y + o.bounds.h) * a) + " " + s((o.bounds.x + o.bounds.w) * a) + " " + s((c - o.bounds.y) * a) + "] ";
								w = "<</Type /Annot /Subtype /Text " + d + "/Contents (" + o.contents + ")", w += " /Popup " + l.objId + " 0 R", w += " /P " + h.objId + " 0 R", w += " /T (" + f + ") >>", u.content = w;
								var p = u.objId + " 0 R",
									g = 30,
									d = "/Rect [" + s((o.bounds.x + g) * a) + " " + s(c - (o.bounds.y + o.bounds.h) * a) + " " + s((o.bounds.x + o.bounds.w + g) * a) + " " + s((c - o.bounds.y) * a) + "] ";
								w = "<</Type /Annot /Subtype /Popup " + d + " /Parent " + p, o.open && (w += " /Open true"), w += " >>", l.content = w, this.internal.write(u.objId, "0 R", l.objId, "0 R");
								break;
							case "freetext":
								var d = "/Rect [" + s(o.bounds.x * a) + " " + s((c - o.bounds.y) * a) + " " + s(o.bounds.x + o.bounds.w * a) + " " + s(c - (o.bounds.y + o.bounds.h) * a) + "] ",
									m = o.color || "#000000";
								w = "<</Type /Annot /Subtype /FreeText " + d + "/Contents (" + o.contents + ")", w += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + m + ")", w += " /Border [0 0 0]", w += " >>", this.internal.write(w);
								break;
							case "link":
								if (o.options.name) {
									var y = this.annotations._nameMap[o.options.name];
									o.options.pageNumber = y.page, o.options.top = y.y
								} else o.options.top || (o.options.top = 0);
								var d = "/Rect [" + s(o.x * a) + " " + s((c - o.y) * a) + " " + s(o.x + o.w * a) + " " + s(c - (o.y + o.h) * a) + "] ",
									w = "";
								if (o.options.url) w = "<</Type /Annot /Subtype /Link " + d + "/Border [0 0 0] /A <</S /URI /URI (" + o.options.url + ") >>";
								else if (o.options.pageNumber) {
									var t = this.internal.getPageInfo(o.options.pageNumber);
									switch (w = "<</Type /Annot /Subtype /Link " + d + "/Border [0 0 0] /Dest [" + t.objId + " 0 R", o.options.magFactor = o.options.magFactor || "XYZ", o.options.magFactor) {
										case "Fit":
											w += " /Fit]";
											break;
										case "FitH":
											w += " /FitH " + o.options.top + "]";
											break;
										case "FitV":
											o.options.left = o.options.left || 0, w += " /FitV " + o.options.left + "]";
											break;
										case "XYZ":
										default:
											var v = s((c - o.options.top) * a);
											o.options.left = o.options.left || 0, "undefined" == typeof o.options.zoom && (o.options.zoom = 0), w += " /XYZ " + o.options.left + " " + v + " " + o.options.zoom + "]"
									}
								}
								"" != w && (w += " >>", this.internal.write(w))
						}
					}
					this.internal.write("]")
				}
			}]), t.createAnnotation = function(t) {
				switch (t.type) {
					case "link":
						this.link(t.bounds.x, t.bounds.y, t.bounds.w, t.bounds.h, t);
						break;
					case "text":
					case "freetext":
						this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(t)
				}
			}, t.link = function(t, e, n, r, i) {
				this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
					x: t,
					y: e,
					w: n,
					h: r,
					options: i,
					type: "link"
				})
			}, t.link = function(t, e, n, r, i) {
				this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
					x: t,
					y: e,
					w: n,
					h: r,
					options: i,
					type: "link"
				})
			}, t.textWithLink = function(t, e, n, r) {
				var i = this.getTextWidth(t),
					o = this.internal.getLineHeight();
				return this.text(t, e, n), n += .2 * o, this.link(e, n - o, i, o, r), i
			}, t.getTextWidth = function(t) {
				var e = this.internal.getFontSize(),
					n = this.getStringUnitWidth(t) * e / this.internal.scaleFactor;
				return n
			}, t.getLineHeight = function() {
				return this.internal.getLineHeight()
			}, this
		}(e.API),
		function(t) {
			t.autoPrint = function() {
				var t;
				return this.internal.events.subscribe("postPutResources", function() {
					t = this.internal.newObject(), this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj")
				}), this.internal.events.subscribe("putCatalog", function() {
					this.internal.write("/OpenAction " + t + " 0 R")
				}), this
			}
		}(e.API),
		/**
		 * jsPDF Canvas PlugIn
		 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
		 *
		 * Licensed under the MIT License.
		 * http://opensource.org/licenses/mit-license
		 */
		function(t) {
			return t.events.push(["initialized", function() {
				this.canvas.pdf = this
			}]), t.canvas = {
				getContext: function(t) {
					return this.pdf.context2d
				},
				style: {}
			}, Object.defineProperty(t.canvas, "width", {
				get: function() {
					return this._width
				},
				set: function(t) {
					this._width = t, this.getContext("2d").pageWrapX = t + 1
				}
			}), Object.defineProperty(t.canvas, "height", {
				get: function() {
					return this._height
				},
				set: function(t) {
					this._height = t, this.getContext("2d").pageWrapY = t + 1
				}
			}), this
		}(e.API),
		/** ====================================================================
		 * jsPDF Cell plugin
		 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
		 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
		 *               2013 Lee Driscoll, https://github.com/lsdriscoll
		 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
		 *               2014 James Hall, james@parall.ax
		 *               2014 Diego Casorran, https://github.com/diegocr
		 *
		 * 
		 * ====================================================================
		 */
		function(t) {
			var e, n, r, i, o = 3,
				s = 13,
				a = {
					x: void 0,
					y: void 0,
					w: void 0,
					h: void 0,
					ln: void 0
				},
				c = 1,
				h = function(t, e, n, r, i) {
					a = {
						x: t,
						y: e,
						w: n,
						h: r,
						ln: i
					}
				},
				u = function() {
					return a
				},
				l = {
					left: 0,
					top: 0,
					bottom: 0
				};
			t.setHeaderFunction = function(t) {
				i = t
			}, t.getTextDimensions = function(t) {
				e = this.internal.getFont().fontName, n = this.table_font_size || this.internal.getFontSize(), r = this.internal.getFont().fontStyle;
				var i, o, s = 19.049976 / 25.4;
				o = document.createElement("font"), o.id = "jsPDFCell";
				try {
					o.style.fontStyle = r
				} catch (a) {
					o.style.fontWeight = r
				}
				o.style.fontName = e, o.style.fontSize = n + "pt";
				try {
					o.textContent = t
				} catch (a) {
					o.innerText = t
				}
				return document.body.appendChild(o), i = {
					w: (o.offsetWidth + 1) * s,
					h: (o.offsetHeight + 1) * s
				}, document.body.removeChild(o), i
			}, t.cellAddPage = function() {
				var t = this.margins || l;
				this.addPage(), h(t.left, t.top, void 0, void 0), c += 1
			}, t.cellInitialize = function() {
				a = {
					x: void 0,
					y: void 0,
					w: void 0,
					h: void 0,
					ln: void 0
				}, c = 1
			}, t.cell = function(t, e, n, r, i, a, c) {
				var f = u(),
					d = !1;
				if (void 0 !== f.ln)
					if (f.ln === a) t = f.x + f.w, e = f.y;
					else {
						var p = this.margins || l;
						f.y + f.h + r + s >= this.internal.pageSize.height - p.bottom && (this.cellAddPage(), d = !0, this.printHeaders && this.tableHeaderRow && this.printHeaderRow(a, !0)), e = u().y + u().h, d && (e = s + 10)
					}
				if (void 0 !== i[0])
					if (this.printingHeaderRow ? this.rect(t, e, n, r, "FD") : this.rect(t, e, n, r), "right" === c) {
						i instanceof Array || (i = [i]);
						for (var g = 0; g < i.length; g++) {
							var m = i[g],
								y = this.getStringUnitWidth(m) * this.internal.getFontSize();
							this.text(m, t + n - y - o, e + this.internal.getLineHeight() * (g + 1))
						}
					} else this.text(i, t + o, e + this.internal.getLineHeight());
				return h(t, e, n, r, a), this
			}, t.arrayMax = function(t, e) {
				var n, r, i, o = t[0];
				for (n = 0, r = t.length; r > n; n += 1) i = t[n], e ? -1 === e(o, i) && (o = i) : i > o && (o = i);
				return o
			}, t.table = function(e, n, r, i, o) {
				if (!r) throw "No data for PDF table";
				var s, h, u, f, d, p, g, m, y, w, v = [],
					b = [],
					x = {},
					S = {},
					k = [],
					I = [],
					C = !1,
					A = !0,
					_ = 12,
					q = l;
				if (q.width = this.internal.pageSize.width, o && (o.autoSize === !0 && (C = !0), o.printHeaders === !1 && (A = !1), o.fontSize && (_ = o.fontSize), o.css["font-size"] && (_ = 16 * o.css["font-size"]), o.margins && (q = o.margins)), this.lnMod = 0, a = {
						x: void 0,
						y: void 0,
						w: void 0,
						h: void 0,
						ln: void 0
					}, c = 1, this.printHeaders = A, this.margins = q, this.setFontSize(_), this.table_font_size = _, void 0 === i || null === i) v = Object.keys(r[0]);
				else if (i[0] && "string" != typeof i[0]) {
					var T = 19.049976 / 25.4;
					for (h = 0, u = i.length; u > h; h += 1) s = i[h], v.push(s.name), b.push(s.prompt), S[s.name] = s.width * T
				} else v = i;
				if (C)
					for (w = function(t) {
							return t[s]
						}, h = 0, u = v.length; u > h; h += 1) {
						for (s = v[h], x[s] = r.map(w), k.push(this.getTextDimensions(b[h] || s).w), p = x[s], g = 0, f = p.length; f > g; g += 1) d = p[g], k.push(this.getTextDimensions(d).w);
						S[s] = t.arrayMax(k), k = []
					}
				if (A) {
					var P = this.calculateLineHeight(v, S, b.length ? b : v);
					for (h = 0, u = v.length; u > h; h += 1) s = v[h], I.push([e, n, S[s], P, String(b.length ? b[h] : s)]);
					this.setTableHeaderRow(I), this.printHeaderRow(1, !1)
				}
				for (h = 0, u = r.length; u > h; h += 1) {
					var P;
					for (m = r[h], P = this.calculateLineHeight(v, S, m), g = 0, y = v.length; y > g; g += 1) s = v[g], this.cell(e, n, S[s], P, m[s], h + 2, s.align)
				}
				return this.lastCellPos = a, this.table_x = e, this.table_y = n, this
			}, t.calculateLineHeight = function(t, e, n) {
				for (var r, i = 0, s = 0; s < t.length; s++) {
					r = t[s], n[r] = this.splitTextToSize(String(n[r]), e[r] - o);
					var a = this.internal.getLineHeight() * n[r].length + o;
					a > i && (i = a)
				}
				return i
			}, t.setTableHeaderRow = function(t) {
				this.tableHeaderRow = t
			}, t.printHeaderRow = function(t, e) {
				if (!this.tableHeaderRow) throw "Property tableHeaderRow does not exist.";
				var n, r, o, a;
				if (this.printingHeaderRow = !0, void 0 !== i) {
					var u = i(this, c);
					h(u[0], u[1], u[2], u[3], -1)
				}
				this.setFontStyle("bold");
				var l = [];
				for (o = 0, a = this.tableHeaderRow.length; a > o; o += 1) this.setFillColor(200, 200, 200), n = this.tableHeaderRow[o], e && (this.margins.top = s, n[1] = this.margins && this.margins.top || 0, l.push(n)), r = [].concat(n), this.cell.apply(this, r.concat(t));
				l.length > 0 && this.setTableHeaderRow(l), this.setFontStyle("normal"), this.printingHeaderRow = !1
			}
		}(e.API),
		/**
		 * jsPDF Context2D PlugIn
		 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
		 *
		 * Licensed under the MIT License.
		 * http://opensource.org/licenses/mit-license
		 */
		function(t) {
			function e() {
				this.fillStyle = "#000000", this.strokeStyle = "#000000", this.font = "12pt times", this.textBaseline = "alphabetic", this.lineWidth = 1, this.lineJoin = "miter", this.lineCap = "butt", this._translate = {
					x: 0,
					y: 0
				}, this.copy = function(t) {
					this.fillStyle = t.fillStyle, this.strokeStyle = t.strokeStyle, this.font = t.font, this.lineWidth = t.lineWidth, this.lineJoin = t.lineJoin, this.lineCap = t.lineCap, this.textBaseline = t.textBaseline, this._fontSize = t._fontSize, this._translate = {
						x: t._translate.x,
						y: t._translate.y
					}
				}
			}
			t.events.push(["initialized", function() {
				this.context2d.pdf = this, this.context2d.internal.pdf = this, this.context2d.ctx = new e, this.context2d.ctxStack = [], this.context2d.path = []
			}]), t.context2d = {
				pageWrapXEnabled: !1,
				pageWrapYEnabled: !0,
				pageWrapX: 9999999,
				pageWrapY: 9999999,
				f2: function(t) {
					return t.toFixed(2)
				},
				fillRect: function(t, e, n, r) {
					t = this._wrapX(t), e = this._wrapY(e), this.pdf.rect(t, e, n, r, "f")
				},
				strokeRect: function(t, e, n, r) {
					t = this._wrapX(t), e = this._wrapY(e), this.pdf.rect(t, e, n, r, "s")
				},
				clearRect: function(t, e, n, r) {
					t = this._wrapX(t), e = this._wrapY(e), this.save(), this.setFillStyle("#ffffff"), this.pdf.rect(t, e, n, r, "f"), this.restore()
				},
				save: function() {
					this.ctx._fontSize = this.pdf.internal.getFontSize();
					var t = new e;
					t.copy(this.ctx), this.ctxStack.push(this.ctx), this.ctx = t
				},
				restore: function() {
					this.ctx = this.ctxStack.pop(), this.setFillStyle(this.ctx.fillStyle), this.setStrokeStyle(this.ctx.strokeStyle), this.setFont(this.ctx.font), this.pdf.setFontSize(this.ctx._fontSize), this.setLineCap(this.ctx.lineCap), this.setLineWidth(this.ctx.lineWidth), this.setLineJoin(this.ctx.lineJoin)
				},
				beginPath: function() {
					this.path = []
				},
				closePath: function() {
					this.path.push({
						type: "close"
					})
				},
				setFillStyle: function(t) {
					var e, n, r, o, s = this.internal.rxRgb.exec(t);
					null != s ? (e = parseInt(s[1]), n = parseInt(s[2]), r = parseInt(s[3])) : (s = this.internal.rxRgba.exec(t), null != s ? (e = parseInt(s[1]), n = parseInt(s[2]), r = parseInt(s[3]), o = parseInt(s[4])) : ("#" != t.charAt(0) && (t = i.colorNameToHex(t), t || (t = "#000000")), this.ctx.fillStyle = t, 4 === t.length ? (e = this.ctx.fillStyle.substring(1, 2), e += e, n = this.ctx.fillStyle.substring(2, 3), n += n, r = this.ctx.fillStyle.substring(3, 4), r += r) : (e = this.ctx.fillStyle.substring(1, 3), n = this.ctx.fillStyle.substring(3, 5), r = this.ctx.fillStyle.substring(5, 7)), e = parseInt(e, 16), n = parseInt(n, 16), r = parseInt(r, 16))), this.pdf.setFillColor(e, n, r, {
						a: o
					}), this.pdf.setTextColor(e, n, r, {
						a: o
					})
				},
				setStrokeStyle: function(t) {
					"#" != t.charAt(0) && (t = i.colorNameToHex(t), t || (t = "#000000")), this.ctx.strokeStyle = t;
					var e = this.ctx.strokeStyle.substring(1, 3);
					e = parseInt(e, 16);
					var n = this.ctx.strokeStyle.substring(3, 5);
					n = parseInt(n, 16);
					var r = this.ctx.strokeStyle.substring(5, 7);
					r = parseInt(r, 16), this.pdf.setDrawColor(e, n, r)
				},
				fillText: function(t, e, n, r) {
					e = this._wrapX(e), n = this._wrapY(n), this.pdf.text(t, e, this._getBaseline(n))
				},
				strokeText: function(t, e, n, r) {
					e = this._wrapX(e), n = this._wrapY(n), this.pdf.text(t, e, this._getBaseline(n), {
						stroke: !0
					})
				},
				setFont: function(t) {
					this.ctx.font = t;
					var e = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
					if (c = e.exec(t), null != c) {
						var n = c[1],
							r = (c[2], c[3]),
							i = c[4],
							o = c[5],
							s = c[6];
						i = "px" === o ? Math.floor(parseFloat(i)) : "em" === o ? Math.floor(parseFloat(i) * this.pdf.getFontSize()) : Math.floor(parseFloat(i)), this.pdf.setFontSize(i), "bold" === r || "700" === r ? this.pdf.setFontStyle("bold") : "italic" === n ? this.pdf.setFontStyle("italic") : this.pdf.setFontStyle("normal");
						var a = s;
						this.pdf.setFont(a, u)
					} else {
						var e = /(\d+)(pt|px|em)\s+(\w+)\s*(\w+)?/,
							c = e.exec(t);
						if (null != c) {
							var h = c[1],
								a = (c[2], c[3]),
								u = c[4];
							u || (u = "normal"), h = "em" === o ? Math.floor(parseFloat(i) * this.pdf.getFontSize()) : Math.floor(parseFloat(h)), this.pdf.setFontSize(h), this.pdf.setFont(a, u)
						}
					}
				},
				setTextBaseline: function(t) {
					this.ctx.textBaseline = t
				},
				getTextBaseline: function() {
					return this.ctx.textBaseline
				},
				setLineWidth: function(t) {
					this.ctx.lineWidth = t, this.pdf.setLineWidth(t)
				},
				setLineCap: function(t) {
					this.ctx.lineCap = t, this.pdf.setLineCap(t)
				},
				setLineJoin: function(t) {
					this.ctx.lineJon = t, this.pdf.setLineJoin(t)
				},
				moveTo: function(t, e) {
					t = this._wrapX(t), e = this._wrapY(e);
					var n = {
						type: "mt",
						x: t,
						y: e
					};
					this.path.push(n)
				},
				_wrapX: function(t) {
					return this.pageWrapXEnabled ? t % this.pageWrapX : t
				},
				_wrapY: function(t) {
					return this.pageWrapYEnabled ? (this._gotoPage(this._page(t)), (t - this.lastBreak) % this.pageWrapY) : t
				},
				lastBreak: 0,
				pageBreaks: [],
				_page: function(t) {
					if (this.pageWrapYEnabled) {
						this.lastBreak = 0;
						for (var e = 0, n = 0, r = 0; r < this.pageBreaks.length; r++)
							if (t >= this.pageBreaks[r]) {
								e++, 0 === this.lastBreak && n++;
								var i = this.pageBreaks[r] - this.lastBreak;
								this.lastBreak = this.pageBreaks[r];
								var o = Math.floor(i / this.pageWrapY);
								n += o
							}
						if (0 === this.lastBreak) {
							var o = Math.floor(t / this.pageWrapY) + 1;
							n += o
						}
						return n + e
					}
					return this.pdf.internal.getCurrentPageInfo().pageNumber
				},
				_gotoPage: function(t) {},
				lineTo: function(t, e) {
					t = this._wrapX(t), e = this._wrapY(e);
					var n = {
						type: "lt",
						x: t,
						y: e
					};
					this.path.push(n)
				},
				bezierCurveTo: function(t, e, n, r, i, o) {
					t = this._wrapX(t), e = this._wrapY(e), n = this._wrapX(n), r = this._wrapY(r), i = this._wrapX(i), o = this._wrapY(o);
					var s = {
						type: "bct",
						x1: t,
						y1: e,
						x2: n,
						y2: r,
						x: i,
						y: o
					};
					this.path.push(s)
				},
				quadraticCurveTo: function(t, e, n, r) {
					t = this._wrapX(t), e = this._wrapY(e), n = this._wrapX(n), r = this._wrapY(r);
					var i = {
						type: "qct",
						x1: t,
						y1: e,
						x: n,
						y: r
					};
					this.path.push(i)
				},
				arc: function(t, e, n, r, i, o) {
					t = this._wrapX(t), e = this._wrapY(e);
					var s = {
						type: "arc",
						x: t,
						y: e,
						radius: n,
						startAngle: r,
						endAngle: i,
						anticlockwise: o
					};
					this.path.push(s)
				},
				drawImage: function(t, e, n, r, i, o, s, a, c) {
					void 0 !== o && (e = o, n = s, r = a, i = c), e = this._wrapX(e), n = this._wrapY(n);
					var h, u = /data:image\/(\w+).*/i,
						l = u.exec(t);
					h = null != l ? l[1] : "png", this.pdf.addImage(t, h, e, n, r, i)
				},
				stroke: function() {
					for (var t, e = [], n = !1, r = 0; r < this.path.length; r++) {
						var i = this.path[r];
						switch (i.type) {
							case "mt":
								t = i, "undefined" != typeof t && (this.pdf.lines(e, t.x, t.y, null, "s"), e = []);
								break;
							case "lt":
								var o = [i.x - this.path[r - 1].x, i.y - this.path[r - 1].y];
								e.push(o);
								break;
							case "bct":
								var o = [i.x1 - this.path[r - 1].x, i.y1 - this.path[r - 1].y, i.x2 - this.path[r - 1].x, i.y2 - this.path[r - 1].y, i.x - this.path[r - 1].x, i.y - this.path[r - 1].y];
								e.push(o);
								break;
							case "qct":
								var s = this.path[r - 1].x + 2 / 3 * (i.x1 - this.path[r - 1].x),
									a = this.path[r - 1].y + 2 / 3 * (i.y1 - this.path[r - 1].y),
									c = i.x + 2 / 3 * (i.x1 - i.x),
									h = i.y + 2 / 3 * (i.y1 - i.y),
									u = i.x,
									l = i.y,
									o = [s - this.path[r - 1].x, a - this.path[r - 1].y, c - this.path[r - 1].x, h - this.path[r - 1].y, u - this.path[r - 1].x, l - this.path[r - 1].y];
								e.push(o);
								break;
							case "close":
								n = !0
						}
					}
					"undefined" != typeof t && this.pdf.lines(e, t.x, t.y, null, "s", n);
					for (var r = 0; r < this.path.length; r++) {
						var i = this.path[r];
						switch (i.type) {
							case "arc":
								var t = 360 * i.startAngle / (2 * Math.PI),
									f = 360 * i.endAngle / (2 * Math.PI);
								this.internal.arc(i.x, i.y, i.radius, t, f, i.anticlockwise, "s")
						}
					}
					this.path = []
				},
				fill: function() {
					for (var t, e = [], n = 0; n < this.path.length; n++) {
						var r = this.path[n];
						switch (r.type) {
							case "mt":
								t = r, "undefined" != typeof t && (this.pdf.lines(e, t.x, t.y, null, "f"), e = []);
								break;
							case "lt":
								var i = [r.x - this.path[n - 1].x, r.y - this.path[n - 1].y];
								e.push(i);
								break;
							case "bct":
								var i = [r.x1 - this.path[n - 1].x, r.y1 - this.path[n - 1].y, r.x2 - this.path[n - 1].x, r.y2 - this.path[n - 1].y, r.x - this.path[n - 1].x, r.y - this.path[n - 1].y];
								e.push(i);
								break;
							case "qct":
								var o = this.path[n - 1].x + 2 / 3 * (r.x1 - this.path[n - 1].x),
									s = this.path[n - 1].y + 2 / 3 * (r.y1 - this.path[n - 1].y),
									a = r.x + 2 / 3 * (r.x1 - r.x),
									c = r.y + 2 / 3 * (r.y1 - r.y),
									h = r.x,
									u = r.y,
									i = [o - this.path[n - 1].x, s - this.path[n - 1].y, a - this.path[n - 1].x, c - this.path[n - 1].y, h - this.path[n - 1].x, u - this.path[n - 1].y];
								e.push(i)
						}
					}
					"undefined" != typeof t && this.pdf.lines(e, t.x, t.y, null, "f");
					for (var n = 0; n < this.path.length; n++) {
						var r = this.path[n];
						switch (r.type) {
							case "arc":
								var t = 360 * r.startAngle / (2 * Math.PI),
									l = 360 * r.endAngle / (2 * Math.PI);
								this.internal.arc(r.x, r.y, r.radius, t, l, r.anticlockwise, "f");
								break;
							case "close":
								this.pdf.internal.out("h")
						}
					}
					this.path = []
				},
				clip: function() {},
				translate: function(t, e) {
					this.ctx._translate = {
						x: t,
						y: e
					}
				},
				measureText: function(t) {
					var e = this.pdf;
					return {
						getWidth: function() {
							var n = e.internal.getFontSize(),
								r = e.getStringUnitWidth(t) * n / e.internal.scaleFactor;
							return r
						},
						get width() {
							return this.getWidth(t)
						}
					}
				},
				_getBaseline: function(t) {
					var e = parseInt(this.pdf.internal.getFontSize()),
						n = .25 * e;
					switch (this.ctx.textBaseline) {
						case "bottom":
							return t - n;
						case "top":
							return t + e;
						case "hanging":
							return t + e - n;
						case "middle":
							return t + e / 2 - n;
						case "ideographic":
							return t;
						case "alphabetic":
						default:
							return t
					}
				}
			};
			var n = t.context2d;
			return Object.defineProperty(n, "fillStyle", {
				set: function(t) {
					this.setFillStyle(t)
				},
				get: function() {
					return this.ctx.fillStyle
				}
			}), Object.defineProperty(n, "textBaseline", {
				set: function(t) {
					this.setTextBaseline(t)
				},
				get: function() {
					return this.getTextBaseline()
				}
			}), Object.defineProperty(n, "font", {
				set: function(t) {
					this.setFont(t)
				},
				get: function() {
					return this.getFont()
				}
			}), n.internal = {}, n.internal.rxRgb = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/, n.internal.rxRgba = /rgba\s*\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/, n.internal.arc = function(t, e, n, r, i, o, s) {
				for (var a = this.pdf.internal.scaleFactor, c = this.pdf.internal.pageSize.height, h = this.pdf.internal.f2, u = r * (Math.PI / 180), l = i * (Math.PI / 180), f = this.createArc(n, u, l, o), d = 0; d < f.length; d++) {
					var p = f[d];
					0 == d ? this.pdf.internal.out([h((p.x1 + t) * a), h((c - (p.y1 + e)) * a), "m", h((p.x2 + t) * a), h((c - (p.y2 + e)) * a), h((p.x3 + t) * a), h((c - (p.y3 + e)) * a), h((p.x4 + t) * a), h((c - (p.y4 + e)) * a), "c"].join(" ")) : this.pdf.internal.out([h((p.x2 + t) * a), h((c - (p.y2 + e)) * a), h((p.x3 + t) * a), h((c - (p.y3 + e)) * a), h((p.x4 + t) * a), h((c - (p.y4 + e)) * a), "c"].join(" "))
				}
				null !== s && this.pdf.internal.out(this.pdf.internal.getStyle(s))
			}, n.internal.createArc = function(t, e, n, r) {
				var i = 1e-5,
					o = 2 * Math.PI,
					s = e;
				(o > s || s > o) && (s %= o);
				var a = n;
				(o > a || a > o) && (a %= o);
				for (var c = [], h = Math.PI / 2, u = r ? -1 : 1, l = e, f = Math.min(o, Math.abs(a - s)); f > i;) {
					var d = l + u * Math.min(f, h);
					c.push(this.createSmallArc(t, l, d)), f -= Math.abs(d - l), l = d
				}
				return c
			}, n.internal.createSmallArc = function(t, e, n) {
				var r = (n - e) / 2,
					i = t * Math.cos(r),
					o = t * Math.sin(r),
					s = i,
					a = -o,
					c = s * s + a * a,
					h = c + s * i + a * o,
					u = 4 / 3 * (Math.sqrt(2 * c * h) - h) / (s * o - a * i),
					l = s - u * a,
					f = a + u * s,
					d = l,
					p = -f,
					g = r + e,
					m = Math.cos(g),
					y = Math.sin(g);
				return {
					x1: t * Math.cos(e),
					y1: t * Math.sin(e),
					x2: l * m - f * y,
					y2: l * y + f * m,
					x3: d * m - p * y,
					y3: d * y + p * m,
					x4: t * Math.cos(n),
					y4: t * Math.sin(n)
				}
			}, this
		}(e.API),
		/** @preserve
		 * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
		 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
		 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
		 *               2014 Diego Casorran, https://github.com/diegocr
		 *               2014 Daniel Husar, https://github.com/danielhusar
		 *               2014 Wolfgang Gassler, https://github.com/woolfg
		 *               2014 Steven Spungin, https://github.com/flamenco
		 *
		 * 
		 * ====================================================================
		 */
		function(e) {
			var n, r, o, s, a, c, h, u, l, f, d, p, g, m, y, w, v, b, x, S;
			n = function() {
				function t() {}
				return function(e) {
					return t.prototype = e, new t
				}
			}(), f = function(t) {
				var e, n, r, i, o, s, a;
				for (n = 0, r = t.length, e = void 0, i = !1, s = !1; !i && n !== r;) e = t[n] = t[n].trimLeft(), e && (i = !0), n++;
				for (n = r - 1; r && !s && -1 !== n;) e = t[n] = t[n].trimRight(), e && (s = !0), n--;
				for (o = /\s+$/g, a = !0, n = 0; n !== r;) "\u2028" != t[n] && (e = t[n].replace(/\s+/g, " "), a && (e = e.trimLeft()), e && (a = o.test(e)), t[n] = e), n++;
				return t
			}, d = function(t, e, n, r) {
				return this.pdf = t, this.x = e, this.y = n, this.settings = r, this.watchFunctions = [], this.init(), this
			}, p = function(t) {
				var e, n, r;
				for (e = void 0, r = t.split(","), n = r.shift(); !e && n;) e = o[n.trim().toLowerCase()], n = r.shift();
				return e
			}, g = function(t) {
				t = "auto" === t ? "0px" : t, t.indexOf("em") > -1 && !isNaN(Number(t.replace("em", ""))) && (t = 18.719 * Number(t.replace("em", "")) + "px"), t.indexOf("pt") > -1 && !isNaN(Number(t.replace("pt", ""))) && (t = 1.333 * Number(t.replace("pt", "")) + "px");
				var e, n, r;
				return n = void 0, e = 16, (r = m[t]) ? r : (r = {
					"xx-small": 9,
					"x-small": 11,
					small: 13,
					medium: 16,
					large: 19,
					"x-large": 23,
					"xx-large": 28,
					auto: 0
				}[{
					css_line_height_string: t
				}], r !== n ? m[t] = r / e : (r = parseFloat(t)) ? m[t] = r / e : (r = t.match(/([\d\.]+)(px)/), 3 === r.length ? m[t] = parseFloat(r[1]) / e : m[t] = 1))
			}, l = function(t) {
				var e, n, r;
				return r = function(t) {
					var e;
					return e = function(t) {
							return document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(t, null) : t.currentStyle ? t.currentStyle : t.style
						}(t),
						function(t) {
							return t = t.replace(/-\D/g, function(t) {
								return t.charAt(1).toUpperCase()
							}), e[t]
						}
				}(t), e = {}, n = void 0, e["font-family"] = p(r("font-family")) || "times", e["font-style"] = s[r("font-style")] || "normal", e["text-align"] = a[r("text-align")] || "left", n = c[r("font-weight")] || "normal", "bold" === n && ("normal" === e["font-style"] ? e["font-style"] = n : e["font-style"] = n + e["font-style"]), e["font-size"] = g(r("font-size")) || 1, e["line-height"] = g(r("line-height")) || 1, e.display = "inline" === r("display") ? "inline" : "block", n = "block" === e.display, e["margin-top"] = n && g(r("margin-top")) || 0, e["margin-bottom"] = n && g(r("margin-bottom")) || 0, e["padding-top"] = n && g(r("padding-top")) || 0, e["padding-bottom"] = n && g(r("padding-bottom")) || 0, e["margin-left"] = n && g(r("margin-left")) || 0, e["margin-right"] = n && g(r("margin-right")) || 0, e["padding-left"] = n && g(r("padding-left")) || 0, e["padding-right"] = n && g(r("padding-right")) || 0, e["page-break-before"] = r("page-break-before") || "auto", e["float"] = h[r("cssFloat")] || "none", e.clear = u[r("clear")] || "none", e.color = r("color"), e
			}, y = function(t, e, n) {
				var r, i, o, s, a;
				if (o = !1, i = void 0, s = void 0, a = void 0, r = n["#" + t.id])
					if ("function" == typeof r) o = r(t, e);
					else
						for (i = 0, s = r.length; !o && i !== s;) o = r[i](t, e), i++;
				if (r = n[t.nodeName], !o && r)
					if ("function" == typeof r) o = r(t, e);
					else
						for (i = 0, s = r.length; !o && i !== s;) o = r[i](t, e), i++;
				return o
			}, S = function(t, e) {
				var n, r, i, o, s, a, c, h, u, l;
				for (n = [], r = [], i = 0, l = t.rows[0].cells.length, h = t.clientWidth; l > i;) u = t.rows[0].cells[i], r[i] = {
					name: u.textContent.toLowerCase().replace(/\s+/g, ""),
					prompt: u.textContent.replace(/\r?\n/g, ""),
					width: u.clientWidth / h * e.pdf.internal.pageSize.width
				}, i++;
				for (i = 1; i < t.rows.length;) {
					for (a = t.rows[i], s = {}, o = 0; o < a.cells.length;) s[r[o].name] = a.cells[o].textContent.replace(/\r?\n/g, ""), o++;
					n.push(s), i++
				}
				return c = {
					rows: n,
					headers: r
				}
			};
			var k = {
					SCRIPT: 1,
					STYLE: 1,
					NOSCRIPT: 1,
					OBJECT: 1,
					EMBED: 1,
					SELECT: 1
				},
				I = 1;
			r = function(e, i, o) {
				var s, a, c, h, u, f, d, p, g;
				for (a = e.childNodes, s = void 0, c = l(e), u = "block" === c.display, u && (i.setBlockBoundary(), i.setBlockStyle(c)), d = 19.049976 / 25.4, h = 0, f = a.length; f > h;) {
					if (s = a[h], "object" === ("undefined" == typeof s ? "undefined" : t["typeof"](s))) {
						if (i.executeWatchFunctions(s), 1 === s.nodeType && "HEADER" === s.nodeName) {
							var m = s,
								v = i.pdf.margins_doc.top;
							i.pdf.internal.events.subscribe("addPage", function(t) {
								i.y = v, r(m, i, o), i.pdf.margins_doc.top = i.y + 10, i.y += 10
							}, !1)
						}
						if (8 === s.nodeType && "#comment" === s.nodeName) ~s.textContent.indexOf("ADD_PAGE") && (i.pdf.addPage(), i.y = i.pdf.margins_doc.top);
						else if (1 !== s.nodeType || k[s.nodeName])
							if (3 === s.nodeType) {
								var b = s.nodeValue;
								if (s.nodeValue && "LI" === s.parentNode.nodeName)
									if ("OL" === s.parentNode.parentNode.nodeName) b = I++ + ". " + b;
									else {
										var x = c["font-size"];
										offsetX = (3 - .75 * x) * i.pdf.internal.scaleFactor, offsetY = .75 * x * i.pdf.internal.scaleFactor, radius = 1.74 * x / i.pdf.internal.scaleFactor, g = function(t, e) {
											this.pdf.circle(t + offsetX, e + offsetY, radius, "FD")
										}
									}
								s.ownerDocument.body.contains(s) && i.addText(b, c)
							} else "string" == typeof s && i.addText(s, c);
						else {
							var C;
							if ("IMG" === s.nodeName) {
								var A = s.getAttribute("src");
								C = w[i.pdf.sHashCode(A) || A]
							}
							if (C) {
								i.pdf.internal.pageSize.height - i.pdf.margins_doc.bottom < i.y + s.height && i.y > i.pdf.margins_doc.top && (i.pdf.addPage(), i.y = i.pdf.margins_doc.top, i.executeWatchFunctions(s));
								var _ = l(s),
									q = i.x,
									T = 12 / i.pdf.internal.scaleFactor,
									P = (_["margin-left"] + _["padding-left"]) * T,
									E = (_["margin-right"] + _["padding-right"]) * T,
									O = (_["margin-top"] + _["padding-top"]) * T,
									F = (_["margin-bottom"] + _["padding-bottom"]) * T;
								q += void 0 !== _["float"] && "right" === _["float"] ? i.settings.width - s.width - E : P, i.pdf.addImage(C, q, i.y + O, s.width, s.height), C = void 0, "right" === _["float"] || "left" === _["float"] ? (i.watchFunctions.push(function(t, e, n, r) {
									return i.y >= e ? (i.x += t, i.settings.width += n, !0) : r && 1 === r.nodeType && !k[r.nodeName] && i.x + r.width > i.pdf.margins_doc.left + i.pdf.margins_doc.width ? (i.x += t, i.y = e, i.settings.width += n, !0) : !1
								}.bind(this, "left" === _["float"] ? -s.width - P - E : 0, i.y + s.height + O + F, s.width)), i.watchFunctions.push(function(t, e, n) {
									return i.y < t && e === i.pdf.internal.getNumberOfPages() ? 1 === n.nodeType && "both" === l(n).clear ? (i.y = t, !0) : !1 : !0
								}.bind(this, i.y + s.height, i.pdf.internal.getNumberOfPages())), i.settings.width -= s.width + P + E, "left" === _["float"] && (i.x += s.width + P + E)) : i.y += s.height + O + F
							} else if ("TABLE" === s.nodeName) p = S(s, i), i.y += 10, i.pdf.table(i.x, i.y, p.rows, p.headers, {
								autoSize: !1,
								printHeaders: o.printHeaders,
								margins: i.pdf.margins_doc,
								css: l(s)
							}), i.y = i.pdf.lastCellPos.y + i.pdf.lastCellPos.h + 20;
							else if ("OL" === s.nodeName || "UL" === s.nodeName) I = 1, y(s, i, o) || r(s, i, o), i.y += 10;
							else if ("LI" === s.nodeName) {
								var B = i.x;
								i.x += 20 / i.pdf.internal.scaleFactor, i.y += 3, y(s, i, o) || r(s, i, o), i.x = B
							} else "BR" === s.nodeName ? (i.y += c["font-size"] * i.pdf.internal.scaleFactor, i.addText("\u2028", n(c))) : y(s, i, o) || r(s, i, o)
						}
					}
					h++
				}
				return o.outY = i.y, u ? i.setBlockBoundary(g) : void 0
			}, w = {}, v = function(t, e, n, r) {
				function i() {
					e.pdf.internal.events.publish("imagesLoaded"), r(s)
				}

				function o(t, n, r) {
					if (t) {
						var o = new Image;
						s = ++h, o.crossOrigin = "", o.onerror = o.onload = function() {
							if (o.complete && (0 === o.src.indexOf("data:image/") && (o.width = n || o.width || 0, o.height = r || o.height || 0), o.width + o.height)) {
								var s = e.pdf.sHashCode(t) || t;
								w[s] = w[s] || o
							}--h || i()
						}, o.src = t
					}
				}
				for (var s, a = t.getElementsByTagName("img"), c = a.length, h = 0; c--;) o(a[c].getAttribute("src"), a[c].width, a[c].height);
				return h || i()
			}, b = function(t, e, n) {
				var i = t.getElementsByTagName("footer");
				if (i.length > 0) {
					i = i[0];
					var o = e.pdf.internal.write,
						s = e.y;
					e.pdf.internal.write = function() {}, r(i, e, n);
					var a = Math.ceil(e.y - s) + 5;
					e.y = s, e.pdf.internal.write = o, e.pdf.margins_doc.bottom += a;
					for (var c = function(t) {
							var o = void 0 !== t ? t.pageNumber : 1,
								s = e.y;
							e.y = e.pdf.internal.pageSize.height - e.pdf.margins_doc.bottom, e.pdf.margins_doc.bottom -= a;
							for (var c = i.getElementsByTagName("span"), h = 0; h < c.length; ++h)(" " + c[h].className + " ").replace(/[\n\t]/g, " ").indexOf(" pageCounter ") > -1 && (c[h].innerHTML = o), (" " + c[h].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1 && (c[h].innerHTML = "###jsPDFVarTotalPages###");
							r(i, e, n), e.pdf.margins_doc.bottom += a, e.y = s
						}, h = i.getElementsByTagName("span"), u = 0; u < h.length; ++u)(" " + h[u].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1 && e.pdf.internal.events.subscribe("htmlRenderingFinished", e.pdf.putTotalPages.bind(e.pdf, "###jsPDFVarTotalPages###"), !0);
					e.pdf.internal.events.subscribe("addPage", c, !1), c(), k.FOOTER = 1
				}
			}, x = function(t, e, n, i, o, s) {
				if (!e) return !1;
				"string" == typeof e || e.parentNode || (e = "" + e.innerHTML), "string" == typeof e && (e = function(t) {
					var e, n, r, i;
					return r = "jsPDFhtmlText" + Date.now().toString() + (1e3 * Math.random()).toFixed(0), i = "position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;", n = document.createElement("div"), n.style.cssText = i, n.innerHTML = '<iframe style="height:1px;width:1px" name="' + r + '" />', document.body.appendChild(n), e = window.frames[r], e.document.open(), e.document.writeln(t), e.document.close(), e.document.body
				}(e.replace(/<\/?script[^>]*?>/gi, "")));
				var a, c = new d(t, n, i, o);
				return v.call(this, e, c, o.elementHandlers, function(t) {
					b(e, c, o.elementHandlers), r(e, c, o.elementHandlers), c.pdf.internal.events.publish("htmlRenderingFinished"), a = c.dispose(), "function" == typeof s ? s(a) : t && console.error("jsPDF Warning: rendering issues? provide a callback to fromHTML!")
				}), a || {
					x: c.x,
					y: c.y
				}
			}, d.prototype.init = function() {
				return this.paragraph = {
					text: [],
					style: []
				}, this.pdf.internal.write("q")
			}, d.prototype.dispose = function() {
				return this.pdf.internal.write("Q"), {
					x: this.x,
					y: this.y,
					ready: !0
				}
			}, d.prototype.executeWatchFunctions = function(t) {
				var e = !1,
					n = [];
				if (this.watchFunctions.length > 0) {
					for (var r = 0; r < this.watchFunctions.length; ++r) this.watchFunctions[r](t) === !0 ? e = !0 : n.push(this.watchFunctions[r]);
					this.watchFunctions = n
				}
				return e
			}, d.prototype.splitFragmentsIntoLines = function(t, e) {
				var r, i, o, s, a, c, h, u, l, f, d, p, g, m, y;
				for (i = 12, d = this.pdf.internal.scaleFactor, a = {}, o = void 0, f = void 0, s = void 0, c = void 0, y = void 0, l = void 0, u = void 0, h = void 0, p = [], g = [p], r = 0, m = this.settings.width; t.length;)
					if (c = t.shift(), y = e.shift(), c)
						if (o = y["font-family"], f = y["font-style"], s = a[o + f], s || (s = this.pdf.internal.getFont(o, f).metadata.Unicode, a[o + f] = s), l = {
								widths: s.widths,
								kerning: s.kerning,
								fontSize: y["font-size"] * i,
								textIndent: r
							}, u = this.pdf.getStringUnitWidth(c, l) * l.fontSize / d, "\u2028" == c) p = [], g.push(p);
						else if (r + u > m) {
					for (h = this.pdf.splitTextToSize(c, m, l), p.push([h.shift(), y]); h.length;) p = [[h.shift(), y]], g.push(p);
					r = this.pdf.getStringUnitWidth(p[0][0], l) * l.fontSize / d
				} else p.push([c, y]), r += u;
				if (void 0 !== y["text-align"] && ("center" === y["text-align"] || "right" === y["text-align"] || "justify" === y["text-align"]))
					for (var w = 0; w < g.length; ++w) {
						var v = this.pdf.getStringUnitWidth(g[w][0][0], l) * l.fontSize / d;
						w > 0 && (g[w][0][1] = n(g[w][0][1]));
						var b = m - v;
						if ("right" === y["text-align"]) g[w][0][1]["margin-left"] = b;
						else if ("center" === y["text-align"]) g[w][0][1]["margin-left"] = b / 2;
						else if ("justify" === y["text-align"]) {
							var x = g[w][0][0].split(" ").length - 1;
							g[w][0][1]["word-spacing"] = b / x, w === g.length - 1 && (g[w][0][1]["word-spacing"] = 0)
						}
					}
				return g
			}, d.prototype.RenderTextFragment = function(t, e) {
				var n, r, i;
				i = 0, n = 12, this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize() && (this.pdf.internal.write("ET", "Q"), this.pdf.addPage(), this.y = this.pdf.margins_doc.top, this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), e.color, "Td"), i = Math.max(i, e["line-height"], e["font-size"]), this.pdf.internal.write(0, (-1 * n * i).toFixed(2), "Td")), r = this.pdf.internal.getFont(e["font-family"], e["font-style"]);
				var o = this.getPdfColor(e.color);
				o !== this.lastTextColor && (this.pdf.internal.write(o), this.lastTextColor = o), void 0 !== e["word-spacing"] && e["word-spacing"] > 0 && this.pdf.internal.write(e["word-spacing"].toFixed(2), "Tw"), this.pdf.internal.write("/" + r.id, (n * e["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(t) + ") Tj"), void 0 !== e["word-spacing"] && this.pdf.internal.write(0, "Tw")
			}, d.prototype.getPdfColor = function(t) {
				var e, n, r, o, s = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/,
					a = s.exec(t);
				if (null != a ? (n = parseInt(a[1]), r = parseInt(a[2]), o = parseInt(a[3])) : ("#" != t.charAt(0) && (t = i.colorNameToHex(t), t || (t = "#000000")), n = t.substring(1, 3), n = parseInt(n, 16), r = t.substring(3, 5), r = parseInt(r, 16), o = t.substring(5, 7), o = parseInt(o, 16)), "string" == typeof n && /^#[0-9A-Fa-f]{6}$/.test(n)) {
					var c = parseInt(n.substr(1), 16);
					n = c >> 16 & 255, r = c >> 8 & 255, o = 255 & c
				}
				var h = this.f3;
				return e = 0 === n && 0 === r && 0 === o || "undefined" == typeof r ? h(n / 255) + " g" : [h(n / 255), h(r / 255), h(o / 255), "rg"].join(" ")
			}, d.prototype.f3 = function(t) {
				return t.toFixed(3)
			}, d.prototype.renderParagraph = function(t) {
				var e, n, r, i, o, s, a, c, h, u, l, d, p, g, m;
				if (i = f(this.paragraph.text), g = this.paragraph.style, e = this.paragraph.blockstyle, p = this.paragraph.priorblockstyle || {}, this.paragraph = {
						text: [],
						style: [],
						blockstyle: {},
						priorblockstyle: e
					}, i.join("").trim()) {
					c = this.splitFragmentsIntoLines(i, g), a = void 0, h = void 0, n = 12, r = n / this.pdf.internal.scaleFactor, this.priorMarginBottom = this.priorMarginBottom || 0, d = (Math.max((e["margin-top"] || 0) - this.priorMarginBottom, 0) + (e["padding-top"] || 0)) * r, l = ((e["margin-bottom"] || 0) + (e["padding-bottom"] || 0)) * r, this.priorMarginBottom = e["margin-bottom"] || 0, "always" === e["page-break-before"] && (this.pdf.addPage(), this.y = 0, d = ((e["margin-top"] || 0) + (e["padding-top"] || 0)) * r), u = this.pdf.internal.write, o = void 0, s = void 0, this.y += d, u("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
					for (var y = 0; c.length;) {
						for (a = c.shift(), h = 0, o = 0, s = a.length; o !== s;) a[o][0].trim() && (h = Math.max(h, a[o][1]["line-height"], a[o][1]["font-size"]), m = 7 * a[o][1]["font-size"]), o++;
						var w = 0,
							v = 0;
						void 0 !== a[0][1]["margin-left"] && a[0][1]["margin-left"] > 0 && (v = this.pdf.internal.getCoordinateString(a[0][1]["margin-left"]), w = v - y, y = v);
						var b = Math.max(e["margin-left"] || 0, 0) * r;
						for (u(w + b, (-1 * n * h).toFixed(2), "Td"), o = 0, s = a.length; o !== s;) a[o][0] && this.RenderTextFragment(a[o][0], a[o][1]), o++;
						if (this.y += h * r, this.executeWatchFunctions(a[0][1]) && c.length > 0) {
							var x = [],
								S = [];
							c.forEach(function(t) {
								for (var e = 0, n = t.length; e !== n;) t[e][0] && (x.push(t[e][0] + " "), S.push(t[e][1])), ++e
							}), c = this.splitFragmentsIntoLines(f(x), S), u("ET", "Q"), u("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td")
						}
					}
					return t && "function" == typeof t && t.call(this, this.x - 9, this.y - m / 2), u("ET", "Q"), this.y += l
				}
			}, d.prototype.setBlockBoundary = function(t) {
				return this.renderParagraph(t)
			}, d.prototype.setBlockStyle = function(t) {
				return this.paragraph.blockstyle = t
			}, d.prototype.addText = function(t, e) {
				return this.paragraph.text.push(t), this.paragraph.style.push(e)
			}, o = {
				helvetica: "helvetica",
				"sans-serif": "helvetica",
				"times new roman": "times",
				serif: "times",
				times: "times",
				monospace: "courier",
				courier: "courier"
			}, c = {
				100: "normal",
				200: "normal",
				300: "normal",
				400: "normal",
				500: "bold",
				600: "bold",
				700: "bold",
				800: "bold",
				900: "bold",
				normal: "normal",
				bold: "bold",
				bolder: "bold",
				lighter: "normal"
			}, s = {
				normal: "normal",
				italic: "italic",
				oblique: "italic"
			}, a = {
				left: "left",
				right: "right",
				center: "center",
				justify: "justify"
			}, h = {
				none: "none",
				right: "right",
				left: "left"
			}, u = {
				none: "none",
				both: "both"
			}, m = {
				normal: 1
			}, e.fromHTML = function(t, e, n, r, i, o) {
				return this.margins_doc = o || {
					top: 0,
					bottom: 0
				}, r || (r = {}), r.elementHandlers || (r.elementHandlers = {}), x(this, t, isNaN(e) ? 4 : e, isNaN(n) ? 4 : n, r, i)
			}
		}(e.API),
		/** ==================================================================== 
		 * jsPDF JavaScript plugin
		 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
		 * 
		 * 
		 * ====================================================================
		 */
		function(t) {
			var e, n, r;
			t.addJS = function(t) {
				return r = t, this.internal.events.subscribe("postPutResources", function(t) {
					e = this.internal.newObject(), this.internal.write("<< /Names [(EmbeddedJS) " + (e + 1) + " 0 R] >>", "endobj"), n = this.internal.newObject(), this.internal.write("<< /S /JavaScript /JS (", r, ") >>", "endobj")
				}), this.internal.events.subscribe("putCatalog", function() {
					void 0 !== e && void 0 !== n && this.internal.write("/Names <</JavaScript " + e + " 0 R>>")
				}), this
			}
		}(e.API),
		function(t) {
			return t.events.push(["postPutResources", function() {
				var t = this,
					e = /^(\d+) 0 obj$/;
				if (this.outline.root.children.length > 0)
					for (var n = t.outline.render().split(/\r\n/), r = 0; r < n.length; r++) {
						var i = n[r],
							o = e.exec(i);
						if (null != o) {
							var s = o[1];
							t.internal.newObjectDeferredBegin(s)
						}
						t.internal.write(i)
					}
				if (this.outline.createNamedDestinations) {
					for (var a = this.internal.pages.length, c = [], r = 0; a > r; r++) {
						var h = t.internal.newObject();
						c.push(h);
						var u = t.internal.getPageInfo(r + 1);
						t.internal.write("<< /D[" + u.objId + " 0 R /XYZ null null null]>> endobj")
					}
					var l = t.internal.newObject();
					t.internal.write("<< /Names [ ");
					for (var r = 0; r < c.length; r++) t.internal.write("(page_" + (r + 1) + ")" + c[r] + " 0 R");
					t.internal.write(" ] >>", "endobj");
					t.internal.newObject();
					t.internal.write("<< /Dests " + l + " 0 R"), t.internal.write(">>", "endobj")
				}
			}]), t.events.push(["putCatalog", function() {
				var t = this;
				t.outline.root.children.length > 0 && (t.internal.write("/Outlines", this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations && t.internal.write("/Names " + namesOid + " 0 R"))
			}]), t.events.push(["initialized", function() {
				var t = this;
				t.outline = {
					createNamedDestinations: !1,
					root: {
						children: []
					}
				};
				t.outline.add = function(t, e, n) {
					var r = {
						title: e,
						options: n,
						children: []
					};
					return null == t && (t = this.root), t.children.push(r), r
				}, t.outline.render = function() {
					return this.ctx = {}, this.ctx.val = "", this.ctx.pdf = t, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val
				}, t.outline.genIds_r = function(e) {
					e.id = t.internal.newObjectDeferred();
					for (var n = 0; n < e.children.length; n++) this.genIds_r(e.children[n])
				}, t.outline.renderRoot = function(t) {
					this.objStart(t), this.line("/Type /Outlines"), t.children.length > 0 && (this.line("/First " + this.makeRef(t.children[0])), this.line("/Last " + this.makeRef(t.children[t.children.length - 1]))), this.line("/Count " + this.count_r({
						count: 0
					}, t)), this.objEnd()
				}, t.outline.renderItems = function(e) {
					for (var n = 0; n < e.children.length; n++) {
						var r = e.children[n];
						this.objStart(r), this.line("/Title " + this.makeString(r.title)), this.line("/Parent " + this.makeRef(e)), n > 0 && this.line("/Prev " + this.makeRef(e.children[n - 1])), n < e.children.length - 1 && this.line("/Next " + this.makeRef(e.children[n + 1])), r.children.length > 0 && (this.line("/First " + this.makeRef(r.children[0])), this.line("/Last " + this.makeRef(r.children[r.children.length - 1])));
						var i = this.count = this.count_r({
							count: 0
						}, r);
						if (i > 0 && this.line("/Count " + i), r.options && r.options.pageNumber) {
							var o = t.internal.getPageInfo(r.options.pageNumber);
							this.line("/Dest [" + o.objId + " 0 R /XYZ 0 " + this.ctx.pdf.internal.pageSize.height + " 0]")
						}
						this.objEnd()
					}
					for (var n = 0; n < e.children.length; n++) {
						var r = e.children[n];
						this.renderItems(r)
					}
				}, t.outline.line = function(t) {
					this.ctx.val += t + "\r\n"
				}, t.outline.makeRef = function(t) {
					return t.id + " 0 R"
				}, t.outline.makeString = function(e) {
					return "(" + t.internal.pdfEscape(e) + ")"
				}, t.outline.objStart = function(t) {
					this.ctx.val += "\r\n" + t.id + " 0 obj\r\n<<\r\n"
				}, t.outline.objEnd = function(t) {
					this.ctx.val += ">> \r\nendobj\r\n"
				}, t.outline.count_r = function(t, e) {
					for (var n = 0; n < e.children.length; n++) t.count++, this.count_r(t, e.children[n]);
					return t.count
				}
			}]), this
		}(e.API),
		/**@preserve
		 *  ====================================================================
		 * jsPDF PNG PlugIn
		 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
		 *
		 * 
		 * ====================================================================
		 */
		function(t) {
			var e = function() {
					return "function" != typeof PNG || "function" != typeof a
				},
				n = function(e) {
					return e !== t.image_compression.NONE && r()
				},
				r = function() {
					var t = "function" == typeof o;
					if (!t) throw new Error("requires deflate.js for compression");
					return t
				},
				i = function(e, n, r, i) {
					var a = 5,
						u = f;
					switch (i) {
						case t.image_compression.FAST:
							a = 3, u = l;
							break;
						case t.image_compression.MEDIUM:
							a = 6, u = d;
							break;
						case t.image_compression.SLOW:
							a = 9, u = p
					}
					e = h(e, n, r, u);
					var g = new Uint8Array(s(a)),
						m = c(e),
						y = new o(a),
						w = y.append(e),
						v = y.flush(),
						b = g.length + w.length + v.length,
						x = new Uint8Array(b + 4);
					return x.set(g), x.set(w, g.length), x.set(v, g.length + w.length), x[b++] = m >>> 24 & 255, x[b++] = m >>> 16 & 255, x[b++] = m >>> 8 & 255, x[b++] = 255 & m, t.arrayBufferToBinaryString(x)
				},
				s = function(t, e) {
					var n = 8,
						r = Math.LOG2E * Math.log(32768) - 8,
						i = r << 4 | n,
						o = i << 8,
						s = Math.min(3, (e - 1 & 255) >> 1);
					return o |= s << 6, o |= 0, o += 31 - o % 31, [i, 255 & o & 255]
				},
				c = function(t, e) {
					for (var n, r = 1, i = 65535 & r, o = r >>> 16 & 65535, s = t.length, a = 0; s > 0;) {
						n = s > e ? e : s, s -= n;
						do i += t[a++], o += i; while (--n);
						i %= 65521, o %= 65521
					}
					return (o << 16 | i) >>> 0
				},
				h = function(t, e, n, r) {
					for (var i, o, s, a = t.length / e, c = new Uint8Array(t.length + a), h = m(), u = 0; a > u; u++) {
						if (s = u * e, i = t.subarray(s, s + e), r) c.set(r(i, n, o), s + u);
						else {
							for (var l = 0, f = h.length, d = []; f > l; l++) d[l] = h[l](i, n, o);
							var p = y(d.concat());
							c.set(d[p], s + u)
						}
						o = i
					}
					return c
				},
				u = function(t, e, n) {
					var r = Array.apply([], t);
					return r.unshift(0), r
				},
				l = function(t, e, n) {
					var r, i = [],
						o = 0,
						s = t.length;
					for (i[0] = 1; s > o; o++) r = t[o - e] || 0, i[o + 1] = t[o] - r + 256 & 255;
					return i
				},
				f = function(t, e, n) {
					var r, i = [],
						o = 0,
						s = t.length;
					for (i[0] = 2; s > o; o++) r = n && n[o] || 0, i[o + 1] = t[o] - r + 256 & 255;
					return i
				},
				d = function(t, e, n) {
					var r, i, o = [],
						s = 0,
						a = t.length;
					for (o[0] = 3; a > s; s++) r = t[s - e] || 0, i = n && n[s] || 0, o[s + 1] = t[s] + 256 - (r + i >>> 1) & 255;
					return o
				},
				p = function(t, e, n) {
					var r, i, o, s, a = [],
						c = 0,
						h = t.length;
					for (a[0] = 4; h > c; c++) r = t[c - e] || 0, i = n && n[c] || 0, o = n && n[c - e] || 0, s = g(r, i, o), a[c + 1] = t[c] - s + 256 & 255;
					return a
				},
				g = function(t, e, n) {
					var r = t + e - n,
						i = Math.abs(r - t),
						o = Math.abs(r - e),
						s = Math.abs(r - n);
					return o >= i && s >= i ? t : s >= o ? e : n
				},
				m = function() {
					return [u, l, f, d, p]
				},
				y = function(t) {
					for (var e, n, r, i = 0, o = t.length; o > i;) e = w(t[i].slice(1)), (n > e || !n) && (n = e, r = i), i++;
					return r
				},
				w = function(t) {
					for (var e = 0, n = t.length, r = 0; n > e;) r += Math.abs(t[e++]);
					return r
				};
			t.processPNG = function(t, r, o, s, a) {
				var c, h, u, l, f, d, p = this.color_spaces.DEVICE_RGB,
					g = this.decode.FLATE_DECODE,
					m = 8;
				if (this.isArrayBuffer(t) && (t = new Uint8Array(t)), this.isArrayBufferView(t)) {
					if (e()) throw new Error("PNG support requires png.js and zlib.js");
					if (c = new PNG(t), t = c.imgData, m = c.bits, p = c.colorSpace, l = c.colors, -1 !== [4, 6].indexOf(c.colorType)) {
						if (8 === c.bits)
							for (var y, w, v = 32 == c.pixelBitlength ? new Uint32Array(c.decodePixels().buffer) : 16 == c.pixelBitlength ? new Uint16Array(c.decodePixels().buffer) : new Uint8Array(c.decodePixels().buffer), b = v.length, x = new Uint8Array(b * c.colors), S = new Uint8Array(b), k = c.pixelBitlength - c.bits, I = 0, C = 0; b > I; I++) {
								for (y = v[I], w = 0; k > w;) x[C++] = y >>> w & 255, w += c.bits;
								S[I] = y >>> w & 255
							}
						if (16 === c.bits) {
							for (var y, v = new Uint32Array(c.decodePixels().buffer), b = v.length, x = new Uint8Array(b * (32 / c.pixelBitlength) * c.colors), S = new Uint8Array(b * (32 / c.pixelBitlength)), A = c.colors > 1, I = 0, C = 0, _ = 0; b > I;) y = v[I++], x[C++] = y >>> 0 & 255, A && (x[C++] = y >>> 16 & 255, y = v[I++], x[C++] = y >>> 0 & 255), S[_++] = y >>> 16 & 255;
							m = 8
						}
						n(s) ? (t = i(x, c.width * c.colors, c.colors, s), d = i(S, c.width, 1, s)) : (t = x, d = S, g = null)
					}
					if (3 === c.colorType && (p = this.color_spaces.INDEXED, f = c.palette, c.transparency.indexed)) {
						for (var q = c.transparency.indexed, T = 0, I = 0, b = q.length; b > I; ++I) T += q[I];
						if (T /= 255, T === b - 1 && -1 !== q.indexOf(0)) u = [q.indexOf(0)];
						else if (T !== b) {
							for (var v = c.decodePixels(), S = new Uint8Array(v.length), I = 0, b = v.length; b > I; I++) S[I] = q[v[I]];
							d = i(S, c.width, 1)
						}
					}
					return h = g === this.decode.FLATE_DECODE ? "/Predictor 15 /Colors " + l + " /BitsPerComponent " + m + " /Columns " + c.width : "/Colors " + l + " /BitsPerComponent " + m + " /Columns " + c.width, (this.isArrayBuffer(t) || this.isArrayBufferView(t)) && (t = this.arrayBufferToBinaryString(t)), (d && this.isArrayBuffer(d) || this.isArrayBufferView(d)) && (d = this.arrayBufferToBinaryString(d)), this.createImageInfo(t, c.width, c.height, p, m, g, r, o, h, u, f, d)
				}
				throw new Error("Unsupported PNG image data, try using JPEG instead.")
			}
		}(e.API),
		function(t) {
			t.autoPrint = function() {
				var t;
				return this.internal.events.subscribe("postPutResources", function() {
					t = this.internal.newObject(), this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj")
				}), this.internal.events.subscribe("putCatalog", function() {
					this.internal.write("/OpenAction " + t + " 0 R")
				}), this
			}
		}(e.API),
		/** @preserve
		 * jsPDF split_text_to_size plugin - MIT license.
		 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
		 *               2014 Diego Casorran, https://github.com/diegocr
		 */
		function(t) {
			var e = t.getCharWidthsArray = function(t, e) {
					e || (e = {});
					var n, r = t.length,
						i = [];
					if (e.font) {
						var o = e.fontSize,
							s = e.charSpace;
						for (n = 0; r > n; n++) i.push(e.font.widthOfString(t[n], o, s) / o);
						return i
					}
					var a = e.widths ? e.widths : this.internal.getFont().metadata.Unicode.widths,
						c = a.fof ? a.fof : 1,
						h = e.kerning ? e.kerning : this.internal.getFont().metadata.Unicode.kerning,
						u = h.fof ? h.fof : 1,
						l = 0,
						f = 0,
						d = a[0] || c;
					for (n = 0, r = t.length; r > n; n++) l = t.charCodeAt(n), i.push((a[l] || d) / c + (h[l] && h[l][f] || 0) / u), f = l;
					return i
				},
				n = function(t) {
					for (var e = t.length, n = 0; e;) e--, n += t[e];
					return n
				},
				r = t.getStringUnitWidth = function(t, r) {
					return n(e.call(this, t, r))
				},
				i = function(t, e, n, r) {
					for (var i = [], o = 0, s = t.length, a = 0; o !== s && a + e[o] < n;) a += e[o], o++;
					i.push(t.slice(0, o));
					var c = o;
					for (a = 0; o !== s;) a + e[o] > r && (i.push(t.slice(c, o)), a = 0, c = o), a += e[o], o++;
					return c !== o && i.push(t.slice(c, o)), i
				},
				o = function(t, o, s) {
					s || (s = {});
					var a, c, h, u, l, f, d, p = [],
						g = [p],
						m = s.textIndent || 0,
						y = 0,
						w = 0,
						v = t.split(" "),
						b = e(" ", s)[0];
					if (f = -1 === s.lineIndent ? v[0].length + 2 : s.lineIndent || 0) {
						var x = Array(f).join(" "),
							S = [];
						v.map(function(t) {
							t = t.split(/\s*\n/), t.length > 1 ? S = S.concat(t.map(function(t, e) {
								return (e && t.length ? "\n" : "") + t
							})) : S.push(t[0])
						}), v = S, f = r(x, s)
					}
					for (h = 0, u = v.length; u > h; h++) {
						var k = 0;
						if (a = v[h], f && "\n" === a[0] && (a = a.substr(1), k = 1), c = e(a, s), w = n(c), m + y + w > o || k) {
							if (w > o) {
								for (l = i(a, c, o - (m + y), o), p.push(l.shift()), p = [l.pop()]; l.length;) g.push([l.shift()]);
								w = n(c.slice(a.length - p[0].length))
							} else p = [a];
							g.push(p), m = w + f, y = b
						} else p.push(a), m += y + w, y = b
					}
					return d = f ? function(t, e) {
						return (e ? x : "") + t.join(" ")
					} : function(t) {
						return t.join(" ")
					}, g.map(d)
				};
			t.splitTextToSize = function(t, e, n) {
				n || (n = {});
				var r, i = n.fontSize || this.internal.getFontSize(),
					s = function(t) {
						var e = {
								0: 1
							},
							n = {};
						if (t.widths && t.kerning) return {
							widths: t.widths,
							kerning: t.kerning
						};
						var r = this.internal.getFont(t.fontName, t.fontStyle),
							i = "Unicode";
						return r.metadata[i] ? {
							widths: r.metadata[i].widths || e,
							kerning: r.metadata[i].kerning || n
						} : {
							font: r.metadata,
							fontSize: this.internal.getFontSize(),
							charSpace: this.internal.getCharSpace()
						}
					}.call(this, n);
				r = Array.isArray(t) ? t : t.split(/\r?\n/);
				var a = 1 * this.internal.scaleFactor * e / i;
				s.textIndent = n.textIndent ? 1 * n.textIndent * this.internal.scaleFactor / i : 0, s.lineIndent = n.lineIndent;
				var c, h, u = [];
				for (c = 0, h = r.length; h > c; c++) u = u.concat(o(r[c], a, s));
				return u
			}
		}(e.API),
		function(t) {
			var e = function(t) {
					for (var e = "0123456789abcdef", n = "klmnopqrstuvwxyz", r = {}, i = 0; i < n.length; i++) r[n[i]] = e[i];
					var o, s, a, c, h, u = {},
						l = 1,
						f = u,
						d = [],
						p = "",
						g = "",
						m = t.length - 1;
					for (i = 1; i != m;) h = t[i], i += 1, "'" == h ? s ? (c = s.join(""), s = o) : s = [] : s ? s.push(h) : "{" == h ? (d.push([f, c]), f = {}, c = o) : "}" == h ? (a = d.pop(), a[0][a[1]] = f, c = o, f = a[0]) : "-" == h ? l = -1 : c === o ? r.hasOwnProperty(h) ? (p += r[h], c = parseInt(p, 16) * l, l = 1, p = "") : p += h : r.hasOwnProperty(h) ? (g += r[h], f[c] = parseInt(g, 16) * l, l = 1, c = o, g = "") : g += h;
					return u
				},
				n = {
					codePages: ["WinAnsiEncoding"],
					WinAnsiEncoding: e("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
				},
				r = {
					Unicode: {
						Courier: n,
						"Courier-Bold": n,
						"Courier-BoldOblique": n,
						"Courier-Oblique": n,
						Helvetica: n,
						"Helvetica-Bold": n,
						"Helvetica-BoldOblique": n,
						"Helvetica-Oblique": n,
						"Times-Roman": n,
						"Times-Bold": n,
						"Times-BoldItalic": n,
						"Times-Italic": n
					}
				},
				i = {
					Unicode: {
						"Courier-Oblique": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
						"Times-BoldItalic": e("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),
						"Helvetica-Bold": e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
						Courier: e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
						"Courier-BoldOblique": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
						"Times-Bold": e("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),
						Helvetica: e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),
						"Helvetica-BoldOblique": e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
						"Courier-Bold": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
						"Times-Italic": e("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),
						"Times-Roman": e("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),
						"Helvetica-Oblique": e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
					}
				};
			t.events.push(["addFont", function(t) {
				var e, n, o, s = "Unicode";
				e = i[s][t.postScriptName], e && (n = t.metadata[s] ? t.metadata[s] : t.metadata[s] = {}, n.widths = e.widths, n.kerning = e.kerning), o = r[s][t.postScriptName], o && (n = t.metadata[s] ? t.metadata[s] : t.metadata[s] = {}, n.encoding = o, o.codePages && o.codePages.length && (t.encoding = o.codePages[0]))
			}])
		}(e.API),
		function(t) {
			t.addSVG = function(t, e, n, r, i) {
				function o(t, e) {
					var n = e.createElement("style");
					n.type = "text/css", n.styleSheet ? n.styleSheet.cssText = t : n.appendChild(e.createTextNode(t)), e.getElementsByTagName("head")[0].appendChild(n)
				}

				function s(t) {
					var e = "childframe",
						n = t.createElement("iframe");
					return o(".jsPDF_sillysvg_iframe {display:none;position:absolute;}", t), n.name = e, n.setAttribute("width", 0), n.setAttribute("height", 0), n.setAttribute("frameborder", "0"), n.setAttribute("scrolling", "no"), n.setAttribute("seamless", "seamless"), n.setAttribute("class", "jsPDF_sillysvg_iframe"), t.body.appendChild(n), n
				}

				function a(t, e) {
					var n = (e.contentWindow || e.contentDocument).document;
					return n.write(t), n.close(), n.getElementsByTagName("svg")[0]
				}

				function c(t) {
					for (var e = parseFloat(t[1]), n = parseFloat(t[2]), r = [], i = 3, o = t.length; o > i;) "c" === t[i] ? (r.push([parseFloat(t[i + 1]), parseFloat(t[i + 2]), parseFloat(t[i + 3]), parseFloat(t[i + 4]), parseFloat(t[i + 5]), parseFloat(t[i + 6])]), i += 7) : "l" === t[i] ? (r.push([parseFloat(t[i + 1]), parseFloat(t[i + 2])]), i += 3) : i += 1;
					return [e, n, r]
				}
				var h;
				if (e === h || n === h) throw new Error("addSVG needs values for 'x' and 'y'");
				var u = s(document),
					l = a(t, u),
					f = [1, 1],
					d = parseFloat(l.getAttribute("width")),
					p = parseFloat(l.getAttribute("height"));
				d && p && (r && i ? f = [r / d, i / p] : r ? f = [r / d, r / d] : i && (f = [i / p, i / p]));
				var g, m, y, w, v = l.childNodes;
				for (g = 0, m = v.length; m > g; g++) y = v[g], y.tagName && "PATH" === y.tagName.toUpperCase() && (w = c(y.getAttribute("d").split(" ")), w[0] = w[0] * f[0] + e, w[1] = w[1] * f[1] + n, this.lines.call(this, w[2], w[0], w[1], f));
				return this
			}
		}(e.API),
		/** ==================================================================== 
		 * jsPDF total_pages plugin
		 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
		 * 
		 * 
		 * ====================================================================
		 */
		function(t) {
			t.putTotalPages = function(t) {
				for (var e = new RegExp(t, "g"), n = 1; n <= this.internal.getNumberOfPages(); n++)
					for (var r = 0; r < this.internal.pages[n].length; r++) this.internal.pages[n][r] = this.internal.pages[n][r].replace(e, this.internal.getNumberOfPages());
				return this
			}
		}(e.API),
		function(t) {
			var e = function() {
					function t(t, e, r) {
						var i, o;
						if (this.rawData = t, i = this.contents = new n(t), this.contents.pos = 4, "ttcf" === i.readString(4)) {
							if (!e) throw new Error("Must specify a font name for TTC files.");
							throw o = [], new Error("Font " + e + " not found in TTC file.")
						}
						i.pos = 0, this.parse(), this.subset = new S(this), this.registerTTF()
					}
					t.open = function(n, r, i, o) {
						var s;
						return s = e(i), new t(s, r, o)
					}, t.prototype.parse = function() {
						return this.directory = new r(this.contents), this.head = new a(this), this.name = new p(this), this.cmap = new c(this), this.hhea = new u(this), this.maxp = new m(this), this.hmtx = new y(this), this.post = new f(this), this.os2 = new l(this), this.loca = new x(this), this.glyf = new w(this), this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender, this.decender = this.os2.exists && this.os2.decender || this.hhea.decender, this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap, this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax], this
					}, t.prototype.registerTTF = function() {
						var t, e, n, r, i;
						if (this.scaleFactor = 1e3 / this.head.unitsPerEm, this.bbox = function() {
								var e, n, r, i;
								for (r = this.bbox, i = [], e = 0, n = r.length; n > e; e++) t = r[e], i.push(Math.round(t * this.scaleFactor));
								return i
							}.call(this), this.stemV = 0, this.post.exists ? (r = this.post.italic_angle, e = r >> 16, n = 255 & r, e & !0 && (e = -((65535 ^ e) + 1)), this.italicAngle = +("" + e + "." + n)) : this.italicAngle = 0, this.ascender = Math.round(this.ascender * this.scaleFactor), this.decender = Math.round(this.decender * this.scaleFactor), this.lineGap = Math.round(this.lineGap * this.scaleFactor), this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender, this.xHeight = this.os2.exists && this.os2.xHeight || 0, this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8, this.isSerif = 1 === (i = this.familyClass) || 2 === i || 3 === i || 4 === i || 5 === i || 7 === i, this.isScript = 10 === this.familyClass, this.flags = 0, this.post.isFixedPitch && (this.flags |= 1), this.isSerif && (this.flags |= 2), this.isScript && (this.flags |= 8), 0 !== this.italicAngle && (this.flags |= 64), this.flags |= 32, !this.cmap.unicode) throw new Error("No unicode cmap for font")
					}, t.prototype.characterToGlyph = function(t) {
						var e;
						return (void 0 !== (e = this.cmap.unicode) ? e.codeMap[t] : void 0) || 0
					}, t.prototype.widthOfGlyph = function(t) {
						var e;
						return e = 1e3 / this.head.unitsPerEm, this.hmtx.forGlyph(t).advance * e
					}, t.prototype.widthOfString = function(t, e, n) {
						var r, i, o, s, a, c;
						for (t = "" + t, s = 0, i = a = 0, c = t.length; c >= 0 ? c > a : a > c; i = c >= 0 ? ++a : --a) r = t.charCodeAt(i), s += this.widthOfGlyph(this.characterToGlyph(r)) + n * (1e3 / e) || 0;
						return o = e / 1e3, s * o
					}, t.prototype.lineHeight = function(t, e) {
						var n;
						return void 0 === e && (e = !1), n = e ? this.lineGap : 0, (this.ascender + n - this.decender) / 1e3 * t
					}, t.prototype.encode = function(t, e, n) {
						return t.use(e), e = n ? d(t.encodeText(e)) : t.encodeText(e), e = function() {
							for (var t = [], n = 0, r = e.length; r >= 0 ? r > n : n > r; r >= 0 ? n++ : n--) t.push(e.charCodeAt(n).toString(16));
							return t
						}().join("")
					}, t.prototype.embedTTF = function(t, e, n) {
						function r(t) {
							var i;
							return "Font" === t.Type ? (g && (t.ToUnicode = r(t.ToUnicode) + " 0 R"), t.FontDescriptor = r(t.FontDescriptor) + " 0 R", i = e(), n(C.convert(t))) : "FontDescriptor" === t.Type ? (t.FontFile2 = r(t.FontFile2) + " 0 R", i = e(), n(C.convert(t))) : (i = e(), n("<</Length1 " + t.length + ">>"), n("stream"), n(Array.isArray(t) || t.constructor === Uint8Array ? o(t) : t), n("endstream")), n("endobj"), i
						}
						var i, a, c, u, l, f, d, p, g = "MacRomanEncoding" === t;
						if (u = this.subset.encode(), d = {}, d = g ? u : this.rawData, l = {
								Type: "FontDescriptor",
								FontName: this.subset.postscriptName,
								FontFile2: d,
								FontBBox: this.bbox,
								Flags: this.flags,
								StemV: this.stemV,
								ItalicAngle: this.italicAngle,
								Ascent: this.ascender,
								Descent: this.decender,
								CapHeight: this.capHeight,
								XHeight: this.xHeight
							}, f = +Object.keys(this.subset.cmap)[0], 33 !== f && g) return !1;
						i = function() {
							var t, e;
							t = this.subset.cmap, e = [];
							for (c in t) Object.prototype.hasOwnProperty.call(t, c) && (p = t[c], e.push(Math.round(this.widthOfGlyph(p))));
							return e
						}.call(this), a = h(this.subset.subset);
						var m = g ? {
							Type: "Font",
							BaseFont: this.subset.postscriptName,
							Subtype: "TrueType",
							FontDescriptor: l,
							FirstChar: f,
							LastChar: f + i.length - 1,
							Widths: i,
							Encoding: t,
							ToUnicode: a
						} : {
							Type: "Font",
							BaseFont: this.subset.postscriptName,
							Subtype: "TrueType",
							FontDescriptor: l,
							FirstChar: 0,
							LastChar: 255,
							Widths: s(this),
							Encoding: t
						};
						return r(m)
					};
					var e = function(t) {
							function e(t) {
								c[u++] = t
							}
							var n, r, o, s, a, c;
							if (t.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
							var h = t.length;
							a = "=" === t.charAt(h - 2) ? 2 : "=" === t.charAt(h - 1) ? 1 : 0, c = new Uint8Array(3 * t.length / 4 - a), o = a > 0 ? t.length - 4 : t.length;
							var u = 0;
							for (n = 0, r = 0; o > n; n += 4, r += 3) s = i(t.charAt(n)) << 18 | i(t.charAt(n + 1)) << 12 | i(t.charAt(n + 2)) << 6 | i(t.charAt(n + 3)), e((16711680 & s) >> 16), e((65280 & s) >> 8), e(255 & s);
							return 2 === a ? (s = i(t.charAt(n)) << 2 | i(t.charAt(n + 1)) >> 4, e(255 & s)) : 1 === a && (s = i(t.charAt(n)) << 10 | i(t.charAt(n + 1)) << 4 | i(t.charAt(n + 2)) >> 2, e(s >> 8 & 255), e(255 & s)), c
						},
						i = function(t) {
							var e = "+".charCodeAt(0),
								n = "/".charCodeAt(0),
								r = "0".charCodeAt(0),
								i = "a".charCodeAt(0),
								o = "A".charCodeAt(0),
								s = "-".charCodeAt(0),
								a = "_".charCodeAt(0),
								c = t.charCodeAt(0);
							return c === e || c === s ? 62 : c === n || c === a ? 63 : r > c ? -1 : r + 10 > c ? c - r + 26 + 26 : o + 26 > c ? c - o : i + 26 > c ? c - i + 26 : void 0
						},
						o = function(t) {
							for (var e = [], n = 0, r = t.length; r > n; n++) e.push(String.fromCharCode(t[n]));
							return e.join("")
						},
						s = function(t) {
							for (var e = [], n = 0; 256 > n; n++) e[n] = 0;
							var r = 1e3 / t.head.unitsPerEm,
								i = t.cmap.unicode.codeMap,
								o = {
									402: 131,
									8211: 150,
									8212: 151,
									8216: 145,
									8217: 146,
									8218: 130,
									8220: 147,
									8221: 148,
									8222: 132,
									8224: 134,
									8225: 135,
									8226: 149,
									8230: 133,
									8364: 128,
									8240: 137,
									8249: 139,
									8250: 155,
									710: 136,
									8482: 153,
									338: 140,
									339: 156,
									732: 152,
									352: 138,
									353: 154,
									376: 159,
									381: 142,
									382: 158
								};
							return Object.keys(i).map(function(n) {
								var s = o[n],
									a = Math.round(t.hmtx.metrics[i[n]].advance * r);
								s ? e[s] = a : 256 > n && (e[n] = a)
							}), e
						},
						h = function(t) {
							var e, n, r, i, o, s, a;
							for (o = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange", n = Object.keys(t).sort(function(t, e) {
									return t - e
								}), r = [], s = 0, a = n.length; a > s; s++) e = n[s], r.length >= 100 && (o += "\n" + r.length + " beginbfchar\n" + r.join("\n") + "\nendbfchar", r = []), i = ("0000" + t[e].toString(16)).slice(-4), e = (+e).toString(16), r.push("<" + e + "><" + i + ">");
							return r.length && (o += "\n" + r.length + " beginbfchar\n" + r.join("\n") + "\nendbfchar\n"), o += "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"
						},
						d = function(t) {
							return t.split("").reverse().join("")
						};
					return t
				}(),
				n = function() {
					function t(t) {
						this.data = void 0 !== t ? t : [], this.pos = 0, this.length = this.data.length
					}
					return t.prototype.readByte = function() {
						return this.data[this.pos++]
					}, t.prototype.writeByte = function(t) {
						return this.data[this.pos++] = t, this
					}, t.prototype.readUInt32 = function() {
						var t, e, n, r;
						return t = 16777216 * this.readByte(), e = this.readByte() << 16, n = this.readByte() << 8, r = this.readByte(), t + e + n + r
					}, t.prototype.writeUInt32 = function(t) {
						return this.writeByte(t >>> 24 & 255), this.writeByte(t >> 16 & 255), this.writeByte(t >> 8 & 255), this.writeByte(255 & t)
					}, t.prototype.readInt32 = function() {
						var t;
						return t = this.readUInt32(), t >= 2147483648 ? t - 4294967296 : t
					}, t.prototype.writeInt32 = function(t) {
						return 0 > t && (t += 4294967296), this.writeUInt32(t)
					}, t.prototype.readUInt16 = function() {
						var t, e;
						return t = this.readByte() << 8, e = this.readByte(), t | e
					}, t.prototype.writeUInt16 = function(t) {
						return this.writeByte(t >> 8 & 255), this.writeByte(255 & t)
					}, t.prototype.readInt16 = function() {
						var t;
						return t = this.readUInt16(), t >= 32768 ? t - 65536 : t
					}, t.prototype.writeInt16 = function(t) {
						return 0 > t && (t += 65536), this.writeUInt16(t)
					}, t.prototype.readString = function(t) {
						var e, n, r;
						for (n = [], e = r = 0; t >= 0 ? t > r : r > t; e = t >= 0 ? ++r : --r) n[e] = String.fromCharCode(this.readByte());
						return n.join("")
					}, t.prototype.writeString = function(t) {
						var e, n, r, i;
						for (i = [], e = n = 0, r = t.length; r >= 0 ? r > n : n > r; e = r >= 0 ? ++n : --n) i.push(this.writeByte(t.charCodeAt(e)));
						return i
					}, t.prototype.stringAt = function(t, e) {
						return this.pos = t, this.readString(e)
					}, t.prototype.readShort = function() {
						return this.readInt16()
					}, t.prototype.writeShort = function(t) {
						return this.writeInt16(t)
					}, t.prototype.readLongLong = function() {
						var t, e, n, r, i, o, s, a;
						return t = this.readByte(), e = this.readByte(), n = this.readByte(), r = this.readByte(), i = this.readByte(), o = this.readByte(), s = this.readByte(), a = this.readByte(), 128 & t ? -1 * (72057594037927940 * (255 ^ t) + 281474976710656 * (255 ^ e) + 1099511627776 * (255 ^ n) + 4294967296 * (255 ^ r) + 16777216 * (255 ^ i) + 65536 * (255 ^ o) + 256 * (255 ^ s) + (255 ^ a) + 1) : 72057594037927940 * t + 281474976710656 * e + 1099511627776 * n + 4294967296 * r + 16777216 * i + 65536 * o + 256 * s + a
					}, t.prototype.writeLongLong = function(t) {
						var e, n;
						return e = Math.floor(t / 4294967296), n = 4294967295 & t, this.writeByte(e >> 24 & 255), this.writeByte(e >> 16 & 255), this.writeByte(e >> 8 & 255), this.writeByte(255 & e), this.writeByte(n >> 24 & 255), this.writeByte(n >> 16 & 255), this.writeByte(n >> 8 & 255), this.writeByte(255 & n)
					}, t.prototype.readInt = function() {
						return this.readInt32()
					}, t.prototype.writeInt = function(t) {
						return this.writeInt32(t)
					}, t.prototype.slice = function(t, e) {
						return this.data.slice(t, e)
					}, t.prototype.read = function(t) {
						var e, n, r;
						for (e = [], n = r = 0; t >= 0 ? t > r : r > t; n = t >= 0 ? ++r : --r) e.push(this.readByte());
						return e
					}, t.prototype.write = function(t) {
						var e, n, r, i;
						for (i = [], n = 0, r = t.length; r > n; n++) e = t[n], i.push(this.writeByte(e));
						return i
					}, t
				}(),
				r = function() {
					function t(t) {
						var e, n, r, i;
						for (this.scalarType = t.readInt(), this.tableCount = t.readShort(), this.searchRange = t.readShort(), this.entrySelector = t.readShort(), this.rangeShift = t.readShort(), this.tables = {}, n = r = 0, i = this.tableCount; i >= 0 ? i > r : r > i; n = i >= 0 ? ++r : --r) e = {
							tag: t.readString(4),
							checksum: t.readInt(),
							offset: t.readInt(),
							length: t.readInt()
						}, this.tables[e.tag] = e
					}
					var e;
					return t.prototype.encode = function(t) {
						var r, i, o, s, a, c, h, u, l, f, d, p, g, m;
						p = Object.keys(t).length, c = Math.log(2), l = 16 * Math.floor(Math.log(p) / c), s = Math.floor(l / c), u = 16 * p - l, i = new n, i.writeInt(this.scalarType), i.writeShort(p), i.writeShort(l), i.writeShort(s), i.writeShort(u), o = 16 * p, h = i.pos + o, a = null, g = [];
						for (m in t)
							if (Object.prototype.hasOwnProperty.call(t, m))
								for (d = t[m], i.writeString(m), i.writeInt(e(d)), i.writeInt(h), i.writeInt(d.length), g = g.concat(d), "head" === m && (a = h), h += d.length; h % 4;) g.push(0), h++;
						return i.write(g), f = e(i.data), r = 2981146554 - f, i.pos = a + 8, i.writeUInt32(r), i.data
					}, e = function(t) {
						var e, r, o, s, a;
						for (t = i.call(t); t.length % 4;) t.push(0);
						for (o = new n(t), r = 0, e = s = 0, a = t.length; a > s; e = s += 4) r += o.readUInt32();
						return 4294967295 & r
					}, t
				}(),
				i = [].slice,
				o = function(t, e) {
					function n() {
						this.constructor = t
					}
					for (var r in e)({}).hasOwnProperty.call(e, r) && (t[r] = e[r]);
					return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
				},
				s = function() {
					function t(t) {
						var e;
						this.file = t, e = this.file.directory.tables[this.tag], this.exists = !!e, e && (this.offset = e.offset, this.length = e.length, this.parse(this.file.contents))
					}
					return t.prototype.parse = function() {}, t.prototype.encode = function() {}, t.prototype.raw = function() {
						return this.exists ? (this.file.contents.pos = this.offset, this.file.contents.read(this.length)) : null
					}, t
				}(),
				a = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "head", e.prototype.parse = function(t) {
						return t.pos = this.offset, this.version = t.readInt(), this.revision = t.readInt(), this.checkSumAdjustment = t.readInt(), this.magicNumber = t.readInt(), this.flags = t.readShort(), this.unitsPerEm = t.readShort(), this.created = t.readLongLong(), this.modified = t.readLongLong(), this.xMin = t.readShort(), this.yMin = t.readShort(), this.xMax = t.readShort(), this.yMax = t.readShort(), this.macStyle = t.readShort(), this.lowestRecPPEM = t.readShort(), this.fontDirectionHint = t.readShort(), this.indexToLocFormat = t.readShort(), this.glyphDataFormat = t.readShort(), this
					}, e.prototype.encode = function(t) {
						var e;
						return e = new n, e.writeInt(this.version), e.writeInt(this.revision), e.writeInt(this.checkSumAdjustment), e.writeInt(this.magicNumber), e.writeShort(this.flags), e.writeShort(this.unitsPerEm), e.writeLongLong(this.created), e.writeLongLong(this.modified), e.writeShort(this.xMin), e.writeShort(this.yMin), e.writeShort(this.xMax), e.writeShort(this.yMax), e.writeShort(this.macStyle), e.writeShort(this.lowestRecPPEM), e.writeShort(this.fontDirectionHint), e.writeShort(t.type), e.writeShort(this.glyphDataFormat), e.data
					}, e
				}(s),
				c = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "cmap", e.prototype.parse = function(t) {
						var e, n, r, i;
						for (t.pos = this.offset, this.version = t.readUInt16(), r = t.readUInt16(), this.tables = [], n = i = 0; r >= 0 ? r > i : i > r; n = r >= 0 ? ++i : --i) e = new h(t, this.offset), this.tables.push(e), e.isUnicode && void 0 === this.unicode && (this.unicode = e);
						return !0
					}, e.encode = function(t, e) {
						var r, i;
						return void 0 === e && (e = "macroman"), r = h.encode(t, e), i = new n, i.writeUInt16(0), i.writeUInt16(1), r.table = i.data.concat(r.subtable), r
					}, e
				}(s),
				h = function() {
					function t(t, e) {
						var n, r, i, o, s, a, c, h, u, l, f, d, p, g, m, y, w, v, b;
						switch (this.platformID = t.readUInt16(), this.encodingID = t.readShort(), this.offset = e + t.readInt(), l = t.pos, t.pos = this.offset, this.format = t.readUInt16(), this.length = t.readUInt16(), this.language = t.readUInt16(), this.isUnicode = 3 === this.platformID && 1 === this.encodingID && 4 === this.format || 0 === this.platformID && 4 === this.format, this.codeMap = {}, this.format) {
							case 0:
								for (a = y = 0; 256 > y; a = ++y) this.codeMap[a] = t.readByte();
								break;
							case 4:
								for (d = t.readUInt16(), f = d / 2, t.pos += 6, i = function() {
										var e, n;
										for (n = [], a = e = 0; f >= 0 ? f > e : e > f; a = f >= 0 ? ++e : --e) n.push(t.readUInt16());
										return n
									}(), t.pos += 2, g = function() {
										var e, n;
										for (n = [], a = e = 0; f >= 0 ? f > e : e > f; a = f >= 0 ? ++e : --e) n.push(t.readUInt16());
										return n
									}(), c = function() {
										var e, n;
										for (n = [], a = e = 0; f >= 0 ? f > e : e > f; a = f >= 0 ? ++e : --e) n.push(t.readUInt16());
										return n
									}(), h = function() {
										var e, n;
										for (n = [], a = e = 0; f >= 0 ? f > e : e > f; a = f >= 0 ? ++e : --e) n.push(t.readUInt16());
										return n
									}(), r = (this.length - t.pos + this.offset) / 2, s = function() {
										var e, n;
										for (n = [], a = e = 0; r >= 0 ? r > e : e > r; a = r >= 0 ? ++e : --e) n.push(t.readUInt16());
										return n
									}(), a = w = 0, b = i.length; b > w; a = ++w)
									for (m = i[a], p = g[a], n = v = p; m >= p ? m >= v : v >= m; n = m >= p ? ++v : --v) 0 === h[a] ? o = n + c[a] : (u = h[a] / 2 + (n - p) - (f - a), o = s[u] || 0, 0 !== o && (o += c[a])), this.codeMap[n] = 65535 & o
						}
						t.pos = l
					}
					return t.encode = function(t, e) {
						var r, i, o, s, a, c, h, u, l, f, d, p, g, m, y, w, v, b, x, S, k, I, C, A, _, q, T, P, E, O, F, B, R, D, j, M, N, L, z, U, H, W, X, G, V, Y, J;
						switch (E = new n, s = Object.keys(t).sort(function(t, e) {
							return t - e
						}), e) {
							case "macroman":
								for (g = 0, m = function() {
										var t, e;
										for (e = [], p = t = 0; 256 > t; p = ++t) e.push(0);
										return e
									}(), w = {
										0: 0
									}, o = {}, O = 0, D = s.length; D > O; O++) i = s[O], void 0 === w[G = t[i]] && (w[G] = ++g), o[i] = {
									old: t[i],
									"new": w[t[i]]
								}, m[i] = w[t[i]];
								return E.writeUInt16(1), E.writeUInt16(0), E.writeUInt32(12), E.writeUInt16(0), E.writeUInt16(262), E.writeUInt16(0), E.write(m), I = {
									charMap: o,
									subtable: E.data,
									maxGlyphID: g + 1
								};
							case "unicode":
								for (T = [], l = [], v = 0, w = {}, r = {}, F = 0, j = s.length; j > F; F++) i = s[F], x = t[i], void 0 === w[x] && (w[x] = ++v), r[i] = {
									old: x,
									"new": w[x]
								}, a = w[x] - i, void 0 !== y && a === h || (y && l.push(y), T.push(i), h = a), y = i;
								for (y && l.push(y), l.push(65535), T.push(65535), A = T.length, _ = 2 * A, C = 2 * Math.pow(Math.log(A) / Math.LN2, 2), f = Math.log(C / 2) / Math.LN2, k = 2 * A - C, c = [], S = [], d = [], p = B = 0, M = T.length; M > B; p = ++B) {
									if (q = T[p], u = l[p], 65535 === q) {
										c.push(0), S.push(0);
										break
									}
									if (P = r[q]["new"], q - P >= 32768)
										for (c.push(0), S.push(2 * (d.length + A - p)), i = R = q; u >= q ? u >= R : R >= u; i = u >= q ? ++R : --R) d.push(r[i]["new"]);
									else c.push(P - q), S.push(0)
								}
								for (E.writeUInt16(3), E.writeUInt16(1), E.writeUInt32(12), E.writeUInt16(4), E.writeUInt16(16 + 8 * A + 2 * d.length), E.writeUInt16(0), E.writeUInt16(_), E.writeUInt16(C), E.writeUInt16(f), E.writeUInt16(k), W = 0, N = l.length; N > W; W++) i = l[W], E.writeUInt16(i);
								for (E.writeUInt16(0), X = 0, L = T.length; L > X; X++) i = T[X], E.writeUInt16(i);
								for (V = 0, z = c.length; z > V; V++) a = c[V], E.writeUInt16(a);
								for (Y = 0, U = S.length; U > Y; Y++) b = S[Y], E.writeUInt16(b);
								for (J = 0, H = d.length; H > J; J++) g = d[J], E.writeUInt16(g);
								return I = {
									charMap: r,
									subtable: E.data,
									maxGlyphID: v + 1
								}
						}
					}, t
				}(),
				u = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "hhea", e.prototype.parse = function(t) {
						return t.pos = this.offset, this.version = t.readInt(), this.ascender = t.readShort(), this.decender = t.readShort(), this.lineGap = t.readShort(), this.advanceWidthMax = t.readShort(), this.minLeftSideBearing = t.readShort(), this.minRightSideBearing = t.readShort(), this.xMaxExtent = t.readShort(), this.caretSlopeRise = t.readShort(), this.caretSlopeRun = t.readShort(), this.caretOffset = t.readShort(), t.pos += 8, this.metricDataFormat = t.readShort(), this.numberOfMetrics = t.readUInt16(), this
					}, e.prototype.encode = function(t) {
						var e, r, i, o;
						for (r = new n, r.writeInt(this.version), r.writeShort(this.ascender), r.writeShort(this.decender), r.writeShort(this.lineGap), r.writeShort(this.advanceWidthMax), r.writeShort(this.minLeftSideBearing), r.writeShort(this.minRightSideBearing), r.writeShort(this.xMaxExtent), r.writeShort(this.caretSlopeRise), r.writeShort(this.caretSlopeRun), r.writeShort(this.caretOffset), e = i = 0, o = 8; o >= 0 ? o > i : i > o; e = o >= 0 ? ++i : --i) r.writeByte(0);
						return r.writeShort(this.metricDataFormat), r.writeUInt16(t.length), r.data
					}, e
				}(s),
				l = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "OS/2", e.prototype.parse = function(t) {
						var e;
						return t.pos = this.offset, this.version = t.readUInt16(), this.averageCharWidth = t.readShort(), this.weightClass = t.readUInt16(), this.widthClass = t.readUInt16(), this.type = t.readShort(), this.ySubscriptXSize = t.readShort(), this.ySubscriptYSize = t.readShort(), this.ySubscriptXOffset = t.readShort(), this.ySubscriptYOffset = t.readShort(), this.ySuperscriptXSize = t.readShort(), this.ySuperscriptYSize = t.readShort(), this.ySuperscriptXOffset = t.readShort(), this.ySuperscriptYOffset = t.readShort(), this.yStrikeoutSize = t.readShort(), this.yStrikeoutPosition = t.readShort(), this.familyClass = t.readShort(), this.panose = function() {
							var n, r;
							for (r = [], e = n = 0; 10 > n; e = ++n) r.push(t.readByte());
							return r
						}(), this.charRange = function() {
							var n, r;
							for (r = [], e = n = 0; 4 > n; e = ++n) r.push(t.readInt());
							return r
						}(), this.vendorID = t.readString(4), this.selection = t.readShort(), this.firstCharIndex = t.readShort(), this.lastCharIndex = t.readShort(), this.version > 0 && (this.ascent = t.readShort(), this.descent = t.readShort(), this.lineGap = t.readShort(), this.winAscent = t.readShort(), this.winDescent = t.readShort(), this.codePageRange = function() {
							var n, r;
							for (r = [], e = n = 0; 2 > n; e = ++n) r.push(t.readInt());
							return r
						}(), this.version > 1) ? (this.xHeight = t.readShort(), this.capHeight = t.readShort(), this.defaultChar = t.readShort(), this.breakChar = t.readShort(), this.maxContext = t.readShort(), this) : void 0
					}, e.prototype.encode = function() {
						return this.raw()
					}, e
				}(s),
				f = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					var r;
					return o(e, t), e.prototype.tag = "post", e.prototype.parse = function(t) {
						var e, n, r, i, o;
						switch (t.pos = this.offset, this.format = t.readInt(), this.italicAngle = t.readInt(), this.underlinePosition = t.readShort(), this.underlineThickness = t.readShort(), this.isFixedPitch = t.readInt(), this.minMemType42 = t.readInt(), this.maxMemType42 = t.readInt(), this.minMemType1 = t.readInt(), this.maxMemType1 = t.readInt(), this.format) {
							case 65536:
								break;
							case 131072:
								for (r = t.readUInt16(), this.glyphNameIndex = [], e = i = 0; r >= 0 ? r > i : i > r; e = r >= 0 ? ++i : --i) this.glyphNameIndex.push(t.readUInt16());
								for (this.names = [], o = []; t.pos < this.offset + this.length;) n = t.readByte(), o.push(this.names.push(t.readString(n)));
								return o;
							case 151552:
								return r = t.readUInt16(), this.offsets = t.read(r), this.offsets;
							case 196608:
								break;
							case 262144:
								return this.map = function() {
									var n, r, i;
									for (i = [], e = n = 0, r = this.file.maxp.numGlyphs; r >= 0 ? r > n : n > r; e = r >= 0 ? ++n : --n) i.push(t.readUInt32());
									return i
								}.call(this), this.map
						}
					}, e.prototype.glyphFor = function(t) {
						var e;
						switch (this.format) {
							case 65536:
								return r[t] || ".notdef";
							case 131072:
								return e = this.glyphNameIndex[t], 257 >= e ? r[e] : this.names[e - 258] || ".notdef";
							case 151552:
								return r[t + this.offsets[t]] || ".notdef";
							case 196608:
								return ".notdef";
							case 262144:
								return this.map[t] || 65535
						}
					}, e.prototype.encode = function(t) {
						var e, i, o, s, a, c, h, u, l, f, d, p, g, m, y;
						if (!this.exists) return null;
						if (c = this.raw(), 196608 === this.format) return c;
						for (l = new n(c.slice(0, 32)), l.writeUInt32(131072), l.pos = 32, o = [], u = [], f = 0, g = t.length; g > f; f++) e = t[f], a = this.glyphFor(e), s = r.indexOf(a), -1 !== s ? o.push(s) : (o.push(257 + u.length), u.push(a));
						for (l.writeUInt16(Object.keys(t).length), d = 0, m = o.length; m > d; d++) i = o[d], l.writeUInt16(i);
						for (p = 0, y = u.length; y > p; p++) h = u[p], l.writeByte(h.length), l.writeString(h);
						return l.data
					}, r = ".notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat".split(/\s+/g), e
				}(s),
				d = function() {
					function t(t, e) {
						this.raw = t, this.length = t.length, this.platformID = e.platformID, this.encodingID = e.encodingID, this.languageID = e.languageID
					}
					return t
				}(),
				p = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					var r;
					return o(e, t), e.prototype.tag = "name", e.prototype.parse = function(t) {
						var e, n, r, i, o, s, a, c, h, u, l, f, p;
						for (t.pos = this.offset, i = t.readShort(), e = t.readShort(), a = t.readShort(), n = [], o = u = 0; e >= 0 ? e > u : u > e; o = e >= 0 ? ++u : --u) n.push({
							platformID: t.readShort(),
							encodingID: t.readShort(),
							languageID: t.readShort(),
							nameID: t.readShort(),
							length: t.readShort(),
							offset: this.offset + a + t.readShort()
						});
						for (c = {}, o = l = 0, f = n.length; f > l; o = ++l) r = n[o], t.pos = r.offset, h = t.readString(r.length), s = new d(h, r), void 0 === c[p = r.nameID] && (c[p] = []), c[r.nameID].push(s);
						return this.strings = c, this.copyright = c[0], this.fontFamily = c[1], this.fontSubfamily = c[2], this.uniqueSubfamily = c[3], this.fontName = c[4], this.version = c[5], this.postscriptName = c[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, ""), this.trademark = c[7], this.manufacturer = c[8], this.designer = c[9], this.description = c[10], this.vendorUrl = c[11], this.designerUrl = c[12], this.license = c[13], this.licenseUrl = c[14], this.preferredFamily = c[15], this.preferredSubfamily = c[17], this.compatibleFull = c[18], this.sampleText = c[19], this
					}, r = "AAAAAA", e.prototype.encode = function() {
						var t, e, i, o, s, a, c, h, u, l, f, p, m, y;
						u = {}, y = this.strings;
						for (t in y) Object.prototype.hasOwnProperty.call(y, t) && (f = y[t], u[t] = f);
						s = new d("" + r + "+" + this.postscriptName, {
							platformID: 1,
							encodingID: 0,
							languageID: 0
						}), u[6] = [s], r = g(r), a = 0;
						for (t in u) Object.prototype.hasOwnProperty.call(u, t) && (e = u[t], null !== e && (a += e.length));
						l = new n, c = new n, l.writeShort(0), l.writeShort(a), l.writeShort(6 + 12 * a);
						for (i in u)
							if (Object.prototype.hasOwnProperty.call(u, i) && (e = u[i], null !== e))
								for (p = 0, m = e.length; m > p; p++) h = e[p], l.writeShort(h.platformID), l.writeShort(h.encodingID), l.writeShort(h.languageID), l.writeShort(i), l.writeShort(h.length), l.writeShort(c.pos), c.writeString(h.raw);
						return o = {
							postscriptName: s.raw,
							table: l.data.concat(c.data)
						}
					}, e
				}(s),
				g = function(t) {
					var e, n, r, i, o, s, a, c, h, u;
					for (n = "abcdefghijklmnopqrstuvwxyz", c = n.length, u = t, i = t.length; i >= 0;) {
						if (a = t.charAt(--i), isNaN(a)) {
							if (o = n.indexOf(a.toLowerCase()), -1 === o) h = a, r = !0;
							else if (h = n.charAt((o + 1) % c), s = a === a.toUpperCase(), s && (h = h.toUpperCase()), r = o + 1 >= c, r && 0 === i) {
								e = s ? "A" : "a", u = e + h + u.slice(1);
								break
							}
						} else if (h = +a + 1, r = h > 9, r && (h = 0), r && 0 === i) {
							u = "1" + h + u.slice(1);
							break
						}
						if (u = u.slice(0, i) + h + u.slice(i + 1), !r) break
					}
					return u
				},
				m = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "maxp", e.prototype.parse = function(t) {
						return t.pos = this.offset, this.version = t.readInt(), this.numGlyphs = t.readUInt16(), this.maxPoints = t.readUInt16(), this.maxContours = t.readUInt16(), this.maxCompositePoints = t.readUInt16(), this.maxComponentContours = t.readUInt16(), this.maxZones = t.readUInt16(), this.maxTwilightPoints = t.readUInt16(), this.maxStorage = t.readUInt16(), this.maxFunctionDefs = t.readUInt16(), this.maxInstructionDefs = t.readUInt16(), this.maxStackElements = t.readUInt16(), this.maxSizeOfInstructions = t.readUInt16(), this.maxComponentElements = t.readUInt16(), this.maxComponentDepth = t.readUInt16(), this
					}, e.prototype.encode = function(t) {
						var e;
						return e = new n, e.writeInt(this.version), e.writeUInt16(t.length), e.writeUInt16(this.maxPoints), e.writeUInt16(this.maxContours), e.writeUInt16(this.maxCompositePoints), e.writeUInt16(this.maxComponentContours), e.writeUInt16(this.maxZones), e.writeUInt16(this.maxTwilightPoints), e.writeUInt16(this.maxStorage), e.writeUInt16(this.maxFunctionDefs), e.writeUInt16(this.maxInstructionDefs), e.writeUInt16(this.maxStackElements), e.writeUInt16(this.maxSizeOfInstructions), e.writeUInt16(this.maxComponentElements), e.writeUInt16(this.maxComponentDepth), e.data
					}, e
				}(s),
				y = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "hmtx", e.prototype.parse = function(t) {
						var e, n, r, i, o, s, a, c;
						for (t.pos = this.offset, this.metrics = [], e = o = 0, a = this.file.hhea.numberOfMetrics; a >= 0 ? a > o : o > a; e = a >= 0 ? ++o : --o) this.metrics.push({
							advance: t.readUInt16(),
							lsb: t.readInt16()
						});
						for (r = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics, this.leftSideBearings = function() {
								var n, i;
								for (i = [], e = n = 0; r >= 0 ? r > n : n > r; e = r >= 0 ? ++n : --n) i.push(t.readInt16());
								return i
							}(), this.widths = function() {
								var t, e, n, r;
								for (n = this.metrics, r = [], t = 0, e = n.length; e > t; t++) i = n[t], r.push(i.advance);
								return r
							}.call(this), n = this.widths[this.widths.length - 1], c = [], e = s = 0; r >= 0 ? r > s : s > r; e = r >= 0 ? ++s : --s) c.push(this.widths.push(n));
						return c
					}, e.prototype.forGlyph = function(t) {
						var e;
						return t in this.metrics ? this.metrics[t] : e = {
							advance: this.metrics[this.metrics.length - 1].advance,
							lsb: this.leftSideBearings[t - this.metrics.length]
						}
					}, e.prototype.encode = function(t) {
						var e, r, i, o, s;
						for (i = new n, o = 0, s = t.length; s > o; o++) e = t[o], r = this.forGlyph(e), i.writeUInt16(r.advance), i.writeUInt16(r.lsb);
						return i.data
					}, e
				}(s),
				w = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "glyf", e.prototype.parse = function(t) {
						return this.cache = {}, this.cache
					}, e.prototype.glyphFor = function(t) {
						var e, r, i, o, s, a, c, h, u, l;
						return t in this.cache ? this.cache[t] : (o = this.file.loca, e = this.file.contents, r = o.indexOf(t), i = o.lengthOf(t), 0 === i ? (this.cache[t] = null, this.cache[t]) : (e.pos = this.offset + r, a = new n(e.read(i)), s = a.readShort(), h = a.readShort(), l = a.readShort(), c = a.readShort(), u = a.readShort(), -1 === s ? this.cache[t] = new b(a, h, l, c, u) : this.cache[t] = new v(a, s, h, l, c, u), this.cache[t]))
					}, e.prototype.encode = function(t, e, n) {
						var r, i, o, s, a, c;
						for (s = [], o = [], a = 0, c = e.length; c > a; a++) i = e[a], r = t[i], o.push(s.length), r && (s = s.concat(r.encode(n)));
						return o.push(s.length), {
							table: s,
							offsets: o
						}
					}, e
				}(s),
				v = function() {
					function t(t, e, n, r, i, o) {
						this.raw = t, this.numberOfContours = e, this.xMin = n, this.yMin = r, this.xMax = i, this.yMax = o, this.compound = !1
					}
					return t.prototype.encode = function() {
						return this.raw.data
					}, t
				}(),
				b = function() {
					function t(t, n, i, c, h) {
						var u, l;
						for (this.raw = t, this.xMin = n, this.yMin = i, this.xMax = c, this.yMax = h, this.compound = !0, this.glyphIDs = [], this.glyphOffsets = [], u = this.raw;;) {
							if (l = u.readShort(), this.glyphOffsets.push(u.pos), this.glyphIDs.push(u.readShort()), !(l & r)) break;
							l & e ? u.pos += 4 : u.pos += 2, l & a ? u.pos += 8 : l & o ? u.pos += 4 : l & s && (u.pos += 2)
						}
					}
					var e, r, o, s, a, c;
					return e = 1, s = 8, r = 32, o = 64, a = 128, c = 256, t.prototype.encode = function(t) {
						var e, r, o, s, a, c;
						for (o = new n(i.call(this.raw.data)), c = this.glyphIDs, e = s = 0, a = c.length; a > s; e = ++s) r = c[e], o.pos = this.glyphOffsets[e], o.writeShort(t[r]);
						return o.data
					}, t
				}(),
				x = function(t) {
					function e() {
						return e.__super__.constructor.apply(this, arguments)
					}
					return o(e, t), e.prototype.tag = "loca", e.prototype.parse = function(t) {
						var e, n;
						return t.pos = this.offset, e = this.file.head.indexToLocFormat, 0 === e ? (this.offsets = function() {
							var e, r, i;
							for (i = [], n = e = 0, r = this.length; r > e; n = e += 2) i.push(2 * t.readUInt16());
							return i
						}.call(this), this) : (this.offsets = function() {
							var e, r, i;
							for (i = [], n = e = 0, r = this.length; r > e; n = e += 4) i.push(t.readUInt32());
							return i
						}.call(this), this)
					}, e.prototype.indexOf = function(t) {
						return this.offsets[t]
					}, e.prototype.lengthOf = function(t) {
						return this.offsets[t + 1] - this.offsets[t]
					}, e.prototype.encode = function(t) {
						var e, r, i, o, s, a, c, h, u, l, f;
						for (o = new n, s = 0, h = t.length; h > s; s++)
							if (r = t[s], r > 65535) {
								for (f = this.offsets, a = 0, u = f.length; u > a; a++) e = f[a], o.writeUInt32(e);
								return i = {
									format: 1,
									table: o.data
								}
							}
						for (c = 0, l = t.length; l > c; c++) e = t[c], o.writeUInt16(e / 2);
						return i = {
							format: 0,
							table: o.data
						}
					}, e
				}(s),
				S = function() {
					function t(t) {
						this.font = t, this.subset = {}, this.unicodes = {}, this.unicodeCmap = {}, this.next = 33
					}
					return t.prototype.use = function(t) {
						var e, n, r; {
							if ("string" != typeof t) return this.unicodes[t] ? void 0 : (this.subset[this.next] = t, this.unicodes[t] = this.next++, this);
							for (e = n = 0, r = t.length; r >= 0 ? r > n : n > r; e = r >= 0 ? ++n : --n) this.use(t.charCodeAt(e))
						}
					}, t.prototype.encodeText = function(t) {
						var e, n, r, i, o;
						for (r = "", n = i = 0, o = t.length; o >= 0 ? o > i : i > o; n = o >= 0 ? ++i : --i) e = this.unicodes[t.charCodeAt(n)], r += String.fromCharCode(e);
						return r
					}, t.prototype.generateCmap = function() {
						var t, e, n, r, i;
						r = this.font.cmap.tables[0].codeMap, t = {}, i = this.subset;
						for (e in i) Object.prototype.hasOwnProperty.call(i, e) && (n = i[e], t[e] = r[n]);
						return t
					}, t.prototype.glyphIDs = function() {
						var t, e, n, r, i, o;
						r = this.font.cmap.tables[0].codeMap, t = [0], o = this.subset;
						for (e in o) Object.prototype.hasOwnProperty.call(o, e) && (n = o[e], i = r[n], null !== i && k.call(t, i) < 0 && t.push(i));
						return t.sort()
					}, t.prototype.glyphsFor = function(t) {
						var e, n, r, i, o, s, a;
						for (r = {}, o = 0, s = t.length; s > o; o++) i = t[o], r[i] = this.font.glyf.glyphFor(i);
						e = [];
						for (i in r) Object.prototype.hasOwnProperty.call(r, i) && (n = r[i], (null !== n ? n.compound : void 0) && e.push.apply(e, n.glyphIDs));
						if (e.length > 0) {
							a = this.glyphsFor(e);
							for (i in a) Object.prototype.hasOwnProperty.call(a, i) && (n = a[i], r[i] = n)
						}
						return r
					}, t.prototype.encode = function() {
						var t, e, n, r, i, o, s, a, h, u, l, f, d, p, g, m, y;
						t = c.encode(this.generateCmap(), "unicode"), r = this.glyphsFor(this.glyphIDs()), f = {
							0: 0
						}, m = t.charMap;
						for (e in m) Object.prototype.hasOwnProperty.call(m, e) && (o = m[e], f[o.old] = o["new"]);
						l = t.maxGlyphID;
						for (d in r) d in f || (f[d] = l++);
						h = I(f), u = Object.keys(h).sort(function(t, e) {
							return t - e
						}), p = function() {
							var t, e, n;
							for (n = [], t = 0, e = u.length; e > t; t++) i = u[t], n.push(h[i]);
							return n
						}(), n = this.font.glyf.encode(r, p, f), s = this.font.loca.encode(n.offsets), a = this.font.name.encode(), this.postscriptName = a.postscriptName, this.cmap = {}, y = t.charMap;
						for (e in y) Object.prototype.hasOwnProperty.call(y, e) && (o = y[e], this.cmap[e] = o.old);
						return g = {
							cmap: t.table,
							glyf: n.table,
							loca: s.table,
							hmtx: this.font.hmtx.encode(p),
							hhea: this.font.hhea.encode(p),
							maxp: this.font.maxp.encode(p),
							post: this.font.post.encode(p),
							name: a.table,
							head: this.font.head.encode(s)
						}, this.font.os2.exists && (g["OS/2"] = this.font.os2.raw()), this.font.directory.encode(g)
					}, t
				}(),
				k = [].indexOf || function(t) {
					for (var e = 0, n = this.length; n > e; e++)
						if (e in this && this[e] === t) return e;
					return -1
				},
				I = function(t) {
					var e, n, r;
					n = {};
					for (e in t) Object.prototype.hasOwnProperty.call(t, e) && (r = t[e], n[r] = e);
					return n
				},
				C = function() {
					function t() {}
					var e;
					return e = function(t, e) {
						return (Array(e + 1).join("0") + t).slice(-e)
					}, t.convert = function(n) {
						var r, i, o, s, a;
						if (Array.isArray(n)) return i = function() {
							var e, i, o;
							for (o = [],
								e = 0, i = n.length; i > e; e++) r = n[e], o.push(t.convert(r));
							return o
						}().join(" "), "[" + i + "]";
						if ("string" == typeof n) return -1 === n.indexOf(" 0 R") ? "/" + n : n;
						if (void 0 !== n ? n.isString : void 0) return "(" + n + ")";
						if (n instanceof Date) return "(D:" + e(n.getUTCFullYear(), 4) + e(n.getUTCMonth(), 2) + e(n.getUTCDate(), 2) + e(n.getUTCHours(), 2) + e(n.getUTCMinutes(), 2) + e(n.getUTCSeconds(), 2) + "Z)";
						if ("[object Object]" === {}.toString.call(n)) {
							s = ["<<"];
							for (o in n) Object.prototype.hasOwnProperty.call(n, o) && (a = n[o], s.push("/" + o + " " + t.convert(a)));
							return s.push(">>"), s.join("\n")
						}
						return "" + n
					}, t
				}();
			t.events.push(["addFont", function(n) {
				t.existsFileInVFS(n.postScriptName) && (n.metadata = e.open(n.postScriptName, n.fontName, t.getFileFromVFS(n.postScriptName), n.encoding), n.encoding = n.metadata.hmtx.widths.length < 500 && n.metadata.capHeight < 800 ? "WinAnsiEncoding" : "MacRomanEncoding")
			}])
		}(e.API),
		function(t) {
			var e = {};
			t.existsFileInVFS = function(t) {
				return e.hasOwnProperty(t)
			}, t.addFileToVFS = function(t, n) {
				return e[t] = n, this
			}, t.getFileFromVFS = function(t) {
				return e.hasOwnProperty(t) ? e[t] : null
			}
		}(e.API),
		function(t) {
			if (t.URL = t.URL || t.webkitURL, t.Blob && t.URL) try {
				return void new Blob
			} catch (e) {}
			var n = t.BlobBuilder || t.WebKitBlobBuilder || t.MozBlobBuilder || function(t) {
				var e = function(t) {
						return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1]
					},
					n = function() {
						this.data = []
					},
					r = function(t, e, n) {
						this.data = t, this.size = t.length, this.type = e, this.encoding = n
					},
					i = n.prototype,
					o = r.prototype,
					s = t.FileReaderSync,
					a = function(t) {
						this.code = this[this.name = t]
					},
					c = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
					h = c.length,
					u = t.URL || t.webkitURL || t,
					l = u.createObjectURL,
					f = u.revokeObjectURL,
					d = u,
					p = t.btoa,
					g = t.atob,
					m = t.ArrayBuffer,
					y = t.Uint8Array,
					w = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
				for (r.fake = o.fake = !0; h--;) a.prototype[c[h]] = h + 1;
				return u.createObjectURL || (d = t.URL = function(t) {
					var e, n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
					return n.href = t, "origin" in n || ("data:" === n.protocol.toLowerCase() ? n.origin = null : (e = t.match(w), n.origin = e && e[1])), n
				}), d.createObjectURL = function(t) {
					var e, n = t.type;
					return null === n && (n = "application/octet-stream"), t instanceof r ? (e = "data:" + n, "base64" === t.encoding ? e + ";base64," + t.data : "URI" === t.encoding ? e + "," + decodeURIComponent(t.data) : p ? e + ";base64," + p(t.data) : e + "," + encodeURIComponent(t.data)) : l ? l.call(u, t) : void 0
				}, d.revokeObjectURL = function(t) {
					"data:" !== t.substring(0, 5) && f && f.call(u, t)
				}, i.append = function(t) {
					var n = this.data;
					if (y && (t instanceof m || t instanceof y)) {
						for (var i = "", o = new y(t), c = 0, h = o.length; h > c; c++) i += String.fromCharCode(o[c]);
						n.push(i)
					} else if ("Blob" === e(t) || "File" === e(t)) {
						if (!s) throw new a("NOT_READABLE_ERR");
						var u = new s;
						n.push(u.readAsBinaryString(t))
					} else t instanceof r ? "base64" === t.encoding && g ? n.push(g(t.data)) : "URI" === t.encoding ? n.push(decodeURIComponent(t.data)) : "raw" === t.encoding && n.push(t.data) : ("string" != typeof t && (t += ""), n.push(unescape(encodeURIComponent(t))))
				}, i.getBlob = function(t) {
					return arguments.length || (t = null), new r(this.data.join(""), t, "raw")
				}, i.toString = function() {
					return "[object BlobBuilder]"
				}, o.slice = function(t, e, n) {
					var i = arguments.length;
					return 3 > i && (n = null), new r(this.data.slice(t, i > 1 ? e : this.data.length), n, this.encoding)
				}, o.toString = function() {
					return "[object Blob]"
				}, o.close = function() {
					this.size = 0, delete this.data
				}, n
			}(t);
			t.Blob = function(t, e) {
				var r = e ? e.type || "" : "",
					i = new n;
				if (t)
					for (var o = 0, s = t.length; s > o; o++) Uint8Array && t[o] instanceof Uint8Array ? i.append(t[o].buffer) : i.append(t[o]);
				var a = i.getBlob(r);
				return !a.slice && a.webkitSlice && (a.slice = a.webkitSlice), a
			};
			var r = Object.getPrototypeOf || function(t) {
				return t.__proto__
			};
			t.Blob.prototype = r(new t.Blob)
		}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this);
	var r = r || function(t) {
		if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
			var e = t.document,
				n = function() {
					return t.URL || t.webkitURL || t
				},
				r = e.createElementNS("http://www.w3.org/1999/xhtml", "a"),
				i = "download" in r,
				o = function(t) {
					var e = new MouseEvent("click");
					t.dispatchEvent(e)
				},
				s = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
				a = t.webkitRequestFileSystem,
				c = t.requestFileSystem || a || t.mozRequestFileSystem,
				h = function(e) {
					(t.setImmediate || t.setTimeout)(function() {
						throw e
					}, 0)
				},
				u = "application/octet-stream",
				l = 0,
				f = 500,
				d = function(e) {
					var r = function() {
						"string" == typeof e ? n().revokeObjectURL(e) : e.remove()
					};
					t.chrome ? r() : setTimeout(r, f)
				},
				p = function(t, e, n) {
					e = [].concat(e);
					for (var r = e.length; r--;) {
						var i = t["on" + e[r]];
						if ("function" == typeof i) try {
							i.call(t, n || t)
						} catch (o) {
							h(o)
						}
					}
				},
				g = function(t) {
					return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob(["\ufeff", t], {
						type: t.type
					}) : t
				},
				m = function(e, h, f) {
					f || (e = g(e));
					var m, y, w, v = this,
						b = e.type,
						x = !1,
						S = function() {
							p(v, "writestart progress write writeend".split(" "))
						},
						k = function() {
							if (y && s && "undefined" != typeof FileReader) {
								var r = new FileReader;
								return r.onloadend = function() {
									var t = r.result;
									y.location.href = "data:attachment/file" + t.slice(t.search(/[,;]/)), v.readyState = v.DONE, S()
								}, r.readAsDataURL(e), void(v.readyState = v.INIT)
							}
							if (!x && m || (m = n().createObjectURL(e)), y) y.location.href = m;
							else {
								var i = t.open(m, "_blank");
								void 0 == i && s && (t.location.href = m)
							}
							v.readyState = v.DONE, S(), d(m)
						},
						I = function(t) {
							return function() {
								return v.readyState !== v.DONE ? t.apply(this, arguments) : void 0
							}
						},
						C = {
							create: !0,
							exclusive: !1
						};
					return v.readyState = v.INIT, h || (h = "download"), i ? (m = n().createObjectURL(e), void setTimeout(function() {
						r.href = m, r.download = h, o(r), S(), d(m), v.readyState = v.DONE
					})) : (t.chrome && b && b !== u && (w = e.slice || e.webkitSlice, e = w.call(e, 0, e.size, u), x = !0), a && "download" !== h && (h += ".download"), (b === u || a) && (y = t), c ? (l += e.size, void c(t.TEMPORARY, l, I(function(t) {
						t.root.getDirectory("saved", C, I(function(t) {
							var n = function() {
								t.getFile(h, C, I(function(t) {
									t.createWriter(I(function(n) {
										n.onwriteend = function(e) {
											y.location.href = t.toURL(), v.readyState = v.DONE, p(v, "writeend", e), d(t)
										}, n.onerror = function() {
											var t = n.error;
											t.code !== t.ABORT_ERR && k()
										}, "writestart progress write abort".split(" ").forEach(function(t) {
											n["on" + t] = v["on" + t]
										}), n.write(e), v.abort = function() {
											n.abort(), v.readyState = v.DONE
										}, v.readyState = v.WRITING
									}), k)
								}), k)
							};
							t.getFile(h, {
								create: !1
							}, I(function(t) {
								t.remove(), n()
							}), I(function(t) {
								t.code === t.NOT_FOUND_ERR ? n() : k()
							}))
						}), k)
					}), k)) : void k())
				},
				y = m.prototype,
				w = function(t, e, n) {
					return new m(t, e, n)
				};
			return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function(t, e, n) {
				return n || (t = g(t)), navigator.msSaveOrOpenBlob(t, e || "download")
			} : (y.abort = function() {
				var t = this;
				t.readyState = t.DONE, p(t, "abort")
			}, y.readyState = y.INIT = 0, y.WRITING = 1, y.DONE = 2, y.error = y.onwritestart = y.onprogress = y.onwrite = y.onabort = y.onerror = y.onwriteend = null, w)
		}
	}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
	"undefined" != typeof module && module.exports ? module.exports.saveAs = r : "undefined" != typeof define && null !== define && null != define.amd && define([], function() {
			return r
		}),
		/*
		 * Copyright (c) 2012 chick307 <chick307@gmail.com>
		 *
		 * Licensed under the MIT License.
		 * http://opensource.org/licenses/mit-license
		 */
		void
	function(t, e) {
		"object" == typeof module ? module.exports = e() : "function" == typeof define ? define(e) : t.adler32cs = e()
	}(e, function() {
		var t = "function" == typeof ArrayBuffer && "function" == typeof Uint8Array,
			e = null,
			n = function() {
				if (!t) return function() {
					return !1
				};
				try {
					var n = {};
					"function" == typeof n.Buffer && (e = n.Buffer)
				} catch (r) {}
				return function(t) {
					return t instanceof ArrayBuffer || null !== e && t instanceof e
				}
			}(),
			r = function() {
				return null !== e ? function(t) {
					return new e(t, "utf8").toString("binary")
				} : function(t) {
					return unescape(encodeURIComponent(t))
				}
			}(),
			i = 65521,
			o = function(t, e) {
				for (var n = 65535 & t, r = t >>> 16, o = 0, s = e.length; s > o; o++) n = (n + (255 & e.charCodeAt(o))) % i, r = (r + n) % i;
				return (r << 16 | n) >>> 0
			},
			s = function(t, e) {
				for (var n = 65535 & t, r = t >>> 16, o = 0, s = e.length; s > o; o++) n = (n + e[o]) % i, r = (r + n) % i;
				return (r << 16 | n) >>> 0
			},
			a = {},
			c = a.Adler32 = function() {
				var e = function(t) {
						if (!(this instanceof e)) throw new TypeError("Constructor cannot called be as a function.");
						if (!isFinite(t = null == t ? 1 : +t)) throw new Error("First arguments needs to be a finite number.");
						this.checksum = t >>> 0
					},
					i = e.prototype = {};
				return i.constructor = e, e.from = function(t) {
					return t.prototype = i, t
				}(function(t) {
					if (!(this instanceof e)) throw new TypeError("Constructor cannot called be as a function.");
					if (null == t) throw new Error("First argument needs to be a string.");
					this.checksum = o(1, t.toString())
				}), e.fromUtf8 = function(t) {
					return t.prototype = i, t
				}(function(t) {
					if (!(this instanceof e)) throw new TypeError("Constructor cannot called be as a function.");
					if (null == t) throw new Error("First argument needs to be a string.");
					var n = r(t.toString());
					this.checksum = o(1, n)
				}), t && (e.fromBuffer = function(t) {
					return t.prototype = i, t
				}(function(t) {
					if (!(this instanceof e)) throw new TypeError("Constructor cannot called be as a function.");
					if (!n(t)) throw new Error("First argument needs to be ArrayBuffer.");
					var r = new Uint8Array(t);
					return this.checksum = s(1, r)
				})), i.update = function(t) {
					if (null == t) throw new Error("First argument needs to be a string.");
					return t = t.toString(), this.checksum = o(this.checksum, t)
				}, i.updateUtf8 = function(t) {
					if (null == t) throw new Error("First argument needs to be a string.");
					var e = r(t.toString());
					return this.checksum = o(this.checksum, e)
				}, t && (i.updateBuffer = function(t) {
					if (!n(t)) throw new Error("First argument needs to be ArrayBuffer.");
					var e = new Uint8Array(t);
					return this.checksum = s(this.checksum, e)
				}), i.clone = function() {
					return new c(this.checksum)
				}, e
			}();
		return a.from = function(t) {
			if (null == t) throw new Error("First argument needs to be a string.");
			return o(1, t.toString())
		}, a.fromUtf8 = function(t) {
			if (null == t) throw new Error("First argument needs to be a string.");
			var e = r(t.toString());
			return o(1, e)
		}, t && (a.fromBuffer = function(t) {
			if (!n(t)) throw new Error("First argument need to be ArrayBuffer.");
			var e = new Uint8Array(t);
			return s(1, e)
		}), a
	});
	/**
	 * CssColors
	 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
	 *
	 * Licensed under the MIT License.
	 * http://opensource.org/licenses/mit-license
	 */
	var i = {};
	i._colorsTable = {
		aliceblue: "#f0f8ff",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		aquamarine: "#7fffd4",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		bisque: "#ffe4c4",
		black: "#000000",
		blanchedalmond: "#ffebcd",
		blue: "#0000ff",
		blueviolet: "#8a2be2",
		brown: "#a52a2a",
		burlywood: "#deb887",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",
		crimson: "#dc143c",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",
		darkslateblue: "#483d8b",
		darkslategray: "#2f4f4f",
		darkturquoise: "#00ced1",
		darkviolet: "#9400d3",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		dimgray: "#696969",
		dodgerblue: "#1e90ff",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		forestgreen: "#228b22",
		fuchsia: "#ff00ff",
		gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gray: "#808080",
		green: "#008000",
		greenyellow: "#adff2f",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		"indianred ": "#cd5c5c",
		indigo: "#4b0082",
		ivory: "#fffff0",
		khaki: "#f0e68c",
		lavender: "#e6e6fa",
		lavenderblush: "#fff0f5",
		lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",
		lightblue: "#add8e6",
		lightcoral: "#f08080",
		lightcyan: "#e0ffff",
		lightgoldenrodyellow: "#fafad2",
		lightgrey: "#d3d3d3",
		lightgreen: "#90ee90",
		lightpink: "#ffb6c1",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		lightskyblue: "#87cefa",
		lightslategray: "#778899",
		lightsteelblue: "#b0c4de",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		limegreen: "#32cd32",
		linen: "#faf0e6",
		magenta: "#ff00ff",
		maroon: "#800000",
		mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",
		mediumorchid: "#ba55d3",
		mediumpurple: "#9370d8",
		mediumseagreen: "#3cb371",
		mediumslateblue: "#7b68ee",
		mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",
		mediumvioletred: "#c71585",
		midnightblue: "#191970",
		mintcream: "#f5fffa",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		navajowhite: "#ffdead",
		navy: "#000080",
		oldlace: "#fdf5e6",
		olive: "#808000",
		olivedrab: "#6b8e23",
		orange: "#ffa500",
		orangered: "#ff4500",
		orchid: "#da70d6",
		palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",
		paleturquoise: "#afeeee",
		palevioletred: "#d87093",
		papayawhip: "#ffefd5",
		peachpuff: "#ffdab9",
		peru: "#cd853f",
		pink: "#ffc0cb",
		plum: "#dda0dd",
		powderblue: "#b0e0e6",
		purple: "#800080",
		red: "#ff0000",
		rosybrown: "#bc8f8f",
		royalblue: "#4169e1",
		saddlebrown: "#8b4513",
		salmon: "#fa8072",
		sandybrown: "#f4a460",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		sienna: "#a0522d",
		silver: "#c0c0c0",
		skyblue: "#87ceeb",
		slateblue: "#6a5acd",
		slategray: "#708090",
		snow: "#fffafa",
		springgreen: "#00ff7f",
		steelblue: "#4682b4",
		tan: "#d2b48c",
		teal: "#008080",
		thistle: "#d8bfd8",
		tomato: "#ff6347",
		turquoise: "#40e0d0",
		violet: "#ee82ee",
		wheat: "#f5deb3",
		white: "#ffffff",
		whitesmoke: "#f5f5f5",
		yellow: "#ffff00",
		yellowgreen: "#9acd32"
	}, i.colorNameToHex = function(t) {
		return t = t.toLowerCase(), "undefined" != typeof this._colorsTable[t] ? this._colorsTable[t] : !1
	};
	/*
	     Deflate.js - https://github.com/gildas-lormeau/zip.js
	     Copyright (c) 2013 Gildas Lormeau. All rights reserved.

	     Redistribution and use in source and binary forms, with or without
	     modification, are permitted provided that the following conditions are met:

	     1. Redistributions of source code must retain the above copyright notice,
	     this list of conditions and the following disclaimer.

	     2. Redistributions in binary form must reproduce the above copyright 
	     notice, this list of conditions and the following disclaimer in 
	     the documentation and/or other materials provided with the distribution.

	     3. The names of the authors may not be used to endorse or promote products
	     derived from this software without specific prior written permission.

	     THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	     INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	     FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	     INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	     INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	     LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	     OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	     LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	     EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	     */
	var o = function(t) {
		function e() {
			function t(t) {
				var e, n, i, o, s, c, h = r.dyn_tree,
					u = r.stat_desc.static_tree,
					l = r.stat_desc.extra_bits,
					f = r.stat_desc.extra_base,
					p = r.stat_desc.max_length,
					g = 0;
				for (o = 0; a >= o; o++) t.bl_count[o] = 0;
				for (h[2 * t.heap[t.heap_max] + 1] = 0, e = t.heap_max + 1; d > e; e++) n = t.heap[e], o = h[2 * h[2 * n + 1] + 1] + 1, o > p && (o = p, g++), h[2 * n + 1] = o, n > r.max_code || (t.bl_count[o]++, s = 0, n >= f && (s = l[n - f]), c = h[2 * n], t.opt_len += c * (o + s), u && (t.static_len += c * (u[2 * n + 1] + s)));
				if (0 !== g) {
					do {
						for (o = p - 1; 0 === t.bl_count[o];) o--;
						t.bl_count[o]--, t.bl_count[o + 1] += 2, t.bl_count[p]--, g -= 2
					} while (g > 0);
					for (o = p; 0 !== o; o--)
						for (n = t.bl_count[o]; 0 !== n;) i = t.heap[--e], i > r.max_code || (h[2 * i + 1] != o && (t.opt_len += (o - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = o), n--)
				}
			}

			function e(t, e) {
				var n = 0;
				do n |= 1 & t, t >>>= 1, n <<= 1; while (--e > 0);
				return n >>> 1
			}

			function n(t, n, r) {
				var i, o, s, c = [],
					h = 0;
				for (i = 1; a >= i; i++) c[i] = h = h + r[i - 1] << 1;
				for (o = 0; n >= o; o++) s = t[2 * o + 1], 0 !== s && (t[2 * o] = e(c[s]++, s))
			}
			var r = this;
			r.build_tree = function(e) {
				var i, o, s, a = r.dyn_tree,
					c = r.stat_desc.static_tree,
					h = r.stat_desc.elems,
					u = -1;
				for (e.heap_len = 0, e.heap_max = d, i = 0; h > i; i++) 0 !== a[2 * i] ? (e.heap[++e.heap_len] = u = i, e.depth[i] = 0) : a[2 * i + 1] = 0;
				for (; e.heap_len < 2;) s = e.heap[++e.heap_len] = 2 > u ? ++u : 0, a[2 * s] = 1, e.depth[s] = 0, e.opt_len--, c && (e.static_len -= c[2 * s + 1]);
				for (r.max_code = u, i = Math.floor(e.heap_len / 2); i >= 1; i--) e.pqdownheap(a, i);
				s = h;
				do i = e.heap[1], e.heap[1] = e.heap[e.heap_len--], e.pqdownheap(a, 1), o = e.heap[1], e.heap[--e.heap_max] = i, e.heap[--e.heap_max] = o, a[2 * s] = a[2 * i] + a[2 * o], e.depth[s] = Math.max(e.depth[i], e.depth[o]) + 1, a[2 * i + 1] = a[2 * o + 1] = s, e.heap[1] = s++, e.pqdownheap(a, 1); while (e.heap_len >= 2);
				e.heap[--e.heap_max] = e.heap[1], t(e), n(a, r.max_code, e.bl_count)
			}
		}

		function n(t, e, n, r, i) {
			var o = this;
			o.static_tree = t, o.extra_bits = e, o.extra_base = n, o.elems = r, o.max_length = i
		}

		function r(t, e, n, r, i) {
			var o = this;
			o.good_length = t, o.max_lazy = e, o.nice_length = n, o.max_chain = r, o.func = i
		}

		function i(t, e, n, r) {
			var i = t[2 * e],
				o = t[2 * n];
			return o > i || i == o && r[e] <= r[n]
		}

		function o() {
			function t() {
				var t;
				for (Pt = 2 * At, Ot[Bt - 1] = 0, t = 0; Bt - 1 > t; t++) Ot[t] = 0;
				Vt = L[Yt].max_lazy, Qt = L[Yt].good_length, Kt = L[Yt].nice_length, Gt = L[Yt].max_chain, Ut = 0, Mt = 0, Wt = 0, Nt = Xt = tt - 1, zt = 0, Ft = 0
			}

			function r() {
				var t;
				for (t = 0; f > t; t++) Zt[2 * t] = 0;
				for (t = 0; c > t; t++) $t[2 * t] = 0;
				for (t = 0; h > t; t++) te[2 * t] = 0;
				Zt[2 * p] = 1, ee.opt_len = ee.static_len = 0, ae = he = 0
			}

			function o() {
				ne.dyn_tree = Zt, ne.stat_desc = n.static_l_desc, re.dyn_tree = $t, re.stat_desc = n.static_d_desc, ie.dyn_tree = te, ie.stat_desc = n.static_bl_desc, le = 0, fe = 0, ue = 8, r()
			}

			function s(t, e) {
				var n, r, i = -1,
					o = t[1],
					s = 0,
					a = 7,
					c = 4;
				for (0 === o && (a = 138, c = 3), t[2 * (e + 1) + 1] = 65535, n = 0; e >= n; n++) r = o, o = t[2 * (n + 1) + 1], ++s < a && r == o || (c > s ? te[2 * r] += s : 0 !== r ? (r != i && te[2 * r]++, te[2 * m]++) : 10 >= s ? te[2 * y]++ : te[2 * w]++, s = 0, i = r, 0 === o ? (a = 138, c = 3) : r == o ? (a = 6, c = 3) : (a = 7, c = 4))
			}

			function a() {
				var t;
				for (s(Zt, ne.max_code), s($t, re.max_code), ie.build_tree(ee), t = h - 1; t >= 3 && 0 === te[2 * e.bl_order[t] + 1]; t--);
				return ee.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
			}

			function u(t) {
				ee.pending_buf[ee.pending++] = t
			}

			function d(t) {
				u(255 & t), u(t >>> 8 & 255)
			}

			function g(t) {
				u(t >> 8 & 255), u(255 & t & 255)
			}

			function B(t, e) {
				var n, r = e;
				fe > v - r ? (n = t, le |= n << fe & 65535, d(le), le = n >>> v - fe, fe += r - v) : (le |= t << fe & 65535, fe += r)
			}

			function rt(t, e) {
				var n = 2 * t;
				B(65535 & e[n], 65535 & e[n + 1])
			}

			function it(t, e) {
				var n, r, i = -1,
					o = t[1],
					s = 0,
					a = 7,
					c = 4;
				for (0 === o && (a = 138, c = 3), n = 0; e >= n; n++)
					if (r = o, o = t[2 * (n + 1) + 1], !(++s < a && r == o)) {
						if (c > s) {
							do rt(r, te); while (0 !== --s)
						} else 0 !== r ? (r != i && (rt(r, te), s--), rt(m, te), B(s - 3, 2)) : 10 >= s ? (rt(y, te), B(s - 3, 3)) : (rt(w, te), B(s - 11, 7));
						s = 0, i = r, 0 === o ? (a = 138, c = 3) : r == o ? (a = 6, c = 3) : (a = 7, c = 4)
					}
			}

			function ot(t, n, r) {
				var i;
				for (B(t - 257, 5), B(n - 1, 5), B(r - 4, 4), i = 0; r > i; i++) B(te[2 * e.bl_order[i] + 1], 3);
				it(Zt, t - 1), it($t, n - 1)
			}

			function st() {
				16 == fe ? (d(le), le = 0, fe = 0) : fe >= 8 && (u(255 & le), le >>>= 8, fe -= 8)
			}

			function at() {
				B(Z << 1, 3), rt(p, n.static_ltree), st(), 9 > 1 + ue + 10 - fe && (B(Z << 1, 3), rt(p, n.static_ltree), st()), ue = 7
			}

			function ct(t, n) {
				var r, i, o;
				if (ee.pending_buf[ce + 2 * ae] = t >>> 8 & 255, ee.pending_buf[ce + 2 * ae + 1] = 255 & t, ee.pending_buf[oe + ae] = 255 & n, ae++, 0 === t ? Zt[2 * n]++ : (he++, t--, Zt[2 * (e._length_code[n] + l + 1)]++, $t[2 * e.d_code(t)]++), 0 === (8191 & ae) && Yt > 2) {
					for (r = 8 * ae, i = Ut - Mt, o = 0; c > o; o++) r += $t[2 * o] * (5 + e.extra_dbits[o]);
					if (r >>>= 3, he < Math.floor(ae / 2) && r < Math.floor(i / 2)) return !0
				}
				return ae == se - 1
			}

			function ht(t, n) {
				var r, i, o, s, a = 0;
				if (0 !== ae)
					do r = ee.pending_buf[ce + 2 * a] << 8 & 65280 | 255 & ee.pending_buf[ce + 2 * a + 1], i = 255 & ee.pending_buf[oe + a], a++, 0 === r ? rt(i, t) : (o = e._length_code[i], rt(o + l + 1, t), s = e.extra_lbits[o], 0 !== s && (i -= e.base_length[o], B(i, s)), r--, o = e.d_code(r), rt(o, n), s = e.extra_dbits[o], 0 !== s && (r -= e.base_dist[o], B(r, s))); while (ae > a);
				rt(p, t), ue = t[2 * p + 1]
			}

			function ut() {
				fe > 8 ? d(le) : fe > 0 && u(255 & le), le = 0, fe = 0
			}

			function lt(t, e, n) {
				ut(), ue = 8, n && (d(e), d(~e)), ee.pending_buf.set(Tt.subarray(t, t + e), ee.pending), ee.pending += e
			}

			function ft(t, e, n) {
				B((K << 1) + (n ? 1 : 0), 3), lt(t, e, !0)
			}

			function dt(t, e, i) {
				var o, s, c = 0;
				Yt > 0 ? (ne.build_tree(ee), re.build_tree(ee), c = a(), o = ee.opt_len + 3 + 7 >>> 3, s = ee.static_len + 3 + 7 >>> 3, o >= s && (o = s)) : o = s = e + 5, o >= e + 4 && -1 != t ? ft(t, e, i) : s == o ? (B((Z << 1) + (i ? 1 : 0), 3), ht(n.static_ltree, n.static_dtree)) : (B(($ << 1) + (i ? 1 : 0), 3), ot(ne.max_code + 1, re.max_code + 1, c + 1), ht(Zt, $t)), r(), i && ut()
			}

			function pt(t) {
				dt(Mt >= 0 ? Mt : -1, Ut - Mt, t), Mt = Ut, xt.flush_pending()
			}

			function gt() {
				var t, e, n, r;
				do {
					if (r = Pt - Wt - Ut, 0 === r && 0 === Ut && 0 === Wt) r = At;
					else if (-1 == r) r--;
					else if (Ut >= At + At - nt) {
						Tt.set(Tt.subarray(At, At + At), 0), Ht -= At, Ut -= At, Mt -= At, t = Bt, n = t;
						do e = 65535 & Ot[--n], Ot[n] = e >= At ? e - At : 0; while (0 !== --t);
						t = At, n = t;
						do e = 65535 & Et[--n], Et[n] = e >= At ? e - At : 0; while (0 !== --t);
						r += At
					}
					if (0 === xt.avail_in) return;
					t = xt.read_buf(Tt, Ut + Wt, r), Wt += t, Wt >= tt && (Ft = 255 & Tt[Ut], Ft = (Ft << jt ^ 255 & Tt[Ut + 1]) & Dt)
				} while (nt > Wt && 0 !== xt.avail_in)
			}

			function mt(t) {
				var e, n = 65535;
				for (n > kt - 5 && (n = kt - 5);;) {
					if (1 >= Wt) {
						if (gt(), 0 === Wt && t == I) return U;
						if (0 === Wt) break
					}
					if (Ut += Wt, Wt = 0, e = Mt + n, (0 === Ut || Ut >= e) && (Wt = Ut - e, Ut = e, pt(!1), 0 === xt.avail_out)) return U;
					if (Ut - Mt >= At - nt && (pt(!1), 0 === xt.avail_out)) return U
				}
				return pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H
			}

			function yt(t) {
				var e, n, r = Gt,
					i = Ut,
					o = Xt,
					s = Ut > At - nt ? Ut - (At - nt) : 0,
					a = Kt,
					c = qt,
					h = Ut + et,
					u = Tt[i + o - 1],
					l = Tt[i + o];
				Xt >= Qt && (r >>= 2), a > Wt && (a = Wt);
				do
					if (e = t, Tt[e + o] == l && Tt[e + o - 1] == u && Tt[e] == Tt[i] && Tt[++e] == Tt[i + 1]) {
						i += 2, e++;
						do; while (Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && h > i);
						if (n = et - (h - i), i = h - et, n > o) {
							if (Ht = t, o = n, n >= a) break;
							u = Tt[i + o - 1], l = Tt[i + o]
						}
					}
				while ((t = 65535 & Et[t & c]) > s && 0 !== --r);
				return Wt >= o ? o : Wt
			}

			function wt(t) {
				for (var e, n = 0;;) {
					if (nt > Wt) {
						if (gt(), nt > Wt && t == I) return U;
						if (0 === Wt) break
					}
					if (Wt >= tt && (Ft = (Ft << jt ^ 255 & Tt[Ut + (tt - 1)]) & Dt, n = 65535 & Ot[Ft], Et[Ut & qt] = Ot[Ft], Ot[Ft] = Ut), 0 !== n && At - nt >= (Ut - n & 65535) && Jt != S && (Nt = yt(n)), Nt >= tt)
						if (e = ct(Ut - Ht, Nt - tt), Wt -= Nt, Vt >= Nt && Wt >= tt) {
							Nt--;
							do Ut++, Ft = (Ft << jt ^ 255 & Tt[Ut + (tt - 1)]) & Dt, n = 65535 & Ot[Ft], Et[Ut & qt] = Ot[Ft], Ot[Ft] = Ut; while (0 !== --Nt);
							Ut++
						} else Ut += Nt, Nt = 0, Ft = 255 & Tt[Ut], Ft = (Ft << jt ^ 255 & Tt[Ut + 1]) & Dt;
					else e = ct(0, 255 & Tt[Ut]), Wt--, Ut++;
					if (e && (pt(!1), 0 === xt.avail_out)) return U
				}
				return pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H
			}

			function vt(t) {
				for (var e, n, r = 0;;) {
					if (nt > Wt) {
						if (gt(), nt > Wt && t == I) return U;
						if (0 === Wt) break
					}
					if (Wt >= tt && (Ft = (Ft << jt ^ 255 & Tt[Ut + (tt - 1)]) & Dt, r = 65535 & Ot[Ft], Et[Ut & qt] = Ot[Ft], Ot[Ft] = Ut), Xt = Nt, Lt = Ht, Nt = tt - 1, 0 !== r && Vt > Xt && At - nt >= (Ut - r & 65535) && (Jt != S && (Nt = yt(r)), 5 >= Nt && (Jt == x || Nt == tt && Ut - Ht > 4096) && (Nt = tt - 1)), Xt >= tt && Xt >= Nt) {
						n = Ut + Wt - tt, e = ct(Ut - 1 - Lt, Xt - tt), Wt -= Xt - 1, Xt -= 2;
						do ++Ut <= n && (Ft = (Ft << jt ^ 255 & Tt[Ut + (tt - 1)]) & Dt, r = 65535 & Ot[Ft], Et[Ut & qt] = Ot[Ft], Ot[Ft] = Ut); while (0 !== --Xt);
						if (zt = 0, Nt = tt - 1, Ut++, e && (pt(!1), 0 === xt.avail_out)) return U
					} else if (0 !== zt) {
						if (e = ct(0, 255 & Tt[Ut - 1]), e && pt(!1), Ut++, Wt--, 0 === xt.avail_out) return U
					} else zt = 1, Ut++, Wt--
				}
				return 0 !== zt && (e = ct(0, 255 & Tt[Ut - 1]), zt = 0), pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H
			}

			function bt(e) {
				return e.total_in = e.total_out = 0, e.msg = null, ee.pending = 0, ee.pending_out = 0, St = Y, Ct = I, o(), t(), q
			}
			var xt, St, kt, It, Ct, At, _t, qt, Tt, Pt, Et, Ot, Ft, Bt, Rt, Dt, jt, Mt, Nt, Lt, zt, Ut, Ht, Wt, Xt, Gt, Vt, Yt, Jt, Qt, Kt, Zt, $t, te, ee = this,
				ne = new e,
				re = new e,
				ie = new e;
			ee.depth = [];
			var oe, se, ae, ce, he, ue, le, fe;
			ee.bl_count = [], ee.heap = [], Zt = [], $t = [], te = [], ee.pqdownheap = function(t, e) {
				for (var n = ee.heap, r = n[e], o = e << 1; o <= ee.heap_len && (o < ee.heap_len && i(t, n[o + 1], n[o], ee.depth) && o++, !i(t, r, n[o], ee.depth));) n[e] = n[o], e = o, o <<= 1;
				n[e] = r
			}, ee.deflateInit = function(t, e, n, r, i, o) {
				return r || (r = Q), i || (i = D), o || (o = k), t.msg = null, e == b && (e = 6), 1 > i || i > R || r != Q || 9 > n || n > 15 || 0 > e || e > 9 || 0 > o || o > S ? E : (t.dstate = ee, _t = n, At = 1 << _t, qt = At - 1, Rt = i + 7, Bt = 1 << Rt, Dt = Bt - 1, jt = Math.floor((Rt + tt - 1) / tt), Tt = new Uint8Array(2 * At), Et = [], Ot = [], se = 1 << i + 6, ee.pending_buf = new Uint8Array(4 * se), kt = 4 * se, ce = Math.floor(se / 2), oe = 3 * se, Yt = e, Jt = o, It = 255 & r, bt(t))
			}, ee.deflateEnd = function() {
				return St != V && St != Y && St != J ? E : (ee.pending_buf = null, Ot = null, Et = null, Tt = null, ee.dstate = null, St == Y ? O : q)
			}, ee.deflateParams = function(t, e, n) {
				var r = q;
				return e == b && (e = 6), 0 > e || e > 9 || 0 > n || n > S ? E : (L[Yt].func != L[e].func && 0 !== t.total_in && (r = t.deflate(C)), Yt != e && (Yt = e, Vt = L[Yt].max_lazy, Qt = L[Yt].good_length, Kt = L[Yt].nice_length, Gt = L[Yt].max_chain), Jt = n, r)
			}, ee.deflateSetDictionary = function(t, e, n) {
				var r, i = n,
					o = 0;
				if (!e || St != V) return E;
				if (tt > i) return q;
				for (i > At - nt && (i = At - nt, o = n - i), Tt.set(e.subarray(o, o + i), 0), Ut = i, Mt = i, Ft = 255 & Tt[0], Ft = (Ft << jt ^ 255 & Tt[1]) & Dt, r = 0; i - tt >= r; r++) Ft = (Ft << jt ^ 255 & Tt[r + (tt - 1)]) & Dt, Et[r & qt] = Ot[Ft], Ot[Ft] = r;
				return q
			}, ee.deflate = function(t, e) {
				var n, r, i, o, s;
				if (e > _ || 0 > e) return E;
				if (!t.next_out || !t.next_in && 0 !== t.avail_in || St == J && e != _) return t.msg = z[P - E], E;
				if (0 === t.avail_out) return t.msg = z[P - F], F;
				if (xt = t, o = Ct, Ct = e, St == V && (r = Q + (_t - 8 << 4) << 8, i = (Yt - 1 & 255) >> 1, i > 3 && (i = 3), r |= i << 6, 0 !== Ut && (r |= G), r += 31 - r % 31, St = Y, g(r)), 0 !== ee.pending) {
					if (xt.flush_pending(), 0 === xt.avail_out) return Ct = -1, q
				} else if (0 === xt.avail_in && o >= e && e != _) return xt.msg = z[P - F], F;
				if (St == J && 0 !== xt.avail_in) return t.msg = z[P - F], F;
				if (0 !== xt.avail_in || 0 !== Wt || e != I && St != J) {
					switch (s = -1, L[Yt].func) {
						case j:
							s = mt(e);
							break;
						case M:
							s = wt(e);
							break;
						case N:
							s = vt(e)
					}
					if (s != W && s != X || (St = J), s == U || s == W) return 0 === xt.avail_out && (Ct = -1), q;
					if (s == H) {
						if (e == C) at();
						else if (ft(0, 0, !1), e == A)
							for (n = 0; Bt > n; n++) Ot[n] = 0;
						if (xt.flush_pending(), 0 === xt.avail_out) return Ct = -1, q
					}
				}
				return e != _ ? q : T
			}
		}

		function s() {
			var t = this;
			t.next_in_index = 0, t.next_out_index = 0, t.avail_in = 0, t.total_in = 0, t.avail_out = 0, t.total_out = 0
		}
		var a = 15,
			c = 30,
			h = 19,
			u = 29,
			l = 256,
			f = l + 1 + u,
			d = 2 * f + 1,
			p = 256,
			g = 7,
			m = 16,
			y = 17,
			w = 18,
			v = 16,
			b = -1,
			x = 1,
			S = 2,
			k = 0,
			I = 0,
			C = 1,
			A = 3,
			_ = 4,
			q = 0,
			T = 1,
			P = 2,
			E = -2,
			O = -3,
			F = -5,
			B = [0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29];
		e._length_code = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28], e.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0], e.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576], e.d_code = function(t) {
			return 256 > t ? B[t] : B[256 + (t >>> 7)]
		}, e.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], e.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], e.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], e.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], n.static_ltree = [12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8, 130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42, 8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8, 22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8, 222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113, 8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8, 69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8, 173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9, 51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9, 427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379, 9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23, 9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9, 399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9, 223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7, 40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8, 99, 8, 227, 8], n.static_dtree = [0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5, 25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5], n.static_l_desc = new n(n.static_ltree, e.extra_lbits, l + 1, f, a), n.static_d_desc = new n(n.static_dtree, e.extra_dbits, 0, c, a), n.static_bl_desc = new n(null, e.extra_blbits, 0, h, g);
		var R = 9,
			D = 8,
			j = 0,
			M = 1,
			N = 2,
			L = [new r(0, 0, 0, 0, j), new r(4, 4, 8, 4, M), new r(4, 5, 16, 8, M), new r(4, 6, 32, 32, M), new r(4, 4, 16, 16, N), new r(8, 16, 32, 32, N), new r(8, 16, 128, 128, N), new r(8, 32, 128, 256, N), new r(32, 128, 258, 1024, N), new r(32, 258, 258, 4096, N)],
			z = ["need dictionary", "stream end", "", "", "stream error", "data error", "", "buffer error", "", ""],
			U = 0,
			H = 1,
			W = 2,
			X = 3,
			G = 32,
			V = 42,
			Y = 113,
			J = 666,
			Q = 8,
			K = 0,
			Z = 1,
			$ = 2,
			tt = 3,
			et = 258,
			nt = et + tt + 1;
		return s.prototype = {
				deflateInit: function(t, e) {
					var n = this;
					return n.dstate = new o, e || (e = a), n.dstate.deflateInit(n, t, e)
				},
				deflate: function(t) {
					var e = this;
					return e.dstate ? e.dstate.deflate(e, t) : E
				},
				deflateEnd: function() {
					var t = this;
					if (!t.dstate) return E;
					var e = t.dstate.deflateEnd();
					return t.dstate = null, e
				},
				deflateParams: function(t, e) {
					var n = this;
					return n.dstate ? n.dstate.deflateParams(n, t, e) : E
				},
				deflateSetDictionary: function(t, e) {
					var n = this;
					return n.dstate ? n.dstate.deflateSetDictionary(n, t, e) : E
				},
				read_buf: function(t, e, n) {
					var r = this,
						i = r.avail_in;
					return i > n && (i = n), 0 === i ? 0 : (r.avail_in -= i, t.set(r.next_in.subarray(r.next_in_index, r.next_in_index + i), e), r.next_in_index += i, r.total_in += i, i)
				},
				flush_pending: function() {
					var t = this,
						e = t.dstate.pending;
					e > t.avail_out && (e = t.avail_out), 0 !== e && (t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out, t.dstate.pending_out + e), t.next_out_index), t.next_out_index += e, t.dstate.pending_out += e, t.total_out += e, t.avail_out -= e, t.dstate.pending -= e, 0 === t.dstate.pending && (t.dstate.pending_out = 0))
				}
			},
			function(t) {
				var e = this,
					n = new s,
					r = 512,
					i = I,
					o = new Uint8Array(r);
				"undefined" == typeof t && (t = b), n.deflateInit(t), n.next_out = o, e.append = function(t, e) {
					var s, a, c = [],
						h = 0,
						u = 0,
						l = 0;
					if (t.length) {
						n.next_in_index = 0, n.next_in = t, n.avail_in = t.length;
						do {
							if (n.next_out_index = 0, n.avail_out = r, s = n.deflate(i), s != q) throw "deflating: " + n.msg;
							n.next_out_index && (n.next_out_index == r ? c.push(new Uint8Array(o)) : c.push(new Uint8Array(o.subarray(0, n.next_out_index)))), l += n.next_out_index, e && n.next_in_index > 0 && n.next_in_index != h && (e(n.next_in_index), h = n.next_in_index)
						} while (n.avail_in > 0 || 0 === n.avail_out);
						return a = new Uint8Array(l), c.forEach(function(t) {
							a.set(t, u), u += t.length
						}), a
					}
				}, e.flush = function() {
					var t, e, i = [],
						s = 0,
						a = 0;
					do {
						if (n.next_out_index = 0, n.avail_out = r, t = n.deflate(_), t != T && t != q) throw "deflating: " + n.msg;
						r - n.avail_out > 0 && i.push(new Uint8Array(o.subarray(0, n.next_out_index))), a += n.next_out_index
					} while (n.avail_in > 0 || 0 === n.avail_out);
					return n.deflateEnd(), e = new Uint8Array(a), i.forEach(function(t) {
						e.set(t, s), s += t.length
					}), e
				}
			}
	}(this);
	/*
	      html2canvas 0.5.0-alpha <http://html2canvas.hertzen.com>
	      Copyright (c) 2014 Niklas von Hertzen

	      Released under MIT License
	    */
	(function(t, e, n, r, i, o, s) {
		function a(t, e, n, r) {
			return p(t, t, n, r, e).then(function(i) {
				E("Document cloned");
				var o = "[" + Wt + "='true']";
				t.querySelector(o).removeAttribute(Wt);
				var s = i.contentWindow,
					a = s.document.querySelector(o),
					h = "function" == typeof e.onclone ? Promise.resolve(e.onclone(s.document)) : Promise.resolve(!0);
				return h.then(function() {
					return c(a, i, e, n, r)
				})
			})
		}

		function c(t, n, r, i, o) {
			var s = n.contentWindow,
				a = new Bt(s.document),
				c = new T(r, a),
				d = N(t),
				p = "view" === r.type ? i : l(s.document),
				g = "view" === r.type ? o : f(s.document),
				m = new Ut(p, g, c, r, e),
				y = new z(t, m, a, c, r);
			return y.ready.then(function() {
				E("Finished rendering");
				var e;
				return e = "view" === r.type ? u(m.canvas, {
					width: m.canvas.width,
					height: m.canvas.height,
					top: 0,
					left: 0,
					x: 0,
					y: 0
				}) : t === s.document.body || t === s.document.documentElement || null != r.canvas ? m.canvas : u(m.canvas, {
					width: null != r.width ? r.width : d.width,
					height: null != r.height ? r.height : d.height,
					top: d.top,
					left: d.left,
					x: s.pageXOffset,
					y: s.pageYOffset
				}), h(n, r), e
			})
		}

		function h(t, e) {
			e.removeContainer && (t.parentNode.removeChild(t), E("Cleaned up container"))
		}

		function u(t, n) {
			var r = e.createElement("canvas"),
				i = Math.min(t.width - 1, Math.max(0, n.left)),
				o = Math.min(t.width, Math.max(1, n.left + n.width)),
				s = Math.min(t.height - 1, Math.max(0, n.top)),
				a = Math.min(t.height, Math.max(1, n.top + n.height));
			return r.width = n.width, r.height = n.height, E("Cropping canvas at:", "left:", n.left, "top:", n.top, "width:", o - i, "height:", a - s), E("Resulting crop with width", n.width, "and height", n.height, " with x", i, "and y", s), r.getContext("2d").drawImage(t, i, s, o - i, a - s, n.x, n.y, o - i, a - s), r
		}

		function l(t) {
			return Math.max(Math.max(t.body.scrollWidth, t.documentElement.scrollWidth), Math.max(t.body.offsetWidth, t.documentElement.offsetWidth), Math.max(t.body.clientWidth, t.documentElement.clientWidth))
		}

		function f(t) {
			return Math.max(Math.max(t.body.scrollHeight, t.documentElement.scrollHeight), Math.max(t.body.offsetHeight, t.documentElement.offsetHeight), Math.max(t.body.clientHeight, t.documentElement.clientHeight))
		}

		function d() {
			return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
		}

		function p(t, e, n, r, i) {
			w(t);
			var o = t.documentElement.cloneNode(!0),
				s = e.createElement("iframe");
			return s.className = "html2canvas-container", s.style.visibility = "hidden", s.style.position = "fixed", s.style.left = "-10000px", s.style.top = "0px", s.style.border = "0", s.width = n, s.height = r, s.scrolling = "no", e.body.appendChild(s), new Promise(function(e) {
				var n = s.contentWindow.document;
				s.contentWindow.onload = s.onload = function() {
					var o = setInterval(function() {
						n.body.childNodes.length > 0 && (v(t, n), clearInterval(o), "view" === i.type && s.contentWindow.scrollTo(r, a), e(s))
					}, 50)
				};
				var r = t.defaultView.pageXOffset,
					a = t.defaultView.pageYOffset;
				n.open(), n.write("<!DOCTYPE html><html></html>"), g(t, r, a), n.replaceChild(i.javascriptEnabled === !0 ? n.adoptNode(o) : b(n.adoptNode(o)), n.documentElement), n.close()
			})
		}

		function g(t, e, n) {
			e === t.defaultView.pageXOffset && n === t.defaultView.pageYOffset || t.defaultView.scrollTo(e, n)
		}

		function m(e, n, r, i, o, s) {
			return new Ct(e, n, t.document).then(y(e)).then(function(t) {
				return p(t, r, i, o, s)
			})
		}

		function y(t) {
			return function(n) {
				var r, i = new DOMParser;
				try {
					r = i.parseFromString(n, "text/html")
				} catch (o) {
					E("DOMParser not supported, falling back to createHTMLDocument"), r = e.implementation.createHTMLDocument("");
					try {
						r.open(), r.write(n), r.close()
					} catch (s) {
						E("createHTMLDocument write not supported, falling back to document.body.innerHTML"), r.body.innerHTML = n
					}
				}
				var a = r.querySelector("base");
				if (!a || !a.href.host) {
					var c = r.createElement("base");
					c.href = t, r.head.insertBefore(c, r.head.firstChild)
				}
				return r
			}
		}

		function w(t) {
			[].slice.call(t.querySelectorAll("canvas"), 0).forEach(function(t) {
				t.setAttribute(Xt, "canvas-" + Gt++)
			})
		}

		function v(t, e) {
			[].slice.call(t.querySelectorAll("[" + Xt + "]"), 0).forEach(function(t) {
				try {
					var n = e.querySelector("[" + Xt + '="' + t.getAttribute(Xt) + '"]');
					n && (n.width = t.width, n.height = t.height, n.getContext("2d").putImageData(t.getContext("2d").getImageData(0, 0, t.width, t.height), 0, 0))
				} catch (r) {
					E("Unable to copy canvas content from", t, r)
				}
				t.removeAttribute(Xt)
			})
		}

		function b(t) {
			return [].slice.call(t.childNodes, 0).filter(x).forEach(function(e) {
				"SCRIPT" === e.tagName ? t.removeChild(e) : b(e)
			}), t
		}

		function x(t) {
			return t.nodeType === Node.ELEMENT_NODE
		}

		function S(t) {
			var n = e.createElement("a");
			return n.href = t, n.href = n.href, n
		}

		function k(t) {
			if (this.src = t, E("DummyImageContainer for", t), !this.promise || !this.image) {
				E("Initiating DummyImageContainer"), k.prototype.image = new Image;
				var e = this.image;
				k.prototype.promise = new Promise(function(t, n) {
					e.onload = t, e.onerror = n, e.src = d(), e.complete === !0 && t(e)
				})
			}
		}

		function I(t, n) {
			var r, i, o = e.createElement("div"),
				s = e.createElement("img"),
				a = e.createElement("span"),
				c = "Hidden Text";
			o.style.visibility = "hidden", o.style.fontFamily = t, o.style.fontSize = n, o.style.margin = 0, o.style.padding = 0, e.body.appendChild(o), s.src = d(), s.width = 1, s.height = 1, s.style.margin = 0, s.style.padding = 0, s.style.verticalAlign = "baseline", a.style.fontFamily = t, a.style.fontSize = n, a.style.margin = 0, a.style.padding = 0, a.appendChild(e.createTextNode(c)), o.appendChild(a), o.appendChild(s), r = s.offsetTop - a.offsetTop + 1, o.removeChild(a), o.appendChild(e.createTextNode(c)), o.style.lineHeight = "normal", s.style.verticalAlign = "super", i = s.offsetTop - o.offsetTop + 1, e.body.removeChild(o), this.baseline = r, this.lineWidth = 1, this.middle = i
		}

		function C() {
			this.data = {}
		}

		function A(t, e, n) {
			this.image = null, this.src = t;
			var r = this,
				i = N(t);
			this.promise = (e ? new Promise(function(e) {
				"about:blank" === t.contentWindow.document.URL || null == t.contentWindow.document.documentElement ? t.contentWindow.onload = t.onload = function() {
					e(t)
				} : e(t)
			}) : this.proxyLoad(n.proxy, i, n)).then(function(t) {
				return html2canvas(t.contentWindow.document.documentElement, {
					type: "view",
					width: t.width,
					height: t.height,
					proxy: n.proxy,
					javascriptEnabled: n.javascriptEnabled,
					removeContainer: n.removeContainer,
					allowTaint: n.allowTaint,
					imageTimeout: n.imageTimeout / 2
				})
			}).then(function(t) {
				return r.image = t
			})
		}

		function _(t) {
			this.src = t.value, this.colorStops = [], this.type = null, this.x0 = .5, this.y0 = .5, this.x1 = .5, this.y1 = .5, this.promise = Promise.resolve(!0)
		}

		function q(t, e) {
			this.src = t, this.image = new Image;
			var n = this;
			this.tainted = null, this.promise = new Promise(function(r, i) {
				n.image.onload = r, n.image.onerror = i, e && (n.image.crossOrigin = "anonymous"), n.image.src = t, n.image.complete === !0 && r(n.image)
			})
		}

		function T(e, n) {
			this.link = null, this.options = e, this.support = n, this.origin = this.getOrigin(t.location.href)
		}

		function P(t) {
			_.apply(this, arguments), this.type = this.TYPES.LINEAR;
			var e = null === t.args[0].match(this.stepRegExp);
			e ? t.args[0].split(" ").reverse().forEach(function(t) {
				switch (t) {
					case "left":
						this.x0 = 0, this.x1 = 1;
						break;
					case "top":
						this.y0 = 0, this.y1 = 1;
						break;
					case "right":
						this.x0 = 1, this.x1 = 0;
						break;
					case "bottom":
						this.y0 = 1, this.y1 = 0;
						break;
					case "to":
						var e = this.y0,
							n = this.x0;
						this.y0 = this.y1, this.x0 = this.x1, this.x1 = n, this.y1 = e
				}
			}, this) : (this.y0 = 0, this.y1 = 1), this.colorStops = t.args.slice(e ? 1 : 0).map(function(t) {
				var e = t.match(this.stepRegExp);
				return {
					color: e[1],
					stop: "%" === e[3] ? e[2] / 100 : null
				}
			}, this), null === this.colorStops[0].stop && (this.colorStops[0].stop = 0), null === this.colorStops[this.colorStops.length - 1].stop && (this.colorStops[this.colorStops.length - 1].stop = 1), this.colorStops.forEach(function(t, e) {
				null === t.stop && this.colorStops.slice(e).some(function(n, r) {
					return null !== n.stop ? (t.stop = (n.stop - this.colorStops[e - 1].stop) / (r + 1) + this.colorStops[e - 1].stop, !0) : !1
				}, this)
			}, this)
		}

		function E() {
			t.html2canvas.logging && t.console && t.console.log && Function.prototype.bind.call(t.console.log, t.console).apply(t.console, [Date.now() - t.html2canvas.start + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)))
		}

		function O(t, e) {
			this.node = t, this.parent = e, this.stack = null, this.bounds = null, this.borders = null, this.clip = [], this.backgroundClip = [], this.offsetBounds = null, this.visible = null, this.computedStyles = null, this.styles = {}, this.backgroundImages = null, this.transformData = null, this.transformMatrix = null, this.isPseudoElement = !1, this.opacity = null
		}

		function F(t) {
			var e = t.options[t.selectedIndex || 0];
			return e ? e.text || "" : ""
		}

		function B(t) {
			return t && "matrix" === t[1] ? t[2].split(",").map(function(t) {
				return parseFloat(t.trim())
			}) : void 0
		}

		function R(t) {
			return -1 !== t.toString().indexOf("%")
		}

		function D(t) {
			var e, n, r, i, o, s, a, c = " \r\n	",
				h = [],
				u = 0,
				l = 0,
				f = function() {
					e && ('"' === n.substr(0, 1) && (n = n.substr(1, n.length - 2)), n && a.push(n), "-" === e.substr(0, 1) && (i = e.indexOf("-", 1) + 1) > 0 && (r = e.substr(0, i), e = e.substr(i)), h.push({
						prefix: r,
						method: e.toLowerCase(),
						value: o,
						args: a,
						image: null
					})), a = [], e = r = n = o = ""
				};
			return a = [], e = r = n = o = "", t.split("").forEach(function(t) {
				if (!(0 === u && c.indexOf(t) > -1)) {
					switch (t) {
						case '"':
							s ? s === t && (s = null) : s = t;
							break;
						case "(":
							if (s) break;
							if (0 === u) return u = 1, void(o += t);
							l++;
							break;
						case ")":
							if (s) break;
							if (1 === u) {
								if (0 === l) return u = 0, o += t, void f();
								l--
							}
							break;
						case ",":
							if (s) break;
							if (0 === u) return void f();
							if (1 === u && 0 === l && !e.match(/^url$/i)) return a.push(n), n = "", void(o += t)
					}
					o += t, 0 === u ? e += t : n += t
				}
			}), f(), h
		}

		function j(t) {
			return t.replace("px", "")
		}

		function M(t) {
			return parseFloat(t)
		}

		function N(t) {
			if (t.getBoundingClientRect) {
				var e = t.getBoundingClientRect(),
					n = null == t.offsetWidth ? e.width : t.offsetWidth;
				return {
					top: e.top,
					bottom: e.bottom || e.top + e.height,
					right: e.left + n,
					left: e.left,
					width: n,
					height: null == t.offsetHeight ? e.height : t.offsetHeight
				}
			}
			return {}
		}

		function L(t) {
			var e = t.offsetParent ? L(t.offsetParent) : {
				top: 0,
				left: 0
			};
			return {
				top: t.offsetTop + e.top,
				bottom: t.offsetTop + t.offsetHeight + e.top,
				right: t.offsetLeft + e.left + t.offsetWidth,
				left: t.offsetLeft + e.left,
				width: t.offsetWidth,
				height: t.offsetHeight
			}
		}

		function z(t, e, n, r, i) {
			E("Starting NodeParser"), this.renderer = e, this.options = i, this.range = null, this.support = n, this.renderQueue = [], this.stack = new Ft(!0, 1, t.ownerDocument, null);
			var o = new O(t, null);
			if (t === t.ownerDocument.documentElement) {
				var s = new O(this.renderer.isTransparent(o.css("backgroundColor")) ? t.ownerDocument.body : t.ownerDocument.documentElement, null);
				e.rectangle(0, 0, e.width, e.height, s.css("backgroundColor"))
			}
			o.visibile = o.isElementVisible(), this.createPseudoHideStyles(t.ownerDocument), this.disableAnimations(t.ownerDocument), this.nodes = bt([o].concat(this.getChildren(o)).filter(function(t) {
				return t.visible = t.isElementVisible()
			}).map(this.getPseudoElements, this)), this.fontMetrics = new C, E("Fetched nodes, total:", this.nodes.length), E("Calculate overflow clips"), this.calculateOverflowClips(), E("Start fetching images"), this.images = r.fetch(this.nodes.filter(lt)), this.ready = this.images.ready.then(mt(function() {
				return E("Images loaded, starting parsing"), E("Creating stacking contexts"), this.createStackingContexts(), E("Sorting stacking contexts"), this.sortStackingContexts(this.stack), this.parse(this.stack), E("Render queue created with " + this.renderQueue.length + " items"), new Promise(mt(function(t) {
					i.async ? "function" == typeof i.async ? i.async.call(this, this.renderQueue, t) : this.renderQueue.length > 0 ? (this.renderIndex = 0, this.asyncRenderer(this.renderQueue, t)) : t() : (this.renderQueue.forEach(this.paint, this), t())
				}, this))
			}, this))
		}

		function U(t) {
			return t.parent && t.parent.clip.length
		}

		function H(t) {
			return t.replace(/(\-[a-z])/g, function(t) {
				return t.toUpperCase().replace("-", "")
			})
		}

		function W() {}

		function X(t, e, n, r) {
			return t.map(function(i, o) {
				if (i.width > 0) {
					var s = e.left,
						a = e.top,
						c = e.width,
						h = e.height - t[2].width;
					switch (o) {
						case 0:
							h = t[0].width, i.args = J({
								c1: [s, a],
								c2: [s + c, a],
								c3: [s + c - t[1].width, a + h],
								c4: [s + t[3].width, a + h]
							}, r[0], r[1], n.topLeftOuter, n.topLeftInner, n.topRightOuter, n.topRightInner);
							break;
						case 1:
							s = e.left + e.width - t[1].width, c = t[1].width, i.args = J({
								c1: [s + c, a],
								c2: [s + c, a + h + t[2].width],
								c3: [s, a + h],
								c4: [s, a + t[0].width]
							}, r[1], r[2], n.topRightOuter, n.topRightInner, n.bottomRightOuter, n.bottomRightInner);
							break;
						case 2:
							a = a + e.height - t[2].width, h = t[2].width, i.args = J({
								c1: [s + c, a + h],
								c2: [s, a + h],
								c3: [s + t[3].width, a],
								c4: [s + c - t[3].width, a]
							}, r[2], r[3], n.bottomRightOuter, n.bottomRightInner, n.bottomLeftOuter, n.bottomLeftInner);
							break;
						case 3:
							c = t[3].width, i.args = J({
								c1: [s, a + h + t[2].width],
								c2: [s, a],
								c3: [s + c, a + t[0].width],
								c4: [s + c, a + h]
							}, r[3], r[0], n.bottomLeftOuter, n.bottomLeftInner, n.topLeftOuter, n.topLeftInner)
					}
				}
				return i
			})
		}

		function G(t, e, n, r) {
			var i = 4 * ((Math.sqrt(2) - 1) / 3),
				o = n * i,
				s = r * i,
				a = t + n,
				c = e + r;
			return {
				topLeft: Y({
					x: t,
					y: c
				}, {
					x: t,
					y: c - s
				}, {
					x: a - o,
					y: e
				}, {
					x: a,
					y: e
				}),
				topRight: Y({
					x: t,
					y: e
				}, {
					x: t + o,
					y: e
				}, {
					x: a,
					y: c - s
				}, {
					x: a,
					y: c
				}),
				bottomRight: Y({
					x: a,
					y: e
				}, {
					x: a,
					y: e + s
				}, {
					x: t + o,
					y: c
				}, {
					x: t,
					y: c
				}),
				bottomLeft: Y({
					x: a,
					y: c
				}, {
					x: a - o,
					y: c
				}, {
					x: t,
					y: e + s
				}, {
					x: t,
					y: e
				})
			}
		}

		function V(t, e, n) {
			var r = t.left,
				i = t.top,
				o = t.width,
				s = t.height,
				a = e[0][0],
				c = e[0][1],
				h = e[1][0],
				u = e[1][1],
				l = e[2][0],
				f = e[2][1],
				d = e[3][0],
				p = e[3][1],
				g = o - h,
				m = s - f,
				y = o - l,
				w = s - p;
			return {
				topLeftOuter: G(r, i, a, c).topLeft.subdivide(.5),
				topLeftInner: G(r + n[3].width, i + n[0].width, Math.max(0, a - n[3].width), Math.max(0, c - n[0].width)).topLeft.subdivide(.5),
				topRightOuter: G(r + g, i, h, u).topRight.subdivide(.5),
				topRightInner: G(r + Math.min(g, o + n[3].width), i + n[0].width, g > o + n[3].width ? 0 : h - n[3].width, u - n[0].width).topRight.subdivide(.5),
				bottomRightOuter: G(r + y, i + m, l, f).bottomRight.subdivide(.5),
				bottomRightInner: G(r + Math.min(y, o - n[3].width), i + Math.min(m, s + n[0].width), Math.max(0, l - n[1].width), f - n[2].width).bottomRight.subdivide(.5),
				bottomLeftOuter: G(r, i + w, d, p).bottomLeft.subdivide(.5),
				bottomLeftInner: G(r + n[3].width, i + w, Math.max(0, d - n[3].width), p - n[2].width).bottomLeft.subdivide(.5)
			}
		}

		function Y(t, e, n, r) {
			var i = function(t, e, n) {
				return {
					x: t.x + (e.x - t.x) * n,
					y: t.y + (e.y - t.y) * n
				}
			};
			return {
				start: t,
				startControl: e,
				endControl: n,
				end: r,
				subdivide: function(o) {
					var s = i(t, e, o),
						a = i(e, n, o),
						c = i(n, r, o),
						h = i(s, a, o),
						u = i(a, c, o),
						l = i(h, u, o);
					return [Y(t, s, h, l), Y(l, u, c, r)]
				},
				curveTo: function(t) {
					t.push(["bezierCurve", e.x, e.y, n.x, n.y, r.x, r.y])
				},
				curveToReversed: function(r) {
					r.push(["bezierCurve", n.x, n.y, e.x, e.y, t.x, t.y])
				}
			}
		}

		function J(t, e, n, r, i, o, s) {
			var a = [];
			return e[0] > 0 || e[1] > 0 ? (a.push(["line", r[1].start.x, r[1].start.y]), r[1].curveTo(a)) : a.push(["line", t.c1[0], t.c1[1]]), n[0] > 0 || n[1] > 0 ? (a.push(["line", o[0].start.x, o[0].start.y]), o[0].curveTo(a), a.push(["line", s[0].end.x, s[0].end.y]), s[0].curveToReversed(a)) : (a.push(["line", t.c2[0], t.c2[1]]), a.push(["line", t.c3[0], t.c3[1]])), e[0] > 0 || e[1] > 0 ? (a.push(["line", i[1].end.x, i[1].end.y]), i[1].curveToReversed(a)) : a.push(["line", t.c4[0], t.c4[1]]), a
		}

		function Q(t, e, n, r, i, o, s) {
			e[0] > 0 || e[1] > 0 ? (t.push(["line", r[0].start.x, r[0].start.y]), r[0].curveTo(t), r[1].curveTo(t)) : t.push(["line", o, s]), (n[0] > 0 || n[1] > 0) && t.push(["line", i[0].start.x, i[0].start.y])
		}

		function K(t) {
			return t.cssInt("zIndex") < 0
		}

		function Z(t) {
			return t.cssInt("zIndex") > 0
		}

		function $(t) {
			return 0 === t.cssInt("zIndex")
		}

		function tt(t) {
			return -1 !== ["inline", "inline-block", "inline-table"].indexOf(t.css("display"))
		}

		function et(t) {
			return t instanceof Ft
		}

		function nt(t) {
			return t.node.data.trim().length > 0
		}

		function rt(t) {
			return /^(normal|none|0px)$/.test(t.parent.css("letterSpacing"))
		}

		function it(t) {
			return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(e) {
				var n = t.css("border" + e + "Radius"),
					r = n.split(" ");
				return r.length <= 1 && (r[1] = r[0]), r.map(yt)
			})
		}

		function ot(t) {
			return t.nodeType === Node.TEXT_NODE || t.nodeType === Node.ELEMENT_NODE
		}

		function st(t) {
			var e = t.css("position"),
				n = -1 !== ["absolute", "relative", "fixed"].indexOf(e) ? t.css("zIndex") : "auto";
			return "auto" !== n
		}

		function at(t) {
			return "static" !== t.css("position")
		}

		function ct(t) {
			return "none" !== t.css("float")
		}

		function ht(t) {
			return -1 !== ["inline-block", "inline-table"].indexOf(t.css("display"))
		}

		function ut(t) {
			var e = this;
			return function() {
				return !t.apply(e, arguments)
			}
		}

		function lt(t) {
			return t.node.nodeType === Node.ELEMENT_NODE
		}

		function ft(t) {
			return t.isPseudoElement === !0
		}

		function dt(t) {
			return t.node.nodeType === Node.TEXT_NODE
		}

		function pt(t) {
			return function(e, n) {
				return e.cssInt("zIndex") + t.indexOf(e) / t.length - (n.cssInt("zIndex") + t.indexOf(n) / t.length)
			}
		}

		function gt(t) {
			return t.getOpacity() < 1
		}

		function mt(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		}

		function yt(t) {
			return parseInt(t, 10)
		}

		function wt(t) {
			return t.width
		}

		function vt(t) {
			return t.node.nodeType !== Node.ELEMENT_NODE || -1 === ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(t.node.nodeName)
		}

		function bt(t) {
			return [].concat.apply([], t)
		}

		function xt(t) {
			var e = t.substr(0, 1);
			return e === t.substr(t.length - 1) && e.match(/'|"/) ? t.substr(1, t.length - 2) : t
		}

		function St(e) {
			for (var n, r = [], i = 0, o = !1; e.length;) kt(e[i]) === o ? (n = e.splice(0, i), n.length && r.push(t.html2canvas.punycode.ucs2.encode(n)), o = !o, i = 0) : i++, i >= e.length && (n = e.splice(0, i), n.length && r.push(t.html2canvas.punycode.ucs2.encode(n)));
			return r
		}

		function kt(t) {
			return -1 !== [32, 13, 10, 9, 45].indexOf(t)
		}

		function It(t) {
			return /[^\u0000-\u00ff]/.test(t)
		}

		function Ct(t, e, n) {
			var r = qt(Yt),
				i = Tt(e, t, r);
			return Yt ? zt(i) : _t(n, i, r).then(function(t) {
				return Dt(t.content)
			})
		}

		function At(t, e, n) {
			var r = qt(Jt),
				i = Tt(e, t, r);
			return Jt ? Promise.resolve(i) : _t(n, i, r).then(function(t) {
				return "data:" + t.type + ";base64," + t.content
			})
		}

		function _t(e, n, r) {
			return new Promise(function(i, o) {
				var s = e.createElement("script"),
					a = function() {
						delete t.html2canvas.proxy[r], e.body.removeChild(s)
					};
				t.html2canvas.proxy[r] = function(t) {
					a(), i(t)
				}, s.src = n, s.onerror = function(t) {
					a(), o(t)
				}, e.body.appendChild(s)
			})
		}

		function qt(t) {
			return t ? "" : "html2canvas_" + Date.now() + "_" + ++Vt + "_" + Math.round(1e5 * Math.random())
		}

		function Tt(t, e, n) {
			return t + "?url=" + encodeURIComponent(e) + (n.length ? "&callback=html2canvas.proxy." + n : "")
		}

		function Pt(t, n) {
			var r = (e.createElement("script"), e.createElement("a"));
			r.href = t, t = r.href, this.src = t, this.image = new Image;
			var i = this;
			this.promise = new Promise(function(r, o) {
				i.image.crossOrigin = "Anonymous", i.image.onload = r, i.image.onerror = o, new At(t, n, e).then(function(t) {
					i.image.src = t
				})["catch"](o)
			})
		}

		function Et(t, e, n) {
			O.call(this, t, e), this.isPseudoElement = !0, this.before = ":before" === n
		}

		function Ot(t, e, n, r, i) {
			this.width = t, this.height = e, this.images = n, this.options = r, this.document = i
		}

		function Ft(t, e, n, r) {
			O.call(this, n, r), this.ownStacking = t, this.contexts = [], this.children = [], this.opacity = (this.parent ? this.parent.stack.opacity : 1) * e
		}

		function Bt(t) {
			this.rangeBounds = this.testRangeBounds(t), this.cors = this.testCORS(), this.svg = this.testSVG()
		}

		function Rt(t) {
			this.src = t, this.image = null;
			var e = this;
			this.promise = this.hasFabric().then(function() {
				return e.isInline(t) ? Promise.resolve(e.inlineFormatting(t)) : zt(t)
			}).then(function(t) {
				return new Promise(function(n) {
					html2canvas.fabric.loadSVGFromString(t, e.createCanvas.call(e, n))
				})
			})
		}
		/*
		 * base64-arraybuffer
		 * https://github.com/niklasvh/base64-arraybuffer
		 *
		 * Copyright (c) 2012 Niklas von Hertzen
		 * Licensed under the MIT license.
		 */
		function Dt(t) {
			var e, n, r, i, o, s, a, c, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
				u = t.length,
				l = "";
			for (e = 0; u > e; e += 4) n = h.indexOf(t[e]), r = h.indexOf(t[e + 1]), i = h.indexOf(t[e + 2]), o = h.indexOf(t[e + 3]), s = n << 2 | r >> 4, a = (15 & r) << 4 | i >> 2, c = (3 & i) << 6 | o, l += 64 === i ? String.fromCharCode(s) : 64 === o || -1 === o ? String.fromCharCode(s, a) : String.fromCharCode(s, a, c);
			return l
		}

		function jt(t, e) {
			this.src = t, this.image = null;
			var n = this;
			this.promise = e ? new Promise(function(e, r) {
				n.image = new Image, n.image.onload = e, n.image.onerror = r, n.image.src = "data:image/svg+xml," + (new XMLSerializer).serializeToString(t), n.image.complete === !0 && e(n.image)
			}) : this.hasFabric().then(function() {
				return new Promise(function(e) {
					html2canvas.fabric.parseSVGDocument(t, n.createCanvas.call(n, e))
				})
			})
		}

		function Mt(t, e) {
			O.call(this, t, e)
		}

		function Nt(t, e, n) {
			return t.length > 0 ? e + n.toUpperCase() : void 0
		}

		function Lt(t) {
			_.apply(this, arguments), this.type = "linear" === t.args[0] ? this.TYPES.LINEAR : this.TYPES.RADIAL
		}

		function zt(t) {
			return new Promise(function(e, n) {
				var r = new XMLHttpRequest;
				r.open("GET", t), r.onload = function() {
					200 === r.status ? e(r.responseText) : n(new Error(r.statusText))
				}, r.onerror = function() {
					n(new Error("Network Error"))
				}, r.send()
			})
		}

		function Ut(t, e) {
			Ot.apply(this, arguments), this.canvas = this.options.canvas || this.document.createElement("canvas"), this.options.canvas || (this.canvas.width = t, this.canvas.height = e), this.ctx = this.canvas.getContext("2d"), this.options.background && this.rectangle(0, 0, t, e, this.options.background), this.taintCtx = this.document.createElement("canvas").getContext("2d"), this.ctx.textBaseline = "bottom", this.variables = {}, E("Initialized CanvasRenderer with size", t, "x", e)
		}

		function Ht(t) {
			return t.length > 0
		}
		if (
			/*
			     Copyright (c) 2013 Yehuda Katz, Tom Dale, and contributors

			     
			     */
			! function() {
				var n, r, o, s;
				! function() {
					var t = {},
						e = {};
					n = function(e, n, r) {
						t[e] = {
							deps: n,
							callback: r
						}
					}, s = o = r = function(n) {
						function i(t) {
							if ("." !== t.charAt(0)) return t;
							for (var e = t.split("/"), r = n.split("/").slice(0, -1), i = 0, o = e.length; o > i; i++) {
								var s = e[i];
								if (".." === s) r.pop();
								else {
									if ("." === s) continue;
									r.push(s)
								}
							}
							return r.join("/")
						}
						if (s._eak_seen = t, e[n]) return e[n];
						if (e[n] = {}, !t[n]) throw new Error("Could not find module " + n);
						for (var o, a = t[n], c = a.deps, h = a.callback, u = [], l = 0, f = c.length; f > l; l++) "exports" === c[l] ? u.push(o = {}) : u.push(r(i(c[l])));
						var d = h.apply(this, u);
						return e[n] = o || d
					}
				}(), n("promise/all", ["./utils", "exports"], function(t, e) {
					function n(t) {
						var e = this;
						if (!r(t)) throw new TypeError("You must pass an array to all.");
						return new e(function(e, n) {
							function r(t) {
								return function(e) {
									o(t, e)
								}
							}

							function o(t, n) {
								a[t] = n, 0 === --c && e(a)
							}
							var s, a = [],
								c = t.length;
							0 === c && e([]);
							for (var h = 0; h < t.length; h++) s = t[h], s && i(s.then) ? s.then(r(h), n) : o(h, s)
						})
					}
					var r = t.isArray,
						i = t.isFunction;
					e.all = n
				}), n("promise/asap", ["exports"], function(n) {
					function r() {
						return function() {
							process.nextTick(a)
						}
					}

					function o() {
						var t = 0,
							n = new l(a),
							r = e.createTextNode("");
						return n.observe(r, {
								characterData: !0
							}),
							function() {
								r.data = t = ++t % 2
							}
					}

					function s() {
						return function() {
							f.setTimeout(a, 1)
						}
					}

					function a() {
						for (var t = 0; t < d.length; t++) {
							var e = d[t],
								n = e[0],
								r = e[1];
							n(r)
						}
						d = []
					}

					function c(t, e) {
						var n = d.push([t, e]);
						1 === n && h()
					}
					var h, u = "undefined" != typeof t ? t : {},
						l = u.MutationObserver || u.WebKitMutationObserver,
						f = "undefined" != typeof i ? i : this,
						d = [];
					h = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? r() : l ? o() : s(), n.asap = c
				}), n("promise/cast", ["exports"], function(t) {
					function e(t) {
						if (t && "object" == typeof t && t.constructor === this) return t;
						var e = this;
						return new e(function(e) {
							e(t)
						})
					}
					t.cast = e
				}), n("promise/config", ["exports"], function(t) {
					function e(t, e) {
						return 2 !== arguments.length ? n[t] : void(n[t] = e)
					}
					var n = {
						instrument: !1
					};
					t.config = n, t.configure = e
				}), n("promise/polyfill", ["./promise", "./utils", "exports"], function(e, n, r) {
					function i() {
						var e = "Promise" in t && "cast" in t.Promise && "resolve" in t.Promise && "reject" in t.Promise && "all" in t.Promise && "race" in t.Promise && function() {
							var e;
							return new t.Promise(function(t) {
								e = t
							}), s(e)
						}();
						e || (t.Promise = o)
					}
					var o = e.Promise,
						s = n.isFunction;
					r.polyfill = i
				}), n("promise/promise", ["./config", "./utils", "./cast", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(t, e, n, r, i, o, s, a, c) {
					function h(t) {
						if (!S(t)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
						if (!(this instanceof h)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
						this._subscribers = [], u(t, this)
					}

					function u(t, e) {
						function n(t) {
							g(e, t)
						}

						function r(t) {
							y(e, t)
						}
						try {
							t(n, r)
						} catch (i) {
							r(i)
						}
					}

					function l(t, e, n, r) {
						var i, o, s, a, c = S(n);
						if (c) try {
							i = n(r), s = !0
						} catch (h) {
							a = !0, o = h
						} else i = r, s = !0;
						p(e, i) || (c && s ? g(e, i) : a ? y(e, o) : t === E ? g(e, i) : t === O && y(e, i))
					}

					function f(t, e, n, r) {
						var i = t._subscribers,
							o = i.length;
						i[o] = e, i[o + E] = n, i[o + O] = r
					}

					function d(t, e) {
						for (var n, r, i = t._subscribers, o = t._detail, s = 0; s < i.length; s += 3) n = i[s], r = i[s + e], l(e, n, r, o);
						t._subscribers = null
					}

					function p(t, e) {
						var n, r = null;
						try {
							if (t === e) throw new TypeError("A promises callback cannot return that same promise.");
							if (x(e) && (r = e.then, S(r))) return r.call(e, function(r) {
								return n ? !0 : (n = !0, void(e !== r ? g(t, r) : m(t, r)))
							}, function(e) {
								return n ? !0 : (n = !0, void y(t, e))
							}), !0
						} catch (i) {
							return n ? !0 : (y(t, i), !0)
						}
						return !1
					}

					function g(t, e) {
						t === e ? m(t, e) : p(t, e) || m(t, e)
					}

					function m(t, e) {
						t._state === T && (t._state = P, t._detail = e, b.async(w, t))
					}

					function y(t, e) {
						t._state === T && (t._state = P, t._detail = e, b.async(v, t))
					}

					function w(t) {
						d(t, t._state = E)
					}

					function v(t) {
						d(t, t._state = O)
					}
					var b = t.config,
						x = (t.configure, e.objectOrFunction),
						S = e.isFunction,
						k = (e.now, n.cast),
						I = r.all,
						C = i.race,
						A = o.resolve,
						_ = s.reject,
						q = a.asap;
					b.async = q;
					var T = void 0,
						P = 0,
						E = 1,
						O = 2;
					h.prototype = {
						constructor: h,
						_state: void 0,
						_detail: void 0,
						_subscribers: void 0,
						then: function(t, e) {
							var n = this,
								r = new this.constructor(function() {});
							if (this._state) {
								var i = arguments;
								b.async(function() {
									l(n._state, r, i[n._state - 1], n._detail)
								})
							} else f(this, r, t, e);
							return r
						},
						"catch": function(t) {
							return this.then(null, t)
						}
					}, h.all = I, h.cast = k, h.race = C, h.resolve = A, h.reject = _, c.Promise = h
				}), n("promise/race", ["./utils", "exports"], function(t, e) {
					function n(t) {
						var e = this;
						if (!r(t)) throw new TypeError("You must pass an array to race.");
						return new e(function(e, n) {
							for (var r, i = 0; i < t.length; i++) r = t[i], r && "function" == typeof r.then ? r.then(e, n) : e(r)
						})
					}
					var r = t.isArray;
					e.race = n
				}), n("promise/reject", ["exports"], function(t) {
					function e(t) {
						var e = this;
						return new e(function(e, n) {
							n(t)
						})
					}
					t.reject = e
				}), n("promise/resolve", ["exports"], function(t) {
					function e(t) {
						var e = this;
						return new e(function(e) {
							e(t)
						})
					}
					t.resolve = e
				}), n("promise/utils", ["exports"], function(t) {
					function e(t) {
						return n(t) || "object" == typeof t && null !== t
					}

					function n(t) {
						return "function" == typeof t
					}

					function r(t) {
						return "[object Array]" === Object.prototype.toString.call(t)
					}
					var i = Date.now || function() {
						return (new Date).getTime()
					};
					t.objectOrFunction = e, t.isFunction = n, t.isArray = r, t.now = i
				}), r("promise/polyfill").polyfill()
			}(), "function" != typeof Object.create || "function" != typeof e.createElement("canvas").getContext) return void(t.html2canvas = function() {
			return Promise.reject("No canvas support")
		});
		! function(t) {
			function e(t) {
				throw RangeError(B[t])
			}

			function s(t, e) {
				for (var n = t.length, r = []; n--;) r[n] = e(t[n]);
				return r
			}

			function a(t, e) {
				var n = t.split("@"),
					r = "";
				n.length > 1 && (r = n[0] + "@", t = n[1]);
				var i = t.split(F),
					o = s(i, e).join(".");
				return r + o
			}

			function c(t) {
				for (var e, n, r = [], i = 0, o = t.length; o > i;) e = t.charCodeAt(i++), e >= 55296 && 56319 >= e && o > i ? (n = t.charCodeAt(i++), 56320 == (64512 & n) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), i--)) : r.push(e);
				return r
			}

			function h(t) {
				return s(t, function(t) {
					var e = "";
					return t > 65535 && (t -= 65536, e += j(t >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), e += j(t)
				}).join("")
			}

			function u(t) {
				return 10 > t - 48 ? t - 22 : 26 > t - 65 ? t - 65 : 26 > t - 97 ? t - 97 : k
			}

			function l(t, e) {
				return t + 22 + 75 * (26 > t) - ((0 != e) << 5)
			}

			function f(t, e, n) {
				var r = 0;
				for (t = n ? D(t / _) : t >> 1, t += D(t / e); t > R * C >> 1; r += k) t = D(t / R);
				return D(r + (R + 1) * t / (t + A))
			}

			function d(t) {
				var n, r, i, o, s, a, c, l, d, p, g = [],
					m = t.length,
					y = 0,
					w = T,
					v = q;
				for (r = t.lastIndexOf(P), 0 > r && (r = 0), i = 0; r > i; ++i) t.charCodeAt(i) >= 128 && e("not-basic"), g.push(t.charCodeAt(i));
				for (o = r > 0 ? r + 1 : 0; m > o;) {
					for (s = y, a = 1, c = k; o >= m && e("invalid-input"), l = u(t.charCodeAt(o++)), (l >= k || l > D((S - y) / a)) && e("overflow"), y += l * a, d = v >= c ? I : c >= v + C ? C : c - v, !(d > l); c += k) p = k - d, a > D(S / p) && e("overflow"), a *= p;
					n = g.length + 1, v = f(y - s, n, 0 == s), D(y / n) > S - w && e("overflow"), w += D(y / n), y %= n, g.splice(y++, 0, w)
				}
				return h(g)
			}

			function p(t) {
				var n, r, i, o, s, a, h, u, d, p, g, m, y, w, v, b = [];
				for (t = c(t), m = t.length, n = T, r = 0, s = q, a = 0; m > a; ++a) g = t[a], 128 > g && b.push(j(g));
				for (i = o = b.length, o && b.push(P); m > i;) {
					for (h = S, a = 0; m > a; ++a) g = t[a], g >= n && h > g && (h = g);
					for (y = i + 1, h - n > D((S - r) / y) && e("overflow"), r += (h - n) * y, n = h, a = 0; m > a; ++a)
						if (g = t[a], n > g && ++r > S && e("overflow"), g == n) {
							for (u = r, d = k; p = s >= d ? I : d >= s + C ? C : d - s, !(p > u); d += k) v = u - p, w = k - p, b.push(j(l(p + v % w, 0))), u = D(v / w);
							b.push(j(l(u, 0))), s = f(r, y, i == o), r = 0, ++i
						}++r, ++n
				}
				return b.join("")
			}

			function g(t) {
				return a(t, function(t) {
					return E.test(t) ? d(t.slice(4).toLowerCase()) : t
				})
			}

			function m(t) {
				return a(t, function(t) {
					return O.test(t) ? "xn--" + p(t) : t
				})
			}
			var y = "object" == typeof r && r && !r.nodeType && r,
				w = "object" == typeof n && n && !n.nodeType && n,
				v = "object" == typeof i && i;
			v.global !== v && v.window !== v && v.self !== v || (t = v);
			var b, x, S = 2147483647,
				k = 36,
				I = 1,
				C = 26,
				A = 38,
				_ = 700,
				q = 72,
				T = 128,
				P = "-",
				E = /^xn--/,
				O = /[^\x20-\x7E]/,
				F = /[\x2E\u3002\uFF0E\uFF61]/g,
				B = {
					overflow: "Overflow: input needs wider integers to process",
					"not-basic": "Illegal input >= 0x80 (not a basic code point)",
					"invalid-input": "Invalid input"
				},
				R = k - I,
				D = Math.floor,
				j = String.fromCharCode;
			if (b = {
					version: "1.3.1",
					ucs2: {
						decode: c,
						encode: h
					},
					decode: d,
					encode: p,
					toASCII: m,
					toUnicode: g
				}, "function" == typeof o && "object" == typeof o.amd && o.amd) o("punycode", function() {
				return b
			});
			else if (y && w)
				if (n.exports == y) w.exports = b;
				else
					for (x in b) b.hasOwnProperty(x) && (y[x] = b[x]);
			else t.punycode = b
		}(this);
		var Wt = "data-html2canvas-node",
			Xt = "data-html2canvas-canvas-clone",
			Gt = 0;
		t.html2canvas = function(n, r) {
			if (r = r || {}, r.logging && (t.html2canvas.logging = !0, t.html2canvas.start = Date.now()), r.async = "undefined" == typeof r.async ? !0 : r.async, r.allowTaint = "undefined" == typeof r.allowTaint ? !1 : r.allowTaint, r.removeContainer = "undefined" == typeof r.removeContainer ? !0 : r.removeContainer, r.javascriptEnabled = "undefined" == typeof r.javascriptEnabled ? !1 : r.javascriptEnabled, r.imageTimeout = "undefined" == typeof r.imageTimeout ? 1e4 : r.imageTimeout, "string" == typeof n) return "string" != typeof r.proxy ? Promise.reject("Proxy must be used when rendering url") : m(S(n), r.proxy, e, t.innerWidth, t.innerHeight, r).then(function(e) {
				return c(e.contentWindow.document.documentElement, e, r, t.innerWidth, t.innerHeight)
			});
			var i = (n === s ? [e.documentElement] : n.length ? n : [n])[0];
			return i.setAttribute(Wt, "true"), a(i.ownerDocument, r, i.ownerDocument.defaultView.innerWidth, i.ownerDocument.defaultView.innerHeight).then(function(t) {
				return "function" == typeof r.onrendered && (E("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), r.onrendered(t)), t
			})
		}, t.html2canvas.punycode = this.punycode, t.html2canvas.proxy = {}, C.prototype.getMetrics = function(t, e) {
			return this.data[t + "-" + e] === s && (this.data[t + "-" + e] = new I(t, e)), this.data[t + "-" + e]
		}, A.prototype.proxyLoad = function(t, e, n) {
			var r = this.src;
			return m(r.src, t, r.ownerDocument, e.width, e.height, n)
		}, _.prototype.TYPES = {
			LINEAR: 1,
			RADIAL: 2
		}, T.prototype.findImages = function(t) {
			var e = [];
			return t.reduce(function(t, e) {
				switch (e.node.nodeName) {
					case "IMG":
						return t.concat([{
							args: [e.node.src],
							method: "url"
						}]);
					case "svg":
					case "IFRAME":
						return t.concat([{
							args: [e.node],
							method: e.node.nodeName
						}])
				}
				return t
			}, []).forEach(this.addImage(e, this.loadImage), this), e
		}, T.prototype.findBackgroundImage = function(t, e) {
			return e.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(t, this.loadImage), this), t
		}, T.prototype.addImage = function(t, e) {
			return function(n) {
				n.args.forEach(function(r) {
					this.imageExists(t, r) || (t.splice(0, 0, e.call(this, n)), E("Added image #" + t.length, "string" == typeof r ? r.substring(0, 100) : r))
				}, this)
			}
		}, T.prototype.hasImageBackground = function(t) {
			return "none" !== t.method
		}, T.prototype.loadImage = function(t) {
			if ("url" === t.method) {
				var e = t.args[0];
				return !this.isSVG(e) || this.support.svg || this.options.allowTaint ? e.match(/data:image\/.*;base64,/i) ? new q(e.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), !1) : this.isSameOrigin(e) || this.options.allowTaint === !0 || this.isSVG(e) ? new q(e, !1) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new q(e, !0) : this.options.proxy ? new Pt(e, this.options.proxy) : new k(e) : new Rt(e)
			}
			return "linear-gradient" === t.method ? new P(t) : "gradient" === t.method ? new Lt(t) : "svg" === t.method ? new jt(t.args[0], this.support.svg) : "IFRAME" === t.method ? new A(t.args[0], this.isSameOrigin(t.args[0].src), this.options) : new k(t)
		}, T.prototype.isSVG = function(t) {
			return "svg" === t.substring(t.length - 3).toLowerCase() || Rt.prototype.isInline(t)
		}, T.prototype.imageExists = function(t, e) {
			return t.some(function(t) {
				return t.src === e
			})
		}, T.prototype.isSameOrigin = function(t) {
			return this.getOrigin(t) === this.origin
		}, T.prototype.getOrigin = function(t) {
			var n = this.link || (this.link = e.createElement("a"));
			return n.href = t, n.href = n.href, n.protocol + n.hostname + n.port
		}, T.prototype.getPromise = function(t) {
			return this.timeout(t, this.options.imageTimeout)["catch"](function() {
				var e = new k(t.src);
				return e.promise.then(function(e) {
					t.image = e
				})
			})
		}, T.prototype.get = function(t) {
			var e = null;
			return this.images.some(function(n) {
				return (e = n).src === t
			}) ? e : null
		}, T.prototype.fetch = function(t) {
			return this.images = t.reduce(mt(this.findBackgroundImage, this), this.findImages(t)), this.images.forEach(function(t, e) {
				t.promise.then(function() {
					E("Succesfully loaded image #" + (e + 1), t)
				}, function(n) {
					E("Failed loading image #" + (e + 1), t, n)
				})
			}), this.ready = Promise.all(this.images.map(this.getPromise, this)), E("Finished searching images"), this
		}, T.prototype.timeout = function(t, e) {
			var n;
			return Promise.race([t.promise, new Promise(function(r, i) {
				n = setTimeout(function() {
					E("Timed out loading image", t), i(t)
				}, e)
			})]).then(function(t) {
				return clearTimeout(n), t
			})
		}, P.prototype = Object.create(_.prototype), P.prototype.stepRegExp = /((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/, O.prototype.cloneTo = function(t) {
			t.visible = this.visible, t.borders = this.borders, t.bounds = this.bounds, t.clip = this.clip, t.backgroundClip = this.backgroundClip, t.computedStyles = this.computedStyles, t.styles = this.styles, t.backgroundImages = this.backgroundImages, t.opacity = this.opacity
		}, O.prototype.getOpacity = function() {
			return null === this.opacity ? this.opacity = this.cssFloat("opacity") : this.opacity
		}, O.prototype.assignStack = function(t) {
			this.stack = t, t.children.push(this)
		}, O.prototype.isElementVisible = function() {
			return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : "none" !== this.css("display") && "hidden" !== this.css("visibility") && !this.node.hasAttribute("data-html2canvas-ignore") && ("INPUT" !== this.node.nodeName || "hidden" !== this.node.getAttribute("type"))
		}, O.prototype.css = function(t) {
			return this.computedStyles || (this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null)), this.styles[t] || (this.styles[t] = this.computedStyles[t])
		}, O.prototype.prefixedCss = function(t) {
			var e = ["webkit", "moz", "ms", "o"],
				n = this.css(t);
			return n === s && e.some(function(e) {
				return n = this.css(e + t.substr(0, 1).toUpperCase() + t.substr(1)), n !== s
			}, this), n === s ? null : n
		}, O.prototype.computedStyle = function(t) {
			return this.node.ownerDocument.defaultView.getComputedStyle(this.node, t)
		}, O.prototype.cssInt = function(t) {
			var e = parseInt(this.css(t), 10);
			return isNaN(e) ? 0 : e
		}, O.prototype.cssFloat = function(t) {
			var e = parseFloat(this.css(t));
			return isNaN(e) ? 0 : e
		}, O.prototype.fontWeight = function() {
			var t = this.css("fontWeight");
			switch (parseInt(t, 10)) {
				case 401:
					t = "bold";
					break;
				case 400:
					t = "normal"
			}
			return t
		}, O.prototype.parseClip = function() {
			var t = this.css("clip").match(this.CLIP);
			return t ? {
				top: parseInt(t[1], 10),
				right: parseInt(t[2], 10),
				bottom: parseInt(t[3], 10),
				left: parseInt(t[4], 10)
			} : null
		}, O.prototype.parseBackgroundImages = function() {
			return this.backgroundImages || (this.backgroundImages = D(this.css("backgroundImage")))
		}, O.prototype.cssList = function(t, e) {
			var n = (this.css(t) || "").split(",");
			return n = n[e || 0] || n[0] || "auto", n = n.trim().split(" "), 1 === n.length && (n = [n[0], n[0]]), n
		}, O.prototype.parseBackgroundSize = function(t, e, n) {
			var r, i, o = this.cssList("backgroundSize", n);
			if (R(o[0])) r = t.width * parseFloat(o[0]) / 100;
			else {
				if (/contain|cover/.test(o[0])) {
					var s = t.width / t.height,
						a = e.width / e.height;
					return a > s ^ "contain" === o[0] ? {
						width: t.height * a,
						height: t.height
					} : {
						width: t.width,
						height: t.width / a
					}
				}
				r = parseInt(o[0], 10)
			}
			return i = "auto" === o[0] && "auto" === o[1] ? e.height : "auto" === o[1] ? r / e.width * e.height : R(o[1]) ? t.height * parseFloat(o[1]) / 100 : parseInt(o[1], 10), "auto" === o[0] && (r = i / e.height * e.width), {
				width: r,
				height: i
			}
		}, O.prototype.parseBackgroundPosition = function(t, e, n, r) {
			var i, o, s = this.cssList("backgroundPosition", n);
			return i = R(s[0]) ? (t.width - (r || e).width) * (parseFloat(s[0]) / 100) : parseInt(s[0], 10), o = "auto" === s[1] ? i / e.width * e.height : R(s[1]) ? (t.height - (r || e).height) * parseFloat(s[1]) / 100 : parseInt(s[1], 10), "auto" === s[0] && (i = o / e.height * e.width), {
				left: i,
				top: o
			}
		}, O.prototype.parseBackgroundRepeat = function(t) {
			return this.cssList("backgroundRepeat", t)[0]
		}, O.prototype.parseTextShadows = function() {
			var t = this.css("textShadow"),
				e = [];
			if (t && "none" !== t)
				for (var n = t.match(this.TEXT_SHADOW_PROPERTY), r = 0; n && r < n.length; r++) {
					var i = n[r].match(this.TEXT_SHADOW_VALUES);
					e.push({
						color: i[0],
						offsetX: i[1] ? parseFloat(i[1].replace("px", "")) : 0,
						offsetY: i[2] ? parseFloat(i[2].replace("px", "")) : 0,
						blur: i[3] ? i[3].replace("px", "") : 0
					})
				}
			return e
		}, O.prototype.parseTransform = function() {
			if (!this.transformData)
				if (this.hasTransform()) {
					var t = this.parseBounds(),
						e = this.prefixedCss("transformOrigin").split(" ").map(j).map(M);
					e[0] += t.left, e[1] += t.top, this.transformData = {
						origin: e,
						matrix: this.parseTransformMatrix()
					}
				} else this.transformData = {
					origin: [0, 0],
					matrix: [1, 0, 0, 1, 0, 0]
				};
			return this.transformData
		}, O.prototype.parseTransformMatrix = function() {
			if (!this.transformMatrix) {
				var t = this.prefixedCss("transform"),
					e = t ? B(t.match(this.MATRIX_PROPERTY)) : null;
				this.transformMatrix = e ? e : [1, 0, 0, 1, 0, 0]
			}
			return this.transformMatrix
		}, O.prototype.parseBounds = function() {
			return this.bounds || (this.bounds = this.hasTransform() ? L(this.node) : N(this.node))
		}, O.prototype.hasTransform = function() {
			return "1,0,0,1,0,0" !== this.parseTransformMatrix().join(",") || this.parent && this.parent.hasTransform()
		}, O.prototype.getValue = function() {
			var t = this.node.value || "";
			return t = "SELECT" === this.node.tagName ? F(this.node) : t, 0 === t.length ? this.node.placeholder || "" : t
		}, O.prototype.MATRIX_PROPERTY = /(matrix)\((.+)\)/, O.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g, O.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g, O.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/, z.prototype.calculateOverflowClips = function() {
			this.nodes.forEach(function(t) {
				if (lt(t)) {
					ft(t) && t.appendToDOM(), t.borders = this.parseBorders(t);
					var e = "hidden" === t.css("overflow") ? [t.borders.clip] : [],
						n = t.parseClip();
					n && -1 !== ["absolute", "fixed"].indexOf(t.css("position")) && e.push([["rect", t.bounds.left + n.left, t.bounds.top + n.top, n.right - n.left, n.bottom - n.top]]), t.clip = U(t) ? t.parent.clip.concat(e) : e, t.backgroundClip = "hidden" !== t.css("overflow") ? t.clip.concat([t.borders.clip]) : t.clip, ft(t) && t.cleanDOM()
				} else dt(t) && (t.clip = U(t) ? t.parent.clip : []);
				ft(t) || (t.bounds = null)
			}, this)
		}, z.prototype.asyncRenderer = function(t, e, n) {
			n = n || Date.now(), this.paint(t[this.renderIndex++]), t.length === this.renderIndex ? e() : n + 20 > Date.now() ? this.asyncRenderer(t, e, n) : setTimeout(mt(function() {
				this.asyncRenderer(t, e)
			}, this), 0)
		}, z.prototype.createPseudoHideStyles = function(t) {
			this.createStyles(t, "." + Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }.' + Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }')
		}, z.prototype.disableAnimations = function(t) {
			this.createStyles(t, "* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}")
		}, z.prototype.createStyles = function(t, e) {
			var n = t.createElement("style");
			n.innerHTML = e, t.body.appendChild(n)
		}, z.prototype.getPseudoElements = function(t) {
			var e = [[t]];
			if (t.node.nodeType === Node.ELEMENT_NODE) {
				var n = this.getPseudoElement(t, ":before"),
					r = this.getPseudoElement(t, ":after");
				n && e.push(n), r && e.push(r)
			}
			return bt(e)
		}, z.prototype.getPseudoElement = function(t, n) {
			var r = t.computedStyle(n);
			if (!r || !r.content || "none" === r.content || "-moz-alt-content" === r.content || "none" === r.display) return null;
			for (var i = xt(r.content), o = "url" === i.substr(0, 3), s = e.createElement(o ? "img" : "html2canvaspseudoelement"), a = new Et(s, t, n), c = r.length - 1; c >= 0; c--) {
				var h = H(r.item(c));
				s.style[h] = r[h]
			}
			if (s.className = Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, o) return s.src = D(i)[0].args[0], [a];
			var u = e.createTextNode(i);
			return s.appendChild(u), [a, new Mt(u, a)]
		}, z.prototype.getChildren = function(t) {
			return bt([].filter.call(t.node.childNodes, ot).map(function(e) {
				var n = [e.nodeType === Node.TEXT_NODE ? new Mt(e, t) : new O(e, t)].filter(vt);
				return e.nodeType === Node.ELEMENT_NODE && n.length && "TEXTAREA" !== e.tagName ? n[0].isElementVisible() ? n.concat(this.getChildren(n[0])) : [] : n
			}, this))
		}, z.prototype.newStackingContext = function(t, e) {
			var n = new Ft(e, t.getOpacity(), t.node, t.parent);
			t.cloneTo(n);
			var r = e ? n.getParentStack(this) : n.parent.stack;
			r.contexts.push(n), t.stack = n
		}, z.prototype.createStackingContexts = function() {
			this.nodes.forEach(function(t) {
				lt(t) && (this.isRootElement(t) || gt(t) || st(t) || this.isBodyWithTransparentRoot(t) || t.hasTransform()) ? this.newStackingContext(t, !0) : lt(t) && (at(t) && $(t) || ht(t) || ct(t)) ? this.newStackingContext(t, !1) : t.assignStack(t.parent.stack)
			}, this)
		}, z.prototype.isBodyWithTransparentRoot = function(t) {
			return "BODY" === t.node.nodeName && this.renderer.isTransparent(t.parent.css("backgroundColor"))
		}, z.prototype.isRootElement = function(t) {
			return null === t.parent
		}, z.prototype.sortStackingContexts = function(t) {
			t.contexts.sort(pt(t.contexts.slice(0))), t.contexts.forEach(this.sortStackingContexts, this)
		}, z.prototype.parseTextBounds = function(t) {
			return function(e, n, r) {
				if ("none" !== t.parent.css("textDecoration").substr(0, 4) || 0 !== e.trim().length) {
					if (this.support.rangeBounds && !t.parent.hasTransform()) {
						var i = r.slice(0, n).join("").length;
						return this.getRangeBounds(t.node, i, e.length)
					}
					if (t.node && "string" == typeof t.node.data) {
						var o = t.node.splitText(e.length),
							s = this.getWrapperBounds(t.node, t.parent.hasTransform());
						return t.node = o, s
					}
				} else this.support.rangeBounds && !t.parent.hasTransform() || (t.node = t.node.splitText(e.length));
				return {}
			}
		}, z.prototype.getWrapperBounds = function(t, e) {
			var n = t.ownerDocument.createElement("html2canvaswrapper"),
				r = t.parentNode,
				i = t.cloneNode(!0);
			n.appendChild(t.cloneNode(!0)), r.replaceChild(n, t);
			var o = e ? L(n) : N(n);
			return r.replaceChild(i, n), o
		}, z.prototype.getRangeBounds = function(t, e, n) {
			var r = this.range || (this.range = t.ownerDocument.createRange());
			return r.setStart(t, e), r.setEnd(t, e + n), r.getBoundingClientRect()
		}, z.prototype.parse = function(t) {
			var e = t.contexts.filter(K),
				n = t.children.filter(lt),
				r = n.filter(ut(ct)),
				i = r.filter(ut(at)).filter(ut(tt)),
				o = n.filter(ut(at)).filter(ct),
				s = r.filter(ut(at)).filter(tt),
				a = t.contexts.concat(r.filter(at)).filter($),
				c = t.children.filter(dt).filter(nt),
				h = t.contexts.filter(Z);
			e.concat(i).concat(o).concat(s).concat(a).concat(c).concat(h).forEach(function(t) {
				this.renderQueue.push(t), et(t) && (this.parse(t), this.renderQueue.push(new W))
			}, this)
		}, z.prototype.paint = function(t) {
			try {
				t instanceof W ? this.renderer.ctx.restore() : dt(t) ? (ft(t.parent) && t.parent.appendToDOM(), this.paintText(t), ft(t.parent) && t.parent.cleanDOM()) : this.paintNode(t)
			} catch (e) {
				E(e)
			}
		}, z.prototype.paintNode = function(t) {
			if (et(t) && (this.renderer.setOpacity(t.opacity), this.renderer.ctx.save(), t.hasTransform() && this.renderer.setTransform(t.parseTransform())), "INPUT" === t.node.nodeName && "checkbox" === t.node.type) this.paintCheckbox(t);
			else if ("INPUT" === t.node.nodeName && "radio" === t.node.type) this.paintRadio(t);
			else {
				if ("always" === t.css("page-break-before")) {
					var e = this.options.canvas.getContext("2d");
					"function" == typeof e._pageBreakAt && e._pageBreakAt(t.node.offsetTop)
				}
				this.paintElement(t)
			}
			if (t.node.getAttribute) {
				var n = t.node.getAttribute("name");
				if (null === n) var n = t.node.getAttribute("id");
				if (null !== n) {
					var r = this.options.canvas.annotations;
					r && r.setName(n, t.bounds)
				}
			}
		}, z.prototype.paintElement = function(t) {
			var e = t.parseBounds();
			this.renderer.clip(t.backgroundClip, function() {
				this.renderer.renderBackground(t, e, t.borders.borders.map(wt))
			}, this), this.renderer.clip(t.clip, function() {
				this.renderer.renderBorders(t.borders.borders)
			}, this), this.renderer.clip(t.backgroundClip, function() {
				switch (t.node.nodeName) {
					case "svg":
					case "IFRAME":
						var n = this.images.get(t.node);
						n ? this.renderer.renderImage(t, e, t.borders, n) : E("Error loading <" + t.node.nodeName + ">", t.node);
						break;
					case "IMG":
						var r = this.images.get(t.node.src);
						r ? this.renderer.renderImage(t, e, t.borders, r) : E("Error loading <img>", t.node.src);
						break;
					case "CANVAS":
						this.renderer.renderImage(t, e, t.borders, {
							image: t.node
						});
						break;
					case "SELECT":
					case "INPUT":
					case "TEXTAREA":
						this.paintFormValue(t)
				}
			}, this)
		}, z.prototype.paintCheckbox = function(t) {
			var e = t.parseBounds(),
				n = Math.min(e.width, e.height),
				r = {
					width: n - 1,
					height: n - 1,
					top: e.top,
					left: e.left
				},
				i = [3, 3],
				o = [i, i, i, i],
				s = [1, 1, 1, 1].map(function(t) {
					return {
						color: "#A5A5A5",
						width: t
					}
				}),
				a = V(r, o, s);
			this.renderer.clip(t.backgroundClip, function() {
				this.renderer.rectangle(r.left + 1, r.top + 1, r.width - 2, r.height - 2, "#DEDEDE"), this.renderer.renderBorders(X(s, r, a, o)), t.node.checked && (this.renderer.font("#424242", "normal", "normal", "bold", n - 3 + "px", "arial"), this.renderer.text("✔", r.left + n / 6, r.top + n - 1))
			}, this)
		}, z.prototype.paintRadio = function(t) {
			var e = t.parseBounds(),
				n = Math.min(e.width, e.height) - 2;
			this.renderer.clip(t.backgroundClip, function() {
				this.renderer.circleStroke(e.left + 1, e.top + 1, n, "#DEDEDE", 1, "#A5A5A5"), t.node.checked && this.renderer.circle(Math.ceil(e.left + n / 4) + 1, Math.ceil(e.top + n / 4) + 1, Math.floor(n / 2), "#424242")
			}, this)
		}, z.prototype.paintFormValue = function(t) {
			if (t.getValue().length > 0) {
				var e = t.node.ownerDocument,
					n = e.createElement("html2canvaswrapper"),
					r = ["lineHeight", "textAlign", "fontFamily", "fontWeight", "fontSize", "color", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "width", "height", "borderLeftStyle", "borderTopStyle", "borderLeftWidth", "borderTopWidth", "boxSizing", "whiteSpace", "wordWrap"];
				r.forEach(function(e) {
					try {
						n.style[e] = t.css(e)
					} catch (r) {
						E("html2canvas: Parse: Exception caught in renderFormValue: " + r.message)
					}
				});
				var i = t.parseBounds();
				n.style.position = "fixed", n.style.left = i.left + "px", n.style.top = i.top + "px", n.textContent = t.getValue(), e.body.appendChild(n), this.paintText(new Mt(n.firstChild, t)), e.body.removeChild(n)
			}
		}, z.prototype.paintText = function(e) {
			e.applyTextTransform();
			var n = t.html2canvas.punycode.ucs2.decode(e.node.data),
				r = this.options.letterRendering && !rt(e) || It(e.node.data) ? n.map(function(e) {
					return t.html2canvas.punycode.ucs2.encode([e])
				}) : St(n),
				i = e.parent.fontWeight(),
				o = e.parent.css("fontSize"),
				a = e.parent.css("fontFamily"),
				c = e.parent.parseTextShadows();
			this.renderer.font(e.parent.css("color"), e.parent.css("fontStyle"), e.parent.css("fontVariant"), i, o, a), c.length ? this.renderer.fontShadow(c[0].color, c[0].offsetX, c[0].offsetY, c[0].blur) : this.renderer.clearShadow(), this.renderer.clip(e.parent.clip, function() {
				r.map(this.parseTextBounds(e), this).forEach(function(t, n) {
					t && (t.left === s && (t.left = 0), t.bottom === s && (t.bottom = 0), this.renderer.text(r[n], t.left, t.bottom), this.renderTextDecoration(e.parent, t, this.fontMetrics.getMetrics(a, o)), 0 == n && "LI" === e.parent.node.nodeName && this.renderBullet(e, t), 0 == n && this.renderAnnotation(e.parent, t))
				}, this)
			}, this)
		}, z.prototype.generateListNumber = {
			listAlpha: function(t) {
				var e, n = "";
				do e = t % 26, n = String.fromCharCode(e + 64) + n, t /= 26; while (26 * t > 26);
				return n
			},
			listRoman: function(t) {
				var e, n = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
					r = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
					i = "",
					o = n.length;
				if (0 >= t || t >= 4e3) return t;
				for (e = 0; o > e; e += 1)
					for (; t >= r[e];) t -= r[e], i += n[e];
				return i
			}
		}, z.prototype.listItemText = function(t, e) {
			switch (t) {
				case "decimal-leading-zero":
					text = 1 === e.toString().length ? e = "0" + e.toString() : e.toString();
					break;
				case "upper-roman":
					text = this.generateListNumber.listRoman(e);
					break;
				case "lower-roman":
					text = this.generateListNumber.listRoman(e).toLowerCase();
					break;
				case "lower-alpha":
					text = this.generateListNumber.listAlpha(e).toLowerCase();
					break;
				case "upper-alpha":
					text = this.generateListNumber.listAlpha(e);
					break;
				case "decimal":
				default:
					text = e
			}
			return text
		}, z.prototype.renderBullet = function(t, e) {
			var n = t.parent.css("listStyleType");
			if ("none" !== n) {
				var r = e.top + (e.bottom - e.top) / 2,
					i = this.renderer.canvas.getContext("2d"),
					o = i.measureText("M").width,
					s = o / 4,
					a = .75 * o,
					c = e.left - a;
				switch (n) {
					case "decimal":
					case "decimal-leading-zero":
					case "upper-alpha":
					case "lower-alpha":
					case "upper-roman":
					case "lower-roman":
						var h = t.parent,
							u = h.parent,
							l = Array.prototype.slice.call(u.node.children),
							f = l.indexOf(h.node) + 1,
							d = this.listItemText(n, f);
						d += ".";
						var p = e.left - a;
						p -= i.measureText(d).width, i.fillText(d, p, e.bottom);
						break;
					case "square":
						var s = o / 3;
						c -= s, r -= s / 2, i.fillRect(c, r, s, s);
						break;
					case "circle":
						var s = o / 6;
						c -= s, i.beginPath(), i.arc(c, r, s, 0, 2 * Math.PI), i.closePath(), i.stroke();
						break;
					case "disc":
					default:
						var s = o / 6;
						c -= s, i.beginPath(), i.arc(c, r, s, 0, 2 * Math.PI), i.closePath(), i.fill()
				}
			}
		}, z.prototype.renderTextDecoration = function(t, e, n) {
			switch (t.css("textDecoration").split(" ")[0]) {
				case "underline":
					this.renderer.rectangle(e.left, Math.round(e.top + n.baseline + n.lineWidth), e.width, 1, t.css("color"));
					break;
				case "overline":
					this.renderer.rectangle(e.left, Math.round(e.top), e.width, 1, t.css("color"));
					break;
				case "line-through":
					this.renderer.rectangle(e.left, Math.ceil(e.top + n.middle + n.lineWidth), e.width, 1, t.css("color"))
			}
		}, z.prototype.renderAnnotation = function(t, e) {
			if ("A" === t.node.nodeName) {
				var n = t.node.getAttribute("href");
				if (n) {
					var r = this.options.canvas.annotations;
					r && r.createAnnotation(n, t.bounds)
				}
			}
		}, z.prototype.parseBorders = function(t) {
			var e = t.parseBounds(),
				n = it(t),
				r = ["Top", "Right", "Bottom", "Left"].map(function(e) {
					return {
						width: t.cssInt("border" + e + "Width"),
						color: t.css("border" + e + "Color"),
						args: null
					}
				}),
				i = V(e, n, r);
			return {
				clip: this.parseBackgroundClip(t, i, r, n, e),
				borders: X(r, e, i, n)
			}
		}, z.prototype.parseBackgroundClip = function(t, e, n, r, i) {
			var o = t.css("backgroundClip"),
				s = [];
			switch (o) {
				case "content-box":
				case "padding-box":
					Q(s, r[0], r[1], e.topLeftInner, e.topRightInner, i.left + n[3].width, i.top + n[0].width), Q(s, r[1], r[2], e.topRightInner, e.bottomRightInner, i.left + i.width - n[1].width, i.top + n[0].width), Q(s, r[2], r[3], e.bottomRightInner, e.bottomLeftInner, i.left + i.width - n[1].width, i.top + i.height - n[2].width), Q(s, r[3], r[0], e.bottomLeftInner, e.topLeftInner, i.left + n[3].width, i.top + i.height - n[2].width);
					break;
				default:
					Q(s, r[0], r[1], e.topLeftOuter, e.topRightOuter, i.left, i.top), Q(s, r[1], r[2], e.topRightOuter, e.bottomRightOuter, i.left + i.width, i.top), Q(s, r[2], r[3], e.bottomRightOuter, e.bottomLeftOuter, i.left + i.width, i.top + i.height), Q(s, r[3], r[0], e.bottomLeftOuter, e.topLeftOuter, i.left, i.top + i.height)
			}
			return s
		};
		var Vt = 0,
			Yt = "withCredentials" in new XMLHttpRequest,
			Jt = "crossOrigin" in new Image;
		Et.prototype.cloneTo = function(t) {
			Et.prototype.cloneTo.call(this, t), t.isPseudoElement = !0, t.before = this.before
		}, Et.prototype = Object.create(O.prototype), Et.prototype.appendToDOM = function() {
			this.before ? this.parent.node.insertBefore(this.node, this.parent.node.firstChild) : this.parent.node.appendChild(this.node), this.parent.node.className += " " + this.getHideClass()
		}, Et.prototype.cleanDOM = function() {
			this.node.parentNode.removeChild(this.node), this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "")
		}, Et.prototype.getHideClass = function() {
			return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")]
		}, Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before", Et.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after", Ot.prototype.renderImage = function(t, e, n, r) {
			var i = t.cssInt("paddingLeft"),
				o = t.cssInt("paddingTop"),
				s = t.cssInt("paddingRight"),
				a = t.cssInt("paddingBottom"),
				c = n.borders,
				h = e.width - (c[1].width + c[3].width + i + s),
				u = e.height - (c[0].width + c[2].width + o + a);
			this.drawImage(r, 0, 0, r.image.width || h, r.image.height || u, e.left + i + c[3].width, e.top + o + c[0].width, h, u)
		}, Ot.prototype.renderBackground = function(t, e, n) {
			e.height > 0 && e.width > 0 && (this.renderBackgroundColor(t, e), this.renderBackgroundImage(t, e, n))
		}, Ot.prototype.renderBackgroundColor = function(t, e) {
			var n = t.css("backgroundColor");
			this.isTransparent(n) || this.rectangle(e.left, e.top, e.width, e.height, t.css("backgroundColor"))
		}, Ot.prototype.renderBorders = function(t) {
			t.forEach(this.renderBorder, this)
		}, Ot.prototype.renderBorder = function(t) {
			this.isTransparent(t.color) || null === t.args || this.drawShape(t.args, t.color)
		}, Ot.prototype.renderBackgroundImage = function(t, e, n) {
			var r = t.parseBackgroundImages();
			r.reverse().forEach(function(r, i, o) {
				switch (r.method) {
					case "url":
						var s = this.images.get(r.args[0]);
						s ? this.renderBackgroundRepeating(t, e, s, o.length - (i + 1), n) : E("Error loading background-image", r.args[0]);
						break;
					case "linear-gradient":
					case "gradient":
						var a = this.images.get(r.value);
						a ? this.renderBackgroundGradient(a, e, n) : E("Error loading background-image", r.args[0]);
						break;
					case "none":
						break;
					default:
						E("Unknown background-image type", r.args[0])
				}
			}, this)
		}, Ot.prototype.renderBackgroundRepeating = function(t, e, n, r, i) {
			var o = t.parseBackgroundSize(e, n.image, r),
				s = t.parseBackgroundPosition(e, n.image, r, o),
				a = t.parseBackgroundRepeat(r);
			switch (a) {
				case "repeat-x":
				case "repeat no-repeat":
					this.backgroundRepeatShape(n, s, o, e, e.left + i[3], e.top + s.top + i[0], 99999, o.height, i);
					break;
				case "repeat-y":
				case "no-repeat repeat":
					this.backgroundRepeatShape(n, s, o, e, e.left + s.left + i[3], e.top + i[0], o.width, 99999, i);
					break;
				case "no-repeat":
					this.backgroundRepeatShape(n, s, o, e, e.left + s.left + i[3], e.top + s.top + i[0], o.width, o.height, i);
					break;
				default:
					this.renderBackgroundRepeat(n, s, o, {
						top: e.top,
						left: e.left
					}, i[3], i[0])
			}
		}, Ot.prototype.isTransparent = function(t) {
			return !t || "transparent" === t || "rgba(0, 0, 0, 0)" === t
		}, Ft.prototype = Object.create(O.prototype), Ft.prototype.getParentStack = function(t) {
			var e = this.parent ? this.parent.stack : null;
			return e ? e.ownStacking ? e : e.getParentStack(t) : t.stack
		}, Bt.prototype.testRangeBounds = function(t) {
			var e, n, r, i, o = !1;
			return t.createRange && (e = t.createRange(), e.getBoundingClientRect && (n = t.createElement("boundtest"), n.style.height = "123px", n.style.display = "block", t.body.appendChild(n), e.selectNode(n), r = e.getBoundingClientRect(), i = r.height, 123 === i && (o = !0), t.body.removeChild(n))), o
		}, Bt.prototype.testCORS = function() {
			return "undefined" != typeof(new Image).crossOrigin
		}, Bt.prototype.testSVG = function() {
			var t = new Image,
				n = e.createElement("canvas"),
				r = n.getContext("2d");
			t.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
			try {
				r.drawImage(t, 0, 0), n.toDataURL()
			} catch (i) {
				return !1
			}
			return !0
		}, Rt.prototype.hasFabric = function() {
			return html2canvas.fabric ? Promise.resolve() : Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"))
		}, Rt.prototype.inlineFormatting = function(t) {
			return /^data:image\/svg\+xml;base64,/.test(t) ? this.decode64(this.removeContentType(t)) : this.removeContentType(t)
		}, Rt.prototype.removeContentType = function(t) {
			return t.replace(/^data:image\/svg\+xml(;base64)?,/, "")
		}, Rt.prototype.isInline = function(t) {
			return /^data:image\/svg\+xml/i.test(t)
		}, Rt.prototype.createCanvas = function(t) {
			var e = this;
			return function(n, r) {
				var i = new html2canvas.fabric.StaticCanvas("c");
				e.image = i.lowerCanvasEl, i.setWidth(r.width).setHeight(r.height).add(html2canvas.fabric.util.groupSVGElements(n, r)).renderAll(), t(i.lowerCanvasEl)
			}
		}, Rt.prototype.decode64 = function(e) {
			return "function" == typeof t.atob ? t.atob(e) : Dt(e)
		}, jt.prototype = Object.create(Rt.prototype), Mt.prototype = Object.create(O.prototype), Mt.prototype.applyTextTransform = function() {
			this.node.data = this.transform(this.parent.css("textTransform"))
		}, Mt.prototype.transform = function(t) {
			var e = this.node.data;
			switch (t) {
				case "lowercase":
					return e.toLowerCase();
				case "capitalize":
					return e.replace(/(^|\s|:|-|\(|\))([a-z])/g, Nt);
				case "uppercase":
					return e.toUpperCase();
				default:
					return e
			}
		}, Lt.prototype = Object.create(_.prototype), Ut.prototype = Object.create(Ot.prototype), Ut.prototype.setFillStyle = function(t) {
			return this.ctx.fillStyle = t, this.ctx
		}, Ut.prototype.rectangle = function(t, e, n, r, i) {
			this.setFillStyle(i).fillRect(t, e, n, r)
		}, Ut.prototype.circle = function(t, e, n, r) {
			this.setFillStyle(r), this.ctx.beginPath(), this.ctx.arc(t + n / 2, e + n / 2, n / 2, 0, 2 * Math.PI, !0), this.ctx.closePath(), this.ctx.fill()
		}, Ut.prototype.circleStroke = function(t, e, n, r, i, o) {
			this.circle(t, e, n, r), this.ctx.strokeStyle = o, this.ctx.stroke()
		}, Ut.prototype.drawShape = function(t, e) {
			this.shape(t), this.setFillStyle(e).fill()
		}, Ut.prototype.taints = function(t) {
			if (null === t.tainted) {
				this.taintCtx.drawImage(t.image, 0, 0);
				try {
					this.taintCtx.getImageData(0, 0, 1, 1), t.tainted = !1
				} catch (n) {
					this.taintCtx = e.createElement("canvas").getContext("2d"), t.tainted = !0
				}
			}
			return t.tainted
		}, Ut.prototype.drawImage = function(t, e, n, r, i, o, s, a, c) {
			this.taints(t) && !this.options.allowTaint || this.ctx.drawImage(t.image, e, n, r, i, o, s, a, c)
		}, Ut.prototype.clip = function(t, e, n) {
			this.ctx.save(), t.filter(Ht).forEach(function(t) {
				this.shape(t).clip()
			}, this), e.call(n), this.ctx.restore()
		}, Ut.prototype.shape = function(t) {
			return this.ctx.beginPath(), t.forEach(function(t, e) {
				"rect" === t[0] ? this.ctx.rect.apply(this.ctx, t.slice(1)) : this.ctx[0 === e ? "moveTo" : t[0] + "To"].apply(this.ctx, t.slice(1))
			}, this), this.ctx.closePath(), this.ctx
		}, Ut.prototype.font = function(t, e, n, r, i, o) {
			this.setFillStyle(t).font = [e, n, r, i, o].join(" ").split(",")[0]
		}, Ut.prototype.fontShadow = function(t, e, n, r) {
			this.setVariable("shadowColor", t).setVariable("shadowOffsetY", e).setVariable("shadowOffsetX", n).setVariable("shadowBlur", r)
		}, Ut.prototype.clearShadow = function() {
			this.setVariable("shadowColor", "rgba(0,0,0,0)")
		}, Ut.prototype.setOpacity = function(t) {
			this.ctx.globalAlpha = t
		}, Ut.prototype.setTransform = function(t) {
			this.ctx.translate(t.origin[0], t.origin[1]), this.ctx.transform.apply(this.ctx, t.matrix), this.ctx.translate(-t.origin[0], -t.origin[1])
		}, Ut.prototype.setVariable = function(t, e) {
			return this.variables[t] !== e && (this.variables[t] = this.ctx[t] = e), this
		}, Ut.prototype.text = function(t, e, n) {
			this.ctx.fillText(t, e, n)
		}, Ut.prototype.backgroundRepeatShape = function(t, e, n, r, i, o, s, a, c) {
			var h = [["line", Math.round(i), Math.round(o)], ["line", Math.round(i + s), Math.round(o)], ["line", Math.round(i + s), Math.round(a + o)], ["line", Math.round(i), Math.round(a + o)]];
			this.clip([h], function() {
				this.renderBackgroundRepeat(t, e, n, r, c[3], c[0])
			}, this)
		}, Ut.prototype.renderBackgroundRepeat = function(t, e, n, r, i, o) {
			var s = Math.round(r.left + e.left + i),
				a = Math.round(r.top + e.top + o);
			this.setFillStyle(this.ctx.createPattern(this.resizeImage(t, n), "repeat")), this.ctx.translate(s, a), this.ctx.fill(), this.ctx.translate(-s, -a)
		}, Ut.prototype.renderBackgroundGradient = function(t, e) {
			if (t instanceof P) {
				var n = this.ctx.createLinearGradient(e.left + e.width * t.x0, e.top + e.height * t.y0, e.left + e.width * t.x1, e.top + e.height * t.y1);
				t.colorStops.forEach(function(t) {
					n.addColorStop(t.stop, t.color)
				}), this.rectangle(e.left, e.top, e.width, e.height, n)
			}
		}, Ut.prototype.resizeImage = function(t, n) {
			var r = t.image;
			if (r.width === n.width && r.height === n.height) return r;
			var i, o = e.createElement("canvas");
			return o.width = n.width, o.height = n.height, i = o.getContext("2d"), i.drawImage(r, 0, 0, r.width, r.height, 0, 0, n.width, n.height), o
		}
	}).call({}, window, document),
		/*
		    # PNG.js
		    # Copyright (c) 2011 Devon Govett
		    # MIT LICENSE
		    # 
		    # 
		    */
		function(t) {
			var e;
			e = function() {
				function e(t) {
					var e, n, r, i, o, s, a, c, h, u, l, f, d, p, g;
					for (this.data = t, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.animation = null, this.text = {}, s = null;;) {
						switch (e = this.readUInt32(), u = function() {
							var t, e;
							for (e = [], a = t = 0; 4 > t; a = ++t) e.push(String.fromCharCode(this.data[this.pos++]));
							return e
						}.call(this).join("")) {
							case "IHDR":
								this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
								break;
							case "acTL":
								this.animation = {
									numFrames: this.readUInt32(),
									numPlays: this.readUInt32() || 1 / 0,
									frames: []
								};
								break;
							case "PLTE":
								this.palette = this.read(e);
								break;
							case "fcTL":
								s && this.animation.frames.push(s), this.pos += 4, s = {
									width: this.readUInt32(),
									height: this.readUInt32(),
									xOffset: this.readUInt32(),
									yOffset: this.readUInt32()
								}, o = this.readUInt16(), i = this.readUInt16() || 100, s.delay = 1e3 * o / i, s.disposeOp = this.data[this.pos++], s.blendOp = this.data[this.pos++], s.data = [];
								break;
							case "IDAT":
							case "fdAT":
								for ("fdAT" === u && (this.pos += 4, e -= 4), t = (null != s ? s.data : void 0) || this.imgData, a = d = 0; e >= 0 ? e > d : d > e; a = e >= 0 ? ++d : --d) t.push(this.data[this.pos++]);
								break;
							case "tRNS":
								switch (this.transparency = {}, this.colorType) {
									case 3:
										if (r = this.palette.length / 3, this.transparency.indexed = this.read(e), this.transparency.indexed.length > r) throw new Error("More transparent colors than palette size");
										if (l = r - this.transparency.indexed.length, l > 0)
											for (a = p = 0; l >= 0 ? l > p : p > l; a = l >= 0 ? ++p : --p) this.transparency.indexed.push(255);
										break;
									case 0:
										this.transparency.grayscale = this.read(e)[0];
										break;
									case 2:
										this.transparency.rgb = this.read(e)
								}
								break;
							case "tEXt":
								f = this.read(e), c = f.indexOf(0), h = String.fromCharCode.apply(String, f.slice(0, c)), this.text[h] = String.fromCharCode.apply(String, f.slice(c + 1));
								break;
							case "IEND":
								return s && this.animation.frames.push(s), this.colors = function() {
									switch (this.colorType) {
										case 0:
										case 3:
										case 4:
											return 1;
										case 2:
										case 6:
											return 3
									}
								}.call(this), this.hasAlphaChannel = 4 === (g = this.colorType) || 6 === g, n = this.colors + (this.hasAlphaChannel ? 1 : 0), this.pixelBitlength = this.bits * n, this.colorSpace = function() {
									switch (this.colors) {
										case 1:
											return "DeviceGray";
										case 3:
											return "DeviceRGB"
									}
								}.call(this), void(this.imgData = new Uint8Array(this.imgData));
							default:
								this.pos += e
						}
						if (this.pos += 4, this.pos > this.data.length) throw new Error("Incomplete or corrupt PNG file")
					}
				}
				var n, r, i, o, s, c, h, u;
				e.load = function(t, n, r) {
					var i;
					return "function" == typeof n && (r = n), i = new XMLHttpRequest, i.open("GET", t, !0), i.responseType = "arraybuffer", i.onload = function() {
						var t, o;
						return t = new Uint8Array(i.response || i.mozResponseArrayBuffer), o = new e(t), "function" == typeof(null != n ? n.getContext : void 0) && o.render(n), "function" == typeof r ? r(o) : void 0
					}, i.send(null)
				}, o = 0, i = 1, s = 2, r = 0, n = 1, e.prototype.read = function(t) {
					var e, n, r;
					for (r = [], e = n = 0; t >= 0 ? t > n : n > t; e = t >= 0 ? ++n : --n) r.push(this.data[this.pos++]);
					return r
				}, e.prototype.readUInt32 = function() {
					var t, e, n, r;
					return t = this.data[this.pos++] << 24, e = this.data[this.pos++] << 16, n = this.data[this.pos++] << 8, r = this.data[this.pos++], t | e | n | r
				}, e.prototype.readUInt16 = function() {
					var t, e;
					return t = this.data[this.pos++] << 8, e = this.data[this.pos++], t | e
				}, e.prototype.decodePixels = function(t) {
					var e, n, r, i, o, s, c, h, u, l, f, d, p, g, m, y, w, v, b, x, S, k, I;
					if (null == t && (t = this.imgData), 0 === t.length) return new Uint8Array(0);
					for (t = new a(t), t = t.getBytes(), d = this.pixelBitlength / 8, y = d * this.width, p = new Uint8Array(y * this.height), s = t.length, m = 0, g = 0, n = 0; s > g;) {
						switch (t[g++]) {
							case 0:
								for (i = b = 0; y > b; i = b += 1) p[n++] = t[g++];
								break;
							case 1:
								for (i = x = 0; y > x; i = x += 1) e = t[g++], o = d > i ? 0 : p[n - d], p[n++] = (e + o) % 256;
								break;
							case 2:
								for (i = S = 0; y > S; i = S += 1) e = t[g++], r = (i - i % d) / d, w = m && p[(m - 1) * y + r * d + i % d], p[n++] = (w + e) % 256;
								break;
							case 3:
								for (i = k = 0; y > k; i = k += 1) e = t[g++], r = (i - i % d) / d, o = d > i ? 0 : p[n - d], w = m && p[(m - 1) * y + r * d + i % d], p[n++] = (e + Math.floor((o + w) / 2)) % 256;
								break;
							case 4:
								for (i = I = 0; y > I; i = I += 1) e = t[g++], r = (i - i % d) / d, o = d > i ? 0 : p[n - d], 0 === m ? w = v = 0 : (w = p[(m - 1) * y + r * d + i % d], v = r && p[(m - 1) * y + (r - 1) * d + i % d]), c = o + w - v, h = Math.abs(c - o), l = Math.abs(c - w), f = Math.abs(c - v), u = l >= h && f >= h ? o : f >= l ? w : v, p[n++] = (e + u) % 256;
								break;
							default:
								throw new Error("Invalid filter algorithm: " + t[g - 1])
						}
						m++
					}
					return p
				}, e.prototype.decodePalette = function() {
					var t, e, n, r, i, o, s, a, c, h;
					for (r = this.palette, s = this.transparency.indexed || [], o = new Uint8Array((s.length || 0) + r.length), i = 0, n = r.length, t = 0, e = a = 0, c = r.length; c > a; e = a += 3) o[i++] = r[e], o[i++] = r[e + 1], o[i++] = r[e + 2], o[i++] = null != (h = s[t++]) ? h : 255;
					return o
				}, e.prototype.copyToImageData = function(t, e) {
					var n, r, i, o, s, a, c, h, u, l, f;
					if (r = this.colors, u = null, n = this.hasAlphaChannel, this.palette.length && (u = null != (f = this._decodedPalette) ? f : this._decodedPalette = this.decodePalette(), r = 4, n = !0), i = t.data || t, h = i.length, s = u || e, o = a = 0, 1 === r)
						for (; h > o;) c = u ? 4 * e[o / 4] : a, l = s[c++], i[o++] = l, i[o++] = l, i[o++] = l, i[o++] = n ? s[c++] : 255, a = c;
					else
						for (; h > o;) c = u ? 4 * e[o / 4] : a, i[o++] = s[c++], i[o++] = s[c++], i[o++] = s[c++], i[o++] = n ? s[c++] : 255, a = c
				}, e.prototype.decode = function() {
					var t;
					return t = new Uint8Array(this.width * this.height * 4), this.copyToImageData(t, this.decodePixels()), t
				};
				try {
					h = t.document.createElement("canvas"), u = h.getContext("2d")
				} catch (l) {
					return -1
				}
				return c = function(t) {
					var e;
					return u.width = t.width, u.height = t.height, u.clearRect(0, 0, t.width, t.height), u.putImageData(t, 0, 0), e = new Image, e.src = h.toDataURL(), e
				}, e.prototype.decodeFrames = function(t) {
					var e, n, r, i, o, s, a, h;
					if (this.animation) {
						for (a = this.animation.frames, h = [], n = o = 0, s = a.length; s > o; n = ++o) e = a[n], r = t.createImageData(e.width, e.height), i = this.decodePixels(new Uint8Array(e.data)), this.copyToImageData(r, i), e.imageData = r, h.push(e.image = c(r));
						return h
					}
				}, e.prototype.renderFrame = function(t, e) {
					var n, o, a;
					return o = this.animation.frames, n = o[e], a = o[e - 1], 0 === e && t.clearRect(0, 0, this.width, this.height), (null != a ? a.disposeOp : void 0) === i ? t.clearRect(a.xOffset, a.yOffset, a.width, a.height) : (null != a ? a.disposeOp : void 0) === s && t.putImageData(a.imageData, a.xOffset, a.yOffset), n.blendOp === r && t.clearRect(n.xOffset, n.yOffset, n.width, n.height), t.drawImage(n.image, n.xOffset, n.yOffset)
				}, e.prototype.animate = function(t) {
					var e, n, r, i, o, s, a = this;
					return n = 0, s = this.animation, i = s.numFrames, r = s.frames, o = s.numPlays, (e = function() {
						var s, c;
						return s = n++ % i, c = r[s], a.renderFrame(t, s), i > 1 && o > n / i ? a.animation._timeout = setTimeout(e, c.delay) : void 0
					})()
				}, e.prototype.stopAnimation = function() {
					var t;
					return clearTimeout(null != (t = this.animation) ? t._timeout : void 0)
				}, e.prototype.render = function(t) {
					var e, n;
					return t._png && t._png.stopAnimation(), t._png = this, t.width = this.width, t.height = this.height, e = t.getContext("2d"), this.animation ? (this.decodeFrames(e), this.animate(e)) : (n = e.createImageData(this.width, this.height), this.copyToImageData(n, this.decodePixels()), e.putImageData(n, 0, 0))
				}, e
			}(), t.PNG = e
		}("undefined" != typeof window && window || this);
	/*
	 * Extracted from pdf.js
	 * https://github.com/andreasgal/pdf.js
	 *
	 * Copyright (c) 2011 Mozilla Foundation
	 *
	 * Contributors: Andreas Gal <gal@mozilla.com>
	 *               Chris G Jones <cjones@mozilla.com>
	 *               Shaon Barman <shaon.barman@gmail.com>
	 *               Vivien Nicolas <21@vingtetun.org>
	 *               Justin D'Arcangelo <justindarc@gmail.com>
	 *               Yury Delendik
	 *
	 * 
	 */
	var s = function() {
			function t() {
				this.pos = 0, this.bufferLength = 0, this.eof = !1, this.buffer = null
			}
			return t.prototype = {
				ensureBuffer: function(t) {
					var e = this.buffer,
						n = e ? e.byteLength : 0;
					if (n > t) return e;
					for (var r = 512; t > r;) r <<= 1;
					for (var i = new Uint8Array(r), o = 0; n > o; ++o) i[o] = e[o];
					return this.buffer = i
				},
				getByte: function() {
					for (var t = this.pos; this.bufferLength <= t;) {
						if (this.eof) return null;
						this.readBlock()
					}
					return this.buffer[this.pos++]
				},
				getBytes: function(t) {
					var e = this.pos;
					if (t) {
						this.ensureBuffer(e + t);
						for (var n = e + t; !this.eof && this.bufferLength < n;) this.readBlock();
						var r = this.bufferLength;
						n > r && (n = r)
					} else {
						for (; !this.eof;) this.readBlock();
						var n = this.bufferLength
					}
					return this.pos = n, this.buffer.subarray(e, n)
				},
				lookChar: function() {
					for (var t = this.pos; this.bufferLength <= t;) {
						if (this.eof) return null;
						this.readBlock()
					}
					return String.fromCharCode(this.buffer[this.pos])
				},
				getChar: function() {
					for (var t = this.pos; this.bufferLength <= t;) {
						if (this.eof) return null;
						this.readBlock()
					}
					return String.fromCharCode(this.buffer[this.pos++])
				},
				makeSubStream: function(t, e, n) {
					for (var r = t + e; this.bufferLength <= r && !this.eof;) this.readBlock();
					return new Stream(this.buffer, t, e, n)
				},
				skip: function(t) {
					t || (t = 1), this.pos += t
				},
				reset: function() {
					this.pos = 0
				}
			}, t
		}(),
		a = function() {
			function t(t) {
				throw new Error(t)
			}

			function e(e) {
				var n = 0,
					r = e[n++],
					i = e[n++]; - 1 != r && -1 != i || t("Invalid header in flate stream"), 8 != (15 & r) && t("Unknown compression method in flate stream"), ((r << 8) + i) % 31 != 0 && t("Bad FCHECK in flate stream"), 32 & i && t("FDICT bit set in flate stream"), this.bytes = e, this.bytesPos = n, this.codeSize = 0, this.codeBuf = 0, s.call(this)
			}
			if ("undefined" != typeof Uint32Array) {
				var n = new Uint32Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
					r = new Uint32Array([3, 4, 5, 6, 7, 8, 9, 10, 65547, 65549, 65551, 65553, 131091, 131095, 131099, 131103, 196643, 196651, 196659, 196667, 262211, 262227, 262243, 262259, 327811, 327843, 327875, 327907, 258, 258, 258]),
					i = new Uint32Array([1, 2, 3, 4, 65541, 65543, 131081, 131085, 196625, 196633, 262177, 262193, 327745, 327777, 393345, 393409, 459009, 459137, 524801, 525057, 590849, 591361, 657409, 658433, 724993, 727041, 794625, 798721, 868353, 876545]),
					o = [new Uint32Array([459008, 524368, 524304, 524568, 459024, 524400, 524336, 590016, 459016, 524384, 524320, 589984, 524288, 524416, 524352, 590048, 459012, 524376, 524312, 589968, 459028, 524408, 524344, 590032, 459020, 524392, 524328, 59e4, 524296, 524424, 524360, 590064, 459010, 524372, 524308, 524572, 459026, 524404, 524340, 590024, 459018, 524388, 524324, 589992, 524292, 524420, 524356, 590056, 459014, 524380, 524316, 589976, 459030, 524412, 524348, 590040, 459022, 524396, 524332, 590008, 524300, 524428, 524364, 590072, 459009, 524370, 524306, 524570, 459025, 524402, 524338, 590020, 459017, 524386, 524322, 589988, 524290, 524418, 524354, 590052, 459013, 524378, 524314, 589972, 459029, 524410, 524346, 590036, 459021, 524394, 524330, 590004, 524298, 524426, 524362, 590068, 459011, 524374, 524310, 524574, 459027, 524406, 524342, 590028, 459019, 524390, 524326, 589996, 524294, 524422, 524358, 590060, 459015, 524382, 524318, 589980, 459031, 524414, 524350, 590044, 459023, 524398, 524334, 590012, 524302, 524430, 524366, 590076, 459008, 524369, 524305, 524569, 459024, 524401, 524337, 590018, 459016, 524385, 524321, 589986, 524289, 524417, 524353, 590050, 459012, 524377, 524313, 589970, 459028, 524409, 524345, 590034, 459020, 524393, 524329, 590002, 524297, 524425, 524361, 590066, 459010, 524373, 524309, 524573, 459026, 524405, 524341, 590026, 459018, 524389, 524325, 589994, 524293, 524421, 524357, 590058, 459014, 524381, 524317, 589978, 459030, 524413, 524349, 590042, 459022, 524397, 524333, 590010, 524301, 524429, 524365, 590074, 459009, 524371, 524307, 524571, 459025, 524403, 524339, 590022, 459017, 524387, 524323, 589990, 524291, 524419, 524355, 590054, 459013, 524379, 524315, 589974, 459029, 524411, 524347, 590038, 459021, 524395, 524331, 590006, 524299, 524427, 524363, 590070, 459011, 524375, 524311, 524575, 459027, 524407, 524343, 590030, 459019, 524391, 524327, 589998, 524295, 524423, 524359, 590062, 459015, 524383, 524319, 589982, 459031, 524415, 524351, 590046, 459023, 524399, 524335, 590014, 524303, 524431, 524367, 590078, 459008, 524368, 524304, 524568, 459024, 524400, 524336, 590017, 459016, 524384, 524320, 589985, 524288, 524416, 524352, 590049, 459012, 524376, 524312, 589969, 459028, 524408, 524344, 590033, 459020, 524392, 524328, 590001, 524296, 524424, 524360, 590065, 459010, 524372, 524308, 524572, 459026, 524404, 524340, 590025, 459018, 524388, 524324, 589993, 524292, 524420, 524356, 590057, 459014, 524380, 524316, 589977, 459030, 524412, 524348, 590041, 459022, 524396, 524332, 590009, 524300, 524428, 524364, 590073, 459009, 524370, 524306, 524570, 459025, 524402, 524338, 590021, 459017, 524386, 524322, 589989, 524290, 524418, 524354, 590053, 459013, 524378, 524314, 589973, 459029, 524410, 524346, 590037, 459021, 524394, 524330, 590005, 524298, 524426, 524362, 590069, 459011, 524374, 524310, 524574, 459027, 524406, 524342, 590029, 459019, 524390, 524326, 589997, 524294, 524422, 524358, 590061, 459015, 524382, 524318, 589981, 459031, 524414, 524350, 590045, 459023, 524398, 524334, 590013, 524302, 524430, 524366, 590077, 459008, 524369, 524305, 524569, 459024, 524401, 524337, 590019, 459016, 524385, 524321, 589987, 524289, 524417, 524353, 590051, 459012, 524377, 524313, 589971, 459028, 524409, 524345, 590035, 459020, 524393, 524329, 590003, 524297, 524425, 524361, 590067, 459010, 524373, 524309, 524573, 459026, 524405, 524341, 590027, 459018, 524389, 524325, 589995, 524293, 524421, 524357, 590059, 459014, 524381, 524317, 589979, 459030, 524413, 524349, 590043, 459022, 524397, 524333, 590011, 524301, 524429, 524365, 590075, 459009, 524371, 524307, 524571, 459025, 524403, 524339, 590023, 459017, 524387, 524323, 589991, 524291, 524419, 524355, 590055, 459013, 524379, 524315, 589975, 459029, 524411, 524347, 590039, 459021, 524395, 524331, 590007, 524299, 524427, 524363, 590071, 459011, 524375, 524311, 524575, 459027, 524407, 524343, 590031, 459019, 524391, 524327, 589999, 524295, 524423, 524359, 590063, 459015, 524383, 524319, 589983, 459031, 524415, 524351, 590047, 459023, 524399, 524335, 590015, 524303, 524431, 524367, 590079]), 9],
					a = [new Uint32Array([327680, 327696, 327688, 327704, 327684, 327700, 327692, 327708, 327682, 327698, 327690, 327706, 327686, 327702, 327694, 0, 327681, 327697, 327689, 327705, 327685, 327701, 327693, 327709, 327683, 327699, 327691, 327707, 327687, 327703, 327695, 0]), 5];
				return e.prototype = Object.create(s.prototype), e.prototype.getBits = function(e) {
					for (var n, r = this.codeSize, i = this.codeBuf, o = this.bytes, s = this.bytesPos; e > r;) "undefined" == typeof(n = o[s++]) && t("Bad encoding in flate stream"), i |= n << r, r += 8;
					return n = i & (1 << e) - 1, this.codeBuf = i >> e, this.codeSize = r -= e, this.bytesPos = s, n
				}, e.prototype.getCode = function(e) {
					for (var n = e[0], r = e[1], i = this.codeSize, o = this.codeBuf, s = this.bytes, a = this.bytesPos; r > i;) {
						var c;
						"undefined" == typeof(c = s[a++]) && t("Bad encoding in flate stream"), o |= c << i, i += 8
					}
					var h = n[o & (1 << r) - 1],
						u = h >> 16,
						l = 65535 & h;
					return (0 == i || u > i || 0 == u) && t("Bad encoding in flate stream"), this.codeBuf = o >> u, this.codeSize = i - u, this.bytesPos = a, l
				}, e.prototype.generateHuffmanTable = function(t) {
					for (var e = t.length, n = 0, r = 0; e > r; ++r) t[r] > n && (n = t[r]);
					for (var i = 1 << n, o = new Uint32Array(i), s = 1, a = 0, c = 2; n >= s; ++s, a <<= 1, c <<= 1)
						for (var h = 0; e > h; ++h)
							if (t[h] == s) {
								for (var u = 0, l = a, r = 0; s > r; ++r) u = u << 1 | 1 & l, l >>= 1;
								for (var r = u; i > r; r += c) o[r] = s << 16 | h;
								++a
							}
					return [o, n]
				}, e.prototype.readBlock = function() {
					function e(t, e, n, r, i) {
						for (var o = t.getBits(n) + r; o-- > 0;) e[k++] = i
					}
					var s = this.getBits(3);
					if (1 & s && (this.eof = !0), s >>= 1, 0 == s) {
						var c, h = this.bytes,
							u = this.bytesPos;
						"undefined" == typeof(c = h[u++]) && t("Bad block header in flate stream");
						var l = c;
						"undefined" == typeof(c = h[u++]) && t("Bad block header in flate stream"), l |= c << 8, "undefined" == typeof(c = h[u++]) && t("Bad block header in flate stream");
						var f = c;
						"undefined" == typeof(c = h[u++]) && t("Bad block header in flate stream"), f |= c << 8, f != (65535 & ~l) && t("Bad uncompressed block length in flate stream"), this.codeBuf = 0, this.codeSize = 0;
						var d = this.bufferLength,
							p = this.ensureBuffer(d + l),
							g = d + l;
						this.bufferLength = g;
						for (var m = d; g > m; ++m) {
							if ("undefined" == typeof(c = h[u++])) {
								this.eof = !0;
								break
							}
							p[m] = c
						}
						return void(this.bytesPos = u)
					}
					var y, w;
					if (1 == s) y = o, w = a;
					else if (2 == s) {
						for (var v = this.getBits(5) + 257, b = this.getBits(5) + 1, x = this.getBits(4) + 4, S = Array(n.length), k = 0; x > k;) S[n[k++]] = this.getBits(3);
						for (var I = this.generateHuffmanTable(S), C = 0, k = 0, A = v + b, _ = new Array(A); A > k;) {
							var q = this.getCode(I);
							16 == q ? e(this, _, 2, 3, C) : 17 == q ? e(this, _, 3, 3, C = 0) : 18 == q ? e(this, _, 7, 11, C = 0) : _[k++] = C = q
						}
						y = this.generateHuffmanTable(_.slice(0, v)), w = this.generateHuffmanTable(_.slice(v, A))
					} else t("Unknown block type in flate stream");
					for (var p = this.buffer, T = p ? p.length : 0, P = this.bufferLength;;) {
						var E = this.getCode(y);
						if (256 > E) P + 1 >= T && (p = this.ensureBuffer(P + 1), T = p.length), p[P++] = E;
						else {
							if (256 == E) return void(this.bufferLength = P);
							E -= 257, E = r[E];
							var O = E >> 16;
							O > 0 && (O = this.getBits(O));
							var C = (65535 & E) + O;
							E = this.getCode(w), E = i[E], O = E >> 16, O > 0 && (O = this.getBits(O));
							var F = (65535 & E) + O;
							P + C >= T && (p = this.ensureBuffer(P + C), T = p.length);
							for (var B = 0; C > B; ++B, ++P) p[P] = p[P - F]
						}
					}
				}, e
			}
		}();
	! function(t) {
		var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		"undefined" == typeof t.btoa && (t.btoa = function(t) {
			var n, r, i, o, s, a, c, h, u = 0,
				l = 0,
				f = "",
				d = [];
			if (!t) return t;
			do n = t.charCodeAt(u++), r = t.charCodeAt(u++), i = t.charCodeAt(u++), h = n << 16 | r << 8 | i, o = h >> 18 & 63, s = h >> 12 & 63, a = h >> 6 & 63, c = 63 & h, d[l++] = e.charAt(o) + e.charAt(s) + e.charAt(a) + e.charAt(c); while (u < t.length);
			f = d.join("");
			var p = t.length % 3;
			return (p ? f.slice(0, p - 3) : f) + "===".slice(p || 3)
		}), "undefined" == typeof t.atob && (t.atob = function(t) {
			var n, r, i, o, s, a, c, h, u = 0,
				l = 0,
				f = "",
				d = [];
			if (!t) return t;
			t += "";
			do o = e.indexOf(t.charAt(u++)), s = e.indexOf(t.charAt(u++)), a = e.indexOf(t.charAt(u++)), c = e.indexOf(t.charAt(u++)), h = o << 18 | s << 12 | a << 6 | c, n = h >> 16 & 255, r = h >> 8 & 255, i = 255 & h, 64 == a ? d[l++] = String.fromCharCode(n) : 64 == c ? d[l++] = String.fromCharCode(n, r) : d[l++] = String.fromCharCode(n, r, i); while (u < t.length);
			return f = d.join("")
		}), Array.prototype.map || (Array.prototype.map = function(t) {
			if (void 0 === this || null === this || "function" != typeof t) throw new TypeError;
			for (var e = Object(this), n = e.length >>> 0, r = new Array(n), i = arguments.length > 1 ? arguments[1] : void 0, o = 0; n > o; o++) o in e && (r[o] = t.call(i, e[o], o, e));
			return r
		}), Array.isArray || (Array.isArray = function(t) {
			return "[object Array]" === Object.prototype.toString.call(t)
		}), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
			if (void 0 === this || null === this || "function" != typeof t) throw new TypeError;
			for (var n = Object(this), r = n.length >>> 0, i = 0; r > i; i++) i in n && t.call(e, n[i], i, n)
		}), Object.keys || (Object.keys = function() {
			var t = Object.prototype.hasOwnProperty,
				e = !{
					toString: null
				}.propertyIsEnumerable("toString"),
				n = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
				r = n.length;
			return function(i) {
				if ("object" != typeof i && ("function" != typeof i || null === i)) throw new TypeError;
				var o, s, a = [];
				for (o in i) t.call(i, o) && a.push(o);
				if (e)
					for (s = 0; r > s; s++) t.call(i, n[s]) && a.push(n[s]);
				return a
			}
		}()), String.prototype.trim || (String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, "")
		}), String.prototype.trimLeft || (String.prototype.trimLeft = function() {
			return this.replace(/^\s+/g, "")
		}), String.prototype.trimRight || (String.prototype.trimRight = function() {
			return this.replace(/\s+$/g, "")
		})
	}("undefined" != typeof self && self || "undefined" != typeof window && window || this);
	var e = e;
	return e
});