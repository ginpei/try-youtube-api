var GpYoutube = (function() {
	function Playlist(options) {
		if (this instanceof Playlist) {
			return this.initialize(options);
		}
		else {
			return new Playlist(options);
		}
	}

	var __pp = Playlist.prototype;

	/**
	 * Called in constructor.
	 * @param {Object} options
	 */
	__pp.initialize = function(options) {
		this.appKey = options.appKey;
		this.id = options.id;

		if (!this.appKey) {
			throw new Error('appKey is required.\nex: new Playlist({ appKey:"XXX" })');
		}

		return this;
	};

	/**
	 * Fetch playlist items.
	 */
	__pp.fetch = function(callback) {
		var url = this._getFetchUrl();
		return $.getJSON(url, function(data, status, xhr) {
			this._resetData(data);
			this.fetched = true;
		}.bind(this));
	};

	/**
	 * Return the URL to be used to fetch playlist data.
	 * @returns {string}
	 */
	__pp._getFetchUrl = function() {
		var url = 'https://www.googleapis.com/youtube/v3/playlistItems' +
			'?key=' + this.appKey +
			'&maxResults=50' +
			'&part=id,snippet,contentDetails,status' +
			'&callback=?' +
			'&playlistId=' + this.id;
		return url;
	};

	/**
	 * Reset playlist items data.
	 * @param {Object} data
	 */
	__pp._resetData = function(data) {
		var items = this.items = data.items;
		this.length = items.length;
		this.forEach(this._resetOneData.bind(this, items));
	};

	__pp._resetOneData = function(items, __empty__, index) {
		var item = items[index];
		var snippet = item.snippet;
		this[index] = {
			id: item.contentDetails.videoId,
			privacyStatus: item.status.privacyStatus,
			title: snippet.title,
			description: snippet.description,
			publishedAt: snippet.publishedAt,
			thumbnails: snippet.thumbnails
		};
	};

	/**
	 * Run iterator for each items.
	 * @param {Function} iterator
	 */
	__pp.forEach = function(iterator) {
		for (var i=0, l=this.length; i<l; i++) {
			iterator.call(this, this[i], i);
		}
		return this;
	};

	// ----------------------------------------------------------------

	function Video(options) {
		if (this instanceof Video) {
			Video.initializeHandler();
			return this.initialize(options);
		}
		else {
			return new Video(options);
		}
	}

	Video.initializeHandler = function() {
		if (window.onYouTubePlayerReady && window.onYouTubePlayerReady !== Video.f_onYouTubePlayerReady) {
			throw new Error('YouTube event handler is already set.');
		}
		window.onYouTubePlayerReady = Video.f_onYouTubePlayerReady.bind(Video);
	};

	Video.f_onYouTubePlayerReady = function(playerId) {
		var instance = this._instances[playerId];
		if (instance) {
			instance.onplayerready();
		}
	};

	Video.setPlayerId = function(instance) {
		var count = this._idCount || 1;
		var id = instance.playerId = 'gpyoutube-' + count;
		this._idCount = count + 1;
		this._instances[id] = instance;
	};

	Video._instances = {};

	var __vp = Video.prototype;

	/**
	 * Called in constructor.
	 * @param {Object} options
	 */
	__vp.initialize = function(options) {
		Video.setPlayerId(this);
		this.id = options.id;
	};

	__vp.renderInto = function($el) {
		var url = this._getVideoUrl();

		var $embed = $('<embed>', {
			allowScriptAccess: 'always',
			height: 315,
			name: 'plugin',
			src: url,
			type: 'application/x-shockwave-flash',
			width: 420
		});
		this.$embed = $embed;
		this.elEmbed = $embed[0];

		$el.append($embed);
	};

	__vp._getVideoUrl = function() {
		var url = 'http://www.youtube.com/v/' + this.id +
			'?version=3&enablejsapi=1&playerapiid=' + this.playerId;
		return url;
	};

	__vp.play = function() {
		this.elEmbed.playVideo();
	};

	__vp.pause = function() {
		this.elEmbed.pauseVideo();
	};

	__vp.stop = function() {
		this.elEmbed.stopVideo();
	};

	__vp.mute = function() {
		this.elEmbed.mute();
	};

	__vp.unmute = function() {
		this.elEmbed.unMute();
	};

	__vp.getCurrentTime = function() {
		return this.elEmbed.getCurrentTime();
	};

	__vp.updateTime = function() {
		var currentTime = this.getCurrentTime();
		var currentTimeText =
			parseInt(currentTime/60, 10) +
			':' +
			('0' + parseInt(currentTime%60, 10)).slice(-2);
		$('.js-current-time').text(currentTimeText);

		var duration = this.getDuration();
		var durationText =
			parseInt(duration/60, 10) +
			':' +
			('0' + parseInt(duration%60, 10)).slice(-2);
		$('.js-duration').text(durationText);
	};

	__vp.getCurrentTime = function() {
		return this.elEmbed.getCurrentTime();
	};

	__vp.getDuration = function() {
		return this.elEmbed.getDuration();
	};

	__vp.on = function(type, callback) {
		var callbackName = (this.playerId + '-' + type).replace(/-/g, '_');
		window[callbackName] = callback;
		this.elEmbed.addEventListener(type, callbackName);
	};

	__vp.onplayerready = function() {
		$('.js-video-controll-button').attr('disabled', false);
		setInterval(this.updateTime.bind(this), 250);
		this.on('onStateChange', this.onstatechange.bind(this));
	};

	__vp.onstatechange = function(state) {
		console.log(':statechange', state);
	};

	// ----------------------------------------------------------------

	return {
		Playlist: Playlist,
		Video: Video
	};
})();
