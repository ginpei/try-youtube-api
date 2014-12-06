YouTube = (function() {
	function YouTube(options) {
		if (this instanceof YouTube) {
			return this.initialize(options);
		}
		else {
			return new YouTube(options);
		}
	}

	$.extend(YouTube, {
		_idCount: 1,
		_instances: {},

		makeUp: function(instance) {
			var id = 'youtube_' + this._idCount;
			this._idCount++;
			instance.playerId = id;
			this._instances[id] = instance;

			if (!window.onYouTubePlayerReady) {
				this.f_onYouTubePlayerReady = this.f_onYouTubePlayerReady.bind(this);
				window.onYouTubePlayerReady = this.f_onYouTubePlayerReady;
			}
			else if (window.onYouTubePlayerReady !== YouTube.f_onYouTubePlayerReady) {
				throw new Error('There is another YouTube player.');
			}
		},

		f_onYouTubePlayerReady: function(id) {
			var instance = this._instances[id];
			if (instance) {
				instance.onplayerready();
			}

			// TODO: outsource
			$('.js-video-control').attr('disabled', false);
			setInterval(function() {
				try {
					var currentTime = instance.getCurrentTime();
					var duration = instance.getDuration();

					var currentTimeText =
						parseInt(currentTime/60, 10) +
						':' +
						('0' + parseInt(currentTime%60, 10)).slice(-2);
					$('.js-current-time').text(currentTimeText);

					var durationText =
						parseInt(duration/60, 10) +
						':' +
						('0' + parseInt(duration%60, 10)).slice(-2);
					$('.js-duration').text(durationText);
				}
				catch (error) {
					// ignore
				}
			}.bind(this), 200);
		}
	});

	$.extend(YouTube.prototype, {
		defaults: {
			height: 315,
			width: 420
		},

		initialize: function(options) {
			if (!options) {
				throw new Error('`options` is required.');
			}
			if (!options.$el) {
				throw new Error('`options.$el` is required.');
			}

			YouTube.makeUp(this);

			var $embed = this.$embed = this._createEmbed(options);
			this.elEmbed = $embed[0];

			options.$el
				.empty()
				.append($embed);
		},

		_createEmbed: function(options) {
			var defaults = this.defaults;

			var $embed = $('<embed>', {
				allowScriptAccess: 'always',
				height: options.height || defaults.height,
				name: 'plugin',
				src: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=' + this.playerId,
				type: 'application/x-shockwave-flash',
				width: options.width || defaults.width
			});

			return $embed;
		},

		open: function(options) {
			if (!options) {
				throw new Error('`options` are required.');
			}

			if (this.playerReady) {
				this.id = options.id;
				this.elEmbed.loadVideoById({
					videoId: options.id
				});
			}
			else {
				this._afterPlayerReady = function() {
					this.open(options);
				};
			}
		},

		play: function() {
			this.elEmbed.playVideo();
		},

		pause: function() {
			this.elEmbed.pauseVideo();
		},

		mute: function(flag) {
			if (flag || arguments.length < 1) {
				this.elEmbed.mute();
			}
			else {
				this.elEmbed.unMute();
			}
		},

		getCurrentTime: function() {
			return this.elEmbed.getCurrentTime();
		},

		getDuration: function() {
			return this.elEmbed.getDuration();
		},

		onplayerready: function() {
			this.playerReady = true;

			if (this._afterPlayerReady) {
				this._afterPlayerReady();
			}
		}
	});

	// ----------------------------------------------------------------

	function Playlist(options) {
		if (this instanceof Playlist) {
			return this.initialize(options);
		}
		else {
			return new Playlist(options);
		}
	}

	// ----------------------------------------------------------------

	YouTube.Playlist = Playlist;

	return YouTube;
})();
