import sailsIO from 'sails.io.js'
import socketIO from 'socket.io-client'

export default {
	install(Vue, connection) {

		var _this

		const io     = sailsIO(socketIO)
		io.sails.url = connection

		Vue.prototype.$sails = io
		Vue.prototype.$sails.listeners = []

		Vue.prototype.$sails.addListener = function (socket, mutation) {
			
			_this.$sails.listeners.push(socket)
			
			io.socket.on(socket, (data) => {
				_this.$store.commit(mutation.toUpperCase(), data)
			})
		}

		Vue.prototype.$sails.removeListener = function (socket) {
			
			let s = _this.$sails.listeners.indexOf(socket);
			
			if(s != -1) {
				_this.$sails.listeners.splice(s, 1);
			}
			
			io.socket.off(socket)
		}

		Vue.prototype.$sails.hasListener = function (socket) {
			
			for (let listener of _this.$sails.listeners) {
				if (listener === socket) return true
			}
			
			return false
		}

		Vue.mixin({
			created() {
				
				_this 	  = this
				let sails = this.$options.sails

				for (let socket in sails) {
					
					let details = sails[socket]
					
					let method
					let url       = '/' + socket
					let mutation  = socket
					
					for (let prop in details) {
						if (prop == 'method') 	method   = details[prop]
						if (prop == 'url') 	url 	 = details[prop]
						if (prop == 'mutation') mutation = details[prop]
					}

					_this[socket] = (data) => {
						io.socket[method](url, data, (body, JWR) => {
							_this.$store.commit(mutation.toUpperCase(), body)
						})
					}

					if (mutation && ! _this.$sails.hasListener(socket)) {
						_this.$sails.addListener(socket, mutation)
					}
				}
			},
			beforeDestroy() {
				
				_this 	  = this
				let sails = this.$options.sails

				for (let socket in sails) {

					let details = sails[socket]
					let remove  = true

					for (let prop in details) {
						if (prop == 'remove') 	remove   = details[prop]
					}

					delete _this[socket]

					if (remove) _this.$sails.removeListener(socket)
				}
			}
		})
	}
}
