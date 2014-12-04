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
		window.onYouTubePlayerReady = Video.f_onYouTubePlayerReady;
	};

	Video.f_onYouTubePlayerReady = function(playerId) {
		console.log(playerId);
	};

	Video.setPlayerId = function(instance) {
		var count = this._idCount || 1;
		instance.playerId = 'gpyoutube-' + count;
		this._idCount = count + 1;
	};

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

		$el.append($embed);
	};

	__vp._getVideoUrl = function() {
		var url = 'http://www.youtube.com/v/' + this.id +
			'?version=3&enablejsapi=1&playerapiid=' + this.playerId;
		return url;
	};

	// ----------------------------------------------------------------

	return {
		Playlist: Playlist,
		Video: Video
	};
})();
