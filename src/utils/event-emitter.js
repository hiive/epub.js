/**
 * Drop-in replacement for the 'event-emitter' npm package.
 * Uses Node's built-in EventEmitter (polyfilled by Vite for browsers)
 * but provides the same mixin API: EventEmitter(prototype).
 *
 * This eliminates the es5-ext dependency (CVE false-positive risk)
 * without changing how epub.js classes are structured.
 */
import { EventEmitter as NodeEventEmitter } from "events";

/**
 * Mixin function — adds on/off/once/emit to a prototype.
 * Compatible with the event-emitter package's API.
 */
export default function eventEmitterMixin(proto) {
	const ee = NodeEventEmitter.prototype;

	proto.on = function(event, listener) {
		if (!this.__ee__) this.__ee__ = new NodeEventEmitter();
		this.__ee__.on(event, listener);
		return this;
	};

	proto.off = function(event, listener) {
		if (!this.__ee__) return this;
		this.__ee__.off(event, listener);
		return this;
	};

	proto.once = function(event, listener) {
		if (!this.__ee__) this.__ee__ = new NodeEventEmitter();
		this.__ee__.once(event, listener);
		return this;
	};

	proto.emit = function(event, ...args) {
		if (!this.__ee__) return;
		this.__ee__.emit(event, ...args);
	};

	// event-emitter also supports 'allOff' to remove all listeners
	proto.allOff = function(event) {
		if (!this.__ee__) return;
		if (event) {
			this.__ee__.removeAllListeners(event);
		} else {
			this.__ee__.removeAllListeners();
		}
	};

	return proto;
}
