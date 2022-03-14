! function(t) {
    if ("function" == typeof define && define.amd) define(["jquery"], t);
    else if ("object" == typeof module && module.exports) {
        var i = require("jquery");
        t(i), module.exports = i
    } else t(jQuery)
}(function(t) {
    "use strict";

    function i(t) {
        this.init(t)
    }
    i.prototype = {
        value: 0,
        size: 100,
        startAngle: -Math.PI,
        thickness: "auto",
        fill: {
            gradient: ["#3aeabb", "#fdd250"]
        },
        emptyFill: "rgba(0, 0, 0, .1)",
        animation: {
            duration: 1200,
            easing: "circleProgressEasing"
        },
        animationStartValue: 0,
        reverse: !1,
        lineCap: "butt",
        insertMode: "prepend",
        constructor: i,
        el: null,
        canvas: null,
        ctx: null,
        radius: 0,
        arcFill: null,
        lastFrameValue: 0,
        init: function(i) {
            t.extend(this, i), this.radius = this.size / 2, this.initWidget(), this.initFill(), this.draw(), this.el.trigger("circle-inited")
        },
        initWidget: function() {
            this.canvas || (this.canvas = t("<canvas>")["prepend" == this.insertMode ? "prependTo" : "appendTo"](this.el)[0]);
            var i = this.canvas;
            if (i.width = this.size, i.height = this.size, this.ctx = i.getContext("2d"), window.devicePixelRatio > 1) {
                var e = window.devicePixelRatio;
                i.style.width = i.style.height = this.size + "px", i.width = i.height = this.size * e, this.ctx.scale(e, e)
            }
        },
        initFill: function() {
            function i() {
                var i = t("<canvas>")[0];
                i.width = a.size, i.height = a.size, i.getContext("2d").drawImage(e, 0, 0, s, s), a.arcFill = a.ctx.createPattern(i, "no-repeat"), a.drawFrame(a.lastFrameValue)
            }
            var e, a = this,
                n = this.fill,
                r = this.ctx,
                s = this.size;
            if (!n) throw Error("The fill is not specified!");
            if ("string" == typeof n && (n = {
                    color: n
                }), n.color && (this.arcFill = n.color), n.gradient) {
                var o = n.gradient;
                if (1 == o.length) this.arcFill = o[0];
                else if (o.length > 1) {
                    for (var l = n.gradientAngle || 0, c = n.gradientDirection || [s / 2 * (1 - Math.cos(l)), s / 2 * (1 + Math.sin(l)), s / 2 * (1 + Math.cos(l)), s / 2 * (1 - Math.sin(l))], h = r.createLinearGradient.apply(r, c), d = 0; d < o.length; d++) {
                        var u = o[d],
                            f = d / (o.length - 1);
                        t.isArray(u) && (f = u[1], u = u[0]), h.addColorStop(f, u)
                    }
                    this.arcFill = h
                }
            }
            n.image && (n.image instanceof Image ? e = n.image : (e = new Image).src = n.image, e.complete ? i() : e.onload = i)
        },
        draw: function() {
            this.animation ? this.drawAnimated(this.value) : this.drawFrame(this.value)
        },
        drawFrame: function(t) {
            this.lastFrameValue = t, this.ctx.clearRect(0, 0, this.size, this.size), this.drawEmptyArc(t), this.drawArc(t)
        },
        drawArc: function(t) {
            if (0 !== t) {
                var i = this.ctx,
                    e = this.radius,
                    a = this.getThickness(),
                    n = this.startAngle;
                i.save(), i.beginPath(), this.reverse ? i.arc(e, e, e - a / 2, n - 2 * Math.PI * t, n) : i.arc(e, e, e - a / 2, n, n + 2 * Math.PI * t), i.lineWidth = a, i.lineCap = this.lineCap, i.strokeStyle = this.arcFill, i.stroke(), i.restore()
            }
        },
        drawEmptyArc: function(t) {
            var i = this.ctx,
                e = this.radius,
                a = this.getThickness(),
                n = this.startAngle;
            t < 1 && (i.save(), i.beginPath(), t <= 0 ? i.arc(e, e, e - a / 2, 0, 2 * Math.PI) : this.reverse ? i.arc(e, e, e - a / 2, n, n - 2 * Math.PI * t) : i.arc(e, e, e - a / 2, n + 2 * Math.PI * t, n), i.lineWidth = a, i.strokeStyle = this.emptyFill, i.stroke(), i.restore())
        },
        drawAnimated: function(i) {
            var e = this,
                a = this.el,
                n = t(this.canvas);
            n.stop(!0, !1), a.trigger("circle-animation-start"), n.css({
                animationProgress: 0
            }).animate({
                animationProgress: 1
            }, t.extend({}, this.animation, {
                step: function(t) {
                    var n = e.animationStartValue * (1 - t) + i * t;
                    e.drawFrame(n), a.trigger("circle-animation-progress", [t, n])
                }
            })).promise().always(function() {
                a.trigger("circle-animation-end")
            })
        },
        getThickness: function() {
            return t.isNumeric(this.thickness) ? this.size / this.thickness : this.size / 14
        },
        getValue: function() {
            return this.value
        },
        setValue: function(t) {
            this.animation && (this.animationStartValue = this.lastFrameValue), this.value = t, this.draw()
        }
    }, t.circleProgress = {
        defaults: i.prototype
    }, t.easing.circleProgressEasing = function(t) {
        return t < .5 ? .5 * (t *= 2) * t * t : 1 - .5 * (t = 2 - 2 * t) * t * t
    }, t.fn.circleProgress = function(e, a) {
        var n = "circle-progress",
            r = this.data(n);
        if ("widget" == e) {
            if (!r) throw Error('Calling "widget" method on not initialized instance is forbidden');
            return r.canvas
        }
        if ("value" == e) {
            if (!r) throw Error('Calling "value" method on not initialized instance is forbidden');
            if (void 0 === a) return r.getValue();
            var s = arguments[1];
            return this.each(function() {
                t(this).data(n).setValue(s)
            })
        }
        return this.each(function() {
            var a = t(this),
                r = a.data(n),
                s = t.isPlainObject(e) ? e : {};
            if (r) r.init(s);
            else {
                var o = t.extend({}, a.data());
                "string" == typeof o.fill && (o.fill = JSON.parse(o.fill)), "string" == typeof o.animation && (o.animation = JSON.parse(o.animation)), (s = t.extend(o, s)).el = a, r = new i(s), a.data(n, r)
            }
        })
    }
}),
function(t) {
    "use strict";
    t(window).on("elementor/frontend/init", function() {
        elementorFrontend.hooks.addAction("frontend/element_ready/jltma-piechart.default", function(i) {
            var e = "scroll." + i.find(".jltma-piechart-wrapper").attr("id"),
                a = i.find(".jltma-piechart"),
                n = i.find(".tme-placeholder-piechart"),
                r = {
                    startAngle: -1.55,
                    fill: {
                        color: a.data("fillcolor")
                    },
                    insertMode: "append",
                    emptyFill: a.data("emptyfill"),
                    animation: {
                        duration: a.data("animduration")
                    }
                },
                s = function() {
                    n.remove(), a.circleProgress(r).on("circle-animation-progress", function(i, e, n) {
                        var r = "";
                        if (a.is("[data-dpercent]")) r = "<span>%</span>";
                        t(this).find(".jltma-piechart-percent").html(Math.round(100 * n) + r)
                    }), a.circleProgress(r).on("circle-animation-end", function(i) {
                        1 == a.data("value") && (a.is("[data-dpercent]") ? t(this).find(".jltma-piechart-percent").html("100<span>%</span>") : t(this).find(".jltma-piechart-percent").html("100"))
                    })
                };

            function o(i) {
                var e = t(window).scrollTop(),
                    a = e + t(window).height(),
                    n = t(i).offset().top;
                return n <= a && n >= e
            }
            o(a) ? s() : a.is("[data-scrollanim]") ? t(document).on(e, function() {
                o(a) && (t(document).off(e), s())
            }) : s()
        })
    })
}(jQuery);
