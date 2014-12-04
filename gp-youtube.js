var GpYoutube = (function() {
	function Playlist(options) {
		if (this instanceof Playlist) {
			return this.initialize(options);
		}
		else {
			return new Playlist(options);
		}
	}

	var __p = Playlist.prototype;

	/**
	 * Called in constructor.
	 * @param {Object} options
	 */
	__p.initialize = function(options) {
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
	__p.fetch = function(callback) {
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
	__p._getFetchUrl = function() {
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
	__p._resetData = function(data) {
		var items = this.items = data.items;
		this.length = items.length;
		this.forEach(this._resetOneData.bind(this, items));
	};

	__p._resetOneData = function(items, __empty__, index) {
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
	__p.forEach = function(iterator) {
		for (var i=0, l=this.length; i<l; i++) {
			iterator.call(this, this[i], i);
		}
		return this;
	};

	return {
		Playlist: Playlist
	};
})();
