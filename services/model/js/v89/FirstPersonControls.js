(function() {

	'use strict';

	module.exports = function(THREE) {

		/**
		 * @author mrdoob / http://mrdoob.com/
		 * @author alteredq / http://alteredqualia.com/
		 * @author paulirish / http://paulirish.com/
		 */

		THREE.FirstPersonControls = function(object, domElement) {

			var scope = this;

			this.object = object;
			this.target = new THREE.Vector3(0, 0, 0);

			this.domElement = (domElement !== undefined) ? domElement : document;

			this.enabled = true;

			this.movementSpeed = 1.0;
			this.lookSpeed = 0.005;

			this.lookVertical = true;
			this.autoForward = false;

			this.activeLook = true;

			this.heightSpeed = false;
			this.heightCoef = 1.0;
			this.heightMin = 0.0;
			this.heightMax = 1.0;

			this.constrainVertical = false;
			this.verticalMin = 0;
			this.verticalMax = Math.PI;

			this.autoSpeedFactor = 0.0;

			this.mouseX = 0;
			this.mouseY = 0;

			this.lat = 0;
			this.lon = 0;
			this.phi = 0;
			this.theta = 0;

			this.moveForward = false;
			this.moveBackward = false;
			this.moveLeft = false;
			this.moveRight = false;

			this.mouseDragOn = false;

			this.viewHalfX = 0;
			this.viewHalfY = 0;

			if (this.domElement !== document) {

				this.domElement.setAttribute('tabindex', -1);

			}


			// Internals

			var changeEvent = {
				type: 'change'
			};

			var idleEvent = {
				type: 'idle'
			};

			var startEvent = {
				type: 'start'
			};

			var endEvent = {
				type: 'end'
			};

			var idle = true;

			this.checkInterval = setInterval(function() {

				if (!scope.freeze &&
					(
						(scope.mouseX !== 0 && scope.mouseY !== 0) ||
						scope.moveForward || scope.moveLeft || scope.moveBackward || scope.moveRight || scope.moveUp || scope.moveDown
					)
				) {


					if (idle) {
						idle = false;
						scope.dispatchEvent(startEvent);
					}

					scope.dispatchEvent(changeEvent);

				} else {

					if (!idle) {
						idle = true;
						scope.dispatchEvent(endEvent);
					}

					scope.dispatchEvent(idleEvent);

				}

			}, 33);


			//

			this.handleResize = function() {

				if (this.domElement === document) {

					this.viewHalfX = window.innerWidth / 2;
					this.viewHalfY = window.innerHeight / 2;

				} else {

					this.viewHalfX = this.domElement.offsetWidth / 2;
					this.viewHalfY = this.domElement.offsetHeight / 2;

				}

			};

			this.onMouseMove = function(event) {

				if (this.domElement === document) {

					this.mouseX = event.pageX - this.viewHalfX;
					this.mouseY = event.pageY - this.viewHalfY;

				} else {

					var clientRect = this.domElement.getBoundingClientRect();

					this.mouseX = event.pageX - clientRect.left - this.viewHalfX;
					this.mouseY = event.pageY - clientRect.top - this.viewHalfY;

				}

			};

			this.onMouseLeave = function(event) {
				this.mouseX = 0;
				this.mouseY = 0;
			};

			this.onKeyDown = function(event) {

				if (event.shiftKey) {
					this.runMode = true;
				} else {
					this.runMode = false;
				}

				//event.preventDefault();

				switch (event.keyCode) {

					case 38:
						/*up*/
					case 87:
						/*W*/
						this.moveForward = true;
						break;

					case 37:
						/*left*/
					case 65:
						/*A*/
						this.moveLeft = true;
						break;

					case 40:
						/*down*/
					case 83:
						/*S*/
						this.moveBackward = true;
						break;

					case 39:
						/*right*/
					case 68:
						/*D*/
						this.moveRight = true;
						break;

					case 32:
						/*Space*/
						this.moveUp = true;
						break;
					case 67:
						/*C*/
						this.moveDown = true;
						break;
					case 70:
						/*F*/
						if (!this.freeze) {
							this.freeze = true;
							scope.dispatchEvent(endEvent);
						}
				}

			};

			this.onKeyUp = function(event) {

				switch (event.keyCode) {

					case 38:
						/*up*/
					case 87:
						/*W*/
						this.moveForward = false;
						break;

					case 37:
						/*left*/
					case 65:
						/*A*/
						this.moveLeft = false;
						break;

					case 40:
						/*down*/
					case 83:
						/*S*/
						this.moveBackward = false;
						break;

					case 39:
						/*right*/
					case 68:
						/*D*/
						this.moveRight = false;
						break;

					case 32:
						/*Space*/
						this.moveUp = false;
						break;
					case 67:
						/*C*/
						this.moveDown = false;
						break;
					case 70:
						/*F*/
						this.freeze = false;
						scope.dispatchEvent(startEvent);

				}

			};

			this.update = function(delta) {

				if (this.enabled === false) return;
				if (this.freeze === true) return;

				if (this.heightSpeed) {

					var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
					var heightDelta = y - this.heightMin;

					this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

				} else {

					this.autoSpeedFactor = 0.0;

				}

				var movementSpeed = this.movementSpeed;

				if (this.runMode) {
					movementSpeed *= 2;
				}

				var actualMoveSpeed = delta * movementSpeed;

				if (this.moveForward || (this.autoForward && !this.moveBackward)) {
					this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
				}

				if (this.moveBackward) {
					this.object.translateZ(actualMoveSpeed);
				}

				if (this.moveLeft) {
					this.object.translateX(-actualMoveSpeed);
				}

				if (this.moveRight) {
					this.object.translateX(actualMoveSpeed);
				}

				if (this.moveUp) {
					this.object.translateY(actualMoveSpeed);
				}

				if (this.moveDown) {
					this.object.translateY(-actualMoveSpeed);
				}

				var actualLookSpeed = delta * this.lookSpeed;

				if (!this.activeLook) {
					actualLookSpeed = 0;
				}

				var verticalLookRatio = 1;

				if (this.constrainVertical) {

					verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

				}

				this.lon += this.mouseX * actualLookSpeed;
				if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

				this.lat = Math.max(-85, Math.min(85, this.lat));
				this.phi = THREE.Math.degToRad(90 - this.lat);

				this.theta = THREE.Math.degToRad(this.lon);

				if (this.constrainVertical) {

					this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);

				}

				var targetPosition = this.target;
				var position = this.object.position;

				targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
				targetPosition.y = position.y + 100 * Math.cos(this.phi);
				targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

				this.object.lookAt(targetPosition);

			};

			function contextmenu(event) {

				event.preventDefault();

			}

			this.dispose = function() {

				clearInterval(this.checkInterval);

				this.domElement.removeEventListener('contextmenu', contextmenu, false);
				this.domElement.removeEventListener('mousemove', _onMouseMove, false);
				this.domElement.removeEventListener('mouseleave', _onMouseLeave, false);

				window.removeEventListener('keydown', _onKeyDown, false);
				window.removeEventListener('keyup', _onKeyUp, false);

			};

			this.lookAt = function(pos) {
				// var camPos = owl.deepCopy(this.object.position);
				var camPos = Object.assign({}, this.object.position);
				var ver = new THREE.Vector3(pos.x, pos.y, pos.z);
				ver = ver.sub(ver, camPos);

				var r = this.getRadius(ver);
				var p = 100;

				var tmpGeo = this.getGeoCords(ver, r);
				var tmpSpherical = this.getSpherical(tmpGeo[0], tmpGeo[1]);
				var targetPosition = this.getCartesian(tmpSpherical[0], tmpSpherical[1], r);
				targetPosition = new THREE.Vector3(0, 0, 0).add(targetPosition, camPos);

				this.lon = tmpGeo[0];
				this.lat = tmpGeo[1];

				this.object.lookAt(targetPosition);
				this.ext_update = true;

			};

			this.getRadius = function(pos) {
				var r = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2) + Math.pow(pos.z, 2));
				return r;
			};


			this.getGeoCords = function(pos, r) {
				var lon = -1 * ((90 + (Math.atan2(pos.x, pos.z)) * 180 / Math.PI) % 360) - 180;
				var lat = 90 - (Math.acos(pos.y / r)) * 180 / Math.PI;

				return [lon, lat];
			};

			this.getSpherical = function(lon, lat) {
				var theta = lon * Math.PI / 180;
				var phi = (90 - lat) * Math.PI / 180;
				return [phi, theta];
			};

			this.getCartesian = function(phi, theta, p) {
				var targetPosition = new THREE.Vector3(0, 0, 0);
				targetPosition.x = p * Math.sin(phi) * Math.cos(theta);
				targetPosition.y = p * Math.cos(phi);
				targetPosition.z = p * Math.sin(phi) * Math.sin(theta);
				return targetPosition;
			};

			var _onMouseMove = bind(this, this.onMouseMove);
			var _onMouseLeave = bind(this, this.onMouseLeave);
			var _onKeyDown = bind(this, this.onKeyDown);
			var _onKeyUp = bind(this, this.onKeyUp);

			this.domElement.addEventListener('contextmenu', contextmenu, false);
			this.domElement.addEventListener('mousemove', _onMouseMove, false);
			this.domElement.addEventListener('mouseleave', _onMouseLeave, false);

			window.addEventListener('keydown', _onKeyDown, false);
			window.addEventListener('keyup', _onKeyUp, false);

			function bind(scope, fn) {

				return function() {

					fn.apply(scope, arguments);

				};

			}

			this.handleResize();

		};



		THREE.FirstPersonControls.prototype = Object.create(THREE.EventDispatcher.prototype);
		THREE.FirstPersonControls.prototype.constructor = THREE.FirstPersonControls;

	};

})();