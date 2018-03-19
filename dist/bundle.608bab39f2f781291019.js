module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "608bab39f2f781291019"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (!installedModules[request].parents.includes(moduleId))
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (!me.children.includes(request)) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.includes(parentId)) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (!a.includes(item)) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.includes(cb)) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/index.js":
/*!***************************!*\
  !*** ./examples/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js");

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Slider = __webpack_require__(/*! ../src/components/Slider */ "./src/components/Slider.js");

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})(); /* eslint-disable no-console */


var rootEl = document.getElementById('app');

_reactDom2.default.render(_react2.default.createElement(
    _reactHotLoader.AppContainer,
    null,
    _react2.default.createElement(_Slider2.default, null)
), rootEl);

// Webpack Hot Module Replacement API
if (true) {
    module.hot.accept();
}
;

(function () {
    var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(rootEl, 'rootEl', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/examples/index.js');
    leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/fast-levenshtein/levenshtein.js":
/*!******************************************************!*\
  !*** ./node_modules/fast-levenshtein/levenshtein.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  'use strict';
  
  var collator;
  try {
    collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
  } catch (err){
    console.log("Collator could not be initialized and wouldn't be used");
  }
  // arrays to re-use
  var prevRow = [],
    str2Char = [];
  
  /**
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   */
  var Levenshtein = {
    /**
     * Calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @param [options] Additional options.
     * @param [options.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
     * @return Integer the levenshtein distance (0 and above).
     */
    get: function(str1, str2, options) {
      var useCollator = (options && collator && options.useCollator);
      
      var str1Len = str1.length,
        str2Len = str2.length;
      
      // base cases
      if (str1Len === 0) return str2Len;
      if (str2Len === 0) return str1Len;

      // two rows
      var curCol, nextCol, i, j, tmp;

      // initialise previous row
      for (i=0; i<str2Len; ++i) {
        prevRow[i] = i;
        str2Char[i] = str2.charCodeAt(i);
      }
      prevRow[str2Len] = str2Len;

      var strCmp;
      if (useCollator) {
        // calculate current row distance from previous row using collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = 0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      else {
        // calculate current row distance from previous row without collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = str1.charCodeAt(i) === str2Char[j];

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      return nextCol;
    }

  };

  // amd
  if ("function" !== "undefined" && __webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js") !== null && __webpack_require__(/*! !webpack amd options */ "./node_modules/webpack/buildin/amd-options.js")) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return Levenshtein;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // commonjs
  else if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = Levenshtein;
  }
  // web worker
  else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
    self.Levenshtein = Levenshtein;
  }
  // browser main thread
  else if (typeof window !== "undefined" && window !== null) {
    window.Levenshtein = Levenshtein;
  }
}());


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "./node_modules/fbjs/lib/warning.js":
/*!******************************************!*\
  !*** ./node_modules/fbjs/lib/warning.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(/*! ./emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
  var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(/*! fbjs/lib/emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");
var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : undefined;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(isValidElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/react-hot-loader/dist/react-hot-loader.development.js":
/*!****************************************************************************!*\
  !*** ./node_modules/react-hot-loader/dist/react-hot-loader.development.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = __webpack_require__(/*! react */ "react");
var React__default = _interopDefault(React);
var shallowEqual = _interopDefault(__webpack_require__(/*! shallowequal */ "./node_modules/shallowequal/index.js"));
var levenshtein = _interopDefault(__webpack_require__(/*! fast-levenshtein */ "./node_modules/fast-levenshtein/levenshtein.js"));
var PropTypes = _interopDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var hoistNonReactStatic = _interopDefault(__webpack_require__(/*! hoist-non-react-statics */ "./node_modules/react-hot-loader/node_modules/hoist-non-react-statics/index.js"));

/* eslint-disable no-underscore-dangle */

var isCompositeComponent = function isCompositeComponent(type) {
  return typeof type === 'function';
};

var getComponentDisplayName = function getComponentDisplayName(type) {
  return type.displayName || type.name || 'Component';
};

var getInternalInstance = function getInternalInstance(instance) {
  return instance._reactInternalFiber || // React 16
  instance._reactInternalInstance || // React 15
  null;
};

var updateInstance = function updateInstance(instance) {
  var updater = instance.updater,
      forceUpdate = instance.forceUpdate;

  if (typeof forceUpdate === 'function') {
    instance.forceUpdate();
  } else if (updater && typeof updater.enqueueForceUpdate === 'function') {
    updater.enqueueForceUpdate(instance);
  }
};

var isFragmentNode = function isFragmentNode(_ref) {
  var type = _ref.type;
  return React__default.Fragment && type === React__default.Fragment;
};

var generation = 1;

var increment = function increment() {
  return generation++;
};
var get = function get() {
  return generation;
};

var PREFIX = '__reactstandin__';
var PROXY_KEY = PREFIX + 'key';
var GENERATION = PREFIX + 'proxyGeneration';
var REGENERATE_METHOD = PREFIX + 'regenerateByEval';
var UNWRAP_PROXY = PREFIX + 'getCurrent';
var CACHED_RESULT = PREFIX + 'cachedResult';
var PROXY_IS_MOUNTED = PREFIX + 'isMounted';

var configuration = {
  logLevel: 'error'
};

/* eslint-disable no-console */

var logger = {
  debug: function debug() {
    if (['debug'].includes(configuration.logLevel)) {
      var _console;

      (_console = console).debug.apply(_console, arguments);
    }
  },
  log: function log() {
    if (['debug', 'log'].includes(configuration.logLevel)) {
      var _console2;

      (_console2 = console).log.apply(_console2, arguments);
    }
  },
  warn: function warn() {
    if (['debug', 'log', 'warn'].includes(configuration.logLevel)) {
      var _console3;

      (_console3 = console).warn.apply(_console3, arguments);
    }
  },
  error: function error() {
    if (['debug', 'log', 'warn', 'error'].includes(configuration.logLevel)) {
      var _console4;

      (_console4 = console).error.apply(_console4, arguments);
    }
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-disable no-eval, func-names */

function getDisplayName(Component) {
  var displayName = Component.displayName || Component.name;
  return displayName && displayName !== 'ReactComponent' ? displayName : 'Unknown';
}

var reactLifeCycleMountMethods = ['componentWillMount', 'componentDidMount'];

function isReactClass(Component) {
  return Component.prototype && (Component.prototype.isReactComponent || Component.prototype.componentWillMount || Component.prototype.componentWillUnmount || Component.prototype.componentDidMount || Component.prototype.componentDidUnmount || Component.prototype.render);
}

function safeReactConstructor(Component, lastInstance) {
  try {
    if (lastInstance) {
      return new Component(lastInstance.props, lastInstance.context);
    }
    return new Component({}, {});
  } catch (e) {
    // some components, like Redux connect could not be created without proper context
  }
  return null;
}

function isNativeFunction(fn) {
  return typeof fn === 'function' ? fn.toString().indexOf('[native code]') > 0 : false;
}

var identity = function identity(a) {
  return a;
};
var indirectEval = eval;

var doesSupportClasses = function () {
  try {
    indirectEval('class Test {}');
    return true;
  } catch (e) {
    return false;
  }
}();

var ES6ProxyComponentFactory = doesSupportClasses && indirectEval('\n(function(InitialParent, postConstructionAction) {\n  return class ProxyComponent extends InitialParent {\n    constructor(props, context) {\n      super(props, context)\n      postConstructionAction.call(this)\n    }\n  }\n})\n');

var ES5ProxyComponentFactory = function ES5ProxyComponentFactory(InitialParent, postConstructionAction) {
  function ProxyComponent(props, context) {
    InitialParent.call(this, props, context);
    postConstructionAction.call(this);
  }
  ProxyComponent.prototype = Object.create(InitialParent.prototype);
  Object.setPrototypeOf(ProxyComponent, InitialParent);
  return ProxyComponent;
};

var isReactComponentInstance = function isReactComponentInstance(el) {
  return el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object' && !el.type && el.render;
};

var proxyClassCreator = doesSupportClasses ? ES6ProxyComponentFactory : ES5ProxyComponentFactory;

function getOwnKeys(target) {
  return [].concat(Object.getOwnPropertyNames(target), Object.getOwnPropertySymbols(target));
}

function shallowStringsEqual(a, b) {
  for (var key in a) {
    if (String(a[key]) !== String(b[key])) {
      return false;
    }
  }
  return true;
}

function deepPrototypeUpdate(dest, source) {
  var deepDest = Object.getPrototypeOf(dest);
  var deepSrc = Object.getPrototypeOf(source);
  if (deepDest && deepSrc && deepSrc !== deepDest) {
    deepPrototypeUpdate(deepDest, deepSrc);
  }
  if (source.prototype && source.prototype !== dest.prototype) {
    dest.prototype = source.prototype;
  }
}

function safeDefineProperty(target, key, props) {
  try {
    Object.defineProperty(target, key, props);
  } catch (e) {
    logger.warn('Error while wrapping', key, ' -> ', e);
  }
}

var RESERVED_STATICS = ['length', 'displayName', 'name', 'arguments', 'caller', 'prototype', 'toString', 'valueOf', PROXY_KEY, UNWRAP_PROXY];

function transferStaticProps(ProxyComponent, savedDescriptors, PreviousComponent, NextComponent) {
  Object.getOwnPropertyNames(ProxyComponent).forEach(function (key) {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }

    var prevDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
    var savedDescriptor = savedDescriptors[key];

    if (!shallowEqual(prevDescriptor, savedDescriptor)) {
      safeDefineProperty(NextComponent, key, prevDescriptor);
    }
  });

  // Copy newly defined static methods and properties
  Object.getOwnPropertyNames(NextComponent).forEach(function (key) {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }

    var prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(ProxyComponent, key);
    var savedDescriptor = savedDescriptors[key];

    // Skip redefined descriptors
    if (prevDescriptor && savedDescriptor && !shallowEqual(savedDescriptor, prevDescriptor)) {
      safeDefineProperty(NextComponent, key, prevDescriptor);
      return;
    }

    if (prevDescriptor && !savedDescriptor) {
      safeDefineProperty(ProxyComponent, key, prevDescriptor);
      return;
    }

    var nextDescriptor = _extends({}, Object.getOwnPropertyDescriptor(NextComponent, key), {
      configurable: true
    });

    savedDescriptors[key] = nextDescriptor;
    safeDefineProperty(ProxyComponent, key, nextDescriptor);
  });

  // Remove static methods and properties that are no longer defined
  Object.getOwnPropertyNames(ProxyComponent).forEach(function (key) {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }
    // Skip statics that exist on the next class
    if (NextComponent.hasOwnProperty(key)) {
      return;
    }
    // Skip non-configurable statics
    var proxyDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
    if (proxyDescriptor && !proxyDescriptor.configurable) {
      return;
    }

    var prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(PreviousComponent, key);
    var savedDescriptor = savedDescriptors[key];

    // Skip redefined descriptors
    if (prevDescriptor && savedDescriptor && !shallowEqual(savedDescriptor, prevDescriptor)) {
      return;
    }

    safeDefineProperty(ProxyComponent, key, {
      value: undefined
    });
  });

  return savedDescriptors;
}

function mergeComponents(ProxyComponent, NextComponent, InitialComponent, lastInstance, injectedMembers) {
  var injectedCode = {};
  try {
    var nextInstance = safeReactConstructor(NextComponent, lastInstance);

    try {
      // Bypass babel class inheritance checking
      deepPrototypeUpdate(InitialComponent, NextComponent);
    } catch (e) {
      // It was ES6 class
    }

    var proxyInstance = safeReactConstructor(ProxyComponent, lastInstance);

    if (!nextInstance || !proxyInstance) {
      return injectedCode;
    }

    var mergedAttrs = _extends({}, proxyInstance, nextInstance);
    var hasRegenerate = proxyInstance[REGENERATE_METHOD];
    var ownKeys = getOwnKeys(Object.getPrototypeOf(ProxyComponent.prototype));
    Object.keys(mergedAttrs).forEach(function (key) {
      if (key.startsWith(PREFIX)) return;
      var nextAttr = nextInstance[key];
      var prevAttr = proxyInstance[key];
      if (prevAttr && nextAttr) {
        if (isNativeFunction(nextAttr) || isNativeFunction(prevAttr)) {
          // this is bound method
          var isSameArity = nextAttr.length === prevAttr.length;
          var existsInPrototype = ownKeys.indexOf(key) >= 0 || ProxyComponent.prototype[key];
          if (isSameArity && existsInPrototype) {
            if (hasRegenerate) {
              injectedCode[key] = 'Object.getPrototypeOf(this)[\'' + key + '\'].bind(this)';
            } else {
              logger.warn('React Hot Loader:,', 'Non-controlled class', ProxyComponent.name, 'contains a new native or bound function ', key, nextAttr, '. Unable to reproduce');
            }
          } else {
            logger.warn('React Hot Loader:', 'Updated class ', ProxyComponent.name, 'contains native or bound function ', key, nextAttr, '. Unable to reproduce, use arrow functions instead.', '(arity: ' + nextAttr.length + '/' + prevAttr.length + ', proto: ' + (existsInPrototype ? 'yes' : 'no'));
          }
          return;
        }

        var nextString = String(nextAttr);
        var injectedBefore = injectedMembers[key];
        if (nextString !== String(prevAttr) || injectedBefore && nextString !== String(injectedBefore)) {
          if (!hasRegenerate) {
            if (nextString.indexOf('function') < 0 && nextString.indexOf('=>') < 0) {
              // just copy prop over
              injectedCode[key] = nextAttr;
            } else {
              logger.warn('React Hot Loader:', ' Updated class ', ProxyComponent.name, 'had different code for', key, nextAttr, '. Unable to reproduce. Regeneration support needed.');
            }
          } else {
            injectedCode[key] = nextAttr;
          }
        }
      }
    });
  } catch (e) {
    logger.warn('React Hot Loader:', e);
  }
  return injectedCode;
}

function checkLifeCycleMethods(ProxyComponent, NextComponent) {
  try {
    var p1 = Object.getPrototypeOf(ProxyComponent.prototype);
    var p2 = NextComponent.prototype;
    reactLifeCycleMountMethods.forEach(function (key) {
      var d1 = Object.getOwnPropertyDescriptor(p1, key) || { value: p1[key] };
      var d2 = Object.getOwnPropertyDescriptor(p2, key) || { value: p2[key] };
      if (!shallowStringsEqual(d1, d2)) {
        logger.warn('React Hot Loader:', 'You did update', ProxyComponent.name, 's lifecycle method', key, '. Unable to repeat');
      }
    });
  } catch (e) {
    // Ignore errors
  }
}

function inject(target, currentGeneration, injectedMembers) {
  if (target[GENERATION] !== currentGeneration) {
    var hasRegenerate = !!target[REGENERATE_METHOD];
    Object.keys(injectedMembers).forEach(function (key) {
      try {
        if (hasRegenerate) {
          target[REGENERATE_METHOD](key, '(function REACT_HOT_LOADER_SANDBOX () {\n          var _this = this; // common babel transpile\n          var _this2 = this; // common babel transpile\n          return ' + injectedMembers[key] + ';\n          }).call(this)');
        } else {
          target[key] = injectedMembers[key];
        }
      } catch (e) {
        logger.warn('React Hot Loader: Failed to regenerate method ', key, ' of class ', target);
        logger.warn('got error', e);
      }
    });

    target[GENERATION] = currentGeneration;
  }
}

var has = Object.prototype.hasOwnProperty;

var proxies = new WeakMap();

var blackListedClassMembers = ['constructor', 'render', 'componentDidMount', 'componentWillReceiveProps', 'componentWillUnmount', 'getInitialState', 'getDefaultProps'];

var defaultRenderOptions = {
  componentWillReceiveProps: identity,
  componentWillRender: identity,
  componentDidRender: function componentDidRender(result) {
    return result;
  }
};

var defineClassMember = function defineClassMember(Class, methodName, methodBody) {
  return safeDefineProperty(Class.prototype, methodName, {
    configurable: true,
    writable: true,
    enumerable: false,
    value: methodBody
  });
};

var defineClassMembers = function defineClassMembers(Class, methods) {
  return Object.keys(methods).forEach(function (methodName) {
    return defineClassMember(Class, methodName, methods[methodName]);
  });
};

function createClassProxy(InitialComponent, proxyKey, options) {
  var renderOptions = _extends({}, defaultRenderOptions, options);
  // Prevent double wrapping.
  // Given a proxy class, return the existing proxy managing it.
  var existingProxy = proxies.get(InitialComponent);

  if (existingProxy) {
    return existingProxy;
  }

  var CurrentComponent = void 0;
  var savedDescriptors = {};
  var injectedMembers = {};
  var proxyGeneration = 0;
  var isFunctionalComponent = !isReactClass(InitialComponent);

  var lastInstance = null;

  function postConstructionAction() {
    this[GENERATION] = 0;

    // As long we can't override constructor
    // every class shall evolve from a base class
    inject(this, proxyGeneration, injectedMembers);

    lastInstance = this;
  }

  function proxiedUpdate() {
    if (this) {
      inject(this, proxyGeneration, injectedMembers);
    }
  }

  function lifeCycleWrapperFactory(wrapperName) {
    var sideEffect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

    return function wrappedMethod() {
      proxiedUpdate.call(this);
      sideEffect(this);

      for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      return !isFunctionalComponent && CurrentComponent.prototype[wrapperName] && CurrentComponent.prototype[wrapperName].apply(this, rest);
    };
  }

  function methodWrapperFactory(wrapperName, realMethod) {
    return function wrappedMethod() {
      for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        rest[_key2] = arguments[_key2];
      }

      return realMethod.apply(this, rest);
    };
  }

  var fakeBasePrototype = function fakeBasePrototype(Base) {
    return Object.getOwnPropertyNames(Base).filter(function (key) {
      return blackListedClassMembers.indexOf(key) === -1;
    }).filter(function (key) {
      var descriptor = Object.getOwnPropertyDescriptor(Base, key);
      return typeof descriptor.value === 'function';
    }).reduce(function (acc, key) {
      acc[key] = methodWrapperFactory(key, Base[key]);
      return acc;
    }, {});
  };

  var componentDidMount = lifeCycleWrapperFactory('componentDidMount', function (target) {
    target[PROXY_IS_MOUNTED] = true;
  });
  var componentWillReceiveProps = lifeCycleWrapperFactory('componentWillReceiveProps', renderOptions.componentWillReceiveProps);
  var componentWillUnmount = lifeCycleWrapperFactory('componentWillUnmount', function (target) {
    target[PROXY_IS_MOUNTED] = false;
  });

  function proxiedRender() {
    proxiedUpdate.call(this);
    renderOptions.componentWillRender(this);

    var result = void 0;

    // We need to use hasOwnProperty here, as the cached result is a React node
    // and can be null or some other falsy value.
    if (has.call(this, CACHED_RESULT)) {
      result = this[CACHED_RESULT];
      delete this[CACHED_RESULT];
    } else if (isFunctionalComponent) {
      result = CurrentComponent(this.props, this.context);
    } else {
      result = CurrentComponent.prototype.render.call(this);
    }

    return renderOptions.componentDidRender(result);
  }

  var defineProxyMethods = function defineProxyMethods(Proxy) {
    var Base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    defineClassMembers(Proxy, _extends({}, fakeBasePrototype(Base), {
      render: proxiedRender,
      componentDidMount: componentDidMount,
      componentWillReceiveProps: componentWillReceiveProps,
      componentWillUnmount: componentWillUnmount
    }));
  };

  var ProxyFacade = void 0;
  var ProxyComponent = null;

  if (!isFunctionalComponent) {
    ProxyComponent = proxyClassCreator(InitialComponent, postConstructionAction);

    defineProxyMethods(ProxyComponent, InitialComponent.prototype);

    ProxyFacade = ProxyComponent;
  } else {
    // This function only gets called for the initial mount. The actual
    // rendered component instance will be the return value.

    // eslint-disable-next-line func-names
    ProxyFacade = function ProxyFacade(props, context) {
      var result = CurrentComponent(props, context);

      // This is a Relay-style container constructor. We can't do the prototype-
      // style wrapping for this as we do elsewhere, so just we just pass it
      // through as-is.
      if (isReactComponentInstance(result)) {
        ProxyComponent = null;
        return result;
      }

      // Otherwise, it's a normal functional component. Build the real proxy
      // and use it going forward.
      ProxyComponent = proxyClassCreator(React.Component, postConstructionAction);

      defineProxyMethods(ProxyComponent);

      var determinateResult = new ProxyComponent(props, context);

      // Cache the initial render result so we don't call the component function
      // a second time for the initial render.
      determinateResult[CACHED_RESULT] = result;
      return determinateResult;
    };
  }

  function get() {
    return ProxyFacade;
  }

  function getCurrent() {
    return CurrentComponent;
  }

  safeDefineProperty(ProxyFacade, UNWRAP_PROXY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });

  safeDefineProperty(ProxyFacade, PROXY_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: proxyKey
  });

  safeDefineProperty(ProxyFacade, 'toString', {
    configurable: true,
    writable: false,
    enumerable: false,
    value: function toString() {
      return String(CurrentComponent);
    }
  });

  function update(NextComponent) {
    if (typeof NextComponent !== 'function') {
      throw new Error('Expected a constructor.');
    }

    if (NextComponent === CurrentComponent) {
      return;
    }

    // Prevent proxy cycles
    var existingProxy = proxies.get(NextComponent);
    if (existingProxy) {
      update(existingProxy[UNWRAP_PROXY]());
      return;
    }

    isFunctionalComponent = !isReactClass(NextComponent);
    proxyGeneration++;

    // Save the next constructor so we call it
    var PreviousComponent = CurrentComponent;
    CurrentComponent = NextComponent;

    // Try to infer displayName
    var displayName = getDisplayName(CurrentComponent);

    safeDefineProperty(ProxyFacade, 'displayName', {
      configurable: true,
      writable: false,
      enumerable: true,
      value: displayName
    });

    if (ProxyComponent) {
      safeDefineProperty(ProxyComponent, 'name', {
        value: displayName
      });
    }

    savedDescriptors = transferStaticProps(ProxyFacade, savedDescriptors, PreviousComponent, NextComponent);

    if (isFunctionalComponent || !ProxyComponent) {
      // nothing
    } else {
      checkLifeCycleMethods(ProxyComponent, NextComponent);
      Object.setPrototypeOf(ProxyComponent.prototype, NextComponent.prototype);
      defineProxyMethods(ProxyComponent, NextComponent.prototype);
      if (proxyGeneration > 1) {
        injectedMembers = mergeComponents(ProxyComponent, NextComponent, InitialComponent, lastInstance, injectedMembers);
      }
    }
  }

  update(InitialComponent);

  var proxy = { get: get, update: update };
  proxies.set(ProxyFacade, proxy);

  safeDefineProperty(proxy, UNWRAP_PROXY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });

  return proxy;
}

var proxiesByID = void 0;
var idsByType = void 0;

var elementCount = 0;
var renderOptions = {};

var generateTypeId = function generateTypeId() {
  return 'auto-' + elementCount++;
};

var getIdByType = function getIdByType(type) {
  return idsByType.get(type);
};

var getProxyById = function getProxyById(id) {
  return proxiesByID[id];
};
var getProxyByType = function getProxyByType(type) {
  return getProxyById(getIdByType(type));
};

var setStandInOptions = function setStandInOptions(options) {
  renderOptions = options;
};

var updateProxyById = function updateProxyById(id, type) {
  // Remember the ID.
  idsByType.set(type, id);

  if (!proxiesByID[id]) {
    proxiesByID[id] = createClassProxy(type, id, renderOptions);
  } else {
    proxiesByID[id].update(type);
  }
  return proxiesByID[id];
};

var createProxyForType = function createProxyForType(type) {
  return getProxyByType(type) || updateProxyById(generateTypeId(), type);
};

var resetProxies = function resetProxies() {
  proxiesByID = {};
  idsByType = new WeakMap();
};

resetProxies();

/* eslint-disable no-use-before-define */

function resolveType(type) {
  if (!isCompositeComponent(type)) return type;

  var proxy = reactHotLoader.disableProxyCreation ? getProxyByType(type) : createProxyForType(type);

  return proxy ? proxy.get() : type;
}

var reactHotLoader = {
  register: function register(type, uniqueLocalName, fileName) {
    if (isCompositeComponent(type) && typeof uniqueLocalName === 'string' && uniqueLocalName && typeof fileName === 'string' && fileName) {
      var id = fileName + '#' + uniqueLocalName;

      if (getProxyById(id)) {
        // component got replaced. Need to reconsile
        increment();
      }

      updateProxyById(id, type);
    }
  },
  reset: function reset() {
    resetProxies();
  },
  patch: function patch(React$$1) {
    if (!React$$1.createElement.isPatchedByReactHotLoader) {
      var originalCreateElement = React$$1.createElement;
      // Trick React into rendering a proxy so that
      // its state is preserved when the class changes.
      // This will update the proxy if it's for a known type.
      React$$1.createElement = function (type) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return originalCreateElement.apply(undefined, [resolveType(type)].concat(args));
      };
      React$$1.createElement.isPatchedByReactHotLoader = true;
    }

    if (!React$$1.createFactory.isPatchedByReactHotLoader) {
      // Patch React.createFactory to use patched createElement
      // because the original implementation uses the internal,
      // unpatched ReactElement.createElement
      React$$1.createFactory = function (type) {
        var factory = React$$1.createElement.bind(null, type);
        factory.type = type;
        return factory;
      };
      React$$1.createFactory.isPatchedByReactHotLoader = true;
    }

    if (!React$$1.Children.only.isPatchedByReactHotLoader) {
      var originalChildrenOnly = React$$1.Children.only;
      // Use the same trick as React.createElement
      React$$1.Children.only = function (children) {
        return originalChildrenOnly(_extends({}, children, { type: resolveType(children.type) }));
      };
      React$$1.Children.only.isPatchedByReactHotLoader = true;
    }

    reactHotLoader.reset();
  },


  disableProxyCreation: false
};

/* eslint-disable no-underscore-dangle */

function pushStack(stack, node) {
  stack.type = node.type;
  stack.children = [];
  stack.instance = typeof node.type === 'function' ? node.stateNode : stack;
}

function hydrateFiberStack(node, stack) {
  pushStack(stack, node);
  if (node.child) {
    var child = node.child;

    do {
      var childStack = {};
      hydrateFiberStack(child, childStack);
      stack.children.push(childStack);
      child = child.sibling;
    } while (child);
  }
}

/* eslint-disable no-underscore-dangle */

function pushState(stack, type, instance) {
  stack.type = type;
  stack.children = [];
  stack.instance = instance || stack;
}

function hydrateLegacyStack(node, stack) {
  if (node._currentElement) {
    pushState(stack, node._currentElement.type, node._instance || stack);
  }

  if (node._renderedComponent) {
    var childStack = {};
    hydrateLegacyStack(node._renderedComponent, childStack);
    stack.children.push(childStack);
  } else if (node._renderedChildren) {
    Object.keys(node._renderedChildren).forEach(function (key) {
      var childStack = {};
      hydrateLegacyStack(node._renderedChildren[key], childStack);
      stack.children.push(childStack);
    });
  }
}

/* eslint-disable no-underscore-dangle */

function getReactStack(instance) {
  var rootNode = getInternalInstance(instance);
  var stack = {};
  var isFiber = typeof rootNode.tag === 'number';
  if (isFiber) {
    hydrateFiberStack(rootNode, stack);
  } else {
    hydrateLegacyStack(rootNode, stack);
  }
  return stack;
}

// some `empty` names, React can autoset display name to...
var UNDEFINED_NAMES = {
  Unknown: true,
  Component: true
};

var areNamesEqual = function areNamesEqual(a, b) {
  return a === b || UNDEFINED_NAMES[a] && UNDEFINED_NAMES[b];
};
var isReactClass$1 = function isReactClass(fn) {
  return fn && !!fn.render;
};
var isFunctional = function isFunctional(fn) {
  return typeof fn === 'function';
};
var isArray = function isArray(fn) {
  return Array.isArray(fn);
};
var asArray = function asArray(a) {
  return isArray(a) ? a : [a];
};
var getTypeOf = function getTypeOf(type) {
  if (isReactClass$1(type)) return 'ReactComponent';
  if (isFunctional(type)) return 'StatelessFunctional';
  return 'Fragment'; // ?
};

var filterNullArray = function filterNullArray(a) {
  if (!a) return [];
  return a.filter(function (x) {
    return !!x;
  });
};

var unflatten = function unflatten(a) {
  return a.reduce(function (acc, a) {
    if (Array.isArray(a)) {
      acc.push.apply(acc, unflatten(a));
    } else {
      acc.push(a);
    }
    return acc;
  }, []);
};

var getElementType = function getElementType(child) {
  return child.type[UNWRAP_PROXY] ? child.type[UNWRAP_PROXY]() : child.type;
};

var haveTextSimilarity = function haveTextSimilarity(a, b) {
  return (
    // equal or slight changed
    a === b || levenshtein.get(a, b) < a.length * 0.2
  );
};

var equalClasses = function equalClasses(a, b) {
  var prototypeA = a.prototype;
  var prototypeB = Object.getPrototypeOf(b.prototype);

  var hits = 0;
  var misses = 0;
  Object.getOwnPropertyNames(prototypeA).forEach(function (key) {
    if (typeof prototypeA[key] === 'function') {
      if (haveTextSimilarity(String(prototypeA[key]), String(prototypeB[key]))) {
        hits++;
      } else {
        misses++;
        if (key === 'render') {
          misses++;
        }
      }
    }
  });
  // allow to add or remove one function
  return hits > 0 && misses <= 1;
};

var isSwappable = function isSwappable(a, b) {
  // both are registered components
  if (getIdByType(b) && getIdByType(a) === getIdByType(b)) {
    return true;
  }
  if (getTypeOf(a) !== getTypeOf(b)) {
    return false;
  }
  if (isReactClass$1(a.prototype)) {
    return areNamesEqual(getComponentDisplayName(a), getComponentDisplayName(b)) && equalClasses(a, b);
  }
  if (isFunctional(a)) {
    return areNamesEqual(getComponentDisplayName(a), getComponentDisplayName(b)) && haveTextSimilarity(String(a), String(b));
  }
  return false;
};

var render = function render(component) {
  if (!component) {
    return [];
  }
  if (isReactClass$1(component)) {
    return component.render();
  }
  if (isArray(component)) {
    return component.map(render);
  }
  if (component.children) {
    return component.children;
  }

  return [];
};

var NO_CHILDREN = { children: [] };
var mapChildren = function mapChildren(children, instances) {
  return {
    children: children.filter(function (c) {
      return c;
    }).map(function (child, index) {
      if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object') {
        return child;
      }
      var instanceLine = instances[index] || {};
      var oldChildren = asArray(instanceLine.children || []);

      if (Array.isArray(child)) {
        return _extends({
          type: null
        }, mapChildren(child, oldChildren));
      }

      var newChildren = asArray(child.props && child.props.children || child.children || []);
      var nextChildren = oldChildren.length && mapChildren(newChildren, oldChildren);

      return _extends({}, instanceLine, nextChildren || {}, {
        type: child.type
      });
    })
  };
};

var mergeInject = function mergeInject(a, b, instance) {
  if (a && !Array.isArray(a)) {
    return mergeInject([a], b);
  }
  if (b && !Array.isArray(b)) {
    return mergeInject(a, [b]);
  }

  if (!a || !b) {
    return NO_CHILDREN;
  }
  if (a.length === b.length) {
    return mapChildren(a, b);
  }

  // in some cases (no confidence here) B could contain A except null children
  // in some cases - could not.
  // this depends on React version and the way you build component.

  var nonNullA = filterNullArray(a);
  if (nonNullA.length === b.length) {
    return mapChildren(nonNullA, b);
  }

  var flatA = unflatten(nonNullA);
  var flatB = unflatten(b);
  if (flatA.length === flatB.length) {
    return mapChildren(flatA, flatB);
  }
  if (flatB.length === 0 && flatA.length === 1 && _typeof(flatA[0]) !== 'object') {
    // terminal node
  } else {
    logger.warn('React-hot-loader: unable to merge ', a, 'and children of ', instance);
  }
  return NO_CHILDREN;
};

var transformFlowNode = function transformFlowNode(flow) {
  return flow.reduce(function (acc, node) {
    if (isFragmentNode(node) && node.props && node.props.children) {
      return [].concat(acc, node.props.children);
    }
    return [].concat(acc, [node]);
  }, []);
};

var scheduledUpdates = [];
var scheduledUpdate = 0;

var flushScheduledUpdates = function flushScheduledUpdates() {
  var instances = scheduledUpdates;
  scheduledUpdates = [];
  scheduledUpdate = 0;
  instances.forEach(function (instance) {
    return instance[PROXY_IS_MOUNTED] && updateInstance(instance);
  });
};

var scheduleInstanceUpdate = function scheduleInstanceUpdate(instance) {
  scheduledUpdates.push(instance);
  if (!scheduledUpdate) {
    scheduledUpdate = setTimeout(flushScheduledUpdates);
  }
};

var hotReplacementRender = function hotReplacementRender(instance, stack) {
  var flow = transformFlowNode(filterNullArray(asArray(render(instance))));

  var children = stack.children;


  flow.forEach(function (child, index) {
    var stackChild = children[index];
    var next = function next(instance) {
      // copy over props as long new component may be hidden inside them
      // child does not have all props, as long some of them can be calculated on componentMount.
      var nextProps = _extends({}, instance.props);
      for (var key in child.props) {
        if (child.props[key]) {
          nextProps[key] = child.props[key];
        }
      }
      if (isReactClass$1(instance) && instance.componentWillUpdate) {
        // Force-refresh component (bypass redux renderedComponent)
        instance.componentWillUpdate(nextProps, instance.state);
      }
      instance.props = nextProps;
      hotReplacementRender(instance, stackChild);
    };

    // text node
    if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object' || !stackChild || !stackChild.instance) {
      return;
    }

    if (_typeof(child.type) !== _typeof(stackChild.type)) {
      // Portals could generate undefined !== null
      if (child.type && stackChild.type) {
        logger.warn('React-hot-loader: got ', child.type, 'instead of', stackChild.type);
      }
      return;
    }

    if (typeof child.type !== 'function') {
      next(
      // move types from render to the instances of hydrated tree
      mergeInject(asArray(child.props ? child.props.children : child.children), stackChild.instance.children, stackChild.instance));
    } else {
      // unwrap proxy
      var childType = getElementType(child);
      if (!stackChild.type[PROXY_KEY]) {
        /* eslint-disable no-console */
        logger.error('React-hot-loader: fatal error caused by ', stackChild.type, ' - no instrumentation found. ', 'Please require react-hot-loader before React. More in troubleshooting.');
        throw new Error('React-hot-loader: wrong configuration');
      }

      if (child.type === stackChild.type) {
        next(stackChild.instance);
      } else if (isSwappable(childType, stackChild.type)) {
        // they are both registered, or have equal code/displayname/signature

        // update proxy using internal PROXY_KEY
        updateProxyById(stackChild.type[PROXY_KEY], childType);

        next(stackChild.instance);
      } else {
        logger.warn('React-hot-loader: a ' + getComponentDisplayName(childType) + ' was found where a ' + getComponentDisplayName(stackChild) + ' was expected.\n          ' + childType);
      }

      scheduleInstanceUpdate(stackChild.instance);
    }
  });
};

var hotReplacementRender$1 = (function (instance, stack) {
  try {
    // disable reconciler to prevent upcoming components from proxying.
    reactHotLoader.disableProxyCreation = true;
    hotReplacementRender(instance, stack);
  } catch (e) {
    logger.warn('React-hot-loader: reconcilation failed due to error', e);
  } finally {
    reactHotLoader.disableProxyCreation = false;
  }
});

var reconcileHotReplacement = function reconcileHotReplacement(ReactInstance) {
  return hotReplacementRender$1(ReactInstance, getReactStack(ReactInstance));
};

var RENDERED_GENERATION = 'REACT_HOT_LOADER_RENDERED_GENERATION';

var renderReconciler = function renderReconciler(target, force) {
  // we are not inside parent reconcilation
  var currentGeneration = get();
  var componentGeneration = target[RENDERED_GENERATION];

  target[RENDERED_GENERATION] = currentGeneration;

  if (!reactHotLoader.disableProxyCreation) {
    if ((componentGeneration || force) && componentGeneration !== currentGeneration) {
      reconcileHotReplacement(target);
      return true;
    }
  }
  return false;
};

function asyncReconciledRender(target) {
  renderReconciler(target, false);
}

function syncReconciledRender(target) {
  if (renderReconciler(target, false)) {
    flushScheduledUpdates();
  }
}

var proxyWrapper = function proxyWrapper(element) {
  // post wrap on post render
  if (!element) {
    return element;
  }
  if (Array.isArray(element)) {
    return element.map(proxyWrapper);
  }
  if (typeof element.type === 'function') {
    var proxy = getProxyByType(element.type);
    if (proxy) {
      return _extends({}, element, {
        type: proxy.get()
      });
    }
  }
  return element;
};

setStandInOptions({
  componentWillReceiveProps: syncReconciledRender,
  componentWillRender: asyncReconciledRender,
  componentDidRender: proxyWrapper
});

var AppContainer = function (_React$Component) {
  inherits(AppContainer, _React$Component);

  function AppContainer(props) {
    classCallCheck(this, AppContainer);

    var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      error: null,
      generation: 0
    };
    return _this;
  }

  AppContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    if (this.state.generation !== get()) {
      // Hot reload is happening.

      this.setState({
        error: null,
        generation: get()
      });

      // perform sandboxed render to find similarities between new and old code
      renderReconciler(this, true);
      // it is possible to flush update out of render cycle
      flushScheduledUpdates();
    }
  };

  AppContainer.prototype.shouldComponentUpdate = function shouldComponentUpdate(prevProps, prevState) {
    // Don't update the component if the state had an error and still has one.
    // This allows to break an infinite loop of error -> render -> error -> render
    // https://github.com/gaearon/react-hot-loader/issues/696
    if (prevState.error && this.state.error) {
      return false;
    }

    return true;
  };

  AppContainer.prototype.componentDidCatch = function componentDidCatch(error) {
    logger.error(error);
    this.setState({ error: error });
  };

  AppContainer.prototype.render = function render() {
    var error = this.state.error;


    if (this.props.errorReporter && error) {
      return React__default.createElement(this.props.errorReporter, { error: error });
    }

    return React__default.Children.only(this.props.children);
  };

  return AppContainer;
}(React__default.Component);

AppContainer.propTypes = {
  children: function children(props) {
    if (React__default.Children.count(props.children) !== 1) {
      return new Error('Invalid prop "children" supplied to AppContainer. ' + 'Expected a single React element with your app’s root component, e.g. <App />.');
    }

    return undefined;
  },

  errorReporter: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};

var openedModules = {};

var hotModules = {};

var createHotModule = function createHotModule() {
  return { instances: [], updateTimeout: 0 };
};

var hotModule = function hotModule(moduleId) {
  if (!hotModules[moduleId]) {
    hotModules[moduleId] = createHotModule();
  }
  return hotModules[moduleId];
};

var isOpened = function isOpened(sourceModule) {
  return sourceModule && !!openedModules[sourceModule.id];
};

var enter = function enter(sourceModule) {
  if (sourceModule && sourceModule.id) {
    openedModules[sourceModule.id] = true;
  } else {
    logger.warn('React-hot-loader: no `module` variable found. Do you shadow system variable?');
  }
};

var leave = function leave(sourceModule) {
  if (sourceModule && sourceModule.id) {
    delete openedModules[sourceModule.id];
  }
};

/* eslint-disable camelcase, no-undef */
var requireIndirect =  true ? __webpack_require__ : undefined;
/* eslint-enable */

var createHoc = function createHoc(SourceComponent, TargetComponent) {
  hoistNonReactStatic(TargetComponent, SourceComponent);
  TargetComponent.displayName = 'HotExported' + getComponentDisplayName(SourceComponent);
  return TargetComponent;
};

var makeHotExport = function makeHotExport(sourceModule) {
  var updateInstances = function updateInstances() {
    var module = hotModule(sourceModule.id);
    clearTimeout(module.updateTimeout);
    module.updateTimeout = setTimeout(function () {
      try {
        requireIndirect(sourceModule.id);
      } catch (e) {
        // just swallow
      }
      module.instances.forEach(function (inst) {
        return inst.forceUpdate();
      });
    });
  };

  if (sourceModule.hot) {
    // Mark as self-accepted for Webpack
    // Update instances for Parcel
    sourceModule.hot.accept(updateInstances);

    // Webpack way
    if (sourceModule.hot.addStatusHandler) {
      if (sourceModule.hot.status() === 'idle') {
        sourceModule.hot.addStatusHandler(function (status) {
          if (status === 'apply') {
            updateInstances();
          }
        });
      }
    }
  }
};

var hot = function hot(sourceModule) {
  if (!sourceModule || !sourceModule.id) {
    // this is fatal
    throw new Error('React-hot-loader: `hot` could not found the `id` property in the `module` you have provided');
  }
  var moduleId = sourceModule.id;
  var module = hotModule(moduleId);
  makeHotExport(sourceModule);

  // TODO: Ensure that all exports from this file are react components.

  return function (WrappedComponent) {
    // register proxy for wrapped component
    reactHotLoader.register(WrappedComponent, getComponentDisplayName(WrappedComponent), 'RHL' + moduleId);

    return createHoc(WrappedComponent, function (_Component) {
      inherits(ExportedComponent, _Component);

      function ExportedComponent() {
        classCallCheck(this, ExportedComponent);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      ExportedComponent.prototype.componentWillMount = function componentWillMount() {
        module.instances.push(this);
      };

      ExportedComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        var _this2 = this;

        if (isOpened(sourceModule)) {
          var componentName = getComponentDisplayName(WrappedComponent);
          logger.error('React-hot-loader: Detected AppContainer unmount on module \'' + moduleId + '\' update.\n' + ('Did you use "hot(' + componentName + ')" and "ReactDOM.render()" in the same file?\n') + ('"hot(' + componentName + ')" shall only be used as export.\n') + 'Please refer to "Getting Started" (https://github.com/gaearon/react-hot-loader/).');
        }
        module.instances = module.instances.filter(function (a) {
          return a !== _this2;
        });
      };

      ExportedComponent.prototype.render = function render() {
        return React__default.createElement(
          AppContainer,
          null,
          React__default.createElement(WrappedComponent, this.props)
        );
      };

      return ExportedComponent;
    }(React.Component));
  };
};

var getProxyOrType = function getProxyOrType(type) {
  var proxy = getProxyByType(type);
  return proxy ? proxy.get() : type;
};

var areComponentsEqual = function areComponentsEqual(a, b) {
  return getProxyOrType(a) === getProxyOrType(b);
};

var setConfig = function setConfig(config) {
  return Object.assign(configuration, config);
};

reactHotLoader.patch(React__default);

exports.default = reactHotLoader;
exports.AppContainer = AppContainer;
exports.hot = hot;
exports.enterModule = enter;
exports.leaveModule = leave;
exports.areComponentsEqual = areComponentsEqual;
exports.setConfig = setConfig;


/***/ }),

/***/ "./node_modules/react-hot-loader/index.js":
/*!************************************************!*\
  !*** ./node_modules/react-hot-loader/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./dist/react-hot-loader.development.js */ "./node_modules/react-hot-loader/dist/react-hot-loader.development.js");
}


/***/ }),

/***/ "./node_modules/react-hot-loader/node_modules/hoist-non-react-statics/index.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/react-hot-loader/node_modules/hoist-non-react-statics/index.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
(function (global, factory) {
     true ? module.exports = factory() :
    undefined;
}(this, (function () {
    'use strict';
    
    var REACT_STATICS = {
        childContextTypes: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true
    };
    
    var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
    };
    
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
    
    return function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
            
            if (objectPrototype) {
                var inheritedComponent = getPrototypeOf(sourceComponent);
                if (inheritedComponent && inheritedComponent !== objectPrototype) {
                    hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
                }
            }
            
            var keys = getOwnPropertyNames(sourceComponent);
            
            if (getOwnPropertySymbols) {
                keys = keys.concat(getOwnPropertySymbols(sourceComponent));
            }
            
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                    try { // Avoid failures from read-only properties
                        defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                }
            }
            
            return targetComponent;
        }
        
        return targetComponent;
    };
})));


/***/ }),

/***/ "./node_modules/react-hot-loader/patch.js":
/*!************************************************!*\
  !*** ./node_modules/react-hot-loader/patch.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./dist/react-hot-loader.development.js */ "./node_modules/react-hot-loader/dist/react-hot-loader.development.js");
}


/***/ }),

/***/ "./node_modules/shallowequal/index.js":
/*!********************************************!*\
  !*** ./node_modules/shallowequal/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function shallowEqual(objA, objB, compare, compareContext) {

    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

    if(ret !== void 0) {
        return !!ret;
    }

    if(objA === objB) {
        return true;
    }

    if(typeof objA !== 'object' || !objA ||
       typeof objB !== 'object' || !objB) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if(keysA.length !== keysB.length) {
        return false;
    }

    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

    // Test for A's keys different from B.
    for(var idx = 0; idx < keysA.length; idx++) {

        var key = keysA[idx];

        if(!bHasOwnProperty(key)) {
            return false;
        }

        var valueA = objA[key];
        var valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

        if(ret === false ||
           ret === void 0 && valueA !== valueB) {
            return false;
        }

    }

    return true;

};


/***/ }),

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "./node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/components/Marker.js":
/*!**********************************!*\
  !*** ./src/components/Marker.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Marker = function (_Component) {
    _inherits(Marker, _Component);

    function Marker() {
        _classCallCheck(this, Marker);

        return _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).apply(this, arguments));
    }

    _createClass(Marker, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                clsName = _props.clsName,
                color = _props.color,
                defaultMarker = _props.defaultMarker,
                position = _props.position,
                sliderSize = _props.sliderSize,
                markerSize = _props.markerSize,
                markerNumber = _props.markerNumber;


            var markerCentering = (sliderSize - markerSize) * 0.5;

            // console.log("marker position: " + this.props.position);
            // console.log("marker sliderSize: " + sliderSize);
            // console.log("marker markerSize: " + markerSize);
            // console.log("markerCentering: " + markerCentering);
            var markerWrapperStyles = {
                position: 'absolute',
                left: position + '%',
                top: '0px',
                bottom: undefined,
                marginTop: markerCentering + 'px',
                marginLeft: '-' + markerSize * 0.5 + 'px',
                marginBottom: undefined,
                display: position === 0 ? 'none' : 'block'
            };

            if (!this.props.customMarker) {
                var defaultMarkerStyles = {
                    backgroundColor: color,
                    borderRadius: '100%',
                    height: markerSize + 'px',
                    width: markerSize + 'px'
                };
                defaultMarker = _react2.default.createElement('div', { style: defaultMarkerStyles });
            }

            return _react2.default.createElement(
                'div',
                {
                    className: clsName + '-' + markerNumber + '-marker',
                    style: markerWrapperStyles
                },
                this.props.customMarker,
                defaultMarker && defaultMarker
            );
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return Marker;
}(_react.Component);

var _default = Marker;
exports.default = _default;


Marker.propTypes = {
    clsName: _propTypes2.default.string,
    color: _propTypes2.default.string,
    customMarker: _propTypes2.default.node,
    offsetLeft: _propTypes2.default.number,
    offsetTop: _propTypes2.default.number,
    position: _propTypes2.default.number,
    sliderSize: _propTypes2.default.number,
    markerSize: _propTypes2.default.number,
    markerNumber: _propTypes2.default.number
};

Marker.defaultProps = {
    clsName: 'dynamic-slider',
    position: 0
};
;

(function () {
    var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(Marker, 'Marker', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Marker.js');
    reactHotLoader.register(_default, 'default', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Marker.js');
    leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/components/Slider.js":
/*!**********************************!*\
  !*** ./src/components/Slider.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Thumb = __webpack_require__(/*! ./Thumb */ "./src/components/Thumb.js");

var _Thumb2 = _interopRequireDefault(_Thumb);

var _Track = __webpack_require__(/*! ./Track */ "./src/components/Track.js");

var _Track2 = _interopRequireDefault(_Track);

var _Marker = __webpack_require__(/*! ./Marker */ "./src/components/Marker.js");

var _Marker2 = _interopRequireDefault(_Marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function noop() {}

var Slider = function (_Component) {
    _inherits(Slider, _Component);

    function Slider(props) {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

        _this.state = {
            markerCount: 0,
            drag: false,
            currentPosition: 0,
            percent: 0,
            mainThumbValues: 0,
            ratio: 20,
            markerPositions: [],
            markerPercents: [],
            markerValues: [],
            markerRatios: [],
            step: 1,
            dynamic: true

        };

        _this.onInteractionStart = _this.onInteractionStart.bind(_this);
        _this.onMouseOrTouchMove = _this.onMouseOrTouchMove.bind(_this);
        _this.onInteractionEnd = _this.onInteractionEnd.bind(_this);
        return _this;
    }

    _createClass(Slider, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.propsToState(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.propsToState(nextProps);
        }
    }, {
        key: 'onInteractionStart',
        value: function onInteractionStart(e) {
            var eventType = e.touches !== undefined ? 'touch' : 'mouse';
            console.log(eventType);
            var leftMouseButton = 0;
            if (eventType === 'mouse' && e.button !== leftMouseButton) {
                return;
            }
            this.updateSliderValue(e, eventType);
            if (!this.state.dynamic) {
                this.setState({ drag: true });
            }
            this.addEvents(eventType);
            e.preventDefault();
        }
    }, {
        key: 'onInteractionEnd',
        value: function onInteractionEnd() {
            this.setState({
                drag: false
            });
            this.props.onChangeComplete(this.state);
            this.removeEvents();
        }
    }, {
        key: 'onMouseOrTouchMove',
        value: function onMouseOrTouchMove(e) {
            var eventType = e.touches !== undefined ? 'touch' : 'mouse';
            if (!this.state.drag) {
                return;
            };
            this.updateSliderValue(e, eventType);
            e.stopPropagation();
        }
    }, {
        key: 'getSliderInfo',
        value: function getSliderInfo() {
            var sl = this.refs.slider;
            var sliderInfo = {
                bounds: sl.getBoundingClientRect(),
                length: sl.clientWidth,
                height: sl.clientHeight
            };
            return sliderInfo;
        }
    }, {
        key: 'addEvents',
        value: function addEvents(type) {
            switch (type) {
                case 'mouse':
                    {
                        document.addEventListener('mousemove', this.onMouseOrTouchMove);
                        document.addEventListener('mouseup', this.onInteractionEnd);
                        break;
                    }
                case 'touch':
                    {
                        document.addEventListener('touchmove', this.onMouseOrTouchMove);
                        document.addEventListener('touchend', this.onInteractionEnd);
                        break;
                    }
                default: //nothing
            }
        }
    }, {
        key: 'removeEvents',
        value: function removeEvents() {
            document.removeEventListener('mousemove', this.onMouseOrTouchMove);
            document.removeEventListener('mouseup', this.onInteractionEnd);
            document.removeEventListener('touchmove', this.onMouseOrTouchMove);
            document.removeEventListener('touchend', this.onInteractionEnd);
        }
    }, {
        key: 'updateSliderValue',
        value: function updateSliderValue(e, eventType) {
            var _state = this.state,
                maxValue = _state.maxValue,
                minValue = _state.minValue,
                dynamic = _state.dynamic;
            var mainThumbValue = this.state.mainThumbValue;

            var xCoords = void 0;

            if (!dynamic) {
                xCoords = (eventType !== 'touch' ? e.pageX : e.touches[0].pageX) - window.pageXOffset;
            } else {
                var _currentPosition = this.state.currentPosition + this.getSliderInfo().bounds.left;
                var maxThumbArea = _currentPosition + this.state.thumbSize * 0.5;
                var minThumbArea = _currentPosition - this.state.thumbSize * 0.5;

                console.log("maxThumbArea: " + maxThumbArea);
                console.log("minThumbArea: " + minThumbArea);

                xCoords = (e.pageX >= minThumbArea && e.pageX <= maxThumbArea ? e.pageX : this.getSliderInfo().bounds.left) - window.pageXOffset;

                console.log("e.pageX: " + e.pageX);
                console.log("xCoords: " + xCoords);

                if (xCoords === this.getSliderInfo().bounds.left - window.pageXOffset) {
                    var markPosition = e.pageX - window.pageXOffset;
                    if (!this.state.drag) {
                        this.addMarker(markPosition);
                    }
                } else {
                    this.setState({ drag: true });
                }
            }
            // compare position to slider length to get percentage
            var lengthOrHeight = void 0;
            var currentPosition = xCoords - this.getSliderInfo().bounds.left;
            lengthOrHeight = this.getSliderInfo().length;
            var percent = this.clampValue(+(currentPosition / lengthOrHeight).toFixed(2), 0, 1);
            // convert percent -> value the match value to notch as per props/state.step
            var rawValue = this.valueFromPercent(percent);
            mainThumbValue = this.calculateMatchingNotch(rawValue);
            // avoid repeated updates of the same value
            if (mainThumbValue === this.state.mainThumbValues) {
                return;
            }
            // percentage of the range to render the track/thumb to
            var ratio = (mainThumbValue - minValue) * 100 / (maxValue - minValue);
            // forcing the thumb to the most left of slider
            if (ratio === 1) {
                ratio = 0;
            }
            this.setState({
                percent: percent,
                mainThumbValue: mainThumbValue,
                ratio: ratio,
                currentPosition: currentPosition
            }, this.handleChange);
        }
    }, {
        key: 'handleChange',
        value: function handleChange() {
            this.props.onChange(this.state);
        }
    }, {
        key: 'handleAddMarker',
        value: function handleAddMarker() {
            var _maxMinMarkerValues = this.maxMinMarkerValues(),
                min = _maxMinMarkerValues.min,
                max = _maxMinMarkerValues.max;

            var _props = this.props,
                lockToMinMark = _props.lockToMinMark,
                lockToMaxMark = _props.lockToMaxMark;


            if (lockToMinMark === true) {
                this.moveMainThumb(min);
            } else if (lockToMaxMark === true) {
                this.moveMainThumb(max);
            }

            this.props.onAddMarker(this.state);
        }
    }, {
        key: 'maxMinMarkerValues',
        value: function maxMinMarkerValues() {
            var markerValuesArray = this.state.markerValues,
                markerPositionsArray = this.state.markerPositions,
                markerRatiosArray = this.state.markerRatios,
                markerPercentsArray = this.state.markerPercents;

            var minValuesVal = Math.min.apply(Math, _toConsumableArray(markerValuesArray)),
                minPositionsVal = Math.min.apply(Math, _toConsumableArray(markerPositionsArray)),
                minRatiosVal = Math.min.apply(Math, _toConsumableArray(markerRatiosArray)),
                minPercentsVal = Math.min.apply(Math, _toConsumableArray(markerPercentsArray)),
                maxValuesVal = Math.max.apply(Math, _toConsumableArray(markerValuesArray)),
                maxPositionsVal = Math.max.apply(Math, _toConsumableArray(markerPositionsArray)),
                maxRatiosVal = Math.max.apply(Math, _toConsumableArray(markerRatiosArray)),
                maxPercentsVal = Math.max.apply(Math, _toConsumableArray(markerPercentsArray));

            return {
                min: {
                    values: minValuesVal,
                    positions: minPositionsVal,
                    ratios: minRatiosVal,
                    percents: minPercentsVal
                },
                max: {
                    values: maxValuesVal,
                    positions: maxPositionsVal,
                    ratios: maxRatiosVal,
                    percents: maxPercentsVal
                }
            };
        }
    }, {
        key: 'moveMainThumb',
        value: function moveMainThumb(value) {
            this.setState({
                mainThumbValue: value.values,
                percent: value.percents,
                ratio: value.ratios,
                currentPosition: value.positions
            });
        }
    }, {
        key: 'valueFromPercent',
        value: function valueFromPercent(percentage) {
            var _state2 = this.state,
                range = _state2.range,
                minValue = _state2.minValue;

            var val = range * percentage + minValue;
            return val;
        }
    }, {
        key: 'calculateMatchingNotch',
        value: function calculateMatchingNotch(value) {
            var _state3 = this.state,
                step = _state3.step,
                maxValue = _state3.maxValue,
                minValue = _state3.minValue;

            var values = [];
            for (var i = minValue; i <= maxValue; i++) {
                values.push(i);
            }

            var notches = [];
            // find how many entries in values are divisible by step (+min,+max)
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var s = _step.value;

                    if (s === minValue || s === maxValue || s % step === 0) {
                        notches.push(s);
                    }
                }

                // reduce over the potential notches and find which is the closest
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var match = notches.reduce(function (prev, curr) {
                if (Math.abs(curr - value) < Math.abs(prev - value)) {
                    return curr;
                }
                return prev;
            });
            return match;
        }
    }, {
        key: 'clampValue',
        value: function clampValue(val, min, max) {
            return Math.max(min, Math.min(val, max));
        }
    }, {
        key: 'propsToState',
        value: function propsToState(props) {
            var _this2 = this;

            var markerCount = props.markerCount,
                markerValues = props.markerValues,
                markerPercents = props.markerPercents,
                markerPositions = props.markerPositions,
                markerRatios = props.markerRatios;

            //console.log("markerCount: " + markerCount);
            //console.log(markerValues);
            // put the handlCount first

            if (this.state.markerCount !== markerCount) {
                this.setState({
                    markerCount: markerCount
                });
            }

            if (markerValues !== undefined || markerValues.length !== 0) {
                var _loop = function _loop(i) {
                    if (markerValues.length > 0) {
                        _this2.setState(function (prevState) {
                            return {
                                markerValues: [].concat(_toConsumableArray(prevState.markerValues), [markerValues[i]]),
                                markerRatios: [].concat(_toConsumableArray(prevState.markerRatios), [markerRatios[i]]),
                                markerPercents: [].concat(_toConsumableArray(prevState.markerPercents), [markerPercents[i]]),
                                markerPositions: [].concat(_toConsumableArray(prevState.markerPositions), [markerPositions[i]])
                            };
                        });
                    } else {
                        _this2.setState(function (prevState) {
                            return {
                                markerValues: [].concat(_toConsumableArray(prevState.markerValues), [0]),
                                markerRatios: [].concat(_toConsumableArray(prevState.markerRatios), [0]),
                                markerPercents: [].concat(_toConsumableArray(prevState.markerPercents), [0]),
                                markerPositions: [].concat(_toConsumableArray(prevState.markerPositions), [0])
                            };
                        });
                    }
                };

                for (var i = 0; i < markerCount; i++) {
                    _loop(i);
                }
            }

            var markerSize = props.markerSize,
                thumbSize = props.thumbSize,
                sliderSize = props.sliderSize;
            //console.log("thumbSize: " + thumbSize);

            if (props.thumbSize === undefined) {
                //console.log("sliderSize: " + sliderSize);
                thumbSize = this.props.disableThumb ? 0 : sliderSize * 2;
            }
            if (props.markerSize === undefined) {
                markerSize = sliderSize * 0.5;
            }
            //console.log("thumbSize after: " + thumbSize);

            var minValue = props.minValue,
                maxValue = props.maxValue,
                id = props.id;

            var range = maxValue - minValue;
            // const checkVal = markerValues[0] === undefined ? 0 : markerValues[0];
            var ratio = Math.max(this.state.mainThumbValue - minValue, 0) * 100 / (maxValue - minValue);

            this.setState(function (prevState) {
                return {
                    minValue: minValue,
                    maxValue: maxValue,
                    range: range,
                    ratio: ratio,
                    thumbSize: thumbSize,
                    markerSize: markerSize,
                    id: id
                };
            });
        }
    }, {
        key: 'addMarker',
        value: function addMarker(markerPosition) {
            var _this3 = this;

            console.log("!MARK START!");
            console.log("addMarker markerPosition: " + markerPosition);

            // compare position to slider length to get percentage
            var currentPosition = markerPosition - this.getSliderInfo().bounds.left,
                lengthOrHeight = this.getSliderInfo().length;

            var percent = this.clampValue(+(currentPosition / lengthOrHeight).toFixed(2), 0, 1);
            var rawValue = this.valueFromPercent(percent);
            var markerValue = this.calculateMatchingNotch(rawValue);

            // put marker state array into array variable
            var markerArray = this.state.markerValues;

            // get slider's max and min value
            var _state4 = this.state,
                maxValue = _state4.maxValue,
                minValue = _state4.minValue;

            // avoid repeated updates of the same value

            if (markerValue === this.state.mainThumbValues || markerValue === markerArray.includes(markerValue)) {
                return;
            }

            // check if marker is more than markerCount, if it is a yes, 
            // use immutable shift for FIFO : (arr.slice(1))
            console.log(this.state.markerValues.length);

            // percentage of the range to render the track/thumb to
            var ratio = (markerValue - minValue) * 100 / (maxValue - minValue);
            this.setState(function (prevState, props) {

                if (prevState.markerValues.length >= prevState.markerCount) {
                    var newValuesArr = _this3.state.markerValues.slice(1),
                        newRatiosArr = _this3.state.markerRatios.slice(1),
                        newPercsArr = _this3.state.markerPercents.slice(1),
                        newPosArr = _this3.state.markerPositions.slice(1);
                }
                return {
                    percent: percent,
                    markerValues: newValuesArr ? [].concat(_toConsumableArray(newValuesArr), [markerValue]) : [].concat(_toConsumableArray(prevState.markerValues), [markerValue]),
                    markerRatios: newRatiosArr ? [].concat(_toConsumableArray(newRatiosArr), [ratio]) : [].concat(_toConsumableArray(prevState.markerRatios), [ratio]),
                    markerPositions: newPosArr ? [].concat(_toConsumableArray(newPosArr), [currentPosition]) : [].concat(_toConsumableArray(prevState.markerPositions), [currentPosition]),
                    markerPercents: newPercsArr ? [].concat(_toConsumableArray(newPercsArr), [percent]) : [].concat(_toConsumableArray(prevState.markerPercents), [percent])
                };
            }, this.handleAddMarker);

            console.log(this.state.markerValues);
            // console.log("addMarker Ratio: " + ratio);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            console.log(this.state.markerValues);
            console.log(this.state.markerPositions);
            console.log(this.state.markerPercents);
            console.log(this.state.markerRatios);
            var _props2 = this.props,
                clsName = _props2.clsName,
                vertical = _props2.vertical,
                sliderSize = _props2.sliderSize,
                disableThumb = _props2.disableThumb,
                disableTrack = _props2.disableTrack,
                children = _props2.children,
                label = _props2.label,
                trackColor = _props2.trackColor,
                thumbColor = _props2.thumbColor,
                verticalSliderHeight = _props2.verticalSliderHeight,
                eventWrapperPadding = _props2.eventWrapperPadding;

            //console.log(this.props);

            var eventWrapperStyle = {
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                margin: '0 auto',
                get padding() {
                    return !vertical ? eventWrapperPadding + 'px 0' : '0 ' + eventWrapperPadding + 'px';
                },
                get width() {
                    return !vertical ? 'auto' : sliderSize + 'px';
                }
            };
            var sliderStyle = {
                backgroundColor: this.props.sliderColor,
                position: 'relative',
                overflow: 'visible',
                get height() {
                    return !vertical ? sliderSize + 'px' : verticalSliderHeight;
                },
                get width() {
                    return !vertical ? '100%' : sliderSize + 'px';
                }
            };

            return _react2.default.createElement(
                'div',
                {
                    className: clsName + '-slider',
                    onMouseDown: this.onInteractionStart,
                    onTouchStart: this.onInteractionStart,
                    style: eventWrapperStyle

                },
                _react2.default.createElement(
                    'div',
                    {
                        className: clsName + '-line',
                        ref: 'slider',
                        style: sliderStyle
                    },
                    _react2.default.createElement(_Track2.default, {
                        color: trackColor,
                        length: this.state.ratio,
                        vertical: vertical
                    }),
                    _react2.default.createElement(_Thumb2.default, {
                        color: thumbColor,
                        customThumb: children,
                        disableThumb: disableThumb,
                        position: this.state.ratio,
                        sliderSize: sliderSize,
                        thumbSize: this.state.thumbSize,
                        value: this.state.value
                    }),
                    this.state.markerPositions.length > 0 && this.state.markerValues.map(function (markerValue, index) {
                        return _react2.default.createElement(_Marker2.default, {
                            color: 'yellow',
                            key: index,
                            markerNumber: index,
                            markerSize: _this4.state.markerSize,
                            position: markerValue,
                            sliderSize: sliderSize
                        });
                    })
                )
            );
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return Slider;
}(_react.Component);

// Determine the propTypes and its default value(s)

var _default = Slider;
exports.default = _default;
Slider.propTypes = {
    clsName: _propTypes2.default.string,
    dynamic: _propTypes2.default.bool,
    markerCount: _propTypes2.default.number,
    minValue: _propTypes2.default.number,
    maxValue: _propTypes2.default.number,
    // markerValues: PropTypes.arrayOf(PropTypes.number),
    onChange: _propTypes2.default.func,
    onChangeComplete: _propTypes2.default.func,
    onAddMarker: _propTypes2.default.func,
    id: _propTypes2.default.string,
    sliderColor: _propTypes2.default.string,
    trackColor: _propTypes2.default.string,
    thumbColor: _propTypes2.default.string,
    disableThumb: _propTypes2.default.bool,
    mainThumbValue: _propTypes2.default.number,
    lockToMinMark: _propTypes2.default.bool,
    lockToMaxMark: _propTypes2.default.bool
};

Slider.defaultProps = {
    clsName: "dynamic-slider",
    markerCount: 2,
    minValue: 0,
    maxValue: 100,
    markerValues: [],
    markerRatios: [],
    markerPositions: [],
    markerPercents: [],
    onChange: noop,
    onChangeComplete: noop,
    onAddMarker: noop,
    sliderColor: 'blue',
    trackColor: 'green',
    thumbColor: 'red',
    id: null,
    disableThumb: false,
    sliderSize: 30,
    mainThumbValue: 0,
    lockToMinMark: true,
    lockToMaxMark: false
};
;

(function () {
    var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(noop, 'noop', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Slider.js');
    reactHotLoader.register(Slider, 'Slider', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Slider.js');
    reactHotLoader.register(_default, 'default', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Slider.js');
    leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/components/Thumb.js":
/*!*********************************!*\
  !*** ./src/components/Thumb.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thumb = function (_Component) {
    _inherits(Thumb, _Component);

    function Thumb() {
        _classCallCheck(this, Thumb);

        return _possibleConstructorReturn(this, (Thumb.__proto__ || Object.getPrototypeOf(Thumb)).apply(this, arguments));
    }

    _createClass(Thumb, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                clsName = _props.clsName,
                color = _props.color,
                defaultThumb = _props.defaultThumb,
                position = _props.position,
                sliderSize = _props.sliderSize,
                thumbSize = _props.thumbSize;


            console.log("position: " + this.props.position);

            var thumbCentering = (sliderSize - thumbSize) * 0.5;
            var thumbWrapperStyles = {
                position: 'absolute',
                left: position + '%',
                top: '0px',
                bottom: undefined,
                marginTop: thumbCentering + 'px',
                marginLeft: '-' + thumbSize * 0.5 + 'px',
                marginBottom: undefined
            };
            if (!this.props.customThumb) {
                var defaultThumbStyles = {
                    backgroundColor: color,
                    borderRadius: '100%',
                    height: thumbSize + 'px',
                    width: thumbSize + 'px'
                };
                defaultThumb = _react2.default.createElement('div', { style: defaultThumbStyles });
            }

            return _react2.default.createElement(
                'div',
                {
                    className: clsName + '-thumb',
                    style: thumbWrapperStyles
                },
                this.props.customThumb,
                defaultThumb && defaultThumb
            );
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return Thumb;
}(_react.Component);

var _default = Thumb;
exports.default = _default;


Thumb.propTypes = {
    clsName: _propTypes2.default.string,
    color: _propTypes2.default.string,
    customThumb: _propTypes2.default.node,
    offsetLeft: _propTypes2.default.number,
    offsetTop: _propTypes2.default.number,
    position: _propTypes2.default.number,
    sliderSize: _propTypes2.default.number,
    thumbSize: _propTypes2.default.number
};

Thumb.defaultProps = {
    clsName: 'dynamic-slider',
    position: 0
};
;

(function () {
    var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(Thumb, 'Thumb', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Thumb.js');
    reactHotLoader.register(_default, 'default', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Thumb.js');
    leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/components/Track.js":
/*!*********************************!*\
  !*** ./src/components/Track.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Track = function (_Component) {
    _inherits(Track, _Component);

    function Track() {
        _classCallCheck(this, Track);

        return _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).apply(this, arguments));
    }

    _createClass(Track, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                length = _props.length,
                clsName = _props.clsName;


            var trackStyles = {
                backgroundColor: this.props.color,
                get width() {
                    return !length ? '0%' : length + '%';
                },
                position: 'absolute',
                bottom: 0,
                height: '100%'
            };

            console.log(trackStyles);

            return _react2.default.createElement('div', {
                className: clsName + '-track',
                style: trackStyles
            });
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return Track;
}(_react.Component);

var _default = Track;
exports.default = _default;


Track.propTypes = {
    clsName: _propTypes2.default.string,
    color: _propTypes2.default.string,
    length: _propTypes2.default.number
};

Track.defaultProps = {
    clsName: 'dynamic-slider'
};
;

(function () {
    var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__(/*! react-hot-loader */ "./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(Track, 'Track', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Track.js');
    reactHotLoader.register(_default, 'default', 'C:/Users/bahasakita-lenovo2/Desktop/Git/react-dynamic-slider/src/components/Track.js');
    leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ 0:
/*!********************************************************!*\
  !*** multi react-hot-loader/patch ./examples/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! react-hot-loader/patch */"./node_modules/react-hot-loader/patch.js");
module.exports = __webpack_require__(/*! ./examples/index.js */"./examples/index.js");


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Zhc3QtbGV2ZW5zaHRlaW4vbGV2ZW5zaHRlaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWhvdC1sb2FkZXIvZGlzdC9yZWFjdC1ob3QtbG9hZGVyLmRldmVsb3BtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC1ob3QtbG9hZGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC1ob3QtbG9hZGVyL25vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QtaG90LWxvYWRlci9wYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hhbGxvd2VxdWFsL2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9hbWQtb3B0aW9ucy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL01hcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9TbGlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvVGh1bWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvVHJhY2suanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1kb21cIiJdLCJuYW1lcyI6WyJyb290RWwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIiwibW9kdWxlIiwiaG90IiwiYWNjZXB0IiwiTWFya2VyIiwicHJvcHMiLCJjbHNOYW1lIiwiY29sb3IiLCJkZWZhdWx0TWFya2VyIiwicG9zaXRpb24iLCJzbGlkZXJTaXplIiwibWFya2VyU2l6ZSIsIm1hcmtlck51bWJlciIsIm1hcmtlckNlbnRlcmluZyIsIm1hcmtlcldyYXBwZXJTdHlsZXMiLCJsZWZ0IiwidG9wIiwiYm90dG9tIiwidW5kZWZpbmVkIiwibWFyZ2luVG9wIiwibWFyZ2luTGVmdCIsIm1hcmdpbkJvdHRvbSIsImRpc3BsYXkiLCJjdXN0b21NYXJrZXIiLCJkZWZhdWx0TWFya2VyU3R5bGVzIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyUmFkaXVzIiwiaGVpZ2h0Iiwid2lkdGgiLCJwcm9wVHlwZXMiLCJzdHJpbmciLCJub2RlIiwib2Zmc2V0TGVmdCIsIm51bWJlciIsIm9mZnNldFRvcCIsImRlZmF1bHRQcm9wcyIsIm5vb3AiLCJTbGlkZXIiLCJzdGF0ZSIsIm1hcmtlckNvdW50IiwiZHJhZyIsImN1cnJlbnRQb3NpdGlvbiIsInBlcmNlbnQiLCJtYWluVGh1bWJWYWx1ZXMiLCJyYXRpbyIsIm1hcmtlclBvc2l0aW9ucyIsIm1hcmtlclBlcmNlbnRzIiwibWFya2VyVmFsdWVzIiwibWFya2VyUmF0aW9zIiwic3RlcCIsImR5bmFtaWMiLCJvbkludGVyYWN0aW9uU3RhcnQiLCJiaW5kIiwib25Nb3VzZU9yVG91Y2hNb3ZlIiwib25JbnRlcmFjdGlvbkVuZCIsInByb3BzVG9TdGF0ZSIsIm5leHRQcm9wcyIsImUiLCJldmVudFR5cGUiLCJ0b3VjaGVzIiwiY29uc29sZSIsImxvZyIsImxlZnRNb3VzZUJ1dHRvbiIsImJ1dHRvbiIsInVwZGF0ZVNsaWRlclZhbHVlIiwic2V0U3RhdGUiLCJhZGRFdmVudHMiLCJwcmV2ZW50RGVmYXVsdCIsIm9uQ2hhbmdlQ29tcGxldGUiLCJyZW1vdmVFdmVudHMiLCJzdG9wUHJvcGFnYXRpb24iLCJzbCIsInJlZnMiLCJzbGlkZXIiLCJzbGlkZXJJbmZvIiwiYm91bmRzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVuZ3RoIiwiY2xpZW50V2lkdGgiLCJjbGllbnRIZWlnaHQiLCJ0eXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtYXhWYWx1ZSIsIm1pblZhbHVlIiwibWFpblRodW1iVmFsdWUiLCJ4Q29vcmRzIiwicGFnZVgiLCJ3aW5kb3ciLCJwYWdlWE9mZnNldCIsImdldFNsaWRlckluZm8iLCJtYXhUaHVtYkFyZWEiLCJ0aHVtYlNpemUiLCJtaW5UaHVtYkFyZWEiLCJtYXJrUG9zaXRpb24iLCJhZGRNYXJrZXIiLCJsZW5ndGhPckhlaWdodCIsImNsYW1wVmFsdWUiLCJ0b0ZpeGVkIiwicmF3VmFsdWUiLCJ2YWx1ZUZyb21QZXJjZW50IiwiY2FsY3VsYXRlTWF0Y2hpbmdOb3RjaCIsImhhbmRsZUNoYW5nZSIsIm9uQ2hhbmdlIiwibWF4TWluTWFya2VyVmFsdWVzIiwibWluIiwibWF4IiwibG9ja1RvTWluTWFyayIsImxvY2tUb01heE1hcmsiLCJtb3ZlTWFpblRodW1iIiwib25BZGRNYXJrZXIiLCJtYXJrZXJWYWx1ZXNBcnJheSIsIm1hcmtlclBvc2l0aW9uc0FycmF5IiwibWFya2VyUmF0aW9zQXJyYXkiLCJtYXJrZXJQZXJjZW50c0FycmF5IiwibWluVmFsdWVzVmFsIiwiTWF0aCIsIm1pblBvc2l0aW9uc1ZhbCIsIm1pblJhdGlvc1ZhbCIsIm1pblBlcmNlbnRzVmFsIiwibWF4VmFsdWVzVmFsIiwibWF4UG9zaXRpb25zVmFsIiwibWF4UmF0aW9zVmFsIiwibWF4UGVyY2VudHNWYWwiLCJ2YWx1ZXMiLCJwb3NpdGlvbnMiLCJyYXRpb3MiLCJwZXJjZW50cyIsInZhbHVlIiwicGVyY2VudGFnZSIsInJhbmdlIiwidmFsIiwiaSIsInB1c2giLCJub3RjaGVzIiwicyIsIm1hdGNoIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJhYnMiLCJwcmV2U3RhdGUiLCJkaXNhYmxlVGh1bWIiLCJpZCIsIm1hcmtlclBvc2l0aW9uIiwibWFya2VyVmFsdWUiLCJtYXJrZXJBcnJheSIsImluY2x1ZGVzIiwibmV3VmFsdWVzQXJyIiwic2xpY2UiLCJuZXdSYXRpb3NBcnIiLCJuZXdQZXJjc0FyciIsIm5ld1Bvc0FyciIsImhhbmRsZUFkZE1hcmtlciIsInZlcnRpY2FsIiwiZGlzYWJsZVRyYWNrIiwiY2hpbGRyZW4iLCJsYWJlbCIsInRyYWNrQ29sb3IiLCJ0aHVtYkNvbG9yIiwidmVydGljYWxTbGlkZXJIZWlnaHQiLCJldmVudFdyYXBwZXJQYWRkaW5nIiwiZXZlbnRXcmFwcGVyU3R5bGUiLCJjdXJzb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwic2xpZGVyU3R5bGUiLCJzbGlkZXJDb2xvciIsIm92ZXJmbG93IiwibWFwIiwiaW5kZXgiLCJib29sIiwiZnVuYyIsIlRodW1iIiwiZGVmYXVsdFRodW1iIiwidGh1bWJDZW50ZXJpbmciLCJ0aHVtYldyYXBwZXJTdHlsZXMiLCJjdXN0b21UaHVtYiIsImRlZmF1bHRUaHVtYlN0eWxlcyIsIlRy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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxXQUFXO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDOztBQUVBLHFCQUFxQixhQUFhO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDOztBQUVBLHFCQUFxQixhQUFhO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFBQTtBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdElEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQjs7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwyQkFBMkI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLGdDQUFnQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxRUFBcUUsYUFBYTtBQUNsRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0VBQXdFLGVBQWU7QUFDdkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZUFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRixhQUFhO0FBQ3ZHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxhQUFhLG1DQUFtQztBQUMvRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLGtDQUFrQztBQUMxRDtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFF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QUFSLENBQVl1SCxXQUFaOztBQUVBLG1CQUNJO0FBQ0ksMkJBQWM5SyxPQUFkLFdBREo7QUFFSSx1QkFBTzhLO0FBRlgsY0FESjtBQU1IOzs7Ozs7Ozs7OztlQXBCZ0JELEs7Ozs7QUF1QnJCQSxNQUFNdEosU0FBTixHQUFrQjtBQUNkdkIsYUFBUyxvQkFBVXdCLE1BREw7QUFFZHZCLFdBQU8sb0JBQVV1QixNQUZIO0FBR2QrQyxZQUFRLG9CQUFVNUM7QUFISixDQUFsQjs7QUFNQWtKLE1BQU1oSixZQUFOLEdBQXFCO0FBQ2pCN0IsYUFBUztBQURRLENBQXJCOzs7Ozs7Ozs7Ozs7NEJBN0JxQjZLLEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pyQixrQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJidW5kbGUuNjA4YmFiMzlmMmY3ODEyOTEwMTkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG4gXHRcdDtcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHtcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XG4gXHRcdFx0XHRcdHJlamVjdChcbiBcdFx0XHRcdFx0XHRuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpXG4gXHRcdFx0XHRcdCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI2MDhiYWIzOWYyZjc4MTI5MTAxOVwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmICghaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluY2x1ZGVzKG1vZHVsZUlkKSlcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoIW1lLmNoaWxkcmVuLmluY2x1ZGVzKHJlcXVlc3QpKSBtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0e1xuIFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5jbHVkZXMocGFyZW50SWQpKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoIWEuaW5jbHVkZXMoaXRlbSkpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0KVxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluY2x1ZGVzKGNiKSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXHJcbmltcG9ydCB7IEFwcENvbnRhaW5lciB9IGZyb20gJ3JlYWN0LWhvdC1sb2FkZXInO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9zcmMvY29tcG9uZW50cy9TbGlkZXInO1xyXG5cclxuY29uc3Qgcm9vdEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gICAgPEFwcENvbnRhaW5lcj5cclxuICAgICAgICA8U2xpZGVyIC8+XHJcbiAgICA8L0FwcENvbnRhaW5lcj4sXHJcbiAgICByb290RWxcclxuKTtcclxuXHJcbi8vIFdlYnBhY2sgSG90IE1vZHVsZSBSZXBsYWNlbWVudCBBUElcclxuaWYgKG1vZHVsZS5ob3QpIHtcclxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XHJcbn0iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgXG4gIHZhciBjb2xsYXRvcjtcbiAgdHJ5IHtcbiAgICBjb2xsYXRvciA9ICh0eXBlb2YgSW50bCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSW50bC5Db2xsYXRvciAhPT0gXCJ1bmRlZmluZWRcIikgPyBJbnRsLkNvbGxhdG9yKFwiZ2VuZXJpY1wiLCB7IHNlbnNpdGl2aXR5OiBcImJhc2VcIiB9KSA6IG51bGw7XG4gIH0gY2F0Y2ggKGVycil7XG4gICAgY29uc29sZS5sb2coXCJDb2xsYXRvciBjb3VsZCBub3QgYmUgaW5pdGlhbGl6ZWQgYW5kIHdvdWxkbid0IGJlIHVzZWRcIik7XG4gIH1cbiAgLy8gYXJyYXlzIHRvIHJlLXVzZVxuICB2YXIgcHJldlJvdyA9IFtdLFxuICAgIHN0cjJDaGFyID0gW107XG4gIFxuICAvKipcbiAgICogQmFzZWQgb24gdGhlIGFsZ29yaXRobSBhdCBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldmVuc2h0ZWluX2Rpc3RhbmNlLlxuICAgKi9cbiAgdmFyIExldmVuc2h0ZWluID0ge1xuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBsZXZlbnNodGVpbiBkaXN0YW5jZSBvZiB0aGUgdHdvIHN0cmluZ3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RyMSBTdHJpbmcgdGhlIGZpcnN0IHN0cmluZy5cbiAgICAgKiBAcGFyYW0gc3RyMiBTdHJpbmcgdGhlIHNlY29uZCBzdHJpbmcuXG4gICAgICogQHBhcmFtIFtvcHRpb25zXSBBZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAgICogQHBhcmFtIFtvcHRpb25zLnVzZUNvbGxhdG9yXSBVc2UgYEludGwuQ29sbGF0b3JgIGZvciBsb2NhbGUtc2Vuc2l0aXZlIHN0cmluZyBjb21wYXJpc29uLlxuICAgICAqIEByZXR1cm4gSW50ZWdlciB0aGUgbGV2ZW5zaHRlaW4gZGlzdGFuY2UgKDAgYW5kIGFib3ZlKS5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKHN0cjEsIHN0cjIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciB1c2VDb2xsYXRvciA9IChvcHRpb25zICYmIGNvbGxhdG9yICYmIG9wdGlvbnMudXNlQ29sbGF0b3IpO1xuICAgICAgXG4gICAgICB2YXIgc3RyMUxlbiA9IHN0cjEubGVuZ3RoLFxuICAgICAgICBzdHIyTGVuID0gc3RyMi5sZW5ndGg7XG4gICAgICBcbiAgICAgIC8vIGJhc2UgY2FzZXNcbiAgICAgIGlmIChzdHIxTGVuID09PSAwKSByZXR1cm4gc3RyMkxlbjtcbiAgICAgIGlmIChzdHIyTGVuID09PSAwKSByZXR1cm4gc3RyMUxlbjtcblxuICAgICAgLy8gdHdvIHJvd3NcbiAgICAgIHZhciBjdXJDb2wsIG5leHRDb2wsIGksIGosIHRtcDtcblxuICAgICAgLy8gaW5pdGlhbGlzZSBwcmV2aW91cyByb3dcbiAgICAgIGZvciAoaT0wOyBpPHN0cjJMZW47ICsraSkge1xuICAgICAgICBwcmV2Um93W2ldID0gaTtcbiAgICAgICAgc3RyMkNoYXJbaV0gPSBzdHIyLmNoYXJDb2RlQXQoaSk7XG4gICAgICB9XG4gICAgICBwcmV2Um93W3N0cjJMZW5dID0gc3RyMkxlbjtcblxuICAgICAgdmFyIHN0ckNtcDtcbiAgICAgIGlmICh1c2VDb2xsYXRvcikge1xuICAgICAgICAvLyBjYWxjdWxhdGUgY3VycmVudCByb3cgZGlzdGFuY2UgZnJvbSBwcmV2aW91cyByb3cgdXNpbmcgY29sbGF0b3JcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHN0cjFMZW47ICsraSkge1xuICAgICAgICAgIG5leHRDb2wgPSBpICsgMTtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzdHIyTGVuOyArK2opIHtcbiAgICAgICAgICAgIGN1ckNvbCA9IG5leHRDb2w7XG5cbiAgICAgICAgICAgIC8vIHN1YnN0dXRpb25cbiAgICAgICAgICAgIHN0ckNtcCA9IDAgPT09IGNvbGxhdG9yLmNvbXBhcmUoc3RyMS5jaGFyQXQoaSksIFN0cmluZy5mcm9tQ2hhckNvZGUoc3RyMkNoYXJbal0pKTtcblxuICAgICAgICAgICAgbmV4dENvbCA9IHByZXZSb3dbal0gKyAoc3RyQ21wID8gMCA6IDEpO1xuXG4gICAgICAgICAgICAvLyBpbnNlcnRpb25cbiAgICAgICAgICAgIHRtcCA9IGN1ckNvbCArIDE7XG4gICAgICAgICAgICBpZiAobmV4dENvbCA+IHRtcCkge1xuICAgICAgICAgICAgICBuZXh0Q29sID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZGVsZXRpb25cbiAgICAgICAgICAgIHRtcCA9IHByZXZSb3dbaiArIDFdICsgMTtcbiAgICAgICAgICAgIGlmIChuZXh0Q29sID4gdG1wKSB7XG4gICAgICAgICAgICAgIG5leHRDb2wgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvcHkgY3VycmVudCBjb2wgdmFsdWUgaW50byBwcmV2aW91cyAoaW4gcHJlcGFyYXRpb24gZm9yIG5leHQgaXRlcmF0aW9uKVxuICAgICAgICAgICAgcHJldlJvd1tqXSA9IGN1ckNvbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjb3B5IGxhc3QgY29sIHZhbHVlIGludG8gcHJldmlvdXMgKGluIHByZXBhcmF0aW9uIGZvciBuZXh0IGl0ZXJhdGlvbilcbiAgICAgICAgICBwcmV2Um93W2pdID0gbmV4dENvbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjdXJyZW50IHJvdyBkaXN0YW5jZSBmcm9tIHByZXZpb3VzIHJvdyB3aXRob3V0IGNvbGxhdG9yXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdHIxTGVuOyArK2kpIHtcbiAgICAgICAgICBuZXh0Q29sID0gaSArIDE7XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgc3RyMkxlbjsgKytqKSB7XG4gICAgICAgICAgICBjdXJDb2wgPSBuZXh0Q29sO1xuXG4gICAgICAgICAgICAvLyBzdWJzdHV0aW9uXG4gICAgICAgICAgICBzdHJDbXAgPSBzdHIxLmNoYXJDb2RlQXQoaSkgPT09IHN0cjJDaGFyW2pdO1xuXG4gICAgICAgICAgICBuZXh0Q29sID0gcHJldlJvd1tqXSArIChzdHJDbXAgPyAwIDogMSk7XG5cbiAgICAgICAgICAgIC8vIGluc2VydGlvblxuICAgICAgICAgICAgdG1wID0gY3VyQ29sICsgMTtcbiAgICAgICAgICAgIGlmIChuZXh0Q29sID4gdG1wKSB7XG4gICAgICAgICAgICAgIG5leHRDb2wgPSB0bXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkZWxldGlvblxuICAgICAgICAgICAgdG1wID0gcHJldlJvd1tqICsgMV0gKyAxO1xuICAgICAgICAgICAgaWYgKG5leHRDb2wgPiB0bXApIHtcbiAgICAgICAgICAgICAgbmV4dENvbCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29weSBjdXJyZW50IGNvbCB2YWx1ZSBpbnRvIHByZXZpb3VzIChpbiBwcmVwYXJhdGlvbiBmb3IgbmV4dCBpdGVyYXRpb24pXG4gICAgICAgICAgICBwcmV2Um93W2pdID0gY3VyQ29sO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNvcHkgbGFzdCBjb2wgdmFsdWUgaW50byBwcmV2aW91cyAoaW4gcHJlcGFyYXRpb24gZm9yIG5leHQgaXRlcmF0aW9uKVxuICAgICAgICAgIHByZXZSb3dbal0gPSBuZXh0Q29sO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV4dENvbDtcbiAgICB9XG5cbiAgfTtcblxuICAvLyBhbWRcbiAgaWYgKHR5cGVvZiBkZWZpbmUgIT09IFwidW5kZWZpbmVkXCIgJiYgZGVmaW5lICE9PSBudWxsICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTGV2ZW5zaHRlaW47XG4gICAgfSk7XG4gIH1cbiAgLy8gY29tbW9uanNcbiAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgdHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgPT09IGV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IExldmVuc2h0ZWluO1xuICB9XG4gIC8vIHdlYiB3b3JrZXJcbiAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHNlbGYucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNlbGYuaW1wb3J0U2NyaXB0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNlbGYuTGV2ZW5zaHRlaW4gPSBMZXZlbnNodGVpbjtcbiAgfVxuICAvLyBicm93c2VyIG1haW4gdGhyZWFkXG4gIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgd2luZG93LkxldmVuc2h0ZWluID0gTGV2ZW5zaHRlaW47XG4gIH1cbn0oKSk7XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9lbXB0eUZ1bmN0aW9uJyk7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZW1wdHlGdW5jdGlvbjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgIHJldHVybjsgLy8gSWdub3JlIENvbXBvc2l0ZUNvbXBvbmVudCBwcm9wdHlwZSBjaGVjay5cbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuICB2YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmICh0eXBlU3BlY3MuaGFzT3duUHJvcGVydHkodHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpbnZhcmlhbnQodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ3RoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAlc2AuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0pO1xuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICB3YXJuaW5nKCFlcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIEVycm9yLCAnJXM6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAlcyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyLFxuICAgIGV4YWN0OiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyLFxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tXG4gICAgICAvLyBwcm9wcy5cbiAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGFsbEtleXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wRGVmYXVsdCAoZXgpIHsgcmV0dXJuIChleCAmJiAodHlwZW9mIGV4ID09PSAnb2JqZWN0JykgJiYgJ2RlZmF1bHQnIGluIGV4KSA/IGV4WydkZWZhdWx0J10gOiBleDsgfVxuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJlYWN0X19kZWZhdWx0ID0gX2ludGVyb3BEZWZhdWx0KFJlYWN0KTtcbnZhciBzaGFsbG93RXF1YWwgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnc2hhbGxvd2VxdWFsJykpO1xudmFyIGxldmVuc2h0ZWluID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ2Zhc3QtbGV2ZW5zaHRlaW4nKSk7XG52YXIgUHJvcFR5cGVzID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ3Byb3AtdHlwZXMnKSk7XG52YXIgaG9pc3ROb25SZWFjdFN0YXRpYyA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdob2lzdC1ub24tcmVhY3Qtc3RhdGljcycpKTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cblxudmFyIGlzQ29tcG9zaXRlQ29tcG9uZW50ID0gZnVuY3Rpb24gaXNDb21wb3NpdGVDb21wb25lbnQodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbic7XG59O1xuXG52YXIgZ2V0Q29tcG9uZW50RGlzcGxheU5hbWUgPSBmdW5jdGlvbiBnZXRDb21wb25lbnREaXNwbGF5TmFtZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnQ29tcG9uZW50Jztcbn07XG5cbnZhciBnZXRJbnRlcm5hbEluc3RhbmNlID0gZnVuY3Rpb24gZ2V0SW50ZXJuYWxJbnN0YW5jZShpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuX3JlYWN0SW50ZXJuYWxGaWJlciB8fCAvLyBSZWFjdCAxNlxuICBpbnN0YW5jZS5fcmVhY3RJbnRlcm5hbEluc3RhbmNlIHx8IC8vIFJlYWN0IDE1XG4gIG51bGw7XG59O1xuXG52YXIgdXBkYXRlSW5zdGFuY2UgPSBmdW5jdGlvbiB1cGRhdGVJbnN0YW5jZShpbnN0YW5jZSkge1xuICB2YXIgdXBkYXRlciA9IGluc3RhbmNlLnVwZGF0ZXIsXG4gICAgICBmb3JjZVVwZGF0ZSA9IGluc3RhbmNlLmZvcmNlVXBkYXRlO1xuXG4gIGlmICh0eXBlb2YgZm9yY2VVcGRhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICB9IGVsc2UgaWYgKHVwZGF0ZXIgJiYgdHlwZW9mIHVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUoaW5zdGFuY2UpO1xuICB9XG59O1xuXG52YXIgaXNGcmFnbWVudE5vZGUgPSBmdW5jdGlvbiBpc0ZyYWdtZW50Tm9kZShfcmVmKSB7XG4gIHZhciB0eXBlID0gX3JlZi50eXBlO1xuICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuRnJhZ21lbnQgJiYgdHlwZSA9PT0gUmVhY3RfX2RlZmF1bHQuRnJhZ21lbnQ7XG59O1xuXG52YXIgZ2VuZXJhdGlvbiA9IDE7XG5cbnZhciBpbmNyZW1lbnQgPSBmdW5jdGlvbiBpbmNyZW1lbnQoKSB7XG4gIHJldHVybiBnZW5lcmF0aW9uKys7XG59O1xudmFyIGdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgcmV0dXJuIGdlbmVyYXRpb247XG59O1xuXG52YXIgUFJFRklYID0gJ19fcmVhY3RzdGFuZGluX18nO1xudmFyIFBST1hZX0tFWSA9IFBSRUZJWCArICdrZXknO1xudmFyIEdFTkVSQVRJT04gPSBQUkVGSVggKyAncHJveHlHZW5lcmF0aW9uJztcbnZhciBSRUdFTkVSQVRFX01FVEhPRCA9IFBSRUZJWCArICdyZWdlbmVyYXRlQnlFdmFsJztcbnZhciBVTldSQVBfUFJPWFkgPSBQUkVGSVggKyAnZ2V0Q3VycmVudCc7XG52YXIgQ0FDSEVEX1JFU1VMVCA9IFBSRUZJWCArICdjYWNoZWRSZXN1bHQnO1xudmFyIFBST1hZX0lTX01PVU5URUQgPSBQUkVGSVggKyAnaXNNb3VudGVkJztcblxudmFyIGNvbmZpZ3VyYXRpb24gPSB7XG4gIGxvZ0xldmVsOiAnZXJyb3InXG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbnZhciBsb2dnZXIgPSB7XG4gIGRlYnVnOiBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICBpZiAoWydkZWJ1ZyddLmluY2x1ZGVzKGNvbmZpZ3VyYXRpb24ubG9nTGV2ZWwpKSB7XG4gICAgICB2YXIgX2NvbnNvbGU7XG5cbiAgICAgIChfY29uc29sZSA9IGNvbnNvbGUpLmRlYnVnLmFwcGx5KF9jb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgbG9nOiBmdW5jdGlvbiBsb2coKSB7XG4gICAgaWYgKFsnZGVidWcnLCAnbG9nJ10uaW5jbHVkZXMoY29uZmlndXJhdGlvbi5sb2dMZXZlbCkpIHtcbiAgICAgIHZhciBfY29uc29sZTI7XG5cbiAgICAgIChfY29uc29sZTIgPSBjb25zb2xlKS5sb2cuYXBwbHkoX2NvbnNvbGUyLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHtcbiAgICBpZiAoWydkZWJ1ZycsICdsb2cnLCAnd2FybiddLmluY2x1ZGVzKGNvbmZpZ3VyYXRpb24ubG9nTGV2ZWwpKSB7XG4gICAgICB2YXIgX2NvbnNvbGUzO1xuXG4gICAgICAoX2NvbnNvbGUzID0gY29uc29sZSkud2Fybi5hcHBseShfY29uc29sZTMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgaWYgKFsnZGVidWcnLCAnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5pbmNsdWRlcyhjb25maWd1cmF0aW9uLmxvZ0xldmVsKSkge1xuICAgICAgdmFyIF9jb25zb2xlNDtcblxuICAgICAgKF9jb25zb2xlNCA9IGNvbnNvbGUpLmVycm9yLmFwcGx5KF9jb25zb2xlNCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1ldmFsLCBmdW5jLW5hbWVzICovXG5cbmZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKENvbXBvbmVudCkge1xuICB2YXIgZGlzcGxheU5hbWUgPSBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50Lm5hbWU7XG4gIHJldHVybiBkaXNwbGF5TmFtZSAmJiBkaXNwbGF5TmFtZSAhPT0gJ1JlYWN0Q29tcG9uZW50JyA/IGRpc3BsYXlOYW1lIDogJ1Vua25vd24nO1xufVxuXG52YXIgcmVhY3RMaWZlQ3ljbGVNb3VudE1ldGhvZHMgPSBbJ2NvbXBvbmVudFdpbGxNb3VudCcsICdjb21wb25lbnREaWRNb3VudCddO1xuXG5mdW5jdGlvbiBpc1JlYWN0Q2xhc3MoQ29tcG9uZW50KSB7XG4gIHJldHVybiBDb21wb25lbnQucHJvdG90eXBlICYmIChDb21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgfHwgQ29tcG9uZW50LnByb3RvdHlwZS5jb21wb25lbnRXaWxsTW91bnQgfHwgQ29tcG9uZW50LnByb3RvdHlwZS5jb21wb25lbnRXaWxsVW5tb3VudCB8fCBDb21wb25lbnQucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50IHx8IENvbXBvbmVudC5wcm90b3R5cGUuY29tcG9uZW50RGlkVW5tb3VudCB8fCBDb21wb25lbnQucHJvdG90eXBlLnJlbmRlcik7XG59XG5cbmZ1bmN0aW9uIHNhZmVSZWFjdENvbnN0cnVjdG9yKENvbXBvbmVudCwgbGFzdEluc3RhbmNlKSB7XG4gIHRyeSB7XG4gICAgaWYgKGxhc3RJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIG5ldyBDb21wb25lbnQobGFzdEluc3RhbmNlLnByb3BzLCBsYXN0SW5zdGFuY2UuY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29tcG9uZW50KHt9LCB7fSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBzb21lIGNvbXBvbmVudHMsIGxpa2UgUmVkdXggY29ubmVjdCBjb3VsZCBub3QgYmUgY3JlYXRlZCB3aXRob3V0IHByb3BlciBjb250ZXh0XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyA/IGZuLnRvU3RyaW5nKCkuaW5kZXhPZignW25hdGl2ZSBjb2RlXScpID4gMCA6IGZhbHNlO1xufVxuXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbiBpZGVudGl0eShhKSB7XG4gIHJldHVybiBhO1xufTtcbnZhciBpbmRpcmVjdEV2YWwgPSBldmFsO1xuXG52YXIgZG9lc1N1cHBvcnRDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIGluZGlyZWN0RXZhbCgnY2xhc3MgVGVzdCB7fScpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KCk7XG5cbnZhciBFUzZQcm94eUNvbXBvbmVudEZhY3RvcnkgPSBkb2VzU3VwcG9ydENsYXNzZXMgJiYgaW5kaXJlY3RFdmFsKCdcXG4oZnVuY3Rpb24oSW5pdGlhbFBhcmVudCwgcG9zdENvbnN0cnVjdGlvbkFjdGlvbikge1xcbiAgcmV0dXJuIGNsYXNzIFByb3h5Q29tcG9uZW50IGV4dGVuZHMgSW5pdGlhbFBhcmVudCB7XFxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XFxuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXFxuICAgICAgcG9zdENvbnN0cnVjdGlvbkFjdGlvbi5jYWxsKHRoaXMpXFxuICAgIH1cXG4gIH1cXG59KVxcbicpO1xuXG52YXIgRVM1UHJveHlDb21wb25lbnRGYWN0b3J5ID0gZnVuY3Rpb24gRVM1UHJveHlDb21wb25lbnRGYWN0b3J5KEluaXRpYWxQYXJlbnQsIHBvc3RDb25zdHJ1Y3Rpb25BY3Rpb24pIHtcbiAgZnVuY3Rpb24gUHJveHlDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICBJbml0aWFsUGFyZW50LmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgIHBvc3RDb25zdHJ1Y3Rpb25BY3Rpb24uY2FsbCh0aGlzKTtcbiAgfVxuICBQcm94eUNvbXBvbmVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEluaXRpYWxQYXJlbnQucHJvdG90eXBlKTtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKFByb3h5Q29tcG9uZW50LCBJbml0aWFsUGFyZW50KTtcbiAgcmV0dXJuIFByb3h5Q29tcG9uZW50O1xufTtcblxudmFyIGlzUmVhY3RDb21wb25lbnRJbnN0YW5jZSA9IGZ1bmN0aW9uIGlzUmVhY3RDb21wb25lbnRJbnN0YW5jZShlbCkge1xuICByZXR1cm4gZWwgJiYgKHR5cGVvZiBlbCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoZWwpKSA9PT0gJ29iamVjdCcgJiYgIWVsLnR5cGUgJiYgZWwucmVuZGVyO1xufTtcblxudmFyIHByb3h5Q2xhc3NDcmVhdG9yID0gZG9lc1N1cHBvcnRDbGFzc2VzID8gRVM2UHJveHlDb21wb25lbnRGYWN0b3J5IDogRVM1UHJveHlDb21wb25lbnRGYWN0b3J5O1xuXG5mdW5jdGlvbiBnZXRPd25LZXlzKHRhcmdldCkge1xuICByZXR1cm4gW10uY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dTdHJpbmdzRXF1YWwoYSwgYikge1xuICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgIGlmIChTdHJpbmcoYVtrZXldKSAhPT0gU3RyaW5nKGJba2V5XSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGRlZXBQcm90b3R5cGVVcGRhdGUoZGVzdCwgc291cmNlKSB7XG4gIHZhciBkZWVwRGVzdCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihkZXN0KTtcbiAgdmFyIGRlZXBTcmMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKTtcbiAgaWYgKGRlZXBEZXN0ICYmIGRlZXBTcmMgJiYgZGVlcFNyYyAhPT0gZGVlcERlc3QpIHtcbiAgICBkZWVwUHJvdG90eXBlVXBkYXRlKGRlZXBEZXN0LCBkZWVwU3JjKTtcbiAgfVxuICBpZiAoc291cmNlLnByb3RvdHlwZSAmJiBzb3VyY2UucHJvdG90eXBlICE9PSBkZXN0LnByb3RvdHlwZSkge1xuICAgIGRlc3QucHJvdG90eXBlID0gc291cmNlLnByb3RvdHlwZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzYWZlRGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHByb3BzKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBwcm9wcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIud2FybignRXJyb3Igd2hpbGUgd3JhcHBpbmcnLCBrZXksICcgLT4gJywgZSk7XG4gIH1cbn1cblxudmFyIFJFU0VSVkVEX1NUQVRJQ1MgPSBbJ2xlbmd0aCcsICdkaXNwbGF5TmFtZScsICduYW1lJywgJ2FyZ3VtZW50cycsICdjYWxsZXInLCAncHJvdG90eXBlJywgJ3RvU3RyaW5nJywgJ3ZhbHVlT2YnLCBQUk9YWV9LRVksIFVOV1JBUF9QUk9YWV07XG5cbmZ1bmN0aW9uIHRyYW5zZmVyU3RhdGljUHJvcHMoUHJveHlDb21wb25lbnQsIHNhdmVkRGVzY3JpcHRvcnMsIFByZXZpb3VzQ29tcG9uZW50LCBOZXh0Q29tcG9uZW50KSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKFByb3h5Q29tcG9uZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoUkVTRVJWRURfU1RBVElDUy5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByZXZEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihQcm94eUNvbXBvbmVudCwga2V5KTtcbiAgICB2YXIgc2F2ZWREZXNjcmlwdG9yID0gc2F2ZWREZXNjcmlwdG9yc1trZXldO1xuXG4gICAgaWYgKCFzaGFsbG93RXF1YWwocHJldkRlc2NyaXB0b3IsIHNhdmVkRGVzY3JpcHRvcikpIHtcbiAgICAgIHNhZmVEZWZpbmVQcm9wZXJ0eShOZXh0Q29tcG9uZW50LCBrZXksIHByZXZEZXNjcmlwdG9yKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIENvcHkgbmV3bHkgZGVmaW5lZCBzdGF0aWMgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhOZXh0Q29tcG9uZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoUkVTRVJWRURfU1RBVElDUy5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByZXZEZXNjcmlwdG9yID0gUHJldmlvdXNDb21wb25lbnQgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihQcm94eUNvbXBvbmVudCwga2V5KTtcbiAgICB2YXIgc2F2ZWREZXNjcmlwdG9yID0gc2F2ZWREZXNjcmlwdG9yc1trZXldO1xuXG4gICAgLy8gU2tpcCByZWRlZmluZWQgZGVzY3JpcHRvcnNcbiAgICBpZiAocHJldkRlc2NyaXB0b3IgJiYgc2F2ZWREZXNjcmlwdG9yICYmICFzaGFsbG93RXF1YWwoc2F2ZWREZXNjcmlwdG9yLCBwcmV2RGVzY3JpcHRvcikpIHtcbiAgICAgIHNhZmVEZWZpbmVQcm9wZXJ0eShOZXh0Q29tcG9uZW50LCBrZXksIHByZXZEZXNjcmlwdG9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJldkRlc2NyaXB0b3IgJiYgIXNhdmVkRGVzY3JpcHRvcikge1xuICAgICAgc2FmZURlZmluZVByb3BlcnR5KFByb3h5Q29tcG9uZW50LCBrZXksIHByZXZEZXNjcmlwdG9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dERlc2NyaXB0b3IgPSBfZXh0ZW5kcyh7fSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihOZXh0Q29tcG9uZW50LCBrZXkpLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIHNhdmVkRGVzY3JpcHRvcnNba2V5XSA9IG5leHREZXNjcmlwdG9yO1xuICAgIHNhZmVEZWZpbmVQcm9wZXJ0eShQcm94eUNvbXBvbmVudCwga2V5LCBuZXh0RGVzY3JpcHRvcik7XG4gIH0pO1xuXG4gIC8vIFJlbW92ZSBzdGF0aWMgbWV0aG9kcyBhbmQgcHJvcGVydGllcyB0aGF0IGFyZSBubyBsb25nZXIgZGVmaW5lZFxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhQcm94eUNvbXBvbmVudCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKFJFU0VSVkVEX1NUQVRJQ1MuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTa2lwIHN0YXRpY3MgdGhhdCBleGlzdCBvbiB0aGUgbmV4dCBjbGFzc1xuICAgIGlmIChOZXh0Q29tcG9uZW50Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gU2tpcCBub24tY29uZmlndXJhYmxlIHN0YXRpY3NcbiAgICB2YXIgcHJveHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihQcm94eUNvbXBvbmVudCwga2V5KTtcbiAgICBpZiAocHJveHlEZXNjcmlwdG9yICYmICFwcm94eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByZXZEZXNjcmlwdG9yID0gUHJldmlvdXNDb21wb25lbnQgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihQcmV2aW91c0NvbXBvbmVudCwga2V5KTtcbiAgICB2YXIgc2F2ZWREZXNjcmlwdG9yID0gc2F2ZWREZXNjcmlwdG9yc1trZXldO1xuXG4gICAgLy8gU2tpcCByZWRlZmluZWQgZGVzY3JpcHRvcnNcbiAgICBpZiAocHJldkRlc2NyaXB0b3IgJiYgc2F2ZWREZXNjcmlwdG9yICYmICFzaGFsbG93RXF1YWwoc2F2ZWREZXNjcmlwdG9yLCBwcmV2RGVzY3JpcHRvcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzYWZlRGVmaW5lUHJvcGVydHkoUHJveHlDb21wb25lbnQsIGtleSwge1xuICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gc2F2ZWREZXNjcmlwdG9ycztcbn1cblxuZnVuY3Rpb24gbWVyZ2VDb21wb25lbnRzKFByb3h5Q29tcG9uZW50LCBOZXh0Q29tcG9uZW50LCBJbml0aWFsQ29tcG9uZW50LCBsYXN0SW5zdGFuY2UsIGluamVjdGVkTWVtYmVycykge1xuICB2YXIgaW5qZWN0ZWRDb2RlID0ge307XG4gIHRyeSB7XG4gICAgdmFyIG5leHRJbnN0YW5jZSA9IHNhZmVSZWFjdENvbnN0cnVjdG9yKE5leHRDb21wb25lbnQsIGxhc3RJbnN0YW5jZSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gQnlwYXNzIGJhYmVsIGNsYXNzIGluaGVyaXRhbmNlIGNoZWNraW5nXG4gICAgICBkZWVwUHJvdG90eXBlVXBkYXRlKEluaXRpYWxDb21wb25lbnQsIE5leHRDb21wb25lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIEl0IHdhcyBFUzYgY2xhc3NcbiAgICB9XG5cbiAgICB2YXIgcHJveHlJbnN0YW5jZSA9IHNhZmVSZWFjdENvbnN0cnVjdG9yKFByb3h5Q29tcG9uZW50LCBsYXN0SW5zdGFuY2UpO1xuXG4gICAgaWYgKCFuZXh0SW5zdGFuY2UgfHwgIXByb3h5SW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiBpbmplY3RlZENvZGU7XG4gICAgfVxuXG4gICAgdmFyIG1lcmdlZEF0dHJzID0gX2V4dGVuZHMoe30sIHByb3h5SW5zdGFuY2UsIG5leHRJbnN0YW5jZSk7XG4gICAgdmFyIGhhc1JlZ2VuZXJhdGUgPSBwcm94eUluc3RhbmNlW1JFR0VORVJBVEVfTUVUSE9EXTtcbiAgICB2YXIgb3duS2V5cyA9IGdldE93bktleXMoT2JqZWN0LmdldFByb3RvdHlwZU9mKFByb3h5Q29tcG9uZW50LnByb3RvdHlwZSkpO1xuICAgIE9iamVjdC5rZXlzKG1lcmdlZEF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChQUkVGSVgpKSByZXR1cm47XG4gICAgICB2YXIgbmV4dEF0dHIgPSBuZXh0SW5zdGFuY2Vba2V5XTtcbiAgICAgIHZhciBwcmV2QXR0ciA9IHByb3h5SW5zdGFuY2Vba2V5XTtcbiAgICAgIGlmIChwcmV2QXR0ciAmJiBuZXh0QXR0cikge1xuICAgICAgICBpZiAoaXNOYXRpdmVGdW5jdGlvbihuZXh0QXR0cikgfHwgaXNOYXRpdmVGdW5jdGlvbihwcmV2QXR0cikpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIGJvdW5kIG1ldGhvZFxuICAgICAgICAgIHZhciBpc1NhbWVBcml0eSA9IG5leHRBdHRyLmxlbmd0aCA9PT0gcHJldkF0dHIubGVuZ3RoO1xuICAgICAgICAgIHZhciBleGlzdHNJblByb3RvdHlwZSA9IG93bktleXMuaW5kZXhPZihrZXkpID49IDAgfHwgUHJveHlDb21wb25lbnQucHJvdG90eXBlW2tleV07XG4gICAgICAgICAgaWYgKGlzU2FtZUFyaXR5ICYmIGV4aXN0c0luUHJvdG90eXBlKSB7XG4gICAgICAgICAgICBpZiAoaGFzUmVnZW5lcmF0ZSkge1xuICAgICAgICAgICAgICBpbmplY3RlZENvZGVba2V5XSA9ICdPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcylbXFwnJyArIGtleSArICdcXCddLmJpbmQodGhpcyknO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ1JlYWN0IEhvdCBMb2FkZXI6LCcsICdOb24tY29udHJvbGxlZCBjbGFzcycsIFByb3h5Q29tcG9uZW50Lm5hbWUsICdjb250YWlucyBhIG5ldyBuYXRpdmUgb3IgYm91bmQgZnVuY3Rpb24gJywga2V5LCBuZXh0QXR0ciwgJy4gVW5hYmxlIHRvIHJlcHJvZHVjZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybignUmVhY3QgSG90IExvYWRlcjonLCAnVXBkYXRlZCBjbGFzcyAnLCBQcm94eUNvbXBvbmVudC5uYW1lLCAnY29udGFpbnMgbmF0aXZlIG9yIGJvdW5kIGZ1bmN0aW9uICcsIGtleSwgbmV4dEF0dHIsICcuIFVuYWJsZSB0byByZXByb2R1Y2UsIHVzZSBhcnJvdyBmdW5jdGlvbnMgaW5zdGVhZC4nLCAnKGFyaXR5OiAnICsgbmV4dEF0dHIubGVuZ3RoICsgJy8nICsgcHJldkF0dHIubGVuZ3RoICsgJywgcHJvdG86ICcgKyAoZXhpc3RzSW5Qcm90b3R5cGUgPyAneWVzJyA6ICdubycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHRTdHJpbmcgPSBTdHJpbmcobmV4dEF0dHIpO1xuICAgICAgICB2YXIgaW5qZWN0ZWRCZWZvcmUgPSBpbmplY3RlZE1lbWJlcnNba2V5XTtcbiAgICAgICAgaWYgKG5leHRTdHJpbmcgIT09IFN0cmluZyhwcmV2QXR0cikgfHwgaW5qZWN0ZWRCZWZvcmUgJiYgbmV4dFN0cmluZyAhPT0gU3RyaW5nKGluamVjdGVkQmVmb3JlKSkge1xuICAgICAgICAgIGlmICghaGFzUmVnZW5lcmF0ZSkge1xuICAgICAgICAgICAgaWYgKG5leHRTdHJpbmcuaW5kZXhPZignZnVuY3Rpb24nKSA8IDAgJiYgbmV4dFN0cmluZy5pbmRleE9mKCc9PicpIDwgMCkge1xuICAgICAgICAgICAgICAvLyBqdXN0IGNvcHkgcHJvcCBvdmVyXG4gICAgICAgICAgICAgIGluamVjdGVkQ29kZVtrZXldID0gbmV4dEF0dHI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsb2dnZXIud2FybignUmVhY3QgSG90IExvYWRlcjonLCAnIFVwZGF0ZWQgY2xhc3MgJywgUHJveHlDb21wb25lbnQubmFtZSwgJ2hhZCBkaWZmZXJlbnQgY29kZSBmb3InLCBrZXksIG5leHRBdHRyLCAnLiBVbmFibGUgdG8gcmVwcm9kdWNlLiBSZWdlbmVyYXRpb24gc3VwcG9ydCBuZWVkZWQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluamVjdGVkQ29kZVtrZXldID0gbmV4dEF0dHI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIud2FybignUmVhY3QgSG90IExvYWRlcjonLCBlKTtcbiAgfVxuICByZXR1cm4gaW5qZWN0ZWRDb2RlO1xufVxuXG5mdW5jdGlvbiBjaGVja0xpZmVDeWNsZU1ldGhvZHMoUHJveHlDb21wb25lbnQsIE5leHRDb21wb25lbnQpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcDEgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUHJveHlDb21wb25lbnQucHJvdG90eXBlKTtcbiAgICB2YXIgcDIgPSBOZXh0Q29tcG9uZW50LnByb3RvdHlwZTtcbiAgICByZWFjdExpZmVDeWNsZU1vdW50TWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBkMSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocDEsIGtleSkgfHwgeyB2YWx1ZTogcDFba2V5XSB9O1xuICAgICAgdmFyIGQyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwMiwga2V5KSB8fCB7IHZhbHVlOiBwMltrZXldIH07XG4gICAgICBpZiAoIXNoYWxsb3dTdHJpbmdzRXF1YWwoZDEsIGQyKSkge1xuICAgICAgICBsb2dnZXIud2FybignUmVhY3QgSG90IExvYWRlcjonLCAnWW91IGRpZCB1cGRhdGUnLCBQcm94eUNvbXBvbmVudC5uYW1lLCAncyBsaWZlY3ljbGUgbWV0aG9kJywga2V5LCAnLiBVbmFibGUgdG8gcmVwZWF0Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJZ25vcmUgZXJyb3JzXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5qZWN0KHRhcmdldCwgY3VycmVudEdlbmVyYXRpb24sIGluamVjdGVkTWVtYmVycykge1xuICBpZiAodGFyZ2V0W0dFTkVSQVRJT05dICE9PSBjdXJyZW50R2VuZXJhdGlvbikge1xuICAgIHZhciBoYXNSZWdlbmVyYXRlID0gISF0YXJnZXRbUkVHRU5FUkFURV9NRVRIT0RdO1xuICAgIE9iamVjdC5rZXlzKGluamVjdGVkTWVtYmVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFzUmVnZW5lcmF0ZSkge1xuICAgICAgICAgIHRhcmdldFtSRUdFTkVSQVRFX01FVEhPRF0oa2V5LCAnKGZ1bmN0aW9uIFJFQUNUX0hPVF9MT0FERVJfU0FOREJPWCAoKSB7XFxuICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IC8vIGNvbW1vbiBiYWJlbCB0cmFuc3BpbGVcXG4gICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7IC8vIGNvbW1vbiBiYWJlbCB0cmFuc3BpbGVcXG4gICAgICAgICAgcmV0dXJuICcgKyBpbmplY3RlZE1lbWJlcnNba2V5XSArICc7XFxuICAgICAgICAgIH0pLmNhbGwodGhpcyknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IGluamVjdGVkTWVtYmVyc1trZXldO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci53YXJuKCdSZWFjdCBIb3QgTG9hZGVyOiBGYWlsZWQgdG8gcmVnZW5lcmF0ZSBtZXRob2QgJywga2V5LCAnIG9mIGNsYXNzICcsIHRhcmdldCk7XG4gICAgICAgIGxvZ2dlci53YXJuKCdnb3QgZXJyb3InLCBlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRhcmdldFtHRU5FUkFUSU9OXSA9IGN1cnJlbnRHZW5lcmF0aW9uO1xuICB9XG59XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgcHJveGllcyA9IG5ldyBXZWFrTWFwKCk7XG5cbnZhciBibGFja0xpc3RlZENsYXNzTWVtYmVycyA9IFsnY29uc3RydWN0b3InLCAncmVuZGVyJywgJ2NvbXBvbmVudERpZE1vdW50JywgJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLCAnY29tcG9uZW50V2lsbFVubW91bnQnLCAnZ2V0SW5pdGlhbFN0YXRlJywgJ2dldERlZmF1bHRQcm9wcyddO1xuXG52YXIgZGVmYXVsdFJlbmRlck9wdGlvbnMgPSB7XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGlkZW50aXR5LFxuICBjb21wb25lbnRXaWxsUmVuZGVyOiBpZGVudGl0eSxcbiAgY29tcG9uZW50RGlkUmVuZGVyOiBmdW5jdGlvbiBjb21wb25lbnREaWRSZW5kZXIocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcblxudmFyIGRlZmluZUNsYXNzTWVtYmVyID0gZnVuY3Rpb24gZGVmaW5lQ2xhc3NNZW1iZXIoQ2xhc3MsIG1ldGhvZE5hbWUsIG1ldGhvZEJvZHkpIHtcbiAgcmV0dXJuIHNhZmVEZWZpbmVQcm9wZXJ0eShDbGFzcy5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IG1ldGhvZEJvZHlcbiAgfSk7XG59O1xuXG52YXIgZGVmaW5lQ2xhc3NNZW1iZXJzID0gZnVuY3Rpb24gZGVmaW5lQ2xhc3NNZW1iZXJzKENsYXNzLCBtZXRob2RzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAgcmV0dXJuIGRlZmluZUNsYXNzTWVtYmVyKENsYXNzLCBtZXRob2ROYW1lLCBtZXRob2RzW21ldGhvZE5hbWVdKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVDbGFzc1Byb3h5KEluaXRpYWxDb21wb25lbnQsIHByb3h5S2V5LCBvcHRpb25zKSB7XG4gIHZhciByZW5kZXJPcHRpb25zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRSZW5kZXJPcHRpb25zLCBvcHRpb25zKTtcbiAgLy8gUHJldmVudCBkb3VibGUgd3JhcHBpbmcuXG4gIC8vIEdpdmVuIGEgcHJveHkgY2xhc3MsIHJldHVybiB0aGUgZXhpc3RpbmcgcHJveHkgbWFuYWdpbmcgaXQuXG4gIHZhciBleGlzdGluZ1Byb3h5ID0gcHJveGllcy5nZXQoSW5pdGlhbENvbXBvbmVudCk7XG5cbiAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmdQcm94eTtcbiAgfVxuXG4gIHZhciBDdXJyZW50Q29tcG9uZW50ID0gdm9pZCAwO1xuICB2YXIgc2F2ZWREZXNjcmlwdG9ycyA9IHt9O1xuICB2YXIgaW5qZWN0ZWRNZW1iZXJzID0ge307XG4gIHZhciBwcm94eUdlbmVyYXRpb24gPSAwO1xuICB2YXIgaXNGdW5jdGlvbmFsQ29tcG9uZW50ID0gIWlzUmVhY3RDbGFzcyhJbml0aWFsQ29tcG9uZW50KTtcblxuICB2YXIgbGFzdEluc3RhbmNlID0gbnVsbDtcblxuICBmdW5jdGlvbiBwb3N0Q29uc3RydWN0aW9uQWN0aW9uKCkge1xuICAgIHRoaXNbR0VORVJBVElPTl0gPSAwO1xuXG4gICAgLy8gQXMgbG9uZyB3ZSBjYW4ndCBvdmVycmlkZSBjb25zdHJ1Y3RvclxuICAgIC8vIGV2ZXJ5IGNsYXNzIHNoYWxsIGV2b2x2ZSBmcm9tIGEgYmFzZSBjbGFzc1xuICAgIGluamVjdCh0aGlzLCBwcm94eUdlbmVyYXRpb24sIGluamVjdGVkTWVtYmVycyk7XG5cbiAgICBsYXN0SW5zdGFuY2UgPSB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveGllZFVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcykge1xuICAgICAgaW5qZWN0KHRoaXMsIHByb3h5R2VuZXJhdGlvbiwgaW5qZWN0ZWRNZW1iZXJzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsaWZlQ3ljbGVXcmFwcGVyRmFjdG9yeSh3cmFwcGVyTmFtZSkge1xuICAgIHZhciBzaWRlRWZmZWN0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBpZGVudGl0eTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkTWV0aG9kKCkge1xuICAgICAgcHJveGllZFVwZGF0ZS5jYWxsKHRoaXMpO1xuICAgICAgc2lkZUVmZmVjdCh0aGlzKTtcblxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHJlc3QgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgcmVzdFtfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICFpc0Z1bmN0aW9uYWxDb21wb25lbnQgJiYgQ3VycmVudENvbXBvbmVudC5wcm90b3R5cGVbd3JhcHBlck5hbWVdICYmIEN1cnJlbnRDb21wb25lbnQucHJvdG90eXBlW3dyYXBwZXJOYW1lXS5hcHBseSh0aGlzLCByZXN0KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWV0aG9kV3JhcHBlckZhY3Rvcnkod3JhcHBlck5hbWUsIHJlYWxNZXRob2QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZE1ldGhvZCgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgcmVzdCA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIHJlc3RbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlYWxNZXRob2QuYXBwbHkodGhpcywgcmVzdCk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBmYWtlQmFzZVByb3RvdHlwZSA9IGZ1bmN0aW9uIGZha2VCYXNlUHJvdG90eXBlKEJhc2UpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQmFzZSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBibGFja0xpc3RlZENsYXNzTWVtYmVycy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQmFzZSwga2V5KTtcbiAgICAgIHJldHVybiB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICBhY2Nba2V5XSA9IG1ldGhvZFdyYXBwZXJGYWN0b3J5KGtleSwgQmFzZVtrZXldKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9O1xuXG4gIHZhciBjb21wb25lbnREaWRNb3VudCA9IGxpZmVDeWNsZVdyYXBwZXJGYWN0b3J5KCdjb21wb25lbnREaWRNb3VudCcsIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0YXJnZXRbUFJPWFlfSVNfTU9VTlRFRF0gPSB0cnVlO1xuICB9KTtcbiAgdmFyIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgPSBsaWZlQ3ljbGVXcmFwcGVyRmFjdG9yeSgnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsIHJlbmRlck9wdGlvbnMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyk7XG4gIHZhciBjb21wb25lbnRXaWxsVW5tb3VudCA9IGxpZmVDeWNsZVdyYXBwZXJGYWN0b3J5KCdjb21wb25lbnRXaWxsVW5tb3VudCcsIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0YXJnZXRbUFJPWFlfSVNfTU9VTlRFRF0gPSBmYWxzZTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHJveGllZFJlbmRlcigpIHtcbiAgICBwcm94aWVkVXBkYXRlLmNhbGwodGhpcyk7XG4gICAgcmVuZGVyT3B0aW9ucy5jb21wb25lbnRXaWxsUmVuZGVyKHRoaXMpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblxuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGhhc093blByb3BlcnR5IGhlcmUsIGFzIHRoZSBjYWNoZWQgcmVzdWx0IGlzIGEgUmVhY3Qgbm9kZVxuICAgIC8vIGFuZCBjYW4gYmUgbnVsbCBvciBzb21lIG90aGVyIGZhbHN5IHZhbHVlLlxuICAgIGlmIChoYXMuY2FsbCh0aGlzLCBDQUNIRURfUkVTVUxUKSkge1xuICAgICAgcmVzdWx0ID0gdGhpc1tDQUNIRURfUkVTVUxUXTtcbiAgICAgIGRlbGV0ZSB0aGlzW0NBQ0hFRF9SRVNVTFRdO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbmFsQ29tcG9uZW50KSB7XG4gICAgICByZXN1bHQgPSBDdXJyZW50Q29tcG9uZW50KHRoaXMucHJvcHMsIHRoaXMuY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IEN1cnJlbnRDb21wb25lbnQucHJvdG90eXBlLnJlbmRlci5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJPcHRpb25zLmNvbXBvbmVudERpZFJlbmRlcihyZXN1bHQpO1xuICB9XG5cbiAgdmFyIGRlZmluZVByb3h5TWV0aG9kcyA9IGZ1bmN0aW9uIGRlZmluZVByb3h5TWV0aG9kcyhQcm94eSkge1xuICAgIHZhciBCYXNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIGRlZmluZUNsYXNzTWVtYmVycyhQcm94eSwgX2V4dGVuZHMoe30sIGZha2VCYXNlUHJvdG90eXBlKEJhc2UpLCB7XG4gICAgICByZW5kZXI6IHByb3hpZWRSZW5kZXIsXG4gICAgICBjb21wb25lbnREaWRNb3VudDogY29tcG9uZW50RGlkTW91bnQsXG4gICAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzLFxuICAgICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGNvbXBvbmVudFdpbGxVbm1vdW50XG4gICAgfSkpO1xuICB9O1xuXG4gIHZhciBQcm94eUZhY2FkZSA9IHZvaWQgMDtcbiAgdmFyIFByb3h5Q29tcG9uZW50ID0gbnVsbDtcblxuICBpZiAoIWlzRnVuY3Rpb25hbENvbXBvbmVudCkge1xuICAgIFByb3h5Q29tcG9uZW50ID0gcHJveHlDbGFzc0NyZWF0b3IoSW5pdGlhbENvbXBvbmVudCwgcG9zdENvbnN0cnVjdGlvbkFjdGlvbik7XG5cbiAgICBkZWZpbmVQcm94eU1ldGhvZHMoUHJveHlDb21wb25lbnQsIEluaXRpYWxDb21wb25lbnQucHJvdG90eXBlKTtcblxuICAgIFByb3h5RmFjYWRlID0gUHJveHlDb21wb25lbnQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBvbmx5IGdldHMgY2FsbGVkIGZvciB0aGUgaW5pdGlhbCBtb3VudC4gVGhlIGFjdHVhbFxuICAgIC8vIHJlbmRlcmVkIGNvbXBvbmVudCBpbnN0YW5jZSB3aWxsIGJlIHRoZSByZXR1cm4gdmFsdWUuXG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIFByb3h5RmFjYWRlID0gZnVuY3Rpb24gUHJveHlGYWNhZGUocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBDdXJyZW50Q29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgLy8gVGhpcyBpcyBhIFJlbGF5LXN0eWxlIGNvbnRhaW5lciBjb25zdHJ1Y3Rvci4gV2UgY2FuJ3QgZG8gdGhlIHByb3RvdHlwZS1cbiAgICAgIC8vIHN0eWxlIHdyYXBwaW5nIGZvciB0aGlzIGFzIHdlIGRvIGVsc2V3aGVyZSwgc28ganVzdCB3ZSBqdXN0IHBhc3MgaXRcbiAgICAgIC8vIHRocm91Z2ggYXMtaXMuXG4gICAgICBpZiAoaXNSZWFjdENvbXBvbmVudEluc3RhbmNlKHJlc3VsdCkpIHtcbiAgICAgICAgUHJveHlDb21wb25lbnQgPSBudWxsO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICAvLyBPdGhlcndpc2UsIGl0J3MgYSBub3JtYWwgZnVuY3Rpb25hbCBjb21wb25lbnQuIEJ1aWxkIHRoZSByZWFsIHByb3h5XG4gICAgICAvLyBhbmQgdXNlIGl0IGdvaW5nIGZvcndhcmQuXG4gICAgICBQcm94eUNvbXBvbmVudCA9IHByb3h5Q2xhc3NDcmVhdG9yKFJlYWN0LkNvbXBvbmVudCwgcG9zdENvbnN0cnVjdGlvbkFjdGlvbik7XG5cbiAgICAgIGRlZmluZVByb3h5TWV0aG9kcyhQcm94eUNvbXBvbmVudCk7XG5cbiAgICAgIHZhciBkZXRlcm1pbmF0ZVJlc3VsdCA9IG5ldyBQcm94eUNvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG5cbiAgICAgIC8vIENhY2hlIHRoZSBpbml0aWFsIHJlbmRlciByZXN1bHQgc28gd2UgZG9uJ3QgY2FsbCB0aGUgY29tcG9uZW50IGZ1bmN0aW9uXG4gICAgICAvLyBhIHNlY29uZCB0aW1lIGZvciB0aGUgaW5pdGlhbCByZW5kZXIuXG4gICAgICBkZXRlcm1pbmF0ZVJlc3VsdFtDQUNIRURfUkVTVUxUXSA9IHJlc3VsdDtcbiAgICAgIHJldHVybiBkZXRlcm1pbmF0ZVJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBQcm94eUZhY2FkZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIEN1cnJlbnRDb21wb25lbnQ7XG4gIH1cblxuICBzYWZlRGVmaW5lUHJvcGVydHkoUHJveHlGYWNhZGUsIFVOV1JBUF9QUk9YWSwge1xuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiBnZXRDdXJyZW50XG4gIH0pO1xuXG4gIHNhZmVEZWZpbmVQcm9wZXJ0eShQcm94eUZhY2FkZSwgUFJPWFlfS0VZLCB7XG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IHByb3h5S2V5XG4gIH0pO1xuXG4gIHNhZmVEZWZpbmVQcm9wZXJ0eShQcm94eUZhY2FkZSwgJ3RvU3RyaW5nJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhDdXJyZW50Q29tcG9uZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZShOZXh0Q29tcG9uZW50KSB7XG4gICAgaWYgKHR5cGVvZiBOZXh0Q29tcG9uZW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGEgY29uc3RydWN0b3IuJyk7XG4gICAgfVxuXG4gICAgaWYgKE5leHRDb21wb25lbnQgPT09IEN1cnJlbnRDb21wb25lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHByb3h5IGN5Y2xlc1xuICAgIHZhciBleGlzdGluZ1Byb3h5ID0gcHJveGllcy5nZXQoTmV4dENvbXBvbmVudCk7XG4gICAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICAgIHVwZGF0ZShleGlzdGluZ1Byb3h5W1VOV1JBUF9QUk9YWV0oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXNGdW5jdGlvbmFsQ29tcG9uZW50ID0gIWlzUmVhY3RDbGFzcyhOZXh0Q29tcG9uZW50KTtcbiAgICBwcm94eUdlbmVyYXRpb24rKztcblxuICAgIC8vIFNhdmUgdGhlIG5leHQgY29uc3RydWN0b3Igc28gd2UgY2FsbCBpdFxuICAgIHZhciBQcmV2aW91c0NvbXBvbmVudCA9IEN1cnJlbnRDb21wb25lbnQ7XG4gICAgQ3VycmVudENvbXBvbmVudCA9IE5leHRDb21wb25lbnQ7XG5cbiAgICAvLyBUcnkgdG8gaW5mZXIgZGlzcGxheU5hbWVcbiAgICB2YXIgZGlzcGxheU5hbWUgPSBnZXREaXNwbGF5TmFtZShDdXJyZW50Q29tcG9uZW50KTtcblxuICAgIHNhZmVEZWZpbmVQcm9wZXJ0eShQcm94eUZhY2FkZSwgJ2Rpc3BsYXlOYW1lJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBkaXNwbGF5TmFtZVxuICAgIH0pO1xuXG4gICAgaWYgKFByb3h5Q29tcG9uZW50KSB7XG4gICAgICBzYWZlRGVmaW5lUHJvcGVydHkoUHJveHlDb21wb25lbnQsICduYW1lJywge1xuICAgICAgICB2YWx1ZTogZGlzcGxheU5hbWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNhdmVkRGVzY3JpcHRvcnMgPSB0cmFuc2ZlclN0YXRpY1Byb3BzKFByb3h5RmFjYWRlLCBzYXZlZERlc2NyaXB0b3JzLCBQcmV2aW91c0NvbXBvbmVudCwgTmV4dENvbXBvbmVudCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbmFsQ29tcG9uZW50IHx8ICFQcm94eUNvbXBvbmVudCkge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVja0xpZmVDeWNsZU1ldGhvZHMoUHJveHlDb21wb25lbnQsIE5leHRDb21wb25lbnQpO1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKFByb3h5Q29tcG9uZW50LnByb3RvdHlwZSwgTmV4dENvbXBvbmVudC5wcm90b3R5cGUpO1xuICAgICAgZGVmaW5lUHJveHlNZXRob2RzKFByb3h5Q29tcG9uZW50LCBOZXh0Q29tcG9uZW50LnByb3RvdHlwZSk7XG4gICAgICBpZiAocHJveHlHZW5lcmF0aW9uID4gMSkge1xuICAgICAgICBpbmplY3RlZE1lbWJlcnMgPSBtZXJnZUNvbXBvbmVudHMoUHJveHlDb21wb25lbnQsIE5leHRDb21wb25lbnQsIEluaXRpYWxDb21wb25lbnQsIGxhc3RJbnN0YW5jZSwgaW5qZWN0ZWRNZW1iZXJzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUoSW5pdGlhbENvbXBvbmVudCk7XG5cbiAgdmFyIHByb3h5ID0geyBnZXQ6IGdldCwgdXBkYXRlOiB1cGRhdGUgfTtcbiAgcHJveGllcy5zZXQoUHJveHlGYWNhZGUsIHByb3h5KTtcblxuICBzYWZlRGVmaW5lUHJvcGVydHkocHJveHksIFVOV1JBUF9QUk9YWSwge1xuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiBnZXRDdXJyZW50XG4gIH0pO1xuXG4gIHJldHVybiBwcm94eTtcbn1cblxudmFyIHByb3hpZXNCeUlEID0gdm9pZCAwO1xudmFyIGlkc0J5VHlwZSA9IHZvaWQgMDtcblxudmFyIGVsZW1lbnRDb3VudCA9IDA7XG52YXIgcmVuZGVyT3B0aW9ucyA9IHt9O1xuXG52YXIgZ2VuZXJhdGVUeXBlSWQgPSBmdW5jdGlvbiBnZW5lcmF0ZVR5cGVJZCgpIHtcbiAgcmV0dXJuICdhdXRvLScgKyBlbGVtZW50Q291bnQrKztcbn07XG5cbnZhciBnZXRJZEJ5VHlwZSA9IGZ1bmN0aW9uIGdldElkQnlUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGlkc0J5VHlwZS5nZXQodHlwZSk7XG59O1xuXG52YXIgZ2V0UHJveHlCeUlkID0gZnVuY3Rpb24gZ2V0UHJveHlCeUlkKGlkKSB7XG4gIHJldHVybiBwcm94aWVzQnlJRFtpZF07XG59O1xudmFyIGdldFByb3h5QnlUeXBlID0gZnVuY3Rpb24gZ2V0UHJveHlCeVR5cGUodHlwZSkge1xuICByZXR1cm4gZ2V0UHJveHlCeUlkKGdldElkQnlUeXBlKHR5cGUpKTtcbn07XG5cbnZhciBzZXRTdGFuZEluT3B0aW9ucyA9IGZ1bmN0aW9uIHNldFN0YW5kSW5PcHRpb25zKG9wdGlvbnMpIHtcbiAgcmVuZGVyT3B0aW9ucyA9IG9wdGlvbnM7XG59O1xuXG52YXIgdXBkYXRlUHJveHlCeUlkID0gZnVuY3Rpb24gdXBkYXRlUHJveHlCeUlkKGlkLCB0eXBlKSB7XG4gIC8vIFJlbWVtYmVyIHRoZSBJRC5cbiAgaWRzQnlUeXBlLnNldCh0eXBlLCBpZCk7XG5cbiAgaWYgKCFwcm94aWVzQnlJRFtpZF0pIHtcbiAgICBwcm94aWVzQnlJRFtpZF0gPSBjcmVhdGVDbGFzc1Byb3h5KHR5cGUsIGlkLCByZW5kZXJPcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBwcm94aWVzQnlJRFtpZF0udXBkYXRlKHR5cGUpO1xuICB9XG4gIHJldHVybiBwcm94aWVzQnlJRFtpZF07XG59O1xuXG52YXIgY3JlYXRlUHJveHlGb3JUeXBlID0gZnVuY3Rpb24gY3JlYXRlUHJveHlGb3JUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGdldFByb3h5QnlUeXBlKHR5cGUpIHx8IHVwZGF0ZVByb3h5QnlJZChnZW5lcmF0ZVR5cGVJZCgpLCB0eXBlKTtcbn07XG5cbnZhciByZXNldFByb3hpZXMgPSBmdW5jdGlvbiByZXNldFByb3hpZXMoKSB7XG4gIHByb3hpZXNCeUlEID0ge307XG4gIGlkc0J5VHlwZSA9IG5ldyBXZWFrTWFwKCk7XG59O1xuXG5yZXNldFByb3hpZXMoKTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cblxuZnVuY3Rpb24gcmVzb2x2ZVR5cGUodHlwZSkge1xuICBpZiAoIWlzQ29tcG9zaXRlQ29tcG9uZW50KHR5cGUpKSByZXR1cm4gdHlwZTtcblxuICB2YXIgcHJveHkgPSByZWFjdEhvdExvYWRlci5kaXNhYmxlUHJveHlDcmVhdGlvbiA/IGdldFByb3h5QnlUeXBlKHR5cGUpIDogY3JlYXRlUHJveHlGb3JUeXBlKHR5cGUpO1xuXG4gIHJldHVybiBwcm94eSA/IHByb3h5LmdldCgpIDogdHlwZTtcbn1cblxudmFyIHJlYWN0SG90TG9hZGVyID0ge1xuICByZWdpc3RlcjogZnVuY3Rpb24gcmVnaXN0ZXIodHlwZSwgdW5pcXVlTG9jYWxOYW1lLCBmaWxlTmFtZSkge1xuICAgIGlmIChpc0NvbXBvc2l0ZUNvbXBvbmVudCh0eXBlKSAmJiB0eXBlb2YgdW5pcXVlTG9jYWxOYW1lID09PSAnc3RyaW5nJyAmJiB1bmlxdWVMb2NhbE5hbWUgJiYgdHlwZW9mIGZpbGVOYW1lID09PSAnc3RyaW5nJyAmJiBmaWxlTmFtZSkge1xuICAgICAgdmFyIGlkID0gZmlsZU5hbWUgKyAnIycgKyB1bmlxdWVMb2NhbE5hbWU7XG5cbiAgICAgIGlmIChnZXRQcm94eUJ5SWQoaWQpKSB7XG4gICAgICAgIC8vIGNvbXBvbmVudCBnb3QgcmVwbGFjZWQuIE5lZWQgdG8gcmVjb25zaWxlXG4gICAgICAgIGluY3JlbWVudCgpO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVQcm94eUJ5SWQoaWQsIHR5cGUpO1xuICAgIH1cbiAgfSxcbiAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIHJlc2V0UHJveGllcygpO1xuICB9LFxuICBwYXRjaDogZnVuY3Rpb24gcGF0Y2goUmVhY3QkJDEpIHtcbiAgICBpZiAoIVJlYWN0JCQxLmNyZWF0ZUVsZW1lbnQuaXNQYXRjaGVkQnlSZWFjdEhvdExvYWRlcikge1xuICAgICAgdmFyIG9yaWdpbmFsQ3JlYXRlRWxlbWVudCA9IFJlYWN0JCQxLmNyZWF0ZUVsZW1lbnQ7XG4gICAgICAvLyBUcmljayBSZWFjdCBpbnRvIHJlbmRlcmluZyBhIHByb3h5IHNvIHRoYXRcbiAgICAgIC8vIGl0cyBzdGF0ZSBpcyBwcmVzZXJ2ZWQgd2hlbiB0aGUgY2xhc3MgY2hhbmdlcy5cbiAgICAgIC8vIFRoaXMgd2lsbCB1cGRhdGUgdGhlIHByb3h5IGlmIGl0J3MgZm9yIGEga25vd24gdHlwZS5cbiAgICAgIFJlYWN0JCQxLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcmlnaW5hbENyZWF0ZUVsZW1lbnQuYXBwbHkodW5kZWZpbmVkLCBbcmVzb2x2ZVR5cGUodHlwZSldLmNvbmNhdChhcmdzKSk7XG4gICAgICB9O1xuICAgICAgUmVhY3QkJDEuY3JlYXRlRWxlbWVudC5pc1BhdGNoZWRCeVJlYWN0SG90TG9hZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIVJlYWN0JCQxLmNyZWF0ZUZhY3RvcnkuaXNQYXRjaGVkQnlSZWFjdEhvdExvYWRlcikge1xuICAgICAgLy8gUGF0Y2ggUmVhY3QuY3JlYXRlRmFjdG9yeSB0byB1c2UgcGF0Y2hlZCBjcmVhdGVFbGVtZW50XG4gICAgICAvLyBiZWNhdXNlIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbiB1c2VzIHRoZSBpbnRlcm5hbCxcbiAgICAgIC8vIHVucGF0Y2hlZCBSZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudFxuICAgICAgUmVhY3QkJDEuY3JlYXRlRmFjdG9yeSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHZhciBmYWN0b3J5ID0gUmVhY3QkJDEuY3JlYXRlRWxlbWVudC5iaW5kKG51bGwsIHR5cGUpO1xuICAgICAgICBmYWN0b3J5LnR5cGUgPSB0eXBlO1xuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICAgIH07XG4gICAgICBSZWFjdCQkMS5jcmVhdGVGYWN0b3J5LmlzUGF0Y2hlZEJ5UmVhY3RIb3RMb2FkZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghUmVhY3QkJDEuQ2hpbGRyZW4ub25seS5pc1BhdGNoZWRCeVJlYWN0SG90TG9hZGVyKSB7XG4gICAgICB2YXIgb3JpZ2luYWxDaGlsZHJlbk9ubHkgPSBSZWFjdCQkMS5DaGlsZHJlbi5vbmx5O1xuICAgICAgLy8gVXNlIHRoZSBzYW1lIHRyaWNrIGFzIFJlYWN0LmNyZWF0ZUVsZW1lbnRcbiAgICAgIFJlYWN0JCQxLkNoaWxkcmVuLm9ubHkgPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsQ2hpbGRyZW5Pbmx5KF9leHRlbmRzKHt9LCBjaGlsZHJlbiwgeyB0eXBlOiByZXNvbHZlVHlwZShjaGlsZHJlbi50eXBlKSB9KSk7XG4gICAgICB9O1xuICAgICAgUmVhY3QkJDEuQ2hpbGRyZW4ub25seS5pc1BhdGNoZWRCeVJlYWN0SG90TG9hZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZWFjdEhvdExvYWRlci5yZXNldCgpO1xuICB9LFxuXG5cbiAgZGlzYWJsZVByb3h5Q3JlYXRpb246IGZhbHNlXG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuXG5mdW5jdGlvbiBwdXNoU3RhY2soc3RhY2ssIG5vZGUpIHtcbiAgc3RhY2sudHlwZSA9IG5vZGUudHlwZTtcbiAgc3RhY2suY2hpbGRyZW4gPSBbXTtcbiAgc3RhY2suaW5zdGFuY2UgPSB0eXBlb2Ygbm9kZS50eXBlID09PSAnZnVuY3Rpb24nID8gbm9kZS5zdGF0ZU5vZGUgOiBzdGFjaztcbn1cblxuZnVuY3Rpb24gaHlkcmF0ZUZpYmVyU3RhY2sobm9kZSwgc3RhY2spIHtcbiAgcHVzaFN0YWNrKHN0YWNrLCBub2RlKTtcbiAgaWYgKG5vZGUuY2hpbGQpIHtcbiAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkO1xuXG4gICAgZG8ge1xuICAgICAgdmFyIGNoaWxkU3RhY2sgPSB7fTtcbiAgICAgIGh5ZHJhdGVGaWJlclN0YWNrKGNoaWxkLCBjaGlsZFN0YWNrKTtcbiAgICAgIHN0YWNrLmNoaWxkcmVuLnB1c2goY2hpbGRTdGFjayk7XG4gICAgICBjaGlsZCA9IGNoaWxkLnNpYmxpbmc7XG4gICAgfSB3aGlsZSAoY2hpbGQpO1xuICB9XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG5cbmZ1bmN0aW9uIHB1c2hTdGF0ZShzdGFjaywgdHlwZSwgaW5zdGFuY2UpIHtcbiAgc3RhY2sudHlwZSA9IHR5cGU7XG4gIHN0YWNrLmNoaWxkcmVuID0gW107XG4gIHN0YWNrLmluc3RhbmNlID0gaW5zdGFuY2UgfHwgc3RhY2s7XG59XG5cbmZ1bmN0aW9uIGh5ZHJhdGVMZWdhY3lTdGFjayhub2RlLCBzdGFjaykge1xuICBpZiAobm9kZS5fY3VycmVudEVsZW1lbnQpIHtcbiAgICBwdXNoU3RhdGUoc3RhY2ssIG5vZGUuX2N1cnJlbnRFbGVtZW50LnR5cGUsIG5vZGUuX2luc3RhbmNlIHx8IHN0YWNrKTtcbiAgfVxuXG4gIGlmIChub2RlLl9yZW5kZXJlZENvbXBvbmVudCkge1xuICAgIHZhciBjaGlsZFN0YWNrID0ge307XG4gICAgaHlkcmF0ZUxlZ2FjeVN0YWNrKG5vZGUuX3JlbmRlcmVkQ29tcG9uZW50LCBjaGlsZFN0YWNrKTtcbiAgICBzdGFjay5jaGlsZHJlbi5wdXNoKGNoaWxkU3RhY2spO1xuICB9IGVsc2UgaWYgKG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICBPYmplY3Qua2V5cyhub2RlLl9yZW5kZXJlZENoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjaGlsZFN0YWNrID0ge307XG4gICAgICBoeWRyYXRlTGVnYWN5U3RhY2sobm9kZS5fcmVuZGVyZWRDaGlsZHJlbltrZXldLCBjaGlsZFN0YWNrKTtcbiAgICAgIHN0YWNrLmNoaWxkcmVuLnB1c2goY2hpbGRTdGFjayk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cblxuZnVuY3Rpb24gZ2V0UmVhY3RTdGFjayhpbnN0YW5jZSkge1xuICB2YXIgcm9vdE5vZGUgPSBnZXRJbnRlcm5hbEluc3RhbmNlKGluc3RhbmNlKTtcbiAgdmFyIHN0YWNrID0ge307XG4gIHZhciBpc0ZpYmVyID0gdHlwZW9mIHJvb3ROb2RlLnRhZyA9PT0gJ251bWJlcic7XG4gIGlmIChpc0ZpYmVyKSB7XG4gICAgaHlkcmF0ZUZpYmVyU3RhY2socm9vdE5vZGUsIHN0YWNrKTtcbiAgfSBlbHNlIHtcbiAgICBoeWRyYXRlTGVnYWN5U3RhY2socm9vdE5vZGUsIHN0YWNrKTtcbiAgfVxuICByZXR1cm4gc3RhY2s7XG59XG5cbi8vIHNvbWUgYGVtcHR5YCBuYW1lcywgUmVhY3QgY2FuIGF1dG9zZXQgZGlzcGxheSBuYW1lIHRvLi4uXG52YXIgVU5ERUZJTkVEX05BTUVTID0ge1xuICBVbmtub3duOiB0cnVlLFxuICBDb21wb25lbnQ6IHRydWVcbn07XG5cbnZhciBhcmVOYW1lc0VxdWFsID0gZnVuY3Rpb24gYXJlTmFtZXNFcXVhbChhLCBiKSB7XG4gIHJldHVybiBhID09PSBiIHx8IFVOREVGSU5FRF9OQU1FU1thXSAmJiBVTkRFRklORURfTkFNRVNbYl07XG59O1xudmFyIGlzUmVhY3RDbGFzcyQxID0gZnVuY3Rpb24gaXNSZWFjdENsYXNzKGZuKSB7XG4gIHJldHVybiBmbiAmJiAhIWZuLnJlbmRlcjtcbn07XG52YXIgaXNGdW5jdGlvbmFsID0gZnVuY3Rpb24gaXNGdW5jdGlvbmFsKGZuKSB7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbic7XG59O1xudmFyIGlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KGZuKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGZuKTtcbn07XG52YXIgYXNBcnJheSA9IGZ1bmN0aW9uIGFzQXJyYXkoYSkge1xuICByZXR1cm4gaXNBcnJheShhKSA/IGEgOiBbYV07XG59O1xudmFyIGdldFR5cGVPZiA9IGZ1bmN0aW9uIGdldFR5cGVPZih0eXBlKSB7XG4gIGlmIChpc1JlYWN0Q2xhc3MkMSh0eXBlKSkgcmV0dXJuICdSZWFjdENvbXBvbmVudCc7XG4gIGlmIChpc0Z1bmN0aW9uYWwodHlwZSkpIHJldHVybiAnU3RhdGVsZXNzRnVuY3Rpb25hbCc7XG4gIHJldHVybiAnRnJhZ21lbnQnOyAvLyA/XG59O1xuXG52YXIgZmlsdGVyTnVsbEFycmF5ID0gZnVuY3Rpb24gZmlsdGVyTnVsbEFycmF5KGEpIHtcbiAgaWYgKCFhKSByZXR1cm4gW107XG4gIHJldHVybiBhLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAhIXg7XG4gIH0pO1xufTtcblxudmFyIHVuZmxhdHRlbiA9IGZ1bmN0aW9uIHVuZmxhdHRlbihhKSB7XG4gIHJldHVybiBhLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICAgIGFjYy5wdXNoLmFwcGx5KGFjYywgdW5mbGF0dGVuKGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjLnB1c2goYSk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH0sIFtdKTtcbn07XG5cbnZhciBnZXRFbGVtZW50VHlwZSA9IGZ1bmN0aW9uIGdldEVsZW1lbnRUeXBlKGNoaWxkKSB7XG4gIHJldHVybiBjaGlsZC50eXBlW1VOV1JBUF9QUk9YWV0gPyBjaGlsZC50eXBlW1VOV1JBUF9QUk9YWV0oKSA6IGNoaWxkLnR5cGU7XG59O1xuXG52YXIgaGF2ZVRleHRTaW1pbGFyaXR5ID0gZnVuY3Rpb24gaGF2ZVRleHRTaW1pbGFyaXR5KGEsIGIpIHtcbiAgcmV0dXJuIChcbiAgICAvLyBlcXVhbCBvciBzbGlnaHQgY2hhbmdlZFxuICAgIGEgPT09IGIgfHwgbGV2ZW5zaHRlaW4uZ2V0KGEsIGIpIDwgYS5sZW5ndGggKiAwLjJcbiAgKTtcbn07XG5cbnZhciBlcXVhbENsYXNzZXMgPSBmdW5jdGlvbiBlcXVhbENsYXNzZXMoYSwgYikge1xuICB2YXIgcHJvdG90eXBlQSA9IGEucHJvdG90eXBlO1xuICB2YXIgcHJvdG90eXBlQiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihiLnByb3RvdHlwZSk7XG5cbiAgdmFyIGhpdHMgPSAwO1xuICB2YXIgbWlzc2VzID0gMDtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG90eXBlQSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBwcm90b3R5cGVBW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChoYXZlVGV4dFNpbWlsYXJpdHkoU3RyaW5nKHByb3RvdHlwZUFba2V5XSksIFN0cmluZyhwcm90b3R5cGVCW2tleV0pKSkge1xuICAgICAgICBoaXRzKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtaXNzZXMrKztcbiAgICAgICAgaWYgKGtleSA9PT0gJ3JlbmRlcicpIHtcbiAgICAgICAgICBtaXNzZXMrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vIGFsbG93IHRvIGFkZCBvciByZW1vdmUgb25lIGZ1bmN0aW9uXG4gIHJldHVybiBoaXRzID4gMCAmJiBtaXNzZXMgPD0gMTtcbn07XG5cbnZhciBpc1N3YXBwYWJsZSA9IGZ1bmN0aW9uIGlzU3dhcHBhYmxlKGEsIGIpIHtcbiAgLy8gYm90aCBhcmUgcmVnaXN0ZXJlZCBjb21wb25lbnRzXG4gIGlmIChnZXRJZEJ5VHlwZShiKSAmJiBnZXRJZEJ5VHlwZShhKSA9PT0gZ2V0SWRCeVR5cGUoYikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoZ2V0VHlwZU9mKGEpICE9PSBnZXRUeXBlT2YoYikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGlzUmVhY3RDbGFzcyQxKGEucHJvdG90eXBlKSkge1xuICAgIHJldHVybiBhcmVOYW1lc0VxdWFsKGdldENvbXBvbmVudERpc3BsYXlOYW1lKGEpLCBnZXRDb21wb25lbnREaXNwbGF5TmFtZShiKSkgJiYgZXF1YWxDbGFzc2VzKGEsIGIpO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uYWwoYSkpIHtcbiAgICByZXR1cm4gYXJlTmFtZXNFcXVhbChnZXRDb21wb25lbnREaXNwbGF5TmFtZShhKSwgZ2V0Q29tcG9uZW50RGlzcGxheU5hbWUoYikpICYmIGhhdmVUZXh0U2ltaWxhcml0eShTdHJpbmcoYSksIFN0cmluZyhiKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmFyIHJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihjb21wb25lbnQpIHtcbiAgaWYgKCFjb21wb25lbnQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKGlzUmVhY3RDbGFzcyQxKGNvbXBvbmVudCkpIHtcbiAgICByZXR1cm4gY29tcG9uZW50LnJlbmRlcigpO1xuICB9XG4gIGlmIChpc0FycmF5KGNvbXBvbmVudCkpIHtcbiAgICByZXR1cm4gY29tcG9uZW50Lm1hcChyZW5kZXIpO1xuICB9XG4gIGlmIChjb21wb25lbnQuY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gY29tcG9uZW50LmNoaWxkcmVuO1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufTtcblxudmFyIE5PX0NISUxEUkVOID0geyBjaGlsZHJlbjogW10gfTtcbnZhciBtYXBDaGlsZHJlbiA9IGZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBpbnN0YW5jZXMpIHtcbiAgcmV0dXJuIHtcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYztcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgICAgaWYgKCh0eXBlb2YgY2hpbGQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGNoaWxkKSkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH1cbiAgICAgIHZhciBpbnN0YW5jZUxpbmUgPSBpbnN0YW5jZXNbaW5kZXhdIHx8IHt9O1xuICAgICAgdmFyIG9sZENoaWxkcmVuID0gYXNBcnJheShpbnN0YW5jZUxpbmUuY2hpbGRyZW4gfHwgW10pO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICB0eXBlOiBudWxsXG4gICAgICAgIH0sIG1hcENoaWxkcmVuKGNoaWxkLCBvbGRDaGlsZHJlbikpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Q2hpbGRyZW4gPSBhc0FycmF5KGNoaWxkLnByb3BzICYmIGNoaWxkLnByb3BzLmNoaWxkcmVuIHx8IGNoaWxkLmNoaWxkcmVuIHx8IFtdKTtcbiAgICAgIHZhciBuZXh0Q2hpbGRyZW4gPSBvbGRDaGlsZHJlbi5sZW5ndGggJiYgbWFwQ2hpbGRyZW4obmV3Q2hpbGRyZW4sIG9sZENoaWxkcmVuKTtcblxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBpbnN0YW5jZUxpbmUsIG5leHRDaGlsZHJlbiB8fCB7fSwge1xuICAgICAgICB0eXBlOiBjaGlsZC50eXBlXG4gICAgICB9KTtcbiAgICB9KVxuICB9O1xufTtcblxudmFyIG1lcmdlSW5qZWN0ID0gZnVuY3Rpb24gbWVyZ2VJbmplY3QoYSwgYiwgaW5zdGFuY2UpIHtcbiAgaWYgKGEgJiYgIUFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICByZXR1cm4gbWVyZ2VJbmplY3QoW2FdLCBiKTtcbiAgfVxuICBpZiAoYiAmJiAhQXJyYXkuaXNBcnJheShiKSkge1xuICAgIHJldHVybiBtZXJnZUluamVjdChhLCBbYl0pO1xuICB9XG5cbiAgaWYgKCFhIHx8ICFiKSB7XG4gICAgcmV0dXJuIE5PX0NISUxEUkVOO1xuICB9XG4gIGlmIChhLmxlbmd0aCA9PT0gYi5sZW5ndGgpIHtcbiAgICByZXR1cm4gbWFwQ2hpbGRyZW4oYSwgYik7XG4gIH1cblxuICAvLyBpbiBzb21lIGNhc2VzIChubyBjb25maWRlbmNlIGhlcmUpIEIgY291bGQgY29udGFpbiBBIGV4Y2VwdCBudWxsIGNoaWxkcmVuXG4gIC8vIGluIHNvbWUgY2FzZXMgLSBjb3VsZCBub3QuXG4gIC8vIHRoaXMgZGVwZW5kcyBvbiBSZWFjdCB2ZXJzaW9uIGFuZCB0aGUgd2F5IHlvdSBidWlsZCBjb21wb25lbnQuXG5cbiAgdmFyIG5vbk51bGxBID0gZmlsdGVyTnVsbEFycmF5KGEpO1xuICBpZiAobm9uTnVsbEEubGVuZ3RoID09PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBtYXBDaGlsZHJlbihub25OdWxsQSwgYik7XG4gIH1cblxuICB2YXIgZmxhdEEgPSB1bmZsYXR0ZW4obm9uTnVsbEEpO1xuICB2YXIgZmxhdEIgPSB1bmZsYXR0ZW4oYik7XG4gIGlmIChmbGF0QS5sZW5ndGggPT09IGZsYXRCLmxlbmd0aCkge1xuICAgIHJldHVybiBtYXBDaGlsZHJlbihmbGF0QSwgZmxhdEIpO1xuICB9XG4gIGlmIChmbGF0Qi5sZW5ndGggPT09IDAgJiYgZmxhdEEubGVuZ3RoID09PSAxICYmIF90eXBlb2YoZmxhdEFbMF0pICE9PSAnb2JqZWN0Jykge1xuICAgIC8vIHRlcm1pbmFsIG5vZGVcbiAgfSBlbHNlIHtcbiAgICBsb2dnZXIud2FybignUmVhY3QtaG90LWxvYWRlcjogdW5hYmxlIHRvIG1lcmdlICcsIGEsICdhbmQgY2hpbGRyZW4gb2YgJywgaW5zdGFuY2UpO1xuICB9XG4gIHJldHVybiBOT19DSElMRFJFTjtcbn07XG5cbnZhciB0cmFuc2Zvcm1GbG93Tm9kZSA9IGZ1bmN0aW9uIHRyYW5zZm9ybUZsb3dOb2RlKGZsb3cpIHtcbiAgcmV0dXJuIGZsb3cucmVkdWNlKGZ1bmN0aW9uIChhY2MsIG5vZGUpIHtcbiAgICBpZiAoaXNGcmFnbWVudE5vZGUobm9kZSkgJiYgbm9kZS5wcm9wcyAmJiBub2RlLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gW10uY29uY2F0KGFjYywgbm9kZS5wcm9wcy5jaGlsZHJlbik7XG4gICAgfVxuICAgIHJldHVybiBbXS5jb25jYXQoYWNjLCBbbm9kZV0pO1xuICB9LCBbXSk7XG59O1xuXG52YXIgc2NoZWR1bGVkVXBkYXRlcyA9IFtdO1xudmFyIHNjaGVkdWxlZFVwZGF0ZSA9IDA7XG5cbnZhciBmbHVzaFNjaGVkdWxlZFVwZGF0ZXMgPSBmdW5jdGlvbiBmbHVzaFNjaGVkdWxlZFVwZGF0ZXMoKSB7XG4gIHZhciBpbnN0YW5jZXMgPSBzY2hlZHVsZWRVcGRhdGVzO1xuICBzY2hlZHVsZWRVcGRhdGVzID0gW107XG4gIHNjaGVkdWxlZFVwZGF0ZSA9IDA7XG4gIGluc3RhbmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZVtQUk9YWV9JU19NT1VOVEVEXSAmJiB1cGRhdGVJbnN0YW5jZShpbnN0YW5jZSk7XG4gIH0pO1xufTtcblxudmFyIHNjaGVkdWxlSW5zdGFuY2VVcGRhdGUgPSBmdW5jdGlvbiBzY2hlZHVsZUluc3RhbmNlVXBkYXRlKGluc3RhbmNlKSB7XG4gIHNjaGVkdWxlZFVwZGF0ZXMucHVzaChpbnN0YW5jZSk7XG4gIGlmICghc2NoZWR1bGVkVXBkYXRlKSB7XG4gICAgc2NoZWR1bGVkVXBkYXRlID0gc2V0VGltZW91dChmbHVzaFNjaGVkdWxlZFVwZGF0ZXMpO1xuICB9XG59O1xuXG52YXIgaG90UmVwbGFjZW1lbnRSZW5kZXIgPSBmdW5jdGlvbiBob3RSZXBsYWNlbWVudFJlbmRlcihpbnN0YW5jZSwgc3RhY2spIHtcbiAgdmFyIGZsb3cgPSB0cmFuc2Zvcm1GbG93Tm9kZShmaWx0ZXJOdWxsQXJyYXkoYXNBcnJheShyZW5kZXIoaW5zdGFuY2UpKSkpO1xuXG4gIHZhciBjaGlsZHJlbiA9IHN0YWNrLmNoaWxkcmVuO1xuXG5cbiAgZmxvdy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaW5kZXgpIHtcbiAgICB2YXIgc3RhY2tDaGlsZCA9IGNoaWxkcmVuW2luZGV4XTtcbiAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQoaW5zdGFuY2UpIHtcbiAgICAgIC8vIGNvcHkgb3ZlciBwcm9wcyBhcyBsb25nIG5ldyBjb21wb25lbnQgbWF5IGJlIGhpZGRlbiBpbnNpZGUgdGhlbVxuICAgICAgLy8gY2hpbGQgZG9lcyBub3QgaGF2ZSBhbGwgcHJvcHMsIGFzIGxvbmcgc29tZSBvZiB0aGVtIGNhbiBiZSBjYWxjdWxhdGVkIG9uIGNvbXBvbmVudE1vdW50LlxuICAgICAgdmFyIG5leHRQcm9wcyA9IF9leHRlbmRzKHt9LCBpbnN0YW5jZS5wcm9wcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gY2hpbGQucHJvcHMpIHtcbiAgICAgICAgaWYgKGNoaWxkLnByb3BzW2tleV0pIHtcbiAgICAgICAgICBuZXh0UHJvcHNba2V5XSA9IGNoaWxkLnByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc1JlYWN0Q2xhc3MkMShpbnN0YW5jZSkgJiYgaW5zdGFuY2UuY29tcG9uZW50V2lsbFVwZGF0ZSkge1xuICAgICAgICAvLyBGb3JjZS1yZWZyZXNoIGNvbXBvbmVudCAoYnlwYXNzIHJlZHV4IHJlbmRlcmVkQ29tcG9uZW50KVxuICAgICAgICBpbnN0YW5jZS5jb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgaW5zdGFuY2Uuc3RhdGUpO1xuICAgICAgfVxuICAgICAgaW5zdGFuY2UucHJvcHMgPSBuZXh0UHJvcHM7XG4gICAgICBob3RSZXBsYWNlbWVudFJlbmRlcihpbnN0YW5jZSwgc3RhY2tDaGlsZCk7XG4gICAgfTtcblxuICAgIC8vIHRleHQgbm9kZVxuICAgIGlmICgodHlwZW9mIGNoaWxkID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihjaGlsZCkpICE9PSAnb2JqZWN0JyB8fCAhc3RhY2tDaGlsZCB8fCAhc3RhY2tDaGlsZC5pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChfdHlwZW9mKGNoaWxkLnR5cGUpICE9PSBfdHlwZW9mKHN0YWNrQ2hpbGQudHlwZSkpIHtcbiAgICAgIC8vIFBvcnRhbHMgY291bGQgZ2VuZXJhdGUgdW5kZWZpbmVkICE9PSBudWxsXG4gICAgICBpZiAoY2hpbGQudHlwZSAmJiBzdGFja0NoaWxkLnR5cGUpIHtcbiAgICAgICAgbG9nZ2VyLndhcm4oJ1JlYWN0LWhvdC1sb2FkZXI6IGdvdCAnLCBjaGlsZC50eXBlLCAnaW5zdGVhZCBvZicsIHN0YWNrQ2hpbGQudHlwZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjaGlsZC50eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBuZXh0KFxuICAgICAgLy8gbW92ZSB0eXBlcyBmcm9tIHJlbmRlciB0byB0aGUgaW5zdGFuY2VzIG9mIGh5ZHJhdGVkIHRyZWVcbiAgICAgIG1lcmdlSW5qZWN0KGFzQXJyYXkoY2hpbGQucHJvcHMgPyBjaGlsZC5wcm9wcy5jaGlsZHJlbiA6IGNoaWxkLmNoaWxkcmVuKSwgc3RhY2tDaGlsZC5pbnN0YW5jZS5jaGlsZHJlbiwgc3RhY2tDaGlsZC5pbnN0YW5jZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1bndyYXAgcHJveHlcbiAgICAgIHZhciBjaGlsZFR5cGUgPSBnZXRFbGVtZW50VHlwZShjaGlsZCk7XG4gICAgICBpZiAoIXN0YWNrQ2hpbGQudHlwZVtQUk9YWV9LRVldKSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgbG9nZ2VyLmVycm9yKCdSZWFjdC1ob3QtbG9hZGVyOiBmYXRhbCBlcnJvciBjYXVzZWQgYnkgJywgc3RhY2tDaGlsZC50eXBlLCAnIC0gbm8gaW5zdHJ1bWVudGF0aW9uIGZvdW5kLiAnLCAnUGxlYXNlIHJlcXVpcmUgcmVhY3QtaG90LWxvYWRlciBiZWZvcmUgUmVhY3QuIE1vcmUgaW4gdHJvdWJsZXNob290aW5nLicpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlYWN0LWhvdC1sb2FkZXI6IHdyb25nIGNvbmZpZ3VyYXRpb24nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IHN0YWNrQ2hpbGQudHlwZSkge1xuICAgICAgICBuZXh0KHN0YWNrQ2hpbGQuaW5zdGFuY2UpO1xuICAgICAgfSBlbHNlIGlmIChpc1N3YXBwYWJsZShjaGlsZFR5cGUsIHN0YWNrQ2hpbGQudHlwZSkpIHtcbiAgICAgICAgLy8gdGhleSBhcmUgYm90aCByZWdpc3RlcmVkLCBvciBoYXZlIGVxdWFsIGNvZGUvZGlzcGxheW5hbWUvc2lnbmF0dXJlXG5cbiAgICAgICAgLy8gdXBkYXRlIHByb3h5IHVzaW5nIGludGVybmFsIFBST1hZX0tFWVxuICAgICAgICB1cGRhdGVQcm94eUJ5SWQoc3RhY2tDaGlsZC50eXBlW1BST1hZX0tFWV0sIGNoaWxkVHlwZSk7XG5cbiAgICAgICAgbmV4dChzdGFja0NoaWxkLmluc3RhbmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci53YXJuKCdSZWFjdC1ob3QtbG9hZGVyOiBhICcgKyBnZXRDb21wb25lbnREaXNwbGF5TmFtZShjaGlsZFR5cGUpICsgJyB3YXMgZm91bmQgd2hlcmUgYSAnICsgZ2V0Q29tcG9uZW50RGlzcGxheU5hbWUoc3RhY2tDaGlsZCkgKyAnIHdhcyBleHBlY3RlZC5cXG4gICAgICAgICAgJyArIGNoaWxkVHlwZSk7XG4gICAgICB9XG5cbiAgICAgIHNjaGVkdWxlSW5zdGFuY2VVcGRhdGUoc3RhY2tDaGlsZC5pbnN0YW5jZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbnZhciBob3RSZXBsYWNlbWVudFJlbmRlciQxID0gKGZ1bmN0aW9uIChpbnN0YW5jZSwgc3RhY2spIHtcbiAgdHJ5IHtcbiAgICAvLyBkaXNhYmxlIHJlY29uY2lsZXIgdG8gcHJldmVudCB1cGNvbWluZyBjb21wb25lbnRzIGZyb20gcHJveHlpbmcuXG4gICAgcmVhY3RIb3RMb2FkZXIuZGlzYWJsZVByb3h5Q3JlYXRpb24gPSB0cnVlO1xuICAgIGhvdFJlcGxhY2VtZW50UmVuZGVyKGluc3RhbmNlLCBzdGFjayk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIud2FybignUmVhY3QtaG90LWxvYWRlcjogcmVjb25jaWxhdGlvbiBmYWlsZWQgZHVlIHRvIGVycm9yJywgZSk7XG4gIH0gZmluYWxseSB7XG4gICAgcmVhY3RIb3RMb2FkZXIuZGlzYWJsZVByb3h5Q3JlYXRpb24gPSBmYWxzZTtcbiAgfVxufSk7XG5cbnZhciByZWNvbmNpbGVIb3RSZXBsYWNlbWVudCA9IGZ1bmN0aW9uIHJlY29uY2lsZUhvdFJlcGxhY2VtZW50KFJlYWN0SW5zdGFuY2UpIHtcbiAgcmV0dXJuIGhvdFJlcGxhY2VtZW50UmVuZGVyJDEoUmVhY3RJbnN0YW5jZSwgZ2V0UmVhY3RTdGFjayhSZWFjdEluc3RhbmNlKSk7XG59O1xuXG52YXIgUkVOREVSRURfR0VORVJBVElPTiA9ICdSRUFDVF9IT1RfTE9BREVSX1JFTkRFUkVEX0dFTkVSQVRJT04nO1xuXG52YXIgcmVuZGVyUmVjb25jaWxlciA9IGZ1bmN0aW9uIHJlbmRlclJlY29uY2lsZXIodGFyZ2V0LCBmb3JjZSkge1xuICAvLyB3ZSBhcmUgbm90IGluc2lkZSBwYXJlbnQgcmVjb25jaWxhdGlvblxuICB2YXIgY3VycmVudEdlbmVyYXRpb24gPSBnZXQoKTtcbiAgdmFyIGNvbXBvbmVudEdlbmVyYXRpb24gPSB0YXJnZXRbUkVOREVSRURfR0VORVJBVElPTl07XG5cbiAgdGFyZ2V0W1JFTkRFUkVEX0dFTkVSQVRJT05dID0gY3VycmVudEdlbmVyYXRpb247XG5cbiAgaWYgKCFyZWFjdEhvdExvYWRlci5kaXNhYmxlUHJveHlDcmVhdGlvbikge1xuICAgIGlmICgoY29tcG9uZW50R2VuZXJhdGlvbiB8fCBmb3JjZSkgJiYgY29tcG9uZW50R2VuZXJhdGlvbiAhPT0gY3VycmVudEdlbmVyYXRpb24pIHtcbiAgICAgIHJlY29uY2lsZUhvdFJlcGxhY2VtZW50KHRhcmdldCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZnVuY3Rpb24gYXN5bmNSZWNvbmNpbGVkUmVuZGVyKHRhcmdldCkge1xuICByZW5kZXJSZWNvbmNpbGVyKHRhcmdldCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBzeW5jUmVjb25jaWxlZFJlbmRlcih0YXJnZXQpIHtcbiAgaWYgKHJlbmRlclJlY29uY2lsZXIodGFyZ2V0LCBmYWxzZSkpIHtcbiAgICBmbHVzaFNjaGVkdWxlZFVwZGF0ZXMoKTtcbiAgfVxufVxuXG52YXIgcHJveHlXcmFwcGVyID0gZnVuY3Rpb24gcHJveHlXcmFwcGVyKGVsZW1lbnQpIHtcbiAgLy8gcG9zdCB3cmFwIG9uIHBvc3QgcmVuZGVyXG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQubWFwKHByb3h5V3JhcHBlcik7XG4gIH1cbiAgaWYgKHR5cGVvZiBlbGVtZW50LnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgcHJveHkgPSBnZXRQcm94eUJ5VHlwZShlbGVtZW50LnR5cGUpO1xuICAgIGlmIChwcm94eSkge1xuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBlbGVtZW50LCB7XG4gICAgICAgIHR5cGU6IHByb3h5LmdldCgpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG5zZXRTdGFuZEluT3B0aW9ucyh7XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IHN5bmNSZWNvbmNpbGVkUmVuZGVyLFxuICBjb21wb25lbnRXaWxsUmVuZGVyOiBhc3luY1JlY29uY2lsZWRSZW5kZXIsXG4gIGNvbXBvbmVudERpZFJlbmRlcjogcHJveHlXcmFwcGVyXG59KTtcblxudmFyIEFwcENvbnRhaW5lciA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gIGluaGVyaXRzKEFwcENvbnRhaW5lciwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gQXBwQ29udGFpbmVyKHByb3BzKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQXBwQ29udGFpbmVyKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX1JlYWN0JENvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgZ2VuZXJhdGlvbjogMFxuICAgIH07XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgQXBwQ29udGFpbmVyLnByb3RvdHlwZS5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5nZW5lcmF0aW9uICE9PSBnZXQoKSkge1xuICAgICAgLy8gSG90IHJlbG9hZCBpcyBoYXBwZW5pbmcuXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgZ2VuZXJhdGlvbjogZ2V0KClcbiAgICAgIH0pO1xuXG4gICAgICAvLyBwZXJmb3JtIHNhbmRib3hlZCByZW5kZXIgdG8gZmluZCBzaW1pbGFyaXRpZXMgYmV0d2VlbiBuZXcgYW5kIG9sZCBjb2RlXG4gICAgICByZW5kZXJSZWNvbmNpbGVyKHRoaXMsIHRydWUpO1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdG8gZmx1c2ggdXBkYXRlIG91dCBvZiByZW5kZXIgY3ljbGVcbiAgICAgIGZsdXNoU2NoZWR1bGVkVXBkYXRlcygpO1xuICAgIH1cbiAgfTtcblxuICBBcHBDb250YWluZXIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uIHNob3VsZENvbXBvbmVudFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgY29tcG9uZW50IGlmIHRoZSBzdGF0ZSBoYWQgYW4gZXJyb3IgYW5kIHN0aWxsIGhhcyBvbmUuXG4gICAgLy8gVGhpcyBhbGxvd3MgdG8gYnJlYWsgYW4gaW5maW5pdGUgbG9vcCBvZiBlcnJvciAtPiByZW5kZXIgLT4gZXJyb3IgLT4gcmVuZGVyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtaG90LWxvYWRlci9pc3N1ZXMvNjk2XG4gICAgaWYgKHByZXZTdGF0ZS5lcnJvciAmJiB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgQXBwQ29udGFpbmVyLnByb3RvdHlwZS5jb21wb25lbnREaWRDYXRjaCA9IGZ1bmN0aW9uIGNvbXBvbmVudERpZENhdGNoKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IGVycm9yIH0pO1xuICB9O1xuXG4gIEFwcENvbnRhaW5lci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBlcnJvciA9IHRoaXMuc3RhdGUuZXJyb3I7XG5cblxuICAgIGlmICh0aGlzLnByb3BzLmVycm9yUmVwb3J0ZXIgJiYgZXJyb3IpIHtcbiAgICAgIHJldHVybiBSZWFjdF9fZGVmYXVsdC5jcmVhdGVFbGVtZW50KHRoaXMucHJvcHMuZXJyb3JSZXBvcnRlciwgeyBlcnJvcjogZXJyb3IgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWN0X19kZWZhdWx0LkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gIH07XG5cbiAgcmV0dXJuIEFwcENvbnRhaW5lcjtcbn0oUmVhY3RfX2RlZmF1bHQuQ29tcG9uZW50KTtcblxuQXBwQ29udGFpbmVyLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IGZ1bmN0aW9uIGNoaWxkcmVuKHByb3BzKSB7XG4gICAgaWYgKFJlYWN0X19kZWZhdWx0LkNoaWxkcmVuLmNvdW50KHByb3BzLmNoaWxkcmVuKSAhPT0gMSkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCBwcm9wIFwiY2hpbGRyZW5cIiBzdXBwbGllZCB0byBBcHBDb250YWluZXIuICcgKyAnRXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCB3aXRoIHlvdXIgYXBw4oCZcyByb290IGNvbXBvbmVudCwgZS5nLiA8QXBwIC8+LicpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgZXJyb3JSZXBvcnRlcjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLm5vZGUsIFByb3BUeXBlcy5mdW5jXSlcbn07XG5cbnZhciBvcGVuZWRNb2R1bGVzID0ge307XG5cbnZhciBob3RNb2R1bGVzID0ge307XG5cbnZhciBjcmVhdGVIb3RNb2R1bGUgPSBmdW5jdGlvbiBjcmVhdGVIb3RNb2R1bGUoKSB7XG4gIHJldHVybiB7IGluc3RhbmNlczogW10sIHVwZGF0ZVRpbWVvdXQ6IDAgfTtcbn07XG5cbnZhciBob3RNb2R1bGUgPSBmdW5jdGlvbiBob3RNb2R1bGUobW9kdWxlSWQpIHtcbiAgaWYgKCFob3RNb2R1bGVzW21vZHVsZUlkXSkge1xuICAgIGhvdE1vZHVsZXNbbW9kdWxlSWRdID0gY3JlYXRlSG90TW9kdWxlKCk7XG4gIH1cbiAgcmV0dXJuIGhvdE1vZHVsZXNbbW9kdWxlSWRdO1xufTtcblxudmFyIGlzT3BlbmVkID0gZnVuY3Rpb24gaXNPcGVuZWQoc291cmNlTW9kdWxlKSB7XG4gIHJldHVybiBzb3VyY2VNb2R1bGUgJiYgISFvcGVuZWRNb2R1bGVzW3NvdXJjZU1vZHVsZS5pZF07XG59O1xuXG52YXIgZW50ZXIgPSBmdW5jdGlvbiBlbnRlcihzb3VyY2VNb2R1bGUpIHtcbiAgaWYgKHNvdXJjZU1vZHVsZSAmJiBzb3VyY2VNb2R1bGUuaWQpIHtcbiAgICBvcGVuZWRNb2R1bGVzW3NvdXJjZU1vZHVsZS5pZF0gPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGxvZ2dlci53YXJuKCdSZWFjdC1ob3QtbG9hZGVyOiBubyBgbW9kdWxlYCB2YXJpYWJsZSBmb3VuZC4gRG8geW91IHNoYWRvdyBzeXN0ZW0gdmFyaWFibGU/Jyk7XG4gIH1cbn07XG5cbnZhciBsZWF2ZSA9IGZ1bmN0aW9uIGxlYXZlKHNvdXJjZU1vZHVsZSkge1xuICBpZiAoc291cmNlTW9kdWxlICYmIHNvdXJjZU1vZHVsZS5pZCkge1xuICAgIGRlbGV0ZSBvcGVuZWRNb2R1bGVzW3NvdXJjZU1vZHVsZS5pZF07XG4gIH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSwgbm8tdW5kZWYgKi9cbnZhciByZXF1aXJlSW5kaXJlY3QgPSB0eXBlb2YgX193ZWJwYWNrX3JlcXVpcmVfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3dlYnBhY2tfcmVxdWlyZV9fIDogcmVxdWlyZTtcbi8qIGVzbGludC1lbmFibGUgKi9cblxudmFyIGNyZWF0ZUhvYyA9IGZ1bmN0aW9uIGNyZWF0ZUhvYyhTb3VyY2VDb21wb25lbnQsIFRhcmdldENvbXBvbmVudCkge1xuICBob2lzdE5vblJlYWN0U3RhdGljKFRhcmdldENvbXBvbmVudCwgU291cmNlQ29tcG9uZW50KTtcbiAgVGFyZ2V0Q29tcG9uZW50LmRpc3BsYXlOYW1lID0gJ0hvdEV4cG9ydGVkJyArIGdldENvbXBvbmVudERpc3BsYXlOYW1lKFNvdXJjZUNvbXBvbmVudCk7XG4gIHJldHVybiBUYXJnZXRDb21wb25lbnQ7XG59O1xuXG52YXIgbWFrZUhvdEV4cG9ydCA9IGZ1bmN0aW9uIG1ha2VIb3RFeHBvcnQoc291cmNlTW9kdWxlKSB7XG4gIHZhciB1cGRhdGVJbnN0YW5jZXMgPSBmdW5jdGlvbiB1cGRhdGVJbnN0YW5jZXMoKSB7XG4gICAgdmFyIG1vZHVsZSA9IGhvdE1vZHVsZShzb3VyY2VNb2R1bGUuaWQpO1xuICAgIGNsZWFyVGltZW91dChtb2R1bGUudXBkYXRlVGltZW91dCk7XG4gICAgbW9kdWxlLnVwZGF0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVpcmVJbmRpcmVjdChzb3VyY2VNb2R1bGUuaWQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBqdXN0IHN3YWxsb3dcbiAgICAgIH1cbiAgICAgIG1vZHVsZS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdCkge1xuICAgICAgICByZXR1cm4gaW5zdC5mb3JjZVVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKHNvdXJjZU1vZHVsZS5ob3QpIHtcbiAgICAvLyBNYXJrIGFzIHNlbGYtYWNjZXB0ZWQgZm9yIFdlYnBhY2tcbiAgICAvLyBVcGRhdGUgaW5zdGFuY2VzIGZvciBQYXJjZWxcbiAgICBzb3VyY2VNb2R1bGUuaG90LmFjY2VwdCh1cGRhdGVJbnN0YW5jZXMpO1xuXG4gICAgLy8gV2VicGFjayB3YXlcbiAgICBpZiAoc291cmNlTW9kdWxlLmhvdC5hZGRTdGF0dXNIYW5kbGVyKSB7XG4gICAgICBpZiAoc291cmNlTW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gJ2lkbGUnKSB7XG4gICAgICAgIHNvdXJjZU1vZHVsZS5ob3QuYWRkU3RhdHVzSGFuZGxlcihmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ2FwcGx5Jykge1xuICAgICAgICAgICAgdXBkYXRlSW5zdGFuY2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBob3QgPSBmdW5jdGlvbiBob3Qoc291cmNlTW9kdWxlKSB7XG4gIGlmICghc291cmNlTW9kdWxlIHx8ICFzb3VyY2VNb2R1bGUuaWQpIHtcbiAgICAvLyB0aGlzIGlzIGZhdGFsXG4gICAgdGhyb3cgbmV3IEVycm9yKCdSZWFjdC1ob3QtbG9hZGVyOiBgaG90YCBjb3VsZCBub3QgZm91bmQgdGhlIGBpZGAgcHJvcGVydHkgaW4gdGhlIGBtb2R1bGVgIHlvdSBoYXZlIHByb3ZpZGVkJyk7XG4gIH1cbiAgdmFyIG1vZHVsZUlkID0gc291cmNlTW9kdWxlLmlkO1xuICB2YXIgbW9kdWxlID0gaG90TW9kdWxlKG1vZHVsZUlkKTtcbiAgbWFrZUhvdEV4cG9ydChzb3VyY2VNb2R1bGUpO1xuXG4gIC8vIFRPRE86IEVuc3VyZSB0aGF0IGFsbCBleHBvcnRzIGZyb20gdGhpcyBmaWxlIGFyZSByZWFjdCBjb21wb25lbnRzLlxuXG4gIHJldHVybiBmdW5jdGlvbiAoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIC8vIHJlZ2lzdGVyIHByb3h5IGZvciB3cmFwcGVkIGNvbXBvbmVudFxuICAgIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKFdyYXBwZWRDb21wb25lbnQsIGdldENvbXBvbmVudERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpLCAnUkhMJyArIG1vZHVsZUlkKTtcblxuICAgIHJldHVybiBjcmVhdGVIb2MoV3JhcHBlZENvbXBvbmVudCwgZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICAgIGluaGVyaXRzKEV4cG9ydGVkQ29tcG9uZW50LCBfQ29tcG9uZW50KTtcblxuICAgICAgZnVuY3Rpb24gRXhwb3J0ZWRDb21wb25lbnQoKSB7XG4gICAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEV4cG9ydGVkQ29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0NvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH1cblxuICAgICAgRXhwb3J0ZWRDb21wb25lbnQucHJvdG90eXBlLmNvbXBvbmVudFdpbGxNb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgbW9kdWxlLmluc3RhbmNlcy5wdXNoKHRoaXMpO1xuICAgICAgfTtcblxuICAgICAgRXhwb3J0ZWRDb21wb25lbnQucHJvdG90eXBlLmNvbXBvbmVudFdpbGxVbm1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIGlmIChpc09wZW5lZChzb3VyY2VNb2R1bGUpKSB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXRDb21wb25lbnREaXNwbGF5TmFtZShXcmFwcGVkQ29tcG9uZW50KTtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ1JlYWN0LWhvdC1sb2FkZXI6IERldGVjdGVkIEFwcENvbnRhaW5lciB1bm1vdW50IG9uIG1vZHVsZSBcXCcnICsgbW9kdWxlSWQgKyAnXFwnIHVwZGF0ZS5cXG4nICsgKCdEaWQgeW91IHVzZSBcImhvdCgnICsgY29tcG9uZW50TmFtZSArICcpXCIgYW5kIFwiUmVhY3RET00ucmVuZGVyKClcIiBpbiB0aGUgc2FtZSBmaWxlP1xcbicpICsgKCdcImhvdCgnICsgY29tcG9uZW50TmFtZSArICcpXCIgc2hhbGwgb25seSBiZSB1c2VkIGFzIGV4cG9ydC5cXG4nKSArICdQbGVhc2UgcmVmZXIgdG8gXCJHZXR0aW5nIFN0YXJ0ZWRcIiAoaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtaG90LWxvYWRlci8pLicpO1xuICAgICAgICB9XG4gICAgICAgIG1vZHVsZS5pbnN0YW5jZXMgPSBtb2R1bGUuaW5zdGFuY2VzLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiBhICE9PSBfdGhpczI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgRXhwb3J0ZWRDb21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0X19kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgQXBwQ29udGFpbmVyLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChXcmFwcGVkQ29tcG9uZW50LCB0aGlzLnByb3BzKVxuICAgICAgICApO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEV4cG9ydGVkQ29tcG9uZW50O1xuICAgIH0oUmVhY3QuQ29tcG9uZW50KSk7XG4gIH07XG59O1xuXG52YXIgZ2V0UHJveHlPclR5cGUgPSBmdW5jdGlvbiBnZXRQcm94eU9yVHlwZSh0eXBlKSB7XG4gIHZhciBwcm94eSA9IGdldFByb3h5QnlUeXBlKHR5cGUpO1xuICByZXR1cm4gcHJveHkgPyBwcm94eS5nZXQoKSA6IHR5cGU7XG59O1xuXG52YXIgYXJlQ29tcG9uZW50c0VxdWFsID0gZnVuY3Rpb24gYXJlQ29tcG9uZW50c0VxdWFsKGEsIGIpIHtcbiAgcmV0dXJuIGdldFByb3h5T3JUeXBlKGEpID09PSBnZXRQcm94eU9yVHlwZShiKTtcbn07XG5cbnZhciBzZXRDb25maWcgPSBmdW5jdGlvbiBzZXRDb25maWcoY29uZmlnKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGNvbmZpZ3VyYXRpb24sIGNvbmZpZyk7XG59O1xuXG5yZWFjdEhvdExvYWRlci5wYXRjaChSZWFjdF9fZGVmYXVsdCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHJlYWN0SG90TG9hZGVyO1xuZXhwb3J0cy5BcHBDb250YWluZXIgPSBBcHBDb250YWluZXI7XG5leHBvcnRzLmhvdCA9IGhvdDtcbmV4cG9ydHMuZW50ZXJNb2R1bGUgPSBlbnRlcjtcbmV4cG9ydHMubGVhdmVNb2R1bGUgPSBsZWF2ZTtcbmV4cG9ydHMuYXJlQ29tcG9uZW50c0VxdWFsID0gYXJlQ29tcG9uZW50c0VxdWFsO1xuZXhwb3J0cy5zZXRDb25maWcgPSBzZXRDb25maWc7XG4iLCIndXNlIHN0cmljdCdcblxuaWYgKCFtb2R1bGUuaG90IHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvcmVhY3QtaG90LWxvYWRlci5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvcmVhY3QtaG90LWxvYWRlci5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLmhvaXN0Tm9uUmVhY3RTdGF0aWNzID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgdmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgICAgIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICAgICAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICAgICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICAgICAgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzOiB0cnVlLFxuICAgICAgICBtaXhpbnM6IHRydWUsXG4gICAgICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICAgICAgdHlwZTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgdmFyIEtOT1dOX1NUQVRJQ1MgPSB7XG4gICAgICAgIG5hbWU6IHRydWUsXG4gICAgICAgIGxlbmd0aDogdHJ1ZSxcbiAgICAgICAgcHJvdG90eXBlOiB0cnVlLFxuICAgICAgICBjYWxsZXI6IHRydWUsXG4gICAgICAgIGNhbGxlZTogdHJ1ZSxcbiAgICAgICAgYXJndW1lbnRzOiB0cnVlLFxuICAgICAgICBhcml0eTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgdmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gICAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgdmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICAgIHZhciBvYmplY3RQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZiAmJiBnZXRQcm90b3R5cGVPZihPYmplY3QpO1xuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykgeyAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluaGVyaXRlZENvbXBvbmVudCA9IGdldFByb3RvdHlwZU9mKHNvdXJjZUNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGluaGVyaXRlZENvbXBvbmVudCAmJiBpbmhlcml0ZWRDb21wb25lbnQgIT09IG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIGluaGVyaXRlZENvbXBvbmVudCwgYmxhY2tsaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgICAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAoIWJsYWNrbGlzdCB8fCAhYmxhY2tsaXN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZUNvbXBvbmVudCwga2V5KTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgLy8gQXZvaWQgZmFpbHVyZXMgZnJvbSByZWFkLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbiAgICB9O1xufSkpKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9yZWFjdC1ob3QtbG9hZGVyLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9yZWFjdC1ob3QtbG9hZGVyLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYWxsb3dFcXVhbChvYmpBLCBvYmpCLCBjb21wYXJlLCBjb21wYXJlQ29udGV4dCkge1xuXG4gICAgdmFyIHJldCA9IGNvbXBhcmUgPyBjb21wYXJlLmNhbGwoY29tcGFyZUNvbnRleHQsIG9iakEsIG9iakIpIDogdm9pZCAwO1xuXG4gICAgaWYocmV0ICE9PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuICEhcmV0O1xuICAgIH1cblxuICAgIGlmKG9iakEgPT09IG9iakIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYodHlwZW9mIG9iakEgIT09ICdvYmplY3QnIHx8ICFvYmpBIHx8XG4gICAgICAgdHlwZW9mIG9iakIgIT09ICdvYmplY3QnIHx8ICFvYmpCKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIga2V5c0EgPSBPYmplY3Qua2V5cyhvYmpBKTtcbiAgICB2YXIga2V5c0IgPSBPYmplY3Qua2V5cyhvYmpCKTtcblxuICAgIGlmKGtleXNBLmxlbmd0aCAhPT0ga2V5c0IubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYkhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5iaW5kKG9iakIpO1xuXG4gICAgLy8gVGVzdCBmb3IgQSdzIGtleXMgZGlmZmVyZW50IGZyb20gQi5cbiAgICBmb3IodmFyIGlkeCA9IDA7IGlkeCA8IGtleXNBLmxlbmd0aDsgaWR4KyspIHtcblxuICAgICAgICB2YXIga2V5ID0ga2V5c0FbaWR4XTtcblxuICAgICAgICBpZighYkhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZUEgPSBvYmpBW2tleV07XG4gICAgICAgIHZhciB2YWx1ZUIgPSBvYmpCW2tleV07XG5cbiAgICAgICAgcmV0ID0gY29tcGFyZSA/IGNvbXBhcmUuY2FsbChjb21wYXJlQ29udGV4dCwgdmFsdWVBLCB2YWx1ZUIsIGtleSkgOiB2b2lkIDA7XG5cbiAgICAgICAgaWYocmV0ID09PSBmYWxzZSB8fFxuICAgICAgICAgICByZXQgPT09IHZvaWQgMCAmJiB2YWx1ZUEgIT09IHZhbHVlQikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpO1xyXG59O1xyXG4iLCIvKiBnbG9iYWxzIF9fd2VicGFja19hbWRfb3B0aW9uc19fICovXHJcbm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX2FtZF9vcHRpb25zX187XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYgKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHtcclxuICAgICAgICAgICAgY2xzTmFtZSxcclxuICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgIGRlZmF1bHRNYXJrZXIsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgICAgICBzbGlkZXJTaXplLFxyXG4gICAgICAgICAgICBtYXJrZXJTaXplLFxyXG4gICAgICAgICAgICBtYXJrZXJOdW1iZXJcclxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBtYXJrZXJDZW50ZXJpbmcgPSAoc2xpZGVyU2l6ZSAtIG1hcmtlclNpemUpICogMC41O1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm1hcmtlciBwb3NpdGlvbjogXCIgKyB0aGlzLnByb3BzLnBvc2l0aW9uKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm1hcmtlciBzbGlkZXJTaXplOiBcIiArIHNsaWRlclNpemUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwibWFya2VyIG1hcmtlclNpemU6IFwiICsgbWFya2VyU2l6ZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJtYXJrZXJDZW50ZXJpbmc6IFwiICsgbWFya2VyQ2VudGVyaW5nKTtcclxuICAgICAgICBjb25zdCBtYXJrZXJXcmFwcGVyU3R5bGVzID0ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgbGVmdDogYCR7cG9zaXRpb259JWAsXHJcbiAgICAgICAgICAgIHRvcDogJzBweCcsXHJcbiAgICAgICAgICAgIGJvdHRvbTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBtYXJnaW5Ub3A6IGAke21hcmtlckNlbnRlcmluZ31weGAsXHJcbiAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGAtJHttYXJrZXJTaXplICogMC41fXB4YCxcclxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHBvc2l0aW9uID09PSAwID8gJ25vbmUnIDogJ2Jsb2NrJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5jdXN0b21NYXJrZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdE1hcmtlclN0eWxlcyA9IHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogYCR7bWFya2VyU2l6ZX1weGAsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogYCR7bWFya2VyU2l6ZX1weGBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGVmYXVsdE1hcmtlciA9IDxkaXYgc3R5bGU9e2RlZmF1bHRNYXJrZXJTdHlsZXN9IC8+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7Y2xzTmFtZX0tJHttYXJrZXJOdW1iZXJ9LW1hcmtlcmB9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17bWFya2VyV3JhcHBlclN0eWxlc31cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY3VzdG9tTWFya2VyfVxyXG4gICAgICAgICAgICAgICAge2RlZmF1bHRNYXJrZXIgJiYgZGVmYXVsdE1hcmtlcn1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuTWFya2VyLnByb3BUeXBlcyA9IHtcclxuICAgIGNsc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGN1c3RvbU1hcmtlcjogUHJvcFR5cGVzLm5vZGUsXHJcbiAgICBvZmZzZXRMZWZ0OiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgb2Zmc2V0VG9wOiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgcG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBzbGlkZXJTaXplOiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgbWFya2VyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIG1hcmtlck51bWJlcjogUHJvcFR5cGVzLm51bWJlclxyXG59O1xyXG5cclxuTWFya2VyLmRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGNsc05hbWU6ICdkeW5hbWljLXNsaWRlcicsXHJcbiAgICBwb3NpdGlvbjogMCxcclxufTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuXHJcbmltcG9ydCBUaHVtYiBmcm9tICcuL1RodW1iJztcclxuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xyXG5pbXBvcnQgTWFya2VyIGZyb20gJy4vTWFya2VyJztcclxuXHJcbmZ1bmN0aW9uIG5vb3AoKSB7fVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIG1hcmtlckNvdW50OiAwLFxyXG4gICAgICAgICAgICBkcmFnOiBmYWxzZSxcclxuICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uOiAwLFxyXG4gICAgICAgICAgICBwZXJjZW50OiAwLFxyXG4gICAgICAgICAgICBtYWluVGh1bWJWYWx1ZXM6IDAsXHJcbiAgICAgICAgICAgIHJhdGlvOiAyMCxcclxuICAgICAgICAgICAgbWFya2VyUG9zaXRpb25zOiBbXSxcclxuICAgICAgICAgICAgbWFya2VyUGVyY2VudHM6IFtdLFxyXG4gICAgICAgICAgICBtYXJrZXJWYWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBtYXJrZXJSYXRpb3M6IFtdLFxyXG4gICAgICAgICAgICBzdGVwOiAxLFxyXG4gICAgICAgICAgICBkeW5hbWljOiB0cnVlLFxyXG4gIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25JbnRlcmFjdGlvblN0YXJ0ID0gdGhpcy5vbkludGVyYWN0aW9uU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uTW91c2VPclRvdWNoTW92ZSA9IHRoaXMub25Nb3VzZU9yVG91Y2hNb3ZlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbkludGVyYWN0aW9uRW5kID0gdGhpcy5vbkludGVyYWN0aW9uRW5kLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb3BzVG9TdGF0ZSh0aGlzLnByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgICAgIHRoaXMucHJvcHNUb1N0YXRlKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25JbnRlcmFjdGlvblN0YXJ0KGUpIHtcclxuICAgICAgICBjb25zdCBldmVudFR5cGUgPSAoZS50b3VjaGVzICE9PSB1bmRlZmluZWQgPyAndG91Y2gnIDogJ21vdXNlJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnRUeXBlKTtcclxuICAgICAgICBjb25zdCBsZWZ0TW91c2VCdXR0b24gPSAwO1xyXG4gICAgICAgIGlmICgoZXZlbnRUeXBlID09PSAnbW91c2UnKSAmJiAoZS5idXR0b24gIT09IGxlZnRNb3VzZUJ1dHRvbikpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVTbGlkZXJWYWx1ZShlLCBldmVudFR5cGUpO1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5keW5hbWljKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkcmFnOiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZEV2ZW50cyhldmVudFR5cGUpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkludGVyYWN0aW9uRW5kKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBkcmFnOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlQ29tcGxldGUodGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3JUb3VjaE1vdmUoZSkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IChlLnRvdWNoZXMgIT09IHVuZGVmaW5lZCA/ICd0b3VjaCcgOiAnbW91c2UnKTtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZHJhZykge3JldHVybjt9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2xpZGVyVmFsdWUoZSwgZXZlbnRUeXBlKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNsaWRlckluZm8oKSB7XHJcbiAgICAgICAgY29uc3Qgc2wgPSB0aGlzLnJlZnMuc2xpZGVyO1xyXG4gICAgICAgIGNvbnN0IHNsaWRlckluZm8gPSB7XHJcbiAgICAgICAgICAgIGJvdW5kczogc2wuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICAgICAgICAgIGxlbmd0aDogc2wuY2xpZW50V2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogc2wuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNsaWRlckluZm87XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRXZlbnRzKHR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbW91c2UnOiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VPclRvdWNoTW92ZSk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkludGVyYWN0aW9uRW5kKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNoJzoge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vbk1vdXNlT3JUb3VjaE1vdmUpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uSW50ZXJhY3Rpb25FbmQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDogLy9ub3RoaW5nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUV2ZW50cygpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VPclRvdWNoTW92ZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25JbnRlcmFjdGlvbkVuZCk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vbk1vdXNlT3JUb3VjaE1vdmUpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vbkludGVyYWN0aW9uRW5kKTsgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVyVmFsdWUoZSwgZXZlbnRUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgeyBtYXhWYWx1ZSwgbWluVmFsdWUsIGR5bmFtaWMgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgbGV0IHsgbWFpblRodW1iVmFsdWUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgbGV0IHhDb29yZHM7XHJcblxyXG4gICAgICAgIGlmICghZHluYW1pYykge1xyXG4gICAgICAgICAgICB4Q29vcmRzID0gKGV2ZW50VHlwZSAhPT0gJ3RvdWNoJyA/IGUucGFnZVg6IGUudG91Y2hlc1swXS5wYWdlWCkgLSB3aW5kb3cucGFnZVhPZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gdGhpcy5zdGF0ZS5jdXJyZW50UG9zaXRpb24gKyB0aGlzLmdldFNsaWRlckluZm8oKS5ib3VuZHMubGVmdDtcclxuICAgICAgICAgICAgbGV0IG1heFRodW1iQXJlYSA9IGN1cnJlbnRQb3NpdGlvbiArICh0aGlzLnN0YXRlLnRodW1iU2l6ZSAqIDAuNSk7XHJcbiAgICAgICAgICAgIGxldCBtaW5UaHVtYkFyZWEgPSBjdXJyZW50UG9zaXRpb24gLSAodGhpcy5zdGF0ZS50aHVtYlNpemUgKiAwLjUpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYXhUaHVtYkFyZWE6IFwiICsgbWF4VGh1bWJBcmVhKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtaW5UaHVtYkFyZWE6IFwiICsgbWluVGh1bWJBcmVhKTtcclxuXHJcbiAgICAgICAgICAgIHhDb29yZHMgPSAoKGUucGFnZVggPj0gbWluVGh1bWJBcmVhKSAmJiAoZS5wYWdlWCA8PSBtYXhUaHVtYkFyZWEpID8gZS5wYWdlWCA6IHRoaXMuZ2V0U2xpZGVySW5mbygpLmJvdW5kcy5sZWZ0KSAtIHdpbmRvdy5wYWdlWE9mZnNldDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZS5wYWdlWDogXCIgKyBlLnBhZ2VYKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4Q29vcmRzOiBcIiArIHhDb29yZHMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHhDb29yZHMgPT09ICh0aGlzLmdldFNsaWRlckluZm8oKS5ib3VuZHMubGVmdCAtIHdpbmRvdy5wYWdlWE9mZnNldCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXJrUG9zaXRpb24gPSBlLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmRyYWcpIHt0aGlzLmFkZE1hcmtlcihtYXJrUG9zaXRpb24pO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkcmFnOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbXBhcmUgcG9zaXRpb24gdG8gc2xpZGVyIGxlbmd0aCB0byBnZXQgcGVyY2VudGFnZVxyXG4gICAgICAgIGxldCBsZW5ndGhPckhlaWdodDtcclxuICAgICAgICBsZXQgY3VycmVudFBvc2l0aW9uID0geENvb3JkcyAtIHRoaXMuZ2V0U2xpZGVySW5mbygpLmJvdW5kcy5sZWZ0O1xyXG4gICAgICAgIGxlbmd0aE9ySGVpZ2h0ID0gdGhpcy5nZXRTbGlkZXJJbmZvKCkubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmNsYW1wVmFsdWUoKyhjdXJyZW50UG9zaXRpb24gLyBsZW5ndGhPckhlaWdodCkudG9GaXhlZCgyKSwgMCwgMSk7XHJcbiAgICAgICAgLy8gY29udmVydCBwZXJjZW50IC0+IHZhbHVlIHRoZSBtYXRjaCB2YWx1ZSB0byBub3RjaCBhcyBwZXIgcHJvcHMvc3RhdGUuc3RlcFxyXG4gICAgICAgIGNvbnN0IHJhd1ZhbHVlID0gdGhpcy52YWx1ZUZyb21QZXJjZW50KHBlcmNlbnQpO1xyXG4gICAgICAgIG1haW5UaHVtYlZhbHVlID0gdGhpcy5jYWxjdWxhdGVNYXRjaGluZ05vdGNoKHJhd1ZhbHVlKTtcclxuICAgICAgICAvLyBhdm9pZCByZXBlYXRlZCB1cGRhdGVzIG9mIHRoZSBzYW1lIHZhbHVlXHJcbiAgICAgICAgaWYgKG1haW5UaHVtYlZhbHVlID09PSB0aGlzLnN0YXRlLm1haW5UaHVtYlZhbHVlcykge3JldHVybjt9XHJcbiAgICAgICAgLy8gcGVyY2VudGFnZSBvZiB0aGUgcmFuZ2UgdG8gcmVuZGVyIHRoZSB0cmFjay90aHVtYiB0b1xyXG4gICAgICAgIGxldCByYXRpbyA9IChtYWluVGh1bWJWYWx1ZSAtIG1pblZhbHVlKSAqIDEwMCAvIChtYXhWYWx1ZSAtIG1pblZhbHVlKTtcclxuICAgICAgICAvLyBmb3JjaW5nIHRoZSB0aHVtYiB0byB0aGUgbW9zdCBsZWZ0IG9mIHNsaWRlclxyXG4gICAgICAgIGlmIChyYXRpbyA9PT0gMSkge1xyXG4gICAgICAgICAgICByYXRpbyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBwZXJjZW50LFxyXG4gICAgICAgICAgICBtYWluVGh1bWJWYWx1ZSxcclxuICAgICAgICAgICAgcmF0aW8sXHJcbiAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvblxyXG4gICAgICAgIH0sIHRoaXMuaGFuZGxlQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVBZGRNYXJrZXIoKSB7XHJcbiAgICAgICAgbGV0IHsgbWluLCBtYXggfSA9IHRoaXMubWF4TWluTWFya2VyVmFsdWVzKCk7XHJcbiAgICAgICAgbGV0IHsgbG9ja1RvTWluTWFyaywgbG9ja1RvTWF4TWFyayB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBcclxuICAgICAgICBpZiAobG9ja1RvTWluTWFyayA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVNYWluVGh1bWIobWluKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxvY2tUb01heE1hcmsgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTWFpblRodW1iKG1heCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb3BzLm9uQWRkTWFya2VyKHRoaXMuc3RhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1heE1pbk1hcmtlclZhbHVlcygpe1xyXG4gICAgICAgIGNvbnN0IG1hcmtlclZhbHVlc0FycmF5ID0gdGhpcy5zdGF0ZS5tYXJrZXJWYWx1ZXMsXHJcbiAgICAgICAgICAgIG1hcmtlclBvc2l0aW9uc0FycmF5ID0gdGhpcy5zdGF0ZS5tYXJrZXJQb3NpdGlvbnMsXHJcbiAgICAgICAgICAgIG1hcmtlclJhdGlvc0FycmF5ID0gdGhpcy5zdGF0ZS5tYXJrZXJSYXRpb3MsXHJcbiAgICAgICAgICAgIG1hcmtlclBlcmNlbnRzQXJyYXkgPSB0aGlzLnN0YXRlLm1hcmtlclBlcmNlbnRzO1xyXG5cclxuICAgICAgICBsZXQgbWluVmFsdWVzVmFsID0gTWF0aC5taW4oLi4ubWFya2VyVmFsdWVzQXJyYXkpLFxyXG4gICAgICAgICAgICBtaW5Qb3NpdGlvbnNWYWwgPSBNYXRoLm1pbiguLi5tYXJrZXJQb3NpdGlvbnNBcnJheSksXHJcbiAgICAgICAgICAgIG1pblJhdGlvc1ZhbCA9IE1hdGgubWluKC4uLm1hcmtlclJhdGlvc0FycmF5KSxcclxuICAgICAgICAgICAgbWluUGVyY2VudHNWYWwgPSBNYXRoLm1pbiguLi5tYXJrZXJQZXJjZW50c0FycmF5KSxcclxuICAgICAgICAgICAgbWF4VmFsdWVzVmFsID0gTWF0aC5tYXgoLi4ubWFya2VyVmFsdWVzQXJyYXkpLFxyXG4gICAgICAgICAgICBtYXhQb3NpdGlvbnNWYWwgPSBNYXRoLm1heCguLi5tYXJrZXJQb3NpdGlvbnNBcnJheSksXHJcbiAgICAgICAgICAgIG1heFJhdGlvc1ZhbCA9IE1hdGgubWF4KC4uLm1hcmtlclJhdGlvc0FycmF5KSxcclxuICAgICAgICAgICAgbWF4UGVyY2VudHNWYWwgPSBNYXRoLm1heCguLi5tYXJrZXJQZXJjZW50c0FycmF5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWluIDoge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBtaW5WYWx1ZXNWYWwsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IG1pblBvc2l0aW9uc1ZhbCxcclxuICAgICAgICAgICAgICAgIHJhdGlvczogbWluUmF0aW9zVmFsLFxyXG4gICAgICAgICAgICAgICAgcGVyY2VudHM6IG1pblBlcmNlbnRzVmFsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1heCA6IHtcclxuICAgICAgICAgICAgICAgIHZhbHVlczogbWF4VmFsdWVzVmFsLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiBtYXhQb3NpdGlvbnNWYWwsXHJcbiAgICAgICAgICAgICAgICByYXRpb3M6IG1heFJhdGlvc1ZhbCxcclxuICAgICAgICAgICAgICAgIHBlcmNlbnRzOiBtYXhQZXJjZW50c1ZhbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTWFpblRodW1iKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1haW5UaHVtYlZhbHVlOiB2YWx1ZS52YWx1ZXMsXHJcbiAgICAgICAgICAgIHBlcmNlbnQ6IHZhbHVlLnBlcmNlbnRzLFxyXG4gICAgICAgICAgICByYXRpbyA6IHZhbHVlLnJhdGlvcyxcclxuICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uOiB2YWx1ZS5wb3NpdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFsdWVGcm9tUGVyY2VudChwZXJjZW50YWdlKSB7XHJcbiAgICAgICAgY29uc3QgeyByYW5nZSwgbWluVmFsdWUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgdmFsID0gKHJhbmdlICogcGVyY2VudGFnZSkgKyBtaW5WYWx1ZTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZU1hdGNoaW5nTm90Y2godmFsdWUpIHtcclxuICAgICAgICBjb25zdCB7IHN0ZXAsIG1heFZhbHVlLCBtaW5WYWx1ZSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gbWluVmFsdWU7IGkgPD0gbWF4VmFsdWU7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaChpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdGNoZXMgPSBbXTtcclxuICAgICAgICAvLyBmaW5kIGhvdyBtYW55IGVudHJpZXMgaW4gdmFsdWVzIGFyZSBkaXZpc2libGUgYnkgc3RlcCAoK21pbiwrbWF4KVxyXG4gICAgICAgIGZvciAoY29uc3QgcyBvZiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKHMgPT09IG1pblZhbHVlIHx8IHMgPT09IG1heFZhbHVlIHx8IHMgJSBzdGVwID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBub3RjaGVzLnB1c2gocyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlZHVjZSBvdmVyIHRoZSBwb3RlbnRpYWwgbm90Y2hlcyBhbmQgZmluZCB3aGljaCBpcyB0aGUgY2xvc2VzdFxyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gbm90Y2hlcy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnIgLSB2YWx1ZSkgPCBNYXRoLmFicyhwcmV2IC0gdmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhbXBWYWx1ZSh2YWwsIG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsLCBtYXgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9wc1RvU3RhdGUocHJvcHMpIHtcclxuICAgICAgICBsZXQgeyBcclxuICAgICAgICAgICAgbWFya2VyQ291bnQsXHJcbiAgICAgICAgICAgIG1hcmtlclZhbHVlcyxcclxuICAgICAgICAgICAgbWFya2VyUGVyY2VudHMsXHJcbiAgICAgICAgICAgIG1hcmtlclBvc2l0aW9ucyxcclxuICAgICAgICAgICAgbWFya2VyUmF0aW9zIFxyXG4gICAgICAgIH0gPSBwcm9wcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1hcmtlckNvdW50OiBcIiArIG1hcmtlckNvdW50KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKG1hcmtlclZhbHVlcyk7XHJcbiAgICAgICAgLy8gcHV0IHRoZSBoYW5kbENvdW50IGZpcnN0XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUubWFya2VyQ291bnQgIT09IG1hcmtlckNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgbWFya2VyQ291bnQ6IG1hcmtlckNvdW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBtYXJrZXJWYWx1ZXMgIT09IHVuZGVmaW5lZCB8fCBtYXJrZXJWYWx1ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya2VyQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hcmtlclZhbHVlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyVmFsdWVzOiBbLi4ucHJldlN0YXRlLm1hcmtlclZhbHVlcywgbWFya2VyVmFsdWVzW2ldXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUmF0aW9zOiBbLi4ucHJldlN0YXRlLm1hcmtlclJhdGlvcywgbWFya2VyUmF0aW9zW2ldXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUGVyY2VudHM6IFsuLi5wcmV2U3RhdGUubWFya2VyUGVyY2VudHMsIG1hcmtlclBlcmNlbnRzW2ldXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUG9zaXRpb25zOiBbLi4ucHJldlN0YXRlLm1hcmtlclBvc2l0aW9ucywgbWFya2VyUG9zaXRpb25zW2ldXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyVmFsdWVzOiBbLi4ucHJldlN0YXRlLm1hcmtlclZhbHVlcywgLi4uWzBdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUmF0aW9zOiBbLi4ucHJldlN0YXRlLm1hcmtlclJhdGlvcywgLi4uWzBdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyUGVyY2VudHM6IFsuLi5wcmV2U3RhdGUubWFya2VyUGVyY2VudHMsIC4uLlswXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlclBvc2l0aW9uczogWy4uLnByZXZTdGF0ZS5tYXJrZXJQb3NpdGlvbnMsIC4uLlswXV1cclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB7IG1hcmtlclNpemUsIHRodW1iU2l6ZSwgc2xpZGVyU2l6ZSB9ID0gcHJvcHM7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRodW1iU2l6ZTogXCIgKyB0aHVtYlNpemUpO1xyXG4gICAgICAgIGlmIChwcm9wcy50aHVtYlNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2xpZGVyU2l6ZTogXCIgKyBzbGlkZXJTaXplKTtcclxuICAgICAgICAgICAgdGh1bWJTaXplID0gKHRoaXMucHJvcHMuZGlzYWJsZVRodW1iID8gMCA6IHNsaWRlclNpemUgKiAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByb3BzLm1hcmtlclNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBtYXJrZXJTaXplID0gc2xpZGVyU2l6ZSAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInRodW1iU2l6ZSBhZnRlcjogXCIgKyB0aHVtYlNpemUpO1xyXG5cclxuICAgICAgICBjb25zdCB7IG1pblZhbHVlLCBtYXhWYWx1ZSwgaWQgfSA9IHByb3BzO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlID0gbWF4VmFsdWUgLSBtaW5WYWx1ZTtcclxuICAgICAgICAvLyBjb25zdCBjaGVja1ZhbCA9IG1hcmtlclZhbHVlc1swXSA9PT0gdW5kZWZpbmVkID8gMCA6IG1hcmtlclZhbHVlc1swXTtcclxuICAgICAgICBjb25zdCByYXRpbyA9IE1hdGgubWF4KCh0aGlzLnN0YXRlLm1haW5UaHVtYlZhbHVlIC0gbWluVmFsdWUpLCAwKSAqIDEwMCAvIChtYXhWYWx1ZSAtIG1pblZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcclxuICAgICAgICAgICAgbWluVmFsdWUsXHJcbiAgICAgICAgICAgIG1heFZhbHVlLFxyXG4gICAgICAgICAgICByYW5nZSxcclxuICAgICAgICAgICAgcmF0aW8sXHJcbiAgICAgICAgICAgIHRodW1iU2l6ZSxcclxuICAgICAgICAgICAgbWFya2VyU2l6ZSxcclxuICAgICAgICAgICAgaWRcclxuICAgICAgICB9KSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBhZGRNYXJrZXIobWFya2VyUG9zaXRpb24pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIiFNQVJLIFNUQVJUIVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFkZE1hcmtlciBtYXJrZXJQb3NpdGlvbjogXCIgKyBtYXJrZXJQb3NpdGlvbik7XHJcblxyXG4gICAgICAgIC8vIGNvbXBhcmUgcG9zaXRpb24gdG8gc2xpZGVyIGxlbmd0aCB0byBnZXQgcGVyY2VudGFnZVxyXG4gICAgICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSBtYXJrZXJQb3NpdGlvbiAtIHRoaXMuZ2V0U2xpZGVySW5mbygpLmJvdW5kcy5sZWZ0LFxyXG4gICAgICAgICAgICBsZW5ndGhPckhlaWdodCAgPSB0aGlzLmdldFNsaWRlckluZm8oKS5sZW5ndGg7XHJcblxyXG4gICAgICAgIGNvbnN0IHBlcmNlbnQgICAgICAgPSB0aGlzLmNsYW1wVmFsdWUoKyhjdXJyZW50UG9zaXRpb24gLyBsZW5ndGhPckhlaWdodCkudG9GaXhlZCgyKSwgMCwgMSk7XHJcbiAgICAgICAgY29uc3QgcmF3VmFsdWUgICAgICA9IHRoaXMudmFsdWVGcm9tUGVyY2VudChwZXJjZW50KTtcclxuICAgICAgICBjb25zdCBtYXJrZXJWYWx1ZSAgID0gdGhpcy5jYWxjdWxhdGVNYXRjaGluZ05vdGNoKHJhd1ZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gcHV0IG1hcmtlciBzdGF0ZSBhcnJheSBpbnRvIGFycmF5IHZhcmlhYmxlXHJcbiAgICAgICAgbGV0IG1hcmtlckFycmF5ICAgICA9IHRoaXMuc3RhdGUubWFya2VyVmFsdWVzO1xyXG5cclxuICAgICAgICAvLyBnZXQgc2xpZGVyJ3MgbWF4IGFuZCBtaW4gdmFsdWVcclxuICAgICAgICBjb25zdCB7IG1heFZhbHVlLCBtaW5WYWx1ZSB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgLy8gYXZvaWQgcmVwZWF0ZWQgdXBkYXRlcyBvZiB0aGUgc2FtZSB2YWx1ZVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgbWFya2VyVmFsdWUgPT09IHRoaXMuc3RhdGUubWFpblRodW1iVmFsdWVzIHx8XHJcbiAgICAgICAgICAgIG1hcmtlclZhbHVlID09PSBtYXJrZXJBcnJheS5pbmNsdWRlcyhtYXJrZXJWYWx1ZSlcclxuICAgICAgICApIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGlmIG1hcmtlciBpcyBtb3JlIHRoYW4gbWFya2VyQ291bnQsIGlmIGl0IGlzIGEgeWVzLCBcclxuICAgICAgICAvLyB1c2UgaW1tdXRhYmxlIHNoaWZ0IGZvciBGSUZPIDogKGFyci5zbGljZSgxKSlcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1hcmtlclZhbHVlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyBwZXJjZW50YWdlIG9mIHRoZSByYW5nZSB0byByZW5kZXIgdGhlIHRyYWNrL3RodW1iIHRvXHJcbiAgICAgICAgY29uc3QgcmF0aW8gPSAobWFya2VyVmFsdWUgLSBtaW5WYWx1ZSkgKiAxMDAgLyAobWF4VmFsdWUgLSBtaW5WYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSgocHJldlN0YXRlLCBwcm9wcykgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXZTdGF0ZS5tYXJrZXJWYWx1ZXMubGVuZ3RoID49IHByZXZTdGF0ZS5tYXJrZXJDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlc0FyciA9IHRoaXMuc3RhdGUubWFya2VyVmFsdWVzLnNsaWNlKDEpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1JhdGlvc0FyciA9IHRoaXMuc3RhdGUubWFya2VyUmF0aW9zLnNsaWNlKDEpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1BlcmNzQXJyICA9IHRoaXMuc3RhdGUubWFya2VyUGVyY2VudHMuc2xpY2UoMSksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zQXJyICAgID0gdGhpcy5zdGF0ZS5tYXJrZXJQb3NpdGlvbnMuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwZXJjZW50LFxyXG4gICAgICAgICAgICAgICAgbWFya2VyVmFsdWVzIDogbmV3VmFsdWVzQXJyID8gWy4uLm5ld1ZhbHVlc0FyciwgbWFya2VyVmFsdWVdIDogWy4uLnByZXZTdGF0ZS5tYXJrZXJWYWx1ZXMsIG1hcmtlclZhbHVlXSxcclxuICAgICAgICAgICAgICAgIG1hcmtlclJhdGlvcyA6IG5ld1JhdGlvc0FyciA/IFsuLi5uZXdSYXRpb3NBcnIsIHJhdGlvXSA6IFsuLi5wcmV2U3RhdGUubWFya2VyUmF0aW9zLCByYXRpb10sXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJQb3NpdGlvbnMgOiBuZXdQb3NBcnIgPyBbLi4ubmV3UG9zQXJyLCBjdXJyZW50UG9zaXRpb25dIDogWy4uLnByZXZTdGF0ZS5tYXJrZXJQb3NpdGlvbnMsIGN1cnJlbnRQb3NpdGlvbl0sXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJQZXJjZW50cyA6IG5ld1BlcmNzQXJyID8gWy4uLm5ld1BlcmNzQXJyLCBwZXJjZW50XSA6IFsuLi5wcmV2U3RhdGUubWFya2VyUGVyY2VudHMsIHBlcmNlbnRdXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0sIHRoaXMuaGFuZGxlQWRkTWFya2VyKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tYXJrZXJWYWx1ZXMpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkTWFya2VyIFJhdGlvOiBcIiArIHJhdGlvKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubWFya2VyVmFsdWVzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1hcmtlclBvc2l0aW9ucyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tYXJrZXJQZXJjZW50cyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tYXJrZXJSYXRpb3MpO1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgY2xzTmFtZSxcclxuICAgICAgICAgICAgdmVydGljYWwsXHJcbiAgICAgICAgICAgIHNsaWRlclNpemUsXHJcbiAgICAgICAgICAgIGRpc2FibGVUaHVtYixcclxuICAgICAgICAgICAgZGlzYWJsZVRyYWNrLFxyXG4gICAgICAgICAgICBjaGlsZHJlbixcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHRyYWNrQ29sb3IsXHJcbiAgICAgICAgICAgIHRodW1iQ29sb3IsXHJcbiAgICAgICAgICAgIHZlcnRpY2FsU2xpZGVySGVpZ2h0LFxyXG4gICAgICAgICAgICBldmVudFdyYXBwZXJQYWRkaW5nXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XHJcbiAgICAgICAgY29uc3QgZXZlbnRXcmFwcGVyU3R5bGUgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0bycsXHJcbiAgICAgICAgICAgIGdldCBwYWRkaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICF2ZXJ0aWNhbCA/IGAke2V2ZW50V3JhcHBlclBhZGRpbmd9cHggMGAgOiBgMCAke2V2ZW50V3JhcHBlclBhZGRpbmd9cHhgO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXQgd2lkdGgoKSB7IHJldHVybiAhdmVydGljYWwgPyAnYXV0bycgOiBgJHtzbGlkZXJTaXplfXB4YDt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBzbGlkZXJTdHlsZSA9IHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLnNsaWRlckNvbG9yLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcclxuICAgICAgICAgICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhdmVydGljYWwgPyBgJHtzbGlkZXJTaXplfXB4YCA6IHZlcnRpY2FsU2xpZGVySGVpZ2h0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXQgd2lkdGgoKSB7IHJldHVybiAhdmVydGljYWwgPyAnMTAwJScgOiBgJHtzbGlkZXJTaXplfXB4YDt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gKCBcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtjbHNOYW1lfS1zbGlkZXJgfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMub25JbnRlcmFjdGlvblN0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm9uSW50ZXJhY3Rpb25TdGFydH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXtldmVudFdyYXBwZXJTdHlsZX1cclxuXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Nsc05hbWV9LWxpbmVgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlZj1cInNsaWRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3NsaWRlclN0eWxlfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxUcmFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj17dHJhY2tDb2xvcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoPXt0aGlzLnN0YXRlLnJhdGlvfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbD17dmVydGljYWx9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8VGh1bWJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9e3RodW1iQ29sb3J9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVRodW1iPXtjaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVRodW1iPXtkaXNhYmxlVGh1bWJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPXt0aGlzLnN0YXRlLnJhdGlvfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXJTaXplPXtzbGlkZXJTaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYlNpemU9e3RoaXMuc3RhdGUudGh1bWJTaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJQb3NpdGlvbnMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJWYWx1ZXMubWFwKChtYXJrZXJWYWx1ZSwgaW5kZXgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWFya2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj0neWVsbG93J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlck51bWJlcj17aW5kZXh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXJTaXplPXt0aGlzLnN0YXRlLm1hcmtlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbj17bWFya2VyVmFsdWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXJTaXplPXtzbGlkZXJTaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8vIERldGVybWluZSB0aGUgcHJvcFR5cGVzIGFuZCBpdHMgZGVmYXVsdCB2YWx1ZShzKVxyXG5cclxuU2xpZGVyLnByb3BUeXBlcyA9IHtcclxuICAgIGNsc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBkeW5hbWljOiBQcm9wVHlwZXMuYm9vbCxcclxuICAgIG1hcmtlckNvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgbWluVmFsdWU6IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBtYXhWYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIC8vIG1hcmtlclZhbHVlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXHJcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBvbkNoYW5nZUNvbXBsZXRlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG9uQWRkTWFya2VyOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgc2xpZGVyQ29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB0cmFja0NvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgdGh1bWJDb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGRpc2FibGVUaHVtYjogUHJvcFR5cGVzLmJvb2wsXHJcbiAgICBtYWluVGh1bWJWYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIGxvY2tUb01pbk1hcms6IFByb3BUeXBlcy5ib29sLFxyXG4gICAgbG9ja1RvTWF4TWFyazogUHJvcFR5cGVzLmJvb2xcclxufTtcclxuXHJcblNsaWRlci5kZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBjbHNOYW1lOiBcImR5bmFtaWMtc2xpZGVyXCIsXHJcbiAgICBtYXJrZXJDb3VudDogMixcclxuICAgIG1pblZhbHVlOiAwLFxyXG4gICAgbWF4VmFsdWU6IDEwMCxcclxuICAgIG1hcmtlclZhbHVlczogW10sXHJcbiAgICBtYXJrZXJSYXRpb3M6IFtdLFxyXG4gICAgbWFya2VyUG9zaXRpb25zOiBbXSxcclxuICAgIG1hcmtlclBlcmNlbnRzOiBbXSxcclxuICAgIG9uQ2hhbmdlOiBub29wLFxyXG4gICAgb25DaGFuZ2VDb21wbGV0ZTogbm9vcCxcclxuICAgIG9uQWRkTWFya2VyOiBub29wLFxyXG4gICAgc2xpZGVyQ29sb3I6ICdibHVlJyxcclxuICAgIHRyYWNrQ29sb3I6ICdncmVlbicsXHJcbiAgICB0aHVtYkNvbG9yOiAncmVkJyxcclxuICAgIGlkOiBudWxsLFxyXG4gICAgZGlzYWJsZVRodW1iOiBmYWxzZSxcclxuICAgIHNsaWRlclNpemU6IDMwLFxyXG4gICAgbWFpblRodW1iVmFsdWU6IDAsXHJcbiAgICBsb2NrVG9NaW5NYXJrIDogdHJ1ZSxcclxuICAgIGxvY2tUb01heE1hcmsgOiBmYWxzZVxyXG59O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGh1bWIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG5cclxuICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICBjbHNOYW1lLFxyXG4gICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgZGVmYXVsdFRodW1iLFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgc2xpZGVyU2l6ZSxcclxuICAgICAgICAgICAgdGh1bWJTaXplXHJcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicG9zaXRpb246IFwiICsgdGhpcy5wcm9wcy5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRodW1iQ2VudGVyaW5nID0gKHNsaWRlclNpemUgLSB0aHVtYlNpemUpICogMC41O1xyXG4gICAgICAgIGNvbnN0IHRodW1iV3JhcHBlclN0eWxlcyA9IHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgIGxlZnQ6IGAke3Bvc2l0aW9ufSVgLFxyXG4gICAgICAgICAgICB0b3A6ICcwcHgnLFxyXG4gICAgICAgICAgICBib3R0b206IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbWFyZ2luVG9wOiBgJHt0aHVtYkNlbnRlcmluZ31weGAsXHJcbiAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGAtJHt0aHVtYlNpemUgKiAwLjV9cHhgLFxyXG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IHVuZGVmaW5lZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmN1c3RvbVRodW1iKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRUaHVtYlN0eWxlcyA9IHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogYCR7dGh1bWJTaXplfXB4YCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBgJHt0aHVtYlNpemV9cHhgXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRlZmF1bHRUaHVtYiA9IDxkaXYgc3R5bGU9e2RlZmF1bHRUaHVtYlN0eWxlc30gLz47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Nsc05hbWV9LXRodW1iYH0gXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17dGh1bWJXcmFwcGVyU3R5bGVzfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jdXN0b21UaHVtYn1cclxuICAgICAgICAgICAgICAgIHtkZWZhdWx0VGh1bWIgJiYgZGVmYXVsdFRodW1ifVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5UaHVtYi5wcm9wVHlwZXMgPSB7XHJcbiAgICBjbHNOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBjdXN0b21UaHVtYjogUHJvcFR5cGVzLm5vZGUsXHJcbiAgICBvZmZzZXRMZWZ0OiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgb2Zmc2V0VG9wOiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgcG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICBzbGlkZXJTaXplOiBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgdGh1bWJTaXplOiBQcm9wVHlwZXMubnVtYmVyLFxyXG59O1xyXG5cclxuVGh1bWIuZGVmYXVsdFByb3BzID0ge1xyXG4gICAgY2xzTmFtZTogJ2R5bmFtaWMtc2xpZGVyJyxcclxuICAgIHBvc2l0aW9uOiAwLFxyXG59O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgeyBsZW5ndGgsIGNsc05hbWUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRyYWNrU3R5bGVzID0ge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXHJcbiAgICAgICAgICAgIGdldCB3aWR0aCgpIHsgcmV0dXJuICFsZW5ndGggPyAnMCUnIDogYCR7bGVuZ3RofSVgO30sXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICBib3R0b206IDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codHJhY2tTdHlsZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2ICBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7Y2xzTmFtZX0tdHJhY2tgfSBcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt0cmFja1N0eWxlc30gXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuVHJhY2sucHJvcFR5cGVzID0ge1xyXG4gICAgY2xzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgbGVuZ3RoOiBQcm9wVHlwZXMubnVtYmVyLFxyXG59O1xyXG5cclxuVHJhY2suZGVmYXVsdFByb3BzID0ge1xyXG4gICAgY2xzTmFtZTogJ2R5bmFtaWMtc2xpZGVyJ1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LWRvbVwiKTsiXSwic291cmNlUm9vdCI6IiJ9