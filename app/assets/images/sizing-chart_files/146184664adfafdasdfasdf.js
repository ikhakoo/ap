!function(exports, global) {
    global["true"] = exports, function() {
        PureChat = function(socketUrl, userId, domainId, authToken, identifyStatus, errorStatus, restrictTransports, poppedOut, emailMD5Hash, reconnectLimit) {
            var t = this;
            this.currentUserId = userId, this.currentDomainId = domainId, this.currentAuthToken = authToken, 
            this.poppedOut = poppedOut, this.emailMD5Hash = emailMD5Hash, t.setConnectionStatus(0), 
            null !== restrictTransports && restrictTransports || (io.transports = [ "websocket", "flashsocket" ]);
            var socketConfig = {
                "reconnection limit": 15e3,
                "max reconnection attempts": reconnectLimit || 1 / 0
            };
            this.socket = io.connect(socketUrl, socketConfig), this.socket.socket.connecting || this.socket.socket.reconnect(), 
            this.messageQueue = [], this.eventFncMappings = {}, this.registerHandler = function(name) {
                var fnc = function(args) {
                    callCallback[name] ? callCallback[name].call(t, args) : callCallback["default"].call(t, name, args);
                };
                t.eventFncMappings[name] = fnc, t.socket.on(name, t.eventFncMappings[name]);
            }, this.chatServerEvents = [ "message", "joined", "left", "roomdestroyed", "userDestroyed", "typing", "reidentify", "userdeleted", "chat-counts", "opInvite", "roomchanged", "roomclosed", "rooms", "onlineOperatorStatus", "opStatus", "serverNotice", "roomdetailschanged" ], 
            this.chatServerEvents.forEach(function(name) {
                t.registerHandler(name);
            }), this.socket.on("connect", function() {
                this.reconnectCount = 0, t.setConnectionStatus(1), t.identify(t.currentUserId, t.currentDomainId, t.currentAuthToken, identifyStatus, t.poppedOut, t.emailMD5Hash);
            }), this.socket.on("disconnect", function() {
                t.setConnectionStatus(0), console.log("Just disconnected...");
            }), this.socket.on("reconnecting", function() {
                this.reconnectCount++, console.log("reconnecting..."), this.reconnectCount > 8 && t.setConnectionStatus(3);
            }), errorStatus && this.socket.on("error", errorStatus);
        }, PureChat.prototype.setConnectionStatus = function(val) {
            console.log("status:" + val), this.status = val, this.trigger("change:connectionStatus", this, val);
        }, PureChat.prototype.disconnect = function() {
            this.socket.disconnect(), this.socket.socket.disconnect(), this.socket.removeAllListeners(), 
            this.socket = null;
        }, PureChat.prototype.identify = function(userId, domainId, authToken, status, poppedOut, emailMD5Hash) {
            function identifiedCallback(success, response, errorCode, errorMessage) {
                success && t.setConnectionStatus(2), status.apply(this, arguments);
            }
            var t = this;
            this.currentUserId = userId, this.currentDomainId = domainId, this.currentAuthToken = authToken, 
            this.deviceType = PureChat.enums.deviceType.desktop, this.poppedOut = poppedOut, 
            this.protocolVersion = "2.0", this.emailMD5Hash = emailMD5Hash, this.socket.emit("identify", {
                userId: this.currentUserId,
                domainId: this.currentDomainId,
                authToken: this.currentAuthToken,
                deviceType: this.deviceType,
                deviceVersion: PureChat.deviceVersion,
                poppedOut: this.poppedOut,
                protocolVersion: this.protocolVersion,
                emailMD5Hash: this.emailMD5Hash
            }, identifiedCallback);
        }, PureChat.prototype.sendmessage = function(message, roomId, status) {
            this.socket.emit("sendmessage", {
                message: message,
                roomId: roomId
            }, status);
        }, PureChat.prototype.sendtyping = function(roomId, isTyping, statusCallback) {
            this.socket.emit("sendtyping", {
                roomId: roomId,
                isTyping: isTyping
            }, statusCallback);
        }, PureChat.prototype.destroyself = function(status) {
            this.socket.emit("destroyself", status);
        }, PureChat.prototype.join = function(roomId, invisible, status) {
            this.socket.emit("join", {
                roomId: roomId,
                invisible: invisible
            }, status);
        }, PureChat.prototype.leave = function(roomId, status) {
            this.socket.emit("leave", {
                roomId: roomId
            }, status);
        }, PureChat.prototype.closeroom = function(roomId, status) {
            this.socket.emit("closeroom", {
                roomId: roomId
            }, status);
        }, PureChat.prototype.createoperatorroom = function(roomName, otherUserIds, status, visitorEmailHash) {
            this.socket.emit("createoperatorroom", {
                roomName: roomName,
                otherUserIds: otherUserIds
            }, status, visitorEmailHash);
        }, PureChat.prototype.sendcurrentstate = function(status) {
            this.socket.emit("sendcurrentstate", {}, status);
        }, PureChat.prototype.getuser = function(status) {
            this.socket.emit("getuser", status);
        }, PureChat.prototype.getusers = function(status) {
            this.socket.emit("getusers", status);
        }, PureChat.prototype.sendroomhistory = function(roomId, status) {
            this.socket.emit("sendroomhistory", {
                roomId: roomId
            }, status);
        }, PureChat.prototype.setavailable = function(userId, connectionId, available, statusCallback) {
            this.socket.emit("setavailable", {
                userId: userId,
                connectionId: connectionId,
                available: available
            }, statusCallback);
        }, PureChat.prototype.setWidgetTypeAvailable = function(userId, widgetType, available, statusCallback) {
            this.socket.emit("setwidgettypeavailable", {
                userId: userId,
                widgetType: widgetType,
                available: available
            }, statusCallback);
        }, PureChat.prototype.forcedisconnect = function(userId, connectionId, statusCallback) {
            this.socket.emit("forcedisconnect", {
                userId: userId,
                connectionId: connectionId
            }, statusCallback);
        }, PureChat.prototype.startdemo = function(widgetId, statusCallback) {
            this.socket.emit("startdemo", {
                widgetId: widgetId
            }, statusCallback);
        }, PureChat.prototype.sendInvite = function(userId, roomId, roomName, fromName, statusCallback) {
            this.socket.emit("opInvite", {
                userId: userId,
                roomId: roomId,
                roomName: roomName,
                fromName: fromName
            }, statusCallback);
        }, PureChat.prototype.setVisitorDetails = function(roomId, details, statusCallback) {
            this.socket.emit("setvisitordetails", {
                roomId: roomId,
                details: details
            }, statusCallback);
        }, PureChat.deviceVersion = 1, PureChat.enums = {
            deviceType: {
                desktop: 0,
                ios: 1
            },
            roomType: {
                account: 0,
                operator: 1,
                visitor: 2
            }
        };
        var callCallback = {
            message: function(args) {
                var escapedUserDisplayName = args.userDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), escapedRoomDisplayName = args.roomDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), escapedMessage = (args.message || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                this.trigger("message", args.userId, escapedUserDisplayName, args.roomId, escapedRoomDisplayName, args.time, escapedMessage.length > 0 ? escapedMessage : null, args.isHistory, args.timeElapsed, args.protocolVersion, args.avatarUrl, args.fromOperator, args.roomUtcOffset);
            },
            joined: function(args) {
                var escapedUserDisplayName = args.userDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), escapedRoomDisplayName = args.roomDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                this.trigger("joined", args.userId, escapedUserDisplayName, args.roomId, escapedRoomDisplayName, args.time, args.isHistory);
            },
            left: function(args) {
                var escapedUserDisplayName = args.userDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), escapedRoomDisplayName = args.roomDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                this.trigger("left", args.userId, escapedUserDisplayName, args.roomId, escapedRoomDisplayName, args.time, args.isHistory);
            },
            roomdestroyed: function(args) {
                var escapedRoomDisplayName = args.roomDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                this.trigger("roomdestroyed", args.roomId, escapedRoomDisplayName, args.time, args.reasonCode);
            },
            userDestroyed: function(args) {
                this.trigger("userDestroyed", args.userId);
            },
            typing: function(args) {
                var escapedUserDisplayName = args.userDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                args.roomDisplayName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                this.trigger("typing", args.userId, escapedUserDisplayName, args.roomId, args.roomDisplayName, args.isTyping, args.time);
            },
            roomchanged: function(args) {
                args && "closedroom" == args.action && purechatApp.execute("roomclosed", args.room.id), 
                this.trigger("roomchanged", args);
            },
            "default": function(event, args) {
                this.trigger(event, args);
            }
        }, array = [], slice = (array.push, array.slice);
        array.splice;
        PureChat.prototype.on = function(name, callback, context) {
            if (!eventsApi(this, "on", name, [ callback, context ]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            return events.push({
                callback: callback,
                context: context,
                ctx: context || this
            }), this;
        }, PureChat.prototype.once = function(name, callback, context) {
            if (!eventsApi(this, "once", name, [ callback, context ]) || !callback) return this;
            var self = this, once = _.once(function() {
                self.off(name, once), callback.apply(this, arguments);
            });
            return once._callback = callback, this.on(name, once, context);
        }, PureChat.prototype.off = function(name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, "off", name, [ callback, context ])) return this;
            if (!name && !callback && !context) return this._events = void 0, this;
            for (names = name ? [ name ] : _.keys(this._events), i = 0, l = names.length; l > i; i++) if (name = names[i], 
            events = this._events[name]) {
                if (this._events[name] = retain = [], callback || context) for (j = 0, k = events.length; k > j; j++) ev = events[j], 
                (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                retain.length || delete this._events[name];
            }
            return this;
        }, PureChat.prototype.trigger = function(name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, "trigger", name, args)) return this;
            var events = this._events[name], allEvents = this._events.all;
            return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), 
            this;
        }, PureChat.prototype.stopListening = function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            callback || "object" != typeof name || (callback = this), obj && ((listeningTo = {})[obj._listenId] = obj);
            for (var id in listeningTo) obj = listeningTo[id], obj.off(name, callback, this), 
            (remove || _.isEmpty(obj._events)) && delete this._listeningTo[id];
            return this;
        };
        var eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
            if (!name) return !0;
            if ("object" == typeof name) {
                for (var key in name) obj[action].apply(obj, [ key, name[key] ].concat(rest));
                return !1;
            }
            if (eventSplitter.test(name)) {
                for (var names = name.split(eventSplitter), i = 0, l = names.length; l > i; i++) obj[action].apply(obj, [ names[i] ].concat(rest));
                return !1;
            }
            return !0;
        }, triggerEvents = function(events, args) {
            var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
            switch (args.length) {
              case 0:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx);
                return;

              case 1:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1);
                return;

              case 2:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;

              case 3:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;

              default:
                for (;++i < l; ) (ev = events[i]).callback.apply(ev.ctx, args);
            }
        };
    }(), exports = void 0;
    var global$ = window.$, $ = window.$pureChatJquery, purechatSpinner = {};
    !function(root, factory) {
        root.Spinner = factory();
    }(purechatSpinner, function() {
        "use strict";
        function createEl(tag, prop) {
            var n, el = document.createElement(tag || "div");
            for (n in prop) el[n] = prop[n];
            return el;
        }
        function ins(parent) {
            for (var i = 1, n = arguments.length; n > i; i++) parent.appendChild(arguments[i]);
            return parent;
        }
        function addAnimation(alpha, trail, i, lines) {
            var name = [ "opacity", trail, ~~(100 * alpha), i, lines ].join("-"), start = .01 + i / lines * 100, z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha), prefix = useCssAnimations.substring(0, useCssAnimations.indexOf("Animation")).toLowerCase(), pre = prefix && "-" + prefix + "-" || "";
            return animations[name] || (sheet.insertRule("@" + pre + "keyframes " + name + "{0%{opacity:" + z + "}" + start + "%{opacity:" + alpha + "}" + (start + .01) + "%{opacity:1}" + (start + trail) % 100 + "%{opacity:" + alpha + "}100%{opacity:" + z + "}}", sheet.cssRules.length), 
            animations[name] = 1), name;
        }
        function vendor(el, prop) {
            var pp, i, s = el.style;
            if (void 0 !== s[prop]) return prop;
            for (prop = prop.charAt(0).toUpperCase() + prop.slice(1), i = 0; i < prefixes.length; i++) if (pp = prefixes[i] + prop, 
            void 0 !== s[pp]) return pp;
        }
        function css(el, prop) {
            for (var n in prop) el.style[vendor(el, n) || n] = prop[n];
            return el;
        }
        function merge(obj) {
            for (var i = 1; i < arguments.length; i++) {
                var def = arguments[i];
                for (var n in def) void 0 === obj[n] && (obj[n] = def[n]);
            }
            return obj;
        }
        function pos(el) {
            for (var o = {
                x: el.offsetLeft,
                y: el.offsetTop
            }; el = el.offsetParent; ) o.x += el.offsetLeft, o.y += el.offsetTop;
            return o;
        }
        function Spinner(o) {
            return "undefined" == typeof this ? new Spinner(o) : void (this.opts = merge(o || {}, Spinner.defaults, defaults));
        }
        function initVML() {
            function vml(tag, attr) {
                return createEl("<" + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
            }
            sheet.addRule(".spin-vml", "behavior:url(#default#VML)"), Spinner.prototype.lines = function(el, o) {
                function grp() {
                    return css(vml("group", {
                        coordsize: s + " " + s,
                        coordorigin: -r + " " + -r
                    }), {
                        width: s,
                        height: s
                    });
                }
                function seg(i, dx, filter) {
                    ins(g, ins(css(grp(), {
                        rotation: 360 / o.lines * i + "deg",
                        left: ~~dx
                    }), ins(css(vml("roundrect", {
                        arcsize: o.corners
                    }), {
                        width: r,
                        height: o.width,
                        left: o.radius,
                        top: -o.width >> 1,
                        filter: filter
                    }), vml("fill", {
                        color: o.color,
                        opacity: o.opacity
                    }), vml("stroke", {
                        opacity: 0
                    }))));
                }
                var i, r = o.length + o.width, s = 2 * r, margin = 2 * -(o.width + o.length) + "px", g = css(grp(), {
                    position: "absolute",
                    top: margin,
                    left: margin
                });
                if (o.shadow) for (i = 1; i <= o.lines; i++) seg(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                for (i = 1; i <= o.lines; i++) seg(i);
                return ins(el, g);
            }, Spinner.prototype.opacity = function(el, i, val, o) {
                var c = el.firstChild;
                o = o.shadow && o.lines || 0, c && i + o < c.childNodes.length && (c = c.childNodes[i + o], 
                c = c && c.firstChild, c = c && c.firstChild, c && (c.opacity = val));
            };
        }
        var useCssAnimations, prefixes = [ "webkit", "Moz", "ms", "O" ], animations = {}, sheet = function() {
            var el = createEl("style", {
                type: "text/css"
            });
            return ins(document.getElementsByTagName("head")[0], el), el.sheet || el.styleSheet;
        }(), defaults = {
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            rotate: 0,
            corners: 1,
            color: "#000",
            direction: 1,
            speed: 1,
            trail: 100,
            opacity: .25,
            fps: 20,
            zIndex: 2e9,
            className: "spinner",
            top: "auto",
            left: "auto",
            position: "relative"
        };
        Spinner.defaults = {}, merge(Spinner.prototype, {
            spin: function(target) {
                this.stop();
                var ep, tp, self = this, o = self.opts, el = self.el = css(createEl(0, {
                    className: o.className
                }), {
                    position: o.position,
                    width: 0,
                    zIndex: o.zIndex
                }), mid = o.radius + o.length + o.width;
                if (target && (target.insertBefore(el, target.firstChild || null), tp = pos(target), 
                ep = pos(el), css(el, {
                    left: ("auto" == o.left ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + "px",
                    top: ("auto" == o.top ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + "px"
                })), el.setAttribute("role", "progressbar"), self.lines(el, self.opts), !useCssAnimations) {
                    var alpha, i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, fps = o.fps, f = fps / o.speed, ostep = (1 - o.opacity) / (f * o.trail / 100), astep = f / o.lines;
                    !function anim() {
                        i++;
                        for (var j = 0; j < o.lines; j++) alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity), 
                        self.opacity(el, j * o.direction + start, alpha, o);
                        self.timeout = self.el && setTimeout(anim, ~~(1e3 / fps));
                    }();
                }
                return self;
            },
            stop: function() {
                var el = this.el;
                return el && (clearTimeout(this.timeout), el.parentNode && el.parentNode.removeChild(el), 
                this.el = void 0), this;
            },
            lines: function(el, o) {
                function fill(color, shadow) {
                    return css(createEl(), {
                        position: "absolute",
                        width: o.length + o.width + "px",
                        height: o.width + "px",
                        background: color,
                        boxShadow: shadow,
                        transformOrigin: "left",
                        transform: "rotate(" + ~~(360 / o.lines * i + o.rotate) + "deg) translate(" + o.radius + "px,0)",
                        borderRadius: (o.corners * o.width >> 1) + "px"
                    });
                }
                for (var seg, i = 0, start = (o.lines - 1) * (1 - o.direction) / 2; i < o.lines; i++) seg = css(createEl(), {
                    position: "absolute",
                    top: 1 + ~(o.width / 2) + "px",
                    transform: o.hwaccel ? "translate3d(0,0,0)" : "",
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
                }), o.shadow && ins(seg, css(fill("#000", "0 0 4px #000"), {
                    top: "2px"
                })), ins(el, ins(seg, fill(o.color, "0 0 1px rgba(0,0,0,.1)")));
                return el;
            },
            opacity: function(el, i, val) {
                i < el.childNodes.length && (el.childNodes[i].style.opacity = val);
            }
        });
        var probe = css(createEl("group"), {
            behavior: "url(#default#VML)"
        });
        return !vendor(probe, "transform") && probe.adj ? initVML() : useCssAnimations = vendor(probe, "animation"), 
        Spinner;
    }), function() {
        function n(n) {
            function t(t, r, e, u, i, o) {
                for (;i >= 0 && o > i; i += n) {
                    var a = u ? u[i] : i;
                    e = r(e, t[a], a, t);
                }
                return e;
            }
            return function(r, e, u, i) {
                e = d(e, i, 4);
                var o = !w(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1;
                return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a);
            };
        }
        function t(n) {
            return function(t, r, e) {
                r = b(r, e);
                for (var u = null != t && t.length, i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n) if (r(t[i], i, t)) return i;
                return -1;
            };
        }
        function r(n, t) {
            var r = S.length, e = n.constructor, u = m.isFunction(e) && e.prototype || o, i = "constructor";
            for (m.has(n, i) && !m.contains(t, i) && t.push(i); r--; ) i = S[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i);
        }
        var e = this, u = e._, i = Array.prototype, o = Object.prototype, a = Function.prototype, c = i.push, l = i.slice, f = o.toString, s = o.hasOwnProperty, p = Array.isArray, h = Object.keys, v = a.bind, g = Object.create, y = function() {}, m = function(n) {
            return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n);
        };
        "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), 
        exports._ = m) : e._ = m, m.VERSION = "1.8.2";
        var d = function(n, t, r) {
            if (void 0 === t) return n;
            switch (null == r ? 3 : r) {
              case 1:
                return function(r) {
                    return n.call(t, r);
                };

              case 2:
                return function(r, e) {
                    return n.call(t, r, e);
                };

              case 3:
                return function(r, e, u) {
                    return n.call(t, r, e, u);
                };

              case 4:
                return function(r, e, u, i) {
                    return n.call(t, r, e, u, i);
                };
            }
            return function() {
                return n.apply(t, arguments);
            };
        }, b = function(n, t, r) {
            return null == n ? m.identity : m.isFunction(n) ? d(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n);
        };
        m.iteratee = function(n, t) {
            return b(n, t, 1 / 0);
        };
        var x = function(n, t) {
            return function(r) {
                var e = arguments.length;
                if (2 > e || null == r) return r;
                for (var u = 1; e > u; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) {
                    var l = o[c];
                    t && void 0 !== r[l] || (r[l] = i[l]);
                }
                return r;
            };
        }, _ = function(n) {
            if (!m.isObject(n)) return {};
            if (g) return g(n);
            y.prototype = n;
            var t = new y();
            return y.prototype = null, t;
        }, j = Math.pow(2, 53) - 1, w = function(n) {
            var t = n && n.length;
            return "number" == typeof t && t >= 0 && j >= t;
        };
        m.each = m.forEach = function(n, t, r) {
            t = d(t, r);
            var e, u;
            if (w(n)) for (e = 0, u = n.length; u > e; e++) t(n[e], e, n); else {
                var i = m.keys(n);
                for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n);
            }
            return n;
        }, m.map = m.collect = function(n, t, r) {
            t = b(t, r);
            for (var e = !w(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) {
                var a = e ? e[o] : o;
                i[o] = t(n[a], a, n);
            }
            return i;
        }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function(n, t, r) {
            var e;
            return e = w(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), void 0 !== e && -1 !== e ? n[e] : void 0;
        }, m.filter = m.select = function(n, t, r) {
            var e = [];
            return t = b(t, r), m.each(n, function(n, r, u) {
                t(n, r, u) && e.push(n);
            }), e;
        }, m.reject = function(n, t, r) {
            return m.filter(n, m.negate(b(t)), r);
        }, m.every = m.all = function(n, t, r) {
            t = b(t, r);
            for (var e = !w(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
                var o = e ? e[i] : i;
                if (!t(n[o], o, n)) return !1;
            }
            return !0;
        }, m.some = m.any = function(n, t, r) {
            t = b(t, r);
            for (var e = !w(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
                var o = e ? e[i] : i;
                if (t(n[o], o, n)) return !0;
            }
            return !1;
        }, m.contains = m.includes = m.include = function(n, t, r) {
            return w(n) || (n = m.values(n)), m.indexOf(n, t, "number" == typeof r && r) >= 0;
        }, m.invoke = function(n, t) {
            var r = l.call(arguments, 2), e = m.isFunction(t);
            return m.map(n, function(n) {
                var u = e ? t : n[t];
                return null == u ? u : u.apply(n, r);
            });
        }, m.pluck = function(n, t) {
            return m.map(n, m.property(t));
        }, m.where = function(n, t) {
            return m.filter(n, m.matcher(t));
        }, m.findWhere = function(n, t) {
            return m.find(n, m.matcher(t));
        }, m.max = function(n, t, r) {
            var e, u, i = -1 / 0, o = -1 / 0;
            if (null == t && null != n) {
                n = w(n) ? n : m.values(n);
                for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e);
            } else t = b(t, r), m.each(n, function(n, r, e) {
                u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u);
            });
            return i;
        }, m.min = function(n, t, r) {
            var e, u, i = 1 / 0, o = 1 / 0;
            if (null == t && null != n) {
                n = w(n) ? n : m.values(n);
                for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e);
            } else t = b(t, r), m.each(n, function(n, r, e) {
                u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u);
            });
            return i;
        }, m.shuffle = function(n) {
            for (var t, r = w(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), 
            t !== i && (u[i] = u[t]), u[t] = r[i];
            return u;
        }, m.sample = function(n, t, r) {
            return null == t || r ? (w(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t));
        }, m.sortBy = function(n, t, r) {
            return t = b(t, r), m.pluck(m.map(n, function(n, r, e) {
                return {
                    value: n,
                    index: r,
                    criteria: t(n, r, e)
                };
            }).sort(function(n, t) {
                var r = n.criteria, e = t.criteria;
                if (r !== e) {
                    if (r > e || void 0 === r) return 1;
                    if (e > r || void 0 === e) return -1;
                }
                return n.index - t.index;
            }), "value");
        };
        var A = function(n) {
            return function(t, r, e) {
                var u = {};
                return r = b(r, e), m.each(t, function(e, i) {
                    var o = r(e, i, t);
                    n(u, e, o);
                }), u;
            };
        };
        m.groupBy = A(function(n, t, r) {
            m.has(n, r) ? n[r].push(t) : n[r] = [ t ];
        }), m.indexBy = A(function(n, t, r) {
            n[r] = t;
        }), m.countBy = A(function(n, t, r) {
            m.has(n, r) ? n[r]++ : n[r] = 1;
        }), m.toArray = function(n) {
            return n ? m.isArray(n) ? l.call(n) : w(n) ? m.map(n, m.identity) : m.values(n) : [];
        }, m.size = function(n) {
            return null == n ? 0 : w(n) ? n.length : m.keys(n).length;
        }, m.partition = function(n, t, r) {
            t = b(t, r);
            var e = [], u = [];
            return m.each(n, function(n, r, i) {
                (t(n, r, i) ? e : u).push(n);
            }), [ e, u ];
        }, m.first = m.head = m.take = function(n, t, r) {
            return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t);
        }, m.initial = function(n, t, r) {
            return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)));
        }, m.last = function(n, t, r) {
            return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t));
        }, m.rest = m.tail = m.drop = function(n, t, r) {
            return l.call(n, null == t || r ? 1 : t);
        }, m.compact = function(n) {
            return m.filter(n, m.identity);
        };
        var k = function(n, t, r, e) {
            for (var u = [], i = 0, o = e || 0, a = n && n.length; a > o; o++) {
                var c = n[o];
                if (w(c) && (m.isArray(c) || m.isArguments(c))) {
                    t || (c = k(c, t, r));
                    var l = 0, f = c.length;
                    for (u.length += f; f > l; ) u[i++] = c[l++];
                } else r || (u[i++] = c);
            }
            return u;
        };
        m.flatten = function(n, t) {
            return k(n, t, !1);
        }, m.without = function(n) {
            return m.difference(n, l.call(arguments, 1));
        }, m.uniq = m.unique = function(n, t, r, e) {
            if (null == n) return [];
            m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = b(r, e));
            for (var u = [], i = [], o = 0, a = n.length; a > o; o++) {
                var c = n[o], l = r ? r(c, o, n) : c;
                t ? (o && i === l || u.push(c), i = l) : r ? m.contains(i, l) || (i.push(l), u.push(c)) : m.contains(u, c) || u.push(c);
            }
            return u;
        }, m.union = function() {
            return m.uniq(k(arguments, !0, !0));
        }, m.intersection = function(n) {
            if (null == n) return [];
            for (var t = [], r = arguments.length, e = 0, u = n.length; u > e; e++) {
                var i = n[e];
                if (!m.contains(t, i)) {
                    for (var o = 1; r > o && m.contains(arguments[o], i); o++) ;
                    o === r && t.push(i);
                }
            }
            return t;
        }, m.difference = function(n) {
            var t = k(arguments, !0, !0, 1);
            return m.filter(n, function(n) {
                return !m.contains(t, n);
            });
        }, m.zip = function() {
            return m.unzip(arguments);
        }, m.unzip = function(n) {
            for (var t = n && m.max(n, "length").length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e);
            return r;
        }, m.object = function(n, t) {
            for (var r = {}, e = 0, u = n && n.length; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
            return r;
        }, m.indexOf = function(n, t, r) {
            var e = 0, u = n && n.length;
            if ("number" == typeof r) e = 0 > r ? Math.max(0, u + r) : r; else if (r && u) return e = m.sortedIndex(n, t), 
            n[e] === t ? e : -1;
            if (t !== t) return m.findIndex(l.call(n, e), m.isNaN);
            for (;u > e; e++) if (n[e] === t) return e;
            return -1;
        }, m.lastIndexOf = function(n, t, r) {
            var e = n ? n.length : 0;
            if ("number" == typeof r && (e = 0 > r ? e + r + 1 : Math.min(e, r + 1)), t !== t) return m.findLastIndex(l.call(n, 0, e), m.isNaN);
            for (;--e >= 0; ) if (n[e] === t) return e;
            return -1;
        }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function(n, t, r, e) {
            r = b(r, e, 1);
            for (var u = r(t), i = 0, o = n.length; o > i; ) {
                var a = Math.floor((i + o) / 2);
                r(n[a]) < u ? i = a + 1 : o = a;
            }
            return i;
        }, m.range = function(n, t, r) {
            arguments.length <= 1 && (t = n || 0, n = 0), r = r || 1;
            for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, 
            n += r) u[i] = n;
            return u;
        };
        var O = function(n, t, r, e, u) {
            if (!(e instanceof t)) return n.apply(r, u);
            var i = _(n.prototype), o = n.apply(i, u);
            return m.isObject(o) ? o : i;
        };
        m.bind = function(n, t) {
            if (v && n.bind === v) return v.apply(n, l.call(arguments, 1));
            if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function");
            var r = l.call(arguments, 2), e = function() {
                return O(n, e, t, this, r.concat(l.call(arguments)));
            };
            return e;
        }, m.partial = function(n) {
            var t = l.call(arguments, 1), r = function() {
                for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o];
                for (;e < arguments.length; ) i.push(arguments[e++]);
                return O(n, r, this, this, i);
            };
            return r;
        }, m.bindAll = function(n) {
            var t, r, e = arguments.length;
            if (1 >= e) throw new Error("bindAll must be passed function names");
            for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n);
            return n;
        }, m.memoize = function(n, t) {
            var r = function(e) {
                var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e);
                return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i];
            };
            return r.cache = {}, r;
        }, m.delay = function(n, t) {
            var r = l.call(arguments, 2);
            return setTimeout(function() {
                return n.apply(null, r);
            }, t);
        }, m.defer = m.partial(m.delay, m, 1), m.throttle = function(n, t, r) {
            var e, u, i, o = null, a = 0;
            r || (r = {});
            var c = function() {
                a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null);
            };
            return function() {
                var l = m.now();
                a || r.leading !== !1 || (a = l);
                var f = t - (l - a);
                return e = this, u = arguments, 0 >= f || f > t ? (o && (clearTimeout(o), o = null), 
                a = l, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, f)), 
                i;
            };
        }, m.debounce = function(n, t, r) {
            var e, u, i, o, a, c = function() {
                var l = m.now() - o;
                t > l && l >= 0 ? e = setTimeout(c, t - l) : (e = null, r || (a = n.apply(i, u), 
                e || (i = u = null)));
            };
            return function() {
                i = this, u = arguments, o = m.now();
                var l = r && !e;
                return e || (e = setTimeout(c, t)), l && (a = n.apply(i, u), i = u = null), a;
            };
        }, m.wrap = function(n, t) {
            return m.partial(t, n);
        }, m.negate = function(n) {
            return function() {
                return !n.apply(this, arguments);
            };
        }, m.compose = function() {
            var n = arguments, t = n.length - 1;
            return function() {
                for (var r = t, e = n[t].apply(this, arguments); r--; ) e = n[r].call(this, e);
                return e;
            };
        }, m.after = function(n, t) {
            return function() {
                return --n < 1 ? t.apply(this, arguments) : void 0;
            };
        }, m.before = function(n, t) {
            var r;
            return function() {
                return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r;
            };
        }, m.once = m.partial(m.before, 2);
        var F = !{
            toString: null
        }.propertyIsEnumerable("toString"), S = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
        m.keys = function(n) {
            if (!m.isObject(n)) return [];
            if (h) return h(n);
            var t = [];
            for (var e in n) m.has(n, e) && t.push(e);
            return F && r(n, t), t;
        }, m.allKeys = function(n) {
            if (!m.isObject(n)) return [];
            var t = [];
            for (var e in n) t.push(e);
            return F && r(n, t), t;
        }, m.values = function(n) {
            for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]];
            return e;
        }, m.mapObject = function(n, t, r) {
            t = b(t, r);
            for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n);
            return o;
        }, m.pairs = function(n) {
            for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [ t[u], n[t[u]] ];
            return e;
        }, m.invert = function(n) {
            for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e];
            return t;
        }, m.functions = m.methods = function(n) {
            var t = [];
            for (var r in n) m.isFunction(n[r]) && t.push(r);
            return t.sort();
        }, m.extend = x(m.allKeys), m.extendOwn = m.assign = x(m.keys), m.findKey = function(n, t, r) {
            t = b(t, r);
            for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++) if (e = u[i], t(n[e], e, n)) return e;
        }, m.pick = function(n, t, r) {
            var e, u, i = {}, o = n;
            if (null == o) return i;
            m.isFunction(t) ? (u = m.allKeys(o), e = d(t, r)) : (u = k(arguments, !1, !1, 1), 
            e = function(n, t, r) {
                return t in r;
            }, o = Object(o));
            for (var a = 0, c = u.length; c > a; a++) {
                var l = u[a], f = o[l];
                e(f, l, o) && (i[l] = f);
            }
            return i;
        }, m.omit = function(n, t, r) {
            if (m.isFunction(t)) t = m.negate(t); else {
                var e = m.map(k(arguments, !1, !1, 1), String);
                t = function(n, t) {
                    return !m.contains(e, t);
                };
            }
            return m.pick(n, t, r);
        }, m.defaults = x(m.allKeys, !0), m.clone = function(n) {
            return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n;
        }, m.tap = function(n, t) {
            return t(n), n;
        }, m.isMatch = function(n, t) {
            var r = m.keys(t), e = r.length;
            if (null == n) return !e;
            for (var u = Object(n), i = 0; e > i; i++) {
                var o = r[i];
                if (t[o] !== u[o] || !(o in u)) return !1;
            }
            return !0;
        };
        var E = function(n, t, r, e) {
            if (n === t) return 0 !== n || 1 / n === 1 / t;
            if (null == n || null == t) return n === t;
            n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped);
            var u = f.call(n);
            if (u !== f.call(t)) return !1;
            switch (u) {
              case "[object RegExp]":
              case "[object String]":
                return "" + n == "" + t;

              case "[object Number]":
                return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;

              case "[object Date]":
              case "[object Boolean]":
                return +n === +t;
            }
            var i = "[object Array]" === u;
            if (!i) {
                if ("object" != typeof n || "object" != typeof t) return !1;
                var o = n.constructor, a = t.constructor;
                if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1;
            }
            r = r || [], e = e || [];
            for (var c = r.length; c--; ) if (r[c] === n) return e[c] === t;
            if (r.push(n), e.push(t), i) {
                if (c = n.length, c !== t.length) return !1;
                for (;c--; ) if (!E(n[c], t[c], r, e)) return !1;
            } else {
                var l, s = m.keys(n);
                if (c = s.length, m.keys(t).length !== c) return !1;
                for (;c--; ) if (l = s[c], !m.has(t, l) || !E(n[l], t[l], r, e)) return !1;
            }
            return r.pop(), e.pop(), !0;
        };
        m.isEqual = function(n, t) {
            return E(n, t);
        }, m.isEmpty = function(n) {
            return null == n ? !0 : w(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length;
        }, m.isElement = function(n) {
            return !(!n || 1 !== n.nodeType);
        }, m.isArray = p || function(n) {
            return "[object Array]" === f.call(n);
        }, m.isObject = function(n) {
            var t = typeof n;
            return "function" === t || "object" === t && !!n;
        }, m.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(n) {
            m["is" + n] = function(t) {
                return f.call(t) === "[object " + n + "]";
            };
        }), m.isArguments(arguments) || (m.isArguments = function(n) {
            return m.has(n, "callee");
        }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function(n) {
            return "function" == typeof n || !1;
        }), m.isFinite = function(n) {
            return isFinite(n) && !isNaN(parseFloat(n));
        }, m.isNaN = function(n) {
            return m.isNumber(n) && n !== +n;
        }, m.isBoolean = function(n) {
            return n === !0 || n === !1 || "[object Boolean]" === f.call(n);
        }, m.isNull = function(n) {
            return null === n;
        }, m.isUndefined = function(n) {
            return void 0 === n;
        }, m.has = function(n, t) {
            return null != n && s.call(n, t);
        }, m.noConflict = function() {
            return e._ = u, this;
        }, m.identity = function(n) {
            return n;
        }, m.constant = function(n) {
            return function() {
                return n;
            };
        }, m.noop = function() {}, m.property = function(n) {
            return function(t) {
                return null == t ? void 0 : t[n];
            };
        }, m.propertyOf = function(n) {
            return null == n ? function() {} : function(t) {
                return n[t];
            };
        }, m.matcher = m.matches = function(n) {
            return n = m.extendOwn({}, n), function(t) {
                return m.isMatch(t, n);
            };
        }, m.times = function(n, t, r) {
            var e = Array(Math.max(0, n));
            t = d(t, r, 1);
            for (var u = 0; n > u; u++) e[u] = t(u);
            return e;
        }, m.random = function(n, t) {
            return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1));
        }, m.now = Date.now || function() {
            return new Date().getTime();
        };
        var M = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        }, N = m.invert(M), I = function(n) {
            var t = function(t) {
                return n[t];
            }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g");
            return function(n) {
                return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n;
            };
        };
        m.escape = I(M), m.unescape = I(N), m.result = function(n, t, r) {
            var e = null == n ? void 0 : n[t];
            return void 0 === e && (e = r), m.isFunction(e) ? e.call(n) : e;
        };
        var B = 0;
        m.uniqueId = function(n) {
            var t = ++B + "";
            return n ? n + t : t;
        }, m.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var T = /(.)^/, R = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        }, q = /\\|'|\r|\n|\u2028|\u2029/g, K = function(n) {
            return "\\" + R[n];
        };
        m.template = function(n, t, r) {
            !t && r && (t = r), t = m.defaults({}, t, m.templateSettings);
            var e = RegExp([ (t.escape || T).source, (t.interpolate || T).source, (t.evaluate || T).source ].join("|") + "|$", "g"), u = 0, i = "__p+='";
            n.replace(e, function(t, r, e, o, a) {
                return i += n.slice(u, a).replace(q, K), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), 
                t;
            }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
            try {
                var o = new Function(t.variable || "obj", "_", i);
            } catch (a) {
                throw a.source = i, a;
            }
            var c = function(n) {
                return o.call(this, n, m);
            }, l = t.variable || "obj";
            return c.source = "function(" + l + "){\n" + i + "}", c;
        }, m.chain = function(n) {
            var t = m(n);
            return t._chain = !0, t;
        };
        var z = function(n, t) {
            return n._chain ? m(t).chain() : t;
        };
        m.mixin = function(n) {
            m.each(m.functions(n), function(t) {
                var r = m[t] = n[t];
                m.prototype[t] = function() {
                    var n = [ this._wrapped ];
                    return c.apply(n, arguments), z(this, r.apply(m, n));
                };
            });
        }, m.mixin(m), m.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(n) {
            var t = i[n];
            m.prototype[n] = function() {
                var r = this._wrapped;
                return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], 
                z(this, r);
            };
        }), m.each([ "concat", "join", "slice" ], function(n) {
            var t = i[n];
            m.prototype[n] = function() {
                return z(this, t.apply(this._wrapped, arguments));
            };
        }), m.prototype.value = function() {
            return this._wrapped;
        }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function() {
            return "" + this._wrapped;
        }, "function" == typeof define && define.amd && define("underscore", [], function() {
            return m;
        });
    }.call(this), function(root, factory) {
        root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
    }(this, function(root, Backbone, _, $) {
        var previousBackbone = root.Backbone, array = [], slice = (array.push, array.slice);
        array.splice;
        Backbone.VERSION = "1.1.2", Backbone.$ = $, Backbone.noConflict = function() {
            return root.Backbone = previousBackbone, this;
        }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
        var Events = Backbone.Events = {
            on: function(name, callback, context) {
                if (!eventsApi(this, "on", name, [ callback, context ]) || !callback) return this;
                this._events || (this._events = {});
                var events = this._events[name] || (this._events[name] = []);
                return events.push({
                    callback: callback,
                    context: context,
                    ctx: context || this
                }), this;
            },
            once: function(name, callback, context) {
                if (!eventsApi(this, "once", name, [ callback, context ]) || !callback) return this;
                var self = this, once = _.once(function() {
                    self.off(name, once), callback.apply(this, arguments);
                });
                return once._callback = callback, this.on(name, once, context);
            },
            off: function(name, callback, context) {
                var retain, ev, events, names, i, l, j, k;
                if (!this._events || !eventsApi(this, "off", name, [ callback, context ])) return this;
                if (!name && !callback && !context) return this._events = void 0, this;
                for (names = name ? [ name ] : _.keys(this._events), i = 0, l = names.length; l > i; i++) if (name = names[i], 
                events = this._events[name]) {
                    if (this._events[name] = retain = [], callback || context) for (j = 0, k = events.length; k > j; j++) ev = events[j], 
                    (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                    retain.length || delete this._events[name];
                }
                return this;
            },
            trigger: function(name) {
                if (!this._events) return this;
                var args = slice.call(arguments, 1);
                if (!eventsApi(this, "trigger", name, args)) return this;
                var events = this._events[name], allEvents = this._events.all;
                return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), 
                this;
            },
            stopListening: function(obj, name, callback) {
                var listeningTo = this._listeningTo;
                if (!listeningTo) return this;
                var remove = !name && !callback;
                callback || "object" != typeof name || (callback = this), obj && ((listeningTo = {})[obj._listenId] = obj);
                for (var id in listeningTo) obj = listeningTo[id], obj.off(name, callback, this), 
                (remove || _.isEmpty(obj._events)) && delete this._listeningTo[id];
                return this;
            }
        }, eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
            if (!name) return !0;
            if ("object" == typeof name) {
                for (var key in name) obj[action].apply(obj, [ key, name[key] ].concat(rest));
                return !1;
            }
            if (eventSplitter.test(name)) {
                for (var names = name.split(eventSplitter), i = 0, l = names.length; l > i; i++) obj[action].apply(obj, [ names[i] ].concat(rest));
                return !1;
            }
            return !0;
        }, triggerEvents = function(events, args) {
            var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
            switch (args.length) {
              case 0:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx);
                return;

              case 1:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1);
                return;

              case 2:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;

              case 3:
                for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;

              default:
                for (;++i < l; ) (ev = events[i]).callback.apply(ev.ctx, args);
                return;
            }
        }, listenMethods = {
            listenTo: "on",
            listenToOnce: "once"
        };
        _.each(listenMethods, function(implementation, method) {
            Events[method] = function(obj, name, callback) {
                var listeningTo = this._listeningTo || (this._listeningTo = {}), id = obj._listenId || (obj._listenId = _.uniqueId("l"));
                return listeningTo[id] = obj, callback || "object" != typeof name || (callback = this), 
                obj[implementation](name, callback, this), this;
            };
        }), Events.bind = Events.on, Events.unbind = Events.off, _.extend(Backbone, Events);
        var Model = Backbone.Model = function(attributes, options) {
            var attrs = attributes || {};
            options || (options = {}), this.cid = _.uniqueId("c"), this.attributes = {}, options.collection && (this.collection = options.collection), 
            options.parse && (attrs = this.parse(attrs, options) || {}), attrs = _.defaults({}, attrs, _.result(this, "defaults")), 
            this.set(attrs, options), this.changed = {}, this.initialize.apply(this, arguments);
        };
        _.extend(Model.prototype, Events, {
            changed: null,
            validationError: null,
            idAttribute: "id",
            initialize: function() {},
            toJSON: function(options) {
                return _.clone(this.attributes);
            },
            sync: function() {
                return Backbone.sync.apply(this, arguments);
            },
            get: function(attr) {
                return this.attributes[attr];
            },
            escape: function(attr) {
                return _.escape(this.get(attr));
            },
            has: function(attr) {
                return null != this.get(attr);
            },
            set: function(key, val, options) {
                var attr, attrs, unset, changes, silent, changing, prev, current;
                if (null == key) return this;
                if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, 
                options || (options = {}), !this._validate(attrs, options)) return !1;
                unset = options.unset, silent = options.silent, changes = [], changing = this._changing, 
                this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), 
                this.changed = {}), current = this.attributes, prev = this._previousAttributes, 
                this.idAttribute in attrs && (this.id = attrs[this.idAttribute]);
                for (attr in attrs) val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), 
                _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, 
                unset ? delete current[attr] : current[attr] = val;
                if (!silent) {
                    changes.length && (this._pending = options);
                    for (var i = 0, l = changes.length; l > i; i++) this.trigger("change:" + changes[i], this, current[changes[i]], options);
                }
                if (changing) return this;
                if (!silent) for (;this._pending; ) options = this._pending, this._pending = !1, 
                this.trigger("change", this, options);
                return this._pending = !1, this._changing = !1, this;
            },
            unset: function(attr, options) {
                return this.set(attr, void 0, _.extend({}, options, {
                    unset: !0
                }));
            },
            clear: function(options) {
                var attrs = {};
                for (var key in this.attributes) attrs[key] = void 0;
                return this.set(attrs, _.extend({}, options, {
                    unset: !0
                }));
            },
            hasChanged: function(attr) {
                return null == attr ? !_.isEmpty(this.changed) : _.has(this.changed, attr);
            },
            changedAttributes: function(diff) {
                if (!diff) return this.hasChanged() ? _.clone(this.changed) : !1;
                var val, changed = !1, old = this._changing ? this._previousAttributes : this.attributes;
                for (var attr in diff) _.isEqual(old[attr], val = diff[attr]) || ((changed || (changed = {}))[attr] = val);
                return changed;
            },
            previous: function(attr) {
                return null != attr && this._previousAttributes ? this._previousAttributes[attr] : null;
            },
            previousAttributes: function() {
                return _.clone(this._previousAttributes);
            },
            fetch: function(options) {
                options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                var model = this, success = options.success;
                return options.success = function(resp) {
                    return model.set(model.parse(resp, options), options) ? (success && success(model, resp, options), 
                    void model.trigger("sync", model, resp, options)) : !1;
                }, wrapError(this, options), this.sync("read", this, options);
            },
            save: function(key, val, options) {
                var attrs, method, xhr, attributes = this.attributes;
                if (null == key || "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, 
                options = _.extend({
                    validate: !0
                }, options), attrs && !options.wait) {
                    if (!this.set(attrs, options)) return !1;
                } else if (!this._validate(attrs, options)) return !1;
                attrs && options.wait && (this.attributes = _.extend({}, attributes, attrs)), void 0 === options.parse && (options.parse = !0);
                var model = this, success = options.success;
                return options.success = function(resp) {
                    model.attributes = attributes;
                    var serverAttrs = model.parse(resp, options);
                    return options.wait && (serverAttrs = _.extend(attrs || {}, serverAttrs)), _.isObject(serverAttrs) && !model.set(serverAttrs, options) ? !1 : (success && success(model, resp, options), 
                    void model.trigger("sync", model, resp, options));
                }, wrapError(this, options), method = this.isNew() ? "create" : options.patch ? "patch" : "update", 
                "patch" === method && (options.attrs = attrs), xhr = this.sync(method, this, options), 
                attrs && options.wait && (this.attributes = attributes), xhr;
            },
            destroy: function(options) {
                options = options ? _.clone(options) : {};
                var model = this, success = options.success, destroy = function() {
                    model.trigger("destroy", model, model.collection, options);
                };
                if (options.success = function(resp) {
                    (options.wait || model.isNew()) && destroy(), success && success(model, resp, options), 
                    model.isNew() || model.trigger("sync", model, resp, options);
                }, this.isNew()) return options.success(), !1;
                wrapError(this, options);
                var xhr = this.sync("delete", this, options);
                return options.wait || destroy(), xhr;
            },
            url: function() {
                var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
                return this.isNew() ? base : base.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id);
            },
            parse: function(resp, options) {
                return resp;
            },
            clone: function() {
                return new this.constructor(this.attributes);
            },
            isNew: function() {
                return !this.has(this.idAttribute);
            },
            isValid: function(options) {
                return this._validate({}, _.extend(options || {}, {
                    validate: !0
                }));
            },
            _validate: function(attrs, options) {
                if (!options.validate || !this.validate) return !0;
                attrs = _.extend({}, this.attributes, attrs);
                var error = this.validationError = this.validate(attrs, options) || null;
                return error ? (this.trigger("invalid", this, error, _.extend(options, {
                    validationError: error
                })), !1) : !0;
            }
        });
        var modelMethods = [ "keys", "values", "pairs", "invert", "pick", "omit" ];
        _.each(modelMethods, function(method) {
            Model.prototype[method] = function() {
                var args = slice.call(arguments);
                return args.unshift(this.attributes), _[method].apply(_, args);
            };
        });
        var Collection = Backbone.Collection = function(models, options) {
            options || (options = {}), options.model && (this.model = options.model), void 0 !== options.comparator && (this.comparator = options.comparator), 
            this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, _.extend({
                silent: !0
            }, options));
        }, setOptions = {
            add: !0,
            remove: !0,
            merge: !0
        }, addOptions = {
            add: !0,
            remove: !1
        };
        _.extend(Collection.prototype, Events, {
            model: Model,
            initialize: function() {},
            toJSON: function(options) {
                return this.map(function(model) {
                    return model.toJSON(options);
                });
            },
            sync: function() {
                return Backbone.sync.apply(this, arguments);
            },
            add: function(models, options) {
                return this.set(models, _.extend({
                    merge: !1
                }, options, addOptions));
            },
            remove: function(models, options) {
                var singular = !_.isArray(models);
                models = singular ? [ models ] : _.clone(models), options || (options = {});
                var i, l, index, model;
                for (i = 0, l = models.length; l > i; i++) model = models[i] = this.get(models[i]), 
                model && (delete this._byId[model.id], delete this._byId[model.cid], index = this.indexOf(model), 
                this.models.splice(index, 1), this.length--, options.silent || (options.index = index, 
                model.trigger("remove", model, this, options)), this._removeReference(model, options));
                return singular ? models[0] : models;
            },
            set: function(models, options) {
                options = _.defaults({}, options, setOptions), options.parse && (models = this.parse(models, options));
                var singular = !_.isArray(models);
                models = singular ? models ? [ models ] : [] : _.clone(models);
                var i, l, id, model, attrs, existing, sort, at = options.at, targetModel = this.model, sortable = this.comparator && null == at && options.sort !== !1, sortAttr = _.isString(this.comparator) ? this.comparator : null, toAdd = [], toRemove = [], modelMap = {}, add = options.add, merge = options.merge, remove = options.remove, order = !sortable && add && remove ? [] : !1;
                for (i = 0, l = models.length; l > i; i++) {
                    if (attrs = models[i] || {}, id = attrs instanceof Model ? model = attrs : attrs[targetModel.prototype.idAttribute || "id"], 
                    existing = this.get(id)) remove && (modelMap[existing.cid] = !0), merge && (attrs = attrs === model ? model.attributes : attrs, 
                    options.parse && (attrs = existing.parse(attrs, options)), existing.set(attrs, options), 
                    sortable && !sort && existing.hasChanged(sortAttr) && (sort = !0)), models[i] = existing; else if (add) {
                        if (model = models[i] = this._prepareModel(attrs, options), !model) continue;
                        toAdd.push(model), this._addReference(model, options);
                    }
                    model = existing || model, !order || !model.isNew() && modelMap[model.id] || order.push(model), 
                    modelMap[model.id] = !0;
                }
                if (remove) {
                    for (i = 0, l = this.length; l > i; ++i) modelMap[(model = this.models[i]).cid] || toRemove.push(model);
                    toRemove.length && this.remove(toRemove, options);
                }
                if (toAdd.length || order && order.length) if (sortable && (sort = !0), this.length += toAdd.length, 
                null != at) for (i = 0, l = toAdd.length; l > i; i++) this.models.splice(at + i, 0, toAdd[i]); else {
                    order && (this.models.length = 0);
                    var orderedModels = order || toAdd;
                    for (i = 0, l = orderedModels.length; l > i; i++) this.models.push(orderedModels[i]);
                }
                if (sort && this.sort({
                    silent: !0
                }), !options.silent) {
                    for (i = 0, l = toAdd.length; l > i; i++) (model = toAdd[i]).trigger("add", model, this, options);
                    (sort || order && order.length) && this.trigger("sort", this, options);
                }
                return singular ? models[0] : models;
            },
            reset: function(models, options) {
                options || (options = {});
                for (var i = 0, l = this.models.length; l > i; i++) this._removeReference(this.models[i], options);
                return options.previousModels = this.models, this._reset(), models = this.add(models, _.extend({
                    silent: !0
                }, options)), options.silent || this.trigger("reset", this, options), models;
            },
            push: function(model, options) {
                return this.add(model, _.extend({
                    at: this.length
                }, options));
            },
            pop: function(options) {
                var model = this.at(this.length - 1);
                return this.remove(model, options), model;
            },
            unshift: function(model, options) {
                return this.add(model, _.extend({
                    at: 0
                }, options));
            },
            shift: function(options) {
                var model = this.at(0);
                return this.remove(model, options), model;
            },
            slice: function() {
                return slice.apply(this.models, arguments);
            },
            get: function(obj) {
                return null == obj ? void 0 : this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
            },
            at: function(index) {
                return this.models[index];
            },
            where: function(attrs, first) {
                return _.isEmpty(attrs) ? first ? void 0 : [] : this[first ? "find" : "filter"](function(model) {
                    for (var key in attrs) if (attrs[key] !== model.get(key)) return !1;
                    return !0;
                });
            },
            findWhere: function(attrs) {
                return this.where(attrs, !0);
            },
            sort: function(options) {
                if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
                return options || (options = {}), _.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(_.bind(this.comparator, this)), 
                options.silent || this.trigger("sort", this, options), this;
            },
            pluck: function(attr) {
                return _.invoke(this.models, "get", attr);
            },
            fetch: function(options) {
                options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                var success = options.success, collection = this;
                return options.success = function(resp) {
                    var method = options.reset ? "reset" : "set";
                    collection[method](resp, options), success && success(collection, resp, options), 
                    collection.trigger("sync", collection, resp, options);
                }, wrapError(this, options), this.sync("read", this, options);
            },
            create: function(model, options) {
                if (options = options ? _.clone(options) : {}, !(model = this._prepareModel(model, options))) return !1;
                options.wait || this.add(model, options);
                var collection = this, success = options.success;
                return options.success = function(model, resp) {
                    options.wait && collection.add(model, options), success && success(model, resp, options);
                }, model.save(null, options), model;
            },
            parse: function(resp, options) {
                return resp;
            },
            clone: function() {
                return new this.constructor(this.models);
            },
            _reset: function() {
                this.length = 0, this.models = [], this._byId = {};
            },
            _prepareModel: function(attrs, options) {
                if (attrs instanceof Model) return attrs;
                options = options ? _.clone(options) : {}, options.collection = this;
                var model = new this.model(attrs, options);
                return model.validationError ? (this.trigger("invalid", this, model.validationError, options), 
                !1) : model;
            },
            _addReference: function(model, options) {
                this._byId[model.cid] = model, null != model.id && (this._byId[model.id] = model), 
                model.collection || (model.collection = this), model.on("all", this._onModelEvent, this);
            },
            _removeReference: function(model, options) {
                this === model.collection && delete model.collection, model.off("all", this._onModelEvent, this);
            },
            _onModelEvent: function(event, model, collection, options) {
                ("add" !== event && "remove" !== event || collection === this) && ("destroy" === event && this.remove(model, options), 
                model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], 
                null != model.id && (this._byId[model.id] = model)), this.trigger.apply(this, arguments));
            }
        });
        var methods = [ "forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample" ];
        _.each(methods, function(method) {
            Collection.prototype[method] = function() {
                var args = slice.call(arguments);
                return args.unshift(this.models), _[method].apply(_, args);
            };
        });
        var attributeMethods = [ "groupBy", "countBy", "sortBy", "indexBy" ];
        _.each(attributeMethods, function(method) {
            Collection.prototype[method] = function(value, context) {
                var iterator = _.isFunction(value) ? value : function(model) {
                    return model.get(value);
                };
                return _[method](this.models, iterator, context);
            };
        });
        var View = Backbone.View = function(options) {
            this.cid = _.uniqueId("view"), options || (options = {}), _.extend(this, _.pick(options, viewOptions)), 
            this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
        }, delegateEventSplitter = /^(\S+)\s*(.*)$/, viewOptions = [ "model", "collection", "el", "id", "attributes", "className", "tagName", "events" ];
        _.extend(View.prototype, Events, {
            tagName: "div",
            $: function(selector) {
                return this.$el.find(selector);
            },
            initialize: function() {},
            render: function() {
                return this;
            },
            remove: function() {
                return this.$el.remove(), this.stopListening(), this;
            },
            setElement: function(element, delegate) {
                return this.$el && this.undelegateEvents(), this.$el = element instanceof Backbone.$ ? element : Backbone.$(element), 
                this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this;
            },
            delegateEvents: function(events) {
                if (!events && !(events = _.result(this, "events"))) return this;
                this.undelegateEvents();
                for (var key in events) {
                    var method = events[key];
                    if (_.isFunction(method) || (method = this[events[key]]), method) {
                        var match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2];
                        method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, "" === selector ? this.$el.on(eventName, method) : this.$el.on(eventName, selector, method);
                    }
                }
                return this;
            },
            undelegateEvents: function() {
                return this.$el.off(".delegateEvents" + this.cid), this;
            },
            _ensureElement: function() {
                if (this.el) this.setElement(_.result(this, "el"), !1); else {
                    var attrs = _.extend({}, _.result(this, "attributes"));
                    this.id && (attrs.id = _.result(this, "id")), this.className && (attrs["class"] = _.result(this, "className"));
                    var $el = Backbone.$("<" + _.result(this, "tagName") + ">").attr(attrs);
                    this.setElement($el, !1);
                }
            }
        }), Backbone.sync = function(method, model, options) {
            var type = methodMap[method];
            _.defaults(options || (options = {}), {
                emulateHTTP: Backbone.emulateHTTP,
                emulateJSON: Backbone.emulateJSON
            });
            var params = {
                type: type,
                dataType: "json"
            };
            if (options.url || (params.url = _.result(model, "url") || urlError()), null != options.data || !model || "create" !== method && "update" !== method && "patch" !== method || (params.contentType = "application/json", 
            params.data = JSON.stringify(options.attrs || model.toJSON(options))), options.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", 
            params.data = params.data ? {
                model: params.data
            } : {}), options.emulateHTTP && ("PUT" === type || "DELETE" === type || "PATCH" === type)) {
                params.type = "POST", options.emulateJSON && (params.data._method = type);
                var beforeSend = options.beforeSend;
                options.beforeSend = function(xhr) {
                    return xhr.setRequestHeader("X-HTTP-Method-Override", type), beforeSend ? beforeSend.apply(this, arguments) : void 0;
                };
            }
            "GET" === params.type || options.emulateJSON || (params.processData = !1), "PATCH" === params.type && noXhrPatch && (params.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP");
            });
            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
            return model.trigger("request", model, xhr, options), xhr;
        };
        var noXhrPatch = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && new XMLHttpRequest().dispatchEvent), methodMap = {
            create: "POST",
            update: "PUT",
            patch: "PATCH",
            "delete": "DELETE",
            read: "GET"
        };
        Backbone.ajax = function() {
            return Backbone.$.ajax.apply(Backbone.$, arguments);
        };
        var Router = Backbone.Router = function(options) {
            options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), 
            this.initialize.apply(this, arguments);
        }, optionalParam = /\((.*?)\)/g, namedParam = /(\(\?)?:\w+/g, splatParam = /\*\w+/g, escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        _.extend(Router.prototype, Events, {
            initialize: function() {},
            route: function(route, name, callback) {
                _.isRegExp(route) || (route = this._routeToRegExp(route)), _.isFunction(name) && (callback = name, 
                name = ""), callback || (callback = this[name]);
                var router = this;
                return Backbone.history.route(route, function(fragment) {
                    var args = router._extractParameters(route, fragment);
                    router.execute(callback, args), router.trigger.apply(router, [ "route:" + name ].concat(args)), 
                    router.trigger("route", name, args), Backbone.history.trigger("route", router, name, args);
                }), this;
            },
            execute: function(callback, args) {
                callback && callback.apply(this, args);
            },
            navigate: function(fragment, options) {
                return Backbone.history.navigate(fragment, options), this;
            },
            _bindRoutes: function() {
                if (this.routes) {
                    this.routes = _.result(this, "routes");
                    for (var route, routes = _.keys(this.routes); null != (route = routes.pop()); ) this.route(route, this.routes[route]);
                }
            },
            _routeToRegExp: function(route) {
                return route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
                    return optional ? match : "([^/?]+)";
                }).replace(splatParam, "([^?]*?)"), new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
            },
            _extractParameters: function(route, fragment) {
                var params = route.exec(fragment).slice(1);
                return _.map(params, function(param, i) {
                    return i === params.length - 1 ? param || null : param ? decodeURIComponent(param) : null;
                });
            }
        });
        var History = Backbone.History = function() {
            this.handlers = [], _.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, 
            this.history = window.history);
        }, routeStripper = /^[#\/]|\s+$/g, rootStripper = /^\/+|\/+$/g, isExplorer = /msie [\w.]+/, trailingSlash = /\/$/, pathStripper = /#.*$/;
        History.started = !1, _.extend(History.prototype, Events, {
            interval: 50,
            atRoot: function() {
                return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root;
            },
            getHash: function(window) {
                var match = (window || this).location.href.match(/#(.*)$/);
                return match ? match[1] : "";
            },
            getFragment: function(fragment, forcePushState) {
                if (null == fragment) if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                    fragment = decodeURI(this.location.pathname + this.location.search);
                    var root = this.root.replace(trailingSlash, "");
                    fragment.indexOf(root) || (fragment = fragment.slice(root.length));
                } else fragment = this.getHash();
                return fragment.replace(routeStripper, "");
            },
            start: function(options) {
                if (History.started) throw new Error("Backbone.history has already been started");
                History.started = !0, this.options = _.extend({
                    root: "/"
                }, this.options, options), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, 
                this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                var fragment = this.getFragment(), docMode = document.documentMode, oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || 7 >= docMode);
                if (this.root = ("/" + this.root + "/").replace(rootStripper, "/"), oldIE && this._wantsHashChange) {
                    var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
                    this.iframe = frame.hide().appendTo("body")[0].contentWindow, this.navigate(fragment);
                }
                this._hasPushState ? Backbone.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? Backbone.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), 
                this.fragment = fragment;
                var loc = this.location;
                if (this._wantsHashChange && this._wantsPushState) {
                    if (!this._hasPushState && !this.atRoot()) return this.fragment = this.getFragment(null, !0), 
                    this.location.replace(this.root + "#" + this.fragment), !0;
                    this._hasPushState && this.atRoot() && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), 
                    this.history.replaceState({}, document.title, this.root + this.fragment));
                }
                return this.options.silent ? void 0 : this.loadUrl();
            },
            stop: function() {
                Backbone.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), 
                this._checkUrlInterval && clearInterval(this._checkUrlInterval), History.started = !1;
            },
            route: function(route, callback) {
                this.handlers.unshift({
                    route: route,
                    callback: callback
                });
            },
            checkUrl: function(e) {
                var current = this.getFragment();
                return current === this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe))), 
                current === this.fragment ? !1 : (this.iframe && this.navigate(current), void this.loadUrl());
            },
            loadUrl: function(fragment) {
                return fragment = this.fragment = this.getFragment(fragment), _.any(this.handlers, function(handler) {
                    return handler.route.test(fragment) ? (handler.callback(fragment), !0) : void 0;
                });
            },
            navigate: function(fragment, options) {
                if (!History.started) return !1;
                options && options !== !0 || (options = {
                    trigger: !!options
                });
                var url = this.root + (fragment = this.getFragment(fragment || ""));
                if (fragment = fragment.replace(pathStripper, ""), this.fragment !== fragment) {
                    if (this.fragment = fragment, "" === fragment && "/" !== url && (url = url.slice(0, -1)), 
                    this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url); else {
                        if (!this._wantsHashChange) return this.location.assign(url);
                        this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), 
                        this._updateHash(this.iframe.location, fragment, options.replace));
                    }
                    return options.trigger ? this.loadUrl(fragment) : void 0;
                }
            },
            _updateHash: function(location, fragment, replace) {
                if (replace) {
                    var href = location.href.replace(/(javascript:|#).*$/, "");
                    location.replace(href + "#" + fragment);
                } else location.hash = "#" + fragment;
            }
        }), Backbone.history = new History();
        var extend = function(protoProps, staticProps) {
            var child, parent = this;
            child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function() {
                return parent.apply(this, arguments);
            }, _.extend(child, parent, staticProps);
            var Surrogate = function() {
                this.constructor = child;
            };
            return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(), 
            protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype, 
            child;
        };
        Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
        var urlError = function() {
            throw new Error('A "url" property or function must be specified');
        }, wrapError = function(model, options) {
            var error = options.error;
            options.error = function(resp) {
                error && error(model, resp, options), model.trigger("error", model, resp, options);
            };
        };
        return Backbone;
    }), window.$pureChatJquery && (Backbone.$ = window.$pureChatJquery), function(root, factory) {
        factory(root, root.Backbone, root._);
    }(this, function(exports, Backbone, _) {
        "use strict";
        Backbone.Relational = {
            showWarnings: !0
        }, Backbone.Semaphore = {
            _permitsAvailable: null,
            _permitsUsed: 0,
            acquire: function() {
                if (this._permitsAvailable && this._permitsUsed >= this._permitsAvailable) throw new Error("Max permits acquired");
                this._permitsUsed++;
            },
            release: function() {
                if (0 === this._permitsUsed) throw new Error("All permits released");
                this._permitsUsed--;
            },
            isLocked: function() {
                return this._permitsUsed > 0;
            },
            setAvailablePermits: function(amount) {
                if (this._permitsUsed > amount) throw new Error("Available permits cannot be less than used permits");
                this._permitsAvailable = amount;
            }
        }, Backbone.BlockingQueue = function() {
            this._queue = [];
        }, _.extend(Backbone.BlockingQueue.prototype, Backbone.Semaphore, {
            _queue: null,
            add: function(func) {
                this.isBlocked() ? this._queue.push(func) : func();
            },
            process: function() {
                var queue = this._queue;
                for (this._queue = []; queue && queue.length; ) queue.shift()();
            },
            block: function() {
                this.acquire();
            },
            unblock: function() {
                this.release(), this.isBlocked() || this.process();
            },
            isBlocked: function() {
                return this.isLocked();
            }
        }), Backbone.Relational.eventQueue = new Backbone.BlockingQueue(), Backbone.Store = function() {
            this._collections = [], this._reverseRelations = [], this._orphanRelations = [], 
            this._subModels = [], this._modelScopes = [ exports ];
        }, _.extend(Backbone.Store.prototype, Backbone.Events, {
            initializeRelation: function(model, relation, options) {
                var type = _.isString(relation.type) ? Backbone[relation.type] || this.getObjectByName(relation.type) : relation.type;
                if (type && type.prototype instanceof Backbone.Relation) {
                    new type(model, relation, options);
                } else Backbone.Relational.showWarnings && "undefined" != typeof console && console.warn("Relation=%o; missing or invalid relation type!", relation);
            },
            addModelScope: function(scope) {
                this._modelScopes.push(scope);
            },
            removeModelScope: function(scope) {
                this._modelScopes = _.without(this._modelScopes, scope);
            },
            addSubModels: function(subModelTypes, superModelType) {
                this._subModels.push({
                    superModelType: superModelType,
                    subModels: subModelTypes
                });
            },
            setupSuperModel: function(modelType) {
                _.find(this._subModels, function(subModelDef) {
                    return _.filter(subModelDef.subModels || [], function(subModelTypeName, typeValue) {
                        var subModelType = this.getObjectByName(subModelTypeName);
                        return modelType === subModelType ? (subModelDef.superModelType._subModels[typeValue] = modelType, 
                        modelType._superModel = subModelDef.superModelType, modelType._subModelTypeValue = typeValue, 
                        modelType._subModelTypeAttribute = subModelDef.superModelType.prototype.subModelTypeAttribute, 
                        !0) : void 0;
                    }, this).length;
                }, this);
            },
            addReverseRelation: function(relation) {
                var exists = _.any(this._reverseRelations, function(rel) {
                    return _.all(relation || [], function(val, key) {
                        return val === rel[key];
                    });
                });
                !exists && relation.model && relation.type && (this._reverseRelations.push(relation), 
                this._addRelation(relation.model, relation), this.retroFitRelation(relation));
            },
            addOrphanRelation: function(relation) {
                var exists = _.any(this._orphanRelations, function(rel) {
                    return _.all(relation || [], function(val, key) {
                        return val === rel[key];
                    });
                });
                !exists && relation.model && relation.type && this._orphanRelations.push(relation);
            },
            processOrphanRelations: function() {
                _.each(this._orphanRelations.slice(0), function(rel) {
                    var relatedModel = Backbone.Relational.store.getObjectByName(rel.relatedModel);
                    relatedModel && (this.initializeRelation(null, rel), this._orphanRelations = _.without(this._orphanRelations, rel));
                }, this);
            },
            _addRelation: function(type, relation) {
                type.prototype.relations || (type.prototype.relations = []), type.prototype.relations.push(relation), 
                _.each(type._subModels || [], function(subModel) {
                    this._addRelation(subModel, relation);
                }, this);
            },
            retroFitRelation: function(relation) {
                var coll = this.getCollection(relation.model, !1);
                coll && coll.each(function(model) {
                    if (model instanceof relation.model) {
                        new relation.type(model, relation);
                    }
                }, this);
            },
            getCollection: function(type, create) {
                type instanceof Backbone.RelationalModel && (type = type.constructor);
                for (var rootModel = type; rootModel._superModel; ) rootModel = rootModel._superModel;
                var coll = _.find(this._collections, function(item) {
                    return item.model === rootModel;
                });
                return coll || create === !1 || (coll = this._createCollection(rootModel)), coll;
            },
            getObjectByName: function(name) {
                var parts = name.split("."), type = null;
                return _.find(this._modelScopes, function(scope) {
                    return type = _.reduce(parts || [], function(memo, val) {
                        return memo ? memo[val] : void 0;
                    }, scope), type && type !== scope ? !0 : void 0;
                }, this), type;
            },
            _createCollection: function(type) {
                var coll;
                return type instanceof Backbone.RelationalModel && (type = type.constructor), type.prototype instanceof Backbone.RelationalModel && (coll = new Backbone.Collection(), 
                coll.model = type, this._collections.push(coll)), coll;
            },
            resolveIdForItem: function(type, item) {
                var id = _.isString(item) || _.isNumber(item) ? item : null;
                return null === id && (item instanceof Backbone.RelationalModel ? id = item.id : _.isObject(item) && (id = item[type.prototype.idAttribute])), 
                id || 0 === id || (id = null), id;
            },
            find: function(type, item) {
                var id = this.resolveIdForItem(type, item), coll = this.getCollection(type);
                if (coll) {
                    var obj = coll.get(id);
                    if (obj instanceof type) return obj;
                }
                return null;
            },
            register: function(model) {
                var coll = this.getCollection(model);
                if (coll) {
                    var modelColl = model.collection;
                    coll.add(model), model.collection = modelColl;
                }
            },
            checkId: function(model, id) {
                var coll = this.getCollection(model), duplicate = coll && coll.get(id);
                if (duplicate && model !== duplicate) throw Backbone.Relational.showWarnings && "undefined" != typeof console && console.warn("Duplicate id! Old RelationalModel=%o, new RelationalModel=%o", duplicate, model), 
                new Error("Cannot instantiate more than one Backbone.RelationalModel with the same id per type!");
            },
            update: function(model) {
                var coll = this.getCollection(model);
                coll.contains(model) || this.register(model), coll._onModelEvent("change:" + model.idAttribute, model, coll), 
                model.trigger("relational:change:id", model, coll);
            },
            unregister: function(type) {
                var coll, models;
                type instanceof Backbone.Model ? (coll = this.getCollection(type), models = [ type ]) : type instanceof Backbone.Collection ? (coll = this.getCollection(type.model), 
                models = _.clone(type.models)) : (coll = this.getCollection(type), models = _.clone(coll.models)), 
                _.each(models, function(model) {
                    this.stopListening(model), _.invoke(model.getRelations(), "stopListening");
                }, this), _.contains(this._collections, type) ? coll.reset([]) : _.each(models, function(model) {
                    coll.get(model) ? coll.remove(model) : coll.trigger("relational:remove", model, coll);
                }, this);
            },
            reset: function() {
                this.stopListening(), _.each(this._collections, function(coll) {
                    this.unregister(coll);
                }, this), this._collections = [], this._subModels = [], this._modelScopes = [ exports ];
            }
        }), Backbone.Relational.store = new Backbone.Store(), Backbone.Relation = function(instance, options, opts) {
            if (this.instance = instance, options = _.isObject(options) ? options : {}, this.reverseRelation = _.defaults(options.reverseRelation || {}, this.options.reverseRelation), 
            this.options = _.defaults(options, this.options, Backbone.Relation.prototype.options), 
            this.reverseRelation.type = _.isString(this.reverseRelation.type) ? Backbone[this.reverseRelation.type] || Backbone.Relational.store.getObjectByName(this.reverseRelation.type) : this.reverseRelation.type, 
            this.key = this.options.key, this.keySource = this.options.keySource || this.key, 
            this.keyDestination = this.options.keyDestination || this.keySource || this.key, 
            this.model = this.options.model || this.instance.constructor, this.relatedModel = this.options.relatedModel, 
            _.isUndefined(this.relatedModel) && (this.relatedModel = this.model), !_.isFunction(this.relatedModel) || this.relatedModel.prototype instanceof Backbone.RelationalModel || (this.relatedModel = _.result(this, "relatedModel")), 
            _.isString(this.relatedModel) && (this.relatedModel = Backbone.Relational.store.getObjectByName(this.relatedModel)), 
            this.checkPreconditions() && (!this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key && Backbone.Relational.store.addReverseRelation(_.defaults({
                isAutoRelation: !0,
                model: this.relatedModel,
                relatedModel: this.model,
                reverseRelation: this.options
            }, this.reverseRelation)), instance)) {
                var contentKey = this.keySource;
                contentKey !== this.key && _.isObject(this.instance.get(this.key)) && (contentKey = this.key), 
                this.setKeyContents(this.instance.get(contentKey)), this.relatedCollection = Backbone.Relational.store.getCollection(this.relatedModel), 
                this.keySource !== this.key && delete this.instance.attributes[this.keySource], 
                this.instance._relations[this.key] = this, this.initialize(opts), this.options.autoFetch && this.instance.getAsync(this.key, _.isObject(this.options.autoFetch) ? this.options.autoFetch : {}), 
                this.listenTo(this.instance, "destroy", this.destroy).listenTo(this.relatedCollection, "relational:add relational:change:id", this.tryAddRelated).listenTo(this.relatedCollection, "relational:remove", this.removeRelated);
            }
        }, Backbone.Relation.extend = Backbone.Model.extend, _.extend(Backbone.Relation.prototype, Backbone.Events, Backbone.Semaphore, {
            options: {
                createModels: !0,
                includeInJSON: !0,
                isAutoRelation: !1,
                autoFetch: !1,
                parse: !1
            },
            instance: null,
            key: null,
            keyContents: null,
            relatedModel: null,
            relatedCollection: null,
            reverseRelation: null,
            related: null,
            checkPreconditions: function() {
                var i = this.instance, k = this.key, m = this.model, rm = this.relatedModel, warn = Backbone.Relational.showWarnings && "undefined" != typeof console;
                if (!m || !k || !rm) return warn && console.warn("Relation=%o: missing model, key or relatedModel (%o, %o, %o).", this, m, k, rm), 
                !1;
                if (!(m.prototype instanceof Backbone.RelationalModel)) return warn && console.warn("Relation=%o: model does not inherit from Backbone.RelationalModel (%o).", this, i), 
                !1;
                if (!(rm.prototype instanceof Backbone.RelationalModel)) return warn && console.warn("Relation=%o: relatedModel does not inherit from Backbone.RelationalModel (%o).", this, rm), 
                !1;
                if (this instanceof Backbone.HasMany && this.reverseRelation.type === Backbone.HasMany) return warn && console.warn("Relation=%o: relation is a HasMany, and the reverseRelation is HasMany as well.", this), 
                !1;
                if (i && _.keys(i._relations).length) {
                    var existing = _.find(i._relations, function(rel) {
                        return rel.key === k;
                    }, this);
                    if (existing) return warn && console.warn("Cannot create relation=%o on %o for model=%o: already taken by relation=%o.", this, k, i, existing), 
                    !1;
                }
                return !0;
            },
            setRelated: function(related) {
                this.related = related, this.instance.attributes[this.key] = related;
            },
            _isReverseRelation: function(relation) {
                return relation.instance instanceof this.relatedModel && this.reverseRelation.key === relation.key && this.key === relation.reverseRelation.key;
            },
            getReverseRelations: function(model) {
                for (var reverseRelations = [], models = _.isUndefined(model) ? this.related && (this.related.models || [ this.related ]) : [ model ], relations = null, relation = null, i = 0; i < (models || []).length; i++) {
                    relations = models[i].getRelations() || [];
                    for (var j = 0; j < relations.length; j++) relation = relations[j], this._isReverseRelation(relation) && reverseRelations.push(relation);
                }
                return reverseRelations;
            },
            destroy: function() {
                this.stopListening(), this instanceof Backbone.HasOne ? this.setRelated(null) : this instanceof Backbone.HasMany && this.setRelated(this._prepareCollection()), 
                _.each(this.getReverseRelations(), function(relation) {
                    relation.removeRelated(this.instance);
                }, this);
            }
        }), Backbone.HasOne = Backbone.Relation.extend({
            options: {
                reverseRelation: {
                    type: "HasMany"
                }
            },
            initialize: function(opts) {
                this.listenTo(this.instance, "relational:change:" + this.key, this.onChange);
                var related = this.findRelated(opts);
                this.setRelated(related), _.each(this.getReverseRelations(), function(relation) {
                    relation.addRelated(this.instance, opts);
                }, this);
            },
            findRelated: function(options) {
                var related = null;
                if (options = _.defaults({
                    parse: this.options.parse
                }, options), this.keyContents instanceof this.relatedModel) related = this.keyContents; else if (this.keyContents || 0 === this.keyContents) {
                    var opts = _.defaults({
                        create: this.options.createModels
                    }, options);
                    related = this.relatedModel.findOrCreate(this.keyContents, opts);
                }
                return related && (this.keyId = null), related;
            },
            setKeyContents: function(keyContents) {
                this.keyContents = keyContents, this.keyId = Backbone.Relational.store.resolveIdForItem(this.relatedModel, this.keyContents);
            },
            onChange: function(model, attr, options) {
                if (!this.isLocked()) {
                    this.acquire(), options = options ? _.clone(options) : {};
                    var changed = _.isUndefined(options.__related), oldRelated = changed ? this.related : options.__related;
                    if (changed) {
                        this.setKeyContents(attr);
                        var related = this.findRelated(options);
                        this.setRelated(related);
                    }
                    if (oldRelated && this.related !== oldRelated && _.each(this.getReverseRelations(oldRelated), function(relation) {
                        relation.removeRelated(this.instance, null, options);
                    }, this), _.each(this.getReverseRelations(), function(relation) {
                        relation.addRelated(this.instance, options);
                    }, this), !options.silent && this.related !== oldRelated) {
                        var dit = this;
                        this.changed = !0, Backbone.Relational.eventQueue.add(function() {
                            dit.instance.trigger("change:" + dit.key, dit.instance, dit.related, options, !0), 
                            dit.changed = !1;
                        });
                    }
                    this.release();
                }
            },
            tryAddRelated: function(model, coll, options) {
                !this.keyId && 0 !== this.keyId || model.id !== this.keyId || (this.addRelated(model, options), 
                this.keyId = null);
            },
            addRelated: function(model, options) {
                var dit = this;
                model.queue(function() {
                    if (model !== dit.related) {
                        var oldRelated = dit.related || null;
                        dit.setRelated(model), dit.onChange(dit.instance, model, _.defaults({
                            __related: oldRelated
                        }, options));
                    }
                });
            },
            removeRelated: function(model, coll, options) {
                if (this.related && model === this.related) {
                    var oldRelated = this.related || null;
                    this.setRelated(null), this.onChange(this.instance, model, _.defaults({
                        __related: oldRelated
                    }, options));
                }
            }
        }), Backbone.HasMany = Backbone.Relation.extend({
            collectionType: null,
            options: {
                reverseRelation: {
                    type: "HasOne"
                },
                collectionType: Backbone.Collection,
                collectionKey: !0,
                collectionOptions: {}
            },
            initialize: function(opts) {
                if (this.listenTo(this.instance, "relational:change:" + this.key, this.onChange), 
                this.collectionType = this.options.collectionType, !_.isFunction(this.collectionType) || this.collectionType === Backbone.Collection || this.collectionType.prototype instanceof Backbone.Collection || (this.collectionType = _.result(this, "collectionType")), 
                _.isString(this.collectionType) && (this.collectionType = Backbone.Relational.store.getObjectByName(this.collectionType)), 
                this.collectionType !== Backbone.Collection && !(this.collectionType.prototype instanceof Backbone.Collection)) throw new Error("`collectionType` must inherit from Backbone.Collection");
                var related = this.findRelated(opts);
                this.setRelated(related);
            },
            _prepareCollection: function(collection) {
                if (this.related && this.stopListening(this.related), !(collection && collection instanceof Backbone.Collection)) {
                    var options = _.isFunction(this.options.collectionOptions) ? this.options.collectionOptions(this.instance) : this.options.collectionOptions;
                    collection = new this.collectionType(null, options);
                }
                if (collection.model = this.relatedModel, this.options.collectionKey) {
                    var key = this.options.collectionKey === !0 ? this.options.reverseRelation.key : this.options.collectionKey;
                    collection[key] && collection[key] !== this.instance ? Backbone.Relational.showWarnings && "undefined" != typeof console && console.warn("Relation=%o; collectionKey=%s already exists on collection=%o", this, key, this.options.collectionKey) : key && (collection[key] = this.instance);
                }
                return this.listenTo(collection, "relational:add", this.handleAddition).listenTo(collection, "relational:remove", this.handleRemoval).listenTo(collection, "relational:reset", this.handleReset), 
                collection;
            },
            findRelated: function(options) {
                var related = null;
                if (options = _.defaults({
                    parse: this.options.parse
                }, options), this.keyContents instanceof Backbone.Collection) this._prepareCollection(this.keyContents), 
                related = this.keyContents; else {
                    var toAdd = [];
                    _.each(this.keyContents, function(attributes) {
                        var model = null;
                        model = attributes instanceof this.relatedModel ? attributes : this.relatedModel.findOrCreate(attributes, _.extend({
                            merge: !0
                        }, options, {
                            create: this.options.createModels
                        })), model && toAdd.push(model);
                    }, this), related = this.related instanceof Backbone.Collection ? this.related : this._prepareCollection(), 
                    related.set(toAdd, _.defaults({
                        merge: !1,
                        parse: !1
                    }, options));
                }
                return this.keyIds = _.difference(this.keyIds, _.pluck(related.models, "id")), related;
            },
            setKeyContents: function(keyContents) {
                this.keyContents = keyContents instanceof Backbone.Collection ? keyContents : null, 
                this.keyIds = [], this.keyContents || !keyContents && 0 !== keyContents || (this.keyContents = _.isArray(keyContents) ? keyContents : [ keyContents ], 
                _.each(this.keyContents, function(item) {
                    var itemId = Backbone.Relational.store.resolveIdForItem(this.relatedModel, item);
                    (itemId || 0 === itemId) && this.keyIds.push(itemId);
                }, this));
            },
            onChange: function(model, attr, options) {
                options = options ? _.clone(options) : {}, this.setKeyContents(attr), this.changed = !1;
                var related = this.findRelated(options);
                if (this.setRelated(related), !options.silent) {
                    var dit = this;
                    Backbone.Relational.eventQueue.add(function() {
                        dit.changed && (dit.instance.trigger("change:" + dit.key, dit.instance, dit.related, options, !0), 
                        dit.changed = !1);
                    });
                }
            },
            handleAddition: function(model, coll, options) {
                options = options ? _.clone(options) : {}, this.changed = !0, _.each(this.getReverseRelations(model), function(relation) {
                    relation.addRelated(this.instance, options);
                }, this);
                var dit = this;
                !options.silent && Backbone.Relational.eventQueue.add(function() {
                    dit.instance.trigger("add:" + dit.key, model, dit.related, options);
                });
            },
            handleRemoval: function(model, coll, options) {
                options = options ? _.clone(options) : {}, this.changed = !0, _.each(this.getReverseRelations(model), function(relation) {
                    relation.removeRelated(this.instance, null, options);
                }, this);
                var dit = this;
                !options.silent && Backbone.Relational.eventQueue.add(function() {
                    dit.instance.trigger("remove:" + dit.key, model, dit.related, options);
                });
            },
            handleReset: function(coll, options) {
                var dit = this;
                options = options ? _.clone(options) : {}, !options.silent && Backbone.Relational.eventQueue.add(function() {
                    dit.instance.trigger("reset:" + dit.key, dit.related, options);
                });
            },
            tryAddRelated: function(model, coll, options) {
                var item = _.contains(this.keyIds, model.id);
                item && (this.addRelated(model, options), this.keyIds = _.without(this.keyIds, model.id));
            },
            addRelated: function(model, options) {
                var dit = this;
                model.queue(function() {
                    dit.related && !dit.related.get(model) && dit.related.add(model, _.defaults({
                        parse: !1
                    }, options));
                });
            },
            removeRelated: function(model, coll, options) {
                this.related.get(model) && this.related.remove(model, options);
            }
        }), Backbone.RelationalModel = Backbone.Model.extend({
            relations: null,
            _relations: null,
            _isInitialized: !1,
            _deferProcessing: !1,
            _queue: null,
            _attributeChangeFired: !1,
            subModelTypeAttribute: "type",
            subModelTypes: null,
            constructor: function(attributes, options) {
                if (options && options.collection) {
                    var dit = this, collection = this.collection = options.collection;
                    delete options.collection, this._deferProcessing = !0;
                    var processQueue = function(model) {
                        model === dit && (dit._deferProcessing = !1, dit.processQueue(), collection.off("relational:add", processQueue));
                    };
                    collection.on("relational:add", processQueue), _.defer(function() {
                        processQueue(dit);
                    });
                }
                Backbone.Relational.store.processOrphanRelations(), Backbone.Relational.store.listenTo(this, "relational:unregister", Backbone.Relational.store.unregister), 
                this._queue = new Backbone.BlockingQueue(), this._queue.block(), Backbone.Relational.eventQueue.block();
                try {
                    Backbone.Model.apply(this, arguments);
                } finally {
                    Backbone.Relational.eventQueue.unblock();
                }
            },
            trigger: function(eventName) {
                if (eventName.length > 5 && 0 === eventName.indexOf("change")) {
                    var dit = this, args = arguments;
                    Backbone.Relational.eventQueue.isLocked() ? Backbone.Relational.eventQueue.add(function() {
                        var changed = !0;
                        if ("change" === eventName) changed = dit.hasChanged() || dit._attributeChangeFired, 
                        dit._attributeChangeFired = !1; else {
                            var attr = eventName.slice(7), rel = dit.getRelation(attr);
                            rel ? (changed = args[4] === !0, changed ? dit.changed[attr] = args[2] : rel.changed || delete dit.changed[attr]) : changed && (dit._attributeChangeFired = !0);
                        }
                        changed && Backbone.Model.prototype.trigger.apply(dit, args);
                    }) : Backbone.Model.prototype.trigger.apply(dit, args);
                } else "destroy" === eventName ? (Backbone.Model.prototype.trigger.apply(this, arguments), 
                Backbone.Relational.store.unregister(this)) : Backbone.Model.prototype.trigger.apply(this, arguments);
                return this;
            },
            initializeRelations: function(options) {
                this.acquire(), this._relations = {}, _.each(this.relations || [], function(rel) {
                    Backbone.Relational.store.initializeRelation(this, rel, options);
                }, this), this._isInitialized = !0, this.release(), this.processQueue();
            },
            updateRelations: function(changedAttrs, options) {
                this._isInitialized && !this.isLocked() && _.each(this._relations, function(rel) {
                    if (!changedAttrs || rel.keySource in changedAttrs || rel.key in changedAttrs) {
                        var value = this.attributes[rel.keySource] || this.attributes[rel.key], attr = changedAttrs && (changedAttrs[rel.keySource] || changedAttrs[rel.key]);
                        (rel.related !== value || null === value && null === attr) && this.trigger("relational:change:" + rel.key, this, value, options || {});
                    }
                    rel.keySource !== rel.key && delete this.attributes[rel.keySource];
                }, this);
            },
            queue: function(func) {
                this._queue.add(func);
            },
            processQueue: function() {
                this._isInitialized && !this._deferProcessing && this._queue.isBlocked() && this._queue.unblock();
            },
            getRelation: function(attr) {
                return this._relations[attr];
            },
            getRelations: function() {
                return _.values(this._relations);
            },
            getIdsToFetch: function(attr, refresh) {
                var rel = attr instanceof Backbone.Relation ? attr : this.getRelation(attr), ids = rel ? rel.keyIds && rel.keyIds.slice(0) || (rel.keyId || 0 === rel.keyId ? [ rel.keyId ] : []) : [];
                if (refresh) {
                    var models = rel.related && (rel.related.models || [ rel.related ]);
                    _.each(models, function(model) {
                        (model.id || 0 === model.id) && ids.push(model.id);
                    });
                }
                return ids;
            },
            getAsync: function(attr, options) {
                options = _.extend({
                    add: !0,
                    remove: !1,
                    refresh: !1
                }, options);
                var dit = this, requests = [], rel = this.getRelation(attr), idsToFetch = rel && this.getIdsToFetch(rel, options.refresh), coll = rel.related instanceof Backbone.Collection ? rel.related : rel.relatedCollection;
                if (idsToFetch && idsToFetch.length) {
                    var setUrl, models = [], createdModels = [], createModels = function() {
                        models = _.map(idsToFetch, function(id) {
                            var model = rel.relatedModel.findModel(id);
                            if (!model) {
                                var attrs = {};
                                attrs[rel.relatedModel.prototype.idAttribute] = id, model = rel.relatedModel.findOrCreate(attrs, options), 
                                createdModels.push(model);
                            }
                            return model;
                        }, this);
                    };
                    if (coll instanceof Backbone.Collection && _.isFunction(coll.url)) {
                        var defaultUrl = coll.url();
                        setUrl = coll.url(idsToFetch), setUrl === defaultUrl && (createModels(), setUrl = coll.url(models), 
                        setUrl === defaultUrl && (setUrl = null));
                    }
                    if (setUrl) {
                        var opts = _.defaults({
                            error: function() {
                                _.each(createdModels, function(model) {
                                    model.trigger("destroy", model, model.collection, options);
                                }), options.error && options.error.apply(models, arguments);
                            },
                            url: setUrl
                        }, options);
                        requests = [ coll.fetch(opts) ];
                    } else models.length || createModels(), requests = _.map(models, function(model) {
                        var opts = _.defaults({
                            error: function() {
                                _.contains(createdModels, model) && model.trigger("destroy", model, model.collection, options), 
                                options.error && options.error.apply(models, arguments);
                            }
                        }, options);
                        return model.fetch(opts);
                    }, this);
                }
                return $.when.apply(null, requests).then(function() {
                    return Backbone.Model.prototype.get.call(dit, attr);
                });
            },
            set: function(key, value, options) {
                Backbone.Relational.eventQueue.block();
                var attributes, result;
                _.isObject(key) || null == key ? (attributes = key, options = value) : (attributes = {}, 
                attributes[key] = value);
                try {
                    var id = this.id, newId = attributes && this.idAttribute in attributes && attributes[this.idAttribute];
                    Backbone.Relational.store.checkId(this, newId), result = Backbone.Model.prototype.set.apply(this, arguments), 
                    this._isInitialized || this.isLocked() ? newId && newId !== id && Backbone.Relational.store.update(this) : (this.constructor.initializeModelHierarchy(), 
                    (newId || 0 === newId) && Backbone.Relational.store.register(this), this.initializeRelations(options)), 
                    attributes && this.updateRelations(attributes, options);
                } finally {
                    Backbone.Relational.eventQueue.unblock();
                }
                return result;
            },
            clone: function() {
                var attributes = _.clone(this.attributes);
                return _.isUndefined(attributes[this.idAttribute]) || (attributes[this.idAttribute] = null), 
                _.each(this.getRelations(), function(rel) {
                    delete attributes[rel.key];
                }), new this.constructor(attributes);
            },
            toJSON: function(options) {
                if (this.isLocked()) return this.id;
                this.acquire();
                var json = Backbone.Model.prototype.toJSON.call(this, options);
                return !this.constructor._superModel || this.constructor._subModelTypeAttribute in json || (json[this.constructor._subModelTypeAttribute] = this.constructor._subModelTypeValue), 
                _.each(this._relations, function(rel) {
                    var related = json[rel.key], includeInJSON = rel.options.includeInJSON, value = null;
                    includeInJSON === !0 ? related && _.isFunction(related.toJSON) && (value = related.toJSON(options)) : _.isString(includeInJSON) ? (related instanceof Backbone.Collection ? value = related.pluck(includeInJSON) : related instanceof Backbone.Model && (value = related.get(includeInJSON)), 
                    includeInJSON === rel.relatedModel.prototype.idAttribute && (rel instanceof Backbone.HasMany ? value = value.concat(rel.keyIds) : rel instanceof Backbone.HasOne && (value = value || rel.keyId, 
                    value || _.isObject(rel.keyContents) || (value = rel.keyContents || null)))) : _.isArray(includeInJSON) ? related instanceof Backbone.Collection ? (value = [], 
                    related.each(function(model) {
                        var curJson = {};
                        _.each(includeInJSON, function(key) {
                            curJson[key] = model.get(key);
                        }), value.push(curJson);
                    })) : related instanceof Backbone.Model && (value = {}, _.each(includeInJSON, function(key) {
                        value[key] = related.get(key);
                    })) : delete json[rel.key], null === value && options && options.wait && (value = related), 
                    includeInJSON && (json[rel.keyDestination] = value), rel.keyDestination !== rel.key && delete json[rel.key];
                }), this.release(), json;
            }
        }, {
            setup: function(superModel) {
                return this.prototype.relations = (this.prototype.relations || []).slice(0), this._subModels = {}, 
                this._superModel = null, this.prototype.hasOwnProperty("subModelTypes") ? Backbone.Relational.store.addSubModels(this.prototype.subModelTypes, this) : this.prototype.subModelTypes = null, 
                _.each(this.prototype.relations || [], function(rel) {
                    if (rel.model || (rel.model = this), rel.reverseRelation && rel.model === this) {
                        var preInitialize = !0;
                        if (_.isString(rel.relatedModel)) {
                            var relatedModel = Backbone.Relational.store.getObjectByName(rel.relatedModel);
                            preInitialize = relatedModel && relatedModel.prototype instanceof Backbone.RelationalModel;
                        }
                        preInitialize ? Backbone.Relational.store.initializeRelation(null, rel) : _.isString(rel.relatedModel) && Backbone.Relational.store.addOrphanRelation(rel);
                    }
                }, this), this;
            },
            build: function(attributes, options) {
                this.initializeModelHierarchy();
                var model = this._findSubModelType(this, attributes) || this;
                return new model(attributes, options);
            },
            _findSubModelType: function(type, attributes) {
                if (type._subModels && type.prototype.subModelTypeAttribute in attributes) {
                    var subModelTypeAttribute = attributes[type.prototype.subModelTypeAttribute], subModelType = type._subModels[subModelTypeAttribute];
                    if (subModelType) return subModelType;
                    for (subModelTypeAttribute in type._subModels) if (subModelType = this._findSubModelType(type._subModels[subModelTypeAttribute], attributes)) return subModelType;
                }
                return null;
            },
            initializeModelHierarchy: function() {
                if (this.inheritRelations(), this.prototype.subModelTypes) {
                    var resolvedSubModels = _.keys(this._subModels), unresolvedSubModels = _.omit(this.prototype.subModelTypes, resolvedSubModels);
                    _.each(unresolvedSubModels, function(subModelTypeName) {
                        var subModelType = Backbone.Relational.store.getObjectByName(subModelTypeName);
                        subModelType && subModelType.initializeModelHierarchy();
                    });
                }
            },
            inheritRelations: function() {
                if (_.isUndefined(this._superModel) || _.isNull(this._superModel)) if (Backbone.Relational.store.setupSuperModel(this), 
                this._superModel) {
                    if (this._superModel.inheritRelations(), this._superModel.prototype.relations) {
                        var inheritedRelations = _.filter(this._superModel.prototype.relations || [], function(superRel) {
                            return !_.any(this.prototype.relations || [], function(rel) {
                                return superRel.relatedModel === rel.relatedModel && superRel.key === rel.key;
                            }, this);
                        }, this);
                        this.prototype.relations = inheritedRelations.concat(this.prototype.relations);
                    }
                } else this._superModel = !1;
            },
            findOrCreate: function(attributes, options) {
                options || (options = {});
                var parsedAttributes = _.isObject(attributes) && options.parse && this.prototype.parse ? this.prototype.parse(_.clone(attributes)) : attributes, model = this.findModel(parsedAttributes);
                return _.isObject(attributes) && (model && options.merge !== !1 ? (delete options.collection, 
                delete options.url, model.set(parsedAttributes, options)) : model || options.create === !1 || (model = this.build(parsedAttributes, _.defaults({
                    parse: !1
                }, options)))), model;
            },
            find: function(attributes, options) {
                return options || (options = {}), options.create = !1, this.findOrCreate(attributes, options);
            },
            findModel: function(attributes) {
                return Backbone.Relational.store.find(this, attributes);
            }
        }), _.extend(Backbone.RelationalModel.prototype, Backbone.Semaphore), Backbone.Collection.prototype.__prepareModel = Backbone.Collection.prototype._prepareModel, 
        Backbone.Collection.prototype._prepareModel = function(attrs, options) {
            var model;
            return attrs instanceof Backbone.Model ? (attrs.collection || (attrs.collection = this), 
            model = attrs) : (options = options ? _.clone(options) : {}, options.collection = this, 
            model = "undefined" != typeof this.model.findOrCreate ? this.model.findOrCreate(attrs, options) : new this.model(attrs, options), 
            model && model.validationError && (this.trigger("invalid", this, attrs, options), 
            model = !1)), model;
        };
        var set = Backbone.Collection.prototype.__set = Backbone.Collection.prototype.set;
        Backbone.Collection.prototype.set = function(models, options) {
            if (!(this.model.prototype instanceof Backbone.RelationalModel)) return set.call(this, models, options);
            options && options.parse && (models = this.parse(models, options));
            var singular = !_.isArray(models), newModels = [], toAdd = [], model = null;
            models = singular ? models ? [ models ] : [] : _.clone(models);
            for (var i = 0; i < models.length; i++) model = models[i], model instanceof Backbone.Model || (model = Backbone.Collection.prototype._prepareModel.call(this, model, options)), 
            model && (toAdd.push(model), this.get(model) || this.get(model.cid) ? null !== model.id && void 0 !== model.id && (this._byId[model.id] = model) : newModels.push(model));
            toAdd = singular ? toAdd.length ? toAdd[0] : null : toAdd;
            var result = set.call(this, toAdd, _.defaults({
                merge: !1,
                parse: !1
            }, options));
            for (i = 0; i < newModels.length; i++) model = newModels[i], (this.get(model) || this.get(model.cid)) && this.trigger("relational:add", model, this, options);
            return result;
        };
        var remove = Backbone.Collection.prototype.__remove = Backbone.Collection.prototype.remove;
        Backbone.Collection.prototype.remove = function(models, options) {
            if (!(this.model.prototype instanceof Backbone.RelationalModel)) return remove.call(this, models, options);
            var singular = !_.isArray(models), toRemove = [];
            models = singular ? models ? [ models ] : [] : _.clone(models), options || (options = {}), 
            _.each(models, function(model) {
                model = this.get(model) || model && this.get(model.cid), model && toRemove.push(model);
            }, this);
            var result = remove.call(this, singular ? toRemove.length ? toRemove[0] : null : toRemove, options);
            return _.each(toRemove, function(model) {
                this.trigger("relational:remove", model, this, options);
            }, this), result;
        };
        var reset = Backbone.Collection.prototype.__reset = Backbone.Collection.prototype.reset;
        Backbone.Collection.prototype.reset = function(models, options) {
            options = _.extend({
                merge: !0
            }, options);
            var result = reset.call(this, models, options);
            return this.model.prototype instanceof Backbone.RelationalModel && this.trigger("relational:reset", this, options), 
            result;
        };
        var sort = Backbone.Collection.prototype.__sort = Backbone.Collection.prototype.sort;
        Backbone.Collection.prototype.sort = function(options) {
            var result = sort.call(this, options);
            return this.model.prototype instanceof Backbone.RelationalModel && this.trigger("relational:reset", this, options), 
            result;
        };
        var trigger = Backbone.Collection.prototype.__trigger = Backbone.Collection.prototype.trigger;
        Backbone.Collection.prototype.trigger = function(eventName) {
            if (!(this.model.prototype instanceof Backbone.RelationalModel)) return trigger.apply(this, arguments);
            if ("add" === eventName || "remove" === eventName || "reset" === eventName || "sort" === eventName) {
                var dit = this, args = arguments;
                _.isObject(args[3]) && (args = _.toArray(args), args[3] = _.clone(args[3])), Backbone.Relational.eventQueue.add(function() {
                    trigger.apply(dit, args);
                });
            } else trigger.apply(this, arguments);
            return this;
        }, Backbone.RelationalModel.extend = function(protoProps, classProps) {
            var child = Backbone.Model.extend.call(this, protoProps, classProps);
            return child.setup(this), child;
        };
    }), function(root, factory) {
        root.Marionette = root.Mn = factory(root, root.Backbone, root._);
    }(this, function(root, Backbone, _) {
        "use strict";
        !function(Backbone, _) {
            var previousChildViewContainer = Backbone.ChildViewContainer;
            return Backbone.ChildViewContainer = function(Backbone, _) {
                var Container = function(views) {
                    this._views = {}, this._indexByModel = {}, this._indexByCustom = {}, this._updateLength(), 
                    _.each(views, this.add, this);
                };
                _.extend(Container.prototype, {
                    add: function(view, customIndex) {
                        var viewCid = view.cid;
                        return this._views[viewCid] = view, view.model && (this._indexByModel[view.model.cid] = viewCid), 
                        customIndex && (this._indexByCustom[customIndex] = viewCid), this._updateLength(), 
                        this;
                    },
                    findByModel: function(model) {
                        return this.findByModelCid(model.cid);
                    },
                    findByModelCid: function(modelCid) {
                        var viewCid = this._indexByModel[modelCid];
                        return this.findByCid(viewCid);
                    },
                    findByCustom: function(index) {
                        var viewCid = this._indexByCustom[index];
                        return this.findByCid(viewCid);
                    },
                    findByIndex: function(index) {
                        return _.values(this._views)[index];
                    },
                    findByCid: function(cid) {
                        return this._views[cid];
                    },
                    remove: function(view) {
                        var viewCid = view.cid;
                        return view.model && delete this._indexByModel[view.model.cid], _.any(this._indexByCustom, function(cid, key) {
                            return cid === viewCid ? (delete this._indexByCustom[key], !0) : void 0;
                        }, this), delete this._views[viewCid], this._updateLength(), this;
                    },
                    call: function(method) {
                        this.apply(method, _.tail(arguments));
                    },
                    apply: function(method, args) {
                        _.each(this._views, function(view) {
                            _.isFunction(view[method]) && view[method].apply(view, args || []);
                        });
                    },
                    _updateLength: function() {
                        this.length = _.size(this._views);
                    }
                });
                var methods = [ "forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck", "reduce" ];
                return _.each(methods, function(method) {
                    Container.prototype[method] = function() {
                        var views = _.values(this._views), args = [ views ].concat(_.toArray(arguments));
                        return _[method].apply(_, args);
                    };
                }), Container;
            }(Backbone, _), Backbone.ChildViewContainer.VERSION = "0.1.6", Backbone.ChildViewContainer.noConflict = function() {
                return Backbone.ChildViewContainer = previousChildViewContainer, this;
            }, Backbone.ChildViewContainer;
        }(Backbone, _), function(Backbone, _) {
            var previousWreqr = Backbone.Wreqr, Wreqr = Backbone.Wreqr = {};
            return Backbone.Wreqr.VERSION = "1.3.1", Backbone.Wreqr.noConflict = function() {
                return Backbone.Wreqr = previousWreqr, this;
            }, Wreqr.Handlers = function(Backbone, _) {
                var Handlers = function(options) {
                    this.options = options, this._wreqrHandlers = {}, _.isFunction(this.initialize) && this.initialize(options);
                };
                return Handlers.extend = Backbone.Model.extend, _.extend(Handlers.prototype, Backbone.Events, {
                    setHandlers: function(handlers) {
                        _.each(handlers, function(handler, name) {
                            var context = null;
                            _.isObject(handler) && !_.isFunction(handler) && (context = handler.context, handler = handler.callback), 
                            this.setHandler(name, handler, context);
                        }, this);
                    },
                    setHandler: function(name, handler, context) {
                        var config = {
                            callback: handler,
                            context: context
                        };
                        this._wreqrHandlers[name] = config, this.trigger("handler:add", name, handler, context);
                    },
                    hasHandler: function(name) {
                        return !!this._wreqrHandlers[name];
                    },
                    getHandler: function(name) {
                        var config = this._wreqrHandlers[name];
                        if (config) return function() {
                            var args = Array.prototype.slice.apply(arguments);
                            return config.callback.apply(config.context, args);
                        };
                    },
                    removeHandler: function(name) {
                        delete this._wreqrHandlers[name];
                    },
                    removeAllHandlers: function() {
                        this._wreqrHandlers = {};
                    }
                }), Handlers;
            }(Backbone, _), Wreqr.CommandStorage = function() {
                var CommandStorage = function(options) {
                    this.options = options, this._commands = {}, _.isFunction(this.initialize) && this.initialize(options);
                };
                return _.extend(CommandStorage.prototype, Backbone.Events, {
                    getCommands: function(commandName) {
                        var commands = this._commands[commandName];
                        return commands || (commands = {
                            command: commandName,
                            instances: []
                        }, this._commands[commandName] = commands), commands;
                    },
                    addCommand: function(commandName, args) {
                        var command = this.getCommands(commandName);
                        command.instances.push(args);
                    },
                    clearCommands: function(commandName) {
                        var command = this.getCommands(commandName);
                        command.instances = [];
                    }
                }), CommandStorage;
            }(), Wreqr.Commands = function(Wreqr) {
                return Wreqr.Handlers.extend({
                    storageType: Wreqr.CommandStorage,
                    constructor: function(options) {
                        this.options = options || {}, this._initializeStorage(this.options), this.on("handler:add", this._executeCommands, this);
                        var args = Array.prototype.slice.call(arguments);
                        Wreqr.Handlers.prototype.constructor.apply(this, args);
                    },
                    execute: function(name, args) {
                        name = arguments[0], args = Array.prototype.slice.call(arguments, 1), this.hasHandler(name) ? this.getHandler(name).apply(this, args) : this.storage.addCommand(name, args);
                    },
                    _executeCommands: function(name, handler, context) {
                        var command = this.storage.getCommands(name);
                        _.each(command.instances, function(args) {
                            handler.apply(context, args);
                        }), this.storage.clearCommands(name);
                    },
                    _initializeStorage: function(options) {
                        var storage, StorageType = options.storageType || this.storageType;
                        storage = _.isFunction(StorageType) ? new StorageType() : StorageType, this.storage = storage;
                    }
                });
            }(Wreqr), Wreqr.RequestResponse = function(Wreqr) {
                return Wreqr.Handlers.extend({
                    request: function() {
                        var name = arguments[0], args = Array.prototype.slice.call(arguments, 1);
                        return this.hasHandler(name) ? this.getHandler(name).apply(this, args) : void 0;
                    }
                });
            }(Wreqr), Wreqr.EventAggregator = function(Backbone, _) {
                var EA = function() {};
                return EA.extend = Backbone.Model.extend, _.extend(EA.prototype, Backbone.Events), 
                EA;
            }(Backbone, _), Wreqr.Channel = function(Wreqr) {
                var Channel = function(channelName) {
                    this.vent = new Backbone.Wreqr.EventAggregator(), this.reqres = new Backbone.Wreqr.RequestResponse(), 
                    this.commands = new Backbone.Wreqr.Commands(), this.channelName = channelName;
                };
                return _.extend(Channel.prototype, {
                    reset: function() {
                        return this.vent.off(), this.vent.stopListening(), this.reqres.removeAllHandlers(), 
                        this.commands.removeAllHandlers(), this;
                    },
                    connectEvents: function(hash, context) {
                        return this._connect("vent", hash, context), this;
                    },
                    connectCommands: function(hash, context) {
                        return this._connect("commands", hash, context), this;
                    },
                    connectRequests: function(hash, context) {
                        return this._connect("reqres", hash, context), this;
                    },
                    _connect: function(type, hash, context) {
                        if (hash) {
                            context = context || this;
                            var method = "vent" === type ? "on" : "setHandler";
                            _.each(hash, function(fn, eventName) {
                                this[type][method](eventName, _.bind(fn, context));
                            }, this);
                        }
                    }
                }), Channel;
            }(Wreqr), Wreqr.radio = function(Wreqr) {
                var Radio = function() {
                    this._channels = {}, this.vent = {}, this.commands = {}, this.reqres = {}, this._proxyMethods();
                };
                _.extend(Radio.prototype, {
                    channel: function(channelName) {
                        if (!channelName) throw new Error("Channel must receive a name");
                        return this._getChannel(channelName);
                    },
                    _getChannel: function(channelName) {
                        var channel = this._channels[channelName];
                        return channel || (channel = new Wreqr.Channel(channelName), this._channels[channelName] = channel), 
                        channel;
                    },
                    _proxyMethods: function() {
                        _.each([ "vent", "commands", "reqres" ], function(system) {
                            _.each(messageSystems[system], function(method) {
                                this[system][method] = proxyMethod(this, system, method);
                            }, this);
                        }, this);
                    }
                });
                var messageSystems = {
                    vent: [ "on", "off", "trigger", "once", "stopListening", "listenTo", "listenToOnce" ],
                    commands: [ "execute", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers" ],
                    reqres: [ "request", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers" ]
                }, proxyMethod = function(radio, system, method) {
                    return function(channelName) {
                        var messageSystem = radio._getChannel(channelName)[system], args = Array.prototype.slice.call(arguments, 1);
                        return messageSystem[method].apply(messageSystem, args);
                    };
                };
                return new Radio();
            }(Wreqr), Backbone.Wreqr;
        }(Backbone, _);
        var previousMarionette = root.Marionette, previousMn = root.Mn, Marionette = Backbone.Marionette = {};
        Marionette.VERSION = "2.4.1", Marionette.noConflict = function() {
            return root.Marionette = previousMarionette, root.Mn = previousMn, this;
        }, Backbone.Marionette = Marionette, Marionette.Deferred = Backbone.$.Deferred, 
        Marionette.extend = Backbone.Model.extend, Marionette.isNodeAttached = function(el) {
            return Backbone.$.contains(document.documentElement, el);
        }, Marionette.mergeOptions = function(options, keys) {
            options && _.extend(this, _.pick(options, keys));
        }, Marionette.getOption = function(target, optionName) {
            return target && optionName ? target.options && void 0 !== target.options[optionName] ? target.options[optionName] : target[optionName] : void 0;
        }, Marionette.proxyGetOption = function(optionName) {
            return Marionette.getOption(this, optionName);
        }, Marionette._getValue = function(value, context, params) {
            return _.isFunction(value) && (value = params ? value.apply(context, params) : value.call(context)), 
            value;
        }, Marionette.normalizeMethods = function(hash) {
            return _.reduce(hash, function(normalizedHash, method, name) {
                return _.isFunction(method) || (method = this[method]), method && (normalizedHash[name] = method), 
                normalizedHash;
            }, {}, this);
        }, Marionette.normalizeUIString = function(uiString, ui) {
            return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
                return ui[r.slice(4)];
            });
        }, Marionette.normalizeUIKeys = function(hash, ui) {
            return _.reduce(hash, function(memo, val, key) {
                var normalizedKey = Marionette.normalizeUIString(key, ui);
                return memo[normalizedKey] = val, memo;
            }, {});
        }, Marionette.normalizeUIValues = function(hash, ui, properties) {
            return _.each(hash, function(val, key) {
                _.isString(val) ? hash[key] = Marionette.normalizeUIString(val, ui) : _.isObject(val) && _.isArray(properties) && (_.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui)), 
                _.each(properties, function(property) {
                    var propertyVal = val[property];
                    _.isString(propertyVal) && (val[property] = Marionette.normalizeUIString(propertyVal, ui));
                }));
            }), hash;
        }, Marionette.actAsCollection = function(object, listProperty) {
            var methods = [ "forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck" ];
            _.each(methods, function(method) {
                object[method] = function() {
                    var list = _.values(_.result(this, listProperty)), args = [ list ].concat(_.toArray(arguments));
                    return _[method].apply(_, args);
                };
            });
        };
        var deprecate = Marionette.deprecate = function(message, test) {
            _.isObject(message) && (message = message.prev + " is going to be removed in the future. Please use " + message.next + " instead." + (message.url ? " See: " + message.url : "")), 
            void 0 !== test && test || deprecate._cache[message] || (deprecate._warn("Deprecation warning: " + message), 
            deprecate._cache[message] = !0);
        };
        deprecate._warn = "undefined" != typeof console && (console.warn || console.log) || function() {}, 
        deprecate._cache = {}, Marionette._triggerMethod = function() {
            function getEventName(match, prefix, eventName) {
                return eventName.toUpperCase();
            }
            var splitter = /(^|:)(\w)/gi;
            return function(context, event, args) {
                var noEventArg = arguments.length < 3;
                noEventArg && (args = event, event = args[0]);
                var result, methodName = "on" + event.replace(splitter, getEventName), method = context[methodName];
                return _.isFunction(method) && (result = method.apply(context, noEventArg ? _.rest(args) : args)), 
                _.isFunction(context.trigger) && (noEventArg + args.length > 1 ? context.trigger.apply(context, noEventArg ? args : [ event ].concat(_.drop(args, 0))) : context.trigger(event)), 
                result;
            };
        }(), Marionette.triggerMethod = function(event) {
            return Marionette._triggerMethod(this, arguments);
        }, Marionette.triggerMethodOn = function(context) {
            var fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : Marionette.triggerMethod;
            return fnc.apply(context, _.rest(arguments));
        }, Marionette.MonitorDOMRefresh = function(view) {
            function handleShow() {
                view._isShown = !0, triggerDOMRefresh();
            }
            function handleRender() {
                view._isRendered = !0, triggerDOMRefresh();
            }
            function triggerDOMRefresh() {
                view._isShown && view._isRendered && Marionette.isNodeAttached(view.el) && _.isFunction(view.triggerMethod) && view.triggerMethod("dom:refresh");
            }
            view.on({
                show: handleShow,
                render: handleRender
            });
        }, function(Marionette) {
            function bindFromStrings(target, entity, evt, methods) {
                var methodNames = methods.split(/\s+/);
                _.each(methodNames, function(methodName) {
                    var method = target[methodName];
                    if (!method) throw new Marionette.Error('Method "' + methodName + '" was configured as an event handler, but does not exist.');
                    target.listenTo(entity, evt, method);
                });
            }
            function bindToFunction(target, entity, evt, method) {
                target.listenTo(entity, evt, method);
            }
            function unbindFromStrings(target, entity, evt, methods) {
                var methodNames = methods.split(/\s+/);
                _.each(methodNames, function(methodName) {
                    var method = target[methodName];
                    target.stopListening(entity, evt, method);
                });
            }
            function unbindToFunction(target, entity, evt, method) {
                target.stopListening(entity, evt, method);
            }
            function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
                if (entity && bindings) {
                    if (!_.isObject(bindings)) throw new Marionette.Error({
                        message: "Bindings must be an object or function.",
                        url: "marionette.functions.html#marionettebindentityevents"
                    });
                    bindings = Marionette._getValue(bindings, target), _.each(bindings, function(methods, evt) {
                        _.isFunction(methods) ? functionCallback(target, entity, evt, methods) : stringCallback(target, entity, evt, methods);
                    });
                }
            }
            Marionette.bindEntityEvents = function(target, entity, bindings) {
                iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
            }, Marionette.unbindEntityEvents = function(target, entity, bindings) {
                iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
            }, Marionette.proxyBindEntityEvents = function(entity, bindings) {
                return Marionette.bindEntityEvents(this, entity, bindings);
            }, Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
                return Marionette.unbindEntityEvents(this, entity, bindings);
            };
        }(Marionette);
        var errorProps = [ "description", "fileName", "lineNumber", "name", "message", "number" ];
        return Marionette.Error = Marionette.extend.call(Error, {
            urlRoot: "http://marionettejs.com/docs/v" + Marionette.VERSION + "/",
            constructor: function(message, options) {
                _.isObject(message) ? (options = message, message = options.message) : options || (options = {});
                var error = Error.call(this, message);
                _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps)), this.captureStackTrace(), 
                options.url && (this.url = this.urlRoot + options.url);
            },
            captureStackTrace: function() {
                Error.captureStackTrace && Error.captureStackTrace(this, Marionette.Error);
            },
            toString: function() {
                return this.name + ": " + this.message + (this.url ? " See: " + this.url : "");
            }
        }), Marionette.Error.extend = Marionette.extend, Marionette.Callbacks = function() {
            this._deferred = Marionette.Deferred(), this._callbacks = [];
        }, _.extend(Marionette.Callbacks.prototype, {
            add: function(callback, contextOverride) {
                var promise = _.result(this._deferred, "promise");
                this._callbacks.push({
                    cb: callback,
                    ctx: contextOverride
                }), promise.then(function(args) {
                    contextOverride && (args.context = contextOverride), callback.call(args.context, args.options);
                });
            },
            run: function(options, context) {
                this._deferred.resolve({
                    options: options,
                    context: context
                });
            },
            reset: function() {
                var callbacks = this._callbacks;
                this._deferred = Marionette.Deferred(), this._callbacks = [], _.each(callbacks, function(cb) {
                    this.add(cb.cb, cb.ctx);
                }, this);
            }
        }), Marionette.Controller = function(options) {
            this.options = options || {}, _.isFunction(this.initialize) && this.initialize(this.options);
        }, Marionette.Controller.extend = Marionette.extend, _.extend(Marionette.Controller.prototype, Backbone.Events, {
            destroy: function() {
                return Marionette._triggerMethod(this, "before:destroy", arguments), Marionette._triggerMethod(this, "destroy", arguments), 
                this.stopListening(), this.off(), this;
            },
            triggerMethod: Marionette.triggerMethod,
            mergeOptions: Marionette.mergeOptions,
            getOption: Marionette.proxyGetOption
        }), Marionette.Object = function(options) {
            this.options = _.extend({}, _.result(this, "options"), options), this.initialize.apply(this, arguments);
        }, Marionette.Object.extend = Marionette.extend, _.extend(Marionette.Object.prototype, Backbone.Events, {
            initialize: function() {},
            destroy: function() {
                return this.triggerMethod("before:destroy"), this.triggerMethod("destroy"), this.stopListening(), 
                this;
            },
            triggerMethod: Marionette.triggerMethod,
            mergeOptions: Marionette.mergeOptions,
            getOption: Marionette.proxyGetOption,
            bindEntityEvents: Marionette.proxyBindEntityEvents,
            unbindEntityEvents: Marionette.proxyUnbindEntityEvents
        }), Marionette.Region = Marionette.Object.extend({
            constructor: function(options) {
                if (this.options = options || {}, this.el = this.getOption("el"), this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el, 
                !this.el) throw new Marionette.Error({
                    name: "NoElError",
                    message: 'An "el" must be specified for a region.'
                });
                this.$el = this.getEl(this.el), Marionette.Object.call(this, options);
            },
            show: function(view, options) {
                if (this._ensureElement()) {
                    this._ensureViewIsIntact(view);
                    var showOptions = options || {}, isDifferentView = view !== this.currentView, preventDestroy = !!showOptions.preventDestroy, forceShow = !!showOptions.forceShow, isChangingView = !!this.currentView, _shouldDestroyView = isDifferentView && !preventDestroy, _shouldShowView = isDifferentView || forceShow;
                    if (isChangingView && this.triggerMethod("before:swapOut", this.currentView, this, options), 
                    this.currentView && delete this.currentView._parent, _shouldDestroyView ? this.empty() : isChangingView && _shouldShowView && this.currentView.off("destroy", this.empty, this), 
                    _shouldShowView) {
                        view.once("destroy", this.empty, this), view.render(), view._parent = this, isChangingView && this.triggerMethod("before:swap", view, this, options), 
                        this.triggerMethod("before:show", view, this, options), Marionette.triggerMethodOn(view, "before:show", view, this, options), 
                        isChangingView && this.triggerMethod("swapOut", this.currentView, this, options);
                        var attachedRegion = Marionette.isNodeAttached(this.el), displayedViews = [], triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach, triggerAttach = showOptions.triggerAttach || this.triggerAttach;
                        return attachedRegion && triggerBeforeAttach && (displayedViews = this._displayedViews(view), 
                        this._triggerAttach(displayedViews, "before:")), this.attachHtml(view), this.currentView = view, 
                        attachedRegion && triggerAttach && (displayedViews = this._displayedViews(view), 
                        this._triggerAttach(displayedViews)), isChangingView && this.triggerMethod("swap", view, this, options), 
                        this.triggerMethod("show", view, this, options), Marionette.triggerMethodOn(view, "show", view, this, options), 
                        this;
                    }
                    return this;
                }
            },
            triggerBeforeAttach: !0,
            triggerAttach: !0,
            _triggerAttach: function(views, prefix) {
                var eventName = (prefix || "") + "attach";
                _.each(views, function(view) {
                    Marionette.triggerMethodOn(view, eventName, view, this);
                }, this);
            },
            _displayedViews: function(view) {
                return _.union([ view ], _.result(view, "_getNestedViews") || []);
            },
            _ensureElement: function() {
                if (_.isObject(this.el) || (this.$el = this.getEl(this.el), this.el = this.$el[0]), 
                !this.$el || 0 === this.$el.length) {
                    if (this.getOption("allowMissingEl")) return !1;
                    throw new Marionette.Error('An "el" ' + this.$el.selector + " must exist in DOM");
                }
                return !0;
            },
            _ensureViewIsIntact: function(view) {
                if (!view) throw new Marionette.Error({
                    name: "ViewNotValid",
                    message: "The view passed is undefined and therefore invalid. You must pass a view instance to show."
                });
                if (view.isDestroyed) throw new Marionette.Error({
                    name: "ViewDestroyedError",
                    message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
                });
            },
            getEl: function(el) {
                return Backbone.$(el, Marionette._getValue(this.options.parentEl, this));
            },
            attachHtml: function(view) {
                this.$el.contents().detach(), this.el.appendChild(view.el);
            },
            empty: function(options) {
                var view = this.currentView, preventDestroy = Marionette._getValue(options, "preventDestroy", this);
                return view ? (view.off("destroy", this.empty, this), this.triggerMethod("before:empty", view), 
                preventDestroy || this._destroyView(), this.triggerMethod("empty", view), delete this.currentView, 
                preventDestroy && this.$el.contents().detach(), this) : void 0;
            },
            _destroyView: function() {
                var view = this.currentView;
                view.destroy && !view.isDestroyed ? view.destroy() : view.remove && (view.remove(), 
                view.isDestroyed = !0);
            },
            attachView: function(view) {
                return this.currentView = view, this;
            },
            hasView: function() {
                return !!this.currentView;
            },
            reset: function() {
                return this.empty(), this.$el && (this.el = this.$el.selector), delete this.$el, 
                this;
            }
        }, {
            buildRegion: function(regionConfig, DefaultRegionClass) {
                if (_.isString(regionConfig)) return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
                if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
                if (_.isFunction(regionConfig)) return this._buildRegionFromRegionClass(regionConfig);
                throw new Marionette.Error({
                    message: "Improper region configuration type.",
                    url: "marionette.region.html#region-configuration-types"
                });
            },
            _buildRegionFromSelector: function(selector, DefaultRegionClass) {
                return new DefaultRegionClass({
                    el: selector
                });
            },
            _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
                var RegionClass = regionConfig.regionClass || DefaultRegionClass, options = _.omit(regionConfig, "selector", "regionClass");
                return regionConfig.selector && !options.el && (options.el = regionConfig.selector), 
                new RegionClass(options);
            },
            _buildRegionFromRegionClass: function(RegionClass) {
                return new RegionClass();
            }
        }), Marionette.RegionManager = Marionette.Controller.extend({
            constructor: function(options) {
                this._regions = {}, this.length = 0, Marionette.Controller.call(this, options), 
                this.addRegions(this.getOption("regions"));
            },
            addRegions: function(regionDefinitions, defaults) {
                return regionDefinitions = Marionette._getValue(regionDefinitions, this, arguments), 
                _.reduce(regionDefinitions, function(regions, definition, name) {
                    return _.isString(definition) && (definition = {
                        selector: definition
                    }), definition.selector && (definition = _.defaults({}, definition, defaults)), 
                    regions[name] = this.addRegion(name, definition), regions;
                }, {}, this);
            },
            addRegion: function(name, definition) {
                var region;
                return region = definition instanceof Marionette.Region ? definition : Marionette.Region.buildRegion(definition, Marionette.Region), 
                this.triggerMethod("before:add:region", name, region), region._parent = this, this._store(name, region), 
                this.triggerMethod("add:region", name, region), region;
            },
            get: function(name) {
                return this._regions[name];
            },
            getRegions: function() {
                return _.clone(this._regions);
            },
            removeRegion: function(name) {
                var region = this._regions[name];
                return this._remove(name, region), region;
            },
            removeRegions: function() {
                var regions = this.getRegions();
                return _.each(this._regions, function(region, name) {
                    this._remove(name, region);
                }, this), regions;
            },
            emptyRegions: function() {
                var regions = this.getRegions();
                return _.invoke(regions, "empty"), regions;
            },
            destroy: function() {
                return this.removeRegions(), Marionette.Controller.prototype.destroy.apply(this, arguments);
            },
            _store: function(name, region) {
                this._regions[name] || this.length++, this._regions[name] = region;
            },
            _remove: function(name, region) {
                this.triggerMethod("before:remove:region", name, region), region.empty(), region.stopListening(), 
                delete region._parent, delete this._regions[name], this.length--, this.triggerMethod("remove:region", name, region);
            }
        }), Marionette.actAsCollection(Marionette.RegionManager.prototype, "_regions"), 
        Marionette.TemplateCache = function(templateId) {
            this.templateId = templateId;
        }, _.extend(Marionette.TemplateCache, {
            templateCaches: {},
            get: function(templateId, options) {
                var cachedTemplate = this.templateCaches[templateId];
                return cachedTemplate || (cachedTemplate = new Marionette.TemplateCache(templateId), 
                this.templateCaches[templateId] = cachedTemplate), cachedTemplate.load(options);
            },
            clear: function() {
                var i, args = _.toArray(arguments), length = args.length;
                if (length > 0) for (i = 0; length > i; i++) delete this.templateCaches[args[i]]; else this.templateCaches = {};
            }
        }), _.extend(Marionette.TemplateCache.prototype, {
            load: function(options) {
                if (this.compiledTemplate) return this.compiledTemplate;
                var template = this.loadTemplate(this.templateId, options);
                return this.compiledTemplate = this.compileTemplate(template, options), this.compiledTemplate;
            },
            loadTemplate: function(templateId, options) {
                var template = Backbone.$(templateId).html();
                if (!template || 0 === template.length) throw new Marionette.Error({
                    name: "NoTemplateError",
                    message: 'Could not find template: "' + templateId + '"'
                });
                return template;
            },
            compileTemplate: function(rawTemplate, options) {
                return _.template(rawTemplate, options);
            }
        }), Marionette.Renderer = {
            render: function(template, data) {
                if (!template) throw new Marionette.Error({
                    name: "TemplateNotFoundError",
                    message: "Cannot render the template since its false, null or undefined."
                });
                var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template);
                return templateFunc(data);
            }
        }, Marionette.View = Backbone.View.extend({
            isDestroyed: !1,
            constructor: function(options) {
                _.bindAll(this, "render"), options = Marionette._getValue(options, this), this.options = _.extend({}, _.result(this, "options"), options), 
                this._behaviors = Marionette.Behaviors(this), Backbone.View.call(this, this.options), 
                Marionette.MonitorDOMRefresh(this);
            },
            getTemplate: function() {
                return this.getOption("template");
            },
            serializeModel: function(model) {
                return model.toJSON.apply(model, _.rest(arguments));
            },
            mixinTemplateHelpers: function(target) {
                target = target || {};
                var templateHelpers = this.getOption("templateHelpers");
                return templateHelpers = Marionette._getValue(templateHelpers, this), _.extend(target, templateHelpers);
            },
            normalizeUIKeys: function(hash) {
                var uiBindings = _.result(this, "_uiBindings");
                return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, "ui"));
            },
            normalizeUIValues: function(hash, properties) {
                var ui = _.result(this, "ui"), uiBindings = _.result(this, "_uiBindings");
                return Marionette.normalizeUIValues(hash, uiBindings || ui, properties);
            },
            configureTriggers: function() {
                if (this.triggers) {
                    var triggers = this.normalizeUIKeys(_.result(this, "triggers"));
                    return _.reduce(triggers, function(events, value, key) {
                        return events[key] = this._buildViewTrigger(value), events;
                    }, {}, this);
                }
            },
            delegateEvents: function(events) {
                return this._delegateDOMEvents(events), this.bindEntityEvents(this.model, this.getOption("modelEvents")), 
                this.bindEntityEvents(this.collection, this.getOption("collectionEvents")), _.each(this._behaviors, function(behavior) {
                    behavior.bindEntityEvents(this.model, behavior.getOption("modelEvents")), behavior.bindEntityEvents(this.collection, behavior.getOption("collectionEvents"));
                }, this), this;
            },
            _delegateDOMEvents: function(eventsArg) {
                var events = Marionette._getValue(eventsArg || this.events, this);
                events = this.normalizeUIKeys(events), _.isUndefined(eventsArg) && (this.events = events);
                var combinedEvents = {}, behaviorEvents = _.result(this, "behaviorEvents") || {}, triggers = this.configureTriggers(), behaviorTriggers = _.result(this, "behaviorTriggers") || {};
                _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers), Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
            },
            undelegateEvents: function() {
                return Backbone.View.prototype.undelegateEvents.apply(this, arguments), this.unbindEntityEvents(this.model, this.getOption("modelEvents")), 
                this.unbindEntityEvents(this.collection, this.getOption("collectionEvents")), _.each(this._behaviors, function(behavior) {
                    behavior.unbindEntityEvents(this.model, behavior.getOption("modelEvents")), behavior.unbindEntityEvents(this.collection, behavior.getOption("collectionEvents"));
                }, this), this;
            },
            _ensureViewIsIntact: function() {
                if (this.isDestroyed) throw new Marionette.Error({
                    name: "ViewDestroyedError",
                    message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
                });
            },
            destroy: function() {
                if (this.isDestroyed) return this;
                var args = _.toArray(arguments);
                return this.triggerMethod.apply(this, [ "before:destroy" ].concat(args)), this.isDestroyed = !0, 
                this.triggerMethod.apply(this, [ "destroy" ].concat(args)), this.unbindUIElements(), 
                this.isRendered = !1, this.remove(), _.invoke(this._behaviors, "destroy", args), 
                this;
            },
            bindUIElements: function() {
                this._bindUIElements(), _.invoke(this._behaviors, this._bindUIElements);
            },
            _bindUIElements: function() {
                if (this.ui) {
                    this._uiBindings || (this._uiBindings = this.ui);
                    var bindings = _.result(this, "_uiBindings");
                    this.ui = {}, _.each(bindings, function(selector, key) {
                        this.ui[key] = this.$(selector);
                    }, this);
                }
            },
            unbindUIElements: function() {
                this._unbindUIElements(), _.invoke(this._behaviors, this._unbindUIElements);
            },
            _unbindUIElements: function() {
                this.ui && this._uiBindings && (_.each(this.ui, function($el, name) {
                    delete this.ui[name];
                }, this), this.ui = this._uiBindings, delete this._uiBindings);
            },
            _buildViewTrigger: function(triggerDef) {
                var hasOptions = _.isObject(triggerDef), options = _.defaults({}, hasOptions ? triggerDef : {}, {
                    preventDefault: !0,
                    stopPropagation: !0
                }), eventName = hasOptions ? options.event : triggerDef;
                return function(e) {
                    e && (e.preventDefault && options.preventDefault && e.preventDefault(), e.stopPropagation && options.stopPropagation && e.stopPropagation());
                    var args = {
                        view: this,
                        model: this.model,
                        collection: this.collection
                    };
                    this.triggerMethod(eventName, args);
                };
            },
            setElement: function() {
                var ret = Backbone.View.prototype.setElement.apply(this, arguments);
                return _.invoke(this._behaviors, "proxyViewProperties", this), ret;
            },
            triggerMethod: function() {
                var ret = Marionette._triggerMethod(this, arguments);
                return this._triggerEventOnBehaviors(arguments), this._triggerEventOnParentLayout(arguments[0], _.rest(arguments)), 
                ret;
            },
            _triggerEventOnBehaviors: function(args) {
                for (var triggerMethod = Marionette._triggerMethod, behaviors = this._behaviors, i = 0, length = behaviors && behaviors.length; length > i; i++) triggerMethod(behaviors[i], args);
            },
            _triggerEventOnParentLayout: function(eventName, args) {
                var layoutView = this._parentLayoutView();
                if (layoutView) {
                    var eventPrefix = Marionette.getOption(layoutView, "childViewEventPrefix"), prefixedEventName = eventPrefix + ":" + eventName;
                    Marionette._triggerMethod(layoutView, [ prefixedEventName, this ].concat(args));
                    var childEvents = Marionette.getOption(layoutView, "childEvents"), normalizedChildEvents = layoutView.normalizeMethods(childEvents);
                    normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName]) && normalizedChildEvents[eventName].apply(layoutView, [ this ].concat(args));
                }
            },
            _getImmediateChildren: function() {
                return [];
            },
            _getNestedViews: function() {
                var children = this._getImmediateChildren();
                return children.length ? _.reduce(children, function(memo, view) {
                    return view._getNestedViews ? memo.concat(view._getNestedViews()) : memo;
                }, children) : children;
            },
            _getAncestors: function() {
                for (var ancestors = [], parent = this._parent; parent; ) ancestors.push(parent), 
                parent = parent._parent;
                return ancestors;
            },
            _parentLayoutView: function() {
                var ancestors = this._getAncestors();
                return _.find(ancestors, function(parent) {
                    return parent instanceof Marionette.LayoutView;
                });
            },
            normalizeMethods: Marionette.normalizeMethods,
            mergeOptions: Marionette.mergeOptions,
            getOption: Marionette.proxyGetOption,
            bindEntityEvents: Marionette.proxyBindEntityEvents,
            unbindEntityEvents: Marionette.proxyUnbindEntityEvents
        }), Marionette.ItemView = Marionette.View.extend({
            constructor: function() {
                Marionette.View.apply(this, arguments);
            },
            serializeData: function() {
                if (!this.model && !this.collection) return {};
                var args = [ this.model || this.collection ];
                return arguments.length && args.push.apply(args, arguments), this.model ? this.serializeModel.apply(this, args) : {
                    items: this.serializeCollection.apply(this, args)
                };
            },
            serializeCollection: function(collection) {
                return collection.toJSON.apply(collection, _.rest(arguments));
            },
            render: function() {
                return this._ensureViewIsIntact(), this.triggerMethod("before:render", this), this._renderTemplate(), 
                this.isRendered = !0, this.bindUIElements(), this.triggerMethod("render", this), 
                this;
            },
            _renderTemplate: function() {
                var template = this.getTemplate();
                if (template !== !1) {
                    if (!template) throw new Marionette.Error({
                        name: "UndefinedTemplateError",
                        message: "Cannot render the template since it is null or undefined."
                    });
                    var data = this.mixinTemplateHelpers(this.serializeData()), html = Marionette.Renderer.render(template, data, this);
                    return this.attachElContent(html), this;
                }
            },
            attachElContent: function(html) {
                return this.$el.html(html), this;
            }
        }), Marionette.CollectionView = Marionette.View.extend({
            childViewEventPrefix: "childview",
            sort: !0,
            constructor: function(options) {
                this.once("render", this._initialEvents), this._initChildViewStorage(), Marionette.View.apply(this, arguments), 
                this.on("show", this._onShowCalled), this.initRenderBuffer();
            },
            initRenderBuffer: function() {
                this._bufferedChildren = [];
            },
            startBuffering: function() {
                this.initRenderBuffer(), this.isBuffering = !0;
            },
            endBuffering: function() {
                this.isBuffering = !1, this._triggerBeforeShowBufferedChildren(), this.attachBuffer(this), 
                this._triggerShowBufferedChildren(), this.initRenderBuffer();
            },
            _triggerBeforeShowBufferedChildren: function() {
                this._isShown && _.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, "before:show"));
            },
            _triggerShowBufferedChildren: function() {
                this._isShown && (_.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, "show")), 
                this._bufferedChildren = []);
            },
            _triggerMethodOnChild: function(event, childView) {
                Marionette.triggerMethodOn(childView, event);
            },
            _initialEvents: function() {
                this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd), 
                this.listenTo(this.collection, "remove", this._onCollectionRemove), this.listenTo(this.collection, "reset", this.render), 
                this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews));
            },
            _onCollectionAdd: function(child, collection, opts) {
                var index;
                if (index = void 0 !== opts.at ? opts.at : _.indexOf(this._filteredSortedModels(), child), 
                this._shouldAddChild(child, index)) {
                    this.destroyEmptyView();
                    var ChildView = this.getChildView(child);
                    this.addChild(child, ChildView, index);
                }
            },
            _onCollectionRemove: function(model) {
                var view = this.children.findByModel(model);
                this.removeChildView(view), this.checkEmpty();
            },
            _onShowCalled: function() {
                this.children.each(_.partial(this._triggerMethodOnChild, "show"));
            },
            render: function() {
                return this._ensureViewIsIntact(), this.triggerMethod("before:render", this), this._renderChildren(), 
                this.isRendered = !0, this.triggerMethod("render", this), this;
            },
            reorder: function() {
                var children = this.children, models = this._filteredSortedModels(), modelsChanged = _.find(models, function(model) {
                    return !children.findByModel(model);
                });
                if (modelsChanged) this.render(); else {
                    var els = _.map(models, function(model) {
                        return children.findByModel(model).el;
                    });
                    this.triggerMethod("before:reorder"), this._appendReorderedChildren(els), this.triggerMethod("reorder");
                }
            },
            resortView: function() {
                Marionette.getOption(this, "reorderOnSort") ? this.reorder() : this.render();
            },
            _sortViews: function() {
                var models = this._filteredSortedModels(), orderChanged = _.find(models, function(item, index) {
                    var view = this.children.findByModel(item);
                    return !view || view._index !== index;
                }, this);
                orderChanged && this.resortView();
            },
            _emptyViewIndex: -1,
            _appendReorderedChildren: function(children) {
                this.$el.append(children);
            },
            _renderChildren: function() {
                this.destroyEmptyView(), this.destroyChildren(), this.isEmpty(this.collection) ? this.showEmptyView() : (this.triggerMethod("before:render:collection", this), 
                this.startBuffering(), this.showCollection(), this.endBuffering(), this.triggerMethod("render:collection", this), 
                this.children.isEmpty() && this.showEmptyView());
            },
            showCollection: function() {
                var ChildView, models = this._filteredSortedModels();
                _.each(models, function(child, index) {
                    ChildView = this.getChildView(child), this.addChild(child, ChildView, index);
                }, this);
            },
            _filteredSortedModels: function() {
                var models, viewComparator = this.getViewComparator();
                return models = viewComparator ? _.isString(viewComparator) || 1 === viewComparator.length ? this.collection.sortBy(viewComparator, this) : _.clone(this.collection.models).sort(_.bind(viewComparator, this)) : this.collection.models, 
                this.getOption("filter") && (models = _.filter(models, function(model, index) {
                    return this._shouldAddChild(model, index);
                }, this)), models;
            },
            showEmptyView: function() {
                var EmptyView = this.getEmptyView();
                if (EmptyView && !this._showingEmptyView) {
                    this.triggerMethod("before:render:empty"), this._showingEmptyView = !0;
                    var model = new Backbone.Model();
                    this.addEmptyView(model, EmptyView), this.triggerMethod("render:empty");
                }
            },
            destroyEmptyView: function() {
                this._showingEmptyView && (this.triggerMethod("before:remove:empty"), this.destroyChildren(), 
                delete this._showingEmptyView, this.triggerMethod("remove:empty"));
            },
            getEmptyView: function() {
                return this.getOption("emptyView");
            },
            addEmptyView: function(child, EmptyView) {
                var emptyViewOptions = this.getOption("emptyViewOptions") || this.getOption("childViewOptions");
                _.isFunction(emptyViewOptions) && (emptyViewOptions = emptyViewOptions.call(this, child, this._emptyViewIndex));
                var view = this.buildChildView(child, EmptyView, emptyViewOptions);
                view._parent = this, this.proxyChildEvents(view), this._isShown && Marionette.triggerMethodOn(view, "before:show"), 
                this.children.add(view), this.renderChildView(view, this._emptyViewIndex), this._isShown && Marionette.triggerMethodOn(view, "show");
            },
            getChildView: function(child) {
                var childView = this.getOption("childView");
                if (!childView) throw new Marionette.Error({
                    name: "NoChildViewError",
                    message: 'A "childView" must be specified'
                });
                return childView;
            },
            addChild: function(child, ChildView, index) {
                var childViewOptions = this.getOption("childViewOptions");
                childViewOptions = Marionette._getValue(childViewOptions, this, [ child, index ]);
                var view = this.buildChildView(child, ChildView, childViewOptions);
                return this._updateIndices(view, !0, index), this._addChildView(view, index), view._parent = this, 
                view;
            },
            _updateIndices: function(view, increment, index) {
                this.getOption("sort") && (increment && (view._index = index), this.children.each(function(laterView) {
                    laterView._index >= view._index && (laterView._index += increment ? 1 : -1);
                }));
            },
            _addChildView: function(view, index) {
                this.proxyChildEvents(view), this.triggerMethod("before:add:child", view), this._isShown && !this.isBuffering && Marionette.triggerMethodOn(view, "before:show"), 
                this.children.add(view), this.renderChildView(view, index), this._isShown && !this.isBuffering && Marionette.triggerMethodOn(view, "show"), 
                this.triggerMethod("add:child", view);
            },
            renderChildView: function(view, index) {
                return view.render(), this.attachHtml(this, view, index), view;
            },
            buildChildView: function(child, ChildViewClass, childViewOptions) {
                var options = _.extend({
                    model: child
                }, childViewOptions);
                return new ChildViewClass(options);
            },
            removeChildView: function(view) {
                return view && (this.triggerMethod("before:remove:child", view), view.destroy ? view.destroy() : view.remove && view.remove(), 
                delete view._parent, this.stopListening(view), this.children.remove(view), this.triggerMethod("remove:child", view), 
                this._updateIndices(view, !1)), view;
            },
            isEmpty: function() {
                return !this.collection || 0 === this.collection.length;
            },
            checkEmpty: function() {
                this.isEmpty(this.collection) && this.showEmptyView();
            },
            attachBuffer: function(collectionView) {
                collectionView.$el.append(this._createBuffer(collectionView));
            },
            _createBuffer: function(collectionView) {
                var elBuffer = document.createDocumentFragment();
                return _.each(collectionView._bufferedChildren, function(b) {
                    elBuffer.appendChild(b.el);
                }), elBuffer;
            },
            attachHtml: function(collectionView, childView, index) {
                collectionView.isBuffering ? collectionView._bufferedChildren.splice(index, 0, childView) : collectionView._insertBefore(childView, index) || collectionView._insertAfter(childView);
            },
            _insertBefore: function(childView, index) {
                var currentView, findPosition = this.getOption("sort") && index < this.children.length - 1;
                return findPosition && (currentView = this.children.find(function(view) {
                    return view._index === index + 1;
                })), currentView ? (currentView.$el.before(childView.el), !0) : !1;
            },
            _insertAfter: function(childView) {
                this.$el.append(childView.el);
            },
            _initChildViewStorage: function() {
                this.children = new Backbone.ChildViewContainer();
            },
            destroy: function() {
                return this.isDestroyed ? this : (this.triggerMethod("before:destroy:collection"), 
                this.destroyChildren(), this.triggerMethod("destroy:collection"), Marionette.View.prototype.destroy.apply(this, arguments));
            },
            destroyChildren: function() {
                var childViews = this.children.map(_.identity);
                return this.children.each(this.removeChildView, this), this.checkEmpty(), childViews;
            },
            _shouldAddChild: function(child, index) {
                var filter = this.getOption("filter");
                return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
            },
            proxyChildEvents: function(view) {
                var prefix = this.getOption("childViewEventPrefix");
                this.listenTo(view, "all", function() {
                    var args = _.toArray(arguments), rootEvent = args[0], childEvents = this.normalizeMethods(_.result(this, "childEvents"));
                    args[0] = prefix + ":" + rootEvent, args.splice(1, 0, view), "undefined" != typeof childEvents && _.isFunction(childEvents[rootEvent]) && childEvents[rootEvent].apply(this, args.slice(1)), 
                    this.triggerMethod.apply(this, args);
                });
            },
            _getImmediateChildren: function() {
                return _.values(this.children._views);
            },
            getViewComparator: function() {
                return this.getOption("viewComparator");
            }
        }), Marionette.CompositeView = Marionette.CollectionView.extend({
            constructor: function() {
                Marionette.CollectionView.apply(this, arguments);
            },
            _initialEvents: function() {
                this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd), 
                this.listenTo(this.collection, "remove", this._onCollectionRemove), this.listenTo(this.collection, "reset", this._renderChildren), 
                this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews));
            },
            getChildView: function(child) {
                var childView = this.getOption("childView") || this.constructor;
                return childView;
            },
            serializeData: function() {
                var data = {};
                return this.model && (data = _.partial(this.serializeModel, this.model).apply(this, arguments)), 
                data;
            },
            render: function() {
                return this._ensureViewIsIntact(), this._isRendering = !0, this.resetChildViewContainer(), 
                this.triggerMethod("before:render", this), this._renderTemplate(), this._renderChildren(), 
                this._isRendering = !1, this.isRendered = !0, this.triggerMethod("render", this), 
                this;
            },
            _renderChildren: function() {
                (this.isRendered || this._isRendering) && Marionette.CollectionView.prototype._renderChildren.call(this);
            },
            _renderTemplate: function() {
                var data = {};
                data = this.serializeData(), data = this.mixinTemplateHelpers(data), this.triggerMethod("before:render:template");
                var template = this.getTemplate(), html = Marionette.Renderer.render(template, data, this);
                this.attachElContent(html), this.bindUIElements(), this.triggerMethod("render:template");
            },
            attachElContent: function(html) {
                return this.$el.html(html), this;
            },
            attachBuffer: function(compositeView) {
                var $container = this.getChildViewContainer(compositeView);
                $container.append(this._createBuffer(compositeView));
            },
            _insertAfter: function(childView) {
                var $container = this.getChildViewContainer(this, childView);
                $container.append(childView.el);
            },
            _appendReorderedChildren: function(children) {
                var $container = this.getChildViewContainer(this);
                $container.append(children);
            },
            getChildViewContainer: function(containerView, childView) {
                if ("$childViewContainer" in containerView) return containerView.$childViewContainer;
                var container, childViewContainer = Marionette.getOption(containerView, "childViewContainer");
                if (childViewContainer) {
                    var selector = Marionette._getValue(childViewContainer, containerView);
                    if (container = "@" === selector.charAt(0) && containerView.ui ? containerView.ui[selector.substr(4)] : containerView.$(selector), 
                    container.length <= 0) throw new Marionette.Error({
                        name: "ChildViewContainerMissingError",
                        message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
                    });
                } else container = containerView.$el;
                return containerView.$childViewContainer = container, container;
            },
            resetChildViewContainer: function() {
                this.$childViewContainer && delete this.$childViewContainer;
            }
        }), Marionette.LayoutView = Marionette.ItemView.extend({
            regionClass: Marionette.Region,
            options: {
                destroyImmediate: !1
            },
            childViewEventPrefix: "childview",
            constructor: function(options) {
                options = options || {}, this._firstRender = !0, this._initializeRegions(options), 
                Marionette.ItemView.call(this, options);
            },
            render: function() {
                return this._ensureViewIsIntact(), this._firstRender ? this._firstRender = !1 : this._reInitializeRegions(), 
                Marionette.ItemView.prototype.render.apply(this, arguments);
            },
            destroy: function() {
                return this.isDestroyed ? this : (this.getOption("destroyImmediate") === !0 && this.$el.remove(), 
                this.regionManager.destroy(), Marionette.ItemView.prototype.destroy.apply(this, arguments));
            },
            showChildView: function(regionName, view) {
                return this.getRegion(regionName).show(view);
            },
            getChildView: function(regionName) {
                return this.getRegion(regionName).currentView;
            },
            addRegion: function(name, definition) {
                var regions = {};
                return regions[name] = definition, this._buildRegions(regions)[name];
            },
            addRegions: function(regions) {
                return this.regions = _.extend({}, this.regions, regions), this._buildRegions(regions);
            },
            removeRegion: function(name) {
                return delete this.regions[name], this.regionManager.removeRegion(name);
            },
            getRegion: function(region) {
                return this.regionManager.get(region);
            },
            getRegions: function() {
                return this.regionManager.getRegions();
            },
            _buildRegions: function(regions) {
                var defaults = {
                    regionClass: this.getOption("regionClass"),
                    parentEl: _.partial(_.result, this, "el")
                };
                return this.regionManager.addRegions(regions, defaults);
            },
            _initializeRegions: function(options) {
                var regions;
                this._initRegionManager(), regions = Marionette._getValue(this.regions, this, [ options ]) || {};
                var regionOptions = this.getOption.call(options, "regions");
                regionOptions = Marionette._getValue(regionOptions, this, [ options ]), _.extend(regions, regionOptions), 
                regions = this.normalizeUIValues(regions, [ "selector", "el" ]), this.addRegions(regions);
            },
            _reInitializeRegions: function() {
                this.regionManager.invoke("reset");
            },
            getRegionManager: function() {
                return new Marionette.RegionManager();
            },
            _initRegionManager: function() {
                this.regionManager = this.getRegionManager(), this.regionManager._parent = this, 
                this.listenTo(this.regionManager, "before:add:region", function(name) {
                    this.triggerMethod("before:add:region", name);
                }), this.listenTo(this.regionManager, "add:region", function(name, region) {
                    this[name] = region, this.triggerMethod("add:region", name, region);
                }), this.listenTo(this.regionManager, "before:remove:region", function(name) {
                    this.triggerMethod("before:remove:region", name);
                }), this.listenTo(this.regionManager, "remove:region", function(name, region) {
                    delete this[name], this.triggerMethod("remove:region", name, region);
                });
            },
            _getImmediateChildren: function() {
                return _.chain(this.regionManager.getRegions()).pluck("currentView").compact().value();
            }
        }), Marionette.Behavior = Marionette.Object.extend({
            constructor: function(options, view) {
                this.view = view, this.defaults = _.result(this, "defaults") || {}, this.options = _.extend({}, this.defaults, options), 
                this.ui = _.extend({}, _.result(view, "ui"), _.result(this, "ui")), Marionette.Object.apply(this, arguments);
            },
            $: function() {
                return this.view.$.apply(this.view, arguments);
            },
            destroy: function() {
                return this.stopListening(), this;
            },
            proxyViewProperties: function(view) {
                this.$el = view.$el, this.el = view.el;
            }
        }), Marionette.Behaviors = function(Marionette, _) {
            function Behaviors(view, behaviors) {
                return _.isObject(view.behaviors) ? (behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, "behaviors")), 
                Behaviors.wrap(view, behaviors, _.keys(methods)), behaviors) : {};
            }
            function BehaviorTriggersBuilder(view, behaviors) {
                this._view = view, this._behaviors = behaviors, this._triggers = {};
            }
            function getBehaviorsUI(behavior) {
                return behavior._uiBindings || behavior.ui;
            }
            var delegateEventSplitter = /^(\S+)\s*(.*)$/, methods = {
                behaviorTriggers: function(behaviorTriggers, behaviors) {
                    var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
                    return triggerBuilder.buildBehaviorTriggers();
                },
                behaviorEvents: function(behaviorEvents, behaviors) {
                    var _behaviorsEvents = {};
                    return _.each(behaviors, function(b, i) {
                        var _events = {}, behaviorEvents = _.clone(_.result(b, "events")) || {};
                        behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));
                        var j = 0;
                        _.each(behaviorEvents, function(behaviour, key) {
                            var match = key.match(delegateEventSplitter), eventName = match[1] + "." + [ this.cid, i, j++, " " ].join(""), selector = match[2], eventKey = eventName + selector, handler = _.isFunction(behaviour) ? behaviour : b[behaviour];
                            _events[eventKey] = _.bind(handler, b);
                        }, this), _behaviorsEvents = _.extend(_behaviorsEvents, _events);
                    }, this), _behaviorsEvents;
                }
            };
            return _.extend(Behaviors, {
                behaviorsLookup: function() {
                    throw new Marionette.Error({
                        message: "You must define where your behaviors are stored.",
                        url: "marionette.behaviors.html#behaviorslookup"
                    });
                },
                getBehaviorClass: function(options, key) {
                    return options.behaviorClass ? options.behaviorClass : Marionette._getValue(Behaviors.behaviorsLookup, this, [ options, key ])[key];
                },
                parseBehaviors: function(view, behaviors) {
                    return _.chain(behaviors).map(function(options, key) {
                        var BehaviorClass = Behaviors.getBehaviorClass(options, key), behavior = new BehaviorClass(options, view), nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, "behaviors"));
                        return [ behavior ].concat(nestedBehaviors);
                    }).flatten().value();
                },
                wrap: function(view, behaviors, methodNames) {
                    _.each(methodNames, function(methodName) {
                        view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
                    });
                }
            }), _.extend(BehaviorTriggersBuilder.prototype, {
                buildBehaviorTriggers: function() {
                    return _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this), this._triggers;
                },
                _buildTriggerHandlersForBehavior: function(behavior, i) {
                    var triggersHash = _.clone(_.result(behavior, "triggers")) || {};
                    triggersHash = Marionette.normalizeUIKeys(triggersHash, getBehaviorsUI(behavior)), 
                    _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
                },
                _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
                    var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
                        return triggerName + ".behaviortriggers" + i;
                    });
                    this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
                }
            }), Behaviors;
        }(Marionette, _), Marionette.AppRouter = Backbone.Router.extend({
            constructor: function(options) {
                this.options = options || {}, Backbone.Router.apply(this, arguments);
                var appRoutes = this.getOption("appRoutes"), controller = this._getController();
                this.processAppRoutes(controller, appRoutes), this.on("route", this._processOnRoute, this);
            },
            appRoute: function(route, methodName) {
                var controller = this._getController();
                this._addAppRoute(controller, route, methodName);
            },
            _processOnRoute: function(routeName, routeArgs) {
                if (_.isFunction(this.onRoute)) {
                    var routePath = _.invert(this.getOption("appRoutes"))[routeName];
                    this.onRoute(routeName, routePath, routeArgs);
                }
            },
            processAppRoutes: function(controller, appRoutes) {
                if (appRoutes) {
                    var routeNames = _.keys(appRoutes).reverse();
                    _.each(routeNames, function(route) {
                        this._addAppRoute(controller, route, appRoutes[route]);
                    }, this);
                }
            },
            _getController: function() {
                return this.getOption("controller");
            },
            _addAppRoute: function(controller, route, methodName) {
                var method = controller[methodName];
                if (!method) throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
                this.route(route, methodName, _.bind(method, controller));
            },
            mergeOptions: Marionette.mergeOptions,
            getOption: Marionette.proxyGetOption,
            triggerMethod: Marionette.triggerMethod,
            bindEntityEvents: Marionette.proxyBindEntityEvents,
            unbindEntityEvents: Marionette.proxyUnbindEntityEvents
        }), Marionette.Application = Marionette.Object.extend({
            constructor: function(options) {
                this._initializeRegions(options), this._initCallbacks = new Marionette.Callbacks(), 
                this.submodules = {}, _.extend(this, options), this._initChannel(), Marionette.Object.call(this, options);
            },
            execute: function() {
                this.commands.execute.apply(this.commands, arguments);
            },
            request: function() {
                return this.reqres.request.apply(this.reqres, arguments);
            },
            addInitializer: function(initializer) {
                this._initCallbacks.add(initializer);
            },
            start: function(options) {
                this.triggerMethod("before:start", options), this._initCallbacks.run(options, this), 
                this.triggerMethod("start", options);
            },
            addRegions: function(regions) {
                return this._regionManager.addRegions(regions);
            },
            emptyRegions: function() {
                return this._regionManager.emptyRegions();
            },
            removeRegion: function(region) {
                return this._regionManager.removeRegion(region);
            },
            getRegion: function(region) {
                return this._regionManager.get(region);
            },
            getRegions: function() {
                return this._regionManager.getRegions();
            },
            module: function(moduleNames, moduleDefinition) {
                var ModuleClass = Marionette.Module.getClass(moduleDefinition), args = _.toArray(arguments);
                return args.unshift(this), ModuleClass.create.apply(ModuleClass, args);
            },
            getRegionManager: function() {
                return new Marionette.RegionManager();
            },
            _initializeRegions: function(options) {
                var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
                this._initRegionManager();
                var optionRegions = Marionette.getOption(options, "regions");
                return _.isFunction(optionRegions) && (optionRegions = optionRegions.call(this, options)), 
                _.extend(regions, optionRegions), this.addRegions(regions), this;
            },
            _initRegionManager: function() {
                this._regionManager = this.getRegionManager(), this._regionManager._parent = this, 
                this.listenTo(this._regionManager, "before:add:region", function() {
                    Marionette._triggerMethod(this, "before:add:region", arguments);
                }), this.listenTo(this._regionManager, "add:region", function(name, region) {
                    this[name] = region, Marionette._triggerMethod(this, "add:region", arguments);
                }), this.listenTo(this._regionManager, "before:remove:region", function() {
                    Marionette._triggerMethod(this, "before:remove:region", arguments);
                }), this.listenTo(this._regionManager, "remove:region", function(name) {
                    delete this[name], Marionette._triggerMethod(this, "remove:region", arguments);
                });
            },
            _initChannel: function() {
                this.channelName = _.result(this, "channelName") || "global", this.channel = _.result(this, "channel") || Backbone.Wreqr.radio.channel(this.channelName), 
                this.vent = _.result(this, "vent") || this.channel.vent, this.commands = _.result(this, "commands") || this.channel.commands, 
                this.reqres = _.result(this, "reqres") || this.channel.reqres;
            }
        }), Marionette.Module = function(moduleName, app, options) {
            this.moduleName = moduleName, this.options = _.extend({}, this.options, options), 
            this.initialize = options.initialize || this.initialize, this.submodules = {}, this._setupInitializersAndFinalizers(), 
            this.app = app, _.isFunction(this.initialize) && this.initialize(moduleName, app, this.options);
        }, Marionette.Module.extend = Marionette.extend, _.extend(Marionette.Module.prototype, Backbone.Events, {
            startWithParent: !0,
            initialize: function() {},
            addInitializer: function(callback) {
                this._initializerCallbacks.add(callback);
            },
            addFinalizer: function(callback) {
                this._finalizerCallbacks.add(callback);
            },
            start: function(options) {
                this._isInitialized || (_.each(this.submodules, function(mod) {
                    mod.startWithParent && mod.start(options);
                }), this.triggerMethod("before:start", options), this._initializerCallbacks.run(options, this), 
                this._isInitialized = !0, this.triggerMethod("start", options));
            },
            stop: function() {
                this._isInitialized && (this._isInitialized = !1, this.triggerMethod("before:stop"), 
                _.invoke(this.submodules, "stop"), this._finalizerCallbacks.run(void 0, this), this._initializerCallbacks.reset(), 
                this._finalizerCallbacks.reset(), this.triggerMethod("stop"));
            },
            addDefinition: function(moduleDefinition, customArgs) {
                this._runModuleDefinition(moduleDefinition, customArgs);
            },
            _runModuleDefinition: function(definition, customArgs) {
                if (definition) {
                    var args = _.flatten([ this, this.app, Backbone, Marionette, Backbone.$, _, customArgs ]);
                    definition.apply(this, args);
                }
            },
            _setupInitializersAndFinalizers: function() {
                this._initializerCallbacks = new Marionette.Callbacks(), this._finalizerCallbacks = new Marionette.Callbacks();
            },
            triggerMethod: Marionette.triggerMethod
        }), _.extend(Marionette.Module, {
            create: function(app, moduleNames, moduleDefinition) {
                var module = app, customArgs = _.drop(arguments, 3);
                moduleNames = moduleNames.split(".");
                var length = moduleNames.length, moduleDefinitions = [];
                return moduleDefinitions[length - 1] = moduleDefinition, _.each(moduleNames, function(moduleName, i) {
                    var parentModule = module;
                    module = this._getModule(parentModule, moduleName, app, moduleDefinition), this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
                }, this), module;
            },
            _getModule: function(parentModule, moduleName, app, def, args) {
                var options = _.extend({}, def), ModuleClass = this.getClass(def), module = parentModule[moduleName];
                return module || (module = new ModuleClass(moduleName, app, options), parentModule[moduleName] = module, 
                parentModule.submodules[moduleName] = module), module;
            },
            getClass: function(moduleDefinition) {
                var ModuleClass = Marionette.Module;
                return moduleDefinition ? moduleDefinition.prototype instanceof ModuleClass ? moduleDefinition : moduleDefinition.moduleClass || ModuleClass : ModuleClass;
            },
            _addModuleDefinition: function(parentModule, module, def, args) {
                var fn = this._getDefine(def), startWithParent = this._getStartWithParent(def, module);
                fn && module.addDefinition(fn, args), this._addStartWithParent(parentModule, module, startWithParent);
            },
            _getStartWithParent: function(def, module) {
                var swp;
                return _.isFunction(def) && def.prototype instanceof Marionette.Module ? (swp = module.constructor.prototype.startWithParent, 
                _.isUndefined(swp) ? !0 : swp) : _.isObject(def) ? (swp = def.startWithParent, _.isUndefined(swp) ? !0 : swp) : !0;
            },
            _getDefine: function(def) {
                return !_.isFunction(def) || def.prototype instanceof Marionette.Module ? _.isObject(def) ? def.define : null : def;
            },
            _addStartWithParent: function(parentModule, module, startWithParent) {
                module.startWithParent = module.startWithParent && startWithParent, module.startWithParent && !module.startWithParentIsConfigured && (module.startWithParentIsConfigured = !0, 
                parentModule.addInitializer(function(options) {
                    module.startWithParent && module.start(options);
                }));
            }
        }), Marionette;
    }), purechatApp = new Marionette.Application(), purechatApp.start(), Backbone.Relational.showWarnings = !1, 
    purechatApp.module("Constants", function(Constants, app, Backbone, Marionette, $, _) {
        Constants.WidgetType = {
            Tab: 1,
            Button: 2,
            Image: 3,
            ImageTab: 4
        }, Constants.WidgetStates = {
            Initializing: "PCStateInitializing",
            Inactive: "PCStateInactive",
            Activating: "PCStateActivating",
            Chatting: "PCStateChatting",
            Closed: "PCStateClosed",
            Unavailable: "PCStateUnavailable",
            Unsupported: "PCStateUnsupported"
        };
    }), (window.pcDashboard || purechatApp).module("Logging", function(Logging, app, Backbone, Marionette, $, _) {
        app._logAllAjaxRequests = !1;
        var Level = function(level, name) {
            this.level = level, this.name = name;
        };
        Level.prototype = {
            toString: function() {
                return this.name;
            },
            equals: function(level) {
                try {
                    return this.level == level.level;
                } catch (ex) {
                    return !1;
                }
            },
            isGreaterOrEqual: function(level) {
                try {
                    return this.level >= level.level;
                } catch (ex) {
                    return !1;
                }
            }
        }, Level.ALL = new Level(Number.MIN_VALUE, "ALL"), Level.TRACE = new Level(1e4, "TRACE"), 
        Level.DEBUG = new Level(2e4, "DEBUG"), Level.INFO = new Level(3e4, "INFO"), Level.WARN = new Level(4e4, "WARN"), 
        Level.ERROR = new Level(5e4, "ERROR"), Level.FATAL = new Level(6e4, "FATAL"), Level.OFF = new Level(Number.MAX_VALUE, "OFF");
        window.onerror = function(errorMsg, url, lineNumber, column, exceptionObj) {
            "undefined" != typeof window.pcDashboard && Logging.logger && Logging.logger.log("ERROR", errorMsg + " [line:" + lineNumber + "] " + url, null != exceptionObject ? exceptionObj.stack : null, !1, CurrentUser ? CurrentUser.get("chatServerUrl") : null, CurrentUser ? CurrentUser.get("accountId") : null);
        };
        var LoggingController = Marionette.Controller.extend({
            _logAllAjaxRequests: !1,
            getQueryStringParams: function() {
                var parms = {}, query = window.location.search.substr(window.location.search.indexOf("?") + 1);
                if (query.length > 0) {
                    var splitQuery = query.split("&");
                    splitQuery.forEach(function(s) {
                        var splitSegment = s.split("=");
                        parms[splitSegment[0]] = "undefined" != typeof splitSegment[1] ? splitSegment[1] : null;
                    });
                }
                return parms;
            },
            initialize: function() {
                var parms = this.getQueryStringParams();
                app._logAllAjaxRequests = parms.application_debug || !1, app._logAllAjaxRequests;
            },
            log: function(level, message, stackTrace, increaseCharacterLimit, chatServerUrl, accountId) {
                _.isString(level) && (level = Level[level]);
                var logLevel = app.LogLevel || Level.ERROR;
                if (logLevel.isGreaterOrEqual(level)) try {
                    $.ajax({
                        url: (app.pureServerUrl || "") + "/AjaxLogger/Log",
                        dataType: "jsonp",
                        data: {
                            level: level.toString(),
                            message: message,
                            stackTrace: encodeURIComponent(stackTrace.substr(0, increaseCharacterLimit ? 150 : 75)),
                            chatServerUrl: encodeURIComponent(chatServerUrl),
                            accountId: accountId
                        },
                        ignoreLogging: !0,
                        timeout: 2e4,
                        success: function(response) {},
                        error: function(xhr, textStatus, error) {}
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
        Logging.addInitializer(function() {
            Logging.logger = new LoggingController(), Marionette.Controller.prototype.log = _.bind(Logging.logger.log, Logging.logger);
        }), Logging.addFinalizer(function() {
            Logging.log = null;
        });
    }), purechatApp.module("Utils", function(Utils, app, Backbone, Marionette, $, _) {
        $.throttle = function(delay, no_trailing, callback, debounce_mode) {
            function wrapper() {
                function exec() {
                    last_exec = +new Date(), callback.apply(that, args);
                }
                function clear() {
                    timeout_id = void 0;
                }
                var that = this, elapsed = +new Date() - last_exec, args = arguments;
                debounce_mode && !timeout_id && exec(), timeout_id && clearTimeout(timeout_id), 
                void 0 === debounce_mode && elapsed > delay ? exec() : no_trailing !== !0 && (timeout_id = setTimeout(debounce_mode ? clear : exec, void 0 === debounce_mode ? delay - elapsed : delay));
            }
            var timeout_id, last_exec = 0;
            return "boolean" != typeof no_trailing && (debounce_mode = callback, callback = no_trailing, 
            no_trailing = void 0), $.guid && (wrapper.guid = callback.guid = callback.guid || $.guid++), 
            wrapper;
        }, Utils.convertTimeFromUtc = function(dateTime, utcOffset) {
            return dateTime;
        }, Utils.linkify = function(message) {
            return message ? (message = message.replace(/&amp;/g, "&"), linkifiedMessage = message.replace(/(www\.)?(?=[a-zA-Z0-9])(([-a-zA-Z0-9@:%_\+~#?&//=]){1,256}\.){1,}(za|guru|co|il|gl|ly|co|be|fr|in|biz|xxx|mobi|me|com|my|ru|me|net|edu|gov|io|us|org|info|tv|mobi|au|nz|uk|br|es|dk|se|fi|nl|ca|sg|eu|py|it|mx)\b([?/][-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, function(url) {
                return -1 != url.indexOf("@") ? '<a href="mailto:' + url + '" target="_blank">' + url + "</a>" : '<a href="' + (0 != url.indexOf("http") ? "http://" + url : url) + '" target="_blank">' + url + "</a>";
            }), linkifiedMessage) : null;
        }, Utils.parseEmoticons = function(message) {
            function emotRegex(emot) {
                return new RegExp("([\\s.]|^)(" + emot + ")(?=[\\s.]|$)", "gim");
            }
            regexes = {
                happy: emotRegex("(:\\)|:-\\)|\\(happy\\))"),
                sad: emotRegex("(:\\(|:-\\(|\\(sad\\))"),
                grin: emotRegex("(:D|:-D|\\(grin\\))"),
                sealed: emotRegex("(:x|:-x|\\(sealed\\))"),
                wink: emotRegex("(;\\)|;-\\)|\\(wink\\))"),
                yawn: emotRegex("(\\(yawn\\))"),
                smirk: emotRegex("(\\(smirk\\))"),
                starstruck: emotRegex("(\\(starstruck\\))"),
                depressed: emotRegex("(:C|:-C|\\(depressed\\))"),
                sadnerd: emotRegex("(8\\(|8-\\(|\\(sadnerd\\))"),
                zomg: emotRegex("(D:|\\(zomg\\))"),
                speechless: emotRegex("(:\\||:-\\||\\(speechless\\))"),
                crying: emotRegex("(:'\\(|:'-\\(|\\(crying\\))"),
                relieved: emotRegex("(\\(relieved\\))"),
                satisfied: emotRegex("(\\(satisfied\\))"),
                determined: emotRegex("(\\(determined\\))"),
                tongue: emotRegex("(:p|:-p|\\(tongue\\))"),
                unsure: emotRegex("(:-\\/|\\(unsure\\))"),
                sleep: emotRegex("(-_-|\\(sleep\\))"),
                disguise: emotRegex("(8{|8-{|\\(disguise\\))"),
                cool: emotRegex("(B\\)|B-\\)|\\(cool\\))"),
                nerd: emotRegex("(8\\)|8-\\)|\\(nerd\\))"),
                lovestruck: emotRegex("(\\(lovestruck\\))"),
                angry: emotRegex("\\(angry\\)"),
                evil: emotRegex("(\\(evil\\))"),
                sick: emotRegex("(:s|:-s|\\(sick\\))"),
                embarassed: emotRegex("(\\/_\\\\|\\(embarassed\\))"),
                mustache: emotRegex("(:{|\\(mustache\\))"),
                surprised: emotRegex("(:o|:-o|\\(surprised\\))"),
                tease: emotRegex("(;p|;-p|\\(tease\\))"),
                ninja: emotRegex("\\(ninja\\)"),
                zombie: emotRegex("\\(zombie\\)")
            };
            var emoticons = {
                happy: "emote-happy",
                sad: "emote-sad",
                grin: "emote-grin",
                sealed: "emote-sealed",
                wink: "emote-wink",
                yawn: "emote-yawn",
                smirk: "emote-smirk",
                starstruck: "emote-starstruck",
                depressed: "emote-depressed",
                sadnerd: "emote-sadnerd",
                zomg: "emote-zomg",
                speechless: "emote-speechless",
                crying: "emote-crying",
                relieved: "emote-relieved",
                satisfied: "emote-satisfied",
                determined: "emote-determined",
                tongue: "emote-tongue",
                unsure: "emote-unsure",
                sleep: "emote-sleep",
                disguise: "emote-disguised",
                cool: "emote-cool",
                nerd: "emote-nerd",
                lovestruck: "emote-lovestruck",
                angry: "emote-angry",
                evil: "emote-evil",
                sick: "emote-sick",
                embarassed: "emote-embarassed",
                mustache: "emote-mustache",
                surprised: "emote-surprised",
                tease: "emote-tease",
                ninja: "emote-ninja",
                zombie: "emote-zombie"
            };
            if (message) for (var r in regexes) message = message.replace(regexes[r], function($0, $1) {
                return $1 + '<div class="emoticon ' + emoticons[r] + '" title="' + r + '"></div>';
            });
            return message;
        }, Utils.GaEvent = function(widgetSettings, eventEnabled, event) {
            var category = "GAEventCategory", eventFnc = function() {
                (window._gaq || window.ga) && (window.ga ? (window.ga("create", widgetSettings.get("GoogId")), 
                window.ga("send", "event", widgetSettings.get(category), widgetSettings.get(event))) : window._gaq && (window._gaq.push([ "_setAccount", widgetSettings.get("GoogId") ]), 
                window._gaq.push([ "_trackEvent", widgetSettings.get(category), widgetSettings.get(event) ])));
            };
            widgetSettings.get("UsingGa") && widgetSettings.get(eventEnabled) && widgetSettings.get(event) && (window._gaq || window.ga || this.isOperator ? this.isOperator || eventFnc() : !function() {
                var ga = document.createElement("script");
                ga.type = "text/javascript", ga.async = !0, ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
                var loaded = !1;
                ga.onreadystatechange = ga.onload = function(e) {
                    loaded || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (window._gaq = window._gaq || [], 
                    eventFnc(), loaded = !0);
                }, document.getElementsByTagName("head").item(0).appendChild(ga);
            }());
        }, Utils.Notifier = function() {
            this.isTitleModified = !1, this.windowNotifyTimeout = null, this.timeoutId = null, 
            this.active = !1, this.mobileActive = !1, this.mobileAnimationInterval = null;
        }, Utils.Notifier.prototype.notify = function(message, additionalElement, mouseStopElement) {
            var t = this;
            if (!t.active) {
                t.active = !0;
                var originalTitle = document.title;
                additionalElement && (originalElementTitle = additionalElement.text());
                var switchTitle = function() {
                    return 0 == t.active ? (document.title = originalTitle, additionalElement && additionalElement.text(originalElementTitle), 
                    void (t.isTitleModified = !1)) : (1 == t.isTitleModified ? (t.isTitleModified = !1, 
                    document.title = originalTitle, additionalElement && additionalElement.text(originalElementTitle)) : (t.isTitleModified = !0, 
                    document.title = message, additionalElement && additionalElement.text(message)), 
                    void (t.timeoutId = setTimeout(switchTitle, 900)));
                };
                t.timeoutId = setTimeout(switchTitle, 900), mouseStopElement ? mouseStopElement.on("mousemove.notifier", function() {
                    t.stop();
                }) : $(document).on("mousemove.notifier", function() {
                    t.stop();
                });
            }
        }, Utils.Notifier.prototype.stop = function() {
            this.active = !1, mouseStopElement ? mouseStopElement.off("mousemove.notifier") : $(document).off("mousemove.notifier");
        }, Utils.escapeHtml = function(text) {
            var tempElem = $("<div/>");
            return text = tempElem.text(text || "").html();
        }, Utils.addInitializer(function(options) {
            "function" != typeof Date.prototype.toHourMinuteString && (Date.prototype.toHourMinuteString = function() {
                var hours = this.getHours(), minutes = this.getMinutes(), seconds = this.getSeconds(), amPM = hours >= 12 ? " PM" : " AM", computedHours = 0 == hours ? 12 : hours > 12 ? hours - 12 : hours;
                return computedHours + ":" + (10 > minutes ? "0" + minutes : minutes) + ":" + (10 > seconds ? "0" + seconds : seconds) + amPM;
            });
        }), Utils.addFinalizer(function(options) {
            Date.prototype.toHourMinuteString = null;
        });
    }), GetReasonFromResponse = function(reason) {
        return 1 == reason ? "Available" : 2 == reason ? "NoOperators" : 3 == reason ? "ServerDowntime" : 4 == reason ? "AccountActivity" : 5 == reason ? "ChatQuotaExceeded" : 6 == reason ? "WidgetDisabled" : "";
    }, _PCcb = function(response) {
        window._checkChatAvailableDeferred.resolve({
            available: 1 == response.a,
            reason: GetReasonFromResponse(response.r)
        }), window._checkChatAvailableDeferred = null;
    }, !function(exports, global) {
        global["true"] = exports;
        var _ = global._;
        this.templates = this.templates || {}, this.templates.ChatConnecting = function(o) {
            var __p = "";
            return _.escape, __p += '<div class="spinnerContainer" style="height:200px;"></div>';
        }, this.templates.ClosedMessage = function(o) {
            var __t, __p = "", __e = _.escape, ctaUrl = (Array.prototype.join, o.getResource("button_cta_url")), httpRegex = new RegExp("(https|http)://");
            return ctaUrl = 0 != ctaUrl.search(httpRegex) ? "http://" + ctaUrl : ctaUrl, __p += '<p class="purechat-message-note" data-resourcekey="closed_message">' + __e(o.getResource("closed_message")) + "</p>", 
            o.AskForRating && (__p += '<div class="purechat-thumbs-container"><div class="purechat-thumbs purechat-thumbs-up purechat-thumbs-selectable pc-icon-thumbs-up"></div><div class="purechat-thumbs purechat-thumbs-down purechat-thumbs-selectable pc-icon-thumbs-down"></div></div><p class="purechat-rating-thanks purechat-message-note"></p>'), 
            o.CtaButton && (__p += '<form class="purechat-form purechat-ended-form" action=""><a href="' + (null == (__t = ctaUrl) ? "" : __t) + '" data-resourcekey="button_cta" class="btn purechat-cta-button ' + (null == (__t = o.isPersonalChat ? "button green" : "") ? "" : __t) + '" target="_blank">' + __e(o.getResource("button_cta")) + "</a></form>"), 
            o.DownloadTranscript && (__p += '<p class="purechat-download-container purechat-message-note"><a data-resourcekey="closed_downloadTrans" target="_blank" href="' + (null == (__t = o.get("pureServerUrl")) ? "" : __t) + "/VisitorWidget/Transcript?chatId=" + (null == (__t = (o.get("dataController") || o.get("oldDataController")).connectionInfo.get("chatId")) ? "" : __t) + "&authToken=" + (null == (__t = (o.get("dataController") || o.get("oldDataController")).connectionInfo.get("authToken")) ? "" : __t) + '">' + __e(o.getResource("closed_downloadTrans")) + "</a></p>"), 
            __p;
        }, this.templates.ClosedMessageOperator = function(o) {
            var __t, __p = "", __e = _.escape, isOperatorRoom = (Array.prototype.join, o.get("room").roomType == PureChat.enums.roomType.operator);
            if (__p += '<script>!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = "https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs");</script><h3 class="">', 
            __p += 0 == o.closedReasonCode ? "This chat was closed by the visitor." : 1 == o.closedReasonCode ? "The chat was close because the visitor left the page or lost internet connectivity." : 2 == o.closedReasonCode ? "The chat was close because there was no activity for this conversation in the past hour." : 3 == o.closedReasonCode ? "This chat was closed by an operator." : __e(o.getResource("closed_opMessage")), 
            __p += '</h3><div class="closed-chat-buttons dashboard"><div><button type="button" data-command="removeWidget"><i class="shane-awesome close-chat-dark-fill"></i>Close Chat Tab</button></div>', 
            !isOperatorRoom) {
                var banArgs = {
                    chatId: o.roomId,
                    visitorIPAddressId: o.visitorIPAddressId,
                    visitorIPAddress: o.visitorIPAddress,
                    performBan: !0
                }, banArgString = escape(JSON.stringify(banArgs));
                o.visitorIPAddressId > -1 && (__p += '<div><button class="btn ban-ip-button" data-chatid="' + (null == (__t = o.roomId) ? "" : __t) + "\" data-request='ban:ip' data-request-params=\"" + (null == (__t = banArgString) ? "" : __t) + '"><i class="shane-awesome manage-ip-addresses"></i>Ban IP Address</button></div>'), 
                __p += '<div><a class="btn view-transcript-operator-button button" target="_blank" href="/transcripts/view/' + (null == (__t = o.roomId) ? "" : __t) + '"><i class="shane-awesome view-transcripts"></i>View Transcript</a></div><div><a href="/Chat/Download/' + (null == (__t = o.roomId) ? "" : __t) + '" class="button download-transcript-operator-button" data-chatid="' + (null == (__t = o.roomId) ? "" : __t) + '" target="_blank"><i class="shane-awesome download-transcript"></i>Download Transcript</a></div><div><button type="submit" class="btn email-transcript-operator-button" data-chatid="' + (null == (__t = o.roomId) ? "" : __t) + '" data-command="transcript:email" data-command-params="' + (null == (__t = o.roomId) ? "" : __t) + '"><i class="shane-awesome email-transcripts"></i>Email Transcript</button></div><div id="export-Infusionsoft" class="export-div"><a data-trigger="export" class="button" data-trigger-params=\'{"app": "infusionsoft"}\'><i class="shane-awesome export-transcript"></i>Export to Infusionsoft</a></div><div id="export-Axosoft" class="export-div"><a data-trigger="export" class="button" data-trigger-params=\'{"app": "axosoft"}\'><i class="shane-awesome export-transcript"></i>Export to Axosoft</a></div><div id="export-Salesforce" class="export-div"><a data-trigger="export" class="button" data-trigger-params=\'{"app": "salesforce"}\'><i class="shane-awesome export-transcript"></i>Export to Salesforce</a></div><div id="export-Apptivo" class="export-div"><a data-trigger="export" class="button" data-trigger-params=\'{"app": "apptivo"}\'><i class="shane-awesome export-transcript"></i>Export to Apptivo</a></div><div>';
                var name = o.visitorName && "Visitor" != o.visitorName ? "%20with%20" + o.visitorName + "!" : "!";
                __p += '<a href="https://twitter.com/intent/tweet?original_referer=' + (null == (__t = escape(pcDashboard.Settings.get("siteRootUrl"))) ? "" : __t) + "&text=Just%20had%20a%20great%20chat" + (null == (__t = name) ? "" : __t) + '&tw_p=tweetbutton&url=%20&via=PureChat" class="button full-page" target="_blank"><i class="fa fa-twitter" style="margin-top: 0.3em"></i>Share</a></div>';
            }
            return __p += "</div>";
        }, this.templates.EmailSent = function(o) {
            var __t, __p = "";
            return _.escape, __p += '<div class="purechat-enterinfo-container purechat-email-success"><p>Email Sent!</p><table><tr><td>Name: </td><td>' + (null == (__t = o.Name) ? "" : __t) + "</td></tr><tr><td>Email: </td><td>" + (null == (__t = o.Email) ? "" : __t) + "</td></tr><tr><td>Question: </td><td>" + (null == (__t = o.Question) ? "" : __t) + "</td></tr></table></div>";
        }, this.templates.Empty = function(o) {
            var __p = "";
            return _.escape, __p += "";
        }, this.templates.MessageList = function(o) {
            var __p = "";
            return _.escape, Array.prototype.join, __p += '<div class="purechat-message-display-container"><div class="purechat-message-display purechat-clearfix"></div></div><div class="purechat-user-status"></div><div class="purechat-send-form-container"><form class="purechat-send-form" action=""><textarea class="purechat-send-form-message" name="purechat-send-form-message" /><div class="disableTextArea" style=""/>', 
            o.isPersonalChat && o.RequestFromMobileDevice && (__p += '<button type="submit" class="button green send-message">Send</button>'), 
            __p += '</form></div><div class="purechat-confirm-close-modal" style="display: none;"><span class="message">Are you sure you want to close the chat?</span><div class="modal-button-bar"><button type="button" class="btn kill-chat">Yes</button><button type="button" class="btn cancel">No</button></div></div><div class="purchat-confirm-close-modal-overlay" style="display: none;"></div>';
        }, this.templates.MessageView = function(o) {
            var __t, __p = "";
            if (_.escape, Array.prototype.join, "note" == o.type) __p += '<p class="purechat-message-note important" data-username="' + (null == (__t = o.username) ? "" : __t) + '" data-resourcekey="' + (null == (__t = o.resourceKey || "") ? "" : __t) + '">' + (null == (__t = o.message) ? "" : __t) + "</p>"; else if ("message" == o.type && o.message) {
                var m = o.message.replace(/\n/g, "<br />"), message = purechatApp.Utils.parseEmoticons(m);
                message = purechatApp.Utils.linkify(message), __p += '<div data-resourcekey="' + (null == (__t = o.resourceKey || "") ? "" : __t) + '" class="purechat-message-container ' + (null == (__t = o.myMessage ? "purechat-message-right" : "purechat-message-left") ? "" : __t) + '"><img class="gravitar operator-gravatar ' + (null == (__t = o.myMessage ? "right" : "left") ? "" : __t) + '" height="50" width="50" src="' + (null == (__t = o.avatarUrl) ? "" : __t) + '" alt="Operator avatar" /><div class="timestamp"><span class="time">' + (null == (__t = o.time) ? "" : __t) + '</span></div><div class="purechat-message">', 
                o.userName && (__p += '<span class="purechat-displayname">' + (null == (__t = o.userName) ? "" : __t) + '</span><span class="name-message-separator">:</span>'), 
                __p += '<span class="purechat-message-actual"><span class="purechat-new-thought">' + (null == (__t = message) ? "" : __t) + '</span></span><span class="message-time-separator">-</span></div></div>';
            }
            return __p;
        }, this.templates.PersonalChatDetails = function(o) {
            var __t, __p = "";
            _.escape, Array.prototype.join, __p += '<div class="purechat-personal-avatar-and-details-wrapper"><div class="purechat-personal-avatar"><div class="editor-section hide"></div><div class="content-section">';
            var personalAvUrl = o.pureServerUrl + "/content/images/Avatars/1avatar-operator-skinny-hirez.png";
            return null !== o.UserWidgetSettings.get("PersonalAvatarImage") && /[a-zA-Z1-9]/g.test(o.UserWidgetSettings.get("PersonalAvatarImage").FileId) && (personalAvUrl = o.pureServerUrl + "/files/download/" + o.UserWidgetSettings.get("PersonalAvatarImage").FileId + "." + o.UserWidgetSettings.get("PersonalAvatarImage").FileExtension), 
            __p += '<div class="avatar-image" style="background-image: url(\'' + (null == (__t = personalAvUrl) ? "" : __t) + "');\"></div>", 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-personal-avatar">Change Personal Avatar<span class="image-dimensions tooltip"><span class="arrow"></span><span class="body">Image will be resized to 200px x 200px after upload.</span></span></a>'), 
            __p += '</div></div><div class="purechat-additional-details-container"><div class="purechat-person"><div class="purechat-name"><div class="editor-section"></div><div class="content-section">' + (null == (__t = o.UserWidgetSettings.get("DisplayName")) ? "" : __t) + '<div class="purechat-italic">' + (null == (__t = o.UserWidgetSettings.get("Company")) ? "" : __t) + "</div>", 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-name"><i class="fa fa-pencil"></i></a>'), 
            __p += '</div></div><div class="purechat-social-buttons"><div class="editor-section"></div><div class="content-section">', 
            o.UserWidgetSettings.get("TwitterId") ? __p += '<a href="https://twitter.com/' + (null == (__t = o.UserWidgetSettings.get("TwitterId")) ? "" : __t) + '" target="_blank" class="purechat-twitter" data-tooltiptext="View ' + (null == (__t = o.UserWidgetSettings.get("DisplayName")) ? "" : __t) + '\'s Twitter profile"><i class="fa fa-twitter"></i></a>' : o.isInEditorMode && (__p += '<a href="https://twitter.com" target="_blank" class="purechat-twitter faded" data-tooltiptext="Add your Twitter username to allow people to tweet you"><i class="fa fa-twitter"></i></a>'), 
            o.UserWidgetSettings.get("FacebookId") ? __p += '<a href="https://' + (null == (__t = o.UserWidgetSettings.get("FacebookId")) ? "" : __t) + '" target="_blank" class="purechat-facebook" data-tooltiptext="View ' + (null == (__t = o.UserWidgetSettings.get("DisplayName")) ? "" : __t) + '\'s Facebook page"><i class="fa fa-facebook"></i></a>' : o.isInEditorMode && (__p += '<a href="https://www.facebook.com/" target="_blank" class="purechat-facebook faded" data-tooltiptext="Add your Facebook Id to allow people to post on your wall"><i class="fa fa-facebook"></i></a>'), 
            o.UserWidgetSettings.get("LinkedInId") ? __p += '<a href="https://' + (null == (__t = o.UserWidgetSettings.get("LinkedInId")) ? "" : __t) + '" target="_blank" class="purechat-linked-in" data-tooltiptext="View ' + (null == (__t = o.UserWidgetSettings.get("DisplayName")) ? "" : __t) + '\'s LinkedIn profile"><i class="fa fa-linkedin"></i></a>' : o.isInEditorMode && (__p += '<a href="https://www.linkedin.com/" target="_blank" class="purechat-linked-in faded" data-tooltiptext="Add your public LinkedIn url to allow people to view your LinkedIn profile"><i class="fa fa-linkedin"></i></a>'), 
            o.UserWidgetSettings.get("Email") ? __p += '<a href="mailto:' + (null == (__t = o.UserWidgetSettings.get("Email")) ? "" : __t) + '" target="_blank" class="purechat-send-email" data-tooltiptext="Send email to ' + (null == (__t = o.UserWidgetSettings.get("Email")) ? "" : __t) + '"><i class="fa fa-envelope"></i></a>' : o.isInEditorMode && (__p += '<a href="#" target="_blank" class="purechat-linked-in faded" data-tooltiptext="Add an email address to give people another method of contacting you"><i class="fa fa-envelope"></i></a>'), 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-social-buttons"><i class="fa fa-pencil"></i></a>'), 
            __p += '</div></div></div><div class="purechat-contact-details">', (o.isInEditorMode || o.UserWidgetSettings.get("Website")) && (__p += '<div class="purechat-website"><div class="editor-section"></div><div class="content-section"><a href="' + (null == (__t = o.UserWidgetSettings.get("Website") ? -1 != o.UserWidgetSettings.get("Website").search("http") ? o.UserWidgetSettings.get("Website") : "http://" + o.UserWidgetSettings.get("Website") : "#") ? "" : __t) + '" target="_blank"><i class="fa fa-globe"></i><span class="text">' + (null == (__t = o.UserWidgetSettings.get("Website") || '<span class="faded">Enter a website</span>') ? "" : __t) + "</span></a>", 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-website"><i class="fa fa-pencil"></i></a>'), 
            __p += "</div></div>"), (o.isInEditorMode || o.UserWidgetSettings.get("PhoneNumber")) && (__p += '<div class="purechat-phone personal"><div class="editor-section"></div><div class="content-section"><a title="Personal" href="tel:' + (null == (__t = o.UserWidgetSettings.get("PhoneNumber")) ? "" : __t) + '" target="_blank"><i class="fa fa-phone"></i><span class="text">' + (null == (__t = o.UserWidgetSettings.get("PhoneNumber") || '<span class="faded">Enter a phone number</span>') ? "" : __t) + "</span></a>", 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-phone"><i class="fa fa-pencil"></i></a>'), 
            __p += "</div></div>"), (o.isInEditorMode || o.UserWidgetSettings.get("Location")) && (__p += '<div class="purechat-location"><div class="editor-section"></div><div class="content-section"><!--<div class="purechat-personal-google-map-container" style="width: 100%; height: 200px;"></div>--><a title="Work" href="https://maps.google.com?q=' + (null == (__t = o.UserWidgetSettings.get("Location")) ? "" : __t) + '&zoom=12" target="_blank"><i class="fa fa-map-marker"></i><span class="text">' + (null == (__t = o.UserWidgetSettings.get("Location") || '<span class="faded">Enter a location</span>') ? "" : __t) + "</span></a>", 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-location"><i class="fa fa-pencil"></i></a>'), 
            __p += "</div></div>"), __p += '</div><div class="purechat-bio">', (o.isInEditorMode || o.UserWidgetSettings.get("Bio")) && (__p += '<div class="purechat-bio-text"><div class="editor-section"></div><div class="content-section">' + (null == (__t = (o.UserWidgetSettings.get("Bio") || '<span class="faded">Add additional information</span>').replace(/\n/g, "<br />")) ? "" : __t), 
            o.isInEditorMode && (__p += '<a class="purechat-edit-button" data-editorfor=".purechat-bio"><i class="fa fa-pencil"></i></a>'), 
            __p += "</div></div>"), __p += "</div></div></div>", o.RequestFromMobileDevice && (__p += '<div class="purechat-start-chat-button-container"><button type="button" class="button green start-chat">Start Chat</button></div>'), 
            __p;
        }, this.templates.StartChatForm = function(o) {
            var __t, __p = "", __e = _.escape;
            return Array.prototype.join, o.EmailForm ? __p += '<div class="purechat-enterinfo-container"><p data-resourcekey="noOperators_email_message">' + (null == (__t = purechatApp.Utils.linkify(o.getResource("noOperators_email_message"))) ? "" : __t) + "</p></div>" : (o.AskForName || o.AskForEmail || o.AskForQuestion) && (__p += '<div class="purechat-enterinfo-container"><p data-resourcekey="label_initial">' + (null == (__t = purechatApp.Utils.linkify(o.getResource("label_initial"))) ? "" : __t) + "</p></div>"), 
            __p += '<form class="purechat-form ' + (null == (__t = o.EmailForm ? "purechat-email-form" : "purechat-init-form") ? "" : __t) + '" action=""><p class="alert alert-error init-error general-error" style="display: none;"></p>', 
            o.AskForName && (__p += '<p class="alert alert-error init-error please-entername" style="display: none;">' + __e(o.getResource("error_enterName")) + '</p><label for="purechat-name-input">' + __e(o.getResource("placeholder_name")) + '</label><input type="text" class="purechat-name-input" autocomplete="off" name="purechat-name-input" id="purechat-name-input" maxlength="40" value="' + (null == (__t = o.InitialVisitorName) ? "" : __t) + '">'), 
            o.AskForEmail && (__p += '<p class="alert alert-error init-error please-enteremail" style="display: none;">' + __e(o.getResource("error_enterEmail")) + '</p><label for="purechat-email-input">' + __e(o.getResource("placeholder_email")) + '</label><input type="email" class="purechat-email-input" name="purechat-email-input" id="purechat-email-input" maxlength="100" value="' + (null == (__t = o.InitialVisitorEmail) ? "" : __t) + '">'), 
            o.AskForPhoneNumber && (__p += '<p class="alert alert-error init-error please-enterphonenumber" style="display: none;">' + __e(o.getResource("error_enterPhoneNumber")) + '</p><label for="purechat-phonenumber-input">' + __e(o.getResource("placeholder_phonenumber")) + '</label><input type="text" class="purechat-phonenumber-input" name="purechat-phonenumber-input" id="purechat-phonenumber-input" maxlength="30" value="' + (null == (__t = o.InitialVisitorPhoneNumber) ? "" : __t) + '">'), 
            o.AskForQuestion && (__p += '<p class="alert alert-error init-error please-enterquestion" style="display: none;">' + __e(o.getResource("error_enterQuestion")) + '</p><label for="purechat-question-input">' + __e(o.getResource("placeholder_question")) + '</label><textarea class="purechat-question-input" name="purechat-question-input" id="purechat-question-input" rows="3">' + (null == (__t = o.InitialVisitorQuestion) ? "" : __t) + "</textarea>"), 
            __p += o.EmailForm ? '<input type="submit" class="btn" id="purechat-name-submit" value="' + __e(o.getResource("button_sendEmail")) + '" style="' + (null == (__t = o.AskForName || o.AskForQuestion || o.AskForEmail ? "" : "margin-top: 20px !important;") ? "" : __t) + ' display: inline"><span class="purechat-email-error">An Error Occurred</span>' : '<input type="submit" class="btn" id="purechat-name-submit" value="' + __e(o.getResource("button_startChat")) + '" style="' + (null == (__t = o.AskForName || o.AskForQuestion || o.AskForEmail ? "" : "margin-top: 20px !important;") ? "" : __t) + '">', 
            __p += "</form>";
        }, this.templates.StartChatFormAutomatically = function(o) {
            var __t, __p = "", __e = _.escape;
            return Array.prototype.join, __p += '<div class="purechat-content purechat-widget-content ' + (null == (__t = o.isMobile() ? "mobile fake-chat" : "") ? "" : __t) + '" style=""><div class="message-list-view"><div class="purechat-message-display-container"><div class="purechat-message-display purechat-clearfix"><div class="purechat-message-wrapper purechat-clearfix"><div data-resourcekey="" class="purechat-message-container purechat-message-left">', 
            o.isPersonalChat() && (__p += '<img class="gravitar operator-gravatar left" height="50" width="50" src="' + (null == (__t = o.personalAvatarUrl()) ? "" : __t) + '" alt="Operator avatar" />'), 
            __p += '<div class="purechat-message"><span>' + __e(o.getResource("chat_startedMessage")) + '</span> <span class="message-time-separator">-</span> <span class="time">4:05:28 PM</span></div><div class="timestamp"><span class="time">4:05:28 PM</span></div></div></div></div></div><div class="purechat-user-status"></div><div class="purechat-send-form-container"><form class="purechat-send-form purechat-form" action=""><p class="alert alert-error init-error general-error" style="display: none;"></p><textarea class="purechat-send-form-message purechat-question-input" name="purechat-question-input" id="purechat-question-input" rows="3">' + (null == (__t = o.InitialVisitorQuestion) ? "" : __t) + '</textarea></form></div><div class="purechat-confirm-close-modal" style="display: none;"><span class="message">Are you sure you want to close the chat?</span><div class="modal-button-bar"><button type="button" class="btn kill-chat">Yes</button><button type="button" class="btn cancel">No</button></div></div></div></div>';
        }, this.templates.UnsupportedBrowser = function(o) {
            var __p = "";
            return _.escape, __p += '<p class="purechat-message-note purechat-unitalic">Sorry, but it appears that you are using a browser that is incompatible with Pure Chat\'s technology. <i class="emoticon emote-sad"></i></p><p class="purechat-message-note purechat-unitalic">In order to use Pure Chat\'s live chat capabilities, please upgrade your browser to a newer version, or use one of these recommended alternative browsers:<ul><li><a href="https://www.google.com/chrome" target="_blank">Google Chrome</a></li><li><a href="https://www.mozilla.org/firefox/new" target="_blank">Mozilla Firefox</a></li></ul></p>';
        }, this.templates.Widget = function(o) {
            var __t, __p = "", __e = _.escape, mobile = (Array.prototype.join, o.get("RequestFromMobileDevice") && o.get("AllowWidgetOnMobile")), isPersonalChat = o.get("isPersonalChat");
            return __p += '<div class="purechat-expanded"><div class="purechat-collapsed-outer"><div class="purechat-widget-inner purechat-clearfix">', 
            o.get("isPersonalChat") && (__p += '<div class="purechat-personal-details-container ' + (null == (__t = o.get("isInEditorMode") ? "personal-editor-active" : "") ? "" : __t) + '"></div>'), 
            __p += '<div class="' + (null == (__t = o.get("isPersonalChat") ? "purechat-personal-widget-content-wrapper" : "purechat-widget-content-wrapper") ? "" : __t) + '"><div class="purechat-widget-header" data-trigger="collapse">', 
            __p += isPersonalChat ? '<div class="purechat-menu btn-toolbar"><button data-trigger="restartChat" class="btn btn-mini btn-restart" title="Start a new chat" style="display: none;"><i class="pc-icon-repeat" title="Start a new chat"></i></button><button data-trigger="closeChat" class="btn btn-mini btn-close" title="Close chat session" style="display: none;"><i class="pc-icon-remove"></i></button></div>' : '<div class="purechat-menu btn-toolbar"><button data-trigger="restartChat" class="btn btn-mini btn-restart" title="Start a new chat" style="display: inline-block;"><i class="pc-icon-repeat" title="Start a new chat"></i></button><button data-trigger="popOutChat" class="btn btn-mini btn-pop-out" title="Pop out" style="display: inline-block;"><i class="pc-icon-share"></i></button><button data-trigger="expand" class="btn btn-mini actions btn-expand" title="Expand Widget" style="display: inline-block;"><i class="pc-icon-plus"></i></button><button data-trigger="collapse" class="btn btn-mini actions btn-collapse" title="Collapse Widget" style="display: inline-block;"><i class="pc-icon-minus"></i></button><button data-trigger="closeChat" class="btn btn-mini btn-close" title="Close chat session" style="display: inline-block;"><i class="pc-icon-remove"></i></button></div>', 
            __p += '<div class="purechat-widget-title"><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-32.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way small" alt="" /><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-64.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way large" alt="" />', 
            isPersonalChat && mobile && (__p += '<a class="purechat-show-personal-details" href="#"><i class="fa fa-chevron-left"></i></a>'), 
            __p += '&nbsp;<span class="purechat-widget-room-avatar" style="display: none;"></span><span class="purechat-widget-title-link"></span></div></div><div class="purechat-content-wrapper"><div class="purechat-content"></div>', 
            o.get("RemoveBranding") ? o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>') : isPersonalChat ? (__p += '<div class="purechat-poweredby-container"><div class="purechat-poweredby"><span>' + __e(o.getResource("poweredby")) + ' </span><a target="_blank" href="' + (null == (__t = o.poweredByUrl()) ? "" : __t) + '">Pure Chat</a></div></div>', 
            o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications purechat-bottom-left"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>')) : o.get("RequestFromMobileDevice") && o.get("AllowWidgetOnMobile") ? (__p += '<div style="display: block; width: 100% !important; font-size: 10px !important; margin-bottom: 10px !important; position: absolute !important; bottom: 0 !important; left: 0 !important;"><span style="font-size: 10px !important;">' + __e(o.getResource("poweredby")) + ' </span><a target="_blank" href="' + (null == (__t = o.poweredByUrl()) ? "" : __t) + '" style="font-size: 10px !important;">Pure Chat</a>', 
            o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications purechat-bottom-left"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>'), 
            __p += "</div>") : (__p += '<div style="display: block; font-size: 10px !important; margin-bottom: 10px !important; padding-right: 10px !important;"><span style="font-size: 10px !important;">' + __e(o.getResource("poweredby")) + ' </span><a target="_blank" href="' + (null == (__t = o.poweredByUrl()) ? "" : __t) + '" style="font-size: 10px !important; text-decoration: underline !important;">Pure Chat</a>', 
            o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications purechat-bottom-left"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>'), 
            __p += "</div>"), __p += '</div></div></div></div></div><div class="purechat-button-expand purechat-collapsed ' + (null == (__t = o.get("CollapsedWidgetImageUrl") ? "purechat-collapsed-image" : "purechat-collapsed-default") ? "" : __t) + '">', 
            !mobile && o.get("CollapsedWidgetImageUrl") && o.showImage() && !o.isTabTop() && (__p += '<img class="collapsed-image" src="' + (null == (__t = o.absoluteCollapsedImageUrl()) ? "" : __t) + '" data-trigger="expand" style="' + (null == (__t = o.collapsedImageCss()) ? "" : __t) + '" />'), 
            o.showTab() && (__p += '<div class="purechat-collapsed-outer" data-trigger="expand"><div class="purechat-widget-inner purechat-clearfix"><div class="purechat-widget-header">', 
            mobile && (__p += '<button type="button" class="purechat-expand-mobile-button" style="opacity: 0;">' + __e(o.getResource("mobile_expandButton")) + "</button>"), 
            __p += '<div class="purechat-menu btn-toolbar">', mobile || o.get("isDirectAccess") || !o.get("ShowMinimizeWidgetButton") || (__p += '<button type="button" data-trigger="superMinimize" class="btn btn-mini actions purechat-super-minimize-link-button" style="display: inline-block;"><i class="pc-icon-caret-down"></i></button>'), 
            __p += '<button data-trigger="expand" class="btn btn-mini actions btn-expand" title="Expand Widget" style="display: inline-block;"><i class="pc-icon-plus"></i></button><button data-trigger="collapse" class="btn btn-mini actions btn-collapse" title="Collapse Widget" style="display: inline-block;"><i class="pc-icon-minus"></i></button></div><div class="purechat-widget-title">', 
            isPersonalChat && mobile && (__p += '<a class="purechat-show-personal-details" href="#"><i class="fa fa-chevron-left"></i></a>'), 
            __p += '&nbsp;<span class="purechat-widget-room-avatar" style="display: none;"></span><span class="purechat-widget-title-link">' + __e(o.getResource("title_initial")) + "</span></div></div></div></div>"), 
            !mobile && o.get("CollapsedWidgetImageUrl") && o.showImage() && o.isTabTop() && (__p += '<img class="collapsed-image" src="' + (null == (__t = o.absoluteCollapsedImageUrl()) ? "" : __t) + '" data-trigger="expand" style="' + (null == (__t = o.collapsedImageCss()) ? "" : __t) + '" />'), 
            __p += '</div><div class="purechat-mobile-overlay hide"></div>';
        }, this.templates.WidgetDirectAccess = function(o) {
            var __t, __p = "", __e = _.escape;
            return Array.prototype.join, __p += '<div class="purechat-expanded"><div class="purechat-widget-inner purechat-clearfix"><div class="purechat-widget-header"><div class="purechat-menu btn-toolbar"><button data-trigger="restartChat" class="btn btn-mini btn-restart" title="Start a new chat"><i class="pc-icon-repeat" title="Start a new chat"></i></button><button data-trigger="closeChat" class="btn btn-mini btn-close" title="Close chat session"><i class="pc-icon-remove"></i></button></div><div class="purechat-widget-title"><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-32.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way small" alt="" /><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-64.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way large" alt="" />', 
            o.get("RequestFromMobileDevice") && o.get("AllowWidgetOnMobile") || (__p += '<img class="purechat-title-image" src="' + (null == (__t = o.absoluteUrl("/Content/images/icon-small.png")) ? "" : __t) + '">'), 
            __p += '&nbsp;<span class="purechat-widget-room-avatar" style="display: none;"></span><span class="purechat-widget-title-link"></span></div></div><div class="purechat-content"></div>', 
            o.get("RemoveBranding") || (__p += '<div class="purechat-poweredby-container"><span class="purechat-poweredby">' + __e(o.getResource("poweredby")) + ' </span><a target="_blank" href="' + (null == (__t = o.poweredByUrl()) ? "" : __t) + '">PureChat.com</a></div>'), 
            o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications purechat-bottom-left"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>'), 
            __p += "</div></div>";
        }, this.templates.WidgetOperator = function(o) {
            var __p = "";
            return _.escape, Array.prototype.join, __p += '<div class="purechat-widget-inner purechat-clearfix"><div class="purechat-widget-header"><div class="menu btn-toolbar"><span data-trigger="cannedResponses" class="purechat-canned-responses btn-group"><a class="dropdown-toggle btn" data-toggle="dropdown" data-ajax="false">&nbsp;<i class="icon-ellipsis-horizontal icon-white"></i>&nbsp;</a><ul class="dropdown-menu bottom-up"></ul></span>', 
            __p += o.attributes.isInvisible ? '<button data-trigger="requeueChat" class="btn btn-mini requeue-button"><i class="fa fa-reply"></i><span class="text">Leave</span></button><button data-trigger="removeWidget" class="btn btn-mini closewidget-button"><span class="text">Done</span></button>' : '<button data-trigger="exportToOntime" class="btn btn-mini leave-button"><span class="text">Export</span></button><button data-trigger="requeueChat" class="btn btn-mini requeue-button"><i class="fa fa-reply"></i><span class="text">Requeue</span></button><button data-trigger="removeWidget" class="btn btn-mini closewidget-button"><span class="text">Done</span></button><button data-trigger="closeChat" data-trigger-params=\'{"confirmation": "Are you sure you want to close this chat?"}\'  class="btn btn-mini requeue close-button"><span class="text">End Chat</span></button>', 
            __p += '</div><div class="purechat-widget-title"><a class="purechat-widget-title-link"></a></div></div><div class="purechat-chat-info"></div><div class="purechat-content"></div><div class="purechat-poweredby-container"></div></div>';
        }, this.templates.WidgetPoppedOut = function(o) {
            var __t, __p = "", __e = _.escape;
            return Array.prototype.join, __p += '<div class="purechat-window purechat-expanded"><div class="purechat-widget-inner purechat-clearfix"><div class="purechat-widget-header"><div class="purechat-menu btn-toolbar"><button data-trigger="restartChat" class="btn btn-mini btn-restart" title="Start a new chat"><i class="pc-icon-repeat" title="Start a new chat"></i></button><button data-trigger="closeChat" class="btn btn-mini btn-close" title="Close chat session"><i class="pc-icon-remove"></i></button></div><div class="purechat-widget-title"><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-32.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way small" alt="" /><img src="' + (null == (__t = o.absoluteUrl("/Content/images/widget-logo-64.png")) ? "" : __t) + '" class="purechat-title-image-out-of-way large" alt="" />', 
            __p += o.get("RequestFromMobileDevice") && o.get("AllowWidgetOnMobile") ? '<img src="' + (null == (__t = o.absoluteUrl("/content/images/widget-logo-32-highlight.png")) ? "" : __t) + '" alt="" class="purechat-title-image-out-of-way-hilight small" /><img src="' + (null == (__t = o.absoluteUrl("/content/images/widget-logo-64-highlight.png")) ? "" : __t) + '" alt="" class="purechat-title-image-out-of-way-hilight large" />&nbsp;<span class="purechat-widget-title-link">PureChat</span>' : '<img class="purechat-title-image" src="' + (null == (__t = o.absoluteUrl("/Content/images/icon-small.png")) ? "" : __t) + '">&nbsp;<span class="purechat-widget-title-link">PureChat</span>', 
            __p += '</div></div><div class="purechat-content-wrapper"><div class="purechat-content"></div>', 
            o.get("RemoveBranding") || (__p += '<div class="purechat-poweredby-container"><span class="purechat-poweredby">' + __e(o.getResource("poweredby")) + ' </span><a target="_blank" href="' + (null == (__t = o.poweredByUrl()) ? "" : __t) + '">PureChat.com</a></div>'), 
            o.showPlaySoundCheckbox() && (__p += '<a href="#" class="purechat-toggle-audio-notifications purechat-bottom-left"><i class="fa ' + (null == (__t = o.playSoundOnNewMessage() ? "pc-icon-unmute" : "pc-icon-mute") ? "" : __t) + '"></i></a>'), 
            __p += '</div></div></div><div class="purechat-widget purechat-collapsed">', __p += o.get("CollapsedWidgetImageUrl") ? '<img src="' + (null == (__t = o.get("CollapsedWidgetImageUrl")) ? "" : __t) + '" data-trigger="expand" />' : '<div class="purechat-widget-inner purechat-clearfix"><div class="purechat-widget-header"><div class="purechat-menu btn-toolbar"><!-- <button data-trigger="restartChat" class="btn btn-mini btn-restart" title="Start a new chat"><i class="pc-icon-restart" title="Start a new chat"></i></button><button data-trigger="popOutChat" class="btn btn-mini btn-pop-out" title="Pop out"><i class="pc-icon-share"></i></button><button data-trigger="closeChat" class="btn btn-mini btn-close" title="Close chat session"><i class="pc-icon-remove"></i></button>--><button data-trigger="expand" class="btn btn-mini actions btn-expand" title="Expand Widget"><i class="pc-icon-plus"></i></button><button data-trigger="collapse" class="btn btn-mini actions btn-collapse" title="Collapse Widget"><i class="pc-icon-minus"></i></button></div><div class="purechat-widget-title"><!-- <img class="purechat-title-image" src="' + (null == (__t = o.pureServerUrl) ? "" : __t) + '/Content/images/icon-small.png">&nbsp;<span class="purechat-widget-title-link">PureChat</span>--><img class="purechat-title-image" src="' + (null == (__t = o.absoluteUrl("/Content/images/icon-small.png")) ? "" : __t) + '">&nbsp;<span class="purechat-widget-title-link">PureChat</span></div></div></div>', 
            __p += "</div>";
        };
    }({}, function() {
        return this;
    }()), purechatApp.module("Models", function(Models, app, Backbone, Marionette, $, _) {
        Models.Chat = Backbone.RelationalModel.extend({
            defaults: function() {
                return {
                    participants: new Models.ChatParticipantCollection()
                };
            },
            relations: [ {
                type: Backbone.HasMany,
                key: "messages",
                relatedModel: "Message",
                collectionType: "MessageCollection",
                reverseRelation: {
                    key: "chat"
                }
            }, {
                type: Backbone.HasMany,
                key: "operators",
                relatedModel: "Operator",
                collectionType: "OperatorCollection",
                reverseRelation: {
                    key: "chat"
                }
            }, {
                type: Backbone.HasMany,
                key: "participants",
                relatedModel: "ChatParticipant",
                collectionType: "ChatParticipantCollection",
                reverseRelation: {
                    key: "chat"
                }
            } ],
            chatUserNames: function() {
                var userNames = "";
                return this.get("operators").forEach(function(next) {
                    "" != userNames && (userNames += ", "), userNames += next.get("userDisplayName");
                }), userNames;
            },
            isInChat: function() {
                return this.get("userId") && this.get("chatId") && this.get("authToken");
            }
        }), Models.Message = Backbone.RelationalModel.extend({
            events: {
                "change:messageResource": function() {
                    alert("test");
                }
            }
        }), Models.MessageCollection = Backbone.Collection.extend({
            model: Models.Message
        }), Models.Operator = Backbone.RelationalModel.extend({
            idAttribute: "userId"
        }), Models.OperatorCollection = Backbone.Collection.extend({
            model: Models.Operator
        }), Models.ChatParticipant = Backbone.RelationalModel.extend({
            idAttribute: "userId"
        }), Models.ChatParticipantCollection = Backbone.Collection.extend({
            model: Models.ChatParticipant,
            getOperatorTypingText: function(resourceManger) {
                var typingOperators = this.where({
                    isTyping: !0
                });
                if (typingOperators && 0 !== typingOperators.length) {
                    var typingMessage = "";
                    return _.each(typingOperators, function(next, index) {
                        0 != index && (typingMessage += ", ");
                        var displayName = next.get("displayName");
                        typingMessage = "<span data-resourcekey='chat_typing'>" + typingMessage + resourceManger.getResource("chat_typing", {
                            displayName: displayName
                        }) + "...</span>";
                    }), typingMessage;
                }
                return "";
            }
        }), Models.WidgetSettings = Backbone.RelationalModel.extend({
            getResource: function(key, data) {
                var resources = this.get("StringResources");
                if (!resources) return key;
                if (data) {
                    var format = resources[key] || "";
                    return self.compiledResources || (self.compiledResources = {}), self.compiledResources[format] || (self.compiledResources[format] = pc_.template(format, null, {
                        interpolate: /\{(.+?)\}/g
                    })), self.compiledResources[format](data);
                }
                return resources[key];
            },
            isTabTop: function() {
                return 3 == this.get("Position") || 4 == this.get("Position");
            },
            isTabLeft: function() {
                return 1 == this.get("Position") || 3 == this.get("Position");
            },
            showTab: function() {
                var mobileOverride = this.get("RequestFromMobileDevice") && this.get("AllowWidgetOnMobile");
                return this.get("CollapsedStyle") == app.Constants.WidgetType.Tab || this.get("CollapsedStyle") == app.Constants.WidgetType.ImageTab || mobileOverride && this.get("CollapsedStyle") != app.Constants.WidgetType.Button;
            },
            showImage: function() {
                return this.get("CollapsedStyle") == app.Constants.WidgetType.Image || this.get("CollapsedStyle") == app.Constants.WidgetType.ImageTab;
            },
            collapsedImageCss: function() {
                var scale = this.get("Scale") / 100, scaledWidth = this.get("ImageWidth") * scale, scaledHeight = this.get("ImageHeight") * scale, yOffset = 0;
                this.isTabTop() ? (yOffset = this.showTab() ? 60 : 0, yOffset += this.get("ImageYOffset") || 0) : (yOffset = -(scaledHeight + (this.get("ImageYOffset") || 0)), 
                this.showTab() || (yOffset -= 10));
                var scaleCss = [ "position:absolute;", "margin-top: " + yOffset + "px;", "width: " + this.get("ImageWidth") * scale + "px;", "max-width: " + this.get("ImageWidth") * scale + "px;", "top: 0px;", "z-index: " + (this.get("ImageTop") ? 2 : 0) + ";" ];
                return this.showTab() ? (scaleCss.push("left: 50%;"), scaleCss.push("margin-left: " + -(scaledWidth / 2 - (this.get("ImageXOffset") || 0)) + "px;")) : this.isTabLeft() ? (scaleCss.push("left: 50%;"), 
                scaleCss.push("margin-left: " + (this.get("ImageXOffset") || 0) + "px;")) : (scaleCss.push("right: 50%;"), 
                scaleCss.push("margin-right: " + -(this.get("ImageXOffset") || 0) + "px;")), scaleCss.join("");
            },
            poweredByUrl: function() {
                return "http://www.purechat.com?utm_source=" + encodeURIComponent(location.hostname) + "&utm_medium=widget&utm_campaign=poweredby";
            },
            absoluteCollapsedImageUrl: function() {
                return this.get("cdnServerUrl") + this.get("CollapsedWidgetImageUrl");
            },
            absoluteUrl: function(path) {
                return this.get("cdnServerUrl") + path;
            },
            formatDateTime: function(dateString) {
                var d = new Date(dateString), formattedDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
                return formattedDate += " " + (d.getHours() % 12 == 0 ? "12" : d.getHours() % 12) + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + (d.getHours() >= 12 ? "PM" : "AM");
            },
            browserIsUnsupported: function() {
                var unsupported = !1, browserDetails = this.get("BrowserDetails");
                switch (browserDetails.Version = parseFloat(browserDetails.Version), browserDetails.Browser.toLowerCase().replace(/s+/g, "")) {
                  case "internetexplorer":
                  case "ie":
                    browserDetails.Version <= 9 && (unsupported = !0);
                    break;

                  case "safari":
                    browserDetails.Version < 5 && (unsupported = !0);
                    break;

                  case "opera":
                    browserDetails.Version < 12 && (unsupported = !0);
                }
                return unsupported;
            }
        }), Models.WidgetSettingsCollection = Backbone.Collection.extend({
            model: Models.WidgetSettings
        }), Models.ChatConnection = Backbone.Model.extend({
            defaults: {
                chatClosed: !1
            },
            initialize: function(data, options) {
                var self = this;
                options.isOperator || options.poppedOut || setInterval(function() {
                    self.loadFromLocalStorage();
                }, 2e3), this.listenTo(this, "change:userId, change:authToken, change:chatClosed", function() {
                    this.trigger("change:isInChat", this, this.isInChat());
                });
            },
            persistedKeys: [ "userId", "authToken", "roomId", "chatId", "visitorName", "disabled", "chatActiveInOtherWindow", "chatClosed", "expandSource" ],
            persistLocalStorage: function() {
                var self = this;
                return _.each(self.persistedKeys, function(key) {
                    void 0 != self.get(key) && (localStorage[key] = self.get(key));
                }), self;
            },
            clearLocalStorage: function() {
                var self = this;
                return _.each(self.persistedKeys, function(key) {
                    delete localStorage[key];
                }), this.clear(), self;
            },
            loadFromLocalStorage: function() {
                var self = this;
                return _.each(self.persistedKeys, function(key) {
                    self.set(key, localStorage[key]);
                }), self;
            },
            isInChat: function() {
                return this.get("userId") && this.get("authToken") && (_.isUndefined(this.get("chatClosed")) || "false" == this.get("chatClosed") || !this.get("chatClosed"));
            }
        });
    }), Backbone.View.prototype.getResource = function(key, data) {
        return marionette.getOption(this, "rm").getResource(key, pc_.defaults(data || {}, {
            chatUserNames: ""
        }));
    }, Marionette.View.prototype.mixinTemplateHelpers = function(target) {
        target = target || {};
        var templateHelpers = this.templateHelpers || {};
        return pc_.isFunction(templateHelpers) && (templateHelpers = templateHelpers.call(this)), 
        target.getResource = pc_.bind(backbone.View.prototype.getResource, this), pc_.extend(target, templateHelpers);
    }, Marionette.Renderer.render = function(template, data) {
        var t = purechatApp.templates || templates;
        "string" == typeof template && t[template] && (template = t[template]);
        var templateFunc = "function" == typeof template ? template : Marionette.TemplateCache.get(template), html = templateFunc(data);
        return html.trim();
    }, purechatApp.module("Views", function(Views, app, Backbone, Marionette, $, _, Models) {
        var notifier = new app.Utils.Notifier();
        Views.WidgetLayout = Marionette.LayoutView.extend({
            template: null,
            className: "purechat",
            windowHeightOnLoad: 0,
            optionsStepShown: !1,
            maxWidth: 700,
            _audioNotificationLocalStorageKey: "_purechatVisitorWidgetPlaySound",
            regions: {
                content: ".purechat-content",
                personalDetails: ".purechat-personal-details-container"
            },
            events: {
                "click [data-trigger]": "executeCommand",
                mouseenter: "peekWidget",
                mouseleave: "unpeekWidget",
                "click .purechat-show-personal-details": "showPersonalDetailsOnMobile",
                "click .purechat-toggle-audio-notifications": "updatePlayAudioLocalStorage"
            },
            childEvents: {
                roomHostChanged: function(view, model) {
                    this.showRoomHostAvatar(model.get("roomHostAvatarUrl"), model.get("expanded")), 
                    this.updateRoomHostName(model.get("roomHostName"));
                }
            },
            modelEvents: {
                "change:operatorsAvailable": "operatorsAvailableChanged"
            },
            ui: {
                content: ".purechat-content",
                titleWrapper: ".purechat-collapsed .purechat-widget-title",
                title: ".purechat-expanded .purechat-widget-title-link",
                collapsedTitle: ".purechat-collapsed .purechat-widget-title-link",
                popoutButton: '[data-trigger="popOutChat"]',
                closeButton: '[data-trigger="closeChat"]',
                removeWidgetButton: '[data-trigger="removeWidget"]',
                restartButton: '[data-trigger="restartChat"]',
                requeueButton: '[data-trigger="requeueChat"]',
                leaveButton: '[data-trigger="leaveChat"]',
                widgetCollapsed: ".purechat-collapsed",
                widgetExpanded: ".purechat-expanded",
                collapseImage: ".collapsed-image",
                personalDetails: ".purechat-personal-details-container",
                expandMobileButton: ".purechat-expand-mobile-button",
                menuBar: ".purechat-collapsed .purechat-menu",
                poweredBy: ".purechat-content-wrapper div:last-child",
                poweredByHosted: ".purechat-poweredby-container",
                roomAvatarUrl: ".purechat-widget-room-avatar",
                purechatTitleImage: ".purechat-title-image"
            },
            templateHelpers: function() {
                return this.settings;
            },
            updatePlayAudioLocalStorage: function(e) {
                var sender = $(e.currentTarget), icon = sender.find("i");
                return icon.hasClass("pc-icon-unmute") ? (localStorage[this._audioNotificationLocalStorageKey] = !1, 
                icon.removeClass("pc-icon-unmute").addClass("pc-icon-mute")) : (localStorage[this._audioNotificationLocalStorageKey] = !0, 
                icon.addClass("pc-icon-unmute").removeClass("pc-icon-mute")), !1;
            },
            hideRoomHostAvatar: function() {
                this.ui.roomAvatarUrl.removeAttr("style").hide(), this.ui.title.removeClass("purechat-has-room-avatar"), 
                this.ui.purechatTitleImage.show();
            },
            showRoomHostAvatar: function(url, isExpanded) {
                "undefined" != typeof isExpanded && (url && isExpanded ? (this.ui.roomAvatarUrl.css({
                    "background-image": "url(" + url + ")"
                }).show(), this.ui.title.addClass("purechat-has-room-avatar"), this.ui.purechatTitleImage.hide()) : this.hideRoomHostAvatar());
            },
            updateRoomHostName: function(name) {
                name ? this.setTitle(this.getResource("chat_nowChattingWith", {
                    chatUserNames: [ name ]
                }), "chat_nowChattingWith") : this.setTitle(this.getResource("title_initial"), null, "title_initial");
            },
            showPersonalDetailsOnMobile: function() {
                var self = this;
                return this.$el.find(".purechat-personal-details-container").removeClass("hide"), 
                setTimeout(function() {
                    self.$el.find(".purechat-personal-details-container").css({
                        left: 0
                    });
                }, 10), !1;
            },
            resetPoweredBy: function() {
                this.settings.get("RemoveBranding") || this.settings.get("isOperator") || (this.ui.poweredBy.html(this._originalPoweredBy), 
                this.ui.poweredByHosted.html(this._originalPoweredBy), this.settings.get("isPersonalChat") || (this.ui.poweredBy.css({
                    "text-align": "right"
                }), this.ui.poweredByHosted.css({
                    "text-align": "right"
                })));
            },
            updatePoweredBy: function(content) {
                this.settings.get("isOperator") || !content || this.settings.get("RemoveBranding") || (this.ui.poweredBy.html(content), 
                this.ui.poweredByHosted.html(content), this.settings.get("isPersonalChat") || (this.ui.poweredBy.css({
                    "text-align": "center"
                }), this.ui.poweredByHosted.css({
                    "text-align": "center"
                })));
            },
            bindAppCommands: function() {
                var self = this;
                try {
                    app.commands.removeHandler("poweredby:update"), app.commands.removeHandler("poweredby:reset");
                } catch (ex) {} finally {
                    app.commands.setHandler("poweredby:update", function() {
                        self.updatePoweredBy.apply(self, arguments);
                    }), app.commands.setHandler("poweredby:reset", function() {
                        self.resetPoweredBy.apply(self, arguments);
                    });
                }
            },
            initialize: function() {
                var self = this;
                this.model.set("superMinimize", "true" == (window.localStorage.superMinimize || "false").toLowerCase()), 
                Marionette.LayoutView.prototype.initialize.call(this), this.settings = Marionette.getOption(this, "widgetSettings"), 
                this.settings.get("isDirectAccess") ? (this.template = "WidgetDirectAccess", this.$el.addClass("purechat-widget purechat-hosted-widget")) : this.settings.get("isOperator") ? (this.template = "WidgetOperator", 
                this.$el.addClass("purechat-operator")) : this.settings.get("poppedOut") ? (this.template = "WidgetPoppedOut", 
                this.$el.addClass("purechat-window purechat-popped-out-widget")) : (this.template = "Widget", 
                this.$el.addClass("purechat-widget hide"));
                var positionCssClasses = this.settings.get("WidgetType") == app.Constants.WidgetType.Button ? "purechat-widget-button" : "";
                if (!this.model.get("isPoppedOut") && !this.settings.get("isDirectAccess")) {
                    var position = this.settings.get("Position");
                    1 === position ? positionCssClasses = "purechat-bottom purechat-bottom-left" : 2 === position ? positionCssClasses = "purechat-bottom purechat-bottom-right" : 3 === position ? positionCssClasses = "purechat-top purechat-top-left" : 4 === position && (positionCssClasses = "purechat-top purechat-top-right"), 
                    this.$el.addClass(positionCssClasses);
                }
                this.listenTo(this.settings, "change", _.bind(this.updateImageTransform, this)), 
                this.windowHeightOnLoad = $(window).height(), this.settings.get("RequestFromMobileDevice") && this.settings.get("AllowWidgetOnMobile") && $("head").append('<style type="text/css" class="purechat-dynamic-mobile-styles"></style>'), 
                this.bindAppCommands(), this.settings.showPlaySoundCheckbox = function() {
                    return !self.settings.get("isOperator") || self.settings.get("isPersonalChat");
                }, this.settings.playSoundOnNewMessage = function() {
                    return "true" == (localStorage[self._audioNotificationLocalStorageKey] || "false").toLowerCase();
                };
            },
            setTitle: function(title, resourceKey) {
                this.ui.title.text(title).attr("title", title), this.ui.title.attr("data-resourcekey", resourceKey), 
                this.ui.collapsedTitle.text(title).attr("title", title), this.ui.collapsedTitle.attr("data-resourcekey", resourceKey), 
                this.options.widgetSettings.get("isPersonalChat") && this.options.widgetSettings.get("isInEditorMode") ? (this.ui.title.data("isTitleEditor", !0), 
                this.ui.collapsedTitle.data("isTitleEditor", !0), window.pcPersonalEditor.execute("editButton:show", [ this.ui.title, this.ui.collapsedTitle ])) : this.model.get("isPoppedOut") && (window.document.title = title);
            },
            updateImageTransform: function(model, value) {
                this.ui.collapseImage && this.ui.collapseImage.attr && this.ui.collapseImage.attr("style", this.options.widgetSettings.collapsedImageCss());
            },
            hideAdditionalDetails: function(e) {
                this.$el.find(".purechat-widget-sliding-panel").removeClass("expanded").addClass("collapsed"), 
                this.$el.find(".additional-details").removeClass("hide"), this.$el.find(".purechat-widget-inner").removeClass("expanded"), 
                this.$el.css({
                    width: this.maxWidth - 200
                });
            },
            showAdditionalDetails: function() {
                var context = this, slidingPanel = context.$el.find(".purechat-widget-sliding-panel"), spinner = slidingPanel.find(".spinner");
                spinner.removeClass("hide");
                var headerHeight = context.$el.find(".purechat-widget-inner .purechat-widget-header").outerHeight();
                context.$el.find(".purechat-widget-inner").addClass("expanded"), slidingPanel.find(".purechat-widget-header").css({
                    height: headerHeight,
                    lineHeight: headerHeight + "px"
                }), slidingPanel.find(".purechat-additional-content").css({
                    top: headerHeight
                }), slidingPanel.removeClass("collapsed").addClass("expanded"), spinner.addClass("hide");
            },
            executeCommand: function(e) {
                if (e.preventDefault(), e.stopPropagation(), !this.settings.get("isInEditorMode")) {
                    var $this = $(e.currentTarget), command = $this.data("trigger"), commandParams = $this.data("trigger-params");
                    return this.minimizeOnLoadTimeout && (this.minimizeOnLoadTimeout = clearTimeout(this.minimizeOnLoadTimeout)), 
                    this.triggerMethod(command, commandParams, e);
                }
            },
            focusInput: function() {
                this.options.widgetSettings.get("isDemo") || this.settings.get("RequestFromMobileDevice") || this.$el.find(".purechat-name-input, .purechat-email-input, .purechat-question-input, .purechat-send-form-message").first().focus();
            },
            onRender: function() {
                var self = this;
                this.ui.expandMobileButton.hide(), this.ui.menuBar.hide(), this.ui.titleWrapper.hide(), 
                this.settings.get("isWidget") ? (this.ui.content.addClass("purechat-widget-content"), 
                self.options.widgetSettings.get("RequestFromMobileDevice") && this.ui.content.css({
                    "overflow-y": "auto"
                })) : (this.$el.addClass("purechat-window"), this.ui.content.addClass("purechat-window-content")), 
                this.operatorsAvailableChanged(), this.setTitle(this.settings.get("title") || "");
                var inRoomOnLoad = null !== this.settings.get("dataController").checkInRoom() && "undefined" != typeof this.settings.get("dataController").checkInRoom();
                this.settings.get("isDemo") || "true" != localStorage.expanded || this.settings.get("ForcePopout") || this.settings.get("usePrototypeFallback") || !inRoomOnLoad && this.settings.get("StartChatImmediately") ? this.model.get("superMinimize") ? (this.onCollapse(!0), 
                this.onSuperMinimize(null, null, !0)) : this.onCollapse(!0) : this.expand(!0, inRoomOnLoad), 
                self.imageLoaded = $.Deferred(), this.ui.collapseImage.length > 0 ? $(this.ui.collapseImage).load(function() {
                    self.imageLoaded.resolve();
                }) : self.imageLoaded.resolve(), this.settings.get("CollapsedStyle") == app.Constants.WidgetType.Button && $(".purechat-button-expand").css("visibility", "visible"), 
                this.$el.hasClass("purechat-top") && this.$el.find(".pc-icon-caret-down").removeClass("pc-icon-caret-down").addClass("pc-icon-caret-up"), 
                this.settings.get("isPersonalChat") && (1 == this.settings.get("UserWidgetSettings").get("BackgroundType") && this.settings.get("UserWidgetSettings").get("CustomBackgroundImage") && this.settings.get("UserWidgetSettings").get("CustomBackgroundImage").FileId ? $("#background-image").css({
                    "background-image": 'url("' + this.settings.get("pureServerUrl") + "/files/download/" + this.settings.get("UserWidgetSettings").get("CustomBackgroundImage").FileId + "." + this.settings.get("UserWidgetSettings").get("CustomBackgroundImage").FileExtension + '")'
                }) : 2 == this.settings.get("UserWidgetSettings").get("BackgroundType") && this.settings.get("UserWidgetSettings").get("StockBackgroundImage") && "none" != this.settings.get("UserWidgetSettings").get("StockBackgroundImage").Url.toLowerCase() ? $("#background-image").css({
                    "background-image": 'url("' + this.settings.get("pureServerUrl") + this.settings.get("UserWidgetSettings").get("StockBackgroundImage").Url + '")'
                }) : ($("#background-image").addClass("hide"), $("body").css({
                    backgroundColor: "#" + this.settings.get("UserWidgetSettings").get("BackgroundColor")
                }))), this._originalPoweredBy = this.ui.poweredBy.html() || this.ui.poweredByHosted.html();
            },
            getResizedImageDimensions: function(originalHeight, originalWidth, ratio) {
                return {
                    height: originalHeight * ratio,
                    width: originalWidth * ratio
                };
            },
            clearAutoExpandTimeout: function() {
                this._autoExpandTimeout && (this._autoExpandTimeout = clearTimeout(this._autoExpandTimeout));
            },
            normalizeMilliseconds: function(ms) {
                return 1e3 * ms;
            },
            setAutoExpandTimeout: function() {
                var self = this;
                this._autoExpandTimeout = setTimeout(function() {
                    self.expand(), self.clearAutoExpandTimeout();
                }, this.normalizeMilliseconds(this.settings.get("ExpandWidgetTimeout")));
            },
            onAfterInsertion: function() {
                var self = this, didExpandMobile = !1;
                this.model.get("isOperator") || self.settings.get("RequestFromMobileDevice") && self.settings.get("AllowWidgetOnMobile") && (self.$el.hasClass("purechat-widget-expanded") ? (self.expandMobile(), 
                didExpandMobile = !0) : self.collapseMobile(!0));
            },
            onSuperMinimize: function(args, e, doTimeout) {
                e && e.stopPropagation();
                var self = this, minFnc = function() {
                    self.$el.removeClass("purechat-widget-expanded purechat-widget-collapsed"), self.$el.addClass("purechat-widget-super-collapsed"), 
                    self.$el.find(".btn-toolbar .btn-expand").show(), self.$el.find(".btn-toolbar .btn-collapse, .purechat-widget-content, .collapsed-image, .purechat-super-minimize-link-button").hide();
                    var baseAmount = 2 * -(self.$el.outerHeight() / 4) - 4;
                    self.$el.hasClass("purechat-bottom-right") || self.$el.hasClass("purechat-bottom-left") ? self.$el.css({
                        bottom: baseAmount
                    }) : self.$el.css({
                        top: baseAmount
                    }), self.model.set("superMinimized", !0), window.localStorage.superMinimize = !0;
                };
                return doTimeout ? this.minimizeOnLoadTimeout = setTimeout(minFnc, 1e3) : minFnc(), 
                !1;
            },
            peekWidget: function() {
                this.settings.get("RequestFromMobileDevice") || this.$el.removeAttr("style");
            },
            unpeekWidget: function() {
                var self = this;
                !self.settings.get("RequestFromMobileDevice") && self.$el.hasClass("purechat-widget-super-collapsed") && (self.$el.hasClass("purechat-bottom-right") || self.$el.hasClass("purechat-bottom-left") ? self.$el.css({
                    bottom: 2 * -(self.$el.outerHeight() / 4) - 4
                }) : self.$el.css({
                    top: 2 * -(self.$el.outerHeight() / 4) - 4
                }));
            },
            operatorsAvailableChanged: function() {
                this.settings.get("isWidget") && (this.model.get("operatorsAvailable") ? (this.$el.addClass("purechat-button-available"), 
                this.$el.removeClass("purechat-button-unavailable"), this.$el.removeAttr("disabled", "disabled")) : (this.$el.removeClass("purechat-button-available"), 
                this.$el.addClass("purechat-button-unavailable"), 0 === this.options.widgetSettings.get("UnavailableBehavior") && (this.$el.addClass("purechat-button-hidden"), 
                this.$el.attr("disabled", "disabled"))));
            },
            onExpand: function(e, externalArgs) {
                var isCollapseCommand = externalArgs.collapse, superMinimize = externalArgs.superMinimize, self = this;
                self.options.widgetSettings.get("dataController").checkChatAvailable().done(function(result) {
                    self.model.set("operatorsAvailable", result.available), isCollapseCommand || superMinimize || self.expand();
                });
            },
            mobileResize: function() {
                this.collapseMobile();
            },
            expandMobile: function(firstLoad, callback) {
                var self = this, elem = self.$el;
                elem.find(".purechat-widget-content"), elem.find(".purechat-poweredby-container"), 
                elem.find(".purechat-widget-header");
                $(window).off("resize.RepositionWidget"), elem.removeClass("slide-out-of-way").css({
                    left: 0
                }), this.ui.expandMobileButton.hide(), (callback || function() {}).call(self), elem.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            },
            expand: function(firstLoad, inRoomOnLoad, args) {
                var self = this;
                self.$el.removeClass("purechat-widget-super-collapsed");
                var completeFnc = function() {
                    var defFnc = function() {
                        self.$el.find(".btn-toolbar .btn-expand").hide(), self.$el.find(".btn-toolbar .btn-collapse").show(), 
                        self.$el.find(".purechat-widget-content").show(), self.$el.find(".purechat-widget-content").parent().find("div:last").show(), 
                        self.showRoomHostAvatar(self.options.model.get("roomHostAvatarUrl")), self.ui.widgetCollapsed.hide(), 
                        self.ui.widgetExpanded.show();
                        var textbox = self.$el.find("input[type=text]:first");
                        self.settings.get("RequestFromMobileDevice") || (textbox.length > 0 ? textbox.trigger("focus") : self.$el.find("textarea:first").trigger("focus")), 
                        self.$el.removeClass("purechat-widget-collapsed"), self.$el.addClass("purechat-widget-expanded");
                    };
                    inRoomOnLoad || "PCStateChatting" == self.model.get("state") || "PCStateClosed" == self.model.get("state") || !self.settings.get("StartChatImmediately") || self.settings.get("isInEditorMode"), 
                    defFnc(), self.model.set({
                        expanded: !0
                    }), localStorage.expandSource = args ? args.expandSource : null, self.trigger("expanded"), 
                    self.triggerResizedEvent();
                };
                window.localStorage.superMinimize = !1, self.settings.get("isDemo") || (self.settings.get("isDirectAccess") || !self.settings.get("ForcePopout") || self.model.get("isPoppedOut")) && !self.settings.get("usePrototypeFallback") ? (self.settings.get("isDemo") || (localStorage.expanded = !0), 
                self.settings.get("RequestFromMobileDevice") && self.settings.get("AllowWidgetOnMobile") ? (self.expandMobile(firstLoad, completeFnc), 
                firstLoad && (completeFnc(), self.$el.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"))) : completeFnc()) : self.triggerMethod("popOutChat");
            },
            collapseMobile: function(firstLoad, callback) {
                var self = this;
                if (!self.settings.get("isDirectAccess") && !this.options.widgetSettings.get("isPersonalChat") && !self.model.get("isPoppedOut")) {
                    this.ui.titleWrapper.hide(), this.ui.menuBar.hide(), firstLoad || this.ui.expandMobileButton.show();
                    var elem = self.$el, windowWidth = $(window).width(), visibleButton = this.ui.expandMobileButton;
                    visibleButton.outerWidth();
                    this.options.widgetSettings.get("killForPreview") || (elem.addClass("slide-out-of-way").css({
                        left: windowWidth - visibleButton.outerWidth()
                    }), visibleButton.removeAttr("style")), (callback || function() {}).call(self), 
                    $(window).off("resize.RepositionWidget").on("resize.RepositionWidget", function() {
                        elem.addClass("nuke-transitions"), self.collapseMobile(), elem.removeClass("nuke-transitions");
                    });
                }
            },
            onCollapse: function(firstLoad) {
                var self = this;
                localStorage.removeItem("expandSource"), self.settings.get("isDemo") || (localStorage.expanded = !1), 
                self.$el.removeClass("purechat-widget-expanded"), self.$el.addClass("purechat-widget-collapsed"), 
                self.$el.find(".btn-toolbar .btn-expand, .collapsed-image, .purechat-super-minimize-link-button").show(), 
                self.$el.find(".btn-toolbar .btn-collapse, .purechat-widget-content").hide(), self.$el.find(".purechat-widget-content").parent().find("div:last").hide();
                var inChat = self.model.get("roomId") || self.settings.get("dataController").checkInRoom();
                this.hideRoomHostAvatar(), inChat && 2 == self.settings.get("WidgetType") ? (self.ui.widgetCollapsed.hide(), 
                self.ui.widgetExpanded.show(), self.settings.get("RequestFromMobileDevice") && self.settings.get("AllowWidgetOnMobile") && (self.$el.find(".purechat-expanded .purechat-menu .btn-expand").hide(), 
                self.ui.widgetExpanded.off("click.ExpandWidgetForMobile").on("click.ExpandWidgetForMobile", function() {
                    self.ui.widgetExpanded.off("click.ExpandWidgetForMobile"), self.expand();
                }))) : (self.ui.widgetCollapsed.show(), self.ui.widgetExpanded.hide()), self.model.set("expanded", !1), 
                self.trigger("collapsed"), self.triggerResizedEvent(), self.settings.get("RequestFromMobileDevice") && self.settings.get("AllowWidgetOnMobile") && !firstLoad ? self.collapseMobile(firstLoad, function() {}) : (this.ui.titleWrapper.show(), 
                this.ui.menuBar.show());
            },
            onHide: function() {
                this.$el.addClass("purechat-button-hidden");
            },
            onShow: function() {
                var self = this;
                self.imageLoaded.done(function() {
                    if ((0 != self.settings.get("UnavailableBehavior") || self.model.get("isPoppedOut") || self.model.get("operatorsAvailable") || self.model.get("userId")) && self.$el.removeClass("purechat-button-hidden"), 
                    !self.model.get("superMinimize")) {
                        var animation = self.settings.get("PageLoadAnimation") || self.settings.get("DisplayWidgetAnimation");
                        animation && !self.model.get("expanded") && self.$el.addClass("purechat-" + animation + " purechat-animated");
                    }
                    self.triggerResizedEvent();
                });
            },
            triggerResizedEvent: function() {
                this.options.viewController.triggerResizedEvent();
            },
            flashNotification: function(message) {
                notifier.notify(message, this.ui.title, this.$el);
            },
            setCannedResponses: function(cannedResponses) {
                var t = this;
                if (this.cannedResponses = cannedResponses, cannedResponses && window.$ && window.$().dropdown) {
                    var cannedResponsesList = $(".purechat-canned-responses ul", this.widgetContainer);
                    if (0 != cannedResponsesList.length) cannedResponsesList.html(""); else {
                        var cannedResponsesDiv = window.$('<span class="purechat-canned-responses btn-group"><a class="dropdown-toggle btn" data-toggle="dropdown" data-ajax="false">&nbsp;<i class="icon-ellipsis-horizontal icon-white"></i>&nbsp;</a><ul class="dropdown-menu bottom-up"></ul></span>');
                        cannedResponsesList = window.$("ul", cannedResponsesDiv), cannedResponsesList.dropdown(), 
                        cannedResponsesDiv.click(function() {
                            cannedResponsesDiv.find(".dropdown-toggle").dropdown("toggle");
                        }), this.addToolbarItem(cannedResponsesDiv);
                    }
                    for (var i in cannedResponses) {
                        var cannedResponse = cannedResponses[i];
                        if ("===separator===" === cannedResponse.content) cannedResponsesList.append("<div class='divider'></div>"); else {
                            var cannedResponseElement = window.$('<li data-ajax="false" data-cannedResponse="' + cannedResponse.content + '"><a href="#">' + cannedResponse.name + "</a></li>");
                            cannedResponseElement.click(function() {
                                var formMessage = t.$el.find(".purechat-send-form-message");
                                formMessage.val($(this).attr("data-cannedResponse")), formMessage.focus();
                            }), cannedResponsesList.append(cannedResponseElement);
                        }
                    }
                }
            }
        }), Views.StartChatForm = Marionette.ItemView.extend({
            template: "StartChatForm",
            className: "purechat-start-chat-form",
            events: {
                "submit form": "startChatSubmit",
                "keydown textarea": "keyDown"
            },
            ui: {
                form: ".purechat-form",
                userDisplayName: ".purechat-name-input",
                email: ".purechat-email-input",
                question: ".purechat-question-input",
                userDisplayNameError: ".please-entername",
                emailError: ".please-enteremail",
                questionError: ".please-enterquestion",
                phoneNumber: ".purechat-phonenumber-input",
                phoneNumberError: ".please-enterphonenumber"
            },
            keyDown: function(e) {},
            startChatSubmit: function(e) {
                e.preventDefault();
                var self = this;
                if (!this.submitDelay) {
                    this.submitDelay = !0, setTimeout(function() {
                        delete self.submitDelay;
                    }, 500);
                    var startImmediately = this.options.settings.get("StartChatImmediately"), askForName = this.model.get("AskForName") && !startImmediately, askForEmail = this.model.get("AskForEmail") && !startImmediately, askForQuestion = this.model.get("AskForQuestion") || startImmediately, askForPhoneNumber = this.model.get("AskForPhoneNumber") && !startImmediately, formType = Marionette.getOption(this, "FormType"), userDisplayName = null;
                    (askForName || "email" === formType) && (userDisplayName = $.trim(this.ui.userDisplayName.val()));
                    var userEmail = null;
                    (askForEmail || "email" === formType) && (userEmail = this.ui.email.val());
                    var initialQuestion = this.ui.question.val() || null;
                    if (this.ui.form.find(".please-entername, .please-enteremail, .please-enterquestion").hide(), 
                    "" === userDisplayName) return this.ui.userDisplayNameError.show(), self.options.viewController.triggerResizedEvent(), 
                    !1;
                    if ("" === userEmail) return this.ui.emailError.show(), self.options.viewController.triggerResizedEvent(), 
                    !1;
                    var phoneNumberVal = this.ui.phoneNumber.val();
                    if (askForPhoneNumber) {
                        if (0 == phoneNumberVal.length) return this.ui.phoneNumberError.show(), self.options.viewController.triggerResizedEvent(), 
                        !1;
                        this.ui.phoneNumberError.hide(), self.options.viewController.triggerResizedEvent(), 
                        this.ui.phoneNumber.val(phoneNumberVal);
                    }
                    if (null !== initialQuestion && "" == $.trim(initialQuestion) || !initialQuestion && (askForQuestion || "email" === formType)) return this.ui.questionError.show(), 
                    self.options.viewController.triggerResizedEvent(), !1;
                    userDisplayName && userDisplayName.length > MESSAGE_DISPLAY_WIDTH && (userDisplayName = userDisplayName.splice(0, MESSAGE_DISPLAY_WIDTH)), 
                    userDisplayName = userDisplayName || self.options.viewController.getPublicApi().get("visitor_name") || "Visitor", 
                    userEmail = userEmail || self.options.viewController.getPublicApi().get("visitor_email"), 
                    initialQuestion = initialQuestion || self.options.viewController.getPublicApi().get("visitor_question"), 
                    phoneNumberVal = phoneNumberVal || self.options.viewController.getPublicApi().get("visitor_phonenumber"), 
                    this.model.set({
                        Name: userDisplayName,
                        Email: userEmail,
                        Question: initialQuestion,
                        PhoneNumber: phoneNumberVal
                    }), this.model.trigger("formSubmit", {
                        visitorName: app.Utils.escapeHtml(userDisplayName),
                        visitorEmail: app.Utils.escapeHtml(userEmail),
                        visitorQuestion: app.Utils.escapeHtml(initialQuestion),
                        visitorPhoneNumber: app.Utils.escapeHtml(phoneNumberVal)
                    });
                }
            },
            onClose: function() {
                this.options.settings.get("isPersonalChat") && this.options.settings.get("isInEditorMode") && window.pcPersonalEditor && window.pcPersonalEditor.execute("editButton:hide", this.$el.find("[data-resourcekey]"));
            },
            onRender: function() {
                this.options.settings.get("isPersonalChat") && (this.$el.find("#purechat-name-submit").addClass("button"), 
                this.options.settings.get("isInEditorMode") && window.pcPersonalEditor && (this.$el.find("input, textarea").prop("disabled", !0), 
                window.pcPersonalEditor.execute("editButton:show", this.$el.find("[data-resourcekey]"))));
            }
        }), Views.StartChatFormAutomatically = Views.StartChatForm.extend({
            template: "StartChatFormAutomatically",
            templateHelpers: function() {
                var self = this;
                return {
                    isMobile: function() {
                        return self.options.settings.get("RequestFromMobileDevice") && self.options.settings.get("AllowWidgetOnMobile");
                    },
                    personalAvatarUrl: function() {
                        return personalAvatarUrl || "/content/images/avatars/1avatar-operator-skinny.png";
                    },
                    isPersonalChat: function() {
                        return self.options.settings.get("isPersonalChat");
                    }
                };
            },
            keyDown: function(e) {
                return 13 === e.keyCode ? e.ctrlKey ? (this.ui.question.val(this.ui.question.val() + "\n"), 
                !0) : (this.startChatSubmit(e), !1) : !0;
            }
        }), Views.EmailSent = Marionette.ItemView.extend({
            template: "EmailSent",
            className: ""
        }), Views.MessageView = Marionette.ItemView.extend({
            template: "MessageView",
            className: "purechat-message-wrapper purechat-clearfix",
            ui: {},
            onRender: function() {
                window.pcPersonalEditorSettings && window.pcPersonalEditorSettings.get("isPersonalChat") && window.pcPersonalEditorSettings.get("isInEditorMode") && window.pcPersonalEditor && window.pcPersonalEditor.execute("editButton:show", this.$el.find("[data-resourcekey]")), 
                this.$el.attr({
                    "data-userid": this.model.get("userId")
                });
            }
        }), Views.EmptyView = Marionette.ItemView.extend({
            template: "Empty",
            className: "empty-item",
            events: {}
        }), Views.MessageListView = Marionette.ItemView.extend({
            template: "MessageList",
            className: "message-list-view",
            cannedResponseCollection: null,
            ui: {
                messageListContainer: ".purechat-message-display",
                textInput: "textarea",
                disableTextArea: ".disableTextArea",
                form: "form",
                displayContainer: ".purechat-message-display-container",
                userStatus: ".purechat-user-status"
            },
            templateHelpers: function() {
                var options = {};
                return options;
            },
            modelEvents: {
                change: function(model) {
                    this.triggerMethod("roomHostChanged", model);
                }
            },
            collectionEvents: {
                add: "addMessageToMessageList"
            },
            events: {
                "keydown textarea": "keyDown",
                "keyup textarea": "keyUp",
                "submit form": "postMessage",
                scrollToTop: function(e, args) {
                    this.scrollToTop(args);
                },
                "refreshAutoCompleteSource textarea": function() {
                    var self = this;
                    self.cannedResponseCollection = [], pcDashboard.CannedResponses.ResponseCollection.forEach(function(r) {
                        self.cannedResponseCollection.push({
                            label: r.get("Content"),
                            value: $("<div/>").html(r.get("Content")).text()
                        });
                    }), self.ui.textInput.trigger("disableAutoComplete").trigger("enableAutoComplete");
                },
                "disableAutoComplete textarea": function() {
                    this.ui.textInput.autocomplete("destroy");
                },
                "enableAutoComplete textarea": function() {
                    var self = this;
                    this.ui.textInput.autocomplete({
                        source: function(request, response) {
                            var term = (CurrentUser.get("cannedResponseSettings").get("MatchStartOfCannedResponse") ? "^" : "") + $.ui.autocomplete.escapeRegex(request.term), matcher = new RegExp(term, "im");
                            response($.grep(self.cannedResponseCollection, function(item) {
                                return matcher.test(item.label || item.value);
                            }));
                        },
                        delay: 100,
                        position: {
                            my: "bottom",
                            at: "top"
                        },
                        open: function() {
                            var autoWidget = $(this).autocomplete("widget");
                            $("<div />").addClass("arrow pure-chat-auto-complete-arrow").appendTo("body").position({
                                my: "center",
                                at: "left+32 bottom+5",
                                of: autoWidget
                            }).css({
                                zIndex: parseInt(autoWidget.css("z-index")) + 1
                            });
                        },
                        close: function() {
                            $(".pure-chat-auto-complete-arrow").remove();
                        }
                    }), this.ui.textInput.autocomplete("widget").addClass("canned-responses-autocomplete");
                },
                "focus textarea": "expandForm",
                "click textarea": "expandForm",
                "blur textarea": "collapseForm"
            },
            getLastMessageWithId: function(currentMessageId) {
                var last = null;
                return this.collection.forEach(function(model) {
                    model.get("userId") && model.get("messageId") != currentMessageId && (last = model);
                }), last;
            },
            addMessageToMessageList: function(model, collection, options) {
                var lastMessageDomObj = this.ui.messageListContainer.find("[data-userid]:last"), lastMessage = this.ui.messageListContainer.find(".purechat-message-wrapper:last");
                if (0 == lastMessageDomObj.length || lastMessageDomObj.data("userid") != model.get("userId") || lastMessageDomObj.data("userid") != lastMessage.data("userid")) {
                    var messageView = new Views.MessageView({
                        model: model
                    });
                    messageView.render(), this.ui.messageListContainer.append(messageView.$el);
                } else if (lastMessageDomObj.length > 0 && lastMessageDomObj.data("userid") == model.get("userId")) {
                    var message = purechatApp.Utils.parseEmoticons(model.get("message"));
                    message = purechatApp.Utils.linkify(message), lastMessageDomObj.find(".purechat-message-container .purechat-message-actual").append('<span class="purechat-new-thought">' + message + "</span>");
                }
            },
            collapseForm: function() {},
            expandForm: function() {},
            onClose: function() {
                $(window).off("resize.ScrollToTopMobile");
            },
            onRender: function() {
                if (this.options.settings.get("isInvisible") && (this.ui.textInput.attr("disabled", "disabled"), 
                this.ui.disableTextArea.show()), this.options.settings.get("isOperator")) {
                    if (this.cannedResponseCollection = pcDashboard.CannedResponses.ResponseCollection, 
                    0 == this.cannedResponseCollection.length) {
                        this.cannedResponseCollection = [];
                        var cannedResponses = this.options.settings.get("cannedResponses");
                        for (i in cannedResponses) if ("===separator===" !== cannedResponses[i].content) {
                            var next = {
                                label: cannedResponses[i].content,
                                value: $("<div/>").html(cannedResponses[i].content).text()
                            };
                            this.cannedResponseCollection.push(next);
                        }
                    }
                    var self = this, ac = window.$(this.ui.textInput).autocomplete({
                        source: function(request, response) {
                            var term = (CurrentUser.get("cannedResponseSettings").get("MatchStartOfCannedResponse") ? "^" : "") + $.ui.autocomplete.escapeRegex(request.term), matcher = new RegExp(term, "im"), matches = [];
                            if (self.cannedResponseCollection.models && self.cannedResponseCollection.models.length) {
                                var temp = [];
                                self.cannedResponseCollection.models.forEach(function(c) {
                                    temp.push({
                                        label: c.get("Content"),
                                        value: $("<div/>").html(c.get("Content")).text()
                                    });
                                }), matches = $.grep(temp, function(item) {
                                    return matcher.test(item.label || item.value);
                                });
                            } else matches = $.grep(self.cannedResponseCollection, function(item) {
                                return matcher.test(item.label || item.value);
                            });
                            response(matches);
                        },
                        delay: 100,
                        position: {
                            my: "bottom",
                            at: "top"
                        },
                        open: function() {
                            var autoWidget = $(this).autocomplete("widget");
                            $("<div />").addClass("arrow pure-chat-auto-complete-arrow").appendTo("body").position({
                                my: "center",
                                at: "left+32 bottom+5",
                                of: autoWidget
                            }).css({
                                zIndex: parseInt(autoWidget.css("z-index")) + 1
                            });
                        },
                        close: function() {
                            $(".pure-chat-auto-complete-arrow").remove();
                        }
                    });
                    ac.autocomplete("widget").addClass("canned-responses-autocomplete");
                }
                if (this.options.settings.get("isPersonalChat") && (this.$el.find(".btn-close").css("display", "inline-block"), 
                this.options.settings.get("isInEditorMode") && window.pcPersonalEditor && (this.$el.find("textarea").prop("disabled", !0), 
                window.pcPersonalEditor.execute("editButton:show", this.$el.find("[data-resourcekey]")))), 
                this.model.get("RequestFromMobileDevice")) {
                    var self = this;
                    $(window).on("resize.ScrollToTopMobile", function() {
                        self.scrollToTop();
                    });
                }
            },
            scrollToTop: function(args) {
                var mobileDevice = this.model.get("RequestFromMobileDevice"), messageDisplay = this.$el.find(".purechat-message-display-container"), lastMessageHeight = messageDisplay.find(".purechat-message-wrapper:last .purechat-message-container").outerHeight(!0), messageDisplayScrollTop = messageDisplay.scrollTop(), messageDisplayInnerHeight = messageDisplay.innerHeight(), combinedHeight = messageDisplayScrollTop + messageDisplayInnerHeight + lastMessageHeight, scrollableHeight = messageDisplay[0].scrollHeight;
                mobileDevice || args && args.forceBottom || combinedHeight >= scrollableHeight ? (messageDisplay.scrollTop(this.$el.find(".purechat-message-display").height()), 
                this.model.set("scrolledToBottom", !0)) : this.model.set("scrolledToBottom", !1);
            },
            keyDown: function(e) {
                return 13 === e.keyCode ? e.ctrlKey ? (this.ui.textInput.val(this.ui.textInput.val() + "\n"), 
                !0) : (this.triggerMethod("typingChange", !1), this.activity = !1, this.ui.form.submit(), 
                !1) : !0;
            },
            keyUp: function() {
                var self = this;
                self.typingTimeout && (clearTimeout(self.typingTimeout), self.typingTimeout = null), 
                this.typingTimeout = setTimeout(function() {
                    try {
                        "" != self.ui.textInput.val() ? (self.activity = !0, self.triggerMethod("typingChange", !0)) : (self.triggerMethod("typingChange", !1), 
                        self.activity = !1);
                    } catch (ex) {}
                }, 2e3), "" != self.ui.textInput.val() && 1 != self.activity && (self.triggerMethod("typingChange", !0), 
                self.activity = !0);
            },
            postMessage: function(e) {
                e.stopPropagation(), e.preventDefault();
                var newMessage = this.ui.textInput.val();
                this.triggerMethod("newMessage", newMessage), this.ui.textInput.val("");
                try {
                    this.ui.textInput.autocomplete("close");
                } catch (ex) {}
            },
            typing: function(userId, userDisplayName, isTyping) {
                this.model.get("participants").set({
                    userId: userId,
                    displayName: userDisplayName,
                    isTyping: isTyping
                }, {
                    remove: !1
                }), this.ui.userStatus.html(this.model.get("participants").getOperatorTypingText(this)), 
                isTyping && this.options.settings.get("isPersonalChat") && this.options.settings.get("isInEditorMode") && (this.ui.userStatus.find('[data-resourcekey="chat_typing"]').attr("data-username", userDisplayName), 
                window.pcPersonalEditor.execute("editButton:show", this.ui.userStatus.find("[data-resourcekey]")));
            },
            appendBuffer: function(compositeView, buffer) {
                var $container = this.getItemViewContainer(compositeView);
                $container.append(buffer);
            },
            appendHtml: function(compositeView, itemView, index) {
                if (compositeView.isBuffering) compositeView.elBuffer.appendChild(itemView.el); else {
                    var $container = this.getItemViewContainer(compositeView), last = $container.find(".purechat-message-wrapper").last();
                    last.length ? last.after(itemView.el) : $container.append(itemView.el);
                }
            }
        }), Views.ClosedMessage = Marionette.ItemView.extend({
            getTemplate: function() {
                return this.options.settings.get("isOperator") ? "ClosedMessageOperator" : "ClosedMessage";
            },
            className: "purechat-closedmessage-container",
            ui: {
                ratingThanks: ".purechat-rating-thanks"
            },
            templateHelpers: function() {
                return this.options.settings;
            },
            events: {
                "click .purechat-thumbs-up": function(e) {
                    this.options.settings.get("isInEditorMode") || ($(e.target).addClass("purechat-thumbs-selected"), 
                    this.rateChat(!0));
                },
                "click .purechat-thumbs-down": function(e) {
                    this.options.settings.get("isInEditorMode") || ($(e.target).addClass("purechat-thumbs-selected"), 
                    this.rateChat(!1));
                },
                "click button.ban-ip-operator-button": function(e) {
                    var sender = global$(e.target);
                    global$('.operatorBanIPAddress[data-ipaddressid="' + sender.attr("data-ipaddressid") + '"]').modal("show"), 
                    global$("#BanIP-" + sender.attr("data-ipaddressid")).off("click.BanIPAddressFromOperator").on("click.BanIPAddressFromOperator", function() {
                        global$(document).trigger("ConfirmBanIPAddressFromOperator", [ global$(this), sender ]);
                    });
                },
                "click .purechat-download-container a": function() {
                    return !this.options.settings.get("isInEditorMode");
                }
            },
            rateChat: function(up) {
                this.rating || (this.rating = up ? 1 : 0, this.trigger("chat:rated", this.rating)), 
                this.$el.find(".purechat-thumbs-selectable:not(.purechat-thumbs-selected)").remove(), 
                this.ui.ratingThanks.text(this.getResource("closed_ratingThanks")), this.ui.ratingThanks.attr("data-resourcekey", "closed_ratingThanks");
            },
            initialize: function() {
                this.model.set("isPersonalChat", this.options.settings.get("isPersonalChat"));
            },
            onClose: function() {
                this.options.settings.get("isPersonalChat") && this.options.settings.get("isInEditorMode") && window.pcPersonalEditor && window.pcPersonalEditor.execute("editButton:hide", this.$el.find("[data-resourcekey]"));
            },
            onRender: function() {
                this.options.settings.get("isPersonalChat") && (this.$el.find("a.purechat-cta-button").attr("href", /http/i.test(this.getResource("button_cta_url")) ? this.getResource("button_cta_url") : "http://" + this.getResource("button_cta_url")), 
                this.options.settings.get("isInEditorMode") && window.pcPersonalEditor && window.pcPersonalEditor.execute("editButton:show", this.$el.find("[data-resourcekey]")));
            }
        }), Views.CoolSpinner = Marionette.ItemView.extend({
            template: _.template(""),
            className: "purechat-cool-awesome-spinner spinner"
        }), Views.ChatConnectingView = Marionette.ItemView.extend({
            template: "ChatConnecting",
            className: "purechat-enterinfo-container",
            ui: {
                spinner: ".spinnerContainer",
                greeting: ".greeting",
                connecting: ".connecting"
            },
            onRender: function() {
                var spinnerOpts = {
                    length: 20,
                    radius: 20,
                    width: 10,
                    color: "#888"
                };
                if (this.options.settings.get("isPersonalChat")) {
                    var spinner = new Views.CoolSpinner();
                    spinner.render(), this.ui.spinner.css("height", "auto").append(spinner.$el), this.ui.greeting.css("display", "none"), 
                    this.ui.connecting.css("display", "none");
                } else {
                    var spinner = new purechatSpinner.Spinner(spinnerOpts).spin(), $spinner = $(spinner.el);
                    $spinner.css({
                        left: "50%",
                        top: "50%"
                    }), this.ui.spinner.append($spinner);
                }
            },
            showErrorMessage: function(error) {
                this.ui.spinner.hide(), this.ui.greeting.hide(), this.ui.connecting.hide(), this.$el.append("<p>" + error + "</p>");
            }
        }), Views.PersonalChatTooltip = Marionette.ItemView.extend({
            template: _.template('<span class="arrow"></span>'),
            tagName: "span",
            className: "personal-tooltip",
            onRender: function() {
                this.$el.append(this.model.get("text"));
            }
        }), Views.PersonalChatDetails = Marionette.ItemView.extend({
            template: "PersonalChatDetails",
            className: "purechat-personal-widget-content",
            events: {
                "mouseenter .purechat-social-buttons a[data-tooltiptext]": "displayFixedTooltip",
                "mouseleave .purechat-social-buttons a[data-tooltiptext]": "hideFixedTooltip",
                "click .start-chat": "showWidgetBody"
            },
            showWidgetBody: function() {
                var self = this;
                this.$el.parent().css({
                    left: -$(window).width()
                }), setTimeout(function() {
                    self.$el.parent().addClass("hide");
                }, 1001);
            },
            displayFixedTooltip: function(e) {
                var sender = $(e.currentTarget), tooltip = new Views.PersonalChatTooltip({
                    model: new Backbone.Model({
                        text: sender.data("tooltiptext")
                    })
                });
                tooltip.render(), tooltip.$el.appendTo("body");
                var top = sender.offset().top + sender.outerHeight() - 1, right = sender.offset().left + sender.width() / 2 - 8;
                tooltip.$el.css({
                    display: "inline-block",
                    top: top,
                    left: right
                }), sender.data("activetooltip", tooltip);
            },
            hideFixedTooltip: function(e) {
                var sender = $(e.currentTarget), tooltip = sender.data("activetooltip");
                tooltip && (tooltip.destroy(), sender.data("activetooltip", null));
            },
            initialize: function() {
                if ("undefined" != typeof tempPersonalWidgetSettings) {
                    var userWidgetSettings = this.model.get("UserWidgetSettings");
                    for (var prop in tempPersonalWidgetSettings.attributes) userWidgetSettings.set(prop, tempPersonalWidgetSettings.get(prop) || userWidgetSettings.get(prop));
                    this.model.set("UserWidgetSettings", userWidgetSettings);
                }
            },
            onRender: function() {
                this.options.model.get("RequestFromMobileDevice") && this.$el.find(".purechat-contact-details a").addClass("button");
            },
            onAfterInserted: function() {}
        }), Views.UnsupportedBrowser = Marionette.ItemView.extend({
            template: "UnsupportedBrowser",
            className: "purechat-unsupported-browser",
            onRender: function() {}
        });
    }, purechatApp.Models), purechatApp.templates = templates;
    var pc_ = _.noConflict(), backbone = Backbone.noConflict(), marionette = Marionette.noConflict(), defaultUiVisiblity = {
        popoutButton: !1,
        closeButton: !1,
        restartButton: !1,
        removeWidgetButton: !1,
        requeueButton: !1,
        leaveButton: !1,
        cannedResponsesButton: !1
    }, DEFAULT_AVAIL_TIMEOUT = 2e4, DEFAULT_UNAVAIL_TIMEOUT = 6e5;
    PCWidgetState = marionette.Controller.extend({
        initialize: function() {
            this.stateSettings = this.stateSettings || {}, this.stateSettings.UiVisiblity = this.stateSettings.UiVisiblity || {}, 
            pc_.defaults(this.stateSettings.UiVisiblity, defaultUiVisiblity);
        },
        setChatModel: function(model) {
            this.chatModel = model;
        },
        getChatModel: function() {
            return this.chatModel;
        },
        setWidgetView: function(view) {
            this.widgetView = view, this.listenTo(this.widgetView, "all");
        },
        setPersonalDetailsView: function(view) {
            this.personalDetailsView = view;
        },
        getPersonalDetailsView: function() {
            return this.personalDetailsView;
        },
        getWidgetView: function() {
            return this.widgetView;
        },
        setWidgetSettings: function(settings) {
            this.settings = settings;
        },
        getWidgetSettings: function() {
            return this.settings;
        },
        setResources: function(resources) {
            this.resources = resources;
        },
        getResources: function() {
            return this.resources;
        },
        setDataController: function(dc) {
            this.dc = dc;
        },
        getDataController: function() {
            return this.dc;
        },
        setViewController: function(vc) {
            this.vc = vc;
        },
        getViewController: function() {
            return this.vc;
        },
        getResource: function(key, data) {
            return this.resources.getResource(key, data);
        },
        disable: function() {
            this.getDataController().connectionInfo.set("disabled", !0), this.getDataController().connectionInfo.set("chatActiveInOtherWindow", !0), 
            this.getWidgetView().$el.hide();
        },
        enable: function() {
            this.getDataController().connectionInfo.set("disabled", !1), this.getDataController().connectionInfo.set("chatActiveInOtherWindow", !1), 
            this.getWidgetView().$el.show();
        },
        showConnectingWithTimeout: function() {
            function show() {
                if (this.connectingTimeout) var connectingView = new purechatApp.Views.ChatConnectingView({
                    rm: self.getResources(),
                    model: new backbone.Model({}),
                    settings: self.options
                });
                self.getWidgetView().content.show(connectingView);
            }
            var self = this;
            this.clearConnectingTimeout(), this.connectingTimeout = setTimeout(show, 500);
            this.connectingTimeout;
        },
        clearConnectingTimeout: function() {
            this.connectingTimeout && (clearTimeout(this.connectingTimeout), delete this.connectingTimeout);
        },
        onEnter: function() {
            this.listenTo(this.getWidgetView(), "all", function(event, parms) {
                var self = this;
                parms && parms.confirmation ? self.getViewController().showConfirmationDialog(parms.confirmation, parms.title).done(function() {
                    self.triggerMethod.call(self, event, parms);
                }) : this.triggerMethod.apply(this, arguments);
            });
            var self = this;
            if (this.stateSettings) {
                if (this.stateSettings.UiVisiblity) {
                    var view = this.getWidgetView();
                    for (var next in this.stateSettings.UiVisiblity) view.ui[next] && view.ui[next].toggle(this.stateSettings.UiVisiblity[next]);
                }
                var dc = self.getDataController(), connectionInfo = dc.connectionInfo, shouldBeInRoom = this.stateSettings.shouldBeInRoom;
                this.chatModel.get("isOperator") || pc_.isUndefined(shouldBeInRoom) || (shouldBeInRoom ? this.listenTo(connectionInfo, "change:isInChat", function(model, isInChat) {
                    isInChat || self.chatModel.set("state", purechatApp.Constants.WidgetStates.Closed);
                }) : this.listenTo(connectionInfo, "change:isInChat", function(model, isInChat) {
                    isInChat && (self.widgetView.expand(), self.chatModel.set("state", purechatApp.Constants.WidgetStates.Chatting));
                }));
            }
        },
        onExit: function() {
            this.clearConnectingTimeout(), this.stopListening(this.widgetView, "all"), this.stopAvailabilityPolling();
        },
        testAvailability: function() {
            var t = this;
            t.getViewController().pageActivity || t.lastCheck && new Date() - t.lastCheck > 12e4 ? (t.lastCheck = new Date(), 
            t.getDataController().checkChatAvailable().done(function(result) {
                t.testStatusTimeOutId = clearTimeout(t.testStatusTimeOutId), t.checkAvailTimeout = result.available ? DEFAULT_AVAIL_TIMEOUT : DEFAULT_UNAVAIL_TIMEOUT, 
                result.available ? t.testStatusTimeOutId = setTimeout(function() {
                    t.testAvailability();
                }, t.checkAvailTimeout) : "AccountActivity" !== result.reason ? t.testStatusTimeOutId = setTimeout(function() {
                    t.testAvailability();
                }, t.checkAvailTimeout) : t.stopAvailabilityPolling(), t.getChatModel().set("operatorsAvailable", result.available);
            })) : (t.checkAvailTimeout = DEFAULT_AVAIL_TIMEOUT, t.testStatusTimeOutId = clearTimeout(t.testStatusTimeOutId), 
            t.testStatusTimeOutId = setTimeout(function() {
                t.testAvailability();
            }, 1500));
        },
        startAvailabilityPolling: function() {
            var t = this;
            t.checkAvailTimeout = DEFAULT_AVAIL_TIMEOUT, t.testAvailability(), this.TestingStatus || (this.testStatusTimeOutId = setTimeout(function() {
                t.testAvailability();
            }, t.checkAvailTimeout)), this.TestingStatus = !0;
        },
        stopAvailabilityPolling: function() {
            this.TestingStatus = !1, this.testStatusTimeOutId = clearTimeout(this.testStatusTimeOutId);
        },
        onPopOutChat: function() {
            var settings = this.getWidgetSettings(), chatModel = this.getChatModel(), dataController = this.getDataController();
            this.getChatModel().set("poppedOut", !0), this.disable(), dataController.connectionInfo.persistLocalStorage(), 
            window.openedWindow = window.open(this.settings.get("pureServerUrl") + "/VisitorWidget/ChatWindow?widgetId=" + settings.get("widgetId") + "&userId=" + dataController.connectionInfo.get("userId") + "&displayName=" + dataController.connectionInfo.get("visitorName") + "&authToken=" + dataController.connectionInfo.get("authToken") + "&roomId=" + dataController.connectionInfo.get("roomId") + "&chatId=" + dataController.connectionInfo.get("chatId") + "&origin=" + encodeURIComponent(chatModel.get("origin")), "purechatwindow", "menubar=no, location=no, resizable=yes, scrollbars=no, status=no, width=480, height=640");
        }
    }), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateInitializing = PCWidgetState.extend({
            name: "initializing",
            stateSettings: {
                UiVisiblity: {}
            },
            onEnter: function() {
                PCWidgetState.prototype.onEnter.apply(this, arguments), this.getWidgetView().setTitle(this.getResource("title_initial_open"), "title_initial_open");
                var inRoom = this.getDataController().checkInRoom(), re = new RegExp("^https?://" + document.location.hostname, "i");
                document.referrer.match(re) || (localStorage.acquisitionSource = document.referrer), 
                inRoom ? this.getChatModel().set("state", app.Constants.WidgetStates.Activating) : this.getChatModel().set("state", app.Constants.WidgetStates.Inactive);
            }
        });
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        var inactiveInstance = null;
        States.PCStateInactive = PCWidgetState.extend({
            name: "inactive",
            stateSettings: {
                shouldBeInRoom: !1,
                UiVisiblity: {}
            },
            onEnter: function() {
                PCWidgetState.prototype.onEnter.apply(this, arguments);
                var self = inactiveInstance = this, widgetSettings = self.getWidgetSettings(), doneFnc = function(result) {
                    if (self.getWidgetView().$el.find(".purechat-start-chat-button-container button").html("Start Chat"), 
                    result.available || ("WidgetDisabled" == result.reason || "ChatQuotaExceeded" == result.reason) && self.getWidgetSettings().set("UnavailableBehavior", 1), 
                    self.options.get("isPersonalChat") && !self.getPersonalDetailsView() && (self.personalDetails = new app.Views.PersonalChatDetails({
                        model: self.options
                    }), self.getWidgetView().personalDetails.show(self.personalDetails), self.setPersonalDetailsView(self.personalDetails), 
                    self.personalDetails.triggerMethod("afterInserted")), self.getChatModel().set("operatorsAvailable", result.available), 
                    result.available) {
                        self.getWidgetView().onShow(), self.getWidgetView().setTitle(self.getResource("title_initial"), "title_initial");
                        var model = new backbone.Model({
                            AskForName: self.getWidgetSettings().get("AskForName"),
                            AskForEmail: self.getWidgetSettings().get("AskForEmail"),
                            AskForQuestion: self.getWidgetSettings().get("AskForQuestion"),
                            AskForPhoneNumber: self.getWidgetSettings().get("AskForPhoneNumber"),
                            InitialVisitorName: self.getViewController().getPublicApi().get("visitor_name"),
                            InitialVisitorEmail: self.getViewController().getPublicApi().get("visitor_email"),
                            InitialVisitorQuestion: self.getViewController().getPublicApi().get("visitor_question"),
                            InitialVisitorPhoneNumber: self.getViewController().getPublicApi().get("visitor_phonenumber")
                        }), viewConstructor = self.getWidgetSettings().get("StartChatImmediately") ? purechatApp.Views.StartChatFormAutomatically : purechatApp.Views.StartChatForm;
                        self.chatForm = new viewConstructor({
                            viewController: self.getViewController(),
                            rm: self.getResources(),
                            model: model,
                            settings: self.options
                        }), model.on("formSubmit", function(data) {
                            var inRoom = self.getDataController().checkInRoom();
                            if (!self.submittingChat) if (inRoom) self.getChatModel().set("state", app.Constants.WidgetStates.Activating); else {
                                self.submittingChat = !0, data.origin = self.chatModel.get("origin");
                                self.getDataController().startChat(data).done(function(chatConnectionInfo) {
                                    purechatApp.Utils.GaEvent(widgetSettings, "GaTrackingChat", "GAChatEvent"), self.getWidgetView().$el.find(".purechat-init-form").find(".general-error").text("").hide(), 
                                    self.status.chatInfo = chatConnectionInfo, self.status.initialData = data, self.getChatModel().set("visitorName", data.visitorName), 
                                    self.getChatModel().set("visitorEmail", data.visitorEmail), self.getChatModel().set("visitorQuestion", data.visitorQuestion), 
                                    self.getChatModel().set("roomId", chatConnectionInfo.get("roomId")), self.getChatModel().set("userId", chatConnectionInfo.get("userId")), 
                                    self.getChatModel().set("authToken", chatConnectionInfo.get("authToken")), self.getChatModel().set("chatId", chatConnectionInfo.get("chatId")), 
                                    self.getChatModel().set("state", app.Constants.WidgetStates.Chatting), self.getDataController().connectionInfo.persistLocalStorage();
                                }).fail(function(message) {
                                    self.log("Error", "Unable to start chat. WidgetId: " + self.getWidgetSettings().get("widgetId") + ", Message:" + (message || "None"));
                                    var widgetView = self.getWidgetView();
                                    widgetView.$el.find(".purechat-init-form").find(".general-error").text("Unable to start chat. Please try again").show();
                                }).always(function() {
                                    self.submittingChat = !1;
                                });
                            }
                        }), self.settings.browserIsUnsupported() ? self.getChatModel().set("state", app.Constants.WidgetStates.Unsupported) : (self.getWidgetView().content.show(self.chatForm), 
                        self.listenTo(self.getChatModel(), "change:operatorsAvailable", function(model, available) {
                            available || self.getChatModel().set("state", app.Constants.WidgetStates.Unavailable);
                        }), (self.widgetView.model.get("expanded") || 0 == self.getWidgetSettings().get("UnavailableBehavior")) && (self.widgetView.model.get("expanded") && self.getWidgetView().setTitle(self.getResource("title_initial_open"), "title_initial_open"), 
                        window._pcDisableAvailabilityPings || self.startAvailabilityPolling()));
                    } else self.getChatModel().set("state", app.Constants.WidgetStates.Unavailable);
                    app.execute("poweredby:reset");
                };
                this.settings.get("IPIsBanned") ? doneFnc({
                    available: !this.settings.get("IPIsBanned"),
                    reason: "NoOperators"
                }) : self.getDataController().checkChatAvailable().done(doneFnc);
            },
            onExpanded: function() {
                var inRoom = this.getDataController().checkInRoom();
                inRoom ? this.getChatModel().set("state", app.Constants.WidgetStates.Activating) : (this.getWidgetView().setTitle(this.getResource("title_initial_open"), "title_initial_open"), 
                this.startAvailabilityPolling());
            },
            onCollapsed: function() {
                this.getWidgetView().setTitle(this.getResource("title_initial"), "title_initial"), 
                0 != this.getWidgetSettings().get("UnavailableBehavior") && this.stopAvailabilityPolling();
            },
            startChatAutomatically: function() {
                var d = $.Deferred(), self = this, mockData = {
                    visitorName: "Visitor"
                }, widgetSettings = self.getWidgetSettings();
                return self.getDataController().checkChatAvailable().done(function(response) {
                    response.available ? self.getDataController().startChat(mockData).done(function(chatConnectionInfo) {
                        purechatApp.Utils.GaEvent(widgetSettings, "GaTrackingChat", "GAChatEvent"), self.getWidgetView().$el.find(".purechat-init-form").find(".general-error").text("").hide(), 
                        self.status.chatInfo = chatConnectionInfo, self.status.initialData = mockData, self.getChatModel().set("visitorName", mockData.visitorName), 
                        self.getChatModel().set("visitorEmail", mockData.visitorEmail), self.getChatModel().set("visitorQuestion", mockData.visitorQuestion), 
                        self.getChatModel().set("roomId", chatConnectionInfo.get("roomId")), self.getChatModel().set("userId", chatConnectionInfo.get("userId")), 
                        self.getChatModel().set("authToken", chatConnectionInfo.get("authToken")), self.getChatModel().set("chatId", chatConnectionInfo.get("chatId")), 
                        self.getChatModel().set("state", app.Constants.WidgetStates.Chatting), self.getDataController().connectionInfo.persistLocalStorage(), 
                        d.resolve();
                    }).fail(function(message) {
                        self.log("Error", "Unable to start chat. WidgetId: " + self.getWidgetSettings().get("widgetId") + ", Message:" + (message || "None"));
                        var widgetView = self.getWidgetView();
                        widgetView.$el.find(".purechat-init-form").find(".general-error").text("Unable to start chat. Please try again").show(), 
                        d.reject();
                    }).always(function() {
                        self.submittingChat = !1;
                    }) : (self.getChatModel().set("state", app.Constants.WidgetStates.Unavailable), 
                    d.resolve());
                }), d.promise();
            }
        }), States.addInitializer(function() {}), States.addFinalizer(function() {});
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateActivating = PCWidgetState.extend({
            name: "activating",
            stateSettings: {
                UiVisiblity: {}
            },
            onEnter: function() {
                var self = this;
                PCWidgetState.prototype.onEnter.apply(this, arguments);
                new backbone.Model({
                    userName: self.getChatModel().get("visitorName")
                });
                self.options.get("isPersonalChat") && !self.getPersonalDetailsView() && (self.personalDetails = new app.Views.PersonalChatDetails({
                    model: self.options
                }), self.getWidgetView().personalDetails.show(self.personalDetails), self.setPersonalDetailsView(self.personalDetails), 
                self.personalDetails.triggerMethod("afterInserted")), self.showConnectingWithTimeout(), 
                self.clearConnectingTimeout(), self.getChatModel().set("state", app.Constants.WidgetStates.Chatting);
            }
        });
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateChatting = PCWidgetState.extend({
            name: "chatting",
            stateSettings: {
                shouldBeInRoom: !0,
                UiVisiblity: {
                    popoutButton: !0,
                    closeButton: !0,
                    requeueButton: !0,
                    cannedResponsesButton: !0
                }
            },
            initialize: function() {
                PCWidgetState.prototype.initialize.apply(this, arguments), this.typing = {}, this.isUserAlone = !0, 
                this.mobileAnimationInterval = null;
            },
            onEnter: function() {
                PCWidgetState.prototype.onEnter.apply(this, arguments);
                var self = this;
                self.getWidgetView().$el.removeClass("purechat-button-hidden"), self.options.get("isPersonalChat") && !self.getPersonalDetailsView() && (self.personalDetails = new app.Views.PersonalChatDetails({
                    model: self.options
                }), self.getWidgetView().personalDetails.show(self.personalDetails), self.setPersonalDetailsView(self.personalDetails), 
                self.personalDetails.triggerMethod("afterInserted"));
                var startImmediately = (new backbone.Model({
                    userName: self.getChatModel().get("visitorName")
                }), this.options.get("StartChatImmediately")), chatModel = self.getChatModel();
                chatModel.set({
                    isPersonalChat: this.options.get("isPersonalChat"),
                    RequestFromMobileDevice: this.options.get("RequestFromMobileDevice")
                }), self.messageView = new purechatApp.Views.MessageListView({
                    rm: this.getResources(),
                    model: chatModel,
                    collection: self.getChatModel().get("messages"),
                    settings: self.getWidgetSettings()
                }), self.getWidgetView().content.show(self.messageView), self.showConnectingWithTimeout(), 
                self.getDataController().connectToChatServer(this).done(function() {
                    self.clearConnectingTimeout();
                    try {
                        self.chatModel.get("isOperator") || "undefined" != typeof self.chatModel.get("operators") && 0 != self.chatModel.get("operators").length || self.chatModel.get("messages").add({
                            type: startImmediately ? "message" : "note",
                            message: self.getResource("chat_startedMessage"),
                            resourceKey: "chat_startedMessage",
                            avatarUrl: self.options.get("isPersonalChat") ? personalAvatarUrl || "/content/images/avatars/1avatar-operator-skinny.png" : null
                        }), _.isFunction(self.getDataController().setCurrentPage) && !self.options.get("isOperator") && self.getDataController().setCurrentPage(document.location.href), 
                        self.messageView.on("newMessage", function(message) {
                            self.getDataController().newMessage(message);
                        }), self.listenTo(self.messageView, "typingChange", function(typing) {
                            self.getDataController().setTypingIndicator(typing);
                        }), self.getWidgetView().$el.find(".purechat-start-chat-button-container button").html('Back to Chat<i style="margin-left: .5em;" class="fa fa-chevron-right"></i>'), 
                        self.getWidgetView().onShow(), self.getDataController().sendRoomHistory(), self.chatModel.get("visitorQuestion") && self.getDataController().newMessage(self.chatModel.get("visitorQuestion")), 
                        self.getViewController().trigger("stateChanged", app.Constants.WidgetStates.Chatting), 
                        self.settings.get("RequestFromMobileDevice") && self.settings.get("AllowWidgetOnMobile") && ($(window).trigger("resize.ResizeChatContent"), 
                        self.getWidgetView().$el.find(".purechat-send-form-message").off("blur.ResizeWindow").on("blur.ResizeWindow", function() {
                            $(window).trigger("resize.ResizeChatContent");
                        }), self.options.get("isDirectAccess") && ($(".direct-container-header").css("display", "none"), 
                        "function" == typeof resizeDirectAccessContainer && resizeDirectAccessContainer())), 
                        self.getWidgetView().$el.find(".purechat-send-form-message").trigger("focus"), self.getWidgetView().trigger("resized");
                    } catch (exception) {
                        console.log(exception);
                    }
                }).fail(function() {
                    self.clearConnectingTimeout(), self.getDataController().connectionInfo.clearLocalStorage(), 
                    self.getChatModel().set("state", app.Constants.WidgetStates.Inactive);
                }), chatModel.on("roomHostChanged", function() {
                    var roomHostAvatarUrl = chatModel.get("roomHostAvatarUrl"), roomHostName = chatModel.get("roomHostName");
                    self.getWidgetView().showRoomHostAvatar(roomHostAvatarUrl), self.getWidgetView().updateRoomHostName(roomHostName);
                });
            },
            onExit: function() {
                PCWidgetState.prototype.onExit.apply(this, arguments), this.unbindEvents && this.unbindEvents();
            },
            onRoomChanged: function(args) {
                this.onRoomDetailsChanged(args.room);
            },
            onCloseChat: function(skipPrompt) {
                var self = this, onCloseFnc = function(context) {
                    context.getDataController().closeChat().done(function() {
                        context.getChatModel().set("state", app.Constants.WidgetStates.Closed);
                    }).fail(function() {
                        alert("fail");
                    });
                }, confirmModal = self.getWidgetView().$el.find(".purechat-confirm-close-modal"), modalOverlay = self.getWidgetView().$el.find(".purchat-confirm-close-modal-overlay");
                !skipPrompt && self.options.get("RequestFromMobileDevice") && self.options.get("AllowWidgetOnMobile") ? (confirmModal.css({
                    display: "block"
                }), modalOverlay.css({
                    display: "block"
                }), confirmModal.find(".modal-button-bar .btn").off("click.PerformModalAction").on("click.PerformModalAction", function() {
                    var sender = $(this);
                    sender.hasClass("kill-chat") && onCloseFnc(self), confirmModal.css({
                        display: "none"
                    }), modalOverlay.css({
                        display: "none"
                    });
                })) : onCloseFnc(self);
            },
            onExpanded: function() {
                this.messageView.scrollToTop();
            },
            flashMobileNotificationIcon: function() {
                var self = this;
                if (this.settings.get("RequestFromMobileDevice") && this.settings.get("AllowWidgetOnMobile") && "number" != typeof this.mobileAnimationInterval) {
                    var elem = this.getWidgetView().$el, triggerElems = elem.hasClass("purechat-widget-collapsed") && elem.find(".purechat-expanded").is(":visible") ? elem : [];
                    if (triggerElems.length > 0) {
                        var visibleIcon = elem.find(".purechat-title-image-out-of-way-hilight").filter(":visible");
                        visibleIcon.addClass("flash");
                        var isFlashing = !0;
                        this.mobileAnimationInterval = setInterval(function() {
                            isFlashing ? (visibleIcon.removeClass("flash"), isFlashing = !1) : (visibleIcon.addClass("flash"), 
                            isFlashing = !0);
                        }, 1e3), triggerElems.off("click.StopNotification").on("click.StopNotification", function(e) {
                            var sender = $(e.currentTarget);
                            self.mobileAnimationInterval = clearInterval(self.mobileAnimationInterval), visibleIcon.removeClass("flash"), 
                            triggerElems.off("click.StopNotification"), sender.trigger("click");
                        });
                    }
                }
            },
            onMessage: function(userId, userDisplayName, roomId, roomDisplayName, time, message, isHistory, timeElapsed, protocolVersion, senderAvatarUrl, fromOperator, roomUtcOffset, messageId) {
                this.settings.get("avatarUrl");
                if (this.chatModel.get("isOperator") && notifier.notify("New message!"), null !== message && "string" == typeof message) {
                    var date = new Date();
                    if (date.setTime(1e3 * time), "undefined" != typeof CurrentUser && null !== CurrentUser) {
                        var isInDaylightSavings = CurrentUser.get("isInDaylightSavings"), utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                        date = new Date(utcDate.getTime() + 6e4 * (CurrentUser.get("accountUtcOffset") + (isInDaylightSavings ? 60 : 0)));
                    }
                    this.chatModel.get("messages").add({
                        type: "message",
                        message: message,
                        userName: userDisplayName,
                        myMessage: userId == this.chatModel.get("userId"),
                        time: date.toHourMinuteString(),
                        avatarUrl: senderAvatarUrl,
                        fromOperator: fromOperator,
                        visitorAvatarUrl: this.settings.get("room") && this.settings.get("room").visitorAvatarUrl ? this.settings.get("room").visitorGravatarHash : "",
                        rootUrl: this.chatModel.get("cdnServerUrl"),
                        userId: userId,
                        messageId: messageId
                    }), userId == this.chatModel.get("userId") || isHistory || app.execute("notifications:newMessage");
                }
                this.chatModel.get("userId") != userId && 0 == this.chatModel.get("isOperator") && 1 == this.chatModel.get("isWidget") && 0 == this.chatModel.get("expanded") && 0 == isHistory && this.getWidgetView().flashNotification(message), 
                !this.isUserAlone || this.chatModel.get("isOperator") || isHistory || message == this.chatModel.get("Question") || (this.chatModel.get("messages").add({
                    type: "note",
                    message: this.getResource("chat_noOperatorMessage"),
                    resourceKey: "chat_noOperatorMessage"
                }), this.messageView.scrollToTop({
                    forceBottom: !0
                })), this.messageView.scrollToTop(), $("body").trigger("ChatMessageAdded"), this.flashMobileNotificationIcon();
            },
            onTyping: function(userId, userDisplayName, roomId, roomDisplayName, isTyping, time) {
                this.messageView.typing(userId, userDisplayName, isTyping), this.messageView.scrollToTop();
            },
            onRoomClosed: function(roomId) {
                this.options.get("isOperator") || localStorage.roomId || this.getDataController().connectionInfo.get("roomId") != roomId || this.onCloseChat(!0);
            },
            onRoomDestroyed: function(roomId, roomDisplayName, time, reasonCode) {
                this.chatModel.set("closedReasonCode", reasonCode), this.chatModel.set("state", app.Constants.WidgetStates.Closed);
            },
            onUserDestroyed: function() {
                this.chatModel.set("state", app.Constants.WidgetStates.Closed);
            },
            onRoomDetailsChanged: function(args) {
                this.chatModel.set({
                    roomHostAvatarUrl: args.roomHostAvatarUrl || null,
                    roomHostName: args.roomHostName || null
                });
            },
            onJoined: function(userId, userDisplayName, roomId, roomDisplayName, time, isHistory) {
                if (this.chatModel.get("isOperator") || userId != this.chatModel.get("userId")) {
                    var date = new Date();
                    date.setTime(1e3 * time), this.chatModel.get("messages").add({
                        type: "note",
                        important: !0,
                        message: this.getResource("chat_joinMessage", {
                            displayName: userDisplayName
                        }),
                        username: userDisplayName,
                        resourceKey: "chat_joinMessage",
                        time: date.toHourMinuteString()
                    });
                }
                userId != this.chatModel.get("userId") && (this.messageView.scrollToTop({
                    forceBottom: !0
                }), this.isUserAlone = !1, this.chatModel.get("operators").add({
                    userDisplayName: userDisplayName,
                    userId: userId
                }), this.chatModel.get("operators").length > 0 ? this.chatModel.get("isOperator") || this.getWidgetView().setTitle(this.getResource("chat_nowChattingWith", {
                    chatUserNames: this.chatModel.chatUserNames()
                }), "chat_nowChattingWith") : this.isUserAlone = !0), this.messageView.scrollToTop({
                    forceBottom: !0
                });
            },
            onLeft: function(userId, userDisplayName, roomId, roomDisplayName, time, isHistory) {
                if (this.chatModel.get("isOperator") || userId != this.chatModel.get("userId")) {
                    var date = new Date();
                    date.setTime(1e3 * time), this.chatModel.get("messages").add({
                        type: "note",
                        message: this.getResource("chat_leftMessage", {
                            displayName: userDisplayName
                        }),
                        resourceKey: "chat_leftMessage",
                        time: date.toHourMinuteString()
                    });
                }
                userId != this.chatModel.get("userId") && (this.messageView.scrollToTop(), this.chatModel.get("operators").remove(userId), 
                this.chatModel.get("isOperator") || (this.chatModel.chatUserNames().length > 0 ? this.getWidgetView().setTitle(this.getResource("chat_nowChattingWith", {
                    chatUserNames: this.chatModel.chatUserNames()
                }), "chat_nowChattingWith") : this.getWidgetView().setTitle(this.getResource("title_initial"), "title_initial")));
            }
        }), States.addInitializer(function() {
            app.commands.setHandler("roomclosed", function(roomId) {
                "undefined" != typeof _pcwi && _pcwi.state.triggerMethod("roomClosed", roomId);
            });
        });
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateClosed = PCWidgetState.extend({
            name: "closed",
            stateSettings: {
                shouldBeInRoom: !1,
                UiVisiblity: {
                    restartButton: !0,
                    removeWidgetButton: !0
                }
            },
            handleRoomClose: function(response, room) {
                var self = this, visitorIPAddress = "undefined" != typeof response && null !== response && "string" == typeof response.visitorIPAddress ? response.visitorIPAddress : "", visitorIPAddressId = "undefined" != typeof response && null !== response && response.Id ? response.Id : -1, roomName = "undefined" != typeof room && null !== room && "string" == typeof room.name ? room.name : "", visitorReferer = "undefined" != typeof room && null !== room && "string" === room.visitorReferer ? room.visitorReferer : "", roomId = "undefined" != typeof room && null !== room && "undefined" != typeof room.id ? room.id : "";
                self.options.get("isOperator") && room.roomType && room.roomType == PureChat.enums.roomType.visitor && $.ajax({
                    url: "/ExternalApps",
                    type: "GET",
                    data: {
                        chatId: self.getDataController().connectionInfo.get("roomId")
                    }
                }).done(function(result) {
                    var myel = $(self.getWidgetView().el);
                    _.each(result, function(value, key) {
                        myel.find("#export-" + key).toggle(value);
                    });
                }), self.getWidgetView().$el.removeClass("purechat-button-hidden"), self.getWidgetView().onShow(), 
                localStorage.expanded = !1, self.getDataController().connectionInfo.set("chatClosed", !0), 
                self.getDataController().connectionInfo.persistLocalStorage(), self.getWidgetView().setTitle(self.getResource("title_chatClosed"), "title_chatClosed");
                var m = new backbone.Model({
                    isOperator: self.chatModel.get("isOperator"),
                    roomId: roomId,
                    visitorIPAddress: visitorIPAddress,
                    visitorIPAddressId: visitorIPAddressId,
                    visitorName: roomName,
                    visitorReferrer: visitorReferer,
                    closedReasonCode: self.chatModel.get("closedReasonCode")
                });
                self.chatModel.get("isOperator") ? m.set({
                    GoogId: "",
                    GaTrackingTab: !1,
                    GaTrackingChat: !1,
                    GaTrackingThumbs: !1,
                    GAUpThumbEvent: !1,
                    GADownThumbEvent: !1,
                    GAEventCategory: !1,
                    UsingGa: !1
                }) : m.set({
                    GoogId: self.getWidgetSettings().get("GoogId"),
                    GaTrackingTab: self.getWidgetSettings().get("GaTrackingTab"),
                    GaTrackingChat: self.getWidgetSettings().get("GaTrackingChat"),
                    GaTrackingThumbs: self.getWidgetSettings().get("GaTrackingThumbs"),
                    GAUpThumbEvent: self.getWidgetSettings().get("GAUpThumbEvent"),
                    GADownThumbEvent: self.getWidgetSettings().get("GADownThumbEvent"),
                    GAEventCategory: self.getWidgetSettings().get("GAEventCategory"),
                    UsingGa: self.getWidgetSettings().get("UsingGa"),
                    AskForRating: self.getWidgetSettings().get("AskForRating"),
                    CtaButton: self.getWidgetSettings().get("CtaButton"),
                    DownloadTranscript: self.getWidgetSettings().get("DownloadTranscript")
                });
                var closeMessage = new purechatApp.Views.ClosedMessage({
                    rm: self.getResources(),
                    model: m,
                    settings: self.options
                });
                self.listenTo(closeMessage, "chat:rated", function(up) {
                    self.getDataController().rateChat(up), up ? purechatApp.Utils.GaEvent(self.getWidgetSettings(), "GaTrackingThumbs", "GAUpThumbEvent") : purechatApp.Utils.GaEvent(self.getWidgetSettings(), "GaTrackingThumbs", "GADownThumbEvent"), 
                    self.getViewController().triggerResizedEvent();
                }), self.getWidgetView().content.show(closeMessage), self.getWidgetView().hideRoomHostAvatar(), 
                self.chatModel.set({
                    roomHostAvatarUrl: null,
                    roomHostName: null
                }), self.settings.get("isWidget") || self.getWidgetView().content.$el.addClass("end-chat-overflow"), 
                self.options.get("isDirectAccess") && ($(".direct-container-header").css("display", "block"), 
                "function" == typeof resizeDirectAccessContainer && resizeDirectAccessContainer()), 
                app.execute("poweredby:update", "Love chatting? Add <a " + (self.options.get("isPersonalChat") ? "" : 'style="font-size: 10px !important;"') + ' href="https://purechat.com" target="_blank">Pure Chat</a> to your site for free!'), 
                this.getDataController().unbindHandlerEvents();
            },
            onEnter: function() {
                PCWidgetState.prototype.onEnter.apply(this, arguments);
                var self = this, room = this.options.get("room") || {};
                self.getWidgetView().chatAutoStarted = !1, self.options.get("isPersonalChat") && !self.getPersonalDetailsView() && (self.getWidgetView().$el.find(".purechat-start-chat-button-container button").html('Back to Chat<i style="margin-left: .5em;" class="fa fa-chevron-right"></i>'), 
                self.personalDetails = new app.Views.PersonalChatDetails({
                    model: self.options
                }), self.getWidgetView().personalDetails.show(self.personalDetails), self.setPersonalDetailsView(self.personalDetails), 
                self.personalDetails.triggerMethod("afterInserted")), self.chatModel.get("isOperator") ? isNaN(parseInt(room.id)) ? self.handleRoomClose(null, room) : $.ajax({
                    type: "get",
                    dataType: "json",
                    url: "/Widget/GetVisitorIPAddress",
                    data: {
                        chatId: room.id || -1
                    }
                }).done(function(response) {
                    self.handleRoomClose(response, room);
                }) : self.handleRoomClose(null, null);
            },
            onExport: function(args) {
                var data = {};
                data.chatId = this.options.get("room").id, data.visitorEmail = this.options.get("room").visitorEmail, 
                data.visitorName = this.options.get("room").visitorName, pcDashboard.execute("export:" + args.app, data);
            },
            onRestartChat: function() {
                var inRoom = this.getDataController().checkInRoom();
                if (localStorage.expanded = !0, inRoom) this.getChatModel().set("state", app.Constants.WidgetStates.Activating); else {
                    var self = this;
                    self.getDataController().restartChat().done(function() {
                        self.getChatModel();
                        self.getChatModel().get("operators").reset(), self.getChatModel().get("messages").reset(), 
                        self.getDataController().connectionInfo.clearLocalStorage(), self.getChatModel().set("state", app.Constants.WidgetStates.Inactive);
                        self.getWidgetView();
                    }).fail(function() {
                        alert("fail");
                    });
                }
            }
        });
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateUnavailable = PCWidgetState.extend({
            name: "unavailable",
            stateSettings: {
                shouldBeInRoom: !1
            },
            onEnter: function() {
                PCWidgetState.prototype.onEnter.apply(this, arguments);
                var self = this, behavior = this.settings.get("IPIsBanned") ? 1 : self.options.get("UnavailableBehavior");
                if (self.getWidgetView().$el.find(".purechat-start-chat-button-container button").html("Start Chat"), 
                0 == behavior) self.getWidgetView().onHide(); else if (1 == behavior) self.getWidgetView().onShow(), 
                self.widgetView.model.get("expanded") ? self.getWidgetView().setTitle(this.getResource("title_noOperators"), "title_noOperators") : self.getWidgetView().setTitle(self.getResource("title_initial"), "title_initial"), 
                $(self.getWidgetView().content.el).html('<div data-resourcekey="error_noOperators" class="purechat-closedmessage-container">' + app.Utils.linkify(this.getResource("error_noOperators")) + "</div>"), 
                this.options.get("isPersonalChat") && this.options.get("isInEditorMode") && window.pcPersonalEditor && window.pcPersonalEditor.execute("editButton:show", $(self.getWidgetView().content.el).find("[data-resourcekey]")); else {
                    self.getWidgetView().onShow(), self.widgetView.model.get("expanded") ? self.getWidgetView().setTitle(this.getResource("title_noOperators"), "title_noOperators") : self.getWidgetView().setTitle(self.getResource("title_initial"), "title_initial");
                    var model = new backbone.Model({
                        AskForName: !0,
                        AskForEmail: !0,
                        AskForQuestion: !0,
                        EmailForm: !0,
                        InitialVisitorName: self.getViewController().getPublicApi().get("visitor_name"),
                        InitialVisitorEmail: self.getViewController().getPublicApi().get("visitor_email"),
                        InitialVisitorQuestion: self.getViewController().getPublicApi().get("visitor_question")
                    });
                    model.on("formSubmit", function(data) {
                        var form = $(self.getWidgetView().el).find(".purechat-form.purechat-email-form");
                        self.getDataController().submitEmailForm(data).done(function(result) {
                            if (result.success) {
                                var emailSent = new purechatApp.Views.EmailSent({
                                    rm: self.getResources(),
                                    model: model
                                });
                                self.getWidgetView().content.show(emailSent), self.getWidgetView().ui.restartButton.show(), 
                                self.getWidgetView().$el.find(".btn-restart").on("click.RestartChat", function(e) {
                                    self.restartChat.call(self, e);
                                });
                            } else form.find(".purechat-email-error").css({
                                display: "block"
                            });
                        }).fail(function() {});
                    });
                    var emailForm = new purechatApp.Views.StartChatForm({
                        viewController: self.getViewController(),
                        rm: self.getResources(),
                        model: model,
                        settings: this.options,
                        FormType: "email"
                    });
                    self.getWidgetView().content.show(emailForm);
                }
                self.listenTo(self.getChatModel(), "change:operatorsAvailable", function(model, available) {
                    available && self.getChatModel().set("state", app.Constants.WidgetStates.Inactive);
                });
                var isHideWidget = 0 == self.getWidgetSettings().get("UnavailableBehavior");
                (self.widgetView.model.get("expanded") && !isHideWidget || isHideWidget && self.getChatModel().get("operatorsAvailable")) && (window._pcDisableAvailabilityPings || self.startAvailabilityPolling());
            },
            onExpanded: function() {
                var inRoom = this.getDataController().checkInRoom();
                inRoom ? this.getChatModel().set("state", app.Constants.WidgetStates.Activating) : (this.getWidgetView().setTitle(this.getResource("title_noOperators"), "title_noOperators"), 
                this.startAvailabilityPolling());
            },
            onCollapsed: function() {
                this.getWidgetView().setTitle(this.getResource("title_initial")), 0 != this.getWidgetSettings().get("UnavailableBehavior") && this.stopAvailabilityPolling();
            },
            restartChat: function(e) {
                e.stopPropagation();
                var sender = $(e.currentTarget), self = this;
                sender.off("click.RestartChat"), self.getDataController().restartChat().done(function() {
                    self.getChatModel();
                    self.getChatModel().get("operators").reset(), self.getChatModel().get("messages").reset(), 
                    self.getDataController().connectionInfo.clearLocalStorage(), self.getChatModel().set("state", app.Constants.WidgetStates.Inactive);
                }).fail(function() {
                    throw new Error("Failed to send email. Please try again!");
                });
            }
        });
    }, purechatApp.Models), purechatApp.module("Controllers.States", function(States, app, Backbone, Marionette, $, _, Models) {
        States.PCStateUnsupported = PCWidgetState.extend({
            name: "unsupported",
            stateSettings: {
                UiVisiblity: {}
            },
            onEnter: function() {
                var self = this;
                PCWidgetState.prototype.onEnter.apply(this, arguments), self.getWidgetView().content.show(new app.Views.UnsupportedBrowser());
            }
        });
    }, purechatApp.Models), purechatApp.module("Controllers", function(Controllers, app, Backbone, Marionette, $, _, Models) {
        var BaseDataController = Marionette.Controller.extend({
            initialize: function() {
                this.connectionInfo = new purechatApp.Models.ChatConnection({}, this.options), this.options.connectionInfo && this.connectionInfo.set(this.options.connectionInfo);
            },
            loadWidgetSettings: function() {
                var self = this, d = $.Deferred();
                return this.getWidgetSettings().done(function(settings) {
                    self.widgetSettings = settings, d.resolve();
                }).fail(function() {
                    d.reject();
                }), d;
            }
        }), TestDataController = BaseDataController.extend({
            initialize: function() {
                BaseDataController.prototype.initialize.apply(this, arguments), this.chatAvailable = !0;
            },
            startChat: function(data) {
                return this.connectionInfo.set("userId", 1), this.connectionInfo.set("authToken", "adsfasfdsdf"), 
                this.connectionInfo.set("roomId", 1), $.Deferred().resolve(this.connectionInfo);
            },
            closeChat: function(data) {
                return $.Deferred().resolve();
            },
            restartChat: function(data) {
                return $.Deferred().resolve();
            },
            connectToChatServer: function(handler) {
                var d = $.Deferred();
                return this.handler = handler, setTimeout(function() {
                    d.resolve();
                }, 0), d;
            },
            sendRoomHistory: function(roomId) {},
            checkInRoom: function() {
                return !1;
            },
            newMessage: function(message) {
                var now = new Date(), hours = now.getHours(), minutes = now.getMinutes(), seconds = now.getSeconds(), pm = hours >= 12;
                hours = 10 > hours ? hours : 12 == hours ? hours : hours % 12, minutes = 10 > minutes ? "0" + minutes : minutes, 
                seconds = 10 > seconds ? "0" + seconds : seconds, Marionette.getOption(this, "chatModel").get("messages").add({
                    type: "message",
                    message: message,
                    myMessage: !0,
                    userName: "Aaron",
                    time: hours + ":" + minutes + " " + seconds + (pm ? "PM" : "AM"),
                    avatarUrl: "/content/images/avatars/1avatar-user-skinny.png"
                });
            },
            checkChatAvailable: function(accountId) {
                var self = this, d = $.Deferred();
                return setTimeout(function() {
                    d.resolve({
                        available: self.chatAvailable
                    });
                }, 1), d;
            },
            getWidgetSettings: function() {
                var widgetSettings = {
                    Version: 27288,
                    WidgetWording: {
                        Id: 721,
                        AccountId: 0,
                        Title: "Chat with us test."
                    },
                    AccountId: 1,
                    Color: "000000",
                    Position: 2,
                    WidgetType: 1,
                    UnavailableBehavior: 2,
                    AskForRating: !0,
                    AskForName: !0,
                    AskForEmail: !1,
                    AskForQuestion: !0,
                    ForcePopout: !1,
                    StringResources: {
                        chat_identifyFailed: "Failed to connect to PureChat!",
                        greeting: "Hello",
                        closed_message: "Thanks for chatting. Please rate how you feel about the chat session:",
                        closed_opMessage: "This chat has ended.<br/>What would you like to do?",
                        chat_joinMessage: "{displayName} has joined the chat!",
                        placeholder_email: "Email",
                        chat_connecting: "Connecting you to the chat now...",
                        chat_nowChattingWith: "Chatting with {chatUserNames}.",
                        label_pressToBegin: "Press the button below to begin!",
                        error_enterEmail: "Please enter an email address.",
                        closed_downloadTrans: "Download chat transcript",
                        title_noOperators: "No Operators Available",
                        error_enterQuestion: "Please enter a question",
                        noOperators_email_message: "There are currently no operators available, but feel free to send us an email!",
                        poweredby: "Powered by",
                        chat_noOperatorMessage: "An operator has not yet connected. Don't worry, an operator will be by shortly! When they connect, they'll see all the messages you've sent so far.",
                        chat_typing: "{displayName} is typing",
                        title_chatClosed: "Chat Closed",
                        closed_ratingThanks: "Thanks for your rating!",
                        placeholder_name: "Name",
                        title_initial: "Chat with us test.",
                        placeholder_question: "Enter your Question",
                        label_initial_label: "Introductory Text",
                        title_initial_label: "Widget Title",
                        error_noOperators: "Sorry, no operators are currently available",
                        label_initial: "Enter your info below to begin.",
                        error_noOperators_label: "No Operators Available",
                        button_startChat: "Send Chat Request",
                        label_initial_helptext: "This is the introductory text that will be displayed after the user clicks on the PureChat widget.",
                        button_sendEmail: "Send Email",
                        chat_startedMessage: "An operator will be right with you! Feel free to hide this box and navigate around the site.",
                        chat_leftMessage: "{displayName} has left the chat!",
                        chat_connectionFailed: "Failed to connect to PureChat!",
                        button_startNewChat: "Start a new chat",
                        error_noOperators_helptext: "This is the message that will be displayed when Hide Widget When Unavailable is unchecked, and there are no operators available.",
                        error_enterName: "Please enter a name."
                    },
                    GoogId: "UA-XXXX-Y",
                    GaTrackingTab: !1,
                    GaTrackingChat: !1,
                    GaTrackingThumbs: !1,
                    GATabEvent: "Tab Opened",
                    GAChatEvent: "Chat Started",
                    GAUpThumbEvent: "Thumbs Up",
                    GADownThumbEvent: "Thumbs Down",
                    GAEventCategory: "PureChat widget",
                    UsingGa: !1,
                    ChatServerUrl: "http://chad.purechat.com:8000",
                    DisplayWidgetAnimation: "bounceInDown",
                    CollapsedWidgetImageUrl: "http://chad.purechat.com/Content/images/widgetSamples/operator1.png"
                };
                return $.Deferred().resolve(widgetSettings);
            },
            rateChat: function(rate) {
                var d = $.Deferred();
                return d.resolve();
            },
            setTypingIndicator: function(isTyping) {},
            bindEvents: function(handler) {
                this.handler = handler;
            }
        }), DemoDataController = TestDataController.extend({
            getWidgetSettings: function() {
                var d = $.Deferred();
                return window.parent && window.parent.currentWidgetSettings ? d.resolve(window.parent.currentWidgetSettings.attributes) : this.options.isPersonalChat && window.pcPersonalEditorSettings ? (window.pcPersonalEditorSettings.set({
                    dataController: window.pcDataController,
                    renderInto: window.pcRenderInto
                }), d.resolve(window.pcPersonalEditorSettings.attributes)) : $.ajax({
                    url: Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/Widget/" + Marionette.getOption(this, "widgetId") + window.location.search,
                    dataType: "jsonp",
                    timeout: 2e4,
                    success: function(response) {
                        response.UserWidgetSettings = new Backbone.Model(response.UserWidgetSettings);
                        var widgetSettings = {
                            success: !0,
                            version: response.Version,
                            accountId: response.AccountId,
                            color: response.Color,
                            position: response.Position,
                            widgetType: response.WidgetType,
                            widgetConfig: response,
                            resources: response.StringResources,
                            googleAnalytics: response.GoogleAnalytics,
                            chatServerUrl: response.ChatServerUrl,
                            ShowMinimizeWidgetButton: response.ShowMinimizeWidgetButton,
                            userWidgetConfig: response.UserWidgetSettings
                        };
                        d.resolve(widgetSettings);
                    },
                    error: function(xhr, textStatus, error) {
                        d.reject();
                    }
                }), d.promise();
            }
        }), PCDataController = BaseDataController.extend({
            timeStampUrl: function(url) {
                var now = new Date();
                return url.indexOf("?") >= 0 ? url + "&t=" + now.getTime() : url + "?t=" + now.getTime();
            },
            closeChat: function() {
                return this.chatServerConnection.destroyself(), $.Deferred().resolve();
            },
            leaveChat: function() {
                return this.chatServerConnection.leave(this.connectionInfo.get("roomId")), $.Deferred().resolve();
            },
            restartChat: function(data) {
                return $.Deferred().resolve();
            },
            newMessage: function(message) {
                return "" == $.trim(message) ? !1 : "" == $.trim(message) ? !1 : void this.chatServerConnection.sendmessage(message, this.connectionInfo.get("roomId"));
            },
            checkChatAvailable: function(accountId) {
                var self = this;
                accountId = accountId || this.widgetSettings.accountId;
                var badBrowser = !1;
                if (this.options.BrowserDetails && ("Opera" == this.options.BrowserDetails.Browser && parseInt(this.options.BrowserDetails.Version) < 12 || "InternetExplorer" == this.options.BrowserDetails.Browser.replace(/\s+/g, "") && parseInt(this.options.BrowserDetails.Version) <= 9 || "Safari" == this.options.BrowserDetails.Browser && parseInt(this.options.BrowserDetails.Version) < 5) && (badBrowser = !0), 
                !window._checkChatAvailableDeferred) if (window._checkChatAvailableDeferred = $.Deferred(), 
                badBrowser) setTimeout(function() {
                    window._checkChatAvailableDeferred.resolve({
                        a: 0,
                        r: 2
                    });
                }, 300); else {
                    var urlOptions = {
                        accountId: accountId,
                        widgetId: this.options ? this.options.connectionSettings && this.options.connectionSettings.c ? this.options.connectionSettings.c : this.options.widgetId || this.options.Id : null
                    }, url = Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/ChatAvailable/" + urlOptions.accountId + "/" + urlOptions.widgetId + "/_PCcb";
                    $.ajax({
                        url: self.timeStampUrl(url),
                        dataType: "jsonp",
                        timeout: 2e4,
                        jsonpCallback: "_PCcb",
                        error: function() {
                            window._checkChatAvailableDeferred.reject(), window._checkChatAvailableDeferred = null;
                        }
                    });
                }
                return window._checkChatAvailableDeferred.promise();
            },
            getWidgetSettings: function() {
                var self = this, hasAllSettings = "boolean" == typeof Marionette.getOption(this, "hasAllSettings") ? Marionette.getOption(this, "hasAllSettings") : !1, d = $.Deferred();
                return hasAllSettings ? d.resolve({
                    success: !0,
                    version: Marionette.getOption(this, "Version"),
                    accountId: Marionette.getOption(this, "AccountId"),
                    color: Marionette.getOption(this, "Color"),
                    position: Marionette.getOption(this, "Position"),
                    widgetType: Marionette.getOption(this, "WidgetType"),
                    widgetConfig: this.options,
                    resources: Marionette.getOption(this, "StringResources"),
                    googleAnalytics: Marionette.getOption(this, "GoogleAnalytics"),
                    chatServerUrl: Marionette.getOption(this, "ChatServerUrl"),
                    userWidgetConfig: Marionette.getOption(this, "UserWidgetSettings")
                }) : $.ajax({
                    url: Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/Widget/" + Marionette.getOption(this, "widgetId"),
                    dataType: "jsonp",
                    timeout: 2e4,
                    success: function(response) {
                        if (response.Valid) {
                            0 == response.UnavailableBehavior && self.options.isDirectAccess && (response.UnavailableBehavior = 1), 
                            response.UserWidgetSettings = new Backbone.Model(response.UserWidgetSettings);
                            var widgetSettings = {
                                success: !0,
                                version: response.Version,
                                accountId: response.AccountId,
                                color: response.Color,
                                position: response.Position,
                                widgetType: response.WidgetType,
                                widgetConfig: response,
                                resources: response.StringResources,
                                googleAnalytics: response.GoogleAnalytics,
                                chatServerUrl: response.ChatServerUrl,
                                userWidgetConfig: response.UserWidgetSettings
                            };
                            d.resolve(widgetSettings);
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        d.reject();
                    }
                }), d.promise();
            },
            submitEmailForm: function(data) {
                data.widgetId = Marionette.getOption(this, "widgetId");
                var d = $.Deferred();
                return $.ajax({
                    url: Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/SendEmail",
                    dataType: "jsonp",
                    type: "GET",
                    data: data
                }).done(function(result) {
                    d.resolve(result);
                }).fail(function() {}), d.promise();
            },
            startChat: function(data) {
                var self = this, d = $.Deferred(), escapedUserDisplayName = data.visitorName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), url = Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/Chat/" + Marionette.getOption(this, "widgetId") + "?visitorName=" + encodeURIComponent(escapedUserDisplayName) + "&origin=" + encodeURIComponent(data.origin || window.location.toString() || "unknown") + "&expandSource=" + window.localStorage.getItem("expandSource") + "&acquisitionSource=" + (localStorage.acquisitionSource || "Direct");
                return data.visitorEmail && (url += "&visitorEmail=" + encodeURIComponent(data.visitorEmail)), 
                data.visitorPhoneNumber && (url += "&visitorPhoneNumber=" + encodeURIComponent(data.visitorPhoneNumber)), 
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    timeout: 2e4,
                    success: function(response) {
                        response.user && response.room ? (self.connectionInfo.set({
                            userId: response.user.id,
                            authToken: response.user.authToken,
                            roomId: response.room.id,
                            chatId: response.chat.id,
                            chatClosed: !1
                        }), self.widgetSettings.chatServerUrl = response.server.url, d.resolve(self.connectionInfo)) : ("undefined" != typeof connectingView && null !== connectingView && connectingView.showErrorMessage(response.message), 
                        d.reject(response.message)), d.resolve();
                    },
                    error: function(xhr, textStatus, error) {
                        d.reject(textStatus + ", " + error);
                    }
                }), d;
            },
            connectToChatServer: function(bindTo) {
                function onIdentify(success, response, errorCode, errorMessage) {
                    socketConnected = !0, 0 == success ? d.reject() : d.resolve();
                }
                var socketConnected, d = $.Deferred(), accountId = accountId || this.widgetSettings.accountId;
                return this.chatServerConnection ? (this.chatServerConnection.identify(this.connectionInfo.get("userId"), accountId, this.connectionInfo.get("authToken"), onIdentify, "boolean" == typeof this.options.connectionSettings.poppedOut ? this.options.connectionSettings.poppedOut : !1), 
                bindTo && this.bindEvents(bindTo)) : (this.chatServerConnection = new PureChat(this.widgetSettings.chatServerUrl + "/client", this.connectionInfo.get("userId"), accountId, this.connectionInfo.get("authToken"), onIdentify, function() {
                    socketConnected || d.reject();
                }, null, "boolean" == typeof this.options.connectionSettings.poppedOut ? this.options.connectionSettings.poppedOut : !1), 
                bindTo && this.bindEvents(bindTo)), d;
            },
            setTypingIndicator: function(isTyping) {
                this.chatServerConnection.sendtyping(this.connectionInfo.get("roomId"), isTyping);
            },
            rateChat: function(rate) {
                var d = $.Deferred();
                return $.ajax({
                    url: Marionette.getOption(this, "pureServerUrl") + "/VisitorWidget/Rate",
                    dataType: "jsonp",
                    data: {
                        chatId: this.connectionInfo.get("chatId"),
                        rating: rate,
                        authToken: this.connectionInfo.get("authToken")
                    }
                }).done(function() {}).fail(function() {}), d.promise();
            },
            checkInRoom: function() {
                return this.connectionInfo.isInChat() || this.connectionInfo.loadFromLocalStorage().isInChat();
            },
            setCurrentPage: function(page) {
                this.chatServerConnection.setVisitorDetails(this.connectionInfo.get("roomId"), {
                    visitorReferer: page
                });
            },
            sendRoomHistory: function(roomId) {
                this.chatServerConnection.sendroomhistory(roomId || this.connectionInfo.get("roomId"));
            },
            bindEvents: function(handler) {
                var self = this;
                self.handler = handler;
                var eventHandlers = {
                    message: function(userId, userDisplayName, roomId, roomDisplayName, time, message, isHistory, protocolVersion) {
                        self.connectionInfo.get("roomId") == roomId && (message = message.replace("response below to see hos it works", "response below to see how it works"), 
                        handler.onMessage.apply(handler, arguments));
                    },
                    joined: function(userId, userDisplayName, roomId, roomDisplayName, time, isHistory) {
                        self.connectionInfo.get("roomId") == roomId && handler.onJoined.apply(handler, arguments);
                    },
                    left: function(userId, userDisplayName, roomId, roomDisplayName, time, isHistory) {
                        self.connectionInfo.get("roomId") == roomId && handler.onLeft.apply(handler, arguments);
                    },
                    roomdestroyed: function(roomId, roomDisplayName, time) {
                        self.connectionInfo.get("roomId") == roomId && handler.onRoomDestroyed.apply(handler, arguments);
                    },
                    typing: function(userId, userDisplayName, roomId, roomDisplayName, isTyping, time) {
                        self.connectionInfo.get("userId") != userId && self.connectionInfo.get("roomId") == roomId && handler.onTyping.apply(handler, arguments);
                    },
                    userDestroyed: function(userId) {
                        self.connectionInfo.get("userId") == userId && handler.onRoomDestroyed.apply(handler);
                    },
                    roomdetailschanged: function(args) {
                        self.connectionInfo.get("roomId") == args.id && handler.onRoomDetailsChanged.apply(handler, arguments);
                    },
                    roomchanged: function(args) {
                        self.connectionInfo.get("roomId") == args.room.id && handler.onRoomChanged.apply(handler, arguments);
                    }
                };
                self.unbindHandlerEvents = function() {
                    self.chatServerConnection.off(eventHandlers), self.handler = null;
                }, self.chatServerConnection.on(eventHandlers);
            }
        }), DashboardDataController = PCDataController.extend({
            initialize: function(options) {
                BaseDataController.prototype.initialize.apply(this, arguments), this.chatServerConnection = options.chatServerConnection;
            },
            closeChat: function() {
                return this.chatServerConnection.closeroom(this.connectionInfo.get("roomId")), $.Deferred().resolve();
            },
            connectToChatServer: function(bindTo) {
                var d = $.Deferred();
                return bindTo && this.bindEvents(bindTo), d.resolve();
            },
            getWidgetSettings: function() {
                var d = $.Deferred();
                return $.ajax({
                    url: "/User/DashboardSettings",
                    dataType: "json",
                    type: "post",
                    success: function(data) {
                        var widgetSettings = {
                            success: !0,
                            authToken: data.authToken,
                            version: "",
                            accountId: data.accountId,
                            userId: data.userId,
                            position: null,
                            widgetType: null,
                            widgetConfig: data,
                            resources: {},
                            googleAnalytics: null,
                            chatServerUrl: data.chatServerUrl
                        };
                        d.resolve(widgetSettings);
                    }
                }), d.promise();
            },
            checkInRoom: function() {
                return this.connectionInfo.get("roomId") ? !0 : !1;
            }
        });
        Controllers.DemoDataController = DemoDataController, Controllers.DashboardDataController = DashboardDataController, 
        Controllers.PCDataController = PCDataController;
    }, purechatApp.Models);
    var MESSAGE_DISPLAY_WIDTH = 40;
    purechatApp.module("Controllers", function(Controllers, app, Backbone, Marionette, $, _, Models) {
        function getStartTime(time, timeElapsed) {
            var now = new Date(), utcNowDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()), differenceSeconds = utcNowDate.getTime() / 1e3 - time, newTime = parseInt(time, 10) - (parseInt(timeElapsed, 10) - differenceSeconds);
            return 1e3 * newTime;
        }
        var PureChatController = Marionette.Controller.extend({
            _publicApi: new Backbone.Model(),
            getPublicApi: function() {
                return this._publicApi;
            },
            setChatModel: function(model) {
                this.chatModel = model;
            },
            getChatModel: function() {
                return this.chatModel;
            },
            setDataController: function(dc) {
                this.dc = dc;
            },
            getDataController: function() {
                return this.dc;
            },
            popoutChatOnExpand: function(dataController, settings, chatModel, state) {
                chatModel.set("poppedOut", !0), state.disable(), dataController.connectionInfo.persistLocalStorage();
                var url = settings.pureServerUrl + "/VisitorWidget/ChatWindow?widgetId=" + settings.widgetId + "&userId=" + dataController.connectionInfo.get("userId") + "&displayName=" + dataController.connectionInfo.get("visitorName") + "&authToken=" + dataController.connectionInfo.get("authToken") + "&roomId=" + dataController.connectionInfo.get("roomId") + "&chatId=" + dataController.connectionInfo.get("chatId") + "&origin=" + encodeURIComponent(chatModel.get("origin"));
                window.openedWindow = window.open(url, "purechatwindow", "menubar=no, location=no, resizable=yes, scrollbars=no, status=no, width=480, height=640");
            },
            registerPublicApiEvents: function() {
                var self = this;
                self.on("state:changed", function(e) {
                    var newEvent = {
                        widgetId: self.getChatModel().id,
                        state: e.newState.name
                    };
                    e.oldState && (newEvent.previousState = e.oldState.name), self.getPublicApi().trigger("widget:state-changed", newEvent);
                }), this.on("widget:ready", function() {
                    self.getPublicApi().trigger("ready", {
                        widgetId: self.getChatModel().id
                    }), self.getPublicApi().trigger("widget:ready", {
                        id: self.getChatModel().id
                    }), self.listenTo(self.widgetLayout, "widget:resized", function(e) {
                        self.getPublicApi().trigger("resized", {
                            widgetId: self.getChatModel().id
                        }), self.getPublicApi().trigger("widget:resized", {
                            widgetId: self.getChatModel().id,
                            width: e.width,
                            height: e.height
                        });
                    }), self.listenTo(self.widgetLayout, "expanded", function() {
                        self.getPublicApi().trigger("widget:expanded", {
                            widgetId: self.getChatModel().id
                        });
                    }), self.listenTo(self.widgetLayout, "collapsed", function() {
                        self.getPublicApi().trigger("widget:collapsed", {
                            widgetId: self.getChatModel().id
                        });
                    }), self.listenTo(self.getPublicApi(), "widget:collapse", function() {
                        self.widgetLayout.triggerMethod("collapse");
                    }), self.listenTo(self.getPublicApi(), "widget:expand", function(args) {
                        self.widgetLayout.expand(null, null, args);
                    }), self.listenTo(self.getPublicApi(), "room:hostChanged", function(args) {
                        this.roomHostChanged(args);
                    });
                });
            },
            triggerResizedEvent: function() {
                var self = this;
                setTimeout(function() {
                    if (self.widgetLayout && self.widgetLayout.$el) {
                        var width = self.widgetLayout.$el.width();
                        self.widgetLayout.trigger("resized", {
                            height: 390,
                            width: width
                        }), self.widgetLayout.trigger("widget:resized", {
                            height: 390,
                            width: width
                        }), setTimeout(function() {
                            var height = self.widgetLayout.$el.height();
                            if (0 === height) {
                                var image = self.widgetLayout.$el.find("img.collapsed-image");
                                image.length > 0 && (height = image.height(), width = image.width());
                            }
                            self.widgetLayout.trigger("resized", {
                                height: height,
                                width: width
                            }), self.widgetLayout.trigger("widget:resized", {
                                height: height,
                                width: width
                            });
                        }, 1e3);
                    }
                }, 0);
            },
            unbindAppLevelCommands: function() {
                app.commands.removeHandler("roomHostChanged");
            },
            bindAppLevelCommands: function() {
                var self = this;
                try {
                    this.unbindAppLevelCommands();
                } catch (ex) {}
                app.commands.setHandler("roomHostChanged", function(args) {
                    (!self.options.get("AllowWidgetOnMobile") && self.options.get("RequestFromMobileDevice") || !self.options.get("RequestFromMobileDevice")) && self.getPublicApi().trigger("room:hostChanged", args);
                });
            },
            initialize: function(options) {
                function socketIOLoadComplete() {
                    self.options.set(self.options.get("dataController").widgetSettings.widgetConfig), 
                    self.setupPageActivityTest(), self.rm = self.options, self.options.set(self.getDataController().widgetSettings), 
                    $(".purechat-button-expand").find(".purechat-button-text").text(self.options.getResource("title_initial"), "title_initial"), 
                    chatModel.on("change:operatorsAvailable", function(model, available) {
                        var expandButtons = $(".purechat-button-expand");
                        expandButtons.filter(":not(.purechat)").click(function(e) {
                            var dataController = self.getDataController();
                            $(e.target).hasClass("pc-icon-caret-down") || $(e.target).hasClass("purechat-super-minimize-link-button") || !(dataController.options.ForcePopout && !self.chatModel.get("isPoppedOut") || dataController.options.usePrototypeFallback) ? self.widgetLayout.triggerMethod("expand", e, {
                                collapse: $(e.target).hasClass("btn-collapse") || $(e.target).hasClass("pc-icon-minus"),
                                superMinimize: $(e.target).hasClass("pc-icon-caret-down") || $(e.target).hasClass("pc-icon-caret-up") || $(e.target).hasClass("purechat-super-minimize-link-button")
                            }) : self.popoutChatOnExpand(dataController, dataController.options, self.chatModel, self.state);
                        }), available ? (expandButtons.addClass("purechat-button-available"), expandButtons.removeClass("purechat-button-unavailable"), 
                        expandButtons.removeClass("purechat-button-hidden"), expandButtons.removeAttr("disabled")) : (0 === self.options.get("UnavailableBehavior") && (expandButtons.removeClass("purechat-button-available"), 
                        expandButtons.addClass("purechat-button-unavailable"), expandButtons.attr("disabled", "disabled")), 
                        expandButtons.each(function() {
                            var hide, next = $(this), hideString = next.attr("HideUnavailable");
                            hide = hideString ? "true" == hideString : 0 === self.options.get("UnavailableBehavior"), 
                            hide && next.addClass("purechat-button-hidden");
                        }));
                    }), self.getDataController().connectionInfo.isInChat() || self.getDataController().connectionInfo.loadFromLocalStorage(), 
                    chatModel.set("userId", self.getDataController().connectionInfo.get("userId")), 
                    self.widgetLayout = new purechatApp.Views.WidgetLayout({
                        viewController: self,
                        rm: self.rm,
                        model: chatModel,
                        widgetSettings: self.options
                    }), self.widgetLayout.render(), self.widgetLayout.onHide(), !self.getDataController().connectionInfo.get("chatActiveInOtherWindow") && self.getDataController().connectionInfo.get("disabled") && self.getDataController().connectionInfo.get("roomId") ? self.widgetLayout.$el.hide() : self.getDataController().connectionInfo.get("chatActiveInOtherWindow") && self.widgetLayout.triggerMethod("collapse");
                    var styleLoadingComplete = function() {
                        $(options.get("renderInto")).append(self.widgetLayout.$el), self.bindGobalCommand(self.widgetLayout.$el), 
                        self.triggerMethod("rendered"), self.options.get("dataController").options.chatModel = self.getChatModel(), 
                        self.listenTo(chatModel, "change:state", self.stateChange), chatModel.set("state", self.options.get("initialState") || app.Constants.WidgetStates.Initializing), 
                        self.listenTo(self.widgetLayout.$el, "change:state", self.stateChange), self.widgetLayout.$el.removeClass("hide"), 
                        self.widgetLayout.triggerMethod("afterInsertion"), self.trigger("widget:ready"), 
                        !self.chatModel.get("expanded") && self.options.get("RequestFromMobileDevice") && self.options.get("AllowWidgetOnMobile") && setTimeout(function() {
                            self.widgetLayout.collapseMobile();
                        }, 1e3), self.setUpUiTriggers();
                    };
                    if (self.options.get("isOperator")) styleLoadingComplete(); else {
                        var styleLoaded = !1, browserName = self.options.get("BrowserDetails").Browser || "", browserOS = (parseFloat(self.options.get("BrowserDetails").Version || ""), 
                        self.options.get("BrowserDetails").OS || "Other"), sheetUrl = null, cssVersion = self.options.get("version") + self.options.get("CssVersion");
                        sheetUrl = self.options.get("isPersonalChat") ? self.options.get("RequestFromMobileDevice") ? self.options.get("cdnServerUrl") + "/VisitorWidget/WidgetCss/personal-mobile/" + self.options.get("Color") + "/" + cssVersion + ".css" : self.options.get("cdnServerUrl") + "/VisitorWidget/WidgetCss/personal/" + self.options.get("Color") + "/" + cssVersion + ".css" : self.options.get("RequestFromMobileDevice") && (self.options.get("isDemo") || self.options.get("AllowWidgetOnMobile")) ? self.options.get("cdnServerUrl") + "/VisitorWidget/WidgetCss/mobile/" + self.options.get("Color") + "/" + cssVersion + ".css" : self.options.get("cdnServerUrl") + "/VisitorWidget/WidgetCss/" + self.options.get("StyleName") + "/" + self.options.get("Color") + "/" + cssVersion + ".css";
                        var sheet = $('<link rel="stylesheet" href="' + sheetUrl + '" type="text/css">'), count = 0;
                        if (/safari/i.test(browserName) && "Windows" == browserOS) {
                            console.log("Safari on Windows detected"), sheet.appendTo("head");
                            var interval = setInterval(function() {
                                (sheet[0].sheet || count >= 150) && (styleLoaded || (styleLoaded = !0, interval = clearInterval(interval), 
                                styleLoadingComplete())), count++;
                            }, 100);
                        } else sheet.appendTo("head").on("load", function() {
                            styleLoaded = !0, styleLoadingComplete();
                        });
                    }
                }
                var self = this;
                this.registerPublicApiEvents(), app.pureServerUrl = options.get("pureServerUrl");
                var chatModel = ($.Deferred(), new purechatApp.Models.Chat({
                    isWidget: options.get("isWidget"),
                    position: options.get("position"),
                    pureServerUrl: options.get("pureServerUrl"),
                    cdnServerUrl: options.get("cdnServerUrl") || options.get("pureServerUrl"),
                    widgetType: app.Constants.WidgetType.Tab,
                    isOperator: options.get("isOperator"),
                    isPoppedOut: options.get("poppedOut"),
                    State: app.Constants.WidgetStates.Inactive,
                    messages: new purechatApp.Models.MessageCollection(),
                    operators: new purechatApp.Models.OperatorCollection(),
                    origin: options.get("origin") || window.location.href,
                    userId: options.get("userId")
                }));
                if (self.setChatModel(chatModel), options.get("isDemo") && (chatModel.set("operatorsAvailable", !0), 
                chatModel.set("visitorName", options.get("visitorName")), options.get("isPersonalChat") && options.get("isInEditorMode") && (window.pcDemoChatModel = chatModel)), 
                window.pcDashboard) var socketIoLoaded = $.Deferred().resolve(); else var socketIoLoaded = $.ajax({
                    url: options.get("cdnServerUrl") + "/scripts/socket.io.v0.9.16.js",
                    dataType: "script",
                    cache: !0
                });
                var dcReady = self.setupDataController(options, chatModel);
                $.when(dcReady, socketIoLoaded).done(socketIOLoadComplete).fail(function() {
                    self.trigger("widget:fail");
                }), this.on("all", function() {
                    self.state && self.state.triggerMethod.apply(self.state, arguments);
                });
            },
            setUpUiTriggers: function() {
                new app.Triggers.TimeBasedTrigger(this), new app.Triggers.UrlBasedTrigger(this);
            },
            setupDataController: function(options, chatModel) {
                var settingsDeferred = this.options.get("dataController").loadWidgetSettings();
                return this.setDataController(this.options.get("dataController")), settingsDeferred;
            },
            setupPageActivityTest: function() {
                var self = this, tid = null, lastX = -9999, lastY = -9999;
                self.pageActivity = !1, $(document).on("mousemove.setupPageActivityTest", $.throttle(1e4, function(e) {
                    tid && clearTimeout(tid), Math.abs(lastX - e.clientX) <= 2 && Math.abs(lastY - e.clientY) <= 2 || (lastX = e.clientX, 
                    lastY = e.clientY, self.pageActivity = !0, tid = setTimeout(function() {
                        self.pageActivity = !1;
                    }, 45e3));
                }));
            },
            stateChange: function(model, newState) {
                var state = new app.Controllers.States[newState](this.options);
                this.setState(state);
            },
            setState: function(newState) {
                var oldState = this.state, status = {};
                null != this.state && (status = this.state.status, this.state.triggerMethod("exit"), 
                this.state.destroy()), this.state = newState, this.state.status = status, this.state.setChatModel(this.getChatModel()), 
                this.state.setWidgetView(this.widgetLayout), this.state.setWidgetSettings(this.options), 
                this.state.setResources(this.rm), this.state.setDataController(this.getDataController()), 
                this.state.setViewController(this), this.trigger("state:changed", {
                    oldState: oldState,
                    newState: newState
                }), this.state.triggerMethod("enter"), this.triggerResizedEvent();
            },
            bindGobalCommand: function($el) {
                var self = this;
                $el.on("click.delegateEvents", "[data-command]", function(e) {
                    e.preventDefault();
                    var $this = $(this), command = $this.data("command"), commandParams = $this.data("command-params");
                    self.trigger(command, commandParams);
                });
            },
            showConfirmationDialog: function() {
                return $.Deferred.resolve();
            },
            undelegateEvents: function() {
                return this.$el.off(".delegateEvents" + this.cid), this;
            },
            onClose: function() {},
            onDestroy: function() {
                $(document).off(".setupPageActivityTest"), this.getDataController().unbindHandlerEvents(), 
                this.getDataController().chatServerConnection = null, this.getDataController().destroy(), 
                this.widgetLayout.destroy(), this.state.destroy(), this.state = null, this.widgetLayout = null, 
                this.setDataController(null), this.setChatModel(null), this.options && (this.options.attributes.dataController = null, 
                this.options.attributes.renderInto = null, this.options._previousAttributes.dataController = null, 
                this.options._previousAttributes.renderInto = null, this.options = null), this.unbindAppLevelCommands();
            },
            roomHostChanged: function(args) {
                var chatModel = this.getChatModel();
                for (var key in args) chatModel.set(key, args[key], {
                    silent: !0
                });
                chatModel.trigger("roomHostChanged");
            }
        }), DashboardChatController = PureChatController.extend({
            onRendered: function() {
                if (this.widgetLayout.setCannedResponses(this.options.get("cannedResponses")), this.options.get("isInvisible") ? this.widgetLayout.setTitle(this.options.get("room").name + " (Eavesdropping)") : this.widgetLayout.setTitle(this.options.get("room").name), 
                this.options.get("room").roomType == PureChat.enums.roomType.visitor) {
                    var refererLink = this.options.get("room").visitorReferer;
                    "Unknown" != refererLink && (refererLink = '<a target="_blank" href="' + refererLink + '">' + refererLink + "</a>");
                    var startTime, referer = $('<div class="chat-referer" title="' + this.options.get("room").visitorReferer + '">' + refererLink + "</div>");
                    startTime = null != this.options.get("room").timeElapsed ? getStartTime(this.options.get("room").time, this.options.get("room").timeElapsed) : room.time;
                    var timer = $('<div class="purechat-start time"></div>');
                    timer.attr("start-time", startTime), this.widgetLayout.$el.find(".purechat-chat-info").append(timer), 
                    this.widgetLayout.$el.find(".purechat-chat-info").append(referer);
                } else {
                    var info = $('<div class="operator-bar">Operator Room</div>');
                    this.widgetLayout.$el.find(".purechat-chat-info").append(info);
                }
                pcDashboard && pcDashboard.vent.trigger("chat:selected", this.rm.get("room").id);
            },
            showConfirmationDialog: function(confirmation, title) {
                var $d = $.Deferred(), dialog = window.showConfirmationDialog({
                    title: title || "Are you sure?",
                    bodyText: confirmation,
                    onConfirm: function() {
                        $d.resolve(), dialog.modal("hide");
                    }
                });
                return $d;
            }
        });
        Controllers.DashboardChatController = DashboardChatController, Controllers.PureChatController = PureChatController;
    }, purechatApp.Models), _PCWidget = PCWidget = function(connectionSettings) {
        connectionSettings.pureServerUrl = connectionSettings.pureServerUrl || "https://www.purechat.com";
        var dataController, dataControllerOptions = {
            test: !1,
            widgetId: connectionSettings.widgetId || connectionSettings.c,
            connectionSettings: connectionSettings,
            isWidget: connectionSettings.isWidget || connectionSettings.f,
            isOperator: void 0 == connectionSettings.d ? !1 : connectionSettings.d,
            pureServerUrl: connectionSettings.pureServerUrl,
            renderInto: $("body")
        };
        window._pcDisableAvailabilityPings = connectionSettings.DisableAvailabilityPings || connectionSettings.IPIsBanned, 
        dataController = dataControllerOptions.test ? new purechatApp.Controllers.TestDataController(dataControllerOptions) : new purechatApp.Controllers.PCDataController($.extend(connectionSettings, dataControllerOptions));
        var usePrototypeFallback = !1, prototypeErrorMessage = "";
        if ("undefined" != typeof Prototype) try {
            var splitVersion = Prototype.Version.split(/\./g);
            splitVersion.length > 0 && (usePrototypeFallback = parseInt(splitVersion[0]) >= 2 ? !1 : parseInt(splitVersion[1]) >= 7 ? !1 : !0);
        } catch (ex) {
            prototypeErrorMessage = ex;
        }
        usePrototypeFallback && (prototypeErrorMessage = "PureChat widgets are not compatible with Prototype.js versions < 1.7. Default widget behavior will popout into a new window"), 
        prototypeErrorMessage.length > 0 && "undefined" != typeof console && null !== console && console.log(prototypeErrorMessage);
        var viewOptions = {
            test: !1,
            pureServerUrl: connectionSettings.pureServerUrl,
            widgetId: connectionSettings.widgetId || connectionSettings.c,
            isWidget: connectionSettings.isWidget || connectionSettings.f,
            isOperator: void 0 == connectionSettings.d ? !1 : connectionSettings.d,
            renderInto: $("body"),
            dataController: dataController,
            usePrototypeFallback: usePrototypeFallback
        };
        viewOptions = $.extend(connectionSettings, viewOptions);
        var c1 = new purechatApp.Controllers.PureChatController(new purechatApp.Models.WidgetSettings(viewOptions));
        return purechatApp.Notifications.controller = new purechatApp.Notifications.Controller({
            settings: c1.options
        }), c1;
    }, purechatApp.module("Triggers", function(Triggers, app, Backbone, Marionette, $, _, Models) {
        Triggers.MILLISECONDS_IN_SECOND = 1e3, Triggers.SECONDS_IN_MINUTE = 60, Triggers.MINUTES_IN_HOUR = 60, 
        Triggers.HOURS_IN_DAY = 24, Triggers.MILLISECONDS_IN_DAY = Triggers.HOURS_IN_DAY * Triggers.MINUTES_IN_HOUR * Triggers.SECONDS_IN_MINUTE * Triggers.MILLISECONDS_IN_SECOND, 
        Triggers.DISMISS_DELAYS_DAYS = [ 0, 1, 3, 7, 30, 365 ], Triggers.CHECKIN_INTERVAL_SECONDS = 5, 
        Triggers.MAX_CHECKIN_INTERVAL_SECOND = 60;
        var DismissSettings = Backbone.Model.extend({
            storageKeys: [ "_purechatSessionStart", "_purechatLastCheckin", "_purechatDismissTime", "_pureChatTimeSettingsVersion", "_purechatDismissCount" ],
            defaults: {
                _purechatSessionStart: new Date(),
                _purechatPageStart: new Date(),
                _purechatLastCheckin: new Date(),
                _purechatDismissCount: 0
            },
            fetchDate: function(nextKey) {
                var val = window.localStorage.getItem(this.formatPropName(nextKey));
                _.isUndefined(val) || _.isNaN(val) || _.isNull(val) || this.set(nextKey, new Date(window.localStorage.getItem(this.formatPropName(nextKey))));
            },
            fetchInt: function(nextKey) {
                var val = window.localStorage.getItem(this.formatPropName(nextKey));
                _.isUndefined(val) || _.isNaN(val) || _.isNull(val) || this.set(nextKey, parseInt(window.localStorage.getItem(this.formatPropName(nextKey))), 10);
            },
            formatPropName: function(prop) {
                return this.widgetId + "_" + prop;
            },
            fetch: function() {
                this.fetchDate("_purechatSessionStart"), this.fetchDate("_purechatLastCheckin"), 
                this.fetchDate("_purechatDismissTime"), this.fetchInt("_pureChatTimeSettingsVersion"), 
                this.fetchInt("_purechatDismissCount");
            },
            save: function() {
                var self = this;
                this.storageKeys.forEach(function(nextKey, index) {
                    var val = self.get(nextKey);
                    _.isUndefined(val) || _.isNaN(val) || _.isNull(val) ? window.localStorage.removeItem(self.formatPropName(nextKey)) : window.localStorage.setItem(self.formatPropName(nextKey), self.get(nextKey));
                });
            },
            resetTimeCounters: function() {
                this.set({
                    _purechatDismissTime: null
                });
            },
            updateEventLoop: function() {
                this.set("_purechatLastCheckin", new Date()), window.localStorage.setItem(this.formatPropName("_purechatLastCheckin"), this.get("_purechatLastCheckin"));
            },
            initialize: function() {
                _.bindAll(this, "updateEventLoop"), setInterval(this.updateEventLoop, Triggers.CHECKIN_INTERVAL_SECONDS * Triggers.MILLISECONDS_IN_SECOND);
            }
        }), BaseControllerSettings = Marionette.Controller.extend({
            isPoppedOut: function() {
                return this.widgetSettings.get("isPoppedOut");
            },
            isHosted: function() {
                return this.widgetSettings.get("isDirectAccess");
            },
            isPersonalChat: function() {
                return this.widgetSettings.get("isPersonalChat");
            },
            isDemoChat: function() {
                return this.widgetSettings.get("isDemo");
            },
            isMobile: function() {
                return this.widgetSettings.get("RequestFromMobileDevice");
            },
            isWidgetAvailable: function() {
                return this.purechatController.chatModel.get("operatorsAvailable");
            },
            popOutAutomatically: function() {
                return this.widgetSettings.get("ForcePopout") || !1;
            },
            initialize: function(purechatController) {
                var self = this;
                if (this.purechatController = purechatController, this.widgetSettings = purechatController.options, 
                this.enabled = !(!this.widgetSettings.get(this.enabledWidgetSettingKey) || this.isPoppedOut() || this.isHosted() || this.isPersonalChat() || this.isDemoChat() || this.isMobile() || this.popOutAutomatically()), 
                this.enabled) {
                    _.bindAll(this, "onCollapse"), BaseControllerSettings.dismissSettings || (BaseControllerSettings.dismissSettings = new DismissSettings(), 
                    BaseControllerSettings.dismissSettings.widgetId = this.widgetSettings.get("Id"), 
                    BaseControllerSettings.dismissSettings.fetch());
                    var settingsVersion = BaseControllerSettings.dismissSettings.get("_pureChatTimeSettingsVersion"), currentWidgetSettings = this.widgetSettings.get("WidgetSettingsVersion");
                    settingsVersion && settingsVersion == currentWidgetSettings || (BaseControllerSettings.dismissSettings.resetTimeCounters(), 
                    BaseControllerSettings.dismissSettings.set("_pureChatTimeSettingsVersion", currentWidgetSettings)), 
                    this.isNewSession() && BaseControllerSettings.dismissSettings.set("_purechatSessionStart", new Date()), 
                    this.purechatController.getPublicApi().on("widget:collapsed", this.onCollapse), 
                    self.startTesting(), BaseControllerSettings.dismissSettings.save();
                }
            },
            onCollapse: function() {
                BaseControllerSettings.dismissSettings.set("_purechatDismissCount", BaseControllerSettings.dismissSettings.get("_purechatDismissCount") + 1), 
                this.stopTesting(), BaseControllerSettings.dismissSettings.set("_purechatDismissTime", new Date()), 
                BaseControllerSettings.dismissSettings.save(), this.purechatController.getPublicApi().off("widget:collapsed", this.onCollapse);
            },
            getDismissDelay: function() {
                return Triggers.DISMISS_DELAYS_DAYS[Math.min(BaseControllerSettings.dismissSettings.get("_purechatDismissCount"), Triggers.DISMISS_DELAYS_DAYS.length - 1)] * Triggers.MILLISECONDS_IN_DAY;
            },
            isNewSession: function() {
                return new Date() - BaseControllerSettings.dismissSettings.get("_purechatLastCheckin") > Triggers.MAX_CHECKIN_INTERVAL_SECOND * Triggers.MILLISECONDS_IN_SECOND;
            },
            startTesting: function() {
                var dismissTime = BaseControllerSettings.dismissSettings.get("_purechatDismissTime"), dismissLimit = this.getDismissDelay();
                (!dismissTime || new Date() - dismissTime > dismissLimit) && (BaseControllerSettings.dismissSettings.on("change:_purechatLastCheckin", this.eventCheckChange), 
                this.onStart && this.onStart());
            },
            removeEventListeners: function() {
                BaseControllerSettings.dismissSettings.off("change:_purechatLastCheckin", this.eventCheckChange);
            },
            stopTesting: function() {
                this.removeEventListeners(), BaseControllerSettings.dismissSettings.resetTimeCounters(), 
                BaseControllerSettings.dismissSettings.set("_purechatDismissTime", new Date()), 
                BaseControllerSettings.dismissSettings.save(), this.onStop && this.onStop();
            },
            triggerEvent: function(delay) {
                var self = this;
                this.purechatController.getDataController().checkChatAvailable().done(function(result) {
                    result.available && (self.removeEventListeners(), setTimeout(function() {
                        self.purechatController.chatModel.get("expanded") || (self.stopTesting(), self.purechatController.getPublicApi().trigger("widget:expand", {
                            expandSource: Marionette.getOption(self, "expandSource")
                        }));
                    }, delay || 1e3));
                }).fail(function() {});
            }
        });
        Triggers.BaseControllerSettings = BaseControllerSettings, Triggers.addInitializer(function(options) {}), 
        Triggers.addFinalizer(function() {});
    }), purechatApp.module("Triggers", function(Triggers, app, Backbone, Marionette, $, _, Models) {
        var TimeBasedTrigger = Triggers.BaseControllerSettings.extend({
            expandSource: "time-trigger",
            enabledWidgetSettingKey: "ExpandWidgetTimeoutEnabled",
            initialize: function(purechatController) {
                Triggers.BaseControllerSettings.prototype.initialize.apply(this, arguments);
            },
            onStart: function() {
                var self = this, expandWidgetTimeoutType = this.widgetSettings.get("ExpandWidgetTimeoutType"), startTimeKey = 1 == expandWidgetTimeoutType ? "_purechatSessionStart" : "_purechatPageStart", timeSinceSessionStart = new Date() - Triggers.BaseControllerSettings.dismissSettings.get(startTimeKey), maxSessionLength = this.widgetSettings.get("ExpandWidgetTimeout") * Triggers.MILLISECONDS_IN_SECOND, delay = maxSessionLength - timeSinceSessionStart;
                this.timeout = setTimeout(function() {
                    self.triggerEvent();
                }, delay);
            },
            onStop: function() {
                clearTimeout(this.timeout), delete this.timeout;
            }
        });
        Triggers.TimeBasedTrigger = TimeBasedTrigger, Triggers.addInitializer(function(options) {}), 
        Triggers.addFinalizer(function() {});
    }), purechatApp.module("Triggers", function(Triggers, app, Backbone, Marionette, $, _, Models) {
        var UrlBasedTrigger = Triggers.BaseControllerSettings.extend({
            expandSource: "url-trigger",
            enabledWidgetSettingKey: "EnableTriggerPageSpecific",
            initialize: function(purechatController) {
                Triggers.BaseControllerSettings.prototype.initialize.apply(this, arguments);
            },
            onStart: function() {
                var self = this, testUrls = this.widgetSettings.get("TriggerUrls"), triggerPageExpandTimeout = this.widgetSettings.get("TriggerPageExpandTimeout"), url = window.location.href.replace("http://", "").replace("https://", "");
                testUrls.forEach(function(next) {
                    self.testUrl(url, next) && self.triggerEvent(triggerPageExpandTimeout * Triggers.MILLISECONDS_IN_SECOND);
                });
            },
            testUrl: function(currentUrl, currentTest) {
                return currentUrl.toLowerCase().indexOf(currentTest.Url.toLowerCase()) >= 0;
            }
        });
        Triggers.UrlBasedTrigger = UrlBasedTrigger, Triggers.addInitializer(function(options) {}), 
        Triggers.addFinalizer(function() {});
    }), purechatApp.module("Notifications", function(Notifications, App, Backbone, Marionette, $, _, Models) {
        Notifications.Controller = Marionette.Controller.extend({
            notificationSoundTimeout: null,
            soundIsPlaying: !1,
            _soundsFolder: "/content/sounds/notifications/",
            _localStorageKey: "_purechatVisitorWidgetPlaySound",
            _playSound: function(url) {
                var self = this, audio = new Audio(url);
                audio.onerror = function() {
                    console.log(arguments);
                }, audio.onended = function() {
                    self.soundIsPlaying = !1, delete audio;
                }, this.soundIsPlaying = !0, audio.play();
            },
            _playWave: function(serverUrl) {
                this._playSound(serverUrl + this._soundsFolder + "Correct-short.wav");
            },
            _playMp3: function(serverUrl) {
                this._playSound(serverUrl + this._soundsFolder + "Correct-short.mp3");
            },
            newMessage: function() {
                var settings = Marionette.getOption(this, "settings");
                if (!settings.get("RequestFromMobileDevice") && !settings.get("isInEditorMode")) {
                    var serverUrl = settings.get("pureServerUrl") || "https://app.purechat.com", playSound = "true" == localStorage._purechatVisitorWidgetPlaySound.toString().toLowerCase();
                    if (!settings.get("isOperator") && playSound && "undefined" != typeof Audio && !this.soundIsPlaying) {
                        var aTest = new Audio(), supportsWave = aTest.canPlayType("audio/wav") || aTest.canPlayType("audio/wave");
                        supportsWave ? this._playWave(serverUrl) : this._playMp3(serverUrl);
                    }
                }
            },
            initialize: function() {
                var self = this;
                localStorage[this._localStorageKey] = "undefined" != typeof localStorage[this._localStorageKey] ? "true" == localStorage[this._localStorageKey].toString().toLowerCase() : !0, 
                App.commands.setHandler("notifications:newMessage", function() {
                    self.newMessage();
                });
            },
            onDestroy: function() {
                App.commands.removeHandler("notifications:newMessage");
            }
        });
    });
}({}, function() {
    return this;
}());